# Core

Motor universal do Oraculo 2.

Esta pasta deve guardar apenas sistemas que servem para qualquer campanha.

## Modulos previstos

- arena
- combate
- movimento
- turnos
- dados
- carregador_campanha
- leitor_catalogo
- validador_checklist
- gerenciador_assets

## Regra

O core nao deve importar dados fixos de uma campanha especifica. Ele deve receber o id da campanha e carregar tudo a partir de campanhas/id e catalogo/id.
