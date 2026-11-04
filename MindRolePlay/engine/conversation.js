// The Oráculo conversation model, expressed independently of rendering/Firebase.
export const LOG_LIMIT = 200;
export const beatKey = beat => beat?.id || (beat ? `${beat.tipo}:${beat.authorId || beat.oradorId || ''}:${beat.ts}` : '');
export const logSequence = log => log?.at(-1)?.seq ?? log?.length ?? 0;
export function appendBeats(narration, incoming) {
  const log = [...(narration.dialogo || [])];
  let seq = Math.max(narration.dialogueSeq || 0, logSequence(log));
  for (const beat of incoming) {
    const id = beatKey(beat);
    if (log.some(b => beatKey(b) === id)) continue;
    log.push({ ...beat, id, seq: ++seq });
  }
  return { dialogo: log.slice(-LOG_LIMIT), dialogueSeq: seq };
}
export function conversationState(log, playerIds, savedStatus = {}) {
  const status = Object.fromEntries(playerIds.map(id => [id, savedStatus[id] || 'ativo']));
  const invitations = {};
  let lastActor = null;
  const nextTurn = () => {
    const start = lastActor ? playerIds.indexOf(lastActor) : -1;
    for (let n = 1; n <= playerIds.length; n++) {
      const id = playerIds[(start + n) % playerIds.length];
      if (status[id] !== 'satisfeito') return id;
    }
    return null;
  };
  for (const b of log) {
    if (b.tipo === 'controle') {
      const wasTurn = nextTurn() === b.authorId;
      if (b.controle === 'satisfeito') status[b.authorId] = 'satisfeito';
      if (b.controle === 'voltar') { status[b.authorId] = 'ativo'; delete invitations[b.authorId]; }
      if (b.controle === 'passar' || (b.controle === 'satisfeito' && wasTurn)) lastActor = b.authorId;
    }
    if (b.tipo === 'jogador') lastActor = b.authorId;
    if (b.reengajar && status[b.reengajar] === 'satisfeito') invitations[b.reengajar] = b.oradorNome;
  }
  const active = playerIds.filter(id => status[id] !== 'satisfeito');
  let turn = active[0] || null;
  if (lastActor && playerIds.length) {
    const start = playerIds.indexOf(lastActor);
    for (let n = 1; n <= playerIds.length; n++) {
      const id = playerIds[(start + n) % playerIds.length];
      if (active.includes(id)) { turn = id; break; }
    }
  }
  const last = log.at(-1);
  const awaitingReply = last?.tipo === 'jogador';
  // Requests stay in the shared log; reconnects do not discard a pending roll.
  const pendingTest = last?.pedidoTeste ? { ...last.pedidoTeste, npcId: last.oradorId, requestId: beatKey(last) } : null;
  return { status, invitations, active, turn: awaitingReply || pendingTest ? null : turn, awaitingReply, pendingTest };
}
export function appendPlayerBeat(room, beat, onlineIds) {
  const n = room.narration || {};
  const state = conversationState(n.dialogo || [], onlineIds, n.conversationStatus);
  if (state.pendingTest && beat.testeDe !== state.pendingTest.requestId) throw new Error('Resolva o teste pendente primeiro.');
  if (!state.pendingTest && state.turn !== beat.authorId) throw new Error('A vez de falar mudou. Aguarde o próximo turno.');
  if (state.pendingTest && state.pendingTest.playerId !== beat.authorId) throw new Error('Esse teste pertence a outro jogador.');
  if (state.awaitingReply) throw new Error('Aguarde a resposta do NPC.');
  return appendBeats(n, [beat]);
}
export function appendControlBeat(room, beat, onlineIds) {
  const n = room.narration || {};
  const state = conversationState(n.dialogo || [], onlineIds, n.conversationStatus);
  if (!onlineIds.includes(beat.authorId)) throw new Error('Jogador ausente da conversa.');
  if (!['passar', 'satisfeito', 'voltar'].includes(beat.controle)) throw new Error('Controle inválido.');
  if (state.awaitingReply || state.pendingTest) throw new Error('Aguarde a resposta ou resolva o teste pendente.');
  if (beat.controle === 'passar' && state.turn !== beat.authorId) throw new Error('É a vez de outro jogador.');
  return appendBeats(n, [beat]);
}
export function pendingInvestigation(log = []) {
  const last = log.findLast(b => ['inv-pedido', 'inv-acao'].includes(b.canal));
  return last?.canal === 'inv-pedido' ? last : null;
}
export function investigationTurn(log, playerIds) {
  const last = log.findLast(b => b.canal === 'inv-acao' && b.authorId);
  return playerIds[(playerIds.indexOf(last?.authorId) + 1) % playerIds.length] || null;
}
export function appendInvestigationRequest(room, beat, playerIds) {
  const n = room.narration || {};
  if (pendingInvestigation(n.dialogo)) throw new Error('Aguarde a consequência da investigação pendente.');
  if (investigationTurn(n.dialogo || [], playerIds) !== beat.authorId) throw new Error('É a vez de outro investigador.');
  return appendBeats(n, [beat]);
}
