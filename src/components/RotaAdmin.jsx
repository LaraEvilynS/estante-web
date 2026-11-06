import { Link, Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth.js';
import Carregando from './Carregando.jsx';

// Só deixa passar o administrador. A API também confere o perfil: esta é só a parte visual da proteção.
export default function RotaAdmin() {
  const { autenticado, carregando, usuario } = useAuth();
  const local = useLocation();

  if (carregando) return <Carregando texto="Verificando sessão..." />;
  if (!autenticado) return <Navigate to="/login" replace state={{ de: local.pathname }} />;
  if (usuario.perfil !== 'ADMIN') {
    return (
      <section>
        <h1>Acesso restrito</h1>
        <p>Esta área é exclusiva para administradores.</p>
        <Link to="/">Voltar para o início</Link>
      </section>
    );
  }
  return <Outlet />;
}
