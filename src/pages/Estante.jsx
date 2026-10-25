import { Link } from 'react-router-dom';
import { listarEstante } from '../services/estanteService.js';
import { useCarregar } from '../hooks/useCarregar.js';
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

  return (
    <section>
      <h1>Minha estante</h1>
      {carregando && <Carregando texto="Carregando sua estante..." />}
      {erro && <MensagemErro mensagem={erro} aoTentarNovamente={recarregar} />}

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
                  <li key={item.id}>
                    <Link to={`/livros/${item.livro.id}`} className="item-estante">
                      <Capa livro={item.livro} tamanho="pequena" />
                      <div>
                        <strong>{item.livro.titulo}</strong>
                        <p>{item.livro.autor}</p>
                      </div>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          );
        })}
    </section>
  );
}
