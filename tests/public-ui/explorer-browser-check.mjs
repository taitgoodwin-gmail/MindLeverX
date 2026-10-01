/** TC-EXP-01..08: browser acceptance of the public fictional evidence explorer.
 * Prerequisites: npm run build:public; serve public-dist; set MLX_PUBLIC_URL,
 * PLAYWRIGHT_MODULE and optional MLX_BROWSER_EXECUTABLE / MLX_AXE_PATH.
 * Failure: any assertion, runtime error, failed first-party asset or axe violation.
 * Cleanup: browser contexts close; no email, input collection or remote write.
 */
import assert from 'node:assert/strict';
import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
const url = process.env.MLX_PUBLIC_URL;
if (!url) throw new Error('Supply the exact MLX_PUBLIC_URL under review.');
const { chromium } = await import(process.env.PLAYWRIGHT_MODULE || 'playwright');
const browser = await chromium.launch({ executablePath: process.env.MLX_BROWSER_EXECUTABLE });
const output = process.env.MLX_QA_OUTPUT || '/tmp/mlx-editorial-qa';
await mkdir(output, { recursive: true });
const results = [];
async function accessible(page, label) {
  if (!process.env.MLX_AXE_PATH) return;
  await page.addScriptTag({ path: process.env.MLX_AXE_PATH });
  const violations = await page.evaluate(async () => (await axe.run(document, { runOnly: {type:'tag',values:['wcag2a','wcag2aa','wcag21aa']} })).violations.map(v => ({id:v.id,impact:v.impact,nodes:v.nodes.map(n=>({target:n.target,summary:n.failureSummary}))})));
  assert.deepEqual(violations, [], `${label}: accessibility violations`);
}
try {
  for (const width of [320,390,768,1024,1440]) {
    const context = await browser.newContext({ viewport: {width,height:980}, reducedMotion:'reduce' });
    const page = await context.newPage(); const errors=[];const badAssets=[];
    page.on('pageerror', e=>errors.push(e.message));page.on('response', r=>{if(r.url().startsWith(url)&&r.status()>=400)badAssets.push(`${r.status()} ${r.url()}`)});
    await page.goto(url,{waitUntil:'networkidle'});await page.evaluate(()=>document.fonts.ready);
    assert.deepEqual(await page.evaluate(()=>[...document.fonts].map(f=>f.status)),['loaded','loaded','loaded','loaded']);
    await page.keyboard.press('Tab');assert.equal(await page.locator('.skip-link').evaluate(e=>e===document.activeElement),true);await page.keyboard.press('Enter');
    assert.equal(await page.locator('#main').evaluate(e=>e===document.activeElement),true);
    await accessible(page,`home-${width}`);
    await page.evaluate(()=>{document.activeElement.blur();window.scrollTo(0,0)});
    await page.screenshot({path:path.join(output,`opening-${width}.png`),fullPage:true});
    const opener=page.locator('[data-answer-open]');await opener.focus();await page.keyboard.press('Enter');
    await page.locator('#answer').waitFor({state:'visible'});
    assert.equal(await page.locator('#answer-title').evaluate(e=>e===document.activeElement),true);
    assert.equal(await page.locator('#claim-support').getAttribute('aria-selected'),'true');
    const keys=['local','support','leading'];
    for(const key of keys){
      await page.locator(`#claim-${key}`).click();await page.locator(`#evidence-${key}`).waitFor({state:'visible'});
      assert.equal(await page.locator('[data-evidence]:visible').count(),1);
      assert.equal(await page.locator('[role=tab][aria-selected=true]').getAttribute('id'),`claim-${key}`);
      assert.equal(await page.locator('[role=tab][tabindex="0"]').count(),1);
      assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),`${width} ${key}: horizontal overflow`);
      assert.equal(await page.locator(`#evidence-${key}`).evaluate(e=>getComputedStyle(e).animationName),'none');
      await accessible(page,`${key}-${width}`);
      await page.screenshot({path:path.join(output,`evidence-${key}-${width}.png`),fullPage:true});
    }
    await page.locator('#claim-leading').focus();await page.keyboard.press('Home');await page.locator('#evidence-local').waitFor({state:'visible'});assert.equal(await page.locator('#claim-local').evaluate(e=>e===document.activeElement),true);
    await page.keyboard.press('ArrowDown');await page.locator('#evidence-support').waitFor({state:'visible'});
    await page.keyboard.press('End');await page.locator('#evidence-leading').waitFor({state:'visible'});
    await page.keyboard.press('Tab');assert.equal(await page.locator('#evidence-leading').evaluate(e=>e===document.activeElement),true);
    await page.keyboard.press('Shift+Tab');assert.equal(await page.locator('#claim-leading').evaluate(e=>e===document.activeElement),true);
    assert.equal(await page.locator('#claim-leading').evaluate(e=>getComputedStyle(e).outlineWidth),'3px');
    await page.goBack();await page.locator('#evidence-support').waitFor({state:'visible'});
    await page.goForward();await page.locator('#evidence-leading').waitFor({state:'visible'});
    await page.keyboard.press('Escape');await page.locator('#home-view').waitFor({state:'visible'});assert.equal(await opener.evaluate(e=>e===document.activeElement),true);
    await page.goto(new URL('#answer-local',url).href);await page.locator('#evidence-local').waitFor({state:'visible'});
    await page.locator('.answer-footer [data-sample-open]').click();await page.locator('[data-report-page="1"]').waitFor({state:'visible'});
    await page.keyboard.press('Escape');await page.locator('#home-view').waitFor({state:'visible'});assert.equal(await page.locator('#hero-title').evaluate(e=>e===document.activeElement),true);
    await page.goto(new URL('#answer-invalid',url).href);await page.locator('#sample-error').waitFor({state:'visible'});assert.equal(await page.locator('#sample-error').evaluate(e=>e===document.activeElement),true);
    assert.deepEqual(errors,[]);assert.deepEqual(badAssets,[]);
    results.push({width,result:'PASS',checks:'fonts, all claim states, keyboard/Tab/Shift+Tab/Home/End/arrows, focus, history, Escape, report handoff, invalid route, reduced motion, no overflow/runtime/asset errors',axe:process.env.MLX_AXE_PATH?'PASS':'UNRUN'});await context.close();
  }
  const plain=await browser.newContext({javaScriptEnabled:false,viewport:{width:390,height:844}});const p=await plain.newPage();await p.goto(url);
  assert.equal(await p.locator('[data-evidence]:visible').count(),3);assert.equal(await p.locator('[data-report-page]:visible').count(),5);
  await p.locator('[data-claim=leading]').click();assert.ok(p.url().endsWith('#evidence-leading'));await plain.close();results.push({test:'No JavaScript',result:'PASS',checks:'three readable linked evidence panels and five report pages'});
  const motion=await browser.newContext({viewport:{width:1440,height:980},reducedMotion:'no-preference'});const page=await motion.newPage();await page.goto(url,{waitUntil:'domcontentloaded'});
  const timelines=await page.locator('.opening-art').evaluate(e=>e.getAnimations({subtree:true}).map(a=>({name:a.animationName,duration:a.effect.getTiming().duration,iterations:a.effect.getTiming().iterations})));
  assert.ok(timelines.some(t=>t.name==='draw-evidence'));assert.ok(timelines.every(t=>t.iterations===1));
  await page.waitForFunction(()=>document.querySelector('.opening-art').classList.contains('art-settled'));
  assert.equal(await page.locator('.art-question').evaluate(e=>getComputedStyle(e).opacity),'1');
  await page.locator('[data-answer-open]').click();await page.locator('#answer').waitFor({state:'visible'});
  await page.locator('#claim-local').click();await page.locator('#evidence-local').waitFor({state:'visible'});
  assert.equal(await page.locator('#evidence-local').evaluate(e=>getComputedStyle(e).animationDuration),'0.32s');
  await page.keyboard.press('Escape');await page.locator('#home-view').waitFor({state:'visible'});
  assert.equal(await page.locator('.opening-art').evaluate(e=>e.getAnimations({subtree:true}).length),0);
  await page.evaluate(()=>document.body.style.zoom='200%');assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));
  const hit=await page.locator('[data-answer-open]').evaluate(e=>{e.scrollIntoView();const r=e.getBoundingClientRect();return e.contains(document.elementFromPoint(r.x+r.width/2,r.y+r.height/2))});assert.equal(hit,true);
  await page.waitForFunction(()=>!document.getAnimations().some(a=>a.playState==='running'));
  await page.screenshot({path:path.join(output,'zoom-200.png'),fullPage:true});await motion.close();results.push({test:'Motion and zoom',result:'PASS',checks:'single-play 650–875ms original SVG draws, 2s coordinated timeline, settled return, 320ms claim dissolve, 200% CSS zoom/no occluded CTA',timelines});
  await writeFile(path.join(output,'explorer-results.json'),JSON.stringify({url,testedAt:new Date().toISOString(),results},null,2));console.log(JSON.stringify(results.map(({timelines,...r})=>r),null,2));
} finally {await browser.close();}
