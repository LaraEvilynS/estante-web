import { Link } from 'react-router-dom';
import { listarEstante, atualizarStatus, removerDaEstante } from '../services/estanteService.js';
import { useCarregar } from '../hooks/useCarregar.js';
import { useAcao } from '../hooks/useAcao.js';
import { STATUS } from '../utils/status.js';
import Capa from '../components/Capa.jsx';
import Carregando from '../components/Carregando.jsx';
import MensagemErro from '../components/MensagemErro.jsx';

const SECOES = [
  { status: 'LENDO', titulo: 'Lendo agora' },
  { status: 'QUERO_LER', titulo: 'Quero ler' },
  { status: 'LIDO', titulo: 'Lidos' },
];

// Página restrita: só aparece para quem está autenticado (ver RotaProtegida).
export default function Estante() {
  const { dados, erro, carregando, recarregar } = useCarregar(listarEstante, 'estante');
  const { executar, processando, erro: erroAcao, limparErro } = useAcao();

  async function mudar(item, status) {
    const r = await executar(() => atualizarStatus(item.id, status), 'Status atualizado.');
    if (r.ok) recarregar();
  }

  async function remover(item) {
    if (!window.confirm(`Remover "${item.livro.titulo}" da sua estante?`)) return;
    const r = await executar(() => removerDaEstante(item.id), 'Livro removido da estante.');
    if (r.ok) recarregar();
  }

  return (
    <section>
      <h1>Minha estante</h1>
      {carregando && !dados && <Carregando texto="Carregando sua estante..." />}
      {erro && <MensagemErro mensagem={erro} aoTentarNovamente={recarregar} />}
      {erroAcao && (
        <div onClick={limparErro}>
          <MensagemErro mensagem={erroAcao} />
        </div>
      )}

      {dados && dados.length === 0 && (
        <p className="estado-vazio">
          Sua estante está vazia. <Link to="/livros">Explore o catálogo</Link>.
        </p>
      )}

      {dados &&
        dados.length > 0 &&
        SECOES.map(({ status, titulo }) => {
          const itens = dados.filter((item) => item.status === status);
          if (itens.length === 0) return null;
          return (
            <div key={status} className="secao-estante">
              <h2>
                {titulo} <small>({itens.length})</small>
              </h2>
              <ul className="lista-estante">
                {itens.map((item) => (
                  <li key={item.id} className="item-estante-completo">
                    <Link to={`/livros/${item.livro.id}`} className="item-estante">
                      <Capa livro={item.livro} tamanho="pequena" />
                      <div>
                        <strong>{item.livro.titulo}</strong>
                        <p>{item.livro.autor}</p>
                      </div>
                    </Link>
                    <div className="linha-acoes">
                      <select
                        aria-label={`Status de ${item.livro.titulo}`}
                        value={item.status}
                        disabled={processando}
                        onChange={(e) => mudar(item, e.target.value)}
                      >
                        {STATUS.map((s) => (
                          <option key={s.valor} value={s.valor}>
                            {s.rotulo}
                          </option>
                        ))}
                      </select>
                      <button className="botao botao-secundario" disabled={processando} onClick={() => remover(item)}>
                        Remover
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          );
        })}
    </section>
  );
}
