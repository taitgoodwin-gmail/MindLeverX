# Start here — collaborator setup and source map
**Verified snapshot: 20 September 2026.** Read the [one-page brief](ahmed-brief.md) first ([printable PDF](ahmed-brief.pdf)). Current work status belongs in [Linear](https://linear.app/mindleverx-codex-build/project/mindleverx-next-release-bc7bec6a8dc4); this document maps sources rather than maintaining a second backlog.

## Choose the right baseline
| Purpose | Exact starting point | Boundary |
| --- | --- | --- |
| Public website | [main checkpoint 836eaa5](https://github.com/taitgoodwin-gmail/MindLeverX/tree/836eaa58091a91ea28c08bfb4b3719ee84ebfecd) | Seven public pages; private app/results/API excluded from deployed build |
| Latest remotely recorded product and shared docs at this review | [e976747](https://github.com/taitgoodwin-gmail/MindLeverX/tree/e976747564a5d039ac42129ab085246e77f8d1a9), tag `codex/otterly-inquiry-handoff-2026-09-20` | Local product; not merged to main or deployed |
| Onboarding documents | [GitHub default branch](https://github.com/taitgoodwin-gmail/MindLeverX) | Documentation integrated through a focused change; private product remains a separate checkpoint |
| Requirements | [rendered register](https://github.com/taitgoodwin-gmail/MindLeverX/blob/e976747564a5d039ac42129ab085246e77f8d1a9/docs/requirements-rubric-review/revised-requirements.md), [machine source](https://github.com/taitgoodwin-gmail/MindLeverX/blob/e976747564a5d039ac42129ab085246e77f8d1a9/docs/requirements-rubric-review/requirements.json) | 97-row review draft; preserves original IDs and proposals; not fully accepted |
| Current decisions and blockers | [decision list](https://github.com/taitgoodwin-gmail/MindLeverX/blob/e976747564a5d039ac42129ab085246e77f8d1a9/docs/requirements-rubric-review/decisions-needed.md), then live Linear issues | Draft decisions are not ratified by being documented |
| Design proposal | [Figma concept](https://www.figma.com/design/UgtCQvjyZpBQVOxhZAK4sk?node-id=2-129) | Proposed desktop/mobile direction; not approved or deployed |

The remote `codex/evidence-report-builder` branch is older than the product checkpoint. Do not choose it just because its name sounds current. Tags preserve checkpoints; they are not integrated release branches. Compare live refs before beginning implementation. Source links below are pinned intentionally so this review can be reproduced.

## Short reading path
1. Brief, then this setup.
2. [Product direction and state](https://github.com/taitgoodwin-gmail/MindLeverX/blob/e976747564a5d039ac42129ab085246e77f8d1a9/docs/codex-handoff.md): start at the current checkpoint; earlier sections are historical. Ignore owner-machine absolute paths as setup instructions.
3. Read only the relevant [requirement narrative](https://github.com/taitgoodwin-gmail/MindLeverX/blob/e976747564a5d039ac42129ab085246e77f8d1a9/docs/requirements-rubric-review/revised-requirements.md) and [decision](https://github.com/taitgoodwin-gmail/MindLeverX/blob/e976747564a5d039ac42129ab085246e77f8d1a9/docs/requirements-rubric-review/decisions-needed.md). [Seven product tenets](https://github.com/taitgoodwin-gmail/MindLeverX/blob/e976747564a5d039ac42129ab085246e77f8d1a9/docs/product-tenets.md) define design priorities.
4. Open the matching Linear issue for current acceptance, blockers and evidence. Local artifact paths on cards are receipts on the owner's Mac, not shared attachments.

For deeper work: [delivery governance](https://github.com/taitgoodwin-gmail/MindLeverX/blob/e976747564a5d039ac42129ab085246e77f8d1a9/docs/delivery-governance.md), [testing practice](https://github.com/taitgoodwin-gmail/MindLeverX/blob/e976747564a5d039ac42129ab085246e77f8d1a9/docs/testing-practice.md), [report/review implementation](https://github.com/taitgoodwin-gmail/MindLeverX/blob/e976747564a5d039ac42129ab085246e77f8d1a9/docs/report-review-slice.md), [portable export](https://github.com/taitgoodwin-gmail/MindLeverX/blob/e976747564a5d039ac42129ab085246e77f8d1a9/docs/report-export-slice.md). Read when needed, not as compulsory onboarding.

## Run the product without the owner's files
The repository is public: reading and cloning need no collaborator invitation. Requires Node.js 24+ with built-in SQLite. Tested here with Node 26.7.0. No npm install is needed. PDF rendering and the full test suite additionally require Python with ReportLab; basic navigation does not. Do not assume the machine's default `python3` includes ReportLab.

In a new directory:
```sh
git clone https://github.com/taitgoodwin-gmail/MindLeverX.git MindLeverX-ahmed
cd MindLeverX-ahmed
git switch --detach e976747564a5d039ac42129ab085246e77f8d1a9
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
After selecting a slice, create a uniquely named feature branch from the agreed baseline. Do not merge the entire product checkpoint into main as an incidental part of a design change. The owner and Ahmed should agree on the PR target and release scope first; the default branch is deployment-connected.

GitHub holds code, requirement wording and decisions; Linear holds work status; Figma holds proposed design. Link between them rather than duplicating a requirements register. Record deviations with the relevant requirement and owner decision. Do not equate an approved local draft, a passing automated test, a backup tag or a merged PR with customer acceptance.

Access update, 20 September: the owner made the GitHub repository public, confirmed through GitHub's API. Anyone can read/clone it; GitHub write permission is separate. The owner reports sending Ahmed a Linear invitation for MindLeverX_CODEX BUILD. He must open the invitation email and accept; acceptance is not yet verified. Figma access remains unverified. No passwords, tokens, raw client evidence or local databases belong in the brief.

## Historical material
The [12 September status](archive/implementation-status-2026-09-12.md) is preserved as history. The main-branch platform/build/verification notes describe their original implementation scope and carry orientation notices. They must not override newer product checkpoints. No requirements, code, evidence or backup tags were deleted.

## Evidence for this cleanup
See [verification receipt](ahmed-onboarding-verification.md). Tracking: [MIN-16](https://linear.app/mindleverx-codex-build/issue/MIN-16/prepare-ahmeds-brief-and-reconcile-github-linear-entry-points). Ahmed's independent setup and comprehension test is still NOT RUN.
