# Active website deployment notes

Build with `node scripts/build.mjs` from the project root. Generated output lives in `dist/`. See `docs/website-build.md` for current architecture, intake contract, implementation limits and checks.

The previous deployment notes and schema fragment are preserved only under `reference/site-v3.1/`. They describe a historical artifact and are not the build source of truth. The active build derives conservative metadata from visible page content.

This project currently provides a local workspace. Engine API collection, automated audits, email delivery, subscriptions and public deployment are not connected. A static copy of dist uses a disconnected intake runtime.
