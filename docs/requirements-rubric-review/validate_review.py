"""Read-only coverage/coherence checks for the review package, not product acceptance."""
import argparse
import hashlib
import json
import re
from collections import Counter
from pathlib import Path

parser = argparse.ArgumentParser(description=__doc__)
parser.add_argument('--structure-only', action='store_true', help='Check portable document structure only; do not certify source freshness.')
args = parser.parse_args()
HERE = Path(__file__).resolve().parent
data = json.loads((HERE/'requirements.json').read_text())
rows = data['requirements']
errors = []
blockers = []
def check(ok, message):
    if not ok:
        errors.append(message)

ids = [r['id'] for r in rows]
check(len(ids)==len(set(ids)), 'Duplicate requirement ID')
source_ids = set()
represented={r['id'] for r in rows if r['source']}
# External historical sources are prerequisites for reconciliation, not for
# checking the portable package. Never update their hashes to force a pass.
source_texts = {}
if not args.structure_only:
    for label, source in data['source_manifest'].items():
        path = Path(source['path'])
        # Project sources follow this checkout; archived desktop inputs remain
        # at their recorded locations. The original manifest is preserved.
        marker = '/MindLeverX Build/'
        if marker in str(path):
            path = HERE.parents[1] / str(path).split(marker, 1)[1]
        try:
            raw = path.read_bytes()
        except OSError:
            blockers.append('Source unavailable: ' + label)
            continue
        if hashlib.sha256(raw).hexdigest() != source['sha256']:
            blockers.append('Source changed since review: ' + label)
            continue
        source_texts[label] = raw.decode('utf-8')
    if all(label in source_texts for label in ['V4', 'V5']):
        for label in ['V4', 'V5']:
            pattern = r'^\| (MLX3-[A-Z]+-\d{3}) \|' if label=='V4' else r'^\| (MLX3-SVC-\d{3}) \| [^|]+ \| [^|]+ \| [^|]+ \|$'
            source_ids.update(re.findall(pattern, source_texts[label], re.M))
        check(len(source_ids)==86, 'Source count differs from 86')
        check(represented==source_ids, 'Missing or invented source IDs: '+str(source_ids^represented))
check(len(rows)==97,'Total draft rows differs from 97')
sheet=json.loads((HERE/'live-sheet-snapshot.json').read_text())['sheets']
live_ids={r[0] for r in sheet['Evidence and MVP Review'] if r and re.fullmatch(r'MLX3-[A-Z]+-\d{3}',str(r[0]))}
legacy_proposals={r[0] for r in sheet['Proposed additions'] if r and str(r[0]).startswith('PROP-')}
check(len(live_ids)==86 and live_ids==represented,'Live review ID coverage differs')
check(len(legacy_proposals)==6 and legacy_proposals <= set(ids),'Existing provisional IDs omitted')
original_sheet={r[1]:r for r in sheet['Requirements'] if len(r)>3 and re.fullmatch(r'MLX3-[A-Z]+-\d{3}',str(r[1]))}
check(len(original_sheet)==78,'Live original requirements count differs')
for r in rows:
    if r['id'] in original_sheet:
        check(original_sheet[r['id']][3].strip()==r['source']['original'].strip(),r['id']+' live original wording differs from V4; reconcile explicitly')

cases = (HERE/'acceptance-tests.md').read_text()
case_ids=set(re.findall(r'^## (T\d{2})$',cases,re.M))
decision_text=(HERE/'decisions-needed.md').read_text()
decisions=set(re.findall(r'^\| (D\d{2}) \|',decision_text,re.M))
for r in rows:
    check(bool(r['requirement'].strip()),r['id']+' empty behavior')
    check(r['profile'] in data['rubric_profiles'],r['id']+' missing profile')
    check(len(data['rubric_profiles'][r['profile']])==7,r['id']+' incomplete seven-tenet mapping')
    check(len(data['friction'][r['profile']])==2,r['id']+' incomplete owner/client friction')
    check(bool(r['tests']) and set(r['tests']) <= case_ids,r['id']+' unknown/missing cases')
    check(set(r['decisions']) <= decisions,r['id']+' unknown decision')
    check(set(r['dependencies']) <= set(ids),r['id']+' unknown dependency')
    if r['id'].startswith('PROP-'):
        check(r['disposition']=='proposed addition' and r['source'] is None,r['id']+' proposal mislabeled')
    if r['source']:
        check(bool(r.get('prior_sheet_review')),r['id']+' missing prior live review')
for case in case_ids:
    section=cases.split('## '+case+'\n',1)[1].split('\n## ',1)[0]
    for expected in ['**Claim/boundary:**','**Prerequisites:**','**Actual:** NOT RUN','**Cleanup:**','**Not tested:**','1.','2.','**Expect:**']:
        check(expected in section,case+' lacks '+expected)
    check(any(case in r['tests'] for r in rows),case+' unreferenced')

# Find accidental dependency cycles; these are acceptance dependencies, not loose related-item links.
graph={r['id']:r['dependencies'] for r in rows}
visited=set()
def visit(node, stack):
    if node not in graph:
        return  # Already recorded as an unknown dependency above.
    if node in stack:
        errors.append('Dependency cycle: '+' -> '.join(stack+[node])); return
    if node in visited: return
    for d in graph[node]: visit(d,stack+[node])
    visited.add(node)
for rid in ids: visit(rid,[])

for md in HERE.glob('*.md'):
    for target in re.findall(r'\]\(([^)]+)\)',md.read_text()):
        if re.match(r'^https?://',target): continue
        file,_,fragment=target.partition('#')
        path=md.parent/file if file else md
        check(path.exists(),md.name+' missing link '+target)
        if fragment and path.exists() and path.suffix=='.md':
            headings=re.findall(r'^#{1,6} (.+)$',path.read_text(),re.M)
            slugs=[re.sub(r'[^\w\- ]','',h.lower()).replace(' ','-') for h in headings]
            check(fragment in slugs,md.name+' missing anchor '+target)

f=json.loads((HERE/'fixtures.json').read_text())
eligible=[o for o in f['observations'] if o['status']=='completed' and o['anchoring']=='unanchored' and isinstance(o['response_text'],str) and o['response_text'].strip()]
hits=sum('exampleco' in o['response_text'].lower() for o in eligible)
check([o['id'] for o in eligible]==f['expected']['eligible_ids'],'Golden eligibility mismatch')
check(hits==2 and len(eligible)==4 and hits/len(eligible)*100==50,'Golden arithmetic mismatch')
check(len(f['observations'])==6 and sum(o['status']=='completed' for o in f['observations'])==5,'Golden outcome counts mismatch')

summary={'boundary':'document structure and independent synthetic-fixture arithmetic; no product tests', 'source_ids':len(source_ids) if source_ids else None, 'live_original_rows':len(original_sheet),'live_review_rows':len(live_ids),'existing_proposal_ids':len(legacy_proposals), 'revised_rows':len(rows),'proposals':sum(r['source'] is None for r in rows),'case_families':len(case_ids),'decision_records':len(decisions),'dispositions':dict(Counter(r['disposition'] for r in rows)), 'mode':'structure-only' if args.structure_only else 'full', 'errors':errors, 'blockers':blockers, 'structure_result':'FAIL' if errors else 'PASS', 'source_verification':'NOT RUN' if args.structure_only else ('BLOCKED' if blockers else 'PASS'), 'result':'FAIL' if errors else ('BLOCKED' if blockers else 'PASS')}
print(json.dumps(summary,indent=2))
raise SystemExit(1 if errors else (2 if blockers else 0))
