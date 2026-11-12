import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import { I18nProvider } from './i18n/I18nProvider';
import ScrollToTop from './components/ScrollToTop';
import './index.css';
import App from './App.tsx';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <I18nProvider>
      <AppProvider>
        <BrowserRouter>
          <ScrollToTop />
          <App />
        </BrowserRouter>
      </AppProvider>
    </I18nProvider>
  </React.StrictMode>,
);
