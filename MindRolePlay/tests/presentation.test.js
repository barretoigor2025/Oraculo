import {test} from 'node:test';
import assert from 'node:assert/strict';
import {JSDOM} from 'jsdom';
import {visibleNpcName,wordTokens,introductionSlides} from '../engine/presentation.js';
import {parseNpcReply} from '../engine/director.js';
import {validateVisualResult,showDiceRoll} from '../engine/dice-visual.js';
import {test3d6} from '../src/gurps.js';
import {createCombat,combatAction} from '../engine/combat.js';
import {CENAS} from '../../public/MindRolePlay/catalogo/kagehama/campanha/roteiro/campaign.js';
test('opening introduces one reachable stranger, preserves every word and uses the bridge deck',()=>{
 const scene=CENAS['kagehama-scene-0'];
 assert.deepEqual(scene.npcsPresentes,['kagehama-npc-0']);
 const slides=introductionSlides(scene);
 assert.equal(slides.length,3);
 assert.equal(slides.map(s=>s.texto).join('\n\n'),scene.textoIntro);
 assert.match(scene.imgExterior,/tablado\.jpg$/);
 assert.doesNotMatch(scene.textoIntro,/Akiho|Kuroda|Tomoe|Sayo|Jiro/);
 for(const slide of slides){const tokens=wordTokens(slide.texto);assert.equal(tokens.join(''),slide.texto);for(const token of tokens)assert.match(token,/^\S+\s*$/u);}
});
test('canonical NPC names stay hidden until actual self introduction, never a stage direction',()=>{
 const npc={nome:'Lady Akiho Senda',publicAlias:'Mulher do leque'};
 assert.equal(visibleNpcName(npc),'Mulher do leque');
 assert.equal(visibleNpcName(npc,true),'Lady Akiho Senda');
 assert.equal(parseNpcReply('[ACAO: Akiho aponta para o homem.] Há corda ali.',{npcName:npc.nome}).revelaNome,undefined);
 assert.equal(parseNpcReply('Meu nome é Akiho Senda. Sou mediadora.',{npcName:npc.nome}).revelaNome,true);
 assert.equal(parseNpcReply('Sou uma viajante.',{npcName:npc.nome}).revelaNome,undefined);
});
test('red die presentation reveals the existing 3d6 result and releases only on Continue',async()=>{
 const dom=new JSDOM('<button id="origin">Rolar</button>',{url:'https://example.test'});
 const oldDocument=globalThis.document,oldMatch=globalThis.matchMedia;
 globalThis.document=dom.window.document;globalThis.matchMedia=()=>({matches:true});
 try{
   const result={...test3d6(12,{random:()=>.45}),skill:'Percepção'},before=JSON.stringify(result);
   assert.equal(validateVisualResult(result),result);
   assert.throws(()=>validateVisualResult({dice:[6,6,6],total:3}),/soma/);
   assert.throws(()=>validateVisualResult({dice:[20],total:20}),/3d6/);
   let ended=false;const pending=showDiceRoll(result).then(()=>{ended=true;});
   await new Promise(r=>setTimeout(r,10));
   assert.ok(document.querySelector('.mind-dice-fallback'));
   assert.equal(document.querySelector('.mind-dice-close').disabled,true);
   await new Promise(r=>setTimeout(r,140));
   assert.equal(document.querySelector('.mind-dice-total').textContent,'9');
   assert.equal(document.querySelectorAll('.mind-dice-face').length,3);
   assert.equal(ended,false);document.querySelector('.mind-dice-close').click();await pending;
   assert.equal(document.querySelector('.mind-dice-overlay'),null);assert.equal(JSON.stringify(result),before);
 }finally{globalThis.document=oldDocument;globalThis.matchMedia=oldMatch;dom.window.close();}
});
test('combat publishes the exact attack roll for animation, without drawing extra dice',()=>{
 const sheet={attributes:{ST:10,DX:12,IQ:10,HT:10},weapon:{skill:12,damage:'1d6',type:'cr'}};
 const b=createCombat({a:{...sheet,nome:'Samurai'}},[{...sheet,nome:'Guarda'}],'bridge',1);
 let draws=0;const next=combatAction(b,{type:'attack',targetId:'enemy-0'},'a',false,()=>{draws++;return .45;});
 assert.equal(draws,3);assert.deepEqual(next.log[0].roll.dice,[3,3,3]);assert.equal(next.log[0].roll.total,9);assert.ok(next.log[0].id);
});
