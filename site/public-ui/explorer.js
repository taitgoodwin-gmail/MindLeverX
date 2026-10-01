/* Progressive enhancement for a wholly fictional, local evidence illustration. */
(() => {
  'use strict';
  const view = document.getElementById('answer');
  const heading = document.getElementById('answer-title');
  const list = document.querySelector('.claim-list');
  const links = [...document.querySelectorAll('[data-claim]')];
  const panels = [...document.querySelectorAll('[data-evidence]')];
  const announcement = document.getElementById('claim-announcement');
  if (!view || !heading || !list || !announcement || links.length !== 3 || panels.length !== 3) return;
  const keys = ['local', 'support', 'leading'];
  if (keys.some(key => !links.some(link => link.dataset.claim === key) || !panels.some(panel => panel.dataset.evidence === key))) return;
  const art = document.querySelector('.opening-art');
  art?.addEventListener('animationend', event => {
    if (event.animationName === 'draw-evidence' && !art.getAnimations({ subtree: true }).some(animation => animation.playState === 'running')) art.classList.add('art-settled');
  });
  let entered = false;
  let active = null;
  let opener = null;
  list.setAttribute('role', 'tablist');
  list.setAttribute('aria-orientation', 'vertical');
  links.forEach(link => {
    link.href = `#answer-${link.dataset.claim}`;
    link.setAttribute('role', 'tab');
    link.setAttribute('aria-controls', `evidence-${link.dataset.claim}`);
    link.addEventListener('keydown', event => {
      const index = links.indexOf(link);
      const destination = { ArrowDown: (index + 1) % 3, ArrowRight: (index + 1) % 3, ArrowUp: (index + 2) % 3, ArrowLeft: (index + 2) % 3, Home: 0, End: 2 }[event.key];
      if (destination === undefined) return;
      event.preventDefault();
      links[destination].focus();
      window.location.hash = `answer-${links[destination].dataset.claim}`;
    });
    link.addEventListener('click', () => link.focus({ preventScroll: true }));
  });
  panels.forEach(panel => {
    panel.setAttribute('role', 'tabpanel');
    panel.setAttribute('aria-labelledby', `claim-${panel.dataset.evidence}`);
  });
  document.querySelectorAll('[data-answer-open]').forEach(link => link.addEventListener('click', () => { opener = link; }));
  function render() {
    const match = /^#answer(?:-(local|support|leading))?$/.exec(window.location.hash);
    view.hidden = !match;
    if (!match) {
      view.classList.remove('view-enter');
      if (entered && window.location.hash === '#top') {
        document.getElementById('home-view').classList.add('view-enter');
        const target = opener?.isConnected ? opener : document.getElementById('hero-title');
        target?.focus({ preventScroll: true });
        target?.scrollIntoView({ block: 'center', behavior: 'instant' });
      }
      entered = false;
      return;
    }
    const selected = match[1] || 'support';
    const panel = panels.find(item => item.dataset.evidence === selected);
    links.forEach(link => {
      const isSelected = link.dataset.claim === selected;
      link.setAttribute('aria-selected', String(isSelected));
      link.tabIndex = isSelected ? 0 : -1;
    });
    panels.forEach(item => { item.hidden = item !== panel; });
    if (active !== selected) {
      panel.classList.remove('claim-enter');
      // Restart only the bounded opacity transition. Text and semantics update immediately.
      void panel.offsetWidth;
      panel.classList.add('claim-enter');
      announcement.textContent = `Claim ${keys.indexOf(selected) + 1}: ${panel.querySelector('h3').textContent}. Evidence readout updated below.`;
    }
    if (!entered) {
      document.getElementById('home-view').classList.remove('view-enter');
      heading.focus({ preventScroll: true });
      window.scrollTo({ top: 0, behavior: 'instant' });
      view.classList.add('view-enter');
    }
    document.title = `Fictional answer · ${selected} claim · MindLeverX`;
    document.querySelector('.skip-link').href = window.location.hash;
    active = selected;
    entered = true;
  }
  document.querySelector('.skip-link').addEventListener('click', event => {
    if (entered) { event.preventDefault(); heading.focus(); }
  });
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && entered) { event.preventDefault(); window.location.hash = 'top'; }
  });
  window.addEventListener('hashchange', render);
  render();
})();
