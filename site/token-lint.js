#!/usr/bin/env node
/*
 * token-lint.js · MindLeverX design system v3.0
 *
 * WHY THIS EXISTS
 * DECISIONS.md accepts a knowing consequence: shared chrome is hand-maintained
 * across seven files, "verified by script, not by eye." There was no script for
 * colour. On Jul 28 2026 a design pass introduced two off-palette hexes and used
 * brass as a generic emphasis colour in 15 places — caught by review, not by the
 * author. Eyes fail. This is the check.
 *
 * AUTHORITY
 *   site/style-guide.html v3.0 (md5 a559e5e8e1e5e38be2903bb6f462f019) — token set,
 *     colour roles, and the budget: 70 paper / 20 ink / 8 oxblood / 2 brass.
 *   S-09 — locked token set; no new hexes without derivation and sign-off.
 *   SG 02 / index.html inline comment — brass is never on static metadata.
 *
 * USAGE
 *   node token-lint.js site/*.html
 *   node token-lint.js site-v3.1/*.html
 * Exit 1 on any error. Warnings do not fail the build.
 */

import fs from 'node:fs';

const LIGHT = {
  '#ffffff': 'surface',      '#f7f7f8': 'surface-2',
  '#1d1f23': 'ink',          '#43464b': 'body',        '#63666b': 'muted',
  '#e7e8ea': 'line',
  '#932c21': 'accent',       '#791b11': 'accent-h',
  '#7e5c2a': 'brass',        '#b99056': 'brass-fill',
  '#236436': 'pos',          '#439458': 'pos-fill',
};
const DARK = {
  '#141619': 'surface(dark)', '#1b1e22': 'surface-2(dark)', '#0e1013': 'deep',
  '#f4f5f7': 'ink(dark)',     '#c3c6cb': 'body(dark)',      '#8f9298': 'muted(dark)',
  '#2a2d31': 'line(dark)',
  '#dc5f52': 'accent(dark)',  '#ed7665': 'accent-h(dark)',
  '#62bb78': 'pos(dark)',
  // ticker band literals, documented in style-guide as on-dark text
  '#eef0f2': 'ticker text',   '#c9cbce': 'ticker dim',      '#a9acb2': 'on-dark muted',
  '#8a8d92': 'ticker sample', '#fff': 'white', '#ffffff ': 'white',
};
const ALLOWED = { ...LIGHT, ...DARK };

// Brass is a LIVE SIGNAL. These are the only grounded uses in the system.
const BRASS_OK = [
  /\.ticker\s+\.tag/, /\.ticker\s+\.live/,          // ticker band + pulse
  /\.ld\b/, /\.live\b/,                             // pulse dots
  /\.board\s+\.bh\s+\.s/, /\.measured\s+\.mh\s+\.s/,// SAMPLE chips
  /\.kf\s+\.fk\s+\.s/, /\.rail\s+\.rh\s+\.s/, /\.rail\s+\.re\s+\.en/,
  /\.intbadge/,                                     // INTERNAL badge
  /\.ev\s+\.en/, /\.xh/,                            // engine names in feeds
  /border-top:\s*3px\s+solid\s+var\(--brass-fill\)/,// live-container top edge
  /\.rule\s+\.num/, /\.move\s+\.num/,               // dark-beat numerals
  /\.stat\s+\.d\s+s/,                               // stat source slug
];

let errors = 0, warnings = 0;

for (const file of process.argv.slice(2)) {
  const src = fs.readFileSync(file, 'utf8');
  const lines = src.split('\n');
  const say = (lvl, ln, msg) => {
    console.log(`${lvl === 'ERROR' ? '✕' : '!'} ${file}:${ln}  ${msg}`);
    lvl === 'ERROR' ? errors++ : warnings++;
  };

  // ── 1 · every hex must be a token ──
  lines.forEach((line, i) => {
    if (/^\s*(\/\*|\*|<!--)/.test(line)) return;                 // skip comments
    for (const m of line.matchAll(/#[0-9a-fA-F]{3,8}\b/g)) {
      const hex = m[0].toLowerCase();
      const norm = hex.length === 4
        ? '#' + hex[1] + hex[1] + hex[2] + hex[2] + hex[3] + hex[3]
        : hex;
      if (!ALLOWED[norm] && !ALLOWED[hex]) {
        say('ERROR', i + 1, `off-palette hex ${m[0]} — S-09: no new hexes without derivation and sign-off`);
      }
    }
  });

  // ── 2 · brass only on live signals ──
  lines.forEach((line, i) => {
    if (/^\s*(\/\*|\*|<!--)/.test(line)) return;
    const usesBrass = /--brass|#7e5c2a|#b99056/i.test(line);
    if (!usesBrass) return;
    if (/^\s*--brass/.test(line.trim())) return;                 // the token declaration
    if (BRASS_OK.some(rx => rx.test(line))) return;
    say('ERROR', i + 1, 'brass on something that is not a live signal — SG 02: brass is never on static metadata');
  });

  // ── 3 · the colour budget, 70 paper / 20 ink / 8 oxblood / 2 brass ──
  const count = rx => (src.match(rx) || []).length;
  const ink = count(/var\(--ink\)|#1d1f23/g);
  const ox  = count(/var\(--accent[^)]*\)|#932c21|#791b11/g);
  const br  = count(/var\(--brass[^)]*\)|#7e5c2a|#b99056/g);
  const tot = ink + ox + br || 1;
  const pct = n => Math.round((n / tot) * 100);
  if (pct(br) > 12) say('WARN', 1, `brass is ${pct(br)}% of non-paper colour use — budget allows ~2% of the page; check you are not using it as emphasis`);
  if (pct(ox) > 40) say('WARN', 1, `oxblood is ${pct(ox)}% of non-paper colour use — accent is action and brand only`);

  // ── 4 · claims that must not be made over sample data ──
  if (/·\s*LIVE\b/.test(src) && /SAMPLE/.test(src)) {
    say('ERROR', lines.findIndex(l => /·\s*LIVE\b/.test(l)) + 1,
      'the word LIVE appears on a page carrying SAMPLE data — T1: the site would state something untrue');
  }

  // ── 5 · placebo forms ──
  if (/onsubmit="event\.preventDefault/.test(src)) {
    say('ERROR', lines.findIndex(l => /onsubmit="event\.preventDefault/.test(l)) + 1,
      'inline placebo form handler — a form must transmit or fail honestly (DEF-1, NFR-6)');
  }

  // ── 6 · provenance must accompany sample numbers ──
  if (/SAMPLE/.test(src) && !/PROXY FOR THE LIVE CONSUMER PRODUCTS/i.test(src)) {
    say('ERROR', 1, 'page carries SAMPLE data but not the canonical proxy-caveat sentence (DEF-4, NFR-4)');
  }

  // ── 7 · unsourced statistics ──
  for (const m of src.matchAll(/<s>([^<]*)<\/s>/g)) {
    if (/^\s*(industry|various|analyses)/i.test(m[1])) {
      say('ERROR', 1, `stat sourced to "${m[1].trim()}" — not a citable source (E-E-A-T, NFR-10)`);
    }
  }
}

console.log(`\n${errors} error(s), ${warnings} warning(s)`);
process.exit(errors ? 1 : 0);
