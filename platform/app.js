'use strict';

const $ = (selector, root = document) => root.querySelector(selector);
const escapeHtml = value => String(value ?? '').replace(/[&<>"']/g, char => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));
const attr = escapeHtml;
const e = escapeHtml;
const state = { csrf: '', clients: [], reviews: [], leads: [], activity: [], panels: [], loaded: false, menuOpen: false, leadFilter: 'new', search: '', busy: false };
state.inspection = null;
state.inspectionError = '';
state.evidenceFilter = '';
state.pilotDraft = null;
state.pilotDraftError = '';
state.pilotDraftLoading = false;
state.pilotDraftLoaded = false;
state.reportRevisions = [];
state.reportPreparation = null;
state.revisionDetails = new Map();
state.revisionErrors = new Map();
state.revisionLoading = new Set();
const stageNames = ['Intake', 'Agreement', 'Baseline', 'Findings', 'Scope', 'Fixes', 'Monitoring'];
const stageDescriptions = ['Record the request and agree the next step.', 'Agree the pages, competitors and buyer questions.', 'Version the prompt panel and establish a baseline.', 'Review evidence and identify the gaps.', 'Record which fixes are selected for this cycle.', 'Review drafts and record deployment and verification.', 'Review readings and prepare the next cycle.'];
const iconPaths = {
  grid:'<rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/>',
  users:'<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2m20 0v-2a4 4 0 0 0-3-3.9M15 3.1a4 4 0 0 1 0 7.8"/><circle cx="9" cy="7" r="4"/>',
  inbox:'<path d="m3 3-2 12v6h22v-6L21 3H3Zm-2 12h6l2 3h6l2-3h6"/>',
  history:'<path d="M3 12a9 9 0 1 0 2.6-6.4M3 3v6h6m3-2v5l3 2"/>',
  arrow:'<path d="M4 12h16m-6-6 6 6-6 6"/>',
  arrowUp:'<path d="M6 18 18 6M6 6h12v12"/>',
  back:'<path d="M20 12H4m6-6-6 6 6 6"/>',
  chevron:'<path d="m9 5 7 7-7 7"/>',
  check:'<path d="m5 12 4 4L19 6"/>',
  alert:'<path d="m12 3 10 18H2L12 3Zm0 6v5m0 3v.1"/>',
  file:'<path d="M14 2H4v20h16V8l-6-6Zm0 0v6h6M8 13h8m-8 4h6"/>',
  layers:'<path d="m12 3 10 5-10 5L2 8l10-5Zm-10 9 10 5 10-5M2 16l10 5 10-5"/>',
  search:'<circle cx="10.5" cy="10.5" r="7.5"/><path d="m16 16 5 5"/>',
  plus:'<path d="M12 5v14M5 12h14"/>',
  refresh:'<path d="M20 7a9 9 0 0 0-15-1L2 9m0-6v6h6m-4 8a9 9 0 0 0 15 1l3-3m0 6v-6h-6"/>',
  menu:'<path d="M4 6h16M4 12h16M4 18h16"/>',
  close:'<path d="m6 6 12 12M6 18 18 6"/>',
  lock:'<rect x="4" y="10" width="16" height="12" rx="2"/><path d="M8 10V6a4 4 0 0 1 8 0v4m-4 6v2"/>',
  globe:'<circle cx="12" cy="12" r="10"/><ellipse cx="12" cy="12" rx="4" ry="10"/><path d="M2 12h20"/>',
  print:'<path d="M6 9V2h12v7M6 18H2V9h20v9h-4M6 14h12v8H6v-8ZM18 12h.01"/>',
  eye:'<path d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7S1 12 1 12Z"/><circle cx="12" cy="12" r="3"/>',
  return:'<path d="m8 3-5 5 5 5M3 8h11a6 6 0 0 1 0 12h-3"/>',
  clock:'<circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/>'
};
const icon = name => `<svg viewBox="0 0 24 24" aria-hidden="true">${iconPaths[name] || iconPaths.file}</svg>`;
const pill = (text, cls = '') => `<span class="pill ${attr(cls)}">${e(text)}</span>`;
const sample = () => pill('Sample', 'sample');
const sampleNotice = (text = 'This record uses fictional sample data to demonstrate the workflow. No live engine measurements are represented.') => `<div class="sample-notice">${sample()}<span>${e(text)}</span></div>`;
const date = (value, withTime = false) => {
  if (!value) return 'Not recorded';
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return String(value);
  return new Intl.DateTimeFormat(undefined, {month:'short', day:'numeric', year:'numeric', ...(withTime ? {hour:'2-digit', minute:'2-digit'} : {})}).format(parsed);
};
const timeHtml = value => `<time datetime="${attr(value || '')}">${e(date(value, true))}</time>`;
const clientById = id => state.clients.find(client => client.id === id);
const reviewById = id => state.reviews.find(review => review.id === id);
const clientReviews = id => state.reviews.filter(review => review.client_id === id);
const clientPanels = id => state.panels.filter(panel => panel.client_id === id).sort((a,b) => Number(b.version)-Number(a.version) || String(b.created_at).localeCompare(String(a.created_at)));
const pendingReviews = () => state.reviews.filter(review => review.status === 'pending');
const newLeads = () => state.leads.filter(lead => lead.status === 'new');
const newest = items => [...items].sort((a,b) => String(b.created_at).localeCompare(String(a.created_at)));
const kindName = kind => ({report:'Report review', finding:'Draft review', anomaly:'Run held'}[kind] || kind);
const kindIcon = kind => ({report:'file',finding:'layers',anomaly:'alert'}[kind] || 'file');
const statusName = status => ({pending:'Needs review',approved:'Approved',returned:'Returned',active:'Active',paused:'Paused',new:'New',reviewed:'Reviewed',archived:'Archived'}[status] || status);
const humanize = value => String(value || '').replace(/[._-]/g,' ').replace(/^./, char => char.toUpperCase());
const safeUrl = value => { try { const url = new URL(value); return ['https:', 'http:'].includes(url.protocol) ? url.href : null; } catch { return null; } };
const button = (text, href, cls = '', glyph = '') => `<a class="button ${attr(cls)}" href="${attr(href)}">${glyph ? icon(glyph) : ''}${e(text)}</a>`;
const empty = (title, description, action = '', glyph = 'inbox') => `<div class="empty">${icon(glyph)}<h3>${e(title)}</h3><p>${e(description)}</p>${action}</div>`;
const route = () => {
  const parts = location.hash.replace(/^#\/?/, '').split('/').filter(Boolean);
  let id = parts[1] || null;
  try { if (id) id = decodeURIComponent(id); } catch { id = null; }
  return {page:parts[0] || 'console', id};
};

async function api(path, options = {}) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(),15000);
  try {
    const response = await fetch(path, {
      ...options,
      signal:controller.signal,
      headers: {'Accept':'application/json', ...(options.body ? {'Content-Type':'application/json'} : {}), ...(options.method && options.method !== 'GET' ? {'X-CSRF-Token':state.csrf} : {}), ...options.headers},
      body: options.body ? JSON.stringify(options.body) : undefined
    });
    const payload = await response.json().catch(() => null);
    if (!response.ok || payload?.ok === false) throw new Error(payload?.error || `Request failed (${response.status}). Please try again.`);
    return payload;
  } catch (reason) {
    if (reason.name === 'AbortError') throw new Error('The request timed out. Refresh the workspace to check whether your change was saved.');
    throw reason;
  } finally { clearTimeout(timeout); }
}

async function loadWorkspace() {
  const result = await api('/api/workspace');
  for (const key of ['clients','reviews','leads','activity','panels']) state[key] = Array.isArray(result[key]) ? result[key] : [];
  state.reportRevisions = Array.isArray(result.reportRevisions) ? result.reportRevisions : [];
  state.reportPreparation = result.reportPreparation || null;
  try { state.inspection = await api('/api/evidence-inspection'); state.inspectionError = ''; }
  catch (reason) { state.inspection = null; state.inspectionError = reason.message; }
  if (!state.inspection?.inspection?.rows.some(row => row.engine === state.evidenceFilter)) state.evidenceFilter = '';
  state.loaded = true;
}

async function loadRevision(id) {
  if (state.revisionLoading.has(id)) return;
  state.revisionLoading.add(id);
  state.revisionErrors.delete(id);
  state.revisionDetails.delete(id);
  render();
  try { state.revisionDetails.set(id, await api(`/api/report-revisions/${encodeURIComponent(id)}`)); }
  catch (reason) { state.revisionErrors.set(id, reason.message); }
  finally { state.revisionLoading.delete(id); render(); }
}

async function loadPilotDraft() {
  if (state.pilotDraftLoading) return;
  state.pilotDraftLoading = true;
  state.pilotDraftError = '';
  state.pilotDraft = null;
  if (route().page === 'pilot-panel') render();
  try { state.pilotDraft = await api('/api/pilot-panel-draft'); }
  catch (reason) { state.pilotDraftError = reason.message; }
  finally {
    state.pilotDraftLoading = false;
    state.pilotDraftLoaded = true;
    if (route().page === 'pilot-panel') render();
  }
}

let toastTimer;
function toast(message) {
  const node = $('#toast');
  node.textContent = message;
  node.classList.add('visible');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => node.classList.remove('visible'), 5000);
}

function sidebar(page, id) {
  const active = (name, label, glyph, count = '') => `<a class="nav-item ${page === name ? 'active' : ''}" href="#/${name}" ${page === name ? 'aria-current="page"' : ''}>${icon(glyph)}<span>${e(label)}</span>${count !== '' ? `<span class="nav-count">${e(count)}</span>` : ''}</a>`;
  return `<button class="mobile-scrim ${state.menuOpen ? 'open' : ''}" data-action="close-menu" aria-label="Close navigation" tabindex="${state.menuOpen ? '0' : '-1'}"></button>
    <aside class="sidebar ${state.menuOpen ? 'open' : ''}" aria-label="Workspace navigation">
      <a class="sidebar-brand" href="#/console"><span class="wordmark">MindLever<span>X.</span></span><div class="sidebar-kicker">OPERATOR WORKSPACE</div></a>
      <nav aria-label="Main navigation"><div class="nav-label">Your workspace</div>
      ${active('console','Needs me','grid',pendingReviews().length)}${active('evidence','Evidence review','search')}${active('pilot-panel','Pilot question draft','layers')}${active('clients','Clients','users')}${active('leads','Leads','inbox',newLeads().length)}${active('activity','Activity','history')}
      <div class="nav-label">Clients</div>
      ${state.clients.slice(0,6).map(client => `<a class="nav-item sidebar-client ${page === 'clients' && id === client.id ? 'active' : ''}" href="#/clients/${attr(client.id)}"><span class="client-dot"></span><span>${e(client.name)}</span></a>`).join('') || '<div class="nav-item muted">No clients yet</div>'}
      </nav>
      <div class="sidebar-bottom"><div class="mode-mark"><span class="client-dot"></span>Local workspace</div><p>Changes are saved on this computer. Sample records are labeled.</p><a href="/">Visit public website ${icon('arrowUp')}</a></div>
    </aside>`;
}

function shell(content, crumb = '') {
  const {page,id} = route();
  const names = {console:'Needs me',evidence:'Evidence review','pilot-panel':'Pilot question draft',clients:'Clients',reviews:'Review',leads:'Leads',activity:'Activity',panels:'Prompt panels'};
  return `<div class="app-layout">${sidebar(page,id)}<div class="workspace">
    <header class="topbar"><button class="icon-button menu-toggle" data-action="toggle-menu" aria-label="${state.menuOpen ? 'Close' : 'Open'} navigation" aria-expanded="${state.menuOpen}">${icon('menu')}</button>
    <div class="breadcrumb"><span class="breadcrumb-root">Workspace</span>${icon('chevron')}<span>${e(crumb || names[page] || 'Workspace')}</span></div>
    <div class="topbar-right"><span class="topbar-label">Thoughtful work. Traceable evidence.</span><button class="icon-button" data-action="refresh" aria-label="Refresh workspace" title="Refresh workspace">${icon('refresh')}</button><span class="avatar" title="Local operator">OP</span></div></header>
    <main id="main" class="content" tabindex="-1">${content}<footer class="page-footer"><span>MindLeverX · Operator workspace</span><span>Local records · Sample measurements are labeled</span></footer></main>
  </div></div>`;
}

function pageHead(eyebrow, title, description = '', actions = '') {
  return `<div class="page-head"><div><span class="eyebrow">${e(eyebrow)}</span><h1>${e(title)}</h1>${description ? `<p>${e(description)}</p>` : ''}</div>${actions ? `<div class="page-head-actions">${actions}</div>` : ''}</div>`;
}

function reviewCard(review) {
  const client = clientById(review.client_id);
  return `<article class="review-card ${attr(review.kind)}"><div class="review-card-top">${pill(kindName(review.kind),review.kind === 'anomaly' ? 'anomaly' : '')}${review.sample ? sample() : ''}<span class="client-name">${e(client?.name || 'Client')}</span></div>
    <h3><a href="#/reviews/${attr(review.id)}">${e(review.title)}</a></h3><p>${e(review.summary)}</p><div class="review-card-bottom">${button(review.kind === 'anomaly' ? 'Inspect evidence' : 'Read & review',`#/reviews/${review.id}`,'small',review.kind === 'anomaly' ? 'search' : 'arrow')}${timeHtml(review.created_at)}</div></article>`;
}

function stat(label, value, detail, href, accent = false) {
  return `<div class="stat ${accent ? 'accent' : ''}"><div class="stat-label">${e(label)}</div><div class="stat-value">${e(value)}</div><div class="stat-bottom">${e(detail)}</div><a class="stat-top-link" href="${attr(href)}" aria-label="View ${attr(label.toLowerCase())}">${icon('arrowUp')}</a></div>`;
}

function consolePage() {
  const pending = pendingReviews();
  const active = state.clients.filter(client => client.status === 'active');
  const held = pending.filter(review => review.kind === 'anomaly');
  const summary = pending.length ? `${pending.length} ${pending.length === 1 ? 'item is' : 'items are'} ready for your judgment. Open the evidence, record a decision, and keep the work moving.` : 'Your review queue is clear. Client records, evidence and decisions are together here.';
  return pageHead('The operator console','A clear view of what needs you.',summary,button('Add client','#/clients/new','primary','plus')) +
    `<div class="summary-grid">${stat('Needs your review',pending.length,'Decisions awaiting an operator','#/console',true)}${stat('Active clients',active.length,`${state.clients.filter(c => c.sample).length} sample records included`,'#/clients')}${stat('New requests',newLeads().length,'Submitted through local intake','#/leads')}${stat('Held reviews',held.length,'Evidence needs a closer look','#/console')}</div>
    <div class="content-grid"><div><div class="section-head"><h2>Your review queue<span class="count">${pending.length}</span></h2><span class="mono muted">EVIDENCE BEFORE ACTION</span></div>
      <div class="queue-list">${pending.map(reviewCard).join('') || empty('Nothing waiting on you','New review records will appear here when they are ready. You can inspect existing client records at any time.',button('View clients','#/clients','small'),'check')}</div>
      <div class="section-gap"><div class="section-head"><h2>Recently recorded</h2><a class="text-link" href="#/activity">All activity ${icon('arrow')}</a></div><div class="panel">${historyList(newest(state.activity).slice(0,3),true)}</div></div>
    </div><aside class="console-aside"><section class="side-card"><span class="eyebrow">Client pulse</span><h2>Each engagement, in view.</h2><p>Open a record to see its stage, evidence and next decision.</p>
      ${state.clients.slice(0,5).map(client => `<a href="#/clients/${attr(client.id)}" class="client-mini"><div><span class="client-mini-name">${e(client.name)}</span><small>${e(stageNames[(client.stage || 1)-1])} · ${e(statusName(client.status))}</small></div><div class="mini-score">${client.score !== null && client.score !== undefined ? `${e(client.score)}${client.sample ? sample() : ''}` : '<span class="muted">—</span>'}</div></a>`).join('') || '<p>No client records yet.</p>'}
    </section><section class="quiet-card"><span class="eyebrow">The working principle</span><h3>Every decision leaves a trail.</h3><p>Review the source. Add your reasoning. The decision stays with the record, so the next person can see what changed and why.</p></section></aside></div>`;
}

function clientRows(clients) {
  return clients.map(client => `<tr><td><a class="table-title" href="#/clients/${attr(client.id)}">${e(client.name)}</a><div class="table-sub">${e(client.domain)}</div></td><td>${pill(statusName(client.status),client.status)}</td><td><span class="mono">${String(client.stage || 1).padStart(2,'0')}</span> <span class="muted">${e(stageNames[(client.stage || 1)-1])}</span></td><td class="nowrap">${client.score !== null && client.score !== undefined ? `<span class="table-number">${e(client.score)}</span>${client.sample ? sample() : ''}` : '<span class="muted">Not measured</span>'}</td><td>${clientReviews(client.id).filter(review => review.status === 'pending').length}</td><td><a href="#/clients/${attr(client.id)}" class="icon-button" aria-label="Open ${attr(client.name)}">${icon('arrow')}</a></td></tr>`).join('');
}

function clientsPage() {
  const filtered = state.clients.filter(client => `${client.name} ${client.domain}`.toLowerCase().includes(state.search.toLowerCase()));
  return pageHead('Engagements','Clients','A shared record of the work, from the first agreement through every review cycle.',button('Add client','#/clients/new','primary','plus')) +
    `<div class="search-bar"><label class="search-field">${icon('search')}<span class="visually-hidden">Search clients</span><input type="search" id="client-search" placeholder="Search name or domain" value="${attr(state.search)}"></label><span class="search-count" id="client-count">${filtered.length} ${filtered.length === 1 ? 'CLIENT' : 'CLIENTS'}</span></div>
    <div class="table-wrap" tabindex="0" role="region" aria-label="Scrollable records table"><table><thead><tr><th scope="col">Client</th><th scope="col">Status</th><th scope="col">Stage</th><th scope="col">Readiness</th><th scope="col">To review</th><th scope="col"><span class="visually-hidden">Open</span></th></tr></thead><tbody id="client-rows">${clientRows(filtered) || '<tr><td colspan="6" class="muted">No clients match this search.</td></tr>'}</tbody></table></div>
    <p class="field-help" style="margin-top:15px">Sample clients demonstrate the workflow. New clients start with no score or measurements.</p>`;
}

function newClientPage() {
  return `<a class="back-link" href="#/clients">${icon('back')} All clients</a>` + pageHead('New engagement','Start with a client record.','Add the details you know. Measurements and evidence can follow when they exist.') +
    `<div class="detail-layout"><section class="panel"><h2>Client details</h2><p class="panel-intro">This creates a local record. It does not contact the client.</p><form id="client-create"><div class="form-error" role="alert"></div><div class="form-grid"><div class="field"><label for="client-name">Client name</label><input id="client-name" name="name" autocomplete="organization" required maxlength="100" placeholder="Company name"></div><div class="field"><label for="client-domain">Website domain</label><input id="client-domain" name="domain" inputmode="url" required maxlength="253" placeholder="example.com" autocomplete="url"></div></div><div class="field"><label for="client-notes">Engagement notes <span class="muted">(optional)</span></label><textarea id="client-notes" name="notes" maxlength="5000" rows="5" placeholder="What should the next person know?"></textarea></div><div class="form-actions"><button type="submit" class="button primary">${icon('plus')} Create client</button>${button('Cancel','#/clients')}</div></form></section>
    <aside class="quiet-card"><span class="eyebrow">A clean starting point</span><h3>No score without evidence.</h3><p>A new client begins at intake with no readiness score, engine data or reports. Use its stage and notes to record the work as it happens.</p></aside></div>`;
}

function stageStrip(client) {
  const current = Math.min(7,Math.max(1,Number(client.stage) || 1));
  return `<div class="stage-strip" aria-label="Engagement at stage ${current}: ${attr(stageNames[current-1])}">${stageNames.map((name,index) => `<div class="stage-item ${index+1 < current ? 'done' : index+1 === current ? 'current' : ''}"><span class="stage-num">${String(index+1).padStart(2,'0')}</span><span class="stage-name">${e(name)}</span><span class="stage-state">${index+1 < current ? 'PREVIOUS' : index+1 === current ? 'CURRENT' : 'AHEAD'}</span></div>`).join('')}</div><p class="stage-caption">${e(stageDescriptions[current-1])}</p>`;
}

function scoreCard(client) {
  if (client.score === null || client.score === undefined) return `<span class="eyebrow">Readiness</span><h2>Not measured yet.</h2><p class="score-detail">No score has been recorded. A client record alone is not evidence of visibility or readiness.</p>`;
  const delta = client.previous_score == null ? null : client.score-client.previous_score;
  return `<span class="eyebrow">Readiness ${client.sample ? sample() : ''}</span><div class="score-display"><strong>${e(client.score)}</strong><span class="score-denom">/100</span>${delta === null ? '' : `<span class="score-delta">${delta > 0 ? '+' : ''}${e(delta)}${client.sample ? ' · SAMPLE' : ''}</span>`}</div><p class="score-detail">${client.sample ? 'Illustrative readiness score. The underlying scoring model is not implemented.' : 'Recorded readiness score.'}</p>${client.previous_score == null ? '' : `<div class="datum-row"><span>Previous reading</span><span>${e(client.previous_score)} ${client.sample ? sample() : ''}</span></div>`}`;
}

function clientPage(id) {
  const client = clientById(id);
  if (!client) return notFound('Client record');
  const reviews = clientReviews(id);
  const panels = clientPanels(id);
  const latestReport = newest(reviews.filter(review => review.kind === 'report'))[0];
  const clientActivity = newest(state.activity.filter(event => event.entity_id === id || reviews.some(review => review.id === event.entity_id) || panels.some(panel => panel.id === event.entity_id)));
  return `<a class="back-link" href="#/clients">${icon('back')} All clients</a><div class="page-head"><div><span class="eyebrow">Client record</span><div class="entity-heading"><h1>${e(client.name)}</h1>${pill(statusName(client.status),client.status)}${client.sample ? sample() : ''}</div><div class="entity-meta"><span>${e(client.domain)}</span><span>·</span><span>Created ${e(date(client.created_at))}</span></div></div><div class="page-head-actions">${latestReport ? button('Report preview',`#/preview/${latestReport.id}`,'','eye') : button('Prompt panels',`#/panels/${client.id}`,'','layers')}</div></div>
    ${client.sample ? sampleNotice() : ''}<div class="detail-layout"><div class="detail-main"><section class="panel"><div class="section-head"><h2>Where the engagement is</h2><span class="mono muted">STAGE ${e(client.stage || 1)} / 7</span></div>${stageStrip(client)}</section>
    <section><div class="section-head"><h2>Review work<span class="count">${reviews.length}</span></h2></div>${reviews.length ? `<div class="queue-list">${reviews.map(review => review.status === 'pending' ? reviewCard(review) : `<article class="review-card"><div class="review-card-top">${pill(kindName(review.kind))}${pill(review.revision && review.status === 'approved' ? 'Local draft accepted' : statusName(review.status),review.status)}${review.sample ? sample() : ''}</div><h3><a href="#/reviews/${attr(review.id)}">${e(review.title)}</a></h3><p>${e(review.summary)}</p><a class="text-link" href="#/reviews/${attr(review.id)}">View decision ${icon('arrow')}</a></article>`).join('')}</div>` : empty('No reviews yet','Evidence and draft reviews will appear here when they are recorded. You can define a prompt panel now.',button('Create prompt panel',`#/panels/${id}`,'small','layers'),'file')}</section>
    <section class="panel"><div class="section-head"><h2>Prompt panel</h2><a class="text-link" href="#/panels/${attr(id)}">${panels.length ? 'View versions' : 'Create panel'} ${icon('arrow')}</a></div><p class="panel-intro">A versioned set of buyer questions, kept intact so changes remain visible.</p>${panels.length ? `<div class="datum-row"><span>Latest version</span><strong>${e(versionLabel(panels[0].version))} ${panels[0].sample ? sample() : ''}</strong></div><div class="datum-row"><span>Questions</span><span>${Array.isArray(panels[0].prompts) ? panels[0].prompts.length : 0} ${panels[0].sample ? sample() : ''}</span></div><div class="datum-row"><span>Recorded</span><span>${e(date(panels[0].created_at))}</span></div>` : '<p class="muted">No prompt panel has been recorded.</p>'}</section>
    <section class="panel"><h2>Record history</h2>${historyList(clientActivity.slice(0,12))}</section></div>
    <aside class="detail-aside"><section class="panel">${scoreCard(client)}</section><section class="panel"><h2>Manage engagement</h2><form id="client-update" data-id="${attr(id)}"><div class="form-error" role="alert"></div><div class="field"><label for="engagement-status">Status</label><select id="engagement-status" name="status"><option value="active" ${client.status === 'active' ? 'selected' : ''}>Active</option><option value="paused" ${client.status === 'paused' ? 'selected' : ''}>Paused</option></select></div><div class="field"><label for="engagement-stage">Current stage</label><select id="engagement-stage" name="stage">${stageNames.map((name,index) => `<option value="${index+1}" ${Number(client.stage) === index+1 ? 'selected' : ''}>${String(index+1).padStart(2,'0')} · ${e(name)}</option>`).join('')}</select><span class="field-help">Records your operational status; it does not trigger automation.</span></div><div class="field"><label for="engagement-notes">Notes</label><textarea id="engagement-notes" name="notes" rows="5" maxlength="5000">${e(client.notes || '')}</textarea></div><button type="submit" class="button primary">Save changes</button></form></section></aside></div>`;
}

function evidenceList(review) {
  const evidence = Array.isArray(review.evidence) ? review.evidence : [];
  return evidence.length ? `<div class="evidence-list">${evidence.map(item => `<div class="evidence-item"><span class="eyebrow">${e(item.label || 'Evidence')} ${review.sample ? sample() : ''}</span><p>${e(item.detail || '')}</p>${safeUrl(item.url) ? `<a href="${attr(safeUrl(item.url))}" target="_blank" rel="noopener noreferrer">Open source ${icon('arrowUp')}</a>` : ''}</div>`).join('')}</div>` : '<p class="panel-intro">No evidence has been attached to this review.</p>';
}

function reviewPage(id) {
  const review = reviewById(id);
  if (!review) return notFound('Review');
  if (review.revision) return reportRevisionReviewPage(review);
  const client = clientById(review.client_id);
  const history = newest(state.activity.filter(event => event.entity_id === id));
  return `<a class="back-link" href="#/clients/${attr(review.client_id)}">${icon('back')} ${e(client?.name || 'Client record')}</a>` + pageHead(kindName(review.kind),review.title,review.summary,review.kind === 'report' ? button('Report preview',`#/preview/${id}`,'','eye') : '') +
    `<div class="review-meta">${pill(review.revision && review.status === 'approved' ? 'Local draft accepted' : statusName(review.status),review.status)}${review.sample ? sample() : ''}<span class="mono muted">${e(client?.name || 'Client')} · ${e(date(review.created_at,true))}</span></div>${review.sample ? sampleNotice('The content and evidence below are fictional sample records. Your review decision and note are saved locally.') : ''}
    <div class="detail-layout"><div class="detail-main"><section class="panel"><span class="eyebrow">${review.kind === 'anomaly' ? 'What needs attention' : 'Review content'}</span><div class="body-copy">${e(review.body || review.summary)}</div></section><section class="panel"><h2>Evidence, alongside the work.</h2><p class="panel-intro">Use these source records to assess the review. Sample evidence describes an illustrative scenario.</p>${evidenceList(review)}</section><section class="panel"><h2>Decision history</h2>${historyList(history)}</section></div>
    <aside class="detail-aside"><section class="panel"><span class="eyebrow">Your judgment</span><h2>${review.status === 'pending' ? 'Record a decision.' : `${e(statusName(review.status))}.`}</h2>${review.status === 'pending' ? `<p class="panel-intro">${review.kind === 'anomaly' ? 'Approve the review when the evidence is sufficient, or return it with the issue that needs attention. This does not retry a run.' : 'Leave the reasoning that makes this decision useful to the next person. Approval records your review; it does not send a report.'}</p><form id="review-decision" data-id="${attr(id)}"><div class="form-error" role="alert"></div><div class="field"><label for="decision-note">Decision note <span class="muted">(required)</span></label><textarea id="decision-note" name="note" rows="6" required minlength="3" maxlength="3000" placeholder="What did you verify, or what needs to change?"></textarea></div><div class="form-actions"><button class="button primary" type="submit" name="decision" value="approved">${icon('check')} Approve</button><button class="button" type="submit" name="decision" value="returned">${icon('return')} Return</button></div></form>` : `<p class="panel-intro">Recorded ${e(date(review.decided_at,true))}.</p><div class="decision-note">${e(review.note || 'No note recorded.')}</div><p class="field-help" style="margin-top:15px">This decision is retained with the review record.</p>`}</section><section class="quiet-card"><span class="eyebrow">Review boundary</span><h3>Evidence leads. People decide.</h3><p>A recorded approval is a local workflow decision. Report delivery, site publishing and live engine runs are not connected here.</p></section></aside></div>`;
}

function loadCurrentRevision(reviewId) {
  const revision = reviewById(reviewId)?.revision;
  if (revision && !state.revisionDetails.has(revision.id) && !state.revisionErrors.has(revision.id) && !state.revisionLoading.has(revision.id)) void loadRevision(revision.id);
}

function reportRevisionReviewPage(review) {
  const stored = state.revisionDetails.get(review.revision.id);
  const error = state.revisionErrors.get(review.revision.id);
  const top = `<a class="back-link" href="#/clients/${attr(review.client_id)}">${icon('back')} Client record</a>` + pageHead('Internal saved sample · Local review', review.title, 'Review the retained snapshot. Accepting this local draft does not authorize collection or client release.');
  if (!stored) return top + `<section class="panel"><p role="${error ? 'alert' : 'status'}">${e(error || 'Loading the retained report snapshot…')}</p>${error ? `<button class="button" data-action="retry-revision" data-id="${attr(review.revision.id)}">Retry snapshot</button>` : ''}</section>`;
  const {revision, report} = stored;
  const fields = entries => `<dl>${entries.map(([label,value]) => `<dt>${e(label)}</dt><dd>${e(value)}</dd>`).join('')}</dl>`;
  const stateLabel = review.status === 'approved' ? 'Local draft accepted' : review.status === 'returned' ? 'Returned for revision' : 'Needs local review';
  const root = `/api/report-revisions/${encodeURIComponent(revision.id)}`;
  const identity = fields([['Revision', `${revision.id} · v${revision.version}`], ['Snapshot SHA-256', revision.snapshotSha256], ['Client at preparation', revision.subject.clientName], ['Configured domain', revision.subject.domain], ['Configured brand', revision.subject.brand], ['Prepared', date(revision.preparedAt,true)], ['Source SHA-256', revision.source.sha256], ['Report JSON SHA-256', revision.report.sha256], ['PDF SHA-256', revision.pdf.sha256], ['Processing method', revision.method], ['Report schema', revision.reportSchemaVersion], ['Renderer version', revision.rendererVersion]]);
  return top + `<div class="evidence-banner">${pill(stateLabel, review.status)}<span>Collection qualification is still required. Client release is unavailable.</span></div>
    <div class="detail-layout"><div class="detail-main"><section class="panel"><span class="eyebrow">Retained finding</span><h2>${e(report.aggregate.numerator)} of ${e(report.aggregate.denominator)} saved answers name ${e(report.brand)}.</h2><p>Literal answer-text check only. This is not an overall visibility score, representative baseline or accepted collection design.</p><div class="form-actions">${button('Download retained PDF',`${root}/draft.pdf`,'primary','file')}${button('Report JSON',`${root}/report.json`,'','file')}</div><p class="field-help">Downloads use the stored bytes of this revision. They do not regenerate a report from the current source.</p></section>
    <section class="panel"><h2>Scope and limitations</h2><p>${e(revision.scopeBoundary)}</p><ul>${report.limitations.map(value => `<li>${e(value)}</li>`).join('')}</ul></section>
    <section class="panel"><h2>Retained answers</h2>${report.answers.map(answer => `<details class="evidence-source report-answer"><summary>Answer ${e(answer.row)} · ${e(engineName(answer.engine))} · ${answer.literalMention ? 'Literal mention' : 'No literal mention'}</summary><p><strong>Question:</strong> ${e(answer.prompt)}</p><p class="field-help">Vendor date: ${e(answer.vendorTimestamp || 'Not supplied')} · Response ID: ${e(answer.vendorResponseId || 'Not supplied')}</p><pre>${e(answer.answer)}</pre></details>`).join('')}</section>
    <details class="panel evidence-source"><summary>Immutable snapshot identity and fingerprints</summary>${identity}${button('Original source JSON',`${root}/source.json`,'small','file')}<p class="field-help">Fingerprints identify retained bytes and are checked when retrieved. They are not proof of vendor authenticity or tamper-proof storage.</p></details>
    <section class="panel"><h2>Decision history</h2>${historyList(newest(state.activity.filter(event => event.entity_id === review.id)))}</section></div>
    <aside class="detail-aside"><section class="panel"><h2>${review.status === 'pending' ? 'Review this local draft' : e(stateLabel)}</h2>${review.status === 'pending' ? `<p>Record what you checked against this exact snapshot. A changed source needs a successor revision and a new review.</p><form id="review-decision" data-id="${attr(review.id)}" data-revision-id="${attr(revision.id)}" data-snapshot-hash="${attr(revision.snapshotSha256)}"><div class="form-error" role="alert"></div><div class="field"><label for="decision-note">Decision note (required)</label><textarea id="decision-note" name="note" required minlength="3" maxlength="3000" rows="5"></textarea></div><div class="form-actions"><button class="button primary" type="submit" name="decision" value="approved">Accept local draft</button><button class="button" type="submit" name="decision" value="returned">Return</button></div></form>` : `<p>${e(date(review.decided_at,true))}</p><div class="decision-note">${e(review.note)}</div>`}</section><section class="quiet-card"><h3>Internal review only</h3><p>This decision does not qualify the source, release a monthly report, contact a client or change the one-time audit release policy.</p></section></aside></div>`;
}

function leadsPage() {
  const filtered = newest(state.leads.filter(lead => state.leadFilter === 'all' || lead.status === state.leadFilter));
  return pageHead('Intake','Leads','Requests submitted through the local website appear here. Review status records your follow-up work.') +
    `<div class="tabs" role="group" aria-label="Filter leads">${[['new','New'],['reviewed','Reviewed'],['archived','Archived'],['all','All requests']].map(([value,label]) => `<button class="tab ${state.leadFilter === value ? 'active' : ''}" data-action="filter-leads" data-filter="${value}" aria-pressed="${state.leadFilter === value}">${label} <span class="mono">${value === 'all' ? state.leads.length : state.leads.filter(lead => lead.status === value).length}</span></button>`).join('')}</div>
    ${filtered.length ? `<div class="table-wrap" tabindex="0" role="region" aria-label="Scrollable records table"><table><thead><tr><th scope="col">Request</th><th scope="col">Type</th><th scope="col">Received</th><th scope="col">Status</th><th scope="col">Record action</th></tr></thead><tbody>${filtered.map(lead => `<tr><td><span class="table-title">${e(lead.domain || lead.email)}</span><div class="table-sub">${e(lead.email)}</div><div class="table-sub">${e(lead.source || 'Website intake')}</div></td><td>${pill(lead.kind === 'subscription' ? 'Research interest' : 'Audit request')}${lead.sample ? sample() : ''}</td><td class="nowrap"><span class="table-sub">${e(date(lead.created_at,true))}</span></td><td>${pill(statusName(lead.status),lead.status)}</td><td><div class="table-actions">${lead.status !== 'reviewed' ? `<button class="button small" data-action="lead-status" data-id="${attr(lead.id)}" data-status="reviewed">Mark reviewed</button>` : ''}${lead.status !== 'archived' ? `<button class="button small" data-action="lead-status" data-id="${attr(lead.id)}" data-status="archived">Archive</button>` : `<button class="button small" data-action="lead-status" data-id="${attr(lead.id)}" data-status="new">Restore</button>`}</div></td></tr>`).join('')}</tbody></table></div>` : empty(state.leadFilter === 'new' ? 'No new requests.' : 'Nothing in this view.',state.leads.length ? 'Choose another status to see the rest of your intake.' : 'Local website submissions will appear here after they are saved. The sample clients do not generate leads.',button('Open website','/','small','globe'),'inbox')}
    <p class="field-help" style="margin-top:18px">Changing a request’s status saves a local record. It does not send email or subscribe anyone to a mailing service.</p>`;
}

function historyList(events, compact = false) {
  if (!events.length) return '<p class="panel-intro" style="margin-bottom:0">No activity has been recorded here yet.</p>';
  return `<ol class="history-list ${compact ? 'wide-history' : ''}">${events.map(event => `<li class="history-item"><span class="history-symbol">${icon(event.entity_type === 'review' ? 'check' : event.entity_type === 'lead' ? 'inbox' : 'history')}</span><div><strong>${e(humanize(event.action))}</strong>${event.detail ? `<p>${e(typeof event.detail === 'string' ? event.detail : JSON.stringify(event.detail))}</p>` : ''}${timeHtml(event.created_at)}<span class="actor mono muted">· ${e(event.actor || 'Local operator')}</span></div></li>`).join('')}</ol>`;
}

function activityPage() {
  return pageHead('The record','Activity','Client changes, review decisions and intake updates, with the actor and time attached.') + `<section class="panel">${state.activity.length ? historyList(newest(state.activity),true) : empty('A fresh record.','Create a client or review an item. Saved actions will appear here.',button('View workspace','#/console','small'),'history')}</section>`;
}

function versionLabel(value) { return /^v/i.test(String(value)) ? String(value) : `v${value}`; }

function pilotPanelPage() {
  const refresh = `<button class="button small" data-action="refresh-pilot" ${state.pilotDraftLoading ? 'disabled' : ''}>${icon('refresh')} ${state.pilotDraftError ? 'Retry draft' : 'Refresh draft'}</button>`;
  const heading = pageHead('Question coverage · Review draft', 'Pilot question draft', 'Read the proposed questions, why each is included and what still needs to be decided.', refresh);
  if (state.pilotDraftLoading || !state.pilotDraftLoaded) return heading + '<section class="panel"><p role="status">Loading the saved question draft…</p></section>';
  if (state.pilotDraftError || !state.pilotDraft) return heading + `<section class="panel"><h2>Draft unavailable</h2><p role="alert">${e(state.pilotDraftError || 'The saved draft could not be loaded. Retry when it is available.')}</p><p class="field-help">Other workspace records remain available. No collection or panel changes occurred.</p></section>`;
  const {draft, source} = state.pilotDraft;
  const fields = entries => `<dl>${entries.map(([label, value]) => `<dt>${e(label)}</dt><dd>${e(value === null ? 'Unresolved' : value)}</dd>`).join('')}</dl>`;
  const intentById = new Map(draft.intents.map(intent => [intent.id, intent]));
  const sourceById = new Map(draft.sources.map(item => [item.id, item]));
  const provenance = value => value === 'retained_observed_prompt' ? 'Question retained in a saved export' : 'AI-generated hypothesis';
  const roles = {discovery_candidate:'Discovery candidate',exploratory_candidate:'Exploratory candidate',brand_diagnostic:'Brand diagnostic'};
  const questions = draft.questions.map(question => `<details class="version-card evidence-source pilot-question"><summary><strong>${e(question.id)} · ${e(question.text)}</strong></summary><div class="version-body">
    <div class="review-card-top">${pill(question.provenance === 'retained_observed_prompt' ? 'Retained prompt' : 'AI hypothesis')}${pill(roles[question.role])}</div>
    ${fields([['Provenance', provenance(question.provenance)], ['Intent', intentById.get(question.intentId).title], ['Brand anchoring', question.anchoring === 'unanchored' ? 'Unanchored' : 'Brand anchored'], ['Proposed discovery eligibility', question.headlineEligibility === 'excluded' ? 'Excluded in this draft' : 'Eligibility unresolved'], ['Question version', question.version]])}
    <h3>Why this question</h3><p>${e(question.rationale)}</p><h3>What is uncertain</h3><p>${e(question.uncertainty)}</p>
    <h3>Source basis</h3><ul>${question.sourceIds.map(id => `<li><strong>${e(sourceById.get(id).title)}</strong> — ${e(sourceById.get(id).limitation)}</li>`).join('')}</ul></div></details>`).join('');
  return heading + `<div class="evidence-banner">${pill('Draft','pending')}<span>Collection is blocked. These questions are candidates; no panel is frozen and no new answers have been collected.</span></div>
    <section class="panel evidence-source"><span class="eyebrow">${e(draft.subject.brand)} · ${e(draft.subject.domain)}</span><h2>${e(draft.questions.length)} questions to review</h2><p>${e(draft.purpose)}</p><p class="field-help">The count describes this candidate set. It is not an approved sample-size requirement or evidence of adequate coverage.</p>
    <details><summary>Panel version, ownership and collection context</summary>${fields([['Panel', `${draft.panelId} · v${draft.version}`], ['Prepared by', draft.preparedBy], ['Owner', draft.owner], ['Question language', draft.language], ['Market', draft.market], ['Collection locale', draft.locale], ['Qualified collection surface', draft.collectionSurface], ['Repetitions', draft.repetitions]])}</details></section>
    <section class="section-gap"><div class="section-head"><h2>Proposed coverage</h2></div><ul class="pilot-coverage" aria-label="Proposed question coverage">${draft.intents.map(intent => { const count = draft.questions.filter(question => question.intentId === intent.id).length; return `<li><div><strong>${e(intent.title)}</strong>${pill(`${count} ${count === 1 ? 'question' : 'questions'}`)}</div><p>${e(intent.definition)}</p></li>`; }).join('')}</ul><p class="field-help">These are proposed intent assignments, not measured buyer demand.</p></section>
    <section class="section-gap"><div class="section-head"><h2>The candidate questions</h2></div>${questions}</section>
    <section class="panel section-gap"><h2>Measurement boundary</h2><p>${e(draft.measurementBoundary)}</p><h3>Still unresolved</h3><ul>${draft.gaps.map(gap => `<li>${e(gap)}</li>`).join('') || '<li>No additional gaps recorded; this does not establish readiness.</li>'}</ul></section>
    <section class="panel section-gap"><h2>Alternatives kept for later</h2>${draft.alternatives.map(alternative => `<details class="evidence-source"><summary>${e(alternative.text)}</summary><p>${e(alternative.reason)}</p></details>`).join('') || '<p>No alternatives recorded.</p>'}</section>
    <details class="panel section-gap evidence-source"><summary>Source references and draft fingerprint</summary><p class="field-help">References describe the saved basis for the draft. A file hash identifies bytes; it does not prove buyer relevance or accept the collection method.</p>${draft.sources.map(item => `<h3>${e(item.title)}</h3>${fields([['Source ID', item.id], ['Kind', humanize(item.kind)], ['Reference (text only)', item.reference], ['Recorded source hash', item.sha256 === null ? 'Not recorded' : item.sha256], ['Limitation', item.limitation]])}`).join('')}${fields([['Draft SHA-256', source.sha256], ['Draft bytes', source.bytes]])}</details>`;
}

function panelsPage(id) {
  const client = clientById(id);
  if (!client) return notFound('Client record');
  const panels = clientPanels(id);
  return `<a class="back-link" href="#/clients/${attr(id)}">${icon('back')} ${e(client.name)}</a>` + pageHead('Methodology in the record','Prompt panels','Keep the questions intact. Add a new version when the panel changes, with a note explaining why.') +
    `<div class="detail-layout"><div><div class="section-head"><h2>Recorded versions<span class="count">${panels.length}</span></h2><span class="mono muted">IMMUTABLE HISTORY</span></div>${panels.length ? panels.map((panel,index) => `<details class="version-card" ${index === 0 ? 'open' : ''}><summary>${icon('lock')}<strong>Panel ${e(versionLabel(panel.version))}</strong>${index === 0 ? pill('Latest') : ''}${panel.sample ? sample() : ''}<span class="mono muted">${Array.isArray(panel.prompts) ? panel.prompts.length : 0} QUESTIONS</span></summary><div class="version-body"><p class="field-help" style="margin-top:16px">Recorded ${e(date(panel.created_at,true))}</p><ol class="prompt-list">${(panel.prompts || []).map(prompt => `<li>${e(typeof prompt === 'string' ? prompt : prompt.text || '')}</li>`).join('')}</ol><p class="version-note">${e(panel.note || 'No version note recorded.')}</p></div></details>`).join('') : empty('Define the first panel.','Record the buyer questions you plan to examine. Saving a panel does not send them to an engine.','','layers')}</div>
    <aside class="panel"><h2>${panels.length ? 'Create a new version.' : 'Create the first version.'}</h2><p class="panel-intro">Existing versions stay unchanged. Each line becomes one question.</p><form id="panel-create" data-id="${attr(id)}"><div class="form-error" role="alert"></div><div class="field"><label for="panel-prompts">Buyer questions</label><textarea id="panel-prompts" name="prompts" required rows="10" maxlength="25050" placeholder="Which tools help a SaaS team measure product usage?&#10;How should a growing SaaS team compare billing platforms?"></textarea><span class="field-help">One question per line. Up to 50 questions, 500 characters each.</span></div><div class="field"><label for="panel-note">Version note <span class="muted">(required)</span></label><textarea id="panel-note" name="note" required minlength="3" maxlength="1500" rows="3" placeholder="Why this set? What changed from the previous version?"></textarea></div><button type="submit" class="button primary">${icon('lock')} Save new version</button></form></aside></div>`;
}

function previewPage(id) {
  const review = reviewById(id);
  const client = clientById(review?.client_id);
  if (!review || !client || review.kind !== 'report') return shell(notFound('Report preview'));
  if (review.revision) return shell(reportRevisionReviewPage(review));
  return `<div class="preview-page"><header class="preview-topbar"><a class="wordmark" href="#/console">MindLever<span>X.</span></a><div class="preview-toolbar">${button('Back to review',`#/reviews/${id}`,'small','back')}<button class="button small" data-action="print">${icon('print')} Print / save PDF</button></div></header><main id="main" class="preview-content" tabindex="-1"><div class="preview-status"><strong>Internal report preview</strong> · ${pill(review.revision && review.status === 'approved' ? 'Local draft accepted' : statusName(review.status),review.status)} · This preview has not been delivered to a client.</div>${review.sample ? sampleNotice('This report contains fictional sample measurements and evidence. It demonstrates the report format; it is not a measured client report.') : ''}
    <div class="preview-head"><div><span class="eyebrow">${e(client.name)} · Engagement report</span><h1>${e(review.title)}</h1><p class="muted">${e(review.summary)}</p><span class="preview-date">${e(date(review.created_at))} · ${e(client.domain)}</span></div><div class="preview-score">${scoreCard(client)}</div></div>
    <section class="panel"><h2>Where the engagement is</h2>${stageStrip(client)}</section><section class="preview-body"><span class="eyebrow">The reading</span><div class="body-copy">${e(review.body || review.summary)}</div></section><section><h2>The evidence behind the report</h2>${evidenceList(review)}</section>${review.status !== 'pending' ? `<section class="preview-body"><h2>Review decision</h2><p class="preview-date">${e(statusName(review.status))} · ${e(date(review.decided_at,true))}</p><div class="decision-note">${e(review.note)}</div></section>` : ''}
    <p class="preview-disclaimer">${review.sample ? 'All displayed scores and evidence are SAMPLE, not measured. The scoring model and engine collection are not implemented in this local workspace. ' : ''}Engine API observations do not establish what users see in consumer products; retrieval, personalization and interface can differ. This report preview is available to the local operator and is not an authenticated client portal.</p><footer class="page-footer"><span>MindLeverX · Evidence before assertion.</span><span>${review.sample ? 'Sample report' : 'Internal preview'}</span></footer></main></div>`;
}

function notFound(label = 'Page') {
  return empty(`${label} not found.`, 'This link does not match a record in the local workspace.',button('Return to workspace','#/console','primary','back'),'search');
}

const engineName = value => ({ chatgpt: 'ChatGPT', perplexity: 'Perplexity', google: 'Google', copilot: 'Copilot' }[value] || value || 'Unknown platform');
function evidenceRows(rows) {
  return rows.map(row => `<tr><td class="mono">${e(row.row)}</td><td>${e(engineName(row.engine))}</td><td>${e(date(row.vendorTimestamp))}</td><td>${e(row.prompt || 'Question missing')}</td><td>${row.literalMention === null ? pill('Missing answer','pending') : row.literalMention ? pill('Mention found','active') : '<span class="muted">Not mentioned</span>'}</td></tr>`).join('') || '<tr><td colspan="5">No answers match this filter.</td></tr>';
}
function reportPreparationPanel(data) {
  const setup = state.reportPreparation;
  let unavailable = '';
  if (data.status !== 'complete') unavailable = 'Resolve incomplete or ambiguous evidence before preparing a local draft.';
  else if (!setup?.sourceConfigured) unavailable = 'Connect a saved source in the local server setup first.';
  else if (!setup.subjectDomain) unavailable = 'The saved evidence subject domain is not configured. Set MLX_EVIDENCE_DOMAIN in the local server setup before preparing a snapshot.';
  const client = setup?.subjectDomain ? state.clients.find(row => !row.sample && row.domain === setup.subjectDomain) : null;
  if (!unavailable && !client) unavailable = `Create a local record for ${setup.subjectDomain}. Fictional sample clients cannot receive this saved snapshot.`;
  return `<section class="panel section-gap"><h2>Prepare a local draft for review</h2><p>Retain this source, its results and the exact PDF together, then review that snapshot.</p><p class="field-help">The configured brand/domain is an operator-supplied mapping, not verified vendor provenance. Collection qualification and client release remain unavailable.</p>${unavailable ? `<p>${e(unavailable)}</p>${setup?.subjectDomain && !client ? button('Open clients', '#/clients', 'small', 'users') : ''}` : `<p><strong>${e(client.name)}</strong> · ${e(client.domain)} · ${e(setup.brand)}</p><form id="report-prepare" data-id="${attr(client.id)}" data-source-sha="${attr(data.source.sha256)}"><div class="form-error" role="alert"></div><button type="submit" class="button primary">Prepare local draft &amp; open review</button></form>`}</section>`;
}

function evidencePage() {
  const head = pageHead('Saved evidence · Local review', 'What do the answers show?', 'Review the saved answers before they become a client report.', '<button class="button" data-action="refresh">'+icon('refresh')+'Refresh saved data</button>');
  if (state.inspectionError) return head + `<div class="error-note" role="alert">${e(state.inspectionError)}</div><p class="muted">Your other workspace records are still available. Refresh to try again.</p>`;
  if (!state.inspection?.available) return head + empty('No saved evidence connected', 'Connect a local export to inspect real results here. No measurement has been made.', '', 'file');
  const data = state.inspection.inspection;
  const engines = [...new Set(data.rows.map(row => row.engine).filter(Boolean))];
  const questions = [...new Set(data.rows.map(row => row.prompt).filter(Boolean))];
  const repeated = data.issues.filter(item => item.code === 'repeated_vendor_response_id').length;
  const blocked = data.status === 'blocked';
  const filtered = data.rows.filter(row => !state.evidenceFilter || row.engine === state.evidenceFilter);
  const summary = (label, value, help) => `<div class="stat"><div class="stat-label">${e(label)}</div><div class="stat-value">${e(value)}</div><div class="stat-bottom">${e(help)}</div></div>`;
  return head + `<div class="evidence-banner">${pill('Saved sample','sample')}<span>Real retained answers. This limited sample is <strong>not a completed client audit</strong>.</span></div>
    <div class="summary-grid">${summary('Answers retained',data.recordCount ?? 'Unknown','Records in this export')}${summary('Literal brand mentions',data.aggregate ? data.aggregate.numerator+' / '+data.aggregate.denominator : 'Unavailable','Answer text only; case-insensitive')}${summary('Platforms',engines.length || 'Unknown','As labeled by the provider')}${summary('Questions',questions.length || 'Unknown','Coverage of this saved sample')}</div>
    <div class="evidence-columns"><section class="panel evidence-finding"><span class="eyebrow">The finding</span><h2>${blocked ? 'Resolve the evidence gaps first.' : data.aggregate.numerator === 0 ? 'No literal mentions in these answers.' : e(data.brand)+' appears in '+data.aggregate.numerator+' saved answers.'}</h2><p>${blocked ? 'Some records are incomplete or ambiguous. A total is withheld so missing evidence cannot appear as zero visibility.' : 'We checked for the exact text “'+e(data.brand)+'” in each saved answer, ignoring capitalization. Name variations and citations are not included.'}</p><p class="muted">This does not establish overall AI visibility or explain why a business was included or omitted.</p><div class="evidence-next"><strong>Next step</strong><p>Confirm the collection method and question coverage before using these findings in a client report.</p></div></section>
    <section class="panel"><h2>Coverage by platform</h2><p class="panel-intro">Answers retained, not a visibility score.</p><div class="coverage-bars">${engines.map(engine => { const rows = data.rows.filter(row => row.engine === engine); return `<div class="coverage-row"><div><span>${e(engineName(engine))}</span><strong>${rows.length} answers</strong></div><div class="coverage-track" aria-hidden="true"><span style="width:${100*rows.length/Math.max(1,data.recordCount)}%"></span></div></div>`; }).join('')}</div></section></div>
    <section class="panel section-gap"><div class="section-head"><h2>What needs attention</h2>${pill(blocked ? 'Count blocked' : 'Review required','pending')}</div><p>${repeated ? e(repeated)+' records reuse a provider response ID. All rows are retained; platform and date help distinguish them.' : 'Provider method, collection context and permitted reporting use still need review.'}</p><p class="muted">A completed data check is not approval to release a report.</p>${data.issues.some(item=>item.severity==='error') ? '<ul>'+data.issues.filter(item=>item.severity==='error').map(item=>'<li>'+e(humanize(item.code))+(item.row ? ' · row '+e(item.row) : '')+(item.field ? ' · '+e(humanize(item.field)) : '')+'</li>').join('')+'</ul>' : ''}</section>
    ${reportPreparationPanel(data)}
    <section class="section-gap" aria-labelledby="answers-heading"><div class="section-head"><h2 id="answers-heading">Inspect the answer records</h2><span id="evidence-count" class="mono" role="status">${filtered.length} of ${data.rows.length} records</span></div><div class="evidence-filter field"><label for="evidence-platform">Filter by platform</label><select id="evidence-platform"><option value="">All platforms</option>${engines.map(engine=>'<option value="'+attr(engine)+'" '+(state.evidenceFilter===engine?'selected':'')+'>'+e(engineName(engine))+'</option>').join('')}</select></div><div class="table-wrap"><table><caption class="evidence-caption">Saved vendor dates; exact collection timing is unverified.</caption><thead><tr><th scope="col">Record</th><th scope="col">Platform</th><th scope="col">Vendor date</th><th scope="col">Question</th><th scope="col">Literal brand check</th></tr></thead><tbody id="evidence-rows">${evidenceRows(filtered)}</tbody></table></div></section>
    <details class="panel section-gap evidence-source"><summary>Source details &amp; limitations</summary><dl><dt>Source fingerprint (SHA-256)</dt><dd class="mono">${e(data.source.sha256)}</dd><dt>Original size</dt><dd>${e(data.source.bytes.toLocaleString())} bytes</dd><dt>Matching rule</dt><dd>Literal substring in answer text. Each matching answer counts once.</dd></dl><ul>${data.limitations.map(item=>'<li>'+e(item)+'</li>').join('')}</ul></details>`;
}

document.addEventListener('change', event => {
  if (event.target.id !== 'evidence-platform') return;
  state.evidenceFilter = event.target.value;
  const rows = state.inspection.inspection.rows;
  const filtered = rows.filter(row => !state.evidenceFilter || row.engine === state.evidenceFilter);
  $('#evidence-rows').innerHTML = evidenceRows(filtered);
  $('#evidence-count').textContent = `${filtered.length} of ${rows.length} records`;
});

function render() {
  if (!state.loaded) return;
  const {page,id} = route();
  let content;
  let crumb;
  if (page === 'preview') { $('#app').innerHTML = previewPage(id); document.title = `Report preview · MindLeverX`; syncNavigation(); loadCurrentRevision(id); return; }
  if (page === 'console') content = consolePage();
  else if (page === 'evidence') content = evidencePage();
  else if (page === 'pilot-panel') content = pilotPanelPage();
  else if (page === 'clients' && id === 'new') { content = newClientPage(); crumb = 'Clients / New client'; }
  else if (page === 'clients' && id) { content = clientPage(id); crumb = `Clients / ${clientById(id)?.name || 'Record'}`; }
  else if (page === 'clients') content = clientsPage();
  else if (page === 'reviews') { content = reviewPage(id); crumb = `${clientById(reviewById(id)?.client_id)?.name || 'Workspace'} / Review`; }
  else if (page === 'leads') content = leadsPage();
  else if (page === 'activity') content = activityPage();
  else if (page === 'panels') { content = panelsPage(id); crumb = `${clientById(id)?.name || 'Client'} / Prompt panels`; }
  else content = notFound();
  $('#app').innerHTML = shell(content,crumb);
  syncNavigation();
  const title = $('#main h1')?.textContent || 'Workspace';
  document.title = `${title} · MindLeverX`;
  if (page === 'pilot-panel' && !state.pilotDraftLoaded && !state.pilotDraftLoading) void loadPilotDraft();
  if (page === 'reviews') loadCurrentRevision(id);
}

function syncNavigation() {
  const isMobile = window.matchMedia('(max-width: 760px)').matches;
  const sidebarNode = $('.sidebar');
  const scrim = $('.mobile-scrim');
  const toggle = $('.menu-toggle');
  if (sidebarNode) {
    sidebarNode.inert = isMobile && !state.menuOpen;
    sidebarNode.classList.toggle('open',state.menuOpen);
  }
  if (scrim) {
    scrim.classList.toggle('open',state.menuOpen);
    scrim.setAttribute('tabindex',isMobile && state.menuOpen ? '0' : '-1');
  }
  if (toggle) {
    toggle.setAttribute('aria-expanded',String(state.menuOpen));
    toggle.setAttribute('aria-label',`${state.menuOpen ? 'Close' : 'Open'} navigation`);
  }
}

window.matchMedia('(max-width: 760px)').addEventListener('change', syncNavigation);

async function mutate(path, method, body, message, form, destination) {
  if (state.busy) return;
  state.busy = true;
  const error = form ? $('.form-error', form) : null;
  if (error) error.textContent = '';
  const controls = form ? [...form.querySelectorAll('button,input,select,textarea')] : [];
  controls.forEach(control => control.disabled = true);
  try {
    const result = await api(path,{method,body});
    await loadWorkspace();
    if (destination) {
      const target = typeof destination === 'function' ? destination(result) : destination;
      if (location.hash !== target) location.hash = target;
      else render();
    } else render();
    toast(message);
  } catch (reason) {
    if (error) { error.textContent = reason.message; error.scrollIntoView({block:'nearest'}); }
    else toast(reason.message);
    controls.forEach(control => control.disabled = false);
  } finally { state.busy = false; }
}

document.addEventListener('submit', event => {
  const form = event.target;
  if (!(form instanceof HTMLFormElement)) return;
  event.preventDefault();
  const fields = new FormData(form);
  const id = form.dataset.id;
  if (form.id === 'client-create') {
    const name = String(fields.get('name') || '').trim();
    const domain = String(fields.get('domain') || '').trim();
    if (!name || !domain) { $('.form-error',form).textContent = 'Enter a client name and domain.'; return; }
    mutate('/api/clients','POST',{name,domain,notes:String(fields.get('notes') || '').trim()},'Client created. No measurements have been added.',form,result => {
      const createdId = result.client?.id || result.id || state.clients.find(client => client.name === name && !client.sample)?.id;
      return createdId ? `#/clients/${createdId}` : '#/clients';
    });
  } else if (form.id === 'client-update') {
    mutate(`/api/clients/${encodeURIComponent(id)}`,'PATCH',{status:fields.get('status'),stage:Number(fields.get('stage')),notes:String(fields.get('notes') || '').trim()},'Engagement changes saved.',form);
  } else if (form.id === 'review-decision') {
    const note = String(fields.get('note') || '').trim();
    const decision = event.submitter?.value;
    if (note.length < 3) { $('.form-error',form).textContent = 'Add a decision note with at least 3 characters.'; return; }
    if (!['approved','returned'].includes(decision)) return;
    const confirmation = form.dataset.revisionId ? {revisionId:form.dataset.revisionId,snapshotSha256:form.dataset.snapshotHash} : {};
    mutate(`/api/reviews/${encodeURIComponent(id)}/decision`,'POST',{decision,note,...confirmation},decision === 'approved' ? (form.dataset.revisionId ? 'Local draft accepted. Client release remains unavailable.' : 'Approval and note saved locally.') : 'Review returned with your note.',form);
  } else if (form.id === 'report-prepare') {
    mutate(`/api/clients/${encodeURIComponent(id)}/report-revisions`,'POST',{sourceSha256:form.dataset.sourceSha},'Retained draft opened for local review.',form,result => `#/reviews/${result.revision.reviewId}`);
  } else if (form.id === 'panel-create') {
    const prompts = String(fields.get('prompts') || '').split(/\r?\n/).map(prompt => prompt.trim()).filter(Boolean);
    const note = String(fields.get('note') || '').trim();
    if (!prompts.length || note.length < 3) { $('.form-error',form).textContent = 'Add at least one question and a version note.'; return; }
    if (prompts.length > 50 || prompts.some(prompt => prompt.length > 500)) { $('.form-error',form).textContent = 'Use up to 50 questions, with no more than 500 characters per question.'; return; }
    mutate(`/api/clients/${encodeURIComponent(id)}/panels`,'POST',{prompts,note},'New panel version saved. Existing versions are unchanged.',form);
  }
});

document.addEventListener('input', event => {
  if (event.target.id !== 'client-search') return;
  state.search = event.target.value;
  const filtered = state.clients.filter(client => `${client.name} ${client.domain}`.toLowerCase().includes(state.search.toLowerCase()));
  $('#client-rows').innerHTML = clientRows(filtered) || '<tr><td colspan="6" class="muted">No clients match this search.</td></tr>';
  $('#client-count').textContent = `${filtered.length} ${filtered.length === 1 ? 'CLIENT' : 'CLIENTS'}`;
});

document.addEventListener('click', async event => {
  if (event.target.closest('.skip-link')) {
    event.preventDefault();
    $('#main')?.focus({preventScroll:true});
    $('#main')?.scrollIntoView({block:'start'});
    return;
  }
  const navLink = event.target.closest('.sidebar a[href^="#/"]');
  if (navLink && state.menuOpen) {
    state.menuOpen = false;
    syncNavigation();
    if (navLink.getAttribute('href') === location.hash) $('#main')?.focus({preventScroll:true});
  }
  const control = event.target.closest('[data-action]');
  if (!control) return;
  const action = control.dataset.action;
  if (action === 'toggle-menu' || action === 'close-menu') {
    state.menuOpen = action === 'close-menu' ? false : !state.menuOpen;
    syncNavigation();
    if (state.menuOpen) $('.sidebar a')?.focus();
    else $('.menu-toggle')?.focus();
  } else if (action === 'refresh') {
    control.disabled = true;
    try { await loadWorkspace(); render(); if (route().page === 'pilot-panel') await loadPilotDraft(); toast('Workspace refreshed.'); } catch (reason) { toast(reason.message); control.disabled = false; }
  } else if (action === 'retry-revision') {
    await loadRevision(control.dataset.id);
  } else if (action === 'refresh-pilot') {
    await loadPilotDraft();
    $('[data-action="refresh-pilot"]')?.focus({preventScroll:true});
  } else if (action === 'filter-leads') {
    state.leadFilter = control.dataset.filter;
    render();
    $(`[data-filter="${state.leadFilter}"]`)?.focus();
  } else if (action === 'lead-status') {
    control.disabled = true;
    await mutate(`/api/leads/${encodeURIComponent(control.dataset.id)}`,'PATCH',{status:control.dataset.status},'Request status saved.');
    if (control.isConnected) control.disabled = false;
  } else if (action === 'print') window.print();
});

document.addEventListener('keydown', event => {
  if (event.key === 'Tab' && state.menuOpen && window.matchMedia('(max-width: 760px)').matches) {
    const links = [...document.querySelectorAll('.sidebar a[href],.sidebar button:not([disabled])')];
    const first = links[0];
    const last = links[links.length-1];
    if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last?.focus(); }
    else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first?.focus(); }
  }
  if (event.key === 'Escape' && state.menuOpen) {
    state.menuOpen = false;
    syncNavigation();
    $('.menu-toggle')?.focus();
  }
});

window.addEventListener('hashchange', () => {
  state.menuOpen = false;
  render();
  window.scrollTo(0,0);
  $('#main')?.focus({preventScroll:true});
});

async function start() {
  try {
    const session = await api('/api/session');
    state.csrf = session.csrf_token;
    await loadWorkspace();
    render();
  } catch (reason) {
    $('#app').innerHTML = `<main id="main" class="boot"><span class="wordmark">MindLever<span>X.</span></span><div class="panel" style="max-width:540px;text-align:left"><h1 style="font-size:30px">The workspace could not open.</h1><p class="muted">${e(reason.message)}</p><p class="field-help">Start the local application server, then try again.</p><button class="button primary" id="retry-start">Try again</button> ${button('Public website','/')}</div></main>`;
    $('#retry-start').addEventListener('click',start);
  }
}

start();
