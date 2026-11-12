import type { FeedbackEntry } from '../domain/types';
import { isFeedbackList } from '../domain/validation';
import { STORAGE_KEYS, readJson, removeKey, writeJson } from './storage';

export const PARTICIPANT_CODE = /^P(0[1-9]|[1-9][0-9])$/;

export function loadFeedback(): Partial<FeedbackEntry>[] {
  return readJson(STORAGE_KEYS.feedback, isFeedbackList) ?? [];
}

/** Returns false if the browser refused to store the entry. */
export function saveFeedback(entry: FeedbackEntry): boolean {
  return writeJson(STORAGE_KEYS.feedback, [...loadFeedback(), entry]);
}

export function clearFeedback(): void {
  removeKey(STORAGE_KEYS.feedback);
}

const COLUMNS: (keyof FeedbackEntry)[] = [
  'id',
  'participantCode',
  'language',
  'taskCompleted',
  'usefulness',
  'easeOfUse',
  'statusClarity',
  'trust',
  'comments',
  'suggestions',
  'submittedAt',
];

/** RFC 4180 CSV with a UTF-8 BOM so Excel shows Kazakh characters correctly.
 *  Cells starting with = + - @ are prefixed to prevent spreadsheet formula injection. */
export function toCsv(entries: Partial<FeedbackEntry>[]): string {
  const cell = (v: unknown) => {
    let s = v === undefined || v === null ? '' : String(v);
    if (/^[=+\-@]/.test(s)) s = `'${s}`;
    return /[",\n\r]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
  };
  const lines = [COLUMNS.join(','), ...entries.map((e) => COLUMNS.map((c) => cell(e[c])).join(','))];
  return `﻿${lines.join('\r\n')}`;
}

export function downloadText(filename: string, content: string, type: string): void {
  const url = URL.createObjectURL(new Blob([content], { type }));
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
