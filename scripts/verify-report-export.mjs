import { constants } from 'node:fs';
import { open } from 'node:fs/promises';
import { verifyReportExport, REPORT_EXPORT_LIMITS } from '../server/report-export.mjs';

const usage = 'Usage: npm run report:verify -- --input <file> [--expected-snapshot <sha256>]';
const output = (status, code, exit) => { process.stdout.write(`${JSON.stringify({ status, code })}\n`); process.exitCode = exit; };
const args = process.argv.slice(2);
if (args.length === 1 && args[0] === '--help') {
  process.stdout.write(`${usage}\nChecks internal byte integrity and reproduces supported saved results offline. No app, database, Python or network required.\nAn expected snapshot hash pins immutable manifest/source/result/PDF only. It does not authenticate review decisions or export time. Without an external hash, origin remains unverified. PDF framing and bytes are checked, not rendering or semantic truth.\nExports contain unsanitized raw source and local review notes, not material prepared for client sharing. PASS does not qualify collection, authorize release, establish identity or prove authenticity. No files are extracted or overwritten.\nExit: 0 PASS; 1 invalid/corrupt input or arguments; 2 unsupported version or unavailable input.\n`);
} else {
  const options = {};
  let valid = args.length > 0;
  for (let i = 0; i < args.length; i += 2) {
    const flag = args[i], value = args[i + 1];
    if (!['--input','--expected-snapshot'].includes(flag) || !value || value.startsWith('--') || Object.hasOwn(options, flag)) { valid = false; break; }
    options[flag] = value;
  }
  if (!valid || !options['--input'] || (options['--expected-snapshot'] !== undefined && !/^[a-f0-9]{64}$/i.test(options['--expected-snapshot']))) {
    output('FAIL', 'invalid_arguments', 1);
  } else {
    let file;
    try {
      // Do not wait for a writer if an untrusted input path names a FIFO.
      file = await open(options['--input'], constants.O_RDONLY | constants.O_NONBLOCK);
      const stat = await file.stat();
      if (!stat.isFile()) output('UNAVAILABLE', 'input_unavailable', 2);
      else if (stat.size > REPORT_EXPORT_LIMITS.envelope) output('FAIL', 'invalid_export_size', 1);
      else {
        // Bound the read even if the file grows after stat. No whole-file unbounded read.
        const bytes = Buffer.alloc(REPORT_EXPORT_LIMITS.envelope + 1);
        let size = 0;
        while (size < bytes.length) {
          const read = await file.read(bytes, size, bytes.length - size, null);
          if (!read.bytesRead) break;
          size += read.bytesRead;
        }
        const result = verifyReportExport(bytes.subarray(0, size), { expectedSnapshotSha256: options['--expected-snapshot'] });
        process.stdout.write(`${JSON.stringify(result)}\n`);
        process.exitCode = result.status === 'PASS' ? 0 : result.status === 'UNSUPPORTED' ? 2 : 1;
      }
    } catch { output('UNAVAILABLE', 'input_unavailable', 2); }
    finally { if (file) await file.close(); }
  }
}
