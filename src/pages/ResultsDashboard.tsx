import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Download, ShieldCheck } from 'lucide-react';
import { useI18n } from '../i18n/useI18n';
import { useApp } from '../context/appState';
import { finalStatus, getProfileIssues, summarise } from '../domain/evaluate';
import type { Status } from '../domain/types';
import { Card, Notice, PageHeader, StatusBadge } from '../components/ui';
import { STATUS_STYLE, btn } from '../components/styles';
import EvidenceList from '../components/EvidenceList';
import StepIndicator from '../components/StepIndicator';
import { formatDate, todayIso } from '../lib/dates';

const STATUSES: Status[] = ['MET', 'MISSING', 'UNCLEAR'];

export default function ResultsDashboard() {
  const { t, loc } = useI18n();
  const { analysis, results, profile, setReviewerConfirmed } = useApp();
  const [agree, setAgree] = useState(false);

  if (!analysis) {
    return (
      <div className="space-y-6">
        <StepIndicator current={3} />
        <Card className="text-center">
          <p className="text-slate-700">{t('analysis.empty')}</p>
          <Link to="/tender" className={`${btn.primary} mt-4`}>{t('nav.tender')} <ArrowRight size={16} aria-hidden="true" /></Link>
        </Card>
      </div>
    );
  }
  if (getProfileIssues(profile).includes('nameMissing')) {
    return (
      <Notice tone="error" role="alert">
        <p>{t('profile.issue.nameMissing')}</p>
        <Link to="/profile" className="mt-2 inline-block font-semibold underline">{t('tender.fixProfile')}</Link>
      </Notice>
    );
  }

  const reqById = new Map(analysis.tender.requirements.map((r) => [r.id, r]));
  const automated = summarise(results.map((r) => r.status));
  const finals = results.map((r) => ({ result: r, status: finalStatus(r, analysis.reviews[r.requirementId]), review: analysis.reviews[r.requirementId] }));
  const reviewedSummary = summarise(finals.map((f) => f.status));
  const hasOverrides = finals.some((f) => f.review?.override);
  const reviewedCount = finals.filter((f) => f.review?.reviewed).length;
  const allReviewed = reviewedCount === results.length;
  const groups: { status: Status; key: string }[] = [
    { status: 'MISSING', key: 'report.missingTitle' },
    { status: 'UNCLEAR', key: 'report.unclearTitle' },
    { status: 'MET', key: 'report.metTitle' },
  ];
  const readinessTone = automated.readiness >= 70 ? 'text-green-800' : automated.readiness >= 40 ? 'text-amber-900' : 'text-red-800';

  return (
    <div className="space-y-6" data-testid="report">
      <StepIndicator current={3} />
      <PageHeader
        title={t('report.title')}
        subtitle={loc(analysis.tender.name)}
        actions={
          <div className="flex flex-col items-start gap-1 sm:items-end">
            <button type="button" onClick={() => window.print()} className={btn.primary}>
              <Download size={16} aria-hidden="true" /> {t('report.download')}
            </button>
            <span className="text-xs text-slate-600">{t('report.downloadHint')}</span>
          </div>
        }
      />

      {/* Report metadata (also printed) */}
      <Card className="print-avoid-break">
        <dl className="grid gap-3 text-sm sm:grid-cols-2 lg:grid-cols-4">
          <div><dt className="text-xs font-semibold uppercase text-slate-600">{t('report.company')}</dt><dd className="font-semibold text-slate-900" data-testid="report-company">{profile.name}</dd></div>
          <div><dt className="text-xs font-semibold uppercase text-slate-600">{t('report.tender')}</dt><dd className="font-semibold text-slate-900">{loc(analysis.tender.name)}</dd></div>
          <div><dt className="text-xs font-semibold uppercase text-slate-600">{t('report.analysisDate')}</dt><dd className="text-slate-900">{formatDate(analysis.asOf)}</dd></div>
          <div><dt className="text-xs font-semibold uppercase text-slate-600">{t('report.generated')}</dt><dd className="text-slate-900">{formatDate(todayIso())}</dd></div>
        </dl>
      </Card>

      {/* Summary */}
      <Card className="print-avoid-break">
        <div className="grid gap-6 md:grid-cols-[auto_1fr] md:items-center">
          <div className="mx-auto flex h-32 w-32 flex-col items-center justify-center rounded-full border-8 border-slate-100 bg-white text-center md:mx-0">
            <span className={`text-3xl font-black ${readinessTone}`} data-testid="report-readiness">{automated.readiness}%</span>
            <span className="px-2 text-[11px] leading-tight text-slate-600">{t('report.readiness')}</span>
          </div>
          <div>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              <div className="rounded-xl border border-slate-200 p-3 text-center">
                <p className="text-2xl font-bold text-slate-900" data-testid="report-total">{automated.total}</p>
                <p className="text-xs text-slate-600">{t('report.total')}</p>
              </div>
              {STATUSES.map((s) => {
                const Icon = STATUS_STYLE[s].Icon;
                const n = automated[s === 'MET' ? 'met' : s === 'MISSING' ? 'missing' : 'unclear'];
                return (
                  <div key={s} className="rounded-xl border border-slate-200 p-3 text-center">
                    <p className={`flex items-center justify-center gap-1 text-2xl font-bold ${STATUS_STYLE[s].text}`}>
                      <Icon size={20} aria-hidden="true" /> <span data-testid={`report-${s}`}>{n}</span>
                    </p>
                    <p className="text-xs text-slate-700">{t(`status.${s}`)}</p>
                  </div>
                );
              })}
            </div>
            <p className="mt-3 text-sm text-slate-700">{t('report.formula', { met: automated.met, total: automated.total, value: automated.readiness })}</p>
            {hasOverrides && (
              <p className="mt-1 text-sm font-medium text-blue-900" data-testid="report-after-review">
                {t('report.afterReview', { value: reviewedSummary.readiness, met: reviewedSummary.met, total: reviewedSummary.total })}
              </p>
            )}
            <p className="mt-3 rounded-lg border border-amber-300 bg-amber-50 p-2 text-xs text-amber-950">{t('report.readinessNote')}</p>
          </div>
        </div>
      </Card>

      {/* Grouped details */}
      <h2 className="text-xl font-bold text-slate-900">{t('report.details')}</h2>
      {groups.map((g) => {
        const items = finals.filter((f) => f.status === g.status);
        return (
          <section key={g.status} aria-labelledby={`group-${g.status}`} className="space-y-3">
            <h3 id={`group-${g.status}`} className="flex items-center gap-2 text-lg font-semibold text-slate-900">
              <StatusBadge status={g.status} size="md" /> {t(g.key)} <span className="text-slate-600">({items.length})</span>
            </h3>
            {items.length === 0 && <p className="text-sm text-slate-600">{t('report.none')}</p>}
            {items.map(({ result, status, review }) => {
              const req = reqById.get(result.requirementId)!;
              return (
                <article key={result.requirementId} className={`print-avoid-break rounded-2xl border border-l-4 border-slate-200 bg-white p-4 sm:p-5 ${STATUS_STYLE[status].card}`}>
                  <div className="flex flex-wrap items-start justify-between gap-2">
                    <div>
                      <p className="text-xs text-slate-600">{t('req.reference')}: {loc(req.reference)}</p>
                      <h4 className="font-semibold text-slate-900">{loc(req.title)}</h4>
                    </div>
                    <StatusBadge status={status} />
                  </div>
                  <p className="mt-2 text-sm text-slate-700">{loc(req.description)}</p>
                  <p className="mt-3 text-sm text-slate-900"><span className="font-semibold">{t('req.why')} </span>{t(result.reasonKey, result.params)}</p>
                  <div className="mt-3">
                    <p className="mb-1 text-xs font-bold uppercase tracking-wide text-slate-600">{t('req.evidence')}</p>
                    <EvidenceList items={result.evidence} asOf={analysis.asOf} />
                  </div>
                  <p className="mt-3 text-sm text-blue-950"><span className="font-semibold">{t('req.next')}: </span>{t(result.actionKey, result.params)}</p>
                  {review?.override && (
                    <p className="mt-2 text-xs text-slate-700">{t('req.automated')}: {t(`status.${result.status}`)} → {t('req.final')}: {t(`status.${review.override}`)}</p>
                  )}
                  {review?.note && <p className="mt-2 rounded-lg bg-slate-50 p-2 text-xs text-slate-800"><strong>{t('review.note')}:</strong> {review.note}</p>}
                  {review?.reviewed && <p className="mt-1 text-xs font-semibold text-blue-900">✓ {t('review.reviewed')}</p>}
                </article>
              );
            })}
          </section>
        );
      })}

      {/* Human review */}
      <Card className="print-avoid-break border-blue-200">
        <h2 className="flex items-center gap-2 font-bold text-slate-900"><ShieldCheck size={18} className="text-blue-800" aria-hidden="true" /> {t('report.confirmTitle')}</h2>
        <p className="mt-2 text-sm font-medium text-slate-800">{t('human.review')}</p>
        {analysis.reviewerConfirmedAt ? (
          <div className="mt-3 space-y-2">
            <Notice tone="success" role="status">{t('report.confirmed', { date: analysis.reviewerConfirmedAt.slice(0, 10) })}</Notice>
            <button type="button" className={`${btn.secondary} no-print`} onClick={() => setReviewerConfirmed(false)}>{t('report.undoConfirm')}</button>
          </div>
        ) : (
          <div className="mt-3 space-y-3">
            <p className="print-only text-sm">{t('report.notConfirmed')}</p>
            <div className="no-print space-y-3">
              {!allReviewed && <p className="text-sm text-amber-900">{t('report.confirmNeedsAll', { reviewed: reviewedCount, total: results.length })}</p>}
              <label className="flex items-start gap-2 text-sm text-slate-800">
                <input type="checkbox" className="mt-1 h-4 w-4" checked={agree} disabled={!allReviewed} onChange={(e) => setAgree(e.target.checked)} />
                {t('report.confirmText')}
              </label>
              <button type="button" className={btn.primary} disabled={!allReviewed || !agree} onClick={() => setReviewerConfirmed(true)}>
                {t('report.confirmButton')}
              </button>
            </div>
          </div>
        )}
      </Card>

      <p className="rounded-xl border border-slate-200 bg-white p-4 text-xs text-slate-700">{t('demo.disclaimer')}</p>

      <div className="no-print flex flex-col gap-3 sm:flex-row">
        <Link to="/feedback" className={`${btn.primary} flex-1 py-3`}>{t('report.feedback')} <ArrowRight size={18} aria-hidden="true" /></Link>
        <Link to="/analysis" className={`${btn.secondary} flex-1 py-3`}>{t('report.backToAnalysis')}</Link>
        <Link to="/tender" className={`${btn.secondary} flex-1 py-3`}>{t('report.newAnalysis')}</Link>
      </div>
    </div>
  );
}
