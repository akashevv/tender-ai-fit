import { useState } from 'react';
import type { ReactNode } from 'react';
import { CheckCircle2, XCircle, Info, AlertTriangle } from 'lucide-react';
import type { Status } from '../domain/types';
import { useI18n } from '../i18n/useI18n';
import { STATUS_STYLE, btn } from './styles';

/** Status is always shown as icon + text, never by colour alone. */
export function StatusBadge({ status, size = 'sm' }: { status: Status; size?: 'sm' | 'md' }) {
  const { t } = useI18n();
  const s = STATUS_STYLE[status];
  return (
    <span
      data-status={status}
      className={`inline-flex items-center gap-1.5 rounded-full font-semibold ring-1 ring-inset whitespace-nowrap ${s.badge} ${
        size === 'md' ? 'px-3 py-1 text-sm' : 'px-2.5 py-0.5 text-xs'
      }`}
    >
      <s.Icon size={size === 'md' ? 16 : 14} aria-hidden="true" />
      {t(`status.${status}`)}
    </span>
  );
}

type NoticeTone = 'info' | 'warning' | 'error' | 'success';
const TONE: Record<NoticeTone, string> = {
  info: 'bg-blue-50 border-blue-200 text-blue-950',
  warning: 'bg-amber-50 border-amber-300 text-amber-950',
  error: 'bg-red-50 border-red-300 text-red-900',
  success: 'bg-green-50 border-green-300 text-green-900',
};

export function Notice({ tone = 'info', children, role, className = '' }: { tone?: NoticeTone; children: ReactNode; role?: 'alert' | 'status'; className?: string }) {
  const Icon = tone === 'error' ? XCircle : tone === 'warning' ? AlertTriangle : tone === 'success' ? CheckCircle2 : Info;
  return (
    <div role={role} className={`flex gap-3 rounded-xl border p-4 text-sm leading-relaxed ${TONE[tone]} ${className}`}>
      <Icon size={18} className="mt-0.5 flex-shrink-0" aria-hidden="true" />
      <div className="min-w-0">{children}</div>
    </div>
  );
}

export function PageHeader({ eyebrow, title, subtitle, actions }: { eyebrow?: ReactNode; title: string; subtitle?: ReactNode; actions?: ReactNode }) {
  return (
    <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
      <div className="min-w-0">
        {eyebrow && <div className="mb-2">{eyebrow}</div>}
        <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">{title}</h1>
        {subtitle && <p className="mt-1.5 max-w-3xl text-slate-600">{subtitle}</p>}
      </div>
      {actions && <div className="no-print flex flex-wrap gap-2">{actions}</div>}
    </div>
  );
}

export function Card({ children, className = '' }: { children: ReactNode; className?: string }) {
  return <section className={`rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6 ${className}`}>{children}</section>;
}

/** Two-step destructive action with an inline (accessible) confirmation instead of window.confirm. */
export function ConfirmAction({
  label,
  question,
  onConfirm,
  icon,
  tone = 'danger',
}: {
  label: string;
  question: string;
  onConfirm: () => void;
  icon?: ReactNode;
  tone?: 'danger' | 'secondary';
}) {
  const { t } = useI18n();
  const [asking, setAsking] = useState(false);
  if (!asking) {
    return (
      <button type="button" className={btn[tone]} onClick={() => setAsking(true)}>
        {icon}
        {label}
      </button>
    );
  }
  return (
    <div role="alertdialog" aria-label={label} className="flex flex-col gap-2 rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-950 sm:flex-row sm:items-center">
      <p className="flex-1">{question}</p>
      <div className="flex gap-2">
        <button
          type="button"
          autoFocus
          className="rounded-lg bg-red-700 px-3 py-2 font-semibold text-white hover:bg-red-800"
          onClick={() => {
            setAsking(false);
            onConfirm();
          }}
        >
          {t('common.confirm')}
        </button>
        <button type="button" className="rounded-lg border border-slate-300 bg-white px-3 py-2 font-semibold text-slate-800" onClick={() => setAsking(false)}>
          {t('common.cancel')}
        </button>
      </div>
    </div>
  );
}

export function DemoBadge() {
  const { t } = useI18n();
  return <span className="inline-flex items-center rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-semibold text-blue-900">{t('common.demoBadge')}</span>;
}
