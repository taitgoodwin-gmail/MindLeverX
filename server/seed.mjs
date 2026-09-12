// Fictional records adapted from the supplied Platform v2 design study.
// No seed observation is a measurement of a real business.
export function seedDatabase(db) {
  const created = '2026-07-28T08:00:00.000Z';
  const clients = [
    ['northwind', 'Northwind', 'northwind.example', 'active', 5, 'Sample client. A parser anomaly needs investigation before a report can be approved.', 48, 51],
    ['acmesaas', 'AcmeSaaS', 'acmesaas.example', 'active', 7, 'Sample client. The cycle report is ready for local review; movement is not attributed to the work.', 74, 68],
    ['meridian', 'Meridian', 'meridian.example', 'active', 6, 'Sample client. Answer-first content drafts are ready for review.', 61, 57],
  ];
  const insertClient = db.prepare('INSERT INTO clients (id,name,domain,status,stage,notes,score,previous_score,sample,created_at) VALUES (?,?,?,?,?,?,?,?,1,?)');
  clients.forEach(row => insertClient.run(...row, created));
  const reviews = [
    {
      id: 'northwind-anomaly', client_id: 'northwind', kind: 'anomaly',
      title: 'A clean zero needs a closer look.',
      summary: 'The sample run returned no citations. Check the evidence before accepting this as a change in visibility.',
      body: 'SAMPLE — NOT MEASURED. This is a fictional parser incident for testing the review flow. The stored answer contains a source link, but the parsed citation list is empty. Treat the run as held until a real parser and source response can be checked. Recording a decision here does not retry a run or generate a report.',
      evidence: [
        { label: 'Sample prompt · panel v1 · question 1', detail: 'Which providers should a buyer compare with Northwind?' },
        { label: 'Sample answer excerpt', detail: 'The fictional answer cites Northwind as one option, while the parser produced an empty citations array.' },
        { label: 'Expected versus parsed', detail: 'Fixture expected citations: 1. Fixture parsed citations: 0. No engine API was called.' },
        { label: 'Provenance', detail: 'Hand-authored scenario derived from the Platform v2 design study. Engine: Sonar (illustrative). This is not a live engine result.' },
      ],
    },
    {
      id: 'acmesaas-report', client_id: 'acmesaas', kind: 'report',
      title: 'The next report is ready for review.',
      summary: 'Review the sample findings, provenance, and attribution note before recording your decision.',
      body: 'SAMPLE — NOT MEASURED. AcmeSaaS has an illustrative score of 74, compared with 68 in the preceding fixture. These numbers are hand-authored interface data; no scoring formula or engine measurement has been implemented. The example report describes an increase following a rewrite, but does not claim that the rewrite caused it. Approval records a local review decision only; it does not send email, publish a report, or update a client site.',
      evidence: [
        { label: 'Illustrative readiness', detail: 'Current fixture: 74/100. Previous fixture: 68/100. Method and weights are unresolved; these are not computed scores.' },
        { label: 'Attribution note', detail: 'A content rewrite and an engine index update occurred in the same fictional period. The design example cannot isolate their effects.' },
        { label: 'Sample prompt · panel v1 · question 1', detail: 'Which providers should a buyer compare with AcmeSaaS?' },
        { label: 'Measurement boundary', detail: 'Engine APIs are proxies for consumer products. Future reports must retain source answers, timestamps, panel versions, and sample counts.' },
      ],
    },
    {
      id: 'meridian-finding', client_id: 'meridian', kind: 'finding',
      title: 'Make the category definition easier to quote.',
      summary: 'An answer-first page draft is ready. Two company facts still need verification.',
      body: 'SAMPLE — DESIGN DRAFT. Proposed structure: lead with a one-paragraph category definition, explain who the product serves, then answer concrete buyer questions. Draft: “Revenue intelligence connects sales activity with pipeline and revenue outcomes, helping teams understand where deals move or stall.” Company founding date: [NEEDS VERIFICATION]. Customer count: [NEEDS VERIFICATION]. Record changes needed in your review note. No content is published from this workspace.',
      evidence: [
        { label: 'Illustrative finding', detail: 'The sample page begins with a slogan and lacks a self-contained category definition.' },
        { label: 'Suggested verification', detail: 'Check the revised page for a direct definition, meaningful headings, and claims supported by an identified source.' },
        { label: 'Open facts', detail: 'Founding date and customer count remain unknown. Do not replace missing facts with generated values.' },
      ],
    },
  ];
  const insertReview = db.prepare('INSERT INTO reviews (id,client_id,kind,title,summary,body,evidence,status,sample,created_at) VALUES (?,?,?,?,?,?,?,\'pending\',1,?)');
  reviews.forEach(r => insertReview.run(r.id,r.client_id,r.kind,r.title,r.summary,r.body,JSON.stringify(r.evidence),created));
  const insertPanel = db.prepare('INSERT INTO panels (id,client_id,version,prompts,note,sample,created_at) VALUES (?,?,1,?,?,1,?)');
  clients.forEach(([id,name]) => insertPanel.run(`${id}-panel-1`,id,JSON.stringify([
    `Which providers should a buyer compare with ${name}?`,
    `What questions should a buyer ask before choosing ${name}?`,
    `Which sources explain the category ${name} serves?`,
  ]),'Sample panel for exploring the workflow. No scheduled runs or engine calls.',created));
  db.prepare('INSERT INTO activity (id,action,entity_type,entity_id,actor,detail,created_at) VALUES (?,?,?,?,?,?,?)')
    .run('sample-initialized','Workspace initialized','workspace','local','System','Loaded three fictional clients and three review scenarios. All observations are sample data.',created);
}
