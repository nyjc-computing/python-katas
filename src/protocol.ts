// Message protocol between the main thread and the Pyodide worker.
// The analyze/complete/hover round-trips are the seam for the future
// code-introspection LSP (pyflakes/jedi in the same worker); they are stubbed
// on the worker side for now.

export const STDIN_MAX_BYTES = 8192
export const STDIN_HEADER_INTS = 2 // [0] = state, [1] = payload byte length

export const STDIN_STATE = {
  idle: 0,
  ready: 1, // main thread wrote a line into the payload
  cancel: 2, // main thread wants the blocked read to abort (Stop pressed)
} as const

export interface Diagnostic {
  from: number
  to: number
  severity: 'error' | 'warning'
  message: string
}

export type ToWorker =
  | { type: 'run'; code: string }
  | { type: 'analyze'; code: string; version: number }
  | { type: 'complete'; code: string; line: number; col: number; version: number }
  | { type: 'hover'; code: string; line: number; col: number; version: number }

export type FromWorker =
  | {
      type: 'ready'
      crossIsolated: boolean
      buffers?: { interrupt: ArrayBufferLike; stdin: ArrayBufferLike }
    }
  | { type: 'stdout'; bytes: ArrayBufferLike }
  | { type: 'stderr'; bytes: ArrayBufferLike }
  | { type: 'input-request' }
  | { type: 'run-finished'; exitCode: number; interrupted: boolean }
  | { type: 'analysis'; version: number; diagnostics: Diagnostic[] }
  | { type: 'completions'; version: number; items: string[] }
  | { type: 'hover-info'; version: number; text: string | null }
