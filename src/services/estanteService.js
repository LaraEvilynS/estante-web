import api from './api.js';

export async function listarEstante() {
  const { data } = await api.get('/estante');
  return data.itens;
}
