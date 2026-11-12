import type { Tender } from '../domain/types';

// A fictional tender, not an official procurement announcement.
export const demoTender: Tender = {
  id: 'demo-astana-2026-001',
  code: 'DEMO-ASTANA-2026-001',
  mode: 'demo',
  name: {
    en: 'Construction and Renovation Services — Astana 2026 (Demo)',
    kk: 'Құрылыс және жөндеу қызметтері — Астана 2026 (демо)',
  },
  requirements: [
    {
      id: 'req-1',
      ruleId: 'construction_license',
      reference: { en: 'Section 2.1', kk: '2.1-бөлім' },
      title: { en: 'Valid construction licence', kk: 'Жарамды құрылыс лицензиясы' },
      description: {
        en: 'The supplier must hold a current construction licence.',
        kk: 'Өнім беруші қолданыстағы құрылыс лицензиясына ие болуы тиіс.',
      },
    },
    {
      id: 'req-2',
      ruleId: 'iso9001',
      reference: { en: 'Section 2.2', kk: '2.2-бөлім' },
      title: { en: 'ISO 9001 certification', kk: 'ISO 9001 сертификаты' },
      description: {
        en: 'A valid ISO 9001 quality management certificate is required.',
        kk: 'Жарамды ISO 9001 сапа менеджменті сертификаты қажет.',
      },
    },
    {
      id: 'req-3',
      ruleId: 'similar_projects',
      reference: { en: 'Section 2.3', kk: '2.3-бөлім' },
      title: { en: 'Three similar completed projects', kk: 'Аяқталған үш ұқсас жоба' },
      description: {
        en: 'Evidence of at least three completed projects similar in scope and size.',
        kk: 'Көлемі мен ауқымы ұқсас кемінде үш аяқталған жобаның дәлелі.',
      },
    },
    {
      id: 'req-4',
      ruleId: 'engineering_personnel',
      reference: { en: 'Section 2.4', kk: '2.4-бөлім' },
      title: { en: 'Qualified engineering personnel', kk: 'Білікті инженерлік персонал' },
      description: {
        en: 'At least one civil engineer with a documented qualification.',
        kk: 'Біліктілігі құжатпен расталған кемінде бір құрылыс инженері.',
      },
    },
    {
      id: 'req-5',
      ruleId: 'audited_financials',
      reference: { en: 'Section 2.5', kk: '2.5-бөлім' },
      title: { en: 'Audited financial statement', kk: 'Аудиттелген қаржылық есептілік' },
      description: {
        en: 'Audited financial statements for one of the last two financial years.',
        kk: 'Соңғы екі қаржы жылының біріне арналған аудиттелген қаржылық есептілік.',
      },
    },
  ],
};
