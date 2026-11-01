import { useCallback, useEffect, useState } from 'react';

// Busca dados quando a "chave" muda e controla loading e erro.
// Ex.: useCarregar(() => listarLivros({ busca }), busca)
// Ao chamar recarregar(), os dados anteriores continuam visíveis até chegarem os novos
// (a tela não "pisca"). Ao mudar a chave, os dados antigos são descartados.
export function useCarregar(buscar, chave) {
  const [tentativa, setTentativa] = useState(0);
  const [resultado, setResultado] = useState({ chaveBase: null, chaveCompleta: null, dados: null, erro: '' });
  const chaveCompleta = `${chave}|${tentativa}`;

  useEffect(() => {
    let ativo = true;
    const base = String(chave);
    buscar()
      .then((dados) => ativo && setResultado({ chaveBase: base, chaveCompleta, dados, erro: '' }))
      .catch((e) => ativo && setResultado({ chaveBase: base, chaveCompleta, dados: null, erro: e.message }));
    return () => {
      ativo = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [chaveCompleta]);

  const recarregar = useCallback(() => setTentativa((t) => t + 1), []);
  const pronto = resultado.chaveCompleta === chaveCompleta;
  const mesmoConteudo = resultado.chaveBase === String(chave);

  return {
    dados: pronto || mesmoConteudo ? resultado.dados : null,
    erro: pronto ? resultado.erro : '',
    carregando: !pronto,
    recarregar,
  };
}
