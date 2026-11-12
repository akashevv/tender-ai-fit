import { Routes, Route, Link, Navigate } from 'react-router-dom';
import Header from './components/Header';
import ErrorBoundary from './components/ErrorBoundary';
import { Notice } from './components/ui';
import LandingPage from './pages/LandingPage';
import Dashboard from './pages/Dashboard';
import CompanyProfile from './pages/CompanyProfile';
import TenderUpload from './pages/TenderUpload';
import TenderAnalysis from './pages/TenderAnalysis';
import ResultsDashboard from './pages/ResultsDashboard';
import FeedbackPage from './pages/FeedbackPage';
import PrivacyPage from './pages/PrivacyPage';
import NotFound from './pages/NotFound';
import { useI18n } from './i18n/useI18n';
import { useApp } from './context/appState';

function App() {
  const { t } = useI18n();
  const { storageOk } = useApp();

  return (
    <div className="flex min-h-svh flex-col bg-slate-50 text-slate-800">
      <a href="#main" className="sr-only z-50 rounded-lg bg-blue-800 px-4 py-2 text-white focus:not-sr-only focus:absolute focus:left-4 focus:top-4">
        {t('nav.skip')}
      </a>
      <Header />
      {!storageOk && (
        <div className="no-print mx-auto w-full max-w-6xl px-4 pt-4 sm:px-6">
          <Notice tone="warning" role="status">
            {t('storage.unavailable')}
          </Notice>
        </div>
      )}
      <main id="main" tabIndex={-1} className="mx-auto w-full max-w-6xl flex-1 px-4 py-8 outline-none sm:px-6">
        <ErrorBoundary>
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/profile" element={<CompanyProfile />} />
            <Route path="/tender" element={<TenderUpload />} />
            <Route path="/upload" element={<Navigate to="/tender" replace />} />
            <Route path="/analysis" element={<TenderAnalysis />} />
            <Route path="/report" element={<ResultsDashboard />} />
            <Route path="/results" element={<Navigate to="/report" replace />} />
            <Route path="/feedback" element={<FeedbackPage />} />
            <Route path="/privacy" element={<PrivacyPage />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </ErrorBoundary>
      </main>
      <footer className="no-print border-t border-slate-200 bg-white">
        <div className="mx-auto flex max-w-6xl flex-col gap-2 px-4 py-6 text-sm text-slate-600 sm:px-6 md:flex-row md:items-center md:justify-between">
          <div>
            <p>{t('footer.text')}</p>
            <p className="text-xs">{t('footer.team')}</p>
          </div>
          <Link to="/privacy" className="font-medium text-blue-800 hover:underline">
            {t('nav.privacy')}
          </Link>
        </div>
      </footer>
    </div>
  );
}

export default App;
