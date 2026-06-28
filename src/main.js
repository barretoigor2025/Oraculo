import './styles.css';
import { CLASSES, standeeUrl, retratoUrl } from './data/classes.js';
import { joinRoom, listenRoom, saveRoom, startNarration, startSimulation } from './firebase/roomService.js';
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
  simulationMode: false,
};
localStorage.setItem('oraculo.playerId', session.playerId);

// ── Telas ────────────────────────────────────────────────────────────

function showScreen(id) {
  document.querySelectorAll('.intro-screen').forEach(s => s.classList.remove('active'));
  document.getElementById(id)?.classList.add('active');
}

function _persistSession() {
  localStorage.setItem('oraculo.roomId', session.roomId);
  localStorage.setItem('oraculo.playerId', session.playerId);
  localStorage.setItem('oraculo.playerName', session.playerName);
  localStorage.setItem('oraculo.classId', session.classId);
  if (firebaseApp) localStorage.setItem('oraculo.fbConfig', JSON.stringify(firebaseApp.options));
  localStorage.setItem('oraculo.isHost', session.isHost ? '1' : '0');
}

function goToArena() {
  _persistSession();
  introOverlay.classList.add('fadeout');
  setTimeout(() => { window.location.href = 'arena.html'; }, 400);
}

function goToNarration() {
  _persistSession();
  introOverlay.classList.add('fadeout');
  setTimeout(() => { window.location.href = 'narration.html'; }, 400);
}

function goToSimulation() {
  _persistSession();
  introOverlay.classList.add('fadeout');
  setTimeout(() => { window.location.href = 'simulacao_dialogo.html'; }, 400);
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

  // Seleção de campanha
  const campCards = document.querySelectorAll('.camp-card');
  let campSelecionada = localStorage.getItem('oraculo.campaign') || 'mhoried';
  campCards.forEach(c => c.classList.toggle('selecionado', c.dataset.camp === campSelecionada));
  campCards.forEach(card => {
    card.addEventListener('click', () => {
      campSelecionada = card.dataset.camp;
      localStorage.setItem('oraculo.campaign', campSelecionada);
      campCards.forEach(c => c.classList.toggle('selecionado', c === card));
    });
  });

  // Solo removido — todo jogo é por sala (multiplayer). Quem joga sozinho cria
  // uma sala só pra si. Botão único "Jogar" sempre entra em modo online.
  document.getElementById('btn-online')?.addEventListener('click', () => {
    if (campSelecionada === 'death-note') {
      window.location.href = 'simulacao_dialogo_dn.html';
      return;
    }
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
      const portraitSrc = retratoUrl(c.classId);
      const lvl = c.level || 1;
      const camp = c.campaign || 'Mhoried';
      html += `
        <div class="isc-slot-card occupied" data-slot="${i}">
          <div class="isc-slot-portrait">
            <img src="${portraitSrc}" alt="" onerror="this.style.display='none'">
            <span>${c.icon}</span>
          </div>
          <div class="isc-slot-nome">${escapeHtml(c.name)}</div>
          <div class="isc-slot-classe">${escapeHtml(c.className)}</div>
          <div class="isc-slot-meta">Lv ${lvl} · ${escapeHtml(camp)}</div>
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

// ── Criação de personagem ────────────────────────────────────────────

let selectedClassId = 'barbaro';

const _HAB_TIPO_COLOR = { melee: '#c88080', magia: '#8888f0', cura: '#70c070', buff: '#c0a040', projétil: '#70c0c0' };

function initCreateScreen() {
  selectedClassId = 'barbaro';
  renderClassCarousel();
  renderClassDetail();

  const btn = document.getElementById('btn-criar-personagem');
  if (btn) {
    const clone = btn.cloneNode(true);
    btn.replaceWith(clone);
    clone.addEventListener('click', confirmarPersonagem);
  }
}

function renderClassCarousel() {
  const el = document.getElementById('isc-class-carousel');
  if (!el) return;
  el.innerHTML = Object.values(CLASSES).map(cls => `
    <button class="isc-cls-chip ${cls.id === selectedClassId ? 'selected' : ''}" data-class="${cls.id}">
      <div class="isc-cls-chip-img">
        <img src="${retratoUrl(cls.id)}" alt="" onerror="this.style.display='none'">
        <span>${cls.icon}</span>
      </div>
      <span class="isc-cls-chip-name">${cls.name}</span>
    </button>
  `).join('');
  el.querySelectorAll('.isc-cls-chip').forEach(btn => {
    btn.addEventListener('click', () => {
      selectedClassId = btn.dataset.class;
      renderClassCarousel();
      renderClassDetail();
    });
  });
}

function renderClassDetail() {
  const el = document.getElementById('isc-class-detail');
  if (!el) return;
  const cls = CLASSES[selectedClassId];
  if (!cls) { el.innerHTML = ''; return; }

  const attrs = [
    ['FOR', cls.attrs.STR], ['DES', cls.attrs.DEX], ['CON', cls.attrs.CON],
    ['INT', cls.attrs.INT], ['SAB', cls.attrs.WIS], ['CAR', cls.attrs.CHA],
  ];

  const habsHtml = (cls.habs || []).map(h => `
    <div class="icd-hab">
      <span class="icd-hab-icon">${h.icon}</span>
      <div class="icd-hab-body">
        <div class="icd-hab-nome">${escapeHtml(h.nome)}${h.dano !== '—' ? ` <span class="icd-hab-dano" style="color:${_HAB_TIPO_COLOR[h.tipo] || '#aaa'}">${escapeHtml(h.dano)}</span>` : ''}</div>
        <div class="icd-hab-desc">${escapeHtml(h.desc)}</div>
      </div>
    </div>`).join('');

  el.innerHTML = `
    <div class="icd-left">
      <img class="icd-peca" src="${standeeUrl(cls.id)}" alt="" onerror="this.style.display='none'">
    </div>
    <div class="icd-right">
      <div class="icd-titulo">${cls.icon} ${escapeHtml(cls.name)}</div>
      <p class="icd-feat">${escapeHtml(cls.feat)}</p>
      <div class="icd-attrs">
        ${attrs.map(([k, v]) => `<div class="icd-attr"><span class="icd-attr-k">${k}</span><span class="icd-attr-v">${v}</span></div>`).join('')}
      </div>
      <div class="icd-derived">❤️ <strong>${cls.maxHp}</strong> PV &nbsp;⚡ <strong>${cls.movement}</strong> MOV &nbsp;⚔️ <strong>${cls.attack}</strong> ATQ</div>
      <div class="icd-habs-title">Habilidades</div>
      <div class="icd-habs">${habsHtml}</div>
    </div>`;
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
    level: 1, campaign: 'Mhoried',
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
  let _firstSnapshot = true;
  session.unsubscribe = listenRoom(session.roomId, room => {
    if (!room) return;
    session.room = room;
    // Skip auto-redirect on the first snapshot for the host — avoids stale
    // 'battle'/'narration' state from a previous session sending them away
    // before they see the waiting room. Non-hosts still redirect immediately
    // so they can catch up to an in-progress narration or battle.
    const skipRedirect = _firstSnapshot && isHost;
    _firstSnapshot = false;
    if (!skipRedirect && room.status === 'battle') {
      goToArena();
    } else if (!skipRedirect && room.status === 'narration') {
      goToNarration();
    } else if (!skipRedirect && room.status === 'simulation') {
      goToSimulation();
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

  // Botão iniciar batalha (só host vê)
  const btnIniciar = document.getElementById('btn-iniciar');
  if (btnIniciar) {
    const clone = btnIniciar.cloneNode(true);
    btnIniciar.replaceWith(clone);
    clone.addEventListener('click', handleStartGame);
  }

  // Botão iniciar narração (só host vê)
  const btnNarracao = document.getElementById('btn-iniciar-narracao');
  if (btnNarracao) {
    const clone = btnNarracao.cloneNode(true);
    btnNarracao.replaceWith(clone);
    clone.addEventListener('click', handleStartNarration);
  }

  // Botão iniciar simulação de diálogo (só host vê, só em modo simulação)
  const btnSimulacao = document.getElementById('btn-iniciar-simulacao');
  if (btnSimulacao) {
    const clone = btnSimulacao.cloneNode(true);
    btnSimulacao.replaceWith(clone);
    clone.addEventListener('click', handleStartSimulation);
  }
}

function renderRoomPlayers(room) {
  const list = document.getElementById('room-player-list');
  const waitMsg = document.getElementById('room-wait-msg');
  const btnIniciar = document.getElementById('btn-iniciar');
  const btnNarr = document.getElementById('btn-iniciar-narracao');
  const btnSim = document.getElementById('btn-iniciar-simulacao');
  if (!list) return;

  const players = Object.values(room.players ?? {});
  list.innerHTML = players.map(p => {
    const portraitSrc = retratoUrl(p.classId || 'barbaro');
    const className = CLASSES[p.classId]?.name || p.classId;
    const isMe = p.id === session.playerId;
    const isHost = isMe && session.isHost;
    return `
    <div class="room-player-card${isHost ? ' is-host' : ''}">
      ${isHost ? '<span class="room-host-badge">Host</span>' : ''}
      <div class="room-portrait">
        <img src="${portraitSrc}" alt="" onerror="this.style.display='none'">
        <span>${p.icon}</span>
      </div>
      <div class="room-player-nome">${escapeHtml(p.name)}</div>
      <div class="room-player-classe">${escapeHtml(className)}</div>
    </div>`
  }).join('');

  if (waitMsg) {
    waitMsg.textContent = players.length >= 2
      ? 'Todos prontos! O host pode iniciar.'
      : 'Aguardando jogadores…';
  }

  const hostCanStart = session.isHost && players.length >= 1;
  if (session.simulationMode) {
    if (btnIniciar) btnIniciar.style.display = 'none';
    if (btnNarr) btnNarr.style.display = 'none';
    if (btnSim) btnSim.style.display = hostCanStart ? '' : 'none';
  } else {
    if (btnIniciar) btnIniciar.style.display = hostCanStart ? '' : 'none';
    if (btnNarr) btnNarr.style.display = hostCanStart ? '' : 'none';
    if (btnSim) btnSim.style.display = 'none';
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

async function handleStartNarration() {
  try {
    // Prólogo (intro puro com avanço em grupo) → Feira. O gancho de batalha foi tirado
    // do prólogo, então não há mais batalha dupla.
    await startNarration(session.roomId, 'prologo');
  } catch (err) {
    alert(`Erro ao iniciar narração: ${err.message}`);
  }
}

async function handleStartSimulation() {
  try {
    await startSimulation(session.roomId);
  } catch (err) {
    alert(`Erro ao iniciar simulação: ${err.message}`);
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

const _urlParams = new URLSearchParams(window.location.search);
if (_urlParams.get('sim') === '1') {
  session.simulationMode = true;
  session.onlineMode = true;
  history.replaceState({}, '', window.location.pathname);
  initLanding();
  showScreen('isc-slots');
  renderSlots();
} else {
  showScreen('isc-landing');
  initLanding();
}
