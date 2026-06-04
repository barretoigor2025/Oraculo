import {
  doc,
  getDoc,
  onSnapshot,
  setDoc,
  updateDoc,
} from 'firebase/firestore';
import { db } from './config.js';
import { createInitialRoom, createPlayer, placePlayer } from '../game/state.js';

function roomRef(roomId) {
  return doc(db, 'rooms', roomId);
}

export async function createRoom(roomId) {
  const initialRoom = createInitialRoom(roomId);
  await setDoc(roomRef(roomId), initialRoom);
  return initialRoom;
}

export async function getRoom(roomId) {
  const snapshot = await getDoc(roomRef(roomId));
  return snapshot.exists() ? snapshot.data() : null;
}

export async function ensureRoom(roomId) {
  const existingRoom = await getRoom(roomId);
  if (existingRoom) return existingRoom;
  return createRoom(roomId);
}

export async function joinRoom(roomId, playerId, playerName, classId) {
  const room = await ensureRoom(roomId);
  const player = placePlayer(room, createPlayer(playerId, playerName, classId));
  const nextRoom = {
    ...room,
    updatedAt: Date.now(),
    players: {
      ...(room.players ?? {}),
      [playerId]: player,
    },
    log: [`${player.name} entrou como ${player.classId}.`, ...(room.log ?? [])].slice(0, 20),
  };

  await setDoc(roomRef(roomId), nextRoom);
  return nextRoom;
}

export async function saveRoom(room) {
  await updateDoc(roomRef(room.id), room);
}

export function listenRoom(roomId, callback) {
  return onSnapshot(roomRef(roomId), (snapshot) => {
    callback(snapshot.exists() ? snapshot.data() : null);
  });
}
