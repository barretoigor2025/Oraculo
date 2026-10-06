# Mind RolePlay

Um sistema de RPG independente, desenvolvido dentro de `MindRolePlay/` e inspirado no fluxo online do Oráculo. O foco será a narrativa: os jogadores escrevem o que seus personagens tentam fazer, enquanto o narrador conduz a campanha e a IA ajuda a interpretar contexto, capacidades e consequências.

## Começo do projeto

A página inicial segue a lógica de entrada do Oráculo: escolher a campanha, jogar online ou abrir o **Mind Database**. O sistema será construído do zero e terá identidade e regras próprias. O que será compartilhado com o Oráculo é a configuração Firebase/Firestore já existente para as salas online.

## Direção

- Campanhas narrativas com salas online para jogar com amigos.
- Ações escritas em texto livre, em vez de depender principalmente de cliques e combate tático.
- Cenários e personagens podem aparecer como imagens estáticas; a história é o foco.
- A IA consulta campanha, personagem, habilidades, vantagens, desvantagens e situação para ajudar a decidir se uma ação pede rolagem e quais modificadores se aplicam.
- O narrador mantém autoridade sobre o rumo da história.
- O sistema calcula os três d6 e apresenta a animação de dados do Oráculo; a IA ajuda a narrar a consequência.

## Mind Database

Cada campanha será um pacote próprio com roteiro, gênero e regras da campanha, classes/personagens jogáveis, NPCs, cenários, imagens, mapa geral e um checklist dos recursos que ainda precisam ser preparados.

## Referência GURPS

A mecânica básica de sucesso do GURPS usa 3d6 somados: em geral, o resultado precisa ser igual ou menor que a habilidade ou atributo efetivo, após modificadores. A soma vai de 3 a 18 e os resultados se concentram perto do meio, formando uma curva de probabilidades. Isso confirma a referência dos 3d6, mas o Mind RolePlay ainda definirá sua própria versão simplificada; não será necessariamente GURPS completo.

Referência oficial: [GURPS Lite — Steve Jackson Games](https://www.sjgames.com/gurps/lite/).

## Firebase e separação

O Mind RolePlay reutilizará a configuração Firebase/Firestore existente no Oráculo. Os dados de campanhas e salas do Mind devem ficar em estruturas próprias, sem alterar as salas nem os dados do Oráculo. A integração online ainda precisa ser implementada.

## Estado atual

- [x] Pasta própria e visão inicial do projeto.
- [x] Protótipo navegável da tela inicial e das áreas principais.
- [ ] Adaptar a animação de rolagem do Oráculo.
- [ ] Definir testes, habilidades, modificadores e graus de resultado.
- [ ] Implementar salas online no Firebase compartilhado.
- [ ] Construir o Mind Database e o checklist por campanha.
- [ ] Integrar a interpretação narrativa por IA com controle do narrador.

Veja [CONCEITO.md](CONCEITO.md) para o fluxo de jogo e detalhes da visão.
