export const MAPA_IMG='catalogo/kagehama/mapa/mapa_kagehama.svg';
export const NOS={
  "kagehama-scene-0": {
    "titulo": "Ponte das Sete Lanternas",
    "subtitulo": "PRÓLOGO",
    "x": 15,
    "y": 76,
    "icon": "⛩",
    "estadoInicial": "descoberto",
    "desc": "Na Festa das Sete Lanternas, os personagens já estão reunidos no trecho central da ponte quando uma tentativa de roubo interrompe a procissão do armistício."
  },
  "kagehama-scene-1": {
    "titulo": "Capítulo 2 — Três contas queimadas",
    "subtitulo": "Kagehama",
    "x": 29,
    "y": 65,
    "icon": "⛩",
    "estadoInicial": "ouviu_falar",
    "desc": "Sayo leva ao santuário; refugiados somem na floresta e uma trilha cruza esconderijo de Daichi."
  },
  "kagehama-scene-2": {
    "titulo": "Capítulo 3 — O homem sob a água",
    "subtitulo": "Kagehama",
    "x": 41,
    "y": 77,
    "icon": "⛩",
    "estadoInicial": "ouviu_falar",
    "desc": "Nos Arquivos Afogados, o grupo escolhe salvar Jiro, documentos ou a própria segurança."
  },
  "kagehama-scene-3": {
    "titulo": "Capítulo 4 — A caça do cervo negro",
    "subtitulo": "Kagehama",
    "x": 55,
    "y": 56,
    "icon": "⛩",
    "estadoInicial": "desconhecido",
    "desc": "Rastro leva a posto abandonado e soldados mortos após um encontro diplomático falso."
  },
  "kagehama-scene-4": {
    "titulo": "Capítulo 5 — O mensageiro que não chegou",
    "subtitulo": "Kagehama",
    "x": 82,
    "y": 69,
    "icon": "⛩",
    "estadoInicial": "desconhecido",
    "desc": "A aldeia de Sumi perde água por uma ordem verdadeira entregue por portador falso."
  },
  "kagehama-scene-5": {
    "titulo": "Capítulo 6 — Um duelo sem vencedor",
    "subtitulo": "Kagehama",
    "x": 79,
    "y": 47,
    "icon": "⛩",
    "estadoInicial": "desconhecido",
    "desc": "Audiência no Castelo da Cinza; duelo testa contenção e respeito, não exige morte."
  },
  "kagehama-scene-6": {
    "titulo": "Capítulo 7 — A noite da enseada",
    "subtitulo": "Kagehama",
    "x": 87,
    "y": 49,
    "icon": "⛩",
    "estadoInicial": "desconhecido",
    "desc": "Infiltração ou perseguição marítima contra um navio com armas e registros falsos."
  },
  "kagehama-scene-7": {
    "titulo": "Capítulo 8 — A herdeira chamada Nao",
    "subtitulo": "Kagehama",
    "x": 44,
    "y": 38,
    "icon": "⛩",
    "estadoInicial": "desconhecido",
    "desc": "Tomoe revela a matriz do selo; tornar a falsificação pública põe seus soldados em risco."
  },
  "kagehama-scene-8": {
    "titulo": "Capítulo 9 — Traição no santuário",
    "subtitulo": "Kagehama",
    "x": 29,
    "y": 57,
    "icon": "⛩",
    "estadoInicial": "desconhecido",
    "desc": "Um agente entrega o esconderijo de refugiados para tentar salvar a própria família."
  },
  "kagehama-scene-9": {
    "titulo": "Capítulo 10 — A torre de sinal",
    "subtitulo": "Kagehama",
    "x": 35,
    "y": 23,
    "icon": "⛩",
    "estadoInicial": "desconhecido",
    "desc": "Tempestade, patrulhas recrutadas e mensagens cifradas sobre uma guerra planejada."
  },
  "kagehama-scene-10": {
    "titulo": "Capítulo 11 — Conselho em Kagehama",
    "subtitulo": "Kagehama",
    "x": 52,
    "y": 24,
    "icon": "⛩",
    "estadoInicial": "desconhecido",
    "desc": "A prova exige testemunhas, proteção e uma apresentação que sobreviva à política."
  },
  "kagehama-scene-11": {
    "titulo": "Capítulo 12 — O cerco dos canais",
    "subtitulo": "Kagehama",
    "x": 71,
    "y": 34,
    "icon": "⛩",
    "estadoInicial": "desconhecido",
    "desc": "Três frentes simultâneas: comporta, enfermaria e muralha do porto."
  },
  "kagehama-scene-12": {
    "titulo": "Capítulo 13 — O regente e a lâmina",
    "subtitulo": "Kagehama",
    "x": 86,
    "y": 22,
    "icon": "⛩",
    "estadoInicial": "desconhecido",
    "desc": "Kuroda oferece acordo; pode haver rendição, exposição, captura, fuga ou combate."
  }
};
export const CAMINHOS=[
  {
    "de": "kagehama-scene-0",
    "ate": "kagehama-scene-1",
    "perigo": 0,
    "dist": "curta",
    "encontros": []
  },
  {
    "de": "kagehama-scene-0",
    "ate": "kagehama-scene-2",
    "perigo": 0,
    "dist": "curta",
    "encontros": []
  },
  {
    "de": "kagehama-scene-1",
    "ate": "kagehama-scene-3",
    "perigo": 0,
    "dist": "curta",
    "encontros": []
  },
  {
    "de": "kagehama-scene-2",
    "ate": "kagehama-scene-3",
    "perigo": 1,
    "dist": "media",
    "encontros": []
  },
  {
    "de": "kagehama-scene-3",
    "ate": "kagehama-scene-4",
    "perigo": 1,
    "dist": "media",
    "encontros": []
  },
  {
    "de": "kagehama-scene-4",
    "ate": "kagehama-scene-5",
    "perigo": 1,
    "dist": "media",
    "encontros": []
  },
  {
    "de": "kagehama-scene-5",
    "ate": "kagehama-scene-6",
    "perigo": 1,
    "dist": "media",
    "encontros": []
  },
  {
    "de": "kagehama-scene-6",
    "ate": "kagehama-scene-7",
    "perigo": 1,
    "dist": "media",
    "encontros": []
  },
  {
    "de": "kagehama-scene-7",
    "ate": "kagehama-scene-8",
    "perigo": 1,
    "dist": "media",
    "encontros": []
  },
  {
    "de": "kagehama-scene-8",
    "ate": "kagehama-scene-9",
    "perigo": 1,
    "dist": "media",
    "encontros": []
  },
  {
    "de": "kagehama-scene-9",
    "ate": "kagehama-scene-10",
    "perigo": 1,
    "dist": "media",
    "encontros": []
  },
  {
    "de": "kagehama-scene-10",
    "ate": "kagehama-scene-11",
    "perigo": 1,
    "dist": "media",
    "encontros": []
  },
  {
    "de": "kagehama-scene-11",
    "ate": "kagehama-scene-12",
    "perigo": 1,
    "dist": "media",
    "encontros": []
  },
  {
    "de": "kagehama-scene-1",
    "ate": "kagehama-scene-8",
    "perigo": 0,
    "dist": "curta",
    "encontros": []
  },
  {
    "de": "kagehama-scene-3",
    "ate": "kagehama-scene-7",
    "perigo": 1,
    "dist": "media",
    "encontros": []
  },
  {
    "de": "kagehama-scene-5",
    "ate": "kagehama-scene-10",
    "perigo": 1,
    "dist": "media",
    "encontros": []
  }
];
