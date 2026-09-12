import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawnSync } from 'node:child_process';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const directory = path.join(root, 'public-dist');
const expectedPages = ['index.html', 'what-is-geo.html', 'research-hub.html', 'answer-engine-index-q3-2026.html', 'case-study.html', 'about.html', 'method.html'];
const expectedFiles = [...expectedPages, 'runtime.js', 'robots.txt', 'sitemap.xml', 'llms.txt'].sort();
const errors = [];
const check = (condition, message) => { if (!condition) errors.push(message); };
const entries = await fs.readdir(directory, { withFileTypes: true });
check(entries.every(entry => entry.isFile()) && JSON.stringify(entries.map(entry => entry.name).sort()) === JSON.stringify(expectedFiles),
  'Public output must contain only the seven public pages, runtime.js, robots.txt, sitemap.xml and llms.txt.');

let origin;
for (const page of expectedPages) {
  const html = await fs.readFile(path.join(directory, page), 'utf8');
  const visible = html.replace(/<(?:script|style)\b[^>]*>[\s\S]*?<\/(?:script|style)>/g, '');
  check(!/<(?:form|input|textarea|select)\b/i.test(html), `${page}: public pages must not collect input.`);
  check(!/id="local-preview"|href="\/app\/|(?:src|href)="\/api\//.test(html), `${page}: local workspace leaked into public output.`);
  check(!/local (?:preview|workspace|server|intake|form|request storage)|requests? (?:is |are )?(?:saved|stored) locally|form (?:saves|records)|records interest only/i.test(visible), `${page}: visible copy incorrectly describes local intake.`);
  check(!/Start the local server|fetch\(|MLX_INTAKE_TOKEN|auditform/.test(html), `${page}: public pages must not include the local intake client.`);
  const canonical = html.match(/<link rel="canonical" href="([^"]+)">/)?.[1];
  if (canonical) {
    const url = new URL(canonical);
    origin ??= url.origin;
    check(url.protocol === 'https:' && canonical === `${origin}/${page === 'index.html' ? '' : page}`, `${page}: invalid or inconsistent canonical URL.`);
    check(html.includes(`<meta property="og:url" content="${canonical}">`), `${page}: Open Graph URL must match canonical.`);
    const schema = [...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)].map(([, body]) => JSON.parse(body));
    check(schema.length === 1 && schema[0]['@graph']?.every(item => item.url === origin || item.url === canonical), `${page}: schema URLs must match the published origin.`);
  } else errors.push(`${page}: missing canonical URL.`);
}

const index = await fs.readFile(path.join(directory, 'index.html'), 'utf8');
const research = await fs.readFile(path.join(directory, 'research-hub.html'), 'utf8');
check(index.includes('Audit requests are not open yet. Please check back for availability.'), 'Homepage must state audit availability before JavaScript runs.');
check(research.includes('Newsletter subscriptions are not open yet. Please check back for availability.'), 'Research page must state newsletter availability before JavaScript runs.');
const runtime = await fs.readFile(path.join(directory, 'runtime.js'), 'utf8');
check(/^window\.MLX_AUDIT_ENDPOINT = null;\nwindow\.MLX_LOCAL_PREVIEW = false;\nwindow\.MLX_INTAKE_TOKEN = null;\n$/.test(runtime), 'Public runtime must not provide an intake endpoint or token.');
const sitemap = await fs.readFile(path.join(directory, 'sitemap.xml'), 'utf8');
const locations = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map(([, location]) => location).sort();
check(JSON.stringify(locations) === JSON.stringify(expectedPages.map(page => `${origin}/${page === 'index.html' ? '' : page}`).sort()), 'Sitemap must contain exactly the seven pages at the published origin.');
const robots = await fs.readFile(path.join(directory, 'robots.txt'), 'utf8');
check(robots.includes(`Sitemap: ${origin}/sitemap.xml`), 'robots.txt must reference the published sitemap.');
const llms = await fs.readFile(path.join(directory, 'llms.txt'), 'utf8');
check(!/local (?:preview|audit intake|build)/i.test(llms) && llms.includes('Audit requests and newsletter subscriptions are not open yet.'), 'llms.txt must accurately describe public availability.');
check([...llms.matchAll(/\]\((https:\/\/[^)]+)\)/g)].every(([, url]) => url.startsWith(`${origin}/`)), 'llms.txt links must use the published origin.');

const commonChecks = spawnSync(process.execPath, [path.join(root, 'scripts/check-site.mjs'), '--public'], { cwd: root, stdio: 'inherit' });
if (commonChecks.error) throw commonChecks.error;
if (commonChecks.status !== 0) errors.push('Shared page, script, metadata or internal-link checks failed.');
if (errors.length) { console.error(errors.join('\n')); process.exitCode = 1; }
else console.log('Public checks passed: website-only artifact, no data capture, honest availability, consistent metadata and valid links.');
