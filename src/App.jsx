import { Routes, Route } from 'react-router-dom';
import Layout from './components/Layout.jsx';
import RotaProtegida from './components/RotaProtegida.jsx';
import Inicio from './pages/Inicio.jsx';
import Livros from './pages/Livros.jsx';
import LivroDetalhe from './pages/LivroDetalhe.jsx';
import Estante from './pages/Estante.jsx';
import Login from './pages/Login.jsx';
import Cadastro from './pages/Cadastro.jsx';
import EsqueciSenha from './pages/EsqueciSenha.jsx';
import RedefinirSenha from './pages/RedefinirSenha.jsx';
import Perfil from './pages/Perfil.jsx';
import NaoEncontrada from './pages/NaoEncontrada.jsx';

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Inicio />} />
        <Route path="/livros" element={<Livros />} />
        <Route path="/livros/:id" element={<LivroDetalhe />} />
        <Route path="/login" element={<Login />} />
        <Route path="/cadastro" element={<Cadastro />} />
        <Route path="/esqueci-senha" element={<EsqueciSenha />} />
        <Route path="/redefinir-senha" element={<RedefinirSenha />} />
        <Route element={<RotaProtegida />}>
          <Route path="/estante" element={<Estante />} />
          <Route path="/perfil" element={<Perfil />} />
        </Route>
        <Route path="*" element={<NaoEncontrada />} />
      </Route>
    </Routes>
  );
}
