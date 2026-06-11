// ══════════════════════════════════════════════════════════════════
//  BEAST OF BLACK KEEP — Dados da Campanha
//  Usado por narration.html (módulo ES nativo, sem build Vite)
// ══════════════════════════════════════════════════════════════════

// ─────────────────────────────────────────────────────────────────
//  NPCs
//  sprite  : caminho relativo à raiz de public/
//  descFisica : descrição detalhada para geração de arte por IA
// ─────────────────────────────────────────────────────────────────
export const NPCS = {

  npc_catherine_laskaris: {
    id: 'npc_catherine_laskaris',
    nome: 'Duquesa Catherine Laskaris',
    sprite: 'sprites/npc_catherine_laskaris.png',
    categoria: 'aliado',
    descFisica: `Mulher nobre de ~35 anos, traços mediterrâneos finos, pele oliva, olhos castanho-escuros e penetrantes. Cabelo castanho-escuro com ondas naturais, solto e caindo suavemente sobre os ombros. Veste vestido roxo-escuro com bordados dourados na gola e mangas, capa bege-dourada sobre os ombros. Postura ereta e digna, expressão serena mas olhar determinado. Fisionomia de governante que carrega peso mas não o demonstra.`,
    personalidade: `Governante de Mhoried, nobre poised e graciosa. Carrega genuína preocupação com o irmão Oswald mas não demonstra fraqueza em público. Recompensa lealdade e respeita competência acima de status. Faz pedidos com autoridade gentil. Sente culpa por não ter conseguido proteger Oswald.`,
    conhecimentos: `Sabe que Oswald foi transformado em Thool pelo mago Dendybar. Oferece $5.000 por informações/ajuda e cavalaria+terras se Oswald for restituído. Conhece os principais perigos da região ao norte. Desconfia do Rei Chutter mas não sabe sua localização. Conhece Finn Willowheel desde criança.`,
    formaDeFalar: `Frases longas e elaboradas. Usa "honra", "dever" e "Mhoried" frequentemente. Nunca admite medo diretamente — fala em "preocupações" e "circunstâncias difíceis". Trata aventureiros com respeito cuidadoso. Discursos formais mas com calor genuíno quando sente confiança.`,
  },

  npc_gregoras_pellos: {
    id: 'npc_gregoras_pellos',
    nome: 'Gregoras Pellos',
    sprite: 'sprites/npc_gregoras_pellos.png',
    categoria: 'aliado',
    descFisica: `Homem de ~45 anos, constituição robusta e ombros largos. Cabelo castanho-escuro curto, barba de três dias, expressão séria e fechada. Veste armadura acolchoada azul-escura reforçada com detalhes em bronze, cinto largo com fivela de ferro. Empunha uma maça de cabeça ferrada à cinta. Postura ereta de soldado — não se curva, não sorri à toa. Olhar direto e avaliador, como alguém que mede ameaças por reflexo.`,
    personalidade: `Braço direito militar da Duquesa Catherine — não um burocrata, mas um homem de ação que age como emissário quando necessário. Leal à Duquesa por juramento e por convicção, não por protocolo. Direto ao ponto, intolerante com enrolação. Não se importa se os aventureiros gostam dele — importa que façam o trabalho. Carrega o peso da missão com silêncio, não com discursos. Quando pressiona, pressiona de verdade.`,
    conhecimentos: `Conhece Oswald há anos — pode identificá-lo pela marca de nascença no ombro e pelo dedo indicador do pé maior que o dedão. Sabe que Oswald buscou o mago Dendybar nos Blackwoods e que deu errado. Conhece os perigos da região ao norte. Tem ordens explícitas da Duquesa para trazer esses aventureiros ao castelo — com ou sem diplomacia.`,
    formaDeFalar: `Frases curtas e diretas. Não explica o que não precisa explicar. Usa imperativos: "Venham.", "Não temos tempo.", "Sigam-me." Quando irritado, a voz fica mais baixa, não mais alta. Nunca enrola — se tem algo a dizer, diz na primeira frase. Não usa "por favor" com frequência. Quando dá uma informação, é porque decidiu dar — não porque foi convencido por lábia.`,
  },

  npc_hobbleboot_sam: {
    id: 'npc_hobbleboot_sam',
    nome: 'Hobbleboot Sam',
    sprite: 'sprites/npc_hobbleboot_sam.png',
    categoria: 'neutro',
    descFisica: `Homem de meia-idade ~50 anos, barba curta grisalha, cabelo castanho-acinzentado. Veste casaco de viajante marrom com capa verde desgastada. Usa bengala de madeira. Carrega às costas uma grande cesta repleta de cogumelos, ervas e outros produtos da floresta. Rosto angular e expressão séria mas não hostil — homem acostumado a caminhar sozinho pelas matas.`,
    personalidade: `Comerciante itinerante da Feira de St. Phanourios, especializado em produtos da floresta — cogumelos, ervas, raízes medicinais. Tagarela e fonte inesgotável de rumores locais. Gosta de aventureiros pois trazem histórias. Conhece atalhos e perigos das matas por anos de coleta. Sem agenda política — apenas quer que a feira transcorra bem.`,
    conhecimentos: `Sabe de todos os rumores da cidade: cobolds nas matas, mercadores desaparecendo, o escândalo do duque Oswald. Conhece a localização aproximada de vários pontos de interesse nos Blackwoods. Pode indicar quem contratar para guias locais.`,
    formaDeFalar: `Fala em voz alta e animada, usa gírias locais, conclui frases com "é o que eu digo!" ou "pode escrever aí". Adora dar mais informação do que foi pedido. Muda de assunto abruptamente seguindo seus próprios pensamentos. Tom sempre amistoso mesmo com estranhos.`,
  },

  npc_finn_willowheel: {
    id: 'npc_finn_willowheel',
    nome: 'Finn Willowheel',
    sprite: 'sprites/npc_finn_willowheel.png',
    categoria: 'aliado',
    descFisica: `Homem idoso de ~70 anos, cabelo branco muito curto e ralo, rosto rosado com sorriso largo e afável. Veste roupas de trabalho — avental de couro com bolsos cheios de ferramentas de sapateiro, fita métrica no cinto. Carrega às costas uma enorme saca transbordando de sapatos, botas, sandálias e chinelos de todas as cores e tamanhos. Olhos espertos e cheios de vida. Postura ativa e passo leve apesar da aparente idade.`,
    personalidade: `Sapateiro experiente e amigável, conhecido há décadas nas estradas e feiras da região. Enérgico, cheio de histórias, genuinamente curioso sobre cada pessoa que encontra. Desconfia profundamente de elfos negros por experiências passadas. Dedica-se ao ofício com paixão — cada sapato é uma obra de arte para ele.`,
    conhecimentos: `Conhece os Blackwoods há décadas. Pode descrever a localização de vários pontos de interesse e avisar sobre os elfos negros. Conhece Catherine Laskaris desde criança e fez sapatos para toda a família — inclusive sabe da particularidade do pé de Oswald (dedo indicador maior que o dedão).`,
    formaDeFalar: `Voz suave e melodiosa com sotaque élfico leve. Faz digressões frequentes sobre qualidade de calçados ao tentar descrever qualquer coisa. Usa expressões como "Ah, curioso!" e "Deixa eu te contar uma coisa...". Tom sempre otimista mesmo sobre situações perigosas.`,
  },

  npc_ruzalka: {
    id: 'npc_ruzalka',
    nome: 'Ruzalka',
    sprite: 'sprites/npc_ruzalka.png',
    categoria: 'neutro',
    descFisica: `Espírito aquático feminino de aparência etérea. Cabelo verde-azulado flutuante como se permanentemente debaixo d'água. Pele translúcida com reflexos de água parada — às vezes se pode ver através dela. Olhos sem íris visível, brancos com brilho azulado. Veste roupas de tecido aquático transparente que parecem tecidas de correntes de água. Quando fala, pequenas bolhas aparecem ao redor dela.`,
    personalidade: `Espírito guardião do Bosque Afogado. Etérea, contemplativa, protetora de seu domínio aquático. Não hostil a priori mas muito territorial. Sente o sofrimento dos que morreram em suas águas. Tem senso de humor úmido e melancólico. Ajuda aqueles que respeitam as águas.`,
    conhecimentos: `Sabe de todos que passam pelo bosque afogado, vivos ou mortos. Pode indicar onde estão os elfos negros, o que Choir está fazendo com os mortos nas águas. Conhece a lenda da Gillshade que cresce perto de suas águas. Viu o acampamento élfico sendo montado.`,
    formaDeFalar: `Fala em frases curtas e sibilantes, como água escorrendo. Usa metáforas aquáticas para tudo. Às vezes repete a última palavra de uma frase como um eco. Nunca responde diretamente — dá respostas oblíquas que requerem interpretação. Exemplo: "As águas sabem... as águas sabem o que você busca... mas as águas guardam segredos fundos."`,
  },

  npc_principe_kalos: {
    id: 'npc_principe_kalos',
    nome: 'Príncipe Kalos',
    sprite: 'sprites/npc_principe_kalos.png',
    categoria: 'neutro_hostil',
    descFisica: `Elfo negro alto e esguio, ~1,90m, pele cinza-escura com textura lisa, cabelo branco longo preso em uma única trança lateral. Olhos vermelhos sem pupila, olhar penetrante. Feições angulosas e aristocráticas. Veste armadura de comandante élfico em couro negro com entalhes prateados que representam padrões de constelações. Postura altiva e porte régio. Sempre com um leve sorriso que não alcança os olhos.`,
    personalidade: `Líder dos elfos negros nos Blackwoods, em missão de recuperar fragmentos de Voorn (pedras mágicas ancestrais). Orgulhoso com autoestima de nobre. Desconfiado de humanos mas não irreversivelmente hostil — pode negociar se houver algo a ganhar. Despreza a fraqueza mas respeita a habilidade. Sua missão está acima de tudo.`,
    conhecimentos: `Sabe da presença do Rei Chutter e seus planos vagos. Tem informações sobre os Thools. Não se alinha a Chutter nem a nenhum humano. Busca fragmentos de Voorn que conferem poderes de percepção a elfos. Pode indicar onde há perigos nos Blackwoods se negociado.`,
    formaDeFalar: `Fala em voz baixa e modulada, cada palavra cuidadosamente escolhida. Nunca diz mais do que precisa. Usa "nós, os Vhuureth" para referir-se a si mesmo em nome de seu povo. Termos condescendentes sutis ao se dirigir a não-elfos. Quando ameaça, faz com uma cortesia gelada.`,
  },

  npc_valmorien: {
    id: 'npc_valmorien',
    nome: 'Valmorien',
    sprite: 'sprites/npc_valmorien.png',
    categoria: 'hostil',
    descFisica: `Elfa negra jovem e ágil, pele cinza-escura com subtom avermelhado, cabelo curto e escuro preso em rabo de cavalo baixo. Traços afiados e expressão severa, olhos vermelhos estreitados em avaliação constante. Veste armadura de caçador em couro escuro e peles, arco longo às costas e faca curta sempre à mão. Postura compacta e atlética — corpo treinado para eliminar alvos rapidamente. Cicatriz sutil no queixo esquerdo.`,
    personalidade: `Assassina e caçadora de elite do Príncipe Kalos. Leal ao Kalos acima de tudo. Poucas palavras, ação rápida. Vê humanos como problemas a serem gerenciados. Não mata por prazer — apenas por necessidade ou ordens. Tem um código de honra arcano que a impede de atacar pelas costas.`,
    conhecimentos: `Sabe as rotas de patrulha dos elfos negros. Conhece as fraquezas do acampamento. Sabe da existência dos Thools mas os despreza. Pouco disposta a compartilhar qualquer coisa.`,
    formaDeFalar: `Monossílabos e frases de três palavras no máximo. Prefere silêncio a conversa. Quando forçada a falar: direta, sem amenidades. Nunca ameaça — apenas faz.`,
  },

  npc_ysoria: {
    id: 'npc_ysoria',
    nome: 'Ysoria',
    sprite: 'sprites/npc_ysoria.png',
    categoria: 'hostil',
    descFisica: `Elfo negro de feições angulosas, pele cinza-esverdeada, cabelo escuro e volumoso. Olhos vermelhos com expressão permanentemente calculista. Veste equipamento de caçador/ranger em couro escuro e peles irregulares, manta rasgada sobre os ombros. Carrega arco com corda de nervo animal e aljava de flechas nas costas. Movimentos silenciosos como um predador — cada passo deliberado e sem desperdício.`,
    personalidade: `Guerreiro arqueiro dos elfos negros, par de Valmorien. Mais perigoso que aparenta pela aproximação silenciosa. Frio, calculista, vê as situações como equações. Está em missão e considera qualquer interrupção um desperdício de seu tempo. Tem curiosidade intelectual que o faz fazer perguntas inesperadas antes de atacar.`,
    conhecimentos: `Conhece magia arcana das tradições élfico-negras. Sabe da existência de vários artefatos nas redondezas. Estuda os Thools de longe com interesse acadêmico. Tem teorias sobre o Rei Chutter.`,
    formaDeFalar: `Frases curtas e precisas como uma análise. Tom de enfado permanente. Quando faz uma pergunta é genuinamente curioso e irritante ao mesmo tempo. Usa "interessante" para descrever ameaças que outros achariam assustadoras.`,
  },

  npc_wulfram_chifrado: {
    id: 'npc_wulfram_chifrado',
    nome: 'Wulfram, o Chifrado',
    sprite: 'sprites/npc_wulfram_chifrado.png',
    categoria: 'neutro',
    descFisica: `Homem robusto e imponente de ~40 anos, porte intimidador. Chifres de cervo crescendo organicamente da testa — ramificados, com veludo natural, definitivamente parte de seu corpo. Cabelo escuro e desgrenhado, barba densa. Pele bronzeada pela floresta. Veste capa de peles de animais sobre armadura de couro grosseiro. Empunha um machado de batalha de lâmina larga. Expressão séria e direta, olhos castanho-esverdeados que raramente piscam.`,
    personalidade: `Guardião selvagem dos Blackwoods, filho de Mutter Grimmhaar. Neutro — não é inimigo, não é aliado incondicional. Respeita quem respeita a floresta. Recusou a oferta do Rei Chutter de liderar os kobolds porque odeia o necromante Choir, aliado de Chutter. Não faz amizade fácil mas honra promessas.`,
    conhecimentos: `Conhece cada palmo dos Blackwoods. Sabe onde ficam os Thools, o acampamento élfico, os kobolds. Odeio Choir e seus experimentos. Poderia ser um aliado valioso se os heróis ganharem sua confiança. Sabe sobre o portal no Gloamreach.`,
    formaDeFalar: `Poucas palavras, cada uma deliberada. Fala sobre a floresta como se fosse uma entidade viva. Nunca promete o que não pode cumprir. Usa frases imperativas curtas: "Vá." "Espere." "Escuta." Pausa longa antes de responder qualquer pergunta. Nunca explica seu raciocínio a não ser que perguntado diretamente.`,
  },

  npc_fariborz_piromante: {
    id: 'npc_fariborz_piromante',
    nome: 'Fariborz, o Piromante',
    sprite: 'sprites/npc_fariborz_piromante.png',
    categoria: 'neutro_hostil',
    descFisica: `Homem de ~30 anos com marcas extensas de queimaduras em metade do rosto e pescoço. Sem sobrancelhas, sem cílios. Crânio parcialmente careca em padrões irregulares de cicatriz. Olhos castanho-claros com brilho febril. Veste robes cinzas chamuscados com manchas de fuligem. Dedos sempre ligeiramente emitindo faíscas. Expressão paranoica que alterna com mania súbita. Gillshade escura presa ao pescoço como amuleto — foi o que o salvou da forca.`,
    personalidade: `Piromaníaco foragido da justiça de Mhoried. Paranóico e imprevisível. Não é fundamentalmente mau, apenas obcecado com o fogo e com o Vulkrundshard — uma pedra vulcânica que ele acredita conter um demônio que pode lhe ensinar feitiços supremos do fogo. Usa o fogo como ameaça reflexiva mesmo quando não quer machucar.`,
    conhecimentos: `Sabe da localização do Vulkrundshard. Conhece vários caminhos pelos Blackwoods por ter vagado por semanas. Tem informações sobre as ruínas que explora. Sabe de Choir e seus experimentos necromânticos. A caçadora Aelar Eisenli está atrás dele valendo $500 de recompensa.`,
    formaDeFalar: `Voz tensa, fala rápido com mudanças abruptas de assunto. Frequentemente ameaça com fogo no meio de frases normais. "Bom dia. Eu queimo você se me tocar." Paranoias se manifestam em perguntas acusatórias. Quando relaxado, é surpreendentemente inteligente e perspicaz sobre magia.`,
  },

  npc_mutter_grimmhaar: {
    id: 'npc_mutter_grimmhaar',
    nome: 'Mutter Grimmhaar',
    sprite: 'sprites/npc_mutter_grimmhaar.png',
    categoria: 'neutro',
    descFisica: `Mulher alta e esbelta de aparência ambígua — parece ~50 anos mas é muito mais velha. Chapéu de bruxa enorme de aba larga e retorcida com penduricalhos de ossos e joias sombrias. Robes negros rasgados e desgastados com elegância sinistra — não são trapos simples, mas vestimentas de poder deterioradas pelo tempo. Cajado alto com gema púrpura brilhante encravada em garras de metal negro. Pele pálida, traços afiados, boca com sorriso enigmático que nunca alcança os olhos. Postura ereta e imponente — verticalmente ameaçadora.`,
    personalidade: `Bruxa canibalista que vive nos Blackwoods. Aparentemente terrível mas funciona segundo seu próprio código torto. Ama profundamente o filho Wulfram. Obcecada com larvas gigantes — come seus órgãos internos com deleite. Não atacará os heróis a menos que atacados. Convida todos para "caldo de ossos na fogueira, cheio de segredos" — uma forma estranha de amizade.`,
    conhecimentos: `Sabe de praticamente tudo que acontece nos Blackwoods por anos de observação. Tem Gillshade e Greybane que o druida Mac Rónán precisa. Conhece a localização do Gloamreach dos Thools. Sabe sobre os experimentos de Choir. Filho Wulfram lhe conta tudo que vê.`,
    formaDeFalar: `Fala em rimas imperfeitas e meias-rimas quando está de humor. Quando não rima, usa metáforas macabras sobre ossos, podridão e sabor de coisas incomestíveis. Tem o hábito de cheirar os visitantes. Trata todos como potencialmente comestíveis mas raramente segue em frente nisso. Usa "minha criança" ao se referir a qualquer adulto.`,
  },

  npc_mac_ronan: {
    id: 'npc_mac_ronan',
    nome: 'Mac Rónán, Alto Druida',
    sprite: 'sprites/npc_mac_ronan.png',
    categoria: 'aliado',
    descFisica: `Druida extremamente idoso de aparência ~80 anos, provavelmente muito mais velho. Cabelo branco longo e barba comprida com folhas, pequenos galhos e musgo entrelaçados naturalmente. Robes verdes desgastados em camadas — mais natureza do que tecido, com vegetação viva crescendo sobre o pano. Pés descalços ou amarrados com cipó. Mãos com veias proeminentes, dedos entrelaçados em frente ao corpo em gesto sereno. Olhos cinza-esverdeados de sabedoria profunda. Caminha devagar mas com intenção absoluta.`,
    personalidade: `Alto Druida de Cnoc na Ríthe, curandeiro e guardião da floresta. Sábio, medido, pesa cada palavra. Profundamente preocupado com a segurança de sua aldeia e de Cnoc na Ríthe. Depois de ser resgatado dos kobolds, quer voltar imediatamente. Pode curar os heróis (cura Major e Minor). Conhece o feitiço para reverter a maldição de Oswald mas precisa de três ervas raras.`,
    conhecimentos: `Sabe da existência dos Thools e da origem da maldição. Precisa de três ervas para reverter a maldição de Oswald: Gillshade (perto do Bosque Afogado), Greybane (na área do manticora) e Cogumelos de Log-Wife (perto da carcaça de larva). Sabe curar e conhece profundamente as plantas dos Blackwoods. Conhece Dvalinn o Anão.`,
    formaDeFalar: `Fala devagar e deliberadamente, como se cada palavra custasse algo. Usa pronomes coletivos ao se referir à natureza: "a floresta quer...", "as águas sabem...". Raramente dá respostas diretas — guia através de perguntas filosóficas. Quando urgente, abandona a pose druídica e fala diretamente.`,
  },

  npc_muirenn: {
    id: 'npc_muirenn',
    nome: 'Muirenn',
    sprite: 'sprites/npc_muirenn.png',
    categoria: 'aliado',
    descFisica: `Jovem mulher celta de ~22 anos, cabelo castanho comprido levemente ondulado com pequenas tranças rituais nas laterais. Olhos castanho-esverdeados com expressão atenta e cuidadosa. Veste roupas druidicas simples em tons de verde e terra, manta desgastada com elementos naturais costurados. Segura ou carrega flores e ervas medicinais. Constituição equilibrada, postura reflexiva mas atenta.`,
    personalidade: `Aprendiz druida do Mac Rónán, jovem e impulsiva. Emocionalmente mais direta que seu mestre. Profundamente leal a Mac Rónán e a Cnoc na Ríthe. Fica com raiva fácil quando sente injustiça. Tem menos paciência com metáforas filosóficas — prefere ação direta. Muito competente com ervas medicinais.`,
    conhecimentos: `Conhece as ervas dos Blackwoods tão bem quanto Mac Rónán. Pode ajudar a preparar o feitiço de reversão de maldição. Sabe das movimentações recentes nos Blackwoods.`,
    formaDeFalar: `Fala com energia e diretamente. Quando algo a irrita, faz questão de dizer. Usa "por todos os galhos!" como exclamação. Pergunta o porquê das coisas sem rodeios. Pode ser gentil mas sem cerimônia excessiva.`,
  },

  npc_dvalinn_anao: {
    id: 'npc_dvalinn_anao',
    nome: 'Dvalinn',
    sprite: 'sprites/npc_dvalinn_anao.png',
    categoria: 'aliado',
    descFisica: `Anão de ~150 anos (aparência de 40 humanos), ~1,45m, construção imponente e larga. Barba ruivo-acastanhada bem cuidada em duas tranças. Cabelo da mesma cor preso atrás. Armadura de viajante com amassados e arranhões recentes. Machado pequeno no cinto. Expressão melancólica e cansada. Cicatrizes frescas de flecha no ombro. Olhos castanhos com peso profundo neles.`,
    personalidade: `Companheiro mercador que perdeu seus amigos para um ataque élfico. Carrega culpa enorme por não ter conseguido protegê-los. Teimoso e auto-crítico, frequentemente repete que "deveria ter ouvido melhor" (é parcialmente surdo de um ouvido). Quer vingança nos elfos negros que mataram seus amigos. Pode se tornar aliado valioso se convencido.`,
    conhecimentos: `Estava tentando convencer o kobold Blunkin a romper com o Rei Chutter quando foi capturado. Conhece a lenda do Vulkrundshard e avisa sobre possível demônio dentro dele. Sabe de rotas de comércio e pode identificar mercadorias valiosas. Conhece algo sobre a origem dos elfos negros na região.`,
    formaDeFalar: `Voz grave e rouca. Faz perguntas de clarificação frequentes por causa do problema auditivo ("Você disse o quê?"). Tendência a se auto-criticar no meio de qualquer conversa. Quando animado com uma ideia, bate o punho na palma da mão. Honorário — se dá sua palavra, cumpre.`,
  },

  npc_blunkin_esmaga_cranios: {
    id: 'npc_blunkin_esmaga_cranios',
    nome: 'Blunkin Esmaga-Crânios',
    sprite: 'sprites/npc_blunkin_esmaga_cranios.png',
    categoria: 'neutro_hostil',
    descFisica: `Criatura réptil-anfíbia de estatura baixa (~1,0m), corpo redondo e rechonchudo. Pele alaranjada-avermelhada e escamosa. Olhos amarelo-esverdeados esbugalhados, expressão permanentemente pomposa. Usa coroa torta de metal com pedras semipreciosas encrustadas — claramente presente de alguém importante. Capa real roxa com bordas de pelo branco. Colar de dentes e amuletos. Empunha cetro com crânio decorativo na ponta. Barriga protuberante, postura erguida com orgulho ridículo.`,
    personalidade: `Rei dos kobolds da Cidade Kobold, aliado obrigado do Rei Chutter. Excessivamente vaidoso e facilmente bajulado. Considera-se um gênio estratégico apesar de tomar decisões terríveis. Genuinamente adora seus súditos à sua maneira. Facilmente distraído por elogios. Tem medo do Rei Chutter mas mais medo de parecer covarde.`,
    conhecimentos: `Sabe da aliança com o Rei Chutter e do plano de atacar Mhoried (mesmo sem entender muito). Tem o druida Mac Rónán preso. Sabe que o cristal rachado no trono conecta ao Gloamreach dos Thools. Quer ser visto como um grande rei — pode ser manipulado com elogios.`,
    formaDeFalar: `Vocabulário simples com pretensão grandiosa mal encaixada. Usa palavras grandes erradas. Declara tudo em terceira pessoa: "O Grande Rei Blunkin considera..." Gargalhadas em momentos inadequados. Se alguém o elogia, fica imediatamente mais cooperativo. Fica MUITO ofendido se chamado de pequeno.`,
  },

  npc_duque_oswald_thool: {
    id: 'npc_duque_oswald_thool',
    nome: 'Oswald (como Thool)',
    sprite: 'sprites/npc_duque_oswald_thool.png',
    categoria: 'hostil',
    descFisica: `Como Thool: homem transformado em criatura ogre-like de ~2,5m, postura curvada. Pele acinzentada e enrugada, músculos grosseiros. Expressão confusa e animalesca, boca levemente aberta. Armadura de couro pesado mal ajustada para seu tamanho novo. Dedo indicador do pé visivelmente maior que o dedão — traço que permanece da forma humana. Marca de nascença em forma de baga-de-espinheiro no ombro (quase apagada). Como humano restaurado: jovem nobre de ~25 anos, cabelo loiro, feições delicadas e nobres, roupas de guerreiro rasgadas.`,
    personalidade: `Como Thool: bruto leal ao Rei Chutter, sem memória do passado. Instintos animais, defende o Gloamreach. Como humano restaurado: confuso, envergonhado, reluta em admitir o que fez como Thool. Eventualmente grato e honrado. Abdicará seu ducado para expiar sua vergonha.`,
    conhecimentos: `Como Thool: sabe sobre o portal no Gloamreach que leva à Torre de Limm. Como humano restaurado: pode confirmar a identidade e localização do Rei Chutter, detalhes do plano de conquista.`,
    formaDeFalar: `Como Thool: grunhidos, frases de duas palavras, confusão com conceitos abstratos. "Você... intruso." "Rei Chutter... deu ordens." Como humano restaurado: fala culta e refinada mas voz trêmula de choque e vergonha. Longa pausa antes de cada resposta enquanto processa memórias.`,
  },

  npc_rei_chutter: {
    id: 'npc_rei_chutter',
    nome: 'Rei Chutter',
    sprite: 'sprites/npc_rei_chutter.png',
    categoria: 'vilao',
    descFisica: `Criatura monstruosa e colossal de ~3m, pele cinza-pedra densa e enrugada como rocha viva. Musculatura absurda — braços como troncos, tórax que parece uma muralha. Espinhos ósseos emergindo da cabeça e ombros. Tatuagem/marca violeta no peito — símbolo do pacto com as Pedras de Limm. Equipamento de couro pesado grosseiro adaptado para seu tamanho brutal. Braços cruzados com arrogância de quem nunca precisou se defender. Expressão que combina inteligência traiçoeira com brutalidade absoluta. Cada passo faz o chão tremer.`,
    personalidade: `Troll-feiticeiro poderoso com planos de conquista da região norte de Megalos. Inteligência cruel disfarçada por aparência puramente brutal — subestimá-lo é erro fatal. Ama magia de areia acima de tudo. Paga dívidas, cumpre barganha. Odeia traidores. Alimentou-se dos ossos do mago Limm para absorver seu conhecimento.`,
    conhecimentos: `Controla o Gloamreach e a Torre de Limm através de portal. Tem planos de conquistar Mhoried. Suspeita da traição de Choir. Transformou seus aprendizes falhos em Thools. Usa os kobolds como exército.`,
    formaDeFalar: `Voz grave como trovão subterrâneo. Monólogos dramáticos e teatrais, usa metáforas de poder e grandeza, ri entre ameaças, chama todos de "vermes" ou "mosquitos". Quando irritado, fala mais devagar — não mais rápido. Exemplo: "Bem-vindos ao domínio de Chutter. Esperem enquanto decido... se vocês morrem... agora... ou depois de serem úteis."`,
  },

  npc_aelar_eisenli: {
    id: 'npc_aelar_eisenli',
    nome: 'Aelar Eisenli',
    sprite: 'sprites/npc_aelar_eisenli.png',
    categoria: 'neutro',
    descFisica: `Elfa de aparência ~35 anos humanos (muito mais velha), constituição atlética e elegante. Cabelo preto-azulado preso numa trança firme de combate. Olhos âmbar com expressão avaliadora permanente. Pele bronzeada com tons de cinza (élfico). Veste armadura de couro reforçado com capa de viagem verde-escura. Carrega arco longo nas costas e espada fina no cinto. Sempre alerta, postura de caçadora.`,
    personalidade: `Caçadora de recompensas élfica renomada. Profissional ao extremo, cumpre a lei mesmo quando discorda dela. Honesta e direta. Tem noção de dever para com o mundo civilizado. Pode ser aliada eficaz mas não é uma amiga — tem objetivos próprios. Atualmente caça Fariborz o Piromante.`,
    conhecimentos: `Conhece os Blackwoods bem por experiência de caça. Sabe da recompensa de $500 por Fariborz vivo. Conhece os perigos dos elfos negros. Pode dar avisos úteis sobre os Blackwoods em troca de informações sobre Fariborz.`,
    formaDeFalar: `Direta, profissional, sem floreios. Avalia tudo em termos de custo-benefício. Respostas precisas. Raramente faz perguntas desnecessárias. Tom neutro mesmo em situações extremas. Quando decide confiar em alguém, é completamente franca.`,
  },

  npc_jariella: {
    id: 'npc_jariella',
    nome: 'Jariella, a Elfa do Mar',
    sprite: 'sprites/npc_jariella.png',
    categoria: 'neutro',
    descFisica: `Elfa do mar de cabelo loiro-prateado longo e solto. Pele com tom levemente azulado, típico das elfas do mar. Veste armadura negra intrincada com gravações de ondas e padrões marinhos. Usa uma tiara/viseira metálica ornamentada. Carrega arco longo nas costas e espada longa na mão — movimentos fluidos como água. Quando vista em visões, parece simultaneamente presente e distante, como névoa sobre o oceano.`,
    personalidade: `Guerreira lendária das elfas do mar que caçou monstros nos Blackwoods há dez anos. Orgulhosa, destemida, com um código de honra rígido. Veio aos Blackwoods perseguir ameaças mágicas e acabou encontrando a Manticora Albina — seu maior erro. Seus ossos descansam num local secreto, mas seu espírito inquieto ainda permeia o bosque, especialmente perto do Poço dos Chorões.`,
    conhecimentos: `Conhecia os segredos dos Blackwoods há dez anos. Sabia da existência do Vulkrundshard. Sua espada encantada "Selvimar" (Puissance+1, Accuracy+1, com pedras de Breathe Water e Resist Lightning) ficou com seus restos. O Príncipe Kalos a conhecia e a desrespeitava. Os elfos sombrios usaram seu desaparecimento como oportunidade.`,
    formaDeFalar: `(Só aparece em visões do Poço dos Chorões ou como presença espiritual). Fala em fragmentos, como memórias: "O bosque me consumiu... a besta de dentes podres... minha espada ainda canta nas águas..." Pode revelar a localização de seu túmulo aos que beberem da água do poço.`,
  },

  npc_drizzle: {
    id: 'npc_drizzle',
    nome: 'Drizzle',
    sprite: 'sprites/npc_drizzle.png',
    categoria: 'neutro',
    descFisica: `Criatura réptil-esguia de estatura baixa (~1,1m). Pele esverdeada-oliva, escamosa e lustrosa. Orelhas grandes parecidas com asas de morcego, sempre em alerta. Olhos grandes e amarelos, expressão esperta e levemente sorrateira. Corpo magro mas coberto em camadas de colares, pulseiras, cordões com badulaques coloridos — pedras, contas, adornos baratos e alguns possivelmente valiosos. Veste trapos em camadas sobrepostas. Expressão de quem sabe mais do que parece e está sempre calculando uma vantagem.`,
    personalidade: `Mercador e informante de natureza oportunista. Neutro por conveniência — está sempre do lado que lhe traz mais lucro ou segurança. Inteligente e perspicaz, coleta informações como outros coletam moedas. Sobreviveu nos Blackwoods por saber quando falar e quando calar.`,
    conhecimentos: `Conhece rumores, rotas e segredos de várias facções nos Blackwoods. Sabe de movimentações de elfos sombrios, kobolds e criaturas. Tem bugigangas e itens incomuns para trocar. Suas informações são geralmente confiáveis — sua reputação depende disso.`,
    formaDeFalar: `Fala rápido e em voz baixa, como se cada palavra fosse uma mercadoria. Mistura adulação com cálculo. Usa "amigo" com todos mas não confia em ninguém. Sempre introduz uma oferta ou troca no meio da conversa. "Drizzle sabe coisas... mas coisas têm preço, sim?"`,
  },

  npc_choir_necromante: {
    id: 'npc_choir_necromante',
    nome: 'Choir, o Necromante',
    sprite: 'sprites/npc_choir_necromante.png',
    categoria: 'vilao',
    descFisica: `Homem de meia-idade de aparência cadavérica, pele branco-acinzentada como a de seus mortos. Olhos profundamente encovados com íris amarelas. Cabelo escuro e fino preso para trás, começo de calvície. Usa robes negros com marcas rituais pintadas em branco no tecido. Mãos longas e pálidas sempre fazendo gestos de condução mágica. Expressão de desprezo permanente para com tudo ao redor.`,
    personalidade: `Necromante ambicioso que trabalhou para o Rei Chutter mas os traiu quando seus experimentos falharam. Agora espia os eventos dos Blackwoods à distância, esperando que Chutter caia para então tomar a Torre de Limm. Vê tudo como recursos — vivos ou mortos. Nunca aparece diretamente mas sua influência está em todo lugar: escarecrows, mortos-vivos, alquimistas infiltrados.`,
    conhecimentos: `Sabe de praticamente tudo que acontece nos Blackwoods através de seus espionas. Tem planos para uma "Mother Clutch" — criatura de braços que vai limpar os druidas. Quer a Torre de Limm para si.`,
    formaDeFalar: `(Nunca aparece diretamente — só através de mensagens via mortos-vivos ou alquimistas). Mensagens são sempre frias e precisas, sem palavras desnecessárias. Assina com seu sigilo.`,
  },
};

// ─────────────────────────────────────────────────────────────────
//  CENAS
//  ordem em CENAS_ORDEM define a progressão narrativa
// ─────────────────────────────────────────────────────────────────
export const CENAS = {

  prologo: {
    id: 'prologo',
    titulo: 'Prólogo — O Mundo de Ygdis',
    subtitulo: 'Megalos · Reino de Mhoried',
    textoIntro: `No mundo de Ygdis, o Reino de Mhoried ergue-se como bastião de ordem entre terras cada vez mais sombrias. A Duquesa Catherine Laskaris governa com mão firme — e coração preocupado com o irmão desaparecido. Vocês são aventureiros chegando à Feira da Colheita de St. Phanourios. O que encontrarão aqui mudará o destino de todo o reino.`,
    imgExterior: 'locations/mhoried_castelo_ext.png',
    imgInterior: 'locations/mhoried_market_int.png',
    npcsPresentes: [],
    temBatalha: false,
    ordemNarrativa: 0,
    introSlides: [
      {
        imagem: 'locations/mhoried_castelo_ext.png',
        texto: `No mundo de Ygdis, onde a magia antiga ainda respira nas pedras das montanhas e nas raízes das florestas milenares, o Reino de Mhoried ergue-se como bastião de ordem entre terras cada vez mais sombrias. A Duquesa Catherine Laskaris governa com mão firme e coração preocupado: seu irmão Oswald desapareceu nas profundezas dos Blackwoods após buscar o mago Dendybar — e o que voltou não era mais o homem que todos conheciam.`,
      },
      {
        imagem: 'locations/mhoried_castelo_ext.png',
        texto: `Vocês são aventureiros que chegaram à Feira da Colheita de St. Phanourios, atraídos por promessas de trabalho, glória ou simplesmente pelo acaso. Algo importante está prestes a acontecer nesta cidade — e os ventos do destino já escolheram os seus personagens para testemunhá-lo.`,
      },
      {
        imagem: 'locations/mhoried_market_ext.png',
        texto: `A Feira da Colheita transborda de vida e cor. Vendedores proclamam especiarias e tecidos, crianças perseguem umas às outras entre as barracas, e o aroma de pão quente mistura-se ao de cerveja e incenso. Bardos tocam em cada esquina, malabaristas arrancam aplausos da multidão. Por um momento, é difícil imaginar que algo de errado pudesse rondar estas terras tão festivas.`,
        revealFirst: true,
      },
      {
        imagem: 'locations/mhoried_market_ext2.png',
        texto: `No salão principal, a Duquesa Catherine aguarda aventureiros de confiança — seus olhos percorrem cada rosto com urgência disfarçada de cortesia. Antes que qualquer palavra seja dita, um grito perfura o burburinho lá fora. Depois outro. Cabeças se viram: os espantalhos decorativos das barracas estão... se movendo.`,
        ganchoBatalha: true,
        revealFirst: true,
      },
    ],
  },

  mhoried_market: {
    id: 'mhoried_market',
    titulo: 'A Feira de St. Phanourios',
    subtitulo: 'Cidade de Mhoried — Nordeste de Megalos',
    textoIntro: `A cidade de Mhoried pulsa com vida na véspera do dia de St. Phanourios. As ruas do mercado transbordam de cores, aromas e o som de cantores de rua. Mas sob a festa, há um nervosismo sutil — mercadores desapareceram nos bosques ao norte, e os soldados da Duquesa patrulham com uma frequência incomum. É neste cenário que vocês se encontram: aventureiros com reputação suficiente para que alguém importante queira vos contratar.`,
    imgExterior: 'locations/mhoried_market_ext.png',
    imgInterior: 'locations/mhoried_market_int.png',
    npcsPresentes: ['npc_catherine_laskaris', 'npc_gregoras_pellos', 'npc_hobbleboot_sam', 'npc_finn_willowheel'],
    temBatalha: true,
    descBatalha: 'Espantalhos animados por necromancia irrompem na feira durante a festa',
    inimigos: 'Espantalhos de Choir',
    ordemNarrativa: 1,
    introSlides: [
      {
        imagem: 'locations/mhoried_castelo_ext.png',
        texto: `Gregoras conduz o grupo pelas ruas de Mhoried em passo apressado, desviando das barracas reviradas e dos guardas que ainda isolam a área do ataque. Ao chegar ao castelo ele troca um aceno com o sentinela — sem espera, sem anúncio formal. "A Duquesa pediu para não haver cerimônias," ele diz enquanto abre a porta lateral.`,
      },
      {
        imagem: 'locations/mhoried_market_int.png',
        texto: `A Duquesa Catherine Laskaris os aguarda no salão principal, de pé junto à janela, os olhos na praça ainda agitada lá embaixo. Ela se vira quando vocês entram. "Obrigada por virem," ela diz, voz firme mas carregando algo que não é só preocupação política. Gregoras fecha a porta suavemente. A conversa pode começar.`,
        revealFirst: true,
      },
    ],
  },

  blackwoods_entrada: {
    id: 'blackwoods_entrada',
    titulo: 'Entrada do Grimhollow',
    subtitulo: 'Os Blackwoods — Margem Norte da Floresta',
    textoIntro: `A estrada de terra termina aqui. Diante de vocês, os Grimhollow Blackwoods se erguem como uma parede viva — árvores antigas cujas copas entrelaçadas bloqueiam a maior parte da luz. Na beira da floresta, uma forca velha ainda balança com uma corda cortada, e um aviso fixado no poste meia apagado adverte sobre foragidos. O ar dentro da linha de árvores é mais frio, mais parado. Algo espreita nos galhos acima.`,
    imgExterior: 'locations/blackwoods_entrada_ext.png',
    imgInterior: 'locations/blackwoods_entrada_int.png',
    npcsPresentes: ['npc_aelar_eisenli'],
    temBatalha: false,
    ordemNarrativa: 2,
  },

  bosque_afogado: {
    id: 'bosque_afogado',
    titulo: 'O Bosque Afogado',
    subtitulo: 'Blackwoods — Setor Nordeste',
    textoIntro: `Água parada cobre o chão entre as árvores mais antigas da floresta. Raízes submersas criam caminhos sinuosos sobre a superfície escura e quieta. Antigas ruínas élficas emergem em pedaços das águas como ossos de um gigante esquecido. Há uma presença aqui — não hostil ainda, mas atenta. As águas sabem que vocês chegaram.`,
    imgExterior: 'locations/bosque_afogado_ext.png',
    imgInterior: 'locations/bosque_afogado_int.png',
    npcsPresentes: ['npc_ruzalka', 'npc_valmorien', 'npc_ysoria'],
    temBatalha: true,
    descBatalha: 'Patrulha de elfos negros bloqueia a passagem pelo bosque',
    inimigos: 'Elfos Negros',
    ordemNarrativa: 3,
  },

  campo_aranhas: {
    id: 'campo_aranhas',
    titulo: 'O Campo das Aranhas',
    subtitulo: 'Blackwoods — Zona Central',
    textoIntro: `Teias enormes conectam as árvores neste trecho da floresta como velhas janelas cobertas de gelo. Casulos brancos de tamanho humano pendem dos galhos mais altos, alguns se movendo sutilmente. O silêncio aqui é diferente — não é a quietude da natureza, mas o silêncio de uma emboscada que ainda não foi revelada. Sob os pés, o solo está coberto de exoesqueletos de insetos.`,
    imgExterior: 'locations/campo_aranhas_ext.png',
    imgInterior: 'locations/campo_aranhas_int.png',
    npcsPresentes: [],
    temBatalha: true,
    descBatalha: 'Aranhas gigantes atacam de múltiplas direções pelas teias',
    inimigos: 'Aranhas Gigantes',
    ordemNarrativa: 4,
  },

  acampamento_elfico: {
    id: 'acampamento_elfico',
    titulo: 'Acampamento dos Vhuureth',
    subtitulo: 'Blackwoods — Setor Norte',
    textoIntro: `Luzes mágicas azul-prateadas flutuam entre as árvores como vagalumes silenciosos, revelando tendas de seda negra montadas com precisão geométrica. Sentinelas élfico-negras observam com olhos vermelhos de pontos elevados. O acampamento emana uma beleza estranha e ameaçadora — como uma obra de arte feita de lâminas. Uma bandeira com o símbolo dos Vhuureth ondula ao vento frio que parece somente existir aqui.`,
    imgExterior: 'locations/acampamento_elfico_ext.png',
    imgInterior: 'locations/acampamento_elfico_int.png',
    npcsPresentes: ['npc_principe_kalos', 'npc_valmorien', 'npc_ysoria', 'npc_aelar_eisenli'],
    temBatalha: true,
    descBatalha: 'Negociação falha leva a combate com a guarda do Príncipe Kalos',
    inimigos: 'Guerreiros Vhuureth',
    ordemNarrativa: 5,
  },

  dominio_wulfram: {
    id: 'dominio_wulfram',
    titulo: 'O Domínio do Chifrado',
    subtitulo: 'Blackwoods — Coração da Floresta',
    textoIntro: `Pedras erguidas em círculo marcam a fronteira de um território diferente — mais antigo, mais selvagem. Chifres e ossos pendurados em galhos baixos criam um móbile funesto que toca em tons ocos com o vento. No centro, uma figura imóvel de proporções absurdas observa vocês sem se mover. Os chifres que crescem de sua cabeça não são um elmo — são parte dele.`,
    imgExterior: 'locations/dominio_wulfram_ext.png',
    imgInterior: 'locations/dominio_wulfram_int.png',
    npcsPresentes: ['npc_wulfram_chifrado'],
    temBatalha: false,
    ordemNarrativa: 6,
  },

  ruinas_piromante: {
    id: 'ruinas_piromante',
    titulo: 'As Ruínas Chamuscadas',
    subtitulo: 'Blackwoods — Setor Sudoeste',
    textoIntro: `Pedras enegrecidas de uma estrutura antiga emergem da vegetação, cheirando a enxofre e cinzas velhas. Marcas de queimaduras recentes cobrem as pedras em padrões irregulares — alguém esteve aqui praticando feitiços de fogo. Faíscas ocasionais saem de buracos entre as pedras, e fumaça branca paira no ar mesmo sem fonte visível. Este lugar foi a residência temporária de alguém que o abandonou às pressas.`,
    imgExterior: 'locations/ruinas_piromante_ext.png',
    imgInterior: 'locations/ruinas_piromante_int.png',
    npcsPresentes: ['npc_fariborz_piromante'],
    temBatalha: false,
    ordemNarrativa: 7,
  },

  choupana_mutter: {
    id: 'choupana_mutter',
    titulo: 'A Choupana de Mutter',
    subtitulo: 'Blackwoods — Profundezas do Sul',
    textoIntro: `Uma choupana torta se encosta em uma árvore que não poderia ser mais velha. Crânios de animais pequenos decoram a cerca de galhos entrelaçados. Ervas de todas as formas penduradas na fachada. De dentro vem um borbulhar constante e um cheiro que oscila entre medicina e algo que não se deve comer. A porta está entreaberta. Uma voz velha e rouca canta algo sem melodia reconhecível lá dentro.`,
    imgExterior: 'locations/choupana_mutter_ext.png',
    imgInterior: 'locations/choupana_mutter_int.png',
    npcsPresentes: ['npc_mutter_grimmhaar'],
    temBatalha: false,
    ordemNarrativa: 8,
  },

  cnoc_na_rithe: {
    id: 'cnoc_na_rithe',
    titulo: 'Cnoc na Ríthe',
    subtitulo: 'A Aldeia Druídica',
    textoIntro: `Uma clareira onde a floresta parece respirar mais fundo. Casas de madeira viva — construídas entre as árvores sem cortá-las — formam um círculo em torno de uma fonte coberta de musgos verdes e flores silvestres. Crianças humanas e elfas brincam entre as raízes. Uma jovem de cabelo ruivo prepara ervas perto de uma pedra de trabalho, olhos atentos para a chegada de estranhos.`,
    imgExterior: 'locations/cnoc_na_rithe_ext.png',
    imgInterior: 'locations/cnoc_na_rithe_int.png',
    npcsPresentes: ['npc_mac_ronan', 'npc_muirenn'],
    temBatalha: false,
    ordemNarrativa: 9,
  },

  kobold_town: {
    id: 'kobold_town',
    titulo: 'A Cidade Kobold',
    subtitulo: 'Blackwoods — Território Kobold',
    textoIntro: `Um labirinto caótico de estruturas improvisadas se estende por entre as árvores — troncos ocos transformados em torres de vigia, redes de cordas ligando plataformas elevadas, centenas de pequenas fogueiras acesas. O barulho é ensurdecedor: gritos, gargalhadas e o que só pode ser descrito como musica ruim. No centro, uma construção maior que as outras ostenta um estandarte com uma caveira esmagando uma mão. Centenas de olhos amarelos e brilhantes observam vocês da escuridão.`,
    imgExterior: 'locations/kobold_town_ext.png',
    imgInterior: 'locations/kobold_town_int.png',
    npcsPresentes: ['npc_blunkin_esmaga_cranios', 'npc_dvalinn_anao'],
    temBatalha: true,
    descBatalha: 'Negociação com Blunkin fracassa — os kobolds atacam ou precisam ser combatidos para libertar os prisioneiros',
    inimigos: 'Kobolds de Blunkin',
    ordemNarrativa: 10,
  },

  gloamreach: {
    id: 'gloamreach',
    titulo: 'O Gloamreach',
    subtitulo: 'Covil dos Thools — Templo Élfico Profanado',
    textoIntro: `Um abismo irregular rasga o chão da floresta como uma garra de gigante. Degraus antigos e desgastados descem em espiral por cem metros até uma boca de caverna ladeada por pilares de pedra cobertos de runas que nenhum elfo vivo reconhece. A enorme porta de pedra que um dia vedou este lugar foi esmagada para dentro. De lá de baixo vem luz fraca de lanternas e o som de vozes enormes falando em vocabulário limitado sobre peixes e cerveja.`,
    imgExterior: 'locations/gloamreach_ext.png',
    imgInterior: 'locations/gloamreach_int.png',
    npcsPresentes: ['npc_duque_oswald_thool'],
    temBatalha: true,
    descBatalha: 'Os Thools e alquimistas de Choir defendem o Gloamreach',
    inimigos: 'Thools e Alquimistas de Choir',
    ordemNarrativa: 11,
  },

  torre_limm: {
    id: 'torre_limm',
    titulo: 'A Torre das Estrelas de Limm',
    subtitulo: 'Pico das Montanhas de Granito',
    textoIntro: `A torre se ergue do pico da montanha como um dente negro contra o céu sem estrelas. A sombra que ela projeta aponta na direção errada para o sol. Grandes portas de carvalho enegrecido estão entrebertas como uma boca esperando. Lá dentro, alguém — ou algo — se move com passos que fazem o piso de pedra tremer levemente. Do alto, uma voz grave que parece duas vozes ao mesmo tempo chama: "Entrem, vermes. Chutter quer saber o que trouxe vocês até o fim do mundo."`,
    imgExterior: 'locations/torre_limm_ext.png',
    imgInterior: 'locations/torre_limm_int.png',
    npcsPresentes: ['npc_rei_chutter'],
    temBatalha: true,
    descBatalha: 'Confronto final com o Rei Chutter e seus Golems de Pergaminho no topo da torre',
    inimigos: 'Rei Chutter + Golems de Pergaminho',
    ordemNarrativa: 12,
  },
};

// Ordem narrativa das cenas
export const CENAS_ORDEM = Object.values(CENAS)
  .sort((a, b) => a.ordemNarrativa - b.ordemNarrativa)
  .map(c => c.id);
