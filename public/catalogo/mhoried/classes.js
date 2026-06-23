export const CLASSES_DATA = {
  guerreiro: {
    nome:'Guerreiro', icon:'⚔️',
    maxHp:12, sp:80, mov:5, atk:4,
    attrs:{FOR:16,DES:12,CON:15,INT:10,SAB:10,CAR:10},
    feat:'Especialista em combate corpo a corpo. Bônus extra de ataque.',
    habs:[
      {icon:'⚔️',nome:'Espadada',desc:'Golpe com espada',dano:'1d8+2',tipo:'melee',sp:0},
      {icon:'💥',nome:'Golpe Poderoso',desc:'Concentra força — +4 dano',dano:'1d8+6',tipo:'melee',sp:15},
      {icon:'🛡️',nome:'Postura de Defesa',desc:'CA +3 até próximo turno',dano:'—',tipo:'buff',sp:0},
    ],
    cor:'#8a4a20',
  },
  mago: {
    nome:'Mago', icon:'🔮',
    maxHp:6, sp:120, mov:4, atk:5,
    attrs:{FOR:8,DES:14,CON:10,INT:17,SAB:12,CAR:12},
    feat:'Conjurador arcano. Maior poder de ataque, mas frágil.',
    habs:[
      {icon:'🪄',nome:'Cajadada',desc:'Golpe com o cajado',dano:'1d4+1',tipo:'melee',sp:0},
      {icon:'🔥',nome:'Bola de Fogo',desc:'Explosão de fogo — área (raio 2)',dano:'2d6+2',tipo:'magia',sp:20},
      {icon:'🌀',nome:'Confusão',desc:'Magia mental — área (raio 1)',dano:'1d6+2',tipo:'magia',sp:15},
      {icon:'🛡️',nome:'Escudo Arcano',desc:'Escudo mágico (self-cast)',dano:'—',tipo:'buff',sp:10},
    ],
    cor:'#3a2a6a',
  },
  ladino: {
    nome:'Ladino', icon:'🗡️',
    maxHp:8, sp:90, mov:6, atk:3,
    attrs:{FOR:12,DES:17,CON:12,INT:12,SAB:11,CAR:12},
    feat:'Ágil e furtivo. Maior alcance de movimento por turno.',
    habs:[
      {icon:'🗡️',nome:'Facada',desc:'Golpe rápido',dano:'1d6+2',tipo:'melee',sp:0},
      {icon:'🌑',nome:'Ataque Furtivo',desc:'Nas sombras — dano x2',dano:'2d6+2',tipo:'melee',sp:10},
    ],
    cor:'#0f2448',
  },
  clerigo: {
    nome:'Clérigo', icon:'✨',
    maxHp:10, sp:100, mov:4, atk:3,
    attrs:{FOR:13,DES:11,CON:14,INT:10,SAB:16,CAR:13},
    feat:'Guardião divino. Resistência elevada e suporte ao grupo.',
    habs:[
      {icon:'✨',nome:'Cajado',desc:'Golpe sagrado',dano:'1d6+1',tipo:'melee',sp:0},
      {icon:'💚',nome:'Curar Ferimentos',desc:'Cura 1d8+2 HP',dano:'1d8+2',tipo:'cura',sp:20},
    ],
    cor:'#4a3a10',
  },
  barbaro: {
    nome:'Bárbaro', icon:'🪓',
    maxHp:14, sp:60, mov:5, atk:4,
    attrs:{FOR:18,DES:14,CON:16,INT:8,SAB:10,CAR:8},
    feat:'Força bruta e resistência. Maior PV de todas as classes.',
    habs:[
      {icon:'🪓',nome:'Golpe',desc:'Ataque corpo a corpo',dano:'1d8+3',tipo:'melee',sp:0},
      {icon:'💢',nome:'Golpe Devastador',desc:'Golpe pesado — dano duplo',dano:'2d6+4',tipo:'melee',sp:20},
      {icon:'🔥',nome:'Fúria',desc:'Entra em fúria (+dano)',dano:'—',tipo:'buff',sp:0},
    ],
    cor:'#6a1a1a',
  },
  arqueiro: {
    nome:'Arqueiro', icon:'🏹',
    maxHp:9, sp:85, mov:5, atk:4,
    attrs:{FOR:13,DES:16,CON:12,INT:12,SAB:13,CAR:10},
    feat:'Combatente à distância. Precisão e velocidade equilibradas.',
    habs:[
      {icon:'🏹',nome:'Flecha',desc:'Flecha rápida e precisa',dano:'1d8+2',tipo:'projétil',sp:0},
      {icon:'🎯',nome:'Tiro Preciso',desc:'Foco total — ignora cobertura',dano:'1d8+5',tipo:'projétil',sp:15},
    ],
    cor:'#2a4a2a',
  },
};
