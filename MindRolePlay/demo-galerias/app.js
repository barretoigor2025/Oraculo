import {resolveTest,initiative,project,hasCover} from './rules.js?v=2';
import {readIntent, interpretIntent} from './intent.js?v=2';
const $=id=>document.getElementById(id);
const camera=$('camera'),world=$('world'),input=$('intent');
const measureField=()=>{world.style.setProperty('--field-height',camera.clientHeight+'px');updateCamera();};
import {SCENARIO as scene,initialActors} from './scenario.js?v=1';
let actors=[],turns=[],turnIndex=0,round=1,mode='intro',queue=[],beatIndex=0,afterQueue=null,pages=[],pageIndex=0,generation=0,busy=false,hostile=false,distraction=false;
let aiEnabled=false, pendingRequest=null;
const current=()=>actors.find(a=>a.id===turns[turnIndex]);
const alive=a=>a.hp>0;
const dice=()=>{const values=new Uint32Array(3);crypto.getRandomValues(values);return [...values].map(n=>n%6+1);};
const singleDie=()=>dice()[0];
const test=(skill)=>resolveTest(dice(),skill);
const nearest=(a)=>actors.filter(b=>b.enemy!==a.enemy&&alive(b)).sort((b,c)=>Math.abs(b.x-a.x)-Math.abs(c.x-a.x))[0];

function render(){
 $('actors').replaceChildren();
 for(const actor of actors){
  const p=project(actor),covered=!!actor.cover;
  const el=document.createElement('div');el.className='actor'+(actor.enemy?' enemy':'')+(covered&&actor.id==='mage'?' cover':'')+(!alive(actor)?' dead':'')+(actor.id===current()?.id?' active':'');
  el.dataset.id=actor.id;
  el.style.setProperty('--x',actor.x/12+'%');el.style.setProperty('--ground',100-p.feet+'%');el.style.setProperty('--h',p.height*(covered&&actor.id==='mage'?.62:1)+'%');el.style.setProperty('--z',String(Math.round(1000-actor.depth*5)));
  const image=document.createElement('img');image.src='assets/'+(actor.enemy?'kappa':actor.id==='mage'&&covered?'mago-cobertura':actor.art)+'.webp';image.alt=actor.name;image.draggable=false;el.append(image);
  const label=document.createElement('span');label.className='actor-tag';label.textContent=actor.name+' · '+Math.max(0,actor.hp)+'/'+actor.max;
  const bar=document.createElement('span');bar.className='hp';const fill=document.createElement('i');fill.style.width=Math.max(0,actor.hp/actor.max*100)+'%';bar.append(fill);label.append(bar);el.append(label);
  if(covered||actor.prepared||!alive(actor)){const status=document.createElement('span');status.className='condition';status.textContent=!alive(actor)?'Fora de combate':covered?'Em cobertura':actor.id==='archer'?'Mirando':'Preparado';el.append(status);}
  $('actors').append(el);const hud=document.createElement('div');hud.className='actor-ui'+(actor.enemy?' enemy':'')+(actor.id===current()?.id?' active':'');hud.style.left=actor.x/12+'%';hud.style.bottom=(100-p.feet+p.height*(covered&&actor.id==='mage'?.62:1))+'%';if(covered)label.firstChild.textContent+=' · cob.';hud.append(label);$('actors').append(hud);
 }
 $('order').replaceChildren();for(const id of turns){const a=actors.find(a=>a.id===id);const tag=document.createElement('span');tag.className='order-item'+(a.enemy?' enemy':'')+(a.id===current()?.id?' active':'')+(!alive(a)?' dead':'');tag.textContent=a.short;tag.title=a.name+' · Velocidade '+a.speed+' · DX '+a.dx;$('order').append(tag);}
 $('round').textContent='Rodada '+round;
 const act=mode==='act'&&current()?.id==='mage'&&alive(current());
 input.disabled=!act;input.placeholder=act?'Narre sua ação…':mode==='end'?'Encontro encerrado':mode==='interpreting'?'Interpretando sua ação…':'Acompanhe o lance · toque em Continuar';$('send').disabled=!act;
 $('turn-label').textContent=mode==='end'?'Encontro encerrado':mode==='act'?'Sua vez · narre o que deseja fazer':'Vez de '+(current()?.name||'Narrador')+' · acompanhe os lances';
 updateCamera();
}
function updateCamera(){const left=camera.scrollLeft/camera.scrollWidth*1200,right=(camera.scrollLeft+camera.clientWidth)/camera.scrollWidth*1200;const out=actors.filter(a=>alive(a)&&a.enemy&&(a.x<left||a.x>right)).length;$('offscreen').textContent=out?out+' inimigo(s) fora da visão':'';$('scroll-track').firstElementChild.style.transform='translateX('+(camera.scrollLeft/Math.max(1,camera.scrollWidth-camera.clientWidth)*200)+'%)';}
function paginate(text){const limit=window.innerHeight<660?125:155;pages=[];let chunk='';for(const word of text.split(/\s+/)){if(chunk&&chunk.length+word.length+1>limit){pages.push(chunk);chunk='';}chunk+=(chunk?' ':'')+word;}if(chunk)pages.push(chunk);pageIndex=0;showPage();}
function showPage(){$('narration').textContent=pages[pageIndex]||'';$('page').textContent=pages.length>1?(pageIndex+1)+'/'+pages.length:'';}
function displayRoll(result,label){$('roll').replaceChildren();if(!result)return;for(const n of result.dice){const span=document.createElement('span');span.className='die';span.textContent=n;$('roll').append(span);}const note=document.createElement('span');note.textContent=result.total+'/'+result.skill+' · '+result.outcome;note.title=label||'';$('roll').append(note);}
function play(beats,done){mode='reading';queue=beats;beatIndex=0;afterQueue=done;showBeat();}
function showBeat(){
 const beat=queue[beatIndex];beat.apply?.();render();$('speaker').textContent=beat.speaker||'Narrador';displayRoll(beat.roll,beat.label);paginate(beat.text);$('continue').hidden=false;
 if(beat.roll){const version=generation;busy=true;$('continue').disabled=true;$('roll').classList.add('rolling');setTimeout(()=>{if(version!==generation)return;busy=false;$('roll').classList.remove('rolling');$('continue').disabled=false;},450);}
}
function continueStory(){if(busy||mode!=='reading')return;if(pageIndex<pages.length-1){pageIndex++;showPage();return;}if(beatIndex<queue.length-1){beatIndex++;showBeat();return;}const done=afterQueue;afterQueue=null;queue=[];done?.();}
function waitForMage(message='Os inimigos mantêm suas posições. O que você faz?'){
 mode='act';render();$('speaker').textContent='Sua vez · Mago';displayRoll(null);paginate(message);$('continue').hidden=pages.length<=1;
 // Long prompts may be paged without consuming or changing a turn.
 if(pages.length>1)$('continue').hidden=false;
}
function checkEnd(){if(hostile&&actors.filter(a=>a.enemy&&alive(a)).length<=2){end('Metade da patrulha caiu. Os guardas restantes recuam para avisar Bunkin. A passagem está aberta, mas o alerta alcançará as Galerias. Renkei ainda precisa ser encontrado.');return true;}if(actors.filter(a=>a.enemy).every(a=>!alive(a))){end('A patrulha deixa de bloquear o caminho. O destino dos prisioneiros ainda não foi resolvido.');return true;}if(actors.filter(a=>!a.enemy).every(a=>!alive(a))){end('O grupo foi vencido. Você pode recomeçar pelo menu Sobre.');return true;}return false;}
function end(text){mode='end';render();$('speaker').textContent='Narrador';displayRoll(null);paginate(text);$('continue').hidden=pages.length<=1;}
function nextTurn(){
 if(checkEnd())return;let attempts=0;
 do{turnIndex++;if(turnIndex>=turns.length){turnIndex=0;round++;}attempts++;}while(!alive(current())&&attempts<=turns.length);
 render();if(current().id==='mage')waitForMage('A vez volta para você. As posições, ferimentos e coberturas continuam registrados. Narre sua próxima ação.');else automatedTurn(current());
}
function move(actor,x,depth,cover=null){const distance=Math.abs(x-actor.x),done=distance<=175;actor.x+=Math.sign(x-actor.x)*Math.min(distance,175);actor.depth=depth;actor.cover=done?cover:null;actor.prepared=false;return done;}
function impact(target){const p=project(target),el=document.createElement('span');el.className='impact';el.textContent='✦';el.style.left=target.x/12+'%';el.style.bottom=100-p.feet+p.height*.5+'%';world.append(el);setTimeout(()=>el.remove(),850);}
function attackBeats(attacker,target,{spell=false}={}){
 const prepared=attacker.prepared?attacker.id==='archer'?2:1:0,cover=hasCover(target,attacker,scene.covers),penalty=cover?-4:0;
 const skill=Math.max(3,attacker.skill+prepared+penalty);const hit=test(skill);
 const detail=[prepared?'preparação +'+prepared:'',cover?'cobertura −4 (simplificação)':'',spell?'Aptidão Mágica incluída na perícia':''].filter(Boolean).join('; ');
 const beats=[{speaker:attacker.name,text:spell?'Você reúne energia nos talismãs e lança uma chama espiritual contra '+target.name+'.':attacker.name+' tenta atingir '+target.name+'.',apply:()=>{attacker.prepared=false;if(spell)attacker.fp=Math.max(0,attacker.fp-1);}},
 {speaker:'Teste de ataque',text:'Teste de '+(spell?'magia':'ataque')+': '+hit.total+' em 3d6 contra '+skill+'. '+hit.outcome+'.'+(detail?' '+detail+'.':''),roll:hit,label:detail}];
 if(!hit.success){beats.push({text:'O ataque não alcança o alvo. '+target.name+' mantém sua posição.'});return beats;}
 const defense=test(target.dodge);
 if(!hit.criticalSuccess){beats.push({speaker:target.name,text:target.name+' tenta esquivar: '+defense.total+' contra '+target.dodge+'. '+defense.outcome+'.'+(target.id==='mage'?' Reflexos em Combate está incluído na esquiva.':''),roll:defense});if(defense.success){beats.push({text:target.name+' evita o golpe. Nenhum ferimento é aplicado.'});return beats;}}
 const damage=singleDie()+(spell?0:attacker.enemy?0:2),injury=Math.max(0,damage-target.dr);
 beats.push({speaker:'Consequência',text:'O ataque causa '+damage+' de dano'+(target.dr?' e a proteção absorve '+Math.min(target.dr,damage)+'.':'.')+' '+target.name+' perde '+injury+' PV.',apply:()=>{target.hp=Math.max(0,target.hp-injury);impact(target);}});
 beats.push({text:target.name+(target.hp-injury<=0?' cai e deixa de participar dos próximos turnos.':' permanece na luta. A ordem de iniciativa continua. ')+(spell?' Energia do mago: '+Math.max(0,attacker.fp-1)+' PF.':'' )});
 return beats;
}
function automatedTurn(actor){
 const target=nearest(actor);if(!target){nextTurn();return;}
 const dist=Math.abs(actor.x-target.x);const intro={speaker:'Iniciativa · '+actor.name,text:'É a vez de '+actor.name+' (Velocidade '+actor.speed+'). '+(actor.enemy?'O guarda reage ao estado atual do campo.':'Aliado simulado nesta demonstração.')};
 const range=actor.id==='archer'?560:120;
 if(dist>range){const direction=Math.sign(target.x-actor.x),destination=target.x-direction*90;const confidence=actor.id==='warrior'?' Seu Excesso de Confiança orienta esta decisão na simulação.':'';
  play([intro,{speaker:actor.name,text:actor.name+' avança na direção de '+target.name+'.'+confidence,apply:()=>move(actor,destination,target.depth)}, {text:'O deslocamento termina nesta vez. A posição alcançada permanece no campo; a câmera não se move sozinha.'}],nextTurn);return;
 }
 if(actor.enemy&&target.cover&&round>=2&&singleDie()>=5){play([intro,{speaker:actor.name,text:actor.name+' procura o flanco e contorna o lado exposto da cobertura.',apply:()=>{actor.x=target.x-60;actor.depth=target.depth;}},{text:'A proteção frontal não cobre mais esse ângulo. O inimigo gastou sua ação se reposicionando.'}],nextTurn);return;}
 play([intro,...attackBeats(actor,target)],nextTurn);
}
function endPlayerTurn(){if(hostile)nextTurn();else waitForMage('O que você faz agora?');}
function handleApproach(raw, action, mage, cover){
 if(action.kind==='talk'){
  const result=test(12);
  const outcome=result.success?'O guarda aceita ouvir sua explicação. Ele permite que vocês prossigam até o próximo posto, sob vigilância. Renkei ainda precisa ser localizado.':'O guarda balança a cabeça: “Sem autorização, vocês ficam aqui.” Ele ainda não ataca; negociação e recuo continuam possíveis.';
  play([{speaker:'Sua intenção',text:raw},{speaker:'Diplomacia · prévia',text:'Você tenta negociar a passagem: '+result.total+' contra 12. '+result.outcome+'.',roll:result},{speaker:'Guarda Kappa',text:outcome,apply:()=>{if(result.success){actors.find(a=>a.id==='e1').x=570;actors.find(a=>a.id==='e1').depth=68;}}}],()=>{if(result.success)end('Vocês atravessam a primeira barreira sem combate. A busca pelos prisioneiros continua dentro das Galerias.');else waitForMage('O guarda aguarda. Como você reage à recusa?');});return true;
 }
 if(action.kind==='hide' && cover){
  if(Math.abs(mage.x-cover.behindX)>175){play([{speaker:'Narrador',text:'Você avança discretamente na direção de '+cover.name+', ainda sem alcançar a cobertura.',apply:()=>move(mage,cover.behindX,cover.behindDepth,null)}],endPlayerTurn);return true;}
  const guardSkill=distraction?7:10;
  const stealth=test(12),notice=test(guardSkill),margin=r=>r.skill-r.total;
  const unseen=stealth.success&&(!notice.success||margin(stealth)>margin(notice));
  play([{speaker:'Sua intenção',text:raw},{speaker:'Furtividade',text:'Você tenta se ocultar: '+stealth.total+' contra 12. '+stealth.outcome+'.',roll:stealth},{speaker:'Atenção do guarda',text:'O guarda observa o movimento: '+notice.total+' contra '+guardSkill+'. '+notice.outcome+'.',roll:notice},{speaker:'Consequência',text:unseen?'Você se agacha atrás de '+cover.name+' sem ser visto. Daqui pode tentar passar pelo posto discretamente.':'Você alcança '+cover.name+' e se agacha, mas um guarda percebe o movimento: “Ali! Não deixem passar!” A iniciativa começa.',apply:()=>{move(mage,cover.behindX,cover.behindDepth,cover.id);mage.prepared=unseen;distraction=false;if(!unseen)hostile=true;}}],endPlayerTurn);return true;
 }
 return false;
}
function resolveAction(raw, action) {
 const mage=current();
 if(!action){
  waitForMage('Como você quer agir aqui? Descreva o que pretende fazer e com o que quer interagir.');
  input.value=raw;
  return;
 }
 const cover=scene.covers.find(item=>item.id===action.cover);
 if(action.kind==='distract'){
  if(hostile){waitForMage('Os guardas já estão em combate e acompanham seus movimentos. O que você tenta agora?');return;}
  const result=test(12);
  play([{speaker:'Distração',text:'Você atira uma pedra perto dos barris. '+result.total+' em 3d6 contra 12.',roll:result},
   {speaker:'Guarda Kappa',text:result.success?'O guarda vira o rosto para os barris. Você tem uma abertura para se esconder.':'A pedra bate no chão, mas o guarda continua de olho na entrada.',apply:()=>{distraction=result.success;}}],endPlayerTurn);
  return;
 }
 if(action.kind==='sneak'){
  if(hostile||!mage.cover){waitForMage('Para tentar seguir sem ser visto, você precisa achar cobertura antes que os guardas entrem em combate. O que faz?');return;}
  const result=test(12);
  play([{speaker:'Furtividade',text:'Você espera a abertura e tenta passar pelo posto. '+result.total+' em 3d6 contra 12.',roll:result},
   {speaker:'Consequência',text:result.success?'Você contorna o posto fora da vista do guarda. A trilha para as Galerias está livre.':'Uma tábua estala sob seu pé. O guarda ergue a lança e chama a patrulha.',apply:()=>{if(result.success){mage.x=1080;mage.depth=88;mage.cover=null;}else hostile=true;}}],
   ()=>{if(result.success)end('Você passou pelo posto de guarda. A busca por Renkei continua nas Galerias.');else endPlayerTurn();});
  return;
 }
 if(action.kind==='advance'){
  play([{speaker:'Narrador',text:'Você avança pela trilha na direção do portão.',apply:()=>move(mage,1080,70)}],endPlayerTurn);
  return;
 }
 if(action.kind==='pass'){
  play([{speaker:'Narrador',text:'Você mantém sua posição e espera.'}],endPlayerTurn);
  return;
 }
 if(action.kind==='ask'&&!hostile){
  play([{speaker:'Sua fala',text:raw},{speaker:'Guarda Kappa',text:'“Se veio atrás de prisioneiros, fale com Bunkin. A casa dele fica depois do moinho.” O guarda continua barrando a passagem.'}],endPlayerTurn);
  return;
 }
 if(!hostile&&handleApproach(raw,action,mage,cover))return;
 if(action.kind==='talk'||action.kind==='ask'){
  play([{speaker:'Sua fala',text:raw},{speaker:'Guarda Kappa',text:'“Baixem as armas primeiro!” O guarda mantém a lança em posição.'}],endPlayerTurn);
  return;
 }
 if(cover&&(action.kind==='hide'||action.kind==='move')){
  const hide=action.kind==='hide';
  const x=hide?cover.behindX:cover.x+64, depth=hide?cover.behindDepth:Math.max(0,cover.depth-12);
  const willReach=Math.abs(mage.x-x)<=175;
  const outcome=willReach?(hide?'Você se agacha atrás de '+cover.name+'.':'Você para ao lado de '+cover.name+'.'):'Você avança na direção de '+cover.name+'. Ainda falta distância para chegar.';
  play([{speaker:'Narrador',text:outcome,apply:()=>move(mage,x,depth,hide?cover.id:null)}],endPlayerTurn);
  return;
 }
 if(action.kind==='leave'){
  play([{speaker:mage.name,text:'Você se levanta e deixa a cobertura.',apply:()=>{mage.cover=null;mage.prepared=false;}}],endPlayerTurn);
  return;
 }
 if(action.kind==='prepare'){
  play([{speaker:mage.name,text:'Você prepara o próximo ataque e recebe +1 no teste.',apply:()=>{mage.prepared=true;}}],endPlayerTurn);
  return;
 }
 if(action.kind==='observe'){
  const result=test(13);
  const details={palisada:'A face de madeira encobre alguém agachado do outro lado. A ponta da cerca fica exposta.',tronco:'O cedro tem espaço para se abaixar do outro lado. A raiz permite que alguém contorne a cobertura.',caixas:'As caixas escondem uma pessoa agachada. Uma pedra lançada junto aos barris pode desviar a atenção do guarda.'};
  play([{speaker:'Percepção',text:'Você observa '+(cover?.name||'a entrada')+'. '+result.total+' em 3d6 contra 13.',roll:result},
   {text:result.success?(details[cover?.id]||'A paliçada, o tronco e as caixas servem de abrigo. A trilha segue até o portão. Um dos guardas vigia a entrada enquanto os demais se espalham pelo povoado.'):'Você enxerga os obstáculos maiores, mas ainda não identifica uma abertura.'}],endPlayerTurn);
  return;
 }
 if(action.kind==='attack'){
  const target=action.target?actors.find(a=>a.id==='e'+action.target):nearest(mage);
  if(!target||!alive(target)){waitForMage('Esse alvo está fora de combate. Escolha outro guarda.');return;}
  if(mage.fp<=0){waitForMage('Sua energia mágica acabou. Você ainda pode se mover, buscar cobertura ou observar.');return;}
  if(Math.abs(target.x-mage.x)>600){waitForMage('Esse guarda está fora do alcance da magia. Aproxime-se ou escolha outro.');return;}
  hostile=true;
  play([{speaker:'Sua intenção',text:raw},...attackBeats(mage,target,{spell:true})],endPlayerTurn);
 }
}

async function playerAction(raw){
 if(mode!=='act'||current()?.id!=='mage'||busy||!raw.trim())return;
 if(!aiEnabled){resolveAction(raw,readIntent(raw,scene.covers));return;}
 const version=generation;
 const controller=new AbortController();
 pendingRequest=controller;
 mode='interpreting';
 render();
 $('speaker').textContent='Mestre';
 paginate('Interpretando sua ação…');
 $('continue').hidden=true;
 const timeout=setTimeout(()=>controller.abort(),15000);
 try{
  const {groqFetch}=await import('../groq.js');
  const context={
   scene:scene.intro, hostile, distraction, round,
   covers:scene.covers.map(({id,name})=>({id,name})),
   actors:actors.map(({id,name,hp,x,depth,cover})=>({id,name,hp,x,depth,cover}))
  };
  const action=await interpretIntent(raw,context,{key:localStorage.getItem('oraculo.groqKey'),request:groqFetch,signal:controller.signal});
  if(version===generation){mode='act';resolveAction(raw,action);}
 }catch{
  if(version!==generation)return;
  waitForMage('A Groq não conseguiu interpretar a ação. Tente enviar de novo ou desligue a interpretação com IA no menu.');
  input.value=raw;
 }finally{
  clearTimeout(timeout);
  if(pendingRequest===controller)pendingRequest=null;
 }
}
function reset(){
 generation++;
 pendingRequest?.abort();
 busy=false;
 hostile=false;
 distraction=false;
 actors=initialActors();
 turns=initiative(actors);
 turnIndex=0;
 round=1;
 input.value='';
 camera.scrollLeft=world.clientWidth*.05;
 $('continue').disabled=false;
 $('roll').classList.remove('rolling');
 waitForMage('Quatro guardas barram a entrada. Você procura Renkei. À sua frente há uma paliçada, um tronco e caixas. O que você faz?');
 $('speaker').textContent='Narrador';
}


$('continue').onclick=()=>{if((mode==='act'||mode==='end')&&pageIndex<pages.length-1){pageIndex++;showPage();$('continue').hidden=pageIndex===pages.length-1;}else continueStory();};
$('story').onclick=e=>{if(!e.target.closest('button')&&mode==='reading')continueStory();};
$('compose').onsubmit=e=>{e.preventDefault();if(mode!=='act')return;const raw=input.value.trim();if(!raw)return;input.value='';void playerAction(raw);};
$('info').onclick=()=>$('about').showModal();$('close-info').onclick=()=>$('about').close();$('restart').onclick=()=>{$('about').close();reset();};
$('use-ai').onchange=()=>{
 aiEnabled=$('use-ai').checked && !!localStorage.getItem('oraculo.groqKey');
 $('use-ai').checked=aiEnabled;
 $('ai-status').textContent=aiEnabled?'Interpretação com Groq ligada nesta sessão.':'Para usar a Groq, configure sua chave no jogo principal.';
};
camera.addEventListener('scroll',updateCamera);camera.addEventListener('keydown',e=>{if(e.key==='ArrowRight'){camera.scrollLeft+=160;e.preventDefault();}if(e.key==='ArrowLeft'){camera.scrollLeft-=160;e.preventDefault();}});
let drag=null;camera.addEventListener('pointerdown',e=>{if(e.pointerType==='touch')return;drag={x:e.clientX,scroll:camera.scrollLeft};camera.classList.add('dragging');camera.setPointerCapture(e.pointerId);});camera.addEventListener('pointermove',e=>{if(drag)camera.scrollLeft=drag.scroll-(e.clientX-drag.x);});for(const name of ['pointerup','pointercancel'])camera.addEventListener(name,()=>{drag=null;camera.classList.remove('dragging');});
reset();
new ResizeObserver(measureField).observe(camera);measureField();camera.scrollLeft=world.clientWidth*.05;updateCamera();
