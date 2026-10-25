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
      components/   componentes reutilizáveis (Cabecalho, Rodape, Layout, RotaProtegida, CartaoLivro, Capa, Nota, Paginacao, CampoFormulario, Carregando, MensagemErro, StatusApi)
      contexts/     estado global de autenticação (AuthProvider)
      hooks/        hooks próprios (useAuth, useCarregar)
      pages/        páginas (Inicio, Livros, LivroDetalhe, Estante, Login, Cadastro, EsqueciSenha, RedefinirSenha, Perfil, NaoEncontrada)
      services/     comunicação com a API (api.js, authService, livroService, avaliacaoService, estanteService, saudeService, tokenStorage)
      styles/       estilos (global.css, formularios.css, catalogo.css)

## Páginas e rotas

| Caminho | Página | Acesso |
|---|---|---|
| `/` | Início (mostra o estado da API) | Público |
| `/livros` | Catálogo com busca e paginação (`?busca=` e `?pagina=` na URL) | Público |
| `/livros/:id` | Detalhe do livro, média de notas e avaliações | Público |
| `/estante` | Minha estante, agrupada por status | **Somente autenticados** |
| `/login`, `/cadastro`, `/esqueci-senha`, `/redefinir-senha` | Autenticação | Público |
| `/perfil` | Minha conta | **Somente autenticados** |

## Como executar

Pré-requisitos: Node.js 20 ou superior, npm e a API `estante-api` rodando (veja o README dela).

    cp .env.example .env
    npm install
    npm run dev

Acesse http://localhost:5173

A variável `VITE_URL_API` (no `.env`) define o endereço da API. O padrão é `http://localhost:3000`.

Na página inicial, o componente "Conexão com a API" consulta a rota `/saude` e mostra o estado da API e do banco. Se a API estiver desligada, aparece uma mensagem de erro com o botão "Tentar novamente".

## Autenticação

As páginas de autenticação estão na tabela de rotas acima. As restritas usam o componente `RotaProtegida`.

- O login recebe um token JWT da API, guardado no `localStorage`, e o `api.js` o envia em todas as requisições. A sessão sobrevive ao recarregar a página: ao abrir o site, o `AuthProvider` confirma o token em `GET /auth/eu`.
- "Sair" apaga o token. Quem tenta abrir `/perfil` sem login é levado para `/login` e volta à página pedida depois de entrar.
- Formulários mostram loading no botão e mensagens de erro vindas da API (ex.: senha curta, credenciais inválidas).
- Para testar a recuperação de senha: peça o link em `/esqueci-senha`, abra o Mailpit em http://localhost:8025 e clique no link do e-mail.
- Limitação: o token no `localStorage` fica exposto a scripts da página (XSS). Aceitável para este projeto; uma alternativa mais segura seria cookie `HttpOnly`.

## Decisões

- Toda chamada HTTP passa pela instância única do Axios (`services/api.js`), que converte falhas em mensagens amigáveis.
- O `Layout` com `Outlet` mantém cabeçalho e rodapé iguais em todas as páginas.
- O hook `useCarregar` centraliza o carregamento de dados (loading, erro e botão "Tentar novamente") nas páginas.
- No celular o menu fica recolhido atrás de um botão; as grades de livros passam de 1 coluna (celular) para várias (tablet e desktop).
- Os livros precisam existir na API para aparecerem: o administrador os cadastra (veja o README da `estante-api`, collection do Postman).
- O estado de login fica em um Context (`AuthProvider`), consumido pelo hook `useAuth`.
- Estilos com variáveis CSS e layout responsivo (mobile, tablet e desktop).

## Status

Semana 1: projeto base e estrutura de pastas.
Semana 2: serviço Axios, componentes básicos, rotas e leitura da API (`/saude`).
Semana 3: login, cadastro, recuperação de senha, sessão e rota protegida.
Semana 4: navegação e layout responsivo, catálogo com busca e paginação, detalhe do livro com avaliações e minha estante (leitura dos dados reais da API).
