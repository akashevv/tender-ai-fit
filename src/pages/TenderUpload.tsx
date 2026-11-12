import { useRef, useState } from 'react';
import type { ChangeEvent, DragEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowRight, CheckCircle2, FileText, Plus, Trash2, Upload, Lock, Loader2 } from 'lucide-react';
import { useI18n } from '../i18n/useI18n';
import { useApp } from '../context/appState';
import { demoTender } from '../data/demoTender';
import { getProfileIssues } from '../domain/evaluate';
import { buildManualTender, checkTenderFile, validateManualRows, MAX_MANUAL_REQUIREMENTS } from '../domain/validation';
import type { ManualRow } from '../domain/validation';
import type { RuleId } from '../domain/types';
import { Card, DemoBadge, Notice, PageHeader } from '../components/ui';
import { btn, inputCls } from '../components/styles';
import StepIndicator from '../components/StepIndicator';

const RULES: RuleId[] = ['construction_license', 'iso9001', 'similar_projects', 'engineering_personnel', 'audited_financials', 'manual_other'];

export default function TenderUpload() {
  const { t, loc } = useI18n();
  const { profile, startAnalysis } = useApp();
  const navigate = useNavigate();
  const inputRef = useRef<HTMLInputElement>(null);
  const [fileName, setFileName] = useState('');
  const [fileError, setFileError] = useState('');
  const [checking, setChecking] = useState(false);
  const [rows, setRows] = useState<ManualRow[]>([{ text: '', ruleId: 'manual_other' }]);
  const [rowsError, setRowsError] = useState('');
  const blocked = getProfileIssues(profile).includes('nameMissing');

  const selectFile = async (file?: File | null) => {
    setChecking(true);
    setFileError('');
    const result = await checkTenderFile(file);
    setChecking(false);
    if (result.ok && file) {
      setFileName(file.name);
    } else {
      setFileName('');
      setFileError(result.ok ? '' : result.key);
    }
    if (inputRef.current) inputRef.current.value = '';
  };

  const onChange = (e: ChangeEvent<HTMLInputElement>) => void selectFile(e.target.files?.[0]);
  const onDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    void selectFile(e.dataTransfer.files[0]);
  };

  const startDemo = () => {
    startAnalysis(demoTender);
    navigate('/analysis');
  };

  const startManual = () => {
    let ok = true;
    if (!fileName) {
      setFileError('upload.error.missing');
      ok = false;
    }
    const rowErr = validateManualRows(rows);
    setRowsError(rowErr ?? '');
    if (rowErr) ok = false;
    if (!ok) return;
    startAnalysis(buildManualTender(fileName, rows));
    navigate('/analysis');
  };

  const updateRow = (i: number, patch: Partial<ManualRow>) => setRows((r) => r.map((row, j) => (j === i ? { ...row, ...patch } : row)));

  return (
    <div className="space-y-6">
      <StepIndicator current={1} />
      <PageHeader title={t('tender.title')} subtitle={t('tender.subtitle')} />

      {blocked && (
        <Notice tone="error" role="alert">
          <p>{t('profile.issue.nameMissing')}</p>
          <Link to="/profile" className="mt-2 inline-block font-semibold underline">{t('tender.fixProfile')}</Link>
        </Notice>
      )}

      {/* Predefined demo tender: the fully supported path */}
      <Card className="border-blue-300">
        <div className="flex flex-wrap items-center gap-2">
          <DemoBadge />
          <span className="text-xs font-semibold text-blue-900">{t('tender.demoBadge')}</span>
          <span className="font-mono text-xs text-slate-600">{demoTender.code}</span>
        </div>
        <h2 className="mt-2 flex items-start gap-2 text-lg font-bold text-slate-900">
          <FileText size={20} className="mt-1 flex-shrink-0 text-blue-700" aria-hidden="true" />
          {loc(demoTender.name)}
        </h2>
        <p className="mt-1 text-sm text-slate-600">{t('tender.demoNote')}</p>
        <h3 className="mt-4 text-sm font-semibold text-slate-800">{t('tender.requirementsList')}</h3>
        <ol className="mt-2 space-y-1.5 text-sm">
          {demoTender.requirements.map((r) => (
            <li key={r.id} className="flex gap-2 rounded-lg bg-slate-50 px-3 py-2">
              <span className="font-mono text-xs text-slate-600">{loc(r.reference)}</span>
              <span className="text-slate-800">{loc(r.title)}</span>
            </li>
          ))}
        </ol>
        <button type="button" onClick={startDemo} disabled={blocked} className={`${btn.primary} mt-5 w-full sm:w-auto`}>
          {t('tender.start')} <ArrowRight size={16} aria-hidden="true" />
        </button>
      </Card>

      <div className="flex items-center gap-4" aria-hidden="true">
        <div className="flex-1 border-t border-slate-300" />
        <span className="text-sm font-medium uppercase text-slate-600">{t('tender.or')}</span>
        <div className="flex-1 border-t border-slate-300" />
      </div>

      {/* Own tender: honest manual workflow */}
      <Card>
        <h2 className="text-lg font-bold text-slate-900">{t('tender.manualTitle')}</h2>
        <Notice tone="info" className="mt-3">
          <span className="inline-flex items-start gap-2"><Lock size={14} className="mt-1 flex-shrink-0" aria-hidden="true" />{t('tender.manualNotice')}</span>
        </Notice>

        <div
          onDrop={onDrop}
          onDragOver={(e) => e.preventDefault()}
          className={`mt-4 rounded-2xl border-2 border-dashed p-6 text-center ${fileName ? 'border-green-600 bg-green-50' : fileError ? 'border-red-500 bg-red-50' : 'border-slate-300 bg-white'}`}
        >
          <Upload size={24} className="mx-auto mb-2 text-blue-700" aria-hidden="true" />
          <p className="font-semibold text-slate-800">{t('upload.drop')}</p>
          <p className="mb-3 text-sm text-slate-600">{t('upload.hint')}</p>
          <input
            ref={inputRef}
            id="tender-file"
            type="file"
            accept=".pdf,application/pdf"
            onChange={onChange}
            className="sr-only"
            tabIndex={-1}
            aria-hidden="true"
            data-testid="tender-file-input"
          />
          <button
            type="button"
            className={btn.primary}
            onClick={() => inputRef.current?.click()}
            aria-label={`${t('upload.browse')} — ${t('upload.fileLabel')}`}
            aria-describedby={fileError ? 'file-error' : undefined}
          >
            {t('upload.browse')}
          </button>
          <div aria-live="polite" className="mt-3 text-sm">
            {checking && <p className="inline-flex items-center gap-2 text-slate-700"><Loader2 size={15} className="animate-spin" aria-hidden="true" />{t('upload.checking')}</p>}
            {fileName && !checking && (
              <p className="inline-flex flex-wrap items-center justify-center gap-2 font-semibold text-green-800">
                <CheckCircle2 size={16} aria-hidden="true" /> {t('upload.selected', { name: fileName })}
                <button type="button" className="text-xs font-semibold text-red-800 underline" onClick={() => setFileName('')}>{t('upload.remove')}</button>
              </p>
            )}
          </div>
          {fileError && (
            <div id="file-error" role="alert" className="mt-2 text-sm text-red-800">
              <p className="font-semibold">{t(fileError)}</p>
              <button type="button" onClick={startDemo} disabled={blocked} className="mt-1 font-semibold text-blue-800 underline">{t('upload.recover')}</button>
            </div>
          )}
        </div>

        <fieldset className="mt-5 space-y-3">
          <legend className="text-sm font-semibold text-slate-800">{t('tender.requirementsList')}</legend>
          {rows.map((row, i) => (
            <div key={i} className="grid gap-2 rounded-xl border border-slate-200 bg-slate-50 p-3 sm:grid-cols-[1fr_16rem_auto] sm:items-end">
              <div>
                <label htmlFor={`req-${i}`} className="block text-xs font-semibold text-slate-700">{t('manual.reqLabel', { n: i + 1 })}</label>
                <input id={`req-${i}`} className={inputCls} value={row.text} maxLength={300} placeholder={t('manual.placeholder')} onChange={(e) => updateRow(i, { text: e.target.value })} />
              </div>
              <div>
                <label htmlFor={`rule-${i}`} className="block text-xs font-semibold text-slate-700">{t('manual.ruleLabel', { n: i + 1 })}</label>
                <select id={`rule-${i}`} className={inputCls} value={row.ruleId} onChange={(e) => updateRow(i, { ruleId: e.target.value as RuleId })}>
                  {RULES.map((r) => <option key={r} value={r}>{t(`rule.${r}`)}</option>)}
                </select>
              </div>
              <button
                type="button"
                disabled={rows.length === 1}
                onClick={() => setRows((r) => r.filter((_, j) => j !== i))}
                className="inline-flex items-center justify-center rounded-lg p-2 text-red-800 hover:bg-red-50 disabled:opacity-40"
              >
                <Trash2 size={16} aria-hidden="true" />
                <span className="sr-only">{t('manual.removeRow', { n: i + 1 })}</span>
              </button>
            </div>
          ))}
          <button type="button" className={btn.ghost} disabled={rows.length >= MAX_MANUAL_REQUIREMENTS} onClick={() => setRows((r) => [...r, { text: '', ruleId: 'manual_other' }])}>
            <Plus size={15} aria-hidden="true" /> {t('manual.addRow')}
          </button>
          {rowsError && <p role="alert" className="text-sm font-semibold text-red-800">{t(rowsError)}</p>}
        </fieldset>

        <button type="button" onClick={startManual} disabled={blocked} className={`${btn.secondary} mt-5 w-full sm:w-auto`}>
          {t('manual.start')} <ArrowRight size={16} aria-hidden="true" />
        </button>
      </Card>
    </div>
  );
}
