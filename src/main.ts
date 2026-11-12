import './style.css'
import { createEditor } from './editor'
import { Console } from './console'
import {
  FromWorker,
  STDIN_HEADER_INTS,
  STDIN_MAX_BYTES,
  STDIN_STATE,
  ToWorker,
} from './protocol'
import {
  OUTPUT_DROP_CHUNK_CHARS,
  OUTPUT_KEEP_CHUNK_CHARS,
  OUTPUT_TICK_MS,
  STOP_WATCHDOG_MS,
} from './limits'

// ── DOM ──────────────────────────────────────────────────────────────────────
const app = document.querySelector('#app') as HTMLElement
const editorHost = document.querySelector('#editor') as HTMLElement
const editorStatus = document.querySelector('#editor-status') as HTMLElement
const consoleHost = document.querySelector('#console') as HTMLElement
const runStatus = document.querySelector('#run-status') as HTMLElement
const btnRun = document.querySelector('#btn-run') as HTMLButtonElement
const btnStop = document.querySelector('#btn-stop') as HTMLButtonElement
const btnClear = document.querySelector('#btn-clear') as HTMLButtonElement
const btnLayout = document.querySelector('#btn-layout') as HTMLButtonElement

// ── console ──────────────────────────────────────────────────────────────────
const decoder = new TextDecoder()

let stdinHeader: Int32Array | null = null
let stdinBytes: Uint8Array | null = null

const consolePane = new Console(consoleHost, (line) => {
  // A blocked readStdinLine() in the worker is waiting on this buffer.
  if (!stdinHeader || !stdinBytes) return
  const bytes = new TextEncoder().encode(line).slice(0, STDIN_MAX_BYTES)
  stdinBytes.set(bytes)
  stdinHeader[1] = bytes.length
  Atomics.store(stdinHeader, 0, STDIN_STATE.ready)
  Atomics.notify(stdinHeader, 0)
})

// Streamed output is coalesced onto a 100ms tick so a print-flood loop can't
// drive one-DOM-append-per-message; backlog beyond ~1MB is dropped (terminal
// scrollback behaviour — a flood's history is not worth freezing the page).
const pendingStdout: string[] = []
const pendingStderr: string[] = []
let pendingChars = 0

function drainPendingOutput(): void {
  if (pendingStdout.length > 0) {
    let text = pendingStdout.join('')
    pendingStdout.length = 0
    if (text.length > OUTPUT_DROP_CHUNK_CHARS) text = text.slice(-OUTPUT_KEEP_CHUNK_CHARS)
    consolePane.write(text)
  }
  if (pendingStderr.length > 0) {
    let text = pendingStderr.join('')
    pendingStderr.length = 0
    if (text.length > OUTPUT_DROP_CHUNK_CHARS) text = text.slice(-OUTPUT_KEEP_CHUNK_CHARS)
    consolePane.write(text, 'stderr')
  }
  pendingChars = 0
}

setInterval(drainPendingOutput, OUTPUT_TICK_MS)

// ── editor ───────────────────────────────────────────────────────────────────
let analyzeTimer: ReturnType<typeof setTimeout> | undefined
let analyzeVersion = 0

const editor = createEditor(editorHost, {
  onCodeChanged: (code) => {
    localStorage.setItem('kata.editor', code)
    clearTimeout(analyzeTimer)
    analyzeTimer = setTimeout(() => {
      analyzeVersion++
      worker.postMessage({ type: 'analyze', code, version: analyzeVersion } satisfies ToWorker)
    }, 800)
  },
  onRun: () => run(),
  onCursor: ({ line, col }) => {
    editorStatus.textContent = `Ln ${line}, Col ${col}`
  },
})

// ── worker ───────────────────────────────────────────────────────────────────
let interrupt: Int32Array | null = null
let running = false
let worker: Worker

function spawnWorker(): void {
  worker = new Worker(new URL('./pyworker/worker.ts', import.meta.url), { type: 'module' })
  worker.onmessage = (event: MessageEvent<FromWorker>) => {
    const msg = event.data
    switch (msg.type) {
      case 'ready': {
        if (msg.buffers) {
          interrupt = new Int32Array(msg.buffers.interrupt)
          stdinHeader = new Int32Array(msg.buffers.stdin, 0, STDIN_HEADER_INTS)
          stdinBytes = new Uint8Array(msg.buffers.stdin, STDIN_HEADER_INTS * 4, STDIN_MAX_BYTES)
        } else {
          consolePane.write(
            'warning: page is not cross-origin isolated — interactive input() and Stop are degraded.\n',
            'stderr',
          )
        }
        break
      }
      case 'stdout':
        pendingStdout.push(decoder.decode(new Uint8Array(msg.bytes), { stream: true }))
        pendingChars += 1
        break
      case 'stderr':
        pendingStderr.push(decoder.decode(new Uint8Array(msg.bytes), { stream: true }))
        pendingChars += 1
        break
      case 'input-request':
        drainPendingOutput() // flush the prompt before opening the input row
        consolePane.beginInput()
        break
      case 'run-finished': {
        clearTimeout(stopWatchdog)
        drainPendingOutput()
        running = false
        consolePane.endInput()
        consolePane.write('\n', '')
        if (msg.interrupted) {
          consolePane.write('── stopped (KeyboardInterrupt) ──\n', 'status')
        } else if (msg.exitCode === 0) {
          consolePane.write('── program finished ──\n', 'status')
        } else {
          consolePane.write(`── exited with code ${msg.exitCode} ──\n`, 'status')
        }
        setButtons()
        break
      }
      case 'analysis':
        // LSP scaffold: diagnostics arrive here once the worker runs pyflakes.
        break
      case 'completions':
      case 'hover-info':
        break
    }
  }
}

spawnWorker()

// ── run / stop ───────────────────────────────────────────────────────────────

let stopWatchdog: ReturnType<typeof setTimeout> | undefined

function run(): void {
  if (running) return
  running = true
  setButtons()
  consolePane.clear()
  worker.postMessage({ type: 'run', code: editor.state.doc.toString() } satisfies ToWorker)
}

function stop(): void {
  if (!running) return
  if (stdinHeader) {
    // Wake a blocked input() read so the interrupt can take effect.
    Atomics.store(stdinHeader, 0, STDIN_STATE.cancel)
    Atomics.notify(stdinHeader, 0)
  }
  if (interrupt) {
    Atomics.store(interrupt, 0, 2) // pyodide raises KeyboardInterrupt
    // Belt and braces: if the interrupt never lands (browser quirk, or code
    // stuck in a C-level call that can't check signals), terminate the
    // worker so Stop always works.
    clearTimeout(stopWatchdog)
    stopWatchdog = setTimeout(() => {
      if (!running) return
      running = false
      consolePane.endInput()
      consolePane.write('\n── stopped (worker restarted) ──\n', 'status')
      worker.terminate()
      spawnWorker()
      setButtons()
    }, STOP_WATCHDOG_MS)
  } else {
    // Degraded mode (no SharedArrayBuffer): the only way to stop is to drop
    // the worker and start a fresh one.
    running = false
    consolePane.endInput()
    consolePane.write('── stopped (worker restarted) ──\n', 'status')
    worker.terminate()
    spawnWorker()
    setButtons()
  }
}

function setButtons(): void {
  btnRun.disabled = running
  btnStop.disabled = !running
  runStatus.textContent = running ? 'running…' : ''
}

btnRun.addEventListener('click', run)
btnStop.addEventListener('click', stop)
btnClear.addEventListener('click', () => consolePane.clear())

// ── layout ───────────────────────────────────────────────────────────────────

function applyLayout(layout: 'stack' | 'side'): void {
  app.classList.toggle('layout-stack', layout === 'stack')
  app.classList.toggle('layout-side', layout === 'side')
  btnLayout.textContent = layout === 'stack' ? 'Layout: stacked' : 'Layout: side-by-side'
  localStorage.setItem('kata.layout', layout)
}

applyLayout(localStorage.getItem('kata.layout') === 'side' ? 'side' : 'stack')

btnLayout.addEventListener('click', () => {
  applyLayout(app.classList.contains('layout-stack') ? 'side' : 'stack')
})

// ── keyboard ─────────────────────────────────────────────────────────────────

window.addEventListener('keydown', (e) => {
  if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
    e.preventDefault()
    run()
    return
  }
  // Esc stops a running program (unless the user is copying text with Ctrl+C
  // below, Escape has no conflicting editor role we need to preserve while
  // code is running).
  if (e.key === 'Escape' && running) {
    e.preventDefault()
    stop()
    return
  }
  // Ctrl+C interrupts a running program, unless the user is copying text.
  if (e.ctrlKey && e.key === 'c' && running) {
    const selection = window.getSelection()?.toString() ?? ''
    if (!selection) {
      e.preventDefault()
      stop()
    }
  }
})
