import { Link } from 'react-router-dom';
import { ArrowRight, Building2, FileSearch, ListChecks, Clock, Scale, UserCheck, Info, Target, Users, AlertTriangle } from 'lucide-react';
import { useI18n } from '../i18n/useI18n';
import { StatusBadge } from '../components/ui';
import type { Status } from '../domain/types';

export default function LandingPage() {
  const { t } = useI18n();
  const steps = [
    { icon: Building2, title: 'home.step1.title', desc: 'home.step1.desc' },
    { icon: FileSearch, title: 'home.step2.title', desc: 'home.step2.desc' },
    { icon: ListChecks, title: 'home.step3.title', desc: 'home.step3.desc' },
  ];
  const why = [
    { icon: Clock, title: 'home.why1.title', desc: 'home.why1.desc' },
    { icon: Scale, title: 'home.why2.title', desc: 'home.why2.desc' },
    { icon: UserCheck, title: 'home.why3.title', desc: 'home.why3.desc' },
  ];
  const facts = [
    { icon: Target, title: 'home.whatTitle', desc: 'home.what' },
    { icon: Users, title: 'home.forWhoTitle', desc: 'home.forWho' },
    { icon: AlertTriangle, title: 'home.problemTitle', desc: 'home.problem' },
  ];

  return (
    <div className="-mx-4 -my-8 sm:-mx-6">
      <section className="bg-gradient-to-br from-slate-950 via-blue-950 to-blue-800 px-4 py-16 text-white sm:px-6 sm:py-24">
        <div className="mx-auto max-w-4xl text-center">
          <span className="mb-6 inline-block rounded-full border border-blue-300/40 bg-white/10 px-4 py-1.5 text-sm font-medium text-blue-100">
            {t('home.badge')}
          </span>
          <h1 className="mb-6 text-3xl font-bold leading-tight tracking-tight sm:text-5xl">
            {t('home.title1')}
            <br />
            <span className="text-sky-300">{t('home.title2')}</span>
          </h1>
          <p className="mx-auto mb-10 max-w-2xl text-lg text-blue-100 sm:text-xl">{t('home.subtitle')}</p>
          <div className="flex flex-col justify-center gap-3 sm:flex-row">
            <Link to="/dashboard" className="inline-flex items-center justify-center gap-2 rounded-xl bg-white px-7 py-3.5 font-semibold text-blue-900 shadow-lg hover:bg-blue-50">
              {t('home.ctaDemo')} <ArrowRight size={18} aria-hidden="true" />
            </Link>
            <a href="#how" className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/40 bg-white/10 px-7 py-3.5 font-semibold text-white hover:bg-white/20">
              {t('home.ctaHow')}
            </a>
          </div>
        </div>
      </section>

      <section className="px-4 py-14 sm:px-6">
        <div className="mx-auto grid max-w-5xl gap-5 md:grid-cols-3">
          {facts.map(({ icon: Icon, title, desc }) => (
            <div key={title} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <Icon size={22} className="mb-3 text-blue-700" aria-hidden="true" />
              <h2 className="mb-2 font-semibold text-slate-900">{t(title)}</h2>
              <p className="text-sm leading-relaxed text-slate-600">{t(desc)}</p>
            </div>
          ))}
        </div>
      </section>

      <section id="how" className="scroll-mt-20 bg-white px-4 py-16 sm:px-6">
        <div className="mx-auto max-w-5xl">
          <h2 className="text-center text-2xl font-bold text-slate-900">{t('home.howTitle')}</h2>
          <p className="mb-10 mt-2 text-center text-slate-600">{t('home.howSubtitle')}</p>
          <ol className="grid gap-6 md:grid-cols-3">
            {steps.map(({ icon: Icon, title, desc }, i) => (
              <li key={title} className="relative rounded-2xl border border-slate-200 bg-slate-50 p-6">
                <span className="absolute right-5 top-4 text-3xl font-black text-slate-200" aria-hidden="true">
                  0{i + 1}
                </span>
                <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-blue-100 text-blue-800">
                  <Icon size={22} aria-hidden="true" />
                </div>
                <h3 className="mb-2 font-semibold text-slate-900">
                  <span className="sr-only">{i + 1}. </span>
                  {t(title)}
                </h3>
                <p className="text-sm text-slate-600">{t(desc)}</p>
              </li>
            ))}
          </ol>
          <div className="mt-8 text-center">
            <Link to="/dashboard" className="inline-flex items-center gap-2 rounded-xl bg-blue-700 px-6 py-3 font-semibold text-white hover:bg-blue-800">
              {t('home.ctaDemo')} <ArrowRight size={18} aria-hidden="true" />
            </Link>
          </div>
        </div>
      </section>

      <section className="px-4 py-16 sm:px-6">
        <div className="mx-auto max-w-5xl">
          <h2 className="mb-8 text-center text-2xl font-bold text-slate-900">{t('home.statusTitle')}</h2>
          <div className="grid gap-4 md:grid-cols-3">
            {(['MET', 'MISSING', 'UNCLEAR'] as Status[]).map((s) => (
              <div key={s} className="rounded-2xl border border-slate-200 bg-white p-5">
                <StatusBadge status={s} size="md" />
                <p className="mt-3 text-sm text-slate-700">{t(`status.desc.${s}`)}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-white px-4 py-16 sm:px-6">
        <div className="mx-auto max-w-5xl">
          <h2 className="mb-10 text-center text-2xl font-bold text-slate-900">{t('home.whyTitle')}</h2>
          <div className="grid gap-8 md:grid-cols-3">
            {why.map(({ icon: Icon, title, desc }) => (
              <div key={title} className="flex gap-4">
                <div className="mt-1 flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-blue-100 text-blue-800">
                  <Icon size={20} aria-hidden="true" />
                </div>
                <div>
                  <h3 className="mb-1 font-semibold text-slate-900">{t(title)}</h3>
                  <p className="text-sm text-slate-600">{t(desc)}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section aria-labelledby="disclaimer" className="bg-slate-900 px-4 py-8 sm:px-6">
        <div className="mx-auto flex max-w-3xl gap-3 text-sm text-slate-200">
          <Info size={20} className="flex-shrink-0 text-sky-300" aria-hidden="true" />
          <div>
            <h2 id="disclaimer" className="font-semibold text-white">{t('home.disclaimerTitle')}</h2>
            <p className="mt-1">{t('demo.disclaimer')}</p>
            <p className="mt-1">{t('human.review')}</p>
          </div>
        </div>
      </section>
    </div>
  );
}
