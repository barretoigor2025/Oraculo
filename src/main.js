import './styles.css';
import { CLASSES } from './data/classes.js';
import { MAP_HEIGHT, MAP_WIDTH } from './game/state.js';
import { movePlayer } from './game/movementSystem.js';
import { endTurn, startGame } from './game/turnSystem.js';
import { joinRoom, listenRoom, saveRoom } from './firebase/roomService.js';

const app = document.querySelector('#app');

const session = {
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
      ${session.room ? renderGame() : renderLobby()}
    </main>
  `;

  bindEvents();
}

function renderLobby() {
  const classCards = Object.values(CLASSES)
    .map((klass) => renderClassCard(klass))
    .join('');

  return `
    <section class="entrance-screen">
      <div class="entrance-bg entrance-bg-left"></div>
      <div class="entrance-bg entrance-bg-right"></div>

      <section class="title-panel">
        <p class="eyebrow">Campanha online</p>
        <div class="sigil" aria-hidden="true">◈</div>
        <h1>Oráculo</h1>
        <p class="subtitle">Entre no salão de pedra, escolha seu destino e reúna a mesa antes que a névoa atravesse os portões.</p>
        <div class="lore-box">
          <strong>Base reconstruída</strong>
          <span>Firebase, salas em tempo real e combate por turnos. Primeiro a fundação. Depois o mundo respira.</span>
        </div>
      </section>

      <section class="entry-card">
        <div class="entry-card-header">
          <span class="rune">✦</span>
          <div>
            <h2>Entrar no Oráculo</h2>
            <p>Crie uma sala ou entre com o mesmo código dos outros jogadores.</p>
          </div>
        </div>

        <div class="form-grid">
          <label>
            Nome do viajante
            <input id="playerName" value="${escapeHtml(session.playerName)}" placeholder="Ex: Igor" />
          </label>
          <label>
            Código da sala
            <input id="roomId" value="${escapeHtml(session.roomId)}" placeholder="Ex: castelo01" />
          </label>
        </div>

        <div class="class-section">
          <div class="section-title">
            <span>Escolha sua classe</span>
            <small>A classe define vida, movimento e ataque inicial.</small>
          </div>
          <input type="hidden" id="classId" value="${escapeHtml(session.classId)}" />
          <div class="class-grid">${classCards}</div>
        </div>

        <button id="joinRoom" class="main-cta">Abrir os portões</button>
        <p class="hint center">Para testar multiplayer, abra o mesmo link em outro celular/aba e use o mesmo código de sala.</p>
      </section>
    </section>
  `;
}

function renderClassCard(klass) {
  const isSelected = session.classId === klass.id;
  const descriptions = {
    barbaro: 'Avança na linha de frente e aguenta pancada sem pedir licença.',
    ladino: 'Rápido, leve e perfeito para cruzar o mapa antes dos outros.',
    mago: 'Frágil no corpo, perigoso quando a magia começa a falar.',
  };

  return `
    <button class="class-card ${isSelected ? 'selected' : ''}" data-class-id="${klass.id}" type="button">
      <span class="class-icon">${klass.icon}</span>
      <strong>${klass.name}</strong>
      <small>${descriptions[klass.id] ?? 'Classe inicial do Oráculo.'}</small>
      <span class="stats">HP ${klass.maxHp} · MOV ${klass.movement} · ATQ ${klass.attack}</span>
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