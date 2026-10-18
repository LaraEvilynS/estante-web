export default function CampoFormulario({ rotulo, nome, tipo = 'text', valor, aoMudar, autoComplete, ajuda }) {
  return (
    <div className="campo">
      <label htmlFor={nome}>{rotulo}</label>
      <input
        id={nome}
        name={nome}
        type={tipo}
        value={valor}
        onChange={(e) => aoMudar(e.target.value)}
        autoComplete={autoComplete}
        required
      />
      {ajuda && <small>{ajuda}</small>}
    </div>
  );
}
