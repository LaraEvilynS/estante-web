import { useState } from 'react';
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth.js';
import CampoFormulario from '../components/CampoFormulario.jsx';
import MensagemErro from '../components/MensagemErro.jsx';

export default function Login() {
  const { entrar, autenticado } = useAuth();
  const navegar = useNavigate();
  const local = useLocation();
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [erro, setErro] = useState('');
  const [enviando, setEnviando] = useState(false);

  if (autenticado) return <Navigate to="/perfil" replace />;

  async function aoEnviar(evento) {
    evento.preventDefault();
    setErro('');
    setEnviando(true);
    try {
      await entrar(email.trim(), senha);
      navegar(local.state?.de || '/perfil', { replace: true });
    } catch (e) {
      setErro(e.message);
      setEnviando(false);
    }
  }

  return (
    <section className="cartao-formulario">
      <h1>Entrar</h1>
      {local.state?.mensagem && <p className="mensagem mensagem-sucesso">{local.state.mensagem}</p>}
      <form onSubmit={aoEnviar} className="formulario">
        <CampoFormulario rotulo="E-mail" nome="email" tipo="email" valor={email} aoMudar={setEmail} autoComplete="email" />
        <CampoFormulario rotulo="Senha" nome="senha" tipo="password" valor={senha} aoMudar={setSenha} autoComplete="current-password" />
        {erro && <MensagemErro mensagem={erro} />}
        <button className="botao" type="submit" disabled={enviando}>
          {enviando ? 'Entrando...' : 'Entrar'}
        </button>
      </form>
      <p className="links-auxiliares">
        <Link to="/esqueci-senha">Esqueci minha senha</Link> · <Link to="/cadastro">Criar conta</Link>
      </p>
    </section>
  );
}
