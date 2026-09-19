import test from 'node:test';
import assert from 'node:assert/strict';
import { savedResults } from '../server/saved-results.mjs';

const source = [
  { engine: 'alpha', prompt: 'Question?', response_id: '1', timestamp: '2026-09-19', response_text: 'MiNdLeVeRx and MindLeverX', secret: 'DO_NOT_PROJECT' },
  { engine: 'beta', prompt: 'Question?', response_id: '2', timestamp: '2026-09-19', response_text: 'Another brand' },
];
test('results preserve complete answers, literal denominator and platform attribution without unrelated fields', () => {
  const result = savedResults(Buffer.from(JSON.stringify(source)), 'MindLeverX');
  assert.equal(result.aggregate.numerator, 1);
  assert.equal(result.aggregate.denominator, 2);
  assert.equal(result.questionCount, 1);
  assert.deepEqual(result.platforms, [{engine:'alpha',numerator:1,denominator:1},{engine:'beta',numerator:0,denominator:1}]);
  assert.deepEqual(result.answers.map(row => row.answer), source.map(row => row.response_text));
  assert.ok(!JSON.stringify(result).includes('DO_NOT_PROJECT'));
});
test('broken or incomplete evidence produces no answer report or aggregate', () => {
  for (const input of ['{', '[]', JSON.stringify([{...source[0],response_text:''}]), JSON.stringify([source[0],source[0]])]) {
    const result = savedResults(Buffer.from(input), 'MindLeverX');
    assert.equal(result.state,'blocked');
    assert.equal(result.aggregate,null);
    assert.deepEqual(result.answers,[]);
    assert.deepEqual(result.platforms,[]);
  }
});
test('vendor markup remains exact text data and missing dates remain unknown', () => {
  const answer = '<img src=x onerror="alert(1)"><script>alert(2)</script>';
  const result = savedResults(Buffer.from(JSON.stringify([{...source[0],response_text:answer,timestamp:null}])), 'MindLeverX');
  assert.equal(result.answers[0].answer,answer);
  assert.equal(result.answers[0].vendorTimestamp,null);
  assert.equal(result.aggregate.numerator,0);
  assert.ok(result.issues.some(issue => issue.field === 'timestamp'));
});
