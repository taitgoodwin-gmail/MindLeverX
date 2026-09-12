import fs from 'node:fs/promises';
import path from 'node:path';
import vm from 'node:vm';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const directory = path.join(root, 'dist');
const pages = (await fs.readdir(directory)).filter(name => name.endsWith('.html'));
const files = new Map();
const errors = [];
const check = (condition, page, message) => { if (!condition) errors.push(`${page}: ${message}`); };
for (const page of pages) {
  const html = await fs.readFile(path.join(directory, page), 'utf8');
  const ids = [...html.matchAll(/\bid="([^"]+)"/g)].map(match => match[1]);
  files.set(page, { html, ids });
  check(!/<!--|INTERNAL:/.test(html), page, 'internal comment leaked');
  check(!/href="#"/.test(html), page, 'placeholder link');
  check(!/font-weight:300|font-size:(?:10|11)px|#75787d/.test(html), page, 'old readability values');
  check(!/tracked daily across every major|prove the engagement paid for itself|So we scored ourselves|run by agentic AI|MindLeverX tracks these daily/.test(html), page, 'unsupported operational promise');
  check((html.match(/<h1(?:\s|>)/g) || []).length === 1, page, 'expected exactly one h1');
  check((html.match(/<form(?:\s|>)/g) || []).length === (html.match(/<\/form>/g) || []).length, page, 'unbalanced forms');
  check(ids.length === new Set(ids).size, page, 'duplicate HTML id');
  check((html.match(/rel="canonical"/g) || []).length === 1, page, 'expected exactly one canonical');
  check(html.includes('src="/runtime.js"'), page, 'missing runtime config');
  check(!/shared\.(?:js|css)/.test(html), page, 'shared code was not inlined');
  check(html.includes('class="skip-link"'), page, 'missing skip link');
  if (html.includes('id="auditform"')) {
    check(/id="intake-consent" required/.test(html), page, 'missing consent');
    check(/id="fnote" role="status" aria-live="polite"/.test(html), page, 'missing accessible status');
    check(/data-kind="(?:audit|subscription)"/.test(html), page, 'missing intake kind');
    check(html.includes('response.status === 202') && html.includes('result?.ok === true'), page, 'success must verify server contract');
    check(html.includes('_token: window.MLX_INTAKE_TOKEN'), page, 'missing intake token');
  }
  for (const match of html.matchAll(/<script([^>]*)>([\s\S]*?)<\/script>/g)) {
    try {
      if (/application\/ld\+json/.test(match[1])) {
        const schema = JSON.parse(match[2]);
        check(schema['@context'] === 'https://schema.org', page, 'unexpected schema context');
        check(!/logo\.svg|datePublished|legalName/.test(match[2]), page, 'unsupported metadata claim');
      } else if (match[2].trim()) new vm.Script(match[2], { filename: page });
    } catch (error) { errors.push(`${page}: invalid script: ${error.message}`); }
  }
}
for (const [page, { html }] of files) {
  for (const [, href] of html.matchAll(/<a\b[^>]*\bhref="([^"]*)"/g)) {
    if (/^(?:https?:|mailto:|tel:)/.test(href) || href === '/app/') continue;
    const [pathname, fragment] = href.split('#');
    const target = pathname || page;
    const linked = files.get(target);
    check(!!linked, page, `missing linked page ${href}`);
    if (linked && fragment) check(linked.ids.includes(fragment), page, `missing anchor ${href}`);
  }
}
const unserved = ['DEPLOY.md', 'head-schema.html', 'style-guide.html', 'token-lint.js', 'shared.js', 'shared.css'];
for (const name of unserved) {
  try { await fs.access(path.join(directory, name)); errors.push(`dist/${name} must not be served`); }
  catch (error) { if (error.code !== 'ENOENT') throw error; }
}
const runtime = await fs.readFile(path.join(directory, 'runtime.js'), 'utf8');
check(runtime.includes('MLX_AUDIT_ENDPOINT = null'), 'runtime.js', 'static intake must be disconnected by default');
if (errors.length) { console.error(errors.join('\n')); process.exitCode = 1; }
else console.log(`Website checks passed: ${pages.length} pages, scripts, metadata, internal links, consent and serving boundaries.`);
