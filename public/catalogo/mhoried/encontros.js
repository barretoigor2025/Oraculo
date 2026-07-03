// ── Encontros de batalha por cena — campanha Mhoried ──
// Liga cada cena de batalha ao seu roster real de inimigos (bestiaryId + posição).
// Grid 13×13: heróis nascem embaixo (row 11); inimigos em cima (rows 1-4).
// Os IDs vêm de loader.js (INIMIGOS_DATA). Posições fixas → todos os clientes
// spawnam o mesmo roster e o Firebase sincroniza HP/posição por id.

export const ENCONTROS = {
  mhoried_market:     { inimigos:[ {id:'espantalho_assombrado',col:4,row:2}, {id:'espantalho_assombrado',col:6,row:3}, {id:'espantalho_assombrado',col:8,row:2} ] },
  encruzilhada:       { inimigos:[ {id:'javali_ensandecido',col:6,row:2} ] }, // ÚNICO: só o javali da prótese (gancho)
  campo_aranhas:      { inimigos:[ {id:'wraithweaver_spider',col:3,row:2}, {id:'wraithweaver_spider',col:6,row:1}, {id:'wraithweaver_spider',col:9,row:2}, {id:'wraithweaver_spider',col:6,row:3} ] },
  acampamento_elfico: { inimigos:[ {id:'elfo_sombrio',col:4,row:2}, {id:'elfo_sombrio',col:6,row:3}, {id:'elfo_sombrio',col:8,row:2} ] },
  kobold_town:        { inimigos:[ {id:'kobold_azul',col:3,row:2}, {id:'kobold_azul',col:5,row:1}, {id:'kobold_azul',col:7,row:1}, {id:'kobold_azul',col:9,row:2} ] },
  gloamreach:         { inimigos:[ {id:'grimhollow_thool',col:4,row:2}, {id:'grimhollow_thool',col:8,row:2}, {id:'alquimista_choir',col:6,row:1} ] },
  torre_limm:         { inimigos:[ {id:'rei_chutter',col:6,row:1}, {id:'golem_de_pergaminho',col:3,row:3}, {id:'golem_de_pergaminho',col:9,row:3} ] },
  drowned_grove:      { inimigos:[ {id:'quay_grabber',col:6,row:1}, {id:'caranguejo_gigante',col:4,row:3}, {id:'elfo_sombrio',col:8,row:2} ] }, // Mudwallower (caranguejo) é ÚNICO — um só
  manticore_grounds:  { inimigos:[ {id:'manticora_albina',col:6,row:2} ] },
  great_grub_carcass: { inimigos:[ {id:'log_wife',col:6,row:1}, {id:'larva_gigante',col:6,row:3} ] },
  ruins_simithari:    { inimigos:[ {id:'marrowwither',col:4,row:2}, {id:'marrowwither',col:6,row:3}, {id:'marrowwither',col:8,row:2} ] },
  ysoria_revelacao:   { inimigos:[ {id:'mother_clutch',col:6,row:1}, {id:'wraithweaver_spider',col:4,row:3}, {id:'wraithweaver_spider',col:8,row:3} ] },
  twinfold_hollow:    { inimigos:[ {id:'barkthresher',col:4,row:2}, {id:'barkthresher',col:6,row:3}, {id:'barkthresher',col:8,row:2} ] },
};

// ── Emboscadas de viagem (Pilar 5) — por nível de perigo do caminho (0-5) ──
// Emboscadas de estrada usam SÓ criaturas genéricas (nada de nomeados/bosses únicos).
export const EMBOSCADAS = {
  1: [ {id:'esqueleto_lanceiro',col:5,row:2}, {id:'esqueleto_lanceiro',col:7,row:2} ],
  2: [ {id:'kobold_azul',col:4,row:2}, {id:'kobold_azul',col:6,row:3}, {id:'kobold_azul',col:8,row:2} ],
  3: [ {id:'elfo_sombrio',col:4,row:2}, {id:'wraithweaver_spider',col:6,row:3}, {id:'elfo_sombrio',col:8,row:2} ],
  4: [ {id:'marrowwither',col:4,row:2}, {id:'grimhollow_thool',col:6,row:1}, {id:'marrowwither',col:8,row:2} ],
  5: [ {id:'grimhollow_thool',col:4,row:2}, {id:'marrowwither',col:6,row:1}, {id:'grimhollow_thool',col:8,row:2} ],
};

// Criaturas ÚNICAS — bosses, nomeadas ou solitárias. NUNCA aparecem em duplicata
// num mesmo combate (trava automática em rosterDaKey). Se um roster tiver 2+ por
// engano, só a primeira spawna.
export const UNICOS = new Set([
  'rei_chutter', 'manticora_albina', 'alquimista_choir', 'demonio_vulkrundshard',
  'mother_clutch', 'javali_ensandecido', 'quay_grabber', 'caranguejo_gigante',
  'larva_gigante', 'log_wife',
]);
function _dedupeUnicos(lista){
  if (!Array.isArray(lista)) return lista;
  const vistos = new Set();
  return lista.filter(e => {
    if (UNICOS.has(e.id)) { if (vistos.has(e.id)) return false; vistos.add(e.id); }
    return true;
  });
}

// key pode ser um cenaId ('encruzilhada') ou uma emboscada ('_emboscada:3')
export function rosterDaKey(key){
  if (!key) return null;
  if (key.startsWith('_emboscada')) {
    const perigo = parseInt(key.split(':')[1] || '1', 10);
    const p = Math.max(1, Math.min(5, perigo || 1));
    return _dedupeUnicos(EMBOSCADAS[p] || EMBOSCADAS[1]);
  }
  return _dedupeUnicos(ENCONTROS[key]?.inimigos || null);
}

// ── Mapas de batalha por cena ──
// Cada cena tem seu fundo + (opcional) terreno. Enquanto a arte não existir,
// a Arena cai automaticamente no mapa da Feira (fallback visível e jogável).
const _BH = 'catalogo/mhoried/cenarios/batalha_hex/';
export const MAPA_FALLBACK = {
  mapa:    _BH + 'feira_phanourios/imagem/feira-limpa.png',
  terreno: _BH + 'feira_phanourios/imagem/feira-limpa-terreno.json',
};
// Arte a criar em cenarios/batalha_hex/{cena}/imagem/{cena}.png
export const MAPAS_BATALHA = {
  mhoried_market:     MAPA_FALLBACK,                                  // já existe (Feira)
  encruzilhada:       { mapa: _BH + 'encruzilhada/imagem/encruzilhada.png' },
  campo_aranhas:      { mapa: _BH + 'campo_aranhas/imagem/campo_aranhas.png' },
  acampamento_elfico: { mapa: _BH + 'acampamento_elfico/imagem/acampamento_elfico.png' },
  kobold_town:        { mapa: _BH + 'kobold_town/imagem/kobold_town.png' },
  gloamreach:         { mapa: _BH + 'gloamreach/imagem/gloamreach.png' },
  torre_limm:         { mapa: _BH + 'torre_limm/imagem/torre_limm.png' },
  drowned_grove:      { mapa: _BH + 'drowned_grove/imagem/drowned_grove.png' },
  manticore_grounds:  { mapa: _BH + 'manticore_grounds/imagem/manticore_grounds.png' },
  great_grub_carcass: { mapa: _BH + 'great_grub_carcass/imagem/great_grub_carcass.png' },
  ruins_simithari:    { mapa: _BH + 'ruins_simithari/imagem/ruins_simithari.png' },
  ysoria_revelacao:   { mapa: _BH + 'ysoria_revelacao/imagem/ysoria_revelacao.png' },
  twinfold_hollow:    { mapa: _BH + 'twinfold_hollow/imagem/twinfold_hollow.png' },
};
// Emboscadas de viagem: usam o mapa de floresta da encruzilhada (cai na Feira até existir)
export function mapaDaKey(key){
  let info;
  if (!key) info = MAPA_FALLBACK;
  else if (key.startsWith('_emboscada')) info = MAPAS_BATALHA.encruzilhada || MAPA_FALLBACK;
  else info = MAPAS_BATALHA[key] || MAPA_FALLBACK;
  // Terreno: usa o definido, ou deriva do mapa ({cena}.png → {cena}-terreno.json).
  // Se o JSON não existir, a Arena ignora (404 tratado). Crie pelo terreno_editor.html.
  const terreno = info.terreno || (info.mapa ? info.mapa.replace(/\.png$/, '-terreno.json') : null);
  return { mapa: info.mapa, terreno };
}
