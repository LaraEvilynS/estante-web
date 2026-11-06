import api from './api.js';

export async function buscarSaude() {
  const { data } = await api.get('/saude');
  return data;
}
