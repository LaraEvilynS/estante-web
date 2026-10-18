import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth.js';

// Página restrita: só aparece para quem está autenticado (ver RotaProtegida).
export default function Perfil() {
  const { usuario, sair } = useAuth();
  const navegar = useNavigate();

  function aoSair() {
    sair();
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
      <button className="botao" onClick={aoSair}>
        Sair
      </button>
    </section>
  );
}
