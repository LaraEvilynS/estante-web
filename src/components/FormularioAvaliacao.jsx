import { useState } from 'react';
import { atualizarAvaliacao, criarAvaliacao } from '../services/avaliacaoService.js';
import { useAcao } from '../hooks/useAcao.js';
import CampoArea from './CampoArea.jsx';
import MensagemErro from './MensagemErro.jsx';

// Serve para criar uma avaliação nova ou editar a existente (quando recebe "avaliacao").
export default function FormularioAvaliacao({ livroId, avaliacao, aoSalvar, aoCancelar }) {
  const { executar, processando, erro } = useAcao();
  const [nota, setNota] = useState(avaliacao?.nota ?? 5);
  const [comentario, setComentario] = useState(avaliacao?.comentario ?? '');

  async function aoEnviar(evento) {
    evento.preventDefault();
    const dados = { nota: Number(nota), comentario: comentario.trim() || null };
    const r = await executar(() => (avaliacao ? atualizarAvaliacao(avaliacao.id, dados) : criarAvaliacao(livroId, dados)));
    if (r.ok) aoSalvar();
  }

  return (
    <form className="formulario formulario-avaliacao" onSubmit={aoEnviar}>
      <div className="campo">
        <label htmlFor="nota">Nota</label>
        <select id="nota" value={nota} onChange={(e) => setNota(e.target.value)}>
          {[5, 4, 3, 2, 1].map((n) => (
            <option key={n} value={n}>
              {'★'.repeat(n)} ({n})
            </option>
          ))}
        </select>
      </div>
      <CampoArea rotulo="Comentário (opcional)" nome="comentario" valor={comentario} aoMudar={setComentario} maxLength={2000} />
      {erro && <MensagemErro mensagem={erro} />}
      <div className="linha-acoes">
        <button className="botao" type="submit" disabled={processando}>
          {processando ? 'Salvando...' : avaliacao ? 'Salvar alterações' : 'Publicar avaliação'}
        </button>
        {aoCancelar && (
          <button className="botao botao-secundario" type="button" onClick={aoCancelar}>
            Cancelar
          </button>
        )}
      </div>
    </form>
  );
}
