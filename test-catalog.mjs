#!/usr/bin/env node
// Pre-commit test: verifies catalog/index.html loads without JS errors
// Run: node test-catalog.mjs
import { createRequire } from 'module';
import { readFileSync } from 'fs';
const req = createRequire(import.meta.url);

// ── Browser stubs ─────────────────────────────────────────────────────
const noop = ()=>{};
const fakeEl = ()=>({
  innerHTML:'', style:{display:''},
  classList:{add:noop,remove:noop,toggle:noop},
  querySelectorAll:()=>[], dataset:{tab:'classes'}, addEventListener:noop
});
globalThis.document = {
  getElementById: fakeEl,
  querySelectorAll: ()=>[fakeEl()],
  addEventListener: noop,
  body: {style:{overflow:''}}
};
globalThis.window          = globalThis;
globalThis.requestAnimationFrame = ()=>0;
globalThis.cancelAnimationFrame  = noop;

// ── Load data files ───────────────────────────────────────────────────
function strip(src){
  return src
    .replace(/^export (const|let|var) /gm, '$1 ')
    .replace(/^export default .*;/gm, '');
}

const bsrc = strip(readFileSync('public/data/bestiary.js',  'utf8'));
const csrc = strip(readFileSync('public/data/campaign.js',  'utf8'));

// Validate bestiary is a proper array
const tmpCheck = new Function('result', bsrc + '\nresult.val = INIMIGOS_DATA;');
const r = {}; tmpCheck(r);
if(!Array.isArray(r.val) || r.val.length === 0){
  console.error('❌ FAIL: INIMIGOS_DATA is not a valid array in bestiary.js');
  process.exit(1);
}
console.log(`  bestiary.js  — ${r.val.length} inimigos ✓`);

// ── Load catalog script ───────────────────────────────────────────────
const htmlsrc = readFileSync('public/catalog/index.html', 'utf8');
const m = htmlsrc.match(/<script type="module">([\s\S]*?)<\/script>/);
if(!m){ console.error('❌ FAIL: no module script found in catalog/index.html'); process.exit(1); }
const catscript = m[1].split('\n').filter(l => !l.trim().startsWith('import ')).join('\n');

// ── Combined eval ─────────────────────────────────────────────────────
const combined = bsrc + '\n' + csrc + '\n' + catscript;
try {
  eval(combined);
  console.log('  catalog/index.html — loads OK ✓');
  console.log('✅ All checks passed');
} catch(e) {
  const match = (e.stack||'').match(/anonymous>:(\d+)/);
  const n = match ? parseInt(match[1]) : 0;
  const cl = combined.split('\n');
  console.error('❌ FAIL in catalog/index.html:', e.message);
  if(n) cl.slice(Math.max(0,n-4),n+5).forEach((l,i)=>console.error((n-3+i)+': '+l));
  process.exit(1);
}
