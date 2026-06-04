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
    <main class="shell">
      <section class="hero">
        <p class="eyebrow">Nova base</p>
        <h1>Oraculo</h1>
        <p>Reconstrucao limpa do RPG: sala, grid, jogadores, movimento e turno sincronizados no Firebase.</p>
      </section>

      ${session.room ? renderGame() : renderLobby()}
    </main>
  `;

  bindEvents();
}

function renderLobby() {
  const classOptions = Object.values(CLASSES)
    .map(
      (klass) => `
        <option value="${klass.id}" ${session.classId === klass.id ? 'selected' : ''}>
          ${klass.icon} ${klass.name} - HP ${klass.maxHp}, MOV ${klass.movement}, ATQ ${klass.attack}
        </option>
      `,
    )
    .join('');

  return `
    <section class="card lobby">
      <h2>Entrar na sala</h2>
      <label>
        Nome do jogador
        <input id="playerName" value="${escapeHtml(session.playerName)}" placeholder="Ex: Igor" />
      </label>
      <label>
        Codigo da sala
        <input id="roomId" value="${escapeHtml(session.roomId)}" placeholder="Ex: teste01" />
      </label>
      <label>
        Classe
        <select id="classId">${classOptions}</select>
      </label>
      <button id="joinRoom">Entrar / Criar sala</button>
      <p class="hint">Use o mesmo codigo de sala em outro navegador/celular para testar multiplayer.</p>
    </section>
  `;
}

function renderGame() {
  const room = session.room;
  const currentPlayer = room.players?.[session.playerId];
  const turnPlayer = room.players?.[room.currentTurnPlayerId];
  const isMyTurn = room.currentTurnPlayerId === session.playerId;

  return `
    <section class="layout">
      <aside class="card panel">
        <h2>Sala ${room.id}</h2>
        <p>Status: <strong>${room.status}</strong></p>
        <p>Turno: <strong>${turnPlayer ? turnPlayer.name : 'Ainda nao iniciado'}</strong></p>
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
        <span>${player.classId}</span>
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
