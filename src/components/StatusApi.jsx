import { useEffect, useState } from 'react';
import { buscarSaude } from '../services/saudeService.js';
import Carregando from './Carregando.jsx';
import MensagemErro from './MensagemErro.jsx';

export default function StatusApi() {
  const [dados, setDados] = useState(null);
  const [erro, setErro] = useState('');
  const [carregando, setCarregando] = useState(true);

  async function verificar() {
    setCarregando(true);
    setErro('');
    try {
      setDados(await buscarSaude());
    } catch (e) {
      setErro(e.message);
    } finally {
      setCarregando(false);
    }
  }

  useEffect(() => {
    verificar();
  }, []);

  if (carregando) return <Carregando texto="Verificando a API..." />;
  if (erro) return <MensagemErro mensagem={erro} aoTentarNovamente={verificar} />;

  return (
    <div className="mensagem mensagem-sucesso">
      <p>
        API: <strong>{dados.status}</strong> | Banco: <strong>{dados.banco}</strong>
      </p>
    </div>
  );
}
