# Start here — collaborator setup and source map
**Source orientation updated: 23 September 2026.** Read the [one-page brief](ahmed-brief.md) first ([printable PDF](ahmed-brief.pdf)). Current work status belongs in [Linear](https://linear.app/mindleverx-codex-build/project/mindleverx-next-release-bc7bec6a8dc4); this document maps sources rather than maintaining a second backlog.

## Choose the right baseline

The [GitHub default branch](https://github.com/taitgoodwin-gmail/MindLeverX) is the integrated source for the public website and local operator/report product after the 23 September release. Vercel publishes only the website-only build. The [97-row requirements register](requirements-rubric-review/revised-requirements.md) remains a review draft, and the [Figma concept](https://www.figma.com/design/UgtCQvjyZpBQVOxhZAK4sk?node-id=2-129) remains unapproved. Use [Linear](https://linear.app/mindleverx-codex-build/project/mindleverx-next-release-bc7bec6a8dc4) for current work status.

The older pinned commits and tags in this document remain historical reproducibility references. For new work, confirm the current default-branch hash before editing.

## Short reading path
1. Brief, then this setup.
2. [Product direction and state](codex-handoff.md): start at the current checkpoint; earlier sections are historical. Ignore owner-machine absolute paths as setup instructions.
3. Read only the relevant [requirement narrative](requirements-rubric-review/revised-requirements.md) and [decision](requirements-rubric-review/decisions-needed.md). [Seven product tenets](product-tenets.md) define design priorities.
4. Open the matching Linear issue for current acceptance, blockers and evidence. Local artifact paths on cards are receipts on the owner's Mac, not shared attachments.

For deeper work: [delivery governance](delivery-governance.md), [testing practice](testing-practice.md), [report/review implementation](report-review-slice.md), [portable export](report-export-slice.md). Read when needed, not as compulsory onboarding.

## Run the product without the owner's files
The repository is public: reading and cloning need no collaborator invitation. Requires Node.js 24+ with built-in SQLite. Tested here with Node 26.7.0. No npm install is needed. PDF rendering and the full test suite additionally require Python with ReportLab; basic navigation does not. Do not assume the machine's default `python3` includes ReportLab.

In a new directory:
```sh
git clone https://github.com/taitgoodwin-gmail/MindLeverX.git MindLeverX-ahmed
cd MindLeverX-ahmed
git rev-parse HEAD
npm run build
PORT=4337 MLX_DB_PATH="$PWD/data/ahmed-preview.sqlite" npm start
```

If 4337 is already occupied, use another free port; do not stop somebody else's preview. Open:
- `http://127.0.0.1:4337/` — local website;
- `http://127.0.0.1:4337/app/` — fictional seeded operator examples;
- `http://127.0.0.1:4337/results/` — honest empty state without a private evidence source.

The three seeded clients are fictional. A fresh clone contains no owner's database or raw observation export. It cannot reproduce the owner's pending review or the retained 16-answer sample by visiting their localhost link. Loopback URLs work on the machine running the server. No provider credentials or new collection are needed for orientation.

Stop with Ctrl-C. The isolated `data/ahmed-preview.sqlite` and its journals are disposable after stopping that server; retain them only if you want your local edits. Do not delete another checkout's data.

### PDF/full checks
Use an existing Python interpreter with ReportLab, or prepare an isolated local environment. These versions match the verification runtime: Python 3.12.14 and ReportLab 4.4.9; other versions have not been verified here.
```sh
python3 -m venv .venv
.venv/bin/python -m pip install reportlab==4.4.9
export MLX_PDF_PYTHON="$PWD/.venv/bin/python"
"$MLX_PDF_PYTHON" -c 'import reportlab; print(reportlab.Version)'
npm run check
npm run check:requirements
npm run build:public
```
The environment-install command is a setup option; verification here used an existing bundled Python/ReportLab runtime, not a fresh pip install. Do not commit `.venv/`. Check with `git status` before staging.

`check:requirements` validates portable structure and regression scenarios. It does not reconcile missing original source archives, approve requirements or validate the customer workflow. Public build success does not authorize deployment.

## Work and review boundaries
After selecting a slice, create a uniquely named feature branch from the current default branch. The default branch is deployment-connected; review public-build scope before merging. Coordinate PR target and release scope with the owner and Ahmed where their decisions are needed.

GitHub holds code, requirement wording and decisions; Linear holds work status; Figma holds proposed design. Link between them rather than duplicating a requirements register. Record deviations with the relevant requirement and owner decision. Do not equate an approved local draft, a passing automated test, a backup tag or a merged PR with customer acceptance.

Access update, 20 September: the owner made the GitHub repository public, confirmed through GitHub's API. Anyone can read/clone it; GitHub write permission is separate. The owner reports sending Ahmed a Linear invitation for MindLeverX_CODEX BUILD. He must open the invitation email and accept; acceptance is not yet verified. Figma access remains unverified. No passwords, tokens, raw client evidence or local databases belong in the brief.

## Historical material
The [12 September status](archive/implementation-status-2026-09-12.md) is preserved as history. Older platform/build/verification notes describe their dated implementation scope and must not override the current handoff. No requirements, code, evidence or backup tags were deleted.

## Evidence for this cleanup
See [verification receipt](ahmed-onboarding-verification.md). Tracking: [MIN-16](https://linear.app/mindleverx-codex-build/issue/MIN-16/prepare-ahmeds-brief-and-reconcile-github-linear-entry-points). Ahmed's independent setup and comprehension test is still NOT RUN.
