# Homepage competitor teardown and design decisions — 30 September 2026

Working record for the Figma file "MindLeverX — Reimagined / Evidence in View". Evidence labels used below: **Fact** means taken from a page opened on 30 September 2026 or from the Figma file itself; **Inference** means a judgment drawn from those facts; **Decision** means the owner's call, or a call made with the owner's delegation, on 30 September.

## Bottom line

Keep the "Evidence in view" structure. It sits in the gap the category leaves open: none of the five direct competitors shows a sample report, sells a fixed-scope one-off audit, or says what it can't control (Fact). Aim the homepage at owner-led service businesses. Prove credibility with the sample report and the stated method, not with growth numbers. For visual identity, the approved Site Upgrade Spec (oxblood, off-white paper, Fraunces headings) stands out in this category; Concept 03's blue does not (Inference).

## Decisions taken on 30 September

- **Audience:** owner-led service businesses. The hero line now reads "MindLeverX helps service businesses see how they appear in AI-generated answers, and what to improve next."
- **No founder block.** The footer carries the same line, then "Levarum, a MindLeverX Company". Nothing else about Levarum was written.
- **Sample report:** built as five US Letter pages for "Example IT Co." (fictional), labelled fictional on every page, with table totals checked. A "See a sample report" button beside the hero CTA opens page 1 in the prototype.
- **FAQ:** six questions added before Contact. The answers come from the paid-pilot draft, the geo-audit skill and Google's guidance, with the Google source cited on the page.
- **Trust section:** the text was rewritten to match the proposed scope in the 14 Sep paid-pilot draft. The Figma agent's first draft promised more than that scope covers.
- **Audit section:** left unrestructured; it is the strongest section.
- **Spec skin:** built as a side-by-side comparison, frames 01S and 02S, using variable modes. The Concept 03 frames 01 and 02 are unchanged.

## Competitor homepages (Fact: opened 30 September 2026)

| Company | Hero headline | Main call to action | Proof shown | Pricing | FAQ | Accent |
|---|---|---|---|---|---|---|
| Profound | "The AI marketing platform to win in ChatGPT" | Get a demo | 5 named logos; customer metrics such as "100x Increase in monthly revenue from AI systems for one client", with no method given | Free trial; Enterprise custom | None | Dark theme (#08090A) |
| Peec AI | "AI search analytics for marketing teams" | Start Free Trial / Talk to Sales | "Trusted by 3000+ brands and agencies", unsourced | $95 / $245 / $495 per month | 6 questions | Near-black |
| Otterly.AI | "We otter know where your brand shows up on AI Search" | Start Free Trial / Book a Demo | "Trusted by 40,000+ Marketing Pros", unsourced; Gartner Cool Vendor | $29 / $189 / $489 per month | About 12 questions | Magenta (#E40072) |
| Scrunch (formerly scrunchai.com) | "Humans don't visit your website anymore— AI does." | Run AI visibility audit (URL box, "See results in 30 seconds") | "364% increase in brand presence for non-branded prompts", no method given | Core $250 per month | None on homepage | Blue (#2F4FFF) |
| AthenaHQ | "Become the Brand AI Trusts" | Get Free Audit (10m) | FAQ claims including "1,561% ROI", no method given | Free tier; Starter $295 per month | 13 questions | Indigo (#4F39F6) |

What this means for MindLeverX (Inference):

- All five sell self-serve dashboards to marketing teams. A marketing team at a software company can do this itself for $95 a month, so a done-for-you audit fits owner-led service businesses better.
- Concept 03's blue (#2146EC) is almost the same as Scrunch's and close to Athena's. Four of five competitors use a light page with one saturated accent. None uses a warm dark accent or serif headings.
- Their proof is unsourced growth numbers. That conflicts with the MindLeverX brand line, "We state what we measure and what we can prove, without the hype or the guarantees."

## Google's current guidance (Fact)

From "Google's Guide to Optimizing for Generative AI Features on Google Search", last updated 10 July 2026:

- "You don't need to create new machine readable files, AI text files, markup, or Markdown to appear in Google Search."
- "Structured data isn't required for generative AI search, and there's no special schema.org markup you need to add."
- "Just because a page meets all requirements, best practices, and complies with the policies, doesn't mean that Google will crawl, index, or serve its content."

Impact (Inference): the geo-audit skill scores structured data under Technical access. For Google, that should be labelled optional, or the audit overstates the gap. The 6 Sep Site Upgrade Spec also leaned on schema and llms.txt.

## Open items

- **Spec-skin hero (unverified):** in frame 01S the hero gradient rendered as solid oxblood, which hid the headline and main button. A fix was sent to Figma's agent (new variables that carry their own transparency), but the browser link dropped before it could be checked. Open 01S: the hero should be a faint wash, not solid red.
- **Conflicting source documents:** the 6 Sep spec assumes a free audit for mid-market B2B software. The 14 Sep pilot draft and later decisions assume a paid audit for service businesses. The spec's copy blocks should be updated before the Wix build.
- **Scope not yet approved:** the trust and FAQ text describe the pilot draft's proposed scope. Update both when scope, price and turnaround are approved.
- **Font weight:** Fraunces weight 500 isn't available in Figma, so the spec skin uses 400 and 600. This is recorded in the Figma build notes.
- **Figma agent reliability:** its reports often didn't match the file, and several rounds were marked done when they weren't. Check every round in a freshly opened tab, because the tab running the agent sometimes stops syncing.

## Sources

- [Profound](https://www.tryprofound.com/), [Peec AI](https://peec.ai/), [Otterly.AI](https://otterly.ai/), [Scrunch](https://scrunch.com/), [AthenaHQ](https://athenahq.ai/) — homepages and pricing pages, opened 30 September 2026
- [Google Search Central — Guide to Optimizing for Generative AI Features](https://developers.google.com/search/docs/fundamentals/ai-optimization-guide)
- [MindLeverX — Paid-pilot offer for review (14 Sep 2026)](https://drive.google.com/file/d/1T70ku9aKlrLM3_AbUdUpPvOOneqhhUzG/view)
- [geo-audit SKILL.md](https://drive.google.com/file/d/1qSkKJ09Ga5VeOtoLfmZfrY_CIRBegXd-/view)
- [MindLeverX Site Upgrade Spec (6 Sep 2026)](https://claude.ai/code/artifact/c18c7c92-925d-4975-bbe2-9cebdc07f700)
