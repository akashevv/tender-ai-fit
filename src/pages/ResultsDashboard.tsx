import { useContext } from 'react';
import { Link } from 'react-router-dom';
import { AppContext } from '../context/AppContext';
import { CheckCircle, AlertTriangle, HelpCircle, ArrowRight, Printer } from 'lucide-react';

function StatusBadge({ status }: { status: 'MET' | 'MISSING' | 'UNCLEAR' }) {
  if (status === 'MET') return (
    <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-green-100 text-green-800 rounded-full text-xs font-bold">
      <CheckCircle size={12} /> MET
    </span>
  );
  if (status === 'MISSING') return (
    <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-red-100 text-red-800 rounded-full text-xs font-bold">
      <AlertTriangle size={12} /> MISSING
    </span>
  );
  return (
    <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-amber-100 text-amber-800 rounded-full text-xs font-bold">
      <HelpCircle size={12} /> UNCLEAR
    </span>
  );
}

export default function ResultsDashboard() {
  const { analysisResults, selectedTender } = useContext(AppContext);

  if (!analysisResults || !selectedTender) {
    return (
      <div className="text-center py-16">
        <p className="text-gray-500 mb-4">No analysis results available.</p>
        <Link to="/upload" className="text-blue-700 hover:underline">← Select a tender to analyse</Link>
      </div>
    );
  }

  const total = analysisResults.length;
  const met = analysisResults.filter(r => r.status === 'MET').length;
  const missing = analysisResults.filter(r => r.status === 'MISSING').length;
  const unclear = analysisResults.filter(r => r.status === 'UNCLEAR').length;
  const readiness = total > 0 ? Math.round((met / total) * 100) : 0;
  const readinessColor = readiness >= 70 ? 'text-green-600' : readiness >= 40 ? 'text-amber-600' : 'text-red-600';
  const readinessBg = readiness >= 70 ? 'bg-green-100' : readiness >= 40 ? 'bg-amber-100' : 'bg-red-100';

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <span className="text-xs font-semibold px-2 py-0.5 bg-blue-100 text-blue-700 rounded-full">{selectedTender.mode === 'demo' ? 'DEMO RESULTS' : 'MANUAL REVIEW RESULTS'}</span>
          <h1 className="text-2xl font-bold text-gray-900 mt-2">Results Dashboard</h1>
          <p className="text-gray-500 mt-1 text-sm">{selectedTender.name}</p>
        </div>
        <button onClick={() => window.print()} className="inline-flex items-center gap-2 px-4 py-2 border border-gray-200 text-gray-700 font-medium rounded-xl hover:bg-gray-50 transition text-sm">
          <Printer size={16} /> Print / Save PDF
        </button>
      </div>

      {/* Readiness Card */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
        <div className="flex flex-col md:flex-row md:items-center gap-6">
          <div className={`w-28 h-28 rounded-full flex flex-col items-center justify-center ${readinessBg} flex-shrink-0 mx-auto md:mx-0`}>
            <span className={`text-3xl font-black ${readinessColor}`}>{readiness}%</span>
            <span className="text-xs text-gray-500 mt-0.5">Readiness</span>
          </div>
          <div className="flex-1">
            <h2 className="font-bold text-gray-900 mb-1">Illustrative Readiness Indicator</h2>
            <p className="text-sm text-gray-500 mb-3">
              Formula: Met ({met}) ÷ Total ({total}) × 100 = <strong>{readiness}%</strong>
            </p>
            <p className="text-xs text-amber-700 bg-amber-50 border border-amber-200 rounded-lg p-2">
              ⚠ This is an illustrative completeness indicator only. It is <strong>not</strong> a probability of winning and <strong>not</strong> a legal eligibility determination. Additional verification is required before deciding to participate.
            </p>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-green-50 border border-green-100 rounded-2xl p-5 text-center">
          <CheckCircle size={24} className="text-green-600 mx-auto mb-2" />
          <p className="text-3xl font-black text-green-700">{met}</p>
          <p className="text-sm text-green-600 font-medium">Met</p>
        </div>
        <div className="bg-red-50 border border-red-100 rounded-2xl p-5 text-center">
          <AlertTriangle size={24} className="text-red-500 mx-auto mb-2" />
          <p className="text-3xl font-black text-red-600">{missing}</p>
          <p className="text-sm text-red-500 font-medium">Missing</p>
        </div>
        <div className="bg-amber-50 border border-amber-100 rounded-2xl p-5 text-center">
          <HelpCircle size={24} className="text-amber-500 mx-auto mb-2" />
          <p className="text-3xl font-black text-amber-600">{unclear}</p>
          <p className="text-sm text-amber-500 font-medium">Unclear</p>
        </div>
      </div>

      {/* Checklist */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
        <h2 className="font-bold text-gray-900 mb-4">Detailed Requirement Checklist</h2>
        <div className="space-y-3">
          {analysisResults.map(r => {
            const req = selectedTender.requirements.find(rq => rq.id === r.requirementId)!;
            return (
              <div key={r.requirementId} className="flex items-start gap-3 p-4 rounded-xl border border-gray-100 bg-gray-50">
                <div className="mt-0.5"><StatusBadge status={r.status} /></div>
                <div className="flex-1">
                  <p className="font-semibold text-gray-900 text-sm">{req.title}</p>
                  <p className="text-xs text-gray-500 mt-1">{r.explanation}</p>
                  {r.evidence && <p className="text-xs text-blue-700 mt-1 font-medium">Sample evidence: {r.evidence}</p>}
                  <p className="text-xs text-gray-500 mt-1">Source: {r.source}</p>
                  {r.reviewerNote && <p className="text-xs text-gray-700 mt-2"><strong>Reviewer note:</strong> {r.reviewerNote}</p>}
                  {r.reviewerOverride && <p className="text-xs text-blue-700 mt-1">Status manually changed by reviewer</p>}
                  {r.reviewed && <p className="text-xs text-teal-700 mt-1">✓ Reviewed</p>}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Risks */}
      <div className="bg-white rounded-2xl border border-red-100 shadow-sm p-6">
        <h2 className="font-bold text-gray-900 mb-3 flex items-center gap-2"><AlertTriangle size={18} className="text-red-500" /> Potential Participation Risks</h2>
        <ul className="space-y-2 text-sm text-gray-700">
          {missing > 0 && <li>• {missing} mandatory requirement(s) have no matching evidence and must be resolved before submission.</li>}
          {unclear > 0 && <li>• {unclear} requirement(s) need manual verification to confirm eligibility.</li>}
          {selectedTender.mode === 'demo' && <li>• The sample ISO 9001 certificate expired in June 2025. A current certificate is missing.</li>}
          {selectedTender.mode === 'demo' && <li>• The sample projects require manual comparison with the tender scope.</li>}
          {selectedTender.mode === 'manual' && <li>• No automatic check of the uploaded PDF was performed; verify every manually entered requirement.</li>}
        </ul>
      </div>

      {/* Next Steps */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
        <h2 className="font-bold text-gray-900 mb-3">Recommended Next Steps</h2>
        <ol className="list-decimal list-inside space-y-2 text-sm text-gray-700">
          <li>Obtain any missing mandatory documents before the tender deadline.</li>
          <li>Verify that all certificates are current and not expired.</li>
          <li>Manually confirm that project references match the required scope.</li>
          <li>Have a qualified procurement specialist review all UNCLEAR items.</li>
          <li>Make the final participation decision based on human expert review.</li>
        </ol>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <Link to="/feedback" className="flex-1 flex items-center justify-center gap-2 py-3 bg-blue-700 text-white font-semibold rounded-xl hover:bg-blue-800 transition">
          Provide Feedback <ArrowRight size={18} />
        </Link>
        <Link to="/upload" className="flex-1 flex items-center justify-center gap-2 py-3 border border-gray-200 text-gray-700 font-semibold rounded-xl hover:bg-gray-50 transition">
          Analyse Another Tender
        </Link>
      </div>
    </div>
  );
}

