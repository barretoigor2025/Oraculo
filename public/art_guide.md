# ORÁCULO RPG — GUIA COMPLETO DE ARTE DE PERSONAGENS
**Versão 1.0 | Documento de referência para geração e revisão de sprites e retratos**

---

## INSTRUÇÕES PARA O GERADOR DE IMAGENS

Você vai criar arte de personagens para o RPG digital "Oráculo". Leia TODO este documento antes de gerar qualquer imagem. O estilo, as especificações técnicas e as descrições de personagens são IMUTÁVEIS — não substitua, não improvise, não adicione elementos decorativos não solicitados.

---

## PARTE 1 — ESTILO ARTÍSTICO

### Estilo Base
Ilustração de personagem semi-realista com influência de anime mature/seinen (não infantil, não chibi, sem superdeformação). Proporções adultas e anatômicas. Qualidade de concept art de RPG japonês de alto nível.

**Referências visuais de estilo:** Fire Emblem: Three Houses (concept art), Dragon's Dogma: Dark Arisen, Octopath Traveler (versão mais realista), NieR: Automata.

### Qualidade de Traço
- Linhas limpas e confiantes, sem rabiscos ou hesitação
- Shading detalhado com gradientes suaves (não cel-shading puro)
- Texturas de materiais distintas: metal tem reflexo metálico, couro tem granulação, tecido tem dobras orgânicas, pele tem suavidade
- Cabelo com mechas individuais definidas, não uma massa sólida

### Paleta e Iluminação (PORTRAITS)
- Iluminação principal: luz de vela quente e âmbar, vindo de 45° à frente-esquerda
- Iluminação secundária: leve rim light frio (azul pálido) vindo de trás-direita
- Fundo: ambiente escuro de fantasia medieval — pedra, madeira, tapeçarias antigas, velas acesas
- Paleta dominante: tons quentes (âmbar, dourado, ferrugem, cobre) com acentos específicos por personagem
- Sombras profundas mas sem perder detalhes nas áreas escuras

### Paleta e Iluminação (SPRITES)
- Fundo: COMPLETAMENTE TRANSPARENTE (PNG com canal alpha)
- Iluminação: neutra, difusa, ligeiramente de cima — sem sombra projetada no chão
- Personagem bem legível a pequenos tamanhos (tokens de mapa)

---

## PARTE 2 — ESPECIFICAÇÕES TÉCNICAS

### 2A — RETRATOS (Portraits)

Usados no painel de informações do jogo durante combate e conversas.

| Parâmetro | Valor |
|-----------|-------|
| Resolução | **512 × 680 pixels** |
| Formato | PNG |
| Fundo | Escuro, atmosférico, interior medieval |
| Enquadramento | Da altura dos joelhos/coxas até 20px acima do topo da cabeça |
| Ângulo do personagem | Levemente de 3/4, olhando em direção ao observador |
| Borda | **NENHUMA** — a arte preenche o canvas do pixel 0 ao pixel 512×680 sem moldura, sem ornamento dourado, sem adorno de qualquer tipo |
| Composição | Personagem centralizado horizontalmente, corpo ocupando ~80% da altura do canvas |

> ⚠️ **ATENÇÃO CRÍTICA**: Os retratos anteriores continham uma moldura dourada ornamentada nas bordas com um ornamento em losango no topo. **Esta moldura deve ser completamente eliminada.** A arte começa diretamente na borda do pixel 0 e termina na borda do pixel 512 (horizontal) e pixel 680 (vertical). Nenhuma decoração, nenhuma borda.

> ⚠️ **ATENÇÃO CRÍTICA 2**: Todos os retratos devem ter exatamente o MESMO enquadramento e proporção de personagem dentro do canvas. O personagem ocupa o mesmo espaço relativo em todos os retratos — não mais zoom em uns do que em outros.

### 2B — SPRITES (Tokens de Mapa)

Usados no mapa hexagonal de combate. Cada personagem precisa de **dois arquivos**: frente e costas.

| Parâmetro | Valor |
|-----------|-------|
| Resolução | **200 × 300 pixels** |
| Formato | PNG com fundo transparente |
| Fundo | Totalmente transparente — zero pixels opacos fora do personagem |
| Vista Frente | Personagem de frente, ligeiramente de 3/4, pronto para combate |
| Vista Costas | Personagem de costas, mesma pose espelhada |
| Escala | Criaturas grandes (trolls, gigantes) preenchem mais verticalmente; criaturas pequenas (kobolds, goblins) ficam menores proporcionalmente |
| Posição | Pés na parte inferior do canvas, cabeça com ~10px de margem no topo |
| Sombra | Nenhuma sombra projetada no chão |

---

## PARTE 3 — CLASSES JOGÁVEIS

Cada classe existe em versão **masculina (M)** e **feminina (F)**.  
Arquivos necessários por classe: `[classe]_m.png`, `[classe]_f.png`, `[classe]_m_costas.png`, `[classe]_f_costas.png`, `retrato_[classe]_m.png`, `retrato_[classe]_f.png`

---

### GUERREIRO
**Arquivos:** sprite M/F frente+costas + retrato M/F

**Masculino:**  
Homem de ~30 anos, físico atlético e porte firme. Armadura de placas de aço polido com detalhes em azul-real e dourado. Ombreira esquerda maior. Elmo de viseira levantada (visível no retrato). Cabelo castanho-escuro curto, olhos verdes, expressão determinada e séria. Segura espada longa na mão direita; escudo circular com brasão de leão no braço esquerdo. Cota de malha visível nas juntas.

**Feminino:**  
Mulher de ~28 anos, mesma armadura de placas do masculino (adaptada ao corpo feminino — sem exagero, armadura funcional e completa). Cabelo castanho comprido preso em rabo de cavalo alto. Mesma espada e escudo com brasão de leão. Postura confiante, expressão focada. Mesmos detalhes em azul e dourado na armadura.

---

### MAGO
**Arquivos:** sprite M/F frente+costas + retrato M/F

**Masculino:**  
Homem de ~40 anos, físico médio não musculoso. Cabelo longo branco-prateado solto, olhos castanho-escuros com profundidade misteriosa, barba curta bem cuidada. Vestes longas em roxo-profundo com bordados dourados e insígnias arcanas. Capa azul-escura por cima. Cinto de couro com bolsas e um pequeno grimório preso. Cajado alto de madeira escura terminando em cristal estelar de 6 pontas. Expressão sábia, ligeiramente distante.

**Feminino:**  
Mulher de ~35 anos. Vestes roxo-profundas com bordados dourados, versão feminina do mesmo conjunto. Cabelo preto longo com mechas prateadas, preso em semi-coque com ornamentos de metal. Cajado menor e mais elegante com cristal oval. Expressão serena e confiante, olhar penetrante.

---

### LADINO
**Arquivos:** sprite M/F frente+costas + retrato M/F

**Masculino:**  
Homem de ~25 anos, físico esguio e ágil. Armadura de couro preto ajustada com tiras e fivelas. Capuz escuro puxado para trás. Lenço vermelho escarlate no pescoço. Duas adagas — uma na coxa direita, uma no antebraço esquerdo. Cabelo castanho médio levemente bagunçado. Expressão astuta, sorriso de canto de boca.

**Feminino:**  
Mulher de ~25 anos. Armadura de couro preto ajustada com detalhes vermelhos (mesma identidade visual do masculino). Manto vermelho-sangue rasgado nas bordas, sobre os ombros. Cabelo castanho-escuro volumoso em rabo de cavalo caído. Duas adagas curvas. Expressão felina, segura de si.

---

### CLÉRIGO
**Arquivos:** sprite M/F frente+costas + retrato M/F

**Masculino:**  
Homem de ~30 anos, físico médio-robusto. Vestes cerimoniais brancas com bordados dourados extensos — manto sobre os ombros, cinturão com símbolo solar. Cajado sagrado de bronze com orbe de luz e símbolo de cruz no topo. Cabelo castanho curto bem arrumado. Expressão serena e bondosa. Acessórios: terço de contas douradas na mão esquerda.

**Feminino:**  
Mulher de ~30 anos. Vestes sagradas brancas e douradas versão feminina, saia longa bordada. Véu branco fino na cabeça com faixa dourada na testa. Cajado menor com símbolo sagrado. Expressão de compaixão e determinação.

---

### BÁRBARO
**Arquivos:** sprite M/F frente+costas + retrato M/F

**Masculino:**  
Homem de ~35 anos, musculatura extrema com cicatrizes de batalha no tórax e braços. Pele bronzeada. Cabelo branco-loiro selvagem com topete para cima, barba curta. Torso parcialmente exposto com bandagem no ombro esquerdo. Ombreira direita de metal escuro cravejado. Saia de couro reforçado com franjas de pele. Braçadeiras grossas de metal oxidado. Machado de guerra de duas mãos — lâmina dentada e cabo envolto em couro. Expressão furiosa, veias saltadas.

**Feminino:**  
Mulher de ~30 anos, corpo musculoso com cicatrizes. Cabelo branco-loiro trançado caindo pela lateral. Armadura de couro e pele com tops de couro sobre o tórax. Mesma saia de peles. Machado menor porém igualmente brutal. Expressão selvagem e determinada.

---

### ARQUEIRO
**Arquivos:** sprite M/F frente+costas + retrato M/F

**Masculino:**  
Homem de aparência élfica, ~? anos (jovem aparência mas possivelmente mais velho). Orelhas levemente pontudas. Cabelo loiro comprido e liso, solto. Olhos verdes claros. Veste ranger da floresta: túnica verde-musgo com colete de couro marrom, calças de viajante. Capa verde desbotada com borda de couro. Aljava com flechas nas costas. Arco longo de madeira clara na mão. Expressão tranquila e observadora.

**Feminino:**  
Mulher de ~25 anos, físico ágil e atlético. Cabelo castanho-avermelhado curto ou em trança de combate. Vestes de ranger verde e marrom, idênticas em design ao masculino. Arco menor e mais recurvo. Aljava a tiracolo. Expressão concentrada, ligeiramente desconfiada.

---

## PARTE 4 — NPCs DA CAMPANHA

NPCs precisam de: **retrato** (512×680, sem borda) e **sprite** (200×300, fundo transparente, frente).  
Personagens que podem aparecer em combate também precisam do sprite de **costas**.

> ℹ️ As descrições descrevem aparência e personalidade superficial. Detalhes de enredo não são mencionados intencionalmente.

---

### NPC_CATHERINE_LASKARIS — Duquesa Catherine Laskaris
**Categoria:** Aliado | **Arquivos:** retrato + sprite frente

Mulher nobre de ~35 anos. Pele oliva, traços mediterrâneos refinados, olhos castanho-escuros penetrantes. Cabelo castanho-escuro com ondas naturais, solto e caindo suavemente sobre os ombros. Veste vestido longo roxo-escuro (violeta real) com bordados dourados na gola, punhos e saia. Capa bege-dourada sobre os ombros com fecho de broche ornamentado. Postura ereta e digna — cada detalhe comunica autoridade sem ostentação. Expressão serena mas com olhar que avalia tudo ao redor.

---

### NPC_GREGORAS_PELLOS — Gregoras Pellos
**Categoria:** Aliado | **Arquivos:** retrato + sprite frente

Homem de ~45 anos, constituição robusta, ombros largos de soldado veterano. Cabelo castanho-escuro curto, barba de três dias, expressão séria e fechada. Veste armadura acolchoada azul-escura reforçada com placas de bronze nos ombros e antebraços. Cinto largo de couro com fivela de ferro. Maça de cabeça ferrada presa ao cinto. Postura ereta sem esforço — homem que nunca se curva. Olhar direto e avaliador, que mede distâncias e intenções por reflexo. Não sorri na ilustração.

---

### NPC_FINN_WILLOWHEEL — Finn Willowheel
**Categoria:** Aliado | **Arquivos:** retrato + sprite frente

Homem idoso de ~70 anos, aspecto animado e saudável apesar da idade. Cabelo branco muito curto e ralo, rosto rosado e redondo com sorriso largo e genuíno. Veste roupas de trabalho prático: avental de couro marrom com múltiplos bolsos cheios de ferramentas de sapateiro (furador, fita métrica, agulhas grossas). Camisa de linho bege arregaçada nos cotovelos. Carrega às costas uma enorme saca de lona transbordando de sapatos, botas, sandálias e chinelos de todas as formas e cores. A saca é quase do tamanho dele. Postura ativa, passo leve, expressão sempre animada.

---

### NPC_HOBBLEBOOT_SAM — Hobbleboot Sam
**Categoria:** Neutro | **Arquivos:** retrato + sprite frente

Homem de ~50 anos, físico comum e enxuto, barba curta grisalha irregular, cabelo castanho-acinzentado levemente bagunçado. Rosto angular e curtido pelo sol. Veste casaco de viajante marrom-escuro com remendos, capa verde desgastada e calças de couro. Usa bengala de madeira nodosa na mão direita. Carrega às costas uma cesta de vime grande amarrada com cordas, cheia de cogumelos de vários tipos, ervas secas e raízes. Expressão séria mas não hostil — homem acostumado a andar sozinho e a observar mais do que falar.

---

### NPC_RUZALKA — Ruzalka
**Categoria:** Neutro | **Arquivos:** retrato + sprite frente

Figura feminina etérea e translúcida, de natureza sobrenatural. Aparência de mulher adulta mas claramente não humana. Cabelo longo que flutua como se estivesse submerso em água, em tons de verde-azulado e prateado. Pele translúcida com reflexos de água parada — levemente visível através dela. Olhos completamente brancos com um brilho azul-pálido interior. Veste roupas de tecido aquático transparente que parecem tecidas de correntes de água em movimento. Pequenas bolhas aparecem ao redor dela quando fala. Expressão contemplativa, nem amistosa nem ameaçadora. A parte inferior do corpo se dissolve em névoa aquática.

---

### NPC_PRINCIPE_KALOS — Príncipe Kalos
**Categoria:** Neutro-Hostil | **Arquivos:** retrato + sprite frente

Elfo negro alto e esguio, ~1,90m. Pele cinza-ardósia, textura lisa e fria. Cabelo branco comprido preso em uma única trança lateral que cai pelo ombro direito. Olhos vermelhos sem pupila visível — apenas íris vermelha brilhante. Feições angulosas e aristocráticas, expressão de superioridade fria. Veste armadura de comandante élfico em couro negro rígido com entalhes prateados formando padrões de constelações. Capa negra fina. Sem armas visíveis no retrato mas postura de quem nunca precisou se defender. Leve sorriso que não alcança os olhos.

---

### NPC_VALMORIEN — Valmorien
**Categoria:** Hostil | **Arquivos:** retrato + sprite frente + sprite costas

> ⚠️ **NOTA DE REVISÃO PENDENTE**: A aparência visual deste personagem está em processo de revisão. A descrição abaixo é provisória até confirmação do retrato oficial.

Figura jovem e compacta, corpo treinado para velocidade e precisão. Pele morena-escura, cabelo curto e escuro preso em rabo de cavalo baixo. Traços afiados, expressão severa e vigilante. Veste armadura de caçadora em couro escuro e peles irregulares, protetores de braço de couro cru. Arco longo às costas com aljava a tiracolo. Faca curta de lâmina larga sempre à mão. Postura compacta como mola antes de disparar. Cicatriz sutil no queixo esquerdo.

---

### NPC_YSORIA — Ysoria
**Categoria:** Hostil | **Arquivos:** retrato + sprite frente + sprite costas

Elfo masculino de feições angulosas, pele cinza-esverdeada, cabelo escuro e volumoso levemente despenteado. Olhos vermelhos com expressão calculista permanente. Veste equipamento de caçador-ranger em couro escuro, manta rasgada e irregular sobre os ombros que funciona como camuflagem. Arco de guerra élfico com gravuras nas costas, aljava de flechas longas. Faca de combate na coxa esquerda. Cada movimento é deliberado e silencioso — postura de predador.

---

### NPC_WULFRAM_CHIFRADO — Wulfram, o Chifrado
**Categoria:** Neutro | **Arquivos:** retrato + sprite frente

Homem robusto e imponente de ~40 anos, porte intimidador sem ser gigantesco. Traço mais marcante: chifres de cervo crescendo organicamente da testa — ramificados, com veludo natural, definitivamente parte do corpo (não um elmo, não um adorno). Cabelo escuro e desgrenhado, barba densa de dias. Pele bronzeada e marcada pela floresta. Veste capa de peles de animais sobre armadura de couro grosseiro com costuras irregulares. Machado de batalha de lâmina larga na mão direita. Expressão séria e direta, olhos castanho-esverdeados que raramente piscam. Não sorri.

---

### NPC_FARIBORZ_PIROMANTE — Fariborz, o Piromante
**Categoria:** Neutro-Hostil | **Arquivos:** retrato + sprite frente

Homem de ~30 anos com marcas extensas de queimaduras cobrindo metade direita do rosto e pescoço. Sem sobrancelha direita, cílios inexistentes do lado queimado. Crânio com calvície irregular em padrões de cicatriz. Lado esquerdo do rosto é de homem comum e jovem — o contraste é perturbador. Olhos castanho-claros com brilho febril. Veste robes cinza chamuscados com manchas de fuligem. Dedos dos dois lados emitem pequenas faíscas espontâneas. Expressão oscila entre paranoia e fascínio intenso. Amuleto de pedra escura pendurado no pescoço.

---

### NPC_MUTTER_GRIMMHAAR — Mutter Grimmhaar
**Categoria:** Neutro | **Arquivos:** retrato + sprite frente

Mulher alta e esbelta de aparência ambígua — aparenta ~50 anos mas claramente é muito mais velha. Chapéu de bruxa de aba larga e retorcida com penduricalhos de ossos pequenos, dentes e joias sombrias. Robes longos negros rasgados e desgastados mas com elegância sinistra — não são trapos pobres, são vestes de poder deterioradas pelo tempo. Cajado alto com gema púrpura brilhante encravada em garras de metal negro no topo. Pele pálida-esverdeada, traços afiados mas não grotescos. Sorriso enigmático de canto de boca que não alcança os olhos. Postura ereta e vertical — ameaçadora sem precisar se curvar.

---

### NPC_MAC_RONAN — Mac Rónán, Alto Druida
**Categoria:** Aliado | **Arquivos:** retrato + sprite frente

Druida extremamente idoso, de aparência de ~80 anos mas claramente muito mais velho. Cabelo branco longo e barba comprida — ambos com folhas verdes, pequenos galhos e musgo entrelaçados naturalmente, como se a floresta crescesse nele. Robes verdes desgastados em múltiplas camadas, com vegetação viva brotando das dobras do tecido. Pés descalços ou amarrados com tiras de cipó. Mãos com veias proeminentes, dedos entrelaçados em frente ao corpo em gesto de quietude. Olhos cinza-esverdeados com sabedoria profunda e levemente triste. Caminha com propósito absoluto apesar da aparente fragilidade.

---

### NPC_MUIRENN — Muirenn
**Categoria:** Aliado | **Arquivos:** retrato + sprite frente

Jovem mulher de ~22 anos, aspecto celta. Cabelo castanho comprido levemente ondulado, com pequenas tranças rituais finas entremeadas — não cobre o rosto. Olhos castanho-esverdeados atentos e curiosos. Veste roupas druidicas simples: túnica de linho verde-acinzentado com manto natural sobre os ombros, cosido com elementos como sementes, folhas e galhinhos finos. Segura ou carrega flores silvestres e ervas medicinais. Postura reflexiva, ombros levemente inclinados — atitude de quem observa e aprende.

---

### NPC_DVALINN_ANAO — Dvalinn
**Categoria:** Aliado | **Arquivos:** retrato + sprite frente

Anão de ~1,45m com construção larga e sólida — aparência de ~40 anos humanos mas é muito mais velho. Barba ruivo-acastanhada bem cuidada dividida em duas tranças presas por argolas de bronze. Cabelo da mesma cor preso atrás. Armadura de viajante com amassados e arranhões recentes, simbolizando uma jornada difícil. Machado pequeno de combate no cinto. Expressão melancólica e pesada. Cicatrizes de flechada no ombro direito. Olhos castanhos com peso profundo.

---

### NPC_BLUNKIN_ESMAGA_CRANIOS — Blunkin Esmaga-Crânios
**Categoria:** Neutro-Hostil | **Arquivos:** retrato + sprite frente

Criatura réptil-anfíbia de estatura baixa (~1,0m), corpo arredondado e rechonchudo. Pele alaranjada-avermelhada, escamosa, com manchas de vermelho intenso no dorso. Olhos amarelo-esverdeados esbugalhados. Usa coroa torta de metal com pedras semipreciosas — claramente de origem nobre mas mal ajustada. Capa real roxa com bordas de pelo branco (de algum animal pequeno). Colar volumoso de dentes, ossos e amuletos. Empunha um cetro com crânio decorativo na ponta. Barriga protuberante, postura erguida com orgulho ridículo. Expressão de grandiosidade cômica.

---

### NPC_DUQUE_OSWALD_THOOL — Oswald (forma Thool)
**Categoria:** Hostil | **Arquivos:** retrato + sprite frente + sprite costas

Humano transformado em ogre gigantesco de ~2,5m, postura curvada. Pele acinzentada enrugada, musculatura grosseira. Boca levemente aberta com expressão confusa e animalesca — traços de humanidade visíveis mas deformados. Armadura de couro pesado malajustada para o novo tamanho — tiras e fivelas tensionadas ao máximo. Mãos enormes com dedos longos. Detalhe importante: dedo indicador do pé visivelmente maior que o dedão (traço que permanece da forma humana). Marca escura em forma de baga no ombro — quase apagada pela transformação.

---

### NPC_REI_CHUTTER — Rei Chutter
**Categoria:** Vilão | **Arquivos:** retrato + sprite frente

Criatura monstruosa e colossal de ~3m, pele cinza-pedra densa e enrugada como rocha viva. Musculatura absurda — braços do tamanho de troncos de árvore, tórax como uma muralha. Espinhos ósseos irregulares emergindo da cabeça e ombros. Tatuagem/marca violeta no peito — símbolo de poder. Equipamento de couro pesado grosseiramente adaptado ao seu tamanho. Braços cruzados com arrogância de quem nunca precisou se defender. Expressão que combina inteligência calculista com brutalidade absoluta. Cada passo deve parecer que faz o chão tremer.

---

### NPC_AELAR_EISENLI — Aelar Eisenli
**Categoria:** Neutro | **Arquivos:** retrato + sprite frente

Elfa de aparência ~35 anos humanos (mas muito mais velha). Orelhas pontiagudas élfico-padrão. Pele bronzeada com leve subtom acinzentado (característico dos elfos). Cabelo preto-azulado comprido preso em trança firme de combate. Olhos âmbar com expressão avaliadora permanente. Veste armadura de couro reforçado negro com capa de viagem verde-escura. Arco longo nas costas, espada fina de lâmina estreita no cinto. Postura de caçadora — sempre levemente alerta, peso distribuído para movimento rápido.

---

### NPC_CHOIR_NECROMANTE — Choir, o Necromante
**Categoria:** Vilão | **Arquivos:** retrato + sprite frente

Homem de meia-idade de aparência cadavérica. Pele branco-acinzentada sem vida, quase do mesmo tom dos mortos que manipula. Olhos profundamente encovados com íris amarelas-esverdeadas. Cabelo escuro e fino preso para trás, começando a clarear nas têmporas. Calvície inicial no topo. Usa robes negros compridos com marcas rituais pintadas em branco no tecido — símbolos geométricos de necromancia. Mãos longas e pálidas com dedos finos em postura de gesticulação mágica. Expressão de desprezo permanente e leve fastio. Nunca parece surpreso com nada.

---

### NPC_DRIZZLE — Drizzle
**Categoria:** Neutro | **Arquivos:** retrato + sprite frente

> ℹ️ Personagem com sprite existente ainda não catalogado oficialmente na campanha.

Criatura réptil-esguia de estatura baixa (~1,1m). Pele esverdeada-oliva, escamosa e lustrosa. Orelhas grandes parecidas com asas de morcego, sempre em alerta. Olhos grandes e amarelos, expressão esperta e levemente sorrateira. Corpo magro mas coberto em camadas de colares, pulseiras, cordões com badulaques coloridos — pedras, contas, adornos baratos e alguns possivelmente valiosos. Veste trapos em camadas sobrepostas. Expressão de quem sabe mais do que parece e está sempre calculando uma vantagem.

---

## PARTE 5 — INIMIGOS E CRIATURAS

Cada inimigo precisa de: **sprite frente** (200×300) + **sprite costas** (200×300).  
Inimigos não precisam de retrato (portrait), apenas de sprite de combate.

---

### INIMIGO_ESPANTALHO_ASSOMBRADO — Espantalho Assombrado
**Tipo:** Morto-Vivo Animado | **Ameaça:** Baixa

Espantalho animado por força sobrenatural. Corpo de palha e galhos, articulações inexistentes — parece mover-se de forma impossível. Veste roupas rasgadas de fazendeiro decompostas. Chapéu de palha torto com borda rasgada. Olhos vermelhos brilhantes de luz interna. Mãos de galhos afiados. Segura foice enferrujada. Movimentos irregulares e sacudidos, como marionete de fios cortados.

---

### INIMIGO_KOBOLD_AZUL — Kobold Azul
**Tipo:** Humanoide Réptil | **Ameaça:** Baixa

Criatura reptiliana bípede de ~0,9m. Pele azul-acinzentada com escamas pequenas. Olhos amarelos grandes com pupila vertical. Focinho curto com dentes pequenos mas afiados. Veste proteções de couro cru improvisadas — pedaços de couro amarrados com tiras. Segura lança primitiva de madeira com ponta de osso. Postura encurvada, sempre em alerta, garras visíveis nas mãos e pés. Rabo curto e fino.

---

### INIMIGO_ELFO_SOMBRIO — Elfo Sombrio
**Tipo:** Elfo Negro Guerreiro | **Ameaça:** Média

Elfo negro de porte médio, pele cinza-ardósia, cabelo branco comprido solto ou levemente preso. Olhos vermelhos brilhantes. Veste armadura de couro negro rígido com detalhes prateados — design élfico anguloso e sombrio. Empunha duas espadas curvas com lâminas de metal negro. Postura fluida de duelista, equilíbrio perfeito. Expressão fria e calculista.

---

### INIMIGO_GRIMHOLLOW_THOOL — Grimhollow Thool
**Tipo:** Humanoide Transformado (Ettin) | **Ameaça:** Alta

Ettin colossal de ~4m — criatura com DOIS TORSOS/CABEÇAS emergindo de um único corpo monstruoso. Pele cinza-pedra grossa, músculos enormes. Uma cabeça ligeiramente mais inteligente, a outra mais bestial. Veste tiras de tecido roxo-real e joias de ouro — resquícios de poder passado. Segura cajado de pedra ornamentado com cristais roxos. Pés descalços enormes. Expressão confusa mas perigosa. O segundo torso/cabeça emerge das costas/ombros como siamês.

---

### INIMIGO_MANTICORA_ALBINA — Manticora Albina
**Tipo:** Fera Mágica | **Ameaça:** Alta

Criatura leonina de grande porte, toda em branco-creme com toques dourados. Corpo de leão com musculatura poderosa. Juba dourado-branca espessa e longa ao redor da cabeça, ornamentada com joias — como uma coroa natural. Asas de morcego brancas e imponentes dobradas ao dorso quando em repouso. Cauda longa terminando em pontas espinhosas escuras. Olhos dourados de predador. Postura de felino — graça e ameaça simultâneas.

---

### INIMIGO_REI_CHUTTER — Rei Chutter (Forma de Combate)
**Tipo:** Fera Mágica / Boss | **Ameaça:** Boss

Variante de combate do vilão principal. Criatura leonina colossal, branco-prateada, similar à Manticora Albina mas de porte ainda maior e aspecto mais sombrio. Sem joias ou adornos — toda a aparência é de predador absoluto. Asas maiores, cauda mais massiva. Olhar de inteligência cruel. Esta é a forma que confronta os aventureiros no combate final.

> ⚠️ **Nota:** Os sprites `inimigo_rei_chutter` e `inimigo_manticora_albina` são visualmente similares. Diferenciar pelo tamanho (Chutter é maior) e pelo tom (Manticora tem toques dourados e joias; Chutter é totalmente branco-sombrio).

---

### INIMIGO_LARVA_GIGANTE — Larva Gigante
**Tipo:** Fera Amorfa | **Ameaça:** Alta

Larva monstruosa de ~3m de comprimento. Corpo segmentado de beige-dourado sujo, coberto de runas queimadas na pele como marcas rituais. Múltiplos tentáculos de movimento sob o corpo. Boca circular enorme com dentes em espiral, babando líquido amarelo-dourado. Olhos laterais pequenos e sem expressão. Espinhos irregulares no dorso. Corpo pesado que arrasta no chão.

---

### INIMIGO_MARROWWITHER — Marrowwither
**Tipo:** Parasita Amorfo | **Ameaça:** Média-Alta

Criatura amorfa similar à Larva Gigante mas menor (~1,5m). Corpo segmentado de beige com manchas marrom-escuras. Múltiplas bocas pequenas em vez de uma grande. Tentáculos mais numerosos e rápidos. Sem olhos visíveis. Movimenta-se através de ondulações do corpo. Secreta líquido viscoso escuro.

---

### INIMIGO_LOG_WIFE — Log-Wife
**Tipo:** Espírito da Floresta | **Ameaça:** Média

Figura feminina de aparência humana mas feita inteiramente de raízes, troncos retorcidos e casca de árvore. ~2m de altura. Cabelo de galhos finos e folhas mortas. Rosto formado pela casca com feições quase humanas — olhos vazios de musgo luminescente. Corpo é uma mistura de torso humanoide na parte superior e raízes entrelaçadas na parte inferior, que se fundem com o chão. Fungos e cogumelos crescem ao longo do corpo. Braços terminam em galhos torcidos como garras.

---

### INIMIGO_BARKTHRESHER — Barkthresher
**Tipo:** Elemental de Árvore | **Ameaça:** Média

Criatura totalmente feita de madeira viva, galhos e casca. Bípede, ~2,5m. Corpo é um tronco retorcido com galhos formando braços longos e irregulares terminando em presas. Face é a madeira rachada com olhos brilhantes de âmbar. Raízes visíveis emergindo dos pés como "dedos". Folhas verdes e secas misturadas pelo corpo. Expressão permanentemente furiosa escavada na madeira.

---

### INIMIGO_WRAITHWEAVER_SPIDER — Aranha Espectral
**Tipo:** Aranha Mágica | **Ameaça:** Média-Alta

Aranha de grande porte (~1,5m de envergadura). Corpo principal é uma carapaça óssea-branca rendilhada — como porcelana trincada. Pernas longas e pontiagudas de osso-metal prateado. Múltiplos olhos azul-pálido brilhantes na "face". Teias visíveis saindo do abdômen — transparentes com brilho espectral. Quelíceras longas com veneno cristalizado nas pontas.

---

### INIMIGO_JAVALI_ENSANDECIDO — Javali Ensandecido
**Tipo:** Fera Corrompida | **Ameaça:** Média

Javali de grande porte (~1,5m de altura no ombro) visivelmente corrompido — pele escurecida, olhos vermelhos injetados. Pelos negros e desgrenhados. Espuma saindo da boca. Presas superiores longas e amareladas, ligeiramente curvadas. Uma lança de alguma vítima passada ainda cravada no dorso — o animal não parece senti-la. Cicatrizes e cortes que não cicatrizaram normalmente cobrem o corpo. Postura de carga, cabeça baixa.

---

### INIMIGO_ESQUELETO_LANCEIRO — Esqueleto Lanceiro
**Tipo:** Morto-Vivo | **Ameaça:** Média

Esqueleto humano animado, ~1,8m. Ossos esverdeados com pátina de morte. Veste fragmentos de armadura medieval de um guerreiro que foi em vida — capacete com viseira parcialmente destruída, plastrons de couro deteriorado, capa negra esfarelada. Segura lança longa de metal enferrujado com ponta ainda afiada. Crânio com olhos de fogo esverdeado interno. Postura de guarda, sempre alerta.

---

### INIMIGO_GOLEM_DE_PERGAMINHO — Golem de Pergaminho
**Tipo:** Constructo Mágico | **Ameaça:** Alta

Constructo humanoide de ~2m feito inteiramente de pergaminhos enrolados, amarrados e sobrepostos. Cada "músculo" é um rolo de pergaminho. Rosto é um pergaminho grande com símbolos arcanos desenhados onde estariam os olhos. Mãos terminam em rolos de pergaminho que se abrem como garras. Tiras de pergaminho saem do corpo como "cabelo" ou "capa". Brilho dourado nas runas gravadas ao longo do corpo. Sólido e pesado apesar da aparência frágil.

---

### INIMIGO_ORC_BANDIDO — Orc Bandido
**Tipo:** Humanoide Orc | **Ameaça:** Média

Orc adulto de ~1,9m, muscular e robusto. Pele verde-oliva escura. Presas inferiores salientes. Cicatrizes de combate no rosto e braços. Veste armadura improvisada de peças saqueadas — elmo de cavaleiro amassado, placa de metal no ombro esquerdo, colete de couro cru. Carrega machado de mão enferrujado e escudo redondo de madeira reforçada. Bandana vermelha na testa. Expressão agressiva mas não irracional.

---

### INIMIGO_BUGBEAR_ASSASSINO — Bugbear Assassino
**Tipo:** Humanoide Bugbear | **Ameaça:** Média-Alta

Criatura humanoide peluda de ~2,1m, corpo de urso mas bípede. Pele acinzentada coberta de pelo castanho-escuro áspero. Olhos pequenos e amarelos. Nariz chato. Veste armadura de couro escuro com fivelas e capuz que cobre boa parte do rosto. Duas adagas largas — uma em cada mão. Movimento surpreendentemente silencioso para seu tamanho. Expressão de paciência — predador que espera o momento certo.

---

### INIMIGO_TROLL_MOSS_BELLY — Troll Barriga-de-Musgo
**Tipo:** Troll | **Ameaça:** Alta

Troll de ~2,5m, corpo robusto mas desajeitado. Pele verde-cinza com textura de pedra molhada. Barriga volumosa coberta de musgo verde vivo, líquens e pequenas plantas que cresceram sobre sua pele. Pelos desgrenhados na cabeça e dorso. Dentes largos e irregulares. Orelhas grandes pontiagudas. Segura um tronco de árvore arrancado como clava. Expressão simples e raivosa. Pés descalços enormes.

---

### INIMIGO_ANKLE_SNAPPER — Ankle Snapper
**Tipo:** Fera Pequena | **Ameaça:** Baixa-Média

Criatura de ~0,3m similar a uma planta-boca amorfa. Corpo é uma massa de tentáculos marrom-vermelho com múltiplas bocas de dentes. Sem olhos visíveis. Vive semienterrada no solo, tentáculos saindo como raízes. Em combate, se revela completamente — um aglomerado de bocas abertas e tentáculos. Secretamente muito rápido para seu tamanho.

---

### INIMIGO_MOTHER_CLUTCH — Mother Clutch
**Tipo:** Constructo Necromântico | **Ameaça:** Boss Médio

Criatura colossal e horrenda, de design assimétrico perturbador. Corpo central de ~3m com arquitetura que mistura inseto, crucifix e morto-vivo. Múltiplos braços finos e longos saindo dos lados em várias alturas. Cabeça encapuzada com face de morte, ornamentos em ouro podre. Parte inferior é um corpo de aranha gigante com pernas longas. Pernas de aranha adicionais saindo dos flancos. Veste farrapos roxo-dourado deteriorados. Expressão de entidade sem alma mas com propósito.

---

### INIMIGO_QUAY_GRABBER — Quay Grabber
**Tipo:** Criatura Aquática | **Ameaça:** Média-Alta

Troll aquático-terrestre de ~2,2m. Pele verde-musgo úmida, coberta de algas e lodo. Corpo mais esguio que o Troll Moss-Belly mas com braços desproporcionalmente longos. Dedos das mãos com membranas e garras para agarrar. Olhos grandes adaptados para visão subaquática. Mandíbula larga. Carrega gancho enferrujado como arma. Goteja água mesmo fora da água.

---

### INIMIGO_CARANGUEJO_GIGANTE — Caranguejo Gigante
**Tipo:** Criatura Aquática | **Ameaça:** Média-Alta

Caranguejo colossal de ~2m de largura. Carapaça azul-violeta escura, dura como rocha, com espinhos ao longo das bordas. Duas garras enormes de tamanhos diferentes — a maior pode esmagar pedra. Olhos em pedúnculo cor de âmbar. Patas articuladas de movimento lateral. Superfície da carapaça com corrosão e cracas, indicando idade extrema. Boca com partes bucais visíveis — claramente capaz de triturar ossos.

---

### GOBLIN_ARQUEIRO — Goblin Arqueiro
**Tipo:** Humanoide Goblin | **Ameaça:** Baixa

Goblin esguio de ~1,0m. Pele verde-amarelada, olhos grandes e amarelos. Orelhas grandes pontudas. Veste gibão de couro fino. Carrega arco pequeno com aljava de flechas improvisadas. Focinho curto com dentes irregulares. Postura de atirador — joelho dobrado, arco levantado.

---

### GOBLIN_BATEDOR — Goblin Batedor
**Tipo:** Humanoide Goblin | **Ameaça:** Baixa

Goblin de ~1,0m, levemente mais ágil e furtivo que o padrão. Mesma aparência base mas com capa de retalhos que serve de disfarce básico. Armado com adaga curta e besta pequena de punho. Postura agachada e espreitante.

---

### GOBLIN_BRUTO — Goblin Bruto
**Tipo:** Humanoide Goblin | **Ameaça:** Baixa-Média

Goblin de ~1,2m, visivelmente mais musculoso e pesado que os outros. Pele verde mais escura, mandíbula mais larga, cicatrizes no rosto. Veste proteções de couro e placas de metal sucateadas. Carrega clava grossa reforçada com pregos.

---

### GOBLIN_LIDER — Goblin Líder
**Tipo:** Humanoide Goblin | **Ameaça:** Média

Goblin de ~1,1m com ares de autoridade. Usa coroa de metal torta (claramente roubada, muito grande para a cabeça). Veste capas coloridas sobrepostas de forma caótica. Armado com espada curta de qualidade real (também roubada). Expressão pomposa. Carrega sininho de latão para dar ordens.

---

## PARTE 6 — SUMÁRIO DE ARQUIVOS NECESSÁRIOS

### Arquivos por personagem

| Personagem | Retrato 512×680 | Sprite Frente | Sprite Costas |
|------------|-----------------|---------------|---------------|
| Guerreiro M/F | ✓ (2 arquivos) | ✓ (2) | ✓ (2) |
| Mago M/F | ✓ (2) | ✓ (2) | ✓ (2) |
| Ladino M/F | ✓ (2) | ✓ (2) | ✓ (2) |
| Clérigo M/F | ✓ (2) | ✓ (2) | ✓ (2) |
| Bárbaro M/F | ✓ (2) | ✓ (2) | ✓ (2) |
| Arqueiro M/F | ✓ (2) | ✓ (2) | ✓ (2) |
| Catherine Laskaris | ✓ | ✓ | — |
| Gregoras Pellos | ✓ | ✓ | — |
| Finn Willowheel | ✓ | ✓ | — |
| Hobbleboot Sam | ✓ | ✓ | — |
| Ruzalka | ✓ | ✓ | — |
| Príncipe Kalos | ✓ | ✓ | — |
| Valmorien | ✓ | ✓ | ✓ |
| Ysoria | ✓ | ✓ | ✓ |
| Wulfram o Chifrado | ✓ | ✓ | — |
| Fariborz o Piromante | ✓ | ✓ | — |
| Mutter Grimmhaar | ✓ | ✓ | — |
| Mac Rónán | ✓ | ✓ | — |
| Muirenn | ✓ | ✓ | — |
| Dvalinn | ✓ | ✓ | — |
| Blunkin Esmaga-Crânios | ✓ | ✓ | ✓ |
| Duque Oswald (Thool) | ✓ | ✓ | ✓ |
| Rei Chutter | ✓ | ✓ | — |
| Aelar Eisenli | ✓ | ✓ | — |
| Choir o Necromante | ✓ | ✓ | — |
| Drizzle | ✓ | ✓ | — |
| Espantalho Assombrado | — | ✓ | ✓ |
| Kobold Azul | — | ✓ | ✓ |
| Elfo Sombrio | — | ✓ | ✓ |
| Grimhollow Thool | — | ✓ | ✓ |
| Manticora Albina | — | ✓ | ✓ |
| Rei Chutter (combate) | — | ✓ | ✓ |
| Larva Gigante | — | ✓ | ✓ |
| Marrowwither | — | ✓ | ✓ |
| Log-Wife | — | ✓ | ✓ |
| Barkthresher | — | ✓ | ✓ |
| Aranha Espectral | — | ✓ | ✓ |
| Javali Ensandecido | — | ✓ | ✓ |
| Esqueleto Lanceiro | — | ✓ | ✓ |
| Golem de Pergaminho | — | ✓ | ✓ |
| Orc Bandido | — | ✓ | ✓ |
| Bugbear Assassino | — | ✓ | ✓ |
| Troll Barriga-de-Musgo | — | ✓ | ✓ |
| Ankle Snapper | — | ✓ | ✓ |
| Mother Clutch | — | ✓ | ✓ |
| Quay Grabber | — | ✓ | ✓ |
| Caranguejo Gigante | — | ✓ | ✓ |
| Goblin Arqueiro | — | ✓ | ✓ |
| Goblin Batedor | — | ✓ | ✓ |
| Goblin Bruto | — | ✓ | ✓ |
| Goblin Líder | — | ✓ | ✓ |

**Total:** 12 retratos de classe + 26 retratos de NPC + 12 sprites de classe (24 c/ costas) + 26 sprites de NPC + 50 sprites de inimigo (25 tipos × 2) = **~150 arquivos de arte**

---

*Documento gerado por Oráculo RPG — revisão pendente após entrega dos retratos atualizados pelo usuário.*
