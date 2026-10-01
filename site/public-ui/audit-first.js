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
  if (!home || !viewer || pages.length !== 5 || !navigation || !previous || !next || !status || !skip) return;
  let opener = null;
  let wasInReport = false;
  const defaultTitle = document.title;

  function render({ focus = true } = {}) {
    const match = /^#sample-report(?:-page-([1-5]))?$/.exec(window.location.hash);
    const inReport = !!match;
    const pageNumber = match ? Number(match[1] || 1) : 0;
    home.hidden = inReport;
    viewer.hidden = !inReport;
    navigation.hidden = !inReport;
    skip.href = inReport ? `#sample-report-page-${pageNumber}` : '#main';
    document.title = inReport ? `Sample report · Page ${pageNumber} of 5 · MindLeverX` : defaultTitle;
    pages.forEach((page, index) => { page.hidden = inReport && index !== pageNumber - 1; });
    if (inReport) {
      previous.href = pageNumber === 1 ? '#top' : `#sample-report-page-${pageNumber - 1}`;
      previous.firstChild.textContent = pageNumber === 1 ? 'Back to homepage' : 'Previous page';
      next.hidden = pageNumber === 5;
      next.href = `#sample-report-page-${Math.min(pageNumber + 1, 5)}`;
      status.textContent = `Fictional sample · Page ${pageNumber} of 5`;
      if (focus) {
        pages[pageNumber - 1].querySelector('h2').focus({ preventScroll: true });
        window.scrollTo({ top: 0, behavior: 'instant' });
      }
    } else if (wasInReport && focus) {
      const target = opener?.isConnected ? opener : document.getElementById('hero-title');
      if (!target.hasAttribute('tabindex')) target.setAttribute('tabindex', '-1');
      target.focus({ preventScroll: true });
      target.scrollIntoView({ block: 'center', behavior: 'instant' });
    }
    wasInReport = inReport;
  }
  document.querySelectorAll('[data-sample-open]').forEach(link => {
    link.addEventListener('click', () => { opener = link; });
  });
  window.addEventListener('hashchange', () => render());
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && wasInReport) {
      event.preventDefault();
      window.location.hash = 'top';
    }
  });
  render({ focus: /^#sample-report/.test(window.location.hash) });
})();
