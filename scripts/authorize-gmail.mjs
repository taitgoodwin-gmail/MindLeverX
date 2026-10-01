// Local, single-use Gmail authorization helper. Never deployed with the website.
import http from 'node:http';
import {readFile,writeFile,rename,chmod} from 'node:fs/promises';
import {randomBytes,createHash,timingSafeEqual} from 'node:crypto';
import path from 'node:path';
import {fileURLToPath} from 'node:url';

const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const redirect='http://127.0.0.1:4350/oauth/callback';
const scope='https://www.googleapis.com/auth/gmail.send';
const input=process.argv[2];
if(!input) throw new Error('Provide the downloaded Google client JSON path.');
const {web:client}=JSON.parse(await readFile(input,'utf8'));
if(client?.project_id!=='mindleverx-website-enquiries' || !client.client_secret || !client.client_id || !client.redirect_uris?.includes(redirect)) throw new Error('Unexpected Google client configuration.');
const state=randomBytes(32).toString('base64url');
const verifier=randomBytes(32).toString('base64url');
const url=new URL('https://accounts.google.com/o/oauth2/v2/auth');
url.search=new URLSearchParams({client_id:client.client_id,redirect_uri:redirect,response_type:'code',scope,
 access_type:'offline',prompt:'consent',state,
 code_challenge:createHash('sha256').update(verifier).digest('base64url'),code_challenge_method:'S256'}).toString();
let consumed=false;
const server=http.createServer(async(req,res)=>{
 const answer=(status,text)=>{res.writeHead(status,{'Content-Type':'text/html; charset=utf-8','Cache-Control':'no-store','Referrer-Policy':'no-referrer','Content-Security-Policy':"default-src 'none'; style-src 'unsafe-inline'; frame-ancestors 'none'"});res.end(`<!doctype html><html lang="en"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>MindLeverX Gmail setup</title><style>body{font:20px/1.5 system-ui;max-width:40rem;margin:10vh auto;padding:24px}</style><h1>MindLeverX Gmail setup</h1><p>${text}</p></html>`);};
 if(req.headers.host!=='127.0.0.1:4350' || req.method!=='GET') return answer(400,'Invalid setup request.');
 const callback=new URL(req.url,redirect);
 if(callback.pathname!=='/oauth/callback') return answer(404,'Use the Google authorization link supplied for this setup.');
 const returned=Buffer.from(callback.searchParams.get('state')||'');
 const expected=Buffer.from(state);
 if(returned.length!==expected.length || !timingSafeEqual(returned,expected) || consumed) return answer(400,'This setup session is invalid or already used.');
 consumed=true;
 try {
  if(callback.searchParams.has('error') || !callback.searchParams.get('code')) throw new Error('Permission was not granted.');
  const response=await fetch('https://oauth2.googleapis.com/token',{method:'POST',redirect:'error',signal:AbortSignal.timeout(15000),headers:{'Content-Type':'application/x-www-form-urlencoded'},body:new URLSearchParams({client_id:client.client_id,client_secret:client.client_secret,code:callback.searchParams.get('code'),redirect_uri:redirect,grant_type:'authorization_code',code_verifier:verifier})});
  const tokens=await response.json();
  if(!response.ok || typeof tokens.refresh_token!=='string' || !tokens.refresh_token || !tokens.scope?.split(' ').includes(scope)) throw new Error('Google did not provide the required authorization.');
  const granted=tokens.scope.split(' ');
  if(granted.some(value=>value!==scope)) throw new Error('Unexpected permissions; configuration was not saved.');
  const file=path.join(root,'.env.local');
  let current=''; try {current=await readFile(file,'utf8');} catch(error){if(error.code!=='ENOENT') throw error;}
  // Preserve the privately configured From/To values; never embed a mailbox in source.
  const values={MLX_GOOGLE_CLIENT_ID:client.client_id,MLX_GOOGLE_CLIENT_SECRET:client.client_secret,MLX_GOOGLE_REFRESH_TOKEN:tokens.refresh_token,MLX_ENQUIRY_ENABLED:'false'};
  const lines=current.split('\n').filter(line=>!Object.keys(values).some(key=>line.startsWith(`${key}=`)));
  for(const [key,value] of Object.entries(values)) {if(/[\r\n]/.test(value)) throw new Error('Invalid credential format.'); lines.push(`${key}=${value}`);}
  const temp=path.join(root,`.env.oauth-${randomBytes(8).toString('hex')}`);
  await writeFile(temp,lines.filter(Boolean).join('\n')+'\n',{mode:0o600,flag:'wx'});await chmod(temp,0o600);await rename(temp,file);
  answer(200,'Google authorization is saved privately on this computer. The website is still disabled while delivery testing and hosting setup are completed. You may close this tab.');
  console.log('Authorization saved privately. Scope: gmail.send. Website sending remains disabled.');
 } catch {answer(400,'Authorization could not be completed. No successful connection is claimed. Return to Codex for the next step.');console.log('Authorization incomplete; no secrets printed.');}
 finally {clearTimeout(expiry);server.close();}
});
const expiry=setTimeout(()=>{server.close();console.log('Authorization session expired; start a new setup session.');},10*60*1000);
server.on('error',()=>{clearTimeout(expiry);console.error('Could not start the loopback setup listener.');process.exitCode=1;});
server.listen(4350,'127.0.0.1',()=>console.log(`Authorize Gmail: ${url.href}`));
