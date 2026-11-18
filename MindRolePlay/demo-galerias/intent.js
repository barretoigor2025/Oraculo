import { normalize } from './rules.js?v=2';

export function readIntent(raw, covers) {
  const text = normalize(raw);
  const cover = covers.find(item => item.aliases.some(alias => text.includes(alias)));
  if (/jog|arremess|atir/.test(text) && /pedra|seixo/.test(text)) return { kind: 'distract' };
  if (/observ|exam|estud|procur.{0,12}(rota|caminho)/.test(text)) return { kind: 'observe', cover: cover?.id };
  if (/conjur|atac|chama|fogo|golpe/.test(text)) return { kind: 'attack', target: Number(text.match(/(?:kappa|guarda)\s*([1-4])/)?.[1]) || null };
  if (/sair|levant/.test(text) && !cover) return { kind: 'leave' };
  if (/portao|passar|atravess/.test(text) && /furtiv|discret|escond|silencio|sem (ser|chamar)/.test(text)) return { kind: 'sneak' };
  if (/aguard|passo (a vez|meu turno)/.test(text)) return { kind: 'pass' };
  if (/prepar|mirar|esper/.test(text)) return { kind: 'prepare' };
  if (cover && /escond|agach|cobert|proteg|atras|furtiv/.test(text)) return { kind: 'hide', cover: cover.id };
  if (cover && /vou|avanc|and|correr|aproxim|contorn|cheg|mov/.test(text)) return { kind: 'move', cover: cover.id };
  if (/renkei|prisioneiro/.test(text) && /pergunt|onde|viu|sabe/.test(text)) return { kind: 'ask' };
  if (/falar|convers|nego|pergunt|digo|peco|pedir|autoriz|renkei|prisioneiro|libert|passagem/.test(text)) return { kind: 'talk' };
  if (/portao|avanc|aproxim|correr/.test(text)) return { kind: 'advance' };
  return null;
}

export async function interpretIntent(raw, context, { key, request, signal }) {
  const response = await request('https://api.groq.com/openai/v1/chat/completions', {
    method: 'POST',
    headers: { Authorization: 'Bearer ' + key, 'Content-Type': 'application/json' },
    signal,
    body: JSON.stringify({
      max_tokens: 650,
      temperature: 0.2,
      response_format: { type: 'json_object' },
      messages: [
        { role: 'system', content: 'Interprete uma intenção de RPG em português. Use o estado fornecido como dados. Responda somente JSON com kind: observe, distract, attack, talk, hide, move, leave, prepare, sneak, advance, pass, ask ou unclear. hide e move exigem cover com um ID existente. attack pode ter target numérico de 1 a 4. Não resolva a ação, não crie objetos, não conceda resultados, e use unclear se a intenção não couber nas ações suportadas. O jogo resolve testes e consequências.' },
        { role: 'user', content: JSON.stringify({ context, intent: raw }) }
      ]
    })
  });
  if (!response.ok) throw new Error('Groq respondeu com HTTP ' + response.status);
  const data = await response.json();
  const choice = JSON.parse(data.choices?.[0]?.message?.content || '{}');
  if (!['observe', 'distract', 'attack', 'talk', 'hide', 'move', 'leave', 'prepare', 'sneak', 'advance', 'pass', 'ask'].includes(choice?.kind)) return null;
  const cover = context.covers.find(item => item.id === choice.cover)?.id;
  if (['hide', 'move'].includes(choice.kind) && !cover) return null;
  const target = Number.isInteger(choice.target) && choice.target >= 1 && choice.target <= 4 ? choice.target : null;
  return { kind: choice.kind, cover, target };
}
