# Delivery governance — working version 1

Owner direction: 19 September 2026. Applies to this project now; reusable candidate for later builds. No global installation, new schedule, spending authority or product-scope expansion.

## Outcome and ownership

Each active work cycle ends in a verified result, a supported decision or a precise blocker, with enough saved context to resume safely. That is our working objective; speed, token savings and business improvement must be measured rather than assumed.

The owner controls product intent, material tradeoffs and retained spending/release/contact boundaries. Codex owns preparation, evidence checks, implementation within authority, verification and an accurate handoff. Specialists are optional bounded assignments when authorized and useful, not a standing approval committee. One writer per checkout; Git status alone does not prove exclusive ownership.

## One place for each kind of truth

| Information | Authoritative home | Other surfaces |
| --- | --- | --- |
| Working instructions | `AGENTS.md`; detailed policy in `docs/build-guidance.md` | Synchronize deliberately into the active checkout; no silent divergent copies |
| Current starting point | `docs/codex-handoff.md` | README links here; fresh sessions verify current Git/Linear state |
| Requirement wording and its authority | `docs/requirements-rubric-review/requirements.json` and associated rendered register | Linear shows relevant narratives and links; draft status stays visible |
| Work status, blocker and next action | Active Linear issue | Local dated checkpoint for recovery; disclose failed synchronization |
| Code and portable verification | Git commits and backup/review refs | Distinguish saved locally, committed, pushed, merged, deployed and accepted |
| Raw observations, credentials, databases | Appropriate local/private storage | Never infer that a source-code backup contains ignored operational evidence |

The Google Sheet retains its historical role but has not been updated with the current rewrite. Do not describe it as synchronized. On the next requested synchronization, compare edits before writing. Do not regenerate the whole requirements package from the old generator without reconciling its embedded earlier decisions.

## Cycle with observable exit conditions

1. **Orient:** read the handoff, verify checkout/branch/dirty work and the active issue, and open that issue beside the conversation. Find a real dependency-ready outcome; do not repeat finished research. Read only the documentation needed for that decision.
2. **Frame:** show outcome, estimate, short numbered steps, readable requirement narrative, authority and verification. Recommend model effort/agents proportionately. A new process change traces to the owner's instruction rather than a fabricated product requirement.
3. **Execute:** keep changes reviewable and preserve existing work. Make low-risk improvements within authority. Prepare consequential changes concretely for the shared decision; do not reinterpret a historical proposal as approval.
4. **Verify:** run checks that can actually disprove the claim. Distinguish PASS, FAIL, BLOCKED and NOT RUN. Label source freshness, deterministic tests, rendered behavior and human usefulness separately. Fix and rerun the affected check; do not merely edit expected results to make it green.
5. **Persist and hand off:** commit a coherent slice; push only within applicable authorization; verify the remote hash. Update the active issue, evidence and next step. Show what the owner can inspect. A local commit is not a backup, a backup is not a deployment, and a passed test is not customer acceptance.

## Change and exception rules

- Record meaningful decisions where they belong: date, requirement/work item, selected action, evidence, alternatives/tradeoff, authority and what would warrant revisiting it. Reuse existing documents; no separate compulsory form.
- For an old assumption, inspect its source and impact. Preserve the historical decision, explicitly supersede it when changed, and update only affected requirements/tests. Do not reopen everything because one guidance file changed.
- A blocker names the affected deliverable, missing evidence/decision, next actor/action and what can proceed independently. An unavailable provider field may justify a narrower claim; changing a consequential acceptance requirement remains explicit.
- Stop unchanged external retries after the allowed bounded attempt. A drafted vendor question is not a sent message. Repeated research cannot substitute for unavailable evidence.
- Choose stronger models or extra agents for a concrete difficulty, not by default. Keep task selection, context size and repeated tool reads efficient. Account-wide usage is not task-specific cost.

## Lessons applied in MIN-14

| Observed problem | Correction / verification |
| --- | --- |
| Recent requirements, rules and frontend work existed only as dirty local changes | Commit both coherent lines of work; verify explicit GitHub backup refs |
| Handoff and active-checkout instructions lagged behind owner decisions | Put a current start-here section first; synchronize shared governance after checking local differences |
| Validator conflated changed context with broken requirements and depended on absolute source paths | Separate portable structure checking from source reconciliation; seven regression scenarios verify distinct exits |
| Status prose contradicted implemented PDF work | Correct current status and point to the local slice evidence |
| Full qualification could appear equivalent to a successful saved-data audit | Keep the passing audit and blocked collection gate distinct on MIN-12 |
| Thirty-minute unattended cap was exceeded in two recorded runs | Remains unresolved runtime control; see below. More prose is not a hard timeout |

## Remaining machine risks and next validation

1. **Unattended runtime enforcement:** existing prompt-level timing has failed. This pass does not change the schedule or claim an external watchdog exists. Before relying on overnight development, run a separate bounded interruption/resume trial with an enforceable deadline supported by the actual runtime; if unavailable, describe work as best effort and do not promise a cap. A subprocess timeout alone cannot bound the assistant's whole turn. Follow existing `docs/unattended-work.md` authority; no new batch is started here.
2. **Backup versus integration:** tag backups preserve work without moving deployment-connected branches. They are temporary checkpoints, not a long-term integration strategy. A reviewed integration/release step remains necessary before these changes reach main or production.
3. **Recovery scope:** original requirement archives and raw evidence are local dependencies. A fresh Git checkout must clearly report them unavailable. The portable document check is testable without them; exact real-evidence reproduction is not. A governed private evidence backup is separate work, not falsely covered by Git.
4. **Requirements freshness:** this pass preserves historical source fingerprints. Changed guidance is explicitly blocked for full reconciliation. Assess only affected requirements (notably panel selection and current scope/authority) before approving the rewrite.
5. **Reuse validation:** try this working agreement on another small authorized project before installing a global template. Keep project-specific customer, spend and release decisions out of the reusable core.

Suggested observations for the next few actual chunks: whether an accepted outcome was delivered, rework caused by stale context, number of avoidable owner clarifications, active work versus external waiting, and whether the remote backup was verified. No invented numeric targets, composite score or new telemetry system. Gather a baseline before optimizing.

## Official foundations checked 19 September 2026

The owner explicitly directs us to use OpenAI, GitHub and Linear official guidance. Apply current relevant guidance when working on those surfaces, preserving source/date and the concrete implementation below. Recheck consequential changing behavior; do not reread every source on every turn.

| Platform source | Documented behavior / recommendation | Our application and verification boundary |
| --- | --- | --- |
| [OpenAI: AGENTS.md](https://learn.chatgpt.com/docs/agent-configuration/agents-md) | Instructions are assembled at startup with directory precedence; changes do not prove an already-running session reloaded them. | Keep project rules discoverable, synchronize active-checkout copies, and explicitly read changed guidance now. File identity can be checked here; fresh-session discovery remains a separate test. |
| [OpenAI: best practices](https://learn.chatgpt.com/guides/best-practices) | Keep instructions concise, verify results, connect tools that remove actual manual work, and package demonstrated repeatable work as scoped skills. | Reuse the current skill and Linear connection. Review only affected guidance and checks; add no plugin, global rule or scheduled automation without a concrete need and applicable authority. |
| [GitHub: helping others review changes](https://docs.github.com/en/pull-requests/concepts/helping-others-review-your-changes) | Recommends focused changes, clear context, self-review, relevant tests and linked work items. | Use separate coherent commits for existing governance/requirements and local frontend work, review staged changes and run applicable checks. Backup tags preserve them; an integration PR remains future work, not a completed review. |
| [Linear: issue relations](https://linear.app/docs/issue-relations) | Distinguishes blocked/blocking, related and duplicate issues. | Keep MIN-12 blocking the final MIN-13 freeze; state explicitly that drafting can proceed. A merely related improvement should not become an artificial dependency. |
| [Linear: parent/sub-issues](https://linear.app/docs/parent-and-sub-issues) | Supports dividing work and optional automatic parent/sub-issue closing. | Use smaller units when outcomes/dependencies differ. Do not assume automatic closing establishes acceptance. No workspace automation setting was changed. |

These are documented behaviors and recommendations, not new spending mandates or mandatory committees. The workflow implementation is our choice under owner authority.

- [DORA: small batches](https://dora.dev/capabilities/working-in-small-batches/) supports small, testable changes and fast feedback, including process improvements. Our chunk size and stop conditions are local choices, not universal DORA thresholds.
- [DORA: version control](https://dora.dev/capabilities/version-control/) supports versioning source, configuration and supporting artifacts for traceability and recovery. Our two-tag backup approach is a temporary response to existing deployment boundaries, not a recommended long-lived branching model.
- [NIST SSDF project](https://csrc.nist.gov/projects/ssdf) supplies a risk-based secure-development reference. This lightweight process is not a claim of SSDF conformity, security certification or a completed secure development program.

The original MIN-14 pass was reviewed by the coordinator; automated regression checks are distinct evidence. A 19 September follow-up used two separate read-only agents for requirements readiness and product-code readiness. They did not independently review all 97 requirements or provide human/customer acceptance. The review identified stale implementation status, an overbroad reading of missing collection context, and a reproducible UTF-8 BOM parsing defect in saved results. Final fixes, check outcomes and backup receipts belong on MIN-14 so this document does not become another competing status register.

Follow-up application: rechecked the five OpenAI/GitHub/Linear sources above on 19 September. Keep unknown optional model/session context separate from missing mandatory evidence for the intended claim; see the qualification card. A completed local demonstration does not resolve payment, qualified collection, production identity, private delivery or renewal. Correct stale current summaries at their source and keep historical observations explicitly dated. These are project implementation choices informed by the sources, not platform-mandated release gates.

Latest owner-requested source check, 19 September: a bounded read-only reviewer opened all five cited official pages and found no material correction or additional process necessary. Linear documents that completing a blocking issue moves that relation under Related; retain an unresolved qualification gate before closing its tracking issue. MIN-12 therefore remains open for review and MIN-13 drafting can be reviewed without declaring final freeze complete. No workspace automation setting was changed. This checks source interpretation, not every requirement or an end-to-end delivery run.


### Recovery follow-up — 20 September 2026

[MIN-17 local recovery](database-recovery.md) closes the missing local DB restore drill for the shipped SQLite schema using synthetic evidence, with exact report preservation and safe failure cases. It does not recover external files/configuration or establish governed off-device recovery, retention policy, RPO/RTO or production resilience. The source backup and private-data backup remain distinct.


### Preparation recovery follow-up — 20 September 2026

[MIN-18](report-preparation-recovery.md) records failed/interrupted local draft preparation and explicit retry, coordinated through SQLite. It is intentionally part of the existing retained-report flow; provider job semantics, unknown charged outcomes, approved caps and client release remain separate. Saved terminal attempts, exact artifact preservation and a real process-kill test provide bounded recovery evidence. No background schedule or hard whole-agent watchdog was created.
