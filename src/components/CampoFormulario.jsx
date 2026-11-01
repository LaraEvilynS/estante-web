export default function CampoFormulario({
  rotulo, nome, tipo = 'text', valor, aoMudar, autoComplete, ajuda, obrigatorio = true, ...resto
}) {
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
        required={obrigatorio}
        {...resto}
      />
      {ajuda && <small>{ajuda}</small>}
    </div>
  );
}
