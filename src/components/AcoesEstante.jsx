import { useState } from 'react';
import { adicionarNaEstante, atualizarStatus, removerDaEstante } from '../services/estanteService.js';
import { useAcao } from '../hooks/useAcao.js';
import { STATUS } from '../utils/status.js';
import MensagemErro from './MensagemErro.jsx';

// Adiciona o livro à estante, muda o status ou remove (create, update e delete da estante).
export default function AcoesEstante({ livroId, item, aoAlterar }) {
  const { executar, processando, erro } = useAcao();
  const [statusNovo, setStatusNovo] = useState('QUERO_LER');

  async function adicionar() {
    const r = await executar(() => adicionarNaEstante({ livroId, status: statusNovo }), 'Livro adicionado à estante.');
    if (r.ok) aoAlterar();
  }

  async function mudar(status) {
    const r = await executar(() => atualizarStatus(item.id, status), 'Status atualizado.');
    if (r.ok) aoAlterar();
  }

  async function remover() {
    if (!window.confirm('Remover este livro da sua estante?')) return;
    const r = await executar(() => removerDaEstante(item.id), 'Livro removido da estante.');
    if (r.ok) aoAlterar();
  }

  return (
    <div className="painel">
      <h2>Minha estante</h2>
      <div className="linha-acoes">
        {item ? (
          <>
            <label htmlFor="status-livro">Status:</label>
            <select id="status-livro" value={item.status} disabled={processando} onChange={(e) => mudar(e.target.value)}>
              {STATUS.map((s) => (
                <option key={s.valor} value={s.valor}>
                  {s.rotulo}
                </option>
              ))}
            </select>
            <button className="botao botao-secundario" disabled={processando} onClick={remover}>
              Remover da estante
            </button>
          </>
        ) : (
          <>
            <label htmlFor="status-novo">Adicionar como:</label>
            <select id="status-novo" value={statusNovo} disabled={processando} onChange={(e) => setStatusNovo(e.target.value)}>
              {STATUS.map((s) => (
                <option key={s.valor} value={s.valor}>
                  {s.rotulo}
                </option>
              ))}
            </select>
            <button className="botao" disabled={processando} onClick={adicionar}>
              {processando ? 'Adicionando...' : 'Adicionar à estante'}
            </button>
          </>
        )}
      </div>
      {erro && <MensagemErro mensagem={erro} />}
    </div>
  );
}
