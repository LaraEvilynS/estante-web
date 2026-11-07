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
      components/   componentes reutilizáveis (Cabecalho, Rodape, Layout, RotaProtegida, RotaAdmin, CartaoLivro, Capa, Nota, Paginacao, AcoesEstante, FormularioAvaliacao, ItemAvaliacao, BuscaOpenLibrary, CampoFormulario, CampoArea, Carregando, MensagemErro, StatusApi)
      contexts/     estado global: login (AuthProvider) e avisos de sucesso (AvisoProvider)
      hooks/        hooks próprios (useAuth, useCarregar, useAcao, useAviso)
      pages/        páginas (Inicio, Livros, LivroDetalhe, Estante, Login, Cadastro, EsqueciSenha, RedefinirSenha, Perfil, AdminLivroForm, AdminUsuarios, NaoEncontrada)
      services/     comunicação com a API (api.js, authService, livroService, avaliacaoService, estanteService, usuarioService, saudeService, tokenStorage)
      styles/       estilos (global.css, formularios.css, catalogo.css, acoes.css, avisos.css)
      utils/        constantes e funções auxiliares (status.js)

## Páginas e rotas

| Caminho | Página | Acesso |
|---|---|---|
| `/` | Início (mostra o estado da API) | Público |
| `/livros` | Catálogo com busca e paginação (`?busca=` e `?pagina=` na URL) | Público |
| `/livros/:id` | Detalhe do livro, avaliações e ações (estante e avaliar) | Público para ver; ações exigem login |
| `/estante` | Minha estante: mudar status e remover | **Somente autenticados** |
| `/perfil` | Minha conta: editar nome, alterar senha, excluir conta | **Somente autenticados** |
| `/admin/livros/novo` | Cadastrar livro (com busca na Open Library) | **Somente administrador** |
| `/admin/livros/:id/editar` | Editar livro | **Somente administrador** |
| `/admin/usuarios` | Listar e excluir usuários | **Somente administrador** |
| `/login`, `/cadastro`, `/esqueci-senha`, `/redefinir-senha` | Autenticação | Público |

## CRUD pela interface

| Entidade | Criar | Ler | Atualizar | Excluir |
|---|---|---|---|---|
| Usuário | `/cadastro` | `/perfil`, `/admin/usuarios` | `/perfil` (nome e senha) | `/perfil` (própria conta); `/admin/usuarios` (admin) |
| Livro | `/admin/livros/novo` (admin) | `/livros`, `/livros/:id` | `/admin/livros/:id/editar` (admin) | `/livros/:id` (admin) |
| Item da estante | `/livros/:id` ("Adicionar à estante") | `/estante` | `/estante` e `/livros/:id` (status) | `/estante` e `/livros/:id` |
| Avaliação | `/livros/:id` (só para livro lido) | `/livros/:id` | `/livros/:id` (só o dono) | `/livros/:id` (dono ou admin) |

Os botões só aparecem para quem pode usá-los, mas a API é quem garante as permissões: se uma regra for violada (ex.: avaliar um livro não lido), a mensagem da API é exibida.

## Como executar

**Pré-requisitos:** Node.js 20 ou superior, npm e a API `estante-api` rodando (siga o README dela: `docker compose up --build`). A API precisa estar no endereço de `VITE_URL_API`, e o front precisa estar no endereço de `URL_FRONTEND` da API (`http://localhost:5173` por padrão), senão o CORS bloqueia as chamadas.

1. Instale as dependências e crie o arquivo de ambiente:

       npm install
       cp .env.example .env

2. Inicie o site:

       npm run dev

3. Acesse http://localhost:5173

A variável `VITE_URL_API` (no `.env`) define o endereço da API. O padrão é `http://localhost:3000`.

Outros comandos: `npm run lint` (verificação de código) e `npm run build` (versão de produção).

Na página inicial, o componente "Conexão com a API" consulta a rota `/saude` e mostra o estado da API e do banco. Se a API estiver desligada, aparece uma mensagem de erro com o botão "Tentar novamente".

## Roteiro para testar todas as telas

Com a API e o site rodando (cada ação que altera dados mostra um aviso verde de sucesso no canto da tela):

1. **Administrador:** em **Entrar**, use `admin@estante.local` e a `ADMIN_SENHA` definida no `.env` da API. O menu passa a mostrar **Minha estante** e **Usuários**.
2. **Cadastrar livro:** **Livros > Cadastrar livro**. Digite um título em **Buscar na Open Library**, clique em **Usar este livro** e depois em **Cadastrar livro** (ou preencha à mão). Na página do livro, teste **Editar livro**.
3. **Usuário comum:** clique em **Sair**, depois em **Cadastrar** e crie uma conta (o login é automático).
4. **Estante:** abra um livro, escolha um status e clique em **Adicionar à estante**. Veja o resultado em **Minha estante**, onde dá para mudar o status e remover.
5. **Avaliar:** mude o status do livro para **Lido** e publique uma avaliação. Teste **Editar** e **Excluir**. Com a avaliação criada, tente mudar o status para **Lendo**: a API recusa e a mensagem aparece.
6. **Minha conta:** edite o nome, altere a senha (você volta ao login) e, em uma conta de teste, use **Excluir conta**.
7. **Moderação:** entre como administrador, abra um livro avaliado e use **Excluir (moderação)** na avaliação de outra pessoa. Em **Usuários**, exclua uma conta de teste.
8. **Recuperação de senha:** em **Entrar > Esqueci minha senha**, informe o e-mail da conta, abra o Mailpit (http://localhost:8025) e clique no link do e-mail.
9. **Erros e carregamento:** pare a API (`docker compose stop api`), atualize qualquer página e veja a mensagem com **Tentar novamente**. Suba de novo com `docker compose start api`.
10. **Responsivo:** abra as ferramentas do navegador (F12), ative o modo de dispositivo e teste celular, tablet e desktop. No celular o menu vira o botão ☰.

## Autenticação

As páginas de autenticação estão na tabela de rotas acima. As restritas usam o componente `RotaProtegida`.

- O login recebe um token JWT da API, guardado no `localStorage`, e o `api.js` o envia em todas as requisições. A sessão sobrevive ao recarregar a página: ao abrir o site, o `AuthProvider` confirma o token em `GET /auth/eu`.
- "Sair" apaga o token. Quem tenta abrir `/perfil` sem login é levado para `/login` e volta à página pedida depois de entrar.
- Se a API recusar o token (sessão expirada, conta excluída ou senha trocada), o `api.js` avisa o `AuthProvider`, que encerra a sessão: a pessoa é levada ao login, com a mensagem "Sua sessão expirou". Depois de **alterar a senha**, a sessão atual também é encerrada e é preciso entrar com a nova senha.
- Formulários mostram loading no botão e mensagens de erro vindas da API (ex.: senha curta, credenciais inválidas). As ações que alteram dados mostram um aviso verde de sucesso no canto da tela (ex.: "Avaliação publicada.").
- Para testar a recuperação de senha: peça o link em `/esqueci-senha`, abra o Mailpit em http://localhost:8025 e clique no link do e-mail.
- Limitação: o token no `localStorage` fica exposto a scripts da página (XSS). Aceitável para este projeto; uma alternativa mais segura seria cookie `HttpOnly`.

## Decisões

- Toda chamada HTTP passa pela instância única do Axios (`services/api.js`), que converte falhas em mensagens amigáveis.
- O `Layout` com `Outlet` mantém cabeçalho e rodapé iguais em todas as páginas.
- O hook `useCarregar` centraliza a leitura de dados (loading, erro e "Tentar novamente"); ao recarregar, mantém os dados na tela até chegarem os novos.
- O hook `useAcao` centraliza as ações de escrita (criar, atualizar, excluir): controla o estado "processando" (botões desabilitados), a mensagem de erro da API e, quando recebe uma mensagem de sucesso, dispara o aviso.
- Os avisos de sucesso ficam em um Context (`AvisoProvider`), acima das rotas: continuam na tela mesmo quando a ação leva a outra página (ex.: depois de cadastrar um livro). Somem sozinhos em 4 segundos ou no botão ×.
- Exclusões pedem confirmação (`window.confirm`) antes de enviar.
- A integração com a Open Library é feita pelo back-end; no formulário de cadastro de livro, a busca preenche os campos e o administrador revisa antes de salvar.
- No celular o menu fica recolhido atrás de um botão; as grades de livros passam de 1 coluna (celular) para várias (tablet e desktop).
- O administrador cadastra os livros pela própria interface (`/admin/livros/novo`). O usuário administrador inicial é criado pela API (veja o README da `estante-api`).
- O estado de login fica em um Context (`AuthProvider`), consumido pelo hook `useAuth`.
- Estilos com variáveis CSS e layout responsivo (mobile, tablet e desktop).

## Limitações conhecidas

- O token fica no `localStorage`, exposto a scripts da página em caso de falha XSS; uma alternativa mais segura seria cookie `HttpOnly`.
- As confirmações de exclusão usam `window.confirm`, a caixa padrão do navegador.
- O front não tem testes automáticos; foi validado manualmente seguindo o roteiro acima e com `npm run lint`.
- Os dados dependem da API: sem a `estante-api` rodando, as telas mostram a mensagem de erro de conexão.
