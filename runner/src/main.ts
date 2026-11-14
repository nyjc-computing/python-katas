import './style.css'
import { createEditor, setIndentWidth, setLanguage } from './editor'
import { Console } from './console'
import { FileStore, extOf } from './files'
import { makeZip } from './zip'
import {
  activeKataId,
  bumpTries,
  dismissCorpusUpdate,
  getKatas,
  getParts,
  getSections,
  isVerified,
  kataById,
  loadCorpus,
  loadHintState,
  loadWorkspace,
  markVerified,
  refreshCorpus,
  resetWorkspaces,
  saveHintState,
  saveWorkspace,
  setActiveKata,
  type CorpusUpdate,
  type KataTest,
} from './katas'
import { kataQuestionHtml } from './katatext'
import {
  FromWorker,
  STDIN_HEADER_INTS,
  STDIN_MAX_BYTES,
  STDIN_STATE,
  ToWorker,
} from './protocol'
import {
  INDENT_OPTIONS,
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
const btnVerify = document.querySelector('#btn-verify') as HTMLButtonElement
const btnClear = document.querySelector('#btn-clear') as HTMLButtonElement
const btnLayout = document.querySelector('#btn-layout') as HTMLButtonElement
const btnReset = document.querySelector('#btn-reset') as HTMLButtonElement
const kataActions = document.querySelector('#kata-actions') as HTMLElement
const indentSelect = document.querySelector('#indent-select') as HTMLSelectElement
const activeFileName = document.querySelector('#active-file-name') as HTMLElement
const saveStateEl = document.querySelector('#save-state') as HTMLElement
const panelLeft = document.querySelector('#panel-left') as HTMLElement
const panelRight = document.querySelector('#panel-right') as HTMLElement
const fileList = document.querySelector('#file-list') as HTMLElement
const newFileName = document.querySelector('#new-file-name') as HTMLInputElement
const btnCreate = document.querySelector('#btn-create') as HTMLButtonElement
const fileHint = document.querySelector('#file-hint') as HTMLElement
const btnUpload = document.querySelector('#btn-upload') as HTMLButtonElement
const uploadInput = document.querySelector('#upload-input') as HTMLInputElement
const btnZip = document.querySelector('#btn-zip') as HTMLButtonElement
const btnMenu = document.querySelector('#btn-menu') as HTMLButtonElement
const tabKatas = document.querySelector('#tab-katas') as HTMLButtonElement
const tabFiles = document.querySelector('#tab-files') as HTMLButtonElement
const fileActions = document.querySelector('#file-actions') as HTMLElement
const fileView = document.querySelector('#file-view') as HTMLElement
const kataView = document.querySelector('#kata-view') as HTMLElement
const kataList = document.querySelector('#kata-list') as HTMLElement
const kataSummary = document.querySelector('#kata-summary') as HTMLElement
const btnKatapane = document.querySelector('#btn-katapane') as HTMLButtonElement
const kataPaneEmpty = document.querySelector('#kata-pane-empty') as HTMLElement
const kataPaneBody = document.querySelector('#kata-pane-body') as HTMLElement
const kataPaneTitle = document.querySelector('#kata-pane-title') as HTMLElement
const kataFeatures = document.querySelector('#kata-features') as HTMLElement
const kataQuestion = document.querySelector('#kata-question') as HTMLElement
const kataHintsWrap = document.querySelector('#kata-hints-wrap') as HTMLElement
const kataHintsList = document.querySelector('#kata-hints-list') as HTMLElement
const kataFeaturesWrap = document.querySelector('#kata-features-wrap') as HTMLElement
const leftRailLabel = document.querySelector('#left-rail-label') as HTMLElement

// ── virtual files ────────────────────────────────────────────────────────────
const fileStore = new FileStore()

// ── console ──────────────────────────────────────────────────────────────────
const decoder = new TextDecoder()

let stdinHeader: Int32Array | null = null
let stdinBytes: Uint8Array | null = null

const consolePane = new Console(
  consoleHost,
  (line) => {
    // A blocked readStdinLine() in the worker is waiting on this buffer.
    // The payload carries its own trailing newline and never fills the
    // buffer exactly: the newline survives truncation, and the buffer
    // is never filled to the last byte.
    if (!stdinHeader || !stdinBytes) return
    const bytes = new TextEncoder().encode(line)
    const capped = bytes.slice(0, STDIN_MAX_BYTES - 1)
    const payload = new Uint8Array(capped.length + 1)
    payload.set(capped)
    payload[capped.length] = 10 // '\n'
    stdinBytes.set(payload)
    stdinHeader[1] = payload.length
    Atomics.store(stdinHeader, 0, STDIN_STATE.ready)
    Atomics.notify(stdinHeader, 0)
  },
  () => {
    // Ctrl+D on an empty line: end-of-input, sticky for this run (the
    // worker keeps returning EOF until the next run resets it).
    if (!stdinHeader) return
    Atomics.store(stdinHeader, 0, STDIN_STATE.eof)
    Atomics.notify(stdinHeader, 0)
  },
)

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

// ── kata corpus ──────────────────────────────────────────────────────────────
// The app runs against a localStorage snapshot of the corpus; a deployment
// that ships new katas only offers the refresh (banner), never auto-updates.
const loadedCorpus = loadCorpus()
const storedKataId = activeKataId()
const startingInKatas = localStorage.getItem('kata.sideMode') === 'katas'

// ── per-kata codebases ───────────────────────────────────────────────────────
// Every context — the plain Files workspace ('global') and each kata — owns
// the WHOLE virtual file set. Switching contexts swaps FileStore's contents,
// so `main.py` and any helper files travel with their kata. The live copy
// is captured back on every switch and again on tab hide/unload.
type ContextId = 'global' | string
let currentContext: ContextId =
  startingInKatas && storedKataId && kataById(storedKataId) ? storedKataId : 'global'

function captureCurrentContext(): void {
  fileStore.flush()
  saveWorkspace(currentContext, fileStore.all(), fileStore.activeName())
}

function switchContext(next: ContextId): void {
  if (next === currentContext) return
  captureCurrentContext()
  const workspace = loadWorkspace(next)
  fileStore.replaceAll(workspace.files, workspace.activeFile)
  currentContext = next
}

// Seed the context store on first run after this feature ships: the booted
// FileStore state is the user's pre-existing global workspace. Kata
// workspaces start fresh (legacy attempt code migrates inside loadWorkspace).
if (!('global' in (JSON.parse(localStorage.getItem('kata.workspaces') ?? '{}') as object))) {
  saveWorkspace('global', fileStore.all(), fileStore.activeName())
}
// starting inside a kata: swap in its codebase before the editor is created
// (safe — the FileStore change listeners attach after editor creation)
if (currentContext !== 'global') {
  const bootWorkspace = loadWorkspace(currentContext)
  fileStore.replaceAll(bootWorkspace.files, bootWorkspace.activeFile)
}

for (const evt of ['beforeunload', 'visibilitychange']) {
  window.addEventListener(evt, () => {
    if (document.visibilityState === 'hidden' || evt === 'beforeunload') captureCurrentContext()
  })
}

// ── editor ───────────────────────────────────────────────────────────────────
let analyzeTimer: ReturnType<typeof setTimeout> | undefined
let analyzeVersion = 0

// whatever context is live, the editor edits its workspace through FileStore
const editor = createEditor(editorHost, fileStore.get(fileStore.activeName()), {
  onCodeChanged: (code) => {
    fileStore.write(fileStore.activeName(), code)
    clearTimeout(analyzeTimer)
    analyzeTimer = setTimeout(() => {
      analyzeVersion++
      worker.postMessage({
        type: 'analyze',
        code,
        version: analyzeVersion,
      } satisfies ToWorker)
    }, 800)
  },
  onRun: () => run(),
  onCursor: ({ line, col }) => {
    editorStatus.textContent = `Ln ${line}, Col ${col}`
  },
})

void setLanguage(editor, extOf(fileStore.activeName()))
setIndentWidth(editor, savedIndent())

fileStore.onSaveState((state) => {
  saveStateEl.dataset.state = state
  saveStateEl.textContent = state === 'dirty' ? '● unsaved' : '✓ saved'
})

// ── worker ───────────────────────────────────────────────────────────────────
// Buttons are gated by a phase machine: Run only when the interpreter is
// loaded and idle, Stop only while user code is actually executing (it is
// the only recovery from a wedged run — never disabled mid-run).
type Phase = 'loading' | 'idle' | 'running'
let phase: Phase = 'loading'
let interrupt: Int32Array | null = null
let worker: Worker

function setPhase(next: Phase): void {
  phase = next
  setButtons()
}

function spawnWorker(): void {
  // The worker prewarms Pyodide immediately; pyodide-ready flips us to idle.
  setPhase('loading')
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
      case 'pyodide-ready':
        if (phase === 'loading') setPhase('idle')
        break
      case 'pyodide-error':
        // Load failed (bad deploy, blocked fetch). The worker cleared its
        // cached load, so the next Run retries it.
        setPhase('idle')
        consolePane.write(`Python failed to load: ${msg.message}\nPress Run to retry.\n`, 'stderr')
        break
      case 'run-started':
        // User code is about to execute: from here a Stop interrupt is safe.
        setPhase('running')
        break
      case 'stdout': {
        const text = decoder.decode(new Uint8Array(msg.bytes), { stream: true })
        pendingStdout.push(text)
        if (verifying) verifying.got += text
        pendingChars += 1
        break
      }
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
        consolePane.endInput()
        if (verifying) {
          handleVerifyFinished(msg)
        } else {
          consolePane.write('\n', '')
          if (msg.interrupted) {
            consolePane.write('── stopped (KeyboardInterrupt) ──\n', 'status')
          } else if (msg.exitCode === 0) {
            consolePane.write('── program finished ──\n', 'status')
          } else {
            consolePane.write(`── exited with code ${msg.exitCode} ──\n`, 'status')
          }
        }
        setPhase(msg.restart ? 'loading' : 'idle')
        if (msg.restart) {
          // Self-heal: the worker hit an interrupt it could not contain and
          // asked to be replaced; the fresh worker prewarms immediately.
          worker.terminate()
          spawnWorker()
        }
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
  if (phase !== 'idle') return
  if (currentContext !== 'global') bumpTries(currentContext)
  // 'loading' until the worker reports run-started. When the interpreter is
  // already warm that gap is a millisecond; on a retry-after-load-failure it
  // spans the reload, and pyodide-ready → run-started drive the phases.
  setPhase('loading')
  consolePane.clear()
  worker.postMessage({
    type: 'run',
    code: editor.state.doc.toString(),
    files: fileStore.all(),
  } satisfies ToWorker)
}

function stop(): void {
  if (phase !== 'running') return
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
      if (phase !== 'running') return
      consolePane.endInput()
      consolePane.write('\n── stopped (worker restarted) ──\n', 'status')
      worker.terminate()
      spawnWorker()
    }, STOP_WATCHDOG_MS)
  } else {
    // Degraded mode (no SharedArrayBuffer): the only way to stop is to drop
    // the worker and start a fresh one.
    consolePane.endInput()
    consolePane.write('── stopped (worker restarted) ──\n', 'status')
    worker.terminate()
    spawnWorker()
  }
}

function verifyAvailable(): boolean {
  if (phase !== 'idle' || currentContext === 'global') return false
  const kata = kataById(currentContext)
  return !!kata?.tests?.length
}

function setButtons(): void {
  // Run and Stop share one button: the phase machine keeps them mutually
  // exclusive (loading = both off, idle = Run, running = Stop).
  const running = phase === 'running'
  btnRun.innerHTML = running ? '&#9632; Stop' : '&#9654; Run'
  btnRun.title = running ? 'Stop (Esc, or Ctrl+C in the console)' : 'Run (Ctrl+Enter)'
  btnRun.disabled = running ? false : phase !== 'idle'
  btnVerify.disabled = !verifyAvailable()
  const activeKata = currentContext === 'global' ? undefined : kataById(currentContext)
  btnVerify.title = activeKata
    ? activeKata.tests?.length
      ? `Verify “${activeKata.n}. ${activeKata.title}” against its tests`
      : 'This kata has no auto-check tests — compare by eye'
    : 'Select a kata first (hamburger menu)'
  runStatus.textContent =
    phase === 'running' ? 'running…' : phase === 'loading' ? 'loading Python…' : ''
}

// ── verify ───────────────────────────────────────────────────────────────────
// Runs the active kata's tests: each test's stdin is pre-fed to the program
// (the interactive input row never opens), stdout is captured, and compared
// to the expected output after trailing-whitespace normalisation.

let verifying: { tests: KataTest[]; index: number; got: string } | null = null

const normalizeOutput = (s: string): string => s.replace(/[ \t]+$/gm, '').replace(/\n+$/, '')

function startVerify(): void {
  if (!verifyAvailable() || currentContext === 'global') return
  const kata = kataById(currentContext)!
  bumpTries(kata.id)
  verifying = { tests: kata.tests!, index: 0, got: '' }
  consolePane.clear()
  sendVerifyRun()
}

function sendVerifyRun(): void {
  const state = verifying!
  state.got = ''
  setPhase('loading')
  worker.postMessage({
    type: 'run',
    code: editor.state.doc.toString(),
    files: fileStore.all(),
    prefeed: state.tests[state.index].stdin,
  } satisfies ToWorker)
}

function handleVerifyFinished(msg: Extract<FromWorker, { type: 'run-finished' }>): void {
  const state = verifying!
  const expected = state.tests[state.index].stdout
  const pass = msg.exitCode === 0 && !msg.interrupted && normalizeOutput(state.got) === normalizeOutput(expected)
  if (pass && state.index + 1 < state.tests.length) {
    state.index++
    sendVerifyRun()
    return
  }
  verifying = null
  if (pass) {
    if (currentContext !== 'global') markVerified(currentContext, true)
    consolePane.write('✓ Verified — output matches.\n', 'success')
    renderKataList()
    renderKataPane()
  } else if (msg.interrupted) {
    consolePane.write('✗ Verify stopped before the program finished.\n', 'stderr')
  } else {
    consolePane.write('✗ Not yet — the output didn\'t match.\n', 'stderr')
    consolePane.write('Expected:\n', 'status')
    consolePane.write((normalizeOutput(expected) || '(no output)') + '\n')
    consolePane.write('Your output:\n', 'status')
    consolePane.write((normalizeOutput(state.got) || '(no output)') + '\n')
  }
  setButtons()
}

btnRun.addEventListener('click', () => (phase === 'running' ? stop() : run()))
btnVerify.addEventListener('click', startVerify)
btnClear.addEventListener('click', () => consolePane.clear())

// ── virtual files UI ─────────────────────────────────────────────────────────

const FILE_COLORS: Record<string, string> = {
  py: '#3572a5',
  csv: '#237a57',
  json: '#cb8b31',
  md: '#6f42c1',
  html: '#e34c26',
  css: '#2965f1',
  txt: '#6b7280',
}

const ICONS = {
  bin: '<svg viewBox="0 0 16 16" width="13" height="13" aria-hidden="true"><path d="M6.4 1.5h3.2l.6 1H12.5v1.6h-9V2.5h2.5l.4-1ZM3.2 5.1h9.6l-.6 9a1.2 1.2 0 0 1-1.2 1.1H5a1.2 1.2 0 0 1-1.2-1.1l-.6-9Z" fill="currentColor"/></svg>',
  pencil:
    '<svg viewBox="0 0 16 16" width="13" height="13" aria-hidden="true"><path d="M2 14h3l9-9-3-3-9 9v3Zm10.7-10.7 1-1a.7.7 0 0 0 0-1l-1-1a.7.7 0 0 0-1 0l-1 1 2 2Z" fill="currentColor"/></svg>',
  download:
    '<svg viewBox="0 0 16 16" width="13" height="13" aria-hidden="true"><path d="M8 11 3.5 6.5 5 5l2 2V1.5h2V7l2-2 1.5 1.5L8 11ZM3 12.5h10V14H3v-1.5Z" fill="currentColor"/></svg>',
}

let renameTarget: string | null = null

function downloadBlob(name: string, blob: Blob): void {
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = name
  a.click()
  setTimeout(() => URL.revokeObjectURL(url), 1000)
}

function triggerDownload(name: string, content: string): void {
  downloadBlob(name, new Blob([content], { type: 'text/plain' }))
}

function renderFileList(): void {
  const active = fileStore.activeName()
  fileList.innerHTML = ''
  for (const name of fileStore.names()) {
    const row = document.createElement('li')
    row.className = 'file-row' + (name === active ? ' active' : '')

    const badge = document.createElement('span')
    badge.className = 'file-type'
    badge.textContent = extOf(name)
    badge.style.setProperty('--badge-color', FILE_COLORS[extOf(name)] ?? '#6b7280')
    badge.title = `${extOf(name)} file`

    if (renameTarget === name) {
      const input = document.createElement('input')
      input.className = 'rename-input'
      input.value = name
      input.spellcheck = false
      const commit = () => {
        const next = input.value.trim()
        renameTarget = null
        if (next && next !== name) {
          const error = fileStore.rename(name, next)
          if (error) showFileHint(error)
        } else {
          renderFileList()
        }
      }
      input.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') input.blur()
        if (e.key === 'Escape') {
          renameTarget = null
          renderFileList()
        }
      })
      input.addEventListener('blur', commit)
      row.append(input)
      fileList.appendChild(row)
      // focus after the node is in the document
      queueMicrotask(() => input.focus())
      continue
    }

    const open = document.createElement('button')
    open.type = 'button'
    open.className = 'file-name'
    open.textContent = name
    open.title = `Open ${name}`
    open.addEventListener('click', () => fileStore.setActive(name))

    const mk = (cls: string, title: string, icon: string, onClick: () => void) => {
      const b = document.createElement('button')
      b.type = 'button'
      b.className = cls
      b.title = title
      b.innerHTML = icon
      b.addEventListener('click', onClick)
      return b
    }

    const dl = mk('file-act', `Download ${name}`, ICONS.download, () => triggerDownload(name, fileStore.get(name)))
    const ren = mk('file-act', `Rename ${name}`, ICONS.pencil, () => {
      renameTarget = name
      renderFileList()
    })
    const del = mk('file-del', `Delete ${name}`, ICONS.bin, () => {
      if (!confirm(`Delete ${name}? This cannot be undone.`)) return
      fileStore.remove(name)
    })

    row.append(badge, open, dl, ren, del)
    fileList.appendChild(row)
  }
  activeFileName.textContent = active
}

/** Swap the editor's content and language to the active file. Fires on
 * every context switch too — replaceAll() emits a change. */
function syncEditorToActive(): void {
  editor.dispatch({
    changes: { from: 0, to: editor.state.doc.length, insert: fileStore.get(fileStore.activeName()) },
  })
  void setLanguage(editor, extOf(fileStore.activeName()))
  activeFileName.textContent = fileStore.activeName()
  setButtons()
}

fileStore.onChange(() => {
  renderFileList()
  syncEditorToActive()
})
renderFileList()
activeFileName.textContent = fileStore.activeName()

// ── kata info pane ───────────────────────────────────────────────────────────

function applyKataPane(open: boolean): void {
  app.classList.toggle('katapane-open', open)
  btnKatapane.classList.toggle('open', open)
  btnKatapane.setAttribute('aria-expanded', String(open))
  btnKatapane.title = open ? 'Hide kata info' : 'Show kata info'
  localStorage.setItem('kata.katapane', open ? 'open' : 'closed')
}

function hintItem(kataId: string, index: number, text: string, expanded: boolean): HTMLElement {
  const item = document.createElement('div')
  item.className = 'hint-item' + (expanded ? ' open' : '')
  const toggle = document.createElement('button')
  toggle.type = 'button'
  toggle.className = 'hint-toggle'
  toggle.innerHTML = '<span class="hint-chevron" aria-hidden="true">&#9656;</span>'
  const label = document.createElement('span')
  label.textContent = `Hint ${index + 1}`
  toggle.appendChild(label)
  const body = document.createElement('div')
  body.className = 'hint-body'
  // hint text: backticked code only — reuse the question inline renderer
  body.innerHTML = kataQuestionHtml(text).replace(/<p>|<\/p>/g, '')
  const apply = () => {
    item.classList.toggle('open', expanded)
    toggle.setAttribute('aria-expanded', String(expanded))
  }
  toggle.addEventListener('click', () => {
    expanded = !expanded
    const state = loadHintState(kataId)
    state[index] = expanded
    saveHintState(kataId, state)
    apply()
  })
  apply()
  item.append(toggle, body)
  return item
}

function renderKataPane(): void {
  const kata = currentContext === 'global' ? undefined : kataById(currentContext)
  if (!kata) {
    kataPaneEmpty.hidden = false
    kataPaneBody.hidden = true
    return
  }
  kataPaneEmpty.hidden = true
  kataPaneBody.hidden = false
  kataPaneTitle.textContent = `${kata.n}. ${kata.title}`
  // feature chips are the solution's recipe — a spoiler before solving, a
  // recap after: they appear only once the kata is verified
  const solved = isVerified(kata.id)
  kataFeaturesWrap.hidden = !solved
  kataFeatures.innerHTML = ''
  for (const skill of kata.skills) {
    const chip = document.createElement('span')
    chip.className = 'chip'
    chip.textContent = skill
    kataFeatures.appendChild(chip)
  }
  kataQuestion.innerHTML = kataQuestionHtml(kata.question)
  kataHintsList.innerHTML = ''
  const expanded = loadHintState(kata.id)
  kata.hints.forEach((hint, index) => {
    kataHintsList.appendChild(hintItem(kata.id, index, hint, expanded[index] ?? false))
  })
  kataHintsWrap.hidden = kata.hints.length === 0
}

btnKatapane.addEventListener('click', () => {
  applyKataPane(!app.classList.contains('katapane-open'))
})

panelLeft.addEventListener('click', () => {
  // when collapsed, every child except the rail label is hidden — any click expands
  if (!app.classList.contains('sidebar-open')) applySidebar(true)
})

panelRight.addEventListener('click', () => {
  if (!app.classList.contains('katapane-open')) applyKataPane(true)
})

applyKataPane(localStorage.getItem('kata.katapane') !== 'closed')
renderKataPane()

// ── kata browser ─────────────────────────────────────────────────────────────

/** Swap the editor's content to a kata attempt. */
function selectKata(id: string): void {
  if (currentContext === id) return
  switchContext(id)
  setActiveKata(id)
  // loading a kata surfaces its text
  applyKataPane(true)
  renderKataPane()
  renderKataList()
  setButtons()
}

function renderKataList(): void {
  kataList.innerHTML = ''
  let verified = 0

  const filesRow = document.createElement('li')
  const filesBtn = document.createElement('button')
  filesBtn.type = 'button'
  filesBtn.className = 'kata-row my-files' + (currentContext === 'global' ? ' active' : '')
  filesBtn.title = 'Leave kata mode and work on your own files'
  const filesTitle = document.createElement('span')
  filesTitle.className = 'kata-title'
  filesTitle.textContent = 'My files'
  filesBtn.appendChild(filesTitle)
  filesBtn.addEventListener('click', () => {
    if (currentContext === 'global') return
    switchContext('global')
    setActiveKata(null)
    syncEditorToActive()
    renderKataList()
    renderKataPane()
    setButtons()
  })
  filesRow.appendChild(filesBtn)
  kataList.appendChild(filesRow)

  for (const part of getParts()) {
    const partHeader = document.createElement('li')
    partHeader.className = 'kata-part'
    partHeader.textContent = `Part ${part.id} — ${part.title}`
    kataList.appendChild(partHeader)
    for (const sectionId of part.sections) {
      const section = getSections().find((sec) => sec.id === sectionId)
      if (!section) continue
      const sectionHeader = document.createElement('li')
      sectionHeader.className = 'kata-section'
      sectionHeader.textContent = section.title
      kataList.appendChild(sectionHeader)
      for (const kata of getKatas().filter((k) => k.section === sectionId)) {
        const verifiedKata = isVerified(kata.id)
        if (verifiedKata) verified++
        const row = document.createElement('li')
        const btn = document.createElement('button')
        btn.type = 'button'
        btn.className = 'kata-row' + (currentContext === kata.id ? ' active' : '')
        btn.title = kata.tests
          ? `Open kata ${kata.n}`
          : `Kata ${kata.n} — no auto-check tests (compare by eye)`
        const num = document.createElement('span')
        num.className = 'kata-num'
        num.textContent = String(kata.n)
        const title = document.createElement('span')
        title.className = 'kata-title'
        title.textContent = kata.title
        const check = document.createElement('span')
        check.className = 'kata-check' + (verifiedKata ? ' ok' : '')
        check.textContent = '✓'
        btn.append(num, title, check)
        btn.addEventListener('click', () => selectKata(kata.id))
        row.appendChild(btn)
        kataList.appendChild(row)
      }
    }
  }
  kataSummary.textContent = `${getKatas().length} katas · ${verified} verified`
}

renderKataList()

// ── corpus update banner ─────────────────────────────────────────────────────

function showCorpusBanner(update: CorpusUpdate): void {
  const banner = document.createElement('div')
  banner.id = 'corpus-banner'
  const bits = [
    update.added > 0 ? `${update.added} added` : '',
    update.removed > 0 ? `${update.removed} removed` : '',
    update.updated > 0 ? `${update.updated} changed` : '',
  ].filter(Boolean)
  const text = document.createElement('span')
  text.textContent = `The kata set has been updated (${bits.join(', ')}). Your progress is kept — refresh to see the new set.`
  const actions = document.createElement('span')
  actions.className = 'banner-actions'
  const refresh = document.createElement('button')
  refresh.className = 'primary'
  refresh.textContent = 'Refresh'
  refresh.addEventListener('click', () => {
    const migrated = refreshCorpus()
    banner.remove()
    if (currentContext !== 'global') {
      const migratedId = migrated && kataById(migrated) ? migrated : null
      if (migratedId) {
        // workspace + attempt migrated by slug: rebind to the new id
        currentContext = 'global' // force the switch to re-load the workspace
        switchContext(migratedId)
        setActiveKata(migratedId)
        renderKataPane()
      } else {
        // the active kata vanished in the new set: fall back to Files
        switchContext('global')
        setActiveKata(null)
        syncEditorToActive()
      }
    }
    renderKataList()
    setButtons()
  })
  const dismiss = document.createElement('button')
  dismiss.textContent = 'Keep current'
  dismiss.addEventListener('click', () => {
    dismissCorpusUpdate()
    banner.remove()
  })
  actions.append(refresh, dismiss)
  banner.append(text, actions)
  document.body.appendChild(banner)
}

if (loadedCorpus.update) showCorpusBanner(loadedCorpus.update)

// ── sidebar tabs + hamburger ─────────────────────────────────────────────────

type SideMode = 'files' | 'katas'
let sideMode: SideMode = localStorage.getItem('kata.sideMode') === 'katas' ? 'katas' : 'files'

function applySideMode(mode: SideMode): void {
  localStorage.setItem('kata.sideMode', mode)
  kataView.hidden = mode !== 'katas'
  fileView.hidden = mode !== 'files'
  fileActions.hidden = mode !== 'files'
  tabKatas.classList.toggle('active', mode === 'katas')
  tabFiles.classList.toggle('active', mode === 'files')
  leftRailLabel.textContent = mode === 'katas' ? 'Kata browser' : 'My files'
  kataActions.hidden = mode !== 'katas'
  if (mode === 'katas') {
    const id = activeKataId()
    if (id && kataById(id)) selectKata(id)
  }
}

btnMenu.addEventListener('click', () => {
  applySidebar(!app.classList.contains('sidebar-open'))
})

// ── reset progress ───────────────────────────────────────────────────────────
// Red button on the Katas tab: wipes attempt state (verified ticks, saved
// code, try counters). Gated behind a confirmation; the corpus snapshot and
// the file workspace are untouched.

btnReset.addEventListener('click', () => {
  const confirmed = confirm(
    'Reset all kata progress?\n\nVerified ticks, saved code and attempt counters are deleted. This cannot be undone.',
  )
  if (!confirmed) return
  localStorage.removeItem('kata.attempts')
  resetWorkspaces()
  if (currentContext !== 'global') {
    // the active kata's workspace is gone: drop in a fresh one
    fileStore.replaceAll({ 'main.py': '' }, 'main.py')
    saveWorkspace(currentContext, fileStore.all(), fileStore.activeName())
  }
  renderKataList()
  renderKataPane()
  setButtons()
})

tabKatas.addEventListener('click', () => applySideMode('katas'))
tabFiles.addEventListener('click', () => applySideMode('files'))

function showFileHint(message: string): void {
  fileHint.textContent = message
  fileHint.hidden = false
}

function createFromFileInput(): void {
  const name = newFileName.value.trim()
  if (!name) return
  const error = fileStore.create(name)
  if (error) {
    showFileHint(error)
    return
  }
  newFileName.value = ''
  fileHint.hidden = true
  // setActive() (inside create) emits change → list rerendered, editor synced
}

btnCreate.addEventListener('click', createFromFileInput)
newFileName.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') {
    e.preventDefault()
    createFromFileInput()
  }
})

// ── import: upload button, picker and drag-and-drop ──────────────────────────

function looksBinary(text: string): boolean {
  const sample = text.slice(0, 8192)
  return sample.includes('\u0000')
}

async function importFiles(list: FileList | File[]): Promise<void> {
  const files = [...list]
  if (files.length === 0) return
  let imported = 0
  const skipped: string[] = []
  for (const file of files) {
    let text: string
    try {
      text = await file.text()
    } catch {
      skipped.push(`${file.name} (unreadable)`)
      continue
    }
    if (looksBinary(text)) {
      skipped.push(`${file.name} (binary)`)
      continue
    }
    const error = fileStore.importFile(file.name, text)
    if (error) {
      skipped.push(`${file.name} (${error})`)
      continue
    }
    imported++
  }
  if (skipped.length > 0) showFileHint(`skipped ${skipped.length}: ${skipped.join('; ')}`)
  else fileHint.hidden = true
  if (imported > 0) panelLeft.classList.remove('drag-over')
}

btnUpload.addEventListener('click', () => uploadInput.click())
uploadInput.addEventListener('change', () => {
  void importFiles(uploadInput.files ?? [])
  uploadInput.value = '' // allow re-uploading the same file
})

// Drop targets: the sidebar imports; anywhere else is neutralised so the
// browser never navigates away from a missed drop.
for (const type of ['dragover', 'drop']) {
  window.addEventListener(type, (e) => e.preventDefault())
}
panelLeft.addEventListener('dragover', (e) => {
  e.preventDefault()
  panelLeft.classList.add('drag-over')
})
panelLeft.addEventListener('dragleave', () => panelLeft.classList.remove('drag-over'))
panelLeft.addEventListener('drop', (e) => {
  e.preventDefault()
  panelLeft.classList.remove('drag-over')
  void importFiles(e.dataTransfer?.files ?? [])
})

// ── workspace export ─────────────────────────────────────────────────────────

btnZip.addEventListener('click', () => {
  const entries = fileStore.names().map((name) => ({ name, content: fileStore.get(name) }))
  downloadBlob('kata-workspace.zip', makeZip(entries))
})

// ── indentation ──────────────────────────────────────────────────────────────

function savedIndent(): number {
  const stored = localStorage.getItem('kata.indent')
  return (INDENT_OPTIONS as readonly number[]).includes(Number(stored)) ? Number(stored) : INDENT_OPTIONS[1]
}

indentSelect.value = String(savedIndent())
indentSelect.addEventListener('change', () => {
  const width = Number(indentSelect.value)
  setIndentWidth(editor, width)
  localStorage.setItem('kata.indent', String(width))
})

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

function applySidebar(open: boolean): void {
  app.classList.toggle('sidebar-open', open)
  btnMenu.classList.toggle('open', open)
  btnMenu.setAttribute('aria-expanded', String(open))
  btnMenu.title = open ? 'Hide the kata browser' : 'Open the kata browser'
  localStorage.setItem('kata.sidebar', open ? 'open' : 'closed')
}

applySideMode(sideMode)
applySidebar(localStorage.getItem('kata.sidebar') !== 'closed')

// ── keyboard ─────────────────────────────────────────────────────────────────

window.addEventListener('keydown', (e) => {
  if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
    e.preventDefault()
    run()
    return
  }
  // Ctrl+S flushes the debounced workspace save immediately.
  if ((e.ctrlKey || e.metaKey) && e.key === 's') {
    e.preventDefault()
    fileStore.flush()
    return
  }
  // Esc stops a running program; while renaming it cancels the rename first
  // (handled in the input's own keydown listener).
  if (e.key === 'Escape' && phase === 'running') {
    e.preventDefault()
    stop()
    return
  }
  // Ctrl+C interrupts a running program, unless the user is copying text.
  if (e.ctrlKey && e.key === 'c' && phase === 'running') {
    const selection = window.getSelection()?.toString() ?? ''
    if (!selection) {
      e.preventDefault()
      stop()
    }
  }
})
