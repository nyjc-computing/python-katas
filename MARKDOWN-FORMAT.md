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

### 1. Square of a number

**Skills:** function, arithmetic operators, output

**Question:**
<verbatim question text — may span many paragraphs>

**Files:**                            ← OPTIONAL — files shipped to the learner
`data.txt`                            ← file name, alone on its line, in backticks
```
<the file's contents, verbatim>
```

**Hints:**                            ← OPTIONAL
<one or more hints, separated by blank lines>

**Solution:**
```python
<runnable Python 3 program>
```
```

Between katas and sections, `---` separators and intro prose are allowed and
ignored. The preamble before the first `# Part` (title, contents) is ignored.
Kata titles must NOT carry the old `*(original Question N)*` provenance
suffix — original question numbering has been dropped from the corpus, and
the parser rejects it.

## Rules the parser enforces

Each rule violation fails the sync (and CI) with the kata number in the
message:

1. **Heading order** — katas are numbered `### N.` sequentially from 1 with
   no gaps or repeats; sections are numbered sequentially from 1.
2. **Label order** — inside a kata, `**Skills:**`, `**Question:**`,
   [`**Files:**`], [`**Hints:**`], `**Solution:**` appear exactly once each,
   in that order. The labels are exact: `**Hint:**`, `**hints:**`, `**File:**`,
   `**Hints**` without the colon are all errors, not variants. `**Skills:**`
   is an inline label — its content sits on the same line; the other labels
   stand alone.
3. **Code fences** — the `**Solution:**` section contains exactly one fenced
   block, tagged `python`. `**Question:**` may additionally carry untagged
   ``` blocks for sample input/output, and `**Files:**` uses them for file
   contents. Fences anywhere else (Hints, Skills, stray labels) are errors,
   and an unclosed fence fails the kata.
4. **Non-empty content** — skills line, question, and the solution block
   must be non-empty.
5. **Unique titles** — titles must be unique (they feed the stable slug ids;
   a duplicate would collide).
6. **Shipped files** — every `**Files:**` entry is a file name line
   followed by exactly one untagged fence. The name must be one the app
   accepts: a flat name (no folders) ending in `.py`, `.csv`, `.json`, `.md`,
   `.html`, `.css` or `.txt` — but not `main.py`, which is the learner's own
   program. Names are unique within the kata, and no file exceeds 200,000
   characters (the app silently drops larger ones).

## Field semantics

| Field      | Required | How it's parsed |
|------------|----------|-----------------|
| `id`       | derived  | `<nnn>-<slug>` from the heading number + title (e.g. `001-square-of-a-number`). **Stable identity** — used as the key for learner progress in the app. Display numbers may shift when katas are inserted; ids must not. |
| `n`        | derived  | The `### N.` heading number, display order. |
| `title`    | required | Heading text, minus any `*(…)*` suffix. Verbatim. |
| `skills`   | required | The `**Skills:**` line, split on commas. Every entry must be an exact string from the fixed vocabulary below — the sync fails on anything else, so typos can't silently become new tags. |
| `question` | required | Markdown between the Question and Files/Hints/Solution labels. Sample input/output is fenced (untagged ``` blocks); everything outside the fences is what learners read. |
| `hints`    | optional | Split on blank lines into an array, revealed progressively in the app. |
| `files`    | optional | `{ name: content }` from `**Files:**`. The fenced lines become the file's lines, each ending in a newline, as a real text file's do. Shipped to the learner (see below); `{}` when the kata declares none. |
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

A kata's shipped files are written next to the solution before it runs, so a
solution that opens `data.txt` derives tests exactly as it will run for the
learner.

## Shipping files with a kata

A program that reads a file needs the learner to have that file, and a new
kata's workspace holds only an empty `main.py`. Declare the file under
`**Files:**` and the app copies it into the learner's workspace the first
time they open the kata; it then shows in the Files tab beside `main.py`,
and `open()` finds it because the interpreter's working directory is the
workspace. From then on the copy is the learner's to edit — except that a
shipped file they delete is restored the next time the kata is opened, and
**Reset** restores all of them.

- **The question still has to show the data.** The app does not render
  `files` in the kata pane, so when the learner needs to see a file's
  contents — a short passage, or an excerpt of a larger file — quote them in
  a sample fence inside the question. Nothing checks the two against each
  other: copy the block verbatim.
- **Treat a shipped file like a title: don't change it after release.** A
  learner keeps the copy already in their workspace while the expected
  output is re-derived from the new one, so Verify fails on a kata they may
  have solved. If a file must change, change the title too — the refresh
  then treats it as a removed kata and an added one, and the learner starts
  the new one with the new file.

## Skill vocabulary

The `**Skills:**` line draws from this fixed list — nothing else is accepted.
Tags name the **skills a kata trains**, never the APIs its solution uses
(those were spoilers). 2–5 tags per kata, most central first.

| Group | Tags |
|---|---|
| Program structure | `function`, `input`, `output`, `data types`, `file IO` |
| Operators | `arithmetic operators`, `comparison operators`, `logical operators` |
| Control flow | `selection`, `fixed iteration`, `conditional iteration`, `sentinel loop`, `early return`, `recursion` |
| Iteration patterns | `indexed iteration`, `zipped iteration`, `window iteration`, `batched iteration`, `cartesian product` |
| Data structures | `tuple and list`, `dict`, `nested data structure`, `indexing`, `slicing`, `membership check` |
| Strings | `string methods`, `string formatting`, `tokenisation` |
| Comprehensions & transforms | `list comprehension`, `mapping`, `filtering` |
| Algorithmic patterns | `search`, `accumulator`, `ratchet`, `greedy`, `data validation` |
| Objects | `class`, `class attribute`, `inheritance`, `polymorphism`, `staticmethod` |
| Errors | `assert`, `exception raising`, `exception handling` |
| Standard library | `random numbers`, `math module`, `date and time`, `time measurement` |

Tags not yet used by any kata (`zipped`, `window`, `batched` iteration,
`greedy`, `ratchet`) are reserved for future katas — they
validate today so new exercises can adopt them without a vocabulary change.
Adding a *new* tag means adding it to `SKILL_GROUPS` in
`runner/scripts/sync-katas.mjs` and to this table, in the same commit.

## Question and hint conventions

- **Code expressions are backticked and PEP 8** — `` `dict.get()` ``,
  `` `[1, 2, 3]` ``, `` `n > 0` ``. Expressions inside backticks follow PEP 8
  spacing (`a + aa + aaa`, `dict[key] = value`, `(1, 2, 3, …)`).
- **Functions and methods carry terminal parentheses** — write
  `` `str.join()` `` not `str.join`; `range()`, `dict.items()`. Keywords,
  statements and operators don't: `if`, `for`, `assert expression`, `%`.
- **Sample input/output is fenced** — put each example input and its
  expected output in its own untagged ``` block inside the question,
  introduced by prose ("Suppose the following input is supplied…").
- **f-strings or `.format()`, never `%`-formatting.**
- **Banned constructs** (remove or rewrite the kata): `u"…"` literals,
  `unicode()` conversion, `# -*- coding -*-` declarations, `sort()`/
  `sorted()` and `itertools` as the skill under test (write the algorithm
  instead), set-based mathematics, dict/generator comprehensions, list
  comprehensions beyond 1-D, `map()`/`filter()`/`lambda`, the `operator`
  module, generators and `yield`.

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
- **f-strings or `.format()`** — `%`-formatting is banned corpus-wide
  (questions, hints and solutions).
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
