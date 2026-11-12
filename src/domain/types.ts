// Core data model for the Tender AI Fit demo.
// Everything here is plain data so that it can be stored in the browser,
// tested without a UI and explained during the defence.

export type Lang = 'en' | 'kk';

/** Text that is either user-entered (plain string) or a bilingual seed value. */
export type LocalizedText = string | { en: string; kk: string };

export type Status = 'MET' | 'MISSING' | 'UNCLEAR';

export type LicenseCategory = 'construction' | 'other';
export type CertificateStandard = 'ISO 9001' | 'ISO 14001' | 'ISO 45001' | 'other';
export type PersonRole = 'civil_engineer' | 'project_manager' | 'other';

export type License = {
  id: string;
  category: LicenseCategory;
  number: string;
  /** Name of the supporting document (reference only, the file is not stored). */
  file: string;
  /** YYYY-MM-DD or empty when unknown. */
  expires: string;
};

export type Certificate = {
  id: string;
  standard: CertificateStandard;
  file: string;
  expires: string;
};

export type Project = {
  id: string;
  title: LocalizedText;
  year: number | null;
  /** Completion act / reference letter document name. */
  evidenceFile: string;
  /** A specialist has confirmed the project is similar in scope and size. */
  scopeConfirmed: boolean;
};

export type Person = {
  id: string;
  name: string;
  role: PersonRole;
  qualificationFile: string;
};

export type FinancialStatement = {
  id: string;
  year: number | null;
  audited: boolean;
  file: string;
};

export type CompanyProfile = {
  name: string;
  industry: LocalizedText;
  description: LocalizedText;
  yearsExperience: number | null;
  licenses: License[];
  certificates: Certificate[];
  projects: Project[];
  personnel: Person[];
  financialStatements: FinancialStatement[];
};

/** Deterministic, documented matching rules (see docs/final-exam/MVP_TECHNICAL_OVERVIEW.md). */
export type RuleId =
  | 'construction_license'
  | 'iso9001'
  | 'similar_projects'
  | 'engineering_personnel'
  | 'audited_financials'
  | 'manual_other';

export type Requirement = {
  id: string;
  ruleId: RuleId;
  /** Reference to the place in the tender document, e.g. "Section 2.1". */
  reference: LocalizedText;
  title: LocalizedText;
  description: LocalizedText;
};

export type Tender = {
  id: string;
  code: string;
  mode: 'demo' | 'manual';
  name: LocalizedText;
  /** For manual tenders: the name of the PDF the user selected (never uploaded). */
  sourceFile?: string;
  requirements: Requirement[];
};

export type EvidenceKind = 'license' | 'certificate' | 'project' | 'person' | 'financial';

export type EvidenceItem = {
  kind: EvidenceKind;
  /** Display label: either user/seed text or an i18n key plus a suffix. */
  label: LocalizedText;
  labelKey?: string;
  file: string;
  date?: string;
  dateKind?: 'expires' | 'year';
  /** True when this item exists but does not satisfy the rule (e.g. expired). */
  rejected?: boolean;
};

/** Output of one rule. All human-readable text is referenced through i18n keys. */
export type EvaluationResult = {
  requirementId: string;
  ruleId: RuleId;
  status: Status;
  /** i18n key explaining the status. */
  reasonKey: string;
  /** i18n key for the suggested next step. */
  actionKey: string;
  params: Record<string, string | number>;
  evidence: EvidenceItem[];
};

export type Review = {
  note: string;
  override?: Status;
  reviewed: boolean;
};

export type AnalysisSession = {
  tender: Tender;
  /** Date (YYYY-MM-DD) used to decide whether documents are still valid. */
  asOf: string;
  startedAt: string;
  reviews: Record<string, Review>;
  /** Set when a reviewer confirms that every item was looked at. Not a legal verification. */
  reviewerConfirmedAt?: string;
};

export type FeedbackEntry = {
  id: string;
  participantCode: string;
  language: Lang;
  taskCompleted: 'yes' | 'with_help' | 'no';
  usefulness: number;
  easeOfUse: number;
  statusClarity: number;
  trust: number;
  comments: string;
  suggestions: string;
  submittedAt: string;
};
