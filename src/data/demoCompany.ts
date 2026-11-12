import type { CompanyProfile } from '../domain/types';

// Fictitious records for the university demo (Assignment 5 scenario).
// File names are references only: no real documents are stored or verified.
export const demoCompany: CompanyProfile = {
  name: 'Astana Build Solutions LLP',
  industry: { en: 'Construction and engineering', kk: 'Құрылыс және инжиниринг' },
  description: {
    en: 'Fictional Kazakhstan-based contractor used to demonstrate evidence checking.',
    kk: 'Дәлелдерді тексеруді көрсетуге арналған Қазақстандағы ойдан құрастырылған мердігер компания.',
  },
  yearsExperience: 6,
  licenses: [
    {
      id: 'lic-1',
      category: 'construction',
      number: 'DEMO-KZ-0001',
      file: 'Construction_License_2026_DEMO.pdf',
      expires: '2028-12-31',
    },
  ],
  certificates: [
    { id: 'cert-1', standard: 'ISO 9001', file: 'ISO9001_Expired_DEMO.pdf', expires: '2025-06-30' },
  ],
  projects: [
    {
      id: 'prj-1',
      title: { en: 'Municipal building renovation', kk: 'Муниципалдық ғимаратты жөндеу' },
      year: 2023,
      evidenceFile: 'Completion_Act_Municipal_2023_DEMO.pdf',
      scopeConfirmed: false,
    },
    {
      id: 'prj-2',
      title: { en: 'Road bridge repair', kk: 'Автомобиль көпірін жөндеу' },
      year: 2024,
      evidenceFile: 'Completion_Act_Bridge_2024_DEMO.pdf',
      scopeConfirmed: false,
    },
    {
      id: 'prj-3',
      title: { en: 'School campus construction', kk: 'Мектеп кампусының құрылысы' },
      year: 2022,
      evidenceFile: 'Completion_Act_School_2022_DEMO.pdf',
      scopeConfirmed: false,
    },
  ],
  personnel: [
    {
      id: 'per-1',
      name: 'Aida Sarsembayeva (Demo)',
      role: 'civil_engineer',
      qualificationFile: 'Engineering_Qualification_DEMO.pdf',
    },
    {
      id: 'per-2',
      name: 'Arman T. (Demo)',
      role: 'project_manager',
      qualificationFile: 'Project_Manager_Experience_DEMO.pdf',
    },
  ],
  financialStatements: [],
};

export type ScenarioId = 'original' | 'renewed' | 'incomplete';

/** Ready-made scenarios that make boundary cases easy to show during the defence. */
export function buildScenario(id: ScenarioId): CompanyProfile {
  const base: CompanyProfile = structuredClone(demoCompany);
  if (id === 'renewed') {
    base.certificates = [
      { id: 'cert-2', standard: 'ISO 9001', file: 'ISO9001_Renewed_2026_DEMO.pdf', expires: '2029-06-30' },
    ];
    base.financialStatements = [
      { id: 'fin-1', year: 2025, audited: true, file: 'Audited_Financial_Statement_2025_DEMO.pdf' },
    ];
  }
  if (id === 'incomplete') {
    base.name = '';
    base.licenses = [];
    base.certificates = [];
    base.projects = [];
    base.personnel = [];
    base.financialStatements = [];
  }
  return base;
}
