import { useState } from 'react';
import { Database, FileText, Cpu, AlertTriangle, Trash2 } from 'lucide-react';
import { useI18n } from '../i18n/useI18n';
import { useApp } from '../context/appState';
import { Card, ConfirmAction, Notice, PageHeader } from '../components/ui';

export default function PrivacyPage() {
  const { t } = useI18n();
  const { deleteAllData, storageOk } = useApp();
  const [deleted, setDeleted] = useState(false);
  const blocks = [
    { icon: Database, title: 'privacy.whereTitle', text: 'privacy.where' },
    { icon: FileText, title: 'privacy.pdfTitle', text: 'privacy.pdf' },
    { icon: Cpu, title: 'privacy.aiTitle', text: 'privacy.ai' },
  ];
  return (
    <div className="space-y-6">
      <PageHeader title={t('privacy.title')} subtitle={t('human.review')} />
      <Notice tone={storageOk ? 'success' : 'warning'} role="status">{t(storageOk ? 'privacy.storageOk' : 'storage.unavailable')}</Notice>
      <div className="grid gap-4 md:grid-cols-3">
        {blocks.map(({ icon: Icon, title, text }) => (
          <Card key={title}>
            <h2 className="flex items-center gap-2 font-bold text-slate-900"><Icon size={18} className="text-blue-700" aria-hidden="true" /> {t(title)}</h2>
            <p className="mt-2 text-sm text-slate-700">{t(text)}</p>
          </Card>
        ))}
      </div>
      <Card>
        <h2 className="flex items-center gap-2 font-bold text-slate-900"><AlertTriangle size={18} className="text-amber-700" aria-hidden="true" /> {t('privacy.limitsTitle')}</h2>
        <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-slate-700">
          {['privacy.limit1', 'privacy.limit2', 'privacy.limit3', 'privacy.limit4'].map((k) => <li key={k}>{t(k)}</li>)}
        </ul>
      </Card>
      <Card>
        <div aria-live="polite">{deleted && <Notice tone="success" role="status" className="mb-3">{t('privacy.deleted')}</Notice>}</div>
        <ConfirmAction
          label={t('privacy.delete')}
          question={t('privacy.deleteConfirm')}
          icon={<Trash2 size={16} aria-hidden="true" />}
          onConfirm={() => {
            deleteAllData();
            setDeleted(true);
          }}
        />
      </Card>
    </div>
  );
}
