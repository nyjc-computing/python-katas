/// <reference lib="webworker" />
import type { PyodideInterface } from 'pyodide'
import {
  FromWorker,
  STDIN_HEADER_INTS,
  STDIN_MAX_BYTES,
  STDIN_STATE,
  ToWorker,
} from '../protocol'
import { OUTPUT_FLUSH_INTERVAL_MS, OUTPUT_FLUSH_MAX_BYTES } from '../limits'

const ctx = self as unknown as DedicatedWorkerGlobalScope

const send = (msg: FromWorker): void => ctx.postMessage(msg)
const stdoutEncoder = new TextEncoder()

// ── shared memory ────────────────────────────────────────────────────────────
// The interrupt buffer powers a real Stop (KeyboardInterrupt) while Python is
// executing; the stdin channel lets input() block the worker until the main
// thread writes a line. Both need SharedArrayBuffer, which requires the page
// to be cross-origin isolated (COOP/COEP headers — see vite.config.ts and
// public/_headers). Without isolation we degrade: input() raises EOFError and
// Stop restarts the worker.

let interrupt: Int32Array | null = null
let stdinHeader: Int32Array | null = null
let stdinBytes: Uint8Array | null = null
let stdinCancelled = false

try {
  const interruptBuf = new SharedArrayBuffer(4)
  const stdinBuf = new SharedArrayBuffer(STDIN_HEADER_INTS * 4 + STDIN_MAX_BYTES)
  interrupt = new Int32Array(interruptBuf)
  stdinHeader = new Int32Array(stdinBuf, 0, STDIN_HEADER_INTS)
  stdinBytes = new Uint8Array(stdinBuf, STDIN_HEADER_INTS * 4, STDIN_MAX_BYTES)
  send({
    type: 'ready',
    crossIsolated: true,
    buffers: { interrupt: interruptBuf, stdin: stdinBuf },
  })
} catch {
  send({ type: 'ready', crossIsolated: false })
}

const decoder = new TextDecoder()

// ── output batching ──────────────────────────────────────────────────────────
// A print-flood loop posting one message per write floods the main thread
// with work and the page stops responding — the Stop click never lands
// (reproduced: the tab eventually crashed). Batch output and flush at most
// every 50ms / 4KB; timers don't fire while Python runs synchronously, so
// the time check happens inside each write instead.

function makeStdioWriter(kind: 'stdout' | 'stderr') {
  let pending: Uint8Array[] = []
  let pendingBytes = 0
  let lastFlush = 0
  const flush = (): void => {
    if (pendingBytes === 0) return
    const out = new Uint8Array(pendingBytes)
    let offset = 0
    for (const chunk of pending) {
      out.set(chunk, offset)
      offset += chunk.length
    }
    pending = []
    pendingBytes = 0
    lastFlush = performance.now()
    send({ type: kind, bytes: out.buffer })
  }
  return {
    flush,
    write: (chars: Uint8Array): number => {
      pending.push(chars.slice())
      pendingBytes += chars.length
      // Time-based flush (checked inside each write — timers don't fire while
      // Python runs synchronously); the size cap is only an emergency memory
      // bound, since a tight print loop hits it long before the interval
      // passes.
      if (pendingBytes >= OUTPUT_FLUSH_MAX_BYTES) flush()
      else if (performance.now() - lastFlush >= OUTPUT_FLUSH_INTERVAL_MS) flush()
      return chars.length
    },
  }
}

const stdoutWriter = makeStdioWriter('stdout')
const stderrWriter = makeStdioWriter('stderr')

function readStdinLine(): string {
  if (!stdinHeader || !stdinBytes) return '' // not isolated → EOF → EOFError
  stdoutWriter.flush() // deliver a pending prompt before the read blocks
  Atomics.store(stdinHeader, 0, STDIN_STATE.idle)
  send({ type: 'input-request' })
  for (;;) {
    if (Atomics.load(stdinHeader, 0) !== STDIN_STATE.idle) break
    const r = Atomics.wait(stdinHeader, 0, STDIN_STATE.idle, 250)
    if (r === 'ok') break
    if (interrupt && Atomics.load(interrupt, 0) !== 0) {
      stdinCancelled = true
      Atomics.store(stdinHeader, 0, STDIN_STATE.idle)
      return ''
    }
  }
  const state = Atomics.load(stdinHeader, 0)
  Atomics.store(stdinHeader, 0, STDIN_STATE.idle)
  if (state !== STDIN_STATE.ready) {
    stdinCancelled = true
    return ''
  }
  const length = stdinHeader[1]
  // slice() (not subarray()): TextDecoder.decode refuses SAB-backed views.
  const line = decoder.decode(stdinBytes.slice(0, length))
  return line + '\n'
}

// ── Python runtime ───────────────────────────────────────────────────────────

let pyodide: PyodideInterface | null = null
let loadPromise: Promise<PyodideInterface> | null = null

async function getPyodide(): Promise<PyodideInterface> {
  if (!loadPromise) {
    loadPromise = (async () => {
      // BASE_URL keeps this working when the site is deployed under a
      // sub-path (e.g. GitHub Pages project sites).
      const base = import.meta.env.BASE_URL
      const url = `${base}pyodide/pyodide.mjs`
      const { loadPyodide } = await import(/* @vite-ignore */ url)
      const py = await loadPyodide({ indexURL: `${base}pyodide/` })
      if (interrupt) py.setInterruptBuffer(interrupt)
      // Writer-style handlers get the whole buffer per write; isatty keeps
      // Python line-buffered so input() prompts appear before the read.
      py.setStdout({ isatty: true, write: stdoutWriter.write })
      py.setStderr({ isatty: true, write: stderrWriter.write })
      py.setStdin({ stdin: readStdinLine })
      // Workspace for the learner's virtual files: open('data.csv') and
      // imports between .py files resolve against the process cwd.
      try {
        py.FS.mkdir('/kata')
      } catch {
        /* already exists */
      }
      py.FS.chdir('/kata')
      py.runPython(RUNNER_SOURCE)
      return py
    })()
  }
  return loadPromise
}

// Runs user code with CPython exit-code semantics and tracebacks trimmed to
// the user's own frames (everything from pyodide's harness is dropped).
const RUNNER_SOURCE = `
import sys
import traceback

def _kata_run(source):
    g = {'__name__': '__main__'}
    try:
        code = compile(source, '<kata>', 'exec')
    except SyntaxError:
        etype, evalue, _tb = sys.exc_info()
        return 1, ''.join(traceback.format_exception_only(etype, evalue))
    try:
        exec(code, g)
    except SystemExit as e:
        if e.code is None:
            return 0, ''
        if isinstance(e.code, int):
            return e.code, ''
        return 1, str(e.code) + '\\n'
    except KeyboardInterrupt:
        return 130, 'KeyboardInterrupt\\n'
    except BaseException:
        etype, evalue, tb = sys.exc_info()
        while tb is not None and tb.tb_frame.f_code.co_filename != '<kata>':
            tb = tb.tb_next
        return 1, ''.join(traceback.format_exception(etype, evalue, tb))
    return 0, ''
`

let busy = false
let syncedFileNames: Set<string> = new Set()

/** Mirror the sidebar's virtual files into the interpreter's cwd. */
function syncVirtualFiles(py: PyodideInterface, files: Record<string, string>): void {
  for (const name of syncedFileNames) {
    if (!(name in files)) {
      try {
        py.FS.unlink(`/kata/${name}`)
      } catch {
        /* already gone */
      }
    }
  }
  for (const [name, content] of Object.entries(files)) {
    py.FS.writeFile(`/kata/${name}`, content)
  }
  syncedFileNames = new Set(Object.keys(files))
}

async function run(code: string, files: Record<string, string>): Promise<void> {
  if (busy) return
  busy = true
  stdinCancelled = false
  if (interrupt) Atomics.store(interrupt, 0, 0)
  if (stdinHeader) Atomics.store(stdinHeader, 0, STDIN_STATE.idle)

  let exitCode = 1
  let errText = ''
  try {
    const py = await getPyodide()
    syncVirtualFiles(py, files)
    py.globals.set('__kata_source', code)
    const result = (await py.runPythonAsync('_kata_run(__kata_source)')) as [number, string]
    exitCode = result[0]
    errText = result[1]
    if (stdinCancelled) {
      // Stop was pressed while waiting on input(): the EOFError traceback is
      // noise, report it as an interruption instead.
      exitCode = 130
      errText = ''
    }
  } catch (e) {
    errText = e instanceof Error ? e.message : String(e)
  }

  stdoutWriter.flush()
  stderrWriter.flush()
  if (errText) send({ type: 'stderr', bytes: stdoutEncoder.encode(errText).buffer })
  send({ type: 'run-finished', exitCode, interrupted: stdinCancelled || exitCode === 130 })
  busy = false
}

// ── message handling ─────────────────────────────────────────────────────────
// Introspection stubs: the real implementation (pyflakes for diagnostics,
// jedi for completions/hovers, installed via micropip) lands with the LSP
// work. The round-trip contract is already in place so the editor wiring
// won't need to change.

function analyze(code: string, version: number): void {
  void code
  send({ type: 'analysis', version, diagnostics: [] })
}

function complete(code: string, line: number, col: number, version: number): void {
  void code
  void line
  void col
  send({ type: 'completions', version, items: [] })
}

function hover(code: string, line: number, col: number, version: number): void {
  void code
  void line
  void col
  send({ type: 'hover-info', version, text: null })
}

ctx.onmessage = (event: MessageEvent<ToWorker>) => {
  const msg = event.data
  switch (msg.type) {
    case 'run':
      void run(msg.code, msg.files)
      break
    case 'analyze':
      analyze(msg.code, msg.version)
      break
    case 'complete':
      complete(msg.code, msg.line, msg.col, msg.version)
      break
    case 'hover':
      hover(msg.code, msg.line, msg.col, msg.version)
      break
  }
}
