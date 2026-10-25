import api from './api.js';

export async function listarLivros({ busca, pagina = 1, limite = 12 }) {
  const { data } = await api.get('/livros', { params: { busca: busca || undefined, pagina, limite } });
  return data; // { itens, pagina, limite, total, totalPaginas }
}

export async function buscarLivro(id) {
  const { data } = await api.get(`/livros/${id}`);
  return data.livro;
}
