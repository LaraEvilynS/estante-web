import { useCallback, useState } from 'react';

// Executa uma ação (criar, atualizar, excluir) controlando "processando" e a mensagem de erro.
// Uso: const r = await executar(() => servico(...)); if (r.ok) { ... }
export function useAcao() {
  const [processando, setProcessando] = useState(false);
  const [erro, setErro] = useState('');

  const executar = useCallback(async (acao) => {
    setProcessando(true);
    setErro('');
    try {
      return { ok: true, resultado: await acao() };
    } catch (e) {
      setErro(e.message);
      return { ok: false };
    } finally {
      setProcessando(false);
    }
  }, []);

  const limparErro = useCallback(() => setErro(''), []);
  return { executar, processando, erro, limparErro };
}
