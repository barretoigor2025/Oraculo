import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {JSDOM} from 'jsdom';
import {SCENARIO,initialActors} from '../demo-galerias/scenario.js';
import * as rules from '../demo-galerias/rules.js';
function demo(){
 const dom=new JSDOM(readFileSync(new URL('../demo-galerias/index.html',import.meta.url),'utf8'),{runScripts:'outside-only'}),w=dom.window;
 Object.assign(w,rules,{scene:SCENARIO,initialActors});
 w.ResizeObserver=class{observe(){}};w.setTimeout=fn=>{fn();return 0;};w.crypto.getRandomValues=values=>values.fill(0);
 const source=readFileSync(new URL('../demo-galerias/app.js',import.meta.url),'utf8').replace(/^import .*;$/gm,'');
 w.eval(source+'\nwindow.demo={act:playerAction,next:continueStory,actors:()=>actors,mode:()=>mode,turn:()=>current().id};');
 const d=w.demo;d.untilAction=()=>{for(let i=0;i<30&&d.mode()==='reading';i++)d.next();};d.untilAction();return {dom,w,d};
}
test('Galerias uses four short Kappa guards and preserves human stature',()=>{
 const actors=initialActors(),guards=actors.filter(a=>a.enemy);assert.equal(guards.length,4);
 assert.ok(guards.every(a=>a.hp===10&&a.dx===11&&a.dr===0));
 assert.equal(rules.initiative(actors)[0],'mage');
 const mage=rules.project({...actors[0],depth:40}),guard=rules.project({...guards[0],depth:40});
 assert.ok(Math.abs(mage.height/guard.height-182/125)<1e-10);
 assert.ok(SCENARIO.covers.every(c=>c.aliases.length&&c.blocksSight));
});
test('narrated stealth reaches a real cover only on the consequence and keeps input locked during rolls',()=>{
 const {dom,w,d}=demo();d.act('Me escondo atrás da paliçada');
 assert.equal(w.document.querySelector('#intent').disabled,true);assert.equal(d.actors()[0].cover,null);
 d.untilAction();assert.equal(d.actors()[0].cover,'palisada');
 assert.ok(w.document.querySelector('.actor.cover img').src.endsWith('/mago-cobertura.webp'));
 assert.match(w.document.querySelector('.actor-ui.active').textContent,/cob\./);dom.window.close();
});
test('negotiation can resolve the entry without assuming a prisoner rescue',()=>{
 const {dom,w,d}=demo();d.act('Quero conversar sobre Renkei');d.untilAction();assert.equal(d.mode(),'end');
 assert.ok(d.actors().every(a=>a.hp===a.max));
 assert.match(w.document.querySelector('#narration').textContent,/sem combate/);dom.window.close();
});
test('damage waits for its consequence; allies follow the player in initiative',()=>{
 const {dom,w,d}=demo(),guard=d.actors().find(a=>a.id==='e1');d.act('Lanço fogo no kappa 1');
 assert.equal(guard.hp,10);d.next();assert.equal(guard.hp,10);d.next();assert.equal(guard.hp,10);
 d.next();assert.equal(guard.hp,9);d.next();d.next();assert.equal(d.turn(),'archer');
 assert.equal(w.document.querySelector('#intent').disabled,true);dom.window.close();
});
