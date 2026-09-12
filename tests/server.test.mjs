import assert from 'node:assert/strict';
import { once } from 'node:events';
import { mkdtemp, rm } from 'node:fs/promises';
import { request as httpRequest } from 'node:http';
import { tmpdir } from 'node:os';
import path from 'node:path';
import test from 'node:test';
import { setTimeout as delay } from 'node:timers/promises';
import { fileURLToPath } from 'node:url';
import { createApp } from '../server/app.mjs';

const distDir = fileURLToPath(new URL('../dist', import.meta.url));

async function startApp(options = {}) {
  const app = await createApp({ dbPath: ':memory:', seed: true, distDir, ...options });
  app.server.listen(0, '127.0.0.1');
  await once(app.server, 'listening');
  const base = `http://127.0.0.1:${app.server.address().port}`;
  let cookie = '';
  let csrfToken = '';

  async function request(route, { method = 'GET', body, session = true, csrf = true, headers = {} } = {}) {
    const response = await fetch(`${base}${route}`, {
      method,
      headers: {
        ...(session && cookie ? { Cookie: cookie } : {}),
        ...(csrf && csrfToken ? { 'X-CSRF-Token': csrfToken } : {}),
        ...(body === undefined ? {} : { 'Content-Type': 'application/json' }),
        ...headers,
      },
      ...(body === undefined ? {} : { body: JSON.stringify(body) }),
    });
    const text = await response.text();
    let data;
    try { data = JSON.parse(text); } catch { data = text; }
    return { response, status: response.status, data };
  }

  function rememberCookies(response) {
    const values = response.headers.getSetCookie();
    if (!values.length) return;
    const cookies = new Map(cookie.split('; ').filter(Boolean).map(value => {
      const equals = value.indexOf('=');
      return [value.slice(0, equals), value];
    }));
    for (const value of values) {
      const pair = value.split(';', 1)[0];
      cookies.set(pair.slice(0, pair.indexOf('=')), pair);
    }
    cookie = [...cookies.values()].join('; ');
  }

  async function login() {
    const result = await request('/api/session');
    assert.equal(result.status, 200);
    assert.equal(result.data.mode, 'local');
    assert.equal(typeof result.data.csrf_token, 'string');
    assert.ok(result.data.csrf_token.length >= 16);
    rememberCookies(result.response);
    csrfToken = result.data.csrf_token;
    assert.ok(cookie, 'The operator session must be represented by a cookie');
    return result;
  }

  async function runtime() {
    const result = await request('/runtime.js');
    assert.equal(result.status, 200);
    assert.equal(typeof result.data, 'string');
    const match = result.data.match(/^window\.MLX_INTAKE_TOKEN = (.+);$/m);
    assert.ok(match, 'runtime.js must provide an intake token');
    rememberCookies(result.response);
    return { token: JSON.parse(match[1]), result };
  }

  // Node fetch rewrites Host, so rebinding checks need a native HTTP request.
  async function requestWithHost(route, host) {
    return new Promise((resolve, reject) => {
      const request = httpRequest(`${base}${route}`, {
        headers: { Host: host, ...(cookie ? { Cookie: cookie } : {}) },
      }, response => {
        response.resume();
        response.once('end', () => resolve(response.statusCode));
        response.once('error', reject);
      });
      request.once('error', reject);
      request.end();
    });
  }

  return { ...app, base, request, requestWithHost, login, runtime };
}

async function fixture(t, options) {
  const app = await startApp(options);
  t.after(() => app.close());
  return app;
}

async function createClient(app, extra = {}) {
  const result = await app.request('/api/clients', {
    method: 'POST',
    body: { name: 'North Star Dental', domain: 'northstar.example', notes: 'Created in an integration test.', ...extra },
  });
  assert.equal(result.status, 201);
  assert.equal(result.data.ok, true);
  assert.ok(result.data.client.id);
  return result.data.client;
}

test('workspace requires a session and operator mutations require CSRF', async t => {
  const app = await fixture(t);
  assert.equal((await app.request('/api/workspace')).status, 401);
  const session = await app.login();
  assert.ok(session.response.headers.getSetCookie().some(value => /httponly/i.test(value)));

  const workspace = await app.request('/api/workspace');
  assert.equal(workspace.status, 200);
  for (const field of ['clients', 'reviews', 'leads', 'activity', 'panels']) {
    assert.ok(Array.isArray(workspace.data[field]), `${field} must be an array`);
  }

  const body = { name: 'Denied Client', domain: 'denied.example' };
  assert.equal((await app.request('/api/clients', { method: 'POST', body, csrf: false })).status, 403);
  assert.equal((await app.request('/api/clients', {
    method: 'POST', body, headers: { 'X-CSRF-Token': 'forged-token' },
  })).status, 403);
  assert.equal((await app.request('/api/clients', { method: 'POST', body, session: false })).status, 401);
  const after = await app.request('/api/workspace');
  assert.ok(!after.data.clients.some(client => client.name === body.name));
});

test('foreign origins and spoofed hosts cannot access the local API', async t => {
  const app = await fixture(t);
  await app.login();
  for (const route of ['/api/session', '/api/workspace', '/runtime.js']) {
    assert.equal((await app.request(route, { headers: { Origin: 'https://attacker.example' } })).status, 403);
    assert.equal(await app.requestWithHost(route, 'attacker.example'), 403);
  }
  assert.equal((await app.request('/api/clients', {
    method: 'POST',
    body: { name: 'Cross-Origin Client', domain: 'cross-origin.example' },
    headers: { Origin: 'https://attacker.example' },
  })).status, 403);
  const allowed = await app.request('/api/workspace', { headers: { Origin: app.base } });
  assert.equal(allowed.status, 200);
});

test('client validation rejects malformed input without changing stored clients', async t => {
  const app = await fixture(t);
  await app.login();
  const initial = await app.request('/api/workspace');
  for (const body of [
    { name: '', domain: 'valid.example' },
    { name: '   ', domain: 'valid.example' },
    { name: 'Valid Name', domain: 'not a domain' },
    { name: 'Valid Name', domain: 'javascript:alert(1)' },
  ]) {
    assert.equal((await app.request('/api/clients', { method: 'POST', body })).status, 400);
  }
  const after = await app.request('/api/workspace');
  assert.equal(after.data.clients.length, initial.data.clients.length);

  const client = await createClient(app);
  for (const body of [{ status: 'deleted' }, { stage: 0 }, { stage: 8 }, { stage: 1.5 }]) {
    assert.equal((await app.request(`/api/clients/${client.id}`, { method: 'PATCH', body })).status, 400);
  }
  const updated = await app.request(`/api/clients/${client.id}`, {
    method: 'PATCH', body: { status: 'paused', stage: 4, notes: 'Awaiting client feedback.' },
  });
  assert.equal(updated.status, 200);
  assert.equal(updated.data.client.status, 'paused');
  assert.equal(updated.data.client.stage, 4);
  assert.equal(updated.data.client.notes, 'Awaiting client feedback.');
});

test('HTML-like client notes round-trip as inert JSON strings', async t => {
  const app = await fixture(t);
  await app.login();
  const notes = '<img src=x onerror="globalThis.pwned=true"><script>alert("x")</script>';
  const client = await createClient(app, { notes });
  assert.equal(client.notes, notes);
  const workspace = await app.request('/api/workspace');
  assert.match(workspace.response.headers.get('content-type'), /^application\/json\b/i);
  assert.equal(workspace.data.clients.find(row => row.id === client.id).notes, notes);
});

test('review decisions require a note and allow only one pending transition, including concurrent requests', async t => {
  const app = await fixture(t);
  await app.login();
  const workspace = await app.request('/api/workspace');
  const review = workspace.data.reviews.find(row => row.status === 'pending');
  assert.ok(review, 'The seeded workspace must contain a pending review');
  const route = `/api/reviews/${review.id}/decision`;
  for (const body of [
    { decision: 'approved', note: '' },
    { decision: 'approved', note: '   ' },
    { decision: 'unexpected', note: 'A valid note.' },
  ]) {
    assert.equal((await app.request(route, { method: 'POST', body })).status, 400);
  }
  const results = await Promise.all([
    app.request(route, { method: 'POST', body: { decision: 'approved', note: 'Reviewed and approved.' } }),
    app.request(route, { method: 'POST', body: { decision: 'returned', note: 'Please revise the findings.' } }),
  ]);
  assert.deepEqual(results.map(result => result.status).sort(), [200, 409]);
  const winner = results.find(result => result.status === 200);
  assert.equal(winner.data.ok, true);
  assert.ok(['approved', 'returned'].includes(winner.data.review.status));
  assert.equal((await app.request(route, {
    method: 'POST', body: { decision: 'approved', note: 'Duplicate decision.' },
  })).status, 409);
  const after = await app.request('/api/workspace');
  assert.equal(after.data.reviews.find(row => row.id === review.id).status, winner.data.review.status);
});

test('panels preserve prior versions when new prompt sets are created', async t => {
  const app = await fixture(t);
  await app.login();
  const client = await createClient(app);
  const route = `/api/clients/${client.id}/panels`;
  const firstInput = { prompts: ['Who is a trusted local provider?', 'Which provider has clear pricing?'], note: 'Baseline panel.' };
  const secondInput = { prompts: ['Which local provider explains treatment options?'], note: 'Narrow the next run.' };
  const first = await app.request(route, { method: 'POST', body: firstInput });
  const second = await app.request(route, { method: 'POST', body: secondInput });
  assert.equal(first.status, 201);
  assert.equal(second.status, 201);
  assert.equal(first.data.ok, true);
  assert.equal(second.data.ok, true);
  assert.notEqual(first.data.panel.id, second.data.panel.id);
  assert.equal(second.data.panel.version, first.data.panel.version + 1);
  assert.deepEqual(first.data.panel.prompts, firstInput.prompts);
  assert.deepEqual(second.data.panel.prompts, secondInput.prompts);

  const attemptedEdit = await app.request(`/api/panels/${first.data.panel.id}`, {
    method: 'PATCH', body: { prompts: ['Overwrite the baseline.'] },
  });
  assert.ok([404, 405].includes(attemptedEdit.status));
  const workspace = await app.request('/api/workspace');
  assert.deepEqual(workspace.data.panels.find(row => row.id === first.data.panel.id), first.data.panel);
  assert.deepEqual(workspace.data.panels.find(row => row.id === second.data.panel.id), second.data.panel);
});

test('clients and panel history persist across server restarts', async t => {
  const temporaryDir = await mkdtemp(path.join(tmpdir(), 'mlx-server-test-'));
  let app;
  t.after(async () => {
    if (app) await app.close();
    await rm(temporaryDir, { recursive: true, force: true });
  });
  const dbPath = path.join(temporaryDir, 'workspace.sqlite');
  app = await startApp({ dbPath });
  await app.login();
  const client = await createClient(app, { name: 'Persistent Client', domain: 'persistent.example' });
  const panel = await app.request(`/api/clients/${client.id}/panels`, {
    method: 'POST', body: { prompts: ['Does this survive a restart?'], note: 'Persistence check.' },
  });
  assert.equal(panel.status, 201);
  const before = await app.request('/api/workspace');
  await app.close();
  app = null;

  app = await startApp({ dbPath });
  await app.login();
  const after = await app.request('/api/workspace');
  assert.equal(after.data.clients.length, before.data.clients.length, 'Restarting must not duplicate seed records');
  assert.deepEqual(after.data.clients.find(row => row.id === client.id), client);
  assert.deepEqual(after.data.panels.find(row => row.id === panel.data.panel.id), panel.data.panel);
});

test('public intake enforces token age, consent, honeypot, and duplicate throttling', async t => {
  const app = await fixture(t);
  const { token } = await app.runtime();
  const payload = {
    email: 'owner@example.com', domain: 'northstar.example', kind: 'audit',
    consent: true, source: 'integration-test', website: '', ts: Date.now() - 60_000, _token: token,
  };
  const send = extra => app.request('/api/intake', { method: 'POST', body: { ...payload, ...extra } });
  assert.equal((await send({ _token: 'forged-token' })).status, 403);
  assert.equal((await send({ _token: undefined })).status, 403);
  const early = await send({});
  assert.ok([400, 429].includes(early.status), 'Backdating the client timestamp must not bypass server token age');
  await delay(2100);
  assert.equal((await send({ consent: false })).status, 400);
  assert.equal((await send({ consent: undefined })).status, 400);
  assert.equal((await send({ website: 'https://spam.example' })).status, 400);
  assert.equal((await send({ email: 'not-an-email' })).status, 400);
  assert.equal((await send({ domain: 'not a domain' })).status, 400);
  assert.equal((await send({ kind: 'unknown' })).status, 400);

  const accepted = await send({ ts: Date.now() - 3000 });
  assert.equal(accepted.status, 202);
  assert.equal(accepted.data.ok, true);
  assert.ok(accepted.data.lead_id);
  assert.equal((await send({})).status, 429);
  assert.equal((await send({ email: 'another-owner@example.com' })).status, 429);

  await app.login();
  const workspace = await app.request('/api/workspace');
  const leads = workspace.data.leads.filter(lead => lead.email === payload.email);
  assert.equal(leads.length, 1);
  assert.equal(leads[0].id, accepted.data.lead_id);
});
