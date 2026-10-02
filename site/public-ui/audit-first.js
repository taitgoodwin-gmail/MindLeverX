/* Static fictional sample navigation. No intake, API calls, storage or private reports. */
(() => {
  'use strict';
  const home = document.getElementById('home-view');
  const viewer = document.getElementById('sample-report');
  const pages = [...document.querySelectorAll('[data-report-page]')];
  const navigation = document.querySelector('.mlx-report-navigation');
  const previous = document.getElementById('sample-prev');
  const next = document.getElementById('sample-next');
  const status = document.getElementById('sample-status');
  const skip = document.querySelector('.skip-link');
  const error = document.getElementById('sample-error');
  const contents = [...document.querySelectorAll('[data-report-link]')];
  if (!home || !viewer || pages.length !== 5 || !navigation || !previous || !next || !status || !skip) return;
  // If the document is incomplete, retain readable static content rather than
  // hiding it and then failing midway through enhancement.
  const headings = pages.map(page => page.querySelector('h2'));
  if (headings.some(heading => !heading)) return;
  let opener = null;
  let wasInReport = false;
  const defaultTitle = document.title;

  function render({ focus = true } = {}) {
    const match = /^#sample-report(?:-page-([1-5]))?$/.exec(window.location.hash);
    const inReport = !!match;
    const inAnswer = !!document.getElementById('answer') && /^#(?:answer(?:-(local|support|leading))?|evidence-(local|support|leading))$/.test(window.location.hash);
    const pageNumber = match ? Number(match[1] || 1) : 0;
    const invalidReport = (!inReport && /^#sample-report/.test(window.location.hash)) || (!inAnswer && /^#(?:answer|evidence-)/.test(window.location.hash));
    if (error) {
      error.hidden = !invalidReport;
      error.textContent = invalidReport ? 'That sample page does not exist. Choose Sample report to start at the overview.' : '';
    }
    home.hidden = inReport || inAnswer;
    viewer.hidden = !inReport;
    navigation.hidden = !inReport;
    skip.href = inReport ? `#sample-report-page-${pageNumber}` : inAnswer ? '#answer' : '#main';
    document.title = inReport ? `Sample report · Page ${pageNumber} of 5 · MindLeverX` : defaultTitle;
    pages.forEach((page, index) => { page.hidden = inReport && index !== pageNumber - 1; });
    contents.forEach((link, index) => { link.setAttribute('aria-current', inReport && index === pageNumber - 1 ? 'page' : 'false'); });
    if (inAnswer) { wasInReport = false; return; }
    if (inReport) {
      previous.href = pageNumber === 1 ? '#top' : `#sample-report-page-${pageNumber - 1}`;
      previous.firstChild.textContent = pageNumber === 1 ? 'Back to homepage' : 'Previous page';
      next.hidden = pageNumber === 5;
      next.href = `#sample-report-page-${Math.min(pageNumber + 1, 5)}`;
      status.textContent = `Fictional sample · Page ${pageNumber} of 5`;
      if (focus) {
        headings[pageNumber - 1].focus({ preventScroll: true });
        window.scrollTo({ top: 0, behavior: 'instant' });
      }
    } else if ((wasInReport || invalidReport) && focus) {
      const target = invalidReport && error ? error : opener?.isConnected && !opener.closest?.('[hidden]') ? opener : document.getElementById('hero-title');
      if (target) {
        if (!target.hasAttribute('tabindex')) target.setAttribute('tabindex', '-1');
        target.focus({ preventScroll: true });
        target.scrollIntoView({ block: 'center', behavior: 'instant' });
      }
    }
    wasInReport = inReport;
  }
  document.querySelectorAll('[data-sample-open]').forEach(link => {
    link.addEventListener('click', () => { opener = link; });
  });
  // Keep the explorer skip target usable even if its enhancement script fails.
  skip.addEventListener('click', event => {
    const answerHeading = document.getElementById('answer-title');
    if (home.hidden && viewer.hidden && answerHeading) {
      event.preventDefault();
      answerHeading.focus();
    }
  });
  window.addEventListener('hashchange', () => render());
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && wasInReport) {
      event.preventDefault();
      window.location.hash = 'top';
    }
  });
  render({ focus: /^#(?:sample-report|answer|evidence-)/.test(window.location.hash) });
  // Native cross-document fragment navigation can reset focus after deferred scripts.
  // Restore the report heading once loading settles, without stealing an active control.
  window.addEventListener('pageshow', () => requestAnimationFrame(() => {
    if ((wasInReport || (error && !error.hidden)) && document.activeElement === document.body) render();
  }));
})();
