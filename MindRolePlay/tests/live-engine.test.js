import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import { appendBeats, appendPlayerBeat, beatKey, logSequence, conversationState, LOG_LIMIT } from '../engine/conversation.js';
import { parseNpcReply, buildNpcPrompt } from '../engine/director.js';
import { createCombat, combatAction, availableDefense, injuryFromDamage, rollDamage } from '../engine/combat.js';
import { derivedStats, skillLevel, conditionModifier, test3d6 } from '../src/gurps.js';
import { newId } from '../engine/identity.js';
const action=(id,who='a')=>({id,tipo:'jogador',authorId:who,oradorNome:who,texto:'Olá',ts:1});
test('read receipts remain monotonic when log rolls past retention limit',()=>{
 let n={};for(let i=0;i<LOG_LIMIT+25;i++)n={...n,...appendBeats(n,[{id:String(i),tipo:'npc'}])};
 assert.equal(n.dialogo.length,LOG_LIMIT);assert.equal(logSequence(n.dialogo),LOG_LIMIT+25);
 assert.equal(n.dialogo[0].seq,26);
 const dedupe=appendBeats(n,[n.dialogo.at(-1)]);assert.equal(dedupe.dialogueSeq,n.dialogueSeq);
});
test('pass, satisfied, reengagement and return preserve the active conversation queue',()=>{
 const log=[action('1'),{id:'2',tipo:'npc'},{id:'3',tipo:'controle',authorId:'b',controle:'passar'}];
 assert.equal(conversationState(log,['a','b']).turn,'a');
 log.push({id:'4',tipo:'controle',authorId:'a',controle:'satisfeito'});
 assert.equal(conversationState(log,['a','b']).turn,'b');
 log.push({id:'5',tipo:'npc',oradorNome:'Akiho',reengajar:'a'});
 assert.equal(conversationState(log,['a','b']).invitations.a,'Akiho');
 assert.equal(conversationState(log,['a','b']).status.a,'satisfeito');
 log.push({id:'6',tipo:'controle',authorId:'a',controle:'voltar'});
 assert.equal(conversationState(log,['a','b']).status.a,'ativo');
 assert.equal(conversationState([],['a','b'],{a:'satisfeito'}).turn,'b');
});
test('a requested test belongs to one player and survives reconnect without rerolling',()=>{
 const request={id:'req',tipo:'npc',oradorId:'akiho',pedidoTeste:{playerId:'a',skill:'Diplomacia',modifier:-2,reason:'Pedir informação protegida'}};
 const room={narration:{dialogo:[request]}};
 assert.equal(conversationState(room.narration.dialogo,['a','b']).pendingTest.requestId,'req');
 assert.throws(()=>appendPlayerBeat(room,action('b','b'),['a','b']),/pendente/);
 const rolled={...action('roll'),testeDe:'req',roll:test3d6(12,{random:()=>0})};
 assert.equal(appendPlayerBeat(room,rolled,['a','b']).dialogo.at(-1).roll.total,3);
});
test('NPC markers are bounded, hidden from dialogue, and cannot invent player identities',()=>{
 const reply=parseNpcReply('Não sem garantia. [PEDE_TESTE: Diplomacia | -99 | Requer confiança] [REENGAJA: ghost]',{playerId:'a',playerIds:['a','b']});
 assert.equal(reply.pedidoTeste.modifier,-10);assert.equal(reply.reengajar,undefined);assert.equal(reply.texto,'Não sem garantia.');
 assert.equal(parseNpcReply('Observei isso. [PEDE_TESTE: IQ | 0 | reação]',{playerId:'a',allowTest:false}).pedidoTeste,undefined);
});
test('runtime NPC prompt includes scene direction, all speakers and the actual mechanical result',()=>{
 const prompt=buildNpcPrompt({npc:{promptSistema:'Akiho protege testemunhas.'},scene:{titulo:'Ponte',textoIntro:'Jiro caiu no canal.'},guide:{danger:'A corrente continua.'},world:{facts:['Jiro resgatado.']},npcMemory:[{pergunta:'Prometo abrigo.'}],players:{a:{nome:'Igor'},b:{nome:'Amigo'}},log:[{oradorNome:'Amigo',texto:'Salvo Jiro',roll:{success:false,total:17}}]});
 for(const text of ['Akiho protege','A corrente continua','Jiro resgatado','Prometo abrigo','Amigo','"success":false'])assert.ok(prompt.includes(text));
});
test('derived Per/Will, condition scope and six-sided dice are used by the actual static page',()=>{
 const sheet={attributes:{ST:12,DX:13,IQ:11,HT:12,Per:14},conditions:[{modifier:-2,skills:['Katana']}],skills:[{name:'Katana',level:13}]};
 assert.throws(()=>test3d6(2),/menor que 3/);
 assert.equal(derivedStats(sheet).speed,6.25);assert.equal(skillLevel(sheet,'Percepção'),14);assert.equal(skillLevel(sheet,'Diplomacia'),null);
 assert.equal(conditionModifier(sheet,'Katana'),-2);assert.equal(conditionModifier(sheet,'Percepção'),0);
 assert.match(newId(),/^[a-f\d-]{36}$/);
});
const players={a:{nome:'Samurai',attributes:{ST:12,DX:14,IQ:11,HT:12},weapon:{name:'Katana',skill:14,damage:'1d6+3',type:'cut'}}};
const enemy={nome:'Guarda',attributes:{ST:10,DX:10,IQ:10,HT:10},maxHp:20,dr:2,weapon:{name:'Bastão',skill:10,damage:'1d6',type:'cr'}};
test('attack -> chosen active defense -> RD/injury is shared and rejects another player',()=>{
 const b=createCombat(players,[enemy],'bridge',1);
 assert.throws(()=>combatAction(b,{type:'attack',targetId:'enemy-0'},'other'),/outro/);
 const attack=combatAction(b,{type:'attack',targetId:'enemy-0'},'a',false,()=>.45);
 assert.equal(attack.phase,'defense'); // 3+3+3 = 9, normal hit.
 assert.equal(attack.fighters[1].hp,20);
 const resolved=combatAction(attack,{type:'defense',defense:'none'},'host',true,()=>.45);
 assert.equal(resolved.fighters[1].hp,14); // 1d6+3 = 6; DR2 => 4; cutting => 6.
 assert.equal(b.fighters[1].hp,20);assert.equal(resolved.turn,1);
});
test('critical hit and critical failure stop for the GURPS table, without inventing effects',()=>{
 let b=createCombat(players,[enemy],'bridge',1);
 const critical=combatAction(b,{type:'attack',targetId:'enemy-0'},'a',false,()=>0);
 assert.equal(critical.phase,'critical');
 assert.throws(()=>combatAction(critical,{type:'defense',defense:'dodge'},'host',true),/fase/);
 const failed=combatAction(b,{type:'attack',targetId:'enemy-0'},'a',false,()=>.999);
 assert.equal(failed.phase,'fumble');
 assert.throws(()=>combatAction(failed,{type:'attack',targetId:'enemy-0'},'a'),/pendente/);
 const resolved=combatAction(failed,{type:'fumble',note:'Sem efeito adicional na tabela.'},'host',true);
 assert.equal(resolved.phase,'action');assert.equal(resolved.turn,1);
});
test('damage can be stopped completely by armor; low HP and All-Out Attack restrict defenses',()=>{
 assert.deepEqual(injuryFromDamage(3,4,'cut'),{penetrating:0,injury:0});
 assert.equal(rollDamage('1d6-4',()=>0).total,0);
 const f={dodge:9,parry:10,block:0,maxHp:12,hp:3,maxFp:12,fp:12};
 assert.equal(availableDefense(f,'dodge'),5);assert.equal(availableDefense({...f,allOut:true},'parry'),0);
 assert.throws(()=>rollDamage('1d20'),/Xd6/);
});
test('incorporeal spirits resist ordinary weapons without granting a fake ritual victory',()=>{
 const b=createCombat(players,[{...enemy,incorporeal:true}],'bridge',2);
 const attack=combatAction(b,{type:'attack',targetId:'enemy-0'},'a',false,()=>.45);
 const defense=combatAction(attack,{type:'defense',defense:'none'},'host',true,()=>.45);
 assert.equal(defense.fighters[1].hp,20);assert.match(defense.log.map(e=>e.text).join('\n'),/espiritual/);
});
// Execute the REAL page's Firebase adapter with a transaction store, including
// leases, retries and stale-scene checks. No provider network or fabricated AI.
test('Firebase adapter keeps guest speech, single host response and cross-scene memory atomic',async()=>{
 let room={hostId:'host',players:{host:{},guest:{}},narration:{cenaId:'bridge',dialogo:[]}};
 let callback;
 const ctx=vm.createContext({console,Date,JSON,Math,Error,Promise,Object,crypto,window:{_mindSceneId:'bridge',dispatchEvent(){}},Event:class{},document:{getElementById:()=>null},localStorage:{getItem:k=>k.includes('fbConfig')?'{}':k.includes('playerId')?'host':'ROOM'},
 newId:()=> 'client-1',initializeApp:()=>({}),getApps:()=>[],getFirestore:()=>({}),doc:()=>({}),onSnapshot:()=>{},updateDoc:()=>{},getDoc:()=>{},appendBeats,appendPlayerBeat,beatKey,conversationState,
 runTransaction:async(db,fn)=>fn({get:async()=>({exists:()=>true,data:()=>structuredClone(room)}),update:(ref,update)=>{for(const [key,value]of Object.entries(update)){const parts=key.split('.');let obj=room;for(const part of parts.slice(0,-1))obj=obj[part]??={};obj[parts.at(-1)]=structuredClone(value);}}})});
 const html=fs.readFileSync(new URL('../screens/narration.html',import.meta.url),'utf8');
 const code=[...html.matchAll(/<script[^>]*>([\s\S]*?)<\/script>/g)].map(m=>m[1]).find(s=>s.includes('runTransaction')) .replace(/^import[^;]+;\n/gm,'');
 vm.runInContext(code,ctx);
 await ctx.window._fbAddDialogue(action('guest-1','guest'));
 assert.equal(room.narration.dialogo.length,1);
 assert.equal(await ctx.window._fbClaimReply('guest-1','bridge'),true);
 const reply={id:'reply:guest-1',tipo:'npc',oradorId:'akiho',texto:'Sim.'};
 assert.equal(await ctx.window._fbResolveDialogue(reply,'guest-1','bridge',{pergunta:'Olá',resposta:'Sim.'}),true);
 assert.equal(room.narration.dialogo.length,2);assert.equal(room.narration.memorias.akiho[0].resposta,'Sim.');
 assert.equal(await ctx.window._fbResolveDialogue(reply,'guest-1','bridge'),false);
 room.narration.cenaId='forest';
 assert.equal(await ctx.window._fbClaimReply('guest-1','bridge'),false);
 await assert.rejects(ctx.window._fbAddDialogue(action('late','host')),/cena mudou/);
 assert.equal(room.narration.dialogo.length,2);
});
