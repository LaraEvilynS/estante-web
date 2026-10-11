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
      components/   componentes reutilizáveis (Cabecalho, Rodape, Layout, Carregando, MensagemErro, StatusApi)
      pages/        páginas da aplicação (Inicio, Livros, NaoEncontrada)
      services/     comunicação com a API (api.js com Axios, saudeService.js)
      styles/       estilos globais (global.css)

## Como executar

Pré-requisitos: Node.js 20 ou superior, npm e a API `estante-api` rodando (veja o README dela).

    cp .env.example .env
    npm install
    npm run dev

Acesse http://localhost:5173

A variável `VITE_URL_API` (no `.env`) define o endereço da API. O padrão é `http://localhost:3000`.

Na página inicial, o componente "Conexão com a API" consulta a rota `/saude` e mostra o estado da API e do banco. Se a API estiver desligada, aparece uma mensagem de erro com o botão "Tentar novamente".

## Decisões

- Toda chamada HTTP passa pela instância única do Axios (`services/api.js`), que converte falhas em mensagens amigáveis.
- O `Layout` com `Outlet` mantém cabeçalho e rodapé iguais em todas as páginas.
- Estilos com variáveis CSS e layout responsivo (mobile, tablet e desktop).

## Status

Semana 1: projeto base e estrutura de pastas.
Semana 2: serviço Axios, componentes básicos, rotas e leitura da API (`/saude`).
