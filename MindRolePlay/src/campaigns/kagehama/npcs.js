import npcPortrait0 from '../../../assets/campaigns/kagehama/npcs/kagehama-npc-0.png';
import npcPortrait1 from '../../../assets/campaigns/kagehama/npcs/kagehama-npc-1.png';
import npcPortrait2 from '../../../assets/campaigns/kagehama/npcs/kagehama-npc-2.png';
import npcPortrait3 from '../../../assets/campaigns/kagehama/npcs/kagehama-npc-3.png';
import npcPortrait4 from '../../../assets/campaigns/kagehama/npcs/kagehama-npc-4.png';
import npcPortrait5 from '../../../assets/campaigns/kagehama/npcs/kagehama-npc-5.png';
import npcPortrait6 from '../../../assets/campaigns/kagehama/npcs/kagehama-npc-6.png';
import npcPortrait7 from '../../../assets/campaigns/kagehama/npcs/kagehama-npc-7.png';
import npcPortrait8 from '../../../assets/campaigns/kagehama/npcs/kagehama-npc-8.png';
import npcPortrait9 from '../../../assets/campaigns/kagehama/npcs/kagehama-npc-9.png';
import npcPortrait10 from '../../../assets/campaigns/kagehama/npcs/kagehama-npc-10.png';
const NPC_PORTRAITS = { 'kagehama-npc-0': npcPortrait0, 'kagehama-npc-1': npcPortrait1, 'kagehama-npc-2': npcPortrait2, 'kagehama-npc-3': npcPortrait3, 'kagehama-npc-4': npcPortrait4, 'kagehama-npc-5': npcPortrait5, 'kagehama-npc-6': npcPortrait6, 'kagehama-npc-7': npcPortrait7, 'kagehama-npc-8': npcPortrait8, 'kagehama-npc-9': npcPortrait9, 'kagehama-npc-10': npcPortrait10 };
export const KAGEHAMA_NPCS = [
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
  ];
for (const npc of KAGEHAMA_NPCS) npc.portrait = NPC_PORTRAITS[npc.id] || '';
