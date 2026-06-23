// public/catalogo/fantasma/narracao.js
// Dados de narração da Campanha Fantasma (placeholder — conteúdo a ser definido)

export const NARRACAO_NPCS = [
  { id:'f_npc_1', nome:'Personagem 1', avatar:'👻', img:'', tipo:'standee', zBase:5, offsetPx:0,
    cenas:['cena_a'], personalidade:'A ser definida.', conhecimentos:'', formaDeFalar:'', reatividade:0,
    abertura:'', aberturaFallback:'[ACAO: Silêncio.] ...', placeholder:true },
];

export const NARRACAO_CENAS = {
  cena_a: { bg: '', titulo: 'Cena a definir' },
};

export const NARRACAO_FLUXO = [
  { id:'cena_a', proximo:null },
];
