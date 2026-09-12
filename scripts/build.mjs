import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const source = path.join(root, 'site');
const output = path.join(root, 'dist');
const pages = ['index.html', 'what-is-geo.html', 'research-hub.html', 'answer-engine-index-q3-2026.html', 'case-study.html', 'about.html', 'method.html'];
const origin = 'https://mindleverx.com';
const escape = value => value.replaceAll('&', '&amp;').replaceAll('"', '&quot;').replaceAll('<', '&lt;').replaceAll('>', '&gt;');
const decode = value => value.replaceAll('&amp;', '&').replaceAll('&quot;', '"').replaceAll('&#39;', "'").replaceAll('&lt;', '<').replaceAll('&gt;', '>');
const json = value => JSON.stringify(value).replaceAll('<', '\\u003c');

await fs.mkdir(output, { recursive: true });
// dist is a generated artifact. Keep the allowlist explicit so reference documents cannot be served.
for (const entry of await fs.readdir(output)) await fs.rm(path.join(output, entry), { recursive: true, force: true });
const sharedScript = await fs.readFile(path.join(source, 'shared.js'), 'utf8');
const sharedStyle = await fs.readFile(path.join(source, 'shared.css'), 'utf8');
for (const page of pages) {
  let html = await fs.readFile(path.join(source, page), 'utf8');
  html = html.replace(/<!--\s*INTERNAL:START\s*-->[\s\S]*?<!--\s*INTERNAL:END\s*-->/g, '');
  html = html.replace(/<!--[\s\S]*?-->/g, '');
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
llms += `\n## Local build status\n\nThe local build records intake and supports an evidence review workspace. Automated audits, engine monitoring and email delivery are not connected. Public numerical exhibits are sample illustrations except the explicitly dated historical case-study observations.\n\n- [Method](${origin}/method.html): the intended seven-stage workflow and implementation status.\n`;
await fs.writeFile(path.join(output, 'llms.txt'), llms);
try { await fs.access(path.join(root, 'platform')); await fs.cp(path.join(root, 'platform'), path.join(output, 'app'), { recursive: true }); }
catch (error) { if (error.code !== 'ENOENT') throw error; }
console.log(`Built ${pages.length} self-contained pages in dist/ with conservative metadata and a disconnected static intake runtime.`);
