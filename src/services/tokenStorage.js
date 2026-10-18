// Guarda o token JWT no navegador para manter a sessão após recarregar a página.
const CHAVE = 'estante.token';

export function lerToken() {
  try { return localStorage.getItem(CHAVE); } catch { return null; }
}
export function salvarToken(token) {
  try { localStorage.setItem(CHAVE, token); } catch { /* armazenamento indisponível */ }
}
export function removerToken() {
  try { localStorage.removeItem(CHAVE); } catch { /* armazenamento indisponível */ }
}
