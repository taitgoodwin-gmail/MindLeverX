# MindLeverX

A working local build of the supplied MindLeverX website and operator platform designs. The site preserves the existing Spectral / IBM Plex / oxblood visual direction. The workspace adds persistent clients, audit intake, evidence reviews, versioned prompt panels, and an activity log.

Current planning direction, official-source practice, and purchase/launch decisions are recorded in [build guidance](docs/build-guidance.md), with links to the existing MVP plan.

## Run

Requires **Node.js 24 or later**, including its built-in `node:sqlite` module. There are no runtime packages to install.

```sh
npm run dev
```

- Website: http://127.0.0.1:4317/
- Operator workspace: http://127.0.0.1:4317/app/

`npm run dev` builds once and starts the server. After editing source files, run `npm run build` and reload the browser. `npm start` serves an existing build. Use `PORT=4318 npm start` if the default port is occupied.

## What works

- Seven public pages, including an added method page, with responsive navigation and light/dark themes.
- Audit and subscription-interest forms save to a real local lead inbox, with validation and explicit storage consent.
- Create clients, update their stage, pause/resume records, and save notes.
- Review the supplied fictional evidence, approve or return a review with a note, and retain the decision history.
- Create immutable prompt-panel versions with a required change note.
- Inspect client report previews and distinguish sample observations from unmeasured clients.
- Read the activity log and persist changes across server restarts using SQLite.

## Data and scope

The server listens only on `127.0.0.1`. Its sessions and CSRF checks protect the local workflow; they are **not a production user-authentication system**. Anyone with access to this computer's local server can use the workspace. The actor is accurately recorded as “Local operator.”

The initial three clients and their scores/evidence are fictional sample records derived from the archive. New clients have no scores. Submitted requests are actual local records; they do not trigger a crawl, automated score, engine request, email, payment, or publication. A review approval records a decision locally and does not send or publish anything.

Persistent data is stored at `data/mindleverx.sqlite` and is ignored by Git. Keep a backup of this directory while the server is stopped. Use `MLX_DB_PATH=/absolute/path/workspace.sqlite npm start` to choose another database. `MLX_SEED=false npm start` starts a **new** database without samples; it does not remove existing records.

The generated static `dist/` has an unconnected intake runtime by default. The local server provides `/runtime.js` with the local intake configuration. Uploading `dist/` alone does not provide a backend or authenticated platform.

## Public website deployment

`npm run build:public` creates and verifies the website-only `public-dist/` artifact used by Vercel. Public pages show that audit requests and newsletter subscriptions are not open yet. The operator workspace, API and SQLite records stay local. See [Vercel deployment notes](docs/vercel-deployment.md) for configuration and canonical URLs.

## Project layout

| Path | Purpose |
| --- | --- |
| `site/` | Active website source; shared behavior is inlined during build |
| `platform/` | Operator interface source |
| `server/` | Local HTTP API, validation, SQLite schema, sample records |
| `scripts/` | Reproducible build and website checks |
| `tests/` | API integration tests with isolated temporary databases |
| `docs/` | Current build notes and implementation boundaries |
| `dist/` | Generated served files; never edit directly |
| `reference/` | Unmodified extracted archive, retained locally and excluded from Git |

The archive's embedded instructions, old handoffs, and proposed commercial rulings are historical reference material. This build does not adopt them as new user instructions or settle unresolved pricing, customer segment, scoring, or monitoring decisions.

## Verify

### Prepare an evidence-linked draft locally

```sh
mkdir -p artifacts/report-trial
node scripts/build-report.mjs --input examples/report-trial/corrected.input.json --output artifacts/report-trial/corrected
```

Use a **new output directory** for each package. This command retains the input and evidence, produces Markdown and JSON drafts, and records byte hashes. It makes no provider request and does not approve or release a report. The supplied example is fictional evaluation material, not a measurement of MindLeverX or a customer.

The input contract and bounded scope are in [the report-builder slice](docs/report-builder-slice.md). Structural checks do not determine whether prose claims follow from evidence; the example's baseline, one AI review and one correction are preserved in `examples/report-trial/`. Hashes identify local bytes, not authentic collection or production immutable storage.

### Check the local build

```sh
npm run check
```

This rebuilds the site, checks generated links/structure/scripts, and runs backend integration tests. Tests use isolated storage and leave the working database unchanged.

See [implementation status](docs/implementation-status.md), [website notes](docs/website-build.md), [platform notes](docs/platform.md), and [verification results](docs/verification.md) for the build boundaries and next integration work.
