export function getPlayerOrder(room) {
  return Object.values(room.players ?? {}).sort((a, b) => a.joinedAt - b.joinedAt);
}

export function startGame(room) {
  const players = getPlayerOrder(room);
  if (players.length === 0) {
    return { room, error: 'Nao ha jogadores na sala.' };
  }

  const nextRoom = structuredClone(room);
  nextRoom.status = 'battle';
  nextRoom.currentTurnPlayerId = players[0].id;
  nextRoom.turnNumber = 1;
  nextRoom.updatedAt = Date.now();
  nextRoom.log = [
    `Combate iniciado. Turno de ${players[0].name}.`,
    ...(room.log ?? []),
  ].slice(0, 20);

  return { room: nextRoom, error: null };
}

export function endTurn(room, playerId) {
  if (room.currentTurnPlayerId !== playerId) {
    return { room, error: 'Somente o jogador do turno pode encerrar.' };
  }

  const players = getPlayerOrder(room);
  const currentIndex = players.findIndex((player) => player.id === playerId);
  const nextIndex = (currentIndex + 1) % players.length;
  const nextPlayer = players[nextIndex];
  const nextRoom = structuredClone(room);

  nextRoom.players[playerId] = {
    ...nextRoom.players[playerId],
    hasMoved: false,
    hasActed: false,
  };

  nextRoom.currentTurnPlayerId = nextPlayer.id;
  nextRoom.turnNumber = (room.turnNumber ?? 0) + 1;
  nextRoom.updatedAt = Date.now();
  nextRoom.log = [
    `Turno encerrado. Agora e a vez de ${nextPlayer.name}.`,
    ...(room.log ?? []),
  ].slice(0, 20);

  return { room: nextRoom, error: null };
}
