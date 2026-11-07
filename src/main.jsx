import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App.jsx';
import AuthProvider from './contexts/AuthProvider.jsx';
import AvisoProvider from './contexts/AvisoProvider.jsx';
import './styles/global.css';
import './styles/formularios.css';
import './styles/catalogo.css';
import './styles/acoes.css';
import './styles/avisos.css';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <AvisoProvider>
          <App />
        </AvisoProvider>
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>,
);
