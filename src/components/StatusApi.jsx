import { buscarSaude } from '../services/saudeService.js';
import { useCarregar } from '../hooks/useCarregar.js';
import Carregando from './Carregando.jsx';
import MensagemErro from './MensagemErro.jsx';

export default function StatusApi() {
  const { dados, erro, carregando, recarregar } = useCarregar(buscarSaude, 'saude');

  if (carregando && !dados) return <Carregando texto="Verificando a API..." />;
  if (erro) return <MensagemErro mensagem={erro} aoTentarNovamente={recarregar} />;
  if (!dados) return null;

  return (
    <div className="mensagem mensagem-sucesso">
      <p>
        API: <strong>{dados.status}</strong> | Banco: <strong>{dados.banco}</strong>
      </p>
    </div>
  );
}
