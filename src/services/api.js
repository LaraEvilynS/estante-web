import axios from 'axios';
import { lerToken } from './tokenStorage.js';

// Instância única do Axios: toda comunicação com a API passa por aqui.
const api = axios.create({
  baseURL: import.meta.env.VITE_URL_API || 'http://localhost:3000',
  timeout: 8000,
});

// Envia o token JWT (se existir) em todas as requisições.
api.interceptors.request.use((config) => {
  const token = lerToken();
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Converte qualquer falha em uma mensagem amigável para o usuário.
api.interceptors.response.use(
  (resposta) => resposta,
  (erro) => {
    let mensagem = 'Algo deu errado. Tente novamente.';
    if (erro.code === 'ECONNABORTED') {
      mensagem = 'A API demorou demais para responder.';
    } else if (!erro.response) {
      mensagem = 'Não foi possível conectar à API. Verifique se ela está rodando.';
    } else if (erro.response.data?.detalhes?.length) {
      mensagem = erro.response.data.detalhes.map((d) => d.mensagem).join(' ');
    } else if (erro.response.data?.erro) {
      mensagem = erro.response.data.erro;
    }
    const erroAmigavel = new Error(mensagem);
    erroAmigavel.status = erro.response?.status;
    return Promise.reject(erroAmigavel);
  },
);

export default api;
