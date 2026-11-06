import api from './api.js';

export async function atualizarPerfil({ nome }) {
  const { data } = await api.patch('/usuarios/eu', { nome });
  return data.usuario;
}

export async function alterarSenha({ senhaAtual, novaSenha }) {
  const { data } = await api.patch('/usuarios/eu/senha', { senhaAtual, novaSenha });
  return data.mensagem;
}

// O DELETE leva a senha no corpo para confirmar a exclusão.
export async function excluirConta(senha) {
  await api.delete('/usuarios/eu', { data: { senha } });
}

// ----- somente administrador -----
export async function listarUsuarios() {
  const { data } = await api.get('/usuarios');
  return data.usuarios;
}

export async function excluirUsuario(id) {
  await api.delete(`/usuarios/${id}`);
}
