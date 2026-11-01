import api from './api.js';

export async function listarLivros({ busca, pagina = 1, limite = 12 }) {
  const { data } = await api.get('/livros', { params: { busca: busca || undefined, pagina, limite } });
  return data; // { itens, pagina, limite, total, totalPaginas }
}

export async function buscarLivro(id) {
  const { data } = await api.get(`/livros/${id}`);
  return data.livro;
}

// ----- somente administrador -----
export async function criarLivro(dados) {
  const { data } = await api.post('/livros', dados);
  return data.livro;
}

export async function atualizarLivro(id, dados) {
  const { data } = await api.patch(`/livros/${id}`, dados);
  return data.livro;
}

export async function excluirLivro(id) {
  await api.delete(`/livros/${id}`);
}

// API externa (Open Library), consultada pelo back-end. Pode demorar mais que as outras chamadas.
export async function buscarLivrosExternos(titulo) {
  const { data } = await api.get('/livros/externo/busca', { params: { titulo }, timeout: 15000 });
  return data.resultados;
}

export async function detalharLivroExterno(idObra) {
  const { data } = await api.get(`/livros/externo/obras/${idObra}`, { timeout: 15000 });
  return data.detalhes;
}
