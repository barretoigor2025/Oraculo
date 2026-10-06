import {
  arrayUnion,
  collection,
  doc,
  getDoc,
  getDocs,
  onSnapshot,
  serverTimestamp,
  setDoc,
  updateDoc,
} from 'firebase/firestore';
import { db, isFirebaseConfigured } from '../../src/firebase/config.js';
import { createDemoCampaigns } from './campaigns.js';

const CAMPAIGNS = 'mindCampaigns';
const ROOMS = 'mindRooms';

function assertReady() {
  if (!isFirebaseConfigured || !db) {
    throw new Error('Firebase do Oráculo não está configurado.');
  }
}

export async function loadCampaigns() {
  assertReady();
  const snapshot = await getDocs(collection(db, CAMPAIGNS));
  return snapshot.docs.map(item => ({ id: item.id, ...item.data() }))
    .sort((a, b) => a.title.localeCompare(b.title, 'pt-BR'));
}

export async function installDemoCampaignsIfEmpty() {
  const existing = await loadCampaigns();
  const existingIds = new Set(existing.map(campaign => campaign.id));
  const missing = createDemoCampaigns().filter(campaign => !existingIds.has(campaign.id));
  if (missing.length) {
    await Promise.all(missing.map(campaign =>
      setDoc(doc(db, CAMPAIGNS, campaign.id), {
        ...campaign,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      })
    ));
  }
  const kagehama = createDemoCampaigns().find(campaign => campaign.id === 'demo-kagehama');
  const savedKagehama = existing.find(campaign => campaign.id === 'demo-kagehama');
  if (kagehama && savedKagehama && Number(savedKagehama.schemaVersion || 1) < 3) {
    const seedIds = new Set(kagehama.checklist.map(item => item.id));
    await setDoc(doc(db, CAMPAIGNS, kagehama.id), {
      ...kagehama, ...savedKagehama, schemaVersion: 3,
      classes: kagehama.classes, art: kagehama.art, progression: kagehama.progression,
      progressionLog: savedKagehama.progressionLog || [],
      checklist: [...kagehama.checklist, ...(savedKagehama.checklist || []).filter(item => !seedIds.has(item.id))],
      updatedAt: serverTimestamp(),
    }, { merge: true });
  }
  return loadCampaigns();
}

export async function saveCampaign(campaign) {
  assertReady();
  const { id, ...data } = campaign;
  await setDoc(doc(db, CAMPAIGNS, id), {
    ...data,
    updatedAt: serverTimestamp(),
  }, { merge: true });
}

export async function createCampaign(title, genre = '') {
  assertReady();
  const id = 'campaign-' + crypto.randomUUID();
  const campaign = {
    id, schemaVersion: 3, title, genre, status: 'installed',
    source: '', premise: '', story: '', classes: [], characters: [],
    npcs: [], scenes: [], maps: [], travel: [], travelRules: {
      principle: 'A jornada é uma sequência de cenas com escolhas e consequências.',
      track: ['tempo', 'condição', 'recursos', 'exposição', 'vínculos'],
      guidance: 'Apresente rotas e custos; sinalize perigos; pergunte como cada personagem contribui; atualize o mundo na chegada.',
    }, art: [], checklist: [], progression: { currency: 'Pontos de personagem', awardCap: 5, criteria: [], rules: 'O narrador registra uma justificativa por marco narrativo.' }, progressionLog: [], testLog: [],
    createdAt: serverTimestamp(), updatedAt: serverTimestamp(),
  };
  await setDoc(doc(db, CAMPAIGNS, id), campaign);
  return { ...campaign, createdAt: Date.now(), updatedAt: Date.now() };
}

function roomCode() {
  const alphabet = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  const values = new Uint8Array(6);
  crypto.getRandomValues(values);
  return Array.from(values, value => alphabet[value % alphabet.length]).join('');
}

export async function createRoom(campaignId, playerId, playerName) {
  assertReady();
  const code = roomCode();
  await setDoc(doc(db, ROOMS, code), {
    code,
    campaignId,
    hostId: playerId,
    players: [{ id: playerId, name: playerName || 'Narrador' }],
    status: 'waiting',
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
  return code;
}

export async function joinRoom(code, playerId, playerName) {
  assertReady();
  const normalizedCode = code.toUpperCase();
  const roomRef = doc(db, ROOMS, normalizedCode);
  const snapshot = await getDoc(roomRef);
  if (!snapshot.exists()) throw new Error('Não encontrei uma sala com esse código.');
  await updateDoc(roomRef, {
    players: arrayUnion({ id: playerId, name: playerName || 'Jogador' }),
    updatedAt: serverTimestamp(),
  });
  return { code: normalizedCode, ...snapshot.data() };
}

export function listenRoom(code, callback, onError) {
  assertReady();
  return onSnapshot(doc(db, ROOMS, code.toUpperCase()), snapshot => {
    callback(snapshot.exists() ? { id: snapshot.id, ...snapshot.data() } : null);
  }, onError);
}
