import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import vm from 'node:vm';

const script = await readFile(new URL('../site/shared.js', import.meta.url), 'utf8');
function page() {
  let focused = null;
  class Element {
    constructor() { this.attrs = new Map(); this.events = new Map(); this.style = {}; this.dataset = {}; this.childNodes = []; this.hidden = false; this.textContent = ''; const classes = new Set(); this.classList = { add: name => classes.add(name), toggle: name => { if (classes.has(name)) { classes.delete(name); return false; } classes.add(name); return true; }, contains: name => classes.has(name) }; }
    setAttribute(name, value) { this.attrs.set(name, String(value)); }
    getAttribute(name) { return this.attrs.get(name) ?? null; }
    hasAttribute(name) { return this.attrs.has(name); }
    addEventListener(name, handler) { this.events.set(name, handler); }
    fire(name, event = {}) { return this.events.get(name)?.(event); }
    focus() { focused = this; }
    append(child) { this.childNodes.push(child); }
    cloneNode() { const result = new Element(); result.textContent = this.textContent; return result; }
  }
  const ids = Object.fromEntries(['menubtn','mobnav','score','tg','tg2','tick','ticker','tkBtn'].map(id => [id, new Element()]));
  ids.menubtn.setAttribute('aria-expanded','false'); ids.mobnav.hidden = true;
  const topic = new Element(); topic.textContent = 'Brand mentions'; ids.tick.childNodes.push(topic);
  const document = new Element(); document.documentElement = new Element();
  document.getElementById = id => ids[id] || null; document.createElement = () => new Element();
  const context = vm.createContext({ document, window:{ location:new URL('http://localhost/index.html') }, URL, localStorage:{getItem(){return null;},setItem(){}}, matchMedia:()=>({matches:false,addEventListener(){}}), setTimeout, clearTimeout });
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
