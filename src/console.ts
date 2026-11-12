import { CONSOLE_TRIM_TO_CHARS, MAX_CONSOLE_CHARS, MAX_CONSOLE_NODES } from './limits'

/**
 * Terminal-style output pane. One open "current line" is kept; writes append
 * to it (or continue after it), newline characters advance to a new line.
 * This reproduces terminal semantics: a prompt written without a newline
 * ("Enter n: ") and the echoed user input end up on the same visual line.
 *
 * Bounded: rendered volume is capped at MAX_CONSOLE_CHARS (trimmed toward
 * CONSOLE_TRIM_TO_CHARS) with MAX_CONSOLE_NODES as a secondary guard, so a
 * runaway print loop can't grow the DOM without limit.
 */
export type ConsoleStyle = '' | 'stderr' | 'status' | 'echo'

export class Console {
  private readonly root: HTMLElement
  private readonly linesEl: HTMLElement
  private readonly inputRow: HTMLElement
  private readonly input: HTMLInputElement
  private line: HTMLDivElement | null = null
  private span: HTMLSpanElement | null = null
  private spanClass: ConsoleStyle = ''
  private acceptingInput = false
  private renderedChars = 0
  private readonly nodeChars = new WeakMap<HTMLDivElement, number>()

  constructor(
    root: HTMLElement,
    private readonly onInputLine: (line: string) => void,
    private readonly onEof?: () => void,
  ) {
    this.root = root
    this.linesEl = root
    this.inputRow = document.querySelector('#console-input-row')!
    this.input = document.querySelector('#console-input') as HTMLInputElement

    this.input.addEventListener('keydown', (e) => {
      // Ctrl+D on an empty line = end-of-input (terminal convention); a
      // non-empty line deletes forward instead, so the guard on value.
      if (e.ctrlKey && e.key === 'd' && this.acceptingInput && this.input.value === '') {
        e.preventDefault()
        this.write('<EOF>\n', 'status')
        this.endInput()
        this.onEof?.()
        return
      }
      if (e.key === 'Enter' && this.acceptingInput) {
        const value = this.input.value
        this.input.value = ''
        this.write(value + '\n', 'echo')
        this.endInput()
        this.onInputLine(value)
      }
    })

    root.addEventListener('click', () => {
      if (this.acceptingInput) this.input.focus()
    })
  }

  /** Append text; '\n' advances to a fresh line (terminal semantics). */
  write(text: string, cls: ConsoleStyle = ''): void {
    // Fast path for floods: a large multi-line chunk becomes ONE node (the
    // lines are pre-wrap styled) instead of thousands of divs, which starved
    // the main thread and stopped Stop from ever landing.
    const cut = text.lastIndexOf('\n')
    if (cut > 200) {
      const head = text.slice(0, cut + 1)
      const div = document.createElement('div')
      div.className = 'console-line' + (cls ? ' ' + cls : '')
      div.textContent = head
      this.nodeChars.set(div, head.length)
      this.renderedChars += head.length
      this.linesEl.appendChild(div)
      this.line = null
      this.span = null
      const tail = text.slice(cut + 1)
      if (tail) this.writeSmall(tail, cls)
      this.trim()
      this.scrollToBottom()
      return
    }
    this.writeSmall(text, cls)
    this.trim()
    this.scrollToBottom()
  }

  private writeSmall(text: string, cls: ConsoleStyle): void {
    const parts = text.split('\n')
    for (let i = 0; i < parts.length; i++) {
      if (i > 0) {
        this.line = null
        this.span = null
      }
      const seg = parts[i]
      if (!this.line) {
        this.line = document.createElement('div')
        this.line.className = 'console-line'
        this.nodeChars.set(this.line, 0)
        this.linesEl.appendChild(this.line)
      }
      if (!seg) continue
      if (!this.span || this.spanClass !== cls) {
        this.span = document.createElement('span')
        if (cls) this.span.className = cls
        this.line.appendChild(this.span)
        this.spanClass = cls
      }
      this.span.textContent += seg
      this.nodeChars.set(this.line, (this.nodeChars.get(this.line) ?? 0) + seg.length)
      this.renderedChars += seg.length
    }
  }

  // Drop oldest output until the console is back inside its volume budget.
  // Chars are the primary bound (flood chunks hold thousands of lines each);
  // node count is a secondary guard for many tiny lines.
  private trim(): void {
    let guard = 0
    while (
      (this.renderedChars > MAX_CONSOLE_CHARS || this.linesEl.childElementCount > MAX_CONSOLE_NODES) &&
      guard++ < 10_000
    ) {
      const oldest = this.linesEl.firstElementChild as HTMLDivElement | null
      if (!oldest) break
      this.renderedChars -= this.nodeChars.get(oldest) ?? 0
      if (oldest === this.line) {
        this.line = null
        this.span = null
      }
      oldest.remove()
      if (this.renderedChars <= CONSOLE_TRIM_TO_CHARS && this.linesEl.childElementCount <= MAX_CONSOLE_NODES) {
        break
      }
    }
  }

  clear(): void {
    this.linesEl.innerHTML = ''
    this.line = null
    this.span = null
    this.renderedChars = 0
    this.endInput()
  }

  beginInput(): void {
    this.acceptingInput = true
    this.inputRow.hidden = false
    this.input.focus()
  }

  endInput(): void {
    this.acceptingInput = false
    this.inputRow.hidden = true
  }

  get waitingForInput(): boolean {
    return this.acceptingInput
  }

  focusInput(): void {
    if (this.acceptingInput) this.input.focus()
  }

  private scrollToBottom(): void {
    this.root.scrollTop = this.root.scrollHeight
  }
}
