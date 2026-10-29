import type { AnalysisResult, Tender } from '../context/AppContext';
import { demoCompany } from '../data/demoCompany';

/** Deterministic DEMO rules, never an AI assessment of a real PDF. */
export function createAssessment(tender: Tender): AnalysisResult[] {
  if (tender.mode === 'manual') {
    return tender.requirements.map((req) => ({
      requirementId: req.id,
      status: 'UNCLEAR',
      explanation: 'This requirement was entered manually. No automated PDF reading or company-evidence verification has been performed. Please check the tender and attach evidence outside this demo.',
      source: 'Manually entered requirement — verify against your original PDF',
    }));
  }

  return tender.requirements.map((req): AnalysisResult => {
    switch (req.id) {
      case 1: {
        const license = demoCompany.licenses[0];
        return {
          requirementId: req.id,
          status: 'MET',
          evidence: license.file,
          explanation: `The fictional company profile lists a construction license valid until ${license.expires}. This is sample metadata, not a verified file.`,
          source: 'Fictional sample tender, Section 2.1',
        };
      }
      case 2: {
        const certificate = demoCompany.certificates[0];
        return {
          requirementId: req.id,
          status: 'MISSING',
          evidence: certificate.file,
          explanation: `The listed ISO certificate expired on ${certificate.expires}; no current certificate is available in the demo profile. Renewal or replacement is needed.`,
          source: 'Fictional sample tender, Section 2.2',
        };
      }
      case 3:
        return {
          requirementId: req.id,
          status: 'UNCLEAR',
          explanation: `${demoCompany.projects.length} sample project entries exist, but their similarity and supporting documents have not been verified. Human review is required.`,
          source: 'Fictional sample tender, Section 2.3',
        };
      case 4: {
        const engineer = demoCompany.personnel[0];
        return {
          requirementId: req.id,
          status: 'MET',
          evidence: engineer.evidence,
          explanation: `The fictional profile includes a qualification record for ${engineer.name}. This is demo evidence, not a checked original.`,
          source: 'Fictional sample tender, Section 2.4',
        };
      }
      case 5:
        return {
          requirementId: req.id,
          status: 'MISSING',
          explanation: 'The fictional profile contains no audited financial statement.',
          source: 'Fictional sample tender, Section 2.5',
        };
      default:
        return {
          requirementId: req.id,
          status: 'UNCLEAR',
          explanation: 'No sample comparison rule is available. A procurement specialist must verify this item.',
          source: 'Demo tender — source needs manual verification',
        };
    }
  });
}
