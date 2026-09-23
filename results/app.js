const $ = id => document.getElementById(id);
const element = (tag, text, className) => {
  const node = document.createElement(tag);
  if (text !== undefined) node.textContent = text;
  if (className) node.className = className;
  return node;
};
const names = { chatgpt: 'ChatGPT', perplexity: 'Perplexity', google: 'Google', copilot: 'Copilot' };
const platformName = name => Object.hasOwn(names, name) ? names[name] : name;
let report = null;
function finding(data) {
  const { numerator, denominator } = data.aggregate;
  return numerator === 0
    ? `${data.brand} was not named in these ${denominator} saved answers.`
    : `${data.brand} was named in ${numerator} of ${denominator} saved answers.`;
}
function renderAnswers() {
  const selected = $('engine').value;
  const rows = report.answers.filter(row => !selected || row.engine === selected);
  $('answer-count').textContent = `${rows.length} of ${report.answers.length} saved answers shown`;
  $('answers').replaceChildren(...rows.map(row => {
    const detail = element('details');
    detail.append(element('summary', `Answer ${row.row} · ${platformName(row.engine)} · ${row.literalMention ? 'Literal mention found' : 'No literal mention'}`));
    detail.append(element('p', `Vendor date: ${row.vendorTimestamp || 'Not supplied'} · Source row: ${row.row}`, 'answer-meta'));
    detail.append(element('p', `Question: ${row.prompt}`));
    detail.append(element('pre', row.answer, 'answer-text'));
    detail.append(element('p', `Vendor response ID: ${row.vendorResponseId || 'Not supplied'}`, 'answer-meta'));
    return detail;
  }));
}
function render(data) {
  report = data;
  $('title').textContent = `${data.brand}: saved answer results`;
  $('finding-title').textContent = finding(data);
  $('finding-context').textContent = `We checked ${data.aggregate.denominator} exported answers across ${data.platforms.length} vendor platform labels and ${data.questionCount} question${data.questionCount === 1 ? '' : 's'}. The check looks for “${data.brand}” in the answer text, ignoring capitalization.`;
  $('mentions').textContent = `${data.aggregate.numerator} / ${data.aggregate.denominator}`;
  $('platform-count').textContent = data.platforms.length;
  $('question-count').textContent = data.questionCount;
  $('platforms').replaceChildren(...data.platforms.map(platform => {
    const card = element('div', undefined, 'platform-card');
    card.append(element('h3', platformName(platform.engine)), element('p', `${platform.numerator} / ${platform.denominator}`, 'ratio'), element('p', 'answers with a mention'));
    return card;
  }));
  const all = element('option', 'All platforms'); all.value = '';
  $('engine').replaceChildren(all, ...data.platforms.map(platform => {
    const option = element('option', platformName(platform.engine)); option.value = platform.engine; return option;
  }));
  $('limitations').replaceChildren(...data.limitations.map(limit => element('li', limit)));
  $('source-hash').textContent = data.source.sha256;
  $('source-size').textContent = `${data.source.bytes.toLocaleString('en-US')} bytes`;
  $('method').textContent = data.method;
  const repeated = data.issues.filter(issue => issue.code === 'repeated_vendor_response_id').length;
  const missing = data.issues.filter(issue => issue.code === 'metadata_missing_or_invalid').length;
  $('warnings').textContent = `${repeated} repeated response-ID warnings; ${missing} missing-metadata warnings. Repeated IDs across different platform records are retained and do not prove independent observations.`;
  renderAnswers();
  $('report').hidden = false;
  $('explore').hidden = false;
  $('download').disabled = false;
  $('status').textContent = 'Saved results loaded. Reloading reads the same local source; it does not collect new answers.';
}
async function load() {
  report = null;
  $('report').hidden = true;
  $('explore').hidden = true;
  $('download').disabled = true;
  $('reload').disabled = true;
  $('title').textContent = 'Saved answer results';
  $('status').textContent = 'Loading saved observations…';
  try {
    const session = await fetch('/api/session', { cache: 'no-store' });
    if (!session.ok) throw new Error('Could not open the local session. Reload to try again.');
    const response = await fetch('/api/saved-results', { cache: 'no-store' });
    if (!response.ok) throw new Error('Saved results are unavailable. Check the local source, then reload saved results.');
    const data = await response.json();
    if (!data.available) {
      $('status').textContent = 'No saved evidence is connected yet. No findings have been calculated.';
    } else if (data.report?.state !== 'complete') {
      $('status').textContent = data.report?.issues?.some(issue => issue.code === 'observed_service_error_response')
        ? 'The saved records include a service-error response, not an answer. No mention count has been calculated and PDF preparation is blocked. Review the source evidence before preparing results.'
        : 'These saved records need a data check before results can be shown. No mention count has been calculated. Correct the source, then reload saved results.';
    } else render(data.report);
  } catch (error) {
    $('report').hidden = true;
    $('download').disabled = true;
    report = null;
    $('status').textContent = error.message;
  } finally { $('reload').disabled = false; }
}
function download() {
  if (!report) return;
  const link = document.createElement('a');
  link.href = `/api/saved-results/draft.pdf?sha256=${report.source.sha256}`;
  document.body.append(link); link.click(); link.remove();
}
$('engine').addEventListener('change', renderAnswers);
$('reload').addEventListener('click', load);
$('download').addEventListener('click', download);
load();
