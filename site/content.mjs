export const geoDefinition = 'Generative Engine Optimization (GEO) is the practice of improving how a business appears in AI-generated answers. It combines useful content, credible evidence and technical accessibility to help answer engines discover, understand and cite relevant information. It builds on SEO; inclusion is not guaranteed.';
export const geoResearch = 'The GEO paper tested content changes on 1,000 queries using GPT-3.5 and five retrieved sources. Results varied by tactic and domain; they are not a forecast of customer lift.';
export const geoResearchURL = 'https://arxiv.org/abs/2311.09735v3';
export const navigation = [['Method','method.html'],['What is GEO?','what-is-geo.html'],['Case study','case-study.html'],['About','about.html'],['Audit scope','index.html#services']];
export const glossary = [
 ['prompt-panel','Prompt panel','A documented set of questions used to examine AI answers. Preserve its wording and version so later readings can be compared under stated conditions.'],
 ['brand-mention','Brand mention','An appearance of a brand name in an answer. A literal-name match, an alias match and an inferred reference are different counting rules and should be labelled separately.'],
 ['citation','Citation','A source reference attached to an answer. A citation may point to a page without naming its brand in the answer text; record those events separately.'],
 ['mention-rate','Mention rate','The share of valid collected answers that meet a stated brand-mention rule. Report the numerator, denominator and missing or failed attempts.'],
 ['citation-rate','Citation rate','The share of valid collected answers containing a citation that meets a stated source-matching rule. Specify the question panel, surface and observation window.'],
 ['share-of-voice','Share of voice','A comparison of a brand’s observed mentions or citations with a defined comparison set. State what is counted and the denominator; there is no universal GEO formula.'],
 ['answer-first','Answer-first content','Content that opens with a direct, self-contained answer, followed by explanation and evidence. It helps readers understand the passage without requiring surrounding context.'],
 ['provenance','Provenance','The record of where evidence came from and how it was obtained. MindLeverX distinguishes measured tool output, live observations, inferred proxies and unmeasured dimensions.'],
 ['baseline','Baseline','A preserved initial reading with its questions, conditions, dates and method. It is a reference for later compatible observations, not proof of a causal effect.'],
 ['collection-conditions','Collection conditions','The context of an observation: product or interface, model when known, date, locale, account state, question wording and other relevant settings. Differences can limit comparison.'],
 ['technical-access','Technical access','Whether systems can retrieve and interpret a website’s content. Checks include response behavior, crawler rules, HTML availability and relevant structured data. Access does not guarantee selection.'],
 ['composite-score','Composite score','A single value combining multiple measures. Its definitions, weights and validation must be explicit; MindLeverX does not substitute an invented score for missing evidence.']
];
export const escapeHTML = value => String(value).replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;').replaceAll('"','&quot;').replaceAll("'",'&#39;');
export function validateProfile(profile) {
 if (profile.email && !/^[^\s@<>"']+@[^\s@<>"']+\.[^\s@<>"']+$/.test(profile.email)) throw new Error('Invalid public contact email');
 if (profile.formAction && profile.formAction !== '/api/enquiry') throw new Error('Enquiries must use the dedicated same-origin endpoint');
 if (profile.profileURL && new URL(profile.profileURL).protocol !== 'https:') throw new Error('Public profile must use HTTPS');
 return profile;
}
export const availability = 'Audit delivery is in development. Collection coverage must be qualified before an engagement begins.';
export const enquiryStatus = profile => profile.formAction ? 'Scope enquiries can be submitted through the website form. An enquiry does not book an audit or take payment.' : 'The enquiry form is being connected. Submissions are not available yet.';
export function contactBlock(profile) {
 const ready = Boolean(profile.formAction);
 return `<p>Tell us about your business and the question you want to answer. We’ll discuss the scope and fixed quote before payment.</p><form class="enquiry-form" method="post" data-enquiry-form${ready ? ` action="${escapeHTML(profile.formAction)}"` : ''} aria-describedby="enquiry-note">
 <div><label for="enquiry-name">Name</label><input id="enquiry-name" name="name" autocomplete="name" maxlength="100" required></div>
 <div><label for="enquiry-email">Email</label><input id="enquiry-email" name="email" type="email" autocomplete="email" maxlength="254" required><small>So we can reply to your enquiry.</small></div>
 <div><label for="enquiry-website">Company website</label><input id="enquiry-website" name="website" type="url" autocomplete="url" placeholder="https://yourcompany.com" maxlength="500" required></div>
 <div><label for="enquiry-message">What would you like to understand?</label><textarea id="enquiry-message" name="message" rows="4" maxlength="3000" required></textarea></div>
 <div hidden><label for="enquiry-fax">Leave this field empty</label><input id="enquiry-fax" name="fax" tabindex="-1" autocomplete="off"></div>
 <p id="enquiry-status" class="note" role="status" aria-live="polite" data-enquiry-status></p>
 <p id="enquiry-note" class="note">${ready ? 'We use these details to respond to your enquiry. Submitting does not book an audit, take payment or subscribe you to marketing.' : enquiryStatus(profile)}</p>
 <button class="btn" type="submit"${ready ? '' : ' disabled'}>Send enquiry</button>
 </form>`;
}
export function operatorBlock(profile) {
 if (!profile.name) return '';
 return `<aside class="operator"><h3>${escapeHTML(profile.name)}</h3>${profile.bio ? `<p>${escapeHTML(profile.bio)}</p>` : ''}${profile.profileURL ? `<p><a class="textlink" href="${escapeHTML(profile.profileURL)}">Professional profile →</a></p>` : ''}</aside>`;
}
export function header(page) {
 const links=navigation.map(([label,url],i)=>`<a href="${url}"${page===url?' aria-current="page"':''}${i===4?' class="textlink"':''}>${label}</a>`).join('');
 return `<header><div class="wrap nav"><a href="index.html" class="logo">MindLever<b>X.</b></a><nav class="navlinks" aria-label="Main navigation">${links}</nav><button class="menubtn" id="menubtn" aria-label="Open menu" aria-controls="mobnav" aria-expanded="false">Menu</button></div><nav class="mobnav wrap" id="mobnav" aria-label="More navigation" hidden>${links}</nav><noscript><nav class="wrap nojs-nav" aria-label="Navigation without JavaScript">${links}</nav></noscript></header>`;
}
export function footer(profile) {
 return `<footer><div class="wrap"><div class="fcols"><div style="max-width:30ch"><div class="logo">MindLever<b>X.</b></div><p>Generative engine optimization for B2B SaaS.<br>Own the answer.</p></div><div><div class="fhead">Explore</div><a href="method.html">Method</a><a href="what-is-geo.html">What is GEO?</a><a href="case-study.html">Case study</a></div><div><div class="fhead">Learn</div><a href="glossary.html">GEO glossary</a><a href="research-hub.html">Research</a></div><div><div class="fhead">Company</div><a href="about.html">About</a><a href="about.html#contact">Contact</a><div class="social-placeholders" aria-label="Social profiles coming soon"><span>LinkedIn · Coming soon</span><span>YouTube · Coming soon</span><span>Instagram · Coming soon</span><span>X · Coming soon</span></div></div></div><div class="fbot"><span>© 2026 MindLeverX</span><span>Own the answer.</span></div></div></footer>`;
}
export function renderContent(html,page,profile) {
 if (!profile.formAction) html = html.replaceAll('href="index.html#cta"','href="index.html#services"').replaceAll('href="#cta"','href="#services"');
 return html.replaceAll('{{SCOPE_CTA}}',profile.formAction ? 'Discuss audit scope' : 'Explore audit scope').replaceAll('{{AVAILABILITY}}',availability).replaceAll('{{HEADER}}',header(page)).replaceAll('{{FOOTER}}',footer(profile)).replaceAll('{{GEO_DEFINITION}}',escapeHTML(geoDefinition)).replaceAll('{{GEO_RESEARCH}}',`${escapeHTML(geoResearch)} <a class="textlink" href="${geoResearchURL}">GEO paper · KDD 2024 · v3 →</a>`).replaceAll('{{CONTACT}}',contactBlock(profile)).replaceAll('{{OPERATOR}}',operatorBlock(profile)).replaceAll('{{GLOSSARY}}',glossary.map(([id,name,definition])=>`<section class="glossary-term" id="${id}"><h2>${escapeHTML(name)}</h2><p>${escapeHTML(definition)}</p></section>`).join('\n'));
}
