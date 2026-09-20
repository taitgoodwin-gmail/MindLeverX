# MIN-17 — Local database recovery

20 September 2026. Owner-authorized independent MVP engineering. Plan: define cases → implement → verify and record. Initial estimate 30–45 minutes. Isolated branch `codex/local-recovery-2026-09-20`, based on verified clean private checkpoint `e976747564a5d039ac42129ab085246e77f8d1a9`. Public main is a separate release. Prior source/preview checkouts remain untouched.

## Scope and requirement basis

Implementation choice: explicit local SQLite snapshot, verification and restoration into a new private directory. This addresses the handoff's missing DB recovery drill; it is supporting engineering, not a newly accepted product requirement. The following current narratives remain review drafts, with partial coverage only.

**MLX3-NFR-006 — Data Minimization and Retention**

The service stores only data needed for the approved purpose and applies selected retention and deletion rules across raw evidence, receipts, reports, contacts and backups, recording deletions and resulting reproduction limits.

**MLX3-NFR-009 — Exact Result Reproducibility**

Pinned deterministic processing reproduces measurement values from retained evidence, and approved generated prose is reproduced by retrieving its stored version rather than regenerating it.

**MLX3-ADM-014 — Incident and Support Workspace**

Where incident tooling is included, an authorized operator can correlate a support case with permitted run evidence and logs without acquiring deployment, credential, billing, deletion, publication or outreach powers.

NFR-009: retrieve exact artifacts after recovery. NFR-006: restrict files, document storage and cleanup; no retention duration or automated deletion policy is invented. ADM-014: supporting local recovery procedure only; no incident UI/production access-policy acceptance.

## Decision and tenets

Selected over durable collection jobs because collection qualification and offer rules remain unresolved while database recovery is independently testable. Manual file copying is simpler but omits WAL commits unless coordinated correctly. Use the supported SQLite backup API and test the WAL case. Operator-selected filesystem paths keep this an explicit local command; no new web recovery endpoint.

Direct repeatability and automation; supporting owner UX through clear commands and refusal to overwrite; supporting continuity of recurring records without measured revenue benefit. Client UX/revenue/competitive outcomes unmeasured. No AI judgment or behavioral intervention needed. Strongest limitation: a second file on the same Mac does not protect against machine loss. Off-device destination, encryption/key custody, retention/deletion, production deployment and RPO/RTO remain separate work.

## Official sources checked 2026-09-20

- https://nodejs.org/api/sqlite.html#sqlitebackupsourcedb-path-options — `sqlite.backup(sourceDb, path[, options])`. Documented supported API, available in the project's Node >=24 runtime; destination overwrite is possible, so our command exclusively creates its own new directory.
- https://sqlite.org/backup.html — documented online database snapshot capability; use instead of copying a live main file.
- https://sqlite.org/pragma.html#pragma_integrity_check and https://sqlite.org/pragma.html#pragma_foreign_key_check — separate structural and foreign-key checks. Neither establishes report-byte authenticity; existing report snapshot hashes add corruption detection, not provenance.

These are documented behaviors. Private directory/file permissions, bundle manifest, supported-schema checks, refusal to overwrite and cleanup are our implementation choices.

## Executable cases — defined before implementation

Boundary: local recovery module/CLI plus reopened application database. Fixed data is synthetic; no owner preview database is a destructive-test input. Prerequisites: Node >=24, Python/ReportLab for real-PDF case; base schema at e976747. Run `node --test tests/database-recovery.test.mjs` with `MLX_PDF_PYTHON` configured. Each case uses a unique temporary directory and removes it after execution. Missing runtime is BLOCKED; assertion mismatch is FAIL; PASS requires every expected observation.

1. **REC-01 — WAL snapshot and full recovery (NFR-009/ADM-014).** Create schema with seeding disabled, disable automatic checkpointing, checkpoint empty schema, then insert one client, two panel versions, one lead, a real-rendered report revision and pending review/activity. Record every table row and source/result/PDF BLOB/hash independently before backup. Confirm nonempty WAL. Back up while source connection remains open; verify bundle; close/delete disposable source and evidence; restore into a fresh directory; reopen through application code. Expect every row, artifact and hash equal to baseline, pending review unchanged, panels in order, immutable-revision trigger present. Write a new client to prove restored DB remains usable. No re-rendering or source path required.
2. **REC-02 — Refuse existing destinations (NFR-006/ADM-014).** Create sentinel destination file/directory/symlink; attempt backup and restore including source path. Expect failure and sentinel/source bytes unchanged. Concurrent same-destination attempts must yield one success and one refusal.
3. **REC-03 — Reject damaged/unsupported backups (NFR-009).** Separately alter database bytes, manifest checksum, a report BLOB (with outer hash updated), schema, and foreign-key relation. Verify and attempt restore. Each must fail with no usable destination or leftover partial operation directory. A structurally valid unrelated SQLite DB must not pass as a MindLeverX backup.
4. **REC-04 — Invalid input and cleanup (NFR-006/ADM-014).** Missing source, empty file, directory, symlink, FIFO and malformed/oversized manifest must fail promptly without creating source data. Reject bundle SQLite journal/SHM/WAL companions rather than silently ignoring them. Check partial output cleanup after failures and no unintended app initialization/seed.
5. **REC-05 — CLI/privacy contract (all partial mappings).** Execute backup, verify and restore from another working directory using explicit paths; expect JSON status and nonzero exit for invalid invocations. Check created directories 0700 and files 0600, backup patterns ignored by Git, and command output contains counts/hashes but no client/answer/PDF content. A wrong pinned expected hash must fail. Reopen restored app state; preserve source and other files.

Initial result was NOT RUN before implementation. All cases subsequently passed as recorded below; test code supplies exact fixture bytes and commands.

## Operator procedure

Run from the product checkout, Node >=24. The current tool accepts only the exact shipped schema; future migrations require using the matching code version or an explicit migration. Maximum supported input database is 1 GiB and manifest is 64 KiB. These are local implementation limits, not approved retention or capacity commitments. Use trusted local paths on the operator's filesystem; this CLI is not an interface for hostile users or a defense against a process acting as the same OS user.

1. Identify the existing database explicitly. The server uses `MLX_DB_PATH` or `data/mindleverx.sqlite`. Do not guess or create a new source. Make ignored private parent directories, then create a unique backup:

   ```sh
   mkdir -p -m 700 backups data/recovery
   npm run db:backup -- --source /absolute/path/existing.sqlite --output backups/recovery-2026-09-20
   ```

   The live source is opened read-only through SQLite; committed WAL content is included. Do not copy just the live `.sqlite` file. Output contains the database SHA-256, counts and schema fingerprint. Record the hash separately if you need a pinned comparison; a hash stored with the backup does not establish authenticity. Backups are manually initiated; no schedule or retention policy was installed.

2. Verify the snapshot. Replace the hash below with the one retained in step 1 (the flag is optional when no independent anchor exists):

   ```sh
   npm run db:verify -- --input backups/recovery-2026-09-20 --expected-sha256 <database-sha256>
   ```

   Verification copies the database into a private temporary directory, checks that copy, and removes it. It checks file size/hash, exact supported schema, `integrity_check`, `foreign_key_check`, table inventory, and each stored report revision's source/result/PDF/snapshot identity and hashes. A backup with journal companions or unexpected files is rejected; use backup output unchanged. The original backup is never opened for mutation.

3. Restore only into a new directory, preserving the old database:

   ```sh
   npm run db:restore -- --input backups/recovery-2026-09-20 --output data/recovery/drill-2026-09-20 --expected-sha256 <database-sha256>
   ```

   Result: `workspace.sqlite` and `recovery.json`, mode 0600 in a 0700 directory. Existing files/directories/links are refused. A caught failure removes only the directory created by that operation. A killed process may leave an incomplete directory; do not use it as a verified restore. Preserve original data, inspect the failed operation's directory and use a different new destination. Do not delete SQLite companions from a live database to make a backup pass.

4. For a deliberate separate preview, build and start the restored copy with `MLX_DB_PATH=/absolute/path/to/new/workspace.sqlite`, `MLX_SEED=false`, and an unused local port. Verify clients, panels, review statuses and stored artifacts before any later operational switch. This command does not switch or stop a running app. Ports 4328/4329 and the owner's pending review remain reserved. Existing review statuses are restored as data, not newly approved. Sessions are in memory and are not recovered.

5. Remove only disposable synthetic drill directories after inspection. Real backups contain private client, lead, review and retained artifact data. Keep them under ignored `backups/` or `data/`, do not put them in public `dist/`/`public-dist/`, Git, or a shared attachment. Local file modes are not encryption. Governed off-device backup, retention/deletion policy and secure erasure remain unresolved. Deleting the original data does not delete a backup copy.

External raw files that have not been retained in a report revision, configuration, secrets, source code/runtime and PDF dependencies are outside the database snapshot. Keep the matching source checkpoint separately. The recovery receipt is local evidence, not trusted time or proof of provenance. Snapshot creation can restart under concurrent writers; no hard runtime/RPO/RTO guarantee is claimed. No paid delivery, collection qualification, production identity or customer acceptance follows from this drill.

## Execution evidence — 20 September 2026

**All three implementation steps complete locally.** Node 26.7.0; real PDF case used `/Users/tag/.cache/codex-runtimes/codex-primary-runtime/dependencies/python/bin/python3` (existing ReportLab runtime). Eight focused tests passed, covering REC-01–05 and their separate variants. The first drill explicitly proved the main DB file remained at the empty-schema checkpoint while committed fixture records lived in WAL, then recovered exact table rows and artifact bytes after the source and external evidence were removed. Pending and returned-review cases both passed; the restored database accepted and retained a subsequent client insertion. Synthetic fixtures were removed by test cleanup. Owner preview databases were not used.

- `MLX_PDF_PYTHON=... npm run check`: **135/135 PASS** with loopback listeners enabled; build/site/platform checks also passed. [Full log](../artifacts/recovery-verification/check-unsandboxed.log).
- Initial sandbox run: existing HTTP tests could not bind loopback (`EPERM`); recorded as an environment restriction, then rerun successfully. [Initial log](../artifacts/recovery-verification/check.log).
- `npm run check:requirements`: **structure PASS and 7/7 validator regression tests PASS**. Original-source freshness reconciliation remains NOT RUN. [Log](../artifacts/recovery-verification/requirements.log).
- `npm run build:public`: **PASS**, public artifact excludes operator/data routes; no deployment. [Log](../artifacts/recovery-verification/public-build.log).
- `git diff --check`: **PASS**. Coordinator self-review only; no independent agent or human review claimed.

The full-suite log retains each focused recovery test result. Files/logs under artifacts are ignored local evidence; this tracked procedure and the tests remain portable. [Machine-readable receipt](../artifacts/recovery-verification/receipt.json) hashes the logs. The earlier private source checkout remains clean at e976747; original root dirty homepage/dashboard/output work is preserved. No preview restart, report approval, private evidence duplication, vendor contact, push/merge or deployment was performed.

Material improvement: supported snapshot/verify/restore commands replace the README's manual stopped-server directory-copy advice. Verified improvement is the demonstrated WAL/recovery behavior and refusal to overwrite; time saved and reduced operating cost are unmeasured. Remaining full-MVP dependencies retain their existing Linear statuses.


## MIN-18 schema compatibility follow-up — 20 September

The current product adds `report_preparation_attempts` as an eighth table. Backup verification accepts the exact current schema and the exact seven-table c00da406 baseline, checking each snapshot's own schema fingerprint/counts. A legacy restore preserves its original schema until normal app open adds the empty attempt table. PREP-06 verified old records unchanged and current attempt rows preserved, including running/terminal states. Earlier seven-table results above remain historical evidence. Restoring a running attempt preserves its original deadline; a later app read/request reconciles expired local work without launching a retry. Match code/database versions when rolling back; no backward compatibility with arbitrary older/future schemas is claimed. See [MIN-18 evidence](report-preparation-recovery.md).
