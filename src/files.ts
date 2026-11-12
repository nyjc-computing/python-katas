// Virtual file system: text files persisted to localStorage, edited in the
// single editor and synced into Pyodide's MEMFS on every run (so open() and
// imports between .py files work). Files live in this browser only.

import {
  ALLOWED_FILE_EXTS,
  FILE_SAVE_DEBOUNCE_MS,
  MAX_FILES,
  MAX_FILE_CHARS,
  MAX_TOTAL_FILE_CHARS,
} from './limits'

const FILES_KEY = 'kata.files'
const ACTIVE_KEY = 'kata.active'
const LEGACY_EDITOR_KEY = 'kata.editor'
const DEFAULT_FILE = 'main.py'

export type SaveState = 'saved' | 'dirty'

export function extOf(name: string): string {
  const i = name.lastIndexOf('.')
  return i === -1 ? '' : name.slice(i + 1).toLowerCase()
}

export function isAllowedFileName(name: string): boolean {
  // flat namespace, sane characters, known text extension
  if (!/^[A-Za-z0-9][A-Za-z0-9._-]*$/.test(name)) return false
  return (ALLOWED_FILE_EXTS as readonly string[]).includes(extOf(name))
}

export class FileStore {
  private files: Record<string, string>
  private active: string
  private dirty = new Set<string>()
  private timer: ReturnType<typeof setTimeout> | undefined
  private changeListeners: Array<() => void> = []
  private stateListeners: Array<(s: SaveState) => void> = []

  constructor() {
    const stored = localStorage.getItem(FILES_KEY)
    if (stored) {
      this.files = JSON.parse(stored) as Record<string, string>
    } else {
      // one-time migration from the single-file autosave
      const legacy = localStorage.getItem(LEGACY_EDITOR_KEY)
      this.files = { [DEFAULT_FILE]: legacy ?? '' }
      localStorage.removeItem(LEGACY_EDITOR_KEY)
    }
    const storedActive = localStorage.getItem(ACTIVE_KEY)
    this.active = storedActive && storedActive in this.files ? storedActive : DEFAULT_FILE
    if (!(this.active in this.files)) {
      this.active = this.names()[0] ?? DEFAULT_FILE
      this.files[this.active] = this.files[this.active] ?? ''
    }
    this.persist()
  }

  names(): string[] {
    return Object.keys(this.files).sort((a, b) =>
      a === DEFAULT_FILE ? -1 : b === DEFAULT_FILE ? 1 : a.localeCompare(b),
    )
  }

  get(name: string): string {
    return this.files[name] ?? ''
  }

  activeName(): string {
    return this.active
  }

  all(): Record<string, string> {
    return { ...this.files }
  }

  setActive(name: string): void {
    if (!(name in this.files)) return
    this.active = name
    this.persist()
    this.emitChange()
  }

  /** Content updates from the editor; capped, debounced persistence. */
  write(name: string, content: string): void {
    if (!(name in this.files)) return
    const capped = content.length > MAX_FILE_CHARS ? content.slice(0, MAX_FILE_CHARS) : content
    if (this.files[name] === capped) return
    this.files[name] = capped
    this.markDirty()
  }

  /** Returns an error message, or null on success. */
  create(name: string): string | null {
    if (!isAllowedFileName(name)) {
      return `unsupported file name — text files only: ${ALLOWED_FILE_EXTS.join(', ')}`
    }
    if (name in this.files) return 'a file with that name already exists'
    if (Object.keys(this.files).length >= MAX_FILES) return `file limit reached (${MAX_FILES} files)`
    if (this.totalChars() >= MAX_TOTAL_FILE_CHARS) return 'storage budget reached'
    this.files[name] = ''
    this.setActive(name)
    return null
  }

  remove(name: string): void {
    if (!(name in this.files)) return
    delete this.files[name]
    this.dirty.delete(name)
    if (Object.keys(this.files).length === 0) this.files[DEFAULT_FILE] = ''
    if (!(this.active in this.files)) this.active = this.names()[0] ?? DEFAULT_FILE
    this.persist()
    this.emitChange()
  }

  flush(): void {
    if (this.timer) {
      clearTimeout(this.timer)
      this.timer = undefined
      this.persistNow()
    }
  }

  onChange(cb: () => void): void {
    this.changeListeners.push(cb)
  }

  onSaveState(cb: (s: SaveState) => void): void {
    this.stateListeners.push(cb)
  }

  private totalChars(): number {
    let total = 0
    for (const c of Object.values(this.files)) total += c.length
    return total
  }

  private markDirty(): void {
    this.dirty.add(this.active)
    for (const cb of this.stateListeners) cb('dirty')
    if (!this.timer) {
      this.timer = setTimeout(() => {
        this.timer = undefined
        this.persistNow()
      }, FILE_SAVE_DEBOUNCE_MS)
    }
  }

  private persistNow(): void {
    this.persist()
    this.dirty.clear()
    for (const cb of this.stateListeners) cb('saved')
  }

  /** Structural changes (create/remove/switch) persist immediately. */
  private persist(): void {
    localStorage.setItem(FILES_KEY, JSON.stringify(this.files))
    localStorage.setItem(ACTIVE_KEY, this.active)
  }

  private emitChange(): void {
    for (const cb of this.changeListeners) cb()
  }
}
