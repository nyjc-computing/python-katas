# kata-runner

An in-browser Python practice environment: CodeMirror 6 editor + Pyodide
(CPython on WebAssembly) in a web worker, built for the
[python-katas](../python-katas) exercise set.

## Setup

```sh
npm install
npm run vendor:pyodide   # copies the Pyodide core dist into public/pyodide/
npm run dev              # vite dev server (sends COOP/COEP headers)
```

Build & preview: `npm run build`, then `npm run preview`.
`public/pyodide/` is gitignored — regenerate it with `vendor:pyodide` after
cloning or bumping the `pyodide` version in package.json.

## Behaviours

- **Layouts** — two, toggleable from the toolbar and persisted: stacked
  (editor above console) and side-by-side (editor left, console right). The
  page itself never scrolls; each pane scrolls independently. Collapsed
  columns are reserved for the future file browser (left) and debugger
  (right) panels.
- **Editor** — line numbers (fixed), no soft wrapping, basic Python
  highlighting, and two hard limits: lines are capped at 100 characters
  (typing stops at the column, pasted over-long lines are auto-split
  preferring word boundaries, and structural edits that would join lines past
  the limit are rejected) and the document is capped at 2,000 lines (typing
  is blocked at the cap, oversize pastes are truncated to fit). Content
  autosaves to localStorage.
- **Console** — terminal semantics: `input()` pauses the program and you type
  into the console line; prompts written without a newline and the echoed
  input share a line. Output clears at the start of each run; stderr in red;
  exit status line at the end (real CPython exit codes, tracebacks trimmed to
  user frames only). Rendered output is bounded to ~1 MB of text (the newest
  ~750 KB is kept as it's exceeded), so runaway print loops stay responsive —
  and Stop (button / `Esc` / `Ctrl+C`) always recovers the page.
- **Run / Stop** — `Ctrl+Enter` runs; `Ctrl+C` in the console (or the Stop
  button) raises `KeyboardInterrupt` via Pyodide's interrupt buffer, which
  also aborts a blocked `input()`.
- **Why the COOP/COEP headers matter** — `SharedArrayBuffer` (and therefore
  both the interrupt buffer and blocking stdin) only exists on cross-origin
  isolated pages. The vite dev/preview servers and `public/_headers`
  (Cloudflare Pages/Netlify) set them; for nginx:

  ```nginx
  add_header Cross-Origin-Opener-Policy same-origin;
  add_header Cross-Origin-Embedder-Policy require-corp;
  ```

  Without isolation the app degrades: `input()` raises EOFError and Stop
  restarts the worker.

## Architecture

```
src/
  main.ts            toolbar, layout, persistence, worker message routing
  editor.ts          CodeMirror 6 setup + hard-limit extensions (width, height)
  console.ts         terminal-style output pane (open-line model, input row)
  limits.ts          all bounded-performance constants (single source of truth)
  protocol.ts        worker ↔ main message types + stdin channel constants
  pyworker/worker.ts Pyodide lifecycle, run with exit codes, SAB stdin/interrupt
```

One Pyodide worker owns everything Python. The worker exposes a small message
protocol (`run` / `analyze` / `complete` / `hover`) — the introspection
round-trips are stubbed and are the seam for the future code-introspection
LSP: run pyflakes (diagnostics) and jedi (completions, hovers) inside the same
worker via micropip, so execution and analysis share one brain, and the same
payload can feed an AI feedback assistant.

`input()` and Stop use `SharedArrayBuffer` + `Atomics` rather than worker
messaging because the worker is busy (blocked) while user code runs — messages
can't be processed mid-run, but atomic writes can.

All resource bounds live in `src/limits.ts` (line width, document height,
console volume, output flush/backlog thresholds, stop watchdog). Bounds are
enforced silently: learners can't footgun themselves into an unresponsive
page; anyone who wants to stress-test the interpreter should bring their own
tooling.
