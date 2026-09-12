import test from 'node:test';
import assert from 'node:assert/strict';
import { openDatabase } from '../server/database.mjs';

test('sample evidence referencing panel v1 uses a question stored in that panel', () => {
  const db = openDatabase(':memory:');
  try {
    const reviews = db.prepare('SELECT client_id,evidence FROM reviews WHERE sample=1').all();
    for (const review of reviews) {
      const panel = db.prepare('SELECT prompts FROM panels WHERE client_id=? AND version=1').get(review.client_id);
      for (const evidence of JSON.parse(review.evidence).filter(item=>item.label.includes('panel v1'))) {
        assert.ok(JSON.parse(panel.prompts).includes(evidence.detail), `Sample evidence must match ${review.client_id}'s preserved panel.`);
      }
    }
  } finally { db.close(); }
});
