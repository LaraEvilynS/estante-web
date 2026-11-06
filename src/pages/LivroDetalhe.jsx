import { Link, useNavigate, useParams } from 'react-router-dom';
import { buscarLivro, excluirLivro } from '../services/livroService.js';
import { listarAvaliacoes } from '../services/avaliacaoService.js';
import { listarEstante } from '../services/estanteService.js';
import { useCarregar } from '../hooks/useCarregar.js';
import { useAcao } from '../hooks/useAcao.js';
import { useAuth } from '../hooks/useAuth.js';
import Capa from '../components/Capa.jsx';
import Nota from '../components/Nota.jsx';
import AcoesEstante from '../components/AcoesEstante.jsx';
import FormularioAvaliacao from '../components/FormularioAvaliacao.jsx';
import ItemAvaliacao from '../components/ItemAvaliacao.jsx';
import Carregando from '../components/Carregando.jsx';
import MensagemErro from '../components/MensagemErro.jsx';

export default function LivroDetalhe() {
  const { id } = useParams();
  const navegar = useNavigate();
  const { autenticado, usuario } = useAuth();
  const { executar, processando, erro: erroExclusao } = useAcao();

  const livro = useCarregar(() => buscarLivro(id), id);
  const avaliacoes = useCarregar(() => listarAvaliacoes(id), id);
  const estante = useCarregar(() => (autenticado ? listarEstante() : Promise.resolve([])), `estante-${autenticado}`);

  const item = estante.dados?.find((i) => i.livro.id === id) ?? null;
  const minhaAvaliacao = avaliacoes.dados?.find((a) => a.usuario.id === usuario?.id) ?? null;
  const ehAdmin = usuario?.perfil === 'ADMIN';

  // Depois de qualquer alteração, recarrega tudo (a média do livro também muda).
  function recarregarTudo() {
    livro.recarregar();
    avaliacoes.recarregar();
    estante.recarregar();
  }

  async function excluir() {
    if (!window.confirm('Excluir este livro? As avaliações e os itens de estante dele também serão apagados.')) return;
    const r = await executar(() => excluirLivro(id));
    if (r.ok) navegar('/livros');
  }

  return (
    <section>
      <p>
        <Link to="/livros">← Voltar ao catálogo</Link>
      </p>

      {livro.carregando && !livro.dados && <Carregando texto="Carregando livro..." />}
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
              {ehAdmin && (
                <div className="linha-acoes">
                  <Link className="botao botao-secundario" to={`/admin/livros/${id}/editar`}>
                    Editar livro
                  </Link>
                  <button className="botao botao-perigo" disabled={processando} onClick={excluir}>
                    Excluir livro
                  </button>
                </div>
              )}
              {erroExclusao && <MensagemErro mensagem={erroExclusao} />}
            </div>
          </div>

          {autenticado ? (
            estante.dados && <AcoesEstante livroId={id} item={item} aoAlterar={recarregarTudo} />
          ) : (
            <p className="painel">
              <Link to="/login" state={{ de: `/livros/${id}` }}>
                Entre
              </Link>{' '}
              para adicionar este livro à sua estante e avaliá-lo.
            </p>
          )}

          <h2>Avaliações</h2>

          {autenticado && !minhaAvaliacao && item?.status === 'LIDO' && (
            <div className="painel">
              <h3>Avalie este livro</h3>
              <FormularioAvaliacao livroId={id} aoSalvar={recarregarTudo} />
            </div>
          )}
          {autenticado && !minhaAvaliacao && item && item.status !== 'LIDO' && (
            <p className="dica">Marque o livro como "Lido" na sua estante para poder avaliá-lo.</p>
          )}

          {avaliacoes.carregando && !avaliacoes.dados && <Carregando texto="Carregando avaliações..." />}
          {avaliacoes.erro && <MensagemErro mensagem={avaliacoes.erro} aoTentarNovamente={avaliacoes.recarregar} />}
          {avaliacoes.dados && avaliacoes.dados.length === 0 && (
            <p className="estado-vazio">Este livro ainda não foi avaliado.</p>
          )}
          {avaliacoes.dados && avaliacoes.dados.length > 0 && (
            <ul className="lista-avaliacoes">
              {avaliacoes.dados.map((a) => (
                <ItemAvaliacao key={a.id} avaliacao={a} livroId={id} aoAlterar={recarregarTudo} />
              ))}
            </ul>
          )}
        </>
      )}
    </section>
  );
}
