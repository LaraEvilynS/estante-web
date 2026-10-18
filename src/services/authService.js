import api from './api.js';

export async function cadastrar({ nome, email, senha }) {
  const { data } = await api.post('/auth/cadastro', { nome, email, senha });
  return data.usuario;
}

export async function entrar(email, senha) {
  const { data } = await api.post('/auth/login', { email, senha });
  return data; // { token, usuario }
}

export async function buscarEu() {
  const { data } = await api.get('/auth/eu');
  return data.usuario;
}

export async function solicitarRecuperacao(email) {
  const { data } = await api.post('/auth/esqueci-senha', { email });
  return data.mensagem;
}

export async function redefinirSenha(token, novaSenha) {
  const { data } = await api.post('/auth/redefinir-senha', { token, novaSenha });
  return data.mensagem;
}
