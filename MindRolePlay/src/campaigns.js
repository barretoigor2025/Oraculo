
import { KAGEHAMA_CAMPAIGN } from './kagehamaCampaign.js';

export const CAMPAIGN_SECTIONS = [
  { id: 'story', label: 'Roteiro', description: 'Premissa, cenas e acontecimentos.' },
  { id: 'classes', label: 'Classes e regras', description: 'Arquétipos e regras próprias desta campanha.' },
  { id: 'characters', label: 'Personagens', description: 'Fichas dos jogadores e condições persistentes.' },
  { id: 'npcs', label: 'NPCs', description: 'Personagens controlados pelo narrador.' },
  { id: 'scenes', label: 'Cenários', description: 'Locais e cenas da campanha.' },
  { id: 'maps', label: 'Mapa geral', description: 'Mapas e referências de localização.' },
  { id: 'travel', label: 'Viagens e rotas', description: 'Deslocamentos como cenas, escolhas e consequências.' },
  { id: 'art', label: 'Arte e recursos', description: 'Imagens e recursos visuais da campanha.' },
  { id: 'evolution', label: 'Evolução', description: 'Pontos de personagem concedidos ao fechar elos narrativos.' },
  { id: 'checklist', label: 'Checklist', description: 'Itens que ainda precisam ser preparados.' },
];

export function createEmptyCampaign(id, title, genre = '') {
  return {
    id,
    schemaVersion: 3,
    analysis: null,
    title,
    genre,
    status: 'installed',
    source: '',
    premise: '',
    story: '',
    classes: [],
    characters: [],
    npcs: [],
    scenes: [],
    maps: [],
    travel: [],
    travelRules: {
      principle: 'A jornada é uma sequência de cenas com escolhas e consequências.',
      track: ['tempo', 'condição', 'recursos', 'exposição', 'vínculos'],
      guidance: 'Apresente rotas e custos; mostre sinais antes dos perigos; pergunte como cada personagem contribui; atualize o mundo na chegada.',
    },
    art: [],
    checklist: [],
    progression: { currency: 'Pontos de personagem', awardCap: 5, criteria: [], rules: 'O narrador registra uma justificativa por marco narrativo.' },
    progressionLog: [],
    testLog: [],
    createdAt: Date.now(),
    updatedAt: Date.now(),
  };
}

export function createDemoCampaigns() {
  return [
    createEmptyCampaign('demo-campanha-1', 'Campanha 1'),
    createEmptyCampaign('demo-campanha-2', 'Campanha 2'),
    createEmptyCampaign('demo-campanha-3', 'Campanha 3'),
    (() => {
      const campaign = structuredClone(KAGEHAMA_CAMPAIGN);
      campaign.classes = campaign.classes.map(cls => ({ ...cls, portraits: { ...cls.portraits }, assetPaths: { ...cls.assetPaths }, portrait: cls.portraits?.male || '', assetPath: cls.assetPaths?.male || '' }));
      return campaign;
    })(),
  ];
}
