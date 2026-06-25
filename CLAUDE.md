# Oráculo RPG — Claude Code

Antes de qualquer tarefa relacionada a campanhas, pilares ou instalação, leia **`docs/o_oraculo.md`**.  
Ele contém a arquitetura completa, os **cinco pilares**, os schemas de dados e todas as regras do sistema.

## Os cinco pilares

1. **Construtor** — lê o PDF e gera a campanha (é Claude, aqui)
2. **Narrador** (`narration.html`) — voz viva dos NPCs; descobre NPCs por `npcsPresentes`
3. **Catálogo** (`catalog.html`) — enciclopédia + checklist de assets
4. **Arena** (`arena.html`) — motor de batalha em grid hexagonal
5. **Mapa do Mundo** (`mapa.html`) — lobby/chat/votação de rota; ao viajar, dispara o Narrador na cena de destino (`narration.cenaId`). Fecha o ciclo de jogo.

## Estrutura principal do repositório

```
public/
  catalog.html              ← Catálogo (enciclopédia, pilar 3)
  arena.html                ← Arena (motor de batalha, pilar 4)
  narration.html            ← Narrador ao vivo via Firebase (pilar 2)
  mapa.html                 ← Mapa do Mundo / lobby (pilar 5) — viagem sincroniza narration.cenaId
  simulacao_dialogo.html    ← Simulação de diálogo (carrega campanha do localStorage)
  campanha_builder.html     ← Builder manual (formulário auxiliar — DESATUALIZADO: não gera npcsPresentes, npcs_registry.js nem mapa.js)
  catalogo/
    mhoried/                ← Campanha de referência (padrão visual e técnico)
      narracao.js           ← NARRACAO_NPCS curado (poucos NPCs), NARRACAO_CENAS, NARRACAO_FLUXO
      npcs_registry.js      ← NPCS_REGISTRY auto-gerado (todos os NPCs da campanha via dados.json)
      mapa.js               ← MAPA_IMG, NOS, CAMINHOS (config do Mapa do Mundo, pilar 5)
      mapa/mapa_{id}.png    ← imagem do mundo (~2:1, scroll horizontal)
    death-note/             ← Segunda campanha instalada
    fantasma/               ← Campanha placeholder (esqueleto vazio)
    {nova-campanha}/        ← Toda campanha nova segue esta estrutura
docs/
  o_oraculo.md              ← Documento fundador — leia antes de qualquer campanha
```

## Branch de desenvolvimento

Desenvolver em `claude/firebase-setup-check-ThkUc`, depois merge para `main` (GitHub Pages).

## Quando receber um PDF para instalar uma campanha

1. Leia `docs/o_oraculo.md` completamente
2. Analise o PDF — entenda o universo, personagens, história, regras especiais
3. Siga o **Fluxo de Instalação** documentado em `docs/o_oraculo.md`
4. Gere todos os arquivos em `public/catalogo/{campaign-id}/`
5. Cada cena no `campaign.js` precisa de `npcsPresentes` (IDs dos NPCs da cena)
6. Gere `npcs_registry.js` com todos os NPCs (leia os `dados.json` e exporte `NPCS_REGISTRY`)
7. Gere `mapa.js` (Pilar 5) — `NOS` + `CAMINHOS`; **os IDs dos nós devem ser IDs de cena do `campaign.js`**
8. Registre a campanha no seletor do `catalog.html` (menu + imports + paleta + branches)
9. Entregue o checklist de assets (arte) a criar — incluindo a imagem do mundo `mapa/{id}_mapa.png`
10. Commit e push (dev → merge `main`)

## Regra de ouro

Nunca inventar elementos de fora do universo da campanha.  
Expansão canônica sim — crossover não. Detalhes em `docs/o_oraculo.md`.
