import { buildReportPackage } from '../server/report-package.mjs';

const usage = 'Usage: node scripts/build-report.mjs --input <json-file> --output <new-directory>';

try {
  const args = process.argv.slice(2);
  if (args.length === 1 && args[0] === '--help') {
    process.stdout.write(`${usage}\nCreates a local draft only. No approval, release or network action. Output parent must already exist.\n`);
  } else {
    const options = {};
    for (let index = 0; index < args.length; index += 2) {
      const flag = args[index];
      if (!['--input', '--output'].includes(flag) || !args[index + 1] || args[index + 1].startsWith('--') || Object.hasOwn(options, flag)) {
        throw new Error(usage);
      }
      options[flag] = args[index + 1];
    }
    if (!options['--input'] || !options['--output']) throw new Error(usage);
    const result = buildReportPackage({ inputPath: options['--input'], outputDir: options['--output'] });
    process.stdout.write(`Draft package created: ${result.outputDir}\nEvidence and claims still require semantic review. No approval or release occurred.\n`);
    for (const warning of result.warnings) process.stderr.write(`Warning: ${warning}\n`);
  }
} catch (error) {
  process.stderr.write(`Report build failed: ${error.message}\n`);
  process.exitCode = 1;
}
