# Reconstrução do Mind RolePlay a partir do Oráculo

## Base verificada

Referências lidas: `docs/o_oraculo.md`, `docs/REGRAS_CONVERSA.md`,
`docs/manual_instalacao.md`, roteiro de Mhoried e roteiro de Kagehama.
A adaptação reutiliza a entrada, catálogo, mapa e motor de exibição do Oráculo.
A campanha japonesa e a arte existente permanecem no cartucho Kagehama.

| Área | Fonte Oráculo | Implementação Mind |
|---|---|---|
| Entrada, quatro espaços, criação, lobby | `index.html`, `src/main.js` | `MindRolePlay/index.html`, `src/oraculoEntry.js` |
| Identidade independente do personagem | `oraculo.playerId` | `mindRolePlay.playerId`; UUID com Web Crypto também na prévia HTTP |
| Salas e anfitrião | `src/firebase/roomService.js` | `src/oraculoRooms.js`; coleção `mindRooms`, transações e `hostId` |
| Diálogo, leitura, palco e interlocutores | `public/narration.html` | `screens/narration.html` + `engine/conversation.js` |
| Personalidade, história, memória e reação | `dados.json`, registry e prompts | `engine/director.js`, perfil individual e `direction.js` por cena |
| Mapa, votação, viagem e descoberta | `public/mapa.html` | `public/MindRolePlay/mapa.html` |
| Catálogo, dados e checklist | `public/catalog.html` | `public/MindRolePlay/catalog.html` e `catalogo/kagehama/` |
| Resolução de sucesso | testes do Oráculo | `src/gurps.js`, 3d6 e críticos calculados pelo programa |
| Confronto | ciclo cena → arena → cena | `screens/arena.html`, `engine/combat.js`, estado `room.combat` |

## Conversa viva

1. O jogador da vez escolhe um NPC presente e envia sua fala/ação.
2. A fala é gravada em uma transação. Outro envio não sobrescreve o histórico.
3. Apenas o anfitrião obtém a concessão temporária de geração para aquela fala.
   Duas abas do anfitrião não geram duas respostas para o mesmo evento.
4. O prompt inclui o perfil do NPC, sua voz, objetivo, medo e limites, direção
   específica do capítulo, jogadores presentes, histórico comum e memória do NPC.
5. A resposta só é confirmada se a cena e a fala de origem continuam atuais.
   Resposta e memória são gravadas juntas. Erros deixam a fala pendente para tentar
   novamente; não são substituídos por uma fala inventada pelo aplicativo.
6. Cada pessoa lê a fala e clica **Continuar** para ver a próxima intervenção.
   A IA pode preparar a resposta antes, sem pular o cartão do jogador.
7. A próxima vez só é liberada após a resposta e a leitura dos participantes ativos.

**Passar vez** pula uma rodada. **Satisfeito** sai da fila; **Voltar à conversa**
reingressa por escolha do jogador. Um NPC pode convidar alguém de volta, sem
obrigá-lo. Reações opcionais usam o histórico comum e não formam loops entre NPCs.
Somente quem está falando é revelado no palco: jogador à esquerda, NPC à direita.
Consequências do narrador também são exibidas com Continuar.

O histórico recente mantém até 200 eventos com sequência absoluta. Confirmações
usam essa sequência, não o comprimento do array: ao ultrapassar o limite, a
conversa continua e os leitores não ficam presos no índice 200.

Compartilhar o código também permite convidar alguém após iniciar a campanha.
O novo participante recebe a cena atual sem reiniciar história, fichas ou memória.
Reentrar preserva as perícias, condições e atributos já salvos, além dos PV.

## Campanha em execução

`direction.js` fornece, para os 13 capítulos, objetivo, fatos, alternativas,
pistas e riscos. Ele liga a preparação existente às chamadas reais de IA.
A rede de pistas tem fontes alternativas; uma falha opcional de Percepção não
bloqueia o capítulo. Uma prova não comprova automaticamente a culpa de todos os
envolvidos. O roteiro futuro é orientação do mestre, não conhecimento universal.
A memória por NPC registra cena, interlocutor, pergunta, resposta e resultado
mecânico quando houver; acompanha o NPC entre locais.

A campanha aproveita a estrutura de Mhoried (conspirações simultâneas,
testemunhas, identidade oculta, dívidas e vínculo espiritual), no universo de
Kagehama. Personagens de Mhoried não foram transportados para o Japão fictício.

## Regras GURPS disponíveis e limites

- ST, DX, IQ, HT, PV, PF, Per, Will, Velocidade Básica, Movimento e Esquiva.
- Testes de sucesso em 3d6, modificadores e críticos; condições podem afetar só
  as perícias indicadas. Dados e resultados são campos separados da fala escrita.
- Fala comum sem dados. NPC pode pedir uma perícia, modificador e motivo antes
  de conceder uma tentativa social incerta. Se a ficha não contém a perícia,
  o mestre define o nível por omissão **antes** da rolagem; não se inventa IQ.
- Iniciativa por Velocidade Básica e DX; ataque, Ataque Total determinado,
  Defesa Total, esquiva/aparo/bloqueio, dano da arma, RD, multiplicador por
  tipo de lesão, choque, atordoamento, recuperação e verificações de HT.
- Recarregar arco e levantar-se consomem manobra. Armas comuns não causam dano
  a uma entidade incorpórea; resolver o vínculo continua sendo parte da ficção.
- PV/PF, condições e registro do confronto retornam à sala e à narração.

Este é um **núcleo automatizado**, não o livro inteiro GURPS. Tabelas de críticos
precisam da decisão do mestre; a interface registra essa decisão. Modificadores
de alcance, cobertura e posição são confirmados antes da ação. Não há automação
completa de magia do Basic Set/Magic, compra de vantagens/desvantagens/perícias
por pontos, carga, todos os ferimentos/localizações ou grid tático. Os modelos
de classe são os arquétipos preparados de Kagehama, não fichas construídas por
um editor completo de pontos. O mestre continua necessário nesses casos.

Referência: GURPS Lite, quarta edição, Steve Jackson Games:
https://warehouse23.com/products/gurps-lite-fourth-edition

## Fontes mantidas e geração

- `MindRolePlay/screens/`: narração, confronto e entrada mantidos. A narração
  preserva o motor visual original, com as correções documentadas acima.
- `MindRolePlay/engine/`: conversa, prompts, confronto, equipamento e identidade.
- `MindRolePlay/src/gurps.js`: resolvedor compartilhado pelas superfícies.
- `MindRolePlay/src/campaigns/kagehama/`: conteúdo e direção canônicos.
- `scripts/build-mind-oracle.mjs`: geração do cartucho e transposição inicial.
- `scripts/adapt-mind-oracle.py`: adaptação legada das telas originais.
- `scripts/enhance-mind-oracle.py`: instala por último as fontes mantidas. Uma
  regeneração não apaga as correções posteriores do narrador e da entrada.

## Validação e pendências reais

`npm run test:mind` exercita a entrada, catálogo, sala, scripts estáticos,
modelo de turnos, todos os resultados possíveis de 3d6, memória, identidade,
confronto e o adaptador Firebase real executado sobre armazenamento transacional
simulado. Há casos de convidado, reentrada, leitura após retenção, concessão de
resposta, resposta duplicada e resposta atrasada de outra cena.

`npm run build` gera as duas entradas e inclui as páginas estáticas do Mind.
A reconstrução do cartucho deve ser reproduzível antes de publicar.

A prévia do navegador confirmou entrada, seleção e criação. O carregamento dos
módulos da tela de diálogo na prévia ficou bloqueado pelo navegador; não foi
usado como comprovação de sessão real. Testes simulados não comprovam permissões
publicadas no Firestore nem credenciais/cota da Groq. Essa sessão ponta a ponta
com dois dispositivos e serviços reais continua pendente. As regras Firebase
existentes não foram ampliadas nem publicadas por este trabalho.
