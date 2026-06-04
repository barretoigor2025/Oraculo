import { MAP_HEIGHT, MAP_WIDTH } from './state.js';

export function canMovePlayer(room, playerId, targetX, targetY) {
  const player = room.players?.[playerId];

  if (!player) return { ok: false, reason: 'Jogador nao encontrado.' };
  if (room.currentTurnPlayerId !== playerId) return { ok: false, reason: 'Nao e seu turno.' };
  if (player.hasMoved) return { ok: false, reason: 'Voce ja se moveu neste turno.' };
  if (targetX < 0 || targetY < 0 || targetX >= MAP_WIDTH || targetY >= MAP_HEIGHT) {
    return { ok: false, reason: 'Destino fora do mapa.' };
  }

  const distance = Math.abs(player.x - targetX) + Math.abs(player.y - targetY);
  if (distance > player.movement) {
    return { ok: false, reason: `Muito longe. Movimento maximo: ${player.movement}.` };
  }

  const occupied = Object.values(room.players ?? {}).some(
    (otherPlayer) => otherPlayer.id !== playerId && otherPlayer.x === targetX && otherPlayer.y === targetY,
  );

  if (occupied) return { ok: false, reason: 'Esse quadrado ja esta ocupado.' };

  return { ok: true };
}

export function movePlayer(room, playerId, targetX, targetY) {
  const check = canMovePlayer(room, playerId, targetX, targetY);
  if (!check.ok) return { room, error: check.reason };

  const player = room.players[playerId];
  const nextRoom = structuredClone(room);

  nextRoom.players[playerId] = {
    ...player,
    x: targetX,
    y: targetY,
    hasMoved: true,
  };
  nextRoom.updatedAt = Date.now();
  nextRoom.log = [
    `${player.name} moveu para (${targetX + 1}, ${targetY + 1}).`,
    ...(room.log ?? []),
  ].slice(0, 20);

  return { room: nextRoom, error: null };
}
