import test from 'node:test';
import assert from 'node:assert/strict';
import { interruptScript } from './script-interruption.mjs';

for (const script of ['explorer.js', 'audit-first.js']) {
  test(`interrupted ${script}: zero hits fail; completed aborts produce evidence`, async () => {
    let handler;
    const injection = await interruptScript({ route: async (pattern, callback) => {
      assert.equal(pattern, `**/${script}`);
      handler = callback;
    } }, script);
    assert.throws(() => injection.assertOccurred(), /Failure injection did not abort any request/);
    const url = `http://127.0.0.1:4354/public-ui/${script}`;
    let aborts = 0;
    await handler({ request: () => ({ url: () => url }), abort: async () => { aborts++; } });
    assert.equal(aborts, 1);
    assert.deepEqual(injection.assertOccurred(), { pattern: `**/${script}`, abortedRequests: 1, abortedUrls: [url] });
  });
}

test('a rejected abort cannot count as successful failure injection', async () => {
  let handler;
  const injection = await interruptScript({ route: async (_, callback) => { handler = callback; } }, 'explorer.js');
  await assert.rejects(handler({ request: () => ({ url: () => 'http://localhost/explorer.js' }), abort: async () => { throw new Error('abort failed'); } }), /abort failed/);
  assert.throws(() => injection.assertOccurred(), /Failure injection did not abort any request/);
});
