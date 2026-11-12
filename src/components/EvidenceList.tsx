import { FileText, CheckCircle2, XCircle } from 'lucide-react';
import type { EvidenceItem } from '../domain/types';
import { useI18n } from '../i18n/useI18n';
import { isExpired } from '../lib/dates';

function evidenceLabel(item: EvidenceItem, t: (k: string) => string, loc: (x: EvidenceItem['label']) => string): string {
  const own = loc(item.label);
  if (item.labelKey) return own ? `${t(item.labelKey)} · ${own}` : t(item.labelKey);
  return own;
}

export default function EvidenceList({ items, asOf }: { items: EvidenceItem[]; asOf: string }) {
  const { t, loc } = useI18n();
  if (items.length === 0) return <p className="text-sm text-slate-600">{t('req.noEvidence')}</p>;
  return (
    <ul className="space-y-2">
      {items.map((item, i) => {
        const expired = item.dateKind === 'expires' && item.date ? isExpired(item.date, asOf) : false;
        return (
          <li key={i} className="flex flex-col gap-1 rounded-lg border border-slate-200 bg-slate-50 p-3 text-sm sm:flex-row sm:items-start sm:justify-between">
            <div className="min-w-0">
              <p className="font-medium text-slate-900">{evidenceLabel(item, t, loc)}</p>
              <p className="mt-0.5 flex items-center gap-1 break-all text-xs text-slate-600">
                <FileText size={12} aria-hidden="true" className="flex-shrink-0" />
                {item.file || t('noFile')}
              </p>
              {item.dateKind === 'expires' && (
                <p className={`mt-0.5 text-xs ${expired ? 'font-semibold text-red-800' : 'text-slate-600'}`}>
                  {item.date ? t(expired ? 'expiry.expired' : 'expiry.valid', { date: item.date }) : t('expiry.unknown')}
                </p>
              )}
              {item.dateKind === 'year' && item.date && <p className="mt-0.5 text-xs text-slate-600">{t('field.year')}: {item.date}</p>}
            </div>
            <span className={`inline-flex flex-shrink-0 items-center gap-1 text-xs font-semibold ${item.rejected ? 'text-red-800' : 'text-green-800'}`}>
              {item.rejected ? <XCircle size={13} aria-hidden="true" /> : <CheckCircle2 size={13} aria-hidden="true" />}
              {t(item.rejected ? 'req.rejected' : 'req.accepted')}
            </span>
          </li>
        );
      })}
    </ul>
  );
}
