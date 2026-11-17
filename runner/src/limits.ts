// Central bounded-performance limits. This editor+interpreter is for learners:
// anything past these bounds is curtailed silently rather than trusted to run.
// Bump a value only with a perf check against a runaway workload.

// ── editor ───────────────────────────────────────────────────────────────────
export const MAX_LINE_LEN = 100 // hard per-line width (typing blocked, pastes split)
export const MAX_EDITOR_LINES = 2000 // hard document height (typing blocked, pastes truncated)

// ── console ──────────────────────────────────────────────────────────────────
// Volume is bounded in CHARS, not lines: flood chunks render as single nodes
// holding thousands of lines, so node/line counts are meaningless there.
export const MAX_CONSOLE_CHARS = 1_000_000 // ~1 MB rendered (~10k lines of 100 chars)
export const CONSOLE_TRIM_TO_CHARS = 750_000 // trim target once the cap is hit
export const MAX_CONSOLE_NODES = 5000 // secondary guard for many tiny lines

// ── worker → main output pipeline ────────────────────────────────────────────
export const OUTPUT_FLUSH_INTERVAL_MS = 50 // time-based flush (checked per write)
export const OUTPUT_FLUSH_MAX_BYTES = 131_072 // 128 KiB emergency memory cap
export const OUTPUT_TICK_MS = 100 // main-thread render tick
export const OUTPUT_DROP_CHUNK_CHARS = 400_000 // flood backlog beyond this…
export const OUTPUT_KEEP_CHUNK_CHARS = 150_000 // …keeps only the newest part

// ── stop ─────────────────────────────────────────────────────────────────────
export const STOP_WATCHDOG_MS = 2500 // interrupt first, then force-restart the worker

// ── interpreter load watch ───────────────────────────────────────────────────
// The Pyodide payload is ~13 MB; on a filtered school network the first load
// can crawl or stall silently. The status line counts up, and the console
// explains at these thresholds instead of leaving an empty, frozen pane.
export const LOAD_HINT_SLOW_MS = 30_000 // console hint: still downloading
export const LOAD_HINT_STUCK_MS = 90_000 // console hint: looks stuck, how to recover

// ── app update check ─────────────────────────────────────────────────────────
export const UPDATE_CHECK_DELAY_MS = 5_000 // first check after boot
export const UPDATE_CHECK_INTERVAL_MS = 10 * 60_000 // steady-state re-check

// ── blocked imports ──────────────────────────────────────────────────────────
// Clarity, not security: in a browser tab raw sockets fake-connect and then
// hang until timeout, which reads as a hang to a learner. A meta-path finder
// in the worker turns these imports into instant, guided errors. Pyodide's
// own pyodide.http.pyfetch remains available for HTTP.
export const BLOCKED_MODULES: Record<string, string> = {
  socket:
    'raw network sockets are disabled in kata-runner — a browser tab has no TCP. For HTTP, use pyodide.http.pyfetch.',
  _socket: 'raw network sockets are disabled in kata-runner.',
  ssl: 'TLS sockets are disabled in kata-runner — a browser tab has no raw TLS.',
  socketserver: 'network servers are disabled in kata-runner.',
}

// ── editor indent ────────────────────────────────────────────────────────────
export const INDENT_OPTIONS = [2, 4] as const // the only indent widths offered

// ── virtual files ────────────────────────────────────────────────────────────
// Text-only, localStorage-backed; caps keep a curious learner inside the
// storage budget (localStorage ~5 MB per origin).
export const FILE_SAVE_DEBOUNCE_MS = 800
export const MAX_FILE_CHARS = 200_000
export const MAX_TOTAL_FILE_CHARS = 2_000_000
export const MAX_FILES = 50
export const ALLOWED_FILE_EXTS: readonly string[] = ['py', 'csv', 'json', 'md', 'html', 'css', 'txt']
