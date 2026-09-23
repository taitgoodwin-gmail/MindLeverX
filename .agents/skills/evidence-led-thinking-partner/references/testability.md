# Executable validation

Use when turning consequential requirements or claims into acceptance tests. This owner-approved correction addresses a demonstrated failure: expanding a broad requirement left the tester to invent inputs, actions and the basis for judging results. It is a lightweight working practice, not a certification program.

## Ready to implement

Another tester should be able to execute the linked cases and determine the outcome without inventing missing details or asking the author what they meant. Supply:

- Requirement or claim, case ID and exact system boundary.
- Starting state, version, fixed input or explicit input selection procedure, and required access/tools.
- Numbered actions, each with the relevant observable expected result and where to inspect it.
- Pass/fail/blocked rules, relevant negative or recovery cases, cleanup and retained evidence location.
- Actual observations and verdict only after execution. NOT RUN and BLOCKED are distinct from FAIL and PASS.

Derive expected results independently of the implementation. Use a small hand-verifiable example or another justified reference where appropriate. A test repeating the production calculation can reproduce its mistake. Link a concise requirement to detailed tests rather than putting the entire script in a requirements cell.

## Prevent false confidence

- Define numerator, denominator, exclusions, missing-data behavior and matching rules for quantitative claims. Do not invent a business threshold merely to make a test executable; surface the missing rule.
- A recorded absence can be a correct finding. Missing collection is unknown, not an observed zero. Separate a failed business outcome from a software defect.
- Separate independent source-data checks, application integration tests, rendered-output checks and human comprehension studies. One passing layer does not prove another. Repeatable processing of frozen AI evidence does not promise identical answers from new live AI queries.
- Label synthetic controls separately from real observations. Preserve the original. A positive control can expose a checker that always returns zero.
- Define qualitative acceptance through an observable task and scoring rule where needed; do not equate AI review with a human usability study.
- A Given/When/Then summary can aid communication, but it cannot substitute for executable steps or step definitions.

Use the project's existing test runner and records. Do not add tools, purchases, committees or another tracker just to adopt this practice. One worked example is usually a better owner review than a catalog of standards.

## Basis and scope

Checked 18 September 2026: [PMI business-analysis guide](https://www.pmi.org/standards/business-analysis) provides the broader discipline; [IIBA quality criteria](https://www.iiba.org/contentassets/1dc6a35dff8c46ff85c6cb6b916b7ea3/9-quality-criteria-for-requirements.pdf) and [acceptance criteria](https://www.iiba.org/contentassets/896f15592ec44b3883e2e5cb9c819357/acceptance-and-evaluation-criteria--insight.pdf) support testable requirements. [ISO/IEC/IEEE 29119-3](https://www.iso.org/standard/79429.html) concerns documentation; [Part 4](https://www.iso.org/standard/79430.html) concerns test techniques; only public descriptions were consulted, not full conformance clauses. [ISTQB syllabus](https://istqb.org/wp-content/uploads/2024/11/ISTQB_CTFL_Syllabus_v4.0.1.pdf) supplies coverage techniques. The format and readiness rule here are our implementation choices, not claimed verbatim mandates or formal compliance.
