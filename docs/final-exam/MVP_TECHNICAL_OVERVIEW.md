# Tender AI Fit — MVP Technical Overview

Team: Akashev Bekarys · Bolatov Alisher · Kanapiya Yernur · BDA-2402 · Astana IT University
Live URL (current deployment): https://tender-ai-fit.vercel.app — redeploy this version before the defence (see `DEPLOYMENT_GUIDE.md`).

## 1. What the MVP does

Core journey: **Company Profile → Select Tender → Analyse Requirements → Evidence Matching → Readiness Report → Human Review → Export / Feedback**.

The MVP compares tender requirements with a reusable company profile and gives each requirement one of three statuses:

| Status | Meaning |
|---|---|
| **MET** | Sufficient relevant evidence exists (e.g. a licence that is valid on the analysis date). |
| **MISSING** | Required evidence is absent or invalid (e.g. an expired ISO 9001 certificate). |
| **UNCLEAR** | Evidence is insufficient for a reliable automated conclusion; a specialist must review. |

**It is not an AI system.** Statuses come from deterministic, documented rules (section 5). The final eligibility and participation decision stays with a qualified specialist.

## 2. Technology stack

| Layer | Choice | Why |
|---|---|---|
| UI | React 19 + TypeScript, React Router 7 | Existing stack of the Assignment 5 MVP; kept to avoid a rewrite. |
| Styling | Tailwind CSS 4 | Existing; utility classes keep the bundle small (≈ 37 kB CSS). |
| Icons | lucide-react | Existing; meaningful icons next to every status. |
| Build | Vite 8 | Existing; static output in `dist/`. |
| Unit tests | Vitest 5 | Added; tests the rule engine, translations, validation without a browser. |
| Browser tests | Playwright 1.65 (Microsoft Edge channel) | Added; tests the full journey in both languages. |
| Lint | oxlint | Existing. |
| Hosting | Vercel (static) | Existing; free tier, SPA rewrites in `vercel.json`. |

No backend, database, paid service, analytics or AI API is used.

## 3. Architecture

```
index.html → src/main.tsx
  I18nProvider (src/i18n)        language state, t(), lang attribute, persisted choice
    AppProvider (src/context)    profile, analysis session, reviews, storage status
      BrowserRouter → App.tsx    header, language switcher, routes, footer, error boundary
        pages/                   Landing, Dashboard, CompanyProfile, TenderUpload (Select Tender),
                                 TenderAnalysis, ResultsDashboard (Report), Feedback, Privacy, NotFound
src/domain/   types.ts           data model
              evaluate.ts        rule engine (pure functions, no UI)
              validation.ts      profile / file / manual-requirement validation, stored-data guards
src/data/     demoCompany.ts     fictional Astana Build Solutions LLP + 3 scenarios
              demoTender.ts      fictional tender DEMO-ASTANA-2026-001 (5 requirements)
src/lib/      storage.ts         safe localStorage wrapper (never throws)
              dates.ts, feedback.ts (CSV/JSON export)
src/i18n/     translations.ts    English + Kazakh dictionaries (≈ 330 keys each)
```

**Key design decision:** results are never stored or hard-coded. `AppProvider` recomputes `evaluateTender(tender, profile, asOf)` whenever the profile changes, so editing evidence immediately changes the analysis. Only the reviewer's notes, overrides and "reviewed" flags are stored.

Rule output contains i18n **keys** and parameters (not sentences), so the same analysis renders in English or Kazakh and switching language never loses work.

## 4. Data model (simplified)

```ts
CompanyProfile { name, industry, description, yearsExperience,
  licenses[{category, number, file, expires}], certificates[{standard, file, expires}],
  projects[{title, year, evidenceFile, scopeConfirmed}], personnel[{name, role, qualificationFile}],
  financialStatements[{year, audited, file}] }
Tender { id, code, mode: 'demo'|'manual', name, requirements[{id, ruleId, reference, title, description}] }
EvaluationResult { requirementId, ruleId, status, reasonKey, actionKey, params, evidence[] }
AnalysisSession { tender, asOf (YYYY-MM-DD), startedAt, reviews{[reqId]: {note, override?, reviewed}}, reviewerConfirmedAt? }
FeedbackEntry { participantCode, language, taskCompleted, usefulness, easeOfUse, statusClarity, trust, comments, suggestions, submittedAt }
```

"File" fields are document **names** used as references. No document content is stored.

## 5. Matching rules (`src/domain/evaluate.ts`)

`asOf` = the date the analysis was started. A document expiring on `asOf` is still valid that day.

| Rule | MET | UNCLEAR | MISSING |
|---|---|---|---|
| `construction_license` | construction licence with document name and expiry ≥ asOf (warning if ≤ 90 days left) | licence listed without document or expiry date | none, or all expired |
| `iso9001` | ISO 9001 certificate with document and expiry ≥ asOf | certificate without document or expiry date | none, or all expired — **an expired certificate never counts** |
| `similar_projects` (≥ 3) | ≥ 3 projects with completion document **and** specialist-confirmed similar scope | ≥ 3 entries but < 3 documented + confirmed | < 3 entries |
| `engineering_personnel` | civil engineer with qualification document | civil engineer without document | no civil engineer |
| `audited_financials` | audited statement with document for year ≥ asOf year − 2 | a statement exists but is unaudited, older or undocumented | no statement |
| `manual_other` | — | always (no automated rule) | — |

**Illustrative readiness** = MET ÷ total × 100, rounded. It is not a win probability, not legal eligibility, not a contract award likelihood. If a reviewer overrides a status, the report shows both the automated value and the value "after specialist review".

Regression values (fixed date 12.11.2026, original data): **5 requirements → 2 MET, 2 MISSING, 1 UNCLEAR, 40 %** (`tests/unit/evaluate.test.ts`, `e2e/journey.spec.ts`).

## 6. Storage

| Data | Where | Key |
|---|---|---|
| Language | browser localStorage | `taf_lang` |
| Company profile | browser localStorage | `taf_profile_v2` |
| Analysis + reviewer notes | browser localStorage | `taf_analysis_v2` |
| Feedback responses | browser localStorage | `taf_feedback` |

Everything stays in the user's browser. If storage is blocked (private mode, policy) the app shows a warning and keeps working in memory. Corrupted stored data is validated and replaced by the demo data. **Data & Privacy** page → *Delete all local data* removes every key.

## 7. Integrations and dependencies

- No external API, no AI service, no analytics, no fonts or scripts from third-party CDNs.
- Runtime dependencies: `react`, `react-dom`, `react-router-dom`, `lucide-react`, `@tailwindcss/postcss`.
- Dev dependencies added in this iteration: `vitest`, `@playwright/test` (tests only, not shipped).

## 8. PDF handling (honest scope)

- The user can select their own tender PDF. The browser checks **locally**: extension and MIME type, empty file, > 20 MB, `%PDF-` signature and `%%EOF` end marker (detects renamed or truncated files).
- The PDF is **not uploaded, not stored and not read**. No text extraction or OCR is performed.
- The user types each requirement and chooses which rule applies; requirements without a rule are UNCLEAR.
- The predefined demo tender is the fully supported path.

## 9. Security and privacy

- No secrets or API keys exist; `.env*` files are git-ignored.
- React escapes all text; no `dangerouslySetInnerHTML`, `eval` or HTML injection.
- Inputs are length-limited and validated (dates, years, participant code `P01–P99`).
- CSV export prefixes cells starting with `= + - @` to prevent spreadsheet formula injection; UTF-8 BOM keeps Kazakh text readable in Excel.
- `vercel.json` sends a strict Content-Security-Policy (`script-src 'self'`, no third-party origins), `X-Frame-Options: DENY`, `nosniff`, `Referrer-Policy`, `Permissions-Policy`. `vite preview` uses the same headers, so the e2e tests run under the production CSP.
- Feedback form asks not to enter names; participant codes only; consent checkbox required.

## 10. Accessibility

Semantic headings, labelled inputs, `fieldset/legend` for groups, `aria-expanded`/`aria-pressed`, `role="alert"` for errors, skip link, visible focus outline, focus moved to `<main>` on navigation, `lang="en"`/`lang="kk"` on `<html>`, statuses always icon + text (never colour only), status text colours ≥ 4.5:1 contrast, reduced-motion support, responsive at 390 / 768 / 1024 / 1440 px (tested).

## 11. Deployment

Static build (`npm run build` → `dist/`) on Vercel. See `DEPLOYMENT_GUIDE.md`.

## 12. Known limitations

1. Demo company, tender and document names are fictional; documents are not verified against originals.
2. Only five requirement types have automated rules.
3. No PDF text extraction; own tenders require manual entry of requirements.
4. Data is per-browser; no accounts, no sync, no multi-company workspace (consultant need R5 is not covered).
5. "Similar scope" of a project is a human judgement recorded as a checkbox, not computed.
6. Kazakh translation was drafted with AI assistance and **requires review by a competent Kazakh speaker** (`KAZAKH_TRANSLATION_REVIEW.md`).
7. Real usability testing with five participants has **not yet been performed** (templates are ready in `USER_TESTING_PROTOCOL.md`).
