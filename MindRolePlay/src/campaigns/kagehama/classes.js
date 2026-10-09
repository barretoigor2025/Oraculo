import roninMale from '../../../assets/campaigns/kagehama/classes/ronin/ronin_masculino.png';
import roninFemale from '../../../assets/campaigns/kagehama/classes/ronin/ronin_feminino.png';
import samuraiMale from '../../../assets/campaigns/kagehama/classes/samurai/samurai_masculino.png';
import samuraiFemale from '../../../assets/campaigns/kagehama/classes/samurai/samurai_feminino.png';
import kyudokaMale from '../../../assets/campaigns/kagehama/classes/kyudoka/kyudoka_masculino.png';
import kyudokaFemale from '../../../assets/campaigns/kagehama/classes/kyudoka/kyudoka_feminino.png';
import shinobiMale from '../../../assets/campaigns/kagehama/classes/shinobi/shinobi_masculino.png';
import shinobiFemale from '../../../assets/campaigns/kagehama/classes/shinobi/shinobi_feminino.png';
import onmyojiMale from '../../../assets/campaigns/kagehama/classes/onmyoji/onmyoji_masculino.png';
import onmyojiFemale from '../../../assets/campaigns/kagehama/classes/onmyoji/onmyoji_feminino.png';
import mikoMale from '../../../assets/campaigns/kagehama/classes/miko/miko_masculino.png';
import mikoFemale from '../../../assets/campaigns/kagehama/classes/miko/miko_feminino.png';

const PORTRAITS = { ronin: { male: roninMale, female: roninFemale }, samurai: { male: samuraiMale, female: samuraiFemale }, kyudoka: { male: kyudokaMale, female: kyudokaFemale }, shinobi: { male: shinobiMale, female: shinobiFemale }, onmyoji: { male: onmyojiMale, female: onmyojiFemale }, miko: { male: mikoMale, female: mikoFemale } };
export const KAGEHAMA_CLASSES = [
    {
      "id": "ronin",
      "name": "Rōnin de vanguarda",
      "archetype": "Guerreiro errante",
      "icon": "⚔",
      "portrait": "assets/campaigns/kagehama/classes/ronin/ronin_masculino.png",
      "description": "Guerreiro errante de linha de frente: segura passagem, aguenta pancada e decide quando a lâmina precisa sair.",
      "attributes": {
        "ST": 14,
        "DX": 12,
        "IQ": 10,
        "HT": 13
      },
      "skills": [
        {
          "name": "Espada de duas mãos",
          "attribute": "DX",
          "level": 13,
          "description": "Ataque forte, aparo amplo e controle de corredor."
        },
        {
          "name": "Briga",
          "attribute": "DX",
          "level": 12,
          "description": "Empurrar, agarrar, derrubar e lutar quando a espada não cabe."
        },
        {
          "name": "Intimidação",
          "attribute": "Will",
          "level": 12,
          "description": "Quebrar hesitação inimiga sem transformar tudo em duelo."
        },
        {
          "name": "Sobrevivência",
          "attribute": "HT",
          "level": 12,
          "description": "Marcha, abrigo, frio, fome e estrada ruim."
        }
      ],
      "fixedAbilities": [
        "Postura de guarda: uma vez por cena, pode tomar a frente de um aliado próximo e receber o risco principal da ação."
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
      "name": "Onmyōji elemental",
      "archetype": "Mago de ataque",
      "icon": "☯",
      "portrait": "assets/campaigns/kagehama/classes/onmyoji/onmyoji_masculino.png",
      "description": "Mago DPS de inspiração onmyōdō: talismãs, elementos, shikigami e ataques espirituais de alcance curto ou médio.",
      "attributes": {
        "ST": 9,
        "DX": 11,
        "IQ": 14,
        "HT": 10
      },
      "skills": [
        {
          "name": "Ataque inato: projétil",
          "attribute": "DX",
          "level": 14,
          "description": "Acertar rajadas, selos lançados e descargas elementais."
        },
        {
          "name": "Ritual Magic: Onmyōdō",
          "attribute": "IQ",
          "level": 14,
          "description": "Preparar ofuda, círculos, invocações e efeitos ritualizados."
        },
        {
          "name": "Taumatologia",
          "attribute": "IQ",
          "level": 13,
          "description": "Entender limites, custos e natureza de magia hostil."
        },
        {
          "name": "Ocultismo",
          "attribute": "IQ",
          "level": 13,
          "description": "Reconhecer espíritos, maldições, presságios e tabus."
        }
      ],
      "fixedAbilities": [
        "Selo elemental: uma vez por cena, dispara um ataque mágico preparado; em falha, o efeito sai instável e cria custo, ruído ou exaustão."
      ],
      "startingLevel": 1,
      "artBrief": "Retrato vertical de corpo inteiro, onmyōji de fantasia histórica em vestes brancas e azul noturno, ofuda e estojo de pincéis, uma pequena luz espiritual dourada paira na mão, santuário enevoado, pintura editorial realista, magia sutil, sem texto.",
      "genderOptions": [
        "male",
        "female"
      ],
      "roleplayProfile": {
        "voice": "Vocabulário de sinais e correspondências; explica incerteza sem fingir certeza.",
        "want": "Provar que magia pode vencer sem virar massacre.",
        "fear": "Perder o controle do shikigami ou atingir inocentes no fogo cruzado.",
        "narratorGuidance": "Magia usa alvo 3d6 como qualquer perícia: alcance, cobertura, fadiga, preparo e consequência importam."
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
      "description": "Curandeira e guia de montanha: suporte, medicina, proteção espiritual e sobrevivência em rota longa.",
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
          "name": "Medicina",
          "attribute": "IQ",
          "level": 12,
          "description": "Diagnóstico, recuperação e tratamento fora do combate."
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
  ];
for (const item of KAGEHAMA_CLASSES) { item.portraits = PORTRAITS[item.id]; item.portrait = item.portraits?.male || ''; item.assetPaths = { ...(item.portraits || {}) }; item.assetPath = item.portrait; }
