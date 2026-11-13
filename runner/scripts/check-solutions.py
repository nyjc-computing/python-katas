#!/usr/bin/env python3
"""PEP 8 gate for the kata solutions embedded in python-katas-by-feature.md.

Extracts every ```python fence (one per kata, in document order — the sync
step in CI has already validated the structure) and checks each with
pycodestyle, using its default PEP 8 rules. Run it locally with:

    pip install pycodestyle
    python3 scripts/check-solutions.py
"""
import re
import sys
import tempfile
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
MD_PATH = ROOT / 'python-katas-by-feature.md'


def main():
    try:
        import pycodestyle
    except ImportError:
        print('pycodestyle is required: pip install pycodestyle', file=sys.stderr)
        return 1

    fences = re.findall(r'```python\n(.*?)```', MD_PATH.read_text(), re.S)
    if not fences:
        print(f'no solutions found in {MD_PATH}', file=sys.stderr)
        return 1

    with tempfile.TemporaryDirectory() as tmp:
        paths = []
        for n, code in enumerate(fences, start=1):
            path = Path(tmp) / f'kata-{n:03d}.py'
            # the regex capture already ends with the fence's trailing newline
            path.write_text(code)
            paths.append(str(path))
        guide = pycodestyle.StyleGuide()
        report = guide.check_files(paths)

    if report.total_errors:
        print(
            f'{report.total_errors} PEP 8 error(s) across {len(fences)} solutions '
            '(see file/line above; kata number is in the filename)',
            file=sys.stderr,
        )
        return 1
    print(f'{len(fences)} solutions: PEP 8 clean')
    return 0


if __name__ == '__main__':
    sys.exit(main())
