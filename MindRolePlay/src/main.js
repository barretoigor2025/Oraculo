import './styles.css';
import { CAMPAIGN_SECTIONS, createDemoCampaigns, createEmptyCampaign } from './campaigns.js';
import { roll3d6, resolveSuccessTest } from './gurps.js';
import {
  createCampaign as createCampaignRemote,
  createRoom as createRoomRemote,
  installDemoCampaignsIfEmpty,
  joinRoom as joinRoomRemote,
  loadCampaigns,
  listenRoom,
  saveCampaign,
  setPlayerReady,
  startNarration,
  postRoomMessage,
} from './firebaseRepository.js';

const STORE_KEY = 'mindRolePlay.demo.v1';
const PLAYER_KEY = 'mindRolePlay.playerId';
const screens = [...document.querySelectorAll('.screen')];
const toast = document.querySelector('#toast');
const storageLabel = document.querySelector('#storage-label');
let campaigns = [];
let currentCampaignId = '';
let currentSectionId = '';
let activeCharacterId = '';
let firebaseMode = true;
let roomUnsubscribe = null;
let chosenCharacter = null;
let activeRoomCode = '';
let liveRoom = null;
let playerGender = 'male';
let returnRoomCode = new URLSearchParams(location.search).get('room')?.toUpperCase() || '';
let toastTimer;

function notice(message) {
  toast.textContent = message;
  toast.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove('show'), 3400);
}

function localPlayerId() {
  let id = localStorage.getItem(PLAYER_KEY);
  if (!id) {
    id = crypto.randomUUID();
    localStorage.setItem(PLAYER_KEY, id);
  }
  return id;
}

function localCampaigns() {
  try {
    const stored = JSON.parse(localStorage.getItem(STORE_KEY) || 'null');
    if (Array.isArray(stored) && stored.length) {
      const sample = createDemoCampaigns().find(item => item.id === 'demo-kagehama');
      if (sample) {
        const index = stored.findIndex(item => item.id === sample.id);
        if (index < 0) stored.push(sample);
        else if (Number(stored[index].schemaVersion || 1) < 5 || (stored[index].classes || []).length !== sample.classes.length || (stored[index].art || []).length !== sample.art.length) {
          const old = stored[index];
          stored[index] = {
            ...sample, ...old, schemaVersion: 5,
            classes: sample.classes, art: sample.art, progression: sample.progression, artDirection: sample.artDirection,
            npcs: [...sample.npcs, ...(old.npcs || []).filter(item => !sample.npcs.some(seed => seed.id === item.id))],
            scenes: [...sample.scenes, ...(old.scenes || []).filter(item => !sample.scenes.some(seed => seed.id === item.id))],
            progressionLog: old.progressionLog || [], characters: (old.characters || []).map(character => { const cls = sample.classes.find(item => item.id === character.classId); const gender = character.gender === 'female' ? 'female' : 'male'; return cls ? { ...character, portrait: cls.portraits[gender], assetPath: cls.assetPaths[gender] } : character; }),
            checklist: [...sample.checklist, ...(old.checklist || []).filter(item => !sample.checklist.some(seed => seed.id === item.id))],
          };
        }
        localStorage.setItem(STORE_KEY, JSON.stringify(stored));
      }
      return stored;
    }
  } catch {}
  const samples = createDemoCampaigns();
  localStorage.setItem(STORE_KEY, JSON.stringify(samples));
  return samples;
}

function saveLocalCampaigns() {
  localStorage.setItem(STORE_KEY, JSON.stringify(campaigns));
}

async function persistCampaign(campaign) {
  campaign.updatedAt = Date.now();
  if (firebaseMode) {
    try {
      await saveCampaign(campaign);
      return;
    } catch (error) {
      console.warn('Mind RolePlay: usando armazenamento local nesta prévia.', error);
      firebaseMode = false;
      storageLabel.textContent = 'Prévia local';
      notice('Firebase ainda não liberou as coleções do Mind. Salvando esta prévia neste navegador.');
    }
  }
  saveLocalCampaigns();
}

function showScreen(name) {
  screens.forEach(screen => screen.classList.toggle('active', screen.id === 'screen-' + name));
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function currentCampaign() {
  return campaigns.find(item => item.id === currentCampaignId);
}

function updateHomeCampaign() {
  const campaign = currentCampaign();
  const label = document.querySelector('#active-campaign-name');
  if (label) label.textContent = campaign?.title || 'Nenhuma campanha selecionada';
}

function renderCampaigns() {
  const playCards=campaigns.map((campaign,index) => '<button class="campaign-card manga-card" data-play-campaign="'+escapeAttr(campaign.id)+'"><span class="number">HISTÓRIA '+String(index+1).padStart(2,'0')+' · '+escapeHtml(campaign.genre||'Aventura')+'</span><strong>'+escapeHtml(campaign.title)+'</strong><span>'+escapeHtml(campaign.premise||'Uma campanha narrativa pronta para receber personagens.')+'</span><b>ESCOLHER PERSONAGEM →</b></button>').join('');
  const dbCards=campaigns.map((campaign,index) => '<button class="campaign-card manga-card" data-open-campaign="'+escapeAttr(campaign.id)+'"><span class="number">PACOTE '+String(index+1).padStart(2,'0')+' · '+escapeHtml(campaign.genre||'Gênero não definido')+'</span><strong>'+escapeHtml(campaign.title)+'</strong><span>'+countCampaignContent(campaign)+' elementos preparados · abrir Mind Database →</span></button>').join('');
  const grid=document.querySelector('#campaign-grid');if(grid)grid.innerHTML=dbCards;
  const home=document.querySelector('#home-campaign-grid');if(home)home.innerHTML=playCards||'<p class="empty-state">Nenhuma campanha instalada ainda. Abra o Mind Database para preparar a primeira.</p>';
  document.querySelectorAll('[data-play-campaign]').forEach(button=>button.addEventListener('click',()=>openCharacterBuilder(button.dataset.playCampaign)));
  document.querySelectorAll('[data-open-campaign]').forEach(button=>button.addEventListener('click',()=>openCampaign(button.dataset.openCampaign)));
}

function countCampaignContent(campaign) {
  return ['classes', 'characters', 'npcs', 'scenes', 'maps', 'travel', 'art', 'checklist', 'progressionLog']
    .reduce((sum, key) => sum + (campaign[key]?.length || 0), 0);
}

function openCampaign(id) {
  currentCampaignId = id;
  const campaign = currentCampaign();
  if (!campaign) return;
  document.querySelector('#package-title').textContent = campaign.title;
  document.querySelector('#package-genre').textContent = campaign.genre || 'PACOTE DE CAMPANHA';
  document.querySelector('#package-premise').textContent =
    campaign.premise || 'Este pacote começa vazio. Cada área tem o mesmo formato em todas as campanhas.';
  const grid = document.querySelector('#package-sections');
  grid.innerHTML = CAMPAIGN_SECTIONS.map(section => {
    const count = section.id === 'story' ? (campaign.story ? 1 : 0) : section.id === 'evolution' ? (campaign.progressionLog?.length || 0) : (campaign[section.id]?.length || 0);
    return `<button class="section-card" data-section="${section.id}">
      <em>${count} item${count === 1 ? '' : 's'}</em><strong>${section.label}</strong><span>${section.description}</span>
    </button>`;
  }).join('');
  grid.querySelectorAll('[data-section]').forEach(button => button.addEventListener('click', () => openSection(button.dataset.section)));
  renderCampaigns();
  showScreen('package');
}

function openSection(id) {
  const section = CAMPAIGN_SECTIONS.find(item => item.id === id);
  if (!section || !currentCampaign()) return;
  currentSectionId = id;
  document.querySelector('#section-title').textContent = section.label;
  document.querySelector('#section-description').textContent = section.description;
  document.querySelector('#section-kicker').textContent = currentCampaign().title;
  renderSectionTabs();
  renderSectionBody();
  showScreen('section');
}

function renderSectionTabs() {
  const tabs = document.querySelector('#section-tabs');
  if (!tabs) return;
  tabs.innerHTML = CAMPAIGN_SECTIONS.map(section => `<button class="section-tab ${section.id===currentSectionId?'active':''}" data-tab="${section.id}">${escapeHtml(section.label)}</button>`).join('');
  tabs.querySelectorAll('[data-tab]').forEach(button => button.addEventListener('click', () => openSection(button.dataset.tab)));
}

function makeStarterClasses(text, genre) {
  const setting = (genre + ' ' + String(text||'')).toLowerCase();
  if (/samurai|medieval jap|feudal|kagehama/.test(setting)) return structuredClone(createDemoCampaigns().find(item => item.id === 'demo-kagehama').classes);
  const profile=[
    ['Batedor','🏹','Encontra caminhos e percebe perigos.',{ST:10,DX:13,IQ:11,HT:11},[['Furtividade',13],['Percepção',12],['Sobrevivência',11]]],
    ['Erudito','📜','Conhece histórias, idiomas e pistas.',{ST:9,DX:10,IQ:14,HT:10},[['Conhecimento',14],['Pesquisa',13],['Persuasão',10]]],
    ['Guardião','🛡️','Protege aliados e enfrenta ameaças.',{ST:13,DX:10,IQ:10,HT:12},[['Briga',13],['Intimidação',11],['Vigor',12]]],
    ['Curandeiro','🌿','Cuida de ferimentos e mantém o grupo em movimento.',{ST:9,DX:11,IQ:12,HT:11},[['Primeiros socorros',13],['Empatia',12],['Conhecimento',11]]],
    ['Infiltrador','◈','Age com discrição e preparação.',{ST:9,DX:14,IQ:12,HT:10},[['Furtividade',14],['Disfarce',12],['Investigação',12]]],
    ['Místico','✧','Interpreta fenômenos e conduz rituais.',{ST:9,DX:10,IQ:14,HT:10},[['Ocultismo',14],['Pesquisa',13],['Empatia',11]]],
  ];
  return profile.map((p,index)=>({id:'class-'+(index+1),name:p[0],icon:p[1],portrait:'',description:p[2],attributes:p[3],skills:p[4].map(([name,level])=>({name,level})),fixedAbilities:[p[2]],startingLevel:1}));
}
function prepareClassArt(campaign) {
  const portraits = (campaign.classes || []).filter(cls => cls.artBrief && cls.portrait);
  campaign.art ||= [];
  campaign.checklist ||= [];
  for (const cls of portraits) {
    const id = 'art-' + cls.id;
    if (!campaign.art.some(item => item.id === id)) campaign.art.push({id,title:'Retrato · '+cls.name,description:cls.artBrief,assetPath:cls.assetPath||cls.portrait,kind:'portrait',status:'brief-ready',done:false});
    const checkId = 'artcheck-' + cls.id;
    if (!campaign.checklist.some(item => item.id === checkId)) campaign.checklist.unshift({id:checkId,title:'Criar retrato: '+cls.name,description:'Arte padronizada de personagem · arquivo-alvo '+(cls.assetPath||cls.portrait),done:false,category:'Arte das classes',createdAt:Date.now()});
  }
}

function analyzeCampaignText(text, genre) {
  const lines=String(text||'').split(/\n+/).map(line=>line.replace(/^#{1,6}\s*/,'').trim()).filter(Boolean);
  const headings=lines.filter(line=>/^(?:capítulo|cena|local|npc|personagem|monstro|missão|ato)\b/i.test(line));
  const threats=/monstro|inimigo|perigo|combate|ameaça|boss|vilão/i.test(text);
  const social=/negoci|convenc|persuad|mentir|diálogo|polític/i.test(text);
  const exploration=/explor|investig|pista|mapa|ruína|segredo/i.test(text);
  const checklist=[
    {title:'Revisar classes iniciais sugeridas',description:'Confirmar se os arquétipos combinam com esta campanha.',done:false},
    {title:'Definir retratos das classes',description:'Adicionar a arte definitiva depois da revisão.',done:false},
    {title:'Definir rotas e duração das viagens',description:'Registrar caminhos alternativos, riscos e oportunidades.',done:false},
    {title:'Preparar situações de jornada',description:'Criar encontros sociais, caça, perseguições e complicações de estrada.',done:false},
    ...(headings.length?[]:[{title:'Separar capítulos e cenas',description:'O roteiro não trouxe títulos claros de cena.',done:false}]),
    {title:'Preparar mapa e referências visuais',description:'Itens visuais podem ser adicionados quando necessários.',done:false},
  ].map((item,index)=>({id:'check-'+index,...item,createdAt:Date.now()}));
  return {status:'rascunho-local',extractedAt:Date.now(),sceneHeadings:headings,checklist,balance:{startingLevel:1,recommendedSkillRange:'11–13',threats:threats?'ameaças presentes; priorizar sobrevivência e proteção':'começo de baixo risco; foco em exploração e interação',social,exploration,threats,narratorReview:'Sugestão inicial para nível 1; o narrador confirma o tom e a dificuldade.'}};
}

function renderSectionBody() {
  const campaign=currentCampaign(), body=document.querySelector('#section-body');
  if(currentSectionId==='story'){
    const analysis=campaign.analysis;
    body.innerHTML=`<div class="panel editor">
      <div class="hint-box">O roteiro é a entrada do pacote. A análise organiza classes, cenas e necessidades; o narrador revisa as sugestões.</div>
      <div class="analysis-summary"><span class="analysis-mark">✦</span><div><strong>${analysis?'Análise inicial pronta':'Roteiro ainda não analisado'}</strong><small>${analysis?escapeHtml(analysis.balance.threats):'Cole o roteiro ao instalar a campanha para montar o pacote.'}</small></div></div>
      <div class="story-source"><small>ROTEIRO DA CAMPANHA</small><p>${escapeHtml(campaign.story||'Nenhum roteiro importado ainda.')}</p></div>
      ${campaign.source?`<div class="source-line">Fonte: ${escapeHtml(campaign.source)}</div>`:''}
      ${analysis?`<div class="hint-box">Nível inicial sugerido: ${analysis.balance.startingLevel} · perícias iniciais ${analysis.balance.recommendedSkillRange}. ${escapeHtml(analysis.balance.narratorReview)}</div>`:''}
      <button id="reanalyze-story" class="button">${analysis?'Reanalisar roteiro':'Analisar roteiro'}</button>
      <small class="prototype-note">Análise estrutural local de demonstração. A integração com o serviço de IA do Oráculo ainda não está conectada.</small>
    </div>`;
    document.querySelector('#reanalyze-story').addEventListener('click',async()=>{
      campaign.analysis=analyzeCampaignText(campaign.story||'',campaign.genre||'');
      campaign.classes=makeStarterClasses(campaign.story||'',campaign.genre||'');
      campaign.checklist=campaign.analysis.checklist;
      campaign.art=[]; prepareClassArt(campaign);
      campaign.npcs=campaign.analysis.sceneHeadings.filter(name=>/^npc|personagem/i.test(name)).map((title,index)=>({id:'npc-'+index,title,description:'Identificado no roteiro',createdAt:Date.now()}));
      campaign.scenes=campaign.analysis.sceneHeadings.filter(name=>/cena|capítulo|ato|local/i.test(name)).map((title,index)=>({id:'scene-'+index,title,description:'Identificado no roteiro',createdAt:Date.now()}));
      await persistCampaign(campaign);openCampaign(campaign.id);notice('Estrutura inicial preparada para revisão.');
    });
    return;
  }
  if(currentSectionId==='classes'){
    const classes=campaign.classes||[];
    body.innerHTML=`<div class="class-grid">${classes.length?classes.map(cls=>`
      <article class="class-template manga-class">
        <div class="class-gender-art">${['male','female'].map(gender=>`<figure><div class="class-portrait">${cls.portraits?.[gender]?`<img src="${escapeAttr(cls.portraits[gender])}" alt="">`:'<span>影</span>'}</div><figcaption>${gender==='male'?'MASCULINO':'FEMININO'}</figcaption></figure>`).join('')}</div>
        <div class="class-template-copy"><small>${escapeHtml(cls.archetype||cls.role||'ARQUÉTIPO')} · CLASSE · NÍVEL ${cls.startingLevel||1}</small><h2>${escapeHtml(cls.name)}</h2><p>${escapeHtml(cls.description||'')}</p>
          <div class="class-stats">${Object.entries(cls.attributes||{}).map(([key,value])=>`<span>${escapeHtml(key)} <b>${escapeHtml(value)}</b></span>`).join('')}</div>
          <h3>Perícias e testes</h3><div class="class-skill-list">${(cls.skills||[]).map(skill=>`<div><b>${escapeHtml(skill.name)}</b><span>3d6 ≤ ${escapeHtml(skill.level)}</span><small>${escapeHtml(skill.description||skill.attribute||'Teste quando houver risco relevante.')}</small></div>`).join('')}</div>
          <div class="fixed-ability"><b>Habilidade fixa</b><p>${escapeHtml((cls.fixedAbilities||[]).join(' · '))}</p></div>
          ${cls.roleplayProfile?`<details><summary>Guia para a IA narradora</summary><p><b>Voz:</b> ${escapeHtml(cls.roleplayProfile.voice||'')}</p><p><b>Objetivo:</b> ${escapeHtml(cls.roleplayProfile.want||'')}</p><p><b>Receio:</b> ${escapeHtml(cls.roleplayProfile.fear||'')}</p><p>${escapeHtml(cls.roleplayProfile.narratorGuidance||'')}</p></details>`:''}
          ${cls.artBrief?`<details class="art-brief"><summary>Direção de arte</summary><p>${escapeHtml(cls.artBrief)}</p></details>`:''}
        </div></article>`).join(''):'<div class="empty-state">Analise o roteiro para preparar as classes desta campanha.</div>'}</div>
      <div class="prototype-note">A classe mantém atributos e perícias iniciais fixos. A escolha de gênero altera o retrato, não restringe o arquétipo.</div>`;
    return;
  }
  if(currentSectionId==='characters'){
    const classes=campaign.classes||[];
    body.innerHTML=`<div class="panel editor"><div class="hint-box">Escolha um arquétipo e dê um nome. Retrato, atributos, perícias e habilidade inicial vêm prontos da classe.</div>
      ${classes.length?`<form id="character-form" class="editor-form">
        <div class="class-picker">${classes.map((cls,index)=>`<label class="class-option ${index===0?'selected':''}"><input type="radio" name="classId" value="${escapeAttr(cls.id)}" ${index===0?'checked':''} required><span class="class-option-icon">${cls.portrait?`<img src="${escapeAttr(cls.portrait)}" alt="">`:escapeHtml(cls.icon||'✦')}</span><span><strong>${escapeHtml(cls.name)}</strong><small>${escapeHtml(cls.archetype||'Classe')} · ${escapeHtml(cls.description||'')}</small></span></label>`).join('')}</div>
        <label class="field">Nome do personagem<input class="input" name="name" required maxlength="40" placeholder="Nome do personagem"></label>
        <button class="button primary">＋ Criar personagem</button></form>`:'<div class="empty-state">Importe e analise o roteiro para preparar as classes desta campanha.</div>'}
      <div id="character-list" class="character-sheet-list"></div></div>`;
    renderCharacterList();
    document.querySelectorAll('.class-option').forEach(option=>option.addEventListener('click',()=>document.querySelectorAll('.class-option').forEach(row=>row.classList.toggle('selected',row===option))));
    document.querySelector('#character-form')?.addEventListener('submit',async event=>{
      event.preventDefault();const form=new FormData(event.currentTarget),cls=classes.find(item=>item.id===form.get('classId'));if(!cls)return;
      campaign.characters||=[];
      campaign.characters.push({id:crypto.randomUUID(),name:String(form.get('name')).trim(),classId:cls.id,className:cls.name,archetype:cls.archetype||'',portrait:cls.portrait||'',icon:cls.icon||'✦',level:cls.startingLevel||1,attributes:{...cls.attributes},skills:structuredClone(cls.skills||[]),fixedAbilities:structuredClone(cls.fixedAbilities||[]),advantages:'',disadvantages:'',conditions:[],evolutionPoints:0,createdAt:Date.now()});
      await persistCampaign(campaign);renderSectionBody();notice('Ficha criada. A classe definiu retrato, perícias e habilidades iniciais.');
    });
    return;
  }
  if(currentSectionId==='npcs'){
    const npcs=campaign.npcs||[];
    body.innerHTML=npcs.length?`<div class="npc-database">${npcs.map(npc=>{const p=npc.behaviorProfile||{};return `
      <article class="npc-dossier panel">
        <header><div class="npc-portrait-placeholder" aria-hidden="true">人</div><div><small>ARQUIVO DE NPC · ${escapeHtml(npc.faction||'FACÇÃO A DEFINIR')}</small><h2>${escapeHtml(npc.title||npc.name||'NPC')}</h2><p>${escapeHtml(npc.description||'')}</p></div></header>
        <div class="npc-profile-grid"><p><b>Voz</b><span>${escapeHtml(p.voice||'A definir')}</span></p><p><b>Objetivo</b><span>${escapeHtml(p.goal||'A definir')}</span></p><p><b>Medo</b><span>${escapeHtml(p.fear||'A definir')}</span></p><p><b>Métodos</b><span>${escapeHtml(p.methods||'A definir')}</span></p><p><b>Sinal observável</b><span>${escapeHtml(p.tell||'A definir')}</span></p><p><b>Se pressionado</b><span>${escapeHtml(p.ifPressured||'A definir')}</span></p></div>
        <details class="narrator-only"><summary>Segredo e limites do narrador</summary><p><b>Segredo:</b> ${escapeHtml(p.secret||'Ainda não definido.')}</p><p><b>Regra de interpretação:</b> ${escapeHtml(p.narratorGuardrail||'Interprete apenas o que o NPC sabe e revele informações conforme as evidências e ações em cena.')}</p></details>
        <details class="art-brief"><summary>Brief de retrato</summary><p>${escapeHtml(npc.artBrief||'Retrato individual em mangá preto e branco; fundo transparente.')}</p><small>ARQUIVO-ALVO · assets/campaigns/${escapeHtml(campaign.id)}/npcs/${escapeHtml(npc.id)}.png</small></details>
      </article>`;}).join('')}</div><p class="prototype-note">Fichas preparadas para consulta do narrador. Cada NPC tem comportamento, gatilhos, segredo e direção de arte separados.</p>`:'<div class="panel empty-state">Esta campanha ainda não tem NPCs catalogados.</div>';
    return;
  }
  if(currentSectionId==='art'){
    const art=campaign.art||[];
    const categories=[...new Set(art.map(item=>item.category||'Outros'))];
    const previewFor=item=>{
      const cls=(campaign.classes||[]).find(c=>item.id.includes(c.id));
      if(cls){const gender=item.id.endsWith('-female')?'female':'male';return cls.portraits?.[gender]||cls.portrait||'';}
      return '';
    };
    body.innerHTML='<div class="art-direction-card panel"><small>LINGUAGEM VISUAL DA CAMPANHA</small><h2>Mangá em tinta sobre papel claro</h2><p>'+
      escapeHtml(campaign.artDirection?.medium||'Preto e branco, retículas discretas e contorno de tinta.')+'</p><p>'+escapeHtml(campaign.artDirection?.sceneFormat||'Cenários verticais 9:16; personagens em camada transparente.')+'</p></div>'+
      (categories.length?categories.map(category=>'<section class="art-category"><div class="art-board-head"><div><span class="eyebrow">PREPARAÇÃO DE ARTE</span><h2>'+escapeHtml(category)+'</h2></div><span class="art-progress">'+art.filter(item=>(item.category||'Outros')===category&&item.done).length+'/'+art.filter(item=>(item.category||'Outros')===category).length+' prontos</span></div><div class="art-grid">'+art.filter(item=>(item.category||'Outros')===category).map(item=>'<article class="art-card"><div class="art-preview '+(item.kind==='scene'?'vertical-preview':'')+'">'+(previewFor(item)?'<img src="'+escapeAttr(previewFor(item))+'" alt="">':'<span class="art-placeholder">'+(item.kind==='scene'?'QUADRO 9:16':item.kind==='npc'?'NPC':'ARTE')+'</span>')+'<span>'+(item.done?'ARTE ADICIONADA':'BRIEF PRONTO')+'</span></div><div class="art-card-copy"><h3>'+escapeHtml(item.title)+'</h3><p>'+escapeHtml(item.description||'Brief de arte a definir.')+'</p><code>'+escapeHtml(item.assetPath||'Definir caminho do arquivo')+'</code><label class="art-done"><input type="checkbox" data-art-done="'+escapeAttr(item.id)+'" '+(item.done?'checked':'')+'> Marcar como pronto</label></div></article>').join('')+'</div></section>').join(''):'<div class="panel empty-state">Os briefs de arte da campanha aparecerão aqui após instalar ou analisar o roteiro.</div>')+
      '<div class="hint-box">Avatares: PNG/SVG com transparência. Cenários: imagem vertical sem personagens embutidos. O retrato provisório atual pode ser substituído mantendo o caminho de arquivo indicado.</div>';
    body.querySelectorAll('[data-art-done]').forEach(input=>input.addEventListener('change',async()=>{const item=art.find(row=>row.id===input.dataset.artDone);if(item)item.done=input.checked;const checkId='artcheck-'+input.dataset.artDone.replace(/^art-/,'');const checklist=(campaign.checklist||[]).find(row=>row.id===checkId);if(checklist)checklist.done=input.checked;await persistCampaign(campaign);renderSectionBody();}));
    return;
  }
  if(currentSectionId==='evolution'){
    const rules=campaign.progression||{}, log=campaign.progressionLog||[], chars=campaign.characters||[];
    body.innerHTML=`<div class="progression-layout"><section class="panel progression-rules"><span class="eyebrow">PONTOS DE PERSONAGEM · MARCOS NARRATIVOS</span><h2>Feche um elo. Reconheça o que mudou.</h2><p>${escapeHtml(rules.rules||'O narrador registra a razão de cada concessão.')}</p>
      <div class="criteria-list">${(rules.criteria||[]).map(item=>`<span>✦ ${escapeHtml(item.label)}</span>`).join('')}</div><div class="hint-box">Limite sugerido: até ${rules.awardCap||5} pontos por elo, definidos pelo narrador com base no que aconteceu em jogo.</div></section>
      <section class="panel progression-award"><h3>Registrar evolução</h3>${chars.length?`<form id="award-form" class="editor-form">
        <label class="field">Elo / marco<input class="input" name="milestone" required maxlength="80" placeholder="Ex.: negociação no Porto das Garças"></label>
        <label class="field">Personagem<select class="input" name="characterId" required>${chars.map(c=>`<option value="${escapeAttr(c.id)}">${escapeHtml(c.name)} · ${escapeHtml(c.className)}</option>`).join('')}</select></label>
        <fieldset class="award-checks"><legend>O que o personagem demonstrou?</legend>${(rules.criteria||[]).map((item,index)=>`<label><input type="checkbox" name="criterion" value="${escapeAttr(item.id)}"> ${escapeHtml(item.label)}</label>`).join('')}</fieldset>
        <label class="field">Justificativa do narrador<textarea class="input textarea" name="reason" rows="2" required placeholder="Descreva a escolha ou consequência que justifica os pontos."></textarea></label>
        <button class="button primary">＋ Conceder pontos</button></form>`:'<div class="empty-state">Crie personagens para registrar a evolução.</div>'}</section></div>
      <section class="panel progression-history"><h3>Histórico de marcos</h3>${log.length?log.slice().reverse().map(entry=>`<article class="progress-entry"><div><strong>${escapeHtml(entry.characterName)} · +${entry.points} PC</strong><small>${escapeHtml(entry.milestone)} · ${new Date(entry.createdAt).toLocaleDateString('pt-BR')}</small><p>${escapeHtml(entry.reason)}</p></div></article>`).join(''):'<div class="empty-state">Os ganhos ficam registrados aqui e na ficha do personagem.</div>'}</section>`;
    document.querySelector('#award-form')?.addEventListener('submit',async event=>{event.preventDefault();const form=new FormData(event.currentTarget),character=chars.find(c=>c.id===form.get('characterId')),milestone=String(form.get('milestone')).trim(),reason=String(form.get('reason')).trim();if(!character||!milestone||!reason)return;
      if(log.some(row=>row.characterId===character.id&&row.milestone.toLowerCase()===milestone.toLowerCase()))return notice('Esse personagem já recebeu evolução por esse elo.');
      const points=Math.min(rules.awardCap||5,form.getAll('criterion').length);if(!points)return notice('Marque ao menos uma contribuição demonstrada em jogo.');
      character.evolutionPoints=(character.evolutionPoints||0)+points;campaign.progressionLog||=[];campaign.progressionLog.push({id:crypto.randomUUID(),characterId:character.id,characterName:character.name,milestone,points,reason,criteria:form.getAll('criterion'),createdAt:Date.now()});
      await persistCampaign(campaign);renderSectionBody();notice(`+${points} pontos registrados na ficha de ${character.name}.`);
    });
    return;
  }
  const list=campaign[currentSectionId]||[];
  const label=currentSectionId==='checklist'?'Item a preparar':currentSectionId==='travel'?'Rota ou trecho':currentSectionId==='npcs'?'NPC':currentSectionId==='scenes'?'Cenário ou cena':currentSectionId==='maps'?'Mapa ou local':'Recurso visual';
  body.innerHTML=`<div class="panel editor">${currentSectionId==='checklist'?'<div class="hint-box">Checklist preparado a partir do roteiro e revisável pelo narrador.</div>':''}${currentSectionId==='travel'?'<div class="hint-box"><strong>Princípio de viagem:</strong> '+escapeHtml(campaign.travelRules?.principle||'A jornada é uma sequência de cenas com escolhas e consequências.')+'<br><strong>Acompanhe:</strong> '+escapeHtml((campaign.travelRules?.track||['tempo','condição','recursos','exposição','vínculos']).join(' · '))+'<br>'+escapeHtml(campaign.travelRules?.guidance||'Apresente rotas e custos, sinalize perigos e mostre como a preparação do grupo altera a chegada.')+'</div>':''}
    <form id="item-form" class="editor-form"><label class="field">${label}<input class="input" name="title" required maxlength="70" placeholder="Nome"></label>
      <label class="field">Notas<textarea class="input textarea" name="description" rows="3" placeholder="Descrição, instruções ou referência"></textarea></label><button class="button primary">＋ Adicionar</button></form>
    <div id="section-items" class="item-list"></div></div>`;
  renderGenericItems(list);
  document.querySelector('#item-form').addEventListener('submit',async event=>{
    event.preventDefault();const form=new FormData(event.currentTarget);
    campaign[currentSectionId]||=[];campaign[currentSectionId].push({id:crypto.randomUUID(),title:String(form.get('title')).trim(),description:String(form.get('description')||'').trim(),done:false,createdAt:Date.now()});
    await persistCampaign(campaign);renderSectionBody();notice(currentSectionId==='checklist'?'Item adicionado ao checklist.':'Item adicionado ao pacote.');
  });
}

function renderGenericItems(items) {
  const list = document.querySelector('#section-items');
  if (!items.length) {
    list.innerHTML = '<div class="empty-state">Esta área está vazia. Adicione conteúdo quando a campanha precisar.</div>';
    return;
  }
  list.innerHTML = items.map(item => `<article class="item-card">
    <div><strong>${escapeHtml(item.title)}</strong><small>${escapeHtml(item.description || 'Sem notas')}</small></div>
    <div class="item-actions">${currentSectionId === 'checklist' ? `<button class="mini-button" data-toggle="${item.id}">${item.done ? '✓ Feito' : 'Marcar feito'}</button>` : ''}<button class="mini-button" data-delete="${item.id}">Excluir</button></div>
  </article>`).join('');
  list.querySelectorAll('[data-toggle]').forEach(button => button.addEventListener('click', async () => {
    const item = items.find(row => row.id === button.dataset.toggle);
    item.done = !item.done;
    await persistCampaign(currentCampaign());
    renderSectionBody();
  }));
  list.querySelectorAll('[data-delete]').forEach(button => button.addEventListener('click', async () => {
    const campaign = currentCampaign();
    campaign[currentSectionId] = (campaign[currentSectionId] || []).filter(row => row.id !== button.dataset.delete);
    await persistCampaign(campaign);
    renderSectionBody();
  }));
}

function renderCharacterList() {
  const list=document.querySelector('#character-list');if(!list)return;
  const chars=currentCampaign().characters||[];
  if(!chars.length){list.innerHTML='<div class="empty-state">Nenhum personagem nesta campanha ainda.</div>';return;}
  list.innerHTML=chars.map(character=>{
    const conditions=(character.conditions||[]).map(c=>`<span class="condition-chip">${escapeHtml(c.name)} · ${c.modifier>=0?'+':''}${c.modifier}${c.permanent?' · permanente':''}</span>`).join('');
    return `<article class="character-sheet">
      <div class="character-portrait">${character.portrait?`<img src="${escapeAttr(character.portrait)}" alt="">`:escapeHtml(character.icon||'✦')}</div>
      <div class="character-main"><div class="character-title"><div><small>FICHA DO JOGADOR · NÍVEL ${character.level||1}</small><h3>${escapeHtml(character.name)}</h3><span>${escapeHtml(character.className||'Classe')} · ${escapeHtml(character.archetype||'')}</span></div><b class="pc-badge">${character.evolutionPoints||0} PC</b></div>
        <div class="character-quick-stats">${Object.entries(character.attributes||{}).map(([key,value])=>`<span>${key} <b>${value}</b></span>`).join('')}</div>
        <div class="character-skills">${(character.skills||[]).map(s=>`<span>${escapeHtml(s.name)} ${s.level}</span>`).join('')}</div>
        <details class="sheet-details"><summary>Abrir ficha completa</summary><p><strong>Habilidade:</strong> ${(character.fixedAbilities||[]).map(escapeHtml).join(' · ')}</p><p><strong>Condições persistentes:</strong> ${conditions||'Nenhuma registrada'}</p></details>
      </div><div class="character-actions"><button class="mini-button" data-test-character="${escapeAttr(character.id)}">Tentar ação</button>
      <details class="condition-editor"><summary>＋ Condição</summary><form data-condition-form="${escapeAttr(character.id)}">
        <input class="input" name="conditionName" required maxlength="60" placeholder="Lesão, perda de membro..."><input class="input" name="modifier" type="number" value="0" aria-label="Modificador"><input class="input" name="scope" value="all" placeholder="all ou nome da perícia"><label class="check-row"><input type="checkbox" name="permanent"> Permanente</label><button class="mini-button">Salvar condição</button></form></details></div></article>`;
  }).join('');
  list.querySelectorAll('[data-test-character]').forEach(button=>button.addEventListener('click',()=>openTest(button.dataset.testCharacter)));
  list.querySelectorAll('[data-condition-form]').forEach(form=>form.addEventListener('submit',async event=>{event.preventDefault();const values=new FormData(form),character=chars.find(item=>item.id===form.dataset.conditionForm),name=String(values.get('conditionName')||'').trim();if(!character||!name)return;
    character.conditions||=[];character.conditions.push({id:crypto.randomUUID(),name,modifier:Number(values.get('modifier'))||0,scope:String(values.get('scope')||'all').trim(),permanent:values.get('permanent')==='on',createdAt:Date.now()});
    await persistCampaign(currentCampaign());renderSectionBody();notice('Condição salva na ficha do personagem.');
  }));
}

function openTest(characterId = '') {
  const chars = currentCampaign()?.characters || [];
  if (!chars.length) {
    openSection('characters');
    notice('Crie uma ficha nesta campanha para testar uma ação.');
    return;
  }
  activeCharacterId = characterId || chars[0].id;
  const select = document.querySelector('#test-character');
  select.innerHTML = chars.map(character => `<option value="${character.id}">${escapeHtml(character.name)}</option>`).join('');
  select.value = activeCharacterId;
  renderTestCharacter();
  document.querySelector('#action-text').value = '';
  document.querySelector('#dice-stage').classList.add('hidden');
  showScreen('test');
}

function selectedCharacter() {
  return (currentCampaign()?.characters || []).find(character => character.id === document.querySelector('#test-character').value);
}

function selectedTestTarget(character) {
  const value = document.querySelector('#test-skill').value || '';
  const [kind, key] = value.split(':');
  if (kind === 'attribute') {
    const labels = { ST: 'ST · Força', DX: 'DX · Destreza', IQ: 'IQ · Inteligência', HT: 'HT · Saúde' };
    return { name: labels[key] || key, level: Number(character.attributes?.[key]) || 10, scope: key };
  }
  const skill = (character.skills || [])[Number(key)];
  return skill ? { name: skill.name, level: Number(skill.level) || 0, scope: skill.name } : null;
}

function updateTestFactors() {
  const character = selectedCharacter();
  const factors = document.querySelector('#character-factors');
  if (!character) { factors.textContent = 'Escolha um personagem.'; return; }
  const target = selectedTestTarget(character);
  const conditions = character.conditions || [];
  const applicable = conditions.filter(condition => {
    const scope = String(condition.scope || 'all').toLowerCase();
    return scope === 'all' || scope === String(target?.scope || '').toLowerCase() ||
      scope === String(target?.name || '').toLowerCase();
  });
  const modifier = applicable.reduce((sum, condition) => sum + Number(condition.modifier || 0), 0);
  factors.innerHTML = `Vantagens: ${escapeHtml(character.advantages || 'nenhuma registrada')}<br>
    Desvantagens: ${escapeHtml(character.disadvantages || 'nenhuma registrada')}<br>
    Condições registradas: ${conditions.length ? conditions.map(c => escapeHtml(c.name) + ' (' + (c.modifier >= 0 ? '+' : '') + c.modifier + ')' + (c.permanent ? ' permanente' : '')).join('; ') : 'nenhuma'}
    <br>Modificador aplicável a ${escapeHtml(target?.name || 'este teste')}: ${modifier >= 0 ? '+' : ''}${modifier}`;
}

function renderTestCharacter() {
  const character = selectedCharacter();
  activeCharacterId = character?.id || '';
  const skillSelect = document.querySelector('#test-skill');
  if (!character) { skillSelect.innerHTML = ''; updateTestFactors(); return; }
  const skills = (character.skills || []).map((skill, index) =>
    `<option value="skill:${index}">${escapeHtml(skill.name)} · nível ${skill.level}</option>`).join('');
  const attrs = Object.entries({ ST: 'ST · Força', DX: 'DX · Destreza', IQ: 'IQ · Inteligência', HT: 'HT · Saúde' })
    .map(([key, label]) => `<option value="attribute:${key}">${label} · nível ${Number(character.attributes?.[key]) || 10}</option>`).join('');
  skillSelect.innerHTML = (skills ? '<optgroup label="Perícias">' + skills + '</optgroup>' : '') +
    '<optgroup label="Atributos">' + attrs + '</optgroup>';
  updateTestFactors();
}

function renderDie(element, face) {
  const faces = {
    1: [5], 2: [1, 9], 3: [1, 5, 9],
    4: [1, 3, 7, 9], 5: [1, 3, 5, 7, 9], 6: [1, 3, 4, 6, 7, 9],
  };
  [...element.children].forEach((pip, index) => pip.classList.toggle('on', faces[face].includes(index + 1)));
  element.setAttribute('aria-label', 'Dado: ' + face);
}

function sleep(ms) { return new Promise(resolve => setTimeout(resolve, ms)); }

async function performTest() {
  const character = selectedCharacter();
  const action = document.querySelector('#action-text').value.trim();
  if (!character) return notice('Selecione um personagem.');
  if (!action) return notice('Escreva o que o personagem tenta fazer.');
  const target = selectedTestTarget(character);
  if (!target) return notice('Escolha uma perícia ou atributo para este teste.');

  const dice = roll3d6().dice;
  const dieElements = [...document.querySelectorAll('.die')];
  const stage = document.querySelector('#dice-stage');
  const outcome = document.querySelector('#roll-outcome');
  stage.classList.remove('hidden');
  outcome.innerHTML = '<span class="roll-detail">Os dados estão rolando…</span>';
  dieElements.forEach(die => {
    die.classList.remove('rolling');
    void die.offsetWidth;
    die.classList.add('rolling');
  });
  for (let tick = 0; tick < 7; tick++) {
    dieElements.forEach(die => renderDie(die, 1 + Math.floor(Math.random() * 6)));
    await sleep(95);
  }
  dieElements.forEach((die, index) => renderDie(die, dice[index]));
  dieElements.forEach(die => die.classList.remove('rolling'));

  const conditionModifier = (character.conditions || [])
    .filter(condition => {
      const scope = String(condition.scope || 'all').toLowerCase();
      return scope === 'all' || scope === String(target.scope).toLowerCase() ||
        scope === String(target.name).toLowerCase();
    })
    .reduce((sum, condition) => sum + Number(condition.modifier || 0), 0);
  const situationalModifier = Number(document.querySelector('#situational-modifier').value) || 0;
  const result = resolveSuccessTest({
    dice, skill: target.level, conditionModifier, situationalModifier,
  });
  const label = result.outcome.toLocaleUpperCase('pt-BR');
  outcome.innerHTML = `${result.total} — ${label}<span class="roll-detail">Alvo efetivo ${result.effectiveSkill} · ${result.success ? 'sucesso por ' : 'falha por '}${result.margin} · ${escapeHtml(action)}</span>`;

  const campaign = currentCampaign();
  campaign.testLog ||= [];
  campaign.testLog.unshift({
    id: crypto.randomUUID(), createdAt: Date.now(), characterId: character.id,
    characterName: character.name, action, skill: target.name, dice,
    total: result.total, effectiveSkill: result.effectiveSkill, outcome: result.outcome,
    margin: result.margin,
  });
  campaign.testLog = campaign.testLog.slice(0, 80);
  await persistCampaign(campaign);
}

function escapeHtml(value) {
  return String(value ?? '').replace(/[&<>"']/g, char => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;',
  })[char]);
}
function escapeAttr(value) { return escapeHtml(value); }

function renderRoomSummary(room, message) {
  liveRoom=room; activeRoomCode=room.code||activeRoomCode;
  const result=document.querySelector('#room-result');result.classList.remove('hidden');
  document.querySelector('#room-code-value').textContent=room.code||'';
  document.querySelector('#room-message').textContent=message;
  const players=Array.isArray(room.players)?room.players:[];
  document.querySelector('#room-player-list').innerHTML=players.length?players.map(player=>'<div class="room-player '+(player.ready?'is-ready':'')+'"><span class="player-ready-dot"></span><span><strong>'+escapeHtml(player.name||'Jogador')+'</strong>'+(player.characterName?' · '+escapeHtml(player.characterName)+(player.className?' ('+escapeHtml(player.className)+')':''):'')+'</span><small>'+(player.ready?'PRONTO':'AGUARDANDO')+'</small></div>').join(''):'<div class="room-player">Aguardando jogadores…</div>';
  const me=players.find(player=>player.id===localPlayerId()),readyButton=document.querySelector('#ready-button');
  readyButton.disabled=!me;readyButton.textContent=me?.ready?'Cancelar pronto':'Marcar como pronto';
  const allReady=players.length>=2&&players.every(player=>player.ready),start=document.querySelector('#start-narration');
  start.disabled=room.hostId!==localPlayerId()||!allReady||room.status!=='waiting';
  document.querySelector('#ready-status').textContent=room.status==='narration'?'Narração iniciada.':players.length<2?'Convide pelo menos mais uma pessoa.':allReady?'Todos prontos. O anfitrião pode começar.':players.filter(player=>player.ready).length+' de '+players.length+' prontos.';
  document.querySelector('#copy-room-code').dataset.shareUrl=roomShareUrl(room.code,room.campaignId);
  if(room.status==='narration')renderGame(room);
}
function roomShareUrl(code,campaignId){const url=new URL(location.href);url.search='';url.searchParams.set('room',code);if(campaignId)url.searchParams.set('campaign',campaignId);return url.toString();}
function watchRoom(code){
  if(roomUnsubscribe)roomUnsubscribe();
  try{roomUnsubscribe=listenRoom(code,room=>{if(room)renderRoomSummary(room,'Sala sincronizada · envie o link para seus amigos.');},error=>{console.warn('Mind RolePlay: sala sem sincronização.',error);notice('A sincronização em tempo real falhou.');});}catch(error){console.warn(error);}
}
function openCharacterBuilder(id){
  currentCampaignId=id;const campaign=currentCampaign();if(!campaign)return;
  document.querySelector('#character-campaign-title').textContent=campaign.title;
  document.querySelector('#character-campaign-premise').textContent=campaign.premise||campaign.genre||'';
  const select=document.querySelector('#class-select');
  select.innerHTML=(campaign.classes||[]).map(cls=>'<option value="'+escapeAttr(cls.id)+'">'+escapeHtml(cls.name)+'</option>').join('');
  selectedClassId=select.value;renderClassDetails();renderSavedCharacters();showScreen('character');
}
let selectedClassId='';
function renderClassDetails(){
  const campaign=currentCampaign(),cls=(campaign?.classes||[]).find(item=>item.id===selectedClassId)||campaign?.classes?.[0];if(!cls)return;
  selectedClassId=cls.id;const portrait=cls.portraits?.[playerGender]||cls.portrait||'';
  const img=document.querySelector('#class-portrait');img.src=portrait;img.alt='Retrato '+(playerGender==='female'?'feminino':'masculino')+' de '+cls.name;
  const attrs=Object.entries(cls.attributes||{}).map(([key,value])=>'<span><b>'+escapeHtml(key)+'</b> '+escapeHtml(value)+'</span>').join('');
  const skills=(cls.skills||[]).map(skill=>'<div class="skill-line"><b>'+escapeHtml(skill.name)+'</b><span>Alvo '+escapeHtml(skill.level)+' · teste 3d6</span><small>'+escapeHtml(skill.description||skill.attribute||'Usada quando a ação exige esta perícia.')+'</small></div>').join('');
  document.querySelector('#class-details').innerHTML='<h2>'+escapeHtml(cls.name)+'</h2><p>'+escapeHtml(cls.description||cls.role||'Arquétipo de campanha')+'</p><div class="attribute-strip">'+attrs+'</div><h3>Perícias iniciais</h3>'+skills+'<div class="fixed-ability"><b>Capacidade fixa</b><p>'+escapeHtml((cls.fixedAbilities||[]).join(' · ')||'A definir na ficha da campanha.')+'</p></div>'+(cls.roleplayProfile?'<details><summary>Guia de interpretação e narrador</summary><p>'+escapeHtml(cls.roleplayProfile.narratorGuidance||cls.roleplayProfile.voice||'')+'</p></details>':'');
}
function renderSavedCharacters(){
  const box=document.querySelector('#saved-characters'),chars=currentCampaign()?.characters||[];
  box.innerHTML=chars.length?'<h2>Personagens desta campanha</h2>'+chars.map(c=>'<button class="saved-character" data-use-character="'+escapeAttr(c.id)+'">'+escapeHtml(c.name)+' · '+escapeHtml(c.className)+'</button>').join(''):'';
  box.querySelectorAll('[data-use-character]').forEach(button=>button.addEventListener('click',()=>{chosenCharacter=chars.find(c=>c.id===button.dataset.useCharacter);showLobby();}));
}
function showLobby(){
  if(!currentCampaign()||!chosenCharacter)return;
  document.querySelector('#lobby-character-name').textContent=chosenCharacter.name;
  document.querySelector('#lobby-character-class').textContent=chosenCharacter.className;
  const img=document.querySelector('#lobby-avatar');img.src=chosenCharacter.portrait||'';img.alt=chosenCharacter.className;
  document.querySelector('#room-result').classList.add('hidden');
  if(returnRoomCode)document.querySelector('#room-code').value=returnRoomCode;
  showScreen('lobby');if(returnRoomCode)joinActiveRoom(returnRoomCode);
}
async function joinActiveRoom(code){
  if(!chosenCharacter)return;document.querySelector('#room-code').value=code;
  const playerName=document.querySelector('#player-name').value.trim()||'Jogador';
  try{const room=await joinRoomRemote(code,localPlayerId(),playerName,chosenCharacter);currentCampaignId=room.campaignId;renderRoomSummary(room,'Você entrou pelo convite da sala.');watchRoom(code);returnRoomCode='';const url=new URL(location.href);url.search='';history.replaceState({},'',url);}
  catch(error){notice(error.message||'Não foi possível entrar na sala.');}
}
function renderGame(room){
  const campaign=campaigns.find(item=>item.id===room.campaignId)||currentCampaign();if(!campaign)return;
  document.querySelector('#game-campaign-title').textContent=campaign.title;
  document.querySelector('#game-room-code').textContent='SALA '+room.code;
  document.querySelector('#game-player-count').textContent=(room.players||[]).length+' jogadores';
  const scene=room.scene||campaign.scenes?.[0]||{};
  document.querySelector('#scene-title').textContent=scene.title||'O começo';
  document.querySelector('#scene-description').textContent=scene.description||'A história aguarda o primeiro movimento.';
  document.querySelector('#scene-chapter').textContent=scene.chapter||'CENA 01';
  document.querySelector('#scene-background').style.backgroundImage=scene.image?'url("'+scene.image+'")':'';
  const me=(room.players||[]).find(player=>player.id===localPlayerId()),avatar=document.querySelector('#scene-avatar');
  avatar.src=me?.portrait||chosenCharacter?.portrait||'';avatar.alt=me?.characterName||chosenCharacter?.name||'Personagem';
  const feed=document.querySelector('#game-messages'),messages=room.messages||[];
  feed.innerHTML=messages.length?messages.map(item=>'<article class="story-message '+(item.playerId===localPlayerId()?'mine':'')+'"><small>'+escapeHtml(item.characterName||item.playerName||'Narrador')+' · '+escapeHtml(item.className||'Jogador')+'</small><p>'+escapeHtml(item.text)+'</p></article>').join(''):'<div class="empty-story">A cena começa. Descreva uma ação ou fala do personagem.</div>';
  feed.scrollTop=feed.scrollHeight;showScreen('game');
}
async function createActiveRoom(){
  const name=document.querySelector('#player-name').value.trim()||'Jogador',campaignId=currentCampaignId;
  try{
    const code=await createRoomRemote(campaignId,localPlayerId(),name,chosenCharacter);
    const url=new URL(roomShareUrl(code,campaignId));history.replaceState({},'',url);
    renderRoomSummary({code,campaignId,hostId:localPlayerId(),status:'waiting',players:[{id:localPlayerId(),name,characterName:chosenCharacter.name,className:chosenCharacter.className,portrait:chosenCharacter.portrait,ready:true}]},'Sala criada. Copie o link e convide seus amigos.');
    watchRoom(code);
  }catch(error){
    firebaseMode=false;storageLabel.textContent='Prévia local';notice('Firebase indisponível para salas; a prévia local não sincroniza com os celulares dos amigos.');
    const code=Math.random().toString(36).slice(2,8).toUpperCase();
    renderRoomSummary({code,campaignId,hostId:localPlayerId(),status:'waiting',players:[{id:localPlayerId(),name,characterName:chosenCharacter.name,className:chosenCharacter.className,portrait:chosenCharacter.portrait,ready:true}]},'Sala local de demonstração · link não sincroniza entre dispositivos.');
    activeRoomCode=code;
  }
}
async function toggleReady(){if(!liveRoom)return;const me=(liveRoom.players||[]).find(player=>player.id===localPlayerId());try{const room=await setPlayerReady(liveRoom.code,localPlayerId(),!me?.ready);renderRoomSummary(room,'Estado atualizado.');}catch(error){notice(error.message||'Não foi possível atualizar presença.');}}
async function beginNarration(){
  if(!liveRoom)return;const campaign=campaigns.find(item=>item.id===liveRoom.campaignId)||currentCampaign();
  try{await startNarration(liveRoom.code,localPlayerId(),campaign?.scenes?.[0]||{title:'A primeira cena',description:campaign?.premise||'A história começa.'});}
  catch(error){notice(error.message||'Não foi possível iniciar a narração.');}
}

document.querySelectorAll('[data-nav]').forEach(button => button.addEventListener('click', () => {
  const destination = button.dataset.nav;
  if (destination === 'campaigns') renderCampaigns();
  if (destination === 'lobby' && chosenCharacter) showLobby();
  if (destination === 'package' && currentCampaign()) openCampaign(currentCampaignId);
  showScreen(destination);
}));

document.querySelector('#new-campaign-form').addEventListener('submit',async event=>{
  event.preventDefault();
  const title=document.querySelector('#new-title').value.trim(),genre=document.querySelector('#new-genre').value.trim();
  const script=document.querySelector('#new-story').value.trim(),source=document.querySelector('#new-source').value.trim();
  if(!title||!script)return notice('Informe o nome da campanha e cole o roteiro.');
  let campaign;
  if(firebaseMode){try{campaign=await createCampaignRemote(title,genre);}catch(error){firebaseMode=false;storageLabel.textContent='Prévia local';notice('Firebase sem permissão para o Mind; criando pacote local neste navegador.');}}
  if(!campaign){campaign=createEmptyCampaign('campaign-'+crypto.randomUUID(),title,genre);campaigns.push(campaign);saveLocalCampaigns();}else campaigns.push(campaign);
  campaign.story=script;campaign.source=source;campaign.analysis=analyzeCampaignText(script,genre);campaign.classes=makeStarterClasses(script,genre);campaign.checklist=campaign.analysis.checklist;campaign.art=[];prepareClassArt(campaign);
  campaign.npcs=campaign.analysis.sceneHeadings.filter(name=>/^npc|personagem/i.test(name)).map((title,index)=>({id:'npc-'+index,title,description:'Identificado no roteiro',createdAt:Date.now()}));
  campaign.scenes=campaign.analysis.sceneHeadings.filter(name=>/cena|capítulo|ato|local/i.test(name)).map((title,index)=>({id:'scene-'+index,title,description:'Identificado no roteiro',createdAt:Date.now()}));
  await persistCampaign(campaign);currentCampaignId=campaign.id;event.currentTarget.reset();renderCampaigns();openCampaign(campaign.id);notice('Pacote preparado: classes, cenas e checklist aguardam revisão.');
});

document.querySelector('#test-character').addEventListener('change', renderTestCharacter);
document.querySelector('#lobby-campaign')?.addEventListener('change', renderLobbyCharacters);
document.querySelector('#test-skill').addEventListener('change', updateTestFactors);
document.querySelector('#roll-button').addEventListener('click', performTest);
document.querySelector('#open-test').addEventListener('click', () => openTest());

document.querySelector('#class-select').addEventListener('change',event=>{selectedClassId=event.target.value;renderClassDetails();});
document.querySelectorAll('[data-gender]').forEach(button=>button.addEventListener('click',()=>{playerGender=button.dataset.gender;document.querySelectorAll('[data-gender]').forEach(item=>item.classList.toggle('active',item===button));renderClassDetails();}));
document.querySelector('#save-character').addEventListener('click',async()=>{
  const campaign=currentCampaign(),cls=(campaign?.classes||[]).find(item=>item.id===selectedClassId),name=document.querySelector('#character-name').value.trim();
  if(!name)return notice('Escolha um nome para o personagem.');if(!cls)return notice('Esta campanha ainda não tem arquétipos definidos.');
  chosenCharacter={id:'character-'+crypto.randomUUID(),name,gender:playerGender,classId:cls.id,className:cls.name,portrait:cls.portraits?.[playerGender]||cls.portrait||'',assetPath:cls.assetPaths?.[playerGender]||'',attributes:cls.attributes||{},skills:cls.skills||[],fixedAbilities:cls.fixedAbilities||[],conditions:[],createdAt:Date.now()};
  campaign.characters ||= [];campaign.characters.push(chosenCharacter);await persistCampaign(campaign);renderSavedCharacters();showLobby();
});
document.querySelector('#create-room').addEventListener('click',createActiveRoom);
document.querySelector('#join-room').addEventListener('click',()=>joinActiveRoom(document.querySelector('#room-code').value.trim().toUpperCase()));
document.querySelector('#ready-button').addEventListener('click',toggleReady);
document.querySelector('#start-narration').addEventListener('click',beginNarration);
document.querySelector('#copy-room-code').addEventListener('click',async()=>{
  const url=document.querySelector('#copy-room-code').dataset.shareUrl||roomShareUrl(activeRoomCode,currentCampaignId);
  try{await navigator.clipboard.writeText(url);notice('Link da sala copiado.');}catch{notice(url);}
});
document.querySelector('#message-form').addEventListener('submit',async event=>{
  event.preventDefault();const input=document.querySelector('#message-input'),text=input.value.trim();if(!text||!liveRoom)return;
  const message={id:crypto.randomUUID(),playerId:localPlayerId(),playerName:document.querySelector('#player-name').value.trim()||'Jogador',characterName:chosenCharacter?.name||'Personagem',className:chosenCharacter?.className||'',text,createdAt:Date.now()};input.value='';
  try{await postRoomMessage(liveRoom.code,message);}catch(error){notice('A ação não sincronizou. Confira o acesso online à sala.');}
});

async function boot() {
  try {
    campaigns = await installDemoCampaignsIfEmpty();
    firebaseMode = true;
    storageLabel.textContent = 'Firebase · Mind';
  } catch (error) {
    console.warn('Mind RolePlay: Firestore indisponível; abrindo prévia local.', error);
    firebaseMode = false;
    campaigns = localCampaigns();
    storageLabel.textContent = 'Prévia local';
    notice('A tela funciona neste navegador. Publique as regras Firestore do Mind para sincronizar pela nuvem.');
  }
  if (!campaigns.length) campaigns = localCampaigns();
  const kagehamaSeed = createDemoCampaigns().find(item => item.id === 'demo-kagehama');
  const kagehamaIndex = campaigns.findIndex(item => item.id === 'demo-kagehama');
  if (kagehamaSeed && kagehamaIndex >= 0) {
    const saved = campaigns[kagehamaIndex];
    if (Number(saved.schemaVersion || 1) < 4 || (saved.classes || []).length !== kagehamaSeed.classes.length || (saved.art || []).length !== kagehamaSeed.art.length || (saved.npcs || []).some(npc => !npc.behaviorProfile)) {
      const seededChecklistIds = new Set(kagehamaSeed.checklist.map(item => item.id));
      const upgraded = {
        ...kagehamaSeed, ...saved, schemaVersion: 4,
        classes: kagehamaSeed.classes, art: kagehamaSeed.art, progression: kagehamaSeed.progression, artDirection: kagehamaSeed.artDirection,
        npcs: [...kagehamaSeed.npcs, ...(saved.npcs || []).filter(item => !kagehamaSeed.npcs.some(seed => seed.id === item.id))],
        scenes: [...kagehamaSeed.scenes, ...(saved.scenes || []).filter(item => !kagehamaSeed.scenes.some(seed => seed.id === item.id))],
        characters: saved.characters || [], progressionLog: saved.progressionLog || [],
        checklist: [...kagehamaSeed.checklist, ...(saved.checklist || []).filter(item => !seededChecklistIds.has(item.id))],
      };
      campaigns[kagehamaIndex] = upgraded;
      if (firebaseMode) {
        try { await saveCampaign(upgraded); }
        catch (error) { firebaseMode = false; storageLabel.textContent = 'Prévia local'; saveLocalCampaigns(); }
      } else saveLocalCampaigns();
    }
  }
  const query=new URLSearchParams(location.search),campaignParam=query.get('campaign');
  currentCampaignId=campaigns.find(c=>c.id===campaignParam)?.id||campaigns[0]?.id||'';
  updateHomeCampaign();renderCampaigns();
  if(returnRoomCode&&currentCampaignId)openCharacterBuilder(currentCampaignId);
}

function resizeStars() {
  const canvas = document.querySelector('#stars');
  const ctx = canvas.getContext('2d');
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  canvas.width = Math.floor(innerWidth * dpr);
  canvas.height = Math.floor(innerHeight * dpr);
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  const points = Array.from({ length: Math.min(100, Math.floor(innerWidth * innerHeight / 9500)) }, () => ({
    x: Math.random() * innerWidth, y: Math.random() * innerHeight,
    r: .4 + Math.random() * 1.15, phase: Math.random() * Math.PI * 2,
  }));
  function draw() {
    ctx.clearRect(0, 0, innerWidth, innerHeight);
    points.forEach(point => {
      point.phase += .012;
      ctx.beginPath();
      ctx.arc(point.x, point.y, point.r, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(236,211,158,' + (.18 + .3 * (0.5 + 0.5 * Math.sin(point.phase))) + ')';
      ctx.fill();
    });
    requestAnimationFrame(draw);
  }
  draw();
}
window.addEventListener('resize', resizeStars);
resizeStars();
boot();
