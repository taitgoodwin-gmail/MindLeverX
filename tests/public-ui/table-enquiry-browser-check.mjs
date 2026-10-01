/** Build and serve public-dist; use the same env as the other public browser checks.
 * Pass: contextual overflow cue, retained keyboard-readable columns, end-of-report
 * enquiry and return focus at 320/390/1440, no JS and 200% CSS zoom. No email sent.
 */
import assert from 'node:assert/strict';
import {mkdir,writeFile} from 'node:fs/promises';
import path from 'node:path';
const url=process.env.MLX_PUBLIC_URL;if(!url)throw new Error('Set MLX_PUBLIC_URL');
const {chromium}=await import(process.env.PLAYWRIGHT_MODULE||'playwright');
const browser=await chromium.launch({executablePath:process.env.MLX_BROWSER_EXECUTABLE});
const output=process.env.MLX_QA_OUTPUT||'/tmp/mlx-table-enquiry';await mkdir(output,{recursive:true});const results=[];
try{
 for(const javaScriptEnabled of [true,false])for(const width of[320,390,1440]){
  const page=await browser.newPage({javaScriptEnabled,viewport:{width,height:844},reducedMotion:'reduce'});
  const errors=[];page.on('pageerror',e=>errors.push(e.message));await page.goto(url);await page.evaluate(()=>document.fonts.ready);
  if(javaScriptEnabled){await page.locator('#services [data-sample-open]').click();await page.locator('[data-report-page="1"]').waitFor({state:'visible'});}
  for(const zoom of(javaScriptEnabled||width===1440?[1,2]:[1])){
   await page.evaluate(z=>document.body.style.zoom=String(z),zoom);
   for(const n of[2,3]){
    await page.locator('[data-report-link]').nth(n-1).click();const table=page.locator(`[data-report-page="${n}"] .mlx-table-scroll`);const hint=page.locator(`[data-report-page="${n}"] .mlx-table-hint`);
    await table.scrollIntoViewIfNeeded();const overflows=await table.evaluate(e=>e.scrollWidth>e.clientWidth);assert.equal(await hint.isVisible(),overflows);
    assert.equal(await table.getAttribute('aria-describedby'),await hint.getAttribute('id'));
    assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),`overflow: ${width}/${zoom}/${javaScriptEnabled}`);
    if(overflows){await table.focus();await table.evaluate(e=>e.scrollLeft=0);for(let i=0;i<20;i++)await page.keyboard.press('ArrowRight');await page.waitForTimeout(250);assert.ok(await table.evaluate(e=>e.scrollLeft>0));await table.evaluate(e=>e.scrollLeft=e.scrollWidth);assert.ok(await table.evaluate(e=>Math.abs(e.scrollWidth-e.clientWidth-e.scrollLeft)<2));}
    if(n===3){assert.match(await table.innerText(),/MEASURED \(TOOL\)/);assert.match(await table.innerText(),/INFERRED \(SEARCH RESULT\)/);}
    if(javaScriptEnabled&&zoom===1){await table.evaluate(e=>e.scrollLeft=0);if(overflows)await hint.scrollIntoViewIfNeeded();await page.screenshot({path:path.join(output,`table-${n}-${width}.png`)});}
   }
  }
  await page.evaluate(()=>document.body.style.zoom='1');await page.locator('[data-report-link]').nth(4).click();const enquiry=page.locator('.mlx-report-enquiry');await enquiry.scrollIntoViewIfNeeded();const mail=enquiry.locator('a');assert.equal(await mail.innerText(),'connect@mindleverx.com');assert.match(await mail.getAttribute('href'),/^mailto:connect@mindleverx\.com\?subject=/);await mail.focus();assert.equal(await mail.evaluate(e=>document.activeElement===e),true);
  assert.match(await enquiry.innerText(),/Scope, price and timing are agreed before work begins/);
  if(javaScriptEnabled){await page.screenshot({path:path.join(output,`report-enquiry-${width}.png`)});if(process.env.MLX_AXE_PATH){await page.addScriptTag({path:process.env.MLX_AXE_PATH});assert.deepEqual(await page.evaluate(async()=>(await axe.run(document,{runOnly:{type:'tag',values:['wcag2a','wcag2aa','wcag21aa']}})).violations.map(v=>v.id)),[]);}await page.keyboard.press('Escape');await page.locator('#home-view').waitFor({state:'visible'});assert.equal(await page.locator('#services [data-sample-open]').evaluate(e=>document.activeElement===e),true);}
  assert.deepEqual(errors,[]);results.push({width,javaScriptEnabled,zoomLevels:javaScriptEnabled||width===1440?[1,2]:[1],result:'PASS',checks:'both tables: overflow cue matches container, keyboard scrolling, recorded CSS zoom levels, retained evidence/labels; scoped final enquiry; no document overflow',axe:javaScriptEnabled&&process.env.MLX_AXE_PATH?'PASS':'UNRUN'});await page.close();
 }
 await writeFile(path.join(output,'results.json'),JSON.stringify({url,results},null,2));console.log(JSON.stringify(results,null,2));
}finally{await browser.close()}
