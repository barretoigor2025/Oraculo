# Regras de Conversa — Oráculo RPG · Mhoried

> Documento canônico. Toda implementação da narração deve respeitar estas regras.

---

## 1. Modelo de Turno — "B Contextual"

Conversa funciona em **turnos com memória total de contexto**.  
O NPC sempre enxerga o que todos disseram — mesmo quem já saiu da conversa.

### 1.1 Fluxo básico

```
Host inicia cena → NPC faz abertura → ordem de fala determinada
→ Jogador fala → NPC responde → próximo jogador
→ qualquer um pode marcar SATISFEITO a qualquer momento
→ quando restar 0 ativos, cena termina (ou host avança manualmente)
```

### 1.2 Ordem de fala

- Determinada pelo **host** na abertura da cena  
- Ou rolada: **1d20 + mod_CAR** (maior vai primeiro)  
- Ordem é visível a todos (indicador no topo da tela)

### 1.3 Token de fala

Cada jogador na sua vez pode:

| Ação | Efeito |
|------|--------|
| **FALAR** | Envia mensagem, NPC responde, passa para o próximo |
| **PASSAR** | Pula o turno desta rodada sem sair |
| **SATISFEITO ✓** | Sai da fila ativa — não recebe mais turnos automaticamente |

### 1.4 Reengajamento pelo NPC

O NPC pode **puxar de volta** um jogador marcado como SATISFEITO se:
- O contexto do diálogo atual tocou em algo diretamente relacionado àquele jogador
- O NPC quer confrontar, revelar algo ou pedir algo especificamente a ele
- Um `gatilho_reengajamento` definido no perfil do NPC foi acionado

Quando isso acontece: o jogador aparece com um indicador `↩ {NPC} quer falar com você` — pode aceitar ou ignorar.

### 1.5 Resposta da IA

A IA (NPC) responde **após cada fala individual**. O prompt enviado inclui:
- `[SYSTEM]` — perfil completo do NPC (carregado do `dados.json`)
- `[CONTEXTO DE CENA]` — o que aconteceu antes (resultado da batalha, etc.)
- `[HISTÓRICO]` — últimas N falas de todos os jogadores + respostas do NPC
- `[TURNO ATUAL]` — quem falou + o que disse + status dos outros jogadores

---

## 2. Dados — Persuasão, Intimidação, Blefe

Quando um jogador tenta **convencer**, **intimidar** ou **enganar** um NPC, o sistema pede uma rolagem.

### 2.1 Quando rolar

O host (ou automaticamente quando detectado) ativa o dado nos seguintes casos:
- Pedido que vai contra os interesses do NPC
- Tentativa de recrutar NPC para o grupo
- Negociação de preço, troca ou aliança
- Revelar um segredo do NPC
- Ameaçar ou intimidar

### 2.2 Tipos de rolagem e atributo base

| Tentativa | Atributo | Exemplo |
|-----------|----------|---------|
| Persuasão | CAR (CHA) | "Junte-se a nós, juntos somos mais fortes" |
| Intimidação | FOR (STR) | "Se não ajudar, vai se arrepender" |
| Blefe/Enganar | INT (INT) | "Já sabemos seu segredo de qualquer forma" |
| Apelo emocional | SAB (WIS) | Tocar na dor pessoal do NPC |

**Fórmula:** `1d20 + modificador_do_atributo` vs **DC do NPC** (`resistencia_persuasao` ou `resistencia_intimidacao`)

### 2.3 Graus de sucesso

| Resultado | Efeito |
|-----------|--------|
| Roll ≥ DC + 5 | **Sucesso crítico** — NPC concede mais do que pedido, +1 disposição |
| Roll ≥ DC | **Sucesso** — NPC concede o que foi pedido |
| Roll = DC − 1 a DC − 4 | **Falha** — NPC nega, mas permanece aberto |
| Roll ≤ DC − 5 | **Falha crítica** — NPC fica mais desconfiado/hostil, −1 disposição |

### 2.4 Disposição do NPC

A disposição muda dinamicamente e afeta DCs futuros:

```
hostil (DC+4) → desconfiado (DC+2) → neutro (DC base) → receptivo (DC−2) → amigável (DC−4)
```

### 2.5 Recrutamento para o grupo

NPCs com `pode_juntar_grupo: true` podem ser recrutados. Requer:
1. Disposição mínima **receptivo**
2. Roll de persuasão acima do `dc_recrutar` (geralmente DC+4 do normal)
3. Condição narrativa específica em `condicao_juntar` atendida

Quando recrutado: NPC aparece como unidade aliada no arena, com seus próprios stats.

---

## 3. Schema do bloco `ia` em `dados.json`

```json
"ia": {
  "papel": "descrição curta do papel na história",
  "personalidade": "2-3 frases do núcleo do personagem",
  "forma_de_falar": "vocabulário, ritmo, maneirismos, tom",
  "estado_emocional_base": "como está emocionalmente neste ponto da campanha",
  "objetivos": ["objetivo 1", "objetivo 2"],
  "crencas_e_valores": ["crença central 1", "crença central 2"],
  "segredos": ["segredo que afeta comportamento"],
  "gatilhos_positivos": ["o que agrada / aumenta confiança"],
  "gatilhos_negativos": ["o que ofende / irrita"],
  "pode_juntar_grupo": false,
  "dc_recrutar": null,
  "condicao_juntar": null,
  "resistencia_persuasao": 12,
  "resistencia_intimidacao": 14,
  "disposicao_inicial": "neutro",
  "reacoes_especiais": {
    "ameaca": "como reage a ameaças",
    "suborno": "como reage a ofertas de ouro",
    "apelo_emocional": "como reage a apelos emocionais",
    "logica_e_razao": "como reage a argumentos racionais"
  },
  "gatilhos_reengajamento": ["condição que puxa jogador satisfeito de volta"],
  "prompt_sistema": "parágrafo completo enviado à IA como system prompt"
}
```

---

## 4. Implementação mecânica

### 4.1 Firebase — estado da conversa

```
room.narration.conversa: {
  npcId: "npc_gregoras_pellos",
  turnoAtual: "playerId_X",
  ordemTurnos: ["playerId_X", "playerId_Y"],
  playerStatus: {
    "playerId_X": "ativo",       // ativo | satisfeito | reengajado
    "playerId_Y": "satisfeito"
  },
  disposicaoNpc: "neutro",
  historico: [
    { de: "playerId_X", nome: "Bárbaro", texto: "...", ts: 12345 },
    { de: "npc", texto: "...", ts: 12346 }
  ],
  dadosPendentes: null,          // null | { tipo, dc, playerId, aguardando }
  reengajarPlayerId: null        // null | playerId sendo chamado de volta
}
```

### 4.2 Carregamento do perfil do NPC

Antes de iniciar a conversa:
1. Carregar `dados.json` do NPC via fetch
2. Extrair bloco `ia`
3. Montar `prompt_sistema` com contexto da cena atual
4. Enviar para Groq como `role: "system"`

### 4.3 Prompt template

```
{ia.prompt_sistema}

CONTEXTO DA CENA ATUAL:
{cena.descricao_atual}

ESTADO DA CONVERSA:
- Disposição atual com o grupo: {disposicaoNpc}
- Jogadores presentes: {lista_jogadores_com_classes}
- Jogadores ainda ativos: {lista_ativos}

HISTÓRICO RECENTE:
{ultimas_10_falas}

Fala agora como {npc.nome}. Seja fiel ao personagem acima. 
Responda em português. Máximo 3 frases por resposta.
Se a situação pedir rolagem de dados, termine com: [PEDE_DADO: persuasão|intimidação|blefe DC{n}]
Se quiser puxar um jogador satisfeito de volta, termine com: [REENGAJA: {nome_do_jogador}]
Se a cena deve terminar, termine com: [FIM_CENA]
```

---

## 5. Inimigos falantes

Inimigos podem falar se tiverem o bloco `ia` nos seus `dados.json`. Regras iguais às dos NPCs.

Candidatos naturais:
- **Goblin Líder** — negocia para salvar o bando
- **Grimhollow Thool** — memórias do humano que foi, confuso
- **Rei Chutter (NPC)** — vilão que discursa antes do combate
- **Choir, o Necromante** — monologa sobre sua filosofia

---

*Versão 1.0 — Criado em conjunto com o desenvolvimento do Oráculo RPG*
