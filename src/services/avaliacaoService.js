import api from './api.js';

export async function listarAvaliacoes(livroId) {
  const { data } = await api.get(`/livros/${livroId}/avaliacoes`);
  return data.avaliacoes;
}
