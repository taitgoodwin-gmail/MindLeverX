import { createHash, randomUUID } from 'node:crypto';

const emailPattern = /^[A-Za-z0-9.!#$%&'*+/=?^_`{|}~-]+@[A-Za-z0-9](?:[A-Za-z0-9.-]*[A-Za-z0-9])?\.[A-Za-z]{2,63}$/;
const isEmail = value => typeof value === 'string' && value.length <= 254 && emailPattern.test(value);
const fields = ['name', 'email', 'website', 'message', 'fax'];
const origins = new Set(['https://mindleverx.com', 'https://www.mindleverx.com']);

export function mailConfigured(env) {
  return ['MLX_GOOGLE_CLIENT_ID', 'MLX_GOOGLE_CLIENT_SECRET', 'MLX_GOOGLE_REFRESH_TOKEN'].every(key => Boolean(env[key])) &&
    isEmail(env.MLX_ENQUIRY_TO) && isEmail(env.MLX_GMAIL_FROM);
}

export function validateEnquiry(input) {
  if (!input || typeof input !== 'object' || Array.isArray(input) || Object.keys(input).some(key => !fields.includes(key))) throw new Error('Invalid fields');
  const value = {};
  for (const [key, max] of [['name',100],['email',254],['website',500],['message',3000]]) {
    if (typeof input[key] !== 'string' || !input[key].trim() || input[key].length > max) throw new Error('Invalid field');
    value[key] = input[key].trim();
  }
  if (input.fax || !isEmail(value.email) || /[\r\n\x00]/.test(value.name) || /\x00/.test(value.message)) throw new Error('Invalid enquiry');
  const url = new URL(value.website);
  if (!['http:', 'https:'].includes(url.protocol) || !url.hostname.includes('.') || url.username || url.password) throw new Error('Invalid website');
  return value;
}

// Single plain-text message, with fixed server-owned From/To/Subject. No attachments,
// visitor-supplied recipients, HTML, URL retrieval or automatic reply to visitors.
export async function sendGmail(value, env, fetcher = fetch) {
  const token = await fetcher('https://oauth2.googleapis.com/token', {
    method: 'POST', signal: AbortSignal.timeout(10000), redirect: 'error',
    headers: {'Content-Type':'application/x-www-form-urlencoded'},
    body: new URLSearchParams({client_id:env.MLX_GOOGLE_CLIENT_ID, client_secret:env.MLX_GOOGLE_CLIENT_SECRET,
      refresh_token:env.MLX_GOOGLE_REFRESH_TOKEN, grant_type:'refresh_token'})
  });
  const auth = await token.json();
  if (!token.ok || typeof auth.access_token !== 'string' || !auth.access_token) throw new Error('Mail authorization unavailable');
  const body = `Website scope enquiry\n\nName: ${value.name}\nEmail: ${value.email}\nCompany website: ${value.website}\n\n${value.message}\n\nSubmitted through MindLeverX. This is an enquiry, not an audit booking.`;
  const encodedBody = Buffer.from(body).toString('base64').match(/.{1,76}/g).join('\r\n');
  const raw = [`From: MindLeverX <${env.MLX_GMAIL_FROM}>`, `To: ${env.MLX_ENQUIRY_TO}`, `Reply-To: ${value.email}`,
    'Subject: MindLeverX website enquiry', `Date: ${new Date().toUTCString()}`, `Message-ID: <${randomUUID()}@mindleverx.com>`,
    'MIME-Version: 1.0', 'Content-Type: text/plain; charset=UTF-8', 'Content-Transfer-Encoding: base64', '', encodedBody].join('\r\n');
  const sent = await fetcher('https://gmail.googleapis.com/gmail/v1/users/me/messages/send', {
    method:'POST', signal:AbortSignal.timeout(10000), redirect:'error',
    headers:{Authorization:`Bearer ${auth.access_token}`, 'Content-Type':'application/json'},
    body:JSON.stringify({raw:Buffer.from(raw).toString('base64url')})
  });
  const result = await sent.json();
  if (!sent.ok || typeof result.id !== 'string' || !result.id) throw new Error('Mail delivery unconfirmed');
}

function reply(request, status, message) {
  const headers = {'Cache-Control':'no-store', 'X-Content-Type-Options':'nosniff', 'Referrer-Policy':'no-referrer'};
  if (request.headers.get('accept')?.includes('application/json')) return Response.json({ok:status === 202, message}, {status,headers});
  headers['Content-Type'] = 'text/html; charset=utf-8';
  headers['Content-Security-Policy'] = "default-src 'none'; style-src 'unsafe-inline'; frame-ancestors 'none'; base-uri 'none'";
  // Only fixed application messages enter this document, never request/provider content.
  return new Response(`<!doctype html><html lang="en"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Enquiry | MindLeverX</title><style>body{font:18px/1.6 system-ui;max-width:42rem;margin:12vh auto;padding:24px;color:#281b1e;background:#faf9f6}a{color:#7a2435}</style><main><h1>${status === 202 ? 'Thank you for your enquiry' : 'Your enquiry needs attention'}</h1><p>${message}</p><p><a href="/index.html#cta">Return to MindLeverX</a></p></main></html>`,{status,headers});
}

async function readBody(request) {
  const reader = request.body?.getReader();
  if (!reader) throw new Error('Missing body');
  const chunks = []; let size = 0;
  while (true) {
    const {value,done} = await reader.read();
    if (done) break;
    size += value.byteLength;
    if (size > 24000) { await reader.cancel(); throw new Error('Body too large'); }
    chunks.push(value);
  }
  const text = Buffer.concat(chunks).toString('utf8');
  if (request.headers.get('content-type')?.split(';')[0] === 'application/json') return JSON.parse(text);
  const params = new URLSearchParams(text);
  if ([...params.keys()].some(key => params.getAll(key).length !== 1)) throw new Error('Duplicate fields');
  return Object.fromEntries(params);
}

export function createEnquiryHandler({env = process.env, send = sendGmail, now = Date.now} = {}) {
  // Defense in depth only: this map is per instance. A production WAF rate rule is
  // still required; a serverless in-memory counter is not a global quota.
  const attempts = new Map();
  return async request => {
    if (request.method !== 'POST') return new Response(null,{status:405,headers:{Allow:'POST','Cache-Control':'no-store'}});
    if (!origins.has(request.headers.get('origin'))) return reply(request,403,'Please submit using the form on MindLeverX.');
    if (env.MLX_ENQUIRY_ENABLED !== 'true' || !mailConfigured(env)) return reply(request,503,'The enquiry form is temporarily unavailable. Please try again later.');
    if (!['application/json','application/x-www-form-urlencoded'].includes(request.headers.get('content-type')?.split(';')[0])) return reply(request,415,'Please submit using the website form.');
    let value;
    try { value = validateEnquiry(await readBody(request)); }
    catch { return reply(request,400,'Check your name, email, company website and message, then try again.'); }
    const time = now();
    for (const [key,record] of attempts) if (time - record.time > 60000) attempts.delete(key);
    const key = createHash('sha256').update(value.email.toLowerCase()).digest('hex');
    if (attempts.has(key) || attempts.size >= 20) return reply(request,429,'Please wait a minute before sending another enquiry.');
    attempts.set(key,{time});
    try { await send(value,env); }
    catch { return reply(request,502,'We could not confirm that your enquiry was sent. Please wait a minute before trying again.'); }
    return reply(request,202,'Your enquiry has been accepted for email delivery. We will review it and reply using the address you provided.');
  };
}
