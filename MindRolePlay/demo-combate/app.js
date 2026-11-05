import {roll3d6,resolveTest,initiative,project,normalize,hasCover} from './rules.js?v=1';
const $=id=>document.getElementById(id);
const camera=$('camera'),world=$('world'),input=$('intent');
const scene={horizon:43,covers:[
 {id:'muro',name:'muro baixo em diagonal',x:288,depth:44,behindX:260,behindDepth:88,material:'pedra e reboco',blocksSight:true,uses:['agachar','contornar','cobertura']},
 {id:'pilar',name:'pilar de madeira',x:650,depth:66,behindX:620,behindDepth:66,material:'madeira em base simples de pedra',blocksSight:true,uses:['cobertura','contornar']},
 {id:'carroca',name:'carroça tombada',x:984,depth:20,behindX:950,behindDepth:22,material:'madeira',blocksSight:true,uses:['agachar','cobertura','contornar']}
]};
let actors=[],turns=[],turnIndex=0,round=1,mode='intro',queue=[],beatIndex=0,afterQueue=null,pages=[],pageIndex=0,generation=0,busy=false;
const current=()=>actors.find(a=>a.id===turns[turnIndex]);
const alive=a=>a.hp>0;
const dice=()=>{const values=new Uint32Array(3);crypto.getRandomValues(values);return [...values].map(n=>n%6+1);};
const singleDie=()=>dice()[0];
const test=(skill)=>resolveTest(dice(),skill);
const nearest=(a)=>actors.filter(b=>b.enemy!==a.enemy&&alive(b)).sort((b,c)=>Math.abs(b.x-a.x)-Math.abs(c.x-a.x))[0];
function initialActors(){return[
 {id:'mage',name:'Você · Mago',short:'Mago',cm:182,x:95,depth:29,hp:18,max:18,fp:13,maxFp:13,speed:6.5,dx:13,order:0,skill:14,dodge:10,dr:1,enemy:false,cover:null,prepared:false,art:'mago',trait:'Aptidão Mágica 2 incluída na perícia; Reflexos em Combate +1 na esquiva.'},
 {id:'e1',name:'Espantalho 1',short:'E1',cm:190,x:610,depth:65,hp:11,max:11,speed:6.25,dx:15,order:1,skill:11,dodge:8,dr:0,enemy:true,cover:null},
 {id:'archer',name:'Rei · Arqueira',short:'Rei',cm:176,x:175,depth:44,hp:17,max:17,speed:6.25,dx:14,order:2,skill:13,dodge:9,dr:1,enemy:false,cover:null,prepared:false,art:'arqueira',trait:'Visão Aguçada +2 nos testes de percepção.'},
 {id:'warrior',name:'Akira · Guerreira',short:'Akira',cm:169,x:225,depth:57,hp:24,max:24,speed:6,dx:13,order:3,skill:14,dodge:9,dr:3,enemy:false,cover:null,prepared:false,art:'guerreira',trait:'Excesso de Confiança: tende a avançar em vez de buscar cobertura nesta simulação.'},
 {id:'e2',name:'Espantalho 2',short:'E2',cm:190,x:865,depth:38,hp:11,max:11,speed:6,dx:10,order:4,skill:11,dodge:8,dr:0,enemy:true,cover:null},
 {id:'e3',name:'Espantalho 3',short:'E3',cm:205,x:1100,depth:72,hp:14,max:14,speed:5.75,dx:11,order:5,skill:12,dodge:8,dr:0,enemy:true,cover:null}
];}
function render(){
 $('actors').replaceChildren();
 for(const actor of actors){
  const p=project(actor),covered=!!actor.cover;
  const el=document.createElement('div');el.className='actor'+(actor.enemy?' enemy':'')+(covered&&actor.id==='mage'?' cover':'')+(!alive(actor)?' dead':'')+(actor.id===current()?.id?' active':'');
  el.dataset.id=actor.id;
  el.style.setProperty('--x',actor.x/12+'%');el.style.setProperty('--ground',100-p.feet+'%');el.style.setProperty('--h',p.height*(covered&&actor.id==='mage'?.62:1)+'%');el.style.setProperty('--z',covered?'60':String(Math.round(100-actor.depth*.5)));
  const image=document.createElement('img');image.src='assets/'+(actor.enemy?'espantalho':actor.id==='mage'&&covered?'mago-cobertura':actor.art)+'.webp';image.alt=actor.name;image.draggable=false;el.append(image);
  const label=document.createElement('span');label.className='actor-tag';label.textContent=actor.name+' · '+Math.max(0,actor.hp)+'/'+actor.max;
  const bar=document.createElement('span');bar.className='hp';const fill=document.createElement('i');fill.style.width=Math.max(0,actor.hp/actor.max*100)+'%';bar.append(fill);label.append(bar);el.append(label);
  if(covered||actor.prepared||!alive(actor)){const status=document.createElement('span');status.className='condition';status.textContent=!alive(actor)?'Fora de combate':covered?'Em cobertura':actor.id==='archer'?'Mirando':'Preparado';el.append(status);}
  $('actors').append(el);
 }
 $('order').replaceChildren();for(const id of turns){const a=actors.find(a=>a.id===id);const tag=document.createElement('span');tag.className='order-item'+(a.enemy?' enemy':'')+(a.id===current()?.id?' active':'')+(!alive(a)?' dead':'');tag.textContent=a.short;tag.title=a.name+' · Velocidade '+a.speed+' · DX '+a.dx;$('order').append(tag);}
 $('round').textContent='Rodada '+round;
 const act=mode==='act'&&current()?.id==='mage'&&alive(current());
 input.disabled=!act;input.placeholder=act?'Narre sua ação…':mode==='end'?'Encontro encerrado':'Acompanhe o lance · toque em Continuar';$('send').disabled=!act;
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
function continueStory(){if(busy||mode==='act'||mode==='end')return;if(pageIndex<pages.length-1){pageIndex++;showPage();return;}if(beatIndex<queue.length-1){beatIndex++;showBeat();return;}const done=afterQueue;afterQueue=null;queue=[];done?.();}
function waitForMage(message='Os inimigos mantêm suas posições. O que você faz?'){
 mode='act';render();$('speaker').textContent='Sua vez · Mago';displayRoll(null);paginate(message);$('continue').hidden=pages.length<=1;
 // Long prompts may be paged without consuming or changing a turn.
 if(pages.length>1)$('continue').hidden=false;
}
function checkEnd(){if(actors.filter(a=>a.enemy).every(a=>!alive(a))){end('O último espantalho cai. O caminho para o santuário está livre.');return true;}if(actors.filter(a=>!a.enemy).every(a=>!alive(a))){end('O grupo foi vencido. Você pode recomeçar pelo botão “Prévia”.');return true;}return false;}
function end(text){mode='end';render();$('speaker').textContent='Narrador';displayRoll(null);paginate(text);$('continue').hidden=true;}
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
 const damage=singleDie()+(spell?0:attacker.enemy?1:2),injury=Math.max(0,damage-target.dr);
 beats.push({speaker:'Consequência',text:'O ataque causa '+damage+' de dano'+(target.dr?' e a proteção absorve '+Math.min(target.dr,damage)+'.':'.')+' '+target.name+' perde '+injury+' PV.',apply:()=>{target.hp=Math.max(0,target.hp-injury);impact(target);}});
 beats.push({text:target.name+(target.hp-injury<=0?' cai e deixa de participar dos próximos turnos.':' permanece na luta. A ordem de iniciativa continua. ')+(spell?' Energia do mago: '+Math.max(0,attacker.fp-1)+' PF.':'' )});
 return beats;
}
function automatedTurn(actor){
 const target=nearest(actor);if(!target){nextTurn();return;}
 const dist=Math.abs(actor.x-target.x);const intro={speaker:'Iniciativa · '+actor.name,text:'É a vez de '+actor.name+' (Velocidade '+actor.speed+'). '+(actor.enemy?'O espantalho reage ao estado atual do campo.':'Aliado simulado nesta demonstração.')};
 const range=actor.id==='archer'?560:120;
 if(dist>range){const direction=Math.sign(target.x-actor.x),destination=target.x-direction*90;const confidence=actor.id==='warrior'?' Seu Excesso de Confiança orienta esta decisão na simulação.':'';
  play([intro,{speaker:actor.name,text:actor.name+' avança na direção de '+target.name+'.'+confidence,apply:()=>move(actor,destination,target.depth)}, {text:'O deslocamento termina nesta vez. A posição alcançada permanece no campo; a câmera não se move sozinha.'}],nextTurn);return;
 }
 if(actor.enemy&&target.cover&&round>=2&&singleDie()>=5){play([intro,{speaker:actor.name,text:actor.name+' procura o flanco e contorna o lado exposto da cobertura.',apply:()=>{actor.x=target.x-60;actor.depth=target.depth;}},{text:'A proteção frontal não cobre mais esse ângulo. O inimigo gastou sua ação se reposicionando.'}],nextTurn);return;}
 play([intro,...attackBeats(actor,target)],nextTurn);
}
function playerAction(raw){
 if(mode!=='act'||current().id!=='mage'||busy)return;
 const text=normalize(raw.trim());if(!text)return;const mage=current();
 const cover=scene.covers.find(c=>text.includes(c.id)||(c.id==='pilar'&&text.includes('coluna')));
 if(cover){const hide=/escond|agach|cobertura|proteg|atras/.test(text);const willReach=Math.abs(mage.x-cover.behindX)<=175;
  play([{speaker:'Sua intenção',text:raw},{speaker:'Narrador',text:willReach?'Você alcança '+cover.name+(hide?' e se abriga atrás dele.':' e para ao lado dele.'):'Você avança na direção de '+cover.name+', mas a distância exige outra ação.',apply:()=>move(mage,cover.behindX,cover.behindDepth,hide?cover.id:null)}, {text:willReach&&hide?'Você está em cobertura. A proteção vale contra a direção bloqueada pelo desenho; um inimigo pode contornar.':'A posição alcançada permanece registrada. A iniciativa passa ao próximo participante.'}],nextTurn);return;
 }
 if(/sair|levantar/.test(text)){play([{speaker:mage.name,text:'Você se levanta e deixa a cobertura, permanecendo no mesmo lugar.',apply:()=>{mage.cover=null;}}],nextTurn);return;}
 if(/prepar|mirar|esper/.test(text)){play([{speaker:mage.name,text:'Você concentra sua atenção e prepara o próximo ataque. Nesta prévia, a preparação concede +1 ao próximo teste de ataque.',apply:()=>{mage.prepared=true;}}],nextTurn);return;}
 if(/observ|examinar/.test(text)){const result=test(13);play([{speaker:'Percepção',text:'Você observa o pátio: '+result.total+' contra 13. '+result.outcome+'.',roll:result},{text:result.success?'O muro baixo protege alguém agachado; o pilar de madeira bloqueia a linha de visão. A carroça oferece abrigo, mas os lados permanecem acessíveis.':'Você percebe os elementos maiores do cenário, sem identificar uma vantagem adicional.'}],nextTurn);return;}
 if(/passar|aguardar/.test(text)){play([{speaker:mage.name,text:'Você mantém sua posição e deixa a iniciativa seguir.'}],nextTurn);return;}
 const match=text.match(/espantalho\s*([123])/),target=match?actors.find(a=>a.id==='e'+match[1]):nearest(mage);
 if(/aproxim|avanc|correr|portao|chegar/.test(text)){const destination=text.includes('portao')?1100:(target?.x||700)-100;play([{speaker:mage.name,text:'Você avança pelo pátio. A perspectiva acompanha a distância: o personagem diminui ao se afastar.',apply:()=>move(mage,destination,target?.depth||55)}, {text:'Seu deslocamento termina nesta vez. O campo mantém a posição alcançada.'}],nextTurn);return;}
 if(/magia|fogo|chama|conjur|atac|lanco|golpe/.test(text)){
  if(!target||!alive(target)){waitForMage('Esse alvo já está fora de combate. Narre uma ação contra outro espantalho.');return;}
  if(mage.fp<=0){waitForMage('Sua energia mágica acabou nesta prévia. Você ainda pode se mover, buscar cobertura ou observar.');return;}
  if(Math.abs(target.x-mage.x)>600){waitForMage('O alvo está fora do alcance desta magia. Aproxime-se ou escolha outro espantalho. Sua ação ainda não foi consumida.');return;}
  play([{speaker:'Sua intenção',text:raw},...attackBeats(mage,target,{spell:true})],nextTurn);return;
 }
 waitForMage('Nesta prévia você pode narrar movimento, cobertura, preparação, observação ou magia. Ex.: “me escondo atrás do muro” ou “lanço fogo no espantalho 1”.');
}
function reset(){generation++;busy=false;actors=initialActors();turns=initiative(actors);turnIndex=0;round=1;input.value='';camera.scrollLeft=0;$('continue').disabled=false;$('roll').classList.remove('rolling');render();play([{text:'Três espantalhos guardam o santuário. Você interpreta o mago; Rei e Akira são aliados simulados. Deslize para observar o campo.'},{text:'A ordem considera Velocidade Básica e DX. Você age primeiro. Narre sua intenção; os lances serão apresentados aqui, um por vez.'}],()=>waitForMage('O que você faz? Ex.: “me esconder atrás do muro” ou “lançar fogo no espantalho 1”.'));}
$('continue').onclick=()=>{if(mode==='act'&&pageIndex<pages.length-1){pageIndex++;showPage();$('continue').hidden=pageIndex===pages.length-1;}else continueStory();};
$('story').onclick=e=>{if(!e.target.closest('button')&&mode==='reading')continueStory();};
$('compose').onsubmit=e=>{e.preventDefault();const raw=input.value;input.value='';playerAction(raw);};
$('info').onclick=()=>$('about').showModal();$('close-info').onclick=()=>$('about').close();$('restart').onclick=()=>{$('about').close();reset();};
camera.addEventListener('scroll',updateCamera);camera.addEventListener('keydown',e=>{if(e.key==='ArrowRight'){camera.scrollLeft+=160;e.preventDefault();}if(e.key==='ArrowLeft'){camera.scrollLeft-=160;e.preventDefault();}});
let drag=null;camera.addEventListener('pointerdown',e=>{if(e.pointerType==='touch')return;drag={x:e.clientX,scroll:camera.scrollLeft};camera.classList.add('dragging');camera.setPointerCapture(e.pointerId);});camera.addEventListener('pointermove',e=>{if(drag)camera.scrollLeft=drag.scroll-(e.clientX-drag.x);});for(const name of ['pointerup','pointercancel'])camera.addEventListener(name,()=>{drag=null;camera.classList.remove('dragging');});
reset();
