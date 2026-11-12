import { CheckCircle2, XCircle, HelpCircle } from 'lucide-react';
import type { Status } from '../domain/types';

/** Accessible status colours (text ≥ 4.5:1 on its background), always paired with an icon and a label. */
export const STATUS_STYLE: Record<Status, { badge: string; card: string; text: string; Icon: typeof CheckCircle2 }> = {
  MET: { badge: 'bg-green-50 text-green-800 ring-green-600/30', card: 'border-l-green-600', text: 'text-green-800', Icon: CheckCircle2 },
  MISSING: { badge: 'bg-red-50 text-red-800 ring-red-600/30', card: 'border-l-red-600', text: 'text-red-800', Icon: XCircle },
  UNCLEAR: { badge: 'bg-amber-50 text-amber-900 ring-amber-600/40', card: 'border-l-amber-500', text: 'text-amber-900', Icon: HelpCircle },
};

export const btn = {
  primary:
    'inline-flex items-center justify-center gap-2 rounded-xl bg-blue-700 px-5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-blue-800 disabled:bg-slate-300 disabled:text-slate-600',
  secondary:
    'inline-flex items-center justify-center gap-2 rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold text-slate-800 hover:bg-slate-50 disabled:opacity-50',
  danger:
    'inline-flex items-center justify-center gap-2 rounded-xl border border-red-300 bg-white px-4 py-2.5 text-sm font-semibold text-red-800 hover:bg-red-50',
  ghost: 'inline-flex items-center gap-1.5 rounded-lg px-2 py-1.5 text-sm font-semibold text-blue-800 hover:bg-blue-50 disabled:opacity-50',
};

export const inputCls =
  'mt-1 block w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm placeholder:text-slate-500 aria-[invalid=true]:border-red-600 aria-[invalid=true]:ring-1 aria-[invalid=true]:ring-red-600';
