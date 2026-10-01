# MindLeverX — design rationale and reference map

Reviewed 30 September 2026. This supersedes the previous aesthetic rationale. The live website and original Figma reference are unchanged. The new Figma file is a concept for evaluation, not a validated design or an implemented website.

## The recommendation

Make the homepage a demonstration of MindLeverX's judgment. A visitor should see a buyer question, understand an illustrative answer, inspect a gap in the supporting information, and understand the recommended next action. This makes an unfamiliar advisory service tangible before asking for an enquiry.

The proposed creative direction is **Evidence in view**: a confident editorial opening, an interactive explanatory specimen, and a clearly structured audit preview. The meaning and sequence lead the visual system. A different palette alone would not meet the brief.

## Named references and specific applications

| Reference | What the source actually supports | Application to MindLeverX | Figma construction |
|---|---|---|---|
| **Massimo Vignelli — The Vignelli Canon**, sections on grids, contrasting type sizes and white space. [Primary text, RIT Vignelli Center](https://www.rit.edu/vignellicenter/sites/rit.edu.vignellicenter/files/documents/The%20Vignelli%20Canon.pdf) | Grids organize information; relationships between type and space create hierarchy and continuity. | Use shared alignment across the headline, explanation, evidence and enquiry. Vary section composition while retaining a coherent structure. | Desktop/mobile layout grids, named type styles and nested Auto Layout. Our 12/4-column specification is a project choice, not a prescription from Vignelli. |
| **Dieter Rams — ten principles**, published by Vitsœ. [Primary source](https://www.vitsoe.com/us/about/good-design) | Design should help understanding, serve a purpose, remain honest and remove unnecessary elements. These are industrial-design principles being adapted to a website. | Label the example as illustrative. Explain the limits of GEO. Make every major visual teach something about the service. | Visible sample labels, readable static states, and annotation beside the relevant claim. |
| **Stripe's current website**, directly inspected on this date. [Homepage](https://stripe.com/) | Observed pattern: a commercial outcome is followed by concrete payment and billing interfaces and customer evidence. This observation does not prove conversion causality. | Show an audit finding and recommended action so a buyer can inspect the work. Keep real customer claims separate from examples. | Editable report specimen using actual text and structured rows. |
| **Linear's current website and design team**. [Homepage](https://linear.app/), [UI redesign: Yann-Edern Gillet, Karri Saarinen and team](https://linear.app/now/how-we-redesigned-the-linear-ui) | Observed homepage pattern: product workflows demonstrate the promise. Its redesign account describes reducing visual noise and testing hierarchy across views. | Let visitors switch between the illustrative answer and audit notes. Keep controls subordinate to the content. | An interactive component with Answer/Audit-notes states and desktop/mobile variants. |
| **IBM Carbon Design System — expressive and productive typography**. [Style strategies](https://carbondesignsystem.com/elements/typography/style-strategies/) | Reading/exploration and focused tasks need different typographic treatments; both can coexist in one experience. | Give the opening statement room and scale. Use quieter, compact typography in the example, report and enquiry form. | Named display, heading, body, label and control styles. We adapt the principle; this is not an unmodified Carbon implementation. |
| **Thomas Lowry — Figma UI principles**, and **Miguel Cardona — Figma visual hierarchy**. [UI principles](https://www.figma.com/resource-library/ui-design-principles/), [visual hierarchy](https://www.figma.com/resource-library/what-is-visual-hierarchy/) | Prioritize what the user cares about; sequence detail; use size, spacing, contrast, proximity and alignment deliberately. | Present relevance → explanation → evidence → audit scope → enquiry. Keep the GEO definition visible and place optional detail behind a clear control. | Auto Layout groups, consistent action labels, component variants, and a reading order designed separately for mobile. |

The contemporary craft references are not arbitrary names. Figma published a discussion with **Katie Dill of Stripe, Karri Saarinen of Linear, and Yuhki Yamashita of Figma** about quality, usability and business value: [Craft and beauty](https://www.figma.com/blog/stripe-sessions-linear-figma/). Their discussion motivates attention to details and testing. It does not endorse this concept, prescribe its aesthetics or predict MindLeverX's conversion rate.

## What this changes in the site

1. **Opening:** make the visitor's business question dominant, with an explicit GEO service descriptor. Proposed headline: “Your buyers ask AI. Are you in the answer?” This is copy to test, not a source-derived conclusion.
2. **Signature interaction:** show a fictional IT-support buyer question. Switch to audit notes that connect an observation to its implication and next action. Make the advisory service explicit so the interaction is not mistaken for software or a live AI diagnosis.
3. **GEO explanation:** compare choosing a search result with receiving a synthesized answer. Explain the relationship to SEO and avoid promising inclusion.
4. **Evidence:** show a legible illustrative audit excerpt: unclear audience, unsupported claim and inconsistent service descriptions, each paired with a practical next move. Replace examples with publishable verified evidence when available.
5. **Engagement:** show the three stages of the work and a brief enquiry form. Use MindLeverX and a collective voice; do not invent staff biographies, client logos or results.

## What remains a design hypothesis

The blue/ink/white palette, IBM Plex family, headline wording, exact type scale and section proportions are our proposed art direction. Sources support disciplined hierarchy and appropriate color use; none establishes that blue is intrinsically correct for this business. Keep those choices reversible through variables and styles. Evaluate the composition in grayscale as well as color.

Stripe and Linear are references for explaining complex offerings and interaction craft. Their business models and audiences differ from MindLeverX. Borrow the useful pattern; judge its fit with prospective advisory buyers.

## Specific Figma guidance followed

- [Auto Layout](https://help.figma.com/hc/en-us/articles/360040451373-Guide-to-auto-layout): nested content relationships, adaptable sizing and separate mobile composition.
- [Interactive component variants](https://help.figma.com/hc/en-us/articles/360061175334-Create-interactive-components-with-variants): reusable answer/audit-note states and button behavior.
- [Design tokens](https://www.figma.com/resource-library/design-tokens/): semantic color roles, shared spacing and radius values, and code syntax for handoff.
- [Typography systems](https://www.figma.com/best-practices/typography-systems-in-figma/): shared named text styles rather than one-off formatting.

## How the recommendation should earn acceptance

- Ask representative buyers what MindLeverX does, what GEO means, what the example demonstrates, what an audit delivers and where to enquire. Record confusion; this has not been user-tested yet.
- Test the prototype on desktop and mobile, including longer copy and error states. Confirm that the example is understood as an illustration and the offer as an advisory engagement.
- During implementation, evaluate applicable [WCAG 2.2 AA criteria](https://www.w3.org/TR/WCAG22/) with automated and manual checks.
- Use [Google Lighthouse](https://developer.chrome.com/docs/lighthouse/overview) for implementation diagnostics and [Core Web Vitals](https://web.dev/articles/vitals) for loading, responsiveness and stability. Good field thresholds are LCP ≤2.5 seconds, INP ≤200 ms and CLS ≤0.1 at the 75th percentile. A Figma mockup cannot pass those web-runtime checks.
- There is no demonstrated “top 1%” ranking for this work. Evaluate clarity, distinction, credibility, task success and implemented quality separately.

## Current artifact

[MindLeverX — Reimagined / Evidence in View](https://www.figma.com/design/n3nwpdh6OMrqJNSdm9R3od) contains native editable foundations and a desktop/mobile concept. The enquiry form is a visual specification, not a connected submission form. No website release is part of this design pass.

Verified in the file: 48 variables, 12 text styles, three component sets containing 13 variants, native text/vector layouts, desktop and mobile frames, and a source-to-decision board. Section-link and answer/audit-note reactions are configured. Visual review and a text-bounds check found no remaining text overflow. Prototype usability has not been tested with buyers; the enquiry submission and legal navigation are outside this prototype's interactive scope.
