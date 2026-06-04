import { getClassById, getDerivedStats } from '../data/classes.js';

export const MAP_WIDTH = 12;
export const MAP_HEIGHT = 9;

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

export function createPlayer(playerId, character) {
  const playerClass = getClassById(character?.classId || character?.classe || 'guerreiro');
  const derived = getDerivedStats(playerClass);
  const gender = character?.gender || character?.sexo || 'm';

  return {
    id: playerId,
    name: character?.name || character?.nome || 'Viajante',
    classId: playerClass.id,
    gender,
    icon: playerClass.icon,
    hp: character?.hp ?? derived.hp,
    maxHp: character?.maxHp ?? character?.maxHp ?? derived.hp,
    mana: character?.mana ?? derived.mana,
    maxMana: character?.maxMana ?? derived.maxMana,
    stamina: character?.stamina ?? derived.stamina,
    maxStamina: character?.maxStamina ?? derived.maxStamina,
    attack: playerClass.attack,
    movement: playerClass.movement,
    armorClass: character?.armorClass ?? character?.ac ?? derived.ac,
    init: character?.init ?? derived.init,
    fort: character?.fort ?? derived.fort,
    ref: character?.ref ?? derived.ref,
    will: character?.will ?? derived.will,
    pericias: character?.pericias ?? [],
    poderesEscolhidos: character?.poderesEscolhidos ?? character?.poderes_escolhidos ?? [],
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
  const startPositions = [
    { x: 4, y: 7 },
    { x: 5, y: 7 },
    { x: 6, y: 7 },
    { x: 7, y: 7 },
  ];
  const start = startPositions[playersCount] ?? {
    x: playersCount % MAP_WIDTH,
    y: Math.floor(playersCount / MAP_WIDTH),
  };

  return {
    ...player,
    x: start.x,
    y: start.y,
  };
}
