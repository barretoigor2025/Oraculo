# Prompts de Criaturas — Oráculo / Mhoried

Documento para gerar as **peças de tabuleiro (standees) das criaturas** na IA de imagem.
Cada criatura tem: **nome do arquivo**, **porte** e um **prompt pronto pra colar**.

---

## ⚙️ INSTRUÇÕES GLOBAIS — valem para TODAS as imagens

1. **Fundo chroma key — VERDE EXATO `#00FF00` (RGB 0, 255, 0).**
   Preenchimento 100% chapado e uniforme: **sem gradiente, sem sombra projetada no fundo, sem vinheta, sem chão**. (Esse verde vai ser removido e virar **fundo transparente/alfa**.)
   - ⚠️ **Nenhuma parte da criatura pode usar esse verde puro `#00FF00`.** Criaturas de tom verde devem usar **verde-musgo, oliva, verde-escuro ou azulado** — nunca o verde do fundo (senão o corpo some junto com o fundo).

2. **Enquadramento:** corpo inteiro, criatura **centralizada**, base/pés perto da **borda inferior**, vista **frontal 3/4** encarando o observador. A criatura preenche **~85% da altura** do quadro.

3. **Canvas:** **1024 × 1024** (quadrado, 1:1). Uma criatura por imagem.

4. **Estilo:** dark fantasy de RPG, pintura digital detalhada, iluminação dramática e coerente entre todas (mesmo padrão do jogo). **Sem texto, sem moldura, sem cenário** — só a criatura sobre o verde.

5. **NOME DO ARQUIVO (crucial):** salvar **exatamente** com o id indicado em cada bloco, `.png`.
   Ex.: `javali_ensandecido.png`. **Um arquivo por criatura, sem número/sufixo extra.**
   Assim eu já sei quem é quem sem confusão.

> Quando as imagens voltarem, eu faço: (a) removo o verde `#00FF00` → alfa; (b) recorto/centralizo; (c) aplico o **porte** (escala no tabuleiro) de cada uma. Por isso todas saem no mesmo enquadramento — o tamanho relativo eu controlo depois pelo campo `porte`/`escala`.

---

## 📏 TABELA DE PORTES (tamanho no tabuleiro)

| Porte | SM (GURPS) | Escala no tabuleiro | Referência |
|-------|:---------:|:-------------------:|-----------|
| **Pequeno** | −1 | 0.75× | kobold, criatura sub-humana |
| **Normal** | 0 | 1.00× | humano / humanoide |
| **Médio** | 0–1 | 1.20× | volumoso, mais alto que um humano |
| **Grande** | +1 | 1.55× | ~2–2,5 m, fera grande |
| **Enorme** | +2 | 2.00× | ~3 m+, boss / massa colossal |

*(O porte já está anotado em cada criatura. Enquadramento continua igual pra todas — a escala é aplicada no jogo.)*

---

## 🧟 CRIATURAS

### 1. Javali Ensandecido — `javali_ensandecido.png` — **GRANDE**
> A colossal maddened wild boar corrupted by dark forest magic, bristly matted fur, glowing enraged eyes, foaming tusked maw, a **broken spear shaft still embedded in its back** with a rusted metal prosthetic hand clamped onto it, mid-charge stance, muscular and menacing. Dark fantasy RPG creature art, dramatic lighting, full body, centered, character fills ~85% of frame, flat solid **chroma-key green #00FF00** background (no shadows/gradient), 1024×1024.

### 2. Kobold Azul — `kobold_azul.png` — **PEQUENO**
> A small agile dark-blue-skinned kobold soldier, reptilian, sharp teeth, crude leather armor and a jagged short blade, sly treacherous grin, crouched ready to strike. Dark fantasy RPG creature art, dramatic lighting, full body, centered, character fills ~85% of frame, flat solid **chroma-key green #00FF00** background (no shadows/gradient), 1024×1024.

### 3. Aranha Espectral (Wraithweaver) — `wraithweaver_spider.png` — **NORMAL**
> A spectral spider made of bleached bone and ember-glowing eyes, translucent limbs weaving strands of ghostly spectral energy, eerie blue-green wisps trailing (muted, NOT pure green), skeletal and menacing. Dark fantasy RPG creature art, dramatic lighting, full body, centered, fills ~85% of frame, flat solid **chroma-key green #00FF00** background (no shadows/gradient), 1024×1024.

### 4. Elfo Sombrio — `elfo_sombrio.png` — **NORMAL**
> A dark elf Voornsworn warrior of the Blackwoods, ash-grey skin, white hair, red eyes, black leather-and-bone armor, a curved black blade and a bow, cold predatory stance. Dark fantasy RPG creature art, dramatic lighting, full body, centered, fills ~85% of frame, flat solid **chroma-key green #00FF00** background (no shadows/gradient), 1024×1024.

### 5. Espantalho Assombrado — `espantalho_assombrado.png` — **NORMAL**
> A haunted scarecrow animated by necromancy, ragged burlap sack head with stitched eyes glowing faint sickly light, straw bursting from torn sleeves, tattered farmer's clothes, twig-clawed hands, looming and unnatural. Dark fantasy RPG creature art, dramatic lighting, full body, centered, fills ~85% of frame, flat solid **chroma-key green #00FF00** background (no shadows/gradient), 1024×1024.

### 6. Esqueleto Lanceiro — `esqueleto_lanceiro.png` — **NORMAL**
> An undead skeletal spearman, bones with a greenish patina of death (muted olive, NOT pure green), fragments of medieval armor still clinging to the frame, **eyes of green flame** (dim, not #00FF00), gripping a long spear, standing guard eternally. Dark fantasy RPG creature art, dramatic lighting, full body, centered, fills ~85% of frame, flat solid **chroma-key green #00FF00** background (no shadows/gradient), 1024×1024.

### 7. Choir, o Necromante — `alquimista_choir.png` — **NORMAL**
> A pale calculating necromancer, gaunt face, sunken cold eyes, long dark hooded robes with bone ornaments, one hand raised channeling sickly necrotic energy, aloof and sinister. Dark fantasy RPG villain art, dramatic lighting, full body, centered, fills ~85% of frame, flat solid **chroma-key green #00FF00** background (no shadows/gradient), 1024×1024.

### 8. Demônio do Vulkrundshard (Thamazul) — `demonio_vulkrundshard.png` — **NORMAL**
> A demonic entity 'Thamazul the Thief' half-manifesting out of a glowing volcanic-black stone shard, smoky sinuous form, cunning seductive expression, ember cracks across its body, wisps of dark fire. Dark fantasy RPG creature art, dramatic lighting, full body, centered, fills ~85% of frame, flat solid **chroma-key green #00FF00** background (no shadows/gradient), 1024×1024.

### 9. Golem de Pergaminho — `golem_de_pergaminho.png` — **NORMAL**
> A golem constructed from hundreds of interwoven enchanted scrolls and parchment, humanoid shape wrapped in scrawled magical scriptures faintly glowing, papery limbs, guardian posture. Dark fantasy RPG construct art, dramatic lighting, full body, centered, fills ~85% of frame, flat solid **chroma-key green #00FF00** background (no shadows/gradient), 1024×1024.

### 10. Marrowwither — `marrowwither.png` — **NORMAL**
> An amorphous fleshy horror, a writhing sack of living flesh with **multiple gaping mouths** and fast whipping tentacles, glistening sinew, born of necromancy, grotesque and fast. Dark fantasy RPG creature art, dramatic lighting, full body, centered, fills ~85% of frame, flat solid **chroma-key green #00FF00** background (no shadows/gradient), 1024×1024.

### 11. Log-Wife — `log_wife.png` — **NORMAL**
> A malevolent forest spirit inhabiting a rotting mushroom-covered log, vaguely feminine face and clawed limbs forming from the bark and fungus, luring sorrowful expression, dripping decay, muted moss and brown tones (NOT pure green). Dark fantasy RPG creature art, dramatic lighting, full body, centered, fills ~85% of frame, flat solid **chroma-key green #00FF00** background (no shadows/gradient), 1024×1024.

### 12. Barkthresher — `barkthresher.png` — **GRANDE**
> A 2.5-meter living-wood elemental, twisted trunk body, long gnarled branch-arms like flails, **glowing amber eyes**, bark and moss texture in dark brown and muted olive (NOT pure green), towering and wrathful. Dark fantasy RPG creature art, dramatic lighting, full body, centered, fills ~85% of frame, flat solid **chroma-key green #00FF00** background (no shadows/gradient), 1024×1024.

### 13. Caranguejo Gigante (Mudwallower) — `caranguejo_gigante.png` — **GRANDE**
> A colossal 2-meter-wide crab, spiny blue-violet carapace, **two asymmetric claws** (one massive enough to crush stone), beady eyes on stalks, dripping mud, aggressive stance. Dark fantasy RPG creature art, dramatic lighting, full body, centered, fills ~85% of frame, flat solid **chroma-key green #00FF00** background (no shadows/gradient), 1024×1024.

### 14. Grimhollow Thool — `grimhollow_thool.png` — **GRANDE**
> A monstrous ogre-like brute, a human transformed into a hulking thool by sorcery, hunched muscular grey-green mottled body (muted, NOT pure green), pained tortured face resisting the beast within, oversized fists, chains and rags. Dark fantasy RPG creature art, dramatic lighting, full body, centered, fills ~85% of frame, flat solid **chroma-key green #00FF00** background (no shadows/gradient), 1024×1024.

### 15. Manticora Albina — `manticora_albina.png` — **GRANDE**
> An albino manticore, pale white lion body, leathery bat wings, a **scorpion tail**, snarling humanoid-lion face with rows of teeth, patches of sickly infection, apex predator prowling. Dark fantasy RPG creature art, dramatic lighting, full body, centered, fills ~85% of frame, flat solid **chroma-key green #00FF00** background (no shadows/gradient), 1024×1024.

### 16. Quay Grabber — `quay_grabber.png` — **GRANDE**
> An aquatic-terrestrial troll, moss-green skin draped with algae (muted olive, NOT pure green), **disproportionately long arms**, wet glistening hide, clutching a rusted grappling hook, hunched and lurking. Dark fantasy RPG creature art, dramatic lighting, full body, centered, fills ~85% of frame, flat solid **chroma-key green #00FF00** background (no shadows/gradient), 1024×1024.

### 17. Larva Gigante — `larva_gigante.png` — **ENORME**
> A colossal pale grub larva, segmented glistening body oozing acidic fluid, small circular fanged maw, blind and bloated, monstrously large. Dark fantasy RPG creature art, dramatic lighting, full body, centered, fills ~85% of frame, flat solid **chroma-key green #00FF00** background (no shadows/gradient), 1024×1024.

### 18. Mother Clutch — `mother_clutch.png` — **ENORME**
> A rolling colossal mass of intertwined corpse limbs and torsos fused by necromancy, dozens of grasping arms and screaming faces forming a churning sphere of undead flesh, horrifying. Dark fantasy RPG creature art, dramatic lighting, full body, centered, fills ~85% of frame, flat solid **chroma-key green #00FF00** background (no shadows/gradient), 1024×1024.

### 19. Rei Chutter — `rei_chutter.png` — **ENORME** (Boss final)
> A two-headed ettin king, over 3 meters tall, two grim faces atop massive shoulders, ancient arcane runes and regalia, wielding a huge weapon, crackling ancestral magic around him, imposing final-boss presence. Dark fantasy RPG boss art, dramatic lighting, full body, centered, fills ~85% of frame, flat solid **chroma-key green #00FF00** background (no shadows/gradient), 1024×1024.

---

## ✅ Checklist ao me devolver as imagens
- [ ] 19 arquivos, cada um nomeado `{id}.png` (a lista acima).
- [ ] Fundo verde `#00FF00` chapado e uniforme.
- [ ] Corpo inteiro, centralizado, ~85% do quadro, 1024×1024.
- [ ] Nenhum verde `#00FF00` no corpo da criatura.

Com isso eu removo o chroma, aplico o porte de cada uma e coloco no tabuleiro.
