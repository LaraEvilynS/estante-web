import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { AvisoContext } from './avisoContext.js';

const DURACAO_MS = 4000;
const MAXIMO_NA_TELA = 3;

// Avisos de sucesso temporários, no canto da tela. Ficam acima das rotas, então
// continuam visíveis quando a ação leva a outra página (ex.: depois de cadastrar um livro).
export default function AvisoProvider({ children }) {
  const [avisos, setAvisos] = useState([]);
  const proximoId = useRef(1);
  const temporizadores = useRef(new Map());

  const fechar = useCallback((id) => {
    clearTimeout(temporizadores.current.get(id));
    temporizadores.current.delete(id);
    setAvisos((atuais) => atuais.filter((aviso) => aviso.id !== id));
  }, []);

  const mostrarSucesso = useCallback(
    (texto) => {
      const id = proximoId.current++;
      setAvisos((atuais) => [...atuais.slice(-(MAXIMO_NA_TELA - 1)), { id, texto }]);
      temporizadores.current.set(id, setTimeout(() => fechar(id), DURACAO_MS));
    },
    [fechar],
  );

  // Ao desmontar, cancela os temporizadores pendentes.
  useEffect(() => {
    const mapa = temporizadores.current;
    return () => mapa.forEach((temporizador) => clearTimeout(temporizador));
  }, []);

  const valor = useMemo(() => ({ mostrarSucesso }), [mostrarSucesso]);

  return (
    <AvisoContext.Provider value={valor}>
      {children}
      <div className="avisos" aria-live="polite">
        {avisos.map((aviso) => (
          <div key={aviso.id} className="aviso" role="status">
            <span>{aviso.texto}</span>
            <button type="button" className="aviso-fechar" aria-label="Fechar aviso" onClick={() => fechar(aviso.id)}>
              ×
            </button>
          </div>
        ))}
      </div>
    </AvisoContext.Provider>
  );
}
