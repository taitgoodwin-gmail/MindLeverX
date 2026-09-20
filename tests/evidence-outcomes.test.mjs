import test from 'node:test';
import assert from 'node:assert/strict';
import { inspectEvidence } from '../server/evidence-inspection.mjs';
import { savedResults, savedResultsText } from '../server/saved-results.mjs';
import { savedResultsPdf } from '../server/saved-results-pdf.mjs';

// Exact nonempty service-error marker observed in three retained vendor rows.
// Other fields are minimized synthetic data, not new customer evidence.
const errorText = "I'm sorry, I'm having trouble responding to requests right now. Let's try this again in a bit.";
const row = (id, response_text) => ({response_id:id,engine:'synthetic',timestamp:'2026-09-20T00:00:00Z',prompt:'Question?',response_text});
const bytes = rows => Buffer.from(JSON.stringify(rows));

test('known service-error rows block the aggregate instead of becoming negative answers or shrinking the sample', () => {
  for (const rows of [[row('1',errorText)], [row('1','MindLeverX'), row('2',errorText)], [row('1',errorText),row('2',errorText),row('3',errorText)]]) {
    const input=bytes(rows), before=Buffer.from(input);
    const result=inspectEvidence(input,{brand:'MindLeverX'});
    assert.equal(result.status,'blocked');
    assert.equal(result.aggregate,null);
    assert.equal(result.recordCount,rows.length);
    assert.equal(result.method,'answer-text-literal-substring-lowercase-v2');
    for (const [index,r] of rows.entries()) if (r.response_text===errorText) {
      assert.equal(result.rows[index].answerPresent,false);
      assert.equal(result.rows[index].literalMention,null);
      assert.ok(result.issues.some(i=>i.code==='observed_service_error_response' && i.row===index+1 && i.field==='response_text' && i.severity==='error'));
    }
    assert.deepEqual(input,before);
  }
});

test('recognition is exact, not a heuristic for apologies, unavailable subjects or quoted error messages', () => {
  const rows=[row('1','MindLeverX is unavailable in my region.'),row('2',`The service displayed: "${errorText}"`),row('3','I am sorry, I cannot recommend a provider.')];
  const result=inspectEvidence(bytes(rows),{brand:'MindLeverX'});
  assert.equal(result.status,'complete');
  assert.deepEqual(result.aggregate,{numerator:1,denominator:3,meaning:'Exported answer records containing the literal brand at least once'});
  assert.match(result.limitations.join(' '),/not a general failure detector/);
});

test('legacy v1 remains explicit for historical reproduction and unknown methods fail closed', () => {
  const source=bytes([row('1',errorText)]);
  const old=inspectEvidence(source,{brand:'MindLeverX',method:'answer-text-literal-substring-lowercase-v1'});
  assert.equal(old.status,'complete');
  assert.equal(old.aggregate.denominator,1);
  assert.equal(old.rows[0].literalMention,false);
  assert.throws(()=>inspectEvidence(source,{brand:'MindLeverX',method:'future'}),/Unsupported/);
});

test('blocked saved results produce no answer/platform counts, text or PDF', async () => {
  const result=savedResults(bytes([row('1',errorText)]),'MindLeverX');
  assert.equal(result.state,'blocked');
  assert.equal(result.aggregate,null);
  assert.deepEqual(result.answers,[]);
  assert.deepEqual(result.platforms,[]);
  assert.throws(()=>savedResultsText(result),/Complete/);
  await assert.rejects(savedResultsPdf(result,{python:'/must-not-be-started'}),/Complete/);
});
