// Transparent, deterministic rule-based matching.
// This is NOT artificial intelligence: each status comes from a documented rule
// applied to the company profile on a given reference date ("asOf").
//
// Rules (also documented in docs/final-exam/MVP_TECHNICAL_OVERVIEW.md):
//  construction_license  MET      a construction licence with a document and an expiry date on/after asOf
//                        MISSING  no construction licence, or every one has expired
//                        UNCLEAR  a licence exists but its document or expiry date is not recorded
//  iso9001               same logic for an ISO 9001 certificate (an expired certificate never counts)
//  similar_projects      MET      >= 3 projects with a completion document AND specialist-confirmed similar scope
//                        UNCLEAR  >= 3 project entries, but fewer than 3 are documented and confirmed
//                        MISSING  fewer than 3 project entries
//  engineering_personnel MET      a civil engineer with a qualification document
//                        UNCLEAR  a civil engineer without a qualification document
//                        MISSING  no civil engineer
//  audited_financials    MET      an audited statement with a document for one of the last two years
//                        UNCLEAR  a statement exists but is unaudited, older, undated or has no document
//                        MISSING  no financial statement
//  manual_other          UNCLEAR  always: no automated rule exists, a specialist must check it
import type {
  CompanyProfile,
  EvaluationResult,
  EvidenceItem,
  Requirement,
  Review,
  Status,
  Tender,
} from './types';
import { daysBetween, isExpired, isValidIsoDate } from '../lib/dates';

export const REQUIRED_SIMILAR_PROJECTS = 3;
export const EXPIRY_WARNING_DAYS = 90;
export const FINANCIAL_RECENCY_YEARS = 2;

type Dated = { file: string; expires: string };

function checkDatedDocuments<T extends Dated>(
  items: T[],
  asOf: string,
  toEvidence: (item: T, rejected: boolean) => EvidenceItem,
  keyPrefix: string,
): Pick<EvaluationResult, 'status' | 'reasonKey' | 'actionKey' | 'params' | 'evidence'> {
  if (items.length === 0) {
    return { status: 'MISSING', reasonKey: `${keyPrefix}.none`, actionKey: `${keyPrefix}.action.obtain`, params: {}, evidence: [] };
  }
  const complete = items.filter((i) => i.file.trim() && isValidIsoDate(i.expires));
  const valid = complete.filter((i) => !isExpired(i.expires, asOf));
  if (valid.length > 0) {
    const best = [...valid].sort((a, b) => (a.expires < b.expires ? 1 : -1))[0];
    const daysLeft = daysBetween(asOf, best.expires);
    const soon = daysLeft <= EXPIRY_WARNING_DAYS;
    return {
      status: 'MET',
      reasonKey: soon ? `${keyPrefix}.metExpiringSoon` : `${keyPrefix}.met`,
      actionKey: soon ? `${keyPrefix}.action.renewSoon` : 'action.verifyOriginal',
      params: { file: best.file, date: best.expires, days: daysLeft },
      evidence: [toEvidence(best, false)],
    };
  }
  if (complete.length > 0) {
    const latest = [...complete].sort((a, b) => (a.expires < b.expires ? 1 : -1))[0];
    return {
      status: 'MISSING',
      reasonKey: `${keyPrefix}.expired`,
      actionKey: `${keyPrefix}.action.renew`,
      params: { file: latest.file, date: latest.expires },
      evidence: complete.map((i) => toEvidence(i, true)),
    };
  }
  return {
    status: 'UNCLEAR',
    reasonKey: `${keyPrefix}.incomplete`,
    actionKey: `${keyPrefix}.action.complete`,
    params: {},
    evidence: items.map((i) => toEvidence(i, true)),
  };
}

export function evaluateRequirement(
  requirement: Requirement,
  profile: CompanyProfile,
  asOf: string,
): EvaluationResult {
  const base = { requirementId: requirement.id, ruleId: requirement.ruleId };

  switch (requirement.ruleId) {
    case 'construction_license': {
      const licences = profile.licenses.filter((l) => l.category === 'construction');
      return {
        ...base,
        ...checkDatedDocuments(
          licences,
          asOf,
          (l, rejected) => ({
            kind: 'license',
            label: l.number,
            labelKey: 'licenseCategory.construction',
            file: l.file,
            date: l.expires,
            dateKind: 'expires',
            rejected,
          }),
          'reason.license',
        ),
      };
    }

    case 'iso9001': {
      const certs = profile.certificates.filter((c) => c.standard === 'ISO 9001');
      return {
        ...base,
        ...checkDatedDocuments(
          certs,
          asOf,
          (c, rejected) => ({
            kind: 'certificate',
            label: 'ISO 9001',
            file: c.file,
            date: c.expires,
            dateKind: 'expires',
            rejected,
          }),
          'reason.iso',
        ),
      };
    }

    case 'similar_projects': {
      const total = profile.projects.length;
      const confirmed = profile.projects.filter((p) => p.evidenceFile.trim() && p.scopeConfirmed);
      const evidence: EvidenceItem[] = profile.projects.map((p) => ({
        kind: 'project',
        label: p.title,
        file: p.evidenceFile,
        date: p.year ? String(p.year) : undefined,
        dateKind: 'year',
        rejected: !(p.evidenceFile.trim() && p.scopeConfirmed),
      }));
      const params = { total, confirmed: confirmed.length, required: REQUIRED_SIMILAR_PROJECTS };
      if (confirmed.length >= REQUIRED_SIMILAR_PROJECTS) {
        return { ...base, status: 'MET', reasonKey: 'reason.projects.met', actionKey: 'action.verifyOriginal', params, evidence };
      }
      if (total >= REQUIRED_SIMILAR_PROJECTS) {
        return { ...base, status: 'UNCLEAR', reasonKey: 'reason.projects.unconfirmed', actionKey: 'reason.projects.action.confirm', params, evidence };
      }
      return { ...base, status: 'MISSING', reasonKey: 'reason.projects.tooFew', actionKey: 'reason.projects.action.add', params, evidence };
    }

    case 'engineering_personnel': {
      const engineers = profile.personnel.filter((p) => p.role === 'civil_engineer');
      const documented = engineers.filter((p) => p.qualificationFile.trim());
      const toEvidence = (p: (typeof engineers)[number], rejected: boolean): EvidenceItem => ({
        kind: 'person',
        label: p.name,
        labelKey: 'role.civil_engineer',
        file: p.qualificationFile,
        rejected,
      });
      if (documented.length > 0) {
        return {
          ...base,
          status: 'MET',
          reasonKey: 'reason.personnel.met',
          actionKey: 'action.verifyOriginal',
          params: { name: documented[0].name, file: documented[0].qualificationFile },
          evidence: documented.map((p) => toEvidence(p, false)),
        };
      }
      if (engineers.length > 0) {
        return {
          ...base,
          status: 'UNCLEAR',
          reasonKey: 'reason.personnel.noDocument',
          actionKey: 'reason.personnel.action.document',
          params: { name: engineers[0].name },
          evidence: engineers.map((p) => toEvidence(p, true)),
        };
      }
      return { ...base, status: 'MISSING', reasonKey: 'reason.personnel.none', actionKey: 'reason.personnel.action.add', params: {}, evidence: [] };
    }

    case 'audited_financials': {
      const asOfYear = Number(asOf.slice(0, 4));
      const minYear = asOfYear - FINANCIAL_RECENCY_YEARS;
      const statements = profile.financialStatements;
      const toEvidence = (s: (typeof statements)[number], rejected: boolean): EvidenceItem => ({
        kind: 'financial',
        label: '',
        labelKey: s.audited ? 'financial.audited' : 'financial.unaudited',
        file: s.file,
        date: s.year ? String(s.year) : undefined,
        dateKind: 'year',
        rejected,
      });
      const ok = statements.filter((s) => s.audited && s.file.trim() && s.year !== null && s.year >= minYear && s.year <= asOfYear);
      if (ok.length > 0) {
        const best = [...ok].sort((a, b) => (b.year ?? 0) - (a.year ?? 0))[0];
        return {
          ...base,
          status: 'MET',
          reasonKey: 'reason.financial.met',
          actionKey: 'action.verifyOriginal',
          params: { year: best.year ?? '', file: best.file },
          evidence: [toEvidence(best, false)],
        };
      }
      if (statements.length > 0) {
        return {
          ...base,
          status: 'UNCLEAR',
          reasonKey: 'reason.financial.notQualifying',
          actionKey: 'reason.financial.action.audit',
          params: { minYear },
          evidence: statements.map((s) => toEvidence(s, true)),
        };
      }
      return { ...base, status: 'MISSING', reasonKey: 'reason.financial.none', actionKey: 'reason.financial.action.add', params: { minYear }, evidence: [] };
    }

    case 'manual_other':
    default:
      return { ...base, status: 'UNCLEAR', reasonKey: 'reason.manual', actionKey: 'action.manualCheck', params: {}, evidence: [] };
  }
}

export function evaluateTender(tender: Tender, profile: CompanyProfile, asOf: string): EvaluationResult[] {
  return tender.requirements.map((r) => evaluateRequirement(r, profile, asOf));
}

export type Summary = {
  total: number;
  met: number;
  missing: number;
  unclear: number;
  /** Illustrative readiness = MET ÷ total × 100, rounded. Not a win probability. */
  readiness: number;
};

export function summarise(statuses: Status[]): Summary {
  const total = statuses.length;
  const met = statuses.filter((s) => s === 'MET').length;
  const missing = statuses.filter((s) => s === 'MISSING').length;
  const unclear = statuses.filter((s) => s === 'UNCLEAR').length;
  return { total, met, missing, unclear, readiness: total > 0 ? Math.round((met / total) * 100) : 0 };
}

/** Status after human review: a reviewer override (with a note) wins over the automated status. */
export function finalStatus(result: EvaluationResult, review?: Review): Status {
  return review?.override ?? result.status;
}

export type ProfileIssue = 'nameMissing' | 'noEvidence';

/** Boundary case A: incomplete company data. 'nameMissing' blocks the analysis. */
export function getProfileIssues(profile: CompanyProfile): ProfileIssue[] {
  const issues: ProfileIssue[] = [];
  if (!profile.name.trim()) issues.push('nameMissing');
  const evidenceCount =
    profile.licenses.length +
    profile.certificates.length +
    profile.projects.length +
    profile.personnel.length +
    profile.financialStatements.length;
  if (evidenceCount === 0) issues.push('noEvidence');
  return issues;
}
