# Public editorial assets — 1 October 2026

Source design: [MindLeverX, page 119:544](https://www.figma.com/design/n3nwpdh6OMrqJNSdm9R3od?node-id=119-544). Hero frames 119:557 / 119:641; inspector 121:1057 / 121:1101; three-state component set 121:1044. Read actual screenshots, design context, component text and motion context before implementation.

- `evidence-paths-desktop.svg`: native SVG_STRING export of 119:574, 542×622, 54 paths.
- `evidence-paths-mobile.svg`: native SVG_STRING export of 119:654, 350×335, 54 paths.
- `arrow-editorial.svg`: native export of 120:544, intrinsic 22×22 including stroke bounds.
- The path exports are preserved unchanged as source references and inlined in `homepage.html` so the original paths can animate. Compact layouts display every third mobile path (18 of 54), per the final panel direction; none is redrawn. The two source SVG files are not extra network assets.
- Existing arrow-ink/light exports from the preserved public checkpoint remain intact.

Font sources downloaded 1 October 2026 from the Google Fonts source repository:

- [Barlow Condensed Bold](https://github.com/google/fonts/tree/main/ofl/barlowcondensed)
- [Manrope variable](https://github.com/google/fonts/tree/main/ofl/manrope)
- [IBM Plex Mono Medium](https://github.com/google/fonts/tree/main/ofl/ibmplexmono)
- [Sora variable](https://github.com/google/fonts/tree/main/ofl/sora)

Each complete OFL licence and copyright notice is adjacent and included in the public asset allowlist. Barlow, Manrope and Sora were subset to Latin and relevant punctuation/symbol codepoints and encoded as WOFF2 using FontTools. Their licences declare no reserved font names. IBM Plex declares the reserved name “Plex”; its upstream TTF is shipped **unmodified**, with the original licence. No font service or Figma asset URL is required by the new opening/explorer.

Implementation refinements authorized after the Figma handoff: mobile CTA before artwork; selection instruction before claims; persistent row arrows and separators; selected wording repeated in each readout; contextual email enquiry; 14px evidence labels; 18 mobile curves; container-responsive reflow at 200% CSS zoom. Small text on vermilion uses #151714. Original animation timing is preserved, with one play instead of Figma's exported loop, as explicitly directed; reduced motion shows the settled state. Entry/return dissolve 240ms, claim dissolve 320ms. These refinements should be reconciled into Figma after owner review.
