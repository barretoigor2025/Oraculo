import { getClassById } from '../data/classes.js';

export const MAP_WIDTH = 8;
export const MAP_HEIGHT = 6;

export function createInitialRoom(roomId) {
  return {
    id: roomId,
    status: 'lobby',
    createdAt: Date.now(),
    updatedAt: Date.now(),
    currentTurnPlayerId: null,
    turnNumber: 0,
    players: {},
    log: ['Sala criada. Aguardando jogadores.'],
  };
}

export function createPlayer(playerId, name, classId) {
  const playerClass = getClassById(classId);

  return {
    id: playerId,
    name: name || 'Viajante',
    classId: playerClass.id,
    icon: playerClass.icon,
    hp: playerClass.maxHp,
    maxHp: playerClass.maxHp,
    attack: playerClass.attack,
    movement: playerClass.movement,
    x: 0,
    y: 0,
    hasMoved: false,
    hasActed: false,
    joinedAt: Date.now(),
  };
}

export function placePlayer(room, player) {
  const playersCount = Object.keys(room.players ?? {}).length;

  return {
    ...player,
    x: playersCount % MAP_WIDTH,
    y: Math.floor(playersCount / MAP_WIDTH),
  };
}
