import { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth.js';

export default function Cabecalho() {
  const { autenticado, usuario, sair } = useAuth();
  const navegar = useNavigate();
  const [aberto, setAberto] = useState(false);

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
        {/* No celular, o menu fica recolhido e abre por este botão */}
        <button
          className="menu-botao"
          aria-label="Abrir ou fechar o menu"
          aria-expanded={aberto}
          onClick={() => setAberto((a) => !a)}
        >
          ☰
        </button>
        <nav
          className={`menu ${aberto ? 'menu-aberto' : ''}`}
          aria-label="Navegação principal"
          onClick={() => setAberto(false)}
        >
          <NavLink to="/" end>
            Início
          </NavLink>
          <NavLink to="/livros">Livros</NavLink>
          {autenticado ? (
            <>
              <NavLink to="/estante">Minha estante</NavLink>
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
