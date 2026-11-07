import { useContext } from 'react';
import { AvisoContext } from '../contexts/avisoContext.js';

export function useAviso() {
  const contexto = useContext(AvisoContext);
  if (!contexto) throw new Error('useAviso deve ser usado dentro de um AvisoProvider.');
  return contexto;
}
