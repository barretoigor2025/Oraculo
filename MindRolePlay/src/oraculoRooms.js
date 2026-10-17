// Room schema and lifecycle copied from src/firebase/roomService.js, with
// isolated Mind data, explicit host identity and transactional membership.
import { doc, getDoc, setDoc, updateDoc, onSnapshot, runTransaction } from 'firebase/firestore';
import { db, isFirebaseConfigured } from '../../src/firebase/config.js';
import { CLASSES } from './oraculoClasses.js';
function roomRef(id){if(!isFirebaseConfigured||!db)throw new Error('Firebase não configurado.');return doc(db,'mindRooms',id);}
export async function joinRoom(roomId,playerId,character,create=false){
  return runTransaction(db,async tx=>{
    const ref=roomRef(roomId),snap=await tx.get(ref);
    if(!snap.exists()&&!create)throw new Error('Sala não encontrada. Confira o código.');
    if(snap.exists()&&create)throw new Error('Este código já existe. Crie outra sala.');
    const room=snap.exists()?snap.data():{id:roomId,engine:'oraculo-kagehama-v2',campaign:'kagehama',hostId:playerId,status:'lobby',players:{},createdAt:Date.now(),updatedAt:Date.now(),log:[]};
    if(room.engine!=='oraculo-kagehama-v2')throw new Error('Esta sala usa uma versão anterior. Crie uma sala nova.');
    const prior=room.players?.[playerId];
    if(!prior&&room.status!=='lobby')throw new Error('A campanha já começou.');
    const cls=CLASSES[prior?.classId||character.classId];if(!cls)throw new Error('Escolha um aventureiro válido.');
    const sheet=JSON.parse(localStorage.getItem('mindRolePlay.character')||'null');
    const player={...(prior||{}),id:playerId,name:prior?.name||character.name,nome:prior?.nome||character.name,classId:prior?.classId||cls.id,
      characterId:prior?.characterId||sheet?.id||'',gender:cls.gender,icon:cls.icon,attributes:cls.attributes,skills:cls.skills,
      hp:prior?.hp??cls.maxHp,maxHp:cls.maxHp,sp:prior?.sp??cls.sp,portrait:cls.portrait,standee:cls.standee,
      ts:Date.now(),joinedAt:prior?.joinedAt||Date.now()};
    tx.set(ref,{...room,players:{...room.players,[playerId]:player},updatedAt:Date.now()});
    return {...room,players:{...room.players,[playerId]:player}};
  });
}
export function listenRoom(id,cb){return onSnapshot(roomRef(id),s=>cb(s.exists()?s.data():null));}
export async function saveRoom(room){await updateDoc(roomRef(room.id),room);}
export async function startNarration(roomId,cenaId='kagehama-scene-0'){
  await runTransaction(db,async tx=>{const ref=roomRef(roomId),s=await tx.get(ref),r=s.data();
    if(r?.hostId!==localStorage.getItem('mindRolePlay.playerId'))throw new Error('Somente o anfitrião pode iniciar.');
    if(r.status!=='lobby')throw new Error('A campanha já foi iniciada. Use Continuar Aventura.');
    tx.update(ref,{status:'narration',updatedAt:Date.now(),narration:{cenaId,modoImagem:'exterior',dialogo:[],introConfirmados:{},memorias:{},ts:Date.now()},postBattleConfirmados:{},batalha:{},currentTurnPlayerId:null,turnOrder:[],enemies:[]});
  });
}
export const startSimulation=startNarration;
