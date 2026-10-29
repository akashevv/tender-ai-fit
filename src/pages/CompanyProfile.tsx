import { useState } from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle, AlertTriangle, FileText, Award, Briefcase, User, ArrowRight, Calendar } from 'lucide-react';
import { demoCompany } from '../data/demoCompany';

export default function CompanyProfile() {
  const [company] = useState(demoCompany);

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Company Profile</h1>
          <p className="text-gray-500 mt-1">Fictional evidence metadata used during tender analysis.</p>
        </div>
        <Link to="/upload" className="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-700 text-white font-semibold rounded-xl hover:bg-blue-800 transition">
          Start Tender Analysis <ArrowRight size={16} />
        </Link>
      </div>

      {/* Company Header */}
      <div className="bg-gradient-to-r from-blue-900 to-teal-700 rounded-2xl p-6 text-white">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center text-2xl font-black">
            ABS
          </div>
          <div>
            <h2 className="text-xl font-bold">{company.name}</h2>
            <p className="text-blue-200 text-sm">{company.industry}</p>
            <p className="text-blue-100 text-sm mt-1">{company.description}</p>
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Licenses */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <div className="flex items-center gap-2 mb-4">
            <FileText size={18} className="text-blue-700" />
            <h3 className="font-bold text-gray-900">Licenses</h3>
          </div>
          <div className="space-y-3">
            {company.licenses.map(l => (
              <div key={l.id} className="flex items-start justify-between p-3 bg-green-50 rounded-xl border border-green-100">
                <div>
                  <p className="font-medium text-gray-900 text-sm">{l.name}</p>
                  <p className="text-xs text-gray-500 mt-0.5 flex items-center gap-1">
                    <CheckCircle size={11} className="text-green-600" /> {l.file}
                  </p>
                </div>
                <div className="flex items-center gap-1 text-xs text-gray-500">
                  <Calendar size={11} />
                  <span>{l.expires}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Certificates */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <div className="flex items-center gap-2 mb-4">
            <Award size={18} className="text-teal-700" />
            <h3 className="font-bold text-gray-900">Certificates</h3>
          </div>
          <div className="space-y-3">
            {company.certificates.map(c => (
              <div key={c.id} className="flex items-start justify-between p-3 bg-amber-50 rounded-xl border border-amber-100">
                <div>
                  <p className="font-medium text-gray-900 text-sm">{c.name}</p>
                  <p className="text-xs text-gray-500 mt-0.5 flex items-center gap-1">
                    <AlertTriangle size={11} className="text-amber-600" /> {c.file}
                  </p>
                </div>
                <div className="flex items-center gap-1 text-xs text-amber-600 font-medium">
                  <Calendar size={11} />
                  <span>{c.expires}</span>
                </div>
              </div>
            ))}
            <p className="text-xs text-amber-700 bg-amber-50 rounded-lg p-2 border border-amber-200">
              ⚠ This sample ISO 9001 certificate expired in June 2025. It is treated as MISSING (no current certificate) in the sample assessment.
            </p>
          </div>
        </div>

        {/* Projects */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <div className="flex items-center gap-2 mb-4">
            <Briefcase size={18} className="text-indigo-700" />
            <h3 className="font-bold text-gray-900">Completed Projects</h3>
          </div>
          <div className="space-y-3">
            {company.projects.map(p => (
              <div key={p.id} className="p-3 bg-gray-50 rounded-xl border border-gray-100">
                <p className="font-medium text-gray-900 text-sm">{p.title}</p>
                <p className="text-xs text-gray-500 mt-0.5">{p.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Personnel */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <div className="flex items-center gap-2 mb-4">
            <User size={18} className="text-violet-700" />
            <h3 className="font-bold text-gray-900">Qualified Personnel</h3>
          </div>
          <div className="space-y-3">
            {company.personnel.map(p => (
              <div key={p.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl border border-gray-100">
                <div className="w-8 h-8 bg-violet-100 text-violet-700 rounded-full flex items-center justify-center text-xs font-bold">
                  {p.name.split(' ').map(n => n[0]).join('')}
                </div>
                <div>
                  <p className="font-medium text-gray-900 text-sm">{p.name}</p>
                  <p className="text-xs text-gray-500">{p.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <p className="text-xs text-gray-400 text-center">
        This profile contains fictional metadata only. The named PDF files are illustrative references, not uploaded or verified documents.
      </p>
    </div>
  );
}
