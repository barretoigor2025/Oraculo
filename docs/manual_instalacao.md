# Manual de Instalação de Campanha — Oráculo

Guia prático + **matriz de auditoria** para instalar qualquer campanha nova seguindo o padrão
já consolidado (referência: **Mhoried**). Leia junto com `o_oraculo.md` (a matriz conceitual e
os schemas). Este documento é o **checklist operacional**: cada ponto de atenção aqui nasceu de
um bug real que enfrentamos — segui-lo evita repetir.

---

## 0. Fluxo resumido

1. Ler `o_oraculo.md` inteiro (arquitetura, 5 pilares, schemas).
2. Analisar o material-fonte (PDF/universo) — personagens, história, regras especiais.
3. Gerar `public/catalogo/{id}/`: `campaign.js`, `npcs/*/dados.json`, `npcs_registry.js`,
   `classes.js`, `narracao.js`, `mapa.js`, `encontros.js`.
4. Gerar/instalar arte (retratos, peças, fundos de conversação, mapas de batalha, imagem do mundo).
5. Registrar no `catalog.html` (menu + imports + paleta).
6. **Rodar a matriz de auditoria abaixo.**
7. Commit → merge `main` → confirmar deploy verde.

---

## 1. Matriz de Auditoria (pontos de atenção)

### 🎭 Voz e coerência dos personagens
- [ ] **Bloco `ia` × campos de topo batem.** A narração ao vivo usa `ia.personalidade` / `ia.prompt_sistema` com **prioridade**. Se o topo diz "caçadora" e o `ia` diz "corretora", a IA gera falas contraditórias. *(bugs Ysoria e Aelar.)*
- [ ] **As TRÊS fontes de dados batem.** Um NPC/inimigo tem os dados repetidos **inline** em três lugares: `dados.json` (canon), `npcs_registry.js` (narração ao vivo, fallback) e `loader.js` (o que o **catálogo** mostra). Ao editar um, atualize os três — senão o jogo/catálogo mostra versão antiga. *(bug do Chutter: mudei dados.json + registry mas o catálogo continuava 'Troll' porque o loader.js não foi tocado.)*
- [ ] **Espécie/raça consistente** entre topo, `ia` e bestiário. *(Blunkin: kobold ≠ goblin; Chutter: ettin ≠ troll.)*
- [ ] **Papel/profissão consistente.** *(Finn: mercador ≠ sapateiro; Murznut: lojista ≠ "do trio".)*
- [ ] **Cada `falaEntrada` carrega a assinatura do personagem** (a `formaDeFalar` dele). Nada de fala genérica. *(Mutter deve rimar/farejar; Gregoras direto mas cortês; a Duquesa não despeja a missão de cara.)*
- [ ] **Lógica da cena fecha.** Ex.: um NPC não pode "vender a localização" de alguém que ele mesmo está caçando e não achou.
- [ ] **A arte bate com os dados.** A imagem (retrato + peça) reflete a **espécie, o número de cabeças/membros, o gênero e as características físicas** descritas nos dados. Não basta o texto ser coerente entre si — a imagem tem que refletir o lore. *(Rei Chutter: dados = ettin de 2 cabeças, mas a arte tinha só 1.)* Ao corrigir raça/aparência de um personagem, verifique se a **arte precisa ser refeita**; e ao trocar a arte, atualize também **raça, características, comportamento e lore** no bestiário/catálogo (`inimigos/{id}/dados.json`) e no `npcs/{id}/dados.json` — não só o retrato.

### 🎬 Cenas e roteiro (`campaign.js`)
- [ ] **Toda cena tem `imgExterior`/`imgInterior`** apontando para arquivo existente. **A narração usa ISSO — não o mapa de batalha.** Uma cena de batalha/emboscada com mapa de batalha mas SEM `imgExterior` mostra "arte em breve" na entrada. Audite o `imgExterior` real de cada cena, não "tem alguma imagem". *(bug: encruzilhada/emboscadas tinham mapa de batalha mas o fundo de conversação não estava ligado.)*
- [ ] **Cena de imagem "arte em breve" mesmo com arquivo válido no `main`** = cache negativo do navegador. Bump do `_IMGVER` (narração) / `?v=N` da imagem força re-fetch.
- [ ] **`npcsPresentes` preenchido** com IDs de NPCs que existem em `dados.json`.
- [ ] **`proximaCena` / fluxo** sem becos sem saída (todo ato avança). Rodar a checagem de alcançabilidade.
- [ ] **`tipo` correto.** `tipo:'emboscada'` **auto-dispara** o combate 2.6s após a chegada — só use em emboscada pura, sem intro/gancho manual. Cena com intro + "Estou Pronto" deve ser `tipo:'batalha'`. *(bug da Feira pulando pra batalha.)*
- [ ] **Ganchos têm payoff.** Toda pista relevante (`beatNarrativo`, item, percepção) deve levar a algo — sem fios soltos. *(arco do javali/Naeryn, carroça/Dvalinn.)*

### 🔍 Percepção e Investigação
- [ ] Cenas de investigação sem NPC marcadas `investigacao: true` (ou `tipo` descoberta/exploracao sem `npcsPresentes`) para subir o Painel de Investigação.
- [ ] `percepcao` / `gatilhos_entrada` com `descricaoContexto` (a pista) e `textoFallback`.
- [ ] Percepção **não** deve auto-disparar em loop nem forçar na entrada de cena de investigação (o jogador usa o botão 🎲).

### 🗺️ Mapa do Mundo (`mapa.js`)
- [ ] **IDs dos nós (`NOS`) = IDs de cena** do `campaign.js` (é assim que viajar abre a cena certa).
- [ ] Cenas auxiliares (sem nó próprio) usam `nodeId` para apontar o nó do mundo.
- [ ] NPC que acompanha o grupo numa viagem → `companheirosViagem: ['npc_id']` na cena de origem.
- [ ] Imagem do mundo `mapa/{id}_mapa.png` (~2:1, scroll horizontal).

### ⚔️ Batalha (`encontros.js`)
- [ ] Roster por **ID de cena**; mapa de batalha e terreno apontados.
- [ ] **Criaturas únicas** no `Set UNICOS` — não podem aparecer em duplicata numa batalha.

### ⚖️ Balanceamento de combate
- [ ] **Toda criatura nova entra na tabela `_INIMIGO_ARENA`** (arena.html) com hp/dano/alcance/atkMod na **escala da arena** — heróis têm 60–110 HP e batem ~3,5–11 por golpe. Conversão a partir do bestiário GURPS: `hp = g.hp × 3` (boss ×4), dano `Xd` GURPS → `Xd6`, `atkMod ≈ perícia − 10`. Sem entrada na tabela, a criatura cai num fallback fraco. *(bug: todos os inimigos batiam 1d6 fixo e tinham HP GURPS 8–22 — kobold = boss, zero desafio.)*
- [ ] **Habilidade sem efeito mecânico não entra.** Buff/cura precisa MUDAR estado (caBonus, danoBonus, hp) — animação sozinha não é habilidade. *(bug: Fúria, Postura, Escudo e a CURA do Clérigo eram só animação; o Clérigo pagava 20 SP por nada.)*
- [ ] **Cada classe com uma assinatura que muda a decisão de jogo** (Bárbaro fúria, Guerreiro postura, Mago área+escudo, Clérigo cura em aliado, Ladino flanco, Arqueiro alcance). Se duas classes jogam igual, uma delas está mal desenhada.
- [ ] **Sem estratégia degenerada**: alcance de ataque vs. mov dos inimigos não pode permitir kite infinito (atirar e recuar sem nunca ser alcançado).
- [ ] **Aritmética de desafio**: estimar golpes-para-matar dos dois lados (dano médio × acerto vs. HP). Alvo: mob comum cai em 3–5 ações do grupo e ameaça de verdade um herói frágil exposto (~3 pancadas no mago); boss exige o kit inteiro do grupo.
- [ ] **DR/CA aplicados de fato** no cálculo (DR subtrai do dano, mín. 1; buffs de CA entram no teste de acerto e expiram por turno).

### 🖼️ Assets (peso, cache, nomes)
- [ ] **Imagens comprimidas** (paleta 256 + dithering; mantém nome/dimensão/transparência). Site leve — senão o **deploy do Pages falha na sincronização**.
- [ ] **Sem caracteres não-ASCII em caminhos de arquivo** (`ç`, acentos). O **id** da cena pode ter acento; o **caminho do asset**, não (`carroca_tombada`).
- [ ] **Cache-bust** (`?v=N`) nos imports de `campaign.js`/`npcs_registry.js` e nas imagens de cenário; bumpar N quando o arquivo muda. Carimbo de versão visível no rodapé de cada página.
- [ ] Rodar a aba **✓ Check** do catálogo → "Todos os assets presentes".

### 🚀 Deploy (GitHub Pages)
- [ ] Build passa (`npm run build`); artefato sobe.
- [ ] Se `deploy-pages` falhar com **"Deployment failed, try again later"** → é transitório do Pages. **Re-disparar com commit novo** (NUNCA "re-run failed jobs" — duplica o artefato: `Multiple artifacts named github-pages`).
- [ ] Confirmar deploy **verde** antes de considerar publicado.

---

## 2. Comandos de verificação úteis

```bash
# Parse de campaign.js / npcs_registry.js (pega erro de sintaxe antes do commit)
node --input-type=module -e "import('./public/catalogo/{id}/campanha/roteiro/campaign.js').then(()=>console.log('OK'))"

# Sintaxe dos <script type=module> de um HTML grande (narration/arena/mapa):
#   extrair os blocos e rodar node --check

# Alcançabilidade: cruzar CENAS_ORDEM × NOS (mapa) + proximaCena → nenhuma cena órfã
# Coerência de voz: para cada dados.json, comparar personalidade (topo) × ia.papel × ia.prompt_sistema
# Checklist de assets: aba ✓ Check do catalog.html (probe de cada imagem esperada)
```

---

## 3. Regra de ouro

Nunca inventar elementos de fora do universo da campanha. Expansão canônica sim, crossover não.
Cada personagem com a **assinatura própria**; cada gancho com **payoff**; cada asset **leve e ASCII**;
cada deploy **confirmado verde**.
