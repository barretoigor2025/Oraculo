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
    if (Array.isArray(stored) && stored.length) {
      const sample = createDemoCampaigns().find(item => item.id === 'demo-kagehama');
      if (sample) {
        const index = stored.findIndex(item => item.id === sample.id);
        if (index < 0) stored.push(sample);
        else if (Number(stored[index].schemaVersion || 1) < 3) {
          const old = stored[index];
          stored[index] = {
            ...sample, ...old, schemaVersion: 3,
            classes: sample.classes, art: sample.art, progression: sample.progression,
            progressionLog: old.progressionLog || [],
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
  if (/samurai|medieval jap|feudal|kagehama/.test(setting)) return [{"id":"ronin","name":"Rōnin da Fronteira","archetype":"Bárbaro","icon":"⚔","portrait":"assets/campaigns/kagehama/classes/ronin/avatar.svg","description":"Combatente errante, forte e resistente. Protege viajantes, conhece estradas secundárias e desconfia das promessas dos senhores.","attributes":{"ST":14,"DX":11,"IQ":10,"HT":13},"skills":[{"name":"Lâmina pesada","level":13},{"name":"Sobrevivência","level":12},{"name":"Intimidação","level":12}],"fixedAbilities":["Fúria contida: uma vez por cena, transforma um ferimento ou provocação em foco para uma ação física; o narrador registra o custo emocional ou social."],"startingLevel":1,"artBrief":"Retrato vertical de corpo inteiro, rōnin japonês de fantasia histórica, haori gasto em vermelho escuro e cinza, nodachi embainhada, postura robusta e cansada, cicatriz discreta, fundo de estrada de montanha com lanternas distantes, pintura editorial realista, luz cinematográfica, sem texto."},{"id":"samurai","name":"Samurai Juramentado","archetype":"Guerreiro","icon":"⛨","portrait":"assets/campaigns/kagehama/classes/samurai/avatar.svg","description":"Defensor treinado e disciplinado. A armadura e o brasão declaram a quem serve, mas cada juramento traz um preço.","attributes":{"ST":12,"DX":12,"IQ":11,"HT":12},"skills":[{"name":"Katana","level":13},{"name":"Etiqueta","level":12},{"name":"Tática","level":12}],"fixedAbilities":["Guarda do estandarte: uma vez por cena, pode interpor-se para proteger alguém próximo; o narrador define o risco ou custo."],"startingLevel":1,"artBrief":"Retrato vertical de corpo inteiro, samurai de fantasia histórica com yoroi azul petróleo e detalhes dourados, katana embainhada, postura serena e alerta, brasão de clã simples sem letras, pátio de castelo chuvoso, pintura editorial realista, luz cinematográfica, sem texto."},{"id":"kyudoka","name":"Kyūdōka","archetype":"Arqueiro","icon":"弓","portrait":"assets/campaigns/kagehama/classes/kyudoka/avatar.svg","description":"Arqueiro paciente que lê vento, terreno e movimento. É caçador, batedor e sentinela das estradas entre os domínios.","attributes":{"ST":11,"DX":14,"IQ":12,"HT":11},"skills":[{"name":"Arco longo","level":14},{"name":"Rastreamento","level":13},{"name":"Percepção","level":13}],"fixedAbilities":["Disparo calculado: com tempo para observar, identifica uma linha de tiro segura ou um detalhe distante antes de agir."],"startingLevel":1,"artBrief":"Retrato vertical de corpo inteiro, arqueira kyūdōka de fantasia histórica com roupas de viagem verde musgo, arco longo yumi e aljava, postura de mira elegante, mata de bambu e neblina ao fundo, pintura editorial realista, luz cinematográfica, sem texto."},{"id":"shinobi","name":"Shinobi","archetype":"Ladino","icon":"忍","portrait":"assets/campaigns/kagehama/classes/shinobi/avatar.svg","description":"Infiltrador, observador e agente de rotas secretas. Prefere informação, disfarce e preparação ao confronto aberto.","attributes":{"ST":9,"DX":14,"IQ":13,"HT":11},"skills":[{"name":"Furtividade","level":14},{"name":"Disfarce","level":13},{"name":"Investigação","level":12}],"fixedAbilities":["Passo sem testemunha: com preparação e cobertura, pode cruzar uma área observada sem chamar atenção; uma falha ainda pode deixar uma pista."],"startingLevel":1,"artBrief":"Retrato vertical de corpo inteiro, shinobi de fantasia histórica em roupas de viagem índigo e carvão, lenço baixo no pescoço sem cobrir o rosto, pequenas ferramentas discretas, telhados de Kagehama à noite, pintura editorial realista, luz cinematográfica, sem texto."},{"id":"onmyoji","name":"Onmyōji","archetype":"Mago","icon":"☯","portrait":"assets/campaigns/kagehama/classes/onmyoji/avatar.svg","description":"Erudito de rituais, presságios e fenômenos espirituais. A magia existe, mas exige preparo, interpretação e consequências.","attributes":{"ST":9,"DX":10,"IQ":15,"HT":10},"skills":[{"name":"Ocultismo","level":14},{"name":"Pesquisa","level":14},{"name":"Empatia","level":12}],"fixedAbilities":["Leitura de presságio: após estudar um local ou objeto, formula uma pergunta objetiva; a resposta do narrador pode ser incompleta ou simbólica."],"startingLevel":1,"artBrief":"Retrato vertical de corpo inteiro, onmyōji de fantasia histórica em vestes brancas e azul noturno, ofuda e estojo de pincéis, uma pequena luz espiritual dourada paira na mão, santuário enevoado, pintura editorial realista, magia sutil, sem texto."},{"id":"miko","name":"Miko Yamabushi","archetype":"Clérigo","icon":"✧","portrait":"assets/campaigns/kagehama/classes/miko/avatar.svg","description":"Curandeira e guia espiritual que cruza montanhas e campos de batalha. Sua fé consola, mas não apaga o custo dos ferimentos.","attributes":{"ST":10,"DX":11,"IQ":13,"HT":12},"skills":[{"name":"Primeiros socorros","level":14},{"name":"Empatia","level":13},{"name":"Sobrevivência","level":12}],"fixedAbilities":["Mãos firmes: uma vez por cena, estabiliza alguém ferido com recursos simples; recuperar-se por completo ainda exige tempo e cuidado."],"startingLevel":1,"artBrief":"Retrato vertical de corpo inteiro, miko yamabushi de fantasia histórica com hakama vermelho escuro, manto de viagem claro, cajado de peregrinação e bolsa médica, trilha de montanha ao amanhecer, pintura editorial realista, expressão acolhedora e firme, sem texto."}].map(item => structuredClone(item));
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
    if (!campaign.art.some(item => item.id === id)) campaign.art.push({id,title:'Retrato · '+cls.name,description:cls.artBrief,assetPath:cls.portrait,kind:'portrait',status:'brief-ready',done:false});
    const checkId = 'artcheck-' + cls.id;
    if (!campaign.checklist.some(item => item.id === checkId)) campaign.checklist.unshift({id:checkId,title:'Criar retrato: '+cls.name,description:'Arte padronizada de personagem · arquivo-alvo '+cls.portrait,done:false,category:'Arte das classes',createdAt:Date.now()});
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
      <article class="class-template"><div class="class-portrait">${cls.portrait?`<img src="${escapeAttr(cls.portrait)}" alt="Retrato de ${escapeAttr(cls.name)}">`:`<span>${escapeHtml(cls.icon||'✦')}</span>`}</div>
        <div class="class-template-copy"><small>${escapeHtml(cls.archetype||'ARQUÉTIPO')} · CLASSE · NÍVEL ${cls.startingLevel||1}</small><h2>${escapeHtml(cls.name)}</h2><p>${escapeHtml(cls.description||'')}</p>
          <div class="class-stats">${Object.entries(cls.attributes||{}).map(([key,value])=>`<span>${key} <b>${value}</b></span>`).join('')}</div>
          <small>Perícias fixas: ${(cls.skills||[]).map(skill=>escapeHtml(skill.name)+' '+skill.level).join(' · ')}</small>
          <small>Habilidade: ${(cls.fixedAbilities||[]).map(escapeHtml).join(' · ')}</small>
          ${cls.artBrief?`<details class="art-brief"><summary>Direção da arte</summary><p>${escapeHtml(cls.artBrief)}</p><small>ARQUIVO-ALVO · ${escapeHtml(cls.portrait||'definir')}</small></details>`:''}</div></article>`).join(''):'<div class="empty-state">Analise o roteiro para preparar as classes desta campanha.</div>'}</div>
      <div class="prototype-note">Atributos, perícias e habilidade são fixos na criação. Retratos padronizados estão prontos para receber a arte final.</div>`;
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
  if(currentSectionId==='art'){
    const portraits=(campaign.art||[]).filter(item=>item.kind==='portrait');
    body.innerHTML=`<div class="art-board-head"><div><span class="eyebrow">DIREÇÃO DE ARTE DA CAMPANHA</span><h2>Retratos das classes</h2><p>Mesmo enquadramento e linguagem visual; cada descrição já está pronta para orientar a criação da imagem.</p></div><span class="art-progress">${portraits.filter(item=>item.done).length}/${portraits.length} prontos</span></div>
      <div class="art-grid">${(campaign.classes||[]).map(cls=>{const item=portraits.find(row=>row.id==='art-'+cls.id)||{};return `<article class="art-card">
        <div class="art-preview">${cls.portrait?`<img src="${escapeAttr(cls.portrait)}" alt="Arte provisória de ${escapeAttr(cls.name)}">`:escapeHtml(cls.icon||'✦')}<span>${item.done?'ARTE ADICIONADA':'ARTE PENDENTE'}</span></div>
        <div class="art-card-copy"><small>${escapeHtml(cls.archetype||'CLASSE')}</small><h3>${escapeHtml(cls.name)}</h3><p>${escapeHtml(cls.artBrief||cls.description||'Retrato da classe a criar.')}</p><code>${escapeHtml(cls.portrait||'Definir arquivo da arte')}</code>
        <label class="art-done"><input type="checkbox" data-art-done="${escapeAttr(item.id||'art-'+cls.id)}" ${item.done?'checked':''}> Marcar retrato como pronto</label></div></article>`}).join('')}</div>
      <div class="hint-box">Padrão visual: retrato vertical de corpo inteiro, mesma escala e acabamento de pintura. Os SVG atuais são guias substituíveis, não a arte final.</div>`;
    body.querySelectorAll('[data-art-done]').forEach(input=>input.addEventListener('change',async()=>{const item=(campaign.art||[]).find(row=>row.id===input.dataset.artDone);if(item)item.done=input.checked;await persistCampaign(campaign);renderSectionBody()}));
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
  campaign.story=script;campaign.source=source;campaign.analysis=analyzeCampaignText(script,genre);campaign.classes=makeStarterClasses(script,genre);campaign.checklist=campaign.analysis.checklist;campaign.art=[];prepareClassArt(campaign);
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
