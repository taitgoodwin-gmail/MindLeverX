import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import vm from 'node:vm';

const script = await readFile(new URL('../site/shared.js', import.meta.url), 'utf8');
function page(fetcher = async () => new Response(JSON.stringify({ok:true}),{status:202})) {
  let focused = null;
  class Element {
    constructor() { this.attrs = new Map(); this.events = new Map(); this.style = {}; this.dataset = {}; this.childNodes = []; this.hidden = false; this.textContent = ''; const classes = new Set(); this.classList = { add: name => classes.add(name), toggle: name => { if (classes.has(name)) { classes.delete(name); return false; } classes.add(name); return true; }, contains: name => classes.has(name) }; }
    setAttribute(name, value) { this.attrs.set(name, String(value)); }
    getAttribute(name) { return this.attrs.get(name) ?? null; }
    removeAttribute(name) { this.attrs.delete(name); }
    reportValidity() { return true; }
    reset() { this.wasReset = true; }
    hasAttribute(name) { return this.attrs.has(name); }
    addEventListener(name, handler) { this.events.set(name, handler); }
    fire(name, event = {}) { return this.events.get(name)?.(event); }
    focus() { focused = this; }
    append(child) { this.childNodes.push(child); }
    cloneNode() { const result = new Element(); result.textContent = this.textContent; return result; }
  }
  const ids = Object.fromEntries(['menubtn','mobnav','score','tg','tg2','tick','ticker','tkBtn','enquiry'].map(id => [id, new Element()]));
  ids.sendButton = new Element(); ids.sendStatus = new Element();
  ids.sendButton.textContent = 'Send enquiry';
  ids.enquiry.querySelector = selector => selector.startsWith('button') ? ids.sendButton : ids.sendStatus;
  ids.menubtn.setAttribute('aria-expanded','false'); ids.mobnav.hidden = true;
  const topic = new Element(); topic.textContent = 'Brand mentions'; ids.tick.childNodes.push(topic);
  const document = new Element(); document.documentElement = new Element();
  document.getElementById = id => ids[id] || null; document.createElement = () => new Element();
  document.querySelectorAll = selector => selector === '[data-enquiry-form]' ? [ids.enquiry] : [];
  const context = vm.createContext({ document, window:{ location:new URL('http://localhost/index.html') }, URL, localStorage:{getItem(){return null;},setItem(){}}, matchMedia:()=>({matches:false,addEventListener(){}}), setTimeout, clearTimeout, AbortController, fetch:fetcher, FormData:class { constructor(){return new Map([["name","Example Person"],["email","visitor@example.test"],["website","https://example.test"],["message","Scope question"]]);} } });
  vm.runInContext(script, context);
  return { ids, document, focused:()=>focused };
}

test('navigation disclosure labels state, supports native button activation and restores focus on Escape', () => {
  const {ids,document,focused} = page();
  ids.menubtn.focus(); ids.menubtn.fire('click');
  assert.equal(ids.mobnav.hidden,false); assert.equal(ids.mobnav.style.display,'block');
  assert.equal(ids.menubtn.getAttribute('aria-expanded'),'true'); assert.equal(ids.menubtn.getAttribute('aria-label'),'Close menu');
  assert.equal(ids.menubtn.textContent,'Close'); assert.equal(focused(),ids.menubtn);
  document.fire('keydown',{key:'Escape'});
  assert.equal(ids.mobnav.hidden,true); assert.equal(ids.menubtn.getAttribute('aria-expanded'),'false');
  assert.equal(ids.menubtn.textContent,'Menu'); assert.equal(focused(),ids.menubtn);
  ids.menubtn.fire('click'); ids.menubtn.fire('click'); assert.equal(ids.mobnav.hidden,true);
});

test('selecting a same-page destination closes navigation and moves focus out of the hidden menu', () => {
  const {ids,focused} = page();
  ids.menubtn.fire('click');
  ids.mobnav.fire('click',{target:{closest:()=>({href:'http://localhost/index.html#score'})}});
  assert.equal(ids.mobnav.hidden,true); assert.equal(focused(),ids.score); assert.equal(ids.score.getAttribute('tabindex'),'-1');
  ids.menubtn.fire('click');
  ids.mobnav.fire('click',{target:{closest:()=>({href:'http://localhost/method.html'})}});
  assert.equal(ids.mobnav.hidden,true); assert.equal(focused(),ids.menubtn);
});

test('shared theme and ticker controls remain usable with the new navigation', () => {
  const {ids,document} = page();
  ids.tg2.fire('click'); assert.equal(document.documentElement.dataset.theme,'dark');
  assert.equal(ids.tg.getAttribute('aria-label'),'Use light theme');
  const duplicate = ids.tick.childNodes[1];
  assert.equal(duplicate.getAttribute('aria-hidden'),'true'); assert.equal(ids.tick.childNodes[0].textContent,'Brand mentions');
  ids.tkBtn.fire('click'); assert.equal(ids.ticker.classList.contains('paused'),true);
  assert.equal(ids.tkBtn.getAttribute('aria-label'),'Play sample ticker'); assert.equal(ids.tkBtn.getAttribute('aria-pressed'),'true');
  ids.tkBtn.fire('click'); assert.equal(ids.ticker.classList.contains('paused'),false);
  assert.equal(ids.tkBtn.getAttribute('aria-label'),'Pause sample ticker'); assert.equal(ids.tkBtn.getAttribute('aria-pressed'),'false');
});

test('unconfigured enquiry cannot submit or claim success', async () => {
 const {ids} = page(() => {throw new Error('Must not send');});
 let prevented = false;
 await ids.enquiry.fire('submit', {preventDefault(){prevented=true;}});
 assert.equal(prevented,true); assert.equal(ids.enquiry.wasReset,undefined);
});

test('successful enquiry resets only after provider acceptance', async () => {
 let call;
 const {ids} = page(async (url,options) => {call={url,options}; return new Response(JSON.stringify({ok:true}),{status:202});});
 ids.enquiry.setAttribute('action','/api/enquiry');
 await ids.enquiry.fire('submit',{preventDefault(){}});
 assert.equal(call.url,'/api/enquiry'); assert.equal(ids.enquiry.wasReset,true);
 assert.match(ids.sendStatus.textContent,/accepted for email delivery/);
 assert.equal(ids.sendButton.disabled,false); assert.equal(ids.enquiry.hasAttribute('aria-busy'),false);
});

for (const status of [400,429,502,503]) test(`HTTP ${status} preserves enquiry fields and permits recovery`, async () => {
 const {ids} = page(async () => new Response(JSON.stringify({ok:false}),{status}));
 ids.enquiry.setAttribute('action','/api/enquiry');
 await ids.enquiry.fire('submit',{preventDefault(){}});
 assert.equal(ids.enquiry.wasReset,undefined); assert.equal(ids.sendButton.disabled,false);
 assert.doesNotMatch(ids.sendStatus.textContent,/accepted for email delivery/);
});

test('network failure retains form; concurrent clicks do not duplicate a send', async () => {
 let reject, calls=0;
 const {ids} = page(() => {calls++; return new Promise((_,fail)=>{reject=fail;});});
 ids.enquiry.setAttribute('action','/api/enquiry');
 const first=ids.enquiry.fire('submit',{preventDefault(){}});
 await ids.enquiry.fire('submit',{preventDefault(){}});
 assert.equal(calls,1); assert.equal(ids.sendButton.disabled,true);
 reject(new Error('Connection lost')); await first;
 assert.equal(ids.enquiry.wasReset,undefined); assert.match(ids.sendStatus.textContent,/could not confirm/);
 assert.equal(ids.sendButton.disabled,false);
});
