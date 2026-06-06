import './styles.css';
import { CLASSES } from './data/classes.js';
import { joinRoom, listenRoom, saveRoom } from './firebase/roomService.js';
import { firebaseApp } from './firebase/config.js';
import { startGame } from './game/turnSystem.js';

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

// ── Telas ────────────────────────────────────────────────────────────

function showScreen(id) {
  document.querySelectorAll('.intro-screen').forEach(s => s.classList.remove('active'));
  document.getElementById(id)?.classList.add('active');
}

function goToArena() {
  localStorage.setItem('oraculo.roomId', session.roomId);
  localStorage.setItem('oraculo.playerId', session.playerId);
  localStorage.setItem('oraculo.playerName', session.playerName);
  localStorage.setItem('oraculo.classId', session.classId);
  if (firebaseApp) localStorage.setItem('oraculo.fbConfig', JSON.stringify(firebaseApp.options));
  introOverlay.classList.add('fadeout');
  setTimeout(() => { window.location.href = 'arena.html'; }, 400);
}

// ── Canvas da landing ────────────────────────────────────────────────

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
      ctx.beginPath();
      ctx.arc(d.x, d.y, d.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(200,160,48,${0.2 + 0.35 * Math.sin(d.t)})`;
      ctx.fill();
    });
    requestAnimationFrame(frame);
  }
  frame();
}

// ── Landing ──────────────────────────────────────────────────────────

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

// ── Slots de personagem ──────────────────────────────────────────────

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
      const portraitSrc = `portraits/${c.classId}_${c.gender || 'm'}.png`;
      html += `
        <div class="isc-slot-card occupied" data-slot="${i}">
          <div class="isc-slot-portrait">
            <img src="${portraitSrc}" alt="" onerror="this.style.display='none'">
            <span>${c.icon}</span>
          </div>
          <div class="isc-slot-nome">${escapeHtml(c.name)}</div>
          <div class="isc-slot-classe">${escapeHtml(c.className)}</div>
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
      localStorage.setItem('oraculo.gender', c.gender || 'm');
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

// ── Criação de personagem ────────────────────────────────────────────

let selectedClassId = 'barbaro';
let selectedGender = 'm';

function initCreateScreen() {
  selectedClassId = 'barbaro';
  selectedGender = 'm';
  renderClassGrid();
  renderGenderButtons();
  updateStatsPreview();

  const btn = document.getElementById('btn-criar-personagem');
  if (btn) {
    const clone = btn.cloneNode(true);
    btn.replaceWith(clone);
    clone.addEventListener('click', confirmarPersonagem);
  }
}

function renderGenderButtons() {
  document.querySelectorAll('.isc-gender-btn').forEach(btn => {
    btn.classList.toggle('selected', btn.dataset.gender === selectedGender);
    btn.onclick = () => {
      selectedGender = btn.dataset.gender;
      renderGenderButtons();
      updateStatsPreview();
    };
  });
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
  if (icon) {
    const img = document.createElement('img');
    img.src = `portraits/${selectedClassId}_${selectedGender}.png`;
    img.alt = cls.name;
    img.style.cssText = 'width:100%;height:auto;display:block;border-radius:10px;';
    img.onerror = () => { icon.innerHTML = cls.icon; };
    icon.innerHTML = '';
    icon.appendChild(img);
  }
  if (feat) feat.textContent = cls.feat;
  ['STR', 'DEX', 'CON', 'INT', 'WIS', 'CHA'].forEach(attr => {
    const el = document.getElementById(`isp-${attr}`);
    if (el) el.textContent = cls.attrs?.[attr] ?? '—';
  });
  const hp  = document.getElementById('isp-HP');
  const mov = document.getElementById('isp-MOV');
  const atq = document.getElementById('isp-ATQ');
  if (hp)  hp.textContent  = cls.maxHp;
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
    gender: selectedGender,
  };
  chars.push(character);
  saveCharacters(chars);

  session.playerName = name;
  session.classId = selectedClassId;
  localStorage.setItem('oraculo.playerName', name);
  localStorage.setItem('oraculo.classId', selectedClassId);
  localStorage.setItem('oraculo.gender', selectedGender);

  if (session.onlineMode) {
    showScreen('isc-lobby');
    bindLobbyButtons();
  } else {
    handleSoloPlay();
  }
}

// ── Solo ─────────────────────────────────────────────────────────────

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
  const err   = document.getElementById('lob-err');
  const code  = input?.value.trim().toUpperCase();
  if (!code || code.length < 3) {
    if (err) err.textContent = 'Digite o código da sala.';
    return;
  }
  if (err) err.textContent = '';
  await enterRoom(code, false);
}

// ── Sala de espera ────────────────────────────────────────────────────

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
    await joinRoom(session.roomId, session.playerId, { name: session.playerName || 'Viajante', classId: session.classId });
  } catch (err) {
    alert(`Erro ao entrar na sala: ${err.message}`);
    showScreen(session.onlineMode ? 'isc-lobby' : 'isc-slots');
    return;
  }

  session.unsubscribe?.();
  session.unsubscribe = listenRoom(session.roomId, room => {
    if (!room) return;
    session.room = room;
    if (room.status === 'battle') {
      goToArena();
    } else {
      renderRoomPlayers(room);
    }
  });

  // Tap no código copia pra clipboard
  const codeDisplay = document.getElementById('room-code-display');
  if (codeDisplay) {
    const clone = codeDisplay.cloneNode(true);
    codeDisplay.replaceWith(clone);
    clone.querySelector('#room-code-val').textContent = roomId;
    clone.addEventListener('click', () => navigator.clipboard?.writeText(roomId).catch(() => {}));
  }

  // Botão iniciar (só host vê)
  const btnIniciar = document.getElementById('btn-iniciar');
  if (btnIniciar) {
    const clone = btnIniciar.cloneNode(true);
    btnIniciar.replaceWith(clone);
    clone.addEventListener('click', handleStartGame);
  }
}

function renderRoomPlayers(room) {
  const list      = document.getElementById('room-player-list');
  const waitMsg   = document.getElementById('room-wait-msg');
  const btnIniciar = document.getElementById('btn-iniciar');
  if (!list) return;

  const players = Object.values(room.players ?? {});
  list.innerHTML = players.map(p => {
    const gender = p.gender || 'm';
    const portraitSrc = `portraits/${p.classId}_${gender}.png`;
    return `
    <div class="room-player-card${p.id === session.playerId && session.isHost ? ' is-host' : ''}">
      ${p.id === session.playerId && session.isHost ? '<span class="room-host-badge">Host</span>' : ''}
      <div class="room-portrait">
        <img src="${portraitSrc}" alt="" onerror="this.style.display='none'">
        <span>${p.icon}</span>
      </div>
      <div class="room-player-nome">${escapeHtml(p.name)}</div>
      <div class="room-player-classe">${escapeHtml(p.classId)}</div>
    </div>`
  }).join('');

  if (waitMsg) {
    waitMsg.textContent = players.length >= 2
      ? 'Todos prontos! O host pode iniciar.'
      : 'Aguardando jogadores…';
  }

  if (btnIniciar) {
    btnIniciar.style.display = session.isHost && players.length >= 1 ? '' : 'none';
  }
}

// ── Ações ─────────────────────────────────────────────────────────────

function handleLeaveRoom() {
  session.unsubscribe?.();
  session.unsubscribe = null;
  session.room = null;
  session.roomId = '';
  localStorage.removeItem('oraculo.roomId');
  showScreen('isc-landing');
}

async function handleStartGame() {
  const result = startGame(session.room);
  if (result.error) { alert(result.error); return; }
  try {
    await saveRoom(result.room);
  } catch (err) {
    alert(`Erro ao iniciar: ${err.message}`);
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
