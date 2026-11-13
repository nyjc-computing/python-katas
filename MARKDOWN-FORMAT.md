# Kata markdown format

`python-katas-by-feature.md` is the source of truth for the kata corpus.
`build/katas.json` is **generated** from it by `runner/scripts/sync-katas.mjs`
and is what the runner app actually loads. CI re-runs the sync on every
merge and fails if the markdown no longer parses, or if the committed
`build/katas.json` is stale.

If CI fails with a format error, this page is the contract. Read it before
"fixing" the parser instead — the parser is deliberately strict.

## Editing workflow

```sh
$EDITOR python-katas-by-feature.md
cd runner && npm run sync     # re-parses, re-derives tests, rewrites build/katas.json
git add python-katas-by-feature.md build/katas.json
git commit -m "..."
```

`npm run sync` needs `python3` on PATH (it executes solutions to derive the
auto-tests; see below). Commit the markdown and the regenerated JSON in the
same commit.

## Document grammar

```
# Part A — Core language              ← 5 parts, letters A–E
## 1. Functions & type conversion     ← sections, numbered sequentially 1..20
<intro prose, optional — ignored>

### 1. Square of a number *(original Question 23)*
                         └── optional italic provenance suffix

**Features:** `def`, `return`, `**` operator

**Question:**
<verbatim question text — may span many paragraphs>

**Hints:**                            ← OPTIONAL (kata 23 has none)
<one or more hints, separated by blank lines>

**Solution:**
```python
<runnable Python 3 program>
```
```

Between katas and sections, `---` separators and intro prose are allowed and
ignored. The preamble before the first `# Part` (title, contents, fidelity
notes) is ignored.

## Rules the parser enforces

Each rule violation fails the sync (and CI) with the kata number in the
message:

1. **Heading order** — katas are numbered `### N.` sequentially from 1 with
   no gaps or repeats; sections are numbered sequentially from 1.
2. **Label order** — inside a kata, `**Features:**`, `**Question:**`,
   [`**Hints:**`], `**Solution:**` appear exactly once each, in that order.
   The labels are exact: `**Hint:**`, `**hints:**`, `**Hints**` without the
   colon are all errors, not variants.
3. **Exactly one solution block** — the `**Solution:**` section contains
   exactly one fenced code block, tagged `python`. Code fences elsewhere in
   a kata body are an error.
4. **Non-empty content** — features line, question, and the solution block
   must be non-empty.
5. **Unique titles** — titles must be unique (they feed the stable slug ids;
   a duplicate would collide).

## Field semantics

| Field      | Required | How it's parsed |
|------------|----------|-----------------|
| `id`       | derived  | `<nnn>-<slug>` from the heading number + title (e.g. `001-square-of-a-number`). **Stable identity** — used as the key for learner progress in the app. Display numbers may shift when katas are inserted; ids must not. |
| `n`        | derived  | The `### N.` heading number, display order. |
| `title`    | required | Heading text, minus any `*(…)*` suffix. Verbatim. |
| `origin`   | optional | The italic `*(original Question M)*` heading suffix, verbatim. |
| `features` | required | The `**Features:**` line, split on commas **outside backticks**; backticks stripped. Backticks are styling — `for` with `range()` parses as two features. |
| `question` | required | Verbatim markdown between the Question and Hints/Solution labels. Sample I/O stays **inline prose**: the parser never interprets it, so reformatting it can't break anything — but don't move it out, it's what learners read. |
| `hints`    | optional | Split on blank lines into an array, revealed progressively in the app. |
| `solution` | required | The python block, verbatim, runnable as a standalone program. **Stays in the markdown only** — the sync executes it to derive tests and never copies it into `build/katas.json`. |
| `tests`    | derived  | See below. |

## Auto-derived tests

At sync time each solution is **executed** locally (`python3`, empty stdin,
10 s timeout). If it runs cleanly and deterministically, its captured stdout
is stored as `tests: [{ stdin: "", stdout: "…" }]` — the app uses these to
auto-check learner programs by comparing console output.

Solutions are **excluded** from test derivation (and get `tests: null`,
meaning "checked by eye") when they:

- call `input()` — the stdin to feed isn't derivable from the markdown
  (authoring per-kata stdin is future work), or
- use `random` or `timeit` — output isn't reproducible.

The sync prints which katas were skipped and why. To make an input-reading
kata auto-checkable, the markdown format itself would need to grow a
machine-readable stdin field — don't encode stdin in the prose and expect it
to be picked up.

**Solutions never ship.** `build/katas.json` omits the solution entirely —
it is executed for test derivation, then dropped. The JSON is what learners'
browsers download; the markdown is the maintainer-facing document.

## Solution style rules

Solutions are the reference programs learners are measured against, so they
carry style expectations beyond parseability. CI enforces the mechanical
subset (`python3 scripts/check-solutions.py`, pycodestyle with default
rules); the rest is reviewed by hand.

- **PEP 8, enforced by CI.** snake_case functions/variables, PascalCase
  classes, two blank lines between top-level definitions, spaces around
  operators. No line over 79 characters.
- **Branching best practice.** Loop exit belongs in the loop condition, not
  a mid-body `break` — reading a sentinel (e.g. until a blank line) uses the
  read-then-loop pattern (`line = input()` before `while line != '':`), and
  search loops use a flag or an early `return` from a function. `break` is
  acceptable only when there is genuinely no cleaner structure. Early
  `return` beats `elif`/`else` after a return; `else: pass` branches are
  never written.
- **Modern Python 3 style.** Plain `class X:` bases (no `(object)`),
  `super().__init__()`, no redundant `float()`/`list()`/`dict()` constructor
  calls, no unused imports.
- **No f-strings.** `%`-formatting is kept deliberately, matching the
  corpus's vintage and the feature level of early katas.
- **Solutions stay at the kata's feature level.** A rewrite shouldn't use a
  construct the kata hasn't taught (e.g. no comprehensions in a basic-`for`
  kata) — with the exception of the PEP 8 rules above, which apply
  everywhere.
- **Behavior must not change.** The sync derives the auto-check tests by
  executing solutions, and the questions' verbatim sample outputs describe
  the solutions' behavior — a solution edit that changes stdout or exit
  status silently re-bases what learners are checked against. Verify with
  `npm run sync` before committing: the derived-tests count and skip list
  must be unchanged.
