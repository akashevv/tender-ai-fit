import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, ChevronDown, ChevronUp, Pencil, CheckSquare, Square } from 'lucide-react';
import { useI18n } from '../i18n/useI18n';
import { useApp } from '../context/appState';
import { finalStatus, getProfileIssues, summarise } from '../domain/evaluate';
import type { EvaluationResult, Requirement, Review, Status } from '../domain/types';
import { Card, Notice, PageHeader, StatusBadge } from '../components/ui';
import { STATUS_STYLE, btn, inputCls } from '../components/styles';
import EvidenceList from '../components/EvidenceList';
import StepIndicator from '../components/StepIndicator';

const STATUSES: Status[] = ['MET', 'MISSING', 'UNCLEAR'];

function RequirementCard({
  req,
  result,
  review,
  asOf,
  open,
  onToggle,
}: {
  req: Requirement;
  result: EvaluationResult;
  review: Review;
  asOf: string;
  open: boolean;
  onToggle: () => void;
}) {
  const { t, loc } = useI18n();
  const { updateReview } = useApp();
  const [noteWarning, setNoteWarning] = useState(false);
  const status = finalStatus(result, review);
  const panelId = `req-panel-${req.id}`;

  const override = (s: Status) => {
    if (!review.note.trim()) {
      setNoteWarning(true);
      return;
    }
    setNoteWarning(false);
    updateReview(req.id, { override: s === result.status ? undefined : s, reviewed: true });
  };

  return (
    <li data-testid={`requirement-${req.id}`} data-status={status} className={`overflow-hidden rounded-2xl border border-l-4 border-slate-200 bg-white shadow-sm ${STATUS_STYLE[status].card}`}>
      <h2>
        <button type="button" aria-expanded={open} aria-controls={panelId} onClick={onToggle} className="flex w-full items-center justify-between gap-3 p-4 text-left hover:bg-slate-50 sm:p-5">
          <span className="min-w-0">
            <span className="block text-xs font-mono text-slate-600">{loc(req.reference)}</span>
            <span className="block font-semibold text-slate-900">{loc(req.title)}</span>
          </span>
          <span className="flex flex-shrink-0 items-center gap-2">
            {review.reviewed && <span className="hidden text-xs font-semibold text-blue-800 sm:inline">✓ {t('review.reviewed')}</span>}
            <StatusBadge status={status} />
            {open ? <ChevronUp size={18} aria-hidden="true" /> : <ChevronDown size={18} aria-hidden="true" />}
          </span>
        </button>
      </h2>
      {open && (
        <div id={panelId} className="space-y-4 border-t border-slate-100 px-4 pb-5 pt-4 sm:px-5">
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wide text-slate-600">{t('req.description')}</h3>
              <p className="mt-1 text-sm text-slate-800">{loc(req.description)}</p>
              <p className="mt-2 text-xs text-slate-600">{t('req.rule')}: {t(`rule.${req.ruleId}`)}</p>
            </div>
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wide text-slate-600">{t('req.why')}</h3>
              <p className="mt-1 text-sm text-slate-800" data-testid="reason">{t(result.reasonKey, result.params)}</p>
            </div>
          </div>
          <div>
            <h3 className="mb-2 text-xs font-bold uppercase tracking-wide text-slate-600">{t('req.evidence')}</h3>
            <EvidenceList items={result.evidence} asOf={asOf} />
          </div>
          <div className="rounded-xl bg-blue-50 p-3 text-sm text-blue-950">
            <span className="font-semibold">{t('req.next')}: </span>
            {t(result.actionKey, result.params)}
          </div>

          <fieldset className="space-y-3 rounded-xl border border-slate-200 p-4">
            <legend className="px-1 text-sm font-semibold text-slate-900">{t('review.title')}</legend>
            {review.override && (
              <p className="text-xs text-slate-700">
                {t('req.automated')}: <StatusBadge status={result.status} /> → {t('req.final')}: <StatusBadge status={review.override} />
              </p>
            )}
            <div>
              <label htmlFor={`note-${req.id}`} className="block text-xs font-semibold text-slate-700">{t('review.note')}</label>
              <textarea
                id={`note-${req.id}`}
                rows={2}
                maxLength={1000}
                className={inputCls}
                value={review.note}
                placeholder={t('review.notePlaceholder')}
                aria-describedby={noteWarning ? `note-warn-${req.id}` : undefined}
                onChange={(e) => {
                  updateReview(req.id, { note: e.target.value });
                  if (e.target.value.trim()) setNoteWarning(false);
                }}
              />
            </div>
            <div>
              <p className="mb-2 flex items-center gap-1 text-xs font-semibold text-slate-700"><Pencil size={12} aria-hidden="true" /> {t('review.override')}</p>
              <div className="flex flex-wrap gap-2">
                {STATUSES.map((s) => (
                  <button
                    key={s}
                    type="button"
                    aria-pressed={status === s}
                    onClick={() => override(s)}
                    className={`rounded-lg border px-3 py-1.5 text-xs font-semibold ${status === s ? 'border-blue-800 bg-blue-800 text-white' : 'border-slate-300 bg-white text-slate-800 hover:border-blue-500'}`}
                  >
                    {t(`status.${s}`)}
                  </button>
                ))}
                {review.override && (
                  <button type="button" className="rounded-lg px-3 py-1.5 text-xs font-semibold text-blue-800 underline" onClick={() => updateReview(req.id, { override: undefined })}>
                    {t('review.clearOverride')}
                  </button>
                )}
              </div>
              {noteWarning && <p id={`note-warn-${req.id}`} role="alert" className="mt-2 text-xs font-semibold text-red-800">{t('review.noteRequired')}</p>}
            </div>
            <button
              type="button"
              aria-pressed={review.reviewed}
              onClick={() => updateReview(req.id, { reviewed: !review.reviewed })}
              className={`inline-flex items-center gap-2 rounded-lg border px-3 py-2 text-sm font-semibold ${review.reviewed ? 'border-blue-700 bg-blue-50 text-blue-900' : 'border-slate-300 bg-white text-slate-800'}`}
            >
              {review.reviewed ? <CheckSquare size={16} aria-hidden="true" /> : <Square size={16} aria-hidden="true" />}
              {review.reviewed ? t('review.reviewed') : t('review.markReviewed')}
            </button>
            {review.override && <p className="text-xs text-blue-900">{t('review.overridden')}</p>}
          </fieldset>
        </div>
      )}
    </li>
  );
}

export default function TenderAnalysis() {
  const { t, loc } = useI18n();
  const { analysis, results, profile } = useApp();
  const [filter, setFilter] = useState<Status | 'ALL'>('ALL');
  const [openIds, setOpenIds] = useState<Set<string>>(() => new Set(analysis?.tender.requirements[0] ? [analysis.tender.requirements[0].id] : []));

  if (!analysis) {
    return (
      <div className="space-y-6">
        <StepIndicator current={2} />
        <Card className="text-center">
          <p className="text-slate-700">{t('analysis.empty')}</p>
          <Link to="/tender" className={`${btn.primary} mt-4`}>{t('nav.tender')} <ArrowRight size={16} aria-hidden="true" /></Link>
        </Card>
      </div>
    );
  }

  if (getProfileIssues(profile).includes('nameMissing')) {
    return (
      <div className="space-y-6">
        <StepIndicator current={2} />
        <Notice tone="error" role="alert">
          <p>{t('profile.issue.nameMissing')}</p>
          <Link to="/profile" className="mt-2 inline-block font-semibold underline">{t('tender.fixProfile')}</Link>
        </Notice>
      </div>
    );
  }

  const review = (id: string): Review => analysis.reviews[id] ?? { note: '', reviewed: false };
  const statuses = results.map((r) => finalStatus(r, analysis.reviews[r.requirementId]));
  const summary = summarise(statuses);
  const reviewed = results.filter((r) => review(r.requirementId).reviewed).length;
  const visible = analysis.tender.requirements.filter((_req, i) => filter === 'ALL' || statuses[i] === filter);

  const toggle = (id: string) =>
    setOpenIds((s) => {
      const next = new Set(s);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });

  return (
    <div className="space-y-6">
      <StepIndicator current={2} />
      <PageHeader
        eyebrow={<span className="inline-flex rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold text-blue-900">{t(`analysis.mode.${analysis.tender.mode}`)}</span>}
        title={t('analysis.title')}
        subtitle={<><span className="block font-medium text-slate-800">{loc(analysis.tender.name)}</span>{t('analysis.subtitle')}</>}
        actions={<Link to="/report" className={btn.primary}>{t('analysis.toReport')} <ArrowRight size={16} aria-hidden="true" /></Link>}
      />

      <Notice tone="info">
        <p>{t('analysis.ruleNotice')} {t('analysis.asOf', { date: analysis.asOf })}</p>
        <p className="mt-1 font-medium">{t('human.review')}</p>
      </Notice>

      <div className="flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white p-4 sm:flex-row sm:items-center sm:justify-between" data-testid="analysis-summary">
        <div className="flex flex-wrap items-center gap-2 text-sm">
          <span className="font-semibold text-slate-900">{t('report.total')}: <span data-testid="count-total">{summary.total}</span></span>
          <span className="text-slate-400" aria-hidden="true">|</span>
          {STATUSES.map((s) => (
            <span key={s} className="inline-flex items-center gap-1">
              <StatusBadge status={s} /> <strong data-testid={`count-${s}`}>{summary[s === 'MET' ? 'met' : s === 'MISSING' ? 'missing' : 'unclear']}</strong>
            </span>
          ))}
        </div>
        <span className="text-sm text-slate-700">
          {t('report.readiness')}: <strong data-testid="readiness">{summary.readiness}%</strong> · {t('analysis.reviewedCount', { reviewed, total: summary.total })}
        </span>
      </div>

      <div role="group" aria-label={t('analysis.filter')} className="flex flex-wrap gap-2">
        {(['ALL', ...STATUSES] as const).map((f) => (
          <button
            key={f}
            type="button"
            aria-pressed={filter === f}
            onClick={() => setFilter(f)}
            className={`rounded-full border px-3 py-1.5 text-sm font-medium ${filter === f ? 'border-blue-800 bg-blue-800 text-white' : 'border-slate-300 bg-white text-slate-800 hover:bg-slate-50'}`}
          >
            {f === 'ALL' ? t('analysis.filter.all') : t(`status.${f}`)}
          </button>
        ))}
      </div>

      {visible.length === 0 ? (
        <p className="text-sm text-slate-600">{t('analysis.noMatches')}</p>
      ) : (
        <ul className="space-y-3">
          {visible.map((req) => {
            const result = results.find((r) => r.requirementId === req.id)!;
            return (
              <RequirementCard key={req.id} req={req} result={result} review={review(req.id)} asOf={analysis.asOf} open={openIds.has(req.id)} onToggle={() => toggle(req.id)} />
            );
          })}
        </ul>
      )}

      <Link to="/report" className={`${btn.primary} w-full py-3.5`}>{t('analysis.toReport')} <ArrowRight size={18} aria-hidden="true" /></Link>
    </div>
  );
}
