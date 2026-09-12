import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import vm from 'node:vm';

const html = await readFile(resolve('dist/app/index.html'), 'utf8');
const js = await readFile(resolve('dist/app/app.js'), 'utf8');
const css = await readFile(resolve('dist/app/styles.css'), 'utf8');
const checks = [
  [/<meta name="robots" content="noindex,\s*nofollow">/.test(html), 'Platform must declare noindex/nofollow.'],
  [html.includes('/app/app.js') && html.includes('/app/styles.css'), 'Platform assets must be linked.'],
  [html.includes('role="status"') && html.includes('aria-live="polite"'), 'Save feedback must be accessible.'],
  [css.includes('prefers-reduced-motion'), 'Platform must respect reduced motion.'],
  [!/(?:^|[;{])font-size:(?:[0-9]|10)px(?:[;}])/.test(css), 'Platform text is too small.'],
];
new vm.Script(js, { filename: 'dist/app/app.js' });
const errors = checks.filter(([okay]) => !okay).map(([,message]) => message);
if (errors.length) { console.error(errors.join('\n')); process.exitCode = 1; }
else console.log('Platform checks passed: assets, script syntax, accessible feedback, indexing boundary and typography.');
