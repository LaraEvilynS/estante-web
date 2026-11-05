import { useCallback, useEffect, useMemo, useState } from 'react';
import { AuthContext } from './authContext.js';
import * as authService from '../services/authService.js';
import { lerToken, salvarToken, removerToken } from '../services/tokenStorage.js';
import { registrarAoExpirarSessao } from '../services/api.js';

// Guarda quem está logado e mantém a sessão: ao abrir o site com um token salvo,
// confirma com a API se ele ainda é válido.
export default function AuthProvider({ children }) {
  const [usuario, setUsuario] = useState(null);
  const [carregando, setCarregando] = useState(() => Boolean(lerToken()));
  const [sessaoExpirada, setSessaoExpirada] = useState(false);

  // Se a API recusar o token (expirou, conta excluída, senha trocada), encerra a sessão na tela.
  useEffect(() => {
    registrarAoExpirarSessao(() => {
      removerToken();
      setUsuario(null);
      setSessaoExpirada(true);
    });
    return () => registrarAoExpirarSessao(null);
  }, []);

  useEffect(() => {
    if (!lerToken()) return undefined;
    let ativo = true;
    authService
      .buscarEu()
      .then((u) => ativo && setUsuario(u))
      .catch(() => removerToken())
      .finally(() => ativo && setCarregando(false));
    return () => {
      ativo = false;
    };
  }, []);

  const entrar = useCallback(async (email, senha) => {
    const { token, usuario: logado } = await authService.entrar(email, senha);
    salvarToken(token);
    setSessaoExpirada(false);
    setUsuario(logado);
  }, []);

  const sair = useCallback(() => {
    removerToken();
    setUsuario(null);
  }, []);

  const valor = useMemo(
    () => ({ usuario, carregando, sessaoExpirada, autenticado: Boolean(usuario), entrar, sair, atualizarUsuario: setUsuario }),
    [usuario, carregando, sessaoExpirada, entrar, sair],
  );

  return <AuthContext.Provider value={valor}>{children}</AuthContext.Provider>;
}
