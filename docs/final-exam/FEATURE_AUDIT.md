# Phase 1 — Feature Audit of the Assignment 5 MVP (before this iteration)

Source inspected: `Tender_AI_Fit_Fixed_MVP.zip` (React 19 + Vite 8 + TypeScript + Tailwind 4, npm, deployed on Vercel).
Baseline checks on 12.11.2026: `tsc -b` passed, `vite build` passed, `oxlint` 1 warning. No automated tests existed.

## Existing and working

| Feature | Notes |
|---|---|
| Routing between Home, Dashboard, Profile, Upload, Analysis, Results, Feedback | React Router, `vercel.json` SPA rewrite |
| Demo tender with 5 requirements, 2 MET / 2 MISSING / 1 UNCLEAR / 40 % | Correct values for the demo data |
| Expandable requirement cards with source and explanation | |
| Reviewer note + status override requiring a note, "reviewed" flag | In memory only |
| Print / Save PDF button (`window.print`) | Printed the screen layout |
| Feedback form saved to `localStorage` | |
| PDF selection with extension/size check and drag-and-drop | File not parsed (honestly disclosed) |
| Disclaimers: demo, not AI, human decision | |

## Existing but incomplete or defective

| Issue | Evidence | Fixed in |
|---|---|---|
| Statuses hard-coded per requirement **id** (`switch (req.id)`), not computed from data: the licence was always MET even if expired; changing the profile could not change results | `src/utils/assessment.ts` | C1 |
| Company profile read-only | `CompanyProfile.tsx` used `useState(demoCompany)` without setter | C3 |
| Analysis lost on page refresh | state only in React context | C3 |
| "Risks" section hard-coded "ISO expired in June 2025" for every demo run | `ResultsDashboard.tsx` | C2 |
| Feedback page crashed if storage was blocked or contained invalid JSON (`JSON.parse(localStorage.getItem(...))` without try/catch) | `FeedbackPage.tsx` | C7 |
| A text file renamed to `.pdf` was accepted as a PDF | `TenderUpload.tsx` checked only name/MIME | C9 |
| Printed report had no company name, analysis date or reviewer status; nav/footer partly printed | `index.css` print rules | C2 |
| `<html lang="en">` fixed; no skip link; no visible focus style; labels on feedback selects not associated with inputs | | C6, C8 |
| Feedback could not be exported; no participant code; no consent | | C10 |
| Title in `index.html` contained a mis-encoded dash | | fixed |

## Missing and required by the Final Exam

| Requirement | Status after this iteration |
|---|---|
| English + Kazakh for navigation, instructions, errors and core journey | Implemented (C6) |
| Boundary / non-ideal cases | Incomplete profile, expired certificate, invalid files, empty states, blocked/corrupt storage (C1, C7, C9, C11) |
| Feature prioritisation | `FEATURE_PRIORITISATION.md` |
| Testing with ≥ 5 users | **Not done** — protocol and templates prepared (`USER_TESTING_PROTOCOL.md`) |
| ≥ 3 evidence-linked changes | `MVP_CHANGELOG.md` (linked to Assignment 3 interviews and technical findings) |
| Technical overview | `MVP_TECHNICAL_OVERVIEW.md` |
| Privacy, security, accessibility, safe failure | Privacy page, CSP, validation, accessibility fixes |
| Live link + backup recording | Redeploy + record (manual team actions) |
