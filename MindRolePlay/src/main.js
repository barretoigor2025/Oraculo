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
    if (Array.isArray(stored) && stored.length) return stored;
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
  document.querySelector('#active-campaign-name').textContent = campaign?.title || 'Nenhuma campanha selecionada';
}

function renderCampaigns() {
  const grid = document.querySelector('#campaign-grid');
  grid.innerHTML = campaigns.map((campaign, index) => `
    <button class="campaign-card" data-open-campaign="${campaign.id}">
      <span class="number">Pacote ${String(index + 1).padStart(2, '0')} · ${escapeHtml(campaign.genre || 'Gênero não definido')}</span>
      <strong>${escapeHtml(campaign.title)}</strong>
      <span>${countCampaignContent(campaign)} itens preparados · abrir pacote →</span>
    </button>
  `).join('');
  grid.querySelectorAll('[data-open-campaign]').forEach(button => {
    button.addEventListener('click', () => openCampaign(button.dataset.openCampaign));
  });
}

function countCampaignContent(campaign) {
  return ['classes', 'characters', 'npcs', 'scenes', 'maps', 'art', 'checklist']
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
    const count = section.id === 'story' ? (campaign.story ? 1 : 0) : (campaign[section.id]?.length || 0);
    return `<button class="section-card" data-section="${section.id}">
      <em>${count} item${count === 1 ? '' : 's'}</em><strong>${section.label}</strong><span>${section.description}</span>
    </button>`;
  }).join('');
  grid.querySelectorAll('[data-section]').forEach(button => button.addEventListener('click', () => openSection(button.dataset.section)));
  updateHomeCampaign();
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
  renderSectionBody();
  showScreen('section');
}

function makeStarterClasses(text, genre) {
  const source = String(text || '');
  const explicit = source.match(/(?:classes|arquétipos|profissões)\s*:?\s*([\s\S]{0,700})/i)?.[1]
    ?.split(/\n/).filter(line => /^\s*(?:[-*•]|\d+[.)])\s*/.test(line))
    .map(line => line.replace(/^\s*(?:[-*•]|\d+[.)])\s*/, '').split(/[—:]/)[0].trim()).filter(Boolean).slice(0, 6);
  const setting = (genre + ' ' + source).toLowerCase();
  const profiles = /terror|horror|vamp|zumbi|sobreviv/i.test(setting)
    ? [
      ['Investigador','🔦','Lê pistas e percebe detalhes sob pressão.',{ST:9,DX:10,IQ:13,HT:10},[['Investigação',13],['Percepção',12],['Persuasão',11]]],
      ['Sobrevivente','🧭','Resiste, improvisa e encontra rotas seguras.',{ST:11,DX:12,IQ:10,HT:13},[['Sobrevivência',13],['Furtividade',12],['Primeiros socorros',11]]],
      ['Diplomata','🕯️','Consegue cooperação e acalma situações tensas.',{ST:9,DX:10,IQ:11,HT:10},[['Lábia',13],['Empatia',13],['Pesquisa',10]]],
      ['Guardião','🛡️','Protege o grupo e aguenta confronto direto.',{ST:13,DX:10,IQ:10,HT:12},[['Briga',13],['Intimidação',11],['Primeiros socorros',10]]],
    ]
    : /futur|espaço|sci.?fi|cyber|tecnolog/i.test(setting)
      ? [
        ['Explorador','🪐','Explora ambientes desconhecidos e mantém o grupo em movimento.',{ST:10,DX:12,IQ:12,HT:11},[['Exploração',13],['Percepção',12],['Pilotagem',11]]],
        ['Técnico','🔧','Entende máquinas, sistemas e soluções improvisadas.',{ST:9,DX:11,IQ:14,HT:10},[['Tecnologia',14],['Conserto',13],['Pesquisa',11]]],
        ['Mediador','🛰️','Negocia alianças e interpreta intenções.',{ST:9,DX:10,IQ:12,HT:10},[['Diplomacia',13],['Lábia',12],['Empatia',12]]],
        ['Defensor','🚀','Mantém a equipe segura em situações perigosas.',{ST:13,DX:11,IQ:10,HT:12},[['Armas',13],['Tática',12],['Primeiros socorros',10]]],
      ]
      : [
        ['Batedor','🏹','Encontra caminhos, percebe perigos e age com agilidade.',{ST:10,DX:13,IQ:11,HT:11},[['Furtividade',13],['Percepção',12],['Sobrevivência',11]]],
        ['Erudito','📜','Conhece histórias, idiomas e pistas escondidas.',{ST:9,DX:10,IQ:14,HT:10},[['Conhecimento',14],['Pesquisa',13],['Persuasão',10]]],
        ['Guardião','🛡️','Protege aliados e enfrenta ameaças de perto.',{ST:13,DX:10,IQ:10,HT:12},[['Briga',13],['Intimidação',11],['Vigor',12]]],
        ['Curandeiro','🌿','Cuida de ferimentos e mantém o grupo em condições de seguir.',{ST:9,DX:11,IQ:12,HT:11},[['Primeiros socorros',13],['Empatia',12],['Conhecimento',11]]],
      ];
  return profiles.map((p,index)=>({id:'class-'+(index+1),name:explicit?.[index]||p[0],icon:p[1],portrait:'',description:p[2],attributes:p[3],skills:p[4].map(([name,level])=>({name,level})),fixedAbilities:[p[2]],startingLevel:1}));
}

function analyzeCampaignText(text, genre) {
  const lines=String(text||'').split(/\n+/).map(line=>line.trim()).filter(Boolean);
  const headings=lines.filter(line=>/^(?:capítulo|cena|local|npc|personagem|monstro|missão|ato)\b/i.test(line));
  const threats=/monstro|inimigo|perigo|combate|ameaça|boss|vilão/i.test(text);
  const social=/negoci|convenc|persuad|mentir|diálogo|polític/i.test(text);
  const exploration=/explor|investig|pista|mapa|ruína|segredo/i.test(text);
  const checklist=[
    {title:'Revisar classes iniciais sugeridas',description:'Confirmar se os arquétipos combinam com esta campanha.',done:false},
    {title:'Definir retratos das classes',description:'Adicionar a arte definitiva depois da revisão.',done:false},
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
      campaign.npcs=campaign.analysis.sceneHeadings.filter(name=>/^npc|personagem/i.test(name)).map((title,index)=>({id:'npc-'+index,title,description:'Identificado no roteiro',createdAt:Date.now()}));
      campaign.scenes=campaign.analysis.sceneHeadings.filter(name=>/cena|capítulo|ato|local/i.test(name)).map((title,index)=>({id:'scene-'+index,title,description:'Identificado no roteiro',createdAt:Date.now()}));
      await persistCampaign(campaign);openCampaign(campaign.id);notice('Estrutura inicial preparada para revisão.');
    });
    return;
  }
  if(currentSectionId==='classes'){
    const classes=campaign.classes||[];
    body.innerHTML=`<div class="class-grid">${classes.length?classes.map(cls=>`
      <article class="class-template"><div class="class-portrait">${escapeHtml(cls.icon||'✦')}</div>
        <div class="class-template-copy"><small>CLASSE · NÍVEL ${cls.startingLevel||1}</small><h2>${escapeHtml(cls.name)}</h2><p>${escapeHtml(cls.description||'')}</p>
          <div class="class-stats">${Object.entries(cls.attributes||{}).map(([key,value])=>`<span>${key} <b>${value}</b></span>`).join('')}</div>
          <small>Perícias fixas: ${(cls.skills||[]).map(skill=>escapeHtml(skill.name)+' '+skill.level).join(' · ')}</small>
          <small>Habilidade: ${(cls.fixedAbilities||[]).map(escapeHtml).join(' · ')}</small></div></article>`).join(''):'<div class="empty-state">Analise o roteiro para preparar as classes desta campanha.</div>'}</div>
      <div class="prototype-note">Estas fichas formam a base inicial fixa. A árvore de evolução será uma etapa futura.</div>`;
    return;
  }
  if(currentSectionId==='characters'){
    const classes=campaign.classes||[];
    body.innerHTML=`<div class="panel editor"><div class="hint-box">A classe define atributos e perícias iniciais. Você informa apenas nome, gênero e classe.</div>
      ${classes.length?`<form id="character-form" class="editor-form">
        <div class="class-picker">${classes.map((cls,index)=>`<label class="class-option ${index===0?'selected':''}"><input type="radio" name="classId" value="${escapeAttr(cls.id)}" ${index===0?'checked':''} required><span class="class-option-icon">${escapeHtml(cls.icon||'✦')}</span><span><strong>${escapeHtml(cls.name)}</strong><small>${escapeHtml(cls.description||'')}</small></span></label>`).join('')}</div>
        <div class="form-grid"><label class="field">Nome do personagem<input class="input" name="name" required maxlength="40" placeholder="Nome"></label>
          <label class="field">Gênero<select class="input" name="gender" required><option value="">Escolha</option><option>Feminino</option><option>Masculino</option><option>Não binário</option><option>Prefiro não informar</option></select></label></div>
        <button class="button primary">＋ Criar personagem</button></form>`:'<div class="empty-state">Importe e analise o roteiro para preparar as classes desta campanha.</div>'}
      <div id="character-list" class="item-list"></div></div>`;
    renderCharacterList();
    document.querySelectorAll('.class-option').forEach(option=>option.addEventListener('click',()=>document.querySelectorAll('.class-option').forEach(row=>row.classList.toggle('selected',row===option))));
    document.querySelector('#character-form')?.addEventListener('submit',async event=>{
      event.preventDefault();const form=new FormData(event.currentTarget),cls=classes.find(item=>item.id===form.get('classId'));if(!cls)return;
      campaign.characters||=[];
      campaign.characters.push({id:crypto.randomUUID(),name:String(form.get('name')).trim(),gender:String(form.get('gender')),classId:cls.id,className:cls.name,portrait:cls.portrait||'',icon:cls.icon||'✦',level:cls.startingLevel||1,attributes:{...cls.attributes},skills:structuredClone(cls.skills||[]),fixedAbilities:structuredClone(cls.fixedAbilities||[]),advantages:'',disadvantages:'',conditions:[],evolutionPoints:0,createdAt:Date.now()});
      await persistCampaign(campaign);renderSectionBody();notice('Personagem criado a partir da classe da campanha.');
    });
    return;
  }
  const list=campaign[currentSectionId]||[];
  const label=currentSectionId==='checklist'?'Item a preparar':currentSectionId==='npcs'?'NPC':currentSectionId==='scenes'?'Cenário ou cena':currentSectionId==='maps'?'Mapa ou local':'Recurso visual';
  body.innerHTML=`<div class="panel editor">${currentSectionId==='checklist'?'<div class="hint-box">Checklist preparado a partir do roteiro e revisável pelo narrador.</div>':''}
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
  const list = document.querySelector('#character-list');
  if (!list) return;
  const chars = currentCampaign().characters || [];
  if (!chars.length) {
    list.innerHTML = '<div class="empty-state">Nenhum personagem nesta campanha ainda.</div>';
    return;
  }
  list.innerHTML = chars.map(character => {
    const skillText = (character.skills || []).map(skill => `${escapeHtml(skill.name)} ${skill.level}`).join(' · ');
    const conditions = (character.conditions || []).map(condition =>
      `<small>${escapeHtml(condition.name)} · ${condition.modifier >= 0 ? '+' : ''}${condition.modifier} ${condition.permanent ? '· permanente' : ''}</small>`).join('');
    return `<article class="item-card">
      <div><strong>${escapeHtml(character.name)}${character.className ? ' · ' + escapeHtml(character.className) : ''}</strong><small>${escapeHtml(character.gender || 'Gênero não informado')} · nível ${character.level || 1} · ${skillText || 'Sem perícias'}</small>${conditions}</div>
      <div class="item-actions">
        <button class="mini-button" data-test-character="${character.id}">Tentar ação</button>
        <details class="condition-editor">
          <summary>＋ Condição</summary>
          <form data-condition-form="${character.id}">
            <input class="input" name="conditionName" required maxlength="60" placeholder="Lesão, perda de membro...">
            <input class="input" name="modifier" type="number" value="0" aria-label="Modificador">
            <input class="input" name="scope" value="all" placeholder="all ou nome da perícia">
            <label class="check-row"><input type="checkbox" name="permanent"> Permanente</label>
            <button class="mini-button">Salvar condição</button>
          </form>
        </details>
      </div>
    </article>`;
  }).join('');
  list.querySelectorAll('[data-test-character]').forEach(button =>
    button.addEventListener('click', () => openTest(button.dataset.testCharacter)));
  list.querySelectorAll('[data-condition-form]').forEach(form => form.addEventListener('submit', async event => {
    event.preventDefault();
    const values = new FormData(form);
    const character = chars.find(item => item.id === form.dataset.conditionForm);
    const name = String(values.get('conditionName') || '').trim();
    if (!character || !name) return;
    character.conditions ||= [];
    character.conditions.push({
      id: crypto.randomUUID(),
      name,
      modifier: Number(values.get('modifier')) || 0,
      scope: String(values.get('scope') || 'all').trim(),
      permanent: values.get('permanent') === 'on',
      createdAt: Date.now(),
    });
    await persistCampaign(currentCampaign());
    renderSectionBody();
    notice('Condição salva na ficha do personagem.');
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
  const result = document.querySelector('#room-result');
  result.classList.remove('hidden');
  document.querySelector('#room-code-value').textContent = room.code || '';
  document.querySelector('#room-message').textContent = message;
  const players = Array.isArray(room.players) ? room.players : [];
  document.querySelector('#room-player-list').innerHTML = players.length
    ? players.map(player => `<div class="room-player">${escapeHtml(player.name || 'Jogador')}</div>`).join('')
    : '<div class="room-player">Aguardando jogadores…</div>';
}

function watchRoom(code) {
  if (roomUnsubscribe) roomUnsubscribe();
  try {
    roomUnsubscribe = listenRoom(code, room => {
      if (room) renderRoomSummary(room, 'Sala sincronizada · compartilhe o código para convidar seus amigos.');
    }, error => {
      console.warn('Mind RolePlay: não foi possível acompanhar a sala em tempo real.', error);
      notice('A sala foi criada, mas a sincronização em tempo real falhou.');
    });
  } catch (error) {
    console.warn('Mind RolePlay: listener Firebase indisponível.', error);
  }
}

function renderLobbyCampaigns() {
  const select = document.querySelector('#lobby-campaign');
  select.innerHTML = campaigns.map(campaign =>
    `<option value="${campaign.id}">${escapeHtml(campaign.title)}</option>`).join('');
  if (currentCampaignId) select.value = currentCampaignId;
}

document.querySelectorAll('[data-nav]').forEach(button => button.addEventListener('click', () => {
  const destination = button.dataset.nav;
  if (destination === 'campaigns') renderCampaigns();
  if (destination === 'lobby') renderLobbyCampaigns();
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
  campaign.story=script;campaign.source=source;campaign.analysis=analyzeCampaignText(script,genre);campaign.classes=makeStarterClasses(script,genre);campaign.checklist=campaign.analysis.checklist;
  campaign.npcs=campaign.analysis.sceneHeadings.filter(name=>/^npc|personagem/i.test(name)).map((title,index)=>({id:'npc-'+index,title,description:'Identificado no roteiro',createdAt:Date.now()}));
  campaign.scenes=campaign.analysis.sceneHeadings.filter(name=>/cena|capítulo|ato|local/i.test(name)).map((title,index)=>({id:'scene-'+index,title,description:'Identificado no roteiro',createdAt:Date.now()}));
  await persistCampaign(campaign);currentCampaignId=campaign.id;event.currentTarget.reset();renderCampaigns();openCampaign(campaign.id);notice('Pacote preparado: classes, cenas e checklist aguardam revisão.');
});

document.querySelector('#test-character').addEventListener('change', renderTestCharacter);
document.querySelector('#test-skill').addEventListener('change', updateTestFactors);
document.querySelector('#roll-button').addEventListener('click', performTest);
document.querySelector('#open-test').addEventListener('click', () => openTest());

document.querySelector('#create-room').addEventListener('click', async () => {
  const name = document.querySelector('#player-name').value.trim() || 'Narrador';
  const campaignId = document.querySelector('#lobby-campaign').value;
  let code = '';
  if (firebaseMode) {
    try {
      code = await createRoomRemote(campaignId, localPlayerId(), name);
      renderRoomSummary({ code, players: [{ name }] }, 'Sala online criada · compartilhe este código.');
      watchRoom(code);
      return;
    } catch (error) {
      firebaseMode = false;
      storageLabel.textContent = 'Prévia local';
    }
  }
  code = Math.random().toString(36).slice(2, 8).toUpperCase();
  const localRooms = JSON.parse(localStorage.getItem('mindRolePlay.rooms.demo') || '{}');
  localRooms[code] = { code, campaignId, players: [{ name }] };
  localStorage.setItem('mindRolePlay.rooms.demo', JSON.stringify(localRooms));
  renderRoomSummary(localRooms[code], 'Prévia local neste navegador. A sala online usa o Firebase quando as regras do Mind estiverem publicadas.');
});

document.querySelector('#join-room').addEventListener('click', async () => {
  const code = document.querySelector('#room-code').value.trim().toUpperCase();
  if (!code) return notice('Digite o código da sala.');
  const playerName = document.querySelector('#player-name').value.trim() || 'Jogador';
  if (firebaseMode) {
    try {
      const room = await joinRoomRemote(code, localPlayerId(), playerName);
      renderRoomSummary(room, 'Você entrou na sala · a lista de participantes atualiza em tempo real.');
      watchRoom(code);
      return;
    } catch (error) {
      if (error.message === 'Não encontrei uma sala com esse código.') {
        renderRoomSummary({ code, players: [] }, error.message);
        return;
      }
      firebaseMode = false;
      storageLabel.textContent = 'Prévia local';
    }
  }
  const localRooms = JSON.parse(localStorage.getItem('mindRolePlay.rooms.demo') || '{}');
  const room = localRooms[code];
  if (!room) {
    renderRoomSummary({ code, players: [] }, 'Não encontrei uma sala local com esse código.');
    return;
  }
  if (!room.players.some(player => player.name === playerName)) room.players.push({ name: playerName });
  localRooms[code] = room;
  localStorage.setItem('mindRolePlay.rooms.demo', JSON.stringify(localRooms));
  renderRoomSummary(room, 'Sala de demonstração local · sincronização entre dispositivos usa Firebase.');
});

document.querySelector('#copy-room-code').addEventListener('click', async () => {
  const code = document.querySelector('#room-code-value').textContent;
  if (!code) return;
  try {
    await navigator.clipboard.writeText(code);
    notice('Código copiado.');
  } catch {
    notice('Código da sala: ' + code);
  }
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
  currentCampaignId = campaigns[0]?.id || '';
  updateHomeCampaign();
  renderCampaigns();
  renderLobbyCampaigns();
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
