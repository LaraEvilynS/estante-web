import { useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { atualizarLivro, buscarLivro, criarLivro } from '../services/livroService.js';
import { useCarregar } from '../hooks/useCarregar.js';
import { useAcao } from '../hooks/useAcao.js';
import BuscaOpenLibrary from '../components/BuscaOpenLibrary.jsx';
import CampoFormulario from '../components/CampoFormulario.jsx';
import CampoArea from '../components/CampoArea.jsx';
import Carregando from '../components/Carregando.jsx';
import MensagemErro from '../components/MensagemErro.jsx';

const VAZIO = { titulo: '', autor: '', isbn: '', urlCapa: '', paginas: '', genero: '', sinopse: '' };

function paraTexto(livro) {
  return {
    titulo: livro.titulo ?? '',
    autor: livro.autor ?? '',
    isbn: livro.isbn ?? '',
    urlCapa: livro.urlCapa ?? '',
    paginas: livro.paginas ?? '',
    genero: livro.genero ?? '',
    sinopse: livro.sinopse ?? '',
  };
}

function FormularioLivro({ inicial, id }) {
  const navegar = useNavigate();
  const { executar, processando, erro } = useAcao();
  const [campos, setCampos] = useState(inicial);
  const editando = Boolean(id);

  const mudar = (nome) => (valor) => setCampos((atual) => ({ ...atual, [nome]: valor }));

  // Ao editar, campo vazio vira null (limpa o dado); ao criar, é simplesmente omitido.
  const opcional = (valor) => (valor.trim() === '' ? (editando ? null : undefined) : valor.trim());

  async function aoEnviar(evento) {
    evento.preventDefault();
    const dados = {
      titulo: campos.titulo.trim(),
      autor: campos.autor.trim(),
      isbn: opcional(campos.isbn),
      urlCapa: opcional(campos.urlCapa),
      paginas: campos.paginas === '' ? (editando ? null : undefined) : Number(campos.paginas),
      genero: opcional(campos.genero),
      sinopse: opcional(campos.sinopse),
    };
    const r = await executar(() => (editando ? atualizarLivro(id, dados) : criarLivro(dados)));
    if (r.ok) navegar(`/livros/${r.resultado.id}`);
  }

  // Preenche o formulário com o livro escolhido na Open Library.
  function preencher(externo) {
    setCampos({
      titulo: externo.titulo,
      autor: externo.autor,
      isbn: externo.isbn ?? '',
      urlCapa: externo.urlCapa ?? '',
      paginas: externo.paginas ?? '',
      genero: externo.genero ?? '',
      sinopse: externo.sinopse ?? '',
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  return (
    <>
      {!editando && <BuscaOpenLibrary aoEscolher={preencher} />}

      <form className="painel formulario" onSubmit={aoEnviar}>
        <h2>{editando ? 'Dados do livro' : 'Novo livro'}</h2>
        <CampoFormulario rotulo="Título" nome="titulo" valor={campos.titulo} aoMudar={mudar('titulo')} maxLength={200} />
        <CampoFormulario rotulo="Autor" nome="autor" valor={campos.autor} aoMudar={mudar('autor')} maxLength={200} />
        <CampoFormulario rotulo="ISBN" nome="isbn" valor={campos.isbn} aoMudar={mudar('isbn')} obrigatorio={false} ajuda="10 ou 13 dígitos (opcional)." />
        <CampoFormulario rotulo="URL da capa" nome="urlCapa" tipo="url" valor={campos.urlCapa} aoMudar={mudar('urlCapa')} obrigatorio={false} />
        <CampoFormulario rotulo="Páginas" nome="paginas" tipo="number" min={1} valor={campos.paginas} aoMudar={mudar('paginas')} obrigatorio={false} />
        <CampoFormulario rotulo="Gênero" nome="genero" valor={campos.genero} aoMudar={mudar('genero')} obrigatorio={false} maxLength={80} />
        <CampoArea rotulo="Sinopse" nome="sinopse" valor={campos.sinopse} aoMudar={mudar('sinopse')} linhas={6} maxLength={5000} />
        {erro && <MensagemErro mensagem={erro} />}
        <div className="linha-acoes">
          <button className="botao" type="submit" disabled={processando}>
            {processando ? 'Salvando...' : editando ? 'Salvar alterações' : 'Cadastrar livro'}
          </button>
          <Link className="botao botao-secundario" to={editando ? `/livros/${id}` : '/livros'}>
            Cancelar
          </Link>
        </div>
      </form>
    </>
  );
}

// Cadastro e edição de livro (somente administrador, ver RotaAdmin).
export default function AdminLivroForm() {
  const { id } = useParams();
  const livro = useCarregar(() => (id ? buscarLivro(id) : Promise.resolve(null)), id || 'novo');

  return (
    <section>
      <h1>{id ? 'Editar livro' : 'Cadastrar livro'}</h1>
      {livro.carregando && !livro.dados && id && <Carregando texto="Carregando livro..." />}
      {livro.erro && <MensagemErro mensagem={livro.erro} aoTentarNovamente={livro.recarregar} />}
      {!livro.erro && !livro.carregando && (
        <FormularioLivro key={id || 'novo'} id={id} inicial={livro.dados ? paraTexto(livro.dados) : VAZIO} />
      )}
    </section>
  );
}
