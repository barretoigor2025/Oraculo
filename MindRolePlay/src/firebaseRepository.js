import {
  arrayUnion,
  collection,
  doc,
  getDoc,
  getDocs,
  onSnapshot,
  runTransaction,
  serverTimestamp,
  setDoc,
  updateDoc,
} from 'firebase/firestore';
import { db, isFirebaseConfigured } from '../../src/firebase/config.js';
import { createDemoCampaigns } from './campaigns.js';

const CAMPAIGNS = 'mindCampaigns';
const ROOMS = 'mindRooms';
const KAGEHAMA_SCHEMA_VERSION = 7;

function characterSlug(name) {
  return String(name || 'personagem')
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    .toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') || 'personagem';
}

function migrateCharacterPortraits(characters, classes) {
  return (characters || []).map(character => {
    const cls = classes.find(item => item.id === character.classId);
    if (!cls) return character;
    const gender = character.gender === 'female' ? 'female' : 'male';
    const suffix = gender === 'female' ? 'feminino' : 'masculino';
    return {
      ...character,
      gender,
      recordName: `ficha_${characterSlug(character.name)}.json`,
      portrait: cls.portraits?.[gender] || cls.portrait || '',
      assetPath: cls.assetPaths?.[gender] || cls.portraits?.[gender] || cls.portrait || '',
      avatarFileName: `${cls.id}_${suffix}.png`,
    };
  });
}

function needsKagehamaUpgrade(saved, seed) {
  if (Number(saved.schemaVersion || 1) < KAGEHAMA_SCHEMA_VERSION) return true;
  if ((saved.classes || []).length !== seed.classes.length) return true;
  if ((saved.art || []).length !== seed.art.length) return true;
  if ((saved.npcs || []).some(npc => !npc.behaviorProfile)) return true;

  return (seed.classes || []).some(seedClass => {
    const savedClass = (saved.classes || []).find(item => item.id === seedClass.id);
    if (!savedClass) return true;
    return ['male', 'female'].some(gender =>
      savedClass.portraits?.[gender] !== seedClass.portraits?.[gender] ||
      savedClass.assetPaths?.[gender] !== seedClass.assetPaths?.[gender]
    );
  }) || (saved.characters || []).some(character => {
    const seedClass = (seed.classes || []).find(item => item.id === character.classId);
    if (!seedClass) return false;
    const gender = character.gender === 'female' ? 'female' : 'male';
    return character.portrait !== seedClass.portraits?.[gender];
  });
}

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
  if (kagehama && savedKagehama && needsKagehamaUpgrade(savedKagehama, kagehama)) {
    const seedIds = new Set(kagehama.checklist.map(item => item.id));
    await setDoc(doc(db, CAMPAIGNS, kagehama.id), {
      ...kagehama, ...savedKagehama, schemaVersion: KAGEHAMA_SCHEMA_VERSION,
      classes: kagehama.classes, art: kagehama.art, progression: kagehama.progression, artDirection: kagehama.artDirection,
      npcs: [...kagehama.npcs, ...(savedKagehama.npcs || []).filter(item => !kagehama.npcs.some(seed => seed.id === item.id))],
      scenes: [...kagehama.scenes, ...(savedKagehama.scenes || []).filter(item => !kagehama.scenes.some(seed => seed.id === item.id))],
      characters: migrateCharacterPortraits(savedKagehama.characters, kagehama.classes), progressionLog: savedKagehama.progressionLog || [],
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

export async function createRoom(campaignId, playerId, playerName, character = null) {
  assertReady();
  const code = roomCode();
  await setDoc(doc(db, ROOMS, code), {
    code,
    campaignId,
    hostId: playerId,
    players: [{ id: playerId, name: playerName || 'Narrador', characterId: character?.id || '', characterName: character?.name || '', className: character?.className || '', gender: character?.gender || '', portrait: character?.portrait || '', ready: true }],
    status: 'waiting',
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
  return code;
}

export async function joinRoom(code, playerId, playerName, character = null) {
  assertReady();
  const normalizedCode = code.toUpperCase();
  const roomRef = doc(db, ROOMS, normalizedCode);
  return runTransaction(db, async transaction => {
    const snapshot = await transaction.get(roomRef);
    if (!snapshot.exists()) throw new Error('Não encontrei uma sala com esse código.');
    const room = snapshot.data();
    if (room.status !== 'waiting') throw new Error('Esta sala já iniciou a narração.');
    const players = Array.isArray(room.players) ? room.players : [];
    const player = { id: playerId, name: playerName || 'Jogador', characterId: character?.id || '', characterName: character?.name || '', className: character?.className || '', gender: character?.gender || '', portrait: character?.portrait || '', ready: false };
    const index = players.findIndex(item => item.id === playerId);
    if (index >= 0) players[index] = { ...players[index], ...player };
    else players.push(player);
    transaction.update(roomRef, { players, updatedAt: serverTimestamp() });
    return { code: normalizedCode, ...room, players };
  });
}

export async function setPlayerReady(code, playerId, ready) {
  assertReady();
  const roomRef = doc(db, ROOMS, code.toUpperCase());
  return runTransaction(db, async transaction => {
    const snapshot = await transaction.get(roomRef);
    if (!snapshot.exists()) throw new Error('Não encontrei a sala.');
    const room = snapshot.data();
    const players = (room.players || []).map(player => player.id === playerId ? { ...player, ready: Boolean(ready) } : player);
    transaction.update(roomRef, { players, updatedAt: serverTimestamp() });
    return { code: code.toUpperCase(), ...room, players };
  });
}

export async function startNarration(code, hostId, scene) {
  assertReady();
  const roomRef = doc(db, ROOMS, code.toUpperCase());
  return runTransaction(db, async transaction => {
    const snapshot = await transaction.get(roomRef);
    if (!snapshot.exists()) throw new Error('Não encontrei a sala.');
    const room = snapshot.data();
    const players = room.players || [];
    if (room.hostId !== hostId) throw new Error('Somente quem criou a sala pode iniciar.');
    if (players.length < 2 || players.some(player => !player.ready)) throw new Error('Todos os jogadores precisam estar prontos.');
    transaction.update(roomRef, { status: 'narration', scene, messages: [], startedAt: serverTimestamp(), updatedAt: serverTimestamp() });
    return { ...room, status: 'narration', scene, messages: [] };
  });
}

export async function postRoomMessage(code, message) {
  assertReady();
  const roomRef = doc(db, ROOMS, code.toUpperCase());
  return runTransaction(db, async transaction => {
    const snapshot = await transaction.get(roomRef);
    if (!snapshot.exists()) throw new Error('Não encontrei a sala.');
    const room = snapshot.data();
    const messages = [...(room.messages || []), message].slice(-150);
    transaction.update(roomRef, { messages, updatedAt: serverTimestamp() });
    return messages;
  });
}

export function listenRoom(code, callback, onError) {
  assertReady();
  return onSnapshot(doc(db, ROOMS, code.toUpperCase()), snapshot => {
    callback(snapshot.exists() ? { id: snapshot.id, ...snapshot.data() } : null);
  }, onError);
}
