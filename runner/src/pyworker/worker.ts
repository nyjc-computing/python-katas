/// <reference lib="webworker" />
import type { PyodideInterface } from 'pyodide'
import type { PyProxy } from 'pyodide/ffi'
import {
  FromWorker,
  STDIN_HEADER_INTS,
  STDIN_MAX_BYTES,
  STDIN_STATE,
  ToWorker,
} from '../protocol'
import { BLOCKED_MODULES, OUTPUT_FLUSH_INTERVAL_MS, OUTPUT_FLUSH_MAX_BYTES } from '../limits'

const ctx = self as unknown as DedicatedWorkerGlobalScope

const send = (msg: FromWorker): void => ctx.postMessage(msg)
const stdoutEncoder = new TextEncoder()

// ── shared memory ────────────────────────────────────────────────────────────
// The interrupt buffer powers a real Stop (KeyboardInterrupt) while Python is
// executing; the stdin channel lets input() block the worker until the main
// thread writes a line. Both need SharedArrayBuffer, which requires the page
// to be cross-origin isolated (COOP/COEP headers — see vite.config.ts and
// public/_headers). Without isolation we degrade: input() sees EOF and Stop
// restarts the worker.

let interrupt: Int32Array | null = null
let stdinHeader: Int32Array | null = null
let stdinBytes: Uint8Array | null = null
let stdinCancelled = false
// EOF (Ctrl+D) is sticky for the rest of the run, like a closed terminal:
// after it, every stdin read returns EOF without prompting.
let stdinEof = false
// Verify runs carry their stdin up-front (prefeed): the queue answers reads
// without ever opening the interactive input row, and EOF is immediate once
// it runs dry. Interactive runs leave this off.
let prefedLines: string[] = []
let prefeedActive = false

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

// pyodide's stdin contract (verified against the vendored build): the
// callback returns the next line INCLUDING its newline, '' is an empty line,
// and null (or undefined) signals EOF. autoEOF stays at its default (on):
// with it off, pyodide's reader does a second blocking "lookahead" call per
// input() that nothing can answer, wedging every interactive program. The
// per-line EOF marker that autoEOF adds would otherwise cap read() and
// iteration at one line — RUNNER_SOURCE wraps sys.stdin to restore those
// (it distinguishes the marker from a real EOF via __kata_eof_pending).
function readStdinLine(): string | null {
  if (stdinEof) return null
  if (prefeedActive) {
    const line = prefedLines.shift()
    if (line !== undefined) return line + '\n'
    stdinEof = true
    // Real EOF for the sys.stdin wrapper (read()/iteration run past the
    // autoEOF marker they just saw).
    pyodide?.globals.set('__kata_eof_pending', true)
    return null
  }
  if (!stdinHeader || !stdinBytes) return null // not isolated → EOF
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
      return null
    }
  }
  const state = Atomics.load(stdinHeader, 0)
  Atomics.store(stdinHeader, 0, STDIN_STATE.idle)
  if (state === STDIN_STATE.eof) {
    stdinEof = true
    // Mark the real EOF so the sys.stdin wrapper can tell it apart from the
    // autoEOF marker pyodide inserts after this return.
    pyodide?.globals.set('__kata_eof_pending', true)
    return null
  }
  if (state !== STDIN_STATE.ready) {
    stdinCancelled = true
    return null
  }
  const length = stdinHeader[1]
  // slice() (not subarray()): TextDecoder.decode refuses SAB-backed views.
  // The payload already carries its trailing newline (main.ts writes it, and
  // guarantees it even on truncation — a newline-less exact-fill payload
  // once wedged pyodide's reader and silently killed input() for the rest
  // of the session).
  return decoder.decode(stdinBytes.slice(0, length))
}

// ── Python runtime ───────────────────────────────────────────────────────────

let pyodide: PyodideInterface | null = null
let loadPromise: Promise<PyodideInterface> | null = null
// Bound method proxy for _kata_run. Calling it directly skips pyodide's
// eval_code machinery — no compile of the call string — so a KeyboardInterrupt
// can never fire inside the compiler, which once left a pending SIGINT that
// poisoned every later run until restart.
let kataRun: ((source: string) => PyProxy) | null = null

async function getPyodide(): Promise<PyodideInterface> {
  if (!loadPromise) {
    loadPromise = (async () => {
      // BASE_URL keeps this working when the site is deployed under a
      // sub-path (e.g. GitHub Pages project sites).
      const base = import.meta.env.BASE_URL.endsWith('/')
        ? import.meta.env.BASE_URL
        : import.meta.env.BASE_URL + '/'
      const url = `${base}pyodide/pyodide.mjs`
      try {
        const { loadPyodide } = await import(/* @vite-ignore */ url)
        const py = await loadPyodide({ indexURL: `${base}pyodide/` })
        if (interrupt) py.setInterruptBuffer(interrupt)
        // Writer-style handlers get the whole buffer per write; isatty keeps
        // Python line-buffered so input() prompts appear before the read.
        py.setStdout({ isatty: true, write: stdoutWriter.write })
        py.setStderr({ isatty: true, write: stderrWriter.write })
        // isatty:true so sys.stdin.isatty() reports a terminal instead of
        // raising "I/O operation on closed file". autoEOF stays default-on
        // (see readStdinLine); RUNNER_SOURCE restores read()/iteration.
        py.setStdin({ stdin: readStdinLine, isatty: true })
        // Workspace for the learner's virtual files: open('data.csv') and
        // imports between .py files resolve against the process cwd.
        try {
          py.FS.mkdir('/kata')
        } catch {
          /* already exists */
        }
        py.FS.chdir('/kata')
        py.runPython(RUNNER_SOURCE)
        kataRun = py.globals.get('_kata_run')
        send({ type: 'pyodide-ready' })
        return py
      } catch (e) {
        loadPromise = null // a failed load must be retryable (next Run)
        send({ type: 'pyodide-error', message: e instanceof Error ? e.message : String(e) })
        throw e
      }
    })()
  }
  return loadPromise
}

// Runs user code with CPython exit-code semantics and tracebacks trimmed to
// the user's own frames (everything from pyodide's harness is dropped).
// One try spans compile+exec: a KeyboardInterrupt is a stop wherever it
// lands in that span, never an interpreter-level error.
const RUNNER_SOURCE = `
import sys
import traceback

def _kata_run(source):
    g = {'__name__': '__main__'}
    globals()['__kata_eof_pending'] = False
    try:
        code = compile(source, '<kata>', 'exec')
        exec(code, g)
    except SystemExit as e:
        if e.code is None:
            return 0, ''
        if isinstance(e.code, int):
            return e.code, ''
        return 1, str(e.code) + '\\n'
    except KeyboardInterrupt:
        return 130, 'KeyboardInterrupt\\n'
    except SyntaxError:
        etype, evalue, _tb = sys.exc_info()
        return 1, ''.join(traceback.format_exception_only(etype, evalue))
    except BaseException:
        etype, evalue, tb = sys.exc_info()
        while tb is not None and tb.tb_frame.f_code.co_filename != '<kata>':
            tb = tb.tb_next
        return 1, ''.join(traceback.format_exception(etype, evalue, tb))
    return 0, ''

# Classroom policy: raw sockets fake-connect in a browser, then hang until
# timeout. Fail them fast with guidance instead. Clarity, not security —
# pyodide.http.pyfetch stays available for real HTTP.
#
# pdb imports socket at module level (3.14 remote-debugging), so import it
# NOW, while the boot-time socket is still in sys.modules; its own reference
# survives the eviction below and breakpoint() keeps working.
try:
    import pdb  # noqa: F401
except ImportError:
    pass

_KATA_BLOCKED = ${JSON.stringify(BLOCKED_MODULES)}

class _KataBlockFinder:
    def find_spec(self, fullname, path=None, target=None):
        message = _KATA_BLOCKED.get(fullname)
        if message is not None:
            raise ImportError(message, name=fullname)
        return None

sys.meta_path.insert(0, _KataBlockFinder())
# Pyodide's boot pre-imports some of these (socket lands in sys.modules via
# the site chain), and cache hits never consult the finder — evict them so
# the first user import is the one that gets the guided error.
for _name in _KATA_BLOCKED:
    sys.modules.pop(_name, None)

# autoEOF (pyodide) ends sys.stdin.read() and iteration at the FIRST line by
# inserting an EOF marker after every callback return. Wrap sys.stdin: keep
# readline() one-call-per-line (input() fast path), but accumulate read() and
# iteration across markers until the callback signals a REAL EOF by setting
# __kata_eof_pending (worker-side, on Ctrl+D).
class _KataStdin:
    def __init__(self, inner):
        self._inner = inner

    def readline(self, size=-1):
        return self._inner.readline(size)

    def read(self, size=-1):
        parts = []
        while True:
            line = self._inner.readline()
            if line:
                parts.append(line)
            if globals().get('__kata_eof_pending') or not line:
                break
        data = ''.join(parts)
        return data[:size] if size >= 0 else data

    def __iter__(self):
        return self

    def __next__(self):
        line = self.readline()
        if not line:
            raise StopIteration
        return line

    def isatty(self):
        return self._inner.isatty()

    def __getattr__(self, name):
        return getattr(self._inner, name)

    def close(self):
        pass  # the console stdin never really closes

sys.stdin = _KataStdin(sys.stdin)
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

async function run(code: string, files: Record<string, string>, prefeed?: string): Promise<void> {
  if (busy) return
  busy = true
  stdinCancelled = false
  stdinEof = false
  // A trailing empty split() artifact would feed one spurious blank line;
  // drop it — EOF after the last real line is what verify means.
  prefedLines = prefeed !== undefined ? prefeed.split('\n').filter((l, i, a) => i < a.length - 1 || l !== '') : []
  prefeedActive = prefeed !== undefined
  if (interrupt) Atomics.store(interrupt, 0, 0)
  if (stdinHeader) Atomics.store(stdinHeader, 0, STDIN_STATE.idle)

  let exitCode = 1
  let errText = ''
  let escapedInterrupt = false
  try {
    const py = await getPyodide()
    // A Stop pressed while the eager load was still in flight armed the
    // interrupt buffer before any Python ran; honour it without executing
    // (executing with the buffer set would raise inside pyodide's own
    // machinery and leave a pending SIGINT that poisoned later runs).
    if (interrupt && Atomics.load(interrupt, 0) !== 0) {
      Atomics.store(interrupt, 0, 0)
      send({ type: 'run-finished', exitCode: 130, interrupted: true })
      busy = false
      return
    }
    syncVirtualFiles(py, files)
    send({ type: 'run-started' }) // user code is next; Stop is safe from here
    const result = kataRun!(code)
    const [gotExit, gotErr] = result.toJs() as [number, string]
    result.destroy()
    exitCode = gotExit
    errText = gotErr
    if (stdinCancelled) {
      // Stop was pressed while waiting on input(): the EOFError traceback is
      // noise, report it as an interruption instead.
      exitCode = 130
      errText = ''
    }
  } catch (e) {
    const text = e instanceof Error ? e.message : String(e)
    if (text.includes('KeyboardInterrupt')) {
      // A KI that escaped _kata_run fired inside pyodide's own machinery;
      // pending-signal state is untrustworthy afterwards, so report a clean
      // stop and have main replace the worker (self-heal).
      escapedInterrupt = true
      send({ type: 'run-finished', exitCode: 130, interrupted: true, restart: true })
    } else {
      errText = text
    }
  }

  if (escapedInterrupt) {
    busy = false
    return
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
      void run(msg.code, msg.files, msg.prefeed)
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

// Eager prewarm: load Pyodide at spawn so Run is ready immediately and the
// UI state machine can gate on a loaded interpreter. A failed load is
// reported to main (pyodide-error) and retried on the next Run — the cached
// promise is cleared, so getPyodide() starts a fresh load then.
void getPyodide().catch(() => {})
