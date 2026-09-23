import { backupDatabase, verifyDatabaseBackup, restoreDatabaseBackup } from '../server/database-recovery.mjs';

const usage = `Local database recovery (Node >=24):
  npm run db:backup -- --source <existing.sqlite> --output <new-directory>
  npm run db:verify -- --input <backup-directory> [--expected-sha256 <hash>]
  npm run db:restore -- --input <backup-directory> --output <new-directory> [--expected-sha256 <hash>]
Parent directories must exist. Restore never overwrites or switches the running app.
Backups contain private data. Keep them in ignored local storage; see docs/database-recovery.md.`;

const [operation, ...args] = process.argv.slice(2);
if (args.includes('--help') || operation === '--help') {
  console.log(usage);
} else {
  try {
    const allowed = { backup: ['--source', '--output'], verify: ['--input', '--expected-sha256'], restore: ['--input', '--output', '--expected-sha256'] }[operation];
    if (!allowed || args.length % 2) throw new Error(usage);
    const options = {};
    for (let i = 0; i < args.length; i += 2) {
      if (!allowed.includes(args[i]) || Object.hasOwn(options, args[i]) || !args[i + 1] || args[i + 1].startsWith('--')) throw new Error(usage);
      options[args[i]] = args[i + 1];
    }
    const required = operation === 'backup' ? ['--source', '--output'] : operation === 'restore' ? ['--input', '--output'] : ['--input'];
    if (required.some(name => !options[name])) throw new Error(usage);
    const verification = { expectedSha256: options['--expected-sha256'] };
    const result = operation === 'backup' ? await backupDatabase(options['--source'], options['--output'])
      : operation === 'restore' ? await restoreDatabaseBackup(options['--input'], options['--output'], verification)
        : await verifyDatabaseBackup(options['--input'], verification);
    console.log(JSON.stringify(result));
  } catch (error) {
    console.error(JSON.stringify({ status: 'failed', operation, message: error.message }));
    process.exitCode = 1;
  }
}
