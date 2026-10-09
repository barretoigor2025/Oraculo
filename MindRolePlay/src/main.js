import './styles.css';
import { CAMPAIGN_SECTIONS, createDemoCampaigns } from './campaigns.js';
import { roll3d6, resolveSuccessTest } from './gurps.js';
import {
  createRoom as createRoomRemote,
  advanceActionCycle as advanceActionCycleRemote,
  advanceNarrativeBeat as advanceNarrativeBeatRemote,
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
const KAGEHAMA_SCHEMA_VERSION = 12;
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

function characterSlug(name) {
  return String(name || 'personagem')
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    .toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') || 'personagem';
}

function avatarFileName(cls, gender) {
  const suffix = gender === 'female' ? 'feminino' : 'masculino';
  return `${cls.id}_${suffix}.png`;
}

function buildCharacter(name, cls, gender = 'male', previous = {}) {
  const safeGender = gender === 'female' ? 'female' : 'male';
  const cleanName = String(name || previous.name || 'Personagem').trim();
  return {
    ...previous,
    id: previous.id || `character-${crypto.randomUUID()}`,
    name: cleanName,
    recordName: `ficha_${characterSlug(cleanName)}.json`,
    gender: safeGender,
    classId: cls.id,
    className: cls.name,
    archetype: cls.archetype || '',
    portrait: cls.portraits?.[safeGender] || cls.portrait || '',
    assetPath: cls.assetPaths?.[safeGender] || cls.portraits?.[safeGender] || cls.portrait || '',
    avatarFileName: avatarFileName(cls, safeGender),
    icon: cls.icon || previous.icon || '✦',
    level: previous.level || cls.startingLevel || 1,
    attributes: previous.attributes || structuredClone(cls.attributes || {}),
    skills: previous.skills || structuredClone(cls.skills || []),
    fixedAbilities: previous.fixedAbilities || structuredClone(cls.fixedAbilities || []),
    advantages: previous.advantages || '',
    disadvantages: previous.disadvantages || '',
    conditions: previous.conditions || [],
    evolutionPoints: previous.evolutionPoints || 0,
    createdAt: previous.createdAt || Date.now(),
  };
}

function migrateCharacters(characters, classes) {
  return (characters || []).map(character => {
    const cls = classes.find(item => item.id === character.classId);
    return cls ? buildCharacter(character.name, cls, character.gender, character) : character;
  });
}

function needsKagehamaUpgrade(saved, seed) {
  if (Number(saved.schemaVersion || 1) < KAGEHAMA_SCHEMA_VERSION) return true;
  if ((saved.classes || []).length !== seed.classes.length) return true;
  if ((saved.art || []).length !== seed.art.length) return true;
  if ((saved.npcs || []).some(npc => !npc.behaviorProfile)) return true;

  return (seed.classes || []).some(seedClass => {
    const savedClass = (saved.classes || []).find(item => item.id === seedClass.id);
    if (!savedClass) return true;
    return ['male', 'female'].some(gender =>
      savedClass.portraits?.[gender] !== seedClass.portraits?.[gender] ||
      savedClass.assetPaths?.[gender] !== seedClass.assetPaths?.[gender]
    );
  }) || (saved.characters || []).some(character => {
    const seedClass = (seed.classes || []).find(item => item.id === character.classId);
    if (!seedClass) return false;
    const gender = character.gender === 'female' ? 'female' : 'male';
    return character.portrait !== seedClass.portraits?.[gender];
  });
}

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
      const hiddenIds = new Set(stored.filter(item => /^demo-campanha-\d+$/.test(item.id)).map(item => item.id));
      for (const id of hiddenIds) {
        const index = stored.findIndex(item => item.id === id);
        if (index >= 0) stored.splice(index, 1);
      }
      const sample = createDemoCampaigns().find(item => item.id === 'demo-kagehama');
      if (sample) {
        const index = stored.findIndex(item => item.id === sample.id);
        if (index < 0) stored.push(sample);
        else if (needsKagehamaUpgrade(stored[index], sample)) {
          const old = stored[index];
          stored[index] = {
            ...sample, ...old, schemaVersion: KAGEHAMA_SCHEMA_VERSION,
            classes: sample.classes, art: sample.art, progression: sample.progression, artDirection: sample.artDirection,
            npcs: [...sample.npcs, ...(old.npcs || []).filter(item => !sample.npcs.some(seed => seed.id === item.id))],
            scenes: [...sample.scenes, ...(old.scenes || []).filter(item => !sample.scenes.some(seed => seed.id === item.id))],
            progressionLog: old.progressionLog || [], characters: migrateCharacters(old.characters, sample.classes),
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

function visibleCampaigns(list = campaigns) {
  return list.filter(campaign => !/^demo-campanha-\d+$/.test(campaign.id));
}

function renderCampaigns() {
  const visible = visibleCampaigns();
  const playCards=visible.map(campaign => '<button class="campaign-card manga-card" data-play-campaign="'+escapeAttr(campaign.id)+'"><span class="number">KAGEHAMA · '+escapeHtml(campaign.genre||'Aventura')+'</span><strong>'+escapeHtml(campaign.title)+'</strong><span>'+escapeHtml(campaign.premise||'Uma campanha narrativa pronta para receber personagens.')+'</span><b>CRIAR PERSONAGEM →</b></button>').join('');
  const dbCards=visible.map(campaign => '<button class="campaign-card manga-card" data-open-campaign="'+escapeAttr(campaign.id)+'"><span class="number">KAGEHAMA · PACOTE ATIVO</span><strong>'+escapeHtml(campaign.title)+'</strong><span>'+countCampaignContent(campaign)+' elementos preparados · abrir arquivo da campanha →</span></button>').join('');
  const grid=document.querySelector('#campaign-grid');if(grid)grid.innerHTML=dbCards;
  const home=document.querySelector('#home-campaign-grid');if(home)home.innerHTML=playCards||'<p class="empty-state">A campanha de Kagehama está sendo carregada.</p>';
  document.querySelectorAll('[data-play-campaign]').forEach(button=>button.addEventListener('click',()=>openCharacterBuilder(button.dataset.playCampaign)));
  document.querySelectorAll('[data-open-campaign]').forEach(button=>button.addEventListener('click',()=>openCampaign(button.dataset.openCampaign)));
}

function countCampaignContent(campaign) {
  return ['classes', 'characters', 'npcs', 'bestiary', 'relics', 'scenes', 'maps', 'travel', 'art', 'checklist', 'progressionLog']
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
    const chapters=campaign.scenes||[];
    body.innerHTML=`<div class="campaign-chronicle panel"><div class="hint-box"><b>Crônica canônica · campanha fixa</b><br>Os capítulos, cenas, personagens e pistas pertencem à campanha “As Sete Lanternas de Kagehama”. Este roteiro é lido pelo modo de narração, que apresenta um quadro por vez para toda a sala.</div>
    <h2>${escapeHtml(campaign.title)}</h2><p class="chronicle-premise">${escapeHtml(campaign.premise||'')}</p><div class="chronicle-stats"><span>${chapters.length} capítulos</span><span>${campaign.npcs?.length||0} NPCs com perfil</span><span>${campaign.bestiary?.length||0} ameaças espirituais</span></div>
    <details><summary>Texto completo da história e diretrizes do narrador</summary><div class="story-source"><p>${escapeHtml(campaign.story||'A crônica está sendo preparada.')}</p></div></details><h3>Ordem dos capítulos</h3><ol class="chapter-list">${chapters.map(scene=>`<li><b>${escapeHtml(scene.chapter||scene.title)}</b><span>${escapeHtml(scene.title)}</span><small>${escapeHtml(scene.description||'')}</small></li>`).join('')}</ol></div>`;
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
      campaign.characters.push(buildCharacter(form.get('name'), cls, form.get('gender')));
      await persistCampaign(campaign);renderSectionBody();notice('Ficha criada. A classe definiu retrato, perícias e habilidades iniciais.');
    });
    return;
  }
  if(currentSectionId==='npcs'){
    const npcs=campaign.npcs||[];
    body.innerHTML=npcs.length?`<div class="npc-database">${npcs.map(npc=>{const p=npc.behaviorProfile||{};return `
      <article class="npc-dossier panel">
        <header><figure class="npc-portrait"><img src="${escapeAttr(npc.portrait||'')}" alt="Retrato de ${escapeAttr(npc.title||npc.name||'NPC')}" loading="lazy"><figcaption>RETRATO · ${escapeHtml(npc.faction||'KAGEHAMA')}</figcaption></figure><div class="npc-heading-copy"><small>ARQUIVO DE NPC · ${escapeHtml(npc.faction||'FACÇÃO A DEFINIR')}</small><h2>${escapeHtml(npc.title||npc.name||'NPC')}</h2><p>${escapeHtml(npc.description||'')}</p></div></header>
        <div class="npc-profile-grid"><p><b>Voz</b><span>${escapeHtml(p.voice||'A definir')}</span></p><p><b>Objetivo</b><span>${escapeHtml(p.goal||'A definir')}</span></p><p><b>Medo</b><span>${escapeHtml(p.fear||'A definir')}</span></p><p><b>Métodos</b><span>${escapeHtml(p.methods||'A definir')}</span></p><p><b>Sinal observável</b><span>${escapeHtml(p.tell||'A definir')}</span></p><p><b>Se pressionado</b><span>${escapeHtml(p.ifPressured||'A definir')}</span></p></div>
        <details class="narrator-only"><summary>Segredo e limites do narrador</summary><p><b>Segredo:</b> ${escapeHtml(p.secret||'Ainda não definido.')}</p><p><b>Regra de interpretação:</b> ${escapeHtml(p.narratorGuardrail||'Interprete apenas o que o NPC sabe e revele informações conforme as evidências e ações em cena.')}</p></details>
        <details class="art-brief"><summary>Brief de retrato</summary><p>${escapeHtml(npc.artBrief||'Retrato individual em mangá preto e branco; fundo transparente.')}</p><small>ARQUIVO-ALVO · assets/campaigns/${escapeHtml(campaign.id)}/npcs/${escapeHtml(npc.id)}.png</small></details>
      </article>`;}).join('')}</div><p class="prototype-note">Fichas preparadas para consulta do narrador. Cada NPC tem comportamento, gatilhos, segredo e direção de arte separados.</p>`:'<div class="panel empty-state">Esta campanha ainda não tem NPCs catalogados.</div>';
    return;
  }
  if(currentSectionId==='relics'){
    const relics=campaign.relics||[];
    body.innerHTML=`<div class="bestiary-intro panel"><small>RECURSOS DE CAMPANHA</small><h2>Armas, selos e evidências</h2><p>Itens espirituais têm requisitos ficcionais e custos. Nenhum artefato resolve sozinho a crise política.</p></div><div class="bestiary-grid">${relics.map(item=>`<article class="bestiary-card panel"><small>${escapeHtml(item.category||'Relíquia')}</small><h3>${escapeHtml(item.title)}</h3><p>${escapeHtml(item.description)}</p></article>`).join('')}</div>`;
    return;
  }
  if(currentSectionId==='bestiary'){
    const entries=campaign.bestiary||[];
    body.innerHTML=`<div class="bestiary-intro panel"><small>ESCALA DE AMEAÇA · NÍVEIS 1–5</small><h2>Entidades da maré dos nomes</h2><p>Aparições deixam sinais antes de atacar. Descubram o vínculo que as prende: lâminas comuns dispersam ou atrasam; armas encantadas, selos e rituais podem romper a ancoragem. Uma rolagem de Percepção 3d6 revela pistas opcionais; falhar não bloqueia a história.</p></div><div class="bestiary-grid">${entries.map(foe=>`<article class="bestiary-card panel"><div class="bestiary-level"><span>AMEAÇA</span><b>NÍVEL ${escapeHtml(foe.level)}</b></div><small>${escapeHtml(foe.role)} · ${escapeHtml(foe.threat)}</small><h3>${escapeHtml(foe.name)}</h3><p><b>Sinal:</b> ${escapeHtml(foe.sign)}</p><p><b>Comportamento:</b> ${escapeHtml(foe.behavior)}</p><p><b>Como vencer:</b> ${escapeHtml(foe.weakness)}</p><p><b>Descoberta:</b> ${escapeHtml(foe.reward)}</p></article>`).join('')}</div>`;
    return;
  }
  if(currentSectionId==='art'){
    const art=campaign.art||[];
    const categories=[...new Set(art.map(item=>item.category||'Outros'))];
    const previewFor=item=>{
      const cls=(campaign.classes||[]).find(c=>item.id.includes(c.id));
      if(cls){const gender=item.id.endsWith('-female')?'female':'male';return cls.portraits?.[gender]||cls.portrait||'';}
      if(item.id.startsWith('art-kagehama-npc-'))return (campaign.npcs||[]).find(npc=>item.id==='art-'+npc.id)?.portrait||'';
      if(item.kind==='scene')return (campaign.scenes||[]).find(scene=>item.id.endsWith(scene.id))?.image||'';
      return '';
    };
    body.innerHTML='<div class="art-direction-card panel"><small>LINGUAGEM VISUAL DA CAMPANHA</small><h2>Mangá em tinta sobre papel claro</h2><p>'+
      escapeHtml(campaign.artDirection?.medium||'Preto e branco, retículas discretas e contorno de tinta.')+'</p><p>'+escapeHtml(campaign.artDirection?.sceneFormat||'Cenários verticais 9:16; personagens em camada transparente.')+'</p></div>'+
      (categories.length?categories.map(category=>'<section class="art-category"><div class="art-board-head"><div><span class="eyebrow">PREPARAÇÃO DE ARTE</span><h2>'+escapeHtml(category)+'</h2></div><span class="art-progress">'+art.filter(item=>(item.category||'Outros')===category&&item.done).length+'/'+art.filter(item=>(item.category||'Outros')===category).length+' prontos</span></div><div class="art-grid">'+art.filter(item=>(item.category||'Outros')===category).map(item=>'<article class="art-card"><div class="art-preview '+(item.kind==='scene'?'vertical-preview':'')+'">'+(previewFor(item)?'<img src="'+escapeAttr(previewFor(item))+'" alt="">':'<span class="art-placeholder">'+(item.kind==='scene'?'QUADRO 9:16':item.kind==='npc'?'NPC':'ARTE')+'</span>')+'<span>'+(item.done?'ARTE ADICIONADA':'BRIEF PRONTO')+'</span></div><div class="art-card-copy"><h3>'+escapeHtml(item.title)+'</h3><p>'+escapeHtml(item.description||'Brief de arte a definir.')+'</p><code>'+escapeHtml(item.assetPath||'Definir caminho do arquivo')+'</code><label class="art-done"><input type="checkbox" data-art-done="'+escapeAttr(item.id)+'" '+(item.done?'checked':'')+'> Marcar como pronto</label></div></article>').join('')+'</div></section>').join(''):'<div class="panel empty-state">Os briefs de arte da campanha aparecerão aqui após instalar ou analisar o roteiro.</div>')+
      '<div class="hint-box">Avatares: PNG com transparência. Cenários: imagem vertical sem personagens embutidos. O retrato atual pode ser substituído mantendo o nome de arquivo indicado.</div>';
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
    const skills=(character.skills||[]).map(skill=>`<div class="sheet-skill"><span>${escapeHtml(skill.name)}</span><b>${escapeHtml(skill.level)}</b><small>${escapeHtml(skill.attribute||'3d6')}</small></div>`).join('');
    return `<article class="character-sheet rpg-sheet">
      <header class="sheet-header"><div><small>FICHA DE PERSONAGEM · ${escapeHtml(currentCampaign().title)}</small><h3>${escapeHtml(character.name)}</h3><p>${escapeHtml(character.className||'Classe')} · Nível ${character.level||1}</p></div><b class="pc-badge">${character.evolutionPoints||0}<small> PC</small></b></header>
      <div class="sheet-body">
        <figure class="character-portrait">${character.portrait?`<img src="${escapeAttr(character.portrait)}" alt="${escapeAttr(character.name)}, ${escapeAttr(character.className||'personagem')}">`:escapeHtml(character.icon||'✦')}<figcaption>${escapeHtml(character.avatarFileName||'avatar.png')}</figcaption></figure>
        <div class="character-main">
          <section class="sheet-section"><h4>Atributos</h4><div class="character-quick-stats">${Object.entries(character.attributes||{}).map(([key,value])=>`<span><small>${escapeHtml(key)}</small><b>${escapeHtml(value)}</b></span>`).join('')}</div></section>
          <section class="sheet-section"><h4>Perícias</h4><div class="character-skills">${skills||'<p>Nenhuma perícia registrada.</p>'}</div></section>
          <section class="sheet-section ability-section"><h4>Habilidade de classe</h4><p>${(character.fixedAbilities||[]).map(escapeHtml).join(' · ')||'Nenhuma habilidade registrada.'}</p></section>
          <section class="sheet-section condition-section"><h4>Condições persistentes</h4><div>${conditions||'<span class="condition-empty">Nenhuma condição registrada.</span>'}</div></section>
        </div>
      </div>
      <footer class="character-actions"><button class="button primary" data-test-character="${escapeAttr(character.id)}">Tentar ação</button>
      <details class="condition-editor"><summary>＋ Condição</summary><form data-condition-form="${escapeAttr(character.id)}">
        <input class="input" name="conditionName" required maxlength="60" placeholder="Lesão, perda de membro..."><input class="input" name="modifier" type="number" value="0" aria-label="Modificador"><input class="input" name="scope" value="all" placeholder="all ou nome da perícia"><label class="check-row"><input type="checkbox" name="permanent"> Permanente</label><button class="mini-button">Salvar condição</button></form></details></footer></article>`;
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
  const readyCount=players.filter(player=>player.ready).length;
  const allReady=players.length>=1&&players.every(player=>player.ready),start=document.querySelector('#start-narration');
  start.disabled=room.hostId!==localPlayerId()||!allReady||room.status!=='waiting';
  start.textContent=players.length>1?'Iniciar história · grupo':'Iniciar história · solo';
  document.querySelector('#ready-status').textContent=room.status==='narration'?'Narração iniciada.':!players.length?'Crie uma aventura ou entre por convite.':players.length===1&&allReady?'Modo solo pronto. Se copiar o convite, a mesma sala vira multiplayer.':allReady?'Todos prontos. O anfitrião pode começar.':readyCount+' de '+players.length+' prontos.';
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
function cycleClass(direction){
  const classes=currentCampaign()?.classes||[];
  if(!classes.length)return;
  const currentIndex=Math.max(0,classes.findIndex(item=>item.id===selectedClassId));
  const nextIndex=(currentIndex+direction+classes.length)%classes.length;
  selectedClassId=classes[nextIndex].id;
  renderClassDetails();
}
function renderClassDetails(){
  const campaign=currentCampaign(),cls=(campaign?.classes||[]).find(item=>item.id===selectedClassId)||campaign?.classes?.[0];if(!cls)return;
  selectedClassId=cls.id;const portrait=cls.portraits?.[playerGender]||cls.portrait||'';
  const img=document.querySelector('#class-portrait');img.src=portrait;img.alt='Retrato '+(playerGender==='female'?'feminino':'masculino')+' de '+cls.name;
  const select=document.querySelector('#class-select');if(select)select.value=cls.id;
  const classes=campaign?.classes||[],index=Math.max(0,classes.findIndex(item=>item.id===cls.id));
  const stepper=document.querySelector('#class-stepper-name');if(stepper)stepper.textContent=(index+1)+'/'+classes.length+' · '+cls.name;
  const attrs=Object.entries(cls.attributes||{}).map(([key,value])=>'<span><b>'+escapeHtml(key)+'</b> '+escapeHtml(value)+'</span>').join('');
  const skills=(cls.skills||[]).map(skill=>'<div class="skill-line"><b>'+escapeHtml(skill.name)+'</b><span>'+escapeHtml(skill.attribute||'')+' · alvo '+escapeHtml(skill.level)+'</span><small>'+escapeHtml(skill.description||'Teste quando houver risco real.')+'</small></div>').join('');
  document.querySelector('#class-details').innerHTML='<h2>'+escapeHtml(cls.name)+'</h2><p>'+escapeHtml(cls.description||cls.role||'Arquétipo de campanha')+'</p><div class="attribute-strip">'+attrs+'</div><h3>Testes GURPS · 3d6</h3>'+skills+'<div class="fixed-ability"><b>Habilidade de classe</b><p>'+escapeHtml((cls.fixedAbilities||[]).join(' · ')||'A definir na ficha da campanha.')+'</p></div>'+(cls.roleplayProfile?'<details><summary>Guia da IA narradora</summary><p>'+escapeHtml(cls.roleplayProfile.narratorGuidance||cls.roleplayProfile.voice||'')+'</p></details>':'');
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
function configureNarratorAI(){
  const current=localStorage.getItem('oraculo.groqKey')||'';
  const key=window.prompt('Cole sua chave Groq para habilitar respostas dinâmicas de NPC. Ela fica salva somente neste navegador.',current);
  if(key===null)return;
  if(key.trim())localStorage.setItem('oraculo.groqKey',key.trim());else localStorage.removeItem('oraculo.groqKey');
  notice(key.trim()?'Chave de narração salva neste navegador.':'Chave removida.');
}
async function generateNpcReply(){
  if(!liveRoom||liveRoom.hostId!==localPlayerId())return;
  const campaign=campaigns.find(item=>item.id===liveRoom.campaignId)||currentCampaign(),select=document.querySelector('#game-npc-select'),npc=(campaign.npcs||[]).find(item=>item.id===select?.value);
  if(!npc)return notice('Escolha um NPC presente na crônica.');
  if(!localStorage.getItem('oraculo.groqKey')){configureNarratorAI();if(!localStorage.getItem('oraculo.groqKey'))return;}
  const directive=document.querySelector('#npc-directive')?.value.trim()||'',profile=npc.behaviorProfile||{},scene=liveRoom.scene||{};
  const ids=(scene.presentNpcIds||[...new Set((scene.beats||[]).map(beat=>beat.speakerId).filter(Boolean))]).filter(id=>id!==npc.id);
  const others=ids.map(id=>(campaign.npcs||[]).find(item=>item.id===id)).filter(Boolean).map(item=>{const p=item.behaviorProfile||{};return (item.title||item.name)+': '+(p.voice||'')+' Objetivo: '+(p.goal||'');}).join('\n');
  const recent=(liveRoom.messages||[]).slice(-12).map(item=>(item.characterName||item.playerName||'Narrador')+': '+(item.type==='perception'?(item.success?item.successText:item.failureText):item.text)).join('\n');
  const system=`Você interpreta ${(npc.title||npc.name||'um NPC').replace(/^NPC — /,'')}, personagem de uma campanha de fantasia histórica em Kagehama. Fale como alguém com vontade, interesses e memória social.
VOZ: ${profile.voice||''}
OBJETIVO: ${profile.goal||''}
MEDO: ${profile.fear||''}
MÉTODOS: ${profile.methods||''}
SINAL: ${profile.tell||''}
SE PRESSIONADO: ${profile.ifPressured||''}
SEGREDO DO MESTRE (proteja até haver gatilho ou evidência): ${profile.secret||''}
LIMITE DE CONHECIMENTO: ${profile.narratorGuardrail||'Use apenas fatos que este NPC sabe ou pode observar; distinga fato, suspeita e mentira.'}
CENA: ${scene.title||''} — ${scene.description||''}
OUTROS NPCs PRESENTES:
${others||'Nenhum outro interlocutor definido.'}
REGRAS: Português brasileiro, primeira pessoa, no máximo 3 frases. Responda à intenção real da pergunta; pode recusar, negociar, contradizer outro NPC, proteger segredo ou encerrar conversa. Reaja ao histórico e às ações, sem repetir a ficha ou despejar exposição. Gesto visível opcional no formato [ACAO: descrição em terceira pessoa], antes da fala. Se outro NPC presente for relevante, dirija-se a ele pelo nome. Não narre decisões dos jogadores.`;
  const button=document.querySelector('#generate-npc-line');if(button){button.disabled=true;button.textContent='Gerando…';}
  try{
    const response=await fetch('https://api.groq.com/openai/v1/chat/completions',{method:'POST',headers:{'Authorization':'Bearer '+localStorage.getItem('oraculo.groqKey'),'content-type':'application/json'},body:JSON.stringify({model:'llama-3.3-70b-versatile',max_tokens:350,temperature:.82,messages:[{role:'system',content:system},{role:'user',content:`${recent?'Histórico recente:\n'+recent+'\n\n':''}${directive||'Responda naturalmente ao que foi dito e feito nesta rodada.'}`} ]})});
    const data=await response.json(),reply=data.choices?.[0]?.message?.content?.trim();
    if(!response.ok||!reply)throw new Error(data.error?.message||'A IA não retornou uma fala.');
    const message={id:crypto.randomUUID(),type:'npc-line',playerId:localPlayerId(),characterName:(npc.title||npc.name||'NPC').replace(/^NPC — /,''),speakerId:npc.id,text:reply,cycle:Number(liveRoom.actionCycle?.number||1),createdAt:Date.now()};
    if(firebaseMode)await postRoomMessage(liveRoom.code,message);else{liveRoom={...liveRoom,messages:[...(liveRoom.messages||[]),message].slice(-150)};renderGame(liveRoom);}
    const field=document.querySelector('#npc-directive');if(field)field.value='';
  }catch(error){notice('Falha ao gerar fala: '+(error.message||'verifique a chave e a conexão.'));}
  finally{const fresh=document.querySelector('#generate-npc-line');if(fresh){fresh.disabled=false;fresh.textContent='✦ Gerar resposta do NPC';}}
}
function renderGame(room){
  const campaign=campaigns.find(item=>item.id===room.campaignId)||currentCampaign();if(!campaign)return;
  document.querySelector('#game-campaign-title').textContent=campaign.title;
  document.querySelector('#game-room-code').textContent='SALA '+room.code;
  const players=room.players||[];document.querySelector('#game-player-count').textContent=players.length+' jogadores';
  const scene=room.scene||campaign.scenes?.[0]||{},sceneIndex=Number(room.sceneIndex||0);
  document.querySelector('#scene-title').textContent=scene.title||'O começo';
  document.querySelector('#scene-description').textContent=scene.description||'A história aguarda o primeiro movimento.';
  document.querySelector('#scene-chapter').textContent=scene.chapter||('CAPÍTULO '+String(sceneIndex+1).padStart(2,'0'));
  document.querySelector('#scene-background').style.backgroundImage=scene.image?'url("'+scene.image+'")':'';
  const me=players.find(player=>player.id===localPlayerId()),avatar=document.querySelector('#scene-avatar');avatar.src=me?.portrait||chosenCharacter?.portrait||'';avatar.alt=me?.characterName||chosenCharacter?.name||'Personagem';
  const messages=room.messages||[],cycle=room.actionCycle||{number:1,requiredPlayerIds:players.map(player=>player.id),status:'collecting'},required=cycle.requiredPlayerIds?.length?cycle.requiredPlayerIds:players.map(player=>player.id);
  const cycleActions=messages.filter(item=>item.type==='player-action'&&Number(item.cycle)===Number(cycle.number)),actedIds=new Set(cycleActions.map(item=>item.playerId));
  const actedCount=required.filter(id=>actedIds.has(id)).length,allActed=required.length>0&&actedCount===required.length;
  const beats=scene.beats||[{type:'narration',text:scene.openingPrompt||scene.description||'A história começa.'}],beatIndex=Math.min(Number(room.beatIndex||0),beats.length-1),beat=beats[beatIndex]||beats[0];
  const speaker=(campaign.npcs||[]).find(npc=>npc.id===beat?.speakerId),stage=document.querySelector('#narrative-stage');
  stage.innerHTML=`${room.hostId===localPlayerId()?'<div class="npc-engine"><label>NPC da vez<select id="game-npc-select" class="input">'+(campaign.npcs||[]).filter(npc=>(scene.presentNpcIds||[]).includes(npc.id)).map(npc=>'<option value="'+escapeAttr(npc.id)+'">'+escapeHtml((npc.title||npc.name||'NPC').replace(/^NPC — /,''))+'</option>').join('')+'</select></label><input id="npc-directive" class="input" maxlength="240" placeholder="Diretiva opcional · o que este NPC ouviu?" '+(allActed?'':'disabled')+'><button id="generate-npc-line" class="mini-button" '+(allActed?'':'disabled')+'>✦ Gerar resposta do NPC</button><button id="configure-narrator-ai" class="mini-button">⚙ Chave de narração</button></div>':''}<article class="narrative-frame ${speaker?'has-speaker':''}"><div class="frame-kicker"><span>${escapeHtml(scene.chapter||'CENA')}</span><span>QUADRO ${beatIndex+1}/${beats.length}</span></div>
  ${speaker?`<figure class="dialogue-portrait"><img src="${escapeAttr(speaker.portrait||'')}" alt=""><figcaption>${escapeHtml((speaker.title||'').replace(/^NPC — /,''))}</figcaption></figure>`:''}
  <div class="dialogue-balloon ${beat?.type==='prompt'?'choice-balloon':''}"><small>${escapeHtml(speaker?(speaker.title||'').replace(/^NPC — /,''):beat?.type==='prompt'?'À MESA':'NARRADOR')}</small><p>${escapeHtml(beat?.text||scene.description||'A cena aguarda a primeira ação.')}</p></div></article>
  <div class="narrative-controls"><span>${escapeHtml(beat?.type==='prompt'?'Declarem uma ação; cada pessoa registra uma vez por rodada.':'O mesmo quadro aparece para todos na sala.')}</span><button id="advance-narrative-beat" class="mini-button" type="button">${beatIndex<beats.length-1?'Próximo quadro →':sceneIndex<campaign.scenes.length-1?'Próximo capítulo →':'Fechar crônica'}</button></div>
  <section class="perception-trigger"><div><b>Olhar atento</b><small>${escapeHtml(scene.perception?.teaser||'Uma pista opcional pode estar escondida neste lugar. Teste Percepção para procurá-la.')}</small></div><button id="scene-perception" class="mini-button" type="button">Testar Percepção · 3d6</button>
  <div id="scene-dice-stage" class="scene-dice-stage hidden"><div class="dice-row"><div class="die"><span></span><span></span><span></span><span></span><span></span><span></span><span></span><span></span><span></span></div><div class="die"><span></span><span></span><span></span><span></span><span></span><span></span><span></span><span></span><span></span></div><div class="die"><span></span><span></span><span></span><span></span><span></span><span></span><span></span><span></span><span></span></div></div><output id="scene-dice-result"></output></div></section>`;
  const generateNpcButton=stage.querySelector('#generate-npc-line');if(generateNpcButton)generateNpcButton.addEventListener('click',generateNpcReply);
  const configureNpcAI=stage.querySelector('#configure-narrator-ai');if(configureNpcAI)configureNpcAI.addEventListener('click',configureNarratorAI);
  const advanceNarrativeButton=stage.querySelector('#advance-narrative-beat');advanceNarrativeButton.addEventListener('click',advanceNarrativeBeat);
  const perceptionRollButton=stage.querySelector('#scene-perception');perceptionRollButton.addEventListener('click',rollScenePerception);
  const alreadyPerceived=messages.some(item=>item.type==='perception'&&item.sceneId===scene.id&&item.playerId===localPlayerId());
  const perceptionButton=document.querySelector('#scene-perception');perceptionButton.disabled=alreadyPerceived||room.status!=='narration';perceptionButton.textContent=alreadyPerceived?'Percepção já testada':'Testar Percepção · 3d6';
  const nextBeat=document.querySelector('#advance-narrative-beat');nextBeat.hidden=room.status!=='narration';nextBeat.disabled=room.hostId!==localPlayerId()||!allActed;
  if(nextBeat.disabled&&room.hostId===localPlayerId())nextBeat.title='Aguarde as ações de todos antes de avançar o quadro.';
  const feed=document.querySelector('#game-messages');
  feed.innerHTML=messages.length?messages.map(item=>{
    const isRoll=item.type==='perception',isNpc=item.type==='npc-line',isNarrator=item.playerId==='narrator',label=isRoll?'PERCEPÇÃO · '+(item.success?'PISTA ENCONTRADA':'PISTA NÃO PERCEBIDA'):(item.type==='player-action'?'AÇÃO · RODADA '+escapeHtml(item.cycle||''):isNpc?'NPC EM CENA':item.className||'Narrador');
    const rollDetail=item.dice?'<p><b>3d6: '+escapeHtml(item.dice.join(' · '))+' = '+escapeHtml(item.total)+' vs. '+escapeHtml(item.effectiveSkill)+' · '+(item.success?'SUCESSO':'FALHA')+'</b></p>':'';const result=isRoll?'<p><b>'+escapeHtml(item.dice.join(' · '))+' = '+escapeHtml(item.total)+' vs. '+escapeHtml(item.effectiveSkill)+'</b><br>'+escapeHtml(item.success?item.successText:item.failureText)+'</p>':rollDetail+'<p>'+escapeHtml(item.text)+'</p>';
    if(item.type==='npc-line'){const portrait=(campaign.npcs||[]).find(npc=>npc.id===item.speakerId)?.portrait||'';return '<article class="npc-dialogue-feed"><img src="'+escapeAttr(portrait)+'" alt=""><div><small>'+escapeHtml(item.characterName||'NPC')+' · FALA EM CENA</small><p>'+escapeHtml(item.text)+'</p></div></article>';}
    return '<article class="story-message '+(item.playerId===localPlayerId()?'mine':isNarrator?'narrator':'')+'"><small>'+escapeHtml(item.characterName||item.playerName||'Narrador')+' · '+label+'</small>'+result+'</article>';
  }).join(''):'<div class="empty-story">As ações da mesa e as pistas descobertas aparecem aqui.</div>';
  document.querySelector('#action-cycle-label').textContent='RODADA '+cycle.number;document.querySelector('#action-cycle-summary').textContent=allActed?'Todas as ações chegaram. O anfitrião pode avançar o quadro ou abrir a próxima rodada.':actedCount+' de '+required.length+' ações registradas';
  document.querySelector('#action-player-status').innerHTML=players.map(player=>'<li class="'+(actedIds.has(player.id)?'acted':'waiting')+'"><span></span>'+escapeHtml(player.characterName||player.name||'Jogador')+' · '+(actedIds.has(player.id)?'AÇÃO ENVIADA':'FALTA AGIR')+'</li>').join('');
  const canSubmit=room.status==='narration'&&me&&required.includes(me.id)&&!actedIds.has(me.id),input=document.querySelector('#message-input'),submit=document.querySelector('#message-form button[type="submit"]');
  input.disabled=!canSubmit;if(submit)submit.disabled=!canSubmit;const rollButton=document.querySelector('#roll-action-test');rollButton.disabled=!canSubmit;const skillPicker=document.querySelector('#action-skill'),activeCharacter=(campaign.characters||[]).find(character=>character.id===me?.characterId)||chosenCharacter||{};if(skillPicker){const skills=activeCharacter.skills||[];skillPicker.innerHTML=skills.map((item,index)=>'<option value="'+index+'" data-level="'+escapeAttr(item.level)+'">'+escapeHtml(item.name)+' · '+escapeHtml(item.level)+'</option>').join('')||'<option data-level="11">Atributo · 11</option>';skillPicker.disabled=!canSubmit;}input.placeholder=canSubmit?'O que seu personagem diz ou tenta fazer nesta rodada?':'Sua ação já foi enviada. Aguarde a próxima rodada.';
  const next=document.querySelector('#advance-action-cycle');next.disabled=!allActed||room.hostId!==localPlayerId();next.hidden=room.status!=='narration';
  feed.scrollTop=feed.scrollHeight;showScreen('game');
}
async function advanceNarrativeBeat(){
  if(!liveRoom||liveRoom.hostId!==localPlayerId())return;
  const campaign=campaigns.find(item=>item.id===liveRoom.campaignId)||currentCampaign(),scenes=campaign?.scenes||[],sceneIndex=Number(liveRoom.sceneIndex||0),scene=liveRoom.scene||scenes[sceneIndex],beatIndex=Number(liveRoom.beatIndex||0),beats=scene?.beats||[];
  const cycle=liveRoom.actionCycle||{number:1,requiredPlayerIds:(liveRoom.players||[]).map(player=>player.id)},acted=new Set((liveRoom.messages||[]).filter(item=>item.type==='player-action'&&Number(item.cycle)===Number(cycle.number)).map(item=>item.playerId));
  if((cycle.requiredPlayerIds||[]).some(id=>!acted.has(id)))return notice('Aguarde uma ação de cada jogador antes de avançar o quadro.');
  const next=beatIndex+1>=beats.length?{sceneIndex:sceneIndex+1,beatIndex:0,scene:scenes[sceneIndex+1]}:{sceneIndex,beatIndex:beatIndex+1,scene};
  if(!next.scene)return notice('A crônica chegou ao último capítulo.');
  try{if(firebaseMode){const room=await advanceNarrativeBeatRemote(liveRoom.code,localPlayerId(),next);renderGame(room);}else{
    liveRoom={...liveRoom,...next,actionCycle:{number:Number(liveRoom.actionCycle?.number||1)+1,requiredPlayerIds:(liveRoom.players||[]).map(player=>player.id),openedAt:Date.now(),status:'collecting'}};
    renderGame(liveRoom);notice(next.sceneIndex!==sceneIndex?'Novo capítulo aberto.':'Próximo quadro. A mesa pode agir.');
  }}catch(error){notice(error.message||'Não foi possível avançar a narração.');}
}
async function rollScenePerception(){
  if(!liveRoom)return;
  const campaign=campaigns.find(item=>item.id===liveRoom.campaignId)||currentCampaign(),scene=liveRoom.scene||campaign?.scenes?.[0],me=(liveRoom.players||[]).find(player=>player.id===localPlayerId());
  if(!scene||!me)return;
  if((liveRoom.messages||[]).some(item=>item.type==='perception'&&item.sceneId===scene.id&&item.playerId===me.id))return notice('Você já examinou esta cena.');
  const character=(campaign.characters||[]).find(item=>item.id===me.characterId)||chosenCharacter||{},skill=(character.skills||[]).find(item=>/percep/i.test(item.name||'')),target=Number(skill?.level||character.attributes?.IQ||11),effectiveSkill=Number(scene.perception?.target||12)+Math.max(0,target-11),dice=roll3d6().dice,total=dice.reduce((sum,value)=>sum+value,0),result=resolveSuccessTest({dice,skill:effectiveSkill});
  const stage=document.querySelector('#scene-dice-stage'),diceEls=[...stage.querySelectorAll('.die')],out=document.querySelector('#scene-dice-result');stage.classList.remove('hidden');out.textContent='Os três dados caem…';
  diceEls.forEach(die=>{die.classList.remove('rolling');void die.offsetWidth;die.classList.add('rolling');});
  for(let tick=0;tick<8;tick++){diceEls.forEach((die,i)=>renderDie(die,dice[(tick+i)%3]));await sleep(75);}
  diceEls.forEach((die,i)=>renderDie(die,dice[i]));out.innerHTML='<b>'+total+' ≤ '+effectiveSkill+' · '+(result.success?'SUCESSO':'FALHA')+'</b>';
  const message={id:crypto.randomUUID(),type:'perception',sceneId:scene.id,playerId:me.id,playerName:me.name||'Jogador',characterName:me.characterName||character.name||'Personagem',dice,total,effectiveSkill,success:result.success,successText:scene.perception?.success||scene.perception?.clue||'Você encontra um detalhe revelador.',failureText:scene.perception?.failure||'O detalhe passa despercebido.',createdAt:Date.now()};
  if(firebaseMode){try{await postRoomMessage(liveRoom.code,message);}catch(error){notice(error.message||'Não foi possível sincronizar o teste.');}}else{liveRoom={...liveRoom,messages:[...(liveRoom.messages||[]),message].slice(-150)};renderGame(liveRoom);}
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
async function advanceActionRound(){
  if(!liveRoom||liveRoom.hostId!==localPlayerId())return;
  try{
    if(firebaseMode){
      const room=await advanceActionCycleRemote(liveRoom.code,localPlayerId());
      renderGame(room);
    }else{
      const cycle=liveRoom.actionCycle||{number:1,requiredPlayerIds:(liveRoom.players||[]).map(player=>player.id),status:'collecting'};
      const nextCycle={number:Number(cycle.number)+1,requiredPlayerIds:(liveRoom.players||[]).map(player=>player.id),openedAt:Date.now(),status:'collecting'};
      liveRoom={...liveRoom,actionCycle:nextCycle};renderGame(liveRoom);
    }
  }catch(error){notice(error.message||'Não foi possível abrir a próxima rodada.');}
}
async function beginNarration(){
  if(!liveRoom)return;const campaign=campaigns.find(item=>item.id===liveRoom.campaignId)||currentCampaign();
  const scene=campaign?.scenes?.[0]||{title:'A primeira cena',description:campaign?.premise||'A história começa.'};
  try{await startNarration(liveRoom.code,localPlayerId(),scene);}
  catch(error){
    if(!firebaseMode&&liveRoom.hostId===localPlayerId()){
      renderRoomSummary({...liveRoom,status:'narration',scene,messages:scene.openingMessages||[]},'Aventura solo local iniciada.');
      return;
    }
    notice(error.message||'Não foi possível iniciar a narração.');
  }
}

document.querySelectorAll('[data-nav]').forEach(button => button.addEventListener('click', () => {
  const destination = button.dataset.nav;
  if (destination === 'campaigns') renderCampaigns();
  if (destination === 'lobby' && chosenCharacter) showLobby();
  if (destination === 'package' && currentCampaign()) openCampaign(currentCampaignId);
  showScreen(destination);
}));

document.querySelector('#test-character').addEventListener('change', renderTestCharacter);
document.querySelector('#lobby-campaign')?.addEventListener('change', renderLobbyCharacters);
document.querySelector('#test-skill').addEventListener('change', updateTestFactors);
document.querySelector('#roll-button').addEventListener('click', performTest);
document.querySelector('#open-test').addEventListener('click', () => openTest());
document.querySelector('#launch-story').addEventListener('click', () => openCharacterBuilder(currentCampaignId));

document.querySelector('#class-select').addEventListener('change',event=>{selectedClassId=event.target.value;renderClassDetails();});
document.querySelector('#prev-class')?.addEventListener('click',()=>cycleClass(-1));
document.querySelector('#next-class')?.addEventListener('click',()=>cycleClass(1));
document.querySelectorAll('[data-gender]').forEach(button=>button.addEventListener('click',()=>{playerGender=button.dataset.gender;document.querySelectorAll('[data-gender]').forEach(item=>item.classList.toggle('active',item===button));renderClassDetails();}));
document.querySelector('#save-character').addEventListener('click',async()=>{
  const campaign=currentCampaign(),cls=(campaign?.classes||[]).find(item=>item.id===selectedClassId),name=document.querySelector('#character-name').value.trim();
  if(!name)return notice('Escolha um nome para o personagem.');if(!cls)return notice('Esta campanha ainda não tem arquétipos definidos.');
  chosenCharacter=buildCharacter(name,cls,playerGender);
  campaign.characters ||= [];campaign.characters.push(chosenCharacter);await persistCampaign(campaign);renderSavedCharacters();showLobby();
});
document.querySelector('#create-room').addEventListener('click',createActiveRoom);
document.querySelector('#join-room').addEventListener('click',()=>joinActiveRoom(document.querySelector('#room-code').value.trim().toUpperCase()));
document.querySelector('#ready-button').addEventListener('click',toggleReady);
document.querySelector('#start-narration').addEventListener('click',beginNarration);
document.querySelector('#advance-action-cycle').addEventListener('click',advanceActionRound);
document.querySelector('#copy-room-code').addEventListener('click',async()=>{
  const url=document.querySelector('#copy-room-code').dataset.shareUrl||roomShareUrl(activeRoomCode,currentCampaignId);
  try{await navigator.clipboard.writeText(url);notice('Link da sala copiado.');}catch{notice(url);}
});
async function sendPlayerAction(roll=null){
  const input=document.querySelector('#message-input'),text=input.value.trim();
  if(!text||!liveRoom||input.disabled)return notice('Escreva sua ação antes de registrar.');
  const cycle=liveRoom.actionCycle||{number:1,requiredPlayerIds:(liveRoom.players||[]).map(player=>player.id),status:'collecting'};
  const message={id:crypto.randomUUID(),type:'player-action',cycle:Number(cycle.number),playerId:localPlayerId(),playerName:document.querySelector('#player-name').value.trim()||'Jogador',characterName:chosenCharacter?.name||'Personagem',className:chosenCharacter?.className||'',text,...(roll||{}),createdAt:Date.now()};
  input.value='';
  if(!firebaseMode){const messages=[...(liveRoom.messages||[]),message].slice(-150),required=cycle.requiredPlayerIds||[],acted=new Set(messages.filter(item=>item.type==='player-action'&&Number(item.cycle)===Number(cycle.number)).map(item=>item.playerId));liveRoom={...liveRoom,messages,actionCycle:{...cycle,status:required.length&&required.every(id=>acted.has(id))?'complete':'collecting'}};renderGame(liveRoom);return;}
  try{await postRoomMessage(liveRoom.code,message);}catch(error){notice(error.message||'A ação não sincronizou. Confira o acesso online à sala.');}
}
async function rollActionTest(){
  if(!liveRoom)return;
  const action=document.querySelector('#message-input').value.trim(),character=chosenCharacter||{};
  if(!action)return notice('Escreva a ação antes de rolar.');
  const select=document.querySelector('#action-skill'),selected=select?.selectedOptions?.[0],skill=Number(selected?.dataset.level||11),name=selected?.textContent||'Percepção';
  const dice=roll3d6().dice,result=resolveSuccessTest({dice,skill}),stage=document.querySelector('#action-dice-stage'),diceEls=[...stage.querySelectorAll('.die')],out=document.querySelector('#action-dice-result');
  stage.classList.remove('hidden');out.textContent='Os dados caem…';diceEls.forEach(die=>{die.classList.remove('rolling');void die.offsetWidth;die.classList.add('rolling');});
  for(let tick=0;tick<8;tick++){diceEls.forEach((die,i)=>renderDie(die,dice[(tick+i)%3]));await sleep(75);}diceEls.forEach((die,i)=>renderDie(die,dice[i]));
  const total=dice.reduce((sum,value)=>sum+value,0);out.innerHTML='<b>'+dice.join(' · ')+' = '+total+' · '+(result.success?'SUCESSO':'FALHA')+'</b>';
  await sendPlayerAction({dice,total,skillName:name,effectiveSkill:skill,success:result.success,criticalSuccess:result.criticalSuccess,criticalFailure:result.criticalFailure});
}
document.querySelector('#message-form').addEventListener('submit',event=>{event.preventDefault();sendPlayerAction();});
document.querySelector('#roll-action-test').addEventListener('click',rollActionTest);


async function boot() {
  try {
    campaigns = visibleCampaigns(await installDemoCampaignsIfEmpty());
    firebaseMode = true;
    storageLabel.textContent = 'Firebase · Mind';
  } catch (error) {
    console.warn('Mind RolePlay: Firestore indisponível; abrindo prévia local.', error);
    firebaseMode = false;
    campaigns = visibleCampaigns(localCampaigns());
    storageLabel.textContent = 'Prévia local';
    notice('A tela funciona neste navegador. Publique as regras Firestore do Mind para sincronizar pela nuvem.');
  }
  if (!campaigns.length) campaigns = visibleCampaigns(localCampaigns());
  const kagehamaSeed = createDemoCampaigns().find(item => item.id === 'demo-kagehama');
  const kagehamaIndex = campaigns.findIndex(item => item.id === 'demo-kagehama');
  if (kagehamaSeed && kagehamaIndex >= 0) {
    const saved = campaigns[kagehamaIndex];
    if (needsKagehamaUpgrade(saved, kagehamaSeed)) {
      const seededChecklistIds = new Set(kagehamaSeed.checklist.map(item => item.id));
      const upgraded = {
        ...kagehamaSeed, ...saved, schemaVersion: KAGEHAMA_SCHEMA_VERSION,
        classes: kagehamaSeed.classes, art: kagehamaSeed.art, progression: kagehamaSeed.progression, artDirection: kagehamaSeed.artDirection, bestiary: kagehamaSeed.bestiary, relics: kagehamaSeed.relics,
        story: kagehamaSeed.story, npcBehaviorModel: kagehamaSeed.npcBehaviorModel,
        npcs: [...kagehamaSeed.npcs, ...(saved.npcs || []).filter(item => !kagehamaSeed.npcs.some(seed => seed.id === item.id))],
        scenes: [...kagehamaSeed.scenes, ...(saved.scenes || []).filter(item => !kagehamaSeed.scenes.some(seed => seed.id === item.id))],
        characters: migrateCharacters(saved.characters, kagehamaSeed.classes), progressionLog: saved.progressionLog || [],
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
  campaigns = visibleCampaigns(campaigns);
  currentCampaignId=campaigns.find(c=>c.id===campaignParam)?.id||campaigns.find(c=>c.id==='demo-kagehama')?.id||campaigns[0]?.id||'';
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
