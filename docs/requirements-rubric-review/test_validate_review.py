"""Regression checks for document-validation outcomes, using isolated copies."""
import hashlib
import json
import shutil
import subprocess
import sys
import tempfile
import unittest
from pathlib import Path

HERE = Path(__file__).resolve().parent


class ReviewValidationTests(unittest.TestCase):
    def setUp(self):
        self.tmp = tempfile.TemporaryDirectory()
        self.addCleanup(self.tmp.cleanup)
        self.package = Path(self.tmp.name) / 'review'
        shutil.copytree(HERE, self.package, ignore=shutil.ignore_patterns('__pycache__'))
        for document in HERE.parent.glob('*.md'):
            shutil.copy2(document, self.package.parent / document.name)
        self.data_path = self.package / 'requirements.json'
        self.data = json.loads(self.data_path.read_text())
        # Synthetic historical inputs: test the checker, not historical validity.
        for label, source in self.data['source_manifest'].items():
            text = 'Synthetic source for ' + label
            if label in ('V4', 'V5'):
                text = '\n'.join('| ' + row['id'] + ' | Title | Behavior | Check |'
                    for row in self.data['requirements'] if row['source']
                    and (row['id'].startswith('MLX3-SVC-') == (label == 'V5')))
            path = Path(self.tmp.name) / (label + '.txt')
            path.write_text(text)
            source.update(path=str(path), sha256=hashlib.sha256(path.read_bytes()).hexdigest())
        self.save()

    def save(self):
        self.data_path.write_text(json.dumps(self.data))

    def run_check(self, *args):
        result = subprocess.run([sys.executable, str(self.package / 'validate_review.py'), *args],
                                capture_output=True, text=True, timeout=15)
        return result.returncode, json.loads(result.stdout)

    def test_full_valid_fixture(self):
        code, result = self.run_check()
        self.assertEqual(code, 0)
        self.assertEqual(result['source_verification'], 'PASS')
        self.assertEqual(result['source_ids'], 86)

    def test_missing_source_blocks_reconciliation(self):
        Path(self.data['source_manifest']['V4']['path']).unlink()
        code, result = self.run_check()
        self.assertEqual(code, 2)
        self.assertEqual(result['structure_result'], 'PASS')
        self.assertEqual(result['source_verification'], 'BLOCKED')
        self.assertIn('Source unavailable: V4', result['blockers'])

    def test_changed_context_blocks_without_rewriting_hash(self):
        source = self.data['source_manifest']['GUIDANCE']
        old_hash = source['sha256']
        Path(source['path']).write_text('Changed guidance')
        code, result = self.run_check()
        self.assertEqual(code, 2)
        self.assertIn('Source changed since review: GUIDANCE', result['blockers'])
        self.assertEqual(json.loads(self.data_path.read_text())['source_manifest']['GUIDANCE']['sha256'], old_hash)

    def test_portable_mode_does_not_claim_source_verification(self):
        for source in self.data['source_manifest'].values():
            Path(source['path']).unlink()
        code, result = self.run_check('--structure-only')
        self.assertEqual(code, 0)
        self.assertEqual(result['result'], 'PASS')
        self.assertEqual(result['source_verification'], 'NOT RUN')
        self.assertIsNone(result['source_ids'])

    def test_duplicate_requirement_fails_even_with_missing_source(self):
        self.data['requirements'].append(self.data['requirements'][0])
        self.save()
        Path(self.data['source_manifest']['V4']['path']).unlink()
        code, result = self.run_check()
        self.assertEqual(code, 1)
        self.assertEqual(result['result'], 'FAIL')
        self.assertIn('Duplicate requirement ID', result['errors'])

    def test_unknown_dependency_reports_failure_without_crashing(self):
        self.data['requirements'][0]['dependencies'] = ['DOES-NOT-EXIST']
        self.save()
        code, result = self.run_check('--structure-only')
        self.assertEqual(code, 1)
        self.assertTrue(any('unknown dependency' in e for e in result['errors']))

    def test_dependency_cycle_is_rejected(self):
        row = self.data['requirements'][0]
        row['dependencies'] = [row['id']]
        self.save()
        code, result = self.run_check('--structure-only')
        self.assertEqual(code, 1)
        self.assertTrue(any('Dependency cycle' in e for e in result['errors']))


if __name__ == '__main__':
    unittest.main()
