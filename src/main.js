import './styles.css';
import { CLASSES } from './data/classes.js';
import { MAP_HEIGHT, MAP_WIDTH } from './game/state.js';
import { movePlayer } from './game/movementSystem.js';
import { endTurn, startGame } from './game/turnSystem.js';
import { joinRoom, listenRoom, saveRoom } from './firebase/roomService.js';

const app = document.querySelector('#app');
let homeParticlesStarted = false;
let homeAnimationFrame = null;

const session = {
  screen: 'start',
  mode: null,
  roomId: localStorage.getItem('oraculo.roomId') ?? '',
  playerId: localStorage.getItem('oraculo.playerId') ?? crypto.randomUUID(),
  playerName: localStorage.getItem('oraculo.playerName') ?? '',
  classId: localStorage.getItem('oraculo.classId') ?? 'barbaro',
  room: null,
  unsubscribe: null,
};

localStorage.setItem('oraculo.playerId', session.playerId);

function render() {
  app.innerHTML = `
    <main class="shell ${session.room ? 'game-shell' : 'intro-shell'}">
      ${renderCurrentScreen()}
    </main>
  `;

  bindEvents();

  if (!session.room && session.screen === 'start') {
    startHomeCanvas();
  } else {
    stopHomeCanvas();
  }
}

function renderCurrentScreen() {
  if (session.room) return renderGame();
  if (session.screen === 'character') return renderCharacterCreation();
  return renderStartMenu();
}

function renderStartMenu() {
  return `
    <section id="screen-home" class="start-screen">
      <canvas id="home-canvas"></canvas>
      <div id="home-content">
        <div id="home-logo-wrap">
          <div id="home-oraculo">ORÁCULO</div>
          <div id="home-rpg">RPG</div>
        </div>
        <p id="home-tagline">Sistema de RPG Generativo com Mestre de IA</p>
        <p id="home-desc">A inteligência artificial conduz a narrativa, interpreta NPCs, controla inimigos e adapta a campanha em tempo real conforme suas escolhas.</p>
        <div class="home-mode-actions">
          <button id="playSolo" class="home-mode-btn" type="button">Jogar Solo</button>
          <button id="playOnline" class="home-mode-btn primary" type="button">Jogar Online</button>
        </div>
      </div>
    </section>
  `;
}

function renderCharacterCreation() {
  const classCards = Object.values(CLASSES)
    .map((klass) => renderClassCard(klass))
    .join('');

  return `
    <section id="screen-create" class="creation-screen">
      <section class="entry-card character-card">
        <div class="create-topbar">
          <button id="backToMenu" class="btn-back" type="button">← Início</button>
          <h2 class="create-title">Novo Aventureiro</h2>
          <span></span>
        </div>

        <label class="field-lbl">Nome</label>
        <input id="playerName" type="text" value="${escapeHtml(session.playerName)}" placeholder="Nome do personagem" maxlength="24" />

        <label class="field-lbl">Código da sala</label>
        <input id="roomId" type="text" value="${escapeHtml(session.roomId)}" placeholder="Código da sala" maxlength="18" />

        <label class="field-lbl">Classe</label>
        <input type="hidden" id="classId" value="${escapeHtml(session.classId)}" />
        <div id="class-grid" class="class-grid">${classCards}</div>

        <button id="joinRoom" class="btn-primary">Entrar na sala</button>
        <p class="hint center">Use o mesmo código em outro celular ou aba para testar o multiplayer.</p>
      </section>
    </section>
  `;
}

function renderClassCard(klass) {
  const isSelected = session.classId === klass.id;

  return `
    <button class="class-btn class-card ${isSelected ? 'active selected' : ''}" data-class-id="${klass.id}" type="button">
      <span>${klass.icon}</span>
      <span>${klass.name}</span>
    </button>
  `;
}

function renderGame() {
  const room = session.room;
  const currentPlayer = room.players?.[session.playerId];
  const turnPlayer = room.players?.[room.currentTurnPlayerId];
  const isMyTurn = room.currentTurnPlayerId === session.playerId;

  return `
    <section class="game-header">
      <div>
        <p class="eyebrow">Mesa ativa</p>
        <h1>Oráculo</h1>
      </div>
      <div class="room-badge">Sala ${escapeHtml(room.id)}</div>
    </section>

    <section class="layout">
      <aside class="card panel">
        <h2>Sala ${escapeHtml(room.id)}</h2>
        <p>Status: <strong>${room.status}</strong></p>
        <p>Turno: <strong>${turnPlayer ? escapeHtml(turnPlayer.name) : 'Ainda nao iniciado'}</strong></p>
        <p>Rodada: <strong>${room.turnNumber ?? 0}</strong></p>
        ${currentPlayer ? renderPlayerCard(currentPlayer, isMyTurn) : '<p>Jogador local nao encontrado.</p>'}
        <div class="actions">
          <button id="startGame" ${room.status !== 'lobby' ? 'disabled' : ''}>Iniciar combate</button>
          <button id="endTurn" ${!isMyTurn || room.status !== 'battle' ? 'disabled' : ''}>Encerrar turno</button>
          <button id="leaveRoom" class="secondary">Sair da sala</button>
        </div>
      </aside>

      <section class="card board-wrap">
        <h2>Mapa</h2>
        <div class="board" style="--cols: ${MAP_WIDTH}; --rows: ${MAP_HEIGHT};">
          ${renderBoard(room)}
        </div>
        <p class="hint">No seu turno, clique em um quadrado vazio dentro do alcance de movimento.</p>
      </section>

      <aside class="card panel">
        <h2>Jogadores</h2>
        <div class="players">${renderPlayers(room)}</div>
        <h2>Log</h2>
        <ol class="log">${(room.log ?? []).map((entry) => `<li>${escapeHtml(entry)}</li>`).join('')}</ol>
      </aside>
    </section>
  `;
}

function renderPlayerCard(player, isMyTurn) {
  return `
    <div class="player-card ${isMyTurn ? 'active' : ''}">
      <div class="avatar">${player.icon}</div>
      <div>
        <strong>${escapeHtml(player.name)}</strong>
        <span>${escapeHtml(player.classId)}</span>
        <span>HP ${player.hp}/${player.maxHp} | MOV ${player.movement} | ATQ ${player.attack}</span>
        <span>${isMyTurn ? 'Seu turno' : 'Aguardando turno'}</span>
      </div>
    </div>
  `;
}

function renderBoard(room) {
  const players = Object.values(room.players ?? {});
  let html = '';

  for (let y = 0; y < MAP_HEIGHT; y += 1) {
    for (let x = 0; x < MAP_WIDTH; x += 1) {
      const player = players.find((candidate) => candidate.x === x && candidate.y === y);
      const isMe = player?.id === session.playerId;
      html += `
        <button class="tile ${player ? 'occupied' : ''} ${isMe ? 'me' : ''}" data-x="${x}" data-y="${y}">
          ${player ? `<span>${player.icon}</span><small>${escapeHtml(player.name)}</small>` : ''}
        </button>
      `;
    }
  }

  return html;
}

function renderPlayers(room) {
  return Object.values(room.players ?? {})
    .map((player) => renderPlayerCard(player, room.currentTurnPlayerId === player.id))
    .join('');
}

function bindEvents() {
  document.querySelector('#playOnline')?.addEventListener('click', () => {
    session.mode = 'online';
    session.screen = 'character';
    render();
  });

  document.querySelector('#playSolo')?.addEventListener('click', () => {
    alert('Modo solo ainda nao foi liberado. Primeiro vamos firmar o online.');
  });

  document.querySelector('#backToMenu')?.addEventListener('click', () => {
    session.screen = 'start';
    render();
  });

  document.querySelector('#joinRoom')?.addEventListener('click', handleJoinRoom);
  document.querySelector('#leaveRoom')?.addEventListener('click', handleLeaveRoom);
  document.querySelector('#startGame')?.addEventListener('click', handleStartGame);
  document.querySelector('#endTurn')?.addEventListener('click', handleEndTurn);

  document.querySelectorAll('.class-card').forEach((card) => {
    card.addEventListener('click', () => {
      session.classId = card.dataset.classId;
      localStorage.setItem('oraculo.classId', session.classId);
      render();
    });
  });

  document.querySelectorAll('.tile').forEach((tile) => {
    tile.addEventListener('click', () => {
      handleMove(Number(tile.dataset.x), Number(tile.dataset.y));
    });
  });
}

function startHomeCanvas() {
  const canvas = document.querySelector('#home-canvas');
  if (!canvas || homeParticlesStarted) return;

  const ctx = canvas.getContext('2d');
  const particles = Array.from({ length: 72 }, () => createParticle(canvas));
  homeParticlesStarted = true;

  function resize() {
    const rect = canvas.getBoundingClientRect();
    canvas.width = Math.max(1, Math.floor(rect.width * window.devicePixelRatio));
    canvas.height = Math.max(1, Math.floor(rect.height * window.devicePixelRatio));
    ctx.setTransform(window.devicePixelRatio, 0, 0, window.devicePixelRatio, 0, 0);
  }

  function draw() {
    if (!document.querySelector('#home-canvas')) {
      stopHomeCanvas();
      return;
    }

    const width = canvas.clientWidth;
    const height = canvas.clientHeight;
    ctx.clearRect(0, 0, width, height);

    particles.forEach((particle) => {
      particle.x += particle.vx;
      particle.y += particle.vy;
      particle.life += particle.speed;

      if (particle.x < -20 || particle.x > width + 20 || particle.y < -20 || particle.y > height + 20) {
        Object.assign(particle, createParticle(canvas));
        particle.y = height + Math.random() * 40;
      }

      const pulse = 0.35 + Math.sin(particle.life) * 0.35;
      ctx.beginPath();
      ctx.fillStyle = `rgba(122, 192, 240, ${0.12 + pulse * 0.55})`;
      ctx.shadowColor = 'rgba(122, 192, 240, .85)';
      ctx.shadowBlur = 16 + pulse * 14;
      ctx.arc(particle.x, particle.y, particle.size + pulse * 1.5, 0, Math.PI * 2);
      ctx.fill();
      ctx.shadowBlur = 0;
    });

    homeAnimationFrame = requestAnimationFrame(draw);
  }

  resize();
  window.addEventListener('resize', resize, { passive: true });
  draw();
}

function stopHomeCanvas() {
  if (homeAnimationFrame) cancelAnimationFrame(homeAnimationFrame);
  homeAnimationFrame = null;
  homeParticlesStarted = false;
}

function createParticle(canvas) {
  const width = canvas.clientWidth || window.innerWidth;
  const height = canvas.clientHeight || window.innerHeight;
  return {
    x: Math.random() * width,
    y: Math.random() * height,
    vx: (Math.random() - 0.5) * 0.18,
    vy: -0.15 - Math.random() * 0.45,
    size: 1 + Math.random() * 2.2,
    speed: 0.025 + Math.random() * 0.04,
    life: Math.random() * Math.PI * 2,
  };
}

async function handleJoinRoom() {
  const roomId = document.querySelector('#roomId').value.trim();
  const playerName = document.querySelector('#playerName').value.trim();
  const classId = document.querySelector('#classId').value;

  if (!roomId) {
    alert('Coloque um codigo de sala.');
    return;
  }

  session.roomId = roomId;
  session.playerName = playerName || 'Viajante';
  session.classId = classId;

  localStorage.setItem('oraculo.roomId', session.roomId);
  localStorage.setItem('oraculo.playerName', session.playerName);
  localStorage.setItem('oraculo.classId', session.classId);

  try {
    await joinRoom(session.roomId, session.playerId, session.playerName, session.classId);
    session.unsubscribe?.();
    session.unsubscribe = listenRoom(session.roomId, (room) => {
      session.room = room;
      render();
    });
  } catch (err) {
    alert(`Erro ao entrar na sala: ${err.message}`);
    console.error(err);
  }
}

function handleLeaveRoom() {
  session.unsubscribe?.();
  session.unsubscribe = null;
  session.room = null;
  session.screen = 'start';
  render();
}

async function handleStartGame() {
  const result = startGame(session.room);
  if (result.error) {
    alert(result.error);
    return;
  }
  try {
    await saveRoom(result.room);
  } catch (err) {
    alert(`Erro ao iniciar jogo: ${err.message}`);
    console.error(err);
  }
}

async function handleEndTurn() {
  const result = endTurn(session.room, session.playerId);
  if (result.error) {
    alert(result.error);
    return;
  }
  try {
    await saveRoom(result.room);
  } catch (err) {
    alert(`Erro ao encerrar turno: ${err.message}`);
    console.error(err);
  }
}

async function handleMove(x, y) {
  if (!session.room || session.room.status !== 'battle') return;

  const result = movePlayer(session.room, session.playerId, x, y);
  if (result.error) {
    alert(result.error);
    return;
  }
  try {
    await saveRoom(result.room);
  } catch (err) {
    alert(`Erro ao mover: ${err.message}`);
    console.error(err);
  }
}

function escapeHtml(value) {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');
}

render();