# Oraculo

Nova base do RPG **Oraculo**, reconstruída do zero com foco em estabilidade, modularidade e multiplayer simples via Firebase.

## Objetivo da primeira versão

Criar uma base mínima jogável onde:

- jogadores entram/criam uma sala;
- cada jogador escolhe uma classe;
- todos aparecem em um mapa em grid;
- o turno alterna entre jogadores;
- o jogador do turno pode se mover;
- o estado fica salvo/sincronizado no Firebase.

## Tecnologias

- Vite
- JavaScript modular
- Firebase Firestore
- HTML/CSS simples para prototipagem rápida

## Rodar localmente

```bash
npm install
npm run dev
```

Crie um arquivo `.env` baseado no `.env.example` e preencha as chaves do Firebase.

## Filosofia da reconstrução

Este repositório não tenta remendar versões antigas. A ideia é reconstruir o Oraculo com uma base limpa:

- Firebase guarda estado compartilhado;
- regras do jogo ficam separadas;
- UI apenas renderiza o estado;
- cada sistema tem arquivo próprio;
- primeiro funciona, depois fica bonito.
