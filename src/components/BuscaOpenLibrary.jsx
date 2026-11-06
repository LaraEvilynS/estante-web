import { useState } from 'react';
import { buscarLivrosExternos, detalharLivroExterno } from '../services/livroService.js';
import Capa from './Capa.jsx';
import Carregando from './Carregando.jsx';
import MensagemErro from './MensagemErro.jsx';

// Integração com a Open Library: busca por título e devolve os dados do livro escolhido
// (com a sinopse) para preencher o formulário de cadastro.
export default function BuscaOpenLibrary({ aoEscolher }) {
  const [titulo, setTitulo] = useState('');
  const [resultados, setResultados] = useState(null);
  const [buscando, setBuscando] = useState(false);
  const [escolhendo, setEscolhendo] = useState(null);
  const [erro, setErro] = useState('');

  async function buscar(evento) {
    evento.preventDefault();
    setErro('');
    setResultados(null);
    setBuscando(true);
    try {
      setResultados(await buscarLivrosExternos(titulo.trim()));
    } catch (e) {
      setErro(e.message);
    } finally {
      setBuscando(false);
    }
  }

  async function usar(resultado) {
    setEscolhendo(resultado.idObra);
    let sinopse = '';
    try {
      sinopse = (await detalharLivroExterno(resultado.idObra)).sinopse ?? '';
    } catch {
      // Sem a sinopse, o cadastro continua e o administrador pode escrevê-la.
    }
    aoEscolher({ ...resultado, sinopse });
    setEscolhendo(null);
  }

  return (
    <div className="painel">
      <h2>Buscar na Open Library</h2>
      <p className="dica">Digite o título para preencher o formulário automaticamente. Depois revise os dados.</p>
      <form className="busca" onSubmit={buscar} role="search">
        <input
          type="search"
          value={titulo}
          onChange={(e) => setTitulo(e.target.value)}
          placeholder="Título do livro"
          aria-label="Título para buscar na Open Library"
          minLength={2}
          required
        />
        <button className="botao" type="submit" disabled={buscando}>
          Buscar
        </button>
      </form>

      {buscando && <Carregando texto="Consultando a Open Library..." />}
      {erro && <MensagemErro mensagem={erro} />}
      {resultados && resultados.length === 0 && <p className="estado-vazio">Nenhum resultado encontrado.</p>}

      {resultados && resultados.length > 0 && (
        <ul className="resultados-externos">
          {resultados.map((r) => (
            <li key={r.idObra} className="resultado-externo">
              <Capa livro={r} tamanho="pequena" />
              <div>
                <strong>{r.titulo}</strong>
                <p>{r.autor}</p>
              </div>
              <button className="botao botao-secundario" disabled={escolhendo !== null} onClick={() => usar(r)}>
                {escolhendo === r.idObra ? 'Carregando...' : 'Usar este livro'}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
