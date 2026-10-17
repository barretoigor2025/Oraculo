import {JSDOM} from 'jsdom';
import fs from 'node:fs';
import vm from 'node:vm';
import assert from 'node:assert/strict';
import {fileURLToPath} from 'node:url';
const root=fileURLToPath(new URL('../../',import.meta.url));
const load=async p=>await import('file://'+root+p);
const {CLASSES_DATA}=await load('public/MindRolePlay/catalogo/kagehama/classes.js');
const {NPCS,INIMIGOS_DATA}=await load('public/MindRolePlay/catalogo/kagehama/loader.js');
const {CENAS,CENAS_ORDEM}=await load('public/MindRolePlay/catalogo/kagehama/campanha/roteiro/campaign.js');
const {NPCS_REGISTRY}=await load('public/MindRolePlay/catalogo/kagehama/npcs_registry.js');
const {NARRACAO_NPCS,NARRACAO_FLUXO}=await load('public/MindRolePlay/catalogo/kagehama/narracao.js');
const {MAPA_IMG,NOS,CAMINHOS}=await load('public/MindRolePlay/catalogo/kagehama/mapa.js');
const {test3d6,resolveSuccessTest}=await load('public/MindRolePlay/gurps.js');
const mocks={CLASSES_DATA,NPCS,INIMIGOS_COMPLETO:INIMIGOS_DATA,CENAS,CENAS_ORDEM,NPCS_REGISTRY,_dialNpcs:NARRACAO_NPCS,NARRACAO_FLUXO,MAPA_NOS:NOS,MAPA_CAMINHOS:CAMINHOS,MAPA_IMG,NOS,CAMINHOS,test3d6,resolveSuccessTest,MAPAS_BATALHA:{},DN_CLASSES_DATA:{},DN_PERSONAGENS:[],DN_REGRAS:[],DN_CENARIOS:[],FANTASMA_CLASSES:{},FANTASMA_NPCS:[],FANTASMA_INIMIGOS:[],FANTASMA_CENARIOS:[]};
function dom(html){const d=new JSDOM(html,{url:'https://example.test/Oraculo/MindRolePlay/index.html',runScripts:'outside-only'});d.window.HTMLCanvasElement.prototype.getContext=()=>new Proxy({measureText:()=>({width:10})},{get:(t,p)=>t[p]||(()=>{})});d.window.requestAnimationFrame=()=>0;d.window.ResizeObserver=class{observe(){}};d.window.alert=()=>{};d.window.confirm=()=>true;return d;}
{
 const d=dom(fs.readFileSync(root+'MindRolePlay/index.html','utf8')),w=d.window;
 Object.assign(w,{...mocks,CLASSES:Object.fromEntries(Object.entries(CLASSES_DATA).map(([id,c])=>[id,{...c,name:c.nome}])),standeeUrl:id=>CLASSES_DATA[id].standee,retratoUrl:id=>CLASSES_DATA[id].portrait,firebaseApp:{options:{}},joinRoom:async()=>{},listenRoom:()=>()=>{},saveRoom:async()=>{},startNarration:async()=>{},startSimulation:async()=>{}});
 const entry=fs.readFileSync(root+'MindRolePlay/src/oraculoEntry.js','utf8').replace(/^import .*;\n/gm,'');
 vm.runInContext(entry,d.getInternalVMContext());
 const pid=w.localStorage.getItem('mindRolePlay.playerId'); assert.ok(pid);
 w.document.querySelector('#btn-online').click();assert.equal(w.document.querySelectorAll('.isc-slot-card').length,4);
 w.document.querySelector('.isc-slot-card.empty').click();assert.equal(w.document.querySelectorAll('.isc-cls-chip').length,12);
 w.document.querySelector('#isc-nome').value='Igor Samurai';w.document.querySelector('[data-class="samurai"]').click();
 w.document.querySelector('#btn-criar-personagem').click();
 assert.ok(w.document.querySelector('#isc-lobby').classList.contains('active'));
 assert.equal(w.localStorage.getItem('mindRolePlay.playerId'),pid);
 const sheet=JSON.parse(w.localStorage.getItem('mindRolePlay.characters'))[0];assert.equal(sheet.name,'Igor Samurai');assert.equal(sheet.classId,'samurai');assert.ok(sheet.id);
 assert.equal(w.localStorage.getItem('oraculo.characters'),null);assert.equal(w.localStorage.getItem('oraculo.playerId'),null);
 console.log('PASS original entry -> four slots -> 12 gender/class options -> create -> lobby; stable isolated player ID');
 d.window.close();
}
{
 const html=fs.readFileSync(root+'public/MindRolePlay/catalog.html','utf8'),d=dom(html);Object.assign(d.window,mocks);
 const scripts=[...html.matchAll(/<script[^>]*>([\s\S]*?)<\/script>/g)].map(m=>m[1]).filter(s=>s.includes('import { NPCS'));
 const source=scripts[0].replace(/^import .*;\n/gm,'');
 vm.runInContext(source,d.getInternalVMContext());
 console.log('PASS original catalogue boots with Kagehama dataset');
 for(const tab of ['npcs','inimigos','cenarios','roteiro','checklist']){
   const button=d.window.document.querySelector(`[data-tab="${tab}"]`);if(button)button.click();
 }
 console.log('PASS catalogue tabs rendered');d.window.close();
}
// Syntax check every inline script, including inactive branches not included by Vite.
for(const file of ['narration.html','mapa.html','catalog.html']){
 const html=fs.readFileSync(root+'public/MindRolePlay/'+file,'utf8');
 for(const [i,m]of [...html.matchAll(/<script[^>]*>([\s\S]*?)<\/script>/g)].entries()){
  const code=m[1].replace(/^import[^;]+;\n/gm,'');
  new vm.Script(code,{filename:file+':'+i});
 }
 console.log('PASS static page script syntax: '+file);
}

// Firestore contract smoke: same player across reconnects, distinct players with
// the same display name, explicit host, no reset of a started campaign.
{
 const records=new Map(),storage=new Map([['mindRolePlay.playerId','host'],['mindRolePlay.character',JSON.stringify({id:'sheet-a'})]]);
 const context=vm.createContext({console,Date,JSON,Number,Object,Error,localStorage:{getItem:k=>storage.get(k)||null},
   db:{},isFirebaseConfigured:true,CLASSES:CLASSES_DATA,
   doc:(db,collection,id)=>({collection,id}),
   runTransaction:async(db,fn)=>fn({get:async ref=>({exists:()=>records.has(ref.id),data:()=>structuredClone(records.get(ref.id))}),
     set:(ref,data)=>records.set(ref.id,structuredClone(data)),update:(ref,data)=>records.set(ref.id,{...records.get(ref.id),...structuredClone(data)})}),
 });
 const src=fs.readFileSync(root+'MindRolePlay/src/oraculoRooms.js','utf8').replace(/^import .*;\n/gm,'').replace(/^export /gm,'');
 vm.runInContext(src,context);
 await context.joinRoom('ABCDE','host',{name:'Igor',classId:'samurai'},true);
 await context.joinRoom('ABCDE','guest',{name:'Igor',classId:'shinobi'},false);
 assert.equal(Object.keys(records.get('ABCDE').players).length,2);
 assert.equal(records.get('ABCDE').hostId,'host');
 await context.startNarration('ABCDE');
 const original=structuredClone(records.get('ABCDE').narration);
 await context.joinRoom('ABCDE','host',{name:'Outro nome',classId:'ronin'},false);
 assert.deepEqual(records.get('ABCDE').narration,original);
 assert.equal(records.get('ABCDE').players.host.classId,'samurai');
 assert.equal(records.get('ABCDE').players.host.characterId,'sheet-a');
 await assert.rejects(context.joinRoom('MISSING','guest',{name:'Igor',classId:'shinobi'}),/Sala não encontrada/);
 await assert.rejects(context.joinRoom('ABCDE','late',{name:'Igor',classId:'shinobi'}),/já começou/);
 storage.set('mindRolePlay.playerId','guest');
 await assert.rejects(context.startNarration('ABCDE'),/anfitrião/);
 console.log('PASS room ownership, duplicate names, stable membership, resume without reset and invalid room rejection');
}

// Regression: registry NPCs have no optional curated `cenas` array. Scene
// activation must render a background, every present NPC and the player's art.
{
 const html=fs.readFileSync(root+'public/MindRolePlay/narration.html','utf8'),d=dom(html);
 Object.assign(d.window,mocks);
 d.window.localStorage.setItem('mindRolePlay.playerId','test-hero');
 d.window.localStorage.setItem('mindRolePlay.classId','samurai');
 const source=[...html.matchAll(/<script[^>]*>([\s\S]*?)<\/script>/g)].map(m=>m[1]).find(s=>s.includes('import { NPCS }'))
   .replace(/^import[^;]+;\n/gm,'').replace(/^init\(\);$/m,'');
 vm.runInContext(source,d.getInternalVMContext());
 vm.runInContext(`_cenaAtual='kagehama-scene-0';_lastRoom={players:{'test-hero':{id:'test-hero',nome:'Teste Samurai',classId:'samurai'}}};_dialActivar(_cenaAtual);`,d.getInternalVMContext());
 assert.equal(d.window.document.querySelectorAll('#dial-personagens .dial-npc').length,4);
 assert.equal(d.window.document.querySelectorAll('#dial-personagens .dial-hero').length,1);
 assert.ok(d.window.document.querySelector('#dial-overlay').classList.contains('ativo'));
 assert.match(d.window.document.querySelector('#dial-cena-bg').style.backgroundImage,/ponte-sete-lanternas/);
 assert.equal(d.window.document.querySelectorAll('#dial-personagens .em-cena').length,0);
 vm.runInContext(`_mindMostrarAtor('npc','kagehama-npc-0');`,d.getInternalVMContext());
 assert.equal(d.window.document.querySelectorAll('.dial-npc.em-cena').length,1);
 vm.runInContext(`_mindMostrarAtor('npc','kagehama-npc-1');_mindMostrarAtor('jogador','test-hero');`,d.getInternalVMContext());
 assert.equal(d.window.document.querySelectorAll('.dial-npc.em-cena').length,1);
 assert.equal(d.window.document.querySelectorAll('.dial-hero.em-cena').length,1);
 assert.ok(d.window.document.querySelector('.dial-npc.em-cena')===d.window.document.querySelectorAll('.dial-npc')[0]);
 console.log('PASS scene activation and sequential actor reveal: no crowd, one NPC and one player');
 // Exercise the actual static-page dialogue engine, including remote NPC target.
 await vm.runInContext(`(async()=>{

   _dialogoLog=[{tipo:'jogador',authorId:_pid,oradorId:_pid,oradorNome:'Teste',texto:'Quem é você?',npcId:'kagehama-npc-0',ts:100}];
   _dialReadIdx=0;_dialAnimBeat=false;_dialAwaitingCont=false;
   await _dialRenderBeat(_dialogoLog[0]);
 })()`,d.getInternalVMContext());
 assert.match(d.window.document.querySelector('#dial-player-card button').textContent,/Continuar/);
 assert.equal(vm.runInContext('_dialReadIdx',d.getInternalVMContext()),0);
 await vm.runInContext(`(async()=>{
   window.testReplies=[];window.testCalls=[];_dialVerificarReacao=async()=>{};
   _dialChamarIA=async(idx,text)=>{testCalls.push(_dialNpcEls[idx].npc.id);return 'Sou Akiho.';};
   window._fbAddDialogue=async beat=>{testReplies.push(beat);_dialogoLog.push(beat);};
   await Promise.all([_dialFluxoTurnos(),_dialFluxoTurnos()]);
 })()`,d.getInternalVMContext());
 assert.equal(d.window.testReplies.length,1);
 assert.equal(d.window.testCalls[0],'kagehama-npc-0');
 d.window.document.querySelector('#dial-player-card button').click();
 assert.equal(vm.runInContext('_dialReadIdx',d.getInternalVMContext()),1);
 await vm.runInContext(`(async()=>{
   _dialogoLog=[{tipo:'jogador',authorId:'guest',texto:'Olá',npcId:'kagehama-npc-1',ts:200}];
   _dialChamarIA=async()=>{throw new Error('Serviço indisponível');};
   await _dialFluxoTurnos();
 })()`,d.getInternalVMContext());
 assert.match(d.window.document.querySelector('#dial-ia-pensando').textContent,/Serviço indisponível/);
 assert.match(d.window.document.querySelector('#dial-ia-pensando button').textContent,/Tentar novamente/);
 await vm.runInContext(`(async()=>{
   _dialChamarIA=async(idx)=>{testCalls.push(_dialNpcEls[idx].npc.id);return 'Sou Ren.';};
   document.querySelector('#dial-ia-pensando button').click();
   await new Promise(resolve=>setTimeout(resolve,0));
 })()`,d.getInternalVMContext());
 assert.equal(d.window.testReplies.length,2);
 assert.equal(d.window.testCalls.at(-1),'kagehama-npc-1');
 assert.equal(d.window.document.querySelector('#dial-ia-pensando').parentElement.id,'dial-overlay');
 vm.runInContext(`window._fbListenRoom=()=>{};
 _lastRoom={players:{'test-hero':{nome:'Teste'},guest:{nome:'Convidado'}},narration:{dialLido:{'test-hero':2,guest:2}}};`,d.getInternalVMContext());
 assert.equal(vm.runInContext('_dialVezPid()',d.getInternalVMContext()),'test-hero');
 vm.runInContext(`_lastRoom.narration.dialLido.guest=1;`,d.getInternalVMContext());
 assert.equal(vm.runInContext('_dialVezPid()',d.getInternalVMContext()),null);
 console.log('PASS explicit Continue, single host response, guest NPC target and retry after AI failure');

 d.window.close();
}
