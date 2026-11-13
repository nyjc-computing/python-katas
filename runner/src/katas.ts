// The parsed kata corpus, generated from ../../python-katas-by-feature.md by
// scripts/sync-katas.mjs and committed as ../../build/katas.json. The format
// contract for the markdown is ../../MARKDOWN-FORMAT.md; the JSON shape below
// is what the app consumes (kata browser, per-kata workspaces, auto-checking).
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
  /** Provenance from the heading suffix, e.g. "original Question 23". */
  origin?: string
  /** What the kata practises, parsed from the **Features:** line. */
  features: string[]
  /** Verbatim question markdown; sample I/O stays inline prose. */
  question: string
  /** Progressive-reveal hints; empty when the source has none. */
  hints: string[]
  /** Optional editor prefill; null until authored per kata. */
  starter: string | null
  /** Reference solution, Python 3. */
  solution: string
  /** stdin/stdout pairs for auto-checking; null when not derivable
   * (input()-reading, random/timeit, no-output katas). */
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
  source: string
  parts: Part[]
  sections: Section[]
  katas: Kata[]
}

const corpus = raw as KataCorpus

export const katas: Kata[] = corpus.katas
export const parts: Part[] = corpus.parts
export const sections: Section[] = corpus.sections

const byId = new Map(katas.map(k => [k.id, k]))

export function kataById(id: string): Kata | undefined {
  return byId.get(id)
}
