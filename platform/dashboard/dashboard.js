'use strict';
const byId = id => document.getElementById(id);
function navigate(){
 const operations = location.hash === '#operations';
 byId('build-view').hidden = operations;
 byId('operations-view').hidden = !operations;
 byId('title').textContent = byId('crumb').textContent = operations ? 'Operations' : 'Build status';
 document.title = `${operations ? 'Operations' : 'Build status'} · MindLeverX`;
 document.querySelectorAll('[data-view]').forEach(link => {
  if(link.dataset.view === (operations ? 'operations' : 'build')) link.setAttribute('aria-current','page');
  else link.removeAttribute('aria-current');
 });
}
window.addEventListener('hashchange',navigate);navigate();
function sampleMode(show){
 byId('actual-panel').hidden = show;byId('sample-panel').hidden = !show;
 byId('actual-mode').setAttribute('aria-pressed',String(!show));
 byId('sample-mode').setAttribute('aria-pressed',String(show));
 byId('mode-label').textContent=show?'Sample only':'Not connected';
}
byId('actual-mode').addEventListener('click',()=>sampleMode(false));
byId('sample-mode').addEventListener('click',()=>sampleMode(true));
byId('explore-samples').addEventListener('click',()=>{sampleMode(true);byId('sample-mode').focus()});
const fixtures=[
 {name:'Northwind',domain:'northwind.example',type:'held',stage:'Scope',status:'Held audit',title:'A clean zero needs a closer look.',body:'The sample answer contains a source link, but the parsed citation list is empty. This fictional parser incident must not be mistaken for a measured visibility decline.',facts:['Expected sample citations: 1; parsed citations: 0.','No engine API was called.','Recording a review in the existing app does not retry a run.']},
 {name:'AcmeSaaS',domain:'acmesaas.example',type:'report',stage:'Monitoring',status:'Report review',title:'A sample cycle report is ready for review.',body:'The existing fixture demonstrates findings, evidence, and an attribution note. The hand-authored scores are not measured and are omitted from this overview.',facts:['A content rewrite and an index update occur in the fictional example.','The example cannot establish what caused the change.','Approval in the existing local app does not publish or email a report.']},
 {name:'Meridian',domain:'meridian.example',type:'draft',stage:'Fixes',status:'Content draft',title:'Make the category definition easier to quote.',body:'An answer-first content draft is ready in the sample workflow. The company founding date and customer count still need verification.',facts:['Start with a clear category definition.','Verify the two unresolved company facts.','No content is published from this preview.']}
];
function renderClients(){
 const selected=byId('client-filter').value;
 const rows=fixtures.filter(r=>selected==='all'||r.type===selected);
 byId('sample-clients').replaceChildren(...rows.map(r=>{
  const card=document.createElement('details');card.className='client';
  // All strings below are fixed, repository-derived sample fixtures, never user input.
  card.innerHTML=`<summary><span class="avatar" aria-hidden="true">${r.name[0]}</span><span class="client-title"><b>${r.name}</b><small>${r.domain} · ${r.stage}</small></span><span class="tag ${r.type==='held'?'held':''}">${r.status}</span></summary><div class="client-body"><span class="kicker">FICTIONAL SAMPLE · PENDING REVIEW</span><h3>${r.title}</h3><p>${r.body}</p><ul>${r.facts.map(f=>`<li>${f}</li>`).join('')}</ul><div class="sample-note">Read-only walkthrough. No approval, client change, or report delivery occurs here.</div></div>`;
  return card;
 }));
 byId('filter-status').textContent=`Showing ${rows.length} of 3 fictional sample clients.`;
}
byId('client-filter').addEventListener('change',renderClients);renderClients();
