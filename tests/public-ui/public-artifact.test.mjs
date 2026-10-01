import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile, readdir } from 'node:fs/promises';

const root = new URL('../../', import.meta.url);
const text = path => readFile(new URL(path, root), 'utf8');

test('TC-PUB-11: public build isolates the redesigned homepage from local intake', async () => {
  const [local, published] = await Promise.all([text('dist/index.html'), text('public-dist/index.html')]);
  assert.match(local, /id="auditform"/);
  assert.doesNotMatch(local, /public-ui\/audit-first\.(?:css|js)/);
  assert.match(published, /public-ui\/audit-first\.css/);
  assert.match(published, /data-report-page="5"/);
  assert.doesNotMatch(published, /<form\b|auditform|MLX_INTAKE_TOKEN|fetch\(|href="\/app\//);
  assert.equal(await text('public-dist/runtime.js'), 'window.MLX_AUDIT_ENDPOINT = null;\nwindow.MLX_LOCAL_PREVIEW = false;\nwindow.MLX_INTAKE_TOKEN = null;\n');
});

test('TC-PUB-12: emitted public assets match the exact non-private allowlist', async () => {
  const files = await readdir(new URL('public-dist/public-ui/', root));
  assert.deepEqual(files.sort(), ['audit-first.css', 'audit-first.js', 'arrow-light.svg', 'arrow-ink.svg', 'editorial.css', 'explorer.js', 'arrow-editorial.svg', 'barlow-condensed-bold.woff2', 'manrope.woff2', 'ibm-plex-mono-medium.ttf', 'sora.woff2', 'barlow-condensed-bold-OFL.txt', 'manrope-OFL.txt', 'ibm-plex-mono-medium-OFL.txt', 'sora-OFL.txt'].sort());
  const topLevel = await readdir(new URL('public-dist/', root));
  for (const privateName of ['app', 'api', 'results', 'server', 'data', 'tests', 'homepage.html']) assert.ok(!topLevel.includes(privateName));
  for (const file of files) assert.equal(await text(`public-dist/public-ui/${file}`), await text(`site/public-ui/${file}`));
});

test('TC-PUB-13: public contact and machine-readable audience match the new homepage', async () => {
  const [about, llms] = await Promise.all([text('public-dist/about.html'), text('public-dist/llms.txt')]);
  assert.match(about, /mailto:connect@mindleverx\.com/);
  assert.doesNotMatch(about, /No public contact address is configured|Direct mailbox<\/b> — not provisioned/);
  assert.match(llms, /owner-led service businesses/);
  assert.match(llms, /connect@mindleverx\.com/);
  assert.doesNotMatch(llms, /local preview|mid-market B2B SaaS/);
});
