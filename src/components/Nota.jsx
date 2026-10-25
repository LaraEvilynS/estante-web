// Média de notas de um livro, ex.: "★ 4,5 (3)".
export default function Nota({ media, total }) {
  if (!total) return <span className="nota nota-vazia">Sem avaliações</span>;
  return (
    <span className="nota" title={`${total} avaliação(ões)`}>
      ★ {media.toFixed(1).replace('.', ',')} <small>({total})</small>
    </span>
  );
}
