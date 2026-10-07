import roninMalePortrait from '../assets/campaigns/kagehama/classes/ronin/ronin_masculino.png';
import roninFemalePortrait from '../assets/campaigns/kagehama/classes/ronin/ronin_feminino.png';
import samuraiMalePortrait from '../assets/campaigns/kagehama/classes/samurai/samurai_masculino.png';
import samuraiFemalePortrait from '../assets/campaigns/kagehama/classes/samurai/samurai_feminino.png';
import kyudokaMalePortrait from '../assets/campaigns/kagehama/classes/kyudoka/kyudoka_masculino.png';
import kyudokaFemalePortrait from '../assets/campaigns/kagehama/classes/kyudoka/kyudoka_feminino.png';
import shinobiMalePortrait from '../assets/campaigns/kagehama/classes/shinobi/shinobi_masculino.png';
import shinobiFemalePortrait from '../assets/campaigns/kagehama/classes/shinobi/shinobi_feminino.png';
import onmyojiMalePortrait from '../assets/campaigns/kagehama/classes/onmyoji/onmyoji_masculino.png';
import onmyojiFemalePortrait from '../assets/campaigns/kagehama/classes/onmyoji/onmyoji_feminino.png';
import mikoMalePortrait from '../assets/campaigns/kagehama/classes/miko/miko_masculino.png';
import mikoFemalePortrait from '../assets/campaigns/kagehama/classes/miko/miko_feminino.png';

const KAGEHAMA_PORTRAITS = {
  ronin: { male: roninMalePortrait, female: roninFemalePortrait },
  samurai: { male: samuraiMalePortrait, female: samuraiFemalePortrait },
  kyudoka: { male: kyudokaMalePortrait, female: kyudokaFemalePortrait },
  shinobi: { male: shinobiMalePortrait, female: shinobiFemalePortrait },
  onmyoji: { male: onmyojiMalePortrait, female: onmyojiFemalePortrait },
  miko: { male: mikoMalePortrait, female: mikoFemalePortrait },
};

export const KAGEHAMA_CAMPAIGN = {
  "id": "demo-kagehama",
  "schemaVersion": 7,
  "title": "As Sete Lanternas de Kagehama",
  "genre": "Medieval samurai · fantasia histórica",
  "status": "ready-for-play",
  "source": "Campanha original criada para o Mind RolePlay",
  "premise": "Um tratado de paz é roubado, um mensageiro desaparece e três reinos se acusam. Intriga, espionagem e escolhas morais decidirão se Akitsuru entra em guerra.",
  "story": "# As Sete Lanternas de Kagehama\n## Campanha longa de intriga, espionagem e guerra samurai\n\n> Campanha original de fantasia histórica inspirada no Japão feudal. Os clãs, territórios, costumes mágicos e acontecimentos são ficcionais. O material abaixo foi escrito como roteiro de entrada para o Mind Database: cole o texto no campo de roteiro ao instalar a campanha.\n\n## Ficha rápida\n\n- **Gênero:** fantasia histórica, intriga política, espionagem, guerra e drama pessoal.\n- **Tom:** tensão crescente, escolhas difíceis, violência com consequências e momentos de beleza contemplativa.\n- **Duração sugerida:** 14 a 20 sessões, com espaço para histórias pessoais.\n- **Premissa:** durante uma missão diplomática, um tratado de paz é roubado, um mensageiro desaparece e três reinos culpam uns aos outros. Os personagens descobrem que a guerra foi cuidadosamente preparada por pessoas de todos os lados.\n- **Temas:** dever versus consciência, lealdade, verdade, memória, honra pública e responsabilidade pelas consequências.\n- **Abertura:** uma procissão de lanternas cruza a ponte de Kagehama durante um eclipse parcial. Um arqueiro dispara do telhado do templo. O mensageiro imperial cai na água. O estojo do tratado desaparece.\n- **Objetivo dos personagens:** proteger as pessoas envolvidas, descobrir quem fabricou a crise e decidir que tipo de paz merece sobreviver.\n\n## Classes iniciais\n\nEstas classes são arquétipos de nível inicial. A campanha usa testes 3d6 contra o nível efetivo da perícia ou atributo: quanto menor ou igual ao alvo, melhor. Os valores são pontos de partida para o Mind RolePlay e podem ser revistos pelo narrador.\n\n- **Samurai juramentado** — defensor treinado, reconhecido por sua casa e preso a deveres concretos.\n- **Shinobi** — infiltrador, observador e agente de rotas secretas, capaz de desaparecer em lugares comuns.\n- **Onmyōji** — estudioso de presságios, rituais e fenômenos espirituais; também entende política e arquivos.\n- **Batedor de fronteira** — rastreador habituado a florestas, montanhas, caça e perseguições.\n- **Curandeira de campanha** — médica de campo e mediadora, acostumada a tratar feridos de lados diferentes.\n\n### Fichas iniciais sugeridas\n\n| Classe | Atributos (ST/DX/IQ/HT) | Perícias iniciais | Habilidade fixa |\n|---|---|---|---|\n| Samurai juramentado | 12/12/10/11 | Lâmina 13, Etiqueta 11, Intimidação 11 | **Guarda do estandarte:** uma vez por cena, pode interpor-se para proteger alguém próximo; o narrador define o custo ou risco. |\n| Shinobi | 9/14/12/10 | Furtividade 14, Disfarce 12, Arrombamento 12 | **Passo sem testemunha:** com preparação e cobertura, pode cruzar uma área observada sem chamar atenção; falha ainda pode deixar uma pista. |\n| Onmyōji | 9/10/14/10 | Ocultismo 14, Pesquisa 13, Empatia 11 | **Leitura de presságio:** ao estudar um local ou objeto por alguns minutos, faz uma pergunta objetiva sobre o que aconteceu ali; a resposta pode ser incompleta. |\n| Batedor de fronteira | 11/13/11/12 | Rastreamento 14, Sobrevivência 13, Arco 12 | **Rastro dividido:** pode separar pistas de um grupo em movimento e estimar quantidade, direção e intervalo de passagem. |\n| Curandeira de campanha | 9/11/13/11 | Primeiros socorros 14, Medicina 12, Persuasão 12 | **Mãos firmes:** estabiliza um ferido sob pressão e pode obter alguns instantes de conversa antes que a condição piore. |\n\n**Gênero e nome:** escolhidos pelo jogador. A classe define o retrato provisório, as capacidades iniciais e a habilidade fixa. Condições, ferimentos e perdas físicas permanecem na ficha até serem tratados ou mudarem narrativamente. A evolução por pontos é uma etapa posterior da plataforma.\n\n## Princípios de condução\n\n- Toda declaração de ação é uma tentativa. O narrador decide se há risco suficiente para pedir um teste, qual atributo ou perícia se aplica e quais circunstâncias alteram o alvo.\n- Uma tentativa sem oposição e sem risco pode avançar a ficção sem rolagem. Um risco relevante pede 3d6.\n- O narrador descreve o que está em jogo antes da rolagem: o que pode ser ganho, o que pode dar errado e quem será afetado.\n- Sucesso informa o resultado e a consequência. Falha move a história: suspeita, atraso, custo, exposição, ferimento, dívida ou perda de oportunidade.\n- Uma condição persistente muda ações coerentes com ela. Uma mão ferida pode atrapalhar a espada; um braço perdido altera escalada, defesa e manejo de ferramentas. O narrador aplica modificadores consistentes e não apaga a condição entre cenas.\n- Em testes opostos, cada lado rola contra seu próprio alvo; compare o grau de sucesso. A ficção decide o empate.\n- Combates são perigosos e curtos. A iniciativa importa, rendição é possível e feridas deixam marcas.\n- O narrador nunca esconde uma pista essencial atrás de uma única rolagem. Uma falha pode revelar a pista com custo ou levar a outra fonte.\n\n## Viagem como pilar da narração\n\nUma jornada nunca é apenas uma tela de carregamento. Cada deslocamento pode criar alianças, revelar pistas, consumir recursos, agravar ferimentos, provocar perseguições ou mudar a opinião de uma comunidade. O narrador usa o destino e as escolhas dos jogadores para transformar a estrada numa sequência de cenas com consequências.\n\n### Procedimento de viagem\n\n1. **Declare destino e intenção.** O grupo diz aonde quer chegar e o que prioriza: rapidez, discrição, segurança, companhia, coleta de informações ou proteção de alguém.\n2. **Apresente rotas reais.** Antes de escolher, mostre duração aproximada, dificuldade, custos visíveis e riscos conhecidos. Rotas alternativas podem exigir barco, guia, suborno, equipamento ou favor.\n3. **Registre o estado da viagem.** Anote tempo, clima, suprimentos, fadiga, ferimentos e pessoas que acompanham o grupo. Condições já existentes continuam valendo.\n4. **Divida a jornada em trechos significativos.** Uma manhã, uma travessia, uma noite ou uma passagem perigosa pode formar um trecho. Faça ao menos uma cena quando houver algo que permita escolha ou altere o rumo; jornadas seguras podem ser resumidas.\n5. **Mostre um sinal antes do perigo.** Pegadas, silêncio de pássaros, um pedágio recém-montado, fumaça no horizonte ou um barco sem tripulação dão aos jogadores chance de mudar o plano.\n6. **Pergunte como cada pessoa contribui.** Um personagem guia, outro vigia, negocia, caça, cuida de feridos, esconde rastros ou conversa com viajantes. A ação define a perícia.\n7. **Role apenas quando o resultado for incerto e relevante.** A dificuldade considera rota, clima, preparo, habilidade, ferimento, equipamento e ajuda. Um sucesso pode economizar tempo, evitar exposição ou encontrar oportunidade; uma falha pode custar recursos, criar dívida, ferir, atrasar ou revelar a posição.\n8. **Atualize o mundo ao chegar.** O atraso pode mudar uma audiência; a ajuda prestada pode abrir portas; um perseguidor pode chegar antes; um rumor pode preceder o grupo.\n\n### Marcadores leves de jornada\n\nUse marcadores simples, sem transformar cada passo em contabilidade:\n\n- **Tempo:** trechos ou horas até o prazo, patrulha, maré, audiência ou chegada de reforços.\n- **Condição:** ferimentos, fadiga, medo, frio, chuva e efeito sobre habilidades relevantes.\n- **Recursos:** água, comida, flechas, remédios, montarias, dinheiro e favores.\n- **Exposição:** quanto os inimigos sabem da rota, da identidade ou do objetivo do grupo.\n- **Vínculos:** quem viaja junto, quem foi ajudado e quem ficou para trás.\n\nUm marcador só muda quando a cena justifica. Não desconte comida a cada fala nem imponha fadiga em viagem curta sem risco. Se o grupo se prepara bem, mostre a vantagem dessa preparação.\n\n### Tipos de situação de viagem\n\nEscolha ou adapte uma situação coerente com o trecho. Em uma viagem longa, alterne oportunidades, sinais, obstáculos, interações, descobertas e ameaças. Evite repetir emboscadas só para preencher tempo.\n\n**Boas oportunidades:** um barqueiro oferece atalho por um canal; uma aldeia acolhe quem ajudou a reparar o dique; um caçador conhece uma rota discreta; a chuva apaga rastros do grupo; um viajante traz informação verdadeira; um santuário oferece abrigo e tratamento.\n\n**Complicações:** ponte danificada; chuva torna a trilha escorregadia; animal de carga se assusta; patrulha exige documentos; a maré fecha a enseada; alimento foi contaminado; uma roda quebra; um ferido precisa parar; a rota segura passa por território hostil.\n\n**Encontros sociais:** refugiados pedem escolta; soldados desertores querem saber quem os persegue; comerciantes oferecem notícia em troca de garantia; um monge faz uma pergunta que revela uma contradição; um agente reconhece um personagem, mas finge não conhecer.\n\n**Caça e rastreamento:** o grupo pode caçar para obter alimento, rastrear fugitivos, proteger um animal ferido ou seguir pistas sem alertar a presa. Uma caça bem-sucedida pode trazer comida e uma pista; uma falha pode assustar a presa, expor o grupo ou ferir alguém.\n\n**Perseguição:** defina quem tenta alcançar quem, a distância inicial, o terreno e o que encerra a perseguição. Cada personagem declara como ajuda. O cenário deve importar: telhados favorecem agilidade; lama favorece quem conhece o terreno; barco depende da maré; floresta permite despistar, mas pode separar o grupo. Sucessos mudam distância, criam bloqueios ou protegem terceiros; falhas custam tempo, equipamento ou posição.\n\n**Traição na estrada:** sinais pequenos precedem a revelação: uma rota informada cedo demais, uma pessoa que não aparece no ponto combinado, um animal solto, uma mensagem com selo correto e conteúdo impossível. Dê chance de investigar antes que a traição se torne violência. O traidor deve ter objetivo, medo e uma alternativa crível.\n\n### Eventos de jornada para o narrador\n\nUse a tabela como fonte de inspiração, não como obrigação aleatória:\n\n| Situação | Sinal inicial | Escolha dos personagens | Resultado possível |\n|---|---|---|---|\n| Ponte parcialmente caída | cordas novas e madeira rachada | atravessar, procurar vau ou reparar | atraso, atalho perigoso ou favor dos moradores |\n| Caçador ferido | flechas quebradas e trilha de sangue | ajudar, perseguir o agressor ou seguir viagem | aliado, pista ou perda de tempo |\n| Patrulha com ordem falsa | selo legítimo, mensageiro nervoso | mostrar documentos, blefar, observar ou contornar | acesso, suspeita ou perseguição |\n| Chuva súbita | vento vira e pássaros somem | buscar abrigo, acelerar ou apagar rastros | segurança, atraso ou vantagem furtiva |\n| Barqueiro desaparecido | barco à deriva perto da margem | procurar tripulação ou usar o barco | resgate, armadilha ou travessia rápida |\n| Refugiados no caminho | carroça quebrada e crianças cansadas | escoltar, dividir suprimentos ou seguir | vínculo, rumor ou custo de recursos |\n| Caça interrompida | cervo marcado cruza a trilha | caçar, poupar ou seguir o rastro | comida, pista ou consequência moral |\n| Mensagem interceptada | fita amarrada a uma árvore | abrir, devolver ou usar como isca | informação, exposição ou contraespionagem |\n| Rota bloqueada | árvore derrubada com corte limpo | remover, escalar ou procurar desvio | emboscada, descoberta de sabotagem ou demora |\n| Companheiro some à noite | pegadas que param na margem | acordar o grupo, seguir sozinho ou esperar | reencontro, trilha perigosa ou confronto |\n\n### Viagens principais da campanha\n\n| Destino | Tempo típico | Vantagem | Risco e cena provável |\n|---|---|---|---|\n| Kagehama → Santuário de Aokiri | meio dia | abrigo e informação dos monges | trilha falsa, chuva ou patrulha |\n| Kagehama → Aldeia de Sumi | um dia pelo canal | contato com moradores e barqueiros | canal fechado, ordem falsa ou falta de água |\n| Kagehama → Porto de Shirotsu | um dia de barco; dois pela costa | acesso a navios e livros de carga | maré, contrabandistas ou perseguição |\n| Kagehama → Arashi | dois dias pela Estrada do Sino | audiência com Lady Chiyo | pedágios, desfiladeiro e soldados desconfiados |\n| Kagehama → Campos de Hino | três dias pela estrada imperial | suprimentos e testemunhas de comboios | calor, cobrança de milícia e escassez |\n| Aokiri → Desfiladeiro do Sino Quebrado | um trecho de montanha | atalho e linha de visão da torre | deslizamento, cavalo assustado ou emboscada |\n| Kagehama → Arquivos Afogados | uma hora por passagens urbanas | acesso rápido a Jiro e documentos | comportas, água subindo e guardas internos |\n\nA decisão de viajar rápido pode deixar rastros, cansar montarias ou separar o grupo. Viajar com cuidado pode perder uma janela política, mas preservar discrição. A rota escolhida deve refletir prioridades dos personagens, e não uma resposta obviamente correta.\n\n## O mapa geral de Akitsuru\n\nAkitsuru é uma península de vales, montanhas e portos que se abre para o Mar das Garças. A estrada imperial atravessa a região de oeste a leste. No centro fica a capital, Kagehama. O mapa deve mostrar distâncias, desníveis e rotas de fuga; a viagem entre regiões pode ocupar uma ou mais cenas.\n\n| Direção | Região | Relação com Kagehama | Identidade visual |\n|---|---|---|---|\n| Centro-sul | Kagehama e Baía das Lanternas | capital e porto imperial | telhados escuros, canais, pontes, muralhas e lanternas vermelhas |\n| Norte | Serra do Cedro Negro | um dia de viagem pela Estrada do Sino | pinheiros altos, neblina, santuários e passagens estreitas |\n| Noroeste | Domínio de Arashi | dois dias por estrada de montanha | fortalezas de madeira, campos de arroz escalonados e torres de vigia |\n| Nordeste | Floresta de Aokiri | meio dia de trilha além do rio | bambuzais, cedros, ruínas e córregos de pedra |\n| Oeste | Campos de Hino e Castelo da Cinza | três dias pela estrada imperial | planície dourada, canais, vilas muradas e torres de sinal |\n| Leste | Enseada de Shirotsu | um dia de barco ou dois pela costa | falésias brancas, cavernas marinhas, armazéns e faróis |\n| Sul | Ilhas das Garças | travessia de barco | bancos de névoa, vilarejos de pescadores e rochedos cobertos de sal |\n| Sob a cidade | Arquivos Afogados | acesso por comportas antigas | galerias de pedra, água na altura do tornozelo e placas de bronze |\n\n### Rotas e pontos no mapa\n\n- **Estrada do Sino:** Kagehama → ponte de Kagehama → posto de Ichi → Serra do Cedro Negro → Arashi.\n- **Rota dos Arrozais:** Kagehama → canal do norte → aldeia de Sumi → campos de Hino → Castelo da Cinza.\n- **Caminho dos Cedros:** Kagehama → santuário de Aokiri → floresta de Aokiri → travessia antiga → trilha costeira.\n- **Rota marítima:** Porto das Lanternas → Enseada de Shirotsu → Ilhas das Garças.\n- **Passagem clandestina:** depósitos do porto → comporta velha → Arquivos Afogados → cisterna sob o palácio.\n- **Atalho perigoso:** trilha de caça na Serra do Cedro Negro. Economiza horas, mas fica exposta a deslizamentos e patrulhas.\n\n## Reinos, casas e facções\n\n### Shogunato de Hoshin\n\nGoverna a península em nome de uma corte imperial distante. O jovem shogun Harunobu é respeitado, mas não controla diretamente os exércitos. A regente Kuroda administra o conselho e afirma buscar estabilidade.\n\n### Reino de Arashi\n\nDomínio montanhoso do clã Arashi. Seus senhores controlam minas de ferro, pedreiras e os desfiladeiros ao norte. Querem autonomia e segurança para as rotas de comércio. A população está cansada das requisições militares.\n\n### Liga de Hino\n\nCidades agrícolas ligadas por canais e contratos. Não têm um único senhor: mercadores, aldeões e capitães de milícia disputam autoridade. Se os canais forem fechados, Kagehama passa fome em poucas semanas.\n\n### Casa Kuroda\n\nAdministradores do shogunato e guardiões dos selos oficiais. Querem centralizar o poder. Publicamente defendem a paz; em segredo, partes da casa alimentam uma crise limitada para dissolver o conselho rival.\n\n### Clã Arashi\n\nSenhores da fronteira norte. A líder atual, Lady Chiyo, aceita negociar, mas não entrega as minas nem a autonomia do clã. Um primo dela deseja guerra e acredita que a hesitação será interpretada como fraqueza.\n\n### Casa Sen\n\nRede de mensageiros, informantes e agentes infiltrados em hospedarias e santuários. Serviu a diferentes senhores ao longo das gerações. Parte da Casa Sen protege civis; outra parte vende informação para financiar a própria sobrevivência.\n\n### Irmandade do Junco Branco\n\nRede clandestina de curandeiros, monges e barqueiros. Resgata fugitivos e esconde documentos. Recusa-se a servir a um senhor, mas suas rotas podem ser usadas tanto para salvar pessoas quanto para contrabandear armas.\n\n### Companhia do Marfim\n\nConsórcio de comerciantes estrangeiros ficcionais, com navios, crédito e intérpretes. Fornece armas a quem pagar e lucra com rotas abertas. Não controla a conspiração, mas está disposta a ampliar o conflito se isso proteger seus contratos.\n\n## NPCs centrais\n\n### NPC — Lady Akiho Senda — mediadora do shogun\n\n**Visual:** cerca de quarenta anos, quimono de viagem azul-acinzentado, mangas presas por cordões de seda, cabelo com fios brancos e um leque de madeira rachado. Carrega um pequeno sinete imperial numa bolsa interna.  \n**Comportamento:** fala baixo, escuta sem interromper e repete a última frase de alguém quando quer que a pessoa perceba uma contradição. Nunca ameaça diretamente.  \n**Objetivo:** impedir a guerra sem entregar o governo a Kuroda.  \n**Segredo:** aceitou uma cópia não oficial do tratado, pois suspeitava que a versão oficial seria alterada.  \n**Como interpretar:** pede que os personagens provem que podem guardar um segredo antes de lhes contar o próximo.\n\n### NPC — Ren Kuroda — regente do conselho\n\n**Visual:** homem alto, roupa formal negra sem joias, cabelo impecável e uma bengala com ponteira de prata. A mão esquerda treme levemente quando ele está irritado.  \n**Comportamento:** educado até quando ameaça; oferece chá, tempo e uma saída honrosa. Faz perguntas que parecem gentis, mas medem lealdades.  \n**Objetivo:** terminar a fragmentação política de Akitsuru, mesmo que provoque uma guerra curta.  \n**Segredo:** autorizou o roubo do estojo do tratado, mas não ordenou o assassinato do mensageiro.  \n**Como interpretar:** nunca mente sobre o que considera essencial; omite contexto e enquadra fatos.\n\n### NPC — Tomoe Arashi — herdeira desaparecida\n\n**Visual:** jovem de postura marcial, cabelo cortado na altura do queixo, armadura leve de placas escuras e uma fita vermelha no pulso. Está disfarçada como uma escriba chamada Nao.  \n**Comportamento:** analisa portas, janelas e quem permanece calado. Sorri com facilidade, mas testa as promessas com pequenas solicitações.  \n**Objetivo:** levar a prova da falsificação a alguém que não pertença a um clã.  \n**Segredo:** matou em legítima defesa um capitão que tentou entregá-la. Esconde o nome dele por medo de que a culpa recaia sobre seus soldados.  \n**Como interpretar:** pode cooperar, fugir ou enfrentar os personagens; nunca aceita ser tratada como carga.\n\n### NPC — Jiro “Três Chuvas” — mensageiro imperial\n\n**Visual:** homem magro, capa de palha escura, sandálias gastas e três pequenos sinos costurados por dentro da gola.  \n**Comportamento:** conta passos quando está nervoso e memoriza os rostos de todos na sala.  \n**Objetivo:** entregar a cópia verdadeira do tratado à mediadora Akiho.  \n**Segredo:** sobreviveu ao ataque inicial e se escondeu nos Arquivos Afogados. Está ferido e acredita que a Casa Sen o traiu.  \n**Como interpretar:** confia em quem lhe oferece uma rota de saída, não em quem promete proteção.\n\n### NPC — Sayo — agente da Casa Sen\n\n**Visual:** mulher de meia-idade, rosto comum e roupas de viajante. A única constante é um cordão de contas de madeira: uma conta foi queimada.  \n**Comportamento:** muda o modo de andar e o sotaque conforme o grupo; observa reflexos em janelas e poças.  \n**Objetivo:** impedir que os agentes da Casa Sen sejam usados como culpados por uma operação de Kuroda.  \n**Segredo:** foi ela quem transportou o estojo roubado; devolveu o tratado, mas reteve uma página que compromete seu irmão.  \n**Como interpretar:** oferece informação verificável, mas exige algo concreto em troca.\n\n### NPC — Monge Genzō — guardião do santuário de Aokiri\n\n**Visual:** cabeça raspada, capa remendada, bengala coberta de marcas e um cão velho chamado Nuvem.  \n**Comportamento:** prepara chá para qualquer visitante, mas serve a bebida apenas quando percebe que a pessoa parou de mentir.  \n**Objetivo:** proteger os refugiados abrigados no santuário.  \n**Segredo:** há uma entrada para os Arquivos Afogados sob o altar, usada décadas atrás para retirar documentos da capital.  \n**Como interpretar:** responde perguntas com outra pergunta; não testa fé, testa intenção.\n\n### NPC — Lady Chiyo Arashi — senhora do norte\n\n**Visual:** armadura laqueada verde-musgo, cabelo preso com agulha de osso e queimadura antiga no lado direito do pescoço.  \n**Comportamento:** deixa a outra pessoa terminar. Quando discorda, pergunta qual custo ela está disposta a pagar pessoalmente.  \n**Objetivo:** manter o domínio de Arashi e evitar que seus camponeses sejam levados para uma guerra distante.  \n**Segredo:** sabe que o sobrinho Daichi negocia armas com a Companhia do Marfim.  \n**Como interpretar:** respeita atos públicos de responsabilidade mais do que discursos sobre honra.\n\n### NPC — Daichi Arashi — capitão de fronteira\n\n**Visual:** armadura vermelha, lança com ponta escurecida e uma faixa branca amarrada no cabo.  \n**Comportamento:** provoca antes de atacar; se alguém recua sem humilhar seus soldados, pode permitir a fuga.  \n**Objetivo:** liderar Arashi numa guerra de independência.  \n**Segredo:** não sabe que seus fornecedores pretendem vender a localização de seus depósitos ao shogunato.  \n**Como interpretar:** é antagonista de oportunidade; pode tornar-se aliado se a ameaça externa ficar clara.\n\n### NPC — Akane — curandeira da Irmandade do Junco Branco\n\n**Visual:** avental cinza sobre roupa de monja, mãos manchadas de ervas, cabelo preso por um palito de bambu.  \n**Comportamento:** trabalha enquanto conversa e interrompe qualquer discussão que ponha pacientes em risco.  \n**Objetivo:** abrir um corredor neutro para feridos e refugiados.  \n**Segredo:** está tratando um agente Kuroda ferido que viu o assassinato do mensageiro.  \n**Como interpretar:** não aceita promessas; pede um gesto útil e observável.\n\n### NPC — Mestre Tetsuo — armeiro de Kagehama\n\n**Visual:** homem largo, barba curta, avental de couro queimado e dois dedos ausentes na mão esquerda.  \n**Comportamento:** conversa com ferramentas como se fossem clientes; detesta que toquem nas lâminas sem pedir.  \n**Objetivo:** impedir que suas armas sejam usadas para matar aldeões.  \n**Segredo:** reconhece o lote que matou o mensageiro: foi vendido sob um selo oficial roubado.  \n**Como interpretar:** ajuda quem revela o que pretende fazer com uma arma antes de pedir para consertá-la.\n\n### NPC — Nuvem — cão do santuário\n\n**Visual:** cão branco envelhecido, uma orelha caída e manchas cinzentas nas patas.  \n**Comportamento:** rosna para pessoas que escondem sangue fresco, mas dorme junto de quem está de luto.  \n**Função:** pode encontrar um rastro ou revelar tensão, nunca substitui uma pista essencial.\n\n## Lugares detalhados\n\n### Local — 1. Ponte das Sete Lanternas\n\n**Visual:** ponte larga de madeira escura sobre um canal de maré. Sete lanternas de papel vermelho estão presas a mastros curtos. A quarta lanterna oscila mesmo quando o ar está parado. Há nichos de oração na parte inferior.  \n**Som e cheiro:** água sob as tábuas, sinos distantes, óleo de lamparina e peixe salgado.  \n**Uso narrativo:** cena de abertura, perseguição, encontro secreto ou emboscada. A multidão oferece cobertura e testemunhas conflitantes.  \n**Comportamento do local:** guardas se concentram nas entradas; barqueiros observam a água; vendedores repetem versões diferentes do disparo.  \n**Pistas:** um fragmento de flecha com encaixe de fabricação de Kagehama; uma conta de madeira chamuscada; marcas de arrasto que terminam no cais e não na margem.\n\n### Local — 2. Distrito dos Tecelões, Kagehama\n\n**Visual:** ruas estreitas com toldos índigo, varais cruzando entre casas e canais de drenagem. As fachadas escondem pequenas portas laterais.  \n**Som e cheiro:** teares batendo, vendedores chamando clientes, vapor de arroz e tinta.  \n**Uso narrativo:** espionagem, troca de identidades e perseguição em telhados baixos.  \n**Comportamento do local:** todos conhecem alguém que viu alguma coisa, mas cada testemunha teme perder o trabalho.  \n**Pista:** uma tecelã viu o mensageiro entrar num depósito sem escolta e sair acompanhado por alguém usando o uniforme de um guarda que estava oficialmente de serviço em outro lugar.\n\n### Local — 3. Casa de Chá da Lua Baixa\n\n**Visual:** salão comprido junto ao canal, painéis de papel translúcido, jardim interno de pedras e uma sala privada com porta que não fecha completamente.  \n**Som e cheiro:** água pingando numa bacia de bambu, chá tostado, madeira úmida e cordas de shamisen ao anoitecer.  \n**Uso narrativo:** negociação, flerte, vigilância, chantagem e troca de mensagens.  \n**Comportamento do local:** a anfitriã Rin deixa os clientes falarem primeiro; os criados lembram dos calçados, não dos rostos.  \n**Pista:** um recibo dobrado sob a mesa relaciona a compra de cordas, óleo e duas caixas de flechas a um armazém do governo.\n\n### Local — 4. Santuário de Aokiri\n\n**Visual:** escadaria de pedra coberta de musgo, portão vermelho desbotado e cedros tão antigos que suas raízes levantam o caminho. O salão principal não tem estátua: há apenas um espelho de bronze virado para a parede.  \n**Som e cheiro:** vento nas copas, passos abafados, incenso de pinho.  \n**Uso narrativo:** abrigo, investigação espiritual, negociação com Genzō e entrada para a floresta.  \n**Comportamento do local:** refugiados não fazem perguntas a quem chega molhado ou ferido.  \n**Pista:** marcas recentes na escadaria indicam que alguém carregou uma pessoa inconsciente para dentro.\n\n### Local — 5. Floresta de Aokiri\n\n**Visual:** trilhas que se dividem sem aviso, troncos verdes de musgo, fitas brancas em galhos e pedras com marcas de cinzel. O luar não atravessa a copa em algumas clareiras.  \n**Som e cheiro:** água corrente, grilos, folhas esmagadas e fumaça distante.  \n**Uso narrativo:** caça a um animal ferido, rastreamento de fugitivos, emboscada ou fuga.  \n**Comportamento do local:** o terreno muda com a chuva; pegadas recentes confundem-se com trilhas de cervos.  \n**Pista:** cinzas de papel com metade de um selo oficial e pegadas de alguém que mancava no pé esquerdo.\n\n### Local — 6. Arquivos Afogados\n\n**Visual:** corredores de pedra sob a cidade, prateleiras de cedro elevadas sobre suportes, água escura até os tornozelos e placas de bronze com datas riscadas. Algumas salas estão inundadas até o teto.  \n**Som e cheiro:** goteiras, correntes antigas, lodo e tinta dissolvida.  \n**Uso narrativo:** encontrar Jiro, recuperar a versão verdadeira do tratado e enfrentar uma equipe que conhece as comportas.  \n**Comportamento do local:** abrir uma comporta pode salvar alguém ou apagar uma prova.  \n**Pistas:** uma página do tratado tem tinta e fibra de papel de épocas diferentes; o selo foi pressionado antes de a tinta secar.\n\n### Local — 7. Castelo da Cinza\n\n**Visual:** fortaleza de pedra negra e madeira clara, muralha externa reparada com blocos de cores distintas, pátio de areia varrido e uma torre com marcas de incêndio.  \n**Som e cheiro:** bandeiras estalando, martelos, fumaça de cozinha e metal polido.  \n**Uso narrativo:** audiência política, duelo, intriga entre soldados ou fuga pelos telhados.  \n**Comportamento do local:** todo corredor tem um responsável; os guardas pedem a razão da visita antes do nome.  \n**Pista:** a enfermaria conserva um ferido que viu Daichi negociar com a Companhia do Marfim.\n\n### Local — 8. Porto de Shirotsu\n\n**Visual:** cais sobre falésias brancas, guindastes de madeira, armazéns marcados por tinta azul e um farol de três janelas.  \n**Som e cheiro:** cordas tensionadas, gaivotas, sal, algas e óleo de navio.  \n**Uso narrativo:** infiltração, combate em passarelas, perseguição em barco ou negociação com comerciantes.  \n**Comportamento do local:** marinheiros contam carga, não passageiros; o faroleiro enxerga luzes que os demais não percebem.  \n**Pista:** dois navios registraram a mesma carga com destinos diferentes; alguém financiou a diferença.\n\n### Local — 9. Aldeia de Sumi\n\n**Visual:** casas baixas de barro e madeira, diques pequenos, rodas d’água e campos de arroz inclinados. Uma ponte de corda leva ao moinho.  \n**Som e cheiro:** água nos canais, grilos e palha molhada.  \n**Uso narrativo:** caça de subsistência, proteção de civis, recrutamento e consequência da política dos clãs.  \n**Comportamento do local:** moradores escondem comida quando tropas se aproximam; crianças sabem rotas que não aparecem nos mapas.  \n**Pista:** o canal foi fechado por ordem escrita com um selo legítimo, mas entregue por um mensageiro falso.\n\n### Local — 10. Desfiladeiro do Sino Quebrado\n\n**Visual:** paredões estreitos, um sino partido preso a uma árvore e uma trilha de pedra que some junto ao precipício.  \n**Som e cheiro:** vento que parece voz, cascalho e chuva.  \n**Uso narrativo:** perseguição montada, emboscada, duelo ou negociação sob ameaça.  \n**Comportamento do local:** cavalos percebem o risco antes dos humanos.  \n**Pista:** o sino foi serrado de dentro para fora; alguém preparou o desfiladeiro antes da perseguição.\n\n## Roteiro da campanha\n\n### Prólogo — As lanternas não mentem\n\nOs personagens estão na procissão da Ponte das Sete Lanternas. Podem ser guarda, mensageiro, curandeira, convidado, informante ou viajante. Um disparo corta a música. Jiro cai no canal; o estojo do tratado some. Uma mulher de mangas brancas grita que viu um shinobi, mas descreve um uniforme de guarda.\n\n**Testes possíveis:** perceber o ponto do disparo, mergulhar para salvar Jiro, controlar o pânico da multidão, perseguir a pessoa com o estojo, impedir que os guardas ataquem civis.  \n**Consequências:** cada sucesso resgata uma pessoa, uma pista ou tempo. Uma falha nunca encerra a investigação; pode ferir alguém, separar o grupo ou fazer os personagens parecerem cúmplices.\n\n### Ato I — A cidade das versões\n\n#### Capítulo 1: O salão das testemunhas\n\nAkiho convoca os personagens para uma sala lateral do palácio. Cada facção oferece uma versão: os Arashi atacaram o mensageiro; a Casa Sen roubou o tratado; a Companhia do Marfim forneceu as flechas. Ninguém está inteiramente errado.\n\nOs personagens investigam a ponte, o Distrito dos Tecelões e a Casa de Chá da Lua Baixa. A anfitriã Rin sabe que o mensageiro visitou o salão na noite anterior, mas só fala se os personagens protegem uma jovem criada ameaçada por um cobrador.\n\n#### Capítulo 2: Três contas queimadas\n\nUma trilha leva ao santuário de Aokiri. Sayo admite que transportou o estojo, mas diz que o tratado já estava faltando quando o recebeu. Ela oferece a localização de uma página roubada em troca de salvo-conduto para seu irmão.\n\nGenzō pede que o grupo encontre dois refugiados que desapareceram na floresta. O rastro cruza uma rota de caça e um esconderijo de Daichi.\n\n#### Capítulo 3: O homem sob a água\n\nOs personagens entram nos Arquivos Afogados. Jiro está vivo, ferido e desconfiado. Ele revela que a cópia original do acordo descrevia autonomia para Arashi e limites às tropas do shogunato. A versão pública amplia o poder de Kuroda.\n\nUma comporta começa a abrir. O grupo pode salvar Jiro, os documentos ou os próprios personagens sem ajuda externa. Se dividirem a equipe, cada decisão cria uma consequência real.\n\n### Ato II — Fronteiras de papel\n\n#### Capítulo 4: A caça do cervo negro\n\nUm cervo ferido atravessa a estrada com uma flecha de fabricação oficial. A caça leva a um posto abandonado onde soldados de dois clãs foram mortos depois de um falso encontro diplomático.\n\nO grupo pode rastrear o arqueiro, cuidar do animal ou esconder os corpos antes da chegada das patrulhas. O arqueiro é um jovem recrutado por Daichi que acredita ter atirado em desertores.\n\n#### Capítulo 5: O mensageiro que não chegou\n\nEm Sumi, os canais foram fechados. Sem água, a aldeia não terá colheita. O selo na ordem é verdadeiro; o portador, falso. Descobrir quem o contratou exige combinar testemunhos, horários e uma fita de papel especial vendida no porto.\n\nAkane organiza um corredor de retirada para crianças e feridos. Os personagens escolhem se desviam o canal, expõem o oficial responsável ou negociam uma abertura temporária.\n\n#### Capítulo 6: Um duelo sem vencedor\n\nLady Chiyo oferece uma audiência no Castelo da Cinza. Daichi exige um duelo público para provar que o shogunato não controla a fronteira. O duelo pode ser de lâminas, palavras, arco ou demonstração de autocontrole.\n\nA intenção não é matar: é medir quem pode conter os próprios aliados. Se os personagens humilham Daichi, ele se torna inimigo. Se o enfrentam com firmeza e preservam a dignidade dos soldados, ele pode admitir que os comerciantes o financiaram.\n\n#### Capítulo 7: A noite da enseada\n\nUma embarcação da Companhia do Marfim parte de Shirotsu. Ela leva armas, cópias falsas do tratado e uma lista de informantes. Os personagens podem seguir por terra, contratar pescadores ou infiltrar-se como tripulação.\n\nDurante a perseguição, a maré sobe e uma vela se incendeia. O capitão abandona uma caixa de documentos para manter o navio flutuando. Entre as páginas há um recibo assinado por um funcionário Kuroda.\n\n### Ato III — O preço da verdade\n\n#### Capítulo 8: A herdeira chamada Nao\n\nA escriba Nao revela ser Tomoe Arashi. Ela possui uma matriz de selo que prova que o documento oficial foi impresso depois do suposto acordo. Porém, revelar isso também a identifica como fugitiva e coloca seus soldados sob acusação de traição.\n\nTomoe quer falar diante do conselho. Akiho quer divulgar a prova primeiro entre os líderes regionais. O grupo decide se confia a matriz a alguém, faz cópias ou usa a evidência para negociar.\n\n#### Capítulo 9: Traição no santuário\n\nUm agente da Casa Sen entrega o esconderijo dos refugiados a uma patrulha em troca de anistia. Sayo percebe o vazamento, mas a pessoa que traiu a rede é seu irmão. Ele alega que Kuroda mantém sua família como refém.\n\nO confronto pode ser combate, fuga, negociação ou um plano para resgatar a família. A cena deve revelar que a traição não elimina os laços afetivos; torna a confiança mais difícil.\n\n#### Capítulo 10: A torre de sinal\n\nUma torre na Serra do Cedro Negro envia sinais que mobilizam tropas. Chiyo pede aos personagens que a desativem sem matar os guardas, muitos deles camponeses convocados. Uma tempestade aproxima-se e a escadaria está parcialmente desabada.\n\nSe a torre cair, o exército demora. Se for tomada intacta, o grupo obtém mensagens cifradas que mostram que Kuroda pretendia limitar a guerra a três dias. O plano ainda custaria centenas de vidas.\n\n### Ato IV — Sete lanternas, sete escolhas\n\n#### Capítulo 11: Conselho em Kagehama\n\nAkiho convoca um conselho emergencial. Os personagens precisam apresentar a verdade diante de pessoas que já escolheram lados. As evidências incluem a matriz de Tomoe, o lote de flechas, a página original e o testemunho de Jiro.\n\nCada prova precisa de uma testemunha ou de uma explicação verificável. Kuroda não será derrotado por um único discurso; os personagens devem proteger quem confirma os fatos.\n\n#### Capítulo 12: O cerco dos canais\n\nUma força desconhecida ocupa as comportas e interrompe o abastecimento de Kagehama. Kuroda afirma que os Arashi começaram o ataque. Daichi chega com soldados para ajudar a abrir o canal, mas seu estandarte também provoca pânico.\n\nO grupo precisa escolher rotas, proteger civis, impedir saques e abrir passagens para os feridos. Use três frentes: a comporta, a enfermaria improvisada e a muralha do porto.\n\n#### Capítulo 13: O regente e a lâmina\n\nKuroda se encontra com os personagens na sala de mapas. Ele oferece um acordo: revelar parte da falsificação, preservar o conselho e atribuir as mortes a um capitão morto. A alternativa é expor tudo e arriscar que o shogunato se fragmente.\n\nSe houver combate, ele tenta incapacitar e escapar, não lutar até a morte. Ele acredita que uma paz imposta evitará guerras futuras. Os personagens podem prendê-lo, expô-lo, negociar uma rendição ou deixá-lo fugir com uma prova.\n\n#### Epílogo: O que a paz exige\n\nA campanha termina com uma sessão de consequência. Quem controla os canais? Tomoe voltou para Arashi? A Casa Sen foi dissolvida ou reformada? Os comerciantes mantêm seus contratos? O shogun governa ou é apenas símbolo? Que personagem ficou ferido, famoso, desacreditado ou em dívida?\n\nAs sete lanternas da ponte são reacendidas. Uma pode permanecer apagada como memorial.\n\n## Rede de pistas\n\n| Descoberta | Fonte principal | Confirmação alternativa |\n|---|---|---|\n| O disparo veio de um posto de guarda | fragmento de flecha na ponte | ferreiro Tetsuo reconhece o lote |\n| O estojo foi movido antes do ataque | testemunha no Distrito dos Tecelões | recibo da Casa de Chá |\n| O tratado público foi alterado | tinta e papel nos Arquivos Afogados | matriz de selo de Tomoe |\n| A Casa Sen transportou o estojo | relato de Sayo | cordão de contas chamuscado |\n| As armas passaram pela Companhia do Marfim | livro de carga em Shirotsu | jovem arqueiro de Daichi |\n| O mensageiro sobreviveu | água e sangue nos arquivos | Akane tratou os ferimentos |\n| Kuroda autorizou o roubo, não o assassinato | correspondência cifrada da torre | depoimento do agente ferido |\n\n## Desafios de interação para testar o Mind RolePlay\n\n1. Um personagem tenta convencer uma guarda de que a ordem é falsa, sem apresentar prova.\n2. Um shinobi tenta seguir Sayo pela multidão sem ser reconhecido.\n3. O batedor tenta rastrear um grupo durante a chuva, separando rastros de soldados e aldeões.\n4. A curandeira tenta estabilizar Jiro enquanto outra personagem interroga o mensageiro.\n5. O samurai tenta conter um duelo sem desonrar o oponente.\n6. Um personagem ferido no braço tenta subir uma parede carregando outra pessoa.\n7. O grupo tenta caçar para alimentar refugiados sem ferir o cervo marcado.\n8. Um personagem percebe que um aliado está mentindo por medo, não por malícia.\n9. O grupo tenta atravessar o canal antes que a comporta se feche.\n10. Um jogador acusa publicamente Kuroda; o narrador deve perguntar que prova ele apresenta e quem está ouvindo.\n11. Os personagens tentam negociar com Daichi depois de capturar um de seus soldados.\n12. Uma personagem tenta perdoar Sayo e manter a aliança com a Casa Sen.\n\nPara cada tentativa, determine intenção, risco, habilidade pertinente, modificadores coerentes e consequências possíveis antes da rolagem. Um resultado não substitui a decisão do jogador: ele define como a tentativa se resolve.\n\n## Lista de preparação visual\n\n- Mapa regional de Akitsuru com estradas, canais, montanhas e portos.\n- Mapa simples de Kagehama, com o palácio, ponte, distrito, porto e comportas.\n- Retratos de Akiho, Ren, Tomoe, Jiro, Sayo, Genzō, Chiyo, Daichi, Akane e Tetsuo.\n- Retratos-base das cinco classes iniciais, com espaço para gênero e variações individuais.\n- Cenários: Ponte das Sete Lanternas, Casa de Chá da Lua Baixa, Santuário de Aokiri, Arquivos Afogados, Castelo da Cinza, Porto de Shirotsu, Aldeia de Sumi e Desfiladeiro do Sino Quebrado.\n- Tokens de patrulha, mensageiros, barqueiros, refugiados e soldados de fronteira.\n- Props: tratado com duas versões, matriz de selo, flecha oficial, cordão de contas queimado, livro de carga e mapa de comportas.\n- Estados de cena: ponte durante procissão, ponte após ataque, floresta seca, floresta na chuva, porto ao amanhecer e canal durante o cerco.\n\n## Notas para o narrador\n\nEste roteiro é uma base modular. Os personagens dos jogadores devem alterar relações, rotas e resultados. Não imponha uma única solução para a conspiração. Ren pode ser preso, convencido, exposto ou sucedido por alguém pior. Tomoe pode liderar Arashi ou abandonar a política. Sayo pode reconstruir a Casa Sen. O objetivo é dar informação suficiente para escolhas consequentes, e não proteger uma trama predeterminada.\n\nAo descrever um lugar, escolha dois detalhes sensoriais e um comportamento de pessoas presentes. Ao apresentar um NPC, mostre primeiro um gesto observável; revele o segredo apenas quando os personagens fizerem perguntas, oferecerem algo ou criarem confiança.\n\n\n",
  "classes": [
    {
      "id": "ronin",
      "name": "Combatente de resistência",
      "archetype": "Combatente de resistência",
      "icon": "⚔",
      "portrait": "assets/campaigns/kagehama/classes/ronin/ronin_masculino.png",
      "description": "Errante de fronteira que resiste ao cansaço, abre passagem e protege quem não pode se defender.",
      "attributes": {
        "ST": 14,
        "DX": 11,
        "IQ": 10,
        "HT": 13
      },
      "skills": [
        {
          "name": "Lâmina pesada",
          "attribute": "ST",
          "level": 13,
          "description": "Ataques fortes, abrir passagem e controlar espaço próximo."
        },
        {
          "name": "Sobrevivência",
          "attribute": "HT",
          "level": 12,
          "description": "Achar abrigo, reconhecer recursos e manter a viagem."
        },
        {
          "name": "Intimidação",
          "attribute": "Will",
          "level": 12,
          "description": "Impor limite com presença ou ameaça; pode piorar relações."
        }
      ],
      "fixedAbilities": [
        "Fúria contida: uma vez por cena, transforma um ferimento ou provocação em foco para uma ação física; o narrador registra o custo emocional ou social."
      ],
      "startingLevel": 1,
      "artBrief": "Retrato vertical de corpo inteiro, rōnin japonês de fantasia histórica, haori gasto em vermelho escuro e cinza, nodachi embainhada, postura robusta e cansada, cicatriz discreta, fundo de estrada de montanha com lanternas distantes, pintura editorial realista, luz cinematográfica, sem texto.",
      "genderOptions": [
        "male",
        "female"
      ],
      "roleplayProfile": {
        "voice": "Fala direta, econômica; evita ostentar bravura.",
        "want": "Proteger viajantes e recuperar um nome que perdeu.",
        "fear": "Voltar a depender de um senhor que trate pessoas como peças.",
        "narratorGuidance": "Não ataca por orgulho vazio: exige causa concreta, sinaliza o risco e para quando a proteção deixa de fazer sentido."
      },
      "visualCore": "Rōnin viajante de fantasia histórica, armadura leve remendada, haori curto gasto, nodachi embainhada, postura de guarda inclinada e olhar cansado. Silhueta larga, cicatriz pequena, cordão de viagem e sandálias enlameadas.",
      "assetPaths": {
        "male": "assets/campaigns/kagehama/classes/ronin/ronin_masculino.png",
        "female": "assets/campaigns/kagehama/classes/ronin/ronin_feminino.png"
      }
    },
    {
      "id": "samurai",
      "name": "Samurai juramentado",
      "archetype": "Samurai juramentado",
      "icon": "⛨",
      "portrait": "assets/campaigns/kagehama/classes/samurai/samurai_masculino.png",
      "description": "Defensor treinado, cuja armadura e brasão anunciam uma lealdade que pode entrar em conflito com a consciência.",
      "attributes": {
        "ST": 12,
        "DX": 12,
        "IQ": 11,
        "HT": 12
      },
      "skills": [
        {
          "name": "Katana",
          "attribute": "DX",
          "level": 13,
          "description": "Atacar, aparar e reconhecer técnica de espada."
        },
        {
          "name": "Etiqueta",
          "attribute": "IQ",
          "level": 12,
          "description": "Ler hierarquia, protocolo, insultos e obrigações formais."
        },
        {
          "name": "Tática",
          "attribute": "IQ",
          "level": 12,
          "description": "Avaliar terreno, proteger aliados e antecipar manobras."
        }
      ],
      "fixedAbilities": [
        "Guarda do estandarte: uma vez por cena, pode interpor-se para proteger alguém próximo; o narrador define o risco ou custo."
      ],
      "startingLevel": 1,
      "artBrief": "Retrato vertical de corpo inteiro, samurai de fantasia histórica com yoroi azul petróleo e detalhes dourados, katana embainhada, postura serena e alerta, brasão de clã simples sem letras, pátio de castelo chuvoso, pintura editorial realista, luz cinematográfica, sem texto.",
      "genderOptions": [
        "male",
        "female"
      ],
      "roleplayProfile": {
        "voice": "Frases formais, respostas medidas; chama as pessoas pelo título até ganhar confiança.",
        "want": "Cumprir um juramento sem permitir que ele vire desculpa para crueldade.",
        "fear": "Descobrir que seu próprio clã fabricou a ordem que deve obedecer.",
        "narratorGuidance": "Diante de conflito, procura protocolo e testemunhas primeiro; se a violência começar, prioriza cobertura e evacuação."
      },
      "visualCore": "Samurai viajante com yoroi simples, cordão de brasão sem símbolos escritos, katana na bainha e mão próxima ao punho sem sacar. Postura disciplinada, ombros alinhados, rosto sereno e atento.",
      "assetPaths": {
        "male": "assets/campaigns/kagehama/classes/samurai/samurai_masculino.png",
        "female": "assets/campaigns/kagehama/classes/samurai/samurai_feminino.png"
      }
    },
    {
      "id": "kyudoka",
      "name": "Kyūdōka",
      "archetype": "Kyūdōka",
      "icon": "弓",
      "portrait": "assets/campaigns/kagehama/classes/kyudoka/kyudoka_masculino.png",
      "description": "Arqueiro e sentinela que lê vento, terreno, pegadas e movimentos distantes antes de agir.",
      "attributes": {
        "ST": 11,
        "DX": 14,
        "IQ": 12,
        "HT": 11
      },
      "skills": [
        {
          "name": "Arco longo",
          "attribute": "DX",
          "level": 14,
          "description": "Atirar com arco, ajustar distância e considerar vento."
        },
        {
          "name": "Rastreamento",
          "attribute": "IQ",
          "level": 13,
          "description": "Seguir rastros e estimar direção, tamanho e tempo."
        },
        {
          "name": "Percepção",
          "attribute": "Per",
          "level": 13,
          "description": "Notar movimento, detalhes ou sinais de perigo."
        }
      ],
      "fixedAbilities": [
        "Disparo calculado: com tempo para observar, identifica uma linha de tiro segura ou um detalhe distante antes de agir."
      ],
      "startingLevel": 1,
      "artBrief": "Retrato vertical de corpo inteiro, arqueira kyūdōka de fantasia histórica com roupas de viagem verde musgo, arco longo yumi e aljava, postura de mira elegante, mata de bambu e neblina ao fundo, pintura editorial realista, luz cinematográfica, sem texto.",
      "genderOptions": [
        "male",
        "female"
      ],
      "roleplayProfile": {
        "voice": "Observações curtas sobre vento, terreno e distância; fala depois de observar.",
        "want": "Manter a rota segura e provar que consegue agir sem desperdiçar uma flecha.",
        "fear": "Disparar contra uma pessoa cuja intenção não compreendeu.",
        "narratorGuidance": "Pede posição e linha de visão antes de agir; mede risco a aliados e não resolve todo obstáculo com ataque."
      },
      "visualCore": "Arqueiro kyūdōka com yumi alto e aljava, roupa de viagem ajustada para movimento, dedos protegidos, olhar de foco lateral. Corpo esguio e postura de mira relaxada, não disparando.",
      "assetPaths": {
        "male": "assets/campaigns/kagehama/classes/kyudoka/kyudoka_masculino.png",
        "female": "assets/campaigns/kagehama/classes/kyudoka/kyudoka_feminino.png"
      }
    },
    {
      "id": "shinobi",
      "name": "Shinobi",
      "archetype": "Shinobi",
      "icon": "忍",
      "portrait": "assets/campaigns/kagehama/classes/shinobi/shinobi_masculino.png",
      "description": "Infiltrador que vence com preparo, observação, disfarce e rotas discretas, evitando confronto desnecessário.",
      "attributes": {
        "ST": 9,
        "DX": 14,
        "IQ": 13,
        "HT": 11
      },
      "skills": [
        {
          "name": "Furtividade",
          "attribute": "DX",
          "level": 14,
          "description": "Mover-se sem ser visto ou ouvido; falhas podem deixar vestígios."
        },
        {
          "name": "Disfarce",
          "attribute": "IQ",
          "level": 13,
          "description": "Adotar aparência, papel e comportamento plausíveis."
        },
        {
          "name": "Investigação",
          "attribute": "IQ",
          "level": 12,
          "description": "Observar contradições, cruzar pistas e procurar entradas."
        }
      ],
      "fixedAbilities": [
        "Passo sem testemunha: com preparação e cobertura, pode cruzar uma área observada sem chamar atenção; uma falha ainda pode deixar uma pista."
      ],
      "startingLevel": 1,
      "artBrief": "Retrato vertical de corpo inteiro, shinobi de fantasia histórica em roupas de viagem índigo e carvão, lenço baixo no pescoço sem cobrir o rosto, pequenas ferramentas discretas, telhados de Kagehama à noite, pintura editorial realista, luz cinematográfica, sem texto.",
      "genderOptions": [
        "male",
        "female"
      ],
      "roleplayProfile": {
        "voice": "Perguntas discretas, humor seco; evita responder tudo de imediato.",
        "want": "Descobrir quem move as peças e deixar uma saída para o grupo.",
        "fear": "Ser reconhecido por uma antiga operação que sacrificou inocentes.",
        "narratorGuidance": "Prepara cobertura e rota de fuga, testa versões e relata o que é observado separando fato de suspeita."
      },
      "visualCore": "Shinobi com roupa prática em camadas, faixa facial abaixada no pescoço, pequenas ferramentas presas ao cinto e uma mão oculta na manga. Silhueta compacta e postura que observa uma saída.",
      "assetPaths": {
        "male": "assets/campaigns/kagehama/classes/shinobi/shinobi_masculino.png",
        "female": "assets/campaigns/kagehama/classes/shinobi/shinobi_feminino.png"
      }
    },
    {
      "id": "onmyoji",
      "name": "Onmyōji",
      "archetype": "Onmyōji",
      "icon": "☯",
      "portrait": "assets/campaigns/kagehama/classes/onmyoji/onmyoji_masculino.png",
      "description": "Ritualista erudito que interpreta presságios, espíritos, arquivos e sinais da natureza; magia exige tempo e tem consequências.",
      "attributes": {
        "ST": 9,
        "DX": 10,
        "IQ": 15,
        "HT": 10
      },
      "skills": [
        {
          "name": "Ocultismo",
          "attribute": "IQ",
          "level": 14,
          "description": "Interpretar fenômenos, rituais e crenças; não garante respostas certas."
        },
        {
          "name": "Pesquisa",
          "attribute": "IQ",
          "level": 14,
          "description": "Localizar registros e comparar relatos, símbolos e datas."
        },
        {
          "name": "Empatia",
          "attribute": "Per",
          "level": 12,
          "description": "Perceber desconforto, intenção ou mudança de comportamento."
        }
      ],
      "fixedAbilities": [
        "Leitura de presságio: após estudar um local ou objeto, formula uma pergunta objetiva; a resposta do narrador pode ser incompleta ou simbólica."
      ],
      "startingLevel": 1,
      "artBrief": "Retrato vertical de corpo inteiro, onmyōji de fantasia histórica em vestes brancas e azul noturno, ofuda e estojo de pincéis, uma pequena luz espiritual dourada paira na mão, santuário enevoado, pintura editorial realista, magia sutil, sem texto.",
      "genderOptions": [
        "male",
        "female"
      ],
      "roleplayProfile": {
        "voice": "Vocabulário de sinais e correspondências; explica incerteza sem fingir certeza.",
        "want": "Entender o que os presságios escondem e proteger os vivos dos mortos.",
        "fear": "O ritual que o tornou aprendiz pode ter convocado a presença que agora o segue.",
        "narratorGuidance": "Pede tempo, materiais e consentimento quando possível; magia tem custo, alcance e efeitos claros, não é solução universal."
      },
      "visualCore": "Onmyōji com vestes em camadas, chapéu eboshi simples, estojo de pincéis, pequenos ofuda sem caracteres legíveis e cordão ritual. Uma das mãos segura sino ou compasso; aura sugerida por retículas, sem efeitos coloridos.",
      "assetPaths": {
        "male": "assets/campaigns/kagehama/classes/onmyoji/onmyoji_masculino.png",
        "female": "assets/campaigns/kagehama/classes/onmyoji/onmyoji_feminino.png"
      }
    },
    {
      "id": "miko",
      "name": "Miko yamabushi",
      "archetype": "Miko yamabushi",
      "icon": "✧",
      "portrait": "assets/campaigns/kagehama/classes/miko/miko_masculino.png",
      "description": "Curandeira e guia de montanha que estabiliza feridos e sustenta o grupo; não substitui repouso e recursos.",
      "attributes": {
        "ST": 10,
        "DX": 11,
        "IQ": 13,
        "HT": 12
      },
      "skills": [
        {
          "name": "Primeiros socorros",
          "attribute": "IQ",
          "level": 14,
          "description": "Estancar, estabilizar e orientar cuidados imediatos."
        },
        {
          "name": "Empatia",
          "attribute": "Per",
          "level": 13,
          "description": "Escutar, ler necessidades e apoiar negociações delicadas."
        },
        {
          "name": "Sobrevivência",
          "attribute": "HT",
          "level": 12,
          "description": "Orientar-se em trilhas, identificar plantas úteis e montar abrigo."
        }
      ],
      "fixedAbilities": [
        "Mãos firmes: uma vez por cena, estabiliza alguém ferido com recursos simples; recuperar-se por completo ainda exige tempo e cuidado."
      ],
      "startingLevel": 1,
      "artBrief": "Retrato vertical de corpo inteiro, miko yamabushi de fantasia histórica com hakama vermelho escuro, manto de viagem claro, cajado de peregrinação e bolsa médica, trilha de montanha ao amanhecer, pintura editorial realista, expressão acolhedora e firme, sem texto.",
      "genderOptions": [
        "male",
        "female"
      ],
      "roleplayProfile": {
        "voice": "Tom calmo e prático; pergunta onde dói e quem ficou para trás.",
        "want": "Manter vivos os feridos de todos os lados e preservar o santuário de Aokiri.",
        "fear": "Um paciente salvo pode ser o responsável por uma atrocidade que ela presenciou.",
        "narratorGuidance": "Trata primeiro o que ameaça a vida, explica limites do cuidado e depois pergunta sobre causas e responsabilidade."
      },
      "visualCore": "Miko yamabushi viajante com hakama e manto de proteção, cajado de peregrina, bolsa médica e tiras de tecido. Postura firme e acolhedora, mãos preparadas para tratar um ferimento, sem pose de combate.",
      "assetPaths": {
        "male": "assets/campaigns/kagehama/classes/miko/miko_masculino.png",
        "female": "assets/campaigns/kagehama/classes/miko/miko_feminino.png"
      }
    }
  ],
  "characters": [],
  "npcs": [
    {
      "id": "kagehama-npc-0",
      "title": "NPC — Lady Akiho Senda",
      "description": "Mediadora do shogun. Quimono azul-acinzentado, leque rachado; escuta sem interromper. Quer impedir a guerra sem entregar o governo a Kuroda. Guarda uma cópia não oficial do tratado.",
      "createdAt": 0,
      "behaviorProfile": {
        "voice": "Calma, formal e observadora. Faz uma pergunta por vez e espera a resposta inteira.",
        "goal": "Preservar a paz e a autoridade civil sem deixar que Kuroda controle o conselho.",
        "fear": "Que a paz dependa de uma falsificação que ela ajudou a esconder.",
        "secret": "Tem uma cópia não oficial do tratado e suspeita que a tinta foi substituída.",
        "methods": "Oferece assento e chá, organiza versões conflitantes em perguntas concretas e raramente ameaça.",
        "tell": "Leque rachado; toca a emenda quando ouve uma meia verdade.",
        "ifPressured": "Trata uma acusação pública como risco político. Em privado, revela parte do segredo se os personagens protegerem as testemunhas.",
        "narratorGuardrail": "Interprete só o que este NPC sabe. Separe fato, suspeita e mentira; não revele o segredo sem gatilho ou evidência na cena."
      },
      "artBrief": "Retrato vertical de mediadora samurai, leque rachado, mangas formais e olhar atento; sala de audiência sugerida em retículas. Arte de mangá original em preto e branco, contorno de tinta, retículas discretas, sombras em hachura, fundo transparente, retrato vertical, sem letras ou logotipos."
    },
    {
      "id": "kagehama-npc-1",
      "title": "NPC — Ren Kuroda",
      "description": "Regente do conselho, roupa negra formal, bengala de prata. Educado ao ameaçar; mede lealdades. Autorizou o roubo do estojo, mas não o assassinato do mensageiro.",
      "createdAt": 0,
      "behaviorProfile": {
        "voice": "Polidez controlada, elogios com condição e perguntas que parecem convites.",
        "goal": "Tomar controle do conselho e manter a crise abaixo do limiar da guerra aberta.",
        "fear": "Perder o controle dos aliados e ser lembrado como usurpador vulgar.",
        "secret": "Autorizou roubar o estojo, mas não ordenou o assassinato de Jiro.",
        "methods": "Nunca diz não diretamente; oferece uma alternativa que cobra lealdade ou silêncio.",
        "tell": "Bengala de prata; pausa antes de pronunciar sobrenomes.",
        "ifPressured": "Se confrontado com prova, tenta separar seu crime do assassinato e oferece informação para conter a guerra.",
        "narratorGuardrail": "Interprete só o que este NPC sabe. Separe fato, suspeita e mentira; não revele o segredo sem gatilho ou evidência na cena."
      },
      "artBrief": "Regente em roupa formal escura, bengala metálica, mãos impecáveis, postura cordial que ocupa espaço; fundo de painel shoji. Arte de mangá original em preto e branco, contorno de tinta, retículas discretas, sombras em hachura, fundo transparente, retrato vertical, sem letras ou logotipos."
    },
    {
      "id": "kagehama-npc-2",
      "title": "NPC — Tomoe Arashi",
      "description": "Herdeira desaparecida, disfarçada como a escriba Nao. Analisa saídas e testa promessas. Quer revelar a falsificação; oculta que matou um capitão em legítima defesa.",
      "createdAt": 0,
      "behaviorProfile": {
        "voice": "Voz baixa, vocabulário preciso, responde com perguntas e verifica quem está perto.",
        "goal": "Expor a falsificação do tratado sem transformar o caso em uma disputa de sucessão.",
        "fear": "Ser obrigada a voltar ao papel de herdeira e perder controle da própria vida.",
        "secret": "Está disfarçada como Nao e matou um capitão para sobreviver; teme que isso seja usado para invalidar sua denúncia.",
        "methods": "Observa portas, mãos e testemunhas antes de falar; só entrega fatos que pode sustentar.",
        "tell": "Conta saídas com os olhos e muda de posição quando chega gente armada.",
        "ifPressured": "Se reconhecida, não admite tudo sem garantia de retirada segura para testemunhas.",
        "narratorGuardrail": "Interprete só o que este NPC sabe. Separe fato, suspeita e mentira; não revele o segredo sem gatilho ou evidência na cena."
      },
      "artBrief": "Escriba viajante de aparência discreta, rolos de papel e tinta nos dedos, olhar atento para a saída; sem roupa nobre ostensiva. Arte de mangá original em preto e branco, contorno de tinta, retículas discretas, sombras em hachura, fundo transparente, retrato vertical, sem letras ou logotipos."
    },
    {
      "id": "kagehama-npc-3",
      "title": "NPC — Jiro “Três Chuvas”",
      "description": "Mensageiro imperial ferido, capa de palha e três sinos escondidos na gola. Conta passos quando nervoso. Sobreviveu e se esconde nos Arquivos Afogados.",
      "createdAt": 0,
      "behaviorProfile": {
        "voice": "Fala entrecortada até se sentir seguro; conta passos para organizar a memória.",
        "goal": "Entregar a prova do tratado sem expor quem o escondeu.",
        "fear": "Que o agressor tenha sido enviado por alguém que ele ainda respeita.",
        "secret": "Sobreviveu e se esconde nos Arquivos Afogados; sabe como o estojo foi trocado.",
        "methods": "Conta o que lembra em sequência física: som, cheiro, direção e intervalo.",
        "tell": "Conta passos e segura a gola onde guarda os sinos.",
        "ifPressured": "Se pressionado, trava e se cala; se recebe cuidados sem interrogatório, revela um detalhe sensorial.",
        "narratorGuardrail": "Interprete só o que este NPC sabe. Separe fato, suspeita e mentira; não revele o segredo sem gatilho ou evidência na cena."
      },
      "artBrief": "Mensageiro ferido sob capa de palha, sino escondido na gola e marcas de água; retrato vertical austero. Arte de mangá original em preto e branco, contorno de tinta, retículas discretas, sombras em hachura, fundo transparente, retrato vertical, sem letras ou logotipos."
    },
    {
      "id": "kagehama-npc-4",
      "title": "NPC — Sayo",
      "description": "Agente da Casa Sen, aparência comum e contas de madeira. Observa reflexos, muda sotaque. Transportou o estojo e reteve uma página que compromete o irmão.",
      "createdAt": 0,
      "behaviorProfile": {
        "voice": "Sotaque e formalidade mudam conforme o interlocutor; não sustenta contato visual por muito tempo.",
        "goal": "Proteger o irmão e impedir que a Casa Sen seja responsabilizada por uma guerra que não planejou.",
        "fear": "Que a prova entregue revele que ela própria transportou o estojo.",
        "secret": "Retém uma página que liga o irmão ao lote de documentos.",
        "methods": "Prefere combinar local, hora e saída; nunca aceita encontro sem uma rota alternativa.",
        "tell": "Passa contas de madeira e observa a cena por superfícies refletoras.",
        "ifPressured": "Se os personagens mencionam o irmão, tenta encerrar o encontro; prova de proteção a faz negociar.",
        "narratorGuardrail": "Interprete só o que este NPC sabe. Separe fato, suspeita e mentira; não revele o segredo sem gatilho ou evidência na cena."
      },
      "artBrief": "Agente de aparência comum, contas de madeira no pulso, reflexo de uma janela revelando que observa todos; traje cotidiano. Arte de mangá original em preto e branco, contorno de tinta, retículas discretas, sombras em hachura, fundo transparente, retrato vertical, sem letras ou logotipos."
    },
    {
      "id": "kagehama-npc-5",
      "title": "NPC — Monge Genzō",
      "description": "Guardião de Aokiri, bengala marcada e cão Nuvem. Serve chá depois que a pessoa para de mentir. Protege refugiados e conhece a entrada dos Arquivos.",
      "createdAt": 0,
      "behaviorProfile": {
        "voice": "Pausas longas, perguntas simples e humor sereno; não confirma acusações sem evidência.",
        "goal": "Manter o santuário neutro e dar passagem segura aos refugiados.",
        "fear": "Que o abrigo seja usado para planejar uma vingança contra pessoas inocentes.",
        "secret": "Conhece uma entrada para os Arquivos Afogados e ouviu refugiados citarem Daichi.",
        "methods": "Oferece chá e abrigo antes de pedir nomes; protege qualquer pessoa sob seu teto.",
        "tell": "Marca a bengala em três pontos da mesa para pensar.",
        "ifPressured": "Se os personagens trouxerem armas ao santuário, pede que as deixem na entrada; não os expulsa antes de ouvir a razão.",
        "narratorGuardrail": "Interprete só o que este NPC sabe. Separe fato, suspeita e mentira; não revele o segredo sem gatilho ou evidência na cena."
      },
      "artBrief": "Monge idoso com bengala entalhada, chaleira e cão branco; santuário vertical entre cedros, rosto paciente. Arte de mangá original em preto e branco, contorno de tinta, retículas discretas, sombras em hachura, fundo transparente, retrato vertical, sem letras ou logotipos."
    },
    {
      "id": "kagehama-npc-6",
      "title": "NPC — Lady Chiyo Arashi",
      "description": "Senhora do norte, armadura verde-musgo e queimadura antiga. Faz perguntas sobre custos pessoais. Quer autonomia e sabe que o sobrinho compra armas.",
      "createdAt": 0,
      "behaviorProfile": {
        "voice": "Cortesia firme, perguntas diretas sobre quem pagará a consequência.",
        "goal": "Garantir autonomia para Arashi sem iniciar uma guerra que destrua as aldeias.",
        "fear": "Que a autonomia seja alcançada por um pacto que apenas mude o nome do opressor.",
        "secret": "Sabe que o sobrinho compra armas por fora e esconde a extensão da rede.",
        "methods": "Pede planos verificáveis e pergunta primeiro quem ficará exposto.",
        "tell": "Observa a reação antes de responder, especialmente de seu sobrinho.",
        "ifPressured": "Se o grupo mostrar como proteger civis, compartilha informação sobre a compra de armas.",
        "narratorGuardrail": "Interprete só o que este NPC sabe. Separe fato, suspeita e mentira; não revele o segredo sem gatilho ou evidência na cena."
      },
      "artBrief": "Líder de fronteira com armadura funcional, queimadura antiga e mapa de montanhas; figura imponente sem luxo. Arte de mangá original em preto e branco, contorno de tinta, retículas discretas, sombras em hachura, fundo transparente, retrato vertical, sem letras ou logotipos."
    },
    {
      "id": "kagehama-npc-7",
      "title": "NPC — Daichi Arashi",
      "description": "Capitão de fronteira de armadura vermelha. Provoca antes de atacar, mas poupa quem não humilha seus soldados. Quer independência e não sabe que os fornecedores o traem.",
      "createdAt": 0,
      "behaviorProfile": {
        "voice": "Bravata pública e conversa concreta em privado; usa insultos para medir reação.",
        "goal": "Construir uma força própria e impedir que Arashi volte a depender do conselho central.",
        "fear": "Ser usado pelos fornecedores e perder seus soldados por uma causa fabricada.",
        "secret": "Não sabe que os fornecedores desviam recursos para provocar guerra.",
        "methods": "Desafia os personagens de modo controlado; aceita recuar se eles preservarem a dignidade de seus soldados.",
        "tell": "Ajusta a correia do ombro antes de dar uma ordem difícil.",
        "ifPressured": "Se os personagens revelarem a traição com evidência, primeiro nega e depois exige prova direta.",
        "narratorGuardrail": "Interprete só o que este NPC sabe. Separe fato, suspeita e mentira; não revele o segredo sem gatilho ou evidência na cena."
      },
      "artBrief": "Capitão em armadura de placas simples, correia gasta no ombro, estandarte sem letras e soldados ao fundo em chuva. Arte de mangá original em preto e branco, contorno de tinta, retículas discretas, sombras em hachura, fundo transparente, retrato vertical, sem letras ou logotipos."
    },
    {
      "id": "kagehama-npc-8",
      "title": "NPC — Akane",
      "description": "Curandeira da Irmandade do Junco Branco, mãos manchadas de ervas. Trabalha enquanto conversa e protege pacientes. Trata um agente que testemunhou o assassinato.",
      "createdAt": 0,
      "behaviorProfile": {
        "voice": "Conversa em tom prático enquanto prepara remédios; corta discussões que atrapalham o cuidado.",
        "goal": "Manter o paciente vivo e impedir que a Irmandade vire ferramenta de interrogatório.",
        "fear": "Que o paciente morra por uma decisão que ela tomou ao escolher quem tratar primeiro.",
        "secret": "Trata uma testemunha do assassinato, mas não cede informação sem consentimento do paciente.",
        "methods": "Define prioridades médicas e limites claros; escuta enquanto trabalha, sem prometer segredo absoluto.",
        "tell": "Esfrega ervas entre os dedos antes de responder.",
        "ifPressured": "Se alguém ameaçar o paciente, chama ajuda e fecha o acesso; não tenta vencer uma batalha sozinha.",
        "narratorGuardrail": "Interprete só o que este NPC sabe. Separe fato, suspeita e mentira; não revele o segredo sem gatilho ou evidência na cena."
      },
      "artBrief": "Curandeira em abrigo simples, mangas arregaçadas, ervas, tigelas e gaze; expressão concentrada, não idealizada. Arte de mangá original em preto e branco, contorno de tinta, retículas discretas, sombras em hachura, fundo transparente, retrato vertical, sem letras ou logotipos."
    },
    {
      "id": "kagehama-npc-9",
      "title": "NPC — Mestre Tetsuo",
      "description": "Armeiro de Kagehama, avental queimado e dois dedos ausentes. Conversa com as ferramentas. Reconhece o lote oficial usado no disparo.",
      "createdAt": 0,
      "behaviorProfile": {
        "voice": "Frases curtas dirigidas às ferramentas; responde melhor a perguntas específicas que a intimidação.",
        "goal": "Provar que seu trabalho não foi usado para matar o mensageiro.",
        "fear": "Que o selo de seu ofício seja associado a uma execução política.",
        "secret": "Reconhece a marca do lote oficial na flecha, mas teme perder o negócio e a oficina.",
        "methods": "Compara peso, encaixe e marcas, oferecendo fatos materiais em vez de teorias.",
        "tell": "Alinha as ferramentas por tamanho enquanto conversa.",
        "ifPressured": "Diante de autoridade, pede registro formal; diante de uma prova física, aceita colaborar em segredo.",
        "narratorGuardrail": "Interprete só o que este NPC sabe. Separe fato, suspeita e mentira; não revele o segredo sem gatilho ou evidência na cena."
      },
      "artBrief": "Armeiro de avental queimado, dois dedos ausentes, bancada com lâminas e peças da flecha; mãos como foco do quadro. Arte de mangá original em preto e branco, contorno de tinta, retículas discretas, sombras em hachura, fundo transparente, retrato vertical, sem letras ou logotipos."
    },
    {
      "id": "kagehama-npc-10",
      "title": "NPC — Nuvem",
      "description": "Cão branco idoso do santuário, uma orelha caída. Rosna para sangue fresco e busca quem está de luto; pode farejar, nunca substitui uma pista.",
      "createdAt": 0,
      "behaviorProfile": {
        "voice": "Não fala; reage por postura, ouvido, focinho e proximidade.",
        "goal": "Procurar pessoas conhecidas e evitar ruídos que anunciem perigo.",
        "fear": "Se perder os companheiros do santuário em meio à guerra.",
        "secret": "Fareja sangue fresco e reconhece o caminho dos refugiados, mas não distingue culpado de ferido.",
        "methods": "Aproxima-se de quem está enlutado e rosna para cheiro de sangue recente; precisa de um tratador por perto.",
        "tell": "Uma orelha caída se ergue quando reconhece um passo.",
        "ifPressured": "Não revela soluções: conduz a um lugar ou pessoa e depende dos personagens para interpretar o sinal.",
        "narratorGuardrail": "Interprete só o que este NPC sabe. Separe fato, suspeita e mentira; não revele o segredo sem gatilho ou evidência na cena."
      },
      "artBrief": "Cão branco idoso de uma orelha caída, pelo áspero, sentado perto de uma lamparina; expressão calma, sem antropomorfismo. Arte de mangá original em preto e branco, contorno de tinta, retículas discretas, sombras em hachura, fundo transparente, retrato vertical, sem letras ou logotipos."
    }
  ],
  "scenes": [
    {
      "id": "kagehama-scene-0",
      "title": "Capítulo 1 — O salão das testemunhas",
      "description": "Akiho convoca o grupo; versões contraditórias apontam para Arashi, Casa Sen e comerciantes.",
      "createdAt": 0
    },
    {
      "id": "kagehama-scene-1",
      "title": "Capítulo 2 — Três contas queimadas",
      "description": "Sayo leva ao santuário; refugiados somem na floresta e uma trilha cruza esconderijo de Daichi.",
      "createdAt": 0
    },
    {
      "id": "kagehama-scene-2",
      "title": "Capítulo 3 — O homem sob a água",
      "description": "Nos Arquivos Afogados, o grupo escolhe salvar Jiro, documentos ou a própria segurança.",
      "createdAt": 0
    },
    {
      "id": "kagehama-scene-3",
      "title": "Capítulo 4 — A caça do cervo negro",
      "description": "Rastro leva a posto abandonado e soldados mortos após um encontro diplomático falso.",
      "createdAt": 0
    },
    {
      "id": "kagehama-scene-4",
      "title": "Capítulo 5 — O mensageiro que não chegou",
      "description": "A aldeia de Sumi perde água por uma ordem verdadeira entregue por portador falso.",
      "createdAt": 0
    },
    {
      "id": "kagehama-scene-5",
      "title": "Capítulo 6 — Um duelo sem vencedor",
      "description": "Audiência no Castelo da Cinza; duelo testa contenção e respeito, não exige morte.",
      "createdAt": 0
    },
    {
      "id": "kagehama-scene-6",
      "title": "Capítulo 7 — A noite da enseada",
      "description": "Infiltração ou perseguição marítima contra um navio com armas e registros falsos.",
      "createdAt": 0
    },
    {
      "id": "kagehama-scene-7",
      "title": "Capítulo 8 — A herdeira chamada Nao",
      "description": "Tomoe revela a matriz do selo; tornar a falsificação pública põe seus soldados em risco.",
      "createdAt": 0
    },
    {
      "id": "kagehama-scene-8",
      "title": "Capítulo 9 — Traição no santuário",
      "description": "Um agente entrega o esconderijo de refugiados para tentar salvar a própria família.",
      "createdAt": 0
    },
    {
      "id": "kagehama-scene-9",
      "title": "Capítulo 10 — A torre de sinal",
      "description": "Tempestade, patrulhas recrutadas e mensagens cifradas sobre uma guerra planejada.",
      "createdAt": 0
    },
    {
      "id": "kagehama-scene-10",
      "title": "Capítulo 11 — Conselho em Kagehama",
      "description": "A prova exige testemunhas, proteção e uma apresentação que sobreviva à política.",
      "createdAt": 0
    },
    {
      "id": "kagehama-scene-11",
      "title": "Capítulo 12 — O cerco dos canais",
      "description": "Três frentes simultâneas: comporta, enfermaria e muralha do porto.",
      "createdAt": 0
    },
    {
      "id": "kagehama-scene-12",
      "title": "Capítulo 13 — O regente e a lâmina",
      "description": "Kuroda oferece acordo; pode haver rendição, exposição, captura, fuga ou combate.",
      "createdAt": 0
    }
  ],
  "maps": [
    {
      "id": "kagehama-map-0",
      "title": "Mapa regional de Akitsuru",
      "description": "Peninsula de vales e costa: Kagehama no centro-sul; Arashi ao noroeste; Hino a oeste; Aokiri a nordeste; Shirotsu a leste; Ilhas das Garças ao sul.",
      "createdAt": 0
    },
    {
      "id": "kagehama-map-1",
      "title": "Kagehama",
      "description": "Palácio, Ponte das Sete Lanternas, Distrito dos Tecelões, Casa de Chá da Lua Baixa, porto e comportas.",
      "createdAt": 0
    },
    {
      "id": "kagehama-map-2",
      "title": "Serra do Cedro Negro",
      "description": "Estrada do Sino, desfiladeiro, postos de vigia, trilha de caça e fortalezas Arashi.",
      "createdAt": 0
    },
    {
      "id": "kagehama-map-3",
      "title": "Floresta de Aokiri",
      "description": "Santuário, clareiras, ruínas, córregos, trilha costeira e rotas de fuga.",
      "createdAt": 0
    },
    {
      "id": "kagehama-map-4",
      "title": "Rede subterrânea",
      "description": "Depósitos do porto, comporta velha, Arquivos Afogados e cisterna sob o palácio.",
      "createdAt": 0
    }
  ],
  "art": [
    {
      "id": "art-ronin-male",
      "title": "Retrato masculino · Combatente de resistência",
      "description": "Arte de personagem para jogo narrativo, corpo inteiro, recorte transparente sem fundo, silhueta legível. Personagem homem: Rōnin viajante de fantasia histórica, armadura leve remendada, haori curto gasto, nodachi embainhada, postura de guarda inclinada e olhar cansado. Silhueta larga, cicatriz pequena, cordão de viagem e sandálias enlameadas. Mangá de aventura original em tinta preta sobre papel branco, contorno expressivo e limpo, poucas retículas, sombras em hachura, alto contraste, somente preto e branco, sem cinza colorido, sem texto, sem assinatura, sem logotipo, sem moldura.",
      "assetPath": "assets/campaigns/kagehama/classes/ronin/ronin_masculino.png",
      "kind": "character",
      "category": "Classes",
      "status": "brief-ready",
      "done": false
    },
    {
      "id": "art-ronin-female",
      "title": "Retrato feminino · Combatente de resistência",
      "description": "Arte de personagem para jogo narrativo, corpo inteiro, recorte transparente sem fundo, silhueta legível. Personagem mulher: Rōnin viajante de fantasia histórica, armadura leve remendada, haori curto gasto, nodachi embainhada, postura de guarda inclinada e olhar cansado. Silhueta larga, cicatriz pequena, cordão de viagem e sandálias enlameadas. Mangá de aventura original em tinta preta sobre papel branco, contorno expressivo e limpo, poucas retículas, sombras em hachura, alto contraste, somente preto e branco, sem cinza colorido, sem texto, sem assinatura, sem logotipo, sem moldura.",
      "assetPath": "assets/campaigns/kagehama/classes/ronin/ronin_feminino.png",
      "kind": "character",
      "category": "Classes",
      "status": "brief-ready",
      "done": false
    },
    {
      "id": "art-samurai-male",
      "title": "Retrato masculino · Samurai juramentado",
      "description": "Arte de personagem para jogo narrativo, corpo inteiro, recorte transparente sem fundo, silhueta legível. Personagem homem: Samurai viajante com yoroi simples, cordão de brasão sem símbolos escritos, katana na bainha e mão próxima ao punho sem sacar. Postura disciplinada, ombros alinhados, rosto sereno e atento. Mangá de aventura original em tinta preta sobre papel branco, contorno expressivo e limpo, poucas retículas, sombras em hachura, alto contraste, somente preto e branco, sem cinza colorido, sem texto, sem assinatura, sem logotipo, sem moldura.",
      "assetPath": "assets/campaigns/kagehama/classes/samurai/samurai_masculino.png",
      "kind": "character",
      "category": "Classes",
      "status": "brief-ready",
      "done": false
    },
    {
      "id": "art-samurai-female",
      "title": "Retrato feminino · Samurai juramentado",
      "description": "Arte de personagem para jogo narrativo, corpo inteiro, recorte transparente sem fundo, silhueta legível. Personagem mulher: Samurai viajante com yoroi simples, cordão de brasão sem símbolos escritos, katana na bainha e mão próxima ao punho sem sacar. Postura disciplinada, ombros alinhados, rosto sereno e atento. Mangá de aventura original em tinta preta sobre papel branco, contorno expressivo e limpo, poucas retículas, sombras em hachura, alto contraste, somente preto e branco, sem cinza colorido, sem texto, sem assinatura, sem logotipo, sem moldura.",
      "assetPath": "assets/campaigns/kagehama/classes/samurai/samurai_feminino.png",
      "kind": "character",
      "category": "Classes",
      "status": "brief-ready",
      "done": false
    },
    {
      "id": "art-kyudoka-male",
      "title": "Retrato masculino · Kyūdōka",
      "description": "Arte de personagem para jogo narrativo, corpo inteiro, recorte transparente sem fundo, silhueta legível. Personagem homem: Arqueiro kyūdōka com yumi alto e aljava, roupa de viagem ajustada para movimento, dedos protegidos, olhar de foco lateral. Corpo esguio e postura de mira relaxada, não disparando. Mangá de aventura original em tinta preta sobre papel branco, contorno expressivo e limpo, poucas retículas, sombras em hachura, alto contraste, somente preto e branco, sem cinza colorido, sem texto, sem assinatura, sem logotipo, sem moldura.",
      "assetPath": "assets/campaigns/kagehama/classes/kyudoka/kyudoka_masculino.png",
      "kind": "character",
      "category": "Classes",
      "status": "brief-ready",
      "done": false
    },
    {
      "id": "art-kyudoka-female",
      "title": "Retrato feminino · Kyūdōka",
      "description": "Arte de personagem para jogo narrativo, corpo inteiro, recorte transparente sem fundo, silhueta legível. Personagem mulher: Arqueiro kyūdōka com yumi alto e aljava, roupa de viagem ajustada para movimento, dedos protegidos, olhar de foco lateral. Corpo esguio e postura de mira relaxada, não disparando. Mangá de aventura original em tinta preta sobre papel branco, contorno expressivo e limpo, poucas retículas, sombras em hachura, alto contraste, somente preto e branco, sem cinza colorido, sem texto, sem assinatura, sem logotipo, sem moldura.",
      "assetPath": "assets/campaigns/kagehama/classes/kyudoka/kyudoka_feminino.png",
      "kind": "character",
      "category": "Classes",
      "status": "brief-ready",
      "done": false
    },
    {
      "id": "art-shinobi-male",
      "title": "Retrato masculino · Shinobi",
      "description": "Arte de personagem para jogo narrativo, corpo inteiro, recorte transparente sem fundo, silhueta legível. Personagem homem: Shinobi com roupa prática em camadas, faixa facial abaixada no pescoço, pequenas ferramentas presas ao cinto e uma mão oculta na manga. Silhueta compacta e postura que observa uma saída. Mangá de aventura original em tinta preta sobre papel branco, contorno expressivo e limpo, poucas retículas, sombras em hachura, alto contraste, somente preto e branco, sem cinza colorido, sem texto, sem assinatura, sem logotipo, sem moldura.",
      "assetPath": "assets/campaigns/kagehama/classes/shinobi/shinobi_masculino.png",
      "kind": "character",
      "category": "Classes",
      "status": "brief-ready",
      "done": false
    },
    {
      "id": "art-shinobi-female",
      "title": "Retrato feminino · Shinobi",
      "description": "Arte de personagem para jogo narrativo, corpo inteiro, recorte transparente sem fundo, silhueta legível. Personagem mulher: Shinobi com roupa prática em camadas, faixa facial abaixada no pescoço, pequenas ferramentas presas ao cinto e uma mão oculta na manga. Silhueta compacta e postura que observa uma saída. Mangá de aventura original em tinta preta sobre papel branco, contorno expressivo e limpo, poucas retículas, sombras em hachura, alto contraste, somente preto e branco, sem cinza colorido, sem texto, sem assinatura, sem logotipo, sem moldura.",
      "assetPath": "assets/campaigns/kagehama/classes/shinobi/shinobi_feminino.png",
      "kind": "character",
      "category": "Classes",
      "status": "brief-ready",
      "done": false
    },
    {
      "id": "art-onmyoji-male",
      "title": "Retrato masculino · Onmyōji",
      "description": "Arte de personagem para jogo narrativo, corpo inteiro, recorte transparente sem fundo, silhueta legível. Personagem homem: Onmyōji com vestes em camadas, chapéu eboshi simples, estojo de pincéis, pequenos ofuda sem caracteres legíveis e cordão ritual. Uma das mãos segura sino ou compasso; aura sugerida por retículas, sem efeitos coloridos. Mangá de aventura original em tinta preta sobre papel branco, contorno expressivo e limpo, poucas retículas, sombras em hachura, alto contraste, somente preto e branco, sem cinza colorido, sem texto, sem assinatura, sem logotipo, sem moldura.",
      "assetPath": "assets/campaigns/kagehama/classes/onmyoji/onmyoji_masculino.png",
      "kind": "character",
      "category": "Classes",
      "status": "brief-ready",
      "done": false
    },
    {
      "id": "art-onmyoji-female",
      "title": "Retrato feminino · Onmyōji",
      "description": "Arte de personagem para jogo narrativo, corpo inteiro, recorte transparente sem fundo, silhueta legível. Personagem mulher: Onmyōji com vestes em camadas, chapéu eboshi simples, estojo de pincéis, pequenos ofuda sem caracteres legíveis e cordão ritual. Uma das mãos segura sino ou compasso; aura sugerida por retículas, sem efeitos coloridos. Mangá de aventura original em tinta preta sobre papel branco, contorno expressivo e limpo, poucas retículas, sombras em hachura, alto contraste, somente preto e branco, sem cinza colorido, sem texto, sem assinatura, sem logotipo, sem moldura.",
      "assetPath": "assets/campaigns/kagehama/classes/onmyoji/onmyoji_feminino.png",
      "kind": "character",
      "category": "Classes",
      "status": "brief-ready",
      "done": false
    },
    {
      "id": "art-miko-male",
      "title": "Retrato masculino · Miko yamabushi",
      "description": "Arte de personagem para jogo narrativo, corpo inteiro, recorte transparente sem fundo, silhueta legível. Personagem homem: Miko yamabushi viajante com hakama e manto de proteção, cajado de peregrina, bolsa médica e tiras de tecido. Postura firme e acolhedora, mãos preparadas para tratar um ferimento, sem pose de combate. Mangá de aventura original em tinta preta sobre papel branco, contorno expressivo e limpo, poucas retículas, sombras em hachura, alto contraste, somente preto e branco, sem cinza colorido, sem texto, sem assinatura, sem logotipo, sem moldura.",
      "assetPath": "assets/campaigns/kagehama/classes/miko/miko_masculino.png",
      "kind": "character",
      "category": "Classes",
      "status": "brief-ready",
      "done": false
    },
    {
      "id": "art-miko-female",
      "title": "Retrato feminino · Miko yamabushi",
      "description": "Arte de personagem para jogo narrativo, corpo inteiro, recorte transparente sem fundo, silhueta legível. Personagem mulher: Miko yamabushi viajante com hakama e manto de proteção, cajado de peregrina, bolsa médica e tiras de tecido. Postura firme e acolhedora, mãos preparadas para tratar um ferimento, sem pose de combate. Mangá de aventura original em tinta preta sobre papel branco, contorno expressivo e limpo, poucas retículas, sombras em hachura, alto contraste, somente preto e branco, sem cinza colorido, sem texto, sem assinatura, sem logotipo, sem moldura.",
      "assetPath": "assets/campaigns/kagehama/classes/miko/miko_feminino.png",
      "kind": "character",
      "category": "Classes",
      "status": "brief-ready",
      "done": false
    },
    {
      "id": "art-kagehama-npc-0",
      "title": "Retrato · Lady Akiho Senda",
      "description": "Retrato vertical de mediadora samurai, leque rachado, mangas formais e olhar atento; sala de audiência sugerida em retículas. Arte de mangá original em preto e branco, contorno de tinta, retículas discretas, sombras em hachura, fundo transparente, retrato vertical, sem letras ou logotipos.",
      "assetPath": "assets/campaigns/kagehama/npcs/npc-0.png",
      "kind": "character",
      "category": "NPCs",
      "status": "brief-ready",
      "done": false
    },
    {
      "id": "art-kagehama-npc-1",
      "title": "Retrato · Ren Kuroda",
      "description": "Regente em roupa formal escura, bengala metálica, mãos impecáveis, postura cordial que ocupa espaço; fundo de painel shoji. Arte de mangá original em preto e branco, contorno de tinta, retículas discretas, sombras em hachura, fundo transparente, retrato vertical, sem letras ou logotipos.",
      "assetPath": "assets/campaigns/kagehama/npcs/npc-1.png",
      "kind": "character",
      "category": "NPCs",
      "status": "brief-ready",
      "done": false
    },
    {
      "id": "art-kagehama-npc-2",
      "title": "Retrato · Tomoe Arashi",
      "description": "Escriba viajante de aparência discreta, rolos de papel e tinta nos dedos, olhar atento para a saída; sem roupa nobre ostensiva. Arte de mangá original em preto e branco, contorno de tinta, retículas discretas, sombras em hachura, fundo transparente, retrato vertical, sem letras ou logotipos.",
      "assetPath": "assets/campaigns/kagehama/npcs/npc-2.png",
      "kind": "character",
      "category": "NPCs",
      "status": "brief-ready",
      "done": false
    },
    {
      "id": "art-kagehama-npc-3",
      "title": "Retrato · Jiro “Três Chuvas”",
      "description": "Mensageiro ferido sob capa de palha, sino escondido na gola e marcas de água; retrato vertical austero. Arte de mangá original em preto e branco, contorno de tinta, retículas discretas, sombras em hachura, fundo transparente, retrato vertical, sem letras ou logotipos.",
      "assetPath": "assets/campaigns/kagehama/npcs/npc-3.png",
      "kind": "character",
      "category": "NPCs",
      "status": "brief-ready",
      "done": false
    },
    {
      "id": "art-kagehama-npc-4",
      "title": "Retrato · Sayo",
      "description": "Agente de aparência comum, contas de madeira no pulso, reflexo de uma janela revelando que observa todos; traje cotidiano. Arte de mangá original em preto e branco, contorno de tinta, retículas discretas, sombras em hachura, fundo transparente, retrato vertical, sem letras ou logotipos.",
      "assetPath": "assets/campaigns/kagehama/npcs/npc-4.png",
      "kind": "character",
      "category": "NPCs",
      "status": "brief-ready",
      "done": false
    },
    {
      "id": "art-kagehama-npc-5",
      "title": "Retrato · Monge Genzō",
      "description": "Monge idoso com bengala entalhada, chaleira e cão branco; santuário vertical entre cedros, rosto paciente. Arte de mangá original em preto e branco, contorno de tinta, retículas discretas, sombras em hachura, fundo transparente, retrato vertical, sem letras ou logotipos.",
      "assetPath": "assets/campaigns/kagehama/npcs/npc-5.png",
      "kind": "character",
      "category": "NPCs",
      "status": "brief-ready",
      "done": false
    },
    {
      "id": "art-kagehama-npc-6",
      "title": "Retrato · Lady Chiyo Arashi",
      "description": "Líder de fronteira com armadura funcional, queimadura antiga e mapa de montanhas; figura imponente sem luxo. Arte de mangá original em preto e branco, contorno de tinta, retículas discretas, sombras em hachura, fundo transparente, retrato vertical, sem letras ou logotipos.",
      "assetPath": "assets/campaigns/kagehama/npcs/npc-6.png",
      "kind": "character",
      "category": "NPCs",
      "status": "brief-ready",
      "done": false
    },
    {
      "id": "art-kagehama-npc-7",
      "title": "Retrato · Daichi Arashi",
      "description": "Capitão em armadura de placas simples, correia gasta no ombro, estandarte sem letras e soldados ao fundo em chuva. Arte de mangá original em preto e branco, contorno de tinta, retículas discretas, sombras em hachura, fundo transparente, retrato vertical, sem letras ou logotipos.",
      "assetPath": "assets/campaigns/kagehama/npcs/npc-7.png",
      "kind": "character",
      "category": "NPCs",
      "status": "brief-ready",
      "done": false
    },
    {
      "id": "art-kagehama-npc-8",
      "title": "Retrato · Akane",
      "description": "Curandeira em abrigo simples, mangas arregaçadas, ervas, tigelas e gaze; expressão concentrada, não idealizada. Arte de mangá original em preto e branco, contorno de tinta, retículas discretas, sombras em hachura, fundo transparente, retrato vertical, sem letras ou logotipos.",
      "assetPath": "assets/campaigns/kagehama/npcs/npc-8.png",
      "kind": "character",
      "category": "NPCs",
      "status": "brief-ready",
      "done": false
    },
    {
      "id": "art-kagehama-npc-9",
      "title": "Retrato · Mestre Tetsuo",
      "description": "Armeiro de avental queimado, dois dedos ausentes, bancada com lâminas e peças da flecha; mãos como foco do quadro. Arte de mangá original em preto e branco, contorno de tinta, retículas discretas, sombras em hachura, fundo transparente, retrato vertical, sem letras ou logotipos.",
      "assetPath": "assets/campaigns/kagehama/npcs/npc-9.png",
      "kind": "character",
      "category": "NPCs",
      "status": "brief-ready",
      "done": false
    },
    {
      "id": "art-kagehama-npc-10",
      "title": "Retrato · Nuvem",
      "description": "Cão branco idoso de uma orelha caída, pelo áspero, sentado perto de uma lamparina; expressão calma, sem antropomorfismo. Arte de mangá original em preto e branco, contorno de tinta, retículas discretas, sombras em hachura, fundo transparente, retrato vertical, sem letras ou logotipos.",
      "assetPath": "assets/campaigns/kagehama/npcs/npc-10.png",
      "kind": "character",
      "category": "NPCs",
      "status": "brief-ready",
      "done": false
    },
    {
      "id": "art-kagehama-scene-0",
      "title": "Cenário vertical · Capítulo 1 — O salão das testemunhas",
      "description": "Ilustração de cenário vertical 9:16, sem personagens em primeiro plano, quadro estabelecedor para jogo em celular. Capítulo 1 — O salão das testemunhas. Akiho convoca o grupo; versões contraditórias apontam para Arashi, Casa Sen e comerciantes.. Mangá de aventura original, tinta preta sobre papel branco, contraste forte, retículas discretas e hachuras; somente preto e branco, sem texto ou balões.",
      "assetPath": "assets/campaigns/kagehama/scenes/kagehama-scene-0.png",
      "kind": "scene",
      "category": "Cenários",
      "status": "brief-ready",
      "done": false
    },
    {
      "id": "art-kagehama-scene-1",
      "title": "Cenário vertical · Capítulo 2 — Três contas queimadas",
      "description": "Ilustração de cenário vertical 9:16, sem personagens em primeiro plano, quadro estabelecedor para jogo em celular. Capítulo 2 — Três contas queimadas. Sayo leva ao santuário; refugiados somem na floresta e uma trilha cruza esconderijo de Daichi.. Mangá de aventura original, tinta preta sobre papel branco, contraste forte, retículas discretas e hachuras; somente preto e branco, sem texto ou balões.",
      "assetPath": "assets/campaigns/kagehama/scenes/kagehama-scene-1.png",
      "kind": "scene",
      "category": "Cenários",
      "status": "brief-ready",
      "done": false
    },
    {
      "id": "art-kagehama-scene-2",
      "title": "Cenário vertical · Capítulo 3 — O homem sob a água",
      "description": "Ilustração de cenário vertical 9:16, sem personagens em primeiro plano, quadro estabelecedor para jogo em celular. Capítulo 3 — O homem sob a água. Nos Arquivos Afogados, o grupo escolhe salvar Jiro, documentos ou a própria segurança.. Mangá de aventura original, tinta preta sobre papel branco, contraste forte, retículas discretas e hachuras; somente preto e branco, sem texto ou balões.",
      "assetPath": "assets/campaigns/kagehama/scenes/kagehama-scene-2.png",
      "kind": "scene",
      "category": "Cenários",
      "status": "brief-ready",
      "done": false
    },
    {
      "id": "art-kagehama-scene-3",
      "title": "Cenário vertical · Capítulo 4 — A caça do cervo negro",
      "description": "Ilustração de cenário vertical 9:16, sem personagens em primeiro plano, quadro estabelecedor para jogo em celular. Capítulo 4 — A caça do cervo negro. Rastro leva a posto abandonado e soldados mortos após um encontro diplomático falso.. Mangá de aventura original, tinta preta sobre papel branco, contraste forte, retículas discretas e hachuras; somente preto e branco, sem texto ou balões.",
      "assetPath": "assets/campaigns/kagehama/scenes/kagehama-scene-3.png",
      "kind": "scene",
      "category": "Cenários",
      "status": "brief-ready",
      "done": false
    },
    {
      "id": "art-kagehama-scene-4",
      "title": "Cenário vertical · Capítulo 5 — O mensageiro que não chegou",
      "description": "Ilustração de cenário vertical 9:16, sem personagens em primeiro plano, quadro estabelecedor para jogo em celular. Capítulo 5 — O mensageiro que não chegou. A aldeia de Sumi perde água por uma ordem verdadeira entregue por portador falso.. Mangá de aventura original, tinta preta sobre papel branco, contraste forte, retículas discretas e hachuras; somente preto e branco, sem texto ou balões.",
      "assetPath": "assets/campaigns/kagehama/scenes/kagehama-scene-4.png",
      "kind": "scene",
      "category": "Cenários",
      "status": "brief-ready",
      "done": false
    },
    {
      "id": "art-kagehama-scene-5",
      "title": "Cenário vertical · Capítulo 6 — Um duelo sem vencedor",
      "description": "Ilustração de cenário vertical 9:16, sem personagens em primeiro plano, quadro estabelecedor para jogo em celular. Capítulo 6 — Um duelo sem vencedor. Audiência no Castelo da Cinza; duelo testa contenção e respeito, não exige morte.. Mangá de aventura original, tinta preta sobre papel branco, contraste forte, retículas discretas e hachuras; somente preto e branco, sem texto ou balões.",
      "assetPath": "assets/campaigns/kagehama/scenes/kagehama-scene-5.png",
      "kind": "scene",
      "category": "Cenários",
      "status": "brief-ready",
      "done": false
    },
    {
      "id": "art-kagehama-scene-6",
      "title": "Cenário vertical · Capítulo 7 — A noite da enseada",
      "description": "Ilustração de cenário vertical 9:16, sem personagens em primeiro plano, quadro estabelecedor para jogo em celular. Capítulo 7 — A noite da enseada. Infiltração ou perseguição marítima contra um navio com armas e registros falsos.. Mangá de aventura original, tinta preta sobre papel branco, contraste forte, retículas discretas e hachuras; somente preto e branco, sem texto ou balões.",
      "assetPath": "assets/campaigns/kagehama/scenes/kagehama-scene-6.png",
      "kind": "scene",
      "category": "Cenários",
      "status": "brief-ready",
      "done": false
    },
    {
      "id": "art-kagehama-scene-7",
      "title": "Cenário vertical · Capítulo 8 — A herdeira chamada Nao",
      "description": "Ilustração de cenário vertical 9:16, sem personagens em primeiro plano, quadro estabelecedor para jogo em celular. Capítulo 8 — A herdeira chamada Nao. Tomoe revela a matriz do selo; tornar a falsificação pública põe seus soldados em risco.. Mangá de aventura original, tinta preta sobre papel branco, contraste forte, retículas discretas e hachuras; somente preto e branco, sem texto ou balões.",
      "assetPath": "assets/campaigns/kagehama/scenes/kagehama-scene-7.png",
      "kind": "scene",
      "category": "Cenários",
      "status": "brief-ready",
      "done": false
    },
    {
      "id": "art-kagehama-scene-8",
      "title": "Cenário vertical · Capítulo 9 — Traição no santuário",
      "description": "Ilustração de cenário vertical 9:16, sem personagens em primeiro plano, quadro estabelecedor para jogo em celular. Capítulo 9 — Traição no santuário. Um agente entrega o esconderijo de refugiados para tentar salvar a própria família.. Mangá de aventura original, tinta preta sobre papel branco, contraste forte, retículas discretas e hachuras; somente preto e branco, sem texto ou balões.",
      "assetPath": "assets/campaigns/kagehama/scenes/kagehama-scene-8.png",
      "kind": "scene",
      "category": "Cenários",
      "status": "brief-ready",
      "done": false
    },
    {
      "id": "art-kagehama-scene-9",
      "title": "Cenário vertical · Capítulo 10 — A torre de sinal",
      "description": "Ilustração de cenário vertical 9:16, sem personagens em primeiro plano, quadro estabelecedor para jogo em celular. Capítulo 10 — A torre de sinal. Tempestade, patrulhas recrutadas e mensagens cifradas sobre uma guerra planejada.. Mangá de aventura original, tinta preta sobre papel branco, contraste forte, retículas discretas e hachuras; somente preto e branco, sem texto ou balões.",
      "assetPath": "assets/campaigns/kagehama/scenes/kagehama-scene-9.png",
      "kind": "scene",
      "category": "Cenários",
      "status": "brief-ready",
      "done": false
    },
    {
      "id": "art-kagehama-scene-10",
      "title": "Cenário vertical · Capítulo 11 — Conselho em Kagehama",
      "description": "Ilustração de cenário vertical 9:16, sem personagens em primeiro plano, quadro estabelecedor para jogo em celular. Capítulo 11 — Conselho em Kagehama. A prova exige testemunhas, proteção e uma apresentação que sobreviva à política.. Mangá de aventura original, tinta preta sobre papel branco, contraste forte, retículas discretas e hachuras; somente preto e branco, sem texto ou balões.",
      "assetPath": "assets/campaigns/kagehama/scenes/kagehama-scene-10.png",
      "kind": "scene",
      "category": "Cenários",
      "status": "brief-ready",
      "done": false
    },
    {
      "id": "art-kagehama-scene-11",
      "title": "Cenário vertical · Capítulo 12 — O cerco dos canais",
      "description": "Ilustração de cenário vertical 9:16, sem personagens em primeiro plano, quadro estabelecedor para jogo em celular. Capítulo 12 — O cerco dos canais. Três frentes simultâneas: comporta, enfermaria e muralha do porto.. Mangá de aventura original, tinta preta sobre papel branco, contraste forte, retículas discretas e hachuras; somente preto e branco, sem texto ou balões.",
      "assetPath": "assets/campaigns/kagehama/scenes/kagehama-scene-11.png",
      "kind": "scene",
      "category": "Cenários",
      "status": "brief-ready",
      "done": false
    },
    {
      "id": "art-kagehama-scene-12",
      "title": "Cenário vertical · Capítulo 13 — O regente e a lâmina",
      "description": "Ilustração de cenário vertical 9:16, sem personagens em primeiro plano, quadro estabelecedor para jogo em celular. Capítulo 13 — O regente e a lâmina. Kuroda oferece acordo; pode haver rendição, exposição, captura, fuga ou combate.. Mangá de aventura original, tinta preta sobre papel branco, contraste forte, retículas discretas e hachuras; somente preto e branco, sem texto ou balões.",
      "assetPath": "assets/campaigns/kagehama/scenes/kagehama-scene-12.png",
      "kind": "scene",
      "category": "Cenários",
      "status": "brief-ready",
      "done": false
    }
  ],
  "checklist": [
    {
      "id": "artcheck-ronin-male",
      "title": "Criar avatar masculino · Combatente de resistência",
      "description": "Recorte transparente vertical em mangá preto e branco. Arquivo-alvo: assets/campaigns/kagehama/classes/ronin/ronin_masculino.png",
      "done": false,
      "category": "Arte das classes"
    },
    {
      "id": "artcheck-ronin-female",
      "title": "Criar avatar feminino · Combatente de resistência",
      "description": "Recorte transparente vertical em mangá preto e branco. Arquivo-alvo: assets/campaigns/kagehama/classes/ronin/ronin_feminino.png",
      "done": false,
      "category": "Arte das classes"
    },
    {
      "id": "artcheck-samurai-male",
      "title": "Criar avatar masculino · Samurai juramentado",
      "description": "Recorte transparente vertical em mangá preto e branco. Arquivo-alvo: assets/campaigns/kagehama/classes/samurai/samurai_masculino.png",
      "done": false,
      "category": "Arte das classes"
    },
    {
      "id": "artcheck-samurai-female",
      "title": "Criar avatar feminino · Samurai juramentado",
      "description": "Recorte transparente vertical em mangá preto e branco. Arquivo-alvo: assets/campaigns/kagehama/classes/samurai/samurai_feminino.png",
      "done": false,
      "category": "Arte das classes"
    },
    {
      "id": "artcheck-kyudoka-male",
      "title": "Criar avatar masculino · Kyūdōka",
      "description": "Recorte transparente vertical em mangá preto e branco. Arquivo-alvo: assets/campaigns/kagehama/classes/kyudoka/kyudoka_masculino.png",
      "done": false,
      "category": "Arte das classes"
    },
    {
      "id": "artcheck-kyudoka-female",
      "title": "Criar avatar feminino · Kyūdōka",
      "description": "Recorte transparente vertical em mangá preto e branco. Arquivo-alvo: assets/campaigns/kagehama/classes/kyudoka/kyudoka_feminino.png",
      "done": false,
      "category": "Arte das classes"
    },
    {
      "id": "artcheck-shinobi-male",
      "title": "Criar avatar masculino · Shinobi",
      "description": "Recorte transparente vertical em mangá preto e branco. Arquivo-alvo: assets/campaigns/kagehama/classes/shinobi/shinobi_masculino.png",
      "done": false,
      "category": "Arte das classes"
    },
    {
      "id": "artcheck-shinobi-female",
      "title": "Criar avatar feminino · Shinobi",
      "description": "Recorte transparente vertical em mangá preto e branco. Arquivo-alvo: assets/campaigns/kagehama/classes/shinobi/shinobi_feminino.png",
      "done": false,
      "category": "Arte das classes"
    },
    {
      "id": "artcheck-onmyoji-male",
      "title": "Criar avatar masculino · Onmyōji",
      "description": "Recorte transparente vertical em mangá preto e branco. Arquivo-alvo: assets/campaigns/kagehama/classes/onmyoji/onmyoji_masculino.png",
      "done": false,
      "category": "Arte das classes"
    },
    {
      "id": "artcheck-onmyoji-female",
      "title": "Criar avatar feminino · Onmyōji",
      "description": "Recorte transparente vertical em mangá preto e branco. Arquivo-alvo: assets/campaigns/kagehama/classes/onmyoji/onmyoji_feminino.png",
      "done": false,
      "category": "Arte das classes"
    },
    {
      "id": "artcheck-miko-male",
      "title": "Criar avatar masculino · Miko yamabushi",
      "description": "Recorte transparente vertical em mangá preto e branco. Arquivo-alvo: assets/campaigns/kagehama/classes/miko/miko_masculino.png",
      "done": false,
      "category": "Arte das classes"
    },
    {
      "id": "artcheck-miko-female",
      "title": "Criar avatar feminino · Miko yamabushi",
      "description": "Recorte transparente vertical em mangá preto e branco. Arquivo-alvo: assets/campaigns/kagehama/classes/miko/miko_feminino.png",
      "done": false,
      "category": "Arte das classes"
    },
    {
      "id": "artcheck-kagehama-npc-0",
      "title": "Criar retrato de Lady Akiho Senda",
      "description": "Calma, formal e observadora. Faz uma pergunta por vez e espera a resposta inteira. Preservar a paz e a autoridade civil sem deixar que Kuroda controle o conselho.",
      "done": false,
      "category": "Arte dos NPCs"
    },
    {
      "id": "artcheck-kagehama-npc-1",
      "title": "Criar retrato de Ren Kuroda",
      "description": "Polidez controlada, elogios com condição e perguntas que parecem convites. Tomar controle do conselho e manter a crise abaixo do limiar da guerra aberta.",
      "done": false,
      "category": "Arte dos NPCs"
    },
    {
      "id": "artcheck-kagehama-npc-2",
      "title": "Criar retrato de Tomoe Arashi",
      "description": "Voz baixa, vocabulário preciso, responde com perguntas e verifica quem está perto. Expor a falsificação do tratado sem transformar o caso em uma disputa de sucessão.",
      "done": false,
      "category": "Arte dos NPCs"
    },
    {
      "id": "artcheck-kagehama-npc-3",
      "title": "Criar retrato de Jiro “Três Chuvas”",
      "description": "Fala entrecortada até se sentir seguro; conta passos para organizar a memória. Entregar a prova do tratado sem expor quem o escondeu.",
      "done": false,
      "category": "Arte dos NPCs"
    },
    {
      "id": "artcheck-kagehama-npc-4",
      "title": "Criar retrato de Sayo",
      "description": "Sotaque e formalidade mudam conforme o interlocutor; não sustenta contato visual por muito tempo. Proteger o irmão e impedir que a Casa Sen seja responsabilizada por uma guerra que não planejou.",
      "done": false,
      "category": "Arte dos NPCs"
    },
    {
      "id": "artcheck-kagehama-npc-5",
      "title": "Criar retrato de Monge Genzō",
      "description": "Pausas longas, perguntas simples e humor sereno; não confirma acusações sem evidência. Manter o santuário neutro e dar passagem segura aos refugiados.",
      "done": false,
      "category": "Arte dos NPCs"
    },
    {
      "id": "artcheck-kagehama-npc-6",
      "title": "Criar retrato de Lady Chiyo Arashi",
      "description": "Cortesia firme, perguntas diretas sobre quem pagará a consequência. Garantir autonomia para Arashi sem iniciar uma guerra que destrua as aldeias.",
      "done": false,
      "category": "Arte dos NPCs"
    },
    {
      "id": "artcheck-kagehama-npc-7",
      "title": "Criar retrato de Daichi Arashi",
      "description": "Bravata pública e conversa concreta em privado; usa insultos para medir reação. Construir uma força própria e impedir que Arashi volte a depender do conselho central.",
      "done": false,
      "category": "Arte dos NPCs"
    },
    {
      "id": "artcheck-kagehama-npc-8",
      "title": "Criar retrato de Akane",
      "description": "Conversa em tom prático enquanto prepara remédios; corta discussões que atrapalham o cuidado. Manter o paciente vivo e impedir que a Irmandade vire ferramenta de interrogatório.",
      "done": false,
      "category": "Arte dos NPCs"
    },
    {
      "id": "artcheck-kagehama-npc-9",
      "title": "Criar retrato de Mestre Tetsuo",
      "description": "Frases curtas dirigidas às ferramentas; responde melhor a perguntas específicas que a intimidação. Provar que seu trabalho não foi usado para matar o mensageiro.",
      "done": false,
      "category": "Arte dos NPCs"
    },
    {
      "id": "artcheck-kagehama-npc-10",
      "title": "Criar retrato de Nuvem",
      "description": "Não fala; reage por postura, ouvido, focinho e proximidade. Procurar pessoas conhecidas e evitar ruídos que anunciem perigo.",
      "done": false,
      "category": "Arte dos NPCs"
    },
    {
      "id": "artcheck-kagehama-scene-0",
      "title": "Criar cenário: Capítulo 1 — O salão das testemunhas",
      "description": "Cenário vertical para celular, recorte sem personagens. Akiho convoca o grupo; versões contraditórias apontam para Arashi, Casa Sen e comerciantes.",
      "done": false,
      "category": "Cenários"
    },
    {
      "id": "artcheck-kagehama-scene-1",
      "title": "Criar cenário: Capítulo 2 — Três contas queimadas",
      "description": "Cenário vertical para celular, recorte sem personagens. Sayo leva ao santuário; refugiados somem na floresta e uma trilha cruza esconderijo de Daichi.",
      "done": false,
      "category": "Cenários"
    },
    {
      "id": "artcheck-kagehama-scene-2",
      "title": "Criar cenário: Capítulo 3 — O homem sob a água",
      "description": "Cenário vertical para celular, recorte sem personagens. Nos Arquivos Afogados, o grupo escolhe salvar Jiro, documentos ou a própria segurança.",
      "done": false,
      "category": "Cenários"
    },
    {
      "id": "artcheck-kagehama-scene-3",
      "title": "Criar cenário: Capítulo 4 — A caça do cervo negro",
      "description": "Cenário vertical para celular, recorte sem personagens. Rastro leva a posto abandonado e soldados mortos após um encontro diplomático falso.",
      "done": false,
      "category": "Cenários"
    },
    {
      "id": "artcheck-kagehama-scene-4",
      "title": "Criar cenário: Capítulo 5 — O mensageiro que não chegou",
      "description": "Cenário vertical para celular, recorte sem personagens. A aldeia de Sumi perde água por uma ordem verdadeira entregue por portador falso.",
      "done": false,
      "category": "Cenários"
    },
    {
      "id": "artcheck-kagehama-scene-5",
      "title": "Criar cenário: Capítulo 6 — Um duelo sem vencedor",
      "description": "Cenário vertical para celular, recorte sem personagens. Audiência no Castelo da Cinza; duelo testa contenção e respeito, não exige morte.",
      "done": false,
      "category": "Cenários"
    },
    {
      "id": "artcheck-kagehama-scene-6",
      "title": "Criar cenário: Capítulo 7 — A noite da enseada",
      "description": "Cenário vertical para celular, recorte sem personagens. Infiltração ou perseguição marítima contra um navio com armas e registros falsos.",
      "done": false,
      "category": "Cenários"
    },
    {
      "id": "artcheck-kagehama-scene-7",
      "title": "Criar cenário: Capítulo 8 — A herdeira chamada Nao",
      "description": "Cenário vertical para celular, recorte sem personagens. Tomoe revela a matriz do selo; tornar a falsificação pública põe seus soldados em risco.",
      "done": false,
      "category": "Cenários"
    },
    {
      "id": "artcheck-kagehama-scene-8",
      "title": "Criar cenário: Capítulo 9 — Traição no santuário",
      "description": "Cenário vertical para celular, recorte sem personagens. Um agente entrega o esconderijo de refugiados para tentar salvar a própria família.",
      "done": false,
      "category": "Cenários"
    },
    {
      "id": "artcheck-kagehama-scene-9",
      "title": "Criar cenário: Capítulo 10 — A torre de sinal",
      "description": "Cenário vertical para celular, recorte sem personagens. Tempestade, patrulhas recrutadas e mensagens cifradas sobre uma guerra planejada.",
      "done": false,
      "category": "Cenários"
    },
    {
      "id": "artcheck-kagehama-scene-10",
      "title": "Criar cenário: Capítulo 11 — Conselho em Kagehama",
      "description": "Cenário vertical para celular, recorte sem personagens. A prova exige testemunhas, proteção e uma apresentação que sobreviva à política.",
      "done": false,
      "category": "Cenários"
    },
    {
      "id": "artcheck-kagehama-scene-11",
      "title": "Criar cenário: Capítulo 12 — O cerco dos canais",
      "description": "Cenário vertical para celular, recorte sem personagens. Três frentes simultâneas: comporta, enfermaria e muralha do porto.",
      "done": false,
      "category": "Cenários"
    },
    {
      "id": "artcheck-kagehama-scene-12",
      "title": "Criar cenário: Capítulo 13 — O regente e a lâmina",
      "description": "Cenário vertical para celular, recorte sem personagens. Kuroda oferece acordo; pode haver rendição, exposição, captura, fuga ou combate.",
      "done": false,
      "category": "Cenários"
    },
    {
      "id": "artcheck-map",
      "title": "Fechar mapa regional de Akitsuru",
      "description": "Com três reinos, rotas terrestres e aquáticas, travessias e distâncias de viagem.",
      "done": false,
      "category": "Mapa geral"
    },
    {
      "id": "artcheck-travel",
      "title": "Preparar 3 variações de viagem",
      "description": "Estrada segura, atalho arriscado e rota fluvial; cada uma com quadro vertical próprio.",
      "done": false,
      "category": "Viagens"
    },
    {
      "id": "artcheck-props",
      "title": "Criar objetos narrativos em close",
      "description": "Tratado, selo, flecha, cordão de contas, livro de carga e mapa das comportas.",
      "done": false,
      "category": "Props"
    }
  ],
  "testLog": [],
  "analysis": {
    "status": "pacote-de-teste",
    "extractedAt": 0,
    "sceneHeadings": [
      "Capítulo 1 — O salão das testemunhas",
      "Capítulo 2 — Três contas queimadas",
      "Capítulo 3 — O homem sob a água",
      "Capítulo 4 — A caça do cervo negro",
      "Capítulo 5 — O mensageiro que não chegou",
      "Capítulo 6 — Um duelo sem vencedor",
      "Capítulo 7 — A noite da enseada",
      "Capítulo 8 — A herdeira chamada Nao",
      "Capítulo 9 — Traição no santuário",
      "Capítulo 10 — A torre de sinal",
      "Capítulo 11 — Conselho em Kagehama",
      "Capítulo 12 — O cerco dos canais",
      "Capítulo 13 — O regente e a lâmina",
      "Local — Mapa regional de Akitsuru",
      "Local — Kagehama",
      "Local — Serra do Cedro Negro",
      "Local — Floresta de Aokiri",
      "Local — Rede subterrânea"
    ],
    "balance": {
      "startingLevel": 1,
      "recommendedSkillRange": "11–14",
      "threats": "intriga política, espionagem, caça, perseguição, duelos e cerco",
      "social": true,
      "exploration": true,
      "threatsPresent": true,
      "narratorReview": "Classes iniciais equilibradas para investigação, interação, exploração e conflito.",
      "travel": "viagens em trechos com rota, tempo, condição, recursos, exposição e vínculos"
    }
  },
  "createdAt": 0,
  "updatedAt": 0,
  "travelRules": {
    "principle": "Cada deslocamento pode criar alianças, revelar pistas, consumir recursos, agravar ferimentos, provocar perseguições ou alterar a opinião de uma comunidade.",
    "track": [
      "tempo",
      "condição",
      "recursos",
      "exposição",
      "vínculos"
    ],
    "guidance": "Declare destino e intenção, compare rotas, registre o estado da viagem, divida o caminho em trechos significativos, sinalize perigos e pergunte como cada personagem contribui. Role 3d6 quando o resultado for incerto e relevante. Na chegada, atualize prazos, relações e posição dos perseguidores."
  },
  "travel": [
    {
      "id": "kagehama-travel-0",
      "title": "Kagehama → Santuário de Aokiri",
      "description": "Meio dia. Abrigo e informação; risco de chuva, patrulha ou trilha falsa.",
      "createdAt": 0
    },
    {
      "id": "kagehama-travel-1",
      "title": "Kagehama → Aldeia de Sumi",
      "description": "Um dia pelo canal. Contato com moradores; risco de canal fechado, ordem falsa e falta de água.",
      "createdAt": 0
    },
    {
      "id": "kagehama-travel-2",
      "title": "Kagehama → Porto de Shirotsu",
      "description": "Um dia de barco ou dois pela costa. Acesso a navios; risco de maré, contrabandistas e perseguição.",
      "createdAt": 0
    },
    {
      "id": "kagehama-travel-3",
      "title": "Kagehama → Arashi",
      "description": "Dois dias pela Estrada do Sino. Audiência com Lady Chiyo; pedágios, desfiladeiro e soldados desconfiados.",
      "createdAt": 0
    },
    {
      "id": "kagehama-travel-4",
      "title": "Kagehama → Campos de Hino",
      "description": "Três dias pela estrada imperial. Suprimentos e testemunhas; calor, cobrança de milícia e escassez.",
      "createdAt": 0
    },
    {
      "id": "kagehama-travel-5",
      "title": "Aokiri → Desfiladeiro do Sino Quebrado",
      "description": "Atalho de montanha. Poupa horas e expõe a trilha a deslizamento, cavalo assustado ou emboscada.",
      "createdAt": 0
    },
    {
      "id": "kagehama-travel-6",
      "title": "Kagehama → Arquivos Afogados",
      "description": "Uma hora por passagens urbanas. Acesso rápido a Jiro; comportas, água subindo e guardas internos.",
      "createdAt": 0
    }
  ],
  "progression": {
    "currency": "Pontos de personagem",
    "awardTiming": "Ao fechar cada elo narrativo: batalha, negociação, investigação, perseguição ou viagem decisiva.",
    "awardCap": 5,
    "criteria": [
      {
        "id": "roleplay",
        "label": "Interpretou o arquétipo ou uma escolha pessoal relevante"
      },
      {
        "id": "risk",
        "label": "Assumiu risco ou custo real ligado a dever, vínculo ou condição"
      },
      {
        "id": "teamwork",
        "label": "Ajudou outro personagem ou mudou uma relação importante"
      },
      {
        "id": "discovery",
        "label": "Trouxe uma descoberta, plano ou solução significativa"
      },
      {
        "id": "milestone",
        "label": "Contribuiu diretamente para avançar ou resolver o elo"
      }
    ],
    "rules": "O narrador marca apenas critérios demonstrados em jogo e registra uma justificativa curta. Comportamento disruptivo só rende ponto quando produz uma escolha coerente e consequência narrativa; causar problema por si só não recompensa. Cada personagem recebe no máximo uma concessão por elo."
  },
  "progressionLog": [],
  "artDirection": {
    "medium": "Mangá original em preto e branco, papel de página levemente amarelado na interface; artes sem cor.",
    "palette": [
      "#111111",
      "#f1ead7"
    ],
    "sceneFormat": "Vertical 9:16 para celular, cenário sem personagem incorporado; personagens em recortes transparentes em camada separada.",
    "linework": "Contorno de tinta preto, retículas discretas, sombras por hachura, detalhe moderado, leitura clara em tela pequena.",
    "frames": "Molduras de quadrinhos em tinta preta com filetes duplos, cantos de papel e marcas editoriais sutis; evitar excesso de ornamento.",
    "characterRule": "Avatares corpo inteiro em PNG transparente; nunca desenhar cenário no recorte do personagem.",
    "npcRule": "Cada NPC tem retrato individual e ficha narrativa com desejo, medo, segredo, voz, comportamento, vínculos e gatilhos de reação.",
    "promptBase": "Mangá de aventura original; não copiar personagens, uniformes, símbolos ou desenho de uma franquia existente. Preto e branco, papel branco, tinta preta, retículas discretas, contraste forte, sem texto, sem logotipos."
  }
}

for (const cls of KAGEHAMA_CAMPAIGN.classes) {
  cls.portraits = KAGEHAMA_PORTRAITS[cls.id];
  cls.portrait = cls.portraits.male;
  cls.assetPaths = { ...cls.portraits };
  cls.assetPath = cls.portrait;
}
