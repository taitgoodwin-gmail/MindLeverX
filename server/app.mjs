import { createServer } from 'node:http';
import { randomUUID, randomBytes, createHmac, timingSafeEqual } from 'node:crypto';
import { readFile, stat } from 'node:fs/promises';
import { resolve, extname, sep } from 'node:path';
import { domainToASCII } from 'node:url';
import { openDatabase } from './database.mjs';

class HttpError extends Error {
  constructor(status, message) { super(message); this.status = status; }
}
const fail = (status, message) => { throw new HttpError(status, message); };
const now = () => new Date().toISOString();
const sessionTTL = 12 * 60 * 60 * 1000;
const intakeTTL = 60 * 60 * 1000;
const types = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.css': 'text/css; charset=utf-8', '.svg': 'image/svg+xml', '.png': 'image/png', '.ico': 'image/x-icon', '.txt': 'text/plain; charset=utf-8', '.xml': 'application/xml; charset=utf-8' };

function textValue(value, name, max, required = true) {
  if (typeof value !== 'string') fail(400, `${name} must be text.`);
  const cleaned = value.trim();
  if ((required && !cleaned) || cleaned.length > max) fail(400, `${name} must be ${required ? 'between 1 and ' : 'at most '}${max} characters.`);
  return cleaned;
}
function domainValue(value) {
  const input = textValue(value, 'Domain', 253);
  let parsed;
  try { parsed = new URL(input.includes('://') ? input : `https://${input}`); }
  catch { fail(400, 'Enter a company domain, such as example.com.'); }
  if (!['http:', 'https:'].includes(parsed.protocol) || parsed.username || parsed.password || parsed.port) fail(400, 'Enter a domain without credentials or a port.');
  const host = domainToASCII(parsed.hostname.toLowerCase().replace(/\.$/, ''));
  if (!host || host.length > 253 || !host.includes('.') || /^\d+(\.\d+){3}$/.test(host) || host.split('.').some(x => !/^[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?$/.test(x)) || /\.(local|localhost|internal)$/.test(host)) fail(400, 'Enter a valid company domain, such as example.com.');
  return host;
}
function parseClient(row) { return row && { ...row, sample: Boolean(row.sample) }; }
function parseReview(row) { return row && { ...row, evidence: JSON.parse(row.evidence), sample: Boolean(row.sample) }; }
function parsePanel(row) { return row && { ...row, prompts: JSON.parse(row.prompts), sample: Boolean(row.sample) }; }
async function bodyJSON(req) {
  if (!(req.headers['content-type'] || '').toLowerCase().startsWith('application/json')) fail(415, 'Use application/json.');
  let size = 0;
  const chunks = [];
  for await (const chunk of req) {
    size += chunk.length;
    if (size > 32768) fail(413, 'Request is too large.');
    chunks.push(chunk);
  }
  let body;
  try { body = JSON.parse(Buffer.concat(chunks).toString('utf8')); }
  catch { fail(400, 'Send valid JSON.'); }
  if (!body || Array.isArray(body) || typeof body !== 'object') fail(400, 'Send a JSON object.');
  return body;
}
function equal(a, b) {
  if (typeof a !== 'string' || typeof b !== 'string') return false;
  const aa = Buffer.from(a), bb = Buffer.from(b);
  return aa.length === bb.length && timingSafeEqual(aa, bb);
}

/** Local-only HTTP application. No external engine, email, payment, or publishing calls. */
export function createApp({ dbPath = resolve('data/mindleverx.sqlite'), seed = true, distDir = resolve('dist') } = {}) {
  const db = openDatabase(dbPath, seed);
  const publicDir = resolve(distDir);
  const sessions = new Map();
  const signingKey = randomBytes(32);
  const json = (res, status, value) => {
    res.writeHead(status, { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store' });
    res.end(JSON.stringify(value));
  };
  function audit(action, type, id, detail) {
    db.prepare('INSERT INTO activity (id,action,entity_type,entity_id,actor,detail,created_at) VALUES (?,?,?,?,?,?,?)')
      .run(randomUUID(),action,type,id,'Local operator',detail,now());
  }
  function transaction(fn) {
    db.exec('BEGIN IMMEDIATE');
    try { const result = fn(); db.exec('COMMIT'); return result; }
    catch (error) { db.exec('ROLLBACK'); throw error; }
  }
  function session(req, res, create = false) {
    const id = (req.headers.cookie || '').split(';').map(s => s.trim()).find(s => s.startsWith('mlx_session='))?.slice(12);
    let current = sessions.get(id);
    if (current && Date.now() - current.created > sessionTTL) { sessions.delete(id); current = undefined; }
    if (!current && create) {
      // Bounded memory; expired sessions have no persistent identity or authorization.
      for (const [key, value] of sessions) if (Date.now() - value.created > sessionTTL) sessions.delete(key);
      if (sessions.size >= 1000) sessions.delete(sessions.keys().next().value);
      const nextId = randomBytes(32).toString('hex');
      current = { id: nextId, csrf: randomBytes(32).toString('hex'), created: Date.now(), lastIntake: 0 };
      sessions.set(nextId, current);
      res.setHeader('Set-Cookie', `mlx_session=${nextId}; HttpOnly; SameSite=Strict; Path=/; Max-Age=${sessionTTL / 1000}`);
    }
    return current;
  }
  function checkLocalOrigin(req) {
    const port = server.address()?.port;
    const allowed = new Set([`localhost:${port}`, `127.0.0.1:${port}`, `[::1]:${port}`]);
    if (!allowed.has(req.headers.host?.toLowerCase())) fail(403, 'This workspace is only available on its local address.');
    if (req.headers.origin && req.headers.origin !== `http://${req.headers.host}`) fail(403, 'Cross-origin requests are not allowed.');
    if (req.headers['sec-fetch-site'] === 'cross-site') fail(403, 'Cross-site requests are not allowed.');
  }
  function csrf(req, s) {
    if (!s) fail(401, 'Open the local workspace to start a session.');
    if (!equal(req.headers['x-csrf-token'], s.csrf)) fail(403, 'Your session changed. Reload the page and try again.');
  }
  function token(s, timestamp) { return createHmac('sha256', signingKey).update(`${s.id}:${timestamp}`).digest('hex'); }
  function verifyIntake(s, value, ts) {
    if (!s || typeof value !== 'string') fail(403, 'Reload the page before submitting.');
    const parts = value.split('.');
    const issued = Number(parts[0]);
    if (parts.length !== 2 || !Number.isSafeInteger(issued) || !equal(parts[1], token(s, parts[0])) || issued > Date.now() || Date.now() - issued > intakeTTL) fail(403, 'Your form expired. Reload the page and try again.');
    if (typeof ts !== 'number' || !Number.isFinite(ts) || Date.now() - issued < 2000 || Date.now() - ts < 2000 || Date.now() - ts > intakeTTL) fail(400, 'One moment — try again after the page has loaded.');
  }

  const server = createServer(async (req, res) => {
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
    res.setHeader('X-Frame-Options', 'DENY');
    res.setHeader('Content-Security-Policy', "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; img-src 'self' data:; connect-src 'self'; base-uri 'self'; form-action 'self'; frame-ancestors 'none'");
    try {
      checkLocalOrigin(req);
      const url = new URL(req.url, `http://${req.headers.host}`);
      const path = decodeURIComponent(url.pathname);
      const method = req.method;
      if (path === '/runtime.js' && method === 'GET') {
        const s = session(req,res,true), issued = String(Date.now());
        res.writeHead(200, { 'Content-Type': types['.js'], 'Cache-Control': 'no-store' });
        res.end(`window.MLX_AUDIT_ENDPOINT = "/api/intake";\nwindow.MLX_LOCAL_PREVIEW = true;\nwindow.MLX_INTAKE_TOKEN = ${JSON.stringify(`${issued}.${token(s, issued)}`)};\n`);
        return;
      }
      if (path === '/api/health' && method === 'GET') return json(res,200,{ok:true,mode:'local',engine_connected:false,email_connected:false});
      if (path === '/api/session' && method === 'GET') {
        const s = session(req,res,true);
        return json(res,200,{csrf_token:s.csrf,mode:'local'});
      }
      if (path === '/api/intake' && method === 'POST') {
        const body = await bodyJSON(req), s = session(req,res);
        verifyIntake(s,body._token,body.ts);
        if (body.website !== '') fail(400, 'Invalid submission.');
        if (body.consent !== true) fail(400, 'Please confirm consent to store this request.');
        const email = textValue(body.email,'Email',254).toLowerCase();
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) fail(400, 'Enter a valid email address.');
        const kind = body.kind || 'audit';
        if (!['audit','subscription'].includes(kind)) fail(400, 'Choose an audit or subscription request.');
        const freeMail = ['gmail.com','googlemail.com','outlook.com','hotmail.com','live.com','yahoo.com','icloud.com','me.com','proton.me','protonmail.com','aol.com'];
        const emailDomain = email.split('@')[1];
        if (kind === 'audit' && freeMail.includes(emailDomain) && (!body.domain || freeMail.includes(String(body.domain).toLowerCase()))) fail(400, 'Add your company domain so we know what to review.');
        const domain = domainValue(body.domain || emailDomain);
        const source = textValue(body.source,'Source',200);
        const cutoff = new Date(Date.now() - 60000).toISOString();
        const duplicate = db.prepare('SELECT id FROM leads WHERE email=? AND kind=? AND created_at>? LIMIT 1').get(email,kind,cutoff);
        if (Date.now() - s.lastIntake < 60000 || duplicate) {
          res.setHeader('Retry-After','60');
          fail(429, 'Please wait a minute before sending another request.');
        }
        const id = randomUUID();
        transaction(() => {
          db.prepare('INSERT INTO leads (id,email,domain,source,kind,consent,created_at) VALUES (?,?,?,?,?,1,?)').run(id,email,domain,source,kind,now());
          audit('Request received','lead',id,`${kind === 'audit' ? 'Audit' : 'Subscription'} request saved locally for ${domain}. No email was sent.`);
        });
        s.lastIntake = Date.now();
        return json(res,202,{ok:true,lead_id:id});
      }
      if (path.startsWith('/api/')) {
        const s = session(req,res);
        if (!s) fail(401, 'Open the local workspace to start a session.');
        if (!['GET','HEAD'].includes(method)) csrf(req,s);
        if (path === '/api/workspace' && method === 'GET') {
          return json(res,200,{
            clients:db.prepare('SELECT * FROM clients ORDER BY sample DESC, created_at DESC, name').all().map(parseClient),
            reviews:db.prepare('SELECT * FROM reviews ORDER BY created_at DESC, id').all().map(parseReview),
            panels:db.prepare('SELECT * FROM panels ORDER BY version DESC, created_at DESC').all().map(parsePanel),
            leads:db.prepare('SELECT id,email,domain,source,kind,status,created_at,sample FROM leads ORDER BY created_at DESC').all().map(row=>({...row,sample:Boolean(row.sample)})),
            activity:db.prepare('SELECT * FROM activity ORDER BY created_at DESC, rowid DESC LIMIT 500').all(),
          });
        }
        if (path === '/api/clients' && method === 'POST') {
          const body = await bodyJSON(req);
          const name = textValue(body.name,'Client name',100), domain = domainValue(body.domain);
          const notes = body.notes === undefined ? '' : textValue(body.notes,'Notes',5000,false);
          if (db.prepare('SELECT id FROM clients WHERE domain=?').get(domain)) fail(409,'A client with this domain already exists.');
          const id = randomUUID();
          transaction(() => {
            db.prepare('INSERT INTO clients (id,name,domain,status,stage,notes,sample,created_at) VALUES (?,?,?,\'active\',1,?,0,?)').run(id,name,domain,notes,now());
            audit('Client created','client',id,`${name} added. Measurement has not started.`);
          });
          return json(res,201,{ok:true,client:parseClient(db.prepare('SELECT * FROM clients WHERE id=?').get(id))});
        }
        let match = path.match(/^\/api\/clients\/([^/]+)$/);
        if (match && method === 'PATCH') {
          const id = match[1], existing = db.prepare('SELECT * FROM clients WHERE id=?').get(id);
          if (!existing) fail(404,'Client not found.');
          const body = await bodyJSON(req);
          if (!Object.keys(body).length || Object.keys(body).some(key=>!['status','stage','notes'].includes(key))) fail(400,'Update status, stage, or notes.');
          const status = body.status ?? existing.status, stage = body.stage ?? existing.stage;
          if (!['active','paused'].includes(status)) fail(400,'Status must be active or paused.');
          if (!Number.isInteger(stage) || stage < 1 || stage > 7) fail(400,'Stage must be between 1 and 7.');
          const notes = body.notes === undefined ? existing.notes : textValue(body.notes,'Notes',5000,false);
          transaction(() => {
            db.prepare('UPDATE clients SET status=?,stage=?,notes=? WHERE id=?').run(status,stage,notes,id);
            const changed = [];
            if (status !== existing.status) changed.push(`status ${existing.status} → ${status}`);
            if (stage !== existing.stage) changed.push(`stage ${existing.stage} → ${stage}`);
            if (notes !== existing.notes) changed.push('notes updated');
            audit('Client updated','client',id,`${existing.name}: ${changed.join('; ') || 'details saved'}.`);
          });
          return json(res,200,{ok:true,client:parseClient(db.prepare('SELECT * FROM clients WHERE id=?').get(id))});
        }
        match = path.match(/^\/api\/reviews\/([^/]+)\/decision$/);
        if (match && method === 'POST') {
          const id = match[1], body = await bodyJSON(req);
          if (!['approved','returned'].includes(body.decision)) fail(400,'Choose approved or returned.');
          const note = textValue(body.note,'Review note',3000);
          transaction(() => {
            const review = db.prepare('SELECT * FROM reviews WHERE id=?').get(id);
            if (!review) fail(404,'Review not found.');
            if (review.status !== 'pending') fail(409,'A decision has already been recorded for this review.');
            db.prepare('UPDATE reviews SET status=?,note=?,decided_at=? WHERE id=?').run(body.decision,note,now(),id);
            audit(`Review ${body.decision}`,'review',id,`${review.title} ${note} Local decision only; nothing was sent or published.`);
          });
          return json(res,200,{ok:true,review:parseReview(db.prepare('SELECT * FROM reviews WHERE id=?').get(id))});
        }
        match = path.match(/^\/api\/leads\/([^/]+)$/);
        if (match && method === 'PATCH') {
          const id = match[1], body = await bodyJSON(req);
          if (!['new','reviewed','archived'].includes(body.status)) fail(400,'Choose new, reviewed, or archived.');
          const lead = db.prepare('SELECT * FROM leads WHERE id=?').get(id);
          if (!lead) fail(404,'Request not found.');
          transaction(() => {
            db.prepare('UPDATE leads SET status=? WHERE id=?').run(body.status,id);
            audit('Request updated','lead',id,`${lead.domain}: ${lead.status} → ${body.status}.`);
          });
          return json(res,200,{ok:true,lead:{...db.prepare('SELECT * FROM leads WHERE id=?').get(id),sample:false}});
        }
        match = path.match(/^\/api\/clients\/([^/]+)\/panels$/);
        if (match && method === 'POST') {
          const clientId = match[1], client = db.prepare('SELECT * FROM clients WHERE id=?').get(clientId);
          if (!client) fail(404,'Client not found.');
          const body = await bodyJSON(req), note = textValue(body.note,'Version note',1500);
          if (!Array.isArray(body.prompts) || body.prompts.length < 1 || body.prompts.length > 50) fail(400,'A panel needs between 1 and 50 questions.');
          const prompts = body.prompts.map(p=>textValue(p,'Question',500));
          if (new Set(prompts.map(p=>p.toLowerCase())).size !== prompts.length) fail(400,'Each question must be unique.');
          const id = randomUUID();
          transaction(() => {
            const {version} = db.prepare('SELECT COALESCE(MAX(version),0)+1 AS version FROM panels WHERE client_id=?').get(clientId);
            db.prepare('INSERT INTO panels (id,client_id,version,prompts,note,sample,created_at) VALUES (?,?,?,?,?,?,?)').run(id,clientId,version,JSON.stringify(prompts),note,client.sample,now());
            audit('Panel version created','panel',id,`${client.name} · v${version} · ${prompts.length} questions. ${note} Earlier versions remain unchanged. No measurement run was scheduled.`);
          });
          return json(res,201,{ok:true,panel:parsePanel(db.prepare('SELECT * FROM panels WHERE id=?').get(id))});
        }
        fail(404,'API route not found.');
      }
      if (!['GET','HEAD'].includes(method)) fail(405,'Method not allowed.');
      if (path === '/app') {
        res.writeHead(302,{Location:'/app/'}); res.end(); return;
      }
      const relative = path.endsWith('/') ? `${path}index.html` : path;
      let file = resolve(publicDir,`.${relative}`);
      if (!file.startsWith(publicDir + sep) || path.includes('\0') || path.split('/').some(part=>part.startsWith('.'))) fail(404,'Page not found.');
      let info;
      try { info = await stat(file); } catch { fail(404,'Page not found.'); }
      if (!info.isFile()) fail(404,'Page not found.');
      res.writeHead(200,{'Content-Type':types[extname(file)] || 'application/octet-stream','Cache-Control':'no-cache'});
      res.end(method === 'HEAD' ? undefined : await readFile(file));
    } catch (error) {
      if (res.headersSent) { res.end(); return; }
      const status = error instanceof URIError ? 400 : error.status || 500;
      if (status === 500) console.error('Local request failed:', error.message);
      json(res,status,{ok:false,error:status === 500 ? 'The request could not be saved. Please try again.' : error.message});
    }
  });
  let closed = false;
  async function close() {
    if (closed) return;
    closed = true;
    if (server.listening) await new Promise((accept,reject)=>server.close(error=>error ? reject(error) : accept()));
    db.close();
  }
  return {server,db,close};
}
