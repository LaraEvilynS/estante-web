import StatusApi from '../components/StatusApi.jsx';

export default function Inicio() {
  return (
    <section>
      <h1>Bem-vindo à Estante</h1>
      <p>
        Cadastre os livros que você leu, organize sua estante e avalie suas leituras.
      </p>
      <h2>Conexão com a API</h2>
      <StatusApi />
    </section>
  );
}
