# Conceito do Mind RolePlay

## Resumo

O Mind RolePlay será um sistema independente de RPG, com a narrativa como foco principal. A estrutura online seguirá a experiência simples da tela inicial do Oráculo: selecionar uma campanha, jogar online ou abrir o Mind Database, com salas para jogar com amigos. O projeto usará o Firebase/Firestore já configurado no Oráculo, mantendo seus dados próprios separados.

O objetivo é reduzir o peso do combate tático e de ações por clique. Os jogadores descrevem em texto o que querem tentar; a plataforma usa os dados da campanha e do personagem para apoiar a resolução, apresenta os dados e ajuda o narrador a contar o que acontece.

## Fluxo de uma ação

1. O jogador escreve o que seu personagem pretende fazer.
2. O sistema considera a situação descrita, o cenário e os dados da campanha.
3. A IA consulta a ficha do personagem: atributos, perícias, vantagens, desvantagens e limitações relevantes.
4. A IA sugere se existe incerteza suficiente para uma rolagem e quais fatores modificam o teste. O narrador pode conduzir ou corrigir a interpretação.
5. O jogo rola três dados de seis faces com a animação visual de dados do Oráculo e calcula o total de forma determinística.
6. O total é comparado ao alvo definido pela regra daquela campanha; a IA explica e narra a consequência, respeitando a decisão do narrador.

A IA ajuda a interpretar a ficção; ela não deve inventar o resultado dos dados nem substituir a autoridade do narrador.

## Referência de rolagem: 3d6

A lembrança do Igor está correta quanto à mecânica básica de sucesso do GURPS: rolam-se três dados de seis faces e somam-se os resultados; em geral, é preciso obter um total igual ou menor que o nível efetivo da habilidade ou atributo. Modificadores podem alterar esse nível. Há 216 combinações possíveis; os resultados centrais têm mais combinações e por isso a distribuição forma uma curva, em vez de dar a mesma chance a cada total.

O Mind RolePlay poderá usar essa base como inspiração simplificada. Ainda não estão definidas as regras de sucesso, falha, crítico, margem, dificuldade ou interação entre perícias e modificadores. Não presumir que todas as regras do GURPS serão copiadas.

Referência oficial introdutória: [GURPS Lite — Steve Jackson Games](https://www.sjgames.com/gurps/lite/).

## Mind Database: uma campanha por pacote

Cada campanha terá seu próprio conjunto de conteúdo para o narrador organizar:

- **Roteiro:** premissa, capítulos ou cenas, acontecimentos, pistas e finais possíveis.
- **Regras da campanha:** gênero, tom e ajustes próprios (terror, fantasia, ficção científica etc.).
- **Personagens jogáveis:** classes ou arquétipos, fichas, habilidades, vantagens e desvantagens.
- **NPCs:** descrição, objetivos, relações, informações conhecidas e segredos do narrador.
- **Cenários:** locais, imagens de referência e mapa geral quando necessário.
- **Checklist:** elementos mencionados no roteiro que ainda precisam ser preparados — personagens, NPCs, cenários, mapas ou imagens.

O checklist deve ser claro e editável. A campanha pode começar simples e receber recursos adicionais conforme forem necessários durante o jogo.

## Narrador e IA

O narrador conduz a campanha, decide o que é verdadeiro no mundo e mantém o controle do ritmo e das consequências. A IA pode interpretar a intenção do jogador, consultar o pacote da campanha e sugerir uma resolução coerente com a ficha. O narrador pode aceitar, ajustar ou decidir o rumo da cena.

## Visual e interação

- A tela inicial deve lembrar a porta de entrada do Oráculo: nome, campanha selecionada e ações claras para **Jogar Online** e abrir o **Mind Database**.
- A sala online deve permitir criar uma sala e compartilhar um código, ou entrar usando um código.
- A animação de rolagem de dados do Oráculo será adaptada para mostrar claramente os três d6.
- Cenários e personagens podem aparecer como imagens estáticas. Miniaturas animadas e arena tática não são prioridade.
- Durante a sessão, a ação principal é escrever intenções em linguagem natural e acompanhar a narração e o resultado.

## Firebase sem misturar os jogos

Reutilizar a configuração Firebase/Firestore existente do Oráculo. A integração deve reaproveitar a configuração do projeto e criar estruturas próprias do Mind RolePlay para campanhas, salas, jogadores e estado narrativo. Assim, a conexão pode ser compartilhada sem alterar ou sobrescrever as salas e os dados do Oráculo.

## Fora de escopo por enquanto

Ainda não foram definidos: a regra completa de testes, atributos e perícias, criação de ficha, tipos exatos de resultado, arquitetura da IA, forma de importar/adaptar roteiros nem a interface completa do narrador. O protótipo atual representa a tela inicial e os caminhos de navegação, sem conexão real com Firebase.
