import { cpSync, existsSync, mkdirSync } from 'node:fs'

// Copies the core Pyodide distribution from node_modules into public/pyodide/
// so the app is fully self-hosted (no CDN, school-network friendly, and it
// lets the host send COOP/COEP headers for SharedArrayBuffer).
//
// Only core files are copied; extra packages (numpy, micropip, …) can be
// added to KEEP later — micropip will be needed for the LSP work (pyflakes,
// jedi).

const KEEP = [
  'pyodide.mjs',
  'pyodide.asm.mjs',
  'pyodide.asm.wasm',
  'python_stdlib.zip',
  'pyodide-lock.json',
]

const src = 'node_modules/pyodide'
const dest = 'public/pyodide'

mkdirSync(dest, { recursive: true })

for (const file of KEEP) {
  const from = `${src}/${file}`
  if (!existsSync(from)) {
    console.error(`Missing ${from} — run "npm install" first.`)
    process.exit(1)
  }
  cpSync(from, `${dest}/${file}`)
  console.log(`copied ${file}`)
}

console.log(`Pyodide vendored into ${dest}/`)
