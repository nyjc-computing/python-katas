// Minimal STORE-only (uncompressed) zip writer — text files are tiny, so
// compression isn't worth a dependency. Produces a valid single-part archive:
// local file headers + data + central directory + end record.

// ── CRC-32 (IEEE 802.3, zip standard) ────────────────────────────────────────
const CRC_TABLE = (() => {
  const table = new Uint32Array(256)
  for (let n = 0; n < 256; n++) {
    let c = n
    for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1
    table[n] = c >>> 0
  }
  return table
})()

function crc32(data: Uint8Array): number {
  let c = 0xffffffff
  for (let i = 0; i < data.length; i++) c = CRC_TABLE[(c ^ data[i]) & 0xff] ^ (c >>> 8)
  return (c ^ 0xffffffff) >>> 0
}

// ── little-endian writers ────────────────────────────────────────────────────
function u16(view: DataView, offset: number, value: number): void {
  view.setUint16(offset, value, true)
}

function u32(view: DataView, offset: number, value: number): void {
  view.setUint32(offset, value, true)
}

export interface ZipEntry {
  name: string
  content: string
}

/** Build a zip archive of the given text entries; names must be ASCII-safe. */
export function makeZip(entries: ZipEntry[]): Blob {
  const encoder = new TextEncoder()

  // DOS timestamps have 2-second granularity; all files share one stamp.
  const now = new Date()
  const dosTime =
    (now.getHours() << 11) | (now.getMinutes() << 5) | Math.floor(now.getSeconds() / 2)
  const dosDate =
    ((now.getFullYear() - 1980) << 9) | ((now.getMonth() + 1) << 5) | now.getDate()

  const locals: Uint8Array[] = []
  const central: Uint8Array[] = []
  let offset = 0

  for (const entry of entries) {
    const nameBytes = encoder.encode(entry.name)
    const data = encoder.encode(entry.content)
    const crc = crc32(data)

    const local = new Uint8Array(30 + nameBytes.length + data.length)
    const lv = new DataView(local.buffer)
    u32(lv, 0, 0x04034b50) // local file header signature
    u16(lv, 4, 20) // version needed
    u16(lv, 6, 0) // flags
    u16(lv, 8, 0) // method: stored
    u16(lv, 10, dosTime)
    u16(lv, 12, dosDate)
    u32(lv, 14, crc)
    u32(lv, 18, data.length) // compressed size
    u32(lv, 22, data.length) // uncompressed size
    u16(lv, 26, nameBytes.length)
    u16(lv, 28, 0) // extra length
    local.set(nameBytes, 30)
    local.set(data, 30 + nameBytes.length)
    locals.push(local)

    const centralEntry = new Uint8Array(46 + nameBytes.length)
    const cv = new DataView(centralEntry.buffer)
    u32(cv, 0, 0x02014b50) // central directory signature
    u16(cv, 4, 20) // version made by
    u16(cv, 6, 20) // version needed
    u16(cv, 8, 0) // flags
    u16(cv, 10, 0) // method: stored
    u16(cv, 12, dosTime)
    u16(cv, 14, dosDate)
    u32(cv, 16, crc)
    u32(cv, 20, data.length)
    u32(cv, 24, data.length)
    u16(cv, 28, nameBytes.length)
    u16(cv, 30, 0) // extra
    u16(cv, 32, 0) // comment
    u16(cv, 34, 0) // disk number
    u16(cv, 36, 0) // internal attrs
    u32(cv, 38, 0) // external attrs
    u32(cv, 42, offset) // local header offset
    centralEntry.set(nameBytes, 46)
    central.push(centralEntry)

    offset += local.length
  }

  const centralSize = central.reduce((n, c) => n + c.length, 0)
  const end = new Uint8Array(22)
  const ev = new DataView(end.buffer)
  u32(ev, 0, 0x06054b50) // end of central directory
  u16(ev, 4, 0) // disk number
  u16(ev, 6, 0) // central dir disk
  u16(ev, 8, central.length)
  u16(ev, 10, central.length)
  u32(ev, 12, centralSize)
  u32(ev, 16, offset) // central dir offset
  u16(ev, 20, 0) // comment length

  return new Blob([...locals, ...central, end] as BlobPart[], { type: 'application/zip' })
}
