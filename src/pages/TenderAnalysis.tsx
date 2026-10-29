import { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AppContext } from '../context/AppContext';
import type { AnalysisResult } from '../context/AppContext';
import { CheckCircle, AlertTriangle, HelpCircle, ChevronDown, ChevronUp, ArrowRight, Edit3 } from 'lucide-react';

function StatusBadge({ status }: { status: AnalysisResult['status'] }) {
  const styles = {
    MET: 'bg-green-100 text-green-800',
    MISSING: 'bg-red-100 text-red-800',
    UNCLEAR: 'bg-amber-100 text-amber-800',
  };
  const Icon = status === 'MET' ? CheckCircle : status === 'MISSING' ? AlertTriangle : HelpCircle;
  return <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold ${styles[status]}`}><Icon size={12}/>{status}</span>;
}

export default function TenderAnalysis() {
  const { selectedTender, setAnalysisResults, analysisResults } = useContext(AppContext);
  const navigate = useNavigate();
  const [expanded, setExpanded] = useState<number | null>(1);
  const [warning, setWarning] = useState<number | null>(null);

  if (!selectedTender || !analysisResults) {
    return <div className="text-center py-16"><p className="text-gray-500 mb-4">No assessment selected.</p><Link to="/upload" className="text-blue-700 hover:underline">← Choose a tender</Link></div>;
  }

  const update = (id: number, patch: Partial<AnalysisResult>) => {
    setAnalysisResults(analysisResults.map(r => r.requirementId === id ? { ...r, ...patch } : r));
  };
  const overrideStatus = (r: AnalysisResult, newStatus: AnalysisResult['status']) => {
    if (!r.reviewerNote?.trim()) { setWarning(r.requirementId); return; }
    setWarning(null);
    update(r.requirementId, { status: newStatus, reviewerOverride: true, reviewed: true });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <span className="inline-flex bg-blue-50 text-blue-700 rounded-full px-3 py-1 text-xs font-semibold mb-2">STEP 3 OF 4 · {selectedTender.mode === 'demo' ? 'DEMO ASSESSMENT' : 'MANUAL REVIEW'}</span>
          <h1 className="text-3xl font-bold text-gray-900">Tender Analysis</h1>
          <p className="text-gray-500 mt-1 text-sm">{selectedTender.name}</p>
        </div>
        <button onClick={() => navigate('/results')} className="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-700 text-white font-semibold rounded-xl hover:bg-blue-800">View Results <ArrowRight size={16}/></button>
      </div>
      <p className="text-sm text-amber-800 bg-amber-50 border border-amber-200 rounded-xl p-4">
        <strong>{selectedTender.mode === 'demo' ? 'Simulated assessment.' : 'Manual review only.'}</strong> {selectedTender.mode === 'demo' ? 'Statuses come from fictional tender requirements, sample metadata and deterministic rules, not live AI or verified source documents.' : 'Your PDF is not parsed or uploaded. All manually entered requirements start UNCLEAR until you assess them.'} The final eligibility decision belongs to a qualified specialist.
      </p>
      <div className="flex flex-wrap gap-2 text-sm text-gray-600">
        <span className="rounded-lg px-3 py-2 bg-white border border-gray-200">{analysisResults.length} requirements</span>
        <span className="rounded-lg px-3 py-2 bg-white border border-gray-200">{analysisResults.filter(r => r.reviewed).length} reviewed</span>
        <span className="rounded-lg px-3 py-2 bg-white border border-gray-200">{analysisResults.filter(r => r.status === 'MISSING').length} missing</span>
      </div>
      <div className="space-y-3">
        {selectedTender.requirements.map(req => {
          const result = analysisResults.find(r => r.requirementId === req.id);
          if (!result) return null;
          const open = expanded === req.id;
          const borderColor = result.status === 'MET' ? 'border-green-200' : result.status === 'MISSING' ? 'border-red-200' : 'border-amber-200';
          return (
            <div key={req.id} className={`bg-white rounded-2xl border shadow-sm overflow-hidden ${borderColor}`}>
              <button type="button" className="w-full flex items-center justify-between gap-3 p-5 text-left hover:bg-gray-50" aria-expanded={open} onClick={() => setExpanded(open ? null : req.id)}>
                <div className="flex items-center gap-3 min-w-0"><span className="text-xs text-gray-400 font-mono">{req.id}.</span><span className="font-semibold text-gray-900 text-sm">{req.title}</span></div>
                <span className="flex items-center gap-2 flex-shrink-0"><StatusBadge status={result.status}/>{open ? <ChevronUp size={16}/> : <ChevronDown size={16}/>}</span>
              </button>
              {open && <div className="px-5 pb-5 space-y-4 border-t border-gray-100">
                <div className="pt-4"><p className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-1">Original requirement</p><p className="text-sm text-gray-800">{req.description}</p></div>
                <div><p className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-1">Evidence reference</p><p className="text-sm text-gray-800">{result.evidence || 'No verified evidence reference'}</p><p className="text-xs text-gray-500 mt-1">{result.source}</p></div>
                <div><p className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-1">Why this status?</p><p className="text-sm text-gray-700">{result.explanation}</p></div>
                {result.reviewerOverride && <p className="text-xs rounded-lg bg-blue-50 p-3 text-blue-800">Status updated by the reviewer. See the reviewer note for the reason.</p>}
                <div><label htmlFor={`review-note-${req.id}`} className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-2 block">Reviewer notes / justification</label><textarea id={`review-note-${req.id}`} rows={3} value={result.reviewerNote || ''} onChange={e => update(req.id, { reviewerNote: e.target.value })} placeholder="Why does the evidence support your decision?" className="w-full text-sm border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-300"/></div>
                <div><p className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-2 flex items-center gap-1"><Edit3 size={12}/> Change status (requires a note)</p><div className="flex gap-2 flex-wrap">{(['MET', 'MISSING', 'UNCLEAR'] as const).map(s => <button key={s} type="button" onClick={() => overrideStatus(result, s)} className={`rounded-lg text-xs font-semibold px-3 py-2 border ${result.status === s ? 'bg-blue-700 text-white border-blue-700' : 'bg-white text-gray-700 border-gray-300 hover:border-blue-400'}`}>{s}</button>)}<button type="button" onClick={() => update(req.id, { reviewed: !result.reviewed })} className="rounded-lg text-xs font-semibold px-3 py-2 border border-gray-300 hover:bg-gray-100">{result.reviewed ? '✓ Reviewed' : 'Mark reviewed'}</button></div>
                  {warning === req.id && <p className="text-xs mt-2 text-red-600" role="alert">Write a reviewer note explaining your decision before changing the status.</p>}
                </div>
              </div>}
            </div>
          );
        })}
      </div>
      <button onClick={() => navigate('/results')} className="w-full flex items-center justify-center gap-2 py-3.5 bg-blue-700 text-white font-semibold rounded-xl hover:bg-blue-800">Proceed to Results <ArrowRight size={18}/></button>
    </div>
  );
}
