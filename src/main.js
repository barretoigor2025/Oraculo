import './styles.css';
import './oraculo2-replica.css';
import './arena-polish.css';
import { CLASSES, PERICIAS, CLASS_COLORS, formatModifier, getClassById, getDerivedStats } from './data/classes.js';
import { MAP_HEIGHT, MAP_WIDTH } from './game/state.js';
import { movePlayer } from './game/movementSystem.js';
import { endTurn, startGame } from './game/turnSystem.js';
import { joinRoom, listenRoom, saveRoom } from './firebase/roomService.js';

const app = document.querySelector('#app');
const SPRITE_BASE_URL = 'https://raw.githubusercontent.com/barretoigor2025/Rpg-Online/main/sprites';
const SLOT_KEY = 'oraculo.charSlots';
let homeParticlesStarted = false;
let homeAnimationFrame = null;

const session = {
  screen: 'start',
  roomId: localStorage.getItem('oraculo.roomId') ?? '',
  playerId: localStorage.getItem('oraculo.playerId') ?? crypto.randomUUID(),
  activeSlot: Number(localStorage.getItem('oraculo.activeSlot') ?? 0),
  classId: 'guerreiro',
  gender: 'm',
  selectedPericias: new Set(),
  selectedPoderes: new Set(),
  room: null,
  unsubscribe: null,
};
localStorage.setItem('oraculo.playerId', session.playerId);

function loadSlots() {
  try { return Array.from({ length: 4 }, (_, i) => JSON.parse(localStorage.getItem(SLOT_KEY) || '[]')[i] ?? null); }
  catch { return new Array(4).fill(null); }
}
function saveSlots(slots) { localStorage.setItem(SLOT_KEY, JSON.stringify(slots)); }
function render() { app.innerHTML = `<main class="shell ${session.room ? 'game-shell' : 'intro-shell'}">${renderCurrentScreen()}</main>`; bindEvents(); if (!session.room && session.screen === 'start') startHomeCanvas(); else stopHomeCanvas(); }
function renderCurrentScreen() { if (session.room) return renderGame(); if (session.screen === 'slots') return renderCharacterSlots(); if (session.screen === 'character') return renderCharacterCreation(); if (session.screen === 'lobby') return renderLobbyScreen(); return renderStartMenu(); }

function renderStartMenu() {
  return `<section id="screen-home" class="start-screen"><canvas id="home-canvas"></canvas><div id="home-content"><div id="home-logo-wrap"><div id="home-oraculo">ORÁCULO</div><div id="home-rpg">RPG</div></div><p id="home-tagline">Sistema de RPG Generativo com Mestre de IA</p><p id="home-desc">A inteligência artificial conduz a narrativa, interpreta NPCs, controla inimigos e adapta a campanha em tempo real conforme suas escolhas.</p><button id="playSolo" class="home-mode-btn" type="button">Jogar Solo</button><button id="playOnline" class="home-mode-btn primary" type="button">Jogar Online</button></div></section>`;
}
function renderCharacterSlots() { const slots = loadSlots(); return `<section id="screen-chars" class="screen-panel"><div id="chars-topbar"><button class="btn-back" id="backHome" type="button">← Início</button><h2 id="chars-title">Seus Aventureiros</h2><span></span></div><div id="chars-grid">${slots.map((s, i) => renderSlot(s, i)).join('')}</div></section>`; }
function renderSlot(slot, index) {
  if (!slot) return `<button class="slot-card empty" data-create-slot="${index}" type="button"><div class="slot-empty-icon">+</div><div class="slot-empty-label">Criar Aventureiro</div></button>`;
  const cls = getClassById(slot.classId); const color = CLASS_COLORS[slot.classId] || '#4a5a70';
  return `<button class="slot-card occupied" data-select-slot="${index}" type="button" style="background:linear-gradient(160deg,${color}22 0%,rgba(6,8,15,.95) 60%)"><span class="slot-delete" data-delete-slot="${index}">✕</span><div class="slot-sprite-wrap"><img src="${getSpriteUrl(slot.classId, slot.gender)}" alt="" onerror="this.style.display='none'"></div><div class="slot-nome">${escapeHtml(slot.name)}</div><div class="slot-classe">${cls.icon} ${cls.name}</div><div class="slot-nivel">Nível ${slot.level || 1} &nbsp;·&nbsp; ★ ${slot.xp || 0} XP</div><div class="slot-class-bar" style="background:${color}88"></div></button>`;
}

function renderCharacterCreation() {
  const c = getClassById(session.classId); const d = getDerivedStats(c); const powers = getVisiblePowers(c);
  return `<section id="screen-create" class="screen-panel"><div class="lobby-box create-box"><div class="create-topbar"><button id="backToSlots" class="btn-back" type="button">← Voltar</button><h2 class="create-title">Novo Aventureiro</h2></div><label class="field-lbl">Nome</label><input id="playerName" type="text" placeholder="Nome do personagem" maxlength="24" value=""><label class="field-lbl spaced">Classe</label><div id="class-grid">${Object.values(CLASSES).map(renderClassCard).join('')}</div><div id="char-preview"><div id="sprite-col"><img id="char-sprite" src="${getSpriteUrl(c.id, session.gender)}" alt="${escapeHtml(c.name)}" onerror="this.style.opacity='.3'"><div id="gender-toggle"><button class="gender-btn ${session.gender === 'm' ? 'active' : ''}" data-gender="m" type="button">♂ Masc</button><button class="gender-btn ${session.gender === 'f' ? 'active' : ''}" data-gender="f" type="button">♀ Fem</button></div><div id="class-feature-lbl">${c.habilidade.icon || '⚔️'} ${escapeHtml(c.habilidade.nome)} — ${escapeHtml(c.habilidade.desc)}</div></div><div id="stats-col"><div class="dnd-attrs">${renderAttribute('FOR', c.STR)}${renderAttribute('DES', c.DEX)}${renderAttribute('CON', c.CON)}${renderAttribute('INT', c.INT)}${renderAttribute('SAB', c.WIS)}${renderAttribute('CAR', c.CHA)}</div><div class="dnd-derived"><span>❤️ PV <strong>${d.hp}</strong></span><span>🛡️ CA <strong>${d.ac}</strong></span><span>⚡ <strong>${formatSigned(d.init)}</strong></span></div><div class="dnd-saves"><span>Fort <strong>${formatSigned(d.fort)}</strong></span> <span>Ref <strong>${formatSigned(d.ref)}</strong></span> <span>Von <strong>${formatSigned(d.will)}</strong></span></div><div id="poderes-panel"><div class="poderes-title">Poderes da Classe</div>${powers.map((p) => renderPowerChip(p, c)).join('')}</div></div></div>${c.poderes_pool?.length ? `<div id="poderes-section"><label class="field-lbl poderes-section-lbl">Magias <span class="hint inline-hint">(escolha ${c.poderes_qtd})</span></label><div id="poderes-grid" class="poderes-chips">${c.poderes_pool.map(renderSelectablePower).join('')}</div></div>` : ''}<label class="field-lbl spaced">Perícias <span class="hint inline-hint">(escolha 2)</span></label><div id="adv-grid" class="adv-chips">${Object.entries(PERICIAS).map(([id, s]) => renderSkillChip(id, s)).join('')}</div><button id="createCharacter" class="btn-primary" type="button">Criar Aventureiro</button><div id="create-error" class="error-msg"></div></div></section>`;
}
function renderClassCard(klass) { return `<button class="class-btn ${session.classId === klass.id ? 'active' : ''}" data-class-id="${klass.id}" type="button"><span class="class-icon">${klass.icon}</span><span>${klass.name}</span></button>`; }
function renderAttribute(label, value) { return `<div class="attr-box"><span class="attr-lbl">${label}</span><span class="attr-val">${value}</span><span class="attr-mod">${formatModifier(value)}</span></div>`; }
function getVisiblePowers(c) { return c.poderes_pool?.length ? [c.habilidade, ...c.poderes_pool.slice(0, 3)] : (c.poderes || [c.habilidade]); }
function renderPowerChip(power, c) { return `<div class="poder-card"><div class="poder-card-top"><span>${power.icon || c.icon}</span><strong>${escapeHtml(power.nome)}</strong></div><div class="poder-card-desc">${escapeHtml(power.desc)}</div></div>`; }
function renderSelectablePower(power) { return `<button class="poder-chip ${session.selectedPoderes.has(power.id) ? 'selected' : ''}" data-power-id="${power.id}" type="button"><div class="poder-chip-top">${power.icon} <strong>${escapeHtml(power.nome)}</strong></div><div class="poder-chip-desc">${escapeHtml(power.desc)}</div></button>`; }
function renderSkillChip(id, skill) { return `<button class="adv-chip ${session.selectedPericias.has(id) ? 'selected' : ''}" data-skill-id="${id}" type="button"><div class="adv-chip-top">${skill.icon} <strong>${escapeHtml(skill.nome)}</strong> <span class="chip-attr">${skill.attr}</span></div><div class="adv-chip-desc">${escapeHtml(skill.desc)}</div></button>`; }

function renderLobbyScreen() {
  const slot = getActiveCharacter(); const cls = getClassById(slot.classId); const d = getDerivedStats(cls);
  return `<section id="screen-lobby" class="screen-panel"><div class="lobby-box"><div id="lobby-char-card"><img id="lobby-char-sprite" src="${getSpriteUrl(slot.classId, slot.gender)}" alt="" onerror="this.style.opacity='.3'"><div id="lobby-char-info"><div id="lobby-char-nome">${escapeHtml(slot.name)}</div><div id="lobby-char-classe">${cls.icon} ${cls.name} · Nível ${slot.level || 1}</div><div id="lobby-char-stats">❤️ ${d.hp} PV &nbsp; 🛡️ ${d.ac} CA &nbsp; ★ ${slot.xp || 0} XP</div></div><button id="btn-trocar-char" type="button">Trocar</button></div><label class="field-lbl">Código da sala</label><div class="row-input"><input id="roomId" type="text" value="${escapeHtml(session.roomId)}" placeholder="Código da sala" maxlength="18"><button id="joinRoom" class="btn-sm" type="button">Entrar</button></div><button id="joinRoomPrimary" class="btn-primary" type="button">Entrar na sala</button><div id="lobby-error" class="error-msg"></div></div></section>`;
}

function renderGame() {
  const room = session.room; const currentPlayer = room.players?.[session.playerId]; const turnPlayer = room.players?.[room.currentTurnPlayerId]; const isMyTurn = room.currentTurnPlayerId === session.playerId;
  return `<section class="game-header"><div><p class="eyebrow">Mesa ativa</p><h1>Oráculo</h1></div><div class="room-badge">Sala ${escapeHtml(room.id)}</div></section><section class="layout"><aside class="card panel"><h2>Sala ${escapeHtml(room.id)}</h2><p>Status: <strong>${room.status}</strong></p><p>Turno: <strong>${turnPlayer ? escapeHtml(turnPlayer.name) : 'Ainda nao iniciado'}</strong></p><p>Rodada: <strong>${room.turnNumber ?? 0}</strong></p>${currentPlayer ? renderPlayerCard(currentPlayer, isMyTurn) : '<p>Jogador local nao encontrado.</p>'}<div class="actions"><button id="startGame" ${room.status !== 'lobby' ? 'disabled' : ''}>Iniciar combate</button><button id="endTurn" ${!isMyTurn || room.status !== 'battle' ? 'disabled' : ''}>Encerrar turno</button><button id="leaveRoom" class="secondary">Sair da sala</button></div></aside><section class="card board-wrap"><h2>Mapa tático</h2><div class="board" style="--cols: ${MAP_WIDTH}; --rows: ${MAP_HEIGHT};">${renderBoard(room)}</div><p class="hint">Arraste a arena para ver todo o campo. Os personagens agora ocupam posições menores no mapa.</p></section><aside class="card panel"><h2>Jogadores</h2><div class="players">${renderPlayers(room)}</div><h2>Log</h2><ol class="log">${(room.log ?? []).map((e) => `<li>${escapeHtml(e)}</li>`).join('')}</ol></aside></section>`;
}
function renderPlayerCard(player, isMyTurn) { return `<div class="player-card ${isMyTurn ? 'active' : ''}"><div class="avatar"><img src="${getSpriteUrl(player.classId, player.gender ?? 'm')}" alt="" onerror="this.replaceWith(document.createTextNode('${player.icon}'))"></div><div><strong>${escapeHtml(player.name)}</strong><span>${escapeHtml(player.classId)}</span><span>HP ${player.hp}/${player.maxHp} | MOV ${player.movement} | ATQ ${player.attack}</span><span>${isMyTurn ? 'Seu turno' : 'Aguardando turno'}</span></div></div>`; }
function renderBoard(room) {
  const players = Object.values(room.players ?? {}); let html = '';
  for (let y = 0; y < MAP_HEIGHT; y += 1) for (let x = 0; x < MAP_WIDTH; x += 1) {
    const player = players.find((c) => c.x === x && c.y === y); const isMe = player?.id === session.playerId;
    const token = player ? `<img class="map-token" src="${getSpriteUrl(player.classId, player.gender ?? 'm')}" alt=""><span class="map-token-fallback">${player.icon}</span>` : '';
    html += `<button class="tile ${player ? 'occupied' : ''} ${isMe ? 'me' : ''}" data-x="${x}" data-y="${y}">${token}${player ? `<small>${escapeHtml(player.name)}</small>` : ''}</button>`;
  }
  return html;
}
function renderPlayers(room) { return Object.values(room.players ?? {}).map((p) => renderPlayerCard(p, room.currentTurnPlayerId === p.id)).join(''); }

function bindEvents() {
  document.querySelector('#playOnline')?.addEventListener('click', () => { session.screen = 'slots'; render(); });
  document.querySelector('#playSolo')?.addEventListener('click', () => alert('Modo solo ainda nao foi liberado. Primeiro vamos firmar o online.'));
  document.querySelector('#backHome')?.addEventListener('click', () => { session.screen = 'start'; render(); });
  document.querySelector('#backToSlots')?.addEventListener('click', () => { session.screen = 'slots'; render(); });
  document.querySelector('#btn-trocar-char')?.addEventListener('click', () => { session.screen = 'slots'; render(); });
  document.querySelectorAll('[data-create-slot]').forEach((b) => b.addEventListener('click', () => startCreate(Number(b.dataset.createSlot))));
  document.querySelectorAll('[data-select-slot]').forEach((b) => b.addEventListener('click', () => selectSlot(Number(b.dataset.selectSlot))));
  document.querySelectorAll('[data-delete-slot]').forEach((b) => b.addEventListener('click', (e) => { e.stopPropagation(); deleteSlot(Number(b.dataset.deleteSlot)); }));
  document.querySelectorAll('.class-btn').forEach((b) => b.addEventListener('click', () => { session.classId = b.dataset.classId; session.selectedPericias = new Set(); session.selectedPoderes = new Set(); render(); }));
  document.querySelectorAll('.gender-btn').forEach((b) => b.addEventListener('click', () => { session.gender = b.dataset.gender; render(); }));
  document.querySelectorAll('[data-skill-id]').forEach((b) => b.addEventListener('click', () => toggleSkill(b.dataset.skillId)));
  document.querySelectorAll('[data-power-id]').forEach((b) => b.addEventListener('click', () => togglePower(b.dataset.powerId)));
  document.querySelector('#createCharacter')?.addEventListener('click', createCharacter);
  document.querySelector('#joinRoom')?.addEventListener('click', handleJoinRoom);
  document.querySelector('#joinRoomPrimary')?.addEventListener('click', handleJoinRoom);
  document.querySelector('#leaveRoom')?.addEventListener('click', handleLeaveRoom);
  document.querySelector('#startGame')?.addEventListener('click', handleStartGame);
  document.querySelector('#endTurn')?.addEventListener('click', handleEndTurn);
  document.querySelectorAll('.tile').forEach((tile) => tile.addEventListener('click', () => handleMove(Number(tile.dataset.x), Number(tile.dataset.y))));
}
function startCreate(slotIndex) { session.activeSlot = slotIndex; session.classId = 'guerreiro'; session.gender = 'm'; session.selectedPericias = new Set(); session.selectedPoderes = new Set(); localStorage.setItem('oraculo.activeSlot', String(slotIndex)); session.screen = 'character'; render(); }
function selectSlot(slotIndex) { session.activeSlot = slotIndex; localStorage.setItem('oraculo.activeSlot', String(slotIndex)); const character = loadSlots()[slotIndex]; if (character) { session.classId = character.classId; session.gender = character.gender; session.selectedPericias = new Set(character.pericias || []); session.selectedPoderes = new Set(character.poderesEscolhidos || []); session.screen = 'lobby'; render(); } }
function deleteSlot(slotIndex) { const slots = loadSlots(); slots[slotIndex] = null; saveSlots(slots); render(); }
function toggleSkill(skillId) { if (session.selectedPericias.has(skillId)) session.selectedPericias.delete(skillId); else { if (session.selectedPericias.size >= 2) return; session.selectedPericias.add(skillId); } render(); }
function togglePower(powerId) { const cls = getClassById(session.classId); const limit = cls.poderes_qtd || 0; if (session.selectedPoderes.has(powerId)) session.selectedPoderes.delete(powerId); else { if (session.selectedPoderes.size >= limit) return; session.selectedPoderes.add(powerId); } render(); }
function createCharacter() { const name = document.querySelector('#playerName')?.value.trim(); const error = document.querySelector('#create-error'); const cls = getClassById(session.classId); if (!name) { if (error) error.textContent = 'Digite o nome do personagem.'; return; } if (cls.poderes_pool?.length && session.selectedPoderes.size < cls.poderes_qtd) { if (error) error.textContent = `Escolha ${cls.poderes_qtd} magias antes de continuar.`; return; } const d = getDerivedStats(cls); const slots = loadSlots(); slots[session.activeSlot] = { name, classId: cls.id, gender: session.gender, hp: d.hp, maxHp: d.hp, ac: d.ac, init: d.init, fort: d.fort, ref: d.ref, will: d.will, pericias: [...session.selectedPericias], poderesEscolhidos: [...session.selectedPoderes], xp: 0, level: 1, createdAt: Date.now() }; saveSlots(slots); session.screen = 'lobby'; render(); }
function getActiveCharacter() { return loadSlots()[session.activeSlot] || null; }
async function handleJoinRoom() { const roomId = document.querySelector('#roomId')?.value.trim(); const character = getActiveCharacter(); if (!character) return alert('Escolha ou crie um aventureiro primeiro.'); if (!roomId) return alert('Coloque um codigo de sala.'); session.roomId = roomId; localStorage.setItem('oraculo.roomId', session.roomId); try { await joinRoom(session.roomId, session.playerId, character); session.unsubscribe?.(); session.unsubscribe = listenRoom(session.roomId, (room) => { session.room = room; render(); }); } catch (err) { alert(`Erro ao entrar na sala: ${err.message}`); console.error(err); } }
function handleLeaveRoom() { session.unsubscribe?.(); session.unsubscribe = null; session.room = null; session.screen = 'slots'; render(); }
async function handleStartGame() { const result = startGame(session.room); if (result.error) return alert(result.error); await saveRoom(result.room); }
async function handleEndTurn() { const result = endTurn(session.room, session.playerId); if (result.error) return alert(result.error); await saveRoom(result.room); }
async function handleMove(x, y) { if (!session.room || session.room.status !== 'battle') return; const result = movePlayer(session.room, session.playerId, x, y); if (result.error) return alert(result.error); await saveRoom(result.room); }
function startHomeCanvas() { const canvas = document.querySelector('#home-canvas'); if (!canvas || homeParticlesStarted) return; const ctx = canvas.getContext('2d'); const particles = Array.from({ length: 72 }, () => createParticle(canvas)); homeParticlesStarted = true; function resize() { const r = canvas.getBoundingClientRect(); canvas.width = Math.max(1, Math.floor(r.width * window.devicePixelRatio)); canvas.height = Math.max(1, Math.floor(r.height * window.devicePixelRatio)); ctx.setTransform(window.devicePixelRatio, 0, 0, window.devicePixelRatio, 0, 0); } function draw() { if (!document.querySelector('#home-canvas')) return stopHomeCanvas(); const w = canvas.clientWidth; const h = canvas.clientHeight; ctx.clearRect(0, 0, w, h); particles.forEach((p) => { p.x += p.vx; p.y += p.vy; p.life += p.speed; if (p.x < -20 || p.x > w + 20 || p.y < -20 || p.y > h + 20) Object.assign(p, createParticle(canvas), { y: h + Math.random() * 40 }); const pulse = 0.35 + Math.sin(p.life) * 0.35; ctx.beginPath(); ctx.fillStyle = `rgba(122, 192, 240, ${0.12 + pulse * 0.55})`; ctx.shadowColor = 'rgba(122, 192, 240, .85)'; ctx.shadowBlur = 16 + pulse * 14; ctx.arc(p.x, p.y, p.size + pulse * 1.5, 0, Math.PI * 2); ctx.fill(); ctx.shadowBlur = 0; }); homeAnimationFrame = requestAnimationFrame(draw); } resize(); window.addEventListener('resize', resize, { passive: true }); draw(); }
function stopHomeCanvas() { if (homeAnimationFrame) cancelAnimationFrame(homeAnimationFrame); homeAnimationFrame = null; homeParticlesStarted = false; }
function createParticle(canvas) { const width = canvas.clientWidth || window.innerWidth; const height = canvas.clientHeight || window.innerHeight; return { x: Math.random() * width, y: Math.random() * height, vx: (Math.random() - 0.5) * 0.18, vy: -0.15 - Math.random() * 0.45, size: 1 + Math.random() * 2.2, speed: 0.025 + Math.random() * 0.04, life: Math.random() * Math.PI * 2 }; }
function getSpriteUrl(classId, gender = 'm') { return `${SPRITE_BASE_URL}/${classId}_${gender}.png`; }
function formatSigned(value) { return value >= 0 ? `+${value}` : `${value}`; }
function escapeHtml(value) { return String(value).replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('"', '&quot;').replaceAll("'", '&#039;'); }
render();