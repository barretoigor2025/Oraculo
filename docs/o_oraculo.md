# O Oráculo — Documento Fundador

> O Oráculo é um console. Campanhas são cartuchos. Você encontra um PDF de qualquer universo, entrega ao Oráculo, ele instala, e você joga com seus amigos.

---

## A Metáfora Central

O sistema funciona como um videogame retrô:

- O **console** é o Oráculo — os quatro pilares, a engine, o motor que roda tudo
- O **cartucho** é a campanha — o universo, os personagens, a história, as batalhas
- **Instalar** significa: ler o PDF, entender o universo, gerar os arquivos, e o sistema passa a conhecer aquela campanha

Mhoried é a campanha de referência — o padrão técnico e visual que todas as outras seguem.

---

## Os Quatro Pilares

### 1. Construtor (Builder)
**O roteirista da campanha.**

Recebe o material bruto (PDF, livro, anotações) e age como diretor criativo — não apenas extrai dados, mas cria com intenção:

- Define o roteiro completo por atos (começo, meio, fim)
- Identifica ganchos emocionais: momentos de traição, perseguição, investigação, tristeza, ação
- Decide onde cada personagem aparece e por quê
- Cria os gatilhos de batalha (o que faz a cena ir de narrativa para combate)
- Gera as descrições de arte de cada NPC, inimigo e cenário (para criação via IA de imagens)
- Entrega o checklist do que precisa ser criado antes de jogar

**Quem executa:** Claude (lendo o PDF aqui no Claude Code, com contexto completo do sistema).  
**Quando:** No momento de instalar uma nova campanha.

---

### 2. Narrador
**A voz viva da campanha.**

Absorve o que o Construtor gerou e dá vida à história durante o jogo:

- Narra o que está acontecendo, o que está ao redor, o que vai acontecer
- Interpreta cada NPC com a personalidade específica dele — não fala de forma genérica
- Adapta o tom: um personagem filosófico fala diferente de um intransigente ou de um cômico
- Entra em cena antes das batalhas (conta o gatilho), durante (narra eventos), e depois (conta o resultado)
- Responde às ações inesperadas dos jogadores com consistência do universo

**Quem executa:** Groq API (rápido, gratuito, recebe a personalidade do NPC como system prompt).  
**Dados necessários:** `narracao.js` de cada campanha (contém personalidade, conhecimentos, forma de falar de cada NPC).

---

### 3. Catálogo
**A enciclopédia do universo.**

A memória permanente de tudo que existe em cada campanha:

- Quem são as classes jogáveis (stats, habilidades, arte)
- Quem são os NPCs (aparência, categoria, personalidade)
- Quem são os inimigos (tipo, descrição, habilidades de combate)
- Quais são os cenários (local, atmosfera, imagens)
- Qual é o roteiro (atos, cenas, ganchos)
- O checklist de assets (o que foi criado, o que falta)

**Também armazena:** as descrições de arte — o texto que você usa para gerar imagens via IA (Midjourney, DALL·E, etc.).

**Estado atual:** Praticamente pronto. Aceita múltiplas campanhas via seletor dropdown. Cada campanha tem paleta de cores própria.  
**Arquivo principal:** `public/catalog.html`

---

### 4. Arena
**O motor de batalha — e o pilar convergente.**

Recebe informações de todos os outros pilares e as orquestra em tempo real:

- Do **Catálogo**: quem são os lutadores, seus stats, suas habilidades
- Do **Construtor**: por que esta batalha está acontecendo (o gatilho), o contexto narrativo
- Do **Narrador**: a narração do que acontece em cada evento de batalha

O que a Arena calcula:
- Movimentação em grid hexagonal
- Ataques, dano, buffs, debuffs
- Habilidades especiais com custo de SP
- IA dos inimigos (como eles tomam decisões)
- O botão de **Ação Livre** — quando um jogador tenta algo inesperado (derrubar uma estante, convencer um inimigo, criar uma distração), a Arena calcula com os atributos do personagem se aquilo é possível e se teve sucesso ou falha

O resultado de cada ação vai para o Narrador, que transforma em texto na tela.

**Arquivo principal:** `public/arena.html`

---

## Fluxo de Instalação de Campanha

```
1. Usuário encontra PDF de campanha (qualquer universo)
        ↓
2. Abre Claude Code, anexa o PDF
   Diz: "instala essa campanha no Oráculo"
        ↓
3. Claude lê o PDF inteiro
   Entende o universo, os personagens, a história
        ↓
4. Modo Construtor ativado — gera:
   ├── Classes jogáveis (balanceadas para o sistema Oráculo)
   ├── NPCs com personalidade para o Narrador
   ├── Inimigos com habilidades para a Arena
   ├── Roteiro por atos com ganchos emocionais
   ├── Cenários com descrições de arte
   └── Checklist de assets a criar
        ↓
5. Arquivos criados em public/catalogo/{campaign-id}/
   Campanha registrada no seletor do catalog.html
        ↓
6. Checklist entregue:
   "Faltam estas imagens para jogar: ..."
        ↓
7. Usuário cria as artes (IA de imagens)
   Marca no checklist conforme vai criando
        ↓
8. Campanha 100% instalada — pronta para jogar
```

---

## Regra de Expansão Canônica

**O Construtor nunca importa elementos de fora do universo da campanha.**

- Campanha de Dragon Ball → só personagens do universo Dragon Ball
- Campanha de Death Note → só personagens do universo Death Note
- Campanha de Marvel → só o universo Marvel

**O que é permitido:**
- Desenvolver personagens menores que existem no universo (dar profundidade, criar participação, inventar o que estavam fazendo numa cena)
- Criar NPCs anônimos que *caberiam* no universo (um comerciante comum em Konoha, um marinheiro genérico em Marineford)
- Inventar detalhes de cenas e ambientes desde que sejam consistentes com o lore

**O que não é permitido:**
- Trazer personagens de outro universo
- Criar regras de combate que contradizem o sistema Oráculo
- Inventar poderes que não existem no universo da campanha

---

## Estrutura de Arquivos de uma Campanha

```
public/catalogo/{id}/
  classes.js                    ← export const CLASSES_DATA
  loader.js                     ← export { NPCS, INIMIGOS_DATA }
  data.js                       ← export { personagens, cenarios, regras especiais da campanha }
  narracao.js                   ← export { NARRACAO_NPCS, NARRACAO_CENAS, NARRACAO_FLUXO }
  campanha/
    config_campanha.json        ← metadata da campanha
    roteiro/
      campaign.js               ← export { CENAS, CENAS_ORDEM }
      roteiro_jogavel.md        ← versão legível do roteiro para referência
  classes/{nome}/
    dados.json
    retrato/{nome}_m_retrato.png
    retrato/{nome}_f_retrato.png
    peca_tabuleiro/{nome}_m_peca.png
    peca_tabuleiro/{nome}_f_peca.png
  npcs/{id}/
    dados.json
    retrato/{id}_retrato.png
    peca_tabuleiro/{id}_peca.png
  inimigos/{id}/
    dados.json
    retrato/{id}_retrato.png
  cenarios/
    conversacao/{nome}/imagem/  ← cenas de diálogo/exploração
    batalha_hex/{nome}/imagem/  ← mapas de batalha
```

---

## Schemas dos Arquivos

### `classes.js` — Classes jogáveis

```javascript
export const CLASSES_DATA = {
  guerreiro: {
    nome: 'Guerreiro',
    icon: '⚔️',
    gender: 'm',          // 'm', 'f', ou ambos via variantes
    maxHp: 12,            // pontos de vida máximos
    sp: 80,               // pontos de habilidade (stamina/mana)
    mov: 5,               // hexágonos de movimento por turno
    atk: 4,               // bônus de ataque base
    attrs: { FOR:16, DES:12, CON:15, INT:10, SAB:10, CAR:10 },
    feat: 'Descrição da especialidade da classe.',
    habs: [
      { icon:'⚔️', nome:'Nome', desc:'Descrição', dano:'1d8+2', tipo:'melee', sp:0 },
      { icon:'💥', nome:'Habilidade', desc:'Desc', dano:'1d8+6', tipo:'melee', sp:15 },
      { icon:'🛡️', nome:'Buff', desc:'Desc', dano:'—', tipo:'buff', sp:0 },
    ],
    cor: '#8a4a20',       // cor temática da classe para UI
  },
  // ... outras classes
};
```

**Balanceamento de stats para o sistema Oráculo:**
- HP range: 6 (frágil/mago) a 14 (tank/guerreiro)
- SP range: 60 (guerreiro bruto) a 140 (conjurador puro)
- MOV range: 3 (pesado) a 6 (ágil)
- ATK range: 2 (suporte) a 6 (especialista)
- Cada classe deve ter 3 habilidades: 1 básica (sp:0), 1 média (sp:10-20), 1 poderosa (sp:25-40)

---

### `narracao.js` — Configuração do Narrador por campanha

```javascript
export const NARRACAO_NPCS = [
  {
    id: 'nome_id',
    nome: 'Nome Completo',
    avatar: '⚔️',
    img: 'catalogo/{id}/npcs/{id}/peca_tabuleiro/{id}_peca.png',
    tipo: 'standee',
    zBase: 6,             // profundidade visual na cena (5-9)
    offsetPx: 0,          // deslocamento horizontal em pixels
    cenas: ['cena_a', 'cena_b'],  // em quais cenas este NPC aparece
    personalidade: 'Descrição detalhada de quem este personagem é, o que o motiva.',
    conhecimentos: 'O que este NPC sabe que é relevante para a história.',
    formaDeFalar: 'Como este NPC se expressa — ritmo, vocabulário, maneirismos.',
    reatividade: 0.15,    // 0.0 a 1.0 — probabilidade de reagir espontaneamente
    abertura: '(Prompt para o Groq gerar a fala de abertura deste NPC nesta cena.)',
    aberturaFallback: '[ACAO: descrição de ação] Fala de fallback caso a IA falhe.',
  },
];

export const NARRACAO_CENAS = {
  cena_a: {
    bg: 'catalogo/{id}/cenarios/conversacao/{nome}/imagem/cena_a.png',
    titulo: 'Nome do Local',
  },
};

export const NARRACAO_FLUXO = [
  { id:'cena_a', proximo:'cena_b', btnLabel:'→ Próxima Cena', condFirebase:'btnProximo' },
  { id:'cena_b', proximo:null },
];
```

---

### `campanha/roteiro/campaign.js` — Roteiro por atos

```javascript
export const CENAS_ORDEM = ['ato1_abertura', 'ato1_conflito', 'ato2_virada', ...];

export const CENAS = {
  ato1_abertura: {
    ato: 1,
    titulo: 'Título da Cena',
    local: 'Nome do Local',
    tipo: 'dialogo',      // 'dialogo', 'batalha', 'exploracao', 'transicao'
    desc: 'O que acontece nesta cena. Narrado em segunda pessoa.',
    npcs: ['id_npc1', 'id_npc2'],
    gatilho: 'O que desencadeia esta cena — o evento que a inicia.',
    tom: 'misterio',      // 'acao', 'emocional', 'misterio', 'investigacao', 'perseguicao', 'tragedia', 'alívio'
    badges: ['npc'],      // 'batalha', 'npc', 'exploracao'
  },
  ato1_conflito: {
    // ... batalha que segue o diálogo
  },
};
```

---

## Paleta de Cores por Campanha

Toda campanha tem identidade visual própria. Ao registrar uma nova campanha em `catalog.html`, adicionar entrada em `CAMP_PALETTE`:

```javascript
const CAMP_PALETTE = {
  mhoried:      { '--gold':'#c8a040', '--gold2':'#e8c060', '--bg':'#0e0c0a', ... },
  'death-note': { '--gold':'#cc2020', '--gold2':'#e84040', '--bg':'#0d0808', ... },
  fantasma:     { '--gold':'#7799bb', '--gold2':'#aabbcc', '--bg':'#09090e', ... },
  // nova campanha: detectar a "alma" do universo e atribuir cores
};
```

Também adicionar overrides CSS `[data-camp="{id}"]` para elementos com cores hardcoded.

---

## Checklist de Instalação

Ao final de cada instalação, o Construtor entrega este checklist:

**Para cada classe:**
- [ ] Retrato feminino (`{nome}_f_retrato.png`)
- [ ] Retrato masculino (`{nome}_m_retrato.png`)
- [ ] Peça de tabuleiro feminina (`{nome}_f_peca.png`)
- [ ] Peça de tabuleiro masculina (`{nome}_m_peca.png`)
- [ ] Prompt de arte: `"{estilo do universo}, personagem de frente, {descrição da classe}, sem fundo"`

**Para cada NPC:**
- [ ] Retrato (`{id}_retrato.png`)
- [ ] Peça de tabuleiro (`{id}_peca.png`)
- [ ] Prompt de arte: `"{estilo}, {descrição física do personagem}, expressão {personalidade}, sem fundo"`

**Para cada inimigo:**
- [ ] Retrato (`{id}_retrato.png`)
- [ ] Prompt de arte: `"{estilo}, criatura {descrição}, postura ameaçadora, sem fundo"`

**Para cada cenário:**
- [ ] Imagem de conversa (`{nome}/imagem/{nome}.png`) — perspectiva de dentro, atmosfera
- [ ] Imagem de batalha (`{nome}/imagem/{nome}_batalha.png`) — vista de cima ou diagonal

---

## Cenários — Tipos, Arte e Documentação

### Dois tipos de imagem por cenário

Cada cenário tem duas imagens com funções diferentes:

**1. `cenarios/conversacao/{id}/imagem/{id}.png`**
- Usada em: narração, diálogos, cinemáticas, telas de transição
- Perspectiva: cinematográfica, "dentro da cena", como um quadro de jogo
- Pode ter silhuetas, iluminação dramática, profundidade de campo
- Proporção: landscape ou portrait
- Estilo: painterly, ilustração RPG, atmosfera em primeiro lugar

**2. `cenarios/batalha_hex/{id}/imagem/{id}.png`**
- Usada em: `arena.html` como fundo do mapa hexagonal de combate
- Perspectiva: **isométrica 3/4** — câmera ligeiramente inclinada (estilo Fire Emblem / Tactics Ogre)
- **Sem personagens** — personagens e peças são sobrepostos pela engine em tempo real
- O terreno é o assunto: obstáculos, elevação, cobertura, zonas de perigo
- Evitar: elementos muito altos no centro (bloqueiam sprites), contraste de chão excessivo (dificulta leitura das peças)
- Proporção: quadrada ou landscape 16:9
- Estilo: isométrico painterly, Fire Emblem HD

### Quando gerar batalha_hex

O campo `temBatalha` em `campaign.js` define isso:

```javascript
temBatalha: true   // → criar cenarios/batalha_hex/{id}/
temBatalha: false  // → apenas cenarios/conversacao/{id}/ (cena narrativa)
```

Cenários sem batalha (diálogo puro, revelação, transição de ato) **não precisam** de mapa de hexágono.

### Prompt base para batalha_hex

```
Isometric tactical RPG battle map, top-down 3/4 view,
[descrição do terreno — o que é visível, qual é a iluminação, quais são os obstáculos táticos],
no characters, clear ground plane for token placement,
[paleta de cores],
painterly fantasy art, Fire Emblem HD style
```

---

### Catálogo de Cenários — Mhoried (referência canônica)

Organizado por ato. Para cada cenário: tipo, inimigos se aplicável, e prompt de arte de batalha quando `temBatalha: true`.

---

#### Ato 1 — Chegada a Mhoried

| ID | Título | Tipo | Inimigos |
|---|---|---|---|
| `prologo` | Prólogo — O Mundo de Ygdis | conversação | — |
| `mhoried_market` | A Feira de St. Phanourios | conversação + **batalha** | Espantalhos de Choir |
| `castelo_mhoried` | O Castelo de Mhoried | conversação | — |

**batalha_hex · `mhoried_market`**
> Isometric tactical RPG battle map. Medieval fantasy town market square, golden afternoon light. Cobblestone plaza with market stalls and colored awnings in loose grid. Some stalls overturned, cloth banners torn, spilled grain and broken barrels on the ground. Wooden scarecrow figures visible in the background (inert, decorative). Stone well at center. Low wooden fences dividing stall sections. Warm autumn palette — amber, rust, cream. Clear open paths for tactical movement. No characters. Fire Emblem HD style, painterly fantasy.

---

#### Ato 2 — Os Blackwoods

| ID | Título | Tipo | Inimigos |
|---|---|---|---|
| `blackwoods_entrada` | A Entrada dos Blackwoods | conversação | — |
| `carroça_tombada` | A Carroça Tombada | conversação | — |
| `encruzilhada` | A Encruzilhada | conversação + **batalha** | Blackwoods Boar |
| `dominio_wulfram` | O Domínio de Wulfram | conversação | — |
| `ruinas_piromante` | Ruínas do Piromante | conversação | — |
| `choupana_mutter` | A Choupana de Mutter | conversação | — |
| `cnoc_na_rithe` | Cnoc na Ríthe | conversação | — |
| `bosque_afogado` | O Bosque Afogado | conversação + **batalha** | Elfos Negros |
| `campo_aranhas` | O Campo das Aranhas | conversação + **batalha** | Aranhas Gigantes |
| `acampamento_elfico` | O Acampamento Élfico | conversação + **batalha** | Guerreiros Vhuureth |
| `kobolds_dissidentes` | Os Três Kobolds da Clareira | conversação | — |
| `manticore_grounds` | O Território da Manticore | conversação + **batalha** | Albino Manticore |
| `great_grub_carcass` | A Carcaça do Grande Verme | conversação + **batalha** | Log-Wife |
| `weepers_well` | O Poço que Chora | conversação | — |
| `drowned_grove` | O Bosque Afogado (Castellet Malvoisin) | conversação + **batalha** | Mudwallowers + Quay Grabber + Crab Zombies |
| `ruins_simithari` | As Ruínas de Simithari | conversação + **batalha** | Marrowwithers |
| `kobold_town` | A Cidade Kobold | conversação + **batalha** | Kobolds de Blunkin |
| `ysoria_revelacao` | O Nome que a Floresta Guarda | conversação + **batalha** | Ysoria (espírito corrompido) |
| `sepultura_jariella` | A Sepultura de Jariella | conversação | — |
| `twinfold_hollow` | O Vale Dual | conversação + **batalha** | Barkthreshers |

**batalha_hex · `encruzilhada`**
> Isometric tactical RPG battle map. Forest crossroads on a muddy dirt road, overcast midday light — diffuse, flat, no dramatic shadows. Four paths meeting in a rough clearing. Old rotting signpost at center, leaning. Dense undergrowth at each road edge — brambles and low shrubs. Large exposed tree roots and rocks as natural obstacles. Soft muddy ground with boar tracks churned into the earth approaching from one direction. Cart wheel ruts in the mud. Patches of tall grass. Muted autumn palette: brown mud, faded green, bark grey. Feels ordinary and open — the danger comes from outside the frame. No characters. Isometric battle map, Tactics Ogre style.

**batalha_hex · `bosque_afogado`**
> Isometric tactical RPG battle map. Dense forest path at dusk, cool blue-grey light filtering through dark canopy. Ancient twisted oaks lining a narrow trail, roots bulging through mossy ground creating natural cover. Low undergrowth with patches of luminescent mushrooms — blue-green glow. Fallen log across the path — ambush point. Soft dark earth with puddles. Tall elven carved stone markers partially overgrown at trail edges. Moody and oppressive but not fully dark — last light of evening. No characters. Tactics Ogre style, isometric 3/4 view.

**batalha_hex · `campo_aranhas`**
> Isometric tactical RPG battle map. Open forest clearing overrun by massive spider webs. Web strands stretch between tree trunks and low branches creating a half-canopy that shadows the ground. Ground: dry leaves, white silk-wrapped cocoon bundles (animal prey), bare dark earth. Large tree stumps at irregular intervals — cover and elevation. Bright daylight above filtered through webs into pale white diffused light. Web anchors create natural grid subdivisions. Color: silver-white webs, pale brown earth, deep green forest. Striking, not claustrophobic. No characters. Isometric tactical view, Fire Emblem HD painterly style.

**batalha_hex · `acampamento_elfico`**
> Isometric tactical RPG battle map. Ancient elven forest encampment, late afternoon golden light. Semi-permanent camp: elegant pavilion tents of deep green and silver cloth between massive ancient trees. Glowing elven lanterns on branches — soft cyan light. Cold central fire pit. Training dummies and weapon racks at the edges. Low rope barriers marking perimeter. Carved stone dais with empty high-backed chair. Ground: thick moss and fallen silver leaves. Regal but militarized — a command post. Color: deep forest green, silver, amber wood, cyan light accents. No characters. Isometric RPG battle map, Tactics Ogre style.

**batalha_hex · `manticore_grounds`**
> Isometric tactical RPG battle map. Open rocky hillside clearing within the Blackwoods, midday light — bright and exposed. Large flat rocks and boulders scattered for cover. Sparse dead trees with deep claw marks in the bark. Bones of large animals half-buried in dirt. White fur tufts snagged on thorny bushes. One corner: carcass of a large black stag on the ground — the bait. Natural rock formation creating elevated position on one side. High grass at the edges. Color: slate grey rocks, dry brown earth, white bone, sparse muted green. Bright and open — nowhere to hide from aerial attack. No characters. Isometric battle map, Fire Emblem HD style.

**batalha_hex · `great_grub_carcass`**
> Isometric tactical RPG battle map. Ancient stone wall (partially collapsed) encircling a cursed clearing. At center: the enormous decomposing carcass of a giant larva — larger than a house, grey-green and deflated, crushing vegetation beneath it. Necrotic runes carved into surrounding stones glow faintly sick yellow-green. Ground around the carcass churned and disturbed — something has been pulling from below. Ground cracks radiate outward from the carcass center (danger zones). Luminescent mushrooms growing in a spiral on one dead tree stump (the ingredient). Stone wall sections of varying height create perimeter cover. Color: stone grey, rot-green, sick yellow runes, dark earth, glowing blue mushrooms. No characters. Isometric battle map, tactical RPG style.

**batalha_hex · `drowned_grove`**
> Isometric tactical RPG battle map. Flooded forest clearing with shallow dark water covering most of the ground (ankle to knee depth). Dead and twisted trees emerge from the water — bare black branches. Ruins of an ancient elven stone tower at center, partially submerged, mossy and crumbling. Stepping stones and exposed tree roots provide dry footing in a maze pattern. Submerged rubble creates uneven depth. Mist at water level. Murky green-black water with surface reflections. Atmosphere: grey overcast light, eerie stillness, slight luminescence from underwater ruins. Color: dark green, grey stone, black water, pale sky. Mixed terrain (dry/wet) tactical challenge. No characters. Isometric battle map, painterly fantasy style.

**batalha_hex · `ruins_simithari`**
> Isometric tactical RPG battle map. Hilltop ruins of a white elvish stone structure, early morning grey light. Cracked marble columns at irregular intervals — some fallen, some standing, all scorched with ancient fire damage. Stone floor tiles broken and uneven, with holes punched through to dark underground space below (spawn points). Crows perched on every horizontal surface. Overgrown with dark ivy and lichen. Stone lectern at center with open ash-dusted grimoire. Collapsed archway forming a low barrier. Slight elevation variation — raised central platform. Color: white/grey bleached stone, dark ivy, soot stains, pale morning sky. Unsettling cleanliness. No characters. Isometric battle map, painterly style.

**batalha_hex · `kobold_town`**
> Isometric tactical RPG battle map. Underground kobold settlement carved into cave rock, torch-lit with warm orange-red glow. Low ceiling with stalactites. Structures from scrap wood, salvaged crates and barrels stacked as walls and towers. Narrow winding alleys between buildings. Central open plaza with wooden platform. Iron cage hanging from a stalactite — empty but significant. Cooking fires, tribal flags in orange and brown. Crude rope bridges over a small ravine crossing the map. Ground: packed dirt, loose gravel, puddles reflecting torchlight. Chaotic and cramped, full of tactical variety. Color: deep ochre, burnt orange, cave grey. No characters. Isometric battle map, Fire Emblem style.

**batalha_hex · `ysoria_revelacao`**
> Isometric tactical RPG battle map. Druidic stone circle in a forest clearing where the trees lean away from the center as if recoiling. Standing stones in a ring, some cracked from the inside out. Ground at center: bare dark earth with dead grass in radiating spiral. Outer ring: dense forest with trees warped at unnatural angles. Stone surfaces covered in carved symbols — some old and faded, some fresh and raw. Fallen stones as terrain obstacles. Ground cracks running outward from the inner circle. Desaturated greens, purple-grey sky, stones slightly phosphorescent. Danger radiates from the center. No characters. Isometric battle map, Fire Emblem HD painterly style.

**batalha_hex · `twinfold_hollow`**
> Isometric tactical RPG battle map. Ancient forest hollow with massive trees whose bark is carved with humanoid faces — some serene, some in anguish. Central ground: field of white luminescent flowers (Starshade Blooms) in clusters among the roots — glowing soft white-blue even without sun. Tree roots above ground create natural barriers and elevated footing. Some trees dead and hollow — cover. Two sides of the map feel different: one lighter (warm bark, green moss), one darker (twisted roots, deep shadow). The flower glow creates a magical, alien combat space. Color: dark bark brown, glowing white-blue flowers, soft green, deep shadow. No characters. Isometric battle map, painterly fantasy, Studio Ghibli tactical RPG aesthetic.

---

#### Ato 3 — O Gloamreach

| ID | Título | Tipo | Inimigos |
|---|---|---|---|
| `gloamreach` | O Gloamreach | conversação + **batalha** | Thools + Alquimistas de Choir |

**batalha_hex · `gloamreach`**
> Isometric tactical RPG battle map. Underground temple entrance hall, ancient elven architecture corrupted by necromantic use. High carved stone arches with runes glowing sickly violet. Central chamber with raised ritual platform — altar with alchemical apparatus (glass tubes, dark liquid). Stone pillars creating cover corridors. Alcoves in the walls occupied by shadows. Floor: polished dark stone with runic diagrams etched in glowing lines. Flickering magical torches in wall sconces casting green-purple light. Door at the back sealed by a magical glyph. Color: deep stone grey, violet rune light, greenish shadow. Oppressive grandeur. No characters. Isometric tactical RPG map, painterly style.

---

#### Ato 4 — A Torre de Limm

| ID | Título | Tipo | Inimigos |
|---|---|---|---|
| `torre_limm` | A Torre das Estrelas de Limm | conversação + **batalha** | Rei Chutter + Golems de Pergaminho |

**batalha_hex · `torre_limm`**
> Isometric tactical RPG battle map. Circular throne room at the top of a dark stone tower — open to the sky above (starless, shadows pointing the wrong direction). Central raised dais with a twisted throne of black iron and yellowed parchment. Concentric floor rings of carved runes glowing deep red. Shattered stone columns around the edges — partial cover. Stacks of massive old tomes and rolled scrolls as terrain obstacles. Narrow walkway ringing the outer edge with a sheer drop implied. Wind-torn banners of black cloth. Color: dark stone, deep crimson runes, pale moonlight from above, yellow-ivory of old parchment. Dramatic and final. No characters. Isometric battle map, Fire Emblem HD style.

---

## Campanhas Instaladas

| ID | Nome | Status | Paleta |
|---|---|---|---|
| `mhoried` | Mhoried | ✅ Completa (referência) | Dourado/âmbar |
| `death-note` | Death Note | ✅ Dados + arte completos | Vermelho/preto |
| `fantasma` | C. Fantasma | 🔲 Placeholder (esqueleto) | Cinza espectral |

---

## Tecnologias do Sistema

| Função | Tecnologia |
|---|---|
| Hosting | GitHub Pages (branch `main`) |
| Banco de dados (multiplayer) | Firebase Firestore |
| Narração / voz dos NPCs | Groq API (`oraculo.groqKey` no localStorage) |
| Builder / Construtor | Claude (aqui, no Claude Code) |
| Arte de personagens e cenários | IA de imagens (Midjourney, DALL·E, etc.) |

---

## Campanhas de Referência para Novos Universos

Ao instalar uma campanha, perguntar:
- Qual é o **estilo de arte** dominante? (anime, fantasy, cyberpunk, horror, western, noir)
- Qual é o **tom emocional** principal? (épico, sombrio, investigativo, aventura, tragédia)
- Quais são as **mecânicas especiais** do universo? (poderes de ki, shinigami, magia arcana, tecnologia)
- Existem **regras de combate específicas** que diferem do sistema padrão Oráculo?

Adaptar os stats das classes e as habilidades para refletir o universo — um personagem de Dragon Ball tem ki e transformações; um personagem de Death Note tem inteligência como stat principal.
