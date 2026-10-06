# Mind RolePlay

Mind RolePlay é a casa onde várias campanhas narrativas ficam organizadas. O sistema é independente do Oráculo, mas reaproveita sua configuração de Firebase/Firestore e o fluxo simples de sala online.

## O esqueleto implementado

- Tela inicial com entrada para **Jogar Online** e **Mind Database**.
- Três pacotes vazios de exemplo, criados na coleção `mindCampaigns`.
- Cada pacote usa o mesmo formato: roteiro, classes/regras, personagens, NPCs, cenários, mapa, arte, checklist e histórico de testes.
- Cadastro inicial de personagem com perícia, vantagens, desvantagens e condição persistente.
- Teste de tentativa em 3d6, animação dos três dados, resultado, margem e registro na campanha.
- Sala inicial com criar código e entrar por código na coleção própria `mindRooms`.

O HTML e os módulos ficam em `MindRolePlay/`; Vite inclui essa página como entrada independente sem substituir a tela do Oráculo.

## Resolução 3d6

O motor de regras soma três d6 e compara o total ao nível efetivo da perícia. Neste primeiro corte, uma tentativa sempre rola os dados, conforme a premissa definida para o Mind RolePlay. Os resultados críticos seguem os limites básicos do GURPS; modificadores da situação e condições persistentes entram no nível efetivo. A implementação vive em [`src/gurps.js`](src/gurps.js).

O GURPS usa esse teste básico de 3d6 contra habilidade/atributo efetivo, com sucesso em resultado igual ou abaixo do alvo. O Mind RolePlay está tomando isso como base, sem copiar o sistema inteiro. Referência: [GURPS Lite — Steve Jackson Games](https://www.sjgames.com/gurps/lite/).

## Pacote de campanha

Cada campanha tem um documento independente em `mindCampaigns/{campaignId}`, padronizado por `schemaVersion`. O documento mantém suas listas próprias de conteúdo; a arte e os arquivos pesados poderão usar caminhos separados no Firebase Storage quando essa etapa for construída.

## Firebase compartilhado

O app importa o Firestore da configuração existente em `src/firebase/config.js`. Os dados do Mind ficam nas coleções `mindCampaigns` e `mindRooms`; as coleções do Oráculo permanecem intactas.

As novas regras estão em `firestore.rules`. Para liberar gravação em Firebase, elas precisam ser publicadas no projeto com:

```bash
firebase deploy --only firestore:rules
```

Se a leitura ou gravação remota falhar, o protótipo abre em modo local neste navegador, para permitir explorar as telas e testar os dados sem misturar com as salas do Oráculo.

## Próximas etapas

- [ ] Adicionar atualização em tempo real e estado completo das salas multiplayer.
- [ ] Definir atributos, lista de perícias, vantagens/desvantagens e efeitos de condições com mais detalhe.
- [ ] Expandir as fichas e permitir múltiplas perícias e modelos de personagem.
- [ ] Construir a importação de campanha e o checklist automático.
- [ ] Conectar IA para sugerir perícia/modificadores e narrar efeitos, sempre sob autoridade do narrador.
- [ ] Migrar textos/listas extensos para subcoleções e arte para Storage quando necessário.

Veja [CONCEITO.md](CONCEITO.md) para o fluxo completo e as decisões de design.
