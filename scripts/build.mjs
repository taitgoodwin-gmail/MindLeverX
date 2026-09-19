import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const source = path.join(root, 'site');
const publicBuild = process.argv.includes('--public');
const output = path.join(root, publicBuild ? 'public-dist' : 'dist');
const pages = ['index.html', 'what-is-geo.html', 'research-hub.html', 'answer-engine-index-q3-2026.html', 'case-study.html', 'about.html', 'method.html'];
const originInput = process.env.MLX_SITE_URL || (process.env.VERCEL_PROJECT_PRODUCTION_URL ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}` : 'https://mindleverx.com');
const siteURL = new URL(originInput);
if (siteURL.protocol !== 'https:' || siteURL.username || siteURL.password || siteURL.pathname !== '/' || siteURL.search || siteURL.hash) {
  throw new Error('MLX_SITE_URL must be an HTTPS origin without a path, credentials, query or fragment.');
}
const origin = siteURL.origin;
const escape = value => value.replaceAll('&', '&amp;').replaceAll('"', '&quot;').replaceAll('<', '&lt;').replaceAll('>', '&gt;');
const decode = value => value.replaceAll('&amp;', '&').replaceAll('&quot;', '"').replaceAll('&#39;', "'").replaceAll('&lt;', '<').replaceAll('&gt;', '>');
const json = value => JSON.stringify(value).replaceAll('<', '\\u003c');

// Public hosting has no intake or operator backend. Keep the local product intact
// while making the published pages accurate before any JavaScript executes.
function publicPage(html) {
  html = html.replace(/<aside class="preview-banner" id="local-preview"[^>]*>[\s\S]*?<\/aside>/g, '');
  html = html.replace(/<form\b[^>]*data-kind="(audit|subscription)"[^>]*>[\s\S]*?<\/form>\s*<noscript>[\s\S]*?<\/noscript>\s*<div class="note" id="fnote"[^>]*>[\s\S]*?<\/div>/g,
    (_, kind) => `<p class="note" style="margin-top:24px">${kind === 'subscription' ? 'Newsletter subscriptions' : 'Audit requests'} are not open yet. Please check back for availability.</p>`);
  const copy = [
    ['with clearly labelled example scorecards and a local intake workspace.', 'with clearly labelled example scorecards and an introduction to the intended method.'],
    ['current local build status.', 'current service availability.'],
    ['Local preview capabilities are clearly identified.', 'Current capabilities and future integrations are clearly identified.'],
    ['The local workspace organizes draft work and review decisions. Autonomous collection and delivery are future integrations.', 'The intended review workspace organizes draft work and review decisions. Autonomous collection and delivery are future integrations.'],
    ['This build records an audit request locally; it does not run an audit, start a subscription or deliver a scorecard.', 'Audit requests and subscriptions are not open yet. Automated audits and scorecard delivery are future integrations.'],
    ['Request a future review across technical access, content quotability, off-site authority and measured visibility. The current form saves the request only.', 'A planned review across technical access, content quotability, off-site authority and measured visibility. Requests will open when the service is available.'],
    ['Save a request for a free GEO audit. In this local preview, the request is stored for review; no audit runs or email is sent.', 'Explore the intended GEO audit and the evidence it would need.'],
    ['Save a request for a free GEO audit. This local preview stores your request for review; it does not collect engine answers or deliver a scorecard.', 'Explore the intended GEO audit and the evidence it would need.'],
    ['Register your domain for an audit request. The local workspace saves the request; engine collection and audit delivery are not connected.', 'Explore the intended GEO audit and the evidence it would need.'],
    ['Register interest in future research updates. The newsletter is planned; this preview records interest only.', 'The Answer Brief is a planned newsletter about GEO research and measurement.'],
    ['The current build provides local intake and a review workspace; engine collection is not connected.', 'This website introduces the intended method and sample reports. Audit requests and engine collection are not available yet.'],
    ['<strong>The audit request is the first step.</strong> The local form records your domain and email for review. Submitting it does not run an audit or create a delivery commitment.', '<strong>Audit requests are not open yet.</strong> Please check back for availability.'],
    ['The company-domain field accepts a website domain only. An operator can review saved intake in the local workspace; there is no external message delivery or promised response time.', 'This website does not collect audit requests or newsletter signups.'],
    ['request intake available locally; audit delivery not connected.', 'planned; requests are not open yet.'],
    ['No credit card. The audit form is on the homepage.', 'Audit requests are not open yet. Please check back for availability.'],
    ['The local workspace supports recording requests, organizing evidence and reviewing work.', 'This website presents the planned method and sample reporting. Public intake is not open yet.'],
    ['Request a free audit', 'Audit availability'],
    ['Request an audit', 'Audit availability'],
    ['Start with the audit →', 'Audit availability →'],
    ['Local request storage, no payment', 'Requests open when the service is available'],
    ['Start with an audit request', 'Audit availability'],
    ['A free GEO audit runs this methodology against your site and labels every number the same way — measured, or not measured yet.', 'The planned GEO audit would apply this methodology to your site, distinguishing measured evidence from unmeasured dimensions.'],
    ['Process guarantees only — the method is fixed, the numbers are what they are.', 'The intended process preserves evidence and methodology versions.'],
    ['Content artifacts are delivered as drafts for your approval.', 'The intended workflow prepares content artifacts as drafts for your approval.'],
  ];
  for (const [before, after] of copy) html = html.replaceAll(before, after);
  return html;
}

await fs.mkdir(output, { recursive: true });
// dist is a generated artifact. Keep the allowlist explicit so reference documents cannot be served.
for (const entry of await fs.readdir(output)) await fs.rm(path.join(output, entry), { recursive: true, force: true });
let sharedScript = await fs.readFile(path.join(source, 'shared.js'), 'utf8');
if (publicBuild) {
  sharedScript = sharedScript
    .replace(/  const banner = \$\('local-preview'\);\n  if \(banner\) banner.hidden = !window.MLX_LOCAL_PREVIEW;\n/, '')
    .replace(/  const form = \$\('auditform'\);[\s\S]*?(?=  if \(matchMedia\('\(prefers-reduced-motion)/, '');
}
const sharedStyle = await fs.readFile(path.join(source, 'shared.css'), 'utf8');
for (const page of pages) {
  let html = await fs.readFile(path.join(source, page), 'utf8');
  html = html.replace(/<!--\s*INTERNAL:START\s*-->[\s\S]*?<!--\s*INTERNAL:END\s*-->/g, '');
  html = html.replace(/<!--[\s\S]*?-->/g, '');
  if (publicBuild) html = publicPage(html);
  html = html.replace('<script src="shared.js" data-inline></script>', () => `<script>${sharedScript}</script>`);
  html = html.replace('<link rel="stylesheet" href="shared.css" data-inline>', () => `<style>${sharedStyle}</style>`);
  const title = decode(html.match(/<title>([^<]+)<\/title>/)?.[1] || 'MindLeverX');
  const description = decode(html.match(/<meta name="description" content="([^"]*)"/)?.[1] || '');
  const url = `${origin}/${page === 'index.html' ? '' : page}`;
  const metadata = [
    `<link rel="canonical" href="${url}">`,
    '<meta property="og:type" content="website">',
    '<meta property="og:site_name" content="MindLeverX">',
    `<meta property="og:title" content="${escape(title)}">`,
    `<meta property="og:description" content="${escape(description)}">`,
    `<meta property="og:url" content="${url}">`,
    `<script type="application/ld+json">${json({ '@context': 'https://schema.org', '@graph': [
      { '@type': 'Organization', '@id': `${origin}/#organization`, name: 'MindLeverX', url: origin },
      { '@type': page === 'research-hub.html' ? 'CollectionPage' : 'WebPage', '@id': `${url}#page`, name: title, description, url,
        isPartOf: { '@type': 'WebSite', name: 'MindLeverX', url: origin }, about: { '@type': 'Thing', name: 'Generative Engine Optimization' } }
    ] })}</script>`
  ].join('\n');
  html = html.replace('</head>', `${metadata}\n</head>`).replace(/\n{3,}/g, '\n\n');
  await fs.writeFile(path.join(output, page), html);
}
await fs.writeFile(path.join(output, 'runtime.js'), 'window.MLX_AUDIT_ENDPOINT = null;\nwindow.MLX_LOCAL_PREVIEW = false;\nwindow.MLX_INTAKE_TOKEN = null;\n');
await fs.writeFile(path.join(output, 'robots.txt'), `User-agent: *\nAllow: /\nDisallow: /app/\nDisallow: /api/\n\nSitemap: ${origin}/sitemap.xml\n`);
await fs.writeFile(path.join(output, 'sitemap.xml'), `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${pages.map(page => `  <url><loc>${origin}/${page === 'index.html' ? '' : page}</loc></url>`).join('\n')}\n</urlset>\n`);
let llms = await fs.readFile(path.join(source, 'llms.txt'), 'utf8');
llms = llms.replaceAll('https://mindleverx.com', origin);
if (publicBuild) {
  llms = llms.replace('This is a local preview with request intake and a workspace for organizing evidence, drafts and review decisions.', 'This is a public website introducing the intended method and sample reporting. Audit requests and newsletter subscriptions are not open yet.')
    .replace('project preview and local audit intake.', 'project overview and audit availability.');
} else {
  llms += `\n## Local build status\n\nThe local build records intake and supports an evidence review workspace. Automated audits, engine monitoring and email delivery are not connected. Public numerical exhibits are sample illustrations except the explicitly dated historical case-study observations.\n\n- [Method](${origin}/method.html): the intended seven-stage workflow and implementation status.\n`;
}
await fs.writeFile(path.join(output, 'llms.txt'), llms);
if (!publicBuild) {
  await fs.cp(path.join(root, 'results'), path.join(output, 'results'), { recursive: true });
  try { await fs.access(path.join(root, 'platform')); await fs.cp(path.join(root, 'platform'), path.join(output, 'app'), { recursive: true }); }
  catch (error) { if (error.code !== 'ENOENT') throw error; }
}
console.log(`Built ${pages.length} self-contained pages in ${path.basename(output)}/ with conservative metadata and a disconnected static intake runtime.`);
