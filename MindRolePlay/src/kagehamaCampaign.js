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


import { KAGEHAMA_STORY } from './campaigns/kagehama/story.js';
import { KAGEHAMA_CLASSES } from './campaigns/kagehama/classes.js';
import { KAGEHAMA_NPCS } from './campaigns/kagehama/npcs.js';
import { KAGEHAMA_SCENES } from './campaigns/kagehama/scenes.js';
import { KAGEHAMA_BESTIARY } from './campaigns/kagehama/bestiary.js';
import { KAGEHAMA_RELICS } from './campaigns/kagehama/relics.js';

export const KAGEHAMA_CAMPAIGN = {
  "id": "demo-kagehama",
  "schemaVersion": 12,
  "title": "As Sete Lanternas de Kagehama",
  "genre": "Medieval samurai · fantasia histórica",
  "status": "ready-for-play",
  "source": "Campanha original criada para o Mind RolePlay",
  "premise": "Um tratado de paz é roubado, um mensageiro desaparece e três reinos se acusam. Intriga, espionagem e escolhas morais decidirão se Akitsuru entra em guerra.",
  "story": KAGEHAMA_STORY,
  "classes": KAGEHAMA_CLASSES,
  "characters": [],
  "npcs": KAGEHAMA_NPCS,
  "scenes": KAGEHAMA_SCENES,
  "relics": KAGEHAMA_RELICS,
  "bestiary": KAGEHAMA_BESTIARY,
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
      "title": "Retrato masculino · Rōnin de vanguarda",
      "description": "Arte de personagem para jogo narrativo, corpo inteiro, recorte transparente sem fundo, silhueta legível. Personagem homem: Rōnin de vanguarda de fantasia histórica, armadura leve remendada, haori curto gasto, nodachi embainhada, postura de guarda inclinada e olhar cansado. Silhueta larga, cicatriz pequena, cordão de viagem e sandálias enlameadas. Mangá de aventura original em tinta preta sobre papel branco, contorno expressivo e limpo, poucas retículas, sombras em hachura, alto contraste, somente preto e branco, sem cinza colorido, sem texto, sem assinatura, sem logotipo, sem moldura.",
      "assetPath": "assets/campaigns/kagehama/classes/ronin/ronin_masculino.png",
      "kind": "character",
      "category": "Classes",
      "status": "brief-ready",
      "done": false
    },
    {
      "id": "art-ronin-female",
      "title": "Retrato feminino · Rōnin de vanguarda",
      "description": "Arte de personagem para jogo narrativo, corpo inteiro, recorte transparente sem fundo, silhueta legível. Personagem mulher: Rōnin de vanguarda de fantasia histórica, armadura leve remendada, haori curto gasto, nodachi embainhada, postura de guarda inclinada e olhar cansado. Silhueta larga, cicatriz pequena, cordão de viagem e sandálias enlameadas. Mangá de aventura original em tinta preta sobre papel branco, contorno expressivo e limpo, poucas retículas, sombras em hachura, alto contraste, somente preto e branco, sem cinza colorido, sem texto, sem assinatura, sem logotipo, sem moldura.",
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
      "title": "Retrato masculino · Onmyōji elemental",
      "description": "Arte de personagem para jogo narrativo, corpo inteiro, recorte transparente sem fundo, silhueta legível. Personagem homem: Onmyōji com vestes em camadas, chapéu eboshi simples, estojo de pincéis, pequenos ofuda sem caracteres legíveis e cordão ritual. Uma das mãos segura sino ou compasso; aura sugerida por retículas, sem efeitos coloridos. Mangá de aventura original em tinta preta sobre papel branco, contorno expressivo e limpo, poucas retículas, sombras em hachura, alto contraste, somente preto e branco, sem cinza colorido, sem texto, sem assinatura, sem logotipo, sem moldura.",
      "assetPath": "assets/campaigns/kagehama/classes/onmyoji/onmyoji_masculino.png",
      "kind": "character",
      "category": "Classes",
      "status": "brief-ready",
      "done": false
    },
    {
      "id": "art-onmyoji-female",
      "title": "Retrato feminino · Onmyōji elemental",
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
      "assetPath": "assets/campaigns/kagehama/npcs/kagehama-npc-0.png",
      "kind": "character",
      "category": "NPCs",
      "status": "published",
      "done": true
    },
    {
      "id": "art-kagehama-npc-1",
      "title": "Retrato · Ren Kuroda",
      "description": "Regente em roupa formal escura, bengala metálica, mãos impecáveis, postura cordial que ocupa espaço; fundo de painel shoji. Arte de mangá original em preto e branco, contorno de tinta, retículas discretas, sombras em hachura, fundo transparente, retrato vertical, sem letras ou logotipos.",
      "assetPath": "assets/campaigns/kagehama/npcs/kagehama-npc-1.png",
      "kind": "character",
      "category": "NPCs",
      "status": "published",
      "done": true
    },
    {
      "id": "art-kagehama-npc-2",
      "title": "Retrato · Tomoe Arashi",
      "description": "Escriba viajante de aparência discreta, rolos de papel e tinta nos dedos, olhar atento para a saída; sem roupa nobre ostensiva. Arte de mangá original em preto e branco, contorno de tinta, retículas discretas, sombras em hachura, fundo transparente, retrato vertical, sem letras ou logotipos.",
      "assetPath": "assets/campaigns/kagehama/npcs/kagehama-npc-2.png",
      "kind": "character",
      "category": "NPCs",
      "status": "published",
      "done": true
    },
    {
      "id": "art-kagehama-npc-3",
      "title": "Retrato · Jiro “Três Chuvas”",
      "description": "Mensageiro ferido sob capa de palha, sino escondido na gola e marcas de água; retrato vertical austero. Arte de mangá original em preto e branco, contorno de tinta, retículas discretas, sombras em hachura, fundo transparente, retrato vertical, sem letras ou logotipos.",
      "assetPath": "assets/campaigns/kagehama/npcs/kagehama-npc-3.png",
      "kind": "character",
      "category": "NPCs",
      "status": "published",
      "done": true
    },
    {
      "id": "art-kagehama-npc-4",
      "title": "Retrato · Sayo",
      "description": "Agente de aparência comum, contas de madeira no pulso, reflexo de uma janela revelando que observa todos; traje cotidiano. Arte de mangá original em preto e branco, contorno de tinta, retículas discretas, sombras em hachura, fundo transparente, retrato vertical, sem letras ou logotipos.",
      "assetPath": "assets/campaigns/kagehama/npcs/kagehama-npc-4.png",
      "kind": "character",
      "category": "NPCs",
      "status": "published",
      "done": true
    },
    {
      "id": "art-kagehama-npc-5",
      "title": "Retrato · Monge Genzō",
      "description": "Monge idoso com bengala entalhada, chaleira e cão branco; santuário vertical entre cedros, rosto paciente. Arte de mangá original em preto e branco, contorno de tinta, retículas discretas, sombras em hachura, fundo transparente, retrato vertical, sem letras ou logotipos.",
      "assetPath": "assets/campaigns/kagehama/npcs/kagehama-npc-5.png",
      "kind": "character",
      "category": "NPCs",
      "status": "published",
      "done": true
    },
    {
      "id": "art-kagehama-npc-6",
      "title": "Retrato · Lady Chiyo Arashi",
      "description": "Líder de fronteira com armadura funcional, queimadura antiga e mapa de montanhas; figura imponente sem luxo. Arte de mangá original em preto e branco, contorno de tinta, retículas discretas, sombras em hachura, fundo transparente, retrato vertical, sem letras ou logotipos.",
      "assetPath": "assets/campaigns/kagehama/npcs/kagehama-npc-6.png",
      "kind": "character",
      "category": "NPCs",
      "status": "published",
      "done": true
    },
    {
      "id": "art-kagehama-npc-7",
      "title": "Retrato · Daichi Arashi",
      "description": "Capitão em armadura de placas simples, correia gasta no ombro, estandarte sem letras e soldados ao fundo em chuva. Arte de mangá original em preto e branco, contorno de tinta, retículas discretas, sombras em hachura, fundo transparente, retrato vertical, sem letras ou logotipos.",
      "assetPath": "assets/campaigns/kagehama/npcs/kagehama-npc-7.png",
      "kind": "character",
      "category": "NPCs",
      "status": "published",
      "done": true
    },
    {
      "id": "art-kagehama-npc-8",
      "title": "Retrato · Akane",
      "description": "Curandeira em abrigo simples, mangas arregaçadas, ervas, tigelas e gaze; expressão concentrada, não idealizada. Arte de mangá original em preto e branco, contorno de tinta, retículas discretas, sombras em hachura, fundo transparente, retrato vertical, sem letras ou logotipos.",
      "assetPath": "assets/campaigns/kagehama/npcs/kagehama-npc-8.png",
      "kind": "character",
      "category": "NPCs",
      "status": "published",
      "done": true
    },
    {
      "id": "art-kagehama-npc-9",
      "title": "Retrato · Mestre Tetsuo",
      "description": "Armeiro de avental queimado, dois dedos ausentes, bancada com lâminas e peças da flecha; mãos como foco do quadro. Arte de mangá original em preto e branco, contorno de tinta, retículas discretas, sombras em hachura, fundo transparente, retrato vertical, sem letras ou logotipos.",
      "assetPath": "assets/campaigns/kagehama/npcs/kagehama-npc-9.png",
      "kind": "character",
      "category": "NPCs",
      "status": "published",
      "done": true
    },
    {
      "id": "art-kagehama-npc-10",
      "title": "Retrato · Nuvem",
      "description": "Cão branco idoso de uma orelha caída, pelo áspero, sentado perto de uma lamparina; expressão calma, sem antropomorfismo. Arte de mangá original em preto e branco, contorno de tinta, retículas discretas, sombras em hachura, fundo transparente, retrato vertical, sem letras ou logotipos.",
      "assetPath": "assets/campaigns/kagehama/npcs/kagehama-npc-10.png",
      "kind": "character",
      "category": "NPCs",
      "status": "published",
      "done": true
    },
    {
      "id": "art-kagehama-scene-0",
      "title": "Cenário vertical · Prólogo — Ponte das Sete Lanternas",
      "description": "Ilustração de cenário vertical 9:16, sem personagem principal em primeiro plano. A procissão atravessa a Ponte das Sete Lanternas antes do ataque ao mensageiro imperial. Mangá de aventura original, tinta preta sobre papel branco, contraste forte, retículas discretas e hachuras; somente preto e branco, sem texto ou balões.",
      "assetPath": "assets/campaigns/kagehama/scenes/ponte-sete-lanternas.jpg",
      "kind": "scene",
      "category": "Cenários",
      "status": "published",
      "done": true
    },
    {
      "id": "art-kagehama-scene-1",
      "title": "Cenário vertical · Capítulo 2 — Três contas queimadas",
      "description": "Ilustração de cenário vertical 9:16, sem personagens em primeiro plano, quadro estabelecedor para jogo em celular. Capítulo 2 — Três contas queimadas. Sayo leva ao santuário; refugiados somem na floresta e uma trilha cruza esconderijo de Daichi.. Mangá de aventura original, tinta preta sobre papel branco, contraste forte, retículas discretas e hachuras; somente preto e branco, sem texto ou balões.",
      "assetPath": "assets/campaigns/kagehama/scenes/santuario-aokiri.jpg",
      "kind": "scene",
      "category": "Cenários",
      "status": "published",
      "done": true
    },
    {
      "id": "art-kagehama-scene-2",
      "title": "Cenário vertical · Capítulo 3 — O homem sob a água",
      "description": "Ilustração de cenário vertical 9:16, sem personagens em primeiro plano, quadro estabelecedor para jogo em celular. Capítulo 3 — O homem sob a água. Nos Arquivos Afogados, o grupo escolhe salvar Jiro, documentos ou a própria segurança.. Mangá de aventura original, tinta preta sobre papel branco, contraste forte, retículas discretas e hachuras; somente preto e branco, sem texto ou balões.",
      "assetPath": "assets/campaigns/kagehama/scenes/arquivos-afogados.jpg",
      "kind": "scene",
      "category": "Cenários",
      "status": "published",
      "done": true
    },
    {
      "id": "art-kagehama-scene-3",
      "title": "Cenário vertical · Capítulo 4 — A caça do cervo negro",
      "description": "Ilustração de cenário vertical 9:16, sem personagens em primeiro plano, quadro estabelecedor para jogo em celular. Capítulo 4 — A caça do cervo negro. Rastro leva a posto abandonado e soldados mortos após um encontro diplomático falso.. Mangá de aventura original, tinta preta sobre papel branco, contraste forte, retículas discretas e hachuras; somente preto e branco, sem texto ou balões.",
      "assetPath": "assets/campaigns/kagehama/scenes/floresta-aokiri.jpg",
      "kind": "scene",
      "category": "Cenários",
      "status": "published",
      "done": true
    },
    {
      "id": "art-kagehama-scene-4",
      "title": "Cenário vertical · Capítulo 5 — O mensageiro que não chegou",
      "description": "Ilustração de cenário vertical 9:16, sem personagens em primeiro plano, quadro estabelecedor para jogo em celular. Capítulo 5 — O mensageiro que não chegou. A aldeia de Sumi perde água por uma ordem verdadeira entregue por portador falso.. Mangá de aventura original, tinta preta sobre papel branco, contraste forte, retículas discretas e hachuras; somente preto e branco, sem texto ou balões.",
      "assetPath": "assets/campaigns/kagehama/scenes/aldeia-sumi.jpg",
      "kind": "scene",
      "category": "Cenários",
      "status": "published",
      "done": true
    },
    {
      "id": "art-kagehama-scene-5",
      "title": "Cenário vertical · Capítulo 6 — Um duelo sem vencedor",
      "description": "Ilustração de cenário vertical 9:16, sem personagens em primeiro plano, quadro estabelecedor para jogo em celular. Capítulo 6 — Um duelo sem vencedor. Audiência no Castelo da Cinza; duelo testa contenção e respeito, não exige morte.. Mangá de aventura original, tinta preta sobre papel branco, contraste forte, retículas discretas e hachuras; somente preto e branco, sem texto ou balões.",
      "assetPath": "assets/campaigns/kagehama/scenes/castelo-cinza.jpg",
      "kind": "scene",
      "category": "Cenários",
      "status": "published",
      "done": true
    },
    {
      "id": "art-kagehama-scene-6",
      "title": "Cenário vertical · Capítulo 7 — A noite da enseada",
      "description": "Ilustração de cenário vertical 9:16, sem personagens em primeiro plano, quadro estabelecedor para jogo em celular. Capítulo 7 — A noite da enseada. Infiltração ou perseguição marítima contra um navio com armas e registros falsos.. Mangá de aventura original, tinta preta sobre papel branco, contraste forte, retículas discretas e hachuras; somente preto e branco, sem texto ou balões.",
      "assetPath": "assets/campaigns/kagehama/scenes/porto-shirotsu.jpg",
      "kind": "scene",
      "category": "Cenários",
      "status": "published",
      "done": true
    },
    {
      "id": "art-kagehama-scene-7",
      "title": "Cenário vertical · Capítulo 8 — A herdeira chamada Nao",
      "description": "Ilustração de cenário vertical 9:16, sem personagens em primeiro plano, quadro estabelecedor para jogo em celular. Capítulo 8 — A herdeira chamada Nao. Tomoe revela a matriz do selo; tornar a falsificação pública põe seus soldados em risco.. Mangá de aventura original, tinta preta sobre papel branco, contraste forte, retículas discretas e hachuras; somente preto e branco, sem texto ou balões.",
      "assetPath": "assets/campaigns/kagehama/scenes/casa-cha-lua-baixa.jpg",
      "kind": "scene",
      "category": "Cenários",
      "status": "published",
      "done": true
    },
    {
      "id": "art-kagehama-scene-8",
      "title": "Cenário vertical · Capítulo 9 — Traição no santuário",
      "description": "Ilustração de cenário vertical 9:16, sem personagens em primeiro plano, quadro estabelecedor para jogo em celular. Capítulo 9 — Traição no santuário. Um agente entrega o esconderijo de refugiados para tentar salvar a própria família.. Mangá de aventura original, tinta preta sobre papel branco, contraste forte, retículas discretas e hachuras; somente preto e branco, sem texto ou balões.",
      "assetPath": "assets/campaigns/kagehama/scenes/santuario-aokiri.jpg",
      "kind": "scene",
      "category": "Cenários",
      "status": "published",
      "done": true
    },
    {
      "id": "art-kagehama-scene-9",
      "title": "Cenário vertical · Capítulo 10 — A torre de sinal",
      "description": "Ilustração de cenário vertical 9:16, sem personagens em primeiro plano, quadro estabelecedor para jogo em celular. Capítulo 10 — A torre de sinal. Tempestade, patrulhas recrutadas e mensagens cifradas sobre uma guerra planejada.. Mangá de aventura original, tinta preta sobre papel branco, contraste forte, retículas discretas e hachuras; somente preto e branco, sem texto ou balões.",
      "assetPath": "assets/campaigns/kagehama/scenes/desfiladeiro-sino-quebrado.jpg",
      "kind": "scene",
      "category": "Cenários",
      "status": "published",
      "done": true
    },
    {
      "id": "art-kagehama-scene-10",
      "title": "Cenário vertical · Capítulo 11 — Conselho em Kagehama",
      "description": "Ilustração de cenário vertical 9:16, sem personagens em primeiro plano, quadro estabelecedor para jogo em celular. Capítulo 11 — Conselho em Kagehama. A prova exige testemunhas, proteção e uma apresentação que sobreviva à política.. Mangá de aventura original, tinta preta sobre papel branco, contraste forte, retículas discretas e hachuras; somente preto e branco, sem texto ou balões.",
      "assetPath": "assets/campaigns/kagehama/scenes/palacio-sala-conselho.jpg",
      "kind": "scene",
      "category": "Cenários",
      "status": "published",
      "done": true
    },
    {
      "id": "art-kagehama-scene-11",
      "title": "Cenário vertical · Capítulo 12 — O cerco dos canais",
      "description": "Ilustração de cenário vertical 9:16, sem personagens em primeiro plano, quadro estabelecedor para jogo em celular. Capítulo 12 — O cerco dos canais. Três frentes simultâneas: comporta, enfermaria e muralha do porto.. Mangá de aventura original, tinta preta sobre papel branco, contraste forte, retículas discretas e hachuras; somente preto e branco, sem texto ou balões.",
      "assetPath": "assets/campaigns/kagehama/scenes/distrito-teceloes.jpg",
      "kind": "scene",
      "category": "Cenários",
      "status": "published",
      "done": true
    },
    {
      "id": "art-kagehama-scene-12",
      "title": "Cenário vertical · Capítulo 13 — O regente e a lâmina",
      "description": "Ilustração de cenário vertical 9:16, sem personagens em primeiro plano, quadro estabelecedor para jogo em celular. Capítulo 13 — O regente e a lâmina. Kuroda oferece acordo; pode haver rendição, exposição, captura, fuga ou combate.. Mangá de aventura original, tinta preta sobre papel branco, contraste forte, retículas discretas e hachuras; somente preto e branco, sem texto ou balões.",
      "assetPath": "assets/campaigns/kagehama/scenes/palacio-sala-conselho.jpg",
      "kind": "scene",
      "category": "Cenários",
      "status": "published",
      "done": true
    }
  ],
  "checklist": [
    {"id":"check-narrative-beats","title":"Revisar quadros narrativos dos 13 capítulos","description":"Validar a ordem da narração, falas, objetivos de cena e consequências com o grupo.","done":false,"category":"Narração"},
    {"id":"check-spirit-art","title":"Criar retratos dos seis espíritos do bestiário","description":"Ilustrações individuais em mangá preto e branco: oni do biombo, onibi, gaki, yūrei, shura e Kurokage.","done":false,"category":"Arte dos inimigos"},
    {"id":"check-ritual-props","title":"Criar arte da guarda de Hibari e dos selos","description":"Close de arma consagrada, sal ritual, talismãs e fragmentos do tratado; cada recurso deve ser identificável em tela pequena.","done":false,"category":"Arte dos itens"},
    {"id":"check-playtest-spirit","title":"Testar regras de ameaça espiritual em mesa","description":"Validar níveis 1–5, descoberta de fraqueza, condição para derrota e opções de resolução social ou ritual.","done":false,"category":"Playtest"},
    {
      "id": "artcheck-ronin-male",
      "title": "Criar avatar masculino · Rōnin de vanguarda",
      "description": "Recorte transparente vertical em mangá preto e branco. Arquivo-alvo: assets/campaigns/kagehama/classes/ronin/ronin_masculino.png",
      "done": true,
      "category": "Arte das classes"
    },
    {
      "id": "artcheck-ronin-female",
      "title": "Criar avatar feminino · Rōnin de vanguarda",
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
      "title": "Criar avatar masculino · Onmyōji elemental",
      "description": "Recorte transparente vertical em mangá preto e branco. Arquivo-alvo: assets/campaigns/kagehama/classes/onmyoji/onmyoji_masculino.png",
      "done": false,
      "category": "Arte das classes"
    },
    {
      "id": "artcheck-onmyoji-female",
      "title": "Criar avatar feminino · Onmyōji elemental",
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
      "done": true,
      "category": "Arte dos NPCs"
    },
    {
      "id": "artcheck-kagehama-npc-1",
      "title": "Criar retrato de Ren Kuroda",
      "description": "Polidez controlada, elogios com condição e perguntas que parecem convites. Tomar controle do conselho e manter a crise abaixo do limiar da guerra aberta.",
      "done": true,
      "category": "Arte dos NPCs"
    },
    {
      "id": "artcheck-kagehama-npc-2",
      "title": "Criar retrato de Tomoe Arashi",
      "description": "Voz baixa, vocabulário preciso, responde com perguntas e verifica quem está perto. Expor a falsificação do tratado sem transformar o caso em uma disputa de sucessão.",
      "done": true,
      "category": "Arte dos NPCs"
    },
    {
      "id": "artcheck-kagehama-npc-3",
      "title": "Criar retrato de Jiro “Três Chuvas”",
      "description": "Fala entrecortada até se sentir seguro; conta passos para organizar a memória. Entregar a prova do tratado sem expor quem o escondeu.",
      "done": true,
      "category": "Arte dos NPCs"
    },
    {
      "id": "artcheck-kagehama-npc-4",
      "title": "Criar retrato de Sayo",
      "description": "Sotaque e formalidade mudam conforme o interlocutor; não sustenta contato visual por muito tempo. Proteger o irmão e impedir que a Casa Sen seja responsabilizada por uma guerra que não planejou.",
      "done": true,
      "category": "Arte dos NPCs"
    },
    {
      "id": "artcheck-kagehama-npc-5",
      "title": "Criar retrato de Monge Genzō",
      "description": "Pausas longas, perguntas simples e humor sereno; não confirma acusações sem evidência. Manter o santuário neutro e dar passagem segura aos refugiados.",
      "done": true,
      "category": "Arte dos NPCs"
    },
    {
      "id": "artcheck-kagehama-npc-6",
      "title": "Criar retrato de Lady Chiyo Arashi",
      "description": "Cortesia firme, perguntas diretas sobre quem pagará a consequência. Garantir autonomia para Arashi sem iniciar uma guerra que destrua as aldeias.",
      "done": true,
      "category": "Arte dos NPCs"
    },
    {
      "id": "artcheck-kagehama-npc-7",
      "title": "Criar retrato de Daichi Arashi",
      "description": "Bravata pública e conversa concreta em privado; usa insultos para medir reação. Construir uma força própria e impedir que Arashi volte a depender do conselho central.",
      "done": true,
      "category": "Arte dos NPCs"
    },
    {
      "id": "artcheck-kagehama-npc-8",
      "title": "Criar retrato de Akane",
      "description": "Conversa em tom prático enquanto prepara remédios; corta discussões que atrapalham o cuidado. Manter o paciente vivo e impedir que a Irmandade vire ferramenta de interrogatório.",
      "done": true,
      "category": "Arte dos NPCs"
    },
    {
      "id": "artcheck-kagehama-npc-9",
      "title": "Criar retrato de Mestre Tetsuo",
      "description": "Frases curtas dirigidas às ferramentas; responde melhor a perguntas específicas que a intimidação. Provar que seu trabalho não foi usado para matar o mensageiro.",
      "done": true,
      "category": "Arte dos NPCs"
    },
    {
      "id": "artcheck-kagehama-npc-10",
      "title": "Criar retrato de Nuvem",
      "description": "Não fala; reage por postura, ouvido, focinho e proximidade. Procurar pessoas conhecidas e evitar ruídos que anunciem perigo.",
      "done": true,
      "category": "Arte dos NPCs"
    },
    {
      "id": "artcheck-kagehama-scene-0",
      "title": "Criar cenário: Prólogo — Ponte das Sete Lanternas",
      "description": "Cenário vertical para celular. Procissão, ponte, canal e tensão antes do ataque ao mensageiro imperial.",
      "done": true,
      "category": "Cenários"
    },
    {
      "id": "artcheck-kagehama-scene-1",
      "title": "Criar cenário: Capítulo 2 — Três contas queimadas",
      "description": "Cenário vertical para celular, recorte sem personagens. Sayo leva ao santuário; refugiados somem na floresta e uma trilha cruza esconderijo de Daichi.",
      "done": true,
      "category": "Cenários"
    },
    {
      "id": "artcheck-kagehama-scene-2",
      "title": "Criar cenário: Capítulo 3 — O homem sob a água",
      "description": "Cenário vertical para celular, recorte sem personagens. Nos Arquivos Afogados, o grupo escolhe salvar Jiro, documentos ou a própria segurança.",
      "done": true,
      "category": "Cenários"
    },
    {
      "id": "artcheck-kagehama-scene-3",
      "title": "Criar cenário: Capítulo 4 — A caça do cervo negro",
      "description": "Cenário vertical para celular, recorte sem personagens. Rastro leva a posto abandonado e soldados mortos após um encontro diplomático falso.",
      "done": true,
      "category": "Cenários"
    },
    {
      "id": "artcheck-kagehama-scene-4",
      "title": "Criar cenário: Capítulo 5 — O mensageiro que não chegou",
      "description": "Cenário vertical para celular, recorte sem personagens. A aldeia de Sumi perde água por uma ordem verdadeira entregue por portador falso.",
      "done": true,
      "category": "Cenários"
    },
    {
      "id": "artcheck-kagehama-scene-5",
      "title": "Criar cenário: Capítulo 6 — Um duelo sem vencedor",
      "description": "Cenário vertical para celular, recorte sem personagens. Audiência no Castelo da Cinza; duelo testa contenção e respeito, não exige morte.",
      "done": true,
      "category": "Cenários"
    },
    {
      "id": "artcheck-kagehama-scene-6",
      "title": "Criar cenário: Capítulo 7 — A noite da enseada",
      "description": "Cenário vertical para celular, recorte sem personagens. Infiltração ou perseguição marítima contra um navio com armas e registros falsos.",
      "done": true,
      "category": "Cenários"
    },
    {
      "id": "artcheck-kagehama-scene-7",
      "title": "Criar cenário: Capítulo 8 — A herdeira chamada Nao",
      "description": "Cenário vertical para celular, recorte sem personagens. Tomoe revela a matriz do selo; tornar a falsificação pública põe seus soldados em risco.",
      "done": true,
      "category": "Cenários"
    },
    {
      "id": "artcheck-kagehama-scene-8",
      "title": "Criar cenário: Capítulo 9 — Traição no santuário",
      "description": "Cenário vertical para celular, recorte sem personagens. Um agente entrega o esconderijo de refugiados para tentar salvar a própria família.",
      "done": true,
      "category": "Cenários"
    },
    {
      "id": "artcheck-kagehama-scene-9",
      "title": "Criar cenário: Capítulo 10 — A torre de sinal",
      "description": "Cenário vertical para celular, recorte sem personagens. Tempestade, patrulhas recrutadas e mensagens cifradas sobre uma guerra planejada.",
      "done": true,
      "category": "Cenários"
    },
    {
      "id": "artcheck-kagehama-scene-10",
      "title": "Criar cenário: Capítulo 11 — Conselho em Kagehama",
      "description": "Cenário vertical para celular, recorte sem personagens. A prova exige testemunhas, proteção e uma apresentação que sobreviva à política.",
      "done": true,
      "category": "Cenários"
    },
    {
      "id": "artcheck-kagehama-scene-11",
      "title": "Criar cenário: Capítulo 12 — O cerco dos canais",
      "description": "Cenário vertical para celular, recorte sem personagens. Três frentes simultâneas: comporta, enfermaria e muralha do porto.",
      "done": true,
      "category": "Cenários"
    },
    {
      "id": "artcheck-kagehama-scene-12",
      "title": "Criar cenário: Capítulo 13 — O regente e a lâmina",
      "description": "Cenário vertical para celular, recorte sem personagens. Kuroda oferece acordo; pode haver rendição, exposição, captura, fuga ou combate.",
      "done": true,
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
  "npcBehaviorModel": {
    "version": 1,
    "stage": "design-ready",
    "runtimeStatus": "O Oráculo gera fala sob acionamento do mestre; iniciativa autônoma e memória persistente de relações ainda não estão conectadas ao app.",
    "statePerNpc": ["objetivoImediato", "limiteQueNaoCede", "medoAtivo", "confiancaPorPersonagem", "suspeitaPorPersonagem", "dividas", "relacoesComNPCs", "conhecimentoConfirmado", "rumores", "segredos", "ultimaMudancaRelevante"],
    "turnRules": [
      "Responder à intenção concreta da pergunta do jogador; a resposta pode ser recusa, incerteza ou contraproposta coerente.",
      "Separar fato visto, rumor, dedução e segredo; nunca conceder conhecimento de bastidor sem fonte.",
      "Usar histórico relevante e perfil para decidir o que dizer, omitir, pedir ou fazer.",
      "Transformar falhas sociais e sucessos em mudanças de confiança, suspeita, dívida, exposição ou oportunidade, justificadas na ficção.",
      "Preservar agência: o NPC pode agir, negociar, discordar, sair ou pedir tempo, mas não decide ações do personagem do jogador."
    ],
    "interNpcRules": [
      "Considerar apenas NPCs presentes ou capazes de se comunicar de forma plausível.",
      "Iniciar diálogo entre NPCs quando uma meta, conflito, promessa, testemunho ou perigo acionar uma reação concreta.",
      "Limitar intervenções espontâneas ao que altera a cena; não fazer todos falarem automaticamente.",
      "Permitir objetivos incompatíveis e conversas privadas, interrompidas ou incompletas sem transformar divergência em exposição automática de segredos."
    ],
    "continuityFields": ["fato", "quemSabe", "interpretacaoPorPessoa", "promessa", "proximaConsequencia"],
    "rollPolicy": "A fala pode sugerir uma tentativa. Resoluções incertas com risco continuam usando as regras 3d6 e decisão do mestre."
  },
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

