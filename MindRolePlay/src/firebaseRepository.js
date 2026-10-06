import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
  arrayUnion,
  serverTimestamp,
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
  if (existing.length) return existing;

  const samples = createDemoCampaigns();
  await Promise.all(samples.map(campaign =>
    setDoc(doc(db, CAMPAIGNS, campaign.id), {
      ...campaign,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    })
  ));
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
    id, schemaVersion: 1, title, genre, status: 'installed',
    source: '', premise: '', story: '', classes: [], characters: [],
    npcs: [], scenes: [], maps: [], art: [], checklist: [], testLog: [],
    createdAt: serverTimestamp(), updatedAt: serverTimestamp(),
  };
  await setDoc(doc(db, CAMPAIGNS, id), campaign);
  return { ...campaign, createdAt: Date.now(), updatedAt: Date.now() };
}

export async function createRoom(campaignId, playerId, playerName) {
  assertReady();
  const code = Math.random().toString(36).slice(2, 8).toUpperCase();
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
  const roomRef = doc(db, ROOMS, code.toUpperCase());
  const snapshot = await getDoc(roomRef);
  if (!snapshot.exists()) throw new Error('Não encontrei uma sala com esse código.');
  await updateDoc(roomRef, {
    players: arrayUnion({ id: playerId, name: playerName || 'Jogador' }),
    updatedAt: serverTimestamp(),
  });
  return { code: code.toUpperCase(), ...snapshot.data() };
}
