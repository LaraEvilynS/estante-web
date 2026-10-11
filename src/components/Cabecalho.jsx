import { NavLink } from 'react-router-dom';

export default function Cabecalho() {
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
        </nav>
      </div>
    </header>
  );
}
