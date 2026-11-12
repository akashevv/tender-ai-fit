import { useState } from 'react';
import type { FormEvent, ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Award, Briefcase, Calendar, FileText, Landmark, Pencil, Plus, RotateCcw, Save, Trash2, User, CheckCircle2, AlertTriangle } from 'lucide-react';
import { useI18n } from '../i18n/useI18n';
import { useApp } from '../context/appState';
import type { CertificateStandard, CompanyProfile, LicenseCategory, PersonRole } from '../domain/types';
import { getProfileIssues, EXPIRY_WARNING_DAYS } from '../domain/evaluate';
import { validateProfile } from '../domain/validation';
import type { FieldError } from '../domain/validation';
import type { ScenarioId } from '../data/demoCompany';
import { daysBetween, isExpired, isValidIsoDate, todayIso } from '../lib/dates';
import { Card, ConfirmAction, DemoBadge, Notice, PageHeader } from '../components/ui';
import { btn, inputCls } from '../components/styles';
import StepIndicator from '../components/StepIndicator';

const newId = (prefix: string) => `${prefix}-${Date.now().toString(36)}${Math.random().toString(36).slice(2, 6)}`;
const STANDARDS: CertificateStandard[] = ['ISO 9001', 'ISO 14001', 'ISO 45001', 'other'];
const ROLES: PersonRole[] = ['civil_engineer', 'project_manager', 'other'];
const CATEGORIES: LicenseCategory[] = ['construction', 'other'];

function ExpiryText({ expires }: { expires: string }) {
  const { t } = useI18n();
  const asOf = todayIso();
  if (!expires || !isValidIsoDate(expires)) return <span className="text-amber-900">{t('expiry.unknown')}</span>;
  if (isExpired(expires, asOf))
    return (
      <span className="inline-flex items-center gap-1 font-semibold text-red-800">
        <AlertTriangle size={12} aria-hidden="true" /> {t('expiry.expired', { date: expires })}
      </span>
    );
  const days = daysBetween(asOf, expires);
  if (days <= EXPIRY_WARNING_DAYS) return <span className="font-semibold text-amber-900">{t('expiry.soon', { date: expires, days })}</span>;
  return (
    <span className="inline-flex items-center gap-1 text-green-800">
      <CheckCircle2 size={12} aria-hidden="true" /> {t('expiry.valid', { date: expires })}
    </span>
  );
}

function Section({ icon, title, children, action }: { icon: ReactNode; title: string; children: ReactNode; action?: ReactNode }) {
  return (
    <Card>
      <div className="mb-4 flex items-center justify-between gap-2">
        <h2 className="flex items-center gap-2 font-bold text-slate-900">
          {icon}
          {title}
        </h2>
        {action}
      </div>
      {children}
    </Card>
  );
}

function Row({ children }: { children: ReactNode }) {
  return <li className="rounded-xl border border-slate-200 bg-slate-50 p-3 text-sm">{children}</li>;
}

function FileLine({ file }: { file: string }) {
  const { t } = useI18n();
  return (
    <p className="mt-0.5 flex items-center gap-1 break-all text-xs text-slate-600">
      <FileText size={12} aria-hidden="true" className="flex-shrink-0" /> {file || t('noFile')}
    </p>
  );
}

/* ------------------------------ View mode ------------------------------ */

function ProfileView({ profile }: { profile: CompanyProfile }) {
  const { t, loc } = useI18n();
  const empty = <p className="text-sm text-slate-600">{t('profile.empty')}</p>;
  return (
    <div className="grid gap-6 md:grid-cols-2">
      <Section icon={<FileText size={18} className="text-blue-700" aria-hidden="true" />} title={t('profile.section.licenses')}>
        {profile.licenses.length === 0 ? empty : (
          <ul className="space-y-2">
            {profile.licenses.map((l) => (
              <Row key={l.id}>
                <p className="font-medium text-slate-900">{t(`licenseCategory.${l.category}`)} {l.number && <span className="text-slate-600">· {l.number}</span>}</p>
                <FileLine file={l.file} />
                <p className="mt-0.5 flex items-center gap-1 text-xs"><Calendar size={12} aria-hidden="true" /><ExpiryText expires={l.expires} /></p>
              </Row>
            ))}
          </ul>
        )}
      </Section>
      <Section icon={<Award size={18} className="text-blue-700" aria-hidden="true" />} title={t('profile.section.certificates')}>
        {profile.certificates.length === 0 ? empty : (
          <ul className="space-y-2">
            {profile.certificates.map((c) => (
              <Row key={c.id}>
                <p className="font-medium text-slate-900">{c.standard === 'other' ? t('certStandard.other') : c.standard}</p>
                <FileLine file={c.file} />
                <p className="mt-0.5 flex items-center gap-1 text-xs"><Calendar size={12} aria-hidden="true" /><ExpiryText expires={c.expires} /></p>
              </Row>
            ))}
          </ul>
        )}
      </Section>
      <Section icon={<Briefcase size={18} className="text-blue-700" aria-hidden="true" />} title={t('profile.section.projects')}>
        {profile.projects.length === 0 ? empty : (
          <ul className="space-y-2">
            {profile.projects.map((p) => (
              <Row key={p.id}>
                <p className="font-medium text-slate-900">{loc(p.title)} {p.year && <span className="text-slate-600">· {p.year}</span>}</p>
                <FileLine file={p.evidenceFile} />
                <p className={`mt-0.5 text-xs font-medium ${p.scopeConfirmed ? 'text-green-800' : 'text-amber-900'}`}>
                  {t(p.scopeConfirmed ? 'scope.confirmed' : 'scope.unconfirmed')}
                </p>
              </Row>
            ))}
          </ul>
        )}
      </Section>
      <Section icon={<User size={18} className="text-blue-700" aria-hidden="true" />} title={t('profile.section.personnel')}>
        {profile.personnel.length === 0 ? empty : (
          <ul className="space-y-2">
            {profile.personnel.map((p) => (
              <Row key={p.id}>
                <p className="font-medium text-slate-900">{p.name}</p>
                <p className="text-xs text-slate-700">{t(`role.${p.role}`)}</p>
                <FileLine file={p.qualificationFile} />
              </Row>
            ))}
          </ul>
        )}
      </Section>
      <Section icon={<Landmark size={18} className="text-blue-700" aria-hidden="true" />} title={t('profile.section.financial')}>
        {profile.financialStatements.length === 0 ? empty : (
          <ul className="space-y-2">
            {profile.financialStatements.map((f) => (
              <Row key={f.id}>
                <p className="font-medium text-slate-900">{t(f.audited ? 'financial.audited' : 'financial.unaudited')} {f.year && <span className="text-slate-600">· {f.year}</span>}</p>
                <FileLine file={f.file} />
              </Row>
            ))}
          </ul>
        )}
      </Section>
    </div>
  );
}

/* ------------------------------ Edit mode ------------------------------ */

function Field({ id, label, error, children }: { id: string; label: string; error?: string; children: (props: { id: string; 'aria-invalid': boolean; 'aria-describedby'?: string }) => ReactNode }) {
  const errId = `${id}-error`;
  return (
    <div>
      <label htmlFor={id} className="block text-xs font-semibold text-slate-700">{label}</label>
      {children({ id, 'aria-invalid': !!error, 'aria-describedby': error ? errId : undefined })}
      {error && <p id={errId} className="mt-1 text-xs font-medium text-red-800">{error}</p>}
    </div>
  );
}

function ProfileEditor({ initial, onCancel, onSave }: { initial: CompanyProfile; onCancel: () => void; onSave: (p: CompanyProfile) => void }) {
  const { t, loc } = useI18n();
  const [draft, setDraft] = useState<CompanyProfile>(() => structuredClone(initial));
  const [errors, setErrors] = useState<FieldError[]>([]);
  const err = (field: string) => {
    const e = errors.find((x) => x.field === field);
    return e ? t(e.key) : undefined;
  };
  const set = (patch: Partial<CompanyProfile>) => setDraft((d) => ({ ...d, ...patch }));
  const toYear = (v: string) => (v.trim() === '' ? null : Number(v));

  type ListKey = 'licenses' | 'certificates' | 'projects' | 'personnel' | 'financialStatements';
  const updateItem = <K extends ListKey>(key: K, id: string, patch: Partial<CompanyProfile[K][number]>) =>
    setDraft((d) => ({ ...d, [key]: (d[key] as { id: string }[]).map((x) => (x.id === id ? { ...x, ...patch } : x)) }));
  const removeItem = (key: ListKey, id: string) => setDraft((d) => ({ ...d, [key]: (d[key] as { id: string }[]).filter((x) => x.id !== id) }));

  const submit = (e: FormEvent) => {
    e.preventDefault();
    const found = validateProfile(draft);
    setErrors(found);
    if (found.length === 0) onSave({ ...draft, name: draft.name.trim() });
  };

  const removeBtn = (key: ListKey, id: string, label: string) => (
    <button type="button" onClick={() => removeItem(key, id)} className="inline-flex items-center gap-1 self-end rounded-lg px-2 py-1.5 text-xs font-semibold text-red-800 hover:bg-red-50">
      <Trash2 size={14} aria-hidden="true" /> {t('common.remove')}<span className="sr-only">: {label}</span>
    </button>
  );
  const addBtn = (label: string, onClick: () => void) => (
    <button type="button" onClick={onClick} className={btn.ghost}>
      <Plus size={15} aria-hidden="true" /> {label}
    </button>
  );
  const grid = 'grid gap-3 rounded-xl border border-slate-200 bg-slate-50 p-3 sm:grid-cols-2';

  return (
    <form onSubmit={submit} noValidate className="space-y-6" aria-label={t('profile.edit')}>
      {errors.length > 0 && <Notice tone="error" role="alert">{t('profile.errors')}</Notice>}

      <Card>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field id="p-name" label={`${t('profile.fields.name')} (${t('common.required')})`} error={err('name')}>
            {(a) => <input {...a} className={inputCls} value={draft.name} maxLength={250} onChange={(e) => set({ name: e.target.value })} />}
          </Field>
          <Field id="p-industry" label={t('profile.fields.industry')} error={err('industry')}>
            {(a) => <input {...a} className={inputCls} value={loc(draft.industry)} maxLength={250} onChange={(e) => set({ industry: e.target.value })} />}
          </Field>
          <Field id="p-years" label={t('profile.fields.years')} error={err('yearsExperience')}>
            {(a) => <input {...a} type="number" min={0} max={100} className={inputCls} value={draft.yearsExperience ?? ''} onChange={(e) => set({ yearsExperience: toYear(e.target.value) })} />}
          </Field>
          <Field id="p-desc" label={t('profile.fields.description')}>
            {(a) => <input {...a} className={inputCls} value={loc(draft.description)} maxLength={300} onChange={(e) => set({ description: e.target.value })} />}
          </Field>
        </div>
      </Card>

      <Section icon={<FileText size={18} className="text-blue-700" aria-hidden="true" />} title={t('profile.section.licenses')}
        action={addBtn(t('add.license'), () => set({ licenses: [...draft.licenses, { id: newId('lic'), category: 'construction', number: '', file: '', expires: '' }] }))}>
        <ul className="space-y-3">
          {draft.licenses.map((l, i) => (
            <li key={l.id} className={grid}>
              <Field id={`lic-${l.id}-cat`} label={t('field.category')}>
                {(a) => (
                  <select {...a} className={inputCls} value={l.category} onChange={(e) => updateItem('licenses', l.id, { category: e.target.value as LicenseCategory })}>
                    {CATEGORIES.map((c) => <option key={c} value={c}>{t(`licenseCategory.${c}`)}</option>)}
                  </select>
                )}
              </Field>
              <Field id={`lic-${l.id}-num`} label={t('field.number')}>
                {(a) => <input {...a} className={inputCls} value={l.number} onChange={(e) => updateItem('licenses', l.id, { number: e.target.value })} />}
              </Field>
              <Field id={`lic-${l.id}-file`} label={t('field.file')} error={err(`license.${l.id}.file`)}>
                {(a) => <input {...a} className={inputCls} value={l.file} onChange={(e) => updateItem('licenses', l.id, { file: e.target.value })} />}
              </Field>
              <Field id={`lic-${l.id}-exp`} label={t('field.expires')} error={err(`license.${l.id}.expires`)}>
                {(a) => <input {...a} type="date" className={inputCls} value={l.expires} onChange={(e) => updateItem('licenses', l.id, { expires: e.target.value })} />}
              </Field>
              {removeBtn('licenses', l.id, `${t('profile.section.licenses')} ${i + 1}`)}
            </li>
          ))}
        </ul>
      </Section>

      <Section icon={<Award size={18} className="text-blue-700" aria-hidden="true" />} title={t('profile.section.certificates')}
        action={addBtn(t('add.certificate'), () => set({ certificates: [...draft.certificates, { id: newId('cert'), standard: 'ISO 9001', file: '', expires: '' }] }))}>
        <ul className="space-y-3">
          {draft.certificates.map((c, i) => (
            <li key={c.id} className={grid}>
              <Field id={`cert-${c.id}-std`} label={t('field.standard')}>
                {(a) => (
                  <select {...a} className={inputCls} value={c.standard} onChange={(e) => updateItem('certificates', c.id, { standard: e.target.value as CertificateStandard })}>
                    {STANDARDS.map((s) => <option key={s} value={s}>{s === 'other' ? t('certStandard.other') : s}</option>)}
                  </select>
                )}
              </Field>
              <Field id={`cert-${c.id}-exp`} label={t('field.expires')} error={err(`certificate.${c.id}.expires`)}>
                {(a) => <input {...a} type="date" className={inputCls} value={c.expires} onChange={(e) => updateItem('certificates', c.id, { expires: e.target.value })} />}
              </Field>
              <Field id={`cert-${c.id}-file`} label={t('field.file')} error={err(`certificate.${c.id}.file`)}>
                {(a) => <input {...a} className={inputCls} value={c.file} onChange={(e) => updateItem('certificates', c.id, { file: e.target.value })} />}
              </Field>
              {removeBtn('certificates', c.id, `${t('profile.section.certificates')} ${i + 1}`)}
            </li>
          ))}
        </ul>
      </Section>

      <Section icon={<Briefcase size={18} className="text-blue-700" aria-hidden="true" />} title={t('profile.section.projects')}
        action={addBtn(t('add.project'), () => set({ projects: [...draft.projects, { id: newId('prj'), title: '', year: null, evidenceFile: '', scopeConfirmed: false }] }))}>
        <ul className="space-y-3">
          {draft.projects.map((p, i) => (
            <li key={p.id} className={grid}>
              <Field id={`prj-${p.id}-title`} label={t('field.title')} error={err(`project.${p.id}.title`)}>
                {(a) => <input {...a} className={inputCls} value={loc(p.title)} onChange={(e) => updateItem('projects', p.id, { title: e.target.value })} />}
              </Field>
              <Field id={`prj-${p.id}-year`} label={t('field.year')} error={err(`project.${p.id}.year`)}>
                {(a) => <input {...a} type="number" className={inputCls} value={p.year ?? ''} onChange={(e) => updateItem('projects', p.id, { year: toYear(e.target.value) })} />}
              </Field>
              <Field id={`prj-${p.id}-file`} label={t('field.file')}>
                {(a) => <input {...a} className={inputCls} value={p.evidenceFile} onChange={(e) => updateItem('projects', p.id, { evidenceFile: e.target.value })} />}
              </Field>
              <label className="flex items-center gap-2 self-end py-2 text-sm text-slate-800">
                <input type="checkbox" className="h-4 w-4" checked={p.scopeConfirmed} onChange={(e) => updateItem('projects', p.id, { scopeConfirmed: e.target.checked })} />
                {t('field.scopeConfirmed')}
              </label>
              {removeBtn('projects', p.id, loc(p.title) || `${t('profile.section.projects')} ${i + 1}`)}
            </li>
          ))}
        </ul>
      </Section>

      <Section icon={<User size={18} className="text-blue-700" aria-hidden="true" />} title={t('profile.section.personnel')}
        action={addBtn(t('add.person'), () => set({ personnel: [...draft.personnel, { id: newId('per'), name: '', role: 'civil_engineer', qualificationFile: '' }] }))}>
        <ul className="space-y-3">
          {draft.personnel.map((p, i) => (
            <li key={p.id} className={grid}>
              <Field id={`per-${p.id}-name`} label={t('field.personName')} error={err(`person.${p.id}.name`)}>
                {(a) => <input {...a} className={inputCls} value={p.name} onChange={(e) => updateItem('personnel', p.id, { name: e.target.value })} />}
              </Field>
              <Field id={`per-${p.id}-role`} label={t('field.role')}>
                {(a) => (
                  <select {...a} className={inputCls} value={p.role} onChange={(e) => updateItem('personnel', p.id, { role: e.target.value as PersonRole })}>
                    {ROLES.map((r) => <option key={r} value={r}>{t(`role.${r}`)}</option>)}
                  </select>
                )}
              </Field>
              <Field id={`per-${p.id}-file`} label={t('field.file')}>
                {(a) => <input {...a} className={inputCls} value={p.qualificationFile} onChange={(e) => updateItem('personnel', p.id, { qualificationFile: e.target.value })} />}
              </Field>
              {removeBtn('personnel', p.id, p.name || `${t('profile.section.personnel')} ${i + 1}`)}
            </li>
          ))}
        </ul>
      </Section>

      <Section icon={<Landmark size={18} className="text-blue-700" aria-hidden="true" />} title={t('profile.section.financial')}
        action={addBtn(t('add.financial'), () => set({ financialStatements: [...draft.financialStatements, { id: newId('fin'), year: null, audited: true, file: '' }] }))}>
        {draft.financialStatements.length === 0 && <p className="text-sm text-slate-600">{t('profile.empty')}</p>}
        <ul className="space-y-3">
          {draft.financialStatements.map((f, i) => (
            <li key={f.id} className={grid}>
              <Field id={`fin-${f.id}-year`} label={t('field.year')} error={err(`financial.${f.id}.year`)}>
                {(a) => <input {...a} type="number" className={inputCls} value={f.year ?? ''} onChange={(e) => updateItem('financialStatements', f.id, { year: toYear(e.target.value) })} />}
              </Field>
              <Field id={`fin-${f.id}-file`} label={t('field.file')}>
                {(a) => <input {...a} className={inputCls} value={f.file} onChange={(e) => updateItem('financialStatements', f.id, { file: e.target.value })} />}
              </Field>
              <label className="flex items-center gap-2 py-2 text-sm text-slate-800">
                <input type="checkbox" className="h-4 w-4" checked={f.audited} onChange={(e) => updateItem('financialStatements', f.id, { audited: e.target.checked })} />
                {t('field.audited')}
              </label>
              {removeBtn('financialStatements', f.id, `${t('profile.section.financial')} ${i + 1}`)}
            </li>
          ))}
        </ul>
      </Section>

      <div className="sticky bottom-0 z-10 -mx-4 flex flex-wrap gap-2 border-t border-slate-200 bg-white/95 px-4 py-3 sm:mx-0 sm:rounded-xl sm:border">
        <button type="submit" className={btn.primary}><Save size={16} aria-hidden="true" /> {t('profile.save')}</button>
        <button type="button" className={btn.secondary} onClick={onCancel}>{t('profile.discard')}</button>
      </div>
    </form>
  );
}

/* ------------------------------ Page ------------------------------ */

export default function CompanyProfilePage() {
  const { t, loc } = useI18n();
  const { profile, saveProfile, loadScenario, resetDemo, storageOk } = useApp();
  const [editing, setEditing] = useState(false);
  const [message, setMessage] = useState<{ tone: 'success' | 'warning'; text: string } | null>(null);
  const issues = getProfileIssues(profile);

  const scenarios: { id: ScenarioId; key: string }[] = [
    { id: 'original', key: 'scenario.original' },
    { id: 'renewed', key: 'scenario.renewed' },
    { id: 'incomplete', key: 'scenario.incomplete' },
  ];

  return (
    <div className="space-y-6">
      <StepIndicator current={0} />
      <PageHeader
        eyebrow={<DemoBadge />}
        title={t('profile.title')}
        subtitle={t('profile.subtitle')}
        actions={
          !editing && (
            <>
              <button type="button" className={btn.secondary} onClick={() => { setEditing(true); setMessage(null); }}>
                <Pencil size={16} aria-hidden="true" /> {t('profile.edit')}
              </button>
              <Link to="/tender" className={btn.primary}>
                {t('profile.toTender')} <ArrowRight size={16} aria-hidden="true" />
              </Link>
            </>
          )
        }
      />

      <div aria-live="polite">{message && <Notice tone={message.tone} role="status">{message.text}</Notice>}</div>
      {issues.includes('nameMissing') && <Notice tone="error" role="alert">{t('profile.issue.nameMissing')}</Notice>}
      {issues.includes('noEvidence') && <Notice tone="warning">{t('profile.issue.noEvidence')}</Notice>}

      {editing ? (
        <ProfileEditor
          initial={profile}
          onCancel={() => setEditing(false)}
          onSave={(p) => {
            const ok = saveProfile(p);
            setEditing(false);
            setMessage(ok ? { tone: 'success', text: t('profile.saved') } : { tone: 'warning', text: t('storage.saveFailed') });
          }}
        />
      ) : (
        <>
          <section className="rounded-2xl bg-gradient-to-r from-blue-950 to-blue-700 p-6 text-white" aria-label={t('dash.company')}>
            <div className="flex items-center gap-4">
              <div className="flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-2xl bg-white/15 text-xl font-black" aria-hidden="true">
                {(profile.name || '?').split(/\s+/).slice(0, 3).map((w) => w[0]).join('').toUpperCase()}
              </div>
              <div className="min-w-0">
                <h2 className="text-xl font-bold">{profile.name || t('dash.noName')}</h2>
                <p className="text-sm text-blue-100">{loc(profile.industry)}</p>
                {profile.yearsExperience !== null && <p className="text-sm text-blue-100">{t('profile.yearsValue', { count: profile.yearsExperience })}</p>}
                <p className="mt-1 text-sm text-blue-50">{loc(profile.description)}</p>
              </div>
            </div>
          </section>

          <ProfileView profile={profile} />

          <Card>
            <h2 className="font-bold text-slate-900">{t('scenario.title')}</h2>
            <p className="mt-1 text-sm text-slate-600">{t('scenario.desc')}</p>
            <div className="mt-4 flex flex-wrap gap-2">
              {scenarios.map((s) => (
                <button
                  key={s.id}
                  type="button"
                  className={btn.secondary}
                  onClick={() => {
                    loadScenario(s.id);
                    setMessage({ tone: storageOk ? 'success' : 'warning', text: t('scenario.loaded', { name: t(s.key) }) });
                  }}
                >
                  {t(s.key)}
                </button>
              ))}
            </div>
            <div className="mt-6 border-t border-slate-200 pt-4">
              <ConfirmAction
                label={t('profile.reset')}
                question={t('profile.resetConfirm')}
                icon={<RotateCcw size={16} aria-hidden="true" />}
                onConfirm={() => {
                  resetDemo();
                  setMessage({ tone: 'success', text: t('profile.resetDone') });
                }}
              />
            </div>
          </Card>
        </>
      )}

      <p className="text-xs text-slate-600">{t('profile.storageNote')}</p>
    </div>
  );
}
