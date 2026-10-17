# Reconstrução a partir do Oráculo

Fonte: `docs/o_oraculo.md`, `docs/REGRAS_CONVERSA.md`, motor de diálogo de
`public/narration.html` e campanha `public/catalogo/mhoried/campanha/roteiro/`.

Esta entrega corrige o ciclo central de conversa. Não representa paridade integral
com os cinco pilares nem uma implementação completa do GURPS.

## Ciclo implementado

1. A ordem de jogadores vem da sala. Um jogador envia uma fala ou ação testada.
2. O anfitrião conectado chama a mesma API Groq do Oráculo automaticamente.
3. A IA recebe campanha, cena, perfis dos presentes, histórico, resultados
   imutáveis de 3d6 e memória cumulativa. Pode responder por vários NPCs presentes.
4. As intervenções e a memória são confirmadas juntas numa transação Firestore.
   Uma concessão temporária por ação evita chamadas simultâneas por duas abas.
5. O próximo jogador recebe a vez após a resposta. O anfitrião pode ler as
   intervenções em sequência. O local só muda por viagem explícita.
6. Falhas de API não geram falas falsas nem liberam o turno. É possível tentar
   novamente. Uma concessão abandonada expira e pode ser retomada.

`narratorEngine.js` concentra o contrato de conversa e montagem de contexto.
`firebaseRepository.js` sincroniza os dados em `mindRooms`. `worldState.summary`
e `worldState.npcs` preservam continuidade além da janela de histórico. Só o
anfitrião precisa da chave `oraculo.groqKey`; ela não é gravada no Firestore.
O anfitrião precisa manter o aplicativo aberto para executar as chamadas.

## Validação desta entrega

- `node --test MindRolePlay/tests/narrator.test.js`: ciclo individual, múltiplos
  NPCs, memória, rejeição de resposta inválida, troca de cena durante chamada,
  erros de API e as 216 combinações de 3d6 para cada nível de 3 a 22.
- `npm run build`: compilação de Oráculo e MindRolePlay.
- Não validado nesta execução: conversa real com uma chave Groq, concorrência
  contra Firestore real e apresentação no navegador.

## Paridade ainda necessária

- Migrar o pacote Kagehama ao esquema completo de cartucho do Oráculo
  (`dados.json`, registro gerado, roteiro, mapa e encontros).
- Reproduzir integralmente criação de personagem e catálogo do Oráculo,
  adaptando os atributos, perícias e pontos para GURPS.
- PASSAR, SATISFEITO, reengajamento, votação de rota, névoa e acompanhantes.
- GURPS completo: custos de ficha, testes resistidos, reação, defesa, dano,
  condições, turnos de combate e magia. Esta entrega cobre testes de sucesso.
- Auditar os quatro atos de Mhoried e a adaptação japonesa cena a cena.
- Realizar uma sessão ponta a ponta, solo e com dois jogadores.
