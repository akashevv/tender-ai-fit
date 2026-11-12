import { Link } from 'react-router-dom';
import { useI18n } from '../i18n/useI18n';

const STEPS = [
  { key: 'step.profile', to: '/profile' },
  { key: 'step.tender', to: '/tender' },
  { key: 'step.analysis', to: '/analysis' },
  { key: 'step.report', to: '/report' },
  { key: 'step.feedback', to: '/feedback' },
] as const;

/** Company Profile → Select Tender → Analysis & review → Report → Feedback */
export default function StepIndicator({ current }: { current: number }) {
  const { t } = useI18n();
  return (
    <nav aria-label={t('steps.label')} className="no-print">
      <ol className="flex flex-wrap gap-x-1 gap-y-2 text-xs sm:text-sm">
        {STEPS.map((s, i) => {
          const state = i < current ? 'done' : i === current ? 'current' : 'todo';
          return (
            <li key={s.key} className="flex items-center gap-1">
              <Link
                to={s.to}
                aria-current={state === 'current' ? 'step' : undefined}
                className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 font-medium ${
                  state === 'current'
                    ? 'bg-blue-700 text-white'
                    : state === 'done'
                      ? 'bg-blue-50 text-blue-900 hover:bg-blue-100'
                      : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                <span
                  className={`flex h-5 w-5 items-center justify-center rounded-full text-[11px] font-bold ${
                    state === 'current' ? 'bg-white text-blue-800' : state === 'done' ? 'bg-blue-700 text-white' : 'bg-slate-200 text-slate-700'
                  }`}
                  aria-hidden="true"
                >
                  {i + 1}
                </span>
                {t(s.key)}
                {state === 'current' && <span className="sr-only"> ({t('step.current')})</span>}
              </Link>
              {i < STEPS.length - 1 && <span className="text-slate-400" aria-hidden="true">›</span>}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
