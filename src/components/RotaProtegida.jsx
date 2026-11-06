import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth.js';
import Carregando from './Carregando.jsx';

// Só deixa passar quem está logado; os demais vão para o login.
export default function RotaProtegida() {
  const { autenticado, carregando } = useAuth();
  const local = useLocation();

  if (carregando) return <Carregando texto="Verificando sessão..." />;
  if (!autenticado) return <Navigate to="/login" replace state={{ de: local.pathname }} />;
  return <Outlet />;
}
