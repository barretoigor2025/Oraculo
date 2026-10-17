import { test } from 'node:test';
import assert from 'node:assert/strict';
import { pendingAction, nextSpeaker, applyNarration, normalizeNarration, buildNarratorMessages, requestNarration } from '../src/narratorEngine.js';
import { resolveSuccessTest } from '../src/gurps.js';
const base = () => ({scene:{id:'bridge',presentNpcIds:['akiho','ren']},players:[{id:'a'},{id:'b'}],actionCycle:{number:1,requiredPlayerIds:['a','b']},messages:[]});
const act = {id:'act-a',type:'player-action',playerId:'a',cycle:1,sceneId:'bridge',text:'Akiho, quem você está protegendo?'};
test('NPC responds after an individual speech, before the second player acts',()=>{
  const room=base(); assert.equal(nextSpeaker(room),'a'); room.messages.push(act);
  assert.equal(nextSpeaker(room),null); assert.equal(pendingAction(room).id,act.id);
  const next=applyNarration(room,act,[{speakerId:'akiho',text:'As testemunhas. Por quê?'}]);
  assert.equal(nextSpeaker(next),'b'); assert.equal(pendingAction(next),undefined);
  assert.equal(next.messages[1].replyTo,act.id);
  assert.throws(()=>applyNarration(next,act,[{speakerId:'ren',text:'Duplicata.'}]));
});
test('multiple NPCs speak in order and share a single atomic action response',()=>{
  const room=base();room.messages.push(act);
  const next=applyNarration(room,act,[{speakerId:'akiho',text:'As testemunhas.'},{speakerId:'ren',text:'São assuntos do conselho.'}]);
  assert.equal(next.messages.length,3);assert.equal(next.displayMessageId,next.messages[1].id);
  assert.equal(next.messages[2].speakerId,'ren');
});
test('persistent memory preserves absent NPCs and rejects foreign IDs and model stat changes',()=>{
  const room=base();room.messages.push(act);room.worldState={npcs:{sayo:{memory:'Prometeram abrigo.'}}};
  const next=applyNarration(room,act,[{speakerId:'akiho',text:'Lembro da promessa.'}],{summary:'A ponte continua ameaçada.',npcs:{akiho:{memory:'A prometeu proteger a testemunha.',hp:100},intruder:{memory:'Não estava aqui.'}}});
  assert.equal(next.worldState.npcs.sayo.memory,'Prometeram abrigo.');assert.equal(next.worldState.npcs.akiho.hp,undefined);
  assert.equal(next.worldState.npcs.intruder,undefined);assert.equal(room.worldState.npcs.akiho,undefined);
});
test('invalid responses and stale scenes do not advance the game',()=>{
  assert.throws(()=>normalizeNarration({lines:[{speakerId:'ghost',text:'Oi'}]},['akiho']));
  assert.throws(()=>normalizeNarration({lines:[]},['akiho']));
  assert.throws(()=>normalizeNarration({lines:[{speakerId:'narrator',text:''}]},[]));
  const room=base();room.messages.push(act);room.scene.id='forest';
  assert.throws(()=>applyNarration(room,act,[{speakerId:'akiho',text:'Não deve ser salva.'}]));
});
test('prompt includes prior witnesses, memory, result and each present NPC profile',()=>{
  const room=base();room.messages.push({...act,dice:[1,2,3],success:true});room.worldState={summary:'Jiro foi salvo.'};
  const messages=buildNarratorMessages({story:'Kagehama',npcs:[{id:'akiho',behaviorProfile:{voice:'Formal',secret:'Cópia do tratado'}}]},room,room.messages[0]);
  assert.match(messages[0].content,/Jiro foi salvo/);assert.match(messages[0].content,/Cópia do tratado/);
  assert.match(messages[1].content,/"dice":\[1,2,3\]/);
});
test('API request uses structured output and propagates provider errors without fabricated fallback',async()=>{
  const result=await requestNarration({key:'test-only',messages:[],fetcher:async(url,options)=>{
    assert.equal(JSON.parse(options.body).response_format.type,'json_object');
    return {ok:true,json:async()=>({choices:[{message:{content:'{"lines":[{"speakerId":"ren","text":"Não."}]}'}}]})};
  }}); assert.equal(result.lines[0].speakerId,'ren');
  await assert.rejects(requestNarration({key:'test-only',messages:[],fetcher:async()=>({ok:false,json:async()=>({error:{message:'Sem quota'}})})}),/Sem quota/);
});
test('all 216 GURPS rolls obey automatic success/failure and critical thresholds',()=>{
  for(let skill=3;skill<=22;skill++)for(let a=1;a<=6;a++)for(let b=1;b<=6;b++)for(let c=1;c<=6;c++){
    const total=a+b+c,r=resolveSuccessTest({dice:[a,b,c],skill});
    const crit=total<=4||total===5&&skill>=15||total===6&&skill>=16;
    assert.equal(r.success,crit||(total<17&&total<=skill));
    assert.equal(r.criticalSuccess,crit);
    assert.equal(r.criticalFailure,total===18||total===17&&skill<=15||!crit&&total>=skill+10);
  }
  assert.throws(()=>resolveSuccessTest({dice:[1.5,2,3],skill:12}));
});
