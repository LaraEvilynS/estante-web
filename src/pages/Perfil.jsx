import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth.js';
import { useAcao } from '../hooks/useAcao.js';
import { useAviso } from '../hooks/useAviso.js';
import { alterarSenha, atualizarPerfil, excluirConta } from '../services/usuarioService.js';
import CampoFormulario from '../components/CampoFormulario.jsx';
import MensagemErro from '../components/MensagemErro.jsx';

function FormularioNome() {
  const { usuario, atualizarUsuario } = useAuth();
  const { executar, processando, erro } = useAcao();
  const [nome, setNome] = useState(usuario.nome);

  async function aoEnviar(evento) {
    evento.preventDefault();
    const r = await executar(() => atualizarPerfil({ nome: nome.trim() }), 'Nome atualizado.');
    if (r.ok) atualizarUsuario(r.resultado);
  }

  return (
    <form className="painel formulario" onSubmit={aoEnviar}>
      <h2>Editar nome</h2>
      <CampoFormulario rotulo="Nome" nome="nome" valor={nome} aoMudar={setNome} autoComplete="name" />
      {erro && <MensagemErro mensagem={erro} />}
      <button className="botao" type="submit" disabled={processando}>
        {processando ? 'Salvando...' : 'Salvar nome'}
      </button>
    </form>
  );
}

function FormularioSenha() {
  const { sair } = useAuth();
  const navegar = useNavigate();
  const { executar, processando, erro } = useAcao();
  const [senhaAtual, setSenhaAtual] = useState('');
  const [novaSenha, setNovaSenha] = useState('');
  const [confirmacao, setConfirmacao] = useState('');
  const [aviso, setAviso] = useState('');
  async function aoEnviar(evento) {
    evento.preventDefault();
    setAviso('');
    if (novaSenha !== confirmacao) {
      setAviso('As senhas não conferem.');
      return;
    }
    const r = await executar(() => alterarSenha({ senhaAtual, novaSenha }));
    if (r.ok) {
      // A troca encerra as sessões antigas, inclusive esta: é preciso entrar de novo.
      sair();
      navegar('/login', { replace: true, state: { mensagem: 'Senha alterada! Entre com a nova senha.' } });
    }
  }

  return (
    <form className="painel formulario" onSubmit={aoEnviar}>
      <h2>Alterar senha</h2>
      <CampoFormulario rotulo="Senha atual" nome="senhaAtual" tipo="password" valor={senhaAtual} aoMudar={setSenhaAtual} autoComplete="current-password" />
      <CampoFormulario rotulo="Nova senha" nome="novaSenha" tipo="password" valor={novaSenha} aoMudar={setNovaSenha} autoComplete="new-password" ajuda="Mínimo de 8 caracteres." />
      <CampoFormulario rotulo="Confirmar nova senha" nome="confirmacao" tipo="password" valor={confirmacao} aoMudar={setConfirmacao} autoComplete="new-password" />
      {aviso && <MensagemErro mensagem={aviso} />}
      {erro && <MensagemErro mensagem={erro} />}
      <button className="botao" type="submit" disabled={processando}>
        {processando ? 'Salvando...' : 'Alterar senha'}
      </button>
    </form>
  );
}

function ExcluirConta() {
  const { sair } = useAuth();
  const navegar = useNavigate();
  const { executar, processando, erro } = useAcao();
  const [senha, setSenha] = useState('');

  async function aoEnviar(evento) {
    evento.preventDefault();
    if (!window.confirm('Excluir a sua conta definitivamente? Suas avaliações e sua estante serão apagadas.')) return;
    const r = await executar(() => excluirConta(senha), 'Conta excluída.');
    if (r.ok) {
      sair();
      navegar('/');
    }
  }

  return (
    <form className="painel painel-perigo formulario" onSubmit={aoEnviar}>
      <h2>Excluir conta</h2>
      <p>Esta ação não pode ser desfeita. Confirme com a sua senha.</p>
      <CampoFormulario rotulo="Senha" nome="senhaExclusao" tipo="password" valor={senha} aoMudar={setSenha} autoComplete="current-password" />
      {erro && <MensagemErro mensagem={erro} />}
      <button className="botao botao-perigo" type="submit" disabled={processando}>
        {processando ? 'Excluindo...' : 'Excluir minha conta'}
      </button>
    </form>
  );
}

// Página restrita: só aparece para quem está autenticado (ver RotaProtegida).
export default function Perfil() {
  const { usuario, sair } = useAuth();
  const { mostrarSucesso } = useAviso();
  const navegar = useNavigate();

  function aoSair() {
    sair();
    mostrarSucesso('Você saiu da conta.');
    navegar('/');
  }

  return (
    <section>
      <h1>Minha conta</h1>
      <dl className="dados-usuario">
        <dt>Nome</dt>
        <dd>{usuario.nome}</dd>
        <dt>E-mail</dt>
        <dd>{usuario.email}</dd>
        <dt>Perfil</dt>
        <dd>{usuario.perfil === 'ADMIN' ? 'Administrador' : 'Usuário'}</dd>
      </dl>

      <FormularioNome />
      <FormularioSenha />
      {usuario.perfil === 'ADMIN' ? (
        <p className="dica">Contas de administrador não podem ser excluídas.</p>
      ) : (
        <ExcluirConta />
      )}

      <button className="botao botao-secundario" onClick={aoSair}>
        Sair
      </button>
    </section>
  );
}
