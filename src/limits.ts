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
