from pathlib import Path
import re,json
r=Path(__file__).resolve().parent.parent
base=r/'public/MindRolePlay'
p=r/'MindRolePlay/src/oraculoEntry.js';s=p.read_text()
s=s.replace("      session.playerName = c.name;", "      session.playerName = c.name;\n      localStorage.setItem('mindRolePlay.character',JSON.stringify(c));")
s=s.replace("  chars.push(character);", "  localStorage.setItem('mindRolePlay.character',JSON.stringify(character));\n  chars.push(character);")
s=s.replace("      session.classId = localStorage.getItem('mindRolePlay.classId') ?? 'ronin';", "      session.classId = localStorage.getItem('mindRolePlay.classId') ?? 'ronin';\n      session.onlineMode=true;")
# Pass server ownership as source of truth; rejoin must never reinitialise narration.
s=s.replace("    const skipRedirect = _firstSnapshot && isHost;", "    const skipRedirect = false;")
s=s.replace("  session.isHost = isHost;", "  session.isHost = isHost;")
s=s.replace("  try {\n    // Prólogo", "  try {\n    if(!localStorage.getItem('oraculo.groqKey')) { const key=prompt('Chave Groq para o narrador e os NPCs (salva somente neste navegador):'); if(!key?.trim())return;localStorage.setItem('oraculo.groqKey',key.trim()); }\n    // Prólogo")
# Remove irrelevant disabled direct-arena/simulation flows from the visible home.
p.write_text(s)
# Original catalogue, with the single installed cartridge and original tabs/checklist.
p=base/'catalog.html';s=p.read_text().replace("'mhoried'","'kagehama'").replace('mhoried:', 'kagehama:').replace('Mhoried','Kagehama')
s=s.replace("'./catalogo/death-note/data.js'", "'../catalogo/death-note/data.js'").replace("'./catalogo/fantasma/data.js'", "'../catalogo/fantasma/data.js'")
s=re.sub(r'<div class="camp-menu-item[^\"]*" data-camp="(?:death-note|fantasma)"[^>]*>.*?</div>', '', s)
s=s.replace("const _CATALOG_VERSION", "const _CATALOG_VERSION")
p.write_text(s)
# Map pieces use the cartridge's real art and original movement/vote/fog engine.
p=base/'mapa.html';s=p.read_text().replace("import { MAPA_IMG, NOS, CAMINHOS }", "import { CLASSES_DATA } from './catalogo/kagehama/classes.js';\nimport { MAPA_IMG, NOS, CAMINHOS }")
s=s.replace('`catalogo/kagehama/classes/${cid}/peca_tabuleiro/${cid}_peca.png`', "CLASSES_DATA[cid]?.standee||''")
p.write_text(s)
# Narrator: retain original dialogue engine, turn/read gates, reactions and handoff.
p=base/'narration.html';s=p.read_text()
s=s.replace("import { NPCS }", "import { test3d6, resolveSuccessTest } from './gurps.js';\nimport { CLASSES_DATA } from './catalogo/kagehama/classes.js';\nimport { NPCS }")
start=s.index('  const GRUPOS = [');end=s.index('\n  ];',start)+len('\n  ];')
s=s[:start]+"  const GRUPOS = [1,2,3,4].map(ato=>({ato,label:'Ato '+ato+' — Kagehama',ids:CENAS_ORDEM.filter(id=>CENAS[id].ato===ato)}));"+s[end:]
# Actual three six-sided dice, no d20-shaped 3D model or reverse-success rule.
a=s.index('const PercDiceOverlay=(function(){');b=s.index('\n})();',a)+len('\n})();')
s=s[:a]+'''let _lastGurpsRoll=null;
function _gurpsSkill(name='Percepção') {
 const sheet=JSON.parse(localStorage.getItem('mindRolePlay.character')||'null');
 const player=_lastRoom?.players?.[_pid]||sheet||{};
 const cls=CLASSES_DATA[player.classId||localStorage.getItem('mindRolePlay.classId')];
 const skill=(player.skills||cls?.skills||[]).find(s=>s.name.toLowerCase()===name.toLowerCase());
 return Number(skill?.level||player.attributes?.IQ||cls?.attrs?.IQ||10);
}
const PercDiceOverlay={rolar(onResult){
 const result=test3d6(_gurpsSkill());_lastGurpsRoll=result;
 const wrap=document.getElementById('perc-dado-wrap');
 if(wrap){wrap.innerHTML='<div style="display:flex;gap:12px;justify-content:center;padding:30px">'+result.dice.map(d=>'<span style="background:white;color:black;border:2px solid #555;border-radius:9px;width:52px;height:52px;display:grid;place-items:center;font:bold 30px serif">'+['','⚀','⚁','⚂','⚃','⚄','⚅'][d]+'</span>').join('')+'</div>';}
 setTimeout(()=>onResult(result.total),450);
}};
''' +s[b:]
s=s.replace("const resposta = { aceito: true, resultado: roll };", "const resposta = { aceito: true, resultado: roll, dados:_lastGurpsRoll.dice, sucesso:_lastGurpsRoll.success, nivel:_lastGurpsRoll.effectiveSkill };")
s=s.replace("const sucesso = roll >= (_percLocal.dc || 12);", "const sucesso = _lastGurpsRoll.success;")
s=s.replace("const passaram  = efetivos.filter(p => (respostas[p]?.resultado || 0) >= dc);", "const passaram  = efetivos.filter(p => respostas[p]?.sucesso === true);")
s=s.replace("percepcao.dc || 12;", "_gurpsSkill();")
# Investigator's chosen skill/attribute is explicit, never decided retroactively by AI.
s=s.replace("  const roll = Math.floor(Math.random() * 20) + 1;", "  const chosen=prompt('Perícia ou atributo GURPS para esta ação:', 'Percepção');\n  if(chosen===null)return;\n  const cls=CLASSES_DATA[localStorage.getItem('mindRolePlay.classId')], player=_lastRoom?.players?.[_pid]||{};\n  const skills=player.skills||cls?.skills||[];\n  const level=skills.find(s=>s.name.toLowerCase()===chosen.toLowerCase())?.level||(player.attributes||cls?.attributes||{})[chosen.toUpperCase()];\n  if(!Number.isFinite(Number(level))){inp.value=texto;alert('Escolha uma perícia da ficha ou ST, DX, IQ, HT.');return;}\n  const result=test3d6(Number(level));_lastGurpsRoll=result;\n  const roll=result.total;")
s=s.replace("let verdito = roll >= 11 ? 'SUCESSO' : 'FALHA';", "let verdito = _lastGurpsRoll.success ? 'SUCESSO' : 'FALHA';")
s=s.replace('${ator} tenta uma ação e rolou 1d20 = ${roll}. VOCÊ decide a dificuldade (DC) coerente com a ousadia/complexidade da ação (trivial ~6, comum ~10, difícil ~15, muito difícil ~18+) e compara com a rolagem para decidir SUCESSO ou FALHA.', '${ator} tenta uma ação. GURPS 3d6: ${_lastGurpsRoll.dice.join("+")} = ${roll}, nível efetivo ${_lastGurpsRoll.effectiveSkill}, resultado definitivo ${verdito}. Narre esse resultado sem modificar os dados ou decidir sucesso novamente.')
s=s.replace('Rolagem 1d20 = ${roll}. Decida a dificuldade, o resultado e narre.', 'Rolagem GURPS 3d6 = ${roll}; resultado definitivo ${verdito}. Narre a consequência.')
s=s.replace("if (m) { verdito = m[1].toUpperCase(); narr = raw.slice(m[0].length).trim() || narr; }", "if (m) { narr = raw.slice(m[0].length).trim() || narr; }")
s=s.replace('1d20','3d6')
# Full-sheet rule context and cumulative per-NPC memory, preserving the source prompt.
s=s.replace('const contextoCena = `LOCAL:', 'const memoria=_lastRoom?.narration?.memorias?.[npc.id]||[];\n  const contextoCena = `MEMÓRIA ESTABELECIDA: ${JSON.stringify(memoria)}\\nLOCAL:')
s=s.replace("    return data.choices?.[0]?.message?.content?.trim() || null;", "    const reply=data.choices?.[0]?.message?.content?.trim()||null;\n    if(reply && window._fbUpdateNarration){\n      const saved=[...memoria,{jogador:_pname,pergunta:mensagemJogador,resposta:reply}].slice(-40);\n      await window._fbUpdateNarration({['memorias.'+npc.id]:saved});\n    }\n    return reply;")
p.write_text(s)

# Install the art at the canonical Oráculo paths used by catalogue and standees.
import shutil
cart=base/'catalogo/kagehama'
for file in (cart/'classes').glob('*/dados.json'):
 data=json.loads(file.read_text());id=data['id'];asset=base/data['portrait']
 for rel in [f'classes/{id}/retrato/{id}_retrato.png',f'classes/{id}/retrato/{id}_m_retrato.png',f'classes/{id}/retrato/{id}_f_retrato.png',f'classes/{id}/peca_tabuleiro/{id}_peca.png',f'classes/{id}/peca_tabuleiro/{id}_m_peca.png',f'classes/{id}/peca_tabuleiro/{id}_f_peca.png']:
  dest=cart/rel;dest.parent.mkdir(parents=True,exist_ok=True);shutil.copyfile(asset,dest)
for file in (cart/'npcs').glob('*/dados.json'):
 data=json.loads(file.read_text());id=data['id'];asset=base/data['img']
 for rel in [f'npcs/{id}/retrato/{id}_retrato.png',f'npcs/{id}/peca_tabuleiro/{id}_peca.png']:
  dest=cart/rel;dest.parent.mkdir(parents=True,exist_ok=True);shutil.copyfile(asset,dest)

# Keep Falar/Agir within the original dialogue composer; the engine still owns turns.
p=base/'narration.html';s=p.read_text()
s=s.replace('  <div id="dial-input-bar">', '''  <div style="display:flex;gap:6px;padding:5px 12px;background:#121212;align-items:center">
    <button id="mind-fala" onclick="window._mindModo(false)" aria-pressed="true">Falar</button>
    <button id="mind-acao" onclick="window._mindModo(true)" aria-pressed="false">Agir · 3d6</button>
    <select id="mind-skill" aria-label="Perícia GURPS" style="display:none;max-width:55%;background:#222;color:white"></select>
  </div>
  <div id="dial-input-bar">''')
pos=s.index('// ── Estado local')
s=s[:pos]+'''let _mindAcao=false;
window._mindModo=function(acao){
 _mindAcao=acao;
 const player=_lastRoom?.players?.[_pid]||JSON.parse(localStorage.getItem('mindRolePlay.character')||'null')||{};
 const cls=CLASSES_DATA[player.classId||localStorage.getItem('mindRolePlay.classId')];
 const select=document.getElementById('mind-skill');
 select.replaceChildren();
 for(const skill of [...(player.skills||cls?.skills||[]),...Object.entries(player.attributes||cls?.attributes||{}).map(([name,level])=>({name,level}))]){
  const option=document.createElement('option');option.value=String(skill.level);option.textContent=skill.name+' · '+skill.level;select.append(option);
 }
 select.style.display=acao?'':'none';
 document.getElementById('mind-fala').setAttribute('aria-pressed',String(!acao));
 document.getElementById('mind-acao').setAttribute('aria-pressed',String(acao));
 document.getElementById('dial-msg-input').placeholder=acao?'Descreva sua ação…':'O que você diz…';
};

''' +s[pos:]
a=s.index('window._dialEnviar = async function ()');b=s.index('// ── Navegação e histórico',a)
block=s[a:b].replace("  const texto = (input?.value || '').trim();", "  let texto = (input?.value || '').trim();")
block=block.replace("  if (!texto) return;", """  if (!texto) return;
  if(_mindAcao){
    const select=document.getElementById('mind-skill');
    if(!select.options.length)window._mindModo(true);
    const result=test3d6(Number(select.value));
    texto='[GURPS 3d6: '+result.dice.join('+')+' = '+result.total+'; '+select.selectedOptions[0].textContent+'; '+result.outcome+'; margem '+result.margin+'] '+texto;
  }""")
s=s[:a]+block+s[b:]
s=s.replace('REGRAS: Português brasileiro, 1ª pessoa.', 'REGRAS: Resultados GURPS 3d6 informados pelo programa são definitivos: narre a consequência sem refazer testes ou alterar sucesso, falha ou críticos. Fala comum não exige dado; não conceda persuasão contra interesses sem teste. Português brasileiro, 1ª pessoa.')
s=s.replace("jogador:_pname,pergunta:mensagemJogador", "jogador:(_dialogoLog.filter(b=>b.tipo==='jogador').at(-1)?.oradorNome||_pname),pergunta:mensagemJogador")
p.write_text(s)
# Catalogue uses four GURPS attributes, not compatibility aliases for old UI code.
p=base/'catalog.html';s=p.read_text().replace('Object.entries(cls.attrs)', 'Object.entries(cls.attributes||cls.attrs)').replace('CAMP_PALETTE.mhoried','CAMP_PALETTE.kagehama')
p.write_text(s)

# Preserve the catalogue layout while showing actual GURPS values and both artworks.
p=base/'catalog.html';s=p.read_text().replace('⚔️ ATK d${cls.atk+4}','🎲 NH ${cls.attack}')\
 .replace('🎲 d${cls.atk+4}','🎲 3d6').replace('Dado Atk','Teste GURPS').replace('SP Máx','PF Máx')\
 .replace('<div class="am">${mod(v)}</div>','<div class="am">GURPS</div>')
s=s.replace("function classSpriteUrl(id, gender){", "function classSpriteUrl(id, gender){")
# Replace only the return paths, leaving original function/event boundaries intact.
s=s.replace('`catalogo/kagehama/classes/${id}/retrato/${id}_${gender}_retrato.png`', "CLASSES_DATA[id.replace(/_f$/,'')+(gender==='f'?'_f':'')]?.portrait||''")
s=s.replace('`catalogo/kagehama/classes/${id}/peca_tabuleiro/${id}_${g}${r}_peca.png`', "CLASSES_DATA[id.replace(/_f$/,'')+(g==='f'?'_f':'')]?.standee||''")
p.write_text(s)

# Kagehama scenes map directly to narration scenes; registry-only NPCs need no
# optional curated `cenas` list. Never fail the entire scene on its absence.
p=base/'narration.html';s=p.read_text()
s=s.replace('return npc.cenas[0];', 'return npc.cenas?.[0] || campCenaId;')
s=s.replace('_dialNpcs.filter(n => n.cenas.includes(narracaoCena))', '_dialNpcs.filter(n => n.cenas?.includes(narracaoCena))')
s=s.replace("  _dialChroma(tctx, W, H);", "  /* Existing Kagehama PNG transparency is preserved; no chromakey erasure. */")
# Spread NPCs on a common ground line, rather than stacking them at left=0.
s=s.replace('left:${npc.offsetPx || 0}px;height:${npcVh}vh;', 'left:${i*16}%;height:${npcVh}vh;')
# Same scene also renders all player characters from their actual selected class.
s=s.replace('  // Selecionar primeiro NPC ativo\n', '''  Object.entries(_lastRoom?.players||{}).forEach(([pid,player],index)=>{
    const cls=CLASSES_DATA[player.classId];
    const src=player.standee||cls?.standee;
    if(!src)return;
    const div=document.createElement('div');div.className='dial-hero';
    div.dataset.playerId=pid;
    div.style.right=(index*13)+'%';
    const canvas=document.createElement('canvas');
    _dialLoadCanvas(src,canvas,()=>{div.append(canvas);requestAnimationFrame(()=>div.classList.add('dentro'));},()=>{});
    const label=document.createElement('span');label.textContent=player.nome||player.name||'Aventureiro';div.append(label);
    container.append(div);
  });
  // Selecionar primeiro NPC ativo
''')
s=s.replace('</style>', '''
/* Scene-first portrait layout: full background, opaque actors at ground level. */
#dial-overlay{height:100dvh;max-height:100dvh;overflow:hidden;background:#080808}
#dial-personagens{bottom:190px;height:37dvh;z-index:4;overflow:hidden}
.dial-npc{max-width:30vw;height:33dvh!important;opacity:1!important;filter:drop-shadow(0 5px 10px #0008)!important}
.dial-npc.inativo{opacity:1!important;filter:drop-shadow(0 5px 10px #0008)!important;height:28dvh!important}
.dial-npc canvas{height:100%;max-width:30vw;object-fit:contain;object-position:bottom}
.dial-hero{position:absolute;bottom:0;height:34dvh;max-width:32vw;transform:translateX(120%);transition:transform .5s;z-index:9}
.dial-hero.dentro{transform:none}.dial-hero canvas{height:100%;max-width:32vw;object-fit:contain;object-position:bottom}
.dial-hero span{position:absolute;bottom:0;left:0;right:0;text-align:center;background:#111d;color:#fff;font:10px sans-serif;padding:3px}
#dial-balao,#dial-player-card{z-index:15;max-height:32dvh}
#dial-cena-bg::after{background:linear-gradient(0deg,#0008,transparent 65%)}
#dial-npc-chips{overflow-x:auto;flex-wrap:nowrap;flex-shrink:0}
#dial-input-bar,#dial-turno-bar{flex-shrink:0}
@media(max-height:520px){#dial-personagens{bottom:130px;height:35dvh}.dial-npc{height:32dvh!important}.dial-npc.inativo{height:27dvh!important}.dial-hero{height:32dvh}#dial-balao{max-height:32dvh;top:35px}}
</style>''',1)
# Cached image events must not leave a valid background hidden.
s=s.replace("      elImagem.src = imgSrc;", "      elImagem.src = _imgBust(imgSrc);\n      if(elImagem.complete && elImagem.naturalWidth)onImagemCarregada();")
s=s.replace('v46', 'Mind v3')
p.write_text(s)

# Reveal actors only as they speak; one interlocutor per side, common scale.
p=base/'narration.html';s=p.read_text()
s=re.sub(r"requestAnimationFrame\(\(\)\s*=>\s*div.classList.add\('dentro'\)\);",lambda m:"div.classList.add('arte-pronta');if(div.classList.contains('em-cena'))requestAnimationFrame(()=>div.classList.add('dentro'));",s)
# No blanket entrance when one NPC takes the floor.
s=s.replace("    _dialNpcEls.forEach(({ par }) => {\n      if (!par.classList.contains('dentro')) par.classList.add('dentro');\n    });", "    _mindMostrarAtor('npc',oradorId);")
s=s.replace("  } else if (tipo === 'jogador') {\n    const CLASS_AVATAR", "  } else if (tipo === 'jogador') {\n    _mindMostrarAtor('jogador',beat.authorId||oradorId);\n    const CLASS_AVATAR")
where=s.index('function _dialFocarNpc(npcId)')
s=s[:where]+'''function _mindMostrarAtor(tipo,id){
  const npc=tipo==='npc';
  const actors=npc?_dialNpcEls.map(e=>({el:e.par,id:e.npc.id}))
    :Array.from(document.querySelectorAll('#dial-personagens .dial-hero')).map(el=>({el,id:el.dataset.playerId}));
  for(const actor of actors){
    const visible=actor.id===id;
    actor.el.classList.toggle('em-cena',visible);
    if(!visible)actor.el.classList.remove('dentro');
    else if(actor.el.classList.contains('arte-pronta'))requestAnimationFrame(()=>actor.el.classList.add('dentro'));
  }
}

''' +s[where:]
s=s.replace('</style>', '''
/* Left: one player; right: one NPC. Equal canvas height and ground line. */
#dial-personagens{height:41dvh;overflow:visible}
#dial-personagens .dial-npc,#dial-personagens .dial-hero{
  height:40dvh!important;max-width:44vw;bottom:0;visibility:hidden;opacity:1!important;
  pointer-events:none;transition:transform .45s ease,visibility .45s;
}
#dial-personagens .dial-npc{left:auto!important;right:1%!important;transform:translateX(115%)}
#dial-personagens .dial-hero{left:1%!important;right:auto!important;transform:translateX(-115%)}
#dial-personagens .em-cena{visibility:visible;transition:transform .45s ease}
#dial-personagens .dentro.em-cena{transform:translateX(0)}
#dial-personagens .dial-npc canvas,#dial-personagens .dial-hero canvas{
 height:100%;width:auto;max-width:44vw;object-fit:contain;object-position:bottom;
}
#dial-personagens .dial-hero canvas{transform:none}
@media(max-height:520px){#dial-personagens{height:42dvh}#dial-personagens .dial-npc,#dial-personagens .dial-hero{height:41dvh!important}}
</style>''',1)
s=s.replace('Mind v3','Mind v4')
p.write_text(s)

# One shared response path for host/guests, explicit reading, recoverable AI errors.
p=base/'narration.html';s=p.read_text()
a=s.index('    const ehMinha = beat.authorId === _pid;');b=s.index('\n  } else {\n    // narrador / sistema',a)
s=s[:a]+'''    _dialMostrarCardPlayer(oradorNome || 'Jogador', avatar, texto || '', true);
    _dialHistoricoLocal.push({ tipo: 'jogador', quem: oradorNome || 'Jogador', texto: texto || '' });
    _dialAnimBeat = false;
    _dialAwaitingCont = true;
''' +s[b:]
s=s.replace("okBtn.textContent = '✔ OK';", "okBtn.textContent = '▶ Continuar';")
s=s.replace("if (!key) return null;\n  const npc", "if (!key) throw new Error('Configure a chave Groq no aparelho do anfitrião.');\n  const npc")
s=s.replace("    if (data.error) throw new Error(data.error.message);", "    if (!resp.ok || data.error) throw new Error(data.error?.message || 'Serviço de IA indisponível ('+resp.status+').');")
s=s.replace("    return reply;\n  } catch (_) { return null; }", "    if(!reply)throw new Error('A IA não retornou uma resposta.');\n    return reply;\n  } catch (error) { throw new Error(error.name==='AbortError'?'A IA demorou demais para responder.':error.message); }")
a=s.index('async function _dialFluxoTurnos(){');b=s.index('// ── Helpers',a)
s=s[:a]+'''let _mindRespostaEmCurso=false;
function _mindErroResposta(error){
 const status=document.getElementById('dial-ia-pensando');
 status.replaceChildren();status.style.display='block';
 const text=document.createElement('span');text.textContent='Não foi possível obter a resposta: '+error.message+' ';
 const retry=document.createElement('button');retry.textContent='Tentar novamente';
 retry.onclick=()=>{_dialIaRespondTs=null;_dialFluxoTurnos();};
 status.append(text,retry);
}
async function _dialFluxoTurnos(){
 if(!_isHost||!_dialAtivo||_mindRespostaEmCurso)return;
 const ult=_dialogoLog.at(-1);
 if(!ult||ult.tipo!=='jogador'||_dialIaRespondTs===ult.ts)return;
 _mindRespostaEmCurso=true;_dialIaRespondTs=ult.ts;
 const status=document.getElementById('dial-ia-pensando');
 status.textContent='Preparando a resposta…';status.style.display='block';
 try{
  const idx=ult.npcId?_dialNpcEls.findIndex(e=>e.npc.id===ult.npcId):_dialNpcAtivoIdx;
  const npc=_dialNpcEls[idx]?.npc;
  if(!npc)throw new Error('O NPC escolhido não está nesta cena.');
  const resposta=await _dialChamarIA(idx,ult.texto);
  if(_dialogoLog.at(-1)?.ts!==ult.ts)return;
  const beat={tipo:'npc',oradorId:npc.id,oradorNome:npc.nome,texto:resposta,respondeA:ult.ts,ts:Date.now()};
  if(window._fbAddDialogue)await window._fbAddDialogue(beat);
  else{_dialogoLog=[..._dialogoLog,beat];renderDialogo();_dialTickDisplay();}
  status.style.display='none';
  try{await _dialVerificarReacao(idx);}catch(error){console.warn('Reação opcional indisponível:',error.message);}
 }catch(error){_mindErroResposta(error);}
 finally{_mindRespostaEmCurso=false;_dialAtualizarVezUI();}
}

''' +s[b:]
s=s.replace("texto, classId: jogador.classId, authorId: _pid, ts: Date.now(),", "texto, classId: jogador.classId, authorId: _pid, npcId:_dialNpcEls[_dialNpcAtivoIdx]?.npc.id||null, ts: Date.now(),")
a=s.index('  // Guest: para aqui');b=s.index('// ── Navegação e histórico',a)
s=s[:a]+'''  // Only the host generates replies; both local and remote speech use this path.
  await _dialFluxoTurnos();
  _dialAtualizarVezUI();
};

''' +s[b:]
s=s.replace('Mind v4','Mind v5')
p.write_text(s)

# Use the shared log, including unread guest speech, as the NPC context.
p=base/'narration.html';s=p.read_text()
s=s.replace("const historicoTexto = _dialHistoricoLocal.length\n    ? _dialHistoricoLocal.map(e => `${e.quem}: \"${e.texto}\"`).join('\\n')", "const historicoTexto = _dialogoLog.length\n    ? _dialogoLog.slice(-40).map(e => `${e.oradorNome}: \"${e.texto}\"`).join('\\n')")
p.write_text(s)
# Response status must remain visible while the player's card hides the NPC balloon.
p=base/'narration.html';s=p.read_text()
s=s.replace('    <div id="dial-ia-pensando">✨ Pensando…</div>\n','')
s=s.replace('  <div id="dial-player-card"></div>', '  <div id="dial-player-card"></div>\n  <div id="dial-ia-pensando" role="status" aria-live="polite">Preparando a resposta…</div>')
s=s.replace('</style>', '''
#dial-ia-pensando{position:absolute;bottom:220px;left:3%;right:3%;z-index:25;background:#161616ed;color:#fff;padding:10px 14px;border-radius:9px;font:14px sans-serif;max-height:20dvh;overflow:auto}
#dial-ia-pensando button{padding:8px 12px;margin:5px;color:#fff;background:#433057;border:1px solid #b594cb;border-radius:7px}
</style>''')
p.write_text(s)
