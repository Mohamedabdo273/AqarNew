import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import { LanguageProvider } from './context/LanguageContext';
import { AuthProvider } from './context/AuthContext';
import { UnitsProvider } from './context/UnitsContext';
import './index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <LanguageProvider>
      <AuthProvider>
        <UnitsProvider>
          <App />
        </UnitsProvider>
      </AuthProvider>
    </LanguageProvider>
  </StrictMode>,
);

