import { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { Menu, X, ShieldCheck } from 'lucide-react';
import { useI18n } from '../i18n/useI18n';
import type { Lang } from '../domain/types';

const LINKS = [
  { to: '/', key: 'nav.home', end: true },
  { to: '/dashboard', key: 'nav.dashboard' },
  { to: '/profile', key: 'nav.profile' },
  { to: '/tender', key: 'nav.tender' },
  { to: '/report', key: 'nav.report' },
  { to: '/feedback', key: 'nav.feedback' },
] as const;

export function LanguageSwitcher() {
  const { lang, setLang, t } = useI18n();
  const options: { value: Lang; short: string; label: string }[] = [
    { value: 'en', short: 'EN', label: t('lang.en') },
    { value: 'kk', short: 'KZ', label: t('lang.kk') },
  ];
  return (
    <div role="group" aria-label={t('lang.label')} className="inline-flex rounded-lg border border-slate-300 bg-white p-0.5">
      {options.map((o) => (
        <button
          key={o.value}
          type="button"
          lang={o.value}
          aria-pressed={lang === o.value}
          title={o.label}
          onClick={() => setLang(o.value)}
          className={`rounded-md px-2.5 py-1 text-xs font-bold ${lang === o.value ? 'bg-blue-800 text-white' : 'text-slate-700 hover:bg-slate-100'}`}
        >
          <span aria-hidden="true">{o.short}</span>
          <span className="sr-only">{o.label}</span>
        </button>
      ))}
    </div>
  );
}

export default function Header() {
  const { t } = useI18n();
  const [open, setOpen] = useState(false);

  const linkCls = ({ isActive }: { isActive: boolean }) =>
    `rounded-lg px-3 py-2 text-sm font-medium ${isActive ? 'bg-blue-50 text-blue-900' : 'text-slate-700 hover:bg-slate-100 hover:text-slate-900'}`;

  return (
    <header className="no-print sticky top-0 z-30 border-b border-slate-200 bg-white/95 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-3 sm:px-6">
        <Link to="/" className="flex items-center gap-2 font-bold text-slate-900">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-blue-900 to-blue-600 text-white" aria-hidden="true">
            <ShieldCheck size={18} />
          </span>
          <span className="text-lg tracking-tight">Tender AI Fit</span>
        </Link>
        <nav aria-label={t('nav.main')} className="hidden lg:block">
          <ul className="flex items-center gap-1">
            {LINKS.map((l) => (
              <li key={l.to}>
                <NavLink to={l.to} end={'end' in l} className={linkCls}>
                  {t(l.key)}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>
        <div className="flex items-center gap-2">
          <LanguageSwitcher />
          <button
            type="button"
            className="rounded-lg border border-slate-300 p-2 text-slate-800 lg:hidden"
            aria-expanded={open}
            aria-controls="mobile-nav"
            onClick={() => setOpen((v) => !v)}
          >
            {open ? <X size={18} aria-hidden="true" /> : <Menu size={18} aria-hidden="true" />}
            <span className="sr-only">{t('nav.menu')}</span>
          </button>
        </div>
      </div>
      {open && (
        <nav id="mobile-nav" aria-label={t('nav.main')} className="border-t border-slate-200 px-4 py-2 lg:hidden">
          <ul className="flex flex-col">
            {LINKS.map((l) => (
              <li key={l.to}>
                <NavLink to={l.to} end={'end' in l} onClick={() => setOpen(false)} className={(s) => `block ${linkCls(s)}`}>
                  {t(l.key)}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>
      )}
    </header>
  );
}
