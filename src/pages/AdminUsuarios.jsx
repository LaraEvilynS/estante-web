import { listarUsuarios, excluirUsuario } from '../services/usuarioService.js';
import { useCarregar } from '../hooks/useCarregar.js';
import { useAcao } from '../hooks/useAcao.js';
import Carregando from '../components/Carregando.jsx';
import MensagemErro from '../components/MensagemErro.jsx';

// Lista de usuários (somente administrador, ver RotaAdmin).
export default function AdminUsuarios() {
  const { dados, erro, carregando, recarregar } = useCarregar(listarUsuarios, 'usuarios');
  const { executar, processando, erro: erroAcao } = useAcao();

  async function excluir(usuario) {
    if (!window.confirm(`Excluir o usuário ${usuario.nome}? As avaliações e a estante dele também serão apagadas.`)) return;
    const r = await executar(() => excluirUsuario(usuario.id));
    if (r.ok) recarregar();
  }

  return (
    <section>
      <h1>Usuários</h1>
      {carregando && !dados && <Carregando texto="Carregando usuários..." />}
      {erro && <MensagemErro mensagem={erro} aoTentarNovamente={recarregar} />}
      {erroAcao && <MensagemErro mensagem={erroAcao} />}

      {dados && (
        <ul className="lista-usuarios">
          {dados.map((u) => (
            <li key={u.id} className="usuario-linha">
              <div>
                <strong>{u.nome}</strong>
                <p>{u.email}</p>
                <small>
                  {u.perfil === 'ADMIN' ? 'Administrador' : 'Usuário'} · desde {new Date(u.criadoEm).toLocaleDateString('pt-BR')}
                </small>
              </div>
              {u.perfil !== 'ADMIN' && (
                <button className="botao botao-perigo" disabled={processando} onClick={() => excluir(u)}>
                  Excluir
                </button>
              )}
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
