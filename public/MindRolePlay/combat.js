import { derivedStats, test3d6 } from './gurps.js?v=9';
const clone = value => JSON.parse(JSON.stringify(value));
const valid = (n, label, min=0) => { if(!Number.isFinite(n)||n<min)throw new Error(label+' inválido.'); return n; };
export function rollDamage(expression, random=Math.random) {
  const match=String(expression).match(/^(\d{1,2})d(?:6)?([+-]\d+)?$/);
  if(!match||Number(match[1])<1||Number(match[1])>20)throw new Error('Dano deve usar Xd6 com modificador, por exemplo 1d6+2.');
  const dice=Array.from({length:Number(match[1])},()=>Math.floor(random()*6)+1);
  return {dice,total:Math.max(0,dice.reduce((a,b)=>a+b,0)+Number(match[2]||0))};
}
export function injuryFromDamage(damage, dr, type='cr', { multiplier=1, divisor=1 }={}) {
  valid(damage,'Dano');valid(dr,'RD');valid(multiplier,'Multiplicador',1);valid(divisor,'Divisor',1);
  const penetrating=Math.max(0,damage*multiplier-Math.floor(dr/divisor));
  const wound={cr:1,cut:1.5,imp:2,burn:1,pi:1,'pi-':.5,'pi+':1.5,'pi++':2}[type];
  if(!wound)throw new Error('Tipo de dano desconhecido.');
  return {penetrating,injury:penetrating?Math.max(1,Math.floor(penetrating*wound)):0};
}
export function createCombat(players,enemies,sceneId,now=Date.now()) {
  const fighters=[...Object.entries(players).map(([id,p])=>({...p,id,side:'players',ownerId:id,name:p.nome||p.name})),
    ...enemies.map((p,i)=>({...p,id:'enemy-'+i,side:'enemies',ownerId:'host',name:p.nome||p.name}))].map(p=>{
      const stats=derivedStats(p),weapon=p.weapon||{name:'Ataque desarmado',skill:Math.max(3,stats.DX-4),damage:'1d6-2',type:'cr',ranged:false};
      return {...p,attributes:p.attributes||{ST:stats.ST,DX:stats.DX,IQ:stats.IQ,HT:stats.HT},maxHp:stats.HP,hp:p.hp??stats.HP,maxFp:stats.FP,fp:p.fp??p.sp??stats.FP,speed:stats.speed,DX:stats.DX,HT:stats.HT,
        dodge:stats.dodge,parry:p.parry??Math.floor(weapon.skill/2)+3,block:p.block??0,dr:p.dr??0,weapon,
        shock:0,stunned:false,unconscious:false,dead:false,defending:false,allOut:false,deathChecks:0};
    });
  const order=[...fighters].sort((a,b)=>b.speed-a.speed||b.DX-a.DX||a.id.localeCompare(b.id)).map(p=>p.id);
  return {id:'combat-'+now,sceneId,fighters,order,turn:0,round:1,phase:'action',pending:null,log:[],status:'active'};
}
export const currentFighter = battle => battle.fighters.find(f=>f.id===battle.order[battle.turn]);
export function availableDefense(f, kind, ranged=false) {
  if(f.unconscious||f.dead||f.allOut)return 0;
  let value=kind==='dodge'?f.dodge:kind==='parry'&&!ranged?f.parry:kind==='block'?f.block:0;
  if(kind==='dodge'&&(f.hp<f.maxHp/3||f.fp<f.maxFp/3))value=Math.ceil(value/2);
  return Math.max(0,value+(f.defending?2:0)-(f.stunned?4:0)-(f.prone?3:0));
}
function event(b,text,roll){if(roll)b.rollSeq=(b.rollSeq||0)+1;b.log=[...b.log,{text,ts:Date.now(),...(roll?{roll,id:b.id+':roll:'+b.rollSeq}:{})}].slice(-100);}
function finishOrAdvance(b,random) {
  b.pending=null;b.phase='action';
  const allies=b.fighters.filter(f=>f.side==='players'&&!f.dead&&!f.unconscious);
  const enemies=b.fighters.filter(f=>f.side==='enemies'&&!f.dead&&!f.unconscious);
  if(!allies.length||!enemies.length){b.status=allies.length?'victory':'defeat';return b;}
  for(let n=0;n<b.order.length;n++){
    b.turn=(b.turn+1)%b.order.length;if(b.turn===0)b.round++;
    const f=currentFighter(b);if(f.dead||f.unconscious)continue;
    f.allOut=false;f.defending=false;
    if(f.hp<=0){const check=test3d6(f.HT,{random});event(b,f.name+': consciência '+check.total+' — '+check.outcome,check);if(!check.success){f.unconscious=true;continue;}}
    return b;
  }
  b.status='defeat';return b;
}
export function combatAction(battle,command,actorId,isHost=false,random=Math.random) {
  const b=clone(battle),actor=currentFighter(b);
  if(b.status!=='active')throw new Error('O confronto já terminou.');
  if(command.type==='fumble'){
    if(!isHost||b.phase!=='fumble')throw new Error('Somente o mestre resolve a falha crítica.');
    if(!String(command.note||'').trim())throw new Error('Registre o efeito da tabela de falha.');
    event(b,'Falha crítica resolvida pelo mestre: '+command.note);return finishOrAdvance(b,random);
  }
  if(command.type==='defense'||command.type==='critical'){
    const target=b.fighters.find(f=>f.id===b.pending?.targetId);
    if(!target)throw new Error('Não há ataque pendente.');
    if(target.ownerId!==actorId&&!(isHost&&target.side==='enemies')&&command.type!=='critical')throw new Error('A defesa pertence a outro jogador.');
    if(command.type==='critical'&&!isHost)throw new Error('O mestre confirma o efeito da tabela crítica.');
    if(command.type==='defense'&&b.phase!=='defense'||command.type==='critical'&&b.phase!=='critical')throw new Error('A fase mudou.');
    let hit=true,criticalEffect={};
    if(command.type==='defense'){
      const defense=availableDefense(target,command.defense,actor.weapon.ranged);
      if(command.defense!=='none'&&defense===0)throw new Error('Essa defesa não está disponível.');
      if(defense){const roll=test3d6(defense,{random,allowLowSkill:true});hit=!roll.success;event(b,target.name+': '+command.defense+' '+roll.dice.join('+')+' = '+roll.total+' vs '+defense+' — '+roll.outcome,roll);}
    }else{
      criticalEffect={multiplier:valid(Number(command.multiplier),'Multiplicador',1),divisor:valid(Number(command.divisor),'Divisor',1)};
      if(criticalEffect.multiplier>3||criticalEffect.divisor>2)throw new Error('Efeito crítico fora do intervalo.');
      event(b,'Efeito crítico confirmado pelo mestre: '+(command.note||'dano normal'));
    }
    if(hit){
      const damage=rollDamage(actor.weapon.damage,random);
      const result=injuryFromDamage(target.incorporeal&&!actor.weapon.spiritual?0:Math.max(actor.weapon.type==='cr'?0:1,damage.total),target.dr,actor.weapon.type,criticalEffect);
      if(target.incorporeal&&!actor.weapon.spiritual)event(b,'A arma atravessa a forma espiritual. É preciso consagração ou resolver o vínculo pela cena.');
      const oldHp=target.hp;target.hp-=result.injury;target.shock=Math.min(4,target.shock+result.injury);
      event(b,actor.name+' → '+target.name+': dano '+damage.dice.join('+')+' ('+damage.total+'), RD '+target.dr+', lesão '+result.injury+'; PV '+target.hp+'/'+target.maxHp);
      if(result.injury>target.maxHp/2){const check=test3d6(target.HT,{random});event(b,target.name+': ferimento grave, HT '+check.total+' — '+check.outcome,check);if(!check.success){target.stunned=true;target.prone=true;if(check.criticalFailure||check.total-target.HT>=5)target.unconscious=true;}}
      const threshold=Math.min(4,Math.floor(Math.max(0,-target.hp)/target.maxHp));
      for(let n=Math.max(1,Math.floor(Math.max(0,-oldHp)/target.maxHp)+1);n<=threshold;n++){
        const check=test3d6(target.HT,{random});target.deathChecks++;event(b,target.name+': sobrevivência em -'+n+'×PV, '+check.total+' — '+check.outcome,check);if(!check.success){if(check.total-target.HT<=2&&!check.criticalFailure){target.mortallyWounded=true;target.unconscious=true;event(b,target.name+' sofre ferimento mortal; atendimento e verificações posteriores cabem ao mestre.');}else target.dead=true;break;}
      }
      if(target.hp<=-5*target.maxHp)target.dead=true;
    }
    return finishOrAdvance(b,random);
  }
  if(b.phase!=='action')throw new Error('Resolva a defesa ou o crítico pendente.');
  if(actor.ownerId!==actorId&&!(isHost&&actor.side==='enemies'))throw new Error('É a vez de outro combatente.');
  if(actor.stunned){const recovery=test3d6(actor.HT,{random});if(recovery.success)actor.stunned=false;event(b,actor.name+': Do Nothing, recuperação '+recovery.outcome,recovery);actor.shock=0;return finishOrAdvance(b,random);}
  if(command.type==='stand'){actor.prone=false;actor.shock=0;event(b,actor.name+' se levanta.');return finishOrAdvance(b,random);}
  if(command.type==='ready'){actor.reload=Math.max(0,(actor.reload||0)-1);actor.shock=0;event(b,actor.name+' prepara a arma ('+actor.reload+' turnos restantes).');return finishOrAdvance(b,random);}
  if(command.type==='defend'){actor.defending=true;actor.shock=0;event(b,actor.name+' assume Defesa Total (+2 à defesa escolhida).');return finishOrAdvance(b,random);}
  if(command.type==='wait'){actor.shock=0;event(b,actor.name+' não ataca neste turno.');return finishOrAdvance(b,random);}
  if(command.type==='flee'){actor.unconscious=true;actor.withdrawn=true;actor.shock=0;event(b,actor.name+' sai do confronto com a retirada confirmada na ficção.');return finishOrAdvance(b,random);}
  if(command.type!=='attack')throw new Error('Manobra desconhecida.');
  if(actor.reload>0)throw new Error('Prepare a arma antes de atacar novamente.');
  const target=b.fighters.find(f=>f.id===command.targetId);
  if(!target||target.side===actor.side||target.dead||target.unconscious)throw new Error('Alvo inválido.');
  const modifier=Number(command.modifier||0);if(!Number.isFinite(modifier)||modifier< -10||modifier>10)throw new Error('Modificador fora do intervalo.');
  const level=actor.weapon.skill-actor.shock-(actor.prone?4:0)+modifier+(command.allOut?4:0);
  actor.allOut=!!command.allOut;actor.shock=0;actor.reload=actor.weapon.reload||0;
  const roll=test3d6(level,{random});event(b,actor.name+' ataca '+target.name+': '+roll.dice.join('+')+' = '+roll.total+' vs '+level+' — '+roll.outcome,roll);
  if(!roll.success){if(roll.criticalFailure){event(b,'Falha crítica: aguardando efeito da tabela de falha da arma.');b.phase='fumble';return b;}return finishOrAdvance(b,random);}
  b.pending={targetId:target.id,attack:roll};b.phase=roll.criticalSuccess?'critical':'defense';
  return b;
}
