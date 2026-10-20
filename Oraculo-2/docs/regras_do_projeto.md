# Regras do Projeto Oraculo 2

## Conceito

O Oraculo e o console. A campanha e o cartucho. O catalogo e o conteudo instalado daquele cartucho.

## Regras obrigatorias

1. O core nao pode depender de uma campanha especifica.
2. Cada campanha precisa ter uma pasta em campanhas e outra em catalogo.
3. Todo asset usado pelo catalogo deve ficar dentro do catalogo da propria campanha.
4. Toda entidade viva deve ter pasta propria.
5. Portrait passa a ser chamado de retrato.
6. A peca de tabuleiro e o asset principal para movimentacao no mapa.
7. O checklist valida se a campanha esta pronta para jogar.
8. A arena deve ler dados e assets a partir da campanha carregada.

## Estrutura base

- core: motor universal do Oraculo.
- campanhas: material original e roteiro.
- catalogo: fichas, assets, cenarios e checklist.
- docs: regras e templates.
