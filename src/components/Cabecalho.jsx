import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth.js';

export default function Cabecalho() {
  const { autenticado, usuario, sair } = useAuth();
  const navegar = useNavigate();

  function aoSair() {
    sair();
    navegar('/');
  }

  return (
    <header className="cabecalho">
      <div className="container cabecalho-conteudo">
        <NavLink to="/" className="logo">
          Estante
        </NavLink>
        <nav className="menu" aria-label="Navegação principal">
          <NavLink to="/" end>
            Início
          </NavLink>
          <NavLink to="/livros">Livros</NavLink>
          {autenticado ? (
            <>
              <NavLink to="/perfil">{usuario.nome.split(' ')[0]}</NavLink>
              <button className="botao-link" onClick={aoSair}>
                Sair
              </button>
            </>
          ) : (
            <>
              <NavLink to="/login">Entrar</NavLink>
              <NavLink to="/cadastro">Cadastrar</NavLink>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
