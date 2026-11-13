#!/usr/bin/env node
// Parses ../../python-katas-by-feature.md into ../../build/katas.json, which
// the app bundles as its kata corpus. This script is deliberately strict: the
// format contract lives in ../../MARKDOWN-FORMAT.md, and CI fails the merge
// when the markdown drifts out of it (or when build/katas.json is stale).
//
// Solutions that run cleanly and deterministically under `python3` are
// executed here to derive the auto-check tests ({stdin, stdout} pairs);
// input()-reading and non-deterministic solutions get `tests: null`.

import { spawnSync } from 'node:child_process'
import { createHash } from 'node:crypto'
import { mkdtempSync, readFileSync, rmSync, writeFileSync, mkdirSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { dirname, join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '../..')
const MD_PATH = join(ROOT, 'python-katas-by-feature.md')
const OUT_PATH = join(ROOT, 'build', 'katas.json')
const RUN_TIMEOUT_MS = 10_000

class FormatError extends Error {}

const fail = (context, rule) => {
  throw new FormatError(`${context}: ${rule}\n  (format contract: MARKDOWN-FORMAT.md)`)
}

// ---------------------------------------------------------------------------
// Parsing

const RE_PART = /^# Part ([A-Z]) — (.+)$/
const RE_SECTION = /^## (\d+)\. (.+)$/
const RE_KATA = /^### (\d+)\. (.+)$/
const RE_ORIGIN_SUFFIX = /\s\*\((?:original )?Question[^)]*\)\*$/i
const LABELS = ['**Features:**', '**Question:**', '**Hints:**', '**Solution:**']
const keyOf = label => label.replaceAll('*', '').replaceAll(':', '')

function parse(markdown) {
  const lines = markdown.split('\n')
  const manifest = { version: 1, source: 'python-katas-by-feature.md', parts: [], sections: [], katas: [] }

  let part = null
  let section = null
  let kata = null
  // kata body collected as labeled sections until the next heading
  let currentLabel = null
  let currentKey = 'prose'
  let body = { prose: [], Features: [], Question: [], Hints: [], Solution: [] }
  let seenLabels = []
  let inFence = false

  const flushKata = () => {
    if (!kata) return
    if (inFence) fail(`kata ${kata.n} (${kata.title})`, 'unclosed code fence')
    manifest.katas.push(buildKata(kata, body, seenLabels))
    kata = null
    currentLabel = null
    body = { prose: [], Features: [], Question: [], Hints: [], Solution: [] }
    seenLabels = []
    currentKey = 'prose'
  }

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i]
    const where = kata ? `kata ${kata.n} (${kata.title})` : 'document'

    const partMatch = line.match(RE_PART)
    const sectionMatch = line.match(RE_SECTION)
    const kataMatch = line.match(RE_KATA)
    const isHeading = /^#{1,3} /.test(line)

    if (partMatch || sectionMatch || kataMatch) {
      flushKata()
      inFence = false
      if (partMatch) {
        const expected = String.fromCharCode(65 + manifest.parts.length)
        if (partMatch[1] !== expected) fail(`part "${partMatch[2]}"`, `expected Part ${expected} (parts must be A, B, C, … in order)`)
        part = { id: partMatch[1], title: partMatch[2].trim(), sections: [] }
        manifest.parts.push(part)
        section = null
      } else if (sectionMatch) {
        if (!part) fail(`section "${sectionMatch[2]}"`, 'section appears before any # Part heading')
        const n = Number(sectionMatch[1])
        const expected = manifest.sections.length + 1
        if (n !== expected) fail(`section ${n}`, `sections must be numbered sequentially; expected ${expected}`)
        section = { id: `s${String(n).padStart(2, '0')}`, n, title: sectionMatch[2].trim(), part: part.id }
        manifest.sections.push(section)
        part.sections.push(section.id)
      } else {
        if (!section) fail(`kata "${kataMatch[2]}"`, 'kata appears before any ## section heading')
        const n = Number(kataMatch[1])
        const expected = manifest.katas.length + 1
        if (n !== expected) fail(`kata ${n}`, `kata headings must be numbered sequentially; expected ${expected}`)
        const title = kataMatch[2].trim()
        if (RE_ORIGIN_SUFFIX.test(title)) fail(`kata ${n}`, 'original question numbering has been removed from kata titles')
        kata = { n, title, section: section.id }
      }
      continue
    }

    if (!kata) continue // preamble, section intro prose, separators — all ignored

    const trimmed = line.trim()

    // Fence content is raw — no heading/label/feature interpretation inside
    // it. Questions may carry untagged ``` blocks for sample input/output;
    // Solutions carry exactly one tagged ```python block.
    if (inFence || trimmed.startsWith('```')) {
      if (!trimmed.startsWith('```')) {
        body[currentKey].push(line)
        continue
      }
      if (currentLabel === '**Question:**') {
        if (trimmed !== '```') fail(where, 'sample I/O fences in **Question:** must be untagged ``` blocks')
        inFence = !inFence
        body[currentKey].push('```')
        continue
      }
      if (currentLabel !== '**Solution:**') fail(where, 'code fence outside the **Question:** and **Solution:** sections')
      if (!inFence && body.Solution.some(x => typeof x !== 'string')) fail(where, 'more than one code block in **Solution:**')
      inFence = !inFence
      body[currentKey].push({ fence: trimmed })
      continue
    }

    if (isHeading) fail(where, `unexpected heading "${line}" before the kata was complete`)

    let label = null
    let inlineRest = ''
    for (const l of LABELS) {
      if (trimmed === l) { label = l; break }
      if (trimmed.startsWith(l)) {
        // **Features:** carries its content inline on the same line; the
        // other labels stand alone with content on the following lines.
        if (l !== '**Features:**') fail(where, `${l} must be on its own line, with content on the following lines`)
        label = l
        inlineRest = trimmed.slice(l.length).trim()
        break
      }
    }
    if (label) {
      if (seenLabels.includes(label)) fail(where, `duplicate label ${label}`)
      seenLabels.push(label)
      currentLabel = label
      currentKey = keyOf(label)
      if (inlineRest) body[currentKey].push(inlineRest)
      continue
    }

    // stray labels that look like the real thing but aren't
    if (/^\*\*(?:Features|Question|Hint|Hints|Solution)\*?:?\*?$/.test(trimmed)) {
      fail(where, `malformed label "${trimmed}" — labels are exactly **Features:**, **Question:**, **Hints:**, **Solution:**`)
    }

    if (inFence || (currentLabel === '**Solution:**' && body.Solution.length > 0)) {
      if (currentLabel === '**Solution:**' && !inFence) {
        if (line.trim() === '' || line.trim() === '---') { body[currentKey].push(''); continue }
        fail(where, `content after the solution code block: "${line.trim()}"`)
      }
      body[currentKey].push(line)
      continue
    }
    if (currentLabel === null) {
      if (line.trim() === '') continue
      fail(where, `prose before **Features:**: "${line.trim()}"`)
    }
    if (currentLabel !== '**Solution:**' && body[currentKey].length === 0 && line.trim() === '') continue
    body[currentKey].push(line)
  }
  flushKata()

  if (manifest.parts.length === 0) fail('document', 'no "# Part X — Title" headings found')
  if (manifest.katas.length === 0) fail('document', 'no kata headings found')
  return manifest
}

function buildKata(kata, body, seenLabels) {
  const where = `kata ${kata.n} (${kata.title})`

  if (!seenLabels.includes('**Features:**')) fail(where, 'missing **Features:**')
  if (!seenLabels.includes('**Question:**')) fail(where, 'missing **Question:**')
  if (!seenLabels.includes('**Solution:**')) fail(where, 'missing **Solution:**')
  const expectedOrder = ['**Features:**', '**Question:**', ...((seenLabels.includes('**Hints:**')) ? ['**Hints:**'] : []), '**Solution:**']
  if (seenLabels.join('|') !== expectedOrder.join('|')) fail(where, `labels out of order: ${seenLabels.join(', ')}`)

  if (body.prose.length > 0) fail(where, `unexpected prose: "${body.prose.join(' ').trim()}"`)

  const featuresRaw = body.Features.join('\n').trim()
  if (!featuresRaw) fail(where, '**Features:** is empty')

  const question = body.Question.join('\n').trim()
  if (!question) fail(where, '**Question:** is empty')

  const hintsRaw = body.Hints.join('\n').trim()
  const hints = hintsRaw ? hintsRaw.split(/\n\s*\n/).map(h => h.trim()).filter(Boolean) : []
  if (hintsRaw && hints.length === 0) fail(where, '**Hints:** has no content')

  const fenceLines = body.Solution.filter(l => typeof l !== 'string')
  if (fenceLines.length !== 2) fail(where, '**Solution:** must contain exactly one ```python code block')
  if (fenceLines[0].fence !== '```python') fail(where, `solution fence must be tagged \`python\`, got "${fenceLines[0].fence}"`)
  const solution = body.Solution.filter(l => typeof l === 'string').join('\n').replace(/^\n+/, '').replace(/\s+$/, '')
  if (!solution) fail(where, '**Solution:** code block is empty')

  return {
    id: kataId(kata.n, kata.title, where),
    n: kata.n,
    title: kata.title,
    section: kata.section,
    features: splitFeatures(featuresRaw),
    question,
    hints,
    starter: null,
    solution,
    tests: null,
  }
}

/** Split on commas that are outside backticks; backticks are styling only. */
function splitFeatures(raw) {
  const out = []
  let current = ''
  let inTicks = false
  for (const ch of raw) {
    if (ch === '`') inTicks = !inTicks
    if (ch === ',' && !inTicks) { out.push(current); current = '' } else current += ch
  }
  out.push(current)
  return out.map(f => f.trim().replaceAll('`', '')).filter(Boolean)
}

function kataId(n, title, where) {
  const slug = title
    .normalize('NFKD')
    .replaceAll(/[’‘`']/g, '')
    .replaceAll(/[^a-z0-9]+/gi, '-')
    .replaceAll(/^-+|-+$/g, '')
    .toLowerCase()
  return `${String(n).padStart(3, '0')}-${slug}`
}

// ---------------------------------------------------------------------------
// Test derivation: execute solutions that are runnable + deterministic

const SKIP_INPUT = /\binput\s*\(/
const SKIP_NONDETERMINISTIC = /\b(?:random|timeit)\b/

function deriveTests(kata) {
  if (SKIP_INPUT.test(kata.solution)) return { skipped: 'reads input() — stdin not derivable' }
  if (SKIP_NONDETERMINISTIC.test(kata.solution)) return { skipped: 'non-deterministic (random/timeit)' }

  const dir = mkdtempSync(join(tmpdir(), 'kata-'))
  try {
    writeFileSync(join(dir, 'solution.py'), kata.solution)
    const res = spawnSync('python3', ['-I', '-B', 'solution.py'], {
      cwd: dir,
      input: '',
      encoding: 'utf8',
      timeout: RUN_TIMEOUT_MS,
    })
    if (res.error) return { skipped: `could not run: ${res.error.code ?? res.error.message}` }
    if (res.status !== 0) return { skipped: `exited with ${res.status}` }
    if (res.stderr.trim()) return { skipped: 'wrote to stderr' }
    if (!res.stdout.trim()) return { skipped: 'produced no output' }
    if (/0x[0-9a-f]{4,}/i.test(res.stdout)) {
      return { skipped: 'output contains memory addresses (object repr) — not reproducible' }
    }
    return { tests: [{ stdin: '', stdout: res.stdout }] }
  } finally {
    rmSync(dir, { recursive: true, force: true })
  }
}

// ---------------------------------------------------------------------------

const markdown = readFileSync(MD_PATH, 'utf8')
let manifest
try {
  manifest = parse(markdown)
} catch (err) {
  console.error(`\n${MD_PATH} does not conform to the kata markdown format:\n`)
  console.error(err instanceof FormatError ? err.message : err)
  process.exit(1)
}

const skipped = []
let derived = 0
for (const kata of manifest.katas) {
  if (!kata.section) fail(`kata ${kata.n}`, 'not under any section')
  const result = deriveTests(kata)
  if (result.tests) {
    kata.tests = result.tests
    derived++
  } else {
    skipped.push(`${kata.n}. ${kata.title} — ${result.skipped}`)
  }
}

const seenIds = new Set()
for (const kata of manifest.katas) {
  if (seenIds.has(kata.id)) fail(`kata ${kata.n}`, `duplicate id ${kata.id} — titles must be unique`)
  seenIds.add(kata.id)
}

// The digest covers exactly what ships (solutions stripped) — the app
// snapshots the corpus on first visit and uses this hash to offer a refresh
// when a later deployment changes it.
manifest.digest = createHash('sha256')
  .update(JSON.stringify(manifest, (key, value) => (key === 'solution' ? undefined : value)))
  .digest('hex')
  .slice(0, 16)

mkdirSync(dirname(OUT_PATH), { recursive: true })
// Solutions are read from the markdown, executed for test derivation, and
// never shipped: build/katas.json is student-facing.
writeFileSync(OUT_PATH, JSON.stringify(manifest, (key, value) => (key === 'solution' ? undefined : value), 2) + '\n')

console.log(`${manifest.katas.length} katas in ${manifest.parts.length} parts / ${manifest.sections.length} sections`)
console.log(`tests derived for ${derived} katas, ${skipped.length} skipped:`)
for (const line of skipped) console.log(`  - ${line}`)
console.log(`wrote ${OUT_PATH}`)
