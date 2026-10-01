import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import vm from 'node:vm';

const source = new URL('../../site/public-ui/', import.meta.url);
const script = await readFile(new URL('audit-first.js', source), 'utf8');
const html = await readFile(new URL('homepage.html', source), 'utf8');
const css = await readFile(new URL('audit-first.css', source), 'utf8');

function setup(hash = '', { missingHeading = false } = {}) {
  let focused = null;
  const scrolls = [];
  class Element {
    constructor() { this.hidden = false; this.href = ''; this.attrs = new Map(); this.events = new Map(); this.firstChild = { textContent: '' }; this.isConnected = true; }
    addEventListener(type, fn) { this.events.set(type, fn); }
    fire(type, event = {}) { this.events.get(type)?.(event); }
    hasAttribute(name) { return this.attrs.has(name); }
    setAttribute(name, value) { this.attrs.set(name, value); }
    focus(options) { focused = this; this.focusOptions = options; }
    scrollIntoView(options) { scrolls.push(options); }
    querySelector() { return this.heading; }
  }
  const ids = Object.fromEntries(['home-view', 'sample-report', 'sample-prev', 'sample-next', 'sample-status', 'sample-error', 'hero-title'].map(id => [id, new Element()]));
  const pages = Array.from({ length: 5 }, () => { const page = new Element(); page.heading = new Element(); return page; });
  if (missingHeading) pages[2].heading = null;
  const contents = Array.from({ length: 5 }, () => new Element());
  const navigation = new Element(), skip = new Element();
  const openers = [new Element(), new Element()];
  const document = new Element();
  document.title = 'MindLeverX — Your AI visibility, made clear.';
  document.getElementById = id => ids[id] || null;
  document.querySelector = selector => selector === '.mlx-report-navigation' ? navigation : skip;
  document.querySelectorAll = selector => selector === '[data-report-page]' ? pages : selector === '[data-report-link]' ? contents : openers;
  const window = new Element();
  window.location = { hash };
  window.scrollTo = options => scrolls.push(options);
  vm.runInNewContext(script, { document, window });
  return { ids, pages, contents, navigation, skip, openers, document, window, focused: () => focused, scrolls,
    navigate(hash) { window.location.hash = hash; window.fire('hashchange'); } };
}

test('TC-PUB-01: homepage is the default, with the report hidden only after enhancement', () => {
  const p = setup();
  assert.equal(p.ids['home-view'].hidden, false);
  assert.equal(p.ids['sample-report'].hidden, true);
  assert.equal(p.navigation.hidden, true);
  assert.equal(p.focused(), null);
  assert.equal(p.skip.href, '#main');
  // With scripts unavailable the complete report remains ordinary readable HTML.
  assert.match(html, /<section class="mlx-report-view" id="sample-report" aria-label=/);
  assert.equal((html.match(/data-report-page="[1-5]"/g) || []).length, 5);
  assert.doesNotMatch(html, /class="mlx-report-page"[^>]*\bhidden\b/);
});

test('TC-PUB-14: invalid direct links announce recovery and clear on a valid page', () => {
  const p = setup('#sample-report-page-99');
  assert.equal(p.ids['sample-error'].hidden, false);
  assert.match(p.ids['sample-error'].textContent, /does not exist/);
  assert.equal(p.focused(), p.ids['sample-error']);
  assert.equal(p.ids['home-view'].hidden, false);
  p.navigate('#sample-report-page-3');
  assert.equal(p.ids['sample-error'].hidden, true);
  assert.equal(p.ids['sample-error'].textContent, '');
  assert.deepEqual(p.contents.map(link => link.attrs.get('aria-current')), ['false', 'false', 'page', 'false', 'false']);
});

test('TC-PUB-15: incomplete report markup keeps the static document readable', () => {
  const p = setup('#sample-report-page-3', { missingHeading: true });
  assert.equal(p.ids['home-view'].hidden, false);
  assert.equal(p.ids['sample-report'].hidden, false);
  assert.ok(p.pages.every(page => !page.hidden));
  assert.equal(p.focused(), null);
});

test('TC-PUB-02: opening the sample selects page one and moves focus to its heading', () => {
  const p = setup();
  p.openers[1].fire('click'); p.navigate('#sample-report');
  assert.equal(p.ids['home-view'].hidden, true);
  assert.equal(p.ids['sample-report'].hidden, false);
  assert.deepEqual(p.pages.map(page => page.hidden), [false, true, true, true, true]);
  assert.equal(p.focused(), p.pages[0].heading);
  assert.equal(p.ids['sample-prev'].href, '#top');
  assert.equal(p.ids['sample-prev'].firstChild.textContent, 'Back to homepage');
  assert.equal(p.ids['sample-next'].href, '#sample-report-page-2');
  assert.equal(p.document.title, 'Sample report · Page 1 of 5 · MindLeverX');
});

test('TC-PUB-03: all five pages, previous links and end boundary are deterministic', () => {
  const p = setup();
  for (let i = 1; i <= 5; i++) {
    p.navigate(`#sample-report-page-${i}`);
    assert.equal(p.pages.filter(page => !page.hidden).length, 1);
    assert.equal(p.pages[i - 1].hidden, false);
    assert.equal(p.ids['sample-status'].textContent, `Fictional sample · Page ${i} of 5`);
    assert.equal(p.ids['sample-prev'].href, i === 1 ? '#top' : `#sample-report-page-${i - 1}`);
    assert.equal(p.ids['sample-next'].hidden, i === 5);
    assert.equal(p.skip.href, `#sample-report-page-${i}`);
  }
  p.navigate('#sample-report-page-4');
  assert.equal(p.ids['sample-next'].hidden, false);
  assert.equal(p.ids['sample-next'].href, '#sample-report-page-5');
});

test('TC-PUB-04: direct-link load, Back/Forward hash changes and invalid page recover safely', () => {
  const p = setup('#sample-report-page-3');
  assert.equal(p.pages[2].hidden, false);
  assert.equal(p.focused(), p.pages[2].heading);
  p.navigate('#sample-report-page-2');
  assert.equal(p.pages[1].hidden, false);
  p.navigate('#sample-report-page-3');
  assert.equal(p.pages[2].hidden, false);
  for (const hash of ['#sample-report-page-9', '#sample-report-page-0', '#sample-report-page-1<script>', '#method']) {
    p.navigate(hash);
    assert.equal(p.ids['home-view'].hidden, false);
    assert.equal(p.ids['sample-report'].hidden, true);
    assert.equal(p.document.title, 'MindLeverX — Your AI visibility, made clear.');
  }
});

test('TC-PUB-05: Escape closes the viewer, returns focus to opener and permits reopening', () => {
  const p = setup();
  p.openers[0].fire('click'); p.navigate('#sample-report');
  let prevented = false;
  p.document.fire('keydown', { key: 'Escape', preventDefault() { prevented = true; } });
  assert.equal(prevented, true); assert.equal(p.window.location.hash, 'top');
  p.navigate('#top');
  assert.equal(p.focused(), p.openers[0]);
  assert.equal(p.ids['home-view'].hidden, false);
  p.openers[1].fire('click'); p.navigate('#sample-report'); p.navigate('#top');
  assert.equal(p.focused(), p.openers[1]);
  assert.equal(p.skip.href, '#main');
});

test('TC-PUB-06: detached opener and direct-link exit have a visible fallback focus target', () => {
  const p = setup();
  p.openers[0].fire('click'); p.navigate('#sample-report'); p.openers[0].isConnected = false;
  p.navigate('#top'); assert.equal(p.focused(), p.ids['hero-title']);
  const direct = setup('#sample-report-page-5'); direct.navigate('#top');
  assert.equal(direct.focused(), direct.ids['hero-title']);
});

test('TC-PUB-07: enquiry route uses the corrected approved inbox and describes actual behavior', () => {
  const links = [...html.matchAll(/href="(mailto:[^"]+)"/g)].map(match => match[1]);
  assert.equal(links.length, 4);
  assert.ok(links.every(link => link.startsWith('mailto:connect@mindleverx.com')));
  assert.doesNotMatch(html, /contact@mindleverx\.com|tait@|<form\b|<input\b|<textarea\b/);
  assert.match(html, /Opens your email app\. Nothing is sent by this website\./);
  assert.match(html, /No audit begins until scope, price and timing are agreed\./);
  assert.doesNotMatch(script, /\bfetch\s*\(|XMLHttpRequest|sendBeacon|localStorage|sessionStorage|MLX_AUDIT_ENDPOINT|MLX_INTAKE_TOKEN/);
});

test('TC-PUB-08: sample labels, independent totals and method limitations stay visible', () => {
  assert.equal((html.match(/SAMPLE REPORT · FICTIONAL BUSINESS · ILLUSTRATIVE DATA/g) || []).length, 5);
  const rows = [...html.matchAll(/<tr><th scope="row">(?:Discovery|Comparison|Business facts)[\s\S]*?<\/tr>/g)].map(match => [...match[0].matchAll(/<td>(\d+)<\/td>/g)].map(value => Number(value[1])));
  assert.equal(rows.length, 3);
  assert.deepEqual(rows[0].map((_, i) => rows.reduce((sum, row) => sum + row[i], 0)), [20, 6, 2, 11, 9]);
  assert.match(html, /First baseline: no trend is shown/);
  assert.match(html, /20 answers is a small sample, not a market-wide estimate/);
  assert.match(html, /No guaranteed rankings, citations or leads/);
  assert.match(html, /NOT MEASURED: could not be observed/);
});

test('TC-PUB-09: legacy fragment targets, semantic structure and motion preferences remain supported', () => {
  for (const id of ['top', 'main', 'services', 'score', 'offer', 'cta', 'method']) assert.ok(html.includes(`id="${id}"`), id);
  const ids = [...html.matchAll(/\bid="([^"]+)"/g)].map(match => match[1]);
  assert.equal(ids.length, new Set(ids).size);
  assert.equal((html.match(/<h1\b/g) || []).length, 1);
  assert.match(html, /class="skip-link"/);
  assert.match(css, /prefers-reduced-motion: reduce/);
  assert.match(css, /:focus-visible/);
  assert.match(css, /\.mlx-table-scroll\s*\{[^}]*overflow-x: auto/);
  assert.match(css, /@media \(max-width: 360px\)/);
});

test('TC-PUB-10: the exact Figma SVG assets are local and keep their export geometry', async () => {
  for (const name of ['arrow-editorial.svg', 'arrow-ink.svg']) {
    const svg = await readFile(new URL(name, source), 'utf8');
    assert.match(svg, /^<svg\b/);
    assert.match(svg, /width="22"/); assert.match(svg, /height="22"/);
    assert.match(svg, /viewBox="0 0 22 22"/);
    assert.ok(html.includes(`src="public-ui/${name}"`));
  }
  assert.doesNotMatch(html + css + script, /figma\.com\/api\/mcp\/asset|Site Unavailable/);
});
