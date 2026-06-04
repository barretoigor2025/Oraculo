export const CLASSES = {
  guerreiro: {
    id: 'guerreiro', name: 'Guerreiro', icon: '⚔️',
    STR: 16, DEX: 14, CON: 15, INT: 10, WIS: 10, CHA: 10,
    dado_vida: 10, ca_armor: 5, fort_base: 2, ref_base: 0, will_base: 0,
    attack: 4, movement: 4,
    descricao: 'Combatente versátil. Usa qualquer arma ou armadura. Superior no corpo a corpo.',
    habilidade: { nome: 'Ataque Extra', icon: '⚔️', desc: 'Uma vez por combate, faz dois ataques em um único turno.' },
    poderes: [
      { nome: 'Ataque Extra', icon: '⚔️', desc: 'Uma vez por combate, faz dois ataques em um único turno. Declare antes de rolar.' },
      { nome: 'Golpe Poderoso', icon: '💥', desc: '-2 no ataque, +4 no dano. Declare antes de rolar. Ideal contra armaduras leves.' },
      { nome: 'Postura de Defesa', icon: '🛡️', desc: '+2 CA durante 1 rodada. Não pode atacar no mesmo turno em que ativa.' },
      { nome: 'Segundo Fôlego', icon: '❤️', desc: '1× por dia: recupera 1d6+CON PV como ação livre. Não interrompe combate.' },
    ],
  },
  mago: {
    id: 'mago', name: 'Mago', icon: '🔮',
    STR: 8, DEX: 12, CON: 10, INT: 17, WIS: 13, CHA: 12,
    dado_vida: 4, ca_armor: 0, fort_base: 0, ref_base: 0, will_base: 2,
    attack: 5, movement: 3,
    descricao: 'Arquimago em formação. Magias devastadoras — mas fisicamente frágil.',
    habilidade: { nome: 'Grimório', icon: '📖', desc: 'Escolhe 3 magias arcanas ao criar o personagem. Pode identificar itens e criaturas mágicas.' },
    poderes_pool: [
      { id: 'missil', nome: 'Míssil Mágico', icon: '✨', desc: '1d4+1 de dano arcano infalível. Não pode ser desviado ou bloqueado por escudo.' },
      { id: 'sono', nome: 'Sono', icon: '💤', desc: 'Adormece até 2 inimigos com menos de 10 PV por 3 rodadas. Não afeta mortos-vivos.' },
      { id: 'bola_fogo', nome: 'Bola de Fogo', icon: '🔥', desc: '2d6 de dano de fogo em área de 5m. Atenção: afeta aliados no alcance.' },
      { id: 'raio_gelo', nome: 'Raio de Gelo', icon: '🧊', desc: '1d6 de dano e alvo fica lento (movimento -3m) por 1 rodada. CD Fortitude 12.' },
      { id: 'escudo', nome: 'Escudo Arcano', icon: '🛡️', desc: '+4 CA por 2 rodadas. Anula automaticamente Mísseis Mágicos inimigos.' },
      { id: 'detectar', nome: 'Detectar Magia', icon: '🔍', desc: 'Revela auras mágicas, itens encantados e criaturas sobrenaturais em 20m.' },
      { id: 'identificar', nome: 'Identificar', icon: '📖', desc: 'Descobre propriedades ocultas de itens mágicos. Requer 10 min de ritual.' },
      { id: 'confusao', nome: 'Confusão', icon: '🌪️', desc: 'Alvo testa Vontade CD 13 ou perde 1 ação inteira por rodada. Dura 2 rodadas.' },
    ],
    poderes_qtd: 3,
    poderes: [],
  },
  ladino: {
    id: 'ladino', name: 'Ladino', icon: '🗡️',
    STR: 10, DEX: 17, CON: 11, INT: 13, WIS: 10, CHA: 13,
    dado_vida: 6, ca_armor: 2, fort_base: 0, ref_base: 2, will_base: 0,
    attack: 3, movement: 6,
    descricao: 'Especialista furtivo. Ataca na sombra para dano máximo e some antes da reação.',
    habilidade: { nome: 'Ataque Furtivo', icon: '🗡️', desc: 'Causa dano duplo ao atacar por surpresa ou flanqueando inimigo.' },
    poderes: [
      { nome: 'Ataque Furtivo', icon: '🗡️', desc: 'Dano duplo ao atacar de surpresa ou flanqueando. Exige que o alvo não perceba ou esteja distraído.' },
      { nome: 'Gatuno', icon: '🖐️', desc: 'Furta objetos de alvos próximos e distraídos. Teste DES CD 12. Detectado em falha crítica.' },
      { nome: 'Arrombar', icon: '🔓', desc: 'Abre fechaduras, desativa armadilhas e força mecanismos usando ferramentas de ladrão.' },
      { nome: 'Desaparecer', icon: '🌑', desc: '1× por combate: some nas sombras ou na multidão. Inimigos perdem o rastro imediatamente.' },
    ],
  },
  clerigo: {
    id: 'clerigo', name: 'Clérigo', icon: '✨',
    STR: 12, DEX: 10, CON: 12, INT: 12, WIS: 16, CHA: 13,
    dado_vida: 8, ca_armor: 5, fort_base: 0, ref_base: 0, will_base: 2,
    attack: 3, movement: 4,
    descricao: 'Sacerdote guerreiro. Cura aliados e confronta mortos-vivos com poder divino.',
    habilidade: { nome: 'Canalizar Divindade', icon: '✨', desc: 'Cura 1d6+SAB aliado adjacente ou repele mortos-vivos em 10m.' },
    poderes: [
      { nome: 'Curar Ferimentos', icon: '❤️‍🩹', desc: 'Restaura 1d6+SAB PV em aliado tocado. 3 usos por dia. Não funciona em mortos-vivos.' },
      { nome: 'Canalizar Divindade', icon: '✨', desc: 'Cura 1d6+SAB aliado adjacente OU repele todos os mortos-vivos em 10m por 2 rodadas.' },
      { nome: 'Bênção', icon: '🙏', desc: '+1 em rolagens de ataque e dano para todos os aliados em 10m. Dura 3 rodadas.' },
      { nome: 'Luz Sagrada', icon: '☀️', desc: 'Ilumina 10m por 1 hora. Mortos-vivos no alcance ficam cegos por 1 rodada (Vontade CD 13).' },
    ],
  },
  barbaro: {
    id: 'barbaro', name: 'Bárbaro', icon: '🪓',
    STR: 18, DEX: 12, CON: 16, INT: 8, WIS: 9, CHA: 8,
    dado_vida: 12, ca_armor: 3, fort_base: 2, ref_base: 2, will_base: 0,
    attack: 5, movement: 5,
    descricao: 'Força bruta da natureza. Em fúria, torna-se quase imparável.',
    habilidade: { nome: 'Fúria', icon: '🔥', desc: 'FOR +4 e resistência a dano físico por 3 rodadas. 1 uso por combate.' },
    poderes: [
      { nome: 'Fúria', icon: '🔥', desc: 'FOR +4 e reduz 2 de dano físico recebido por 3 rodadas. 1 uso por combate. Não pode ser interrompido.' },
      { nome: 'Pele Grossa', icon: '🪨', desc: 'Passivo: reduz 1 de dano físico recebido de qualquer fonte (empilha com Fúria).' },
      { nome: 'Movimento Acelerado', icon: '💨', desc: 'Passivo: +3m de deslocamento. Pode realizar Esforço em terreno difícil sem penalidade.' },
      { nome: 'Instinto Primal', icon: '👁️', desc: 'Passivo: nunca é surpreendido. Sempre age na primeira rodada, mesmo em emboscadas.' },
    ],
  },
  arqueiro: {
    id: 'arqueiro', name: 'Arqueiro', icon: '🏹',
    STR: 12, DEX: 16, CON: 13, INT: 11, WIS: 13, CHA: 10,
    dado_vida: 8, ca_armor: 4, fort_base: 0, ref_base: 2, will_base: 0,
    attack: 4, movement: 4,
    descricao: 'Rastreador preciso. Abate inimigos à distância antes de serem vistos.',
    habilidade: { nome: 'Tiro Certeiro', icon: '🎯', desc: 'Ignora metade da cobertura. +2 de ataque a alvos acima de 10m.' },
    poderes: [
      { nome: 'Tiro Certeiro', icon: '🎯', desc: 'Ignora cobertura parcial. +2 de ataque contra alvos a mais de 10m de distância.' },
      { nome: 'Flecha de Penetração', icon: '➡️', desc: 'A flecha atravessa cobertura leve e causa +2 de dano contra armaduras pesadas.' },
      { nome: 'Tiro Duplo', icon: '🏹', desc: 'Dispara duas flechas em uma única ação. O segundo tiro sofre -2 de ataque.' },
      { nome: 'Rastrear', icon: '🌿', desc: 'Segue rastros em qualquer terreno. +2 em testes de Percepção e Sobrevivência ao ar livre.' },
    ],
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
