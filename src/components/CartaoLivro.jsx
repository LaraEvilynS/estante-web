import { Link } from 'react-router-dom';
import Capa from './Capa.jsx';
import Nota from './Nota.jsx';

export default function CartaoLivro({ livro }) {
  return (
    <Link to={`/livros/${livro.id}`} className="cartao-livro">
      <Capa livro={livro} />
      <div className="cartao-livro-info">
        <h3>{livro.titulo}</h3>
        <p>{livro.autor}</p>
        <Nota media={livro.mediaNota} total={livro.totalAvaliacoes} />
      </div>
    </Link>
  );
}
