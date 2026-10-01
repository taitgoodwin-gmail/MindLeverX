/** Public cross-page and history regression checks.
 * Build public-dist and serve it locally. Set MLX_PUBLIC_URL and PLAYWRIGHT_MODULE;
 * optional MLX_BROWSER_EXECUTABLE, MLX_QA_OUTPUT, MLX_AXE_PATH.
 * Any failed assertion fails the run. No email is sent or private app started.
 */
import assert from 'node:assert/strict';
import {mkdir, writeFile} from 'node:fs/promises';
import path from 'node:path';
const url = process.env.MLX_PUBLIC_URL;
if (!url) throw new Error('Set MLX_PUBLIC_URL to the public build.');
const {chromium} = await import(process.env.PLAYWRIGHT_MODULE || 'playwright');
const browser = await chromium.launch({executablePath:process.env.MLX_BROWSER_EXECUTABLE});
const output = process.env.MLX_QA_OUTPUT || '/tmp/mlx-journeys-qa';
const results = [];
await mkdir(output, {recursive:true});
try {
  for (const width of [320,390,1440]) {
    const page = await browser.newPage({viewport:{width,height:844},reducedMotion:'reduce'});
    const errors=[];page.on('pageerror',e=>errors.push(e.message));
    await page.goto(url);
    for (const hash of ['#answer', '#answer-local', '#sample-report', '#sample-report-page-3']) {
      await page.goto(new URL(hash,url).href);await page.waitForLoadState('networkidle');
      const heading=hash.startsWith('#answer')?'#answer-title':hash.endsWith('3')?'[data-report-page="3"] h2':'[data-report-page="1"] h2';
      assert.equal(await page.locator(heading).evaluate(e=>e===document.activeElement),true,`${hash}: direct-entry focus`);
    }
    await page.goto(url);
    const opener=page.locator('[data-answer-open]');
    await opener.focus();await page.keyboard.press('Enter');
    await page.locator('#answer').waitFor({state:'visible'});
    await page.goBack();await page.locator('#home-view').waitFor({state:'visible'});
    await page.waitForFunction(()=>document.activeElement===document.querySelector('[data-answer-open]'));
    await page.goForward();await page.locator('#answer').waitFor({state:'visible'});
    assert.equal(await page.locator('#answer-title').evaluate(e=>e===document.activeElement),true);
    const mailbox=page.locator('.answer-enquiry a[href="mailto:connect@mindleverx.com"]');
    assert.equal(await mailbox.innerText(),'connect@mindleverx.com');
    await mailbox.focus();assert.equal(await mailbox.evaluate(e=>e===document.activeElement),true);
    assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));
    if(process.env.MLX_AXE_PATH){await page.addScriptTag({path:process.env.MLX_AXE_PATH});assert.deepEqual(await page.evaluate(async()=>(await axe.run(document,{runOnly:{type:'tag',values:['wcag2a','wcag2aa','wcag21aa']}})).violations.map(v=>v.id)),[]);}
    await page.screenshot({path:path.join(output,`enquiry-${width}.png`),fullPage:true});
    for(const route of ['about.html','method.html','what-is-geo.html','research-hub.html','privacy.html','terms.html']) {
      await page.goto(new URL(route,url).href);
      assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),`${route} at ${width}: overflow`);
      assert.equal(await page.locator('a[href="index.html#score"]').count(),0);
      const links=page.locator('a[href="index.html#sample-report"]');
      if (['privacy.html','terms.html'].includes(route)) continue;
      assert.ok(await links.count()>0,`${route}: report entry`);
      console.log(`Report entry: ${route} at ${width}`);
      await links.last().click();await page.locator('[data-report-page="1"]').waitFor({state:'visible'});
      await page.waitForFunction(()=>document.activeElement===document.querySelector('[data-report-page="1"] h2')).catch(async error=>{console.log('Focus failure',route,width,await page.evaluate(()=>({active:document.activeElement.outerHTML.slice(0,200),hash:location.hash,ready:document.readyState})));throw error;});
      await page.goBack();assert.ok(page.url().endsWith(route));
    }
    assert.deepEqual(errors,[]);results.push({width,result:'PASS',checks:'Back/Forward focus, copyable email, four public-page report entry journeys and two legal-page reflow checks, reflow, no runtime errors',axe:process.env.MLX_AXE_PATH?'PASS':'UNRUN'});await page.close();
  }
  const plain=await browser.newPage({javaScriptEnabled:false,viewport:{width:320,height:844}});
  await plain.goto(new URL('method.html',url).href);await plain.locator('a[href="index.html#sample-report"]').last().click();
  assert.equal(await plain.locator('[data-report-page]:visible').count(),5);
  assert.equal(await plain.locator('.answer-enquiry a[href="mailto:connect@mindleverx.com"]').innerText(),'connect@mindleverx.com');
  results.push({test:'No JavaScript',result:'PASS',checks:'cross-page report anchor reaches five readable pages; copyable inspector mailbox'});await plain.close();
  await writeFile(path.join(output,'journey-results.json'),JSON.stringify({url,results},null,2));console.log(JSON.stringify(results,null,2));
} finally {await browser.close();}
