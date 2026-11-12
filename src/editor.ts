import { basicSetup, EditorView } from 'codemirror'
import { python } from '@codemirror/lang-python'
import { indentWithTab } from '@codemirror/commands'
import { keymap } from '@codemirror/view'
import { Decoration, ViewPlugin, ViewUpdate } from '@codemirror/view'
import { ChangeSpec, EditorState, Prec, Transaction, Range } from '@codemirror/state'
import { MAX_EDITOR_LINES, MAX_LINE_LEN } from './limits'

const DEFAULT_DOC = `# kata-runner
# Write your program below, then press Run (Ctrl+Enter).
# Lines are hard-limited to ${MAX_LINE_LEN} characters.
`

/**
 * Hard-split one line so no piece exceeds MAX_LINE_LEN. Breaks at the last
 * space within a small window before the limit when there is one, so split
 * points land between words rather than mid-identifier.
 */
function hardSplitLine(line: string): string {
  const parts: string[] = []
  let rest = line
  while (rest.length > MAX_LINE_LEN) {
    const head = rest.slice(0, MAX_LINE_LEN)
    const brk = head.lastIndexOf(' ')
    const cut = brk > 0 && brk >= MAX_LINE_LEN - 30 ? brk : MAX_LINE_LEN
    parts.push(rest.slice(0, cut))
    rest = rest[cut] === ' ' ? rest.slice(cut + 1) : rest.slice(cut)
  }
  parts.push(rest)
  return parts.join('\n')
}

function countNewlines(s: string): number {
  let n = 0
  for (let i = s.indexOf('\n'); i !== -1; i = s.indexOf('\n', i + 1)) n++
  return n
}

/** Keep everything up to and including the n-th newline (n = 0: first line only). */
function truncateAfterNewlines(s: string, n: number): string {
  if (n <= 0) {
    const i = s.indexOf('\n')
    return i === -1 ? s : s.slice(0, i)
  }
  let i = -1
  for (let k = 0; k < n; k++) {
    i = s.indexOf('\n', i + 1)
    if (i === -1) return s
  }
  return s.slice(0, i + 1)
}

/**
 * Enforces both hard limits:
 *  - line width (100): typing is blocked at the column, inserted/pasted
 *    multi-line text is auto-split so every piece fits, and structural edits
 *    that would join lines past the limit are rejected;
 *  - document height (2000 lines): typing/pasting beyond the cap is
 *    truncated — a paste keeps only the lines that fit.
 */
const limitFilter = EditorState.transactionFilter.of((tr: Transaction) => {
  if (!tr.docChanged) return tr

  // O(1) line count + O(lines) width scan, both bounded by MAX_EDITOR_LINES.
  let overWide = false
  for (let i = 1; i <= tr.state.doc.lines; i++) {
    if (tr.state.doc.line(i).length > MAX_LINE_LEN) {
      overWide = true
      break
    }
  }
  const tooTall = tr.state.doc.lines > MAX_EDITOR_LINES
  if (!overWide && !tooTall) return tr

  const fixes: ChangeSpec[] = []
  let repairable = true
  const startDoc = tr.startState.doc
  const startLines = startDoc.lines

  tr.changes.iterChanges((fromA, toA, _fromB, _toB, inserted) => {
    if (!repairable) return
    const text = inserted.length ? inserted.toString() : ''
    if (!text) {
      // a deletion caused the violation (joined an overlong line) → reject
      repairable = false
      return
    }
    const startLine = startDoc.lineAt(fromA)
    const endLine = startDoc.lineAt(toA)
    const prefix = startDoc.sliceString(startLine.from, fromA)
    const suffix = startDoc.sliceString(toA, endLine.to)

    if (!text.includes('\n')) {
      // typing / single-line insert: block at the width limit, never wrap;
      // this cannot change the document's line count.
      const allowed = MAX_LINE_LEN - (prefix.length + suffix.length)
      fixes.push({ from: fromA, to: toA, insert: text.slice(0, Math.max(0, allowed)) })
      return
    }

    // Paste (multi-line insert): honour the height cap, then rebuild the
    // whole joined region and hard-split it so every piece fits the width.
    const removedNewlines = fromA < toA ? countNewlines(startDoc.sliceString(fromA, toA)) : 0
    const allowedLines = Math.max(0, MAX_EDITOR_LINES - (startLines - removedNewlines))
    let t = text
    if (countNewlines(t) > allowedLines) t = truncateAfterNewlines(t, allowedLines)
    if (!t.includes('\n')) {
      // truncated down to a single line: width rule only, no lines added
      const allowed = MAX_LINE_LEN - (prefix.length + suffix.length)
      fixes.push({ from: fromA, to: toA, insert: t.slice(0, Math.max(0, allowed)) })
      return
    }
    let rebuilt = (prefix + t + suffix)
      .split('\n')
      .map(hardSplitLine)
      .join('\n')
    if (countNewlines(rebuilt) > allowedLines) {
      // width-splitting pushed past the height cap: keep the fitting head
      rebuilt = truncateAfterNewlines(rebuilt, allowedLines)
      fixes.push({ from: fromA, to: toA, insert: rebuilt.slice(prefix.length) })
      return
    }
    fixes.push({ from: fromA, to: toA, insert: rebuilt.slice(prefix.length, rebuilt.length - suffix.length) })
  })

  if (!repairable || fixes.length === 0) return [] // reject the transaction
  return fixes.map((f) => ({ changes: f }))
})

// Subtle highlight for anything that somehow ends up past column 100.
const overlengthMark = Decoration.mark({ class: 'cm-overlength' })

function buildOverlengthDecorations(view: EditorView): DecorationSet2 {
  const builder: Range<Decoration>[] = []
  for (const { from, to } of view.visibleRanges) {
    for (let pos = from; pos <= to; ) {
      const line = view.state.doc.lineAt(pos)
      if (line.length > MAX_LINE_LEN) {
        const start = Math.max(line.from + MAX_LINE_LEN, from)
        const end = Math.min(line.to, to)
        if (start < end) builder.push(overlengthMark.range(start, end))
      }
      pos = line.to + 1
    }
  }
  return Decoration.set(builder, true)
}

type DecorationSet2 = ReturnType<typeof Decoration.set>

const overlengthHighlight = ViewPlugin.fromClass(
  class {
    decorations: DecorationSet2
    constructor(view: EditorView) {
      this.decorations = buildOverlengthDecorations(view)
    }
    update(u: ViewUpdate) {
      if (u.docChanged || u.viewportChanged) this.decorations = buildOverlengthDecorations(u.view)
    }
  },
  { decorations: (v) => v.decorations },
)

export function createEditor(
  parent: HTMLElement,
  handlers: {
    onCodeChanged: (code: string) => void
    onRun: () => void
    onCursor: (pos: { line: number; col: number }) => void
  },
): EditorView {
  const view = new EditorView({
    parent,
    doc: localStorage.getItem('kata.editor') ?? DEFAULT_DOC,
    extensions: [
      // Runs before the default keymap so Ctrl+Enter never reaches the
      // "insert line" binding.
      Prec.high(
        keymap.of([
          {
            key: 'Mod-Enter',
            run: () => {
              handlers.onRun()
              return true
            },
          },
        ]),
      ),
      basicSetup, // line numbers, history, bracket matching, default keymap — not toggleable here by design
      python(),
      // deliberately no EditorView.lineWrapping: long lines scroll horizontally
      keymap.of([indentWithTab]),
      limitFilter,
      overlengthHighlight,
      EditorView.theme({
        '&': { height: '100%', fontSize: '13px' },
        '.cm-content': { fontFamily: 'ui-monospace, Menlo, Consolas, monospace' },
      }),
      EditorView.updateListener.of((u) => {
        if (u.docChanged) handlers.onCodeChanged(u.state.doc.toString())
        if (u.docChanged || u.selectionSet) {
          const head = u.state.selection.main.head
          const line = u.state.doc.lineAt(head)
          handlers.onCursor({ line: line.number, col: head - line.from + 1 })
        }
      }),
    ],
  })
  applyWidthLock(view)
  // The host changes size on window resizes AND on layout toggles (stacked ↔
  // side-by-side), which don't fire window resize events.
  const widthObserver = new ResizeObserver(debounce(() => applyWidthLock(view), 100))
  widthObserver.observe(view.dom.parentElement as Element)
  return view
}

// ── width lock ───────────────────────────────────────────────────────────────
// Lock the editor box to exactly 100 text columns when the pane fits them,
// dropping to 80 columns on a shrunk window; below that the editor stays
// fluid. Makes the hard line limit visible without horizontal scrolling.

function measureCharWidth(view: EditorView): number {
  // Prefer a real rendered line: probe spans resolve fonts slightly
  // differently from the editor's own text, which is enough to overflow.
  // .cm-line is a block element, so measure its *text* via a Range, not the
  // element box.
  const range = document.createRange()
  for (const line of view.dom.querySelectorAll('.cm-line')) {
    const len = (line.textContent ?? '').length
    if (len < 10) continue
    range.selectNodeContents(line)
    const width = range.getBoundingClientRect().width
    if (width > 0) return width / len
  }
  range.detach()
  const contentEl = view.dom.querySelector('.cm-content')
  if (!contentEl) return 0
  const cs = getComputedStyle(contentEl)
  const probe = document.createElement('span')
  probe.style.position = 'absolute'
  probe.style.visibility = 'hidden'
  probe.style.whiteSpace = 'pre'
  probe.style.fontFamily = cs.fontFamily
  probe.style.fontSize = cs.fontSize
  probe.style.fontWeight = cs.fontWeight
  probe.textContent = '0'.repeat(100)
  document.body.appendChild(probe)
  const width = probe.getBoundingClientRect().width / 100
  probe.remove()
  return width
}

function applyWidthLock(view: EditorView): void {
  const host = view.dom.parentElement
  if (!host || host.clientWidth === 0) return

  const charWidth = measureCharWidth(view)
  if (charWidth <= 0) return
  const gutters = view.dom.querySelector('.cm-gutters') as HTMLElement | null
  const gutterWidth = gutters ? gutters.offsetWidth : 0
  const available = host.clientWidth - gutterWidth
  const slack = 2 // caret + sub-pixel rounding

  let columns: number | null = null
  for (const n of [100, 80]) {
    if (available >= charWidth * n + slack) {
      columns = n
      break
    }
  }
  if (columns === null) {
    view.dom.style.maxWidth = ''
    return
  }

  let width = Math.round(gutterWidth + charWidth * columns + slack)
  view.dom.style.maxWidth = `${width}px`

  // The nominal font measurement can differ slightly from what the editor
  // actually renders; true up against the real scroller so a doc that fits
  // the chosen columns never horizontal-scrolls.
  let longest = 0
  for (const line of view.state.doc.iterLines()) longest = Math.max(longest, line.length)
  const scroller = view.dom.querySelector('.cm-scroller')
  if (scroller && longest <= columns) {
    for (let i = 0; i < 3; i++) {
      const over = scroller.scrollWidth - scroller.clientWidth
      if (over <= 0) break
      width += over + 1
      view.dom.style.maxWidth = `${width}px`
    }
  }
}

function debounce(fn: () => void, ms: number): () => void {
  let t: ReturnType<typeof setTimeout> | undefined
  return () => {
    clearTimeout(t)
    t = setTimeout(fn, ms)
  }
}
