# Painel de Investigação — spec acordado

Feature para **cenas de investigação sem NPC** (ex.: `carroça_tombada`). Hoje essas
cenas caem na tela básica do Narrador; a ideia é subir um painel dedicado, no mesmo
padrão visual do diálogo (fundo da cena + neblina + painel embaixo).

## Duas janelas (abas no painel — o jogador alterna)

1. **💬 Bate-papo (livre)**
   - Conversa livre entre os players (combinar plano, especular).
   - Log próprio, **sem IA** — papo de mesa puro.
   - Mensagens append-only (nunca re-renderiza a tela toda).

2. **🔍 Ação (julgada pela IA)**
   - Jogador digita o que tenta fazer ("reviro a caixa", "sigo o rastro pro norte").
   - A **IA (Narrador) julga e narra o resultado** (usa a chave Groq como o resto do jogo; fallback sem chave).
   - **🎲 Percepção** é um botão desta aba.
   - Se a percepção **falhar, dá pra continuar tentando outras ações** — não trava a cena.

## Outros requisitos

- **🚪 Sair** — botão de saída (mapa / próxima cena).
- **Sem tremedeira de tela** — log append-only, sem re-render global (mesmo cuidado da
  correção do loop de percepção: nada de refazer a tela a cada update).
- **Ativação**: cenas de investigação sem NPC. Marcar via flag `investigacao: true` na
  cena do `campaign.js`, ou auto-detectar `!npcsPresentes.length && tipo ∈ {descoberta, exploracao}`.

## Notas de implementação

- Reaproveitar a estrutura do overlay de diálogo (`#dial-*`) — fundo `#dial-cena-bg`
  (já tem neblina), painel inferior, campo de texto.
- Adicionar troca de aba (Chat | Ação) sem recriar o DOM — só alternar `display`.
- Adjudicação de ação: prompt de sistema "Você é o Narrador; o grupo tentou X; narre o
  resultado plausível em 1-3 frases, sem decidir por eles" + contexto da cena
  (`descricaoContexto`, itens ocultos). Reusar o padrão de `_gerarAtmosferaPercepcao`.
- Persistir os dois logs no doc da sala (Firebase) para multiplayer — chat e ações
  como listas separadas, append-only.
