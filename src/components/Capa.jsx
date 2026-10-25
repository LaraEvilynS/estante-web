import { useState } from 'react';

// Capa do livro; se não houver imagem (ou ela falhar), mostra a inicial do título.
export default function Capa({ livro, tamanho = 'media' }) {
  const [falhou, setFalhou] = useState(false);

  if (!livro.urlCapa || falhou) {
    return (
      <div className={`capa capa-${tamanho} capa-vazia`} aria-hidden="true">
        {livro.titulo.charAt(0).toUpperCase()}
      </div>
    );
  }
  return (
    <img
      className={`capa capa-${tamanho}`}
      src={livro.urlCapa}
      alt={`Capa de ${livro.titulo}`}
      loading="lazy"
      onError={() => setFalhou(true)}
    />
  );
}
