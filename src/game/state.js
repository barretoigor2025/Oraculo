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

export function createPlayer(playerId, name, classId, gender = 'm') {
  const playerClass = getClassById(classId);

  return {
    id: playerId,
    name: name || 'Viajante',
    classId: playerClass.id,
    gender,
    icon: playerClass.icon,
    hp: playerClass.maxHp,
    maxHp: playerClass.maxHp,
    attack: playerClass.attack,
    movement: playerClass.movement,
    armorClass: playerClass.armorClass,
    fort: playerClass.fort,
    ref: playerClass.ref,
    will: playerClass.will,
    attributes: {
      STR: playerClass.STR,
      DEX: playerClass.DEX,
      CON: playerClass.CON,
      INT: playerClass.INT,
      WIS: playerClass.WIS,
      CHA: playerClass.CHA,
    },
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
