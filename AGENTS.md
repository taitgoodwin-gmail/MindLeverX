# MindLeverX working agreement

## Shared delivery method

For substantial work, follow the cross-project AugMind Delivery Baseline:
https://github.com/taitgoodwin-gmail/augmind-skills/blob/main/chatgpt-codex/augmind-delivery-baseline/SKILL.md

That shared skill owns the reusable delivery lifecycle, autonomy levels, task claiming/idempotency, concurrency, retry/circuit-breaker rules, subagent/worktree/cloud-environment rules, verification, review, release controls, and completion evidence. Do not duplicate that process here.

## Start here

- Read `docs/codex-handoff.md` first for the current checkout and verified project state.
- For delivery-process changes, use `docs/delivery-governance.md`.
- For consequential product/business/design/implementation decisions, use `docs/build-guidance.md` and `docs/product-tenets.md`.
- For acceptance and executable cases, follow `docs/testing-practice.md`.
- For the structured requirement review register and traceability, use `docs/requirements-rubric-review/requirements.json` with its current crosswalk/tests. A review-draft row is not automatically owner-approved merely because it exists.
- For consequential decisions, use the repo-local `.agents/skills/evidence-led-thinking-partner/SKILL.md`.

## Go / Continue operating instruction

When the owner says **Go**, **Continue**, or **Finish the next step** for this project, use the requirements already recorded here. Do not ask the owner to restate them or choose routine tools, commands or implementation details.

1. **Orient once per run.** Verify repository, branch/commit, dirty work, existing work key and active writer. Read the current shared baseline linked above and the project sources below; record its actual commit/blob or installed version. A link is not proof the skill was loaded. If unavailable, use an already verified version only within its known scope and disclose the limitation; block only work that depends on missing instructions.
2. **Reconcile before choosing work.** Compare the current issue, accepted decisions, code and dated evidence. Fetch/read a relevant unmerged branch when the work lives there; do not merge or overwrite a checkout just to orient. Historical machine paths, old issue SHAs and the newest timestamp alone are not authority. Read that branch's applicable instructions before editing. Reuse the existing work key/branch and ownership record when resuming; a clean checkout does not prove no other writer is active.
3. **Select and execute.** Choose the next dependency-ready, testable increment toward the documented goal. State the outcome and check briefly, then proceed within existing authorization without a routine confirmation loop. Draft requirements are proposals until accepted. For a material unresolved choice, prepare the evidence, recommendation and one focused question; continue independent safe work. Do not repeat finished work or create work merely to appear busy.
4. **Verify and persist.** Run checks appropriate to the change, repair ordinary failures within scope, and update the existing execution/evidence record. Record work key, writer, instruction version, exact code revision, checks/results, NOT RUN/BLOCKED items and next responsible actor/action. Keep private evidence private. Synchronize the existing issue only when authorized and available; disclose a failed synchronization instead of claiming it succeeded.
5. **Close the loop.** Fix a demonstrated project-specific source of rework in the existing test/instruction when in scope. Propose a shared-baseline change only for a reusable lesson, with evidence and current official guidance where behavior has changed. Do not silently change cross-project policy, add a tracker or create a recurring schedule. End with what changed, proof, remaining gates and any decision actually needed; do not leave the owner to assemble the handoff.

**Go uses the current authority; it does not expand it.** An authorization applies to the task/context that granted it, not every future task. For the initial setup trial, working-branch documentation publication is allowed; no PR, merge, release/deployment, purchase, external message, security/access change or live private-data operation is authorized. Later runs must read their applicable authorization before acting. A completed increment, passing CI, preview READY and product/owner acceptance remain separate states.

**Where are we?** means report the existing evidence and next gate; it does not start implementation. **Stop** means stop new actions and preserve a concise resume point. Go does not create a background worker or promise work after the run ends.

### Resume sources and freshness

Use the Start here paths above, then compare the active **MindLeverX — Next Release** issue with `docs/chunk-plan.md`, `docs/implementation-status.md` and the relevant evidence. Record the checkpoint in `docs/codex-handoff.md`; use the existing issue for execution status. Do not overwrite dated history or create a second task queue.

Old absolute paths and local/private artifacts in the handoff may be unavailable in a fresh clone. Report the affected reproduction as BLOCKED; do not fabricate evidence, seed substitute customer data or rebuild a completed feature. Later issue evidence can supersede a dated waiting note without approving draft requirements. Read the current issue before repeating provider research or outreach.

For document/requirements setup, `npm run check:requirements` is the existing portable check; its source reconciliation is separate and can remain NOT RUN. Application checks and runtime prerequisites are in README and the existing workflow. Do not infer app health or acceptance from document checks.

## MindLeverX project overlay

- GitHub source is technical truth for implemented behavior and durable repo instructions.
- Linear is the execution view for issues, dependencies, milestones, and current work status; it is not the canonical technical contract.
- Figma defines an approved visual/interaction target only when a specific file/frame/node has been selected for the requirement. A newer draft does not silently replace an accepted target.
- Vercel and the real browser/runtime are deployment truth. A successful build or READY deployment is not product acceptance.
- A source-control backup is not deployment, production verification, customer acceptance, or evidence collection.
- Distinguish verified facts, external benchmarks, internal observations, proposed targets, sample data, and hypotheses. Unknown is not zero. Never invent weights, thresholds, business outcomes, model behavior, or measured results.
- Preserve source date, cohort, definition, and limitation when using external benchmarks. Compare like with like.
- Consider the seven MindLeverX tenets proportionately: premier owner/client UX, recurring revenue, repeatability, automation, AI intelligence, competitive leadership, and evidence-informed behavioral design. Do not let process work displace delivery.
- Challenge consequential assumptions and consider a simpler credible alternative, but do not reopen settled decisions without evidence.
- Keep owner effort low. Ask only for material decisions that cannot safely be delegated.

## Acceptance and evidence

- Consequential acceptance criteria must be executable by another tester without inventing setup or expected behavior.
- Record fixed prerequisites/input/version, numbered actions, observable expected results, PASS/FAIL/BLOCKED rules, actual evidence, cleanup, and what was NOT RUN.
- NOT RUN is not PASS. BLOCKED is not FAIL.
- Local implementation, passing CI, a merged PR, a preview, a production deployment, production verification, and owner/customer acceptance are separate states.
- Temporary specialist or AI review is not proof of independent human/customer validation.

## Repository and data safety

This repository is public. Never commit credentials, secrets, private customer/prospect data, raw private observations, local databases, private generated evidence, or other material that should not be public. Preserve existing ignore/boundary controls and verify staged content before publishing.

Use branches/PRs for meaningful changes. When parallel writers are justified, isolate them with worktrees or separate cloud workspaces and follow the shared skill's claim/concurrency rules.

## Code Review Rules

For repository-wide code review:
- Flag consequential behavior changes that are not traceable to a current requirement and executable acceptance case.
- Flag any secret, credential, private customer/prospect data, raw private observation, local database, or private generated evidence entering this public repository.
- Flag unsupported customer/business claims, invented metrics/weights/thresholds, or sample data presented as measured.
- For persistence, retry, authentication, tenant/data isolation, retention, migration, configuration, observability, or release changes, require material failure-path coverage rather than happy-path evidence only.
- Treat CI/build/setup failure as unclassified until the evidence shows environment versus implementation versus requirement failure.
- For UI changes, compare against the specifically approved Figma target when one exists; do not let a design draft silently redefine product scope.
- Do not equate tests passing, PR merge, deployment READY, or production availability with owner/customer acceptance.
- Prefer a bounded fix over widening scope during review; surface unrelated findings separately.

## Authority boundary

Preserve accepted scope, spending, appearance/design authority, deployment/release boundaries, customer contact, privacy/security policy, and commercial commitments.

This file and the shared delivery skill do not independently authorize purchases, external outreach, production data changes, publication, merges/releases that bypass required controls, new recurring schedules, or material product/business decisions.
