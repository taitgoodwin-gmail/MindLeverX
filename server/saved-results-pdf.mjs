import { execFile } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const script = fileURLToPath(new URL('./render-saved-results.py', import.meta.url));
export function savedResultsPdf(report, { python = process.env.MLX_PDF_PYTHON || 'python3' } = {}) {
  if (report?.state !== 'complete') return Promise.reject(new Error('Complete saved results required.'));
  return new Promise((accept, reject) => {
    const child = execFile(python, [script], { encoding: 'buffer', timeout: 15000, maxBuffer: 8 * 1024 * 1024, windowsHide: true }, (error, stdout) => {
      if (error || !stdout.subarray(0, 5).equals(Buffer.from('%PDF-'))) {
        reject(new Error('PDF generation is unavailable. Check the local PDF runtime and try again.'));
      } else accept(stdout);
    });
    // An unavailable executable may close stdin before the report can be written.
    child.stdin.on('error', () => {});
    child.stdin.end(JSON.stringify(report));
  });
}
