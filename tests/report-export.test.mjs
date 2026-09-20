import test from 'node:test';
import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { once } from 'node:events';
import { mkdtemp, readFile, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { spawnSync } from 'node:child_process';
import vm from 'node:vm';
import { createApp } from '../server/app.mjs';
import { savedResults } from '../server/saved-results.mjs';
import { createReportExport, verifyReportExport, REPORT_EXPORT_LIMITS, REPORT_SCOPE_BOUNDARY, LOCAL_REVIEW_LIMITATION } from '../server/report-export.mjs';

const sha = bytes => createHash('sha256').update(bytes).digest('hex');
const encode = value => Buffer.from(JSON.stringify(value));
const entry = bytes => ({ encoding:'base64', bytes:bytes.length, sha256:sha(bytes), data:bytes.toString('base64') });
const decode = value => Buffer.from(value.data,'base64');
const parsed = value => JSON.parse(decode(value));
// Fixed independent expected finding: exactly the first of these two distinct answers mentions the brand.
const answers = [
  { engine:'chatgpt',prompt:'Which service should I consider?',response_id:'A',timestamp:'2026-09-19T12:00:00Z',response_text:'MiNdLeVeRx. <script>do not execute</script>' },
  { engine:'copilot',prompt:'Which service should I consider?',response_id:'B',timestamp:'2026-09-19T12:00:00Z',response_text:'Another service.' },
];
const sourceBytes = Buffer.from('\ufeff' + JSON.stringify(answers,null,2) + '\n');
// Synthetic framing isolates export integrity tests; the coordinator checks a retained real PDF separately.
const pdfBytes = Buffer.from('%PDF-1.4\nsynthetic export fixture\n%%EOF\n');
function processingIdentity(snapshot) {
  return sha(encode({schemaVersion:snapshot.schemaVersion,reportSchemaVersion:snapshot.reportSchemaVersion,method:snapshot.method,rendererVersion:snapshot.rendererVersion,brand:snapshot.brand,clientName:snapshot.clientName,domain:snapshot.domain}));
}
function fixture(method = 'answer-text-literal-substring-lowercase-v1') {
  const reportBytes = encode(savedResults(sourceBytes,'MindLeverX',{method}));
  const snapshot = {
    id:'revision-A',clientId:'client-A',version:1,reviewId:'review-A',preparedAt:'2026-09-19T12:30:00.000Z',scope:'internal_saved_sample',
    subject:{clientName:'Synthetic client',domain:'example.test',brand:'MindLeverX'},
    schemaVersion:'mlx-report-revision-v1',reportSchemaVersion:'mlx-saved-results-v1',method,rendererVersion:'mlx-saved-results-pdf-v2',
    brand:'MindLeverX',clientName:'Synthetic client',domain:'example.test',processingIdentity:'',scopeBoundary:REPORT_SCOPE_BOUNDARY,collectionQualification:'required',clientRelease:'unavailable',
    source:{sha256:sha(sourceBytes),bytes:sourceBytes.length},report:{sha256:sha(reportBytes),bytes:reportBytes.length},pdf:{sha256:sha(pdfBytes),bytes:pdfBytes.length},
  };
  snapshot.processingIdentity=processingIdentity(snapshot);
  // Deliberate formatting proves the manifest is retained as bytes, not reserialized for export.
  const snapshotBytes=Buffer.from(JSON.stringify(snapshot,null,2)+'\n');
  const review={id:snapshot.reviewId,clientId:snapshot.clientId,revisionId:snapshot.id,status:'pending',note:null,createdAt:snapshot.preparedAt,decidedAt:null,limitation:LOCAL_REVIEW_LIMITATION};
  const bytes=createReportExport({snapshotBytes,sourceBytes,reportBytes,pdfBytes,review,exportedAt:'2026-09-19T12:31:00.000Z'});
  return {bytes,envelope:JSON.parse(bytes),snapshot,snapshotBytes,reportBytes,review};
}
function changeSnapshot(envelope, change) { const value=parsed(envelope.entries.snapshot);change(value);envelope.entries.snapshot=entry(encode(value)); }
function changeReview(envelope, change) { const value=parsed(envelope.entries.review);change(value);envelope.entries.review=entry(encode(value)); }
function replaceArtifact(envelope, kind, bytes) {
  envelope.entries[kind]=entry(bytes);
  changeSnapshot(envelope,snapshot=>{snapshot[kind]={sha256:sha(bytes),bytes:bytes.length};});
}
function verify(envelope, options) { return verifyReportExport(encode(envelope),options); }

test('both pinned methods reproduce while new method gets a different processing identity', () => {
  const legacy=fixture(), current=fixture('answer-text-literal-substring-lowercase-v2');
  assert.equal(verifyReportExport(legacy.bytes).status,'PASS');
  assert.equal(verifyReportExport(current.bytes).status,'PASS');
  assert.deepEqual(parsed(legacy.envelope.entries.report).aggregate,parsed(current.envelope.entries.report).aggregate);
  assert.notEqual(legacy.snapshot.processingIdentity,current.snapshot.processingIdentity);
  assert.notEqual(legacy.snapshot.report.sha256,current.snapshot.report.sha256);
  const mismatched=structuredClone(current.envelope);
  replaceArtifact(mismatched,'report',legacy.reportBytes);
  assert.equal(verify(mismatched).code,'report_link_mismatch');
});

test('portable export retains exact BOM source, formatted manifest, result and PDF with a fixed 1/2 oracle', () => {
  const f=fixture();
  for (const [kind,bytes] of Object.entries({snapshot:f.snapshotBytes,source:sourceBytes,report:f.reportBytes,pdf:pdfBytes})) {
    assert.deepEqual(decode(f.envelope.entries[kind]),bytes);
    assert.equal(f.envelope.entries[kind].sha256,sha(bytes));
    assert.equal(f.envelope.entries[kind].bytes,bytes.length);
  }
  const result=verifyReportExport(f.bytes,{expectedSnapshotSha256:sha(f.snapshotBytes)});
  assert.equal(result.status,'PASS');
  assert.deepEqual(result.aggregate,{numerator:1,denominator:2});
  assert.deepEqual(parsed(f.envelope.entries.report).answers.map(row=>row.answer),answers.map(row=>row.response_text));
  assert.equal(result.anchor.status,'matched');
  assert.equal(result.review.status,'pending');
  assert.equal(result.boundaries.collectionQualification,'required');
  assert.equal(result.boundaries.clientRelease,'unavailable');
  assert.match(result.boundaries.pdf,/not independently verified/);
  assert.ok(!JSON.stringify(result).includes('<script>'));
});

test('anchor is immutable content only: a valid changed review and export time remain unauthenticated', () => {
  const f=fixture(), anchor=sha(f.snapshotBytes);
  assert.equal(verify(f.envelope).anchor.status,'not_supplied');
  assert.match(verify(f.envelope).boundaries.origin,/Not authenticated/);
  assert.equal(verify(f.envelope,{expectedSnapshotSha256:'a'.repeat(64)}).code,'expected_snapshot_mismatch');
  for (const status of ['approved','returned']) {
    changeReview(f.envelope,review=>{review.status=status;review.note='Changed local note.';review.decidedAt='2026-09-19T12:40:00.000Z';});
    f.envelope.exportedAt='2026-09-19T12:41:00.000Z';
    const result=verify(f.envelope,{expectedSnapshotSha256:anchor});
    assert.equal(result.status,'PASS');assert.equal(result.review.status,status);
    assert.equal(result.snapshotSha256,anchor);
    assert.match(result.boundaries.review,/not authenticated or anchored/);
    assert.equal(result.boundaries.clientRelease,'unavailable');
  }
  assert.equal(verifyReportExport(f.bytes,{expectedSnapshotSha256:anchor}).review.status,'pending');
});

test('every byte entry rejects corruption, missing/extra entries and malformed JSON/UTF-8', () => {
  for (const kind of ['snapshot','source','report','pdf','review']) {
    const f=fixture();const bytes=decode(f.envelope.entries[kind]);bytes[0]^=1;
    f.envelope.entries[kind].data=bytes.toString('base64');
    assert.equal(verify(f.envelope).code,'artifact_hash_mismatch',kind);
    delete f.envelope.entries[kind];assert.equal(verify(f.envelope).status,'FAIL',kind);
  }
  for (const kind of ['snapshot','report','review']) for (const bytes of [Buffer.from('{'),Buffer.from([0xff])]) {
    const f=fixture();f.envelope.entries[kind]=entry(bytes);assert.equal(verify(f.envelope).code,'invalid_json_or_utf8');
  }
  for (const bytes of [Buffer.from('{'),Buffer.from([0xff]),Buffer.from('[]')]) assert.equal(verifyReportExport(bytes).status,'FAIL');
  const f=fixture();replaceArtifact(f.envelope,'source',Buffer.from([0xff]));assert.equal(verify(f.envelope).code,'report_reproduction_mismatch');
  replaceArtifact(f.envelope,'pdf',Buffer.from('not a PDF'));assert.equal(verify(f.envelope).status,'FAIL');
});

test('strict structure, canonical Base64 and all allocation limits fail safely', () => {
  const mutations=[
    x=>{x.unexpected='secret';},x=>{x.entries.unrelated=entry(Buffer.from('secret'));},x=>{x.entries.source.path='/private/source';},
    x=>{x.entries.source.encoding='base64url';},x=>{x.entries.source.bytes=-1;},x=>{x.entries.source.bytes=1.5;},x=>{x.entries.source.bytes=Number.MAX_SAFE_INTEGER+1;},
    x=>{x.entries.source.sha256='wrong';},x=>{x.entries.source.data+='\n';},x=>{x.entries.source.data='_'+x.entries.source.data.slice(1);},
    x=>{x.entries.source={...entry(Buffer.from([0xff])),data:'/x=='};}, // Nonzero unused padding bits decode as /w== in permissive Buffer.
    x=>{x.entries.source={...entry(Buffer.from([0xff])),data:'/w'};},x=>{x.exportedAt='arbitrary raw secret';},
    x=>changeSnapshot(x,s=>{s.extra='x';}),x=>changeSnapshot(x,s=>{s.subject.extra='x';}),x=>changeReview(x,r=>{r.extra='x';}),
  ];
  for (const mutate of mutations) { const f=fixture();mutate(f.envelope);const result=verify(f.envelope);assert.equal(result.status,'FAIL');assert.ok(!JSON.stringify(result).includes('/private/source')); }
  for (const kind of ['snapshot','source','report','pdf','review']) {
    const f=fixture();f.envelope.entries[kind].bytes=REPORT_EXPORT_LIMITS[kind]+1;
    assert.equal(verify(f.envelope).code,'invalid_entry_size_or_encoding');
  }
  assert.equal(verifyReportExport(Buffer.alloc(REPORT_EXPORT_LIMITS.envelope+1)).code,'invalid_export_size');
  assert.equal(verifyReportExport('not bytes').code,'input_bytes_required');
  assert.equal(verifyReportExport(fixture().bytes,{expectedSnapshotSha256:'bad'}).code,'invalid_expected_fingerprint');
});

test('manifest, review, scope and processing links are enforced; self-consistent false reports do not pass', () => {
  const mutations=[
    x=>changeSnapshot(x,s=>{s.processingIdentity='0'.repeat(64);}),
    x=>changeSnapshot(x,s=>{s.subject.brand='Another brand';}),
    x=>changeSnapshot(x,s=>{s.source.sha256='0'.repeat(64);}),
    x=>changeSnapshot(x,s=>{s.clientRelease='released';}),
    x=>changeSnapshot(x,s=>{s.collectionQualification='qualified';}),
    x=>changeSnapshot(x,s=>{s.scope='customer_report';}),
    x=>changeSnapshot(x,s=>{s.scopeBoundary='Approved.';}),
    x=>changeSnapshot(x,s=>{s.domain='file:///private/secret';s.subject.domain=s.domain;s.processingIdentity=processingIdentity(s);}),
    x=>changeReview(x,r=>{r.clientId='other-client';}),x=>changeReview(x,r=>{r.revisionId='other-revision';}),x=>changeReview(x,r=>{r.id='other-review';}),
    x=>changeReview(x,r=>{r.createdAt='2026-09-18T12:30:00.000Z';}),x=>changeReview(x,r=>{r.status='released';}),
    x=>changeReview(x,r=>{r.status='approved';r.note='';r.decidedAt='2026-09-19T12:40:00.000Z';}),
    x=>changeReview(x,r=>{r.note='unrecorded decision';}),x=>changeReview(x,r=>{r.limitation='Authenticated owner.';}),
  ];
  for (const mutate of mutations) { const f=fixture();mutate(f.envelope);assert.equal(verify(f.envelope).status,'FAIL'); }
  for (const change of [r=>{r.aggregate.numerator=2;},r=>{r.answers[1].answer='MindLeverX';r.answers[1].literalMention=true;},r=>{r.limitations=[];}]) {
    const f=fixture();const report=parsed(f.envelope.entries.report);change(report);
    replaceArtifact(f.envelope,'report',encode(report));
    assert.equal(verify(f.envelope).code,'report_reproduction_mismatch');
  }
  const f=fixture();replaceArtifact(f.envelope,'pdf',Buffer.from('invalid PDF bytes'));
  assert.equal(verify(f.envelope).code,'invalid_pdf_framing');
});

test('unknown pinned versions are unsupported, while retained renderer v1 and v2 are compatible', () => {
  for (const field of ['schemaVersion','reportSchemaVersion','method','rendererVersion']) {
    const f=fixture();changeSnapshot(f.envelope,s=>{s[field]='future-v999';s.processingIdentity=processingIdentity(s);});
    assert.equal(verify(f.envelope).status,'UNSUPPORTED',field);
  }
  const unknown=fixture();unknown.envelope.schemaVersion='mlx-report-export-v999';assert.equal(verify(unknown.envelope).status,'UNSUPPORTED');
  for (const field of ['schemaVersion','method']) {
    const f=fixture();const report=parsed(f.envelope.entries.report);report[field]='future-v999';replaceArtifact(f.envelope,'report',encode(report));
    assert.equal(verify(f.envelope).status,'UNSUPPORTED');
  }
  for (const rendererVersion of ['mlx-saved-results-pdf-v1','mlx-saved-results-pdf-v2']) {
    const f=fixture();changeSnapshot(f.envelope,s=>{s.rendererVersion=rendererVersion;s.processingIdentity=processingIdentity(s);});
    assert.equal(verify(f.envelope).status,'PASS');
  }
});

async function application(t) {
  const directory=await mkdtemp(join(tmpdir(),'mlx-report-export-'));
  const sourcePath=join(directory,'private-source.json');await writeFile(sourcePath,sourceBytes);
  let renders=0, closed=false;
  const app=createApp({dbPath:join(directory,'workspace.sqlite'),evidenceInputPath:sourcePath,evidenceSubjectDomain:'example.test',seed:true,reportPdfRenderer:async()=>{renders++;return pdfBytes;}});
  app.server.listen(0,'127.0.0.1');await once(app.server,'listening');
  const base=`http://127.0.0.1:${app.server.address().port}`;
  const session=await fetch(`${base}/api/session`);const cookie=session.headers.getSetCookie()[0].split(';')[0];const csrf=(await session.json()).csrf_token;
  async function request(route,{method='GET',body,session=true,headers={}}={}) {
    const response=await fetch(`${base}${route}`,{method,headers:{...(session?{Cookie:cookie}:{}),'X-CSRF-Token':csrf,...(body?{'Content-Type':'application/json'}:{}),...headers},...(body?{body:JSON.stringify(body)}:{})});
    const bytes=Buffer.from(await response.arrayBuffer());return {status:response.status,headers:response.headers,bytes,data:JSON.parse(bytes)};
  }
  const client=(await request('/api/clients',{method:'POST',body:{name:'Selected synthetic client',domain:'example.test'}})).data.client;
  const prepared=(await request(`/api/clients/${client.id}/report-revisions`,{method:'POST',body:{sourceSha256:sha(sourceBytes)}})).data;
  const route=`/api/report-revisions/${prepared.revision.id}/export.json`;
  async function close() {if(!closed){await app.close();closed=true;}}
  t.after(async()=>{await close();await rm(directory,{recursive:true,force:true});});
  return {app,directory,sourcePath,request,client,prepared,route,close,renders:()=>renders};
}

test('API exports only selected retained revision and allowlisted local review, with no source read or extra render', async t => {
  const f=await application(t);const before=(await f.request('/api/workspace')).data;
  const result=await f.request(f.route);assert.equal(result.status,200);
  assert.equal(result.headers.get('cache-control'),'no-store');
  assert.match(result.headers.get('content-disposition'),new RegExp(`attachment; filename="mindleverx-${f.prepared.revision.id}-private-export.json"`));
  const row=f.app.db.prepare('SELECT * FROM report_revisions WHERE id=?').get(f.prepared.revision.id);
  for (const [kind,original] of Object.entries({snapshot:Buffer.from(row.snapshot_json),source:Buffer.from(row.source_bytes),report:Buffer.from(row.report_bytes),pdf:Buffer.from(row.pdf_bytes)})) assert.deepEqual(decode(result.data.entries[kind]),original);
  const review=parsed(result.data.entries.review);
  assert.deepEqual(Object.keys(review),['id','clientId','revisionId','status','note','createdAt','decidedAt','limitation']);
  assert.equal(review.status,'pending');assert.equal(review.clientId,f.client.id);
  const allDecoded=Object.values(result.data.entries).map(value=>decode(value).toString('utf8')).join('\n');
  for (const secret of [f.directory,'northwind','mlx_session','csrf_token','signingKey']) assert.ok(!allDecoded.includes(secret));
  assert.deepEqual((await f.request('/api/workspace')).data,before);
  await rm(f.sourcePath);assert.equal((await f.request(f.route)).status,200);assert.equal(f.renders(),1);
  const pendingFile=join(f.directory,'pending.json');await writeFile(pendingFile,result.bytes);
  assert.equal((await f.request(`/api/reviews/${f.prepared.review.id}/decision`,{method:'POST',body:{decision:'approved',note:'Synthetic local note only.',revisionId:f.prepared.revision.id,snapshotSha256:f.prepared.revision.snapshotSha256}})).status,200);
  const decided=await f.request(f.route);assert.equal(parsed(decided.data.entries.review).status,'approved');
  assert.equal(parsed(result.data.entries.review).status,'pending');
  for (const kind of ['snapshot','source','report','pdf']) assert.deepEqual(decided.data.entries[kind],result.data.entries[kind]);
  const approvedFile=join(f.directory,'approved.json');await writeFile(approvedFile,decided.bytes);
  await f.close();await rm(join(f.directory,'workspace.sqlite'),{force:true});
  for (const file of [pendingFile,approvedFile]) {
    const run=spawnSync(process.execPath,['scripts/verify-report-export.mjs','--input',file,'--expected-snapshot',f.prepared.revision.snapshotSha256],{cwd:new URL('..',import.meta.url),encoding:'utf8'});
    assert.equal(run.status,0,run.stderr);assert.deepEqual(JSON.parse(run.stdout).aggregate,{numerator:1,denominator:2});
  }
});

test('export endpoint preserves session/origin boundary, rejects writes and safely fails corrupt storage', async t => {
  const f=await application(t);
  assert.equal((await f.request(f.route,{session:false})).status,401);
  assert.equal((await f.request(f.route,{headers:{Origin:'https://foreign.example'}})).status,403);
  assert.equal((await f.request('/api/report-revisions/missing/export.json')).status,404);
  for (const method of ['POST','PATCH','DELETE']) assert.equal((await f.request(f.route,{method,body:{}})).status,404);
  f.app.db.exec('DROP TRIGGER report_revisions_no_update');
  f.app.db.prepare('UPDATE report_revisions SET source_bytes=? WHERE id=?').run(Buffer.from('corrupt secret'),f.prepared.revision.id);
  const response=await f.request(f.route);assert.equal(response.status,503);
  assert.ok(!JSON.stringify(response.data).includes('corrupt secret'));assert.ok(!JSON.stringify(response.data).includes(f.directory));
});

test('CLI returns safe exit codes for supported, corrupt, unsupported, unavailable and malformed arguments', async t => {
  const directory=await mkdtemp(join(tmpdir(),'mlx-export-cli-'));t.after(()=>rm(directory,{recursive:true,force:true}));
  const file=join(directory,'export.json');const f=fixture();await writeFile(file,f.bytes);
  const run=args=>spawnSync(process.execPath,['scripts/verify-report-export.mjs',...args],{cwd:new URL('..',import.meta.url),encoding:'utf8'});
  assert.equal(run(['--input',file]).status,0);
  await writeFile(file,'{private broken payload');const broken=run(['--input',file]);assert.equal(broken.status,1);assert.ok(!broken.stdout.includes('private broken'));
  f.envelope.schemaVersion='future';await writeFile(file,encode(f.envelope));assert.equal(run(['--input',file]).status,2);
  assert.equal(run(['--input',join(directory,'missing-private.json')]).status,2);
  assert.equal(run(['--input',directory]).status,2);
  const fifo=join(directory,'input.fifo');
  assert.equal(spawnSync('mkfifo',[fifo],{encoding:'utf8',timeout:2000}).status,0);
  const pipe=spawnSync(process.execPath,['scripts/verify-report-export.mjs','--input',fifo],{cwd:new URL('..',import.meta.url),encoding:'utf8',timeout:2000});
  assert.equal(pipe.error,undefined);assert.equal(pipe.status,2);assert.equal(JSON.parse(pipe.stdout).code,'input_unavailable');
  for (const args of [[],['--input'],['--output',file],['--input',file,'--input',file],['--input',file,'--expected-snapshot','bad']]) {
    const result=run(args);assert.equal(result.status,1);assert.ok(!result.stdout.includes(directory));
  }
  const help=run(['--help']);assert.equal(help.status,0);assert.match(help.stdout,/does not authenticate review decisions or export time/);assert.match(help.stdout,/unsanitized raw source and local review notes/);
});

test('retained review exposes secondary private export beside PDF with raw-source/notes disclosure', async () => {
  const f=fixture();const detail={revision:{...f.snapshot,snapshotSha256:sha(f.snapshotBytes)},report:parsed(f.envelope.entries.report)};
  const review={...f.review,client_id:f.snapshot.clientId,kind:'report',title:'<script>Untrusted title</script>',revision:detail.revision};
  const context=vm.createContext({document:{addEventListener(){}},window:{addEventListener(){},matchMedia:()=>({addEventListener(){}})},location:{hash:`#/preview/${review.id}`},URL,setTimeout,clearTimeout,input:{detail,review}});
  const script=(await readFile(new URL('../platform/app.js',import.meta.url),'utf8')).replace(/\nstart\(\);\s*$/,'\n');vm.runInContext(script,context);
  const html=vm.runInContext('state.clients=[{id:input.review.client_id,name:"Synthetic client",domain:"example.test"}];state.reviews=[input.review];state.revisionDetails.set(input.detail.revision.id,input.detail);previewPage(input.review.id);',context);
  assert.match(html,/Download retained PDF/);assert.match(html,/Private evidence export/);
  assert.ok(html.includes(`/api/report-revisions/${f.snapshot.id}/export.json`));
  assert.match(html,/unsanitized raw source and local review notes/);assert.match(html,/not prepared for client sharing/);
  assert.ok(!html.includes('<script>'));assert.ok(!html.includes('Readiness'));
});
