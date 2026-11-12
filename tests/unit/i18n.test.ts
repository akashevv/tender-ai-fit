import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import { en, kk } from '../../src/i18n/translations';
import { hasKey, translate } from '../../src/i18n/core';
import { evaluateTender } from '../../src/domain/evaluate';
import { demoTender } from '../../src/data/demoTender';
import { buildScenario, demoCompany } from '../../src/data/demoCompany';
import type { CompanyProfile, RuleId } from '../../src/domain/types';

const placeholders = (s: string) => [...s.matchAll(/\{(\w+)\}/g)].map((m) => m[1]).sort();

describe('English / Kazakh dictionaries', () => {
  it('have the same keys', () => {
    expect(Object.keys(kk).sort()).toEqual(Object.keys(en).sort());
  });

  it('every Kazakh value is non-empty and uses the same {placeholders}', () => {
    for (const key of Object.keys(en) as (keyof typeof en)[]) {
      expect(kk[key].trim(), key).not.toBe('');
      expect(placeholders(kk[key]), key).toEqual(placeholders(en[key]));
    }
  });

  it('Kazakh text is actually translated (only proper names may be identical)', () => {
    const allowedSame = new Set(['app.name', 'lang.en', 'lang.kk']);
    const same = (Object.keys(en) as (keyof typeof en)[]).filter((k) => en[k] === kk[k] && !allowedSame.has(k));
    expect(same).toEqual([]);
  });

  it('contains the required procurement terms', () => {
    expect(kk['nav.profile']).toBe('Компания профилі');
    expect(kk['tender.requirementsList']).toBe('Тендер талаптары');
    expect(kk['tender.start']).toBe('Талдауды бастау');
    expect(kk['report.missingTitle']).toBe('Жетіспейтін талаптар');
    expect(kk['report.unclearTitle']).toBe('Тексеруді қажет етеді');
    expect(en['human.review']).toBe(
      'Tender AI Fit supports preliminary evaluation. Final eligibility and participation decisions must be verified by a qualified specialist.',
    );
  });

  it('formats {date} as DD.MM.YYYY and fills other params', () => {
    expect(translate('en', 'expiry.expired', { date: '2025-06-30' })).toBe('Expired on 30.06.2025');
    expect(translate('kk', 'expiry.expired', { date: '2025-06-30' })).toBe('Мерзімі 30.06.2025 өткен');
    expect(translate('kk', 'dash.requirements', { count: 5 })).toBe('5 талап');
  });
});

describe('every key used by the app exists', () => {
  it('all rule reason and action keys exist for many profile variants', () => {
    const variants: CompanyProfile[] = [demoCompany, buildScenario('renewed'), buildScenario('incomplete')];
    const p = structuredClone(demoCompany);
    p.certificates[0].expires = '';
    p.licenses[0].expires = '2026-12-01';
    p.personnel[0].qualificationFile = '';
    p.financialStatements = [{ id: 'f', year: 2020, audited: false, file: '' }];
    variants.push(p);
    const rules: RuleId[] = ['manual_other'];
    const tender = { ...demoTender, requirements: [...demoTender.requirements, { ...demoTender.requirements[0], id: 'm', ruleId: rules[0] }] };
    for (const v of variants) {
      for (const r of evaluateTender(tender, v, '2026-11-12')) {
        expect(hasKey(r.reasonKey), r.reasonKey).toBe(true);
        expect(hasKey(r.actionKey), r.actionKey).toBe(true);
        r.evidence.forEach((e) => e.labelKey && expect(hasKey(e.labelKey), e.labelKey).toBe(true));
      }
    }
  });

  it('every literal t("...") key in the source code exists', () => {
    const files: string[] = [];
    const walk = (dir: string) =>
      readdirSync(dir).forEach((f) => {
        const p = join(dir, f);
        if (statSync(p).isDirectory()) walk(p);
        else if (/\.(tsx?)$/.test(f)) files.push(p);
      });
    walk(join(__dirname, '../../src'));
    const missing: string[] = [];
    for (const f of files) {
      const src = readFileSync(f, 'utf8');
      for (const m of src.matchAll(/\bt\(\s*'([a-zA-Z0-9_.]+)'/g)) if (!hasKey(m[1])) missing.push(`${f}: ${m[1]}`);
      for (const m of src.matchAll(/(?:key|title|desc|label|text):\s*'([a-z]+\.[a-zA-Z0-9_.]+)'/g)) if (!hasKey(m[1])) missing.push(`${f}: ${m[1]}`);
    }
    expect(missing).toEqual([]);
  });

  it('dynamic status, role, rule and category keys exist', () => {
    for (const s of ['MET', 'MISSING', 'UNCLEAR']) {
      expect(hasKey(`status.${s}`)).toBe(true);
      expect(hasKey(`status.desc.${s}`)).toBe(true);
    }
    for (const r of ['civil_engineer', 'project_manager', 'other']) expect(hasKey(`role.${r}`)).toBe(true);
    for (const r of ['construction_license', 'iso9001', 'similar_projects', 'engineering_personnel', 'audited_financials', 'manual_other']) expect(hasKey(`rule.${r}`)).toBe(true);
    for (const c of ['construction', 'other']) expect(hasKey(`licenseCategory.${c}`)).toBe(true);
    for (const m of ['demo', 'manual']) expect(hasKey(`analysis.mode.${m}`)).toBe(true);
    for (const v of ['yes', 'with_help', 'no']) expect(hasKey(`feedback.task.${v}`)).toBe(true);
  });
});
