import { createReadStream, existsSync } from 'node:fs'
import path from 'node:path'
import { defineConfig, Plugin } from 'vite'

// Cross-origin isolation is what makes SharedArrayBuffer available, which the
// Pyodide worker needs both for the interrupt buffer (real Stop) and for
// blocking reads on stdin (interactive input()).
const isolationHeaders = {
  'Cross-Origin-Opener-Policy': 'same-origin',
  'Cross-Origin-Embedder-Policy': 'require-corp',
}

// Pyodide is vendored into public/pyodide/ so the built site is self-hosted.
// Vite's dev server refuses ESM imports of files inside public/ ("should not
// be imported from source code"), which breaks the worker's dynamic
// import of pyodide.mjs in dev (preview/build serve public/ raw and are
// unaffected). This middleware serves /pyodide/* raw before Vite's transform
// pipeline gets a look at it.
function servePyodideRaw(): Plugin {
  const MIME: Record<string, string> = {
    '.mjs': 'text/javascript',
    '.js': 'text/javascript',
    '.wasm': 'application/wasm',
    '.json': 'application/json',
    '.zip': 'application/zip',
  }
  return {
    name: 'serve-pyodide-raw',
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        const base = server.config.base.replace(/\/$/, '')
        const prefix = `${base}/pyodide/`
        const pathname = (req.url ?? '').split('?')[0]
        if (!pathname.startsWith(prefix)) return next()
        // basename() guards against path traversal
        const name = path.basename(pathname.slice(prefix.length))
        const file = path.resolve('public/pyodide', name)
        if (!existsSync(file)) {
          res.statusCode = 404
          return res.end('not found')
        }
        res.setHeader('Content-Type', MIME[path.extname(file)] ?? 'application/octet-stream')
        createReadStream(file).pipe(res)
      })
    },
  }
}

export default defineConfig({
  // GitHub Pages project sites serve under /python-kata/ — set PAGES_BASE in
  // the deploy workflow; everything else (dev, preview, CF Pages) uses '/'.
  base: process.env.PAGES_BASE || '/',
  server: { headers: isolationHeaders },
  preview: { headers: isolationHeaders },
  worker: { format: 'es' },
  build: { target: 'es2022' },
  plugins: [servePyodideRaw()],
})
