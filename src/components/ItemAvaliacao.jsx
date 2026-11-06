import { useState } from 'react';
import { excluirAvaliacao } from '../services/avaliacaoService.js';
import { useAcao } from '../hooks/useAcao.js';
import { useAuth } from '../hooks/useAuth.js';
import FormularioAvaliacao from './FormularioAvaliacao.jsx';
import MensagemErro from './MensagemErro.jsx';

// Uma avaliação da lista. O dono pode editar e excluir; o administrador pode excluir (moderação).
export default function ItemAvaliacao({ avaliacao, livroId, aoAlterar }) {
  const { usuario } = useAuth();
  const { executar, processando, erro } = useAcao();
  const [editando, setEditando] = useState(false);

  const ehDono = usuario?.id === avaliacao.usuario.id;
  const ehAdmin = usuario?.perfil === 'ADMIN';

  async function excluir() {
    const pergunta = ehDono ? 'Excluir a sua avaliação?' : `Excluir a avaliação de ${avaliacao.usuario.nome}?`;
    if (!window.confirm(pergunta)) return;
    const r = await executar(() => excluirAvaliacao(avaliacao.id));
    if (r.ok) aoAlterar();
  }

  if (editando) {
    return (
      <li className="avaliacao">
        <FormularioAvaliacao
          livroId={livroId}
          avaliacao={avaliacao}
          aoSalvar={() => {
            setEditando(false);
            aoAlterar();
          }}
          aoCancelar={() => setEditando(false)}
        />
      </li>
    );
  }

  return (
    <li className="avaliacao">
      <div className="avaliacao-topo">
        <strong>{avaliacao.usuario.nome}</strong>
        <span className="nota">★ {avaliacao.nota}</span>
        <small>{new Date(avaliacao.criadoEm).toLocaleDateString('pt-BR')}</small>
      </div>
      {avaliacao.comentario && <p>{avaliacao.comentario}</p>}
      {(ehDono || ehAdmin) && (
        <div className="linha-acoes">
          {ehDono && (
            <button className="botao botao-secundario" disabled={processando} onClick={() => setEditando(true)}>
              Editar
            </button>
          )}
          <button className="botao botao-perigo" disabled={processando} onClick={excluir}>
            {ehDono ? 'Excluir' : 'Excluir (moderação)'}
          </button>
        </div>
      )}
      {erro && <MensagemErro mensagem={erro} />}
    </li>
  );
}
