// Resolve text models against the caller's account; never persist API credentials here.
const preferred = ['openai/gpt-oss-120b', 'openai/gpt-oss-20b', 'llama-3.3-70b-versatile', 'llama-3.1-8b-instant'];
export function createGroqFetch(fetcher = (...args) => fetch(...args)) {
  let authCache, candidates, chosen;
  return async function groqFetch(url, options = {}) {
    const auth = new Headers(options.headers).get('Authorization');
    if (authCache !== auth) { authCache = auth; candidates = null; chosen = null; }
    if (!candidates) {
      const response = await fetcher('https://api.groq.com/openai/v1/models', {
        headers: options.headers, signal: options.signal,
      });
      if (!response.ok) return response;
      const available = new Set((await response.json()).data?.filter(m => m.active !== false).map(m => m.id));
      candidates = preferred.filter(id => available.has(id));
      if (!candidates.length) throw new Error('Sua conta Groq não disponibiliza um modelo de texto compatível. Confira as permissões dos modelos na Groq.');
    }
    const original = JSON.parse(options.body);
    let last;
    for (const model of [...new Set([chosen, ...candidates].filter(Boolean))]) {
      const body = { ...original, model };
      if (model.startsWith('openai/gpt-oss-')) {
        body.reasoning_effort = 'low';
        body.max_tokens = Math.max(1200, body.max_tokens || 0);
      }
      const response = await fetcher(url, { ...options, body: JSON.stringify(body) });
      if (response.ok) { chosen = model; return response; }
      const data = await response.clone().json().catch(() => ({}));
      const modelError = ['model_not_found', 'model_decommissioned', 'model_permission_blocked', 'model_not_allowed'].includes(data.error?.code)
        || ([403, 404].includes(response.status) && /model/i.test(data.error?.message || ''));
      if (!modelError) return response; // Invalid credentials, quota and request errors need user-visible handling.
      if (chosen === model) chosen = null;
      last = response;
    }
    candidates = null;
    return last;
  };
}
export const groqFetch = createGroqFetch();
