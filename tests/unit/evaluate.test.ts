import { describe, expect, it } from 'vitest';
import { demoCompany, buildScenario } from '../../src/data/demoCompany';
import { demoTender } from '../../src/data/demoTender';
import { evaluateRequirement, evaluateTender, finalStatus, getProfileIssues, summarise } from '../../src/domain/evaluate';
import type { CompanyProfile, Requirement } from '../../src/domain/types';

const AS_OF = '2026-11-12';
const clone = (): CompanyProfile => structuredClone(demoCompany);
const req = (ruleId: Requirement['ruleId']) => demoTender.requirements.find((r) => r.ruleId === ruleId)!;
const statusOf = (p: CompanyProfile, ruleId: Requirement['ruleId'], asOf = AS_OF) => evaluateRequirement(req(ruleId), p, asOf).status;

describe('original Assignment 5 demo scenario (regression)', () => {
  const results = evaluateTender(demoTender, demoCompany, AS_OF);
  const summary = summarise(results.map((r) => r.status));

  it('has five requirements with exactly 2 MET, 2 MISSING and 1 UNCLEAR', () => {
    expect(summary).toEqual({ total: 5, met: 2, missing: 2, unclear: 1, readiness: 40 });
  });

  it('gives each requirement the documented status', () => {
    expect(results.map((r) => [r.ruleId, r.status])).toEqual([
      ['construction_license', 'MET'],
      ['iso9001', 'MISSING'],
      ['similar_projects', 'UNCLEAR'],
      ['engineering_personnel', 'MET'],
      ['audited_financials', 'MISSING'],
    ]);
  });

  it('rejects the expired ISO 9001 certificate and reports its expiry date', () => {
    const iso = results.find((r) => r.ruleId === 'iso9001')!;
    expect(iso.status).toBe('MISSING');
    expect(iso.reasonKey).toBe('reason.iso.expired');
    expect(iso.params.date).toBe('2025-06-30');
    expect(iso.evidence[0]).toMatchObject({ file: 'ISO9001_Expired_DEMO.pdf', rejected: true });
  });

  it('every result carries an explanation, a next step and (where applicable) evidence', () => {
    for (const r of results) {
      expect(r.reasonKey).toMatch(/^reason\./);
      expect(r.actionKey.length).toBeGreaterThan(0);
    }
    expect(results.find((r) => r.ruleId === 'construction_license')!.evidence).toHaveLength(1);
  });

  it('does not mutate the seed profile', () => {
    expect(demoCompany.certificates[0].expires).toBe('2025-06-30');
  });
});

describe('editing evidence changes the result', () => {
  it('renewing ISO 9001 turns MISSING into MET', () => {
    const p = clone();
    p.certificates[0].expires = '2028-01-31';
    expect(statusOf(p, 'iso9001')).toBe('MET');
  });

  it('an expired ISO certificate never counts even if a document name exists', () => {
    const p = clone();
    p.certificates[0].file = 'Totally_Valid_Looking.pdf';
    expect(statusOf(p, 'iso9001')).toBe('MISSING');
  });

  it('a certificate without an expiry date is UNCLEAR, not MET', () => {
    const p = clone();
    p.certificates[0].expires = '';
    expect(statusOf(p, 'iso9001')).toBe('UNCLEAR');
  });

  it('no certificate at all is MISSING', () => {
    const p = clone();
    p.certificates = [];
    expect(evaluateRequirement(req('iso9001'), p, AS_OF).reasonKey).toBe('reason.iso.none');
  });

  it('the licence becomes MISSING after it expires', () => {
    expect(statusOf(clone(), 'construction_license', '2029-01-01')).toBe('MISSING');
  });

  it('a licence that expires within 90 days is MET with a warning', () => {
    const r = evaluateRequirement(req('construction_license'), clone(), '2028-11-15');
    expect(r.status).toBe('MET');
    expect(r.reasonKey).toBe('reason.license.metExpiringSoon');
    expect(r.params.days).toBe(46);
  });

  it('a licence expiring exactly on the analysis date is still valid that day', () => {
    expect(statusOf(clone(), 'construction_license', '2028-12-31')).toBe('MET');
  });

  it('three documented and confirmed projects turn UNCLEAR into MET', () => {
    const p = clone();
    p.projects.forEach((x) => (x.scopeConfirmed = true));
    expect(statusOf(p, 'similar_projects')).toBe('MET');
  });

  it('confirmed scope without a completion document does not count', () => {
    const p = clone();
    p.projects.forEach((x) => (x.scopeConfirmed = true));
    p.projects[0].evidenceFile = '';
    expect(statusOf(p, 'similar_projects')).toBe('UNCLEAR');
  });

  it('fewer than three projects is MISSING', () => {
    const p = clone();
    p.projects = p.projects.slice(0, 2);
    expect(statusOf(p, 'similar_projects')).toBe('MISSING');
  });

  it('an engineer without a qualification document is UNCLEAR; no engineer is MISSING', () => {
    const p = clone();
    p.personnel[0].qualificationFile = '';
    expect(statusOf(p, 'engineering_personnel')).toBe('UNCLEAR');
    p.personnel = p.personnel.filter((x) => x.role !== 'civil_engineer');
    expect(statusOf(p, 'engineering_personnel')).toBe('MISSING');
  });

  it('a recent audited statement is MET; unaudited or old ones are UNCLEAR', () => {
    const p = clone();
    p.financialStatements = [{ id: 'f', year: 2025, audited: true, file: 'a.pdf' }];
    expect(statusOf(p, 'audited_financials')).toBe('MET');
    p.financialStatements = [{ id: 'f', year: 2025, audited: false, file: 'a.pdf' }];
    expect(statusOf(p, 'audited_financials')).toBe('UNCLEAR');
    p.financialStatements = [{ id: 'f', year: 2021, audited: true, file: 'a.pdf' }];
    expect(statusOf(p, 'audited_financials')).toBe('UNCLEAR');
  });
});

describe('scenarios and boundary cases', () => {
  it('renewed scenario: 4 MET, 0 MISSING, 1 UNCLEAR, 80%', () => {
    const s = summarise(evaluateTender(demoTender, buildScenario('renewed'), AS_OF).map((r) => r.status));
    expect(s).toEqual({ total: 5, met: 4, missing: 0, unclear: 1, readiness: 80 });
  });

  it('incomplete profile is flagged and never produces a positive result', () => {
    const p = buildScenario('incomplete');
    expect(getProfileIssues(p)).toEqual(['nameMissing', 'noEvidence']);
    const s = summarise(evaluateTender(demoTender, p, AS_OF).map((r) => r.status));
    expect(s.met).toBe(0);
    expect(s.readiness).toBe(0);
  });

  it('original profile has no blocking issues', () => {
    expect(getProfileIssues(demoCompany)).toEqual([]);
  });

  it('requirements without an automated rule are UNCLEAR', () => {
    const r = evaluateRequirement({ ...req('iso9001'), id: 'x', ruleId: 'manual_other' }, demoCompany, AS_OF);
    expect(r.status).toBe('UNCLEAR');
  });

  it('empty tender gives 0% instead of NaN', () => {
    expect(summarise([]).readiness).toBe(0);
  });

  it('a reviewer override changes the final status but not the automated one', () => {
    const r = evaluateRequirement(req('similar_projects'), demoCompany, AS_OF);
    expect(finalStatus(r, { note: 'Checked completion acts', reviewed: true, override: 'MET' })).toBe('MET');
    expect(finalStatus(r, undefined)).toBe('UNCLEAR');
  });
});
