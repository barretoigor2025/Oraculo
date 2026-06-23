# Oráculo RPG — Claude Code

Antes de qualquer tarefa relacionada a campanhas, pilares ou instalação, leia **`docs/o_oraculo.md`**.  
Ele contém a arquitetura completa, os quatro pilares, os schemas de dados e todas as regras do sistema.

## Estrutura principal do repositório

```
public/
  catalog.html              ← Catálogo (enciclopédia, pilar 3)
  arena.html                ← Arena (motor de batalha, pilar 4)
  narration.html            ← Narrador ao vivo via Firebase (pilar 2)
  simulacao_dialogo.html    ← Simulação de diálogo (carrega campanha do localStorage)
  campanha_builder.html     ← Builder manual (formulário auxiliar)
  catalogo/
    mhoried/                ← Campanha de referência (padrão visual e técnico)
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
5. Registre a campanha no seletor do `catalog.html`
6. Entregue o checklist de assets (arte) a criar
7. Commit e push

## Regra de ouro

Nunca inventar elementos de fora do universo da campanha.  
Expansão canônica sim — crossover não. Detalhes em `docs/o_oraculo.md`.
