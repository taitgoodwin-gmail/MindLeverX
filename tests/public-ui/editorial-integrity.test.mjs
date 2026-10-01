import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile,readdir,mkdtemp,mkdir,writeFile,rm} from 'node:fs/promises';
import {tmpdir} from 'node:os';
import path from 'node:path';
import {spawnSync} from 'node:child_process';
const root=new URL('../../',import.meta.url);
const read=name=>readFile(new URL(name,root),'utf8');
test('TC-EXP-09: public routes reconcile the agreed audience and scoped enquiry without free offers',async()=>{
 for(const file of await readdir(new URL('public-dist/',root))){
  if(!file.endsWith('.html'))continue;
  const html=await read('public-dist/'+file);
  assert.doesNotMatch(html,/mid-market B2B SaaS|MID-MARKET B2B SAAS|free (?:GEO|audit)/i,file);
 }
 const about=await read('public-dist/about.html');
 assert.match(about,/Scoped AI visibility audit/);assert.match(about,/scope, price and timing agreed before work begins/);
 const local=await read('dist/about.html');assert.match(local,/mid-market B2B SaaS/,'Local/private integration inputs remain unchanged');
});
test('TC-EXP-10: original vector geometry is preserved and no temporary asset or external font URLs ship',async()=>{
 const html=await read('site/public-ui/homepage.html');const css=await read('site/public-ui/editorial.css');
 for(const viewport of ['desktop','mobile']){
  const svg=await read(`site/public-ui/evidence-paths-${viewport}.svg`);
  const paths=[...svg.matchAll(/<path[^>]+>/g)].map(m=>m[0]);assert.equal(paths.length,54);
  for(const p of paths)assert.ok(html.includes(p),'Every original vector path remains unaltered');
 }
 assert.doesNotMatch(html+css,/fonts\.googleapis|fonts\.gstatic|figma\.com\/api\/mcp\/asset/);
 assert.match(css,/\.mobile-paths path:not\(:nth-child\(3n\+1\)\)/);
 for(const font of ['barlow-condensed-bold','manrope','ibm-plex-mono-medium','sora'])assert.match(await read(`site/public-ui/${font}-OFL.txt`),/SIL OPEN FONT LICENSE/);
});
test('TC-EXP-11: editorial lint accepts honest fictional provenance and rejects missing labels/off-palette colours',async()=>{
 const folder=await mkdtemp(path.join(tmpdir(),'mlx-lint-'));const dir=path.join(folder,'public-ui');await mkdir(dir);
 const file=path.join(dir,'homepage.html');const source=await read('site/public-ui/homepage.html');
 const lint=()=>spawnSync(process.execPath,[new URL('site/token-lint.js',root).pathname,file],{encoding:'utf8'});
 try{await writeFile(file,source);assert.equal(lint().status,0);await writeFile(file,source.replaceAll('ILLUSTRATIVE, NOT A MODEL RESPONSE',''));assert.equal(lint().status,1);await writeFile(file,source+'<style>p {color: #abcdef}</style>');assert.equal(lint().status,1);}finally{await rm(folder,{recursive:true,force:true});}
});
