(() => {
  'use strict';
  const $ = id => document.getElementById(id);
  const banner = $('local-preview');
  if (banner) banner.hidden = !window.MLX_LOCAL_PREVIEW;

  function setTheme(dark) {
    document.documentElement.dataset.theme = dark ? 'dark' : 'light';
    for (const id of ['tg', 'tg2']) {
      const button = $(id);
      if (button) {
        button.textContent = dark ? '☀ Light' : '☾ Dark';
        button.setAttribute('aria-label', dark ? 'Use light theme' : 'Use dark theme');
      }
    }
  }
  let savedTheme;
  try { savedTheme = localStorage.getItem('mlx-theme'); } catch {}
  // Use light unless the visitor has explicitly saved a dark-theme choice.
  setTheme(savedTheme === 'dark');
  for (const id of ['tg', 'tg2']) $(id)?.addEventListener('click', () => {
    const dark = document.documentElement.dataset.theme !== 'dark';
    setTheme(dark);
    try { localStorage.setItem('mlx-theme', dark ? 'dark' : 'light'); } catch {}
  });

  const menuButton = $('menubtn'), menu = $('mobnav');
  function setMenu(open, focusButton = false) {
    if (!menu || !menuButton) return;
    menu.hidden = !open;
    menu.style.display = open ? 'block' : 'none';
    menuButton.setAttribute('aria-expanded', String(open));
    menuButton.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    menuButton.textContent = open ? 'Close' : 'Menu';
    if (focusButton) menuButton.focus();
  }
  menuButton?.addEventListener('click', () => setMenu(menuButton.getAttribute('aria-expanded') !== 'true'));
  menu?.addEventListener('click', event => {
    const link = event.target.closest('a');
    if (!link) return;
    setMenu(false, true);
    const target = new URL(link.href, window.location.href);
    if (target.origin === window.location.origin && target.pathname === window.location.pathname && target.hash) {
      let section;
      try { section = $(decodeURIComponent(target.hash.slice(1))); } catch {}
      if (section) {
        if (!section.hasAttribute('tabindex')) section.setAttribute('tabindex', '-1');
        section.focus({ preventScroll: true });
      }
    }
  });
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && menuButton?.getAttribute('aria-expanded') === 'true') setMenu(false, true);
  });

  const track = $('tick');
  if (track) {
    const clone = document.createElement('span');
    clone.setAttribute('aria-hidden', 'true');
    clone.style.cssText = 'display:inline-flex;gap:44px';
    for (const child of [...track.childNodes]) clone.append(child.cloneNode(true));
    track.append(clone);
  }
  $('tkBtn')?.addEventListener('click', () => {
    const paused = $('ticker').classList.toggle('paused');
    $('tkBtn').setAttribute('aria-pressed', String(paused));
    $('tkBtn').setAttribute('aria-label', paused ? 'Play sample ticker' : 'Pause sample ticker');
    $('tkBtn').textContent = paused ? '▶' : '❚❚';
  });

  const copy = $('copyDef');
  if (copy) {
    const status = document.createElement('span');
    status.className = 'note';
    status.setAttribute('role', 'status');
    copy.parentElement.append(status);
    copy.addEventListener('click', async () => {
      try {
        if (!navigator.clipboard) throw new Error('Clipboard unavailable');
        await navigator.clipboard.writeText(document.querySelector('.define .def').innerText);
        copy.textContent = 'COPIED'; status.textContent = 'Definition copied.';
      } catch { status.textContent = 'Could not copy. Select the definition and copy it manually.'; }
      setTimeout(() => { copy.textContent = 'COPY'; }, 1600);
    });
  }

  const form = $('auditform');
  if (form) {
    const email = $('auditemail'), domain = $('auditdomain'), consent = $('intake-consent');
    const note = $('fnote'), button = $('auditbtn'), timestamp = $('auditts');
    let sending = false, lastSent = 0, automaticDomain = '';
    const freeMail = new Set(['gmail.com', 'googlemail.com', 'outlook.com', 'hotmail.com', 'live.com', 'yahoo.com', 'icloud.com', 'me.com', 'proton.me', 'protonmail.com', 'aol.com']);
    timestamp.value = String(Date.now());
    if (window.MLX_AUDIT_ENDPOINT) note.textContent = 'Saves to this local workspace. No email is sent.';
    function say(message, field) {
      note.textContent = message;
      if (field) { field.setAttribute('aria-invalid', 'true'); field.focus(); }
    }
    email.addEventListener('input', () => {
      email.removeAttribute('aria-invalid');
      if (!domain) return;
      const candidate = (email.value.split('@')[1] || '').trim().toLowerCase();
      if (!domain.value || domain.value === automaticDomain) {
        automaticDomain = candidate.includes('.') && !freeMail.has(candidate) ? candidate : '';
        domain.value = automaticDomain;
      }
    });
    domain?.addEventListener('input', () => domain.removeAttribute('aria-invalid'));
    consent.addEventListener('change', () => consent.removeAttribute('aria-invalid'));

    function normalizeDomain(value) {
      const candidate = value.trim().toLowerCase();
      if (!candidate) throw new Error('Add the company domain you want to assess.');
      let url;
      try { url = new URL(/^https?:\/\//i.test(candidate) ? candidate : `https://${candidate}`); }
      catch { throw new Error('Enter a valid company domain, such as yourcompany.com.'); }
      if (!['https:', 'http:'].includes(url.protocol) || url.username || url.password || url.port ||
          !/^(?:[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?\.)+[a-z]{2,63}$/.test(url.hostname)) {
        throw new Error('Enter a public company domain, such as yourcompany.com.');
      }
      return url.hostname;
    }

    form.addEventListener('submit', async event => {
      event.preventDefault();
      if (sending) return;
      if ($('website').value) { say('This request could not be accepted. Reload the page to try again.'); return; }
      email.value = email.value.trim();
      if (!email.checkValidity()) { say('Enter a valid email address.', email); return; }
      let normalizedDomain = '';
      try { if (domain) normalizedDomain = normalizeDomain(domain.value); }
      catch (error) { say(error.message, domain); return; }
      if (!consent.checked) { say('Confirm local storage of this request before submitting.', consent); return; }
      if (!window.MLX_AUDIT_ENDPOINT) { say('Intake is not connected. Start the local server to save requests.'); return; }
      if (!window.MLX_INTAKE_TOKEN) { say('Your intake session is unavailable. Reload this page and try again.'); return; }
      if (Date.now() - Number(timestamp.value) < 2000) { say('One moment — try again in a few seconds.'); return; }
      if (Date.now() - lastSent < 60000) { say('Your previous request was saved. Wait a minute before sending another.'); return; }
      sending = true; button.disabled = true; form.setAttribute('aria-busy', 'true');
      const label = button.textContent, controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 15000);
      button.textContent = 'Saving…'; say('Saving your request…');
      try {
        const response = await fetch(window.MLX_AUDIT_ENDPOINT, {
          method: 'POST', credentials: 'same-origin', headers: { 'Content-Type': 'application/json' }, signal: controller.signal,
          body: JSON.stringify({ email: email.value, domain: normalizedDomain, website: '', ts: Number(timestamp.value),
            source: form.dataset.source, kind: form.dataset.kind, consent: true, _token: window.MLX_INTAKE_TOKEN })
        });
        const result = await response.json().catch(() => null);
        if (response.status === 202 && result?.ok === true && typeof result.lead_id === 'string' && result.lead_id) {
          lastSent = Date.now(); form.reset(); timestamp.value = String(Date.now()); automaticDomain = '';
          say(form.dataset.kind === 'subscription' ? 'Your interest is saved locally. No newsletter email has been sent.' : 'Your audit request is saved locally. No audit has run or email been sent.');
        } else if (response.status === 429) say('Too many requests. Wait a minute, then try again.');
        else if (response.status === 403) say('Your intake session expired. Reload this page and try again.');
        else if (response.status === 400) say('The request could not be accepted. Check the email and company domain, then try again.');
        else say('We could not confirm that the request was saved. Check the workspace before trying again.');
      } catch (error) {
        say(error.name === 'AbortError' ? 'The request timed out. Check the workspace before trying again.' : 'Connection lost. Check the workspace before trying again.');
      } finally {
        clearTimeout(timeout); sending = false; button.disabled = false; button.textContent = label; form.removeAttribute('aria-busy');
      }
    });
  }

  if (matchMedia('(prefers-reduced-motion: no-preference)').matches && 'IntersectionObserver' in window) {
    document.documentElement.classList.add('anim');
    const observer = new IntersectionObserver(entries => entries.forEach(entry => {
      if (entry.isIntersecting) { entry.target.classList.add('in'); observer.unobserve(entry.target); }
    }), { threshold: 0.1 });
    document.querySelectorAll('.rv').forEach(element => observer.observe(element));
  }
})();
