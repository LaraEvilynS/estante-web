# Estante Web

Interface web em React para o sistema Estante: catálogo de livros, avaliações e estante pessoal de leitura.

Consome a API [estante-api](https://github.com/LaraEvilynS/estante-api).

## Tecnologias e justificativas

- **React**: biblioteca para construir interfaces com componentes reutilizáveis, como pede o desafio.
- **Vite**: ferramenta de build e servidor de desenvolvimento, rápida e simples de configurar.
- **React Router**: criação das rotas e da navegação entre páginas, incluindo páginas restritas a usuários autenticados.
- **Axios**: requisições HTTP à API, com tratamento centralizado de erros e envio do token JWT.
- **ESLint**: padronização e detecção de problemas no código.

## Estrutura de pastas

    src/
      assets/       imagens e ícones
      components/   componentes reutilizáveis (Header, Footer, Menu...)
      pages/        páginas da aplicação
      services/     comunicação com a API
      styles/       estilos globais

## Como executar

Pré-requisitos: Node.js 20 ou superior e npm.

    npm install
    npm run dev

Acesse http://localhost:5173

A API (`estante-api`) precisa estar rodando para as telas funcionarem. As instruções estão no README dela.

## Status

Semana 1: projeto base e estrutura de pastas.
