import axios from 'axios';

// Instância única do Axios: toda comunicação com a API passa por aqui.
const api = axios.create({
  baseURL: import.meta.env.VITE_URL_API || 'http://localhost:3000',
  timeout: 8000,
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
    } else if (erro.response.data?.erro) {
      mensagem = erro.response.data.erro;
    }
    return Promise.reject(new Error(mensagem));
  },
);

export default api;
