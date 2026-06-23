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
