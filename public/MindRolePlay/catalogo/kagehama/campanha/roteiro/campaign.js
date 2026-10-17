export const CENAS = {
  "kagehama-scene-0": {
    "id": "kagehama-scene-0",
    "ato": 1,
    "titulo": "Ponte das Sete Lanternas",
    "subtitulo": "PRÓLOGO",
    "tipo": "dialogo",
    "textoIntro": "A cidade de Kagehama se prepara para encerrar uma guerra. Representantes de três famílias que governam a região chegaram para assinar um acordo de paz. Nesta noite, a população acompanha a passagem da comitiva pela Ponte das Sete Lanternas.\n\nVocês estão entre as pessoas reunidas na ponte. À frente, o mensageiro Jiro caminha ao lado da mediadora Akiho Senda. Ele carrega uma pequena caixa quadrada de madeira, fechada com um selo oficial. Dentro dela estão os documentos que serão assinados no palácio.\n\nUma flecha disparada de um dos telhados atinge o ombro de Jiro. Ele solta a caixa, cambaleia contra a lateral da ponte e cai na água. A caixa bate nas tábuas e desliza até a borda, perto de vocês.\n\nA multidão começa a fugir. Enquanto os guardas procuram o atirador, Jiro tenta manter a cabeça fora da água. Sob a ponte, uma pessoa estende a mão para alcançar a caixa. Vocês podem ajudar o mensageiro, proteger os documentos ou tentar encontrar quem disparou.",
    "npcsPresentes": [
      "kagehama-npc-1",
      "kagehama-npc-0",
      "kagehama-npc-2",
      "kagehama-npc-4"
    ],
    "npcEntrada": "kagehama-npc-0",
    "falaEntrada": "[ACAO: Akiho afasta duas pessoas da borda e se volta para vocês.] O mensageiro está no canal! Quem puder ajudá-lo, venha comigo. Não deixem que levem a caixa com os documentos! Depressa!",
    "semIntro": false,
    "avancarEmGrupo": true,
    "imgExterior": "catalogo/kagehama/assets/ponte-sete-lanternas.jpg",
    "imgInterior": "catalogo/kagehama/assets/ponte-sete-lanternas.jpg",
    "beatNarrativo": "Dar contexto da capital e do armistício, apresentar o grupo como testemunha de uma crise em andamento e deixar cada pessoa escolher como reage ao mensageiro em perigo e ao estojo levado para a água.",
    "contextoInvestigacao": "Na Festa das Sete Lanternas, os personagens já estão reunidos no trecho central da ponte quando uma tentativa de roubo interrompe a procissão do armistício.",
    "percepcao": {
      "dc": 12,
      "descricaoContexto": "Sob a ponte há um fragmento de papel imperial queimado por dentro; ao tocá-lo, a água sussurra o nome “Kuroda”.",
      "textoFallback": "Você não encontra uma pista confiável neste momento. A história segue; o detalhe pode ser descoberto por outra abordagem."
    },
    "investigacao": false,
    "temBatalha": false,
    "nodeId": "kagehama-scene-0",
    "proximaCena": null
  },
  "kagehama-scene-1": {
    "id": "kagehama-scene-1",
    "ato": 1,
    "titulo": "Capítulo 2 — Três contas queimadas",
    "subtitulo": "As Sete Lanternas",
    "tipo": "dialogo",
    "textoIntro": "Três contas de oração chegam ao santuário com as marcas queimadas por dentro. Sayo não pede que acreditem nela; coloca as contas sobre a mesa e espera que alguém perceba que a fuligem segue a forma de um mapa.",
    "npcsPresentes": [
      "kagehama-npc-4",
      "kagehama-npc-5"
    ],
    "npcEntrada": "kagehama-npc-4",
    "falaEntrada": "Sayo mantém as mãos afastadas das contas. “Os desaparecidos não foram levados pelo caminho. Foram chamados pelo nome. Quero saber quem aprendeu a voz das famílias antes de seguir qualquer trilha.”",
    "semIntro": false,
    "avancarEmGrupo": true,
    "imgExterior": "catalogo/kagehama/assets/santuario-aokiri.jpg",
    "imgInterior": "catalogo/kagehama/assets/santuario-aokiri.jpg",
    "beatNarrativo": "Sayo leva ao santuário; refugiados somem na floresta e uma trilha cruza esconderijo de Daichi.",
    "contextoInvestigacao": "Sayo leva ao santuário; refugiados somem na floresta e uma trilha cruza esconderijo de Daichi.",
    "percepcao": {
      "dc": 12,
      "descricaoContexto": "O padrão é uma rota de procissão usada para guiar os desaparecidos sem deixar trilha visível.",
      "textoFallback": "Você não encontra uma pista confiável neste momento. A história segue; o detalhe pode ser descoberto por outra abordagem."
    },
    "investigacao": false,
    "temBatalha": false,
    "nodeId": "kagehama-scene-1",
    "proximaCena": null
  },
  "kagehama-scene-2": {
    "id": "kagehama-scene-2",
    "ato": 1,
    "titulo": "Capítulo 3 — O homem sob a água",
    "subtitulo": "As Sete Lanternas",
    "tipo": "dialogo",
    "textoIntro": "A água cobre os degraus dos Arquivos Afogados. Um sino bate em algum lugar submerso, embora ninguém toque a corda. Entre estantes tombadas, três coisas resistem à corrente: um homem preso, o registro dos carregamentos e a única saída ainda aberta.",
    "npcsPresentes": [
      "kagehama-npc-3",
      "kagehama-npc-5"
    ],
    "npcEntrada": "kagehama-npc-3",
    "falaEntrada": "Jiro prende o braço a uma viga. “O livro tem nomes. Eu também. Se escolherem um, escolham sabendo que a água não espera uma segunda votação.”",
    "semIntro": false,
    "avancarEmGrupo": true,
    "imgExterior": "catalogo/kagehama/assets/arquivos-afogados.jpg",
    "imgInterior": "catalogo/kagehama/assets/arquivos-afogados.jpg",
    "beatNarrativo": "Nos Arquivos Afogados, o grupo escolhe salvar Jiro, documentos ou a própria segurança.",
    "contextoInvestigacao": "Nos Arquivos Afogados, o grupo escolhe salvar Jiro, documentos ou a própria segurança.",
    "percepcao": {
      "dc": 12,
      "descricaoContexto": "Atrás do painel há uma placa de cobre com o símbolo de uma arma ritual; o nome gravado é “Hibari”.",
      "textoFallback": "Você não encontra uma pista confiável neste momento. A história segue; o detalhe pode ser descoberto por outra abordagem."
    },
    "investigacao": false,
    "temBatalha": false,
    "nodeId": "kagehama-scene-2",
    "proximaCena": null
  },
  "kagehama-scene-3": {
    "id": "kagehama-scene-3",
    "ato": 2,
    "titulo": "Capítulo 4 — A caça do cervo negro",
    "subtitulo": "As Sete Lanternas",
    "tipo": "dialogo",
    "textoIntro": "Na trilha do cervo negro, a chuva apaga pegadas humanas e deixa intactas as marcas de casco. O posto abandonado ainda cheira a chá quente. Sob o beiral, seis armaduras secas estão alinhadas como se os soldados tivessem acabado de sair.",
    "npcsPresentes": [
      "kagehama-npc-7",
      "kagehama-npc-3"
    ],
    "npcEntrada": "kagehama-npc-7",
    "falaEntrada": "Daichi não abaixa o arco. “Vi os mortos levantarem sem sombra. Não vou chamar isso de maldição para que algum senhor transforme meu medo em ordem. Mostrem-me o que vocês viram.”",
    "semIntro": false,
    "avancarEmGrupo": true,
    "imgExterior": "catalogo/kagehama/assets/floresta-aokiri.jpg",
    "imgInterior": "catalogo/kagehama/assets/floresta-aokiri.jpg",
    "beatNarrativo": "Rastro leva a posto abandonado e soldados mortos após um encontro diplomático falso.",
    "contextoInvestigacao": "Rastro leva a posto abandonado e soldados mortos após um encontro diplomático falso.",
    "percepcao": {
      "dc": 12,
      "descricaoContexto": "Uma dobra de sombra esconde um talismã rasgado; seu verso traz a ordem de reunir os soldados mortos.",
      "textoFallback": "Você não encontra uma pista confiável neste momento. A história segue; o detalhe pode ser descoberto por outra abordagem."
    },
    "investigacao": false,
    "temBatalha": false,
    "nodeId": "kagehama-scene-3",
    "proximaCena": null
  },
  "kagehama-scene-4": {
    "id": "kagehama-scene-4",
    "ato": 2,
    "titulo": "Capítulo 5 — O mensageiro que não chegou",
    "subtitulo": "As Sete Lanternas",
    "tipo": "dialogo",
    "textoIntro": "Em Sumi, a água da fonte corre limpa até a primeira tigela e escurece na segunda. O mensageiro que trouxe a ordem de fechar as comportas está morto há três dias; o selo, porém, é verdadeiro. A aldeia discute quem deve pagar por uma ordem que ninguém falsificou.",
    "npcsPresentes": [
      "kagehama-npc-8",
      "kagehama-npc-0"
    ],
    "npcEntrada": "kagehama-npc-8",
    "falaEntrada": "Akane limpa a tigela sem beber. “Meu irmão obedeceu ao selo e perdeu a casa. Se vocês provarem que alguém trocou só uma linha, eu os ajudo. Se vieram pedir paciência, vão pedir a quem ainda tem telhado.”",
    "semIntro": false,
    "avancarEmGrupo": true,
    "imgExterior": "catalogo/kagehama/assets/aldeia-sumi.jpg",
    "imgInterior": "catalogo/kagehama/assets/aldeia-sumi.jpg",
    "beatNarrativo": "A aldeia de Sumi perde água por uma ordem verdadeira entregue por portador falso.",
    "contextoInvestigacao": "A aldeia de Sumi perde água por uma ordem verdadeira entregue por portador falso.",
    "percepcao": {
      "dc": 12,
      "descricaoContexto": "Um pequeno selo de chumbo desvia a água para o distrito rico. O traço foi alterado depois da assinatura oficial.",
      "textoFallback": "Você não encontra uma pista confiável neste momento. A história segue; o detalhe pode ser descoberto por outra abordagem."
    },
    "investigacao": false,
    "temBatalha": false,
    "nodeId": "kagehama-scene-4",
    "proximaCena": null
  },
  "kagehama-scene-5": {
    "id": "kagehama-scene-5",
    "ato": 2,
    "titulo": "Capítulo 6 — Um duelo sem vencedor",
    "subtitulo": "As Sete Lanternas",
    "tipo": "dialogo",
    "textoIntro": "O salão do Castelo da Cinza tem espaço para um duelo e nenhuma testemunha neutra. Cada clã trouxe alguém que chamará o resultado de justiça. Tomoe aguarda junto à porta, sem insígnia, enquanto o mestre de armas oferece lâminas sem fio.",
    "npcsPresentes": [
      "kagehama-npc-2",
      "kagehama-npc-9",
      "kagehama-npc-1"
    ],
    "npcEntrada": "kagehama-npc-2",
    "falaEntrada": "Tomoe fala sem erguer a voz. “Se vencerem, ele dirá que foi humilhado. Se perderem, dirá que provaram sua força. Há uma terceira coisa a demonstrar: que sabem interromper uma luta quando todos esperam que continuem.”",
    "semIntro": false,
    "avancarEmGrupo": true,
    "imgExterior": "catalogo/kagehama/assets/castelo-cinza.jpg",
    "imgInterior": "catalogo/kagehama/assets/castelo-cinza.jpg",
    "beatNarrativo": "Audiência no Castelo da Cinza; duelo testa contenção e respeito, não exige morte.",
    "contextoInvestigacao": "Audiência no Castelo da Cinza; duelo testa contenção e respeito, não exige morte.",
    "percepcao": {
      "dc": 12,
      "descricaoContexto": "A lâmina foi preparada para quebrar no primeiro golpe, fazendo o duelo parecer uma tentativa de assassinato.",
      "textoFallback": "Você não encontra uma pista confiável neste momento. A história segue; o detalhe pode ser descoberto por outra abordagem."
    },
    "investigacao": false,
    "temBatalha": false,
    "nodeId": "kagehama-scene-5",
    "proximaCena": null
  },
  "kagehama-scene-6": {
    "id": "kagehama-scene-6",
    "ato": 2,
    "titulo": "Capítulo 7 — A noite da enseada",
    "subtitulo": "As Sete Lanternas",
    "tipo": "dialogo",
    "textoIntro": "A enseada parece vazia até a maré recuar. Então surgem dois cascos baixos, sem bandeira, e um cabo esticado entre eles. No convés, caixas de armas dividem espaço com livros de carga escritos por mãos diferentes.",
    "npcsPresentes": [
      "kagehama-npc-3",
      "kagehama-npc-8"
    ],
    "npcEntrada": "kagehama-npc-3",
    "falaEntrada": "Jiro reconhece uma caligrafia e perde o sorriso. “Esse registro é de um homem que morreu antes de a carga sair. Ou alguém está copiando os mortos, ou a lista foi escrita para que encontremos exatamente este navio.”",
    "semIntro": false,
    "avancarEmGrupo": true,
    "imgExterior": "catalogo/kagehama/assets/porto-shirotsu.jpg",
    "imgInterior": "catalogo/kagehama/assets/porto-shirotsu.jpg",
    "beatNarrativo": "Infiltração ou perseguição marítima contra um navio com armas e registros falsos.",
    "contextoInvestigacao": "Infiltração ou perseguição marítima contra um navio com armas e registros falsos.",
    "percepcao": {
      "dc": 12,
      "descricaoContexto": "O fundo falso contém uma lista de pagamentos a guardas vivos e uma oferenda destinada ao espírito do farol.",
      "textoFallback": "Você não encontra uma pista confiável neste momento. A história segue; o detalhe pode ser descoberto por outra abordagem."
    },
    "investigacao": false,
    "temBatalha": false,
    "nodeId": "kagehama-scene-6",
    "proximaCena": null
  },
  "kagehama-scene-7": {
    "id": "kagehama-scene-7",
    "ato": 2,
    "titulo": "Capítulo 8 — A herdeira chamada Nao",
    "subtitulo": "As Sete Lanternas",
    "tipo": "dialogo",
    "textoIntro": "Na Casa de Chá da Lua Baixa, Tomoe coloca três impressões do mesmo selo sob a lamparina. Uma foi feita antes da morte do mensageiro, outra depois, e a terceira ainda está úmida. Do lado de fora, alguém conta passos em vez de clientes.",
    "npcsPresentes": [
      "kagehama-npc-2",
      "kagehama-npc-0",
      "kagehama-npc-1"
    ],
    "npcEntrada": "kagehama-npc-2",
    "falaEntrada": "“Chamam-me Nao porque esse nome cabe melhor numa acusação”, diz ela. “A matriz prova que houve cópia. Não prova quem pediu a cópia, nem quem vai morrer quando vocês disserem meu nome em público.”",
    "semIntro": false,
    "avancarEmGrupo": true,
    "imgExterior": "catalogo/kagehama/assets/casa-cha-lua-baixa.jpg",
    "imgInterior": "catalogo/kagehama/assets/casa-cha-lua-baixa.jpg",
    "beatNarrativo": "Tomoe revela a matriz do selo; tornar a falsificação pública põe seus soldados em risco.",
    "contextoInvestigacao": "Tomoe revela a matriz do selo; tornar a falsificação pública põe seus soldados em risco.",
    "percepcao": {
      "dc": 12,
      "descricaoContexto": "A tinta é feita com fuligem de um túmulo violado; ela imita o selo, mas não resiste ao sal consagrado.",
      "textoFallback": "Você não encontra uma pista confiável neste momento. A história segue; o detalhe pode ser descoberto por outra abordagem."
    },
    "investigacao": false,
    "temBatalha": false,
    "nodeId": "kagehama-scene-7",
    "proximaCena": null
  },
  "kagehama-scene-8": {
    "id": "kagehama-scene-8",
    "ato": 3,
    "titulo": "Capítulo 9 — Traição no santuário",
    "subtitulo": "As Sete Lanternas",
    "tipo": "dialogo",
    "textoIntro": "O santuário foi limpo antes da chegada do grupo. O lugar das oferendas está seco; o corredor, encharcado de pegadas que entram e não saem. Um agente espera junto ao portão com a roupa dobrada nos braços e a expressão de quem já escolheu a pior opção.",
    "npcsPresentes": [
      "kagehama-npc-5",
      "kagehama-npc-4",
      "kagehama-npc-8"
    ],
    "npcEntrada": "kagehama-npc-5",
    "falaEntrada": "Monge Genzō segura o sino rachado. “Ele entregou o esconderijo para salvar a família. Ainda pode dizer onde estão. Se o chamarem de traidor antes de ouvi-lo, talvez consigam justiça. Não conseguirão as crianças de volta.”",
    "semIntro": false,
    "avancarEmGrupo": true,
    "imgExterior": "catalogo/kagehama/assets/santuario-aokiri.jpg",
    "imgInterior": "catalogo/kagehama/assets/santuario-aokiri.jpg",
    "beatNarrativo": "Um agente entrega o esconderijo de refugiados para tentar salvar a própria família.",
    "contextoInvestigacao": "Um agente entrega o esconderijo de refugiados para tentar salvar a própria família.",
    "percepcao": {
      "dc": 12,
      "descricaoContexto": "A criança escondida deixou um fio vermelho preso na pedra; a trilha leva à passagem segura antes que o agente entregue o local.",
      "textoFallback": "Você não encontra uma pista confiável neste momento. A história segue; o detalhe pode ser descoberto por outra abordagem."
    },
    "investigacao": false,
    "temBatalha": false,
    "nodeId": "kagehama-scene-8",
    "proximaCena": null
  },
  "kagehama-scene-9": {
    "id": "kagehama-scene-9",
    "ato": 3,
    "titulo": "Capítulo 10 — A torre de sinal",
    "subtitulo": "As Sete Lanternas",
    "tipo": "dialogo",
    "textoIntro": "A torre de sinal está partida ao meio, mas sua chama continua acesa. Mensagens cifradas chegam em intervalos regulares, cada uma assinada por uma patrulha que jurava não ter saído do posto. A tempestade não apaga a luz; parece responder a ela.",
    "npcsPresentes": [
      "kagehama-npc-7",
      "kagehama-npc-9"
    ],
    "npcEntrada": "kagehama-npc-7",
    "falaEntrada": "Daichi compara duas marcas na madeira. “Os vivos usam o sinal para mover soldados. Os mortos usam para encontrar o caminho. Se destruirmos a torre sem entender a diferença, talvez mandemos ambos para a aldeia.”",
    "semIntro": false,
    "avancarEmGrupo": true,
    "imgExterior": "catalogo/kagehama/assets/desfiladeiro-sino-quebrado.jpg",
    "imgInterior": "catalogo/kagehama/assets/desfiladeiro-sino-quebrado.jpg",
    "beatNarrativo": "Tempestade, patrulhas recrutadas e mensagens cifradas sobre uma guerra planejada.",
    "contextoInvestigacao": "Tempestade, patrulhas recrutadas e mensagens cifradas sobre uma guerra planejada.",
    "percepcao": {
      "dc": 12,
      "descricaoContexto": "O sinal está convocando os soldados enterrados no desfiladeiro; trocar o nome pelo nome verdadeiro pode quebrar o chamado.",
      "textoFallback": "Você não encontra uma pista confiável neste momento. A história segue; o detalhe pode ser descoberto por outra abordagem."
    },
    "investigacao": false,
    "temBatalha": false,
    "nodeId": "kagehama-scene-9",
    "proximaCena": null
  },
  "kagehama-scene-10": {
    "id": "kagehama-scene-10",
    "ato": 3,
    "titulo": "Capítulo 11 — Conselho em Kagehama",
    "subtitulo": "As Sete Lanternas",
    "tipo": "dialogo",
    "textoIntro": "O conselho de Kagehama começa antes do nascer do sol. Akiho reservou assentos para testemunhas, mas não para os guardas que as protegem. Kuroda pede que a sessão seja breve; a cada minuto, um mensageiro diferente traz uma versão da mesma notícia.",
    "npcsPresentes": [
      "kagehama-npc-0",
      "kagehama-npc-1",
      "kagehama-npc-2",
      "kagehama-npc-6"
    ],
    "npcEntrada": "kagehama-npc-0",
    "falaEntrada": "Lady Akiho espera a sala silenciar. “Não me tragam apenas uma verdade que possa vencer. Digam quem ela protege, quem ficará exposto e como pretendem responder quando a outra parte também apresentar provas.”",
    "semIntro": false,
    "avancarEmGrupo": true,
    "imgExterior": "catalogo/kagehama/assets/palacio-sala-conselho.jpg",
    "imgInterior": "catalogo/kagehama/assets/palacio-sala-conselho.jpg",
    "beatNarrativo": "A prova exige testemunhas, proteção e uma apresentação que sobreviva à política.",
    "contextoInvestigacao": "A prova exige testemunhas, proteção e uma apresentação que sobreviva à política.",
    "percepcao": {
      "dc": 12,
      "descricaoContexto": "Uma delas recebeu a versão do incidente de um escriba do regente; a outra viu o evento e pode confirmar a falsificação independentemente.",
      "textoFallback": "Você não encontra uma pista confiável neste momento. A história segue; o detalhe pode ser descoberto por outra abordagem."
    },
    "investigacao": false,
    "temBatalha": false,
    "nodeId": "kagehama-scene-10",
    "proximaCena": null
  },
  "kagehama-scene-11": {
    "id": "kagehama-scene-11",
    "ato": 4,
    "titulo": "Capítulo 12 — O cerco dos canais",
    "subtitulo": "As Sete Lanternas",
    "tipo": "dialogo",
    "textoIntro": "Os canais sob Kagehama sobem ao mesmo tempo. A comporta range, a enfermaria perde a passagem seca e os sinos do porto anunciam embarcações sem luz. Não há força suficiente para estar em todo lugar; os moradores observam qual promessa será cumprida primeiro.",
    "npcsPresentes": [
      "kagehama-npc-8",
      "kagehama-npc-7",
      "kagehama-npc-3",
      "kagehama-npc-6"
    ],
    "npcEntrada": "kagehama-npc-8",
    "falaEntrada": "Akane já está distribuindo cordas. “Não me digam que vão salvar todos. Digam onde querem que eu reúna as pessoas e quem vai voltar por quem ficar do outro lado.”",
    "semIntro": false,
    "avancarEmGrupo": true,
    "imgExterior": "catalogo/kagehama/assets/distrito-teceloes.jpg",
    "imgInterior": "catalogo/kagehama/assets/distrito-teceloes.jpg",
    "beatNarrativo": "Três frentes simultâneas: comporta, enfermaria e muralha do porto.",
    "contextoInvestigacao": "Três frentes simultâneas: comporta, enfermaria e muralha do porto.",
    "percepcao": {
      "dc": 12,
      "descricaoContexto": "A pedra guarda um selo espiritual que pode conter a criatura do canal, mas removê-la abre a comporta por alguns instantes.",
      "textoFallback": "Você não encontra uma pista confiável neste momento. A história segue; o detalhe pode ser descoberto por outra abordagem."
    },
    "investigacao": false,
    "temBatalha": false,
    "nodeId": "kagehama-scene-11",
    "proximaCena": null
  },
  "kagehama-scene-12": {
    "id": "kagehama-scene-12",
    "ato": 4,
    "titulo": "Capítulo 13 — O regente e a lâmina",
    "subtitulo": "As Sete Lanternas",
    "tipo": "dialogo",
    "textoIntro": "O regente espera no salão onde a primeira flecha foi exibida como prova. Kuroda deixou a espada fora da bainha e o selo sobre a mesa. Atrás dele, a tinta do tratado parece se mover quando a chama da lamparina vacila.",
    "npcsPresentes": [
      "kagehama-npc-1",
      "kagehama-npc-0",
      "kagehama-npc-2"
    ],
    "npcEntrada": "kagehama-npc-1",
    "falaEntrada": "Kuroda mantém a voz serena. “A guerra pode terminar antes de começar, se me entregarem uma única testemunha e deixarem que a história registre a versão necessária. Não peço que confiem em mim. Peço que escolham quem pagará pelo silêncio.”",
    "semIntro": false,
    "avancarEmGrupo": true,
    "imgExterior": "catalogo/kagehama/assets/palacio-sala-conselho.jpg",
    "imgInterior": "catalogo/kagehama/assets/palacio-sala-conselho.jpg",
    "beatNarrativo": "Kuroda oferece acordo; pode haver rendição, exposição, captura, fuga ou combate.",
    "contextoInvestigacao": "Kuroda oferece acordo; pode haver rendição, exposição, captura, fuga ou combate.",
    "percepcao": {
      "dc": 12,
      "descricaoContexto": "O vínculo do demônio está preso ao primeiro juramento escrito no tratado. Rasgar a página original e recitar o nome de quem foi apagado rompe sua proteção.",
      "textoFallback": "Você não encontra uma pista confiável neste momento. A história segue; o detalhe pode ser descoberto por outra abordagem."
    },
    "investigacao": false,
    "temBatalha": false,
    "nodeId": "kagehama-scene-12",
    "proximaCena": null
  }
};
export const CENAS_ORDEM = [
  "kagehama-scene-0",
  "kagehama-scene-1",
  "kagehama-scene-2",
  "kagehama-scene-3",
  "kagehama-scene-4",
  "kagehama-scene-5",
  "kagehama-scene-6",
  "kagehama-scene-7",
  "kagehama-scene-8",
  "kagehama-scene-9",
  "kagehama-scene-10",
  "kagehama-scene-11",
  "kagehama-scene-12"
];
