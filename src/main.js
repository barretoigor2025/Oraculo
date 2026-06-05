import './styles.css';
import './oraculo2-replica.css';
import './oraculo2-combat.css';
import { CLASSES, PERICIAS, CLASS_COLORS, formatModifier, getClassById, getDerivedStats } from './data/classes.js';
import { MAP_HEIGHT, MAP_WIDTH } from './game/state.js';
import { movePlayer } from './game/movementSystem.js';
import { endTurn, startGame } from './game/turnSystem.js';
import { joinRoom, listenRoom, saveRoom } from './firebase/roomService.js';

const app = document.querySelector('#app');
const introOverlay = document.querySelector('#intro-overlay');

const session = {
  playerId: localStorage.getItem('oraculo.playerId') ?? crypto.randomUUID(),
  playerName: '',
  classId: 'barbaro',
  roomId: '',
  room: null,
  unsubscribe: null,
  isHost: false,
  onlineMode: false,
};
localStorage.setItem('oraculo.playerId', session.playerId);

// ── Screen management ────────────────────────────────────────────────

function showScreen(id) {
  document.querySelectorAll('.intro-screen').forEach(s => s.classList.remove('active'));
  document.getElementById(id)?.classList.add('active');
}

function showGame() {
  introOverlay.classList.add('fadeout');
  setTimeout(() => {
    introOverlay.style.display = 'none';
    app.style.display = '';
    renderGame();
    bindGameEvents();
  }, 400);
}

// ── Landing canvas ───────────────────────────────────────────────────

function initLandingCanvas() {
  const canvas = document.getElementById('isc-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  function resize() {
    canvas.width = canvas.offsetWidth || window.innerWidth;
    canvas.height = canvas.offsetHeight || window.innerHeight;
  }
  resize();
  window.addEventListener('resize', resize);

  const dots = Array.from({ length: 60 }, () => ({
    x: Math.random() * canvas.width,
    y: Math.random() * canvas.height,
    r: Math.random() * 1.5 + 0.4,
    vx: (Math.random() - 0.5) * 0.35,
    vy: (Math.random() - 0.5) * 0.35,
    t: Math.random() * Math.PI * 2,
  }));

  function frame() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    dots.forEach(d => {
      d.x = (d.x + d.vx + canvas.width) % canvas.width;
      d.y = (d.y + d.vy + canvas.height) % canvas.height;
      d.t += 0.018;
      const alpha = 0.2 + 0.35 * Math.sin(d.t);
      ctx.beginPath();
      ctx.arc(d.x, d.y, d.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(200,160,48,${alpha})`;
      ctx.fill();
    });
    requestAnimationFrame(frame);
  }
  frame();
}

// ── Landing init ─────────────────────────────────────────────────────

function initLanding() {
  initLandingCanvas();

  const savedRoom = localStorage.getItem('oraculo.roomId');
  const savedName = localStorage.getItem('oraculo.playerName');
  if (savedRoom && savedName) {
    const wrap = document.getElementById('lnd-continuar-wrap');
    const lbl = document.getElementById('lnd-continuar-lbl');
    if (wrap) wrap.style.display = 'flex';
    if (lbl) lbl.textContent = `sala ${savedRoom}`;
    document.getElementById('btn-continuar')?.addEventListener('click', async () => {
      session.playerName = savedName;
      session.classId = localStorage.getItem('oraculo.classId') ?? 'barbaro';
      await enterRoom(savedRoom, false);
    });
  }

  document.getElementById('btn-solo')?.addEventListener('click', () => {
    session.onlineMode = false;
    showScreen('isc-slots');
    renderSlots();
  });

  document.getElementById('btn-online')?.addEventListener('click', () => {
    session.onlineMode = true;
    showScreen('isc-slots');
    renderSlots();
  });

  document.getElementById('slots-back')?.addEventListener('click', () => showScreen('isc-landing'));

  document.getElementById('create-back')?.addEventListener('click', () => {
    showScreen('isc-slots');
    renderSlots();
  });

  document.getElementById('lobby-back')?.addEventListener('click', () => showScreen('isc-landing'));

  document.getElementById('room-back')?.addEventListener('click', handleLeaveRoom);
}

// ── Character slots ──────────────────────────────────────────────────

function getCharacters() {
  try { return JSON.parse(localStorage.getItem('oraculo.characters') ?? '[]'); }
  catch { return []; }
}

function saveCharacters(chars) {
  localStorage.setItem('oraculo.characters', JSON.stringify(chars));
}

function renderSlots() {
  const grid = document.getElementById('isc-slots-grid');
  if (!grid) return;

  const chars = getCharacters();
  let html = '';
  for (let i = 0; i < 4; i++) {
    const c = chars[i];
    if (c) {
      html += `
        <div class="isc-slot-card occupied" data-slot="${i}">
          <div class="isc-slot-icon">${c.icon}</div>
          <div class="isc-slot-name">${escapeHtml(c.name)}</div>
          <div class="isc-slot-class">${escapeHtml(c.className)}</div>
          <div class="isc-slot-stats">❤️ ${c.maxHp} &nbsp;⚡ ${c.movement} &nbsp;⚔️ ${c.attack}</div>
          <button class="isc-slot-del" data-del="${i}" title="Excluir">✕</button>
        </div>`;
    } else {
      html += `
        <div class="isc-slot-card empty" data-slot="${i}">
          <div class="isc-slot-add">+</div>
          <div class="isc-slot-add-lbl">Novo Aventureiro</div>
        </div>`;
    }
  }
  grid.innerHTML = html;

  grid.querySelectorAll('.isc-slot-card.occupied').forEach(card => {
    card.addEventListener('click', e => {
      if (e.target.closest('[data-del]')) return;
      const c = chars[Number(card.dataset.slot)];
      session.playerName = c.name;
      session.classId = c.classId;
      localStorage.setItem('oraculo.playerName', c.name);
      localStorage.setItem('oraculo.classId', c.classId);
      if (session.onlineMode) {
        showScreen('isc-lobby');
        bindLobbyButtons();
      } else {
        handleSoloPlay();
      }
    });
  });

  grid.querySelectorAll('.isc-slot-card.empty').forEach(card => {
    card.addEventListener('click', () => {
      showScreen('isc-create');
      initCreateScreen();
    });
  });

  grid.querySelectorAll('[data-del]').forEach(btn => {
    btn.addEventListener('click', e => {
      e.stopPropagation();
      const updated = getCharacters();
      updated.splice(Number(btn.dataset.del), 1);
      saveCharacters(updated);
      renderSlots();
    });
  });
}

// ── Character creation ───────────────────────────────────────────────

let selectedClassId = 'barbaro';

function initCreateScreen() {
  selectedClassId = 'barbaro';
  renderClassGrid();
  updateStatsPreview();

  const btn = document.getElementById('btn-criar-personagem');
  if (btn) {
    const clone = btn.cloneNode(true);
    btn.replaceWith(clone);
    clone.addEventListener('click', confirmarPersonagem);
  }
}

function renderClassGrid() {
  const grid = document.getElementById('isc-class-grid');
  if (!grid) return;
  grid.innerHTML = Object.values(CLASSES).map(cls => `
    <button class="isc-class-btn ${cls.id === selectedClassId ? 'selected' : ''}" data-class="${cls.id}">
      <span class="isc-class-icon">${cls.icon}</span>
      <span class="isc-class-name">${cls.name}</span>
    </button>
  `).join('');
  grid.querySelectorAll('.isc-class-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      selectedClassId = btn.dataset.class;
      renderClassGrid();
      updateStatsPreview();
    });
  });
}

function updateStatsPreview() {
  const cls = CLASSES[selectedClassId];
  if (!cls) return;

  const icon = document.getElementById('isc-sprite-icon');
  const feat = document.getElementById('isc-class-feat');
  if (icon) icon.textContent = cls.icon;
  if (feat) feat.textContent = cls.feat;

  ['STR', 'DEX', 'CON', 'INT', 'WIS', 'CHA'].forEach(attr => {
    const el = document.getElementById(`isp-${attr}`);
    if (el) el.textContent = cls.attrs?.[attr] ?? '—';
  });
  const hp = document.getElementById('isp-HP');
  const mov = document.getElementById('isp-MOV');
  const atq = document.getElementById('isp-ATQ');
  if (hp) hp.textContent = cls.maxHp;
  if (mov) mov.textContent = cls.movement;
  if (atq) atq.textContent = cls.attack;
}

function confirmarPersonagem() {
  const nameInput = document.getElementById('isc-nome');
  const name = nameInput?.value.trim();
  if (!name) { nameInput?.focus(); return; }

  const chars = getCharacters();
  if (chars.length >= 4) {
    alert('Você já tem 4 aventureiros. Exclua um para criar outro.');
    return;
  }

  const cls = CLASSES[selectedClassId];
  const character = {
    name, classId: selectedClassId, className: cls.name,
    icon: cls.icon, maxHp: cls.maxHp, movement: cls.movement, attack: cls.attack,
  };
  chars.push(character);
  saveCharacters(chars);

  session.playerName = name;
  session.classId = selectedClassId;
  localStorage.setItem('oraculo.playerName', name);
  localStorage.setItem('oraculo.classId', selectedClassId);

  if (session.onlineMode) {
    showScreen('isc-lobby');
    bindLobbyButtons();
  } else {
    handleSoloPlay();
  }
}

// ── Solo play ────────────────────────────────────────────────────────

async function handleSoloPlay() {
  const roomId = 'solo_' + session.playerId.slice(0, 8);
  await enterRoom(roomId, true);
}

// ── Lobby ─────────────────────────────────────────────────────────────

function bindLobbyButtons() {
  const btnCriar = document.getElementById('btn-criar-sala');
  if (btnCriar) {
    const c = btnCriar.cloneNode(true);
    btnCriar.replaceWith(c);
    c.addEventListener('click', handleCriarSala);
  }
  const btnEntrar = document.getElementById('btn-entrar-sala');
  if (btnEntrar) {
    const c = btnEntrar.cloneNode(true);
    btnEntrar.replaceWith(c);
    c.addEventListener('click', handleEntrarSala);
  }
}

function generateRoomCode() {
  const pool = 'ABCDEFGHJKLMNPQRSTUVWXYZ';
  return Array.from({ length: 5 }, () => pool[Math.floor(Math.random() * pool.length)]).join('');
}

async function handleCriarSala() {
  await enterRoom(generateRoomCode(), true);
}

async function handleEntrarSala() {
  const input = document.getElementById('lob-code-input');
  const err = document.getElementById('lob-err');
  const code = input?.value.trim().toUpperCase();
  if (!code || code.length < 3) {
    if (err) err.textContent = 'Digite o código da sala.';
    return;
  }
  if (err) err.textContent = '';
  await enterRoom(code, false);
}

// ── Room ──────────────────────────────────────────────────────────────

async function enterRoom(roomId, isHost) {
  session.roomId = roomId;
  session.isHost = isHost;
  localStorage.setItem('oraculo.roomId', roomId);
  localStorage.setItem('oraculo.playerName', session.playerName);
  localStorage.setItem('oraculo.classId', session.classId);

  const codeVal = document.getElementById('room-code-val');
  if (codeVal) codeVal.textContent = roomId;

  showScreen('isc-room');

  try {
    await joinRoom(session.roomId, session.playerId, session.playerName || 'Viajante', session.classId);
  } catch (err) {
    alert(`Erro ao entrar na sala: ${err.message}`);
    showScreen(session.onlineMode ? 'isc-lobby' : 'isc-slots');
    return;
  }

  session.unsubscribe?.();
  session.unsubscribe = listenRoom(session.roomId, room => {
    if (!room) return;
    session.room = room;
    if (room.status === 'battle' && app.style.display === 'none') {
      showGame();
    } else if (room.status === 'battle') {
      renderGame();
      bindGameEvents();
    } else {
      renderRoomPlayers(room);
    }
  });

  const codeDisplay = document.getElementById('room-code-display');
  if (codeDisplay) {
    const clone = codeDisplay.cloneNode(true);
    codeDisplay.replaceWith(clone);
    clone.querySelector('#room-code-val').textContent = roomId;
    clone.addEventListener('click', () => navigator.clipboard?.writeText(roomId).catch(() => {}));
  }

  const btnIniciar = document.getElementById('btn-iniciar');
  if (btnIniciar) {
    const clone = btnIniciar.cloneNode(true);
    btnIniciar.replaceWith(clone);
    clone.addEventListener('click', handleStartGame);
  }
}

function renderRoomPlayers(room) {
  const list = document.getElementById('room-player-list');
  const waitMsg = document.getElementById('room-wait-msg');
  const btnIniciar = document.getElementById('btn-iniciar');
  if (!list) return;

  const players = Object.values(room.players ?? {});
  list.innerHTML = players.map(p => `
    <div class="room-player-card">
      <div class="room-player-icon">${p.icon}</div>
      <div class="room-player-info">
        <div class="room-player-name">${escapeHtml(p.name)}</div>
        <div class="room-player-class">${p.classId}</div>
      </div>
      ${p.id === session.playerId && session.isHost ? '<span class="room-host-badge">Host</span>' : ''}
    </div>
  `).join('');

  if (waitMsg) {
    waitMsg.textContent = players.length >= 2
      ? 'Todos prontos! O host pode iniciar.'
      : 'Aguardando jogadores…';
  }

  if (btnIniciar) {
    btnIniciar.style.display = session.isHost && players.length >= 1 ? '' : 'none';
  }
}

// ── Game screen ───────────────────────────────────────────────────────

function renderGame() {
  const room = session.room;
  if (!room) return;

  const me = room.players?.[session.playerId];
  const turnPlayer = room.players?.[room.currentTurnPlayerId];
  const isMyTurn = room.currentTurnPlayerId === session.playerId;

  app.innerHTML = `
    <main class="shell">
      <header class="topbar">
        <div class="topbar-left">
          <span class="topbar-room">Sala <strong>${escapeHtml(room.id)}</strong></span>
          <span class="topbar-status">${room.status === 'battle' ? '⚔️ Batalha' : '⏳ Aguardando'}</span>
        </div>
        <div class="topbar-center">
          <span class="topbar-turn">${
            isMyTurn ? '✦ Seu Turno'
            : turnPlayer ? `Turno: ${escapeHtml(turnPlayer.name)}`
            : 'Aguardando início'
          }</span>
        </div>
        <div class="topbar-right">
          <button id="endTurn" class="btn-turn${isMyTurn && room.status === 'battle' ? ' active' : ''}"
            ${!isMyTurn || room.status !== 'battle' ? 'disabled' : ''}>Encerrar Turno</button>
          <button id="leaveRoom" class="btn-leave">Sair</button>
        </div>
      </header>

      <div class="players-bar">
        ${Object.values(room.players ?? {}).map(p => `
          <div class="player-chip${p.id === room.currentTurnPlayerId ? ' active' : ''}${p.id === session.playerId ? ' me' : ''}">
            <span class="chip-icon">${p.icon}</span>
            <span class="chip-name">${escapeHtml(p.name)}</span>
            <span class="chip-hp">❤️ ${p.hp}/${p.maxHp}</span>
          </div>
        `).join('')}
      </div>

      <div class="game-area">
        <aside class="side-panel left-panel">
          ${me ? `
            <div class="my-card${isMyTurn ? ' active' : ''}">
              <div class="my-card-icon">${me.icon}</div>
              <div class="my-card-name">${escapeHtml(me.name)}</div>
              <div class="my-card-class">${me.classId}</div>
              <div class="my-card-stats">
                <span>❤️ ${me.hp}/${me.maxHp}</span>
                <span>⚡ ${me.movement}</span>
                <span>⚔️ ${me.attack}</span>
              </div>
              ${isMyTurn ? '<div class="turn-badge">Seu Turno</div>' : ''}
            </div>
          ` : ''}
          ${room.status === 'lobby' ? '<button id="startGame" class="btn-start">⚔ Iniciar Combate</button>' : ''}
          <p>Rodada <strong>${room.turnNumber ?? 0}</strong></p>
        </aside>

        <section class="board-section">
          <div class="board" style="--cols: ${MAP_WIDTH}; --rows: ${MAP_HEIGHT};">
            ${renderBoard(room)}
          </div>
          ${isMyTurn ? '<p class="board-hint">Clique num quadrado dentro do seu alcance.</p>' : ''}
        </section>

        <aside class="side-panel right-panel">
          <h3 class="panel-title">Jogadores</h3>
          ${Object.values(room.players ?? {}).map(p => `
            <div class="player-row${p.id === room.currentTurnPlayerId ? ' active' : ''}">
              <span>${p.icon}</span>
              <span>${escapeHtml(p.name)}</span>
              <span>❤️ ${p.hp}/${p.maxHp}</span>
            </div>
          `).join('')}
          <h3 class="panel-title" style="margin-top:1rem">Log</h3>
          <ol class="log">${(room.log ?? []).map(e => `<li>${escapeHtml(e)}</li>`).join('')}</ol>
        </aside>
      </div>
    </main>
  `;
}

function renderBoard(room) {
  const players = Object.values(room.players ?? {});
  let html = '';
  for (let y = 0; y < MAP_HEIGHT; y++) {
    for (let x = 0; x < MAP_WIDTH; x++) {
      const p = players.find(pl => pl.x === x && pl.y === y);
      const isMe = p?.id === session.playerId;
      html += `<button class="tile${p ? ' occupied' : ''}${isMe ? ' me' : ''}" data-x="${x}" data-y="${y}">${
        p ? `<span>${p.icon}</span><small>${escapeHtml(p.name)}</small>` : ''
      }</button>`;
    }
  }
  return html;
}

function bindGameEvents() {
  document.getElementById('leaveRoom')?.addEventListener('click', handleLeaveRoom);
  document.getElementById('startGame')?.addEventListener('click', handleStartGame);
  document.getElementById('endTurn')?.addEventListener('click', handleEndTurn);
  document.querySelectorAll('.tile').forEach(tile => {
    tile.addEventListener('click', () => handleMove(Number(tile.dataset.x), Number(tile.dataset.y)));
  });
}

// ── Game actions ──────────────────────────────────────────────────────

function handleLeaveRoom() {
  session.unsubscribe?.();
  session.unsubscribe = null;
  session.room = null;
  session.roomId = '';
  localStorage.removeItem('oraculo.roomId');
  app.style.display = 'none';
  introOverlay.style.display = '';
  introOverlay.classList.remove('fadeout');
  showScreen('isc-landing');
}

async function handleStartGame() {
  const result = startGame(session.room);
  if (result.error) { alert(result.error); return; }
  try {
    await saveRoom(result.room);
  } catch (err) {
    alert(`Erro ao iniciar jogo: ${err.message}`);
  }
}

async function handleEndTurn() {
  const result = endTurn(session.room, session.playerId);
  if (result.error) { alert(result.error); return; }
  try {
    await saveRoom(result.room);
  } catch (err) {
    alert(`Erro ao encerrar turno: ${err.message}`);
  }
}

async function handleMove(x, y) {
  if (!session.room || session.room.status !== 'battle') return;
  const result = movePlayer(session.room, session.playerId, x, y);
  if (result.error) { alert(result.error); return; }
  try {
    await saveRoom(result.room);
  } catch (err) {
    alert(`Erro ao mover: ${err.message}`);
  }
}

// ── Utils ─────────────────────────────────────────────────────────────

function escapeHtml(v) {
  return String(v)
    .replaceAll('&', '&amp;').replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;').replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');
}

// ── Boot ──────────────────────────────────────────────────────────────

showScreen('isc-landing');
initLanding();
