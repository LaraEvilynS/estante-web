import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { listarLivros } from '../services/livroService.js';
import { useCarregar } from '../hooks/useCarregar.js';
import CartaoLivro from '../components/CartaoLivro.jsx';
import Paginacao from '../components/Paginacao.jsx';
import Carregando from '../components/Carregando.jsx';
import MensagemErro from '../components/MensagemErro.jsx';

export default function Livros() {
  // A busca e a página ficam na URL (ex.: /livros?busca=dom&pagina=2), então dá para compartilhar o link.
  const [parametros, setParametros] = useSearchParams();
  const busca = parametros.get('busca') || '';
  const pagina = Number(parametros.get('pagina')) || 1;
  const [termo, setTermo] = useState(busca);

  const { dados, erro, carregando, recarregar } = useCarregar(
    () => listarLivros({ busca, pagina }),
    `${busca}|${pagina}`,
  );

  function aoBuscar(evento) {
    evento.preventDefault();
    setParametros(termo.trim() ? { busca: termo.trim() } : {});
  }

  function irParaPagina(nova) {
    setParametros({ ...(busca && { busca }), pagina: String(nova) });
    window.scrollTo({ top: 0 });
  }

  return (
    <section>
      <h1>Livros</h1>
      <form className="busca" onSubmit={aoBuscar} role="search">
        <input
          type="search"
          value={termo}
          onChange={(e) => setTermo(e.target.value)}
          placeholder="Buscar por título ou autor"
          aria-label="Buscar por título ou autor"
        />
        <button className="botao" type="submit">
          Buscar
        </button>
      </form>

      {carregando && <Carregando texto="Carregando livros..." />}
      {erro && <MensagemErro mensagem={erro} aoTentarNovamente={recarregar} />}

      {dados && dados.itens.length === 0 && (
        <p className="estado-vazio">
          {busca ? `Nenhum livro encontrado para "${busca}".` : 'O catálogo ainda não tem livros.'}
        </p>
      )}

      {dados && dados.itens.length > 0 && (
        <>
          <p className="contagem">{dados.total} livro(s)</p>
          <div className="grade-livros">
            {dados.itens.map((livro) => (
              <CartaoLivro key={livro.id} livro={livro} />
            ))}
          </div>
          <Paginacao pagina={dados.pagina} totalPaginas={dados.totalPaginas} aoMudar={irParaPagina} />
        </>
      )}
    </section>
  );
}
