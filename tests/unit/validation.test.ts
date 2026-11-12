import { describe, expect, it } from 'vitest';
import { buildManualTender, checkTenderFile, isAnalysisSession, isCompanyProfile, validateManualRows, validateProfile } from '../../src/domain/validation';
import { demoCompany } from '../../src/data/demoCompany';
import { toCsv, PARTICIPANT_CODE } from '../../src/lib/feedback';
import { readJson, writeJson, isStorageAvailable } from '../../src/lib/storage';
import { isValidIsoDate, formatDate, daysBetween } from '../../src/lib/dates';

const VALID_PDF = '%PDF-1.4\n1 0 obj << /Type /Catalog >> endobj\ntrailer << /Root 1 0 R >>\n%%EOF\n';

describe('tender PDF checks (local only, no parsing)', () => {
  it('missing file', async () => expect(await checkTenderFile(null)).toEqual({ ok: false, key: 'upload.error.missing' }));
  it('unsupported type', async () =>
    expect(await checkTenderFile(new File(['hello'], 'notes.docx', { type: 'application/msword' }))).toEqual({ ok: false, key: 'upload.error.type' }));
  it('renamed text file with .pdf extension is rejected as corrupt', async () =>
    expect(await checkTenderFile(new File(['just text'], 'fake.pdf', { type: 'application/pdf' }))).toEqual({ ok: false, key: 'upload.error.corrupt' }));
  it('truncated PDF without end marker is rejected', async () =>
    expect(await checkTenderFile(new File(['%PDF-1.4\n1 0 obj'], 'cut.pdf', { type: 'application/pdf' }))).toEqual({ ok: false, key: 'upload.error.corrupt' }));
  it('empty file', async () => expect(await checkTenderFile(new File([], 'empty.pdf', { type: 'application/pdf' }))).toEqual({ ok: false, key: 'upload.error.empty' }));
  it('oversized file', async () => {
    const big = new File([new Uint8Array(20 * 1024 * 1024 + 1)], 'big.pdf', { type: 'application/pdf' });
    expect(await checkTenderFile(big)).toEqual({ ok: false, key: 'upload.error.size' });
  });
  it('accepts a structurally valid PDF', async () =>
    expect(await checkTenderFile(new File([VALID_PDF], 'Tender.PDF', { type: 'application/pdf' }))).toEqual({ ok: true }));
});

describe('manual requirements', () => {
  it('requires at least one requirement and caps at 30', () => {
    expect(validateManualRows([{ text: '  ', ruleId: 'manual_other' }])).toBe('upload.error.noRequirements');
    expect(validateManualRows(Array.from({ length: 31 }, () => ({ text: 'x', ruleId: 'manual_other' as const })))).toBe('upload.error.tooMany');
    expect(validateManualRows([{ text: 'Licence', ruleId: 'construction_license' }])).toBeNull();
  });
  it('builds a manual tender that keeps the chosen rule', () => {
    const t = buildManualTender('my.pdf', [{ text: ' Licence ', ruleId: 'construction_license' }, { text: '', ruleId: 'manual_other' }]);
    expect(t.mode).toBe('manual');
    expect(t.requirements).toHaveLength(1);
    expect(t.requirements[0]).toMatchObject({ ruleId: 'construction_license', title: 'Licence' });
  });
});

describe('profile validation', () => {
  it('demo profile is valid', () => expect(validateProfile(demoCompany)).toEqual([]));
  it('detects missing name, bad date and bad year', () => {
    const p = structuredClone(demoCompany);
    p.name = ' ';
    p.certificates[0].expires = '2025-02-30';
    p.projects[0].year = 1800;
    p.yearsExperience = -1;
    const fields = validateProfile(p).map((e) => e.field);
    expect(fields).toEqual(expect.arrayContaining(['name', 'certificate.cert-1.expires', 'project.prj-1.year', 'yearsExperience']));
  });
  it('rejects malformed stored data', () => {
    expect(isCompanyProfile(demoCompany)).toBe(true);
    expect(isCompanyProfile({ name: 'x' })).toBe(false);
    expect(isCompanyProfile(null)).toBe(false);
    expect(isAnalysisSession({ tender: {}, reviews: {}, asOf: 'yesterday' })).toBe(false);
  });
});

describe('storage fallback (boundary case E)', () => {
  it('works without a browser storage implementation', () => {
    expect(isStorageAvailable()).toBe(false);
    expect(writeJson('k', 1)).toBe(false);
    expect(readJson('k', (v): v is number => typeof v === 'number')).toBeNull();
  });
});

describe('feedback export', () => {
  it('produces CSV with BOM, escapes quotes and neutralises formula injection', () => {
    const csv = toCsv([{ id: '1', comments: '=HYPERLINK("x")', suggestions: 'Түсінікті, "жақсы"' }]);
    expect(csv.startsWith('﻿id,')).toBe(true);
    expect(csv).toContain(`"'=HYPERLINK(""x"")"`);
    expect(csv).toContain('"Түсінікті, ""жақсы"""');
  });
  it('participant codes are P01–P99', () => {
    expect(PARTICIPANT_CODE.test('P01')).toBe(true);
    expect(PARTICIPANT_CODE.test('P00')).toBe(false);
    expect(PARTICIPANT_CODE.test('Aida')).toBe(false);
  });
});

describe('deployment files', () => {
  it('config files have no UTF-8 BOM (Vercel cannot parse package.json with a BOM)', async () => {
    const { readFileSync } = await import('node:fs');
    for (const f of ['package.json', 'package-lock.json', 'vercel.json', 'tsconfig.json', 'tsconfig.app.json', 'tsconfig.node.json']) {
      const bytes = readFileSync(new URL(`../../${f}`, import.meta.url));
      expect(bytes[0] === 0xef && bytes[1] === 0xbb && bytes[2] === 0xbf, f).toBe(false);
      // tsconfig files may contain comments (JSONC); the others must be strict JSON.
      if (!f.startsWith('tsconfig')) expect(() => JSON.parse(bytes.toString('utf8')), f).not.toThrow();
    }
  });
});

describe('dates', () => {
  it('validates real dates and formats them', () => {
    expect(isValidIsoDate('2024-02-29')).toBe(true);
    expect(isValidIsoDate('2025-02-29')).toBe(false);
    expect(formatDate('2025-06-30')).toBe('30.06.2025');
    expect(daysBetween('2026-11-12', '2026-11-13')).toBe(1);
  });
});
