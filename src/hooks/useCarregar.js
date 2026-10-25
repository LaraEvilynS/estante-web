import { useCallback, useEffect, useState } from 'react';

// Busca dados quando a "chave" muda e controla loading e erro.
// Ex.: useCarregar(() => listarLivros({ busca }), busca)
export function useCarregar(buscar, chave) {
  const [tentativa, setTentativa] = useState(0);
  const [resultado, setResultado] = useState({ chave: null, dados: null, erro: '' });
  const chaveAtual = `${chave}|${tentativa}`;

  useEffect(() => {
    let ativo = true;
    buscar()
      .then((dados) => ativo && setResultado({ chave: chaveAtual, dados, erro: '' }))
      .catch((e) => ativo && setResultado({ chave: chaveAtual, dados: null, erro: e.message }));
    return () => {
      ativo = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [chaveAtual]);

  const recarregar = useCallback(() => setTentativa((t) => t + 1), []);
  const carregando = resultado.chave !== chaveAtual;

  return {
    dados: carregando ? null : resultado.dados,
    erro: carregando ? '' : resultado.erro,
    carregando,
    recarregar,
  };
}
