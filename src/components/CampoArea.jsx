export default function CampoArea({ rotulo, nome, valor, aoMudar, ajuda, linhas = 4, ...resto }) {
  return (
    <div className="campo">
      <label htmlFor={nome}>{rotulo}</label>
      <textarea id={nome} name={nome} rows={linhas} value={valor} onChange={(e) => aoMudar(e.target.value)} {...resto} />
      {ajuda && <small>{ajuda}</small>}
    </div>
  );
}
