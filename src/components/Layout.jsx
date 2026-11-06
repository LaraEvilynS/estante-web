import { Outlet } from 'react-router-dom';
import Cabecalho from './Cabecalho.jsx';
import Rodape from './Rodape.jsx';

// Estrutura comum a todas as páginas: cabeçalho, conteúdo e rodapé.
export default function Layout() {
  return (
    <>
      <Cabecalho />
      <main className="container conteudo">
        <Outlet />
      </main>
      <Rodape />
    </>
  );
}
