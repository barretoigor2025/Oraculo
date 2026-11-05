// The original red polyhedral die is the visual signature; GURPS still resolves 3d6.
// Presentation consumes an existing result and NEVER rolls or changes game state.
const CSS = `
.mind-dice-overlay{position:fixed;inset:0;z-index:100050;display:grid;place-items:center;background:radial-gradient(ellipse at center,#24100fe8,#050505f5);backdrop-filter:blur(6px);color:#fff;font-family:system-ui,sans-serif}
.mind-dice-panel{text-align:center;width:min(92vw,480px);padding:24px;overflow:hidden}
.mind-dice-eyebrow{font-size:11px;letter-spacing:3px;text-transform:uppercase;color:#d4a397;margin-bottom:10px}
.mind-dice-title{font:24px Georgia,serif;margin:0 0 8px}.mind-dice-stage{position:relative;height:220px;display:grid;place-items:center}
.mind-dice-stage:after{content:'';position:absolute;bottom:20px;width:140px;height:18px;border-radius:50%;background:#000;filter:blur(8px);opacity:.8}
.mind-dice-canvas{position:relative;z-index:1;width:220px;height:220px}
.mind-dice-fallback{position:relative;z-index:2;width:112px;height:112px;clip-path:polygon(50% 0,94% 25%,94% 75%,50% 100%,6% 75%,6% 25%);background:conic-gradient(from 30deg,#fd7863,#7e0804,#e52a16,#6f0805,#f3492d,#a00f07,#fd7863);border:1px solid #ffb8a7;filter:drop-shadow(0 8px 12px #a3110a88);animation:mind-dice-toss 1.9s cubic-bezier(.2,.7,.3,1) both}
@keyframes mind-dice-toss{0%{transform:translateY(-200px) rotate(-540deg) scale(.6)}45%{transform:translateY(24px) rotate(210deg)}65%{transform:translateY(-34px) rotate(300deg)}82%{transform:translateY(10px) rotate(350deg)}100%{transform:translateY(0) rotate(360deg)}}
.mind-dice-result{min-height:128px;opacity:0;transform:translateY(10px);transition:opacity .28s,transform .28s}.mind-dice-result.revealed{opacity:1;transform:none}
.mind-dice-faces{display:flex;justify-content:center;gap:10px;margin:8px}.mind-dice-face{width:48px;height:48px;border-radius:9px;display:grid;place-items:center;background:linear-gradient(140deg,#d52b1c,#760b06);border:1px solid #f28a76;box-shadow:inset 0 1px #ffc1a166,0 5px 14px #0008;font:29px Georgia}
.mind-dice-total{font:46px Georgia;margin:4px 0}.mind-dice-detail{font-size:13px;line-height:1.6;color:#d3c4bd}.mind-dice-close{font:inherit;color:#fff;background:#902519;border:1px solid #db6c58;border-radius:8px;padding:11px 30px;margin-top:16px;cursor:pointer}.mind-dice-close:disabled{opacity:.35;cursor:wait}
@media(max-height:560px){.mind-dice-panel{padding:10px}.mind-dice-stage{height:145px}.mind-dice-canvas{width:150px;height:150px}.mind-dice-result{min-height:90px}.mind-dice-total{font-size:32px}.mind-dice-face{width:36px;height:36px;font-size:24px}.mind-dice-close{margin-top:8px}}
@media(prefers-reduced-motion:reduce){.mind-dice-fallback{animation:none}.mind-dice-result{transition:none}}
`;
export function validateVisualResult(result) {
  if(!Array.isArray(result?.dice)||result.dice.length!==3||result.dice.some(n=>!Number.isInteger(n)||n<1||n>6))throw new Error('A animação exige o resultado real de 3d6.');
  if(result.total!==result.dice.reduce((a,b)=>a+b,0))throw new Error('A soma dos dados não corresponde ao resultado.');
  return result;
}
let queue=Promise.resolve();
export function showDiceRoll(result, options={}) {
  validateVisualResult(result);
  const task=queue.then(()=>present(result,options));
  queue=task.catch(()=>{});
  return task;
}
function redDie(stage,reduced) {
  const T=globalThis.THREE;
  const fallback=()=>{const die=document.createElement('div');die.className='mind-dice-fallback';die.setAttribute('aria-hidden','true');stage.append(die);return ()=>{};};
  if(!T||reduced)return fallback();
  let renderer,geometry,material,edges,lineMaterial,raf;
  try{
    const canvas=document.createElement('canvas');canvas.className='mind-dice-canvas';canvas.setAttribute('aria-hidden','true');
    renderer=new T.WebGLRenderer({canvas,antialias:true,alpha:true});renderer.setPixelRatio(Math.min(globalThis.devicePixelRatio||1,2));renderer.setSize(220,220,false);
    const scene=new T.Scene(),camera=new T.PerspectiveCamera(38,1,1,2000);camera.position.set(0,0,350);
    scene.add(new T.AmbientLight(0xffffff,.5));const key=new T.DirectionalLight(0xffe8cc,1.15);key.position.set(100,180,120);scene.add(key);
    const fill=new T.DirectionalLight(0xaad0ff,.38);fill.position.set(-80,40,60);scene.add(fill);
    geometry=new T.IcosahedronGeometry(72,0);material=new T.MeshStandardMaterial({color:0xbf1a0c,roughness:.28,metalness:.08,side:T.DoubleSide});
    const mesh=new T.Mesh(geometry,material);edges=new T.EdgesGeometry(geometry,20);lineMaterial=new T.LineBasicMaterial({color:0xffffff,transparent:true,opacity:.45});mesh.add(new T.LineSegments(edges,lineMaterial));scene.add(mesh);stage.append(canvas);
    const bounce=t=>{if(t<1/2.75)return 7.5625*t*t;if(t<2/2.75){t-=1.5/2.75;return 7.5625*t*t+.75;}if(t<2.5/2.75){t-=2.25/2.75;return 7.5625*t*t+.9375;}t-=2.625/2.75;return 7.5625*t*t+.984375;};
    let start;
    const frame=ts=>{start??=ts;const t=Math.min((ts-start)/1000,2.28),spin=t<1.78?t:1.78+(t-1.78)*(1-(t-1.78)/1.0);mesh.position.y=150-150*bounce(Math.min(t/1.05,1));mesh.rotation.set(spin*9+.3,spin*13+.5,spin*5);renderer.render(scene,camera);if(t<2.28)raf=requestAnimationFrame(frame);};
    raf=requestAnimationFrame(frame);
    return ()=>{cancelAnimationFrame(raf);geometry.dispose();material.dispose();edges.dispose();lineMaterial.dispose();renderer.dispose();};
  }catch{geometry?.dispose();material?.dispose();edges?.dispose();lineMaterial?.dispose();renderer?.dispose();stage.replaceChildren();return fallback();}
}
async function present(result,{title='Teste GURPS',label=result.skill||'3d6'}={}) {
  if(!document.getElementById('mind-dice-css')){const style=document.createElement('style');style.id='mind-dice-css';style.textContent=CSS;document.head.append(style);}
  const previous=document.activeElement,overlay=document.createElement('div');overlay.className='mind-dice-overlay';overlay.setAttribute('role','dialog');overlay.setAttribute('aria-modal','true');overlay.setAttribute('aria-label',title);
  const panel=document.createElement('div');panel.className='mind-dice-panel';
  const eyebrow=document.createElement('div');eyebrow.className='mind-dice-eyebrow';eyebrow.textContent='MIND ROLEPLAY · 3D6';
  const heading=document.createElement('h2');heading.className='mind-dice-title';heading.textContent=title;
  const subtitle=document.createElement('div');subtitle.className='mind-dice-detail';subtitle.textContent=label;
  const stage=document.createElement('div');stage.className='mind-dice-stage';
  const output=document.createElement('div');output.className='mind-dice-result';output.setAttribute('aria-live','polite');
  const close=document.createElement('button');close.className='mind-dice-close';close.textContent='Rolando…';close.disabled=true;
  panel.append(eyebrow,heading,subtitle,stage,output,close);overlay.append(panel);document.body.append(overlay);close.focus();
  const reduced=globalThis.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
  const dispose=redDie(stage,reduced);
  const trap=e=>{if(e.key==='Tab'){e.preventDefault();close.focus();}};overlay.addEventListener('keydown',trap);
  await new Promise(resolve=>setTimeout(resolve,reduced?120:2350));
  const faces=document.createElement('div');faces.className='mind-dice-faces';for(const n of result.dice){const face=document.createElement('span');face.className='mind-dice-face';face.textContent=n;faces.append(face);}
  const total=document.createElement('div');total.className='mind-dice-total';total.textContent=result.total;
  const detail=document.createElement('div');detail.className='mind-dice-detail';detail.textContent=result.dice.join(' + ')+' = '+result.total+(Number.isFinite(result.effectiveSkill)?' · NH '+result.effectiveSkill:'')+(result.outcome?' · '+result.outcome:'');
  output.append(faces,total,detail);output.classList.add('revealed');close.textContent='Continuar';close.disabled=false;close.focus();
  await new Promise(resolve=>close.addEventListener('click',resolve,{once:true}));
  dispose();overlay.remove();previous?.isConnected&&previous.focus();return result;
}
