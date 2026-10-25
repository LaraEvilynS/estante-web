import { Link, useParams } from 'react-router-dom';
import { buscarLivro } from '../services/livroService.js';
import { listarAvaliacoes } from '../services/avaliacaoService.js';
import { useCarregar } from '../hooks/useCarregar.js';
import Capa from '../components/Capa.jsx';
import Nota from '../components/Nota.jsx';
import Carregando from '../components/Carregando.jsx';
import MensagemErro from '../components/MensagemErro.jsx';

export default function LivroDetalhe() {
  const { id } = useParams();
  const livro = useCarregar(() => buscarLivro(id), id);
  const avaliacoes = useCarregar(() => listarAvaliacoes(id), id);

  return (
    <section>
      <p>
        <Link to="/livros">← Voltar ao catálogo</Link>
      </p>

      {livro.carregando && <Carregando texto="Carregando livro..." />}
      {livro.erro && <MensagemErro mensagem={livro.erro} aoTentarNovamente={livro.recarregar} />}

      {livro.dados && (
        <>
          <div className="detalhe-livro">
            <Capa livro={livro.dados} tamanho="grande" />
            <div>
              <h1>{livro.dados.titulo}</h1>
              <p className="autor">{livro.dados.autor}</p>
              <Nota media={livro.dados.mediaNota} total={livro.dados.totalAvaliacoes} />
              <ul className="ficha">
                {livro.dados.genero && <li>Gênero: {livro.dados.genero}</li>}
                {livro.dados.paginas && <li>{livro.dados.paginas} páginas</li>}
                {livro.dados.isbn && <li>ISBN: {livro.dados.isbn}</li>}
              </ul>
              {livro.dados.sinopse && <p>{livro.dados.sinopse}</p>}
            </div>
          </div>

          <h2>Avaliações</h2>
          {avaliacoes.carregando && <Carregando texto="Carregando avaliações..." />}
          {avaliacoes.erro && <MensagemErro mensagem={avaliacoes.erro} aoTentarNovamente={avaliacoes.recarregar} />}
          {avaliacoes.dados && avaliacoes.dados.length === 0 && (
            <p className="estado-vazio">Este livro ainda não foi avaliado.</p>
          )}
          {avaliacoes.dados && avaliacoes.dados.length > 0 && (
            <ul className="lista-avaliacoes">
              {avaliacoes.dados.map((a) => (
                <li key={a.id} className="avaliacao">
                  <div className="avaliacao-topo">
                    <strong>{a.usuario.nome}</strong>
                    <span className="nota">★ {a.nota}</span>
                    <small>{new Date(a.criadoEm).toLocaleDateString('pt-BR')}</small>
                  </div>
                  {a.comentario && <p>{a.comentario}</p>}
                </li>
              ))}
            </ul>
          )}
        </>
      )}
    </section>
  );
}
