"""Independent fixed-export field audit; no application or provider calls."""
import hashlib
import json
import platform
from collections import Counter
from datetime import datetime, timezone
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
SOURCE = ROOT / 'artifacts/unattended-work/evidence/2026-09-17-otterly/raw-answers.json'
EXPECTED_HASH = 'dfb34e1b540066b1990b32d0b599cb0968993a3a2d810fac907c883d08be5b58'
OUT = ROOT / 'artifacts/unattended-work/evidence/2026-09-19-qualification/field-audit.json'
result = {'case': 'QUAL-FIELDS-01', 'checked_at': datetime.now(timezone.utc).isoformat(),
          'python': platform.python_version(), 'boundary': 'independent local field audit',
          'collection_qualification': 'BLOCKED', 'source': str(SOURCE)}
try:
    raw = SOURCE.read_bytes()
    result['sha256'] = hashlib.sha256(raw).hexdigest()
    result['bytes'] = len(raw)
    if result['sha256'] != EXPECTED_HASH:
        raise FileNotFoundError('Fixed input identity mismatch')
    rows = json.loads(raw)
    keys = sorted(set().union(*(r.keys() for r in rows)))
    actual = {
        'rows': len(rows),
        'distinct_questions': len({r['prompt'] for r in rows}),
        'engine_counts': dict(Counter(r['engine'] for r in rows)),
        'nonempty_answers': sum(isinstance(r['response_text'], str) and bool(r['response_text'].strip()) for r in rows),
        'distinct_response_ids': len({r['response_id'] for r in rows}),
        'distinct_composite_ids': len({(r['engine'], r['timestamp'], r['response_id']) for r in rows}),
        'citation_entries': sum(len(r['citations']) for r in rows),
        'distinct_citation_urls': len({u for r in rows for u in r['citations']}),
        'unexpected_context_fields': sorted(set(keys) & {'model', 'model_version', 'session', 'session_id', 'country', 'status', 'attempt_id', 'outcome'}),
    }
    expected = {'rows': 16, 'distinct_questions': 1,
        'engine_counts': {'chatgpt': 4, 'perplexity': 4, 'google': 4, 'copilot': 4},
        'nonempty_answers': 16, 'distinct_response_ids': 4, 'distinct_composite_ids': 16,
        'citation_entries': 111, 'distinct_citation_urls': 51, 'unexpected_context_fields': []}
    result.update(actual=actual, expected=expected, raw_keys=keys,
        null_counts={k: sum(r.get(k) is None for r in rows) for k in keys},
        timestamps=sorted({r['timestamp'] for r in rows}),
        source_unchanged=hashlib.sha256(SOURCE.read_bytes()).hexdigest() == EXPECTED_HASH)
    result['status'] = 'PASS' if actual == expected and result['source_unchanged'] else 'FAIL'
except FileNotFoundError as exc:
    result.update(status='BLOCKED', reason=str(exc))
except (ValueError, KeyError, TypeError) as exc:
    result.update(status='FAIL', reason=str(exc))
OUT.parent.mkdir(parents=True, exist_ok=True)
OUT.write_text(json.dumps(result, indent=2) + '\n')
print(json.dumps(result, indent=2))
raise SystemExit(0 if result['status'] == 'PASS' else (2 if result['status'] == 'BLOCKED' else 1))
