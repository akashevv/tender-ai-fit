import { Link } from 'react-router-dom';
import { CheckCircle, FileSearch, AlertTriangle, ArrowRight, Shield, Clock, Users } from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero */}
      <section className="bg-gradient-to-br from-blue-900 via-blue-800 to-teal-700 text-white py-24 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <span className="inline-block bg-teal-400/20 border border-teal-400/40 text-teal-300 text-sm font-medium px-4 py-1.5 rounded-full mb-6">
            Demo Prototype · BDA-2402 · Technology Entrepreneurship
          </span>
          <h1 className="text-4xl md:text-5xl font-bold leading-tight mb-6">
            Make Smarter Tender Decisions<br />
            <span className="text-teal-300">with Clear Evidence.</span>
          </h1>
          <p className="text-blue-100 text-lg md:text-xl max-w-2xl mx-auto mb-10">
            Compare tender requirements with your company documents, identify missing qualifications,
            and review participation risks — all in one place.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/dashboard"
              className="inline-flex items-center gap-2 px-8 py-3.5 bg-teal-500 hover:bg-teal-400 text-white font-semibold rounded-xl transition-all shadow-lg shadow-teal-900/30"
            >
              Start Tender Analysis <ArrowRight size={18} />
            </Link>
            <Link
              to="/profile"
              className="inline-flex items-center gap-2 px-8 py-3.5 bg-white/10 hover:bg-white/20 border border-white/30 text-white font-semibold rounded-xl transition-all"
            >
              View Company Profile
            </Link>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 px-6 bg-gray-50">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold text-gray-900 text-center mb-2">How It Works</h2>
          <p className="text-gray-500 text-center mb-12">Three simple steps to evaluate your tender readiness</p>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { step: '01', icon: <FileSearch size={24} />, title: 'Select a Tender', desc: 'Upload or choose a sample tender document to analyse.' },
              { step: '02', icon: <CheckCircle size={24} />, title: 'Review Requirements', desc: 'Each requirement is matched against your company profile evidence.' },
              { step: '03', icon: <Shield size={24} />, title: 'Get Readiness Report', desc: 'See Met / Missing / Unclear statuses with clear explanations and next steps.' },
            ].map(({ step, icon, title, desc }) => (
              <div key={step} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 relative">
                <span className="absolute top-4 right-4 text-3xl font-black text-gray-100">{step}</span>
                <div className="w-12 h-12 bg-blue-100 text-blue-700 rounded-xl flex items-center justify-center mb-4">
                  {icon}
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">{title}</h3>
                <p className="text-gray-500 text-sm">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Status indicators */}
      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold text-gray-900 text-center mb-2">Clear, Transparent Statuses</h2>
          <p className="text-gray-500 text-center mb-12">Every requirement gets a clear status with supporting evidence</p>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="border-l-4 border-green-500 bg-green-50 p-5 rounded-r-xl">
              <div className="flex items-center gap-2 mb-2">
                <CheckCircle size={18} className="text-green-600" />
                <span className="font-bold text-green-800">MET</span>
              </div>
              <p className="text-green-700 text-sm">Matching evidence found in your company profile. Requirement is satisfied.</p>
            </div>
            <div className="border-l-4 border-red-500 bg-red-50 p-5 rounded-r-xl">
              <div className="flex items-center gap-2 mb-2">
                <AlertTriangle size={18} className="text-red-600" />
                <span className="font-bold text-red-800">MISSING</span>
              </div>
              <p className="text-red-700 text-sm">No matching evidence found. Action required before submission.</p>
            </div>
            <div className="border-l-4 border-amber-500 bg-amber-50 p-5 rounded-r-xl">
              <div className="flex items-center gap-2 mb-2">
                <AlertTriangle size={18} className="text-amber-600" />
                <span className="font-bold text-amber-800">UNCLEAR</span>
              </div>
              <p className="text-amber-700 text-sm">Evidence exists but human verification is needed to confirm eligibility.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-20 px-6 bg-gray-50">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold text-gray-900 text-center mb-12">Why Tender AI Fit?</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { icon: <Clock size={22} />, title: 'Catch Gaps Early', desc: 'Identify missing documents before investing significant time in bid preparation.' },
              { icon: <Shield size={22} />, title: 'Transparent Results', desc: 'Each status links to specific company evidence and tender sections — no black box.' },
              { icon: <Users size={22} />, title: 'Human-First', desc: 'Specialists remain in control. Every assessment can be reviewed and overridden.' },
            ].map(({ icon, title, desc }) => (
              <div key={title} className="flex gap-4">
                <div className="w-10 h-10 bg-blue-100 text-blue-700 rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
                  {icon}
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">{title}</h3>
                  <p className="text-gray-500 text-sm">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Disclaimer */}
      <section className="py-6 px-6 bg-blue-950 text-center">
        <p className="text-blue-300 text-sm max-w-2xl mx-auto">
          <strong className="text-white">Demo prototype only.</strong> This tool does not guarantee tender eligibility, application success, or winning a contract. The final decision remains with a qualified procurement specialist.
        </p>
      </section>
    </div>
  );
}
