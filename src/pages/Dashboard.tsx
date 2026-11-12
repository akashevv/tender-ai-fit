import type { ReactNode } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowRight, FileText, Award, Briefcase, Users, Landmark } from 'lucide-react';
import { useI18n } from '../i18n/useI18n';
import { useApp } from '../context/appState';
import { demoTender } from '../data/demoTender';
import { evaluateTender, getProfileIssues, summarise } from '../domain/evaluate';
import { todayIso } from '../lib/dates';
import { Card, DemoBadge, Notice, PageHeader, StatusBadge } from '../components/ui';
import { btn } from '../components/styles';

export default function Dashboard() {
  const { t, loc } = useI18n();
  const { profile, analysis, results, startAnalysis } = useApp();
  const navigate = useNavigate();
  const asOf = todayIso();
  const preview = evaluateTender(demoTender, profile, asOf);
  const summary = summarise(preview.map((r) => r.status));
  const issues = getProfileIssues(profile);
  const blocked = issues.includes('nameMissing');

  const reviewed = analysis ? results.filter((r) => analysis.reviews[r.requirementId]?.reviewed).length : 0;

  const counts = [
    { key: 'dash.count.licenses', value: profile.licenses.length, icon: FileText },
    { key: 'dash.count.certificates', value: profile.certificates.length, icon: Award },
    { key: 'dash.count.projects', value: profile.projects.length, icon: Briefcase },
    { key: 'dash.count.personnel', value: profile.personnel.length, icon: Users },
    { key: 'dash.count.financial', value: profile.financialStatements.length, icon: Landmark },
  ];

  const start = () => {
    startAnalysis(demoTender);
    navigate('/analysis');
  };

  let next: { text: string; action: ReactNode };
  if (blocked) {
    next = { text: t('dash.next.incomplete'), action: <Link to="/profile" className={btn.primary}>{t('dash.fixProfile')} <ArrowRight size={16} aria-hidden="true" /></Link> };
  } else if (!analysis) {
    next = { text: t('dash.next.start'), action: <button type="button" onClick={start} className={btn.primary}>{t('tender.start')} <ArrowRight size={16} aria-hidden="true" /></button> };
  } else if (reviewed < results.length) {
    next = { text: t('dash.next.continue', { reviewed, total: results.length }), action: <Link to="/analysis" className={btn.primary}>{t('dash.continue')} <ArrowRight size={16} aria-hidden="true" /></Link> };
  } else {
    next = { text: t('dash.next.report'), action: <Link to="/report" className={btn.primary}>{t('dash.openReport')} <ArrowRight size={16} aria-hidden="true" /></Link> };
  }

  return (
    <div className="space-y-6">
      <PageHeader title={t('dash.title')} subtitle={t('dash.subtitle')} eyebrow={<DemoBadge />} />

      <Card className="border-blue-200 bg-gradient-to-r from-blue-50 to-white">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-blue-900">{t('dash.nextTitle')}</h2>
        <div className="mt-2 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-slate-800">{next.text}</p>
          <div className="flex-shrink-0">{next.action}</div>
        </div>
      </Card>

      <div className="grid gap-6 lg:grid-cols-5">
        <Card className="lg:col-span-2">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-600">{t('dash.company')}</h2>
          <p className="mt-2 text-lg font-bold text-slate-900">{profile.name || <span className="text-red-800">{t('dash.noName')}</span>}</p>
          <p className="text-sm text-slate-600">{loc(profile.industry)}</p>
          {profile.yearsExperience !== null && <p className="text-sm text-slate-600">{t('profile.yearsValue', { count: profile.yearsExperience })}</p>}
          <dl className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3">
            {counts.map(({ key, value, icon: Icon }) => (
              <div key={key} className="rounded-xl border border-slate-200 bg-slate-50 p-3">
                <dt className="flex items-center gap-1.5 text-xs text-slate-600">
                  <Icon size={13} aria-hidden="true" /> {t(key)}
                </dt>
                <dd className="text-xl font-bold text-slate-900">{value}</dd>
              </div>
            ))}
          </dl>
          <Link to="/profile" className={`${btn.ghost} mt-4`}>
            {t('dash.viewProfile')} <ArrowRight size={14} aria-hidden="true" />
          </Link>
        </Card>

        <Card className="lg:col-span-3">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-600">{t('dash.tenderTitle')}</h2>
          <p className="mt-2 text-xs font-mono text-slate-600">{demoTender.code}</p>
          <h3 className="text-lg font-bold text-slate-900">{loc(demoTender.name)}</h3>
          <p className="text-sm text-slate-600">{t('dash.requirements', { count: demoTender.requirements.length })}</p>

          <p className="mt-4 text-sm font-medium text-slate-700">{t('dash.preview', { date: asOf })}</p>
          <ul className="mt-2 divide-y divide-slate-100 rounded-xl border border-slate-200">
            {preview.map((r) => {
              const req = demoTender.requirements.find((q) => q.id === r.requirementId)!;
              return (
                <li key={r.requirementId} className="flex items-center justify-between gap-3 px-3 py-2 text-sm">
                  <span className="min-w-0 text-slate-800">{loc(req.title)}</span>
                  <StatusBadge status={r.status} />
                </li>
              );
            })}
          </ul>
          <p className="mt-3 text-sm text-slate-700" data-testid="dashboard-summary">
            {t('status.MET')}: <strong>{summary.met}</strong> · {t('status.MISSING')}: <strong>{summary.missing}</strong> · {t('status.UNCLEAR')}:{' '}
            <strong>{summary.unclear}</strong> · {t('report.readiness')}: <strong>{summary.readiness}%</strong>
          </p>
          <div className="mt-4">
            <button type="button" onClick={start} disabled={blocked} className={btn.primary}>
              {t('dash.analyse')} <ArrowRight size={16} aria-hidden="true" />
            </button>
          </div>
        </Card>
      </div>

      {issues.includes('noEvidence') && <Notice tone="warning">{t('profile.issue.noEvidence')}</Notice>}
      <p className="text-xs text-slate-600">{t('dash.dataNote')}</p>
    </div>
  );
}
