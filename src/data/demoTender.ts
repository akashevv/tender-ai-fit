import type { Tender } from '../context/AppContext';

// A fictional tender, not an official procurement announcement.
export const demoTender: Tender = {
  id: 1,
  name: 'Construction and Renovation Services — Astana 2026 (Demo)',
  mode: 'demo',
  requirements: [
    { id: 1, title: 'Valid Construction License', description: 'Section 2.1: A current construction license is required.' },
    { id: 2, title: 'ISO 9001 Certification', description: 'Section 2.2: A valid ISO 9001 quality management certificate is required.' },
    { id: 3, title: 'Three Similar Completed Projects', description: 'Section 2.3: Evidence of at least three projects similar in scope and size.' },
    { id: 4, title: 'Qualified Engineering Personnel', description: 'Section 2.4: Personnel with relevant engineering qualifications.' },
    { id: 5, title: 'Financial Statement', description: 'Section 2.5: Recent audited financial statements.' },
  ],
};
