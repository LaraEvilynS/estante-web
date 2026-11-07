import { useCallback, useState } from 'react';
import { useAviso } from './useAviso.js';

// Executa uma ação (criar, atualizar, excluir) controlando "processando" e a mensagem de erro.
// Uso: const r = await executar(() => servico(...), 'Mensagem de sucesso'); if (r.ok) { ... }
// A mensagem de sucesso é opcional e aparece como aviso temporário no canto da tela.
export function useAcao() {
  const { mostrarSucesso } = useAviso();
  const [processando, setProcessando] = useState(false);
  const [erro, setErro] = useState('');

  const executar = useCallback(
    async (acao, mensagemSucesso) => {
      setProcessando(true);
      setErro('');
      try {
        const resultado = await acao();
        if (mensagemSucesso) mostrarSucesso(mensagemSucesso);
        return { ok: true, resultado };
      } catch (e) {
        setErro(e.message);
        return { ok: false };
      } finally {
        setProcessando(false);
      }
    },
    [mostrarSucesso],
  );

  const limparErro = useCallback(() => setErro(''), []);
  return { executar, processando, erro, limparErro };
}
