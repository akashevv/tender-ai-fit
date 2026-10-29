import { Routes, Route, Link } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import Dashboard from './pages/Dashboard';
import CompanyProfile from './pages/CompanyProfile';
import TenderUpload from './pages/TenderUpload';
import TenderAnalysis from './pages/TenderAnalysis';
import ResultsDashboard from './pages/ResultsDashboard';
import FeedbackPage from './pages/FeedbackPage';

function App() {
  return (
    <div className="min-h-screen bg-gray-50 text-gray-800">
      <nav className="px-5 md:px-8 py-4 border-b border-gray-200 bg-white shadow-sm flex flex-wrap justify-between items-center gap-4">
        <Link to="/" className="text-xl md:text-2xl font-bold text-blue-700 tracking-tight">Tender AI Fit</Link>
        <div className="flex flex-wrap gap-x-5 gap-y-2 text-sm font-medium text-gray-600">
          <Link to="/" className="hover:text-blue-700 transition">Home</Link>
          <Link to="/dashboard" className="hover:text-blue-700 transition">Dashboard</Link>
          <Link to="/profile" className="hover:text-blue-700 transition">Company Profile</Link>
          <Link to="/upload" className="hover:text-blue-700 transition">Upload Tender</Link>
          <Link to="/feedback" className="hover:text-blue-700 transition">Feedback</Link>
        </div>
      </nav>
      <main className="w-full max-w-6xl mx-auto px-4 sm:px-6 py-8 flex-1">
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/profile" element={<CompanyProfile />} />
          <Route path="/upload" element={<TenderUpload />} />
          <Route path="/analysis" element={<TenderAnalysis />} />
          <Route path="/results" element={<ResultsDashboard />} />
          <Route path="/feedback" element={<FeedbackPage />} />
        </Routes>
      </main>
      <footer className="mt-12 py-4 text-center text-sm text-gray-400 border-t border-gray-200">
        © 2026 Tender AI Fit · Demo prototype · BDA-2402
      </footer>
    </div>
  );
}

export default App;