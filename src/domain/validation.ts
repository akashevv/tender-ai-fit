import type { AnalysisSession, CompanyProfile, FeedbackEntry, RuleId, Tender } from './types';
import { isValidIsoDate } from '../lib/dates';

export const MAX_TEXT = 200;
export const MAX_FILE_BYTES = 20 * 1024 * 1024;
export const MAX_MANUAL_REQUIREMENTS = 30;

/** Validation error: an i18n key plus the field it belongs to. */
export type FieldError = { field: string; key: string };

const isObj = (v: unknown): v is Record<string, unknown> => typeof v === 'object' && v !== null && !Array.isArray(v);
const isText = (v: unknown) => typeof v === 'string' || (isObj(v) && typeof v.en === 'string' && typeof v.kk === 'string');

/** Loose shape check for data read back from browser storage (it may be stale or tampered with). */
export function isCompanyProfile(v: unknown): v is CompanyProfile {
  if (!isObj(v)) return false;
  return (
    typeof v.name === 'string' &&
    isText(v.industry) &&
    isText(v.description) &&
    (v.yearsExperience === null || typeof v.yearsExperience === 'number') &&
    ['licenses', 'certificates', 'projects', 'personnel', 'financialStatements'].every((k) => Array.isArray(v[k]))
  );
}

export function isAnalysisSession(v: unknown): v is AnalysisSession {
  if (!isObj(v) || !isObj(v.tender) || !isObj(v.reviews)) return false;
  return typeof v.asOf === 'string' && isValidIsoDate(v.asOf) && Array.isArray((v.tender as Tender).requirements);
}

export function isFeedbackList(v: unknown): v is Partial<FeedbackEntry>[] {
  return Array.isArray(v) && v.every(isObj);
}

const tooLong = (s: string) => s.length > MAX_TEXT;

/** Validates an edited profile before saving. Returns an empty list when valid. */
export function validateProfile(p: CompanyProfile): FieldError[] {
  const errors: FieldError[] = [];
  const text = (s: unknown) => (typeof s === 'string' ? s : '');
  if (!p.name.trim()) errors.push({ field: 'name', key: 'validation.required' });
  if (tooLong(p.name)) errors.push({ field: 'name', key: 'validation.tooLong' });
  if (tooLong(text(p.industry))) errors.push({ field: 'industry', key: 'validation.tooLong' });
  if (p.yearsExperience !== null && (!Number.isInteger(p.yearsExperience) || p.yearsExperience < 0 || p.yearsExperience > 100)) {
    errors.push({ field: 'yearsExperience', key: 'validation.years' });
  }
  const checkDate = (field: string, value: string) => {
    if (value && !isValidIsoDate(value)) errors.push({ field, key: 'validation.date' });
  };
  const checkYear = (field: string, value: number | null) => {
    if (value !== null && (!Number.isInteger(value) || value < 1990 || value > 2100)) errors.push({ field, key: 'validation.year' });
  };
  p.licenses.forEach((l) => {
    checkDate(`license.${l.id}.expires`, l.expires);
    if (tooLong(l.number) || tooLong(l.file)) errors.push({ field: `license.${l.id}.file`, key: 'validation.tooLong' });
  });
  p.certificates.forEach((c) => {
    checkDate(`certificate.${c.id}.expires`, c.expires);
    if (tooLong(c.file)) errors.push({ field: `certificate.${c.id}.file`, key: 'validation.tooLong' });
  });
  p.projects.forEach((pr) => {
    if (!text(pr.title).trim() && typeof pr.title === 'string') errors.push({ field: `project.${pr.id}.title`, key: 'validation.required' });
    checkYear(`project.${pr.id}.year`, pr.year);
  });
  p.personnel.forEach((pe) => {
    if (!pe.name.trim()) errors.push({ field: `person.${pe.id}.name`, key: 'validation.required' });
    if (tooLong(pe.name)) errors.push({ field: `person.${pe.id}.name`, key: 'validation.tooLong' });
  });
  p.financialStatements.forEach((f) => checkYear(`financial.${f.id}.year`, f.year));
  return errors;
}

export type FileCheck = { ok: true } | { ok: false; key: string };

/**
 * Honest local checks for a selected tender PDF. The file is only inspected in the
 * browser (size, extension, PDF signature and end marker). It is never uploaded and
 * its text is not extracted or analysed.
 */
export async function checkTenderFile(file: File | null | undefined): Promise<FileCheck> {
  if (!file) return { ok: false, key: 'upload.error.missing' };
  const name = file.name.toLowerCase();
  if (!name.endsWith('.pdf') || (file.type && file.type !== 'application/pdf')) {
    return { ok: false, key: 'upload.error.type' };
  }
  if (file.size === 0) return { ok: false, key: 'upload.error.empty' };
  if (file.size > MAX_FILE_BYTES) return { ok: false, key: 'upload.error.size' };
  try {
    const head = new Uint8Array(await file.slice(0, 1024).arrayBuffer());
    const headText = String.fromCharCode(...head);
    if (!headText.includes('%PDF-')) return { ok: false, key: 'upload.error.corrupt' };
    const tail = new Uint8Array(await file.slice(Math.max(0, file.size - 2048)).arrayBuffer());
    const tailText = String.fromCharCode(...tail);
    if (!tailText.includes('%%EOF')) return { ok: false, key: 'upload.error.corrupt' };
  } catch {
    return { ok: false, key: 'upload.error.read' };
  }
  return { ok: true };
}

export type ManualRow = { text: string; ruleId: RuleId };

export function validateManualRows(rows: ManualRow[]): string | null {
  const filled = rows.filter((r) => r.text.trim());
  if (filled.length === 0) return 'upload.error.noRequirements';
  if (filled.length > MAX_MANUAL_REQUIREMENTS) return 'upload.error.tooMany';
  if (filled.some((r) => r.text.length > 300)) return 'validation.tooLong';
  return null;
}

export function buildManualTender(fileName: string, rows: ManualRow[]): Tender {
  const filled = rows.filter((r) => r.text.trim()).slice(0, MAX_MANUAL_REQUIREMENTS);
  return {
    id: `manual-${Date.now()}`,
    code: 'MANUAL',
    mode: 'manual',
    name: fileName,
    sourceFile: fileName,
    requirements: filled.map((r, i) => ({
      id: `m-${i + 1}`,
      ruleId: r.ruleId,
      reference: { en: `Entered by user · item ${i + 1}`, kk: `Пайдаланушы енгізді · ${i + 1}-тармақ` },
      title: r.text.trim(),
      description: r.text.trim(),
    })),
  };
}
