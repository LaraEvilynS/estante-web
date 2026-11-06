import { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { redefinirSenha } from '../services/authService.js';
import CampoFormulario from '../components/CampoFormulario.jsx';
import MensagemErro from '../components/MensagemErro.jsx';

export default function RedefinirSenha() {
  const [parametros] = useSearchParams();
  const token = parametros.get('token');
  const navegar = useNavigate();
  const [senha, setSenha] = useState('');
  const [confirmacao, setConfirmacao] = useState('');
  const [erro, setErro] = useState('');
  const [enviando, setEnviando] = useState(false);

  if (!token) {
    return (
      <section className="cartao-formulario">
        <h1>Redefinir senha</h1>
        <MensagemErro mensagem="Link inválido. Peça um novo link de recuperação." />
        <p className="links-auxiliares">
          <Link to="/esqueci-senha">Pedir novo link</Link>
        </p>
      </section>
    );
  }

  async function aoEnviar(evento) {
    evento.preventDefault();
    setErro('');
    if (senha !== confirmacao) {
      setErro('As senhas não conferem.');
      return;
    }
    setEnviando(true);
    try {
      await redefinirSenha(token, senha);
      navegar('/login', { replace: true, state: { mensagem: 'Senha redefinida! Entre com a nova senha.' } });
    } catch (e) {
      setErro(e.message);
      setEnviando(false);
    }
  }

  return (
    <section className="cartao-formulario">
      <h1>Redefinir senha</h1>
      <form onSubmit={aoEnviar} className="formulario">
        <CampoFormulario rotulo="Nova senha" nome="senha" tipo="password" valor={senha} aoMudar={setSenha} autoComplete="new-password" ajuda="Mínimo de 8 caracteres." />
        <CampoFormulario rotulo="Confirmar nova senha" nome="confirmacao" tipo="password" valor={confirmacao} aoMudar={setConfirmacao} autoComplete="new-password" />
        {erro && <MensagemErro mensagem={erro} />}
        <button className="botao" type="submit" disabled={enviando}>
          {enviando ? 'Salvando...' : 'Salvar nova senha'}
        </button>
      </form>
    </section>
  );
}
