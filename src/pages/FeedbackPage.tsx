import { useState } from 'react';
import type { FormEvent } from 'react';
import { Link } from 'react-router-dom';
import { Download, Trash2 } from 'lucide-react';
import { useI18n } from '../i18n/useI18n';
import type { FeedbackEntry } from '../domain/types';
import { PARTICIPANT_CODE, clearFeedback, downloadText, loadFeedback, saveFeedback, toCsv } from '../lib/feedback';
import { todayIso } from '../lib/dates';
import { Card, ConfirmAction, Notice, PageHeader } from '../components/ui';
import { btn, inputCls } from '../components/styles';
import StepIndicator from '../components/StepIndicator';

type RatingKey = 'usefulness' | 'easeOfUse' | 'statusClarity' | 'trust';
const RATINGS: { key: RatingKey; label: string }[] = [
  { key: 'usefulness', label: 'feedback.usefulness' },
  { key: 'easeOfUse', label: 'feedback.ease' },
  { key: 'statusClarity', label: 'feedback.clarity' },
  { key: 'trust', label: 'feedback.trust' },
];

type FormState = {
  participantCode: string;
  taskCompleted: '' | FeedbackEntry['taskCompleted'];
  ratings: Record<RatingKey, number>;
  comments: string;
  suggestions: string;
  consent: boolean;
};
const EMPTY: FormState = {
  participantCode: '',
  taskCompleted: '',
  ratings: { usefulness: 0, easeOfUse: 0, statusClarity: 0, trust: 0 },
  comments: '',
  suggestions: '',
  consent: false,
};

export default function FeedbackPage() {
  const { t, lang } = useI18n();
  const [form, setForm] = useState<FormState>(EMPTY);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [result, setResult] = useState<'saved' | 'failed' | null>(null);
  const [entries, setEntries] = useState(loadFeedback);
  const [cleared, setCleared] = useState(false);

  const validate = () => {
    const e: Record<string, string> = {};
    if (form.participantCode && !PARTICIPANT_CODE.test(form.participantCode.trim().toUpperCase())) e.participantCode = t('feedback.participantError');
    if (!form.taskCompleted) e.taskCompleted = t('feedback.choiceRequired');
    RATINGS.forEach((r) => {
      if (!form.ratings[r.key]) e[r.key] = t('feedback.ratingRequired');
    });
    if (!form.consent) e.consent = t('feedback.consentRequired');
    return e;
  };

  const submit = (ev: FormEvent) => {
    ev.preventDefault();
    const e = validate();
    setErrors(e);
    if (Object.keys(e).length > 0) return;
    const entry: FeedbackEntry = {
      id: `fb-${Date.now().toString(36)}`,
      participantCode: form.participantCode.trim().toUpperCase(),
      language: lang,
      taskCompleted: form.taskCompleted as FeedbackEntry['taskCompleted'],
      usefulness: form.ratings.usefulness,
      easeOfUse: form.ratings.easeOfUse,
      statusClarity: form.ratings.statusClarity,
      trust: form.ratings.trust,
      comments: form.comments.trim().slice(0, 2000),
      suggestions: form.suggestions.trim().slice(0, 2000),
      submittedAt: new Date().toISOString(),
    };
    const ok = saveFeedback(entry);
    setResult(ok ? 'saved' : 'failed');
    if (ok) {
      setEntries(loadFeedback());
      setForm(EMPTY);
      setCleared(false);
    }
  };

  const errorText = (k: string) =>
    errors[k] ? <p id={`${k}-error`} className="mt-1 text-xs font-semibold text-red-800">{errors[k]}</p> : null;
  const describedBy = (k: string) => (errors[k] ? `${k}-error` : undefined);

  return (
    <div className="space-y-6">
      <StepIndicator current={4} />
      <PageHeader title={t('feedback.title')} subtitle={t('feedback.subtitle')} />
      <Notice tone="info">{t('feedback.storage')}</Notice>

      <div aria-live="polite">
        {result === 'saved' && (
          <Notice tone="success" role="status">
            <p className="font-semibold">{t('feedback.thanks')}</p>
            <div className="mt-2 flex flex-wrap gap-3">
              <button type="button" className="font-semibold underline" onClick={() => setResult(null)}>{t('feedback.another')}</button>
              <Link to="/dashboard" className="font-semibold underline">{t('nav.dashboard')}</Link>
            </div>
          </Notice>
        )}
        {result === 'failed' && <Notice tone="error" role="alert">{t('feedback.saveFailed')}</Notice>}
      </div>

      {result !== 'saved' && (
        <Card>
          <form onSubmit={submit} noValidate className="space-y-5" aria-label={t('feedback.title')}>
            {Object.keys(errors).length > 0 && <Notice tone="error" role="alert">{t('feedback.errors')}</Notice>}

            <div className="max-w-xs">
              <label htmlFor="fb-code" className="block text-sm font-semibold text-slate-800">{t('feedback.participant')}</label>
              <input id="fb-code" className={inputCls} value={form.participantCode} maxLength={3} placeholder="P01"
                aria-invalid={!!errors.participantCode} aria-describedby={describedBy('participantCode')}
                onChange={(e) => setForm({ ...form, participantCode: e.target.value })} />
              {errorText('participantCode')}
            </div>

            <fieldset aria-describedby={describedBy('taskCompleted')}>
              <legend className="text-sm font-semibold text-slate-800">{t('feedback.task')} <span className="font-normal text-slate-600">({t('common.required')})</span></legend>
              <div className="mt-2 flex flex-wrap gap-2">
                {(['yes', 'with_help', 'no'] as const).map((v) => (
                  <label key={v} className={`flex cursor-pointer items-center gap-2 rounded-lg border px-3 py-2 text-sm ${form.taskCompleted === v ? 'border-blue-700 bg-blue-50' : 'border-slate-300 bg-white'}`}>
                    <input type="radio" name="taskCompleted" value={v} checked={form.taskCompleted === v} onChange={() => setForm({ ...form, taskCompleted: v })} />
                    {t(`feedback.task.${v}`)}
                  </label>
                ))}
              </div>
              {errorText('taskCompleted')}
            </fieldset>

            {RATINGS.map((r) => (
              <fieldset key={r.key} aria-describedby={describedBy(r.key)}>
                <legend className="text-sm font-semibold text-slate-800">
                  {t(r.label)} <span className="font-normal text-slate-600">({t('common.required')} · {t('feedback.scale')})</span>
                </legend>
                <div className="mt-2 flex gap-2">
                  {[1, 2, 3, 4, 5].map((n) => (
                    <label key={n} className={`flex h-10 w-10 cursor-pointer items-center justify-center rounded-lg border text-sm font-semibold has-[:focus-visible]:outline has-[:focus-visible]:outline-3 has-[:focus-visible]:outline-blue-700 ${form.ratings[r.key] === n ? 'border-blue-800 bg-blue-800 text-white' : 'border-slate-300 bg-white text-slate-800'}`}>
                      <input type="radio" className="sr-only" name={r.key} value={n} checked={form.ratings[r.key] === n}
                        onChange={() => setForm({ ...form, ratings: { ...form.ratings, [r.key]: n } })} />
                      {n}
                    </label>
                  ))}
                </div>
                {errorText(r.key)}
              </fieldset>
            ))}

            <div>
              <label htmlFor="fb-comments" className="block text-sm font-semibold text-slate-800">{t('feedback.comments')}</label>
              <textarea id="fb-comments" rows={3} maxLength={2000} className={inputCls} value={form.comments} onChange={(e) => setForm({ ...form, comments: e.target.value })} />
            </div>
            <div>
              <label htmlFor="fb-suggestions" className="block text-sm font-semibold text-slate-800">{t('feedback.suggestions')}</label>
              <textarea id="fb-suggestions" rows={3} maxLength={2000} className={inputCls} value={form.suggestions} onChange={(e) => setForm({ ...form, suggestions: e.target.value })} />
            </div>
            <div>
              <label className="flex items-start gap-2 text-sm text-slate-800">
                <input type="checkbox" className="mt-1 h-4 w-4" checked={form.consent} aria-invalid={!!errors.consent} aria-describedby={describedBy('consent')}
                  onChange={(e) => setForm({ ...form, consent: e.target.checked })} />
                {t('feedback.consent')}
              </label>
              {errorText('consent')}
            </div>
            <button type="submit" className={`${btn.primary} w-full py-3 sm:w-auto`}>{t('feedback.submit')}</button>
          </form>
        </Card>
      )}

      <Card>
        <h2 className="font-bold text-slate-900">{t('feedback.teamTitle')}</h2>
        <p className="mt-1 text-sm text-slate-700" data-testid="feedback-count">{t('feedback.count', { count: entries.length })}</p>
        {cleared && <p role="status" className="mt-1 text-sm text-green-800">{t('feedback.cleared')}</p>}
        <div className="mt-3 flex flex-wrap gap-2">
          <button type="button" className={btn.secondary} disabled={entries.length === 0}
            onClick={() => downloadText(`tender-ai-fit-feedback-${todayIso()}.csv`, toCsv(entries), 'text/csv;charset=utf-8')}>
            <Download size={16} aria-hidden="true" /> {t('feedback.exportCsv')}
          </button>
          <button type="button" className={btn.secondary} disabled={entries.length === 0}
            onClick={() => downloadText(`tender-ai-fit-feedback-${todayIso()}.json`, JSON.stringify(entries, null, 2), 'application/json')}>
            <Download size={16} aria-hidden="true" /> {t('feedback.exportJson')}
          </button>
          {entries.length > 0 && (
            <ConfirmAction label={t('feedback.clear')} question={t('feedback.clearConfirm')} icon={<Trash2 size={16} aria-hidden="true" />}
              onConfirm={() => { clearFeedback(); setEntries([]); setCleared(true); }} />
          )}
        </div>
      </Card>
    </div>
  );
}
