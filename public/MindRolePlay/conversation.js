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
  for (const b of log) {
    if (b.tipo === 'controle') {
      if (b.controle === 'satisfeito') status[b.authorId] = 'satisfeito';
      if (b.controle === 'voltar') { status[b.authorId] = 'ativo'; delete invitations[b.authorId]; }
      if (['passar', 'satisfeito'].includes(b.controle)) lastActor = b.authorId;
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
