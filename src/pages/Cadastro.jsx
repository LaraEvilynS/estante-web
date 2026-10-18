import { useState } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth.js';
import { cadastrar } from '../services/authService.js';
import CampoFormulario from '../components/CampoFormulario.jsx';
import MensagemErro from '../components/MensagemErro.jsx';

export default function Cadastro() {
  const { entrar, autenticado } = useAuth();
  const navegar = useNavigate();
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [confirmacao, setConfirmacao] = useState('');
  const [erro, setErro] = useState('');
  const [enviando, setEnviando] = useState(false);

  if (autenticado) return <Navigate to="/perfil" replace />;

  async function aoEnviar(evento) {
    evento.preventDefault();
    setErro('');
    if (senha !== confirmacao) {
      setErro('As senhas não conferem.');
      return;
    }
    setEnviando(true);
    try {
      await cadastrar({ nome: nome.trim(), email: email.trim(), senha });
      await entrar(email.trim(), senha);
      navegar('/perfil', { replace: true });
    } catch (e) {
      setErro(e.message);
      setEnviando(false);
    }
  }

  return (
    <section className="cartao-formulario">
      <h1>Criar conta</h1>
      <form onSubmit={aoEnviar} className="formulario">
        <CampoFormulario rotulo="Nome" nome="nome" valor={nome} aoMudar={setNome} autoComplete="name" />
        <CampoFormulario rotulo="E-mail" nome="email" tipo="email" valor={email} aoMudar={setEmail} autoComplete="email" />
        <CampoFormulario rotulo="Senha" nome="senha" tipo="password" valor={senha} aoMudar={setSenha} autoComplete="new-password" ajuda="Mínimo de 8 caracteres." />
        <CampoFormulario rotulo="Confirmar senha" nome="confirmacao" tipo="password" valor={confirmacao} aoMudar={setConfirmacao} autoComplete="new-password" />
        {erro && <MensagemErro mensagem={erro} />}
        <button className="botao" type="submit" disabled={enviando}>
          {enviando ? 'Criando conta...' : 'Criar conta'}
        </button>
      </form>
      <p className="links-auxiliares">
        Já tem conta? <Link to="/login">Entrar</Link>
      </p>
    </section>
  );
}
