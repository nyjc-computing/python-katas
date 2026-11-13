// The kata corpus and the learner's per-kata state.
//
// Corpus snapshots: build/katas.json is bundled at build time (the sync
// script digests it), but the app runs against a localStorage SNAPSHOT taken
// on the first visit. Deployments that change the corpus never move it under
// the learner mid-practice; loadCorpus() reports the pending update and a
// banner offers the refresh. Accepting re-snapshots to the bundled corpus
// and migrates attempt state to the new ids (matched by title slug, since
// kata numbers renumber as the corpus evolves).

import raw from '../../build/katas.json'

export interface KataTest {
  /** Console input fed to the program before checking. */
  stdin: string
  /** Exact expected stdout for a passing attempt. */
  stdout: string
}

export interface Kata {
  /** Stable slug (`001-square-of-a-number`) — the key for progress, display
   * numbers (`n`) may shift when katas are inserted. */
  id: string
  /** Display order, from the `### N.` heading. */
  n: number
  title: string
  /** Section id (`s07`), see {@link Section}. */
  section: string
  /** What the kata practises, parsed from the **Features:** line. */
  features: string[]
  /** Question markdown; sample I/O is fenced inline. */
  question: string
  /** Progressive-reveal hints; empty when the source has none. */
  hints: string[]
  /** Optional editor prefill; null until authored per kata. */
  starter: string | null
  /** stdin/stdout pairs for auto-checking; null when not derivable
   * (input()-reading, random/timeit, no-output katas). Reference solutions
   * are NOT shipped — they live only in the markdown. */
  tests: KataTest[] | null
}

export interface Section {
  id: string
  n: number
  title: string
  part: string
}

export interface Part {
  id: string
  title: string
  sections: string[]
}

export interface KataCorpus {
  version: number
  /** Content digest over the shipped corpus — the snapshot-update signal. */
  digest: string
  source: string
  parts: Part[]
  sections: Section[]
  katas: Kata[]
}

/** Learner state for one kata (telemetry seeds live here too). */
export interface AttemptState {
  code: string
  verified: boolean
  /** Every Run counts one; Verify counts one per click. Not reported yet. */
  tries: number
}

const CORPUS_KEY = 'kata.corpus'
const SEEN_KEY = 'kata.corpusSeen'
const ATTEMPTS_KEY = 'kata.attempts'
const ACTIVE_KEY = 'kata.activeKata'

const BUNDLED = raw as KataCorpus

const titleSlug = (id: string): string => id.replace(/^\d+-/, '')

function readStoredCorpus(): KataCorpus | null {
  try {
    const parsed = JSON.parse(localStorage.getItem(CORPUS_KEY) ?? 'null') as KataCorpus | null
    return parsed && parsed.version === BUNDLED.version && Array.isArray(parsed.katas) ? parsed : null
  } catch {
    return null
  }
}

function readAttempts(): Record<string, AttemptState> {
  try {
    const parsed = JSON.parse(localStorage.getItem(ATTEMPTS_KEY) ?? '{}') as Record<string, AttemptState>
    return parsed && typeof parsed === 'object' ? parsed : {}
  } catch {
    return {}
  }
}

function writeAttempts(attempts: Record<string, AttemptState>): void {
  localStorage.setItem(ATTEMPTS_KEY, JSON.stringify(attempts))
}

export interface CorpusUpdate {
  added: number
  removed: number
  updated: number
}

/** Added/removed/changed counts between two corpora, matched by title slug
 * (ids renumber; titles are the stable identity across a refresh). */
function diffCorpora(stored: KataCorpus, bundled: KataCorpus): CorpusUpdate {
  const index = (corpus: KataCorpus): Map<string, Kata> => {
    const map = new Map<string, Kata>()
    for (const kata of corpus.katas) map.set(titleSlug(kata.id), kata)
    return map
  }
  const storedBySlug = index(stored)
  const bundledBySlug = index(bundled)
  let added = 0
  let removed = 0
  let updated = 0
  for (const [slug, kata] of bundledBySlug) {
    const was = storedBySlug.get(slug)
    if (!was) added++
    else if (JSON.stringify(was) !== JSON.stringify(kata)) updated++
  }
  for (const slug of storedBySlug.keys()) if (!bundledBySlug.has(slug)) removed++
  return { added, removed, updated }
}

export interface LoadedCorpus {
  corpus: KataCorpus
  /** Non-null when the bundled corpus differs from the snapshot and the
   * user hasn't dismissed this digest yet. */
  update: CorpusUpdate | null
}

let current: KataCorpus = BUNDLED

/** Snapshot the bundled corpus on first visit; afterwards serve the snapshot
 * and report how the bundled corpus has moved ahead of it. */
export function loadCorpus(): LoadedCorpus {
  const stored = readStoredCorpus()
  if (!stored) {
    localStorage.setItem(CORPUS_KEY, JSON.stringify(BUNDLED))
    localStorage.setItem(SEEN_KEY, BUNDLED.digest)
    current = BUNDLED
    return { corpus: BUNDLED, update: null }
  }
  current = stored
  const stale = stored.digest !== BUNDLED.digest
  const dismissed = localStorage.getItem(SEEN_KEY) === BUNDLED.digest
  return { corpus: stored, update: stale && !dismissed ? diffCorpora(stored, BUNDLED) : null }
}

/** Accept the update: re-snapshot to the bundled corpus and migrate attempt
 * state (verified flags, code, tries) and the active kata across renumbered
 * ids by title slug. Returns the migrated active kata id, if any. */
export function refreshCorpus(): string | null {
  const bySlug = new Map(BUNDLED.katas.map((k) => [titleSlug(k.id), k.id]))
  const migrated: Record<string, AttemptState> = {}
  for (const [id, state] of Object.entries(readAttempts())) {
    const target = bySlug.get(titleSlug(id))
    if (target) migrated[target] = state
  }
  writeAttempts(migrated)
  localStorage.setItem(CORPUS_KEY, JSON.stringify(BUNDLED))
  localStorage.setItem(SEEN_KEY, BUNDLED.digest)
  current = BUNDLED
  const active = localStorage.getItem(ACTIVE_KEY)
  if (!active) return null
  const migratedActive = bySlug.get(titleSlug(active)) ?? null
  setActiveKata(migratedActive)
  return migratedActive
}

/** Keep the current snapshot; stop nagging about this digest. */
export function dismissCorpusUpdate(): void {
  localStorage.setItem(SEEN_KEY, BUNDLED.digest)
}

export function activeKataId(): string | null {
  return localStorage.getItem(ACTIVE_KEY) || null
}

export function setActiveKata(id: string | null): void {
  if (id === null) localStorage.removeItem(ACTIVE_KEY)
  else localStorage.setItem(ACTIVE_KEY, id)
}

export function getKatas(): Kata[] {
  return current.katas
}

export function getParts(): Part[] {
  return current.parts
}

export function getSections(): Section[] {
  return current.sections
}

export function kataById(id: string): Kata | undefined {
  return current.katas.find((k) => k.id === id)
}

export function getAttempt(id: string): AttemptState {
  return readAttempts()[id] ?? { code: '', verified: false, tries: 0 }
}

export function isVerified(id: string): boolean {
  return readAttempts()[id]?.verified ?? false
}

export function verifiedCount(): number {
  return Object.values(readAttempts()).filter((a) => a.verified).length
}

export function saveAttemptCode(id: string, code: string): void {
  const attempts = readAttempts()
  attempts[id] = { ...(attempts[id] ?? { verified: false, tries: 0 }), code }
  writeAttempts(attempts)
}

export function markVerified(id: string, verified: boolean): void {
  const attempts = readAttempts()
  const prev = attempts[id] ?? { code: '', verified: false, tries: 0 }
  attempts[id] = { ...prev, verified }
  writeAttempts(attempts)
}

export function bumpTries(id: string): void {
  const attempts = readAttempts()
  const prev = attempts[id] ?? { code: '', verified: false, tries: 0 }
  attempts[id] = { ...prev, tries: prev.tries + 1 }
  writeAttempts(attempts)
}
