/**
 * Read-only browser acceptance for an explicitly supplied public preview URL.
 * Requires Playwright and a working browser environment; never deploys or sends email.
 * Run: MLX_PUBLIC_URL=https://verified-preview.example PLAYWRIGHT_MODULE=playwright node tests/public-ui/browser-check.mjs
 * Optional: MLX_BROWSER_EXECUTABLE=/path/to/chromium; MLX_QA_OUTPUT=/tmp/mlx-public-qa
 */
import assert from 'node:assert/strict';
import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
const base = process.env.MLX_PUBLIC_URL;
if (!base) throw new Error('BLOCKED: supply MLX_PUBLIC_URL for the exact public build under review.');
const url = new URL(base);
if (!['http:', 'https:'].includes(url.protocol)) throw new Error('Expected a public preview HTTP(S) URL.');
const { chromium } = await import(process.env.PLAYWRIGHT_MODULE || 'playwright');
const browser = await chromium.launch({ executablePath: process.env.MLX_BROWSER_EXECUTABLE || undefined, headless: true });
const output = process.env.MLX_QA_OUTPUT || '/tmp/mlx-public-qa';
await mkdir(output, { recursive: true });
const results = [];
try {
  for (const width of [320, 390, 768, 1024, 1440]) {
    const context = await browser.newContext({ viewport: { width, height: 1000 }, reducedMotion: 'reduce' });
    const page = await context.newPage();
    const errors = [];
    page.on('pageerror', error => errors.push(error.message));
    await page.goto(url.href, { waitUntil: 'networkidle' });
    await page.evaluate(() => document.fonts.ready);
    assert.equal(await page.locator('#home-view').isVisible(), true);
    assert.equal(await page.locator('#sample-report').isVisible(), false);
    assert.equal(await page.locator('form,input,textarea').count(), 0);
    assert.equal(await page.locator('a[href^="mailto:connect@mindleverx.com"]').count(), 4);
    assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth), `Homepage overflow at ${width}`);
    for (const image of await page.locator('img.mlx-arrow').all()) {
      const geometry = await image.evaluate(element => ({ loaded: element.complete && element.naturalWidth > 0, width: element.getBoundingClientRect().width, height: element.getBoundingClientRect().height }));
      assert.deepEqual(geometry, { loaded: true, width: 22, height: 22 });
    }
    await page.screenshot({ path: path.join(output, `homepage-${width}.png`), fullPage: true });
    const opener = page.locator('.mlx-actions [data-sample-open]');
    await opener.focus(); await page.keyboard.press('Enter');
    await page.waitForURL('**/#sample-report');
    assert.equal(await page.locator('#home-view').isVisible(), false);
    for (let number = 1; number <= 5; number++) {
      assert.equal(await page.locator(`[data-report-page="${number}"]`).isVisible(), true);
      assert.equal(await page.locator('[data-report-page]:visible').count(), 1);
      assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth), `Viewer page ${number} overflow at ${width}`);
      assert.equal(await page.locator('#sample-status').innerText(), `Fictional sample · Page ${number} of 5`);
      await page.screenshot({ path: path.join(output, `sample-${number}-${width}.png`), fullPage: true });
      if (number < 5) { await page.locator('#sample-next').focus(); await page.keyboard.press('Enter'); await page.waitForURL(`**/#sample-report-page-${number + 1}`); }
    }
    assert.equal(await page.locator('#sample-next').isVisible(), false);
    await page.goBack(); assert.equal(await page.locator('[data-report-page="4"]').isVisible(), true);
    await page.goForward(); assert.equal(await page.locator('[data-report-page="5"]').isVisible(), true);
    await page.keyboard.press('Escape'); await page.waitForURL('**/#top');
    assert.equal(await opener.evaluate(element => document.activeElement === element), true);
    await opener.press('Enter'); await page.waitForURL('**/#sample-report');
    await page.locator('[data-sample-close]').click(); await page.waitForURL('**/#top');
    assert.equal(await opener.evaluate(element => document.activeElement === element), true);
    await page.goto(new URL('#sample-report-page-3', url).href);
    assert.equal(await page.locator('[data-report-page="3"]').isVisible(), true);
    assert.deepEqual(errors, []);
    results.push({ width, result: 'PASS', checks: 'homepage, no overflow, exact asset geometry, email link, all five pages, keyboard, Back/Forward, Escape, reopen, close, direct link, no runtime errors' });
    await context.close();
  }
  const noJS = await browser.newContext({ javaScriptEnabled: false, viewport: { width: 390, height: 844 } });
  const page = await noJS.newPage(); await page.goto(url.href);
  assert.equal(await page.locator('[data-report-page]:visible').count(), 5);
  assert.equal(await page.locator('#home-view').isVisible(), true);
  assert.equal(await page.locator('a[href^="mailto:connect@mindleverx.com"]').count(), 4);
  results.push({ result: 'PASS', checks: 'no-JavaScript readable homepage, five sample pages and direct email links' });
  await noJS.close();
  await writeFile(path.join(output, 'results.json'), JSON.stringify({ url: url.href, testedAt: new Date().toISOString(), results }, null, 2));
  console.log(JSON.stringify(results, null, 2));
} finally { await browser.close(); }
