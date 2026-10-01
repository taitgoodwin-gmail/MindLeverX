import test from 'node:test';
import assert from 'node:assert/strict';
import {createEnquiryHandler, sendGmail, validateEnquiry} from '../lib/enquiry.mjs';
import endpoint from '../api/enquiry.js';

const env = {MLX_ENQUIRY_ENABLED:'true', MLX_GOOGLE_CLIENT_ID:'test-id', MLX_GOOGLE_CLIENT_SECRET:'test-secret', MLX_GOOGLE_REFRESH_TOKEN:'test-refresh', MLX_ENQUIRY_TO:'private@example.test', MLX_GMAIL_FROM:'sender@example.test'};
const input = {name:'Example Person', email:'visitor@example.test', website:'https://example.test', message:'How should we scope a review?', fax:''};
const request = (value=input, headers={}, method='POST') => new Request('https://mindleverx.com/api/enquiry', {method, headers:{origin:'https://mindleverx.com','content-type':'application/json',accept:'application/json',...headers},...(method==='POST'?{body:JSON.stringify(value)}:{})});

test('public endpoint is separate and fails closed without configuration', async () => {
 assert.equal((await endpoint.fetch(request())).status,503);
 for (const missing of Object.keys(env)) {
  const config={...env}; delete config[missing];
  const handler=createEnquiryHandler({env:config,send:()=>assert.fail('must not send')});
  assert.equal((await handler(request())).status,503);
 }
});
test('rejects wrong method, cross-origin and unsupported content before sending', async () => {
 const handler=createEnquiryHandler({env,send:()=>assert.fail('must not send')});
 assert.equal((await handler(request(input,{},'GET'))).status,405);
 assert.equal((await handler(request(input,{origin:'https://attacker.test'}))).status,403);
 assert.equal((await handler(request(input,{origin:''}))).status,403);
 assert.equal((await handler(request(input,{'content-type':'text/plain'}))).status,415);
});
test('valid enquiry uses fixed configuration and returns acceptance without private addresses', async () => {
 let received;
 const handler=createEnquiryHandler({env,send:async (value,config)=>{received={value,config};}});
 const response=await handler(request());
 assert.equal(response.status,202); assert.equal(response.headers.get('cache-control'),'no-store');
 const body=await response.text(); assert.match(body,/"ok":true/); assert.doesNotMatch(body,/private@example|sender@example|test-secret/);
 assert.equal(received.config.MLX_ENQUIRY_TO,env.MLX_ENQUIRY_TO); assert.equal(received.value.email,input.email);
});
test('invalid fields, header injection, recipient override, bots and excessive input never send', async () => {
 const handler=createEnquiryHandler({env,send:()=>assert.fail('must not send')});
 for (const patch of [{email:'a@example.test\r\nBcc:other@example.test'}, {name:'test\nBcc:other@example.test'}, {to:'other@example.test'}, {fax:'spam'}, {website:'javascript:alert(1)'}, {message:''}, {message:'x'.repeat(3001)}, {name:[]}, {website:'https://user:pass@example.test'}]) {
  assert.equal((await handler(request({...input,...patch}))).status,400);
 }
 assert.equal((await handler(request(null))).status,400);
 assert.equal((await handler(request({message:'x'.repeat(25000)}))).status,400);
});
test('limits repeat submissions including concurrent requests and recovers after window', async () => {
 let time=100000, sent=0, release;
 const handler=createEnquiryHandler({env,now:()=>time,send:()=>{sent++; return new Promise(resolve=>{release=resolve;});}});
 const first=handler(request());
 // Allow request parsing to settle before issuing a duplicate.
 await new Promise(resolve=>setImmediate(resolve));
 assert.equal((await handler(request())).status,429); release(); assert.equal((await first).status,202);
 time+=60001; const next=handler(request()); await new Promise(resolve=>setImmediate(resolve)); release();
 assert.equal((await next).status,202); assert.equal(sent,2);
});
test('provider failure is not success, hides errors and prevents immediate retry', async () => {
 const handler=createEnquiryHandler({env,send:async()=>{throw new Error('SECRET');}});
 const response=await handler(request()); assert.equal(response.status,502);
 assert.doesNotMatch(await response.text(),/SECRET/); assert.equal((await handler(request())).status,429);
});
test('native form submission gets an accessible HTML response; duplicate fields fail', async () => {
 const handler=createEnquiryHandler({env,send:async()=>{}});
 const make=body=>new Request('https://mindleverx.com/api/enquiry',{method:'POST',headers:{origin:'https://mindleverx.com','content-type':'application/x-www-form-urlencoded'},body});
 assert.equal((await handler(make(new URLSearchParams({...input}).toString()+'&email=other@example.test'))).status,400);
 const response=await handler(make(new URLSearchParams(input)));
 assert.equal(response.status,202); assert.match(response.headers.get('content-type'),/text\/html/);
 assert.match(await response.text(),/<h1>Thank you/);
});
test('Gmail transport encodes Unicode safely and uses Reply-To without recipient injection', async () => {
 const calls=[];
 await sendGmail(validateEnquiry({...input,name:'Zoë',message:'Hello <script> & café'}),env,async (url,options)=>{
  calls.push({url,options}); return calls.length===1?Response.json({access_token:'access'}):Response.json({id:'message-id'});
 });
 assert.equal(calls.length,2); assert.equal(new URLSearchParams(calls[0].options.body).get('grant_type'),'refresh_token');
 assert.equal(calls[1].url,'https://gmail.googleapis.com/gmail/v1/users/me/messages/send');
 const mime=Buffer.from(JSON.parse(calls[1].options.body).raw,'base64url').toString();
 assert.match(mime,/To: private@example.test\r\nReply-To: visitor@example.test/);
 const [headers,body]=mime.split('\r\n\r\n'); assert.doesNotMatch(headers,/Zoë|script/);
 assert.match(Buffer.from(body,'base64').toString(),/Zoë/); assert.match(Buffer.from(body,'base64').toString(),/café/);
});
test('Gmail rejects failed authorization, send failures and ambiguous success without retries', async () => {
 for (const responses of [[Response.json({error:'denied'},{status:401})],[Response.json({access_token:'access'}),Response.json({error:'failed'},{status:500})],[Response.json({access_token:'access'}),Response.json({})]]) {
  let count=0;
  await assert.rejects(()=>sendGmail(input,env,async()=>responses[count++]));
  assert.equal(count,responses.length);
 }
});
