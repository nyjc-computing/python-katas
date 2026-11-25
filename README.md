# python-katas

The Computing department's Python kata corpus and its in-browser practice
environment, in one repo, deployed at
**https://nyjc-computing.github.io/python-katas/**.

## Layout

| Path | What |
|------|------|
| `python-katas-by-feature.md` | The 81 katas — **source of truth**. Human-authored, questions verbatim. See [MARKDOWN-FORMAT.md](MARKDOWN-FORMAT.md) before editing. |
| `build/` | Build artifacts, generated but committed. `katas.json` is the parsed corpus the app loads. |
| `runner/` | The practice app: CodeMirror 6 editor + Pyodide (CPython on WASM) in a worker. See [runner/README.md](runner/README.md). |
| `.github/workflows/` | CI (markdown parseability + app build) and GitHub Pages deploy. |

## Editing katas

Edit the markdown, then regenerate the JSON:

```sh
cd runner && npm run sync
git add python-katas-by-feature.md build/katas.json && git commit
```

CI re-parses the markdown on every merge and fails if the format is broken
or the committed JSON is stale. The format contract lives in
[MARKDOWN-FORMAT.md](MARKDOWN-FORMAT.md).

## Developing the runner

```sh
cd runner
npm install
npm run vendor:pyodide   # copies the Pyodide dist into public/pyodide/ (gitignored)
npm run sync             # writes ../build/katas.json (needs python3)
npm run dev              # vite dev server with COOP/COEP headers
```

## Deployment

Pushing to `main` runs the deploy workflow: parse check → app build (with
`PAGES_BASE=/python-katas/`, since project Pages serve under a sub-path) →
GitHub Pages. The repo must be **public** — GitHub only serves Pages for
private repos on paid plans.

Cloudflare Pages / Netlify work too: `wrangler pages deploy runner/dist`
(the `runner/public/_headers` file provides COOP/COEP natively). nginx
needs the two isolation headers set manually — see runner/README.md.
