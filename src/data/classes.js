export const CLASSES = {
  guerreiro: {
    id: 'guerreiro', name: 'Guerreiro', icon: '⚔️',
    maxHp: 12, movement: 5, attack: 4,
    attrs: { STR: 16, DEX: 12, CON: 15, INT: 10, WIS: 10, CHA: 10 },
    feat: 'Especialista em combate corpo a corpo. Bônus extra de ataque.',
  },
  mago: {
    id: 'mago', name: 'Mago', icon: '🔮',
    maxHp: 6, movement: 4, attack: 5,
    attrs: { STR: 8, DEX: 14, CON: 10, INT: 17, WIS: 12, CHA: 12 },
    feat: 'Conjurador arcano. Maior poder de ataque, mas frágil.',
  },
  ladino: {
    id: 'ladino', name: 'Ladino', icon: '🗡️',
    maxHp: 8, movement: 6, attack: 3,
    attrs: { STR: 12, DEX: 17, CON: 12, INT: 12, WIS: 11, CHA: 12 },
    feat: 'Ágil e furtivo. Maior alcance de movimento por turno.',
  },
  clerigo: {
    id: 'clerigo', name: 'Clérigo', icon: '✨',
    maxHp: 10, movement: 4, attack: 3,
    attrs: { STR: 13, DEX: 11, CON: 14, INT: 10, WIS: 16, CHA: 13 },
    feat: 'Guardião divino. Resistência elevada e suporte ao grupo.',
  },
  barbaro: {
    id: 'barbaro', name: 'Bárbaro', icon: '🪓',
    maxHp: 14, movement: 5, attack: 4,
    attrs: { STR: 18, DEX: 14, CON: 16, INT: 8, WIS: 10, CHA: 8 },
    feat: 'Força bruta e resistência. Maior PV de todas as classes.',
  },
  arqueiro: {
    id: 'arqueiro', name: 'Arqueiro', icon: '🏹',
    maxHp: 9, movement: 5, attack: 4,
    attrs: { STR: 13, DEX: 16, CON: 12, INT: 12, WIS: 13, CHA: 10 },
    feat: 'Combatente à distância. Precisão e velocidade equilibradas.',
  },
};

export const PERICIAS = {
  atletismo: { nome: 'Atletismo', attr: 'FOR', icon: '💪', desc: '+2 escalada, natação e saltos' },
  furtividade: { nome: 'Furtividade', attr: 'DES', icon: '🌑', desc: '+2 mover-se sem ser detectado' },
  acrobacia: { nome: 'Acrobacia', attr: 'DES', icon: '🤸', desc: '+2 equilíbrio e manobras em combate' },
  arcana: { nome: 'Arcana', attr: 'INT', icon: '📚', desc: '+2 identificar magia e criaturas arcanas' },
  medicina: { nome: 'Medicina', attr: 'SAB', icon: '⚕️', desc: '+2 estabilizar feridos e tratar doenças' },
  percepcao: { nome: 'Percepção', attr: 'SAB', icon: '👁️', desc: '+2 notar detalhes ocultos e emboscadas' },
  persuasao: { nome: 'Persuasão', attr: 'CAR', icon: '💬', desc: '+2 convencer e negociar com NPCs' },
  sobrevivencia: { nome: 'Sobrevivência', attr: 'SAB', icon: '🌿', desc: '+2 rastrear, caçar e orientar-se na natureza' },
};

export const CLASS_COLORS = {
  guerreiro: '#8a4a20', mago: '#3a2a6a', ladino: '#0f2448',
  clerigo: '#4a3a10', barbaro: '#6a1a1a', arqueiro: '#2a4a2a',
};

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
  const conMod = getModifier(playerClass.CON);
  const dexMod = getModifier(playerClass.DEX);
  const wisMod = getModifier(playerClass.WIS);
  const strMod = getModifier(playerClass.STR);
  const intMod = getModifier(playerClass.INT);
  const hasMana = playerClass.will_base >= 2;
  const maxMana = hasMana ? Math.max(3, Math.max(intMod, wisMod) + 2) : 0;
  const maxStamina = !hasMana ? Math.max(3, Math.max(strMod, dexMod) + 2) : 0;
  return {
    hp: Math.max(1, playerClass.dado_vida + conMod),
    ac: 10 + dexMod + playerClass.ca_armor,
    init: dexMod,
    fort: conMod + playerClass.fort_base,
    ref: dexMod + playerClass.ref_base,
    will: wisMod + playerClass.will_base,
    mana: maxMana,
    maxMana,
    stamina: maxStamina,
    maxStamina,
  };
}
