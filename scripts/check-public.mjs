import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawnSync } from 'node:child_process';
import { enquiryStatus, glossary, geoDefinition, navigation, validateProfile } from '../site/content.mjs';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const directory = path.join(root, 'public-dist');
const expectedPages = ['index.html', 'what-is-geo.html', 'research-hub.html', 'answer-engine-index-q3-2026.html', 'case-study.html', 'about.html', 'method.html', 'glossary.html'];
const profile = validateProfile(JSON.parse(await fs.readFile(path.join(root, 'site/public-profile.json'), 'utf8')));
const expectedFiles = [...expectedPages, 'runtime.js', 'robots.txt', 'sitemap.xml', 'llms.txt'].sort();
const errors = [];
const check = (condition, message) => { if (!condition) errors.push(message); };
const entries = await fs.readdir(directory, { withFileTypes: true });
check(entries.every(entry => entry.isFile()) && JSON.stringify(entries.map(entry => entry.name).sort()) === JSON.stringify(expectedFiles),
  'Public output must contain only the eight public pages, runtime.js, robots.txt, sitemap.xml and llms.txt.');

let origin;
for (const page of expectedPages) {
  const html = await fs.readFile(path.join(directory, page), 'utf8');
  const visible = html.replace(/<(?:script|style)\b[^>]*>[\s\S]*?<\/(?:script|style)>/g, '');
  check(!/\{\{[A-Z_]+\}\}|id="ticker"|[▲▼]/.test(visible), `${page}: unresolved content or fabricated ticker/delta.`);
  check(!/free (?:GEO |readiness )?audit/i.test(visible), `${page}: obsolete free-audit offer.`);
  const nav = html.match(/<nav class="navlinks"[^>]*>([\s\S]*?)<\/nav>/)?.[1] || '';
  check(JSON.stringify([...nav.matchAll(/<a href="([^"]+)"[^>]*>([^<]+)<\/a>/g)].map(([,url,label])=>[label,url])) === JSON.stringify(navigation), `${page}: inconsistent global navigation.`);
  check(!/<form(?![^>]*data-enquiry-form)[^>]*>/i.test(html), `${page}: only the approved enquiry form may appear.`);
  if (!profile.formAction && visible.includes('data-enquiry-form')) check(visible.includes('type="submit" disabled'), `${page}: unconfigured enquiry submission must be disabled.`);
  check(!/id="local-preview"|href="\/app\/|(?:src|href)="\/api\//.test(html), `${page}: local workspace leaked into public output.`);
  check(!/local (?:preview|workspace|server|intake|form|request storage)|requests? (?:is |are )?(?:saved|stored) locally|form (?:saves|records)|records interest only/i.test(visible), `${page}: visible copy incorrectly describes local intake.`);
  check(!/Start the local server|MLX_INTAKE_TOKEN|auditform/.test(html), `${page}: public pages must not include the local intake client.`);
  const publicFetches = [...html.matchAll(/fetch\(([^,]+)/g)].map(match => match[1]);
  check(publicFetches.every(target => target === "'/api/enquiry'"), `${page}: only the dedicated public enquiry endpoint may be fetched.`);
  check(!/MLX_GOOGLE_|MLX_GMAIL_FROM|MLX_ENQUIRY_TO/.test(html), `${page}: private mail configuration leaked.`);
  const canonical = html.match(/<link rel="canonical" href="([^"]+)">/)?.[1];
  if (canonical) {
    const url = new URL(canonical);
    origin ??= url.origin;
    check(url.protocol === 'https:' && canonical === `${origin}/${page === 'index.html' ? '' : page}`, `${page}: invalid or inconsistent canonical URL.`);
    check(html.includes(`<meta property="og:url" content="${canonical}">`), `${page}: Open Graph URL must match canonical.`);
    const schema = [...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)].map(([, body]) => JSON.parse(body));
    check(schema.length === 1 && schema[0]['@graph']?.every(item => item.url === origin || item.url === canonical || item.url?.startsWith(`${canonical}#`)), `${page}: schema URLs must match the published origin.`);
    if (page === 'what-is-geo.html') {
      const graph = schema[0]['@graph'];
      check(graph.some(item => item['@type'] === 'DefinedTerm' && item.description === geoDefinition), 'Pillar schema must use the visible canonical definition.');
      const faq = graph.find(item => item['@type'] === 'FAQPage');
      check(faq?.mainEntity?.length === 5 && faq.mainEntity.every(q => q.name && q.acceptedAnswer?.text), 'FAQ schema must describe the five visible answers.');
    }
    if (page === 'glossary.html') {
      const terms = schema[0]['@graph'].find(item => item['@type'] === 'DefinedTermSet')?.hasDefinedTerm;
      check(terms?.length === 12 && terms.every((term,i) => term.description === glossary[i][2] && visible.includes(glossary[i][0])), 'Glossary schema must match twelve visible terms.');
    }
  } else errors.push(`${page}: missing canonical URL.`);
}

const index = await fs.readFile(path.join(directory, 'index.html'), 'utf8');
const research = await fs.readFile(path.join(directory, 'research-hub.html'), 'utf8');
check(index.includes('data-enquiry-form') && (profile.formAction ? index.includes(' action=') : index.includes(enquiryStatus(profile))), 'Homepage must provide verified contact or accurate unavailable state before JavaScript runs.');
check(research.includes('glossary.html'), 'Research must link to the glossary.');
const runtime = await fs.readFile(path.join(directory, 'runtime.js'), 'utf8');
check(/^window\.MLX_AUDIT_ENDPOINT = null;\nwindow\.MLX_LOCAL_PREVIEW = false;\nwindow\.MLX_INTAKE_TOKEN = null;\n$/.test(runtime), 'Public runtime must not provide an intake endpoint or token.');
const sitemap = await fs.readFile(path.join(directory, 'sitemap.xml'), 'utf8');
const locations = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map(([, location]) => location).sort();
check(JSON.stringify(locations) === JSON.stringify(expectedPages.map(page => `${origin}/${page === 'index.html' ? '' : page}`).sort()), 'Sitemap must contain exactly the eight pages at the published origin.');
const robots = await fs.readFile(path.join(directory, 'robots.txt'), 'utf8');
check(robots.includes(`Sitemap: ${origin}/sitemap.xml`), 'robots.txt must reference the published sitemap.');
const llms = await fs.readFile(path.join(directory, 'llms.txt'), 'utf8');
check(!/local (?:preview|audit intake|build)/i.test(llms) && llms.includes(enquiryStatus(profile)), 'llms.txt must accurately describe public availability.');
check([...llms.matchAll(/\]\((https:\/\/[^)]+)\)/g)].every(([, url]) => url.startsWith(`${origin}/`)), 'llms.txt links must use the published origin.');

const commonChecks = spawnSync(process.execPath, [path.join(root, 'scripts/check-site.mjs'), '--public'], { cwd: root, stdio: 'inherit' });
if (commonChecks.error) throw commonChecks.error;
if (commonChecks.status !== 0) errors.push('Shared page, script, metadata or internal-link checks failed.');
if (errors.length) { console.error(errors.join('\n')); process.exitCode = 1; }
else console.log('Public checks passed: public page allowlist, isolated enquiry client, honest availability, consistent metadata and valid links.');
