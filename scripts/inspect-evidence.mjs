import { closeSync, openSync, readFileSync, unlinkSync, writeFileSync } from 'node:fs';
import { inspectEvidence } from '../server/evidence-inspection.mjs';

const usage = 'Usage: node scripts/inspect-evidence.mjs --input <export.json> --brand <literal-name> --output <new-result.json> [--expected-sha256 <hash>]';

try {
  const args = process.argv.slice(2);
  if (args.length === 1 && args[0] === '--help') {
    process.stdout.write(`${usage}\nLocal inspection only; no collection, qualification, approval or release. Output parent must exist.\n`);
  } else {
    const options = {};
    for (let i = 0; i < args.length; i += 2) {
      const flag = args[i];
      if (!['--input', '--brand', '--output', '--expected-sha256'].includes(flag) || !args[i + 1] || args[i + 1].startsWith('--') || Object.hasOwn(options, flag)) throw new Error(usage);
      options[flag] = args[i + 1];
    }
    if (!options['--input'] || !options['--brand'] || !options['--output']) throw new Error(usage);
    const result = inspectEvidence(readFileSync(options['--input']), { brand: options['--brand'], expectedSha256: options['--expected-sha256'] });
    // Exclusive creation refuses existing files, input-as-output and symlinks.
    const fd = openSync(options['--output'], 'wx', 0o600);
    try {
      writeFileSync(fd, `${JSON.stringify(result, null, 2)}\n`);
    } catch (error) {
      unlinkSync(options['--output']);
      throw error;
    } finally {
      closeSync(fd);
    }
    process.stdout.write(`Inspection ${result.status}. Qualification still required. Result: ${options['--output']}\n`);
    process.exitCode = result.status === 'complete' ? 0 : 2;
  }
} catch (error) {
  process.stderr.write(`Evidence inspection failed: ${error.message}\n`);
  process.exitCode = 1;
}
