import assert from 'node:assert/strict';

// Count only completed aborts; installing a route alone is not failure injection.
export async function interruptScript(page, script) {
  const abortedUrls = [];
  const pattern = `**/${script}`;
  await page.route(pattern, async route => {
    const url = route.request().url();
    await route.abort();
    abortedUrls.push(url);
  });
  return {
    assertOccurred() {
      assert.ok(abortedUrls.length > 0, `Failure injection did not abort any request for ${script} (${pattern})`);
      return { pattern, abortedRequests: abortedUrls.length, abortedUrls: [...abortedUrls] };
    },
  };
}
