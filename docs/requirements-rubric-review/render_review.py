"""Render the current requirement rows without replaying historical source inputs."""

import argparse
import json
import re
from pathlib import Path


HERE = Path(__file__).resolve().parent
REGISTER = HERE / 'requirements.json'
RENDERED = HERE / 'revised-requirements.md'
def render_row(row, friction):
    owner, client = friction[row['profile']]
    dependencies = ', '.join(row['dependencies']) or 'No requirement prerequisite'
    decisions = ', '.join(row['decisions']) or 'None recorded for this formulation'
    cases = ', '.join(f'[{case}](acceptance-tests.md#{case.lower()})' for case in row['tests'])
    return (
        '### ' + row['id'] + ' — ' + row['title'] + '\n\n'
        + row['requirement'] + '\n\n'
        + '**Disposition:** ' + row['disposition'] + '. ' + row['rationale'] + '\n\n'
        + '**Authority:** ' + row['authority'] + '. **Status:** ' + row['status'] + '.\n\n'
        + '**Rubric:** [' + row['profile'] + '](rubric-profiles.md#' + row['profile'] + '). '
        + '**Owner friction:** ' + owner + ' **Client friction:** ' + client + '\n\n'
        + '**Depends on:** ' + dependencies + '. **Unresolved decisions:** ' + decisions + '.\n\n'
        + '**Acceptance cases:** ' + cases + '. Product execution: **NOT RUN**.\n'
    )


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--write', action='store_true', help='Update the rendered rows; default only checks parity')
    args = parser.parse_args()
    register = json.loads(REGISTER.read_text())
    current = RENDERED.read_text()
    expected = current
    by_id = {row['id']: row for row in register['requirements']}
    # October 2 technical rows carry reviewed, row-specific prose not encoded in
    # the older generator. Touch only rows named in owner or dated PM decisions.
    approved = [rid for decision in register.get('owner_scope_decisions', [])
                for rid in decision['accepted_amendment_ids']]
    pm_rows = [rid for decision in register.get('pm_reconciliation_decisions', [])
               for rid in decision.get('rendered_ids', [])]
    targeted = list(dict.fromkeys(approved + pm_rows))
    for rid in targeted:
        if rid not in by_id:
            raise SystemExit('Targeted row missing from structured register: ' + rid)
        pattern = re.compile(r'^### ' + re.escape(rid) + r' — [^\n]+\n.*?(?=\n\n### |\n\n## |\Z)', re.M | re.S)
        expected, count = pattern.subn(lambda _: render_row(by_id[rid], register['friction']), expected, count=1)
        if count != 1:
            raise SystemExit('Targeted row missing from rendered register: ' + rid)
    if args.write:
        RENDERED.write_text(expected)
        print('Rendered ' + str(len(targeted)) + ' targeted rows from ' + register['version'])
        return
    if current != expected:
        raise SystemExit('Targeted rendered rows differ from requirements.json; review and run render_review.py --write')
    print('Targeted rendered rows match ' + register['version'])


if __name__ == '__main__':
    main()
