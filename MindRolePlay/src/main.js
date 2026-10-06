import './styles.css';
import { CAMPAIGN_SECTIONS, createDemoCampaigns, createEmptyCampaign } from './campaigns.js';
import { roll3d6, resolveSuccessTest } from './gurps.js';
import {
  createCampaign as createCampaignRemote,
  createRoom as createRoomRemote,
  installDemoCampaignsIfEmpty,
  joinRoom as joinRoomRemote,
  loadCampaigns,
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

function renderSectionBody() {
  const campaign = currentCampaign();
  const body = document.querySelector('#section-body');

  if (currentSectionId === 'story') {
    body.innerHTML = `<div class="panel editor">
      <div class="hint-box">O roteiro e as notas pertencem apenas a esta campanha.</div>
      <label class="field">Premissa<textarea id="edit-premise" class="input textarea" placeholder="Qual é a ideia central desta campanha?">${escapeHtml(campaign.premise || '')}</textarea></label>
      <label class="field">Roteiro e cenas<textarea id="edit-story" class="input textarea" rows="8" placeholder="Cole ou escreva o roteiro. Você pode organizar em capítulos e cenas.">${escapeHtml(campaign.story || '')}</textarea></label>
      <label class="field">Fonte ou link de referência<input id="edit-source" class="input" value="${escapeAttr(campaign.source || '')}" placeholder="https://..."></label>
      <button id="save-story" class="button primary">Salvar roteiro</button>
    </div>`;
    document.querySelector('#save-story').addEventListener('click', async () => {
      campaign.premise = document.querySelector('#edit-premise').value.trim();
      campaign.story = document.querySelector('#edit-story').value.trim();
      campaign.source = document.querySelector('#edit-source').value.trim();
      await persistCampaign(campaign);
      openCampaign(campaign.id);
      notice('Roteiro salvo nesta campanha.');
    });
    return;
  }

  if (currentSectionId === 'characters') {
    body.innerHTML = `<div class="panel editor">
      <div class="hint-box">Condições ficam registradas na ficha e acompanham o personagem. O modificador aqui é um campo provisório para o narrador definir como aquela condição afeta os testes.</div>
      <form id="character-form" class="editor-form">
        <div class="form-grid">
          <label class="field">Nome do personagem<input class="input" name="name" required maxlength="40" placeholder="Nome"></label>
          <label class="field">Classe ou arquétipo<input class="input" name="className" maxlength="40" placeholder="Opcional"></label>
          <label class="field">Perícia inicial<input class="input" name="skillName" required maxlength="40" placeholder="Ex.: Persuasão"></label>
          <label class="field">Nível da perícia<input class="input" name="skillLevel" type="number" min="1" max="20" value="10" required></label>
          <label class="field wide-field">Vantagens<input class="input" name="advantages" placeholder="Ex.: boa reputação"></label>
          <label class="field wide-field">Desvantagens<input class="input" name="disadvantages" placeholder="Ex.: medo de altura"></label>
          <label class="field wide-field">Condição persistente<input class="input" name="conditionName" placeholder="Ex.: braço lesionado (ou deixe vazio)"></label>
          <label class="field">Modificador provisório<input class="input" name="conditionModifier" type="number" value="0"></label>
          <label class="check-row"><input type="checkbox" name="permanent"> Marcar como permanente</label>
        </div>
        <button class="button primary">＋ Criar personagem</button>
      </form>
      <div id="character-list" class="item-list"></div>
    </div>`;
    renderCharacterList();
    document.querySelector('#character-form').addEventListener('submit', async event => {
      event.preventDefault();
      const form = new FormData(event.currentTarget);
      const name = String(form.get('name')).trim();
      const skillName = String(form.get('skillName')).trim();
      const conditionName = String(form.get('conditionName') || '').trim();
      const character = {
        id: crypto.randomUUID(),
        name,
        className: String(form.get('className') || '').trim(),
        skills: [{ name: skillName, level: Number(form.get('skillLevel')) || 10 }],
        advantages: String(form.get('advantages') || '').trim(),
        disadvantages: String(form.get('disadvantages') || '').trim(),
        conditions: conditionName ? [{
          id: crypto.randomUUID(),
          name: conditionName,
          modifier: Number(form.get('conditionModifier')) || 0,
          permanent: form.get('permanent') === 'on',
          scope: 'all',
          createdAt: Date.now(),
        }] : [],
        createdAt: Date.now(),
      };
      campaign.characters ||= [];
      campaign.characters.push(character);
      await persistCampaign(campaign);
      renderSectionBody();
      notice('Personagem criado e condição registrada na ficha.');
    });
    return;
  }

  const list = campaign[currentSectionId] || [];
  const label = currentSectionId === 'checklist' ? 'Item a preparar' :
    currentSectionId === 'classes' ? 'Classe ou regra' :
    currentSectionId === 'npcs' ? 'NPC' :
    currentSectionId === 'scenes' ? 'Cenário ou cena' :
    currentSectionId === 'maps' ? 'Mapa ou local' : 'Recurso visual';
  body.innerHTML = `<div class="panel editor">
    <form id="item-form" class="editor-form">
      <label class="field">${label}<input class="input" name="title" required maxlength="70" placeholder="Nome"></label>
      <label class="field">Notas<textarea class="input textarea" name="description" rows="3" placeholder="Descrição, instruções ou referência"></textarea></label>
      <button class="button primary">＋ Adicionar</button>
    </form>
    <div id="section-items" class="item-list"></div>
  </div>`;
  renderGenericItems(list);
  document.querySelector('#item-form').addEventListener('submit', async event => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const item = {
      id: crypto.randomUUID(),
      title: String(form.get('title')).trim(),
      description: String(form.get('description') || '').trim(),
      done: false,
      createdAt: Date.now(),
    };
    campaign[currentSectionId] ||= [];
    campaign[currentSectionId].push(item);
    if (currentSectionId === 'checklist') item.done = false;
    await persistCampaign(campaign);
    renderSectionBody();
    notice(currentSectionId === 'checklist' ? 'Item adicionado ao checklist.' : 'Item adicionado ao pacote.');
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
      <div><strong>${escapeHtml(character.name)}${character.className ? ' · ' + escapeHtml(character.className) : ''}</strong><small>${skillText || 'Sem perícias'}</small>${conditions}</div>
      <div class="item-actions"><button class="mini-button" data-test-character="${character.id}">Tentar ação</button></div>
    </article>`;
  }).join('');
  list.querySelectorAll('[data-test-character]').forEach(button =>
    button.addEventListener('click', () => openTest(button.dataset.testCharacter)));
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

function renderTestCharacter() {
  const character = selectedCharacter();
  activeCharacterId = character?.id || '';
  const skillSelect = document.querySelector('#test-skill');
  skillSelect.innerHTML = (character?.skills || []).map((skill, index) =>
    `<option value="${index}">${escapeHtml(skill.name)} · nível ${skill.level}</option>`).join('');
  const factors = document.querySelector('#character-factors');
  if (!character) { factors.textContent = 'Escolha um personagem.'; return; }
  const conditions = character.conditions || [];
  const modifier = conditions.reduce((sum, condition) => sum + Number(condition.modifier || 0), 0);
  factors.innerHTML = `Vantagens: ${escapeHtml(character.advantages || 'nenhuma registrada')}<br>
    Desvantagens: ${escapeHtml(character.disadvantages || 'nenhuma registrada')}<br>
    Condições persistentes: ${conditions.length ? conditions.map(c => escapeHtml(c.name) + ' (' + (c.modifier >= 0 ? '+' : '') + c.modifier + ')' + (c.permanent ? ' permanente' : '')).join('; ') : 'nenhuma'}
    <br>Modificador das condições aplicado neste protótipo: ${modifier >= 0 ? '+' : ''}${modifier}`;
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
  const skill = (character.skills || [])[Number(document.querySelector('#test-skill').value)];
  if (!skill) return notice('Escolha uma perícia para este teste.');

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
    .reduce((sum, condition) => sum + Number(condition.modifier || 0), 0);
  const situationalModifier = Number(document.querySelector('#situational-modifier').value) || 0;
  const result = resolveSuccessTest({
    dice, skill: skill.level, conditionModifier, situationalModifier,
  });
  const label = result.outcome.toLocaleUpperCase('pt-BR');
  outcome.innerHTML = `${result.total} — ${label}<span class="roll-detail">Alvo efetivo ${result.effectiveSkill} · ${result.success ? 'sucesso por ' : 'falha por '}${result.margin} · ${escapeHtml(action)}</span>`;

  const campaign = currentCampaign();
  campaign.testLog ||= [];
  campaign.testLog.unshift({
    id: crypto.randomUUID(), createdAt: Date.now(), characterId: character.id,
    characterName: character.name, action, skill: skill.name, dice,
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

document.querySelector('#new-campaign-form').addEventListener('submit', async event => {
  event.preventDefault();
  const title = document.querySelector('#new-title').value.trim();
  const genre = document.querySelector('#new-genre').value.trim();
  if (!title) return;
  let campaign;
  if (firebaseMode) {
    try { campaign = await createCampaignRemote(title, genre); }
    catch (error) {
      firebaseMode = false;
      storageLabel.textContent = 'Prévia local';
      notice('Firebase sem permissão para o Mind; criando pacote local neste navegador.');
    }
  }
  if (!campaign) {
    campaign = createEmptyCampaign('campaign-' + crypto.randomUUID(), title, genre);
    campaigns.push(campaign);
    saveLocalCampaigns();
  } else {
    campaigns.push(campaign);
  }
  currentCampaignId = campaign.id;
  event.currentTarget.reset();
  renderCampaigns();
  openCampaign(campaign.id);
  notice('Pacote criado com as áreas padrão.');
});

document.querySelector('#test-character').addEventListener('change', renderTestCharacter);
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
