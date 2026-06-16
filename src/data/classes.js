export const CLASSES = {
  guerreiro: {
    id: 'guerreiro', name: 'Guerreiro', icon: '⚔️', color: '#8a4a20',
    maxHp: 12, sp: 80, movement: 5, attack: 4,
    attrs: { STR: 16, DEX: 12, CON: 15, INT: 10, WIS: 10, CHA: 10 },
    feat: 'Especialista em combate corpo a corpo. Bônus extra de ataque.',
    habs: [
      { icon: '⚔️', nome: 'Espadada',         desc: 'Golpe com espada',          dano: '1d8+2', tipo: 'melee', sp: 0  },
      { icon: '💥', nome: 'Golpe Poderoso',    desc: 'Concentra força — +4 dano', dano: '1d8+6', tipo: 'melee', sp: 15 },
      { icon: '🛡️', nome: 'Postura de Defesa', desc: 'CA +3 até próximo turno',   dano: '—',     tipo: 'buff',  sp: 0  },
    ],
  },
  mago: {
    id: 'mago', name: 'Mago', icon: '🔮', color: '#3a2a6a',
    maxHp: 6, sp: 120, movement: 4, attack: 5,
    attrs: { STR: 8, DEX: 14, CON: 10, INT: 17, WIS: 12, CHA: 12 },
    feat: 'Conjurador arcano. Maior poder de ataque, mas frágil.',
    habs: [
      { icon: '🪄', nome: 'Cajadada',      desc: 'Golpe com o cajado',        dano: '1d4+1', tipo: 'melee', sp: 0  },
      { icon: '🔥', nome: 'Bola de Fogo',  desc: 'Explosão de fogo — área 2', dano: '2d6+2', tipo: 'magia', sp: 20 },
      { icon: '🌀', nome: 'Confusão',      desc: 'Magia mental — área 1',     dano: '1d6+2', tipo: 'magia', sp: 15 },
      { icon: '🛡️', nome: 'Escudo Arcano', desc: 'Escudo mágico (self-cast)', dano: '—',     tipo: 'buff',  sp: 10 },
    ],
  },
  ladino: {
    id: 'ladino', name: 'Ladino', icon: '🗡️', color: '#0f2448',
    maxHp: 8, sp: 90, movement: 6, attack: 3,
    attrs: { STR: 12, DEX: 17, CON: 12, INT: 12, WIS: 11, CHA: 12 },
    feat: 'Ágil e furtivo. Maior alcance de movimento por turno.',
    habs: [
      { icon: '🗡️', nome: 'Facada',         desc: 'Golpe rápido',          dano: '1d6+2', tipo: 'melee', sp: 0  },
      { icon: '🌑', nome: 'Ataque Furtivo', desc: 'Nas sombras — dano x2', dano: '2d6+2', tipo: 'melee', sp: 10 },
    ],
  },
  clerigo: {
    id: 'clerigo', name: 'Clérigo', icon: '✨', color: '#4a3a10',
    maxHp: 10, sp: 100, movement: 4, attack: 3,
    attrs: { STR: 13, DEX: 11, CON: 14, INT: 10, WIS: 16, CHA: 13 },
    feat: 'Guardião divino. Resistência elevada e suporte ao grupo.',
    habs: [
      { icon: '✨', nome: 'Cajado',           desc: 'Golpe sagrado',  dano: '1d6+1', tipo: 'melee', sp: 0  },
      { icon: '💚', nome: 'Curar Ferimentos', desc: 'Cura 1d8+2 HP', dano: '1d8+2', tipo: 'cura',  sp: 20 },
    ],
  },
  barbaro: {
    id: 'barbaro', name: 'Bárbaro', icon: '🪓', color: '#6a1a1a',
    maxHp: 14, sp: 60, movement: 5, attack: 4,
    attrs: { STR: 18, DEX: 14, CON: 16, INT: 8, WIS: 10, CHA: 8 },
    feat: 'Força bruta e resistência. Maior PV de todas as classes.',
    habs: [
      { icon: '🪓', nome: 'Golpe',            desc: 'Ataque corpo a corpo',     dano: '1d8+3', tipo: 'melee', sp: 0  },
      { icon: '💢', nome: 'Golpe Devastador', desc: 'Golpe pesado — dano duplo', dano: '2d6+4', tipo: 'melee', sp: 20 },
      { icon: '🔥', nome: 'Fúria',            desc: 'Entra em fúria (+dano)',   dano: '—',     tipo: 'buff',  sp: 0  },
    ],
  },
  arqueiro: {
    id: 'arqueiro', name: 'Arqueiro', icon: '🏹', color: '#2a4a2a',
    maxHp: 9, sp: 85, movement: 5, attack: 4,
    attrs: { STR: 13, DEX: 16, CON: 12, INT: 12, WIS: 13, CHA: 10 },
    feat: 'Combatente à distância. Precisão e velocidade equilibradas.',
    habs: [
      { icon: '🏹', nome: 'Flecha',       desc: 'Flecha rápida e precisa',       dano: '1d8+2', tipo: 'projétil', sp: 0  },
      { icon: '🎯', nome: 'Tiro Preciso', desc: 'Foco total — ignora cobertura', dano: '1d8+5', tipo: 'projétil', sp: 15 },
    ],
  },
};

export const PERICIAS = {
  atletismo:    { nome: 'Atletismo',    attr: 'STR', icon: '💪', desc: '+2 escalada, natação e saltos' },
  furtividade:  { nome: 'Furtividade',  attr: 'DEX', icon: '🌑', desc: '+2 mover-se sem ser detectado' },
  acrobacia:    { nome: 'Acrobacia',    attr: 'DEX', icon: '🤸', desc: '+2 equilíbrio e manobras em combate' },
  arcana:       { nome: 'Arcana',       attr: 'INT', icon: '📚', desc: '+2 identificar magia e criaturas arcanas' },
  medicina:     { nome: 'Medicina',     attr: 'WIS', icon: '⚕️', desc: '+2 estabilizar feridos e tratar doenças' },
  percepcao:    { nome: 'Percepção',    attr: 'WIS', icon: '👁️', desc: '+2 notar detalhes ocultos e emboscadas' },
  persuasao:    { nome: 'Persuasão',    attr: 'CHA', icon: '💬', desc: '+2 convencer e negociar com NPCs' },
  sobrevivencia:{ nome: 'Sobrevivência',attr: 'WIS', icon: '🌿', desc: '+2 rastrear, caçar e orientar-se na natureza' },
};

export const CLASS_COLORS = {
  guerreiro: '#8a4a20', mago: '#3a2a6a', ladino: '#0f2448',
  clerigo: '#4a3a10', barbaro: '#6a1a1a', arqueiro: '#2a4a2a',
};

const _REV_STANDEE = {
  mago_f: '_r', arqueiro_f: '_r', guerreiro_m: '_r',
  clerigo_m: '_r', clerigo_f: '_r2', ladino_m: '_r3', ladino_f: '_r3',
};

export function standeeUrl(classId, gender) {
  const rev = _REV_STANDEE[classId + '_' + gender] || '';
  return `catalogo/mhoried/classes/${classId}/peca_tabuleiro/${classId}_${gender}${rev}_peca.png`;
}

export function getClassById(classId) {
  return CLASSES[classId] ?? CLASSES.guerreiro;
}

export function getModifier(value) {
  return Math.floor((value - 10) / 2);
}

export function formatModifier(value) {
  const modifier = getModifier(value);
  return modifier >= 0 ? `+${modifier}` : `${modifier}`;
}

export function getDerivedStats(playerClass) {
  const a = playerClass.attrs ?? {};
  const conMod = getModifier(a.CON ?? 10);
  const dexMod = getModifier(a.DEX ?? 10);
  const wisMod = getModifier(a.WIS ?? 10);
  return {
    hp: playerClass.maxHp ?? Math.max(1, 8 + conMod),
    ac: 10 + dexMod,
    init: dexMod,
    fort: conMod,
    ref: dexMod,
    will: wisMod,
    mana: 0,
    maxMana: 0,
    stamina: 0,
    maxStamina: 0,
  };
}
