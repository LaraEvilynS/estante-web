import { useState } from 'react';
import { Link } from 'react-router-dom';
import { solicitarRecuperacao } from '../services/authService.js';
import CampoFormulario from '../components/CampoFormulario.jsx';
import MensagemErro from '../components/MensagemErro.jsx';

export default function EsqueciSenha() {
  const [email, setEmail] = useState('');
  const [erro, setErro] = useState('');
  const [resposta, setResposta] = useState('');
  const [enviando, setEnviando] = useState(false);

  async function aoEnviar(evento) {
    evento.preventDefault();
    setErro('');
    setEnviando(true);
    try {
      setResposta(await solicitarRecuperacao(email.trim()));
    } catch (e) {
      setErro(e.message);
    } finally {
      setEnviando(false);
    }
  }

  return (
    <section className="cartao-formulario">
      <h1>Recuperar senha</h1>
      <p>Informe o e-mail da sua conta e enviaremos um link para criar uma nova senha.</p>
      {resposta ? (
        <p className="mensagem mensagem-sucesso">{resposta}</p>
      ) : (
        <form onSubmit={aoEnviar} className="formulario">
          <CampoFormulario rotulo="E-mail" nome="email" tipo="email" valor={email} aoMudar={setEmail} autoComplete="email" />
          {erro && <MensagemErro mensagem={erro} />}
          <button className="botao" type="submit" disabled={enviando}>
            {enviando ? 'Enviando...' : 'Enviar link'}
          </button>
        </form>
      )}
      <p className="links-auxiliares">
        <Link to="/login">Voltar para o login</Link>
      </p>
    </section>
  );
}
