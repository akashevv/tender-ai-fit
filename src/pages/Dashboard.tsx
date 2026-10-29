import { Link } from 'react-router-dom';
import { Building2, FileText, ClipboardCheck, ArrowRight, CheckCircle, AlertTriangle, HelpCircle } from 'lucide-react';
import { demoCompany } from '../data/demoCompany';
import { demoTender } from '../data/demoTender';
import { createAssessment } from '../utils/assessment';

export default function Dashboard() {
  const company = demoCompany;
  const preview = createAssessment(demoTender);
  const met = preview.filter(r => r.status === 'MET').length;
  const missing = preview.filter(r => r.status === 'MISSING').length;
  const unclear = preview.filter(r => r.status === 'UNCLEAR').length;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-500 mt-1">Explore a fictional company profile and a demonstration tender readiness check.</p>
        </div>
        <Link
          to="/upload"
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-700 hover:bg-blue-800 text-white font-semibold rounded-xl transition-all"
        >
          New Tender Analysis <ArrowRight size={16} />
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Licenses', value: company.licenses.length, color: 'bg-blue-100 text-blue-700', icon: <FileText size={20} /> },
          { label: 'Certificates', value: company.certificates.length, color: 'bg-teal-100 text-teal-700', icon: <ClipboardCheck size={20} /> },
          { label: 'Projects', value: company.projects.length, color: 'bg-indigo-100 text-indigo-700', icon: <Building2 size={20} /> },
          { label: 'Personnel', value: company.personnel.length, color: 'bg-violet-100 text-violet-700', icon: <Building2 size={20} /> },
        ].map(({ label, value, color, icon }) => (
          <div key={label} className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
            <div className={`w-10 h-10 rounded-lg flex items-center justify-center mb-3 ${color}`}>
              {icon}
            </div>
            <p className="text-2xl font-bold text-gray-900">{value}</p>
            <p className="text-sm text-gray-500 mt-0.5">{label}</p>
          </div>
        ))}
      </div>

      {/* Company Card */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
        <div className="flex items-start justify-between">
          <div>
            <h2 className="font-bold text-gray-900 text-lg">{company.name}</h2>
            <p className="text-gray-500 text-sm mt-1">{company.industry}</p>
            <p className="text-gray-600 text-sm mt-2 max-w-xl">{company.description}</p>
          </div>
          <Link to="/profile" className="text-blue-700 hover:text-blue-900 text-sm font-medium flex items-center gap-1">
            View Profile <ArrowRight size={14} />
          </Link>
        </div>
      </div>

      {/* Available Tenders */}
      <div>
        <h2 className="font-bold text-gray-900 mb-4">Available Demo Tender</h2>
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <div className="flex items-start justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs font-semibold px-2 py-0.5 bg-blue-100 text-blue-700 rounded-full">DEMO</span>
                <span className="text-xs text-gray-400">ID: DEMO-ASTANA-2026-001</span>
              </div>
              <h3 className="font-semibold text-gray-900">Construction and Renovation Services — Astana 2026</h3>
              <p className="text-gray-500 text-sm mt-1">{demoTender.requirements.length} requirements · Construction & Engineering · Kazakhstan</p>
              <div className="flex gap-3 mt-3 text-sm">
                <span className="flex items-center gap-1 text-green-600"><CheckCircle size={14} /> {met} Met</span>
                <span className="flex items-center gap-1 text-red-500"><AlertTriangle size={14} /> {missing} Missing</span>
                <span className="flex items-center gap-1 text-amber-500"><HelpCircle size={14} /> {unclear} Unclear</span>
              </div>
            </div>
            <Link
              to="/upload"
              className="flex-shrink-0 px-4 py-2 bg-blue-700 text-white text-sm font-semibold rounded-xl hover:bg-blue-800 transition"
            >
              Analyse
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
