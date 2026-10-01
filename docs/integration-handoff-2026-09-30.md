# MindLeverX integration handoff — 30 September 2026

## Source checkpoint

Owner request: save the current integration, including uncommitted changes, to a GitHub working branch, excluding secrets, and return the branch and commit so the work can be combined safely.

- Working branch: `codex/mindleverx-integration-20260930`.
- Baseline: `e116e4bb9ab3676a1d7c921d9800a872037c2a7b`, verified as GitHub `main` before this snapshot.
- The integration is one commit above that baseline so another checkout can review and merge the branch or cherry-pick the complete integration commit.
- Original local work remains in `codex/mona-critique-20260929` through `99c9775`. Its five unpublished commits were consolidated into this snapshot; they should not also be cherry-picked.

## Included work

- Website critique and eight-page content/navigation harmonization, homepage GEO education, evidence wording, responsive presentation and collective MindLeverX identity. The private implementation journal remains in the local backup; the public changes are in `site/`, `scripts/` and the focused tests.
- Form-only contact implementation: Vercel endpoint, Gmail transport, input validation, error/success recovery, tests, hosting configuration and a local send-only OAuth helper. Public submission remains disabled.
- A public enquiry integration handoff. The previously uncommitted detailed delivery observations are preserved in the local backup; operational metadata is omitted from this public version.
- Current Figma concept, rationale/source map and four exported previews in [design/2026-09-30](design/2026-09-30/README.md). This is a design handoff, not implemented site code or buyer-validated design.

## Privacy and exclusions

The repository is public. Actual OAuth client credentials, refresh tokens, private mailbox configuration, `.env.local`, `.env.vercel-enquiry`, setup screenshots, local databases, retained artifacts and generated build folders are excluded. The internal critique implementation journal and detailed infrastructure/setup history are also excluded from the public version and remains in the local Git bundle and local backup branch. `.env.example` contains empty credential fields only. The authorization helper preserves privately configured sender/recipient values and no longer hard-codes the mailbox or supplies it as a login hint. Configure `MLX_GMAIL_FROM` and `MLX_ENQUIRY_TO` privately before use. No authorization or real email is sent by this backup operation.

## Before combining or releasing

1. Fetch the working branch and compare it with the destination branch. Resolve overlapping site, `vercel.json` or form changes deliberately; do not overwrite other work.
2. Merge the branch or cherry-pick its integration commit. The baseline already contains the private operator/product source; this snapshot preserves the separation from the public build.
3. Re-run the relevant checks on the combined result. Backup verification is not full product/release acceptance.
4. Keep the contact form disabled until mailbox receipt, hosted function packaging, effective rate enforcement and the approved release configuration are verified. See the [public enquiry handoff](enquiry-delivery.md); consult the private local backup for operational evidence.
5. The new Figma direction requires a separate implementation decision. Existing code in this branch reflects the earlier harmonization, not the new visual concept.

No production deployment or merge into `main` is part of this source checkpoint. A GitHub push may trigger the repository's configured preview automation.

## Snapshot verification

- `git diff --cached --check`: passed.
- OAuth helper syntax check: passed. The helper was not run and no new Google authorization was requested.
- `node --test tests/enquiry.test.mjs tests/site-interactions.test.mjs`: 19/19 passed with mocked mail transport.
- Public build plus `scripts/check-public.mjs`: passed for eight pages, internal links, metadata and public/private serving boundaries.
- Staged-source scan: All tracked files, four distinct private configuration values checked without disclosure, and 12 credential-pattern checks; no findings. Forbidden local-secret/database/artifact paths were also checked. This is a bounded check, not a guarantee against every possible secret format.
- Full private-product tests and deployed end-to-end delivery were not repeated for this source backup. Verify the final remote SHA against the local commit before combining.
