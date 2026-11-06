export default function MensagemErro({ mensagem, aoTentarNovamente }) {
  return (
    <div className="mensagem mensagem-erro" role="alert">
      <p>{mensagem}</p>
      {aoTentarNovamente && (
        <button className="botao" onClick={aoTentarNovamente}>
          Tentar novamente
        </button>
      )}
    </div>
  );
}
