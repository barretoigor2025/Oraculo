import sceneBridge from '../../../assets/campaigns/kagehama/scenes/ponte-sete-lanternas.jpg';
import sceneWeavers from '../../../assets/campaigns/kagehama/scenes/distrito-teceloes.jpg';
import sceneTeahouse from '../../../assets/campaigns/kagehama/scenes/casa-cha-lua-baixa.jpg';
import sceneShrine from '../../../assets/campaigns/kagehama/scenes/santuario-aokiri.jpg';
import sceneForest from '../../../assets/campaigns/kagehama/scenes/floresta-aokiri.jpg';
import sceneArchives from '../../../assets/campaigns/kagehama/scenes/arquivos-afogados.jpg';
import sceneAshCastle from '../../../assets/campaigns/kagehama/scenes/castelo-cinza.jpg';
import scenePort from '../../../assets/campaigns/kagehama/scenes/porto-shirotsu.jpg';
import sceneSumi from '../../../assets/campaigns/kagehama/scenes/aldeia-sumi.jpg';
import sceneGorge from '../../../assets/campaigns/kagehama/scenes/desfiladeiro-sino-quebrado.jpg';
import sceneCouncil from '../../../assets/campaigns/kagehama/scenes/palacio-sala-conselho.jpg';

export const KAGEHAMA_SCENES = [
    {
      "id": "kagehama-scene-0",
      "chapter": "PRÓLOGO",
      "title": "Ponte das Sete Lanternas",
      "description": "Na Festa das Sete Lanternas, os personagens já estão reunidos no trecho central da ponte quando uma tentativa de roubo interrompe a procissão do armistício.",
      "playerContext": "A campanha começa com todos no trecho central da ponte durante a Festa das Sete Lanternas. Cada personagem pode revelar sua personalidade pela primeira reação ao perigo, sem precisar definir de antemão onde está ou justificar por que entrou na campanha.",
      "objective": "Dar contexto da capital e do armistício, apresentar o grupo como testemunha de uma crise em andamento e deixar cada pessoa escolher como reage ao mensageiro em perigo e ao estojo levado para a água.",
      "openingPrompt": "Na capital Kagehama, a Festa das Sete Lanternas enche os canais de música, fumaça de carvão e luz vermelha. A procissão celebra um armistício que pode impedir uma guerra entre três domínios. Vocês já estão reunidos no trecho central da ponte — a serviço, de passagem, investigando ou trabalhando — sem que precisem se conhecer. À frente, o mensageiro imperial leva ao conselho um estojo lacrado. Sete lanternas apagam em sequência. Uma flecha corta a faixa do cortejo; o mensageiro cai na água e o estojo desliza até a borda onde vocês estão. Sob a ponte, uma mão pálida o agarra. Guardas gritam ordens contraditórias e a multidão começa a correr. O homem e o estojo desaparecerão em instantes se ninguém agir. O que cada personagem faz?",
      "openingMessages": [
        {
          "playerId": "narrator",
          "playerName": "Narrador",
          "characterName": "Mind",
          "className": "Prólogo",
          "text": "Na capital Kagehama, a Festa das Sete Lanternas enche os canais de música, fumaça de carvão e luz vermelha. A procissão celebra um armistício que pode impedir uma guerra entre três domínios. Vocês já estão reunidos no trecho central da ponte — a serviço, de passagem, investigando ou trabalhando — sem que precisem se conhecer. À frente, o mensageiro imperial leva ao conselho um estojo lacrado. Sete lanternas apagam em sequência. Uma flecha corta a faixa do cortejo; o mensageiro cai na água e o estojo desliza até a borda onde vocês estão. Sob a ponte, uma mão pálida o agarra. Guardas gritam ordens contraditórias e a multidão começa a correr. O homem e o estojo desaparecerão em instantes se ninguém agir. O que cada personagem faz?"
        }
      ],
      "image": sceneBridge,
      "beats": [{"type":"narration","text":"O acordo que mantém três domínios longe da guerra está prestes a ser assinado em Kagehama. Vocês já estão no trecho central da Ponte das Sete Lanternas, no meio da procissão, quando sete chamas se apagam em sequência. Uma flecha corta a faixa imperial. O mensageiro cai no canal; o estojo lacrado bate na madeira molhada e escorrega até a borda. Uma mão pálida surge sob a ponte para puxá-lo. Guardas avançam em direções opostas e a multidão entra em pânico. Cada personagem tem poucos segundos para escolher o que tenta proteger ou alcançar."},{"type":"dialogue","speakerId":"kagehama-npc-1","text":"Ren Kuroda ajeita a manga antes de olhar para o grupo. “Uma noite de paz depende de pessoas que sabem esperar. Digam: vieram proteger a ponte ou descobrir quem teme que ela permaneça aberta?”"},{"type":"prompt","text":"Cada personagem escolhe onde está e o que o trouxe à ponte. Quando a flecha corta as lanternas, descrevam o primeiro gesto: proteger alguém, perseguir o atirador, salvar o estojo ou observar quem aproveita o tumulto."},{"id":"sayo-lead-to-shrine","type":"dialogue","speakerId":"kagehama-npc-4","text":"Antes que a procissão se desfaça, Sayo atravessa a multidão com três contas de oração chamuscadas. Ela se apresenta como zeladora do santuário de Aokiri: “Essas marcas apareceram junto às famílias desaparecidas. O caminho da floresta começa atrás do santuário. Se querem respostas, conversem com quem ouviu as vozes.”"}],
      "perception": {"skill":"Percepção","target":11,"clue":"O reflexo das lanternas não acompanha a corrente. Uma chama aponta para algo preso sob a ponte.","success":"Sob a ponte há um fragmento de papel imperial queimado por dentro; ao tocá-lo, a água sussurra o nome “Kuroda”.","failure":"Você não encontra uma pista confiável neste momento. A história segue; o detalhe pode ser descoberto por outra abordagem."},
      "presentNpcIds": ["kagehama-npc-1","kagehama-npc-0","kagehama-npc-2","kagehama-npc-4"],
      "createdAt": 0
    },
    {
      "id": "kagehama-scene-1",
      "title": "Capítulo 2 — Três contas queimadas",
      "description": "Sayo leva ao santuário; refugiados somem na floresta e uma trilha cruza esconderijo de Daichi.",
      "image": sceneShrine,
      "beats": [{"type":"narration","text":"Três contas de oração chegam ao santuário com as marcas queimadas por dentro. Sayo não pede que acreditem nela; coloca as contas sobre a mesa e espera que alguém perceba que a fuligem segue a forma de um mapa."},{"type":"dialogue","speakerId":"kagehama-npc-4","text":"Sayo mantém as mãos afastadas das contas. “Os desaparecidos não foram levados pelo caminho. Foram chamados pelo nome. Quero saber quem aprendeu a voz das famílias antes de seguir qualquer trilha.”"},{"type":"prompt","text":"A investigação pode começar pelas contas, pelas famílias ou pelo caminho da floresta. Façam perguntas concretas; Sayo responde ao que sabe e desconfia de quem tenta transformar sofrimento em prova política."}],
      "perception": {"skill":"Percepção","target":12,"clue":"A fuligem nas contas forma intervalos regulares: três passos, uma pausa, depois marcas voltadas para a floresta.","success":"O padrão é uma rota de procissão usada para guiar os desaparecidos sem deixar trilha visível.","failure":"Você não encontra uma pista confiável neste momento. A história segue; o detalhe pode ser descoberto por outra abordagem."},
      "presentNpcIds": ["kagehama-npc-4","kagehama-npc-5"],
      "createdAt": 0
    },
    {
      "id": "kagehama-scene-2",
      "title": "Capítulo 3 — O homem sob a água",
      "description": "Nos Arquivos Afogados, o grupo escolhe salvar Jiro, documentos ou a própria segurança.",
      "image": sceneArchives,
      "beats": [{"type":"narration","text":"A água cobre os degraus dos Arquivos Afogados. Um sino bate em algum lugar submerso, embora ninguém toque a corda. Entre estantes tombadas, três coisas resistem à corrente: um homem preso, o registro dos carregamentos e a única saída ainda aberta."},{"type":"dialogue","speakerId":"kagehama-npc-3","text":"Jiro prende o braço a uma viga. “O livro tem nomes. Eu também. Se escolherem um, escolham sabendo que a água não espera uma segunda votação.”"},{"type":"prompt","text":"Definam quem age primeiro e como dividem risco e tempo. Salvar o registro revela a rota de carga; alcançar Jiro cria uma dívida; garantir a saída permite voltar com ferramentas, mas algo pode desaparecer na corrente."}],
      "perception": {"skill":"Percepção","target":12,"clue":"Há bolhas subindo de uma estante fechada, mas nenhuma corrente entra nela.","success":"Atrás do painel há uma placa de cobre com o símbolo de uma arma ritual; o nome gravado é “Hibari”.","failure":"Você não encontra uma pista confiável neste momento. A história segue; o detalhe pode ser descoberto por outra abordagem."},
      "presentNpcIds": ["kagehama-npc-3","kagehama-npc-5"],
      "createdAt": 0
    },
    {
      "id": "kagehama-scene-3",
      "title": "Capítulo 4 — A caça do cervo negro",
      "description": "Rastro leva a posto abandonado e soldados mortos após um encontro diplomático falso.",
      "image": sceneForest,
      "beats": [{"type":"narration","text":"Na trilha do cervo negro, a chuva apaga pegadas humanas e deixa intactas as marcas de casco. O posto abandonado ainda cheira a chá quente. Sob o beiral, seis armaduras secas estão alinhadas como se os soldados tivessem acabado de sair."},{"type":"dialogue","speakerId":"kagehama-npc-7","text":"Daichi não abaixa o arco. “Vi os mortos levantarem sem sombra. Não vou chamar isso de maldição para que algum senhor transforme meu medo em ordem. Mostrem-me o que vocês viram.”"},{"type":"prompt","text":"Confrontem as evidências antes de perseguir o cervo. A trilha oferece uma rota rápida e exposta, ou uma volta segura que custa horas e pode deixar os refugiados sem proteção."}],
      "perception": {"skill":"Percepção","target":11,"clue":"As pegadas do cervo terminam diante de uma árvore que não tem casca arrancada.","success":"Uma dobra de sombra esconde um talismã rasgado; seu verso traz a ordem de reunir os soldados mortos.","failure":"Você não encontra uma pista confiável neste momento. A história segue; o detalhe pode ser descoberto por outra abordagem."},
      "presentNpcIds": ["kagehama-npc-7","kagehama-npc-3"],
      "createdAt": 0
    },
    {
      "id": "kagehama-scene-4",
      "title": "Capítulo 5 — O mensageiro que não chegou",
      "description": "A aldeia de Sumi perde água por uma ordem verdadeira entregue por portador falso.",
      "image": sceneSumi,
      "beats": [{"type":"narration","text":"Em Sumi, a água da fonte corre limpa até a primeira tigela e escurece na segunda. O mensageiro que trouxe a ordem de fechar as comportas está morto há três dias; o selo, porém, é verdadeiro. A aldeia discute quem deve pagar por uma ordem que ninguém falsificou."},{"type":"dialogue","speakerId":"kagehama-npc-8","text":"Akane limpa a tigela sem beber. “Meu irmão obedeceu ao selo e perdeu a casa. Se vocês provarem que alguém trocou só uma linha, eu os ajudo. Se vieram pedir paciência, vão pedir a quem ainda tem telhado.”"},{"type":"prompt","text":"Decidam se investigam o portador, a rota da água ou a cadeia de ordens. Uma promessa pública pode acalmar a aldeia agora, mas será lembrada no conselho e cobrada se não for cumprida."}],
      "perception": {"skill":"Percepção","target":12,"clue":"A água escurece primeiro junto ao canal secundário, não na fonte.","success":"Um pequeno selo de chumbo desvia a água para o distrito rico. O traço foi alterado depois da assinatura oficial.","failure":"Você não encontra uma pista confiável neste momento. A história segue; o detalhe pode ser descoberto por outra abordagem."},
      "presentNpcIds": ["kagehama-npc-8","kagehama-npc-0"],
      "createdAt": 0
    },
    {
      "id": "kagehama-scene-5",
      "title": "Capítulo 6 — Um duelo sem vencedor",
      "description": "Audiência no Castelo da Cinza; duelo testa contenção e respeito, não exige morte.",
      "image": sceneAshCastle,
      "beats": [{"type":"narration","text":"O salão do Castelo da Cinza tem espaço para um duelo e nenhuma testemunha neutra. Cada clã trouxe alguém que chamará o resultado de justiça. Tomoe aguarda junto à porta, sem insígnia, enquanto o mestre de armas oferece lâminas sem fio."},{"type":"dialogue","speakerId":"kagehama-npc-2","text":"Tomoe fala sem erguer a voz. “Se vencerem, ele dirá que foi humilhado. Se perderem, dirá que provaram sua força. Há uma terceira coisa a demonstrar: que sabem interromper uma luta quando todos esperam que continuem.”"},{"type":"prompt","text":"Negociem as condições, aceitem o duelo ou recusem a encenação e proponham outro teste. Vitória por contenção, testemunhas protegidas e palavra cumprida podem valer mais do que derrubar o adversário."}],
      "perception": {"skill":"Percepção","target":11,"clue":"Um dos espectadores evita olhar para a bainha cerimonial quando o mestre propõe o duelo.","success":"A lâmina foi preparada para quebrar no primeiro golpe, fazendo o duelo parecer uma tentativa de assassinato.","failure":"Você não encontra uma pista confiável neste momento. A história segue; o detalhe pode ser descoberto por outra abordagem."},
      "presentNpcIds": ["kagehama-npc-2","kagehama-npc-9","kagehama-npc-1"],
      "createdAt": 0
    },
    {
      "id": "kagehama-scene-6",
      "title": "Capítulo 7 — A noite da enseada",
      "description": "Infiltração ou perseguição marítima contra um navio com armas e registros falsos.",
      "image": scenePort,
      "beats": [{"type":"narration","text":"A enseada parece vazia até a maré recuar. Então surgem dois cascos baixos, sem bandeira, e um cabo esticado entre eles. No convés, caixas de armas dividem espaço com livros de carga escritos por mãos diferentes."},{"type":"dialogue","speakerId":"kagehama-npc-3","text":"Jiro reconhece uma caligrafia e perde o sorriso. “Esse registro é de um homem que morreu antes de a carga sair. Ou alguém está copiando os mortos, ou a lista foi escrita para que encontremos exatamente este navio.”"},{"type":"prompt","text":"Escolham entre infiltrar-se, interceptar o barco ou observar quem vem recolher os livros. A prova pode ser preservada, mas cada plano deixa uma pista diferente para quem está vigiando."}],
      "perception": {"skill":"Percepção","target":12,"clue":"Uma caixa está seca apesar de ficar abaixo da linha da maré.","success":"O fundo falso contém uma lista de pagamentos a guardas vivos e uma oferenda destinada ao espírito do farol.","failure":"Você não encontra uma pista confiável neste momento. A história segue; o detalhe pode ser descoberto por outra abordagem."},
      "presentNpcIds": ["kagehama-npc-3","kagehama-npc-8"],
      "createdAt": 0
    },
    {
      "id": "kagehama-scene-7",
      "title": "Capítulo 8 — A herdeira chamada Nao",
      "description": "Tomoe revela a matriz do selo; tornar a falsificação pública põe seus soldados em risco.",
      "image": sceneTeahouse,
      "beats": [{"type":"narration","text":"Na Casa de Chá da Lua Baixa, Tomoe coloca três impressões do mesmo selo sob a lamparina. Uma foi feita antes da morte do mensageiro, outra depois, e a terceira ainda está úmida. Do lado de fora, alguém conta passos em vez de clientes."},{"type":"dialogue","speakerId":"kagehama-npc-2","text":"“Chamam-me Nao porque esse nome cabe melhor numa acusação”, diz ela. “A matriz prova que houve cópia. Não prova quem pediu a cópia, nem quem vai morrer quando vocês disserem meu nome em público.”"},{"type":"prompt","text":"Perguntem o que Tomoe aceita revelar e o que precisa em troca. Protegê-la pode preservar uma testemunha; expor tudo agora pode impedir outra falsificação, mas entregar seus soldados a uma disputa sucessória."}],
      "perception": {"skill":"Percepção","target":13,"clue":"A terceira impressão do selo não tem sombra, embora esteja sob a lamparina.","success":"A tinta é feita com fuligem de um túmulo violado; ela imita o selo, mas não resiste ao sal consagrado.","failure":"Você não encontra uma pista confiável neste momento. A história segue; o detalhe pode ser descoberto por outra abordagem."},
      "presentNpcIds": ["kagehama-npc-2","kagehama-npc-0","kagehama-npc-1"],
      "createdAt": 0
    },
    {
      "id": "kagehama-scene-8",
      "title": "Capítulo 9 — Traição no santuário",
      "description": "Um agente entrega o esconderijo de refugiados para tentar salvar a própria família.",
      "image": sceneShrine,
      "beats": [{"type":"narration","text":"O santuário foi limpo antes da chegada do grupo. O lugar das oferendas está seco; o corredor, encharcado de pegadas que entram e não saem. Um agente espera junto ao portão com a roupa dobrada nos braços e a expressão de quem já escolheu a pior opção."},{"type":"dialogue","speakerId":"kagehama-npc-5","text":"Monge Genzō segura o sino rachado. “Ele entregou o esconderijo para salvar a família. Ainda pode dizer onde estão. Se o chamarem de traidor antes de ouvi-lo, talvez consigam justiça. Não conseguirão as crianças de volta.”"},{"type":"prompt","text":"Decidam primeiro quem precisa de proteção imediata. Depois, ouçam o agente, verifiquem a informação ou o entreguem à autoridade. Misericórdia sem segurança e punição sem prova também deixam marcas."}],
      "perception": {"skill":"Percepção","target":12,"clue":"Há uma pegada infantil molhada atrás do altar, mas o chão ao redor está seco.","success":"A criança escondida deixou um fio vermelho preso na pedra; a trilha leva à passagem segura antes que o agente entregue o local.","failure":"Você não encontra uma pista confiável neste momento. A história segue; o detalhe pode ser descoberto por outra abordagem."},
      "presentNpcIds": ["kagehama-npc-5","kagehama-npc-4","kagehama-npc-8"],
      "createdAt": 0
    },
    {
      "id": "kagehama-scene-9",
      "title": "Capítulo 10 — A torre de sinal",
      "description": "Tempestade, patrulhas recrutadas e mensagens cifradas sobre uma guerra planejada.",
      "image": sceneGorge,
      "beats": [{"type":"narration","text":"A torre de sinal está partida ao meio, mas sua chama continua acesa. Mensagens cifradas chegam em intervalos regulares, cada uma assinada por uma patrulha que jurava não ter saído do posto. A tempestade não apaga a luz; parece responder a ela."},{"type":"dialogue","speakerId":"kagehama-npc-7","text":"Daichi compara duas marcas na madeira. “Os vivos usam o sinal para mover soldados. Os mortos usam para encontrar o caminho. Se destruirmos a torre sem entender a diferença, talvez mandemos ambos para a aldeia.”"},{"type":"prompt","text":"Decifrem os sinais, interrompam a sequência ou usem uma mensagem falsa para atrair quem responde. O risco espiritual pode ser contido por um ritual curto, mas só se descobrirem qual nome está sendo chamado."}],
      "perception": {"skill":"Percepção","target":12,"clue":"A chama da torre se inclina contra o vento quando uma mensagem usa o nome de um morto.","success":"O sinal está convocando os soldados enterrados no desfiladeiro; trocar o nome pelo nome verdadeiro pode quebrar o chamado.","failure":"Você não encontra uma pista confiável neste momento. A história segue; o detalhe pode ser descoberto por outra abordagem."},
      "presentNpcIds": ["kagehama-npc-7","kagehama-npc-9"],
      "createdAt": 0
    },
    {
      "id": "kagehama-scene-10",
      "title": "Capítulo 11 — Conselho em Kagehama",
      "description": "A prova exige testemunhas, proteção e uma apresentação que sobreviva à política.",
      "image": sceneCouncil,
      "beats": [{"type":"narration","text":"O conselho de Kagehama começa antes do nascer do sol. Akiho reservou assentos para testemunhas, mas não para os guardas que as protegem. Kuroda pede que a sessão seja breve; a cada minuto, um mensageiro diferente traz uma versão da mesma notícia."},{"type":"dialogue","speakerId":"kagehama-npc-0","text":"Lady Akiho espera a sala silenciar. “Não me tragam apenas uma verdade que possa vencer. Digam quem ela protege, quem ficará exposto e como pretendem responder quando a outra parte também apresentar provas.”"},{"type":"prompt","text":"Apresentem uma sequência de evidências, testemunhas e compromissos. Cada NPC reage ao que presenciou e ao custo que percebe; um argumento forte pode ainda falhar se deixar alguém vulnerável."}],
      "perception": {"skill":"Percepção","target":13,"clue":"Akiho percebe que duas testemunhas repetem a mesma pausa, como se tivessem decorado o relato juntas.","success":"Uma delas recebeu a versão do incidente de um escriba do regente; a outra viu o evento e pode confirmar a falsificação independentemente.","failure":"Você não encontra uma pista confiável neste momento. A história segue; o detalhe pode ser descoberto por outra abordagem."},
      "presentNpcIds": ["kagehama-npc-0","kagehama-npc-1","kagehama-npc-2","kagehama-npc-6"],
      "createdAt": 0
    },
    {
      "id": "kagehama-scene-11",
      "title": "Capítulo 12 — O cerco dos canais",
      "description": "Três frentes simultâneas: comporta, enfermaria e muralha do porto.",
      "image": sceneWeavers,
      "beats": [{"type":"narration","text":"Os canais sob Kagehama sobem ao mesmo tempo. A comporta range, a enfermaria perde a passagem seca e os sinos do porto anunciam embarcações sem luz. Não há força suficiente para estar em todo lugar; os moradores observam qual promessa será cumprida primeiro."},{"type":"dialogue","speakerId":"kagehama-npc-8","text":"Akane já está distribuindo cordas. “Não me digam que vão salvar todos. Digam onde querem que eu reúna as pessoas e quem vai voltar por quem ficar do outro lado.”"},{"type":"prompt","text":"Dividam o grupo ou priorizem uma frente e peçam aliados específicos. Registrem nomes e promessas; o custo de uma escolha aparece na próxima cena, mesmo que o plano funcione."}],
      "perception": {"skill":"Percepção","target":12,"clue":"As três frentes de água formam uma corrente circular em torno de uma pedra votiva.","success":"A pedra guarda um selo espiritual que pode conter a criatura do canal, mas removê-la abre a comporta por alguns instantes.","failure":"Você não encontra uma pista confiável neste momento. A história segue; o detalhe pode ser descoberto por outra abordagem."},
      "presentNpcIds": ["kagehama-npc-8","kagehama-npc-7","kagehama-npc-3","kagehama-npc-6"],
      "createdAt": 0
    },
    {
      "id": "kagehama-scene-12",
      "title": "Capítulo 13 — O regente e a lâmina",
      "description": "Kuroda oferece acordo; pode haver rendição, exposição, captura, fuga ou combate.",
      "image": sceneCouncil,
      "beats": [{"type":"narration","text":"O regente espera no salão onde a primeira flecha foi exibida como prova. Kuroda deixou a espada fora da bainha e o selo sobre a mesa. Atrás dele, a tinta do tratado parece se mover quando a chama da lamparina vacila."},{"type":"dialogue","speakerId":"kagehama-npc-1","text":"Kuroda mantém a voz serena. “A guerra pode terminar antes de começar, se me entregarem uma única testemunha e deixarem que a história registre a versão necessária. Não peço que confiem em mim. Peço que escolham quem pagará pelo silêncio.”"},{"type":"prompt","text":"Mostrem as provas, ofereçam outro acordo, tentem deter Kuroda ou recusem que ele escolha o preço. A sombra ligada ao tratado reage à mentira e ao juramento quebrado; uma lâmina comum pode atrasá-la, não libertá-la."}],
      "perception": {"skill":"Percepção","target":14,"clue":"A sombra da tinta se move antes da mão de Kuroda tocar a mesa.","success":"O vínculo do demônio está preso ao primeiro juramento escrito no tratado. Rasgar a página original e recitar o nome de quem foi apagado rompe sua proteção.","failure":"Você não encontra uma pista confiável neste momento. A história segue; o detalhe pode ser descoberto por outra abordagem."},
      "presentNpcIds": ["kagehama-npc-1","kagehama-npc-0","kagehama-npc-2"],
      "createdAt": 0
    }
  ];
