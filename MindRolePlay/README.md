# Mind RolePlay — base Oráculo

O acesso usa as telas e a lógica de `index.html` e `src/main.js` do Oráculo,
transpostas para `MindRolePlay/index.html` e `src/oraculoEntry.js`.

Fluxo: campanha → Jogar → quatro espaços de aventureiros → criação ou seleção
→ criar/entrar em sala → espera → narração → mapa → narração.
Solo usa a mesma sala com um participante, como no original.

## Identificação

`mindRolePlay.playerId` identifica o jogador neste navegador e é independente
 do personagem. `mindRolePlay.characters` guarda os quatro espaços locais;
`mindRolePlay.character` é a ficha selecionada. A sala identifica participantes
pelo ID do jogador, guarda a ficha utilizada e define o anfitrião em `hostId`.
`Continuar Aventura` retoma a sala salva, sem reinicializar a campanha.
Não há cadastro com senha: este é o mesmo modelo local do Oráculo.

O banco reutiliza a configuração Firebase e a coleção autorizada `mindRooms`,
com o marcador `engine: oraculo-kagehama-v2`. Salas do protótipo anterior não são
convertidas silenciosamente porque tinham outro formato de jogadores/estado.
As salas e identificações do Oráculo permanecem separadas.

## Motores e campanha

`public/MindRolePlay/narration.html`, `mapa.html` e `catalog.html` são transposições
das páginas originais: diálogo por turno, confirmação de leitura, respostas
Groq, reações de outros NPCs, percepção, investigação, votação de rota,
névoa de descoberta, formação e viagem, catálogo e checklist.

O cartucho reside em `public/MindRolePlay/catalogo/kagehama/`, no esquema
Oráculo: `classes.js`, `loader.js`, `npcs_registry.js`, `narracao.js`, `mapa.js`,
`encontros.js`, `campanha/roteiro/campaign.js`, roteiro legível e `dados.json`.
As artes já existentes são reutilizadas sem alteração.

As telas preservam a estrutura original; a campanha e as fichas usam Kagehama.
Os testes de percepção e ação usam o mesmo resolvedor determinístico GURPS
3d6 do projeto. O compositor original permite Falar ou Agir com uma perícia ou
atributo da ficha; o resultado acompanha a intenção enviada ao NPC.
A arena tática antiga não foi exposta: confrontos permanecem na cena narrativa,
conforme o escopo anterior sem arena. Isso não implementa o livro inteiro GURPS.

O anfitrião aberto executa as chamadas Groq com `oraculo.groqKey`, a mesma
configuração local usada pelo Oráculo. Só o anfitrião precisa da chave.

## Gerar, verificar e publicar

```bash
npm ci
npm run build:mind-cartridge
npm run test:mind
npm run build
```

`scripts/build-mind-oracle.mjs` transpõe as fontes originais e gera o cartucho;
`scripts/adapt-mind-oracle.py` aplica as adaptações explícitas de Kagehama/GURPS.
A publicação segue o GitHub Pages do repositório; não usa outro Site ou serviço.
