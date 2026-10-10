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
const KAGEHAMA_SCHEMA_VERSION = 13;

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
      classes: kagehama.classes, art: kagehama.art, progression: kagehama.progression, artDirection: kagehama.artDirection, story:kagehama.story, bestiary:kagehama.bestiary, relics:kagehama.relics, npcBehaviorModel:kagehama.npcBehaviorModel,
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
    if (!players.length || players.some(player => !player.ready)) throw new Error('Todos os jogadores presentes precisam estar prontos.');
    const messages = (scene.openingMessages || []).map((message, index) => ({
      id: message.id || 'opening-' + index,
      type: message.type || 'narrator-line',
      playerId: message.playerId || 'narrator',
      playerName: message.playerName || 'Narrador',
      characterName: message.characterName || 'Mind',
      className: message.className || 'Prólogo',
      text: message.text || scene.openingPrompt || scene.description || 'A cena começa.',
      createdAt: Date.now() + index,
    }));
    const actionCycle = { number: 1, requiredPlayerIds: players.map(player => player.id), openedAt: Date.now(), status: 'collecting' };
    transaction.update(roomRef, { status: 'narration', dynamicNarration: true, scene, sceneIndex: 0, beatIndex: 0, dialoguePage: 0, displayMessageId: '', messages, actionCycle, startedAt: serverTimestamp(), updatedAt: serverTimestamp() });
    return { ...room, status: 'narration', dynamicNarration: true, scene, sceneIndex: 0, beatIndex: 0, dialoguePage: 0, displayMessageId: '', messages, actionCycle };
  });
}

export async function advanceNarrativeBeat(code, hostId, next) {
  assertReady();
  const roomRef = doc(db, ROOMS, code.toUpperCase());
  return runTransaction(db, async transaction => {
    const snapshot = await transaction.get(roomRef);
    if (!snapshot.exists()) throw new Error('Não encontrei uma sala.');
    const room = snapshot.data();
    if (room.hostId !== hostId) throw new Error('Somente o anfitrião pode avançar os quadros.');
    if (room.status !== 'narration') throw new Error('A narração ainda não começou.');
    const currentScene = room.scene || {}, beats = currentScene.beats || [];
    const currentBeat = Number(room.beatIndex || 0), sceneIndex = Number(room.sceneIndex || 0);
    if (next.pageOnly) {
      if (Number(next.sceneIndex) !== sceneIndex || Number(next.beatIndex) !== currentBeat || !next.scene || !Number.isInteger(Number(next.dialoguePage)) || Number(next.dialoguePage) !== Number(room.dialoguePage || 0) + 1) throw new Error('A fala mudou; atualize a cena e tente novamente.');
      const pinnedId = String(next.displayMessageId || '');
      if (pinnedId && !(room.messages || []).some(item => item.id === pinnedId)) throw new Error('A fala já não está no histórico da cena.');
      transaction.update(roomRef, { dialoguePage: Number(next.dialoguePage), displayMessageId: pinnedId, updatedAt: serverTimestamp() });
      return { ...room, dialoguePage: Number(next.dialoguePage), displayMessageId: pinnedId };
    }
    const cycle = room.actionCycle || { number: 1, requiredPlayerIds: (room.players || []).map(player => player.id) };
    const currentBeatData = beats[currentBeat] || {};
    const acted = new Set((room.messages || []).filter(item => item.type === 'player-action' && Number(item.cycle) === Number(cycle.number)).map(item => item.playerId));
    if (currentBeatData.type === 'prompt' && (cycle.requiredPlayerIds || []).some(id => !acted.has(id))) throw new Error('Aguarde uma ação de cada jogador antes de avançar o quadro.');
    const dynamicNarration = room.dynamicNarration === true;
    const startsTravel = next.travelStart === true && (dynamicNarration || currentBeat >= beats.length - 1) && Number(next.sceneIndex) === sceneIndex && next.travelState?.phase === 'in-transit';
    const completesTravel = dynamicNarration && next.clearTravelState === true && room.travelState?.phase === 'in-transit' && Number(next.sceneIndex) === Number(room.travelState.targetSceneIndex) && next.scene?.id === room.travelState.destinationSceneId;
    const expectedSceneIndex = dynamicNarration ? sceneIndex : currentBeat >= beats.length - 1 ? sceneIndex + 1 : sceneIndex;
    if ((!startsTravel && !completesTravel && Number(next.sceneIndex) !== expectedSceneIndex) || !next.scene || !Number.isInteger(Number(next.beatIndex))) throw new Error('A cena mudou; atualize a sala e tente de novo.');
    const players = room.players || [];
    const actionCycle = { number: Number(room.actionCycle?.number || 1) + 1, requiredPlayerIds: players.map(player => player.id), openedAt: Date.now(), status: 'collecting' };
    const travelState = startsTravel ? next.travelState : next.clearTravelState ? null : (room.travelState || null);
    transaction.update(roomRef, { scene: next.scene, sceneIndex: Number(next.sceneIndex), beatIndex: Number(next.beatIndex), dialoguePage: 0, displayMessageId: '', actionCycle, travelState, updatedAt: serverTimestamp() });
    return { ...room, scene: next.scene, sceneIndex: Number(next.sceneIndex), beatIndex: Number(next.beatIndex), dialoguePage: 0, displayMessageId: '', actionCycle, travelState };
  });
}

export async function postRoomMessage(code, message) {
  assertReady();
  const roomRef = doc(db, ROOMS, code.toUpperCase());
  return runTransaction(db, async transaction => {
    const snapshot = await transaction.get(roomRef);
    if (!snapshot.exists()) throw new Error('Não encontrei a sala.');
    const room = snapshot.data();
    if (message.type === 'perception') {
      if (room.status !== 'narration') throw new Error('A narração ainda não começou.');
      if (!(room.players || []).some(player => player.id === message.playerId)) throw new Error('Este jogador não está nesta sala.');
      if (message.sceneId !== room.scene?.id) throw new Error('A cena mudou. Atualize a tela antes de testar Percepção.');
      if ((room.messages || []).some(item => item.type === 'perception' && item.sceneId === message.sceneId && item.playerId === message.playerId)) throw new Error('Você já testou Percepção nesta cena.');
    }
    let savedMessage = message;
    let actionCycle = room.actionCycle || { number: 1, requiredPlayerIds: (room.players || []).map(player => player.id), status: 'collecting' };
    if (message.type === 'player-action') {
      if (room.status !== 'narration') throw new Error('A narração ainda não começou.');
      if (!actionCycle.requiredPlayerIds.includes(message.playerId)) throw new Error('Este jogador não está nesta rodada.');
      if (Number(message.cycle) !== Number(actionCycle.number)) throw new Error('A rodada mudou. Atualize a tela antes de enviar outra ação.');
      const alreadyActed = (room.messages || []).some(item => item.type === 'player-action' && Number(item.cycle) === Number(actionCycle.number) && item.playerId === message.playerId);
      if (alreadyActed) throw new Error('Sua ação desta rodada já foi registrada.');
      savedMessage = { ...message, cycle: actionCycle.number };
    }
    const messages = [...(room.messages || []), savedMessage].slice(-150);
    if (savedMessage.type === 'player-action') {
      const acted = new Set(messages.filter(item => item.type === 'player-action' && Number(item.cycle) === Number(actionCycle.number)).map(item => item.playerId));
      actionCycle = { ...actionCycle, status: actionCycle.requiredPlayerIds.every(id => acted.has(id)) ? 'complete' : 'collecting' };
      transaction.update(roomRef, { messages, actionCycle, dialoguePage: 0, displayMessageId: savedMessage.id, updatedAt: serverTimestamp() });
    } else transaction.update(roomRef, { messages, dialoguePage: 0, displayMessageId: savedMessage.id, updatedAt: serverTimestamp() });
    return messages;
  });
}

export function listenRoom(code, callback, onError) {
  assertReady();
  return onSnapshot(doc(db, ROOMS, code.toUpperCase()), snapshot => {
    callback(snapshot.exists() ? { id: snapshot.id, ...snapshot.data() } : null);
  }, onError);
}


export async function advanceActionCycle(code, hostId) {
  assertReady();
  const roomRef = doc(db, ROOMS, code.toUpperCase());
  return runTransaction(db, async transaction => {
    const snapshot = await transaction.get(roomRef);
    if (!snapshot.exists()) throw new Error('Não encontrei a sala.');
    const room = snapshot.data();
    const cycle = room.actionCycle || { number: 1, requiredPlayerIds: (room.players || []).map(player => player.id), status: 'collecting' };
    if (room.hostId !== hostId) throw new Error('Somente quem criou a sala pode abrir a próxima rodada.');
    if (room.status !== 'narration') throw new Error('A narração ainda não começou.');
    const acted = new Set((room.messages || []).filter(item => item.type === 'player-action' && Number(item.cycle) === Number(cycle.number)).map(item => item.playerId));
    if (!cycle.requiredPlayerIds.length || !cycle.requiredPlayerIds.every(id => acted.has(id))) throw new Error('Ainda falta a ação de um ou mais jogadores.');
    const nextCycle = { number: Number(cycle.number) + 1, requiredPlayerIds: (room.players || []).map(player => player.id), openedAt: Date.now(), status: 'collecting' };
    transaction.update(roomRef, { actionCycle: nextCycle, updatedAt: serverTimestamp() });
    return { ...room, actionCycle: nextCycle };
  });
}
