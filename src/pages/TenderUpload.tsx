import { useContext, useRef, useState } from 'react';
import type { ChangeEvent, DragEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppContext } from '../context/AppContext';
import type { Tender } from '../context/AppContext';
import { demoTender } from '../data/demoTender';
import { createAssessment } from '../utils/assessment';
import { Upload, FileText, CheckCircle, ArrowRight, AlertCircle } from 'lucide-react';

export default function TenderUpload() {
  const { setSelectedTender, setAnalysisResults } = useContext(AppContext);
  const navigate = useNavigate();
  const inputRef = useRef<HTMLInputElement>(null);
  const [mode, setMode] = useState<'sample' | 'manual' | null>(null);
  const [fileName, setFileName] = useState('');
  const [requirementsText, setRequirementsText] = useState('');
  const [error, setError] = useState('');

  const selectFile = (file?: File) => {
    if (!file) return;
    if (!file.name.toLowerCase().endsWith('.pdf') || (file.type && file.type !== 'application/pdf')) {
      setError('Please select a PDF file.');
      return;
    }
    if (file.size > 20 * 1024 * 1024) {
      setError('Maximum file size is 20 MB.');
      return;
    }
    setFileName(file.name);
    setMode('manual');
    setError('');
  };

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => selectFile(event.target.files?.[0]);
  const handleDrop = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    selectFile(event.dataTransfer.files[0]);
  };

  const titles = requirementsText.split('\n').map(s => s.trim()).filter(Boolean).slice(0, 30);
  const canRun = mode === 'sample' || (mode === 'manual' && !!fileName && titles.length > 0);

  const handleContinue = () => {
    if (!canRun) return;
    const tender: Tender = mode === 'sample' ? demoTender : {
      id: 2,
      name: `${fileName} — manual review`,
      mode: 'manual',
      requirements: titles.map((title, index) => ({ id: index + 1, title, description: title })),
    };
    setSelectedTender(tender);
    setAnalysisResults(createAssessment(tender));
    navigate('/analysis');
  };

  return (
    <div className="space-y-7 max-w-3xl mx-auto">
      <div>
        <span className="inline-flex bg-teal-50 text-teal-700 rounded-full px-3 py-1 text-xs font-semibold mb-2">STEP 2 OF 4 · SELECT A TENDER</span>
        <h1 className="text-3xl font-bold text-gray-900">Upload or Select Tender</h1>
        <p className="text-gray-500 mt-1">Try the complete sample assessment, or select your own PDF for a transparent manual review.</p>
      </div>

      <div onDrop={handleDrop} onDragOver={e => e.preventDefault()} className={`border-2 border-dashed rounded-2xl p-8 text-center bg-white transition-colors ${mode === 'manual' ? 'border-teal-500' : 'border-gray-300 hover:border-blue-400'}`}>
        <div className="w-14 h-14 bg-blue-50 rounded-2xl flex items-center justify-center mx-auto mb-4"><Upload size={25} className="text-blue-600" /></div>
        <p className="font-semibold text-gray-800 mb-1">Drop a PDF here or choose a file</p>
        <p className="text-sm text-gray-500 mb-4">PDF files only · up to 20 MB · processed locally in your browser</p>
        <input ref={inputRef} type="file" accept=".pdf,application/pdf" onChange={handleFileChange} className="hidden" aria-label="Select tender PDF" />
        <button type="button" onClick={() => inputRef.current?.click()} className="px-5 py-2.5 rounded-xl bg-blue-700 text-white text-sm font-semibold hover:bg-blue-800">Browse Files</button>
        {fileName && mode === 'manual' && <p className="mt-4 text-sm text-teal-700 font-semibold flex items-center justify-center gap-2"><CheckCircle size={17} /> Selected: {fileName}</p>}
        {error && <p className="mt-3 text-red-600 text-sm flex items-center gap-2 justify-center"><AlertCircle size={16} />{error}</p>}
      </div>

      {mode === 'manual' && (
        <div className="bg-white rounded-2xl p-6 border border-teal-200 space-y-3">
          <h2 className="font-bold text-gray-900">Enter requirements from your PDF</h2>
          <p className="text-sm text-gray-600">For privacy, this demo does <strong>not</strong> read or upload the PDF. Enter each tender requirement on a separate line; each will start with status UNCLEAR until a specialist reviews it.</p>
          <textarea aria-label="Tender requirements, one per line" rows={5} value={requirementsText} onChange={e => setRequirementsText(e.target.value)} placeholder={'Valid construction license\nISO 9001 certificate\nThree similar completed projects'} className="w-full rounded-xl border border-gray-300 p-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300" />
          <p className="text-xs text-gray-500">{titles.length} requirements entered (max 30). The file itself stays on your device and is not transmitted or stored.</p>
        </div>
      )}

      <div className="flex items-center gap-4"><div className="flex-1 border-t border-gray-200" /><span className="text-sm text-gray-500 font-medium">OR CHOOSE READY DEMO</span><div className="flex-1 border-t border-gray-200" /></div>

      <button type="button" onClick={() => { setMode('sample'); setError(''); }} className={`w-full text-left bg-white rounded-2xl border-2 shadow-sm p-6 transition-all ${mode === 'sample' ? 'border-blue-600 bg-blue-50' : 'border-gray-200 hover:border-blue-300'}`}>
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center flex-shrink-0"><FileText size={22} className="text-blue-700" /></div>
          <div className="flex-1 min-w-0">
            <div className="flex flex-wrap items-center gap-2 mb-1"><span className="text-xs font-semibold px-2 py-0.5 bg-blue-100 text-blue-700 rounded-full">FICTIONAL DEMO</span><span className="text-xs text-gray-400">DEMO-ASTANA-2026-001</span></div>
            <h3 className="font-bold text-gray-900">{demoTender.name}</h3>
            <p className="text-sm text-gray-500 mt-1">{demoTender.requirements.length} requirements · Construction & Engineering</p>
            <p className="text-xs text-gray-600 mt-3">This demonstration uses sample company records and pre-defined, explainable matching rules. It is not a real AI assessment.</p>
          </div>
          {mode === 'sample' && <CheckCircle size={22} className="text-blue-600 flex-shrink-0" />}
        </div>
      </button>

      <button onClick={handleContinue} disabled={!canRun} className="w-full flex justify-center items-center gap-2 py-3.5 rounded-xl font-semibold bg-blue-700 text-white hover:bg-blue-800 disabled:bg-gray-200 disabled:text-gray-500">
        {mode === 'manual' ? 'Start Manual Review' : 'Run Demo Analysis'} <ArrowRight size={18} />
      </button>
    </div>
  );
}
