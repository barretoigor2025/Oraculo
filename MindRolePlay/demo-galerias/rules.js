// The cartridge's 3d6 success rules, kept local so this demo is self-contained.
export function roll3d6(random=Math.random){const dice=Array.from({length:3},()=>Math.floor(random()*6)+1);return{dice,total:dice.reduce((a,b)=>a+b,0)};}
export function resolveTest(dice,skill){
 if(dice.length!==3||dice.some(n=>!Number.isInteger(n)||n<1||n>6))throw new TypeError('Exatamente três d6 são necessários.');
 const total=dice.reduce((a,b)=>a+b,0);
 const criticalSuccess=total<=4||(total===5&&skill>=15)||(total===6&&skill>=16);
 const criticalFailure=total===18||(total===17&&skill<=15)||(!criticalSuccess&&total>=skill+10);
 const success=criticalSuccess||(!criticalFailure&&total<17&&total<=skill);
 return{dice,total,skill,success,criticalSuccess:criticalSuccess&&success,criticalFailure,outcome:criticalFailure?'falha crítica':criticalSuccess?'sucesso crítico':success?'sucesso':'falha'};
}
export function initiative(actors){return [...actors].sort((a,b)=>b.speed-a.speed||b.dx-a.dx||a.order-b.order).map(a=>a.id);}
// depth 0 = near camera; depth 100 = far side of the courtyard.
export function project(actor){const depth=Math.max(0,Math.min(100,actor.depth));const scale=1-.2*depth/100;return{scale,feet:95-.45*depth,height:26*(actor.cm/182)*scale};}
export function normalize(text){return String(text).normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase();}
export function hasCover(target,attacker,covers){const cover=covers.find(c=>c.id===target.cover);return !!cover&&attacker.x>cover.x&&Math.abs(target.x-cover.x)<90;}
