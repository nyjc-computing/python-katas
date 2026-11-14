# kata-runner

An in-browser Python practice environment: CodeMirror 6 editor + Pyodide
(CPython on WebAssembly) in a web worker, purpose-built for the kata corpus
in [this repo's root](../README.md) (`python-katas-by-feature.md`). The app
lives in `runner/`; the parsed corpus it loads is committed at
`../build/katas.json` — regenerate it with `npm run sync` after editing the
markdown (see [MARKDOWN-FORMAT.md](../MARKDOWN-FORMAT.md)).

## Setup

```sh
npm install
npm run vendor:pyodide   # copies the Pyodide core dist into public/pyodide/
npm run sync             # parses ../../python-katas-by-feature.md → ../build/katas.json
npm run dev              # vite dev server (sends COOP/COEP headers)
```

Build & preview: `npm run build`, then `npm run preview`.
`public/pyodide/` is gitignored — regenerate it with `vendor:pyodide` after
cloning or bumping the `pyodide` version in package.json.

## Behaviours

- **Kata browser** — the hamburger (left of the logo) opens the kata
  selector, which covers the Files sidebar; the panel's Katas/Files tabs
  switch what the editor is bound to. Picking a kata loads its saved
  codebase into the editor; **Verify** runs it against the kata's
  `{stdin, stdout}` tests (stdin is pre-fed, the interactive input row never
  opens) and marks it with a green ✓ when the normalised output matches.
- **Kata info pane** — selecting a kata opens the right sidebar: its text
  (question with sample I/O) and hints, each hint its own collapsed row
  that expands independently; per-hint state persists. The pane toggles via
  the ⓘ button at the toolbar's right end, or by clicking its collapsed
  edge rail. The skill chips are hidden until the kata is verified — they
  name the skills the kata trains (from a fixed vocabulary), so they appear
  afterwards as a "Skills trained" recap.
- **Collapsible side rails** — with a side panel closed, its column stays
  visible as a 26px labelled rail ("Kata browser" / "My files" on the
  left, "Kata info" on the right); clicking the rail expands the panel.
- **Per-kata codebases** — the whole virtual file set belongs to its
  context: switching katas swaps `main.py` and any helper files with it.
  The plain Files workspace is reachable via the "My files" entry at the
  top of the kata list; the Files tab always manages the active context.
- **Corpus snapshots** — the kata set is bundled at build time but the app
  runs against a localStorage snapshot taken on first visit, so deployments
  never move the corpus mid-practice. When a newer set ships, a banner shows
  added/removed/changed counts and offers the refresh; accepting it migrates
  attempt state (code, verified, tries) across renumbered ids by title
  slug. Attempts record a `tries` counter per kata (per Run / per Verify) —
  the seed for future telemetry.
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

## Deployment

- **GitHub Pages** (this repo): push to `main` and the
  [deploy workflow](../.github/workflows/deploy.yml) builds and publishes to
  https://nyjc-computing.github.io/python-katas/. Project Pages serve under a
  sub-path, so the workflow sets `PAGES_BASE=/python-katas/` and the worker's
  runtime URLs follow. Pages cannot send COOP/COEP headers, so
  `public/coi-serviceworker.js` injects them client-side — the very first
  visit registers the worker and reloads once; after that the page is
  cross-origin isolated and `input()`/Stop work fully. Note GitHub only
  serves Pages for **private** repos on paid plans; on the free plan make
  the repo public first.
- **Cloudflare Pages / Netlify**: `wrangler pages deploy runner/dist` — the
  `public/_headers` file is honored natively, no shim involved.
- **nginx**: serve `runner/dist/` with

  ```nginx
  add_header Cross-Origin-Opener-Policy same-origin;
  add_header Cross-Origin-Embedder-Policy require-corp;
  ```

## Architecture

```
src/
  main.ts            toolbar, layout, persistence, worker message routing
  katas.ts           typed seam over the committed kata corpus (../build/katas.json)
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
