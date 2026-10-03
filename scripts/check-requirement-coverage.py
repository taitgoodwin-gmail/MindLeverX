#!/usr/bin/env python3
"""Validate the existing status crosswalk inventory, never product acceptance."""
import collections
import json
from pathlib import Path
import re
import subprocess
import sys

ROOT = Path(__file__).resolve().parents[1]
STATUSES = {'R': 'Review draft; not an acceptance of implementation or disputed scope',
            'P': 'Proposal; not implementation authorization'}
CODE = ('Full', 'Partial', 'None', 'Unknown')
TEST = ('Present', 'Partial', 'Absent')
EXECUTION = ('PASS', 'FAIL', 'BLOCKED', 'NOT RUN', 'Unknown')


def validate(text):
    def require(condition, message):
        if not condition:
            raise ValueError(message)
    def git_file(revision, path):
        key = (revision, path)
        if key not in files:
            result = subprocess.run(['git', 'show', f'{revision}:{path}'], cwd=ROOT,
                                    text=True, capture_output=True)
            require(result.returncode == 0, f'BLOCKED: pinned Git source unavailable: {revision}:{path}')
            files[key] = result.stdout
        return files[key]
    files = {}
    revisions = []
    for label in ('Audit code revision', 'Requirement source revision'):
        match = re.search(re.escape(label) + r': `([a-f0-9]{40})`', text)
        require(match is not None, f'Missing {label}')
        revisions.append(match.group(1))
    code_sha, source_sha = revisions
    source_path = 'docs/requirements-rubric-review/requirements.json'
    source = json.loads(git_file(source_sha, source_path))['requirements']
    expected = {r['id']: r for r in source}
    require(len(source) == len(expected) == 105, 'Expected 105 unique source rows')
    branch_rows = json.loads(git_file(code_sha, source_path))['requirements']
    require(len(branch_rows) == 97, 'Expected 97 audited-code register rows')
    require(all(r == expected.get(r['id']) for r in branch_rows), 'Shared register semantics changed')
    require(len(set(expected) - {r['id'] for r in branch_rows}) == 8, 'Expected eight main-only proposals')
    authorities = dict(re.findall(r'^- \*\*(A\d+)\*\*: (.+)$', text, re.M))
    require(all(value in text for value in STATUSES.values()), 'Source status legend missing')
    rows = {}
    for line in text.splitlines():
        if not re.match(r'^\| \[(?:MLX3|PROP)-', line):
            continue
        cells = [cell.strip() for cell in line.strip('|').split('|')]
        require(len(cells) == 8, 'Malformed crosswalk row')
        rid = re.match(r'\[([^]]+)\]', cells[0]).group(1)
        require(rid not in rows and rid in expected, f'Duplicate/unknown ID: {rid}')
        row = expected[rid]
        source_link = re.search(r'\]\(https://github.com/taitgoodwin-gmail/MindLeverX/blob/([a-f0-9]{40})/([^#]+)#L(\d+)\)', cells[0])
        require(source_link is not None, f'Missing source link: {rid}')
        sha, path, number = source_link.groups()
        require(sha == source_sha and path == source_path, f'Incorrect source revision/path: {rid}')
        source_lines = git_file(sha, path).splitlines()
        require(0 < int(number) <= len(source_lines), f'Invalid source line: {rid}')
        require(f'"id": "{rid}"' in source_lines[int(number)-1], f'Source link points to wrong row: {rid}')
        require(cells[0].endswith(' — ' + row['title']), f'Title mismatch: {rid}')
        require(STATUSES.get(cells[1]) == row['status'], f'Status mismatch: {rid}')
        require(authorities.get(cells[2]) == row['authority'], f'Authority mismatch: {rid}')
        require(cells[3] in CODE and cells[4] in TEST and cells[5] in EXECUTION, f'Invalid classification: {rid}')
        require(re.findall(r'\[(T\d+)\]', cells[6]) == row['tests'], f'Case mapping mismatch: {rid}')
        require('C: [' in cells[7] and '; T: ' in cells[7], f'Missing inspected boundary: {rid}')
        if cells[4] != 'Absent':
            require('; T: [' in cells[7], f'Missing executable test evidence: {rid}')
        rows[rid] = cells
    require(set(rows) == set(expected), f'Row identity mismatch; missing={sorted(set(expected)-set(rows))}')
    summaries = {}
    for group in ('Review draft', 'Proposal', 'Total'):
        selected = [v for rid, v in rows.items() if group == 'Total' or rid.startswith('MLX3-' if group == 'Review draft' else 'PROP-')]
        counts = [len(selected)]
        for column, options in ((3, CODE), (4, TEST), (5, EXECUTION)):
            counter = collections.Counter(row[column] for row in selected)
            counts.extend(counter[option] for option in options)
        match = re.search(r'^\| ' + re.escape(group) + r' \| (.+) \|$', text, re.M)
        require(match is not None, f'Missing summary: {group}')
        require([int(x.strip()) for x in match.group(1).split('|')] == counts, f'Total mismatch: {group}')
        summaries[group] = counts
    cases_path = 'docs/requirements-rubric-review/acceptance-tests.md'
    cases = dict(re.findall(r'^## (T\d+)\n(.*?)(?=^## |\Z)', git_file(source_sha, cases_path), re.M | re.S))
    require(set(cases) == {f'T{i:02d}' for i in range(1, 48)}, 'Expected 47 canonical families')
    family_rows = {}
    for line in text.splitlines():
        if not re.match(r'^\| \[T\d+\]', line):
            continue
        cells = [cell.strip() for cell in line.strip('|').split('|')]
        family = re.match(r'\[(T\d+)\]', cells[0]).group(1)
        require(family not in family_rows, 'Duplicate family')
        require(cells[1] == 'NOT RUN' and '**Actual:** NOT RUN' in cases[family], f'Unsubstantiated canonical execution: {family}')
        require(cells[2].split(', ') == [r['id'] for r in source if family in r['tests']], f'Family membership mismatch: {family}')
        family_rows[family] = cells
    require(set(family_rows) == set(cases), 'Missing family mapping')
    for sha, path, number in re.findall(r'https://github.com/taitgoodwin-gmail/MindLeverX/blob/([a-f0-9]{40})/([^\s)#]+)#L(\d+)', text):
        require(sha in revisions, 'Unpinned evidence revision')
        require(0 < int(number) <= len(git_file(sha, path).splitlines()), f'Invalid evidence locator: {path}:{number}')
    return {'boundary': 'inventory and arithmetic only; not semantic or acceptance verification',
            'rows': len(rows), 'canonical_families': len(family_rows), 'summary_columns': ['Rows', *CODE, *('Tests '+x for x in TEST), *('Acceptance '+x for x in EXECUTION)], 'summaries': summaries}


if __name__ == '__main__':
    try:
        text = (ROOT / 'docs/implementation-status.md').read_text()
        result = validate(text)
        if '--self-test' in sys.argv:
            mutations = [text.replace('| Review draft | 86 |', '| Review draft | 85 |', 1),
                         re.sub(r'^\| \[MLX3-INV-001\].*\n', '', text, count=1, flags=re.M),
                         text.replace('| R | A1 |', '| P | A1 |', 1),
                         text.replace('| NOT RUN | MLX3-', '| PASS | MLX3-', 1)]
            for mutated in mutations:
                try:
                    validate(mutated)
                except ValueError:
                    continue
                raise ValueError('Negative inventory mutation incorrectly passed')
            result['negative_validator_checks'] = 4
        print(json.dumps(result, indent=2))
    except (ValueError, KeyError, json.JSONDecodeError) as error:
        print(f'FAIL: {error}', file=sys.stderr)
        sys.exit(1)
