import test from 'node:test';
import assert from 'node:assert/strict';
import {cp,mkdir,mkdtemp,rm,writeFile,appendFile,symlink} from 'node:fs/promises';
import {tmpdir} from 'node:os';
import path from 'node:path';
import {spawnSync} from 'node:child_process';
import {fileURLToPath} from 'node:url';
const root=fileURLToPath(new URL('../../',import.meta.url));
// Run the real checker in isolated copies; never contaminate the build under review.
const cases=[
 {name:'clean public artifact',pattern:null,mutate:async()=>{}},
 {name:'private data directory',pattern:/only the seven public pages/,mutate:async d=>{await mkdir(path.join(d,'data'));await writeFile(path.join(d,'data','fixture.json'),'Synthetic boundary fixture, not customer data.');}},
 {name:'unlisted nested script',pattern:/explicit public-asset allowlist/,mutate:d=>writeFile(path.join(d,'public-ui','private-fixture.js'),'// synthetic fixture')},
 {name:'symlink disguised as an allowed asset',pattern:/explicit public-asset allowlist/,mutate:async(d,r)=>{const target=path.join(r,'synthetic-source.svg');await writeFile(target,'Synthetic file outside public artifact');await rm(path.join(d,'public-ui','arrow-light.svg'));await symlink(target,path.join(d,'public-ui','arrow-light.svg'));}},
 {name:'enabled intake runtime',pattern:/must not provide an intake endpoint or token/,mutate:d=>writeFile(path.join(d,'runtime.js'),'window.MLX_AUDIT_ENDPOINT = "/api/intake";\nwindow.MLX_LOCAL_PREVIEW = false;\nwindow.MLX_INTAKE_TOKEN = null;\n')},
 {name:'public input collection',pattern:/public pages must not collect input/,mutate:d=>appendFile(path.join(d,'index.html'),'<form><input name="synthetic-input"></form>')},
 {name:'network collection code in a permitted script',pattern:/public asset must be nonempty, local and free of intake code/,mutate:d=>appendFile(path.join(d,'public-ui','explorer.js'),'\nfetch("/api/intake");')},
];
for(const fixture of cases)test(`TC-BOUNDARY: ${fixture.name}`,async()=>{
 const isolated=await mkdtemp(path.join(tmpdir(),'mlx-public-boundary-'));
 try{const dir=path.join(isolated,'public-dist');await cp(path.join(root,'public-dist'),dir,{recursive:true});await mkdir(path.join(isolated,'scripts'));for(const name of['check-public.mjs','check-site.mjs'])await cp(path.join(root,'scripts',name),path.join(isolated,'scripts',name));await fixture.mutate(dir,isolated);
 const run=spawnSync(process.execPath,[path.join(isolated,'scripts/check-public.mjs')],{encoding:'utf8',timeout:15000});assert.ifError(run.error);assert.equal(run.signal,null);const output=run.stdout+run.stderr;
 if(fixture.pattern){assert.equal(run.status,1,output);assert.match(output,fixture.pattern);}else{assert.equal(run.status,0,output);assert.match(output,/Public checks passed/);}
 }finally{await rm(isolated,{recursive:true,force:true});}
});
