import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import { LanguageProvider } from './context/LanguageContext';
import { AuthProvider } from './context/AuthContext';
import { UnitsProvider } from './context/UnitsContext';
import { RequestsProvider } from './context/RequestsContext';
import './index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <LanguageProvider>
      <AuthProvider>
        <UnitsProvider>
          <RequestsProvider>
            <App />
          </RequestsProvider>
        </UnitsProvider>
      </AuthProvider>
    </LanguageProvider>
  </StrictMode>,
);

