import api from './api.js';

export async function listarAvaliacoes(livroId) {
  const { data } = await api.get(`/livros/${livroId}/avaliacoes`);
  return data.avaliacoes;
}

export async function criarAvaliacao(livroId, { nota, comentario }) {
  const { data } = await api.post(`/livros/${livroId}/avaliacoes`, { nota, comentario });
  return data.avaliacao;
}

export async function atualizarAvaliacao(id, { nota, comentario }) {
  const { data } = await api.patch(`/avaliacoes/${id}`, { nota, comentario });
  return data.avaliacao;
}

export async function excluirAvaliacao(id) {
  await api.delete(`/avaliacoes/${id}`);
}
