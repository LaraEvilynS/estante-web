import api from './api.js';

export async function listarEstante() {
  const { data } = await api.get('/estante');
  return data.itens;
}

export async function adicionarNaEstante({ livroId, status }) {
  const { data } = await api.post('/estante', { livroId, status });
  return data.item;
}

export async function atualizarStatus(id, status) {
  const { data } = await api.patch(`/estante/${id}`, { status });
  return data.item;
}

export async function removerDaEstante(id) {
  await api.delete(`/estante/${id}`);
}
