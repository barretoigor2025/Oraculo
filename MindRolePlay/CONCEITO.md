# Conceito do Mind RolePlay

## O que é o Mind RolePlay

Mind RolePlay é a plataforma/casa onde várias campanhas de RPG podem ser instaladas e jogadas. Ele não é uma campanha única. Cada campanha tem seu pacote independente, com o mesmo padrão de organização, para facilitar instalar campanhas de Pokémon, Vampiro, Golden Axe ou qualquer outro universo sem reinventar a preparação toda vez.

A tela inicial segue a entrada do Oráculo: escolher para onde ir, iniciar o jogo online ou abrir a base de campanhas. A inspiração é o fluxo e a infraestrutura multiplayer do Oráculo; as regras, a experiência e os dados do Mind são próprios.

## Formato padronizado de campanha

Cada pacote tem uma versão de esquema e áreas padrão:

- roteiro e premissa;
- gênero e regras específicas da campanha;
- classes/modelos de personagem;
- fichas dos jogadores;
- NPCs;
- cenários e cenas;
- mapa geral;
- arte e recursos visuais;
- checklist de itens a preparar;
- histórico dos testes narrativos.

Na primeira implementação, cada pacote é um documento independente em `mindCampaigns/{campaignId}`, com listas separadas para cada seção. Isso representa a “pasta” da campanha dentro do Mind Database e mantém as campanhas isoladas entre si. Quando houver muitos registros ou arquivos maiores, as listas podem virar subcoleções e imagens podem ficar em caminhos próprios do Firebase Storage.

Os três exemplos iniciais (`Campanha 1`, `Campanha 2` e `Campanha 3`) são pacotes vazios. Servem para testar instalação, abertura de pacote e navegação das seções sem presumir nenhum cenário ou regra de campanha.

## Tentativa e teste de sucesso

A premissa escolhida para o Mind é que uma ação declarada como tentativa sempre gera um teste. O jogador escreve o que pretende fazer. A resolução considera a perícia do personagem, seus modificadores e condições registradas.

O motor já implementado soma 3d6 e compara o resultado com o nível efetivo:

`nível efetivo = nível da perícia + modificador da situação + modificadores de condições`

A ficha guarda vantagens, desvantagens e condições, incluindo notas permanentes como uma lesão ou perda de membro. O protótipo permite cadastrar uma perícia inicial, registrar condições com modificador e ver essa condição afetando os testes. Ainda é preciso definir como cada condição afeta cada tipo de perícia, em vez de usar o modificador geral simplificado atual.

Na mecânica básica do GURPS, três dados de seis faces são somados e o teste normalmente é bem-sucedido quando o total é igual ou menor que o valor efetivo da habilidade/atributo. Os resultados críticos seguem regras próprias. Esta referência foi confirmada no material introdutório oficial GURPS Lite, publicado pela Steve Jackson Games. O Mind RolePlay usa a base como referência, mas terá suas próprias regras enxutas.

## Fluxo de uma ação

1. O jogador escreve a tentativa em linguagem natural.
2. A campanha fornece o cenário, as informações do roteiro e as regras aplicáveis.
3. A ficha oferece perícias, vantagens, desvantagens e condições atuais/permanentes.
4. O narrador decide como interpretar a situação; no futuro, a IA poderá sugerir qual perícia usar e quais modificadores fazem sentido.
5. O sistema rola os três dados com animação e calcula o número sem deixar a IA alterar a rolagem.
6. O narrador decide como o resultado se manifesta na história; a IA poderá ajudar a escrever a consequência.

O narrador é a autoridade final sobre o andamento e a verdade da campanha. A IA auxilia a leitura e a narração, sem tomar o lugar dele.

## Multiplayer e Firebase

A aplicação reutiliza a configuração Firebase/Firestore existente em `src/firebase/config.js`. As coleções do Mind são próprias:

- `mindCampaigns`: pacotes padronizados, cada campanha identificada pelo seu próprio ID.
- `mindRooms`: salas e seus códigos de entrada.

As coleções do Oráculo, como `rooms`, `lobbies` e `sessoes`, permanecem separadas. As regras para as novas coleções estão no arquivo do projeto e precisam estar publicadas no Firebase para ativar a persistência remota. O protótipo cai em modo local se o Firestore não estiver acessível.

## Visual e foco da sessão

- Manter a apresentação clara e temática da tela do Oráculo.
- A rolagem deve mostrar os três d6 rolando e exibir o resultado numérico.
- Cenários e personagens podem ser estáticos; arena tática e movimento de miniaturas não são foco.
- Durante o jogo, a principal interação é escrever a intenção do personagem e acompanhar a resolução narrativa.

## Limites do primeiro esqueleto

Já existem pacotes de campanha vazios, abertura de sala/código, cadastro inicial de personagem, registro simplificado de condição persistente e motor determinístico 3d6. Ainda não estão concluídos o estado multiplayer sincronizado em tempo real, a ficha completa, as regras detalhadas de atributos/perícias, a interpretação automática por IA, importação de campanhas e checklist automático.
