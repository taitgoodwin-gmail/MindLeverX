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

## Authority boundary

Preserve accepted scope, spending, appearance/design authority, deployment/release boundaries, customer contact, privacy/security policy, and commercial commitments.

This file and the shared delivery skill do not independently authorize purchases, external outreach, production data changes, publication, merges/releases that bypass required controls, new recurring schedules, or material product/business decisions.
