// Player-visible identity and reading helpers; canonical names remain in GM data.
export function visibleNpcName(npc, known=false) {
  return known ? npc.nome : npc.publicAlias || 'Pessoa desconhecida';
}
export function wordTokens(text) {
  return String(text||'').match(/\S+\s*/gu)||[];
}
export function introductionSlides(scene,mode='exterior') {
  const image=mode==='exterior'?scene.imgExterior:scene.imgInterior;
  if(scene.introSlides?.length)return scene.introSlides.map(s=>({...s,imagem:s.imagem||image}));
  return [{imagem:image,texto:(scene.textoIntro||'').trim()}];
}

export function maskNpcDirection(text,npc,known=false){
  if(known||!npc)return text;
  const first=npc.nome.replace(/^(Lady|Monge|Mestre|Senhor|Senhora)\s+/i,'').split(/\s+/)[0];
  return String(text||'').replace(/\[ACAO:([^\]]*)\]/gi,(_,action)=>'[ACAO:'+action.replaceAll(npc.nome,npc.publicAlias||'A pessoa').replaceAll(first,npc.publicAlias||'a pessoa')+']');
}
