# Correspondência com o Oráculo

| Fluxo | Fonte original | Implementação Mind |
|---|---|---|
| Entrada, slots, criação e lobby | `index.html`, `src/main.js`, `src/styles.css` | `MindRolePlay/index.html`, `src/oraculoEntry.js`, `src/oraculoStyles.css` |
| ID persistente do jogador e slots locais | `oraculo.playerId`, `oraculo.characters` | `mindRolePlay.playerId`, `mindRolePlay.characters` |
| Sala por ID, jogadores por chave, anfitrião e início | `src/firebase/roomService.js` | `src/oraculoRooms.js`, transações e `hostId` explícito |
| Narração, diálogo por turno e reação de NPCs | `public/narration.html` | `public/MindRolePlay/narration.html` |
| Mapa, voto, descoberta e transição de cena | `public/mapa.html` | `public/MindRolePlay/mapa.html` |
| Catálogo, roteiro e checklist | `public/catalog.html` | `public/MindRolePlay/catalog.html` |
| Cartucho, registros e dados por entidade | `public/catalogo/mhoried/` | `public/MindRolePlay/catalogo/kagehama/` |
| Testes de ação/percepção | d20 do Oráculo | resolvedor GURPS 3d6 compartilhado |

As páginas antigas do protótipo Mind e o motor anterior permanecem no histórico
para compatibilidade de código, mas a entrada pública agora usa o fluxo Oráculo.
Não é uma reskin da tela anterior. As fontes originais ficam intactas.

## Validação

- Teste DOM: entrada → quatro espaços → criação entre 12 variantes de classe e
  gênero → lobby; ID estável, ficha individual e armazenamento separado.
- Teste DOM de inicialização e abas do catálogo com os dados de Kagehama.
- Verificação sintática dos scripts internos de narração, mapa e catálogo.
- Testes do resolvedor 3d6, limites críticos e contrato do motor anterior.
- Build Vite para as duas entradas do repositório.

Essas verificações não substituem uma sessão de navegador com Groq e Firestore
reais. Não houve afirmação de que essa sessão foi executada.
A arte de criaturas que ainda não existia continua pendente no checklist.
A arena não foi portada: o escopo anterior do projeto excluía arena; os confrontos
seguem como ações narrativas em GURPS. Regras completas de defesa, dano, magia e
custos de pontos continuam além do resolvedor atual de testes de sucesso.
