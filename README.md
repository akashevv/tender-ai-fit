# Tender AI Fit — Bilingual MVP (Final Exam)

A **bilingual (English / Қазақша) university MVP** that checks tender requirements against a company profile and shows, for every requirement, whether evidence is **Met**, **Missing** or **Unclear** — with the evidence, an explanation, the tender reference and a next step.

Technological Entrepreneurship · Astana IT University · BDA-2402
Team: Akashev Bekarys · Bolatov Alisher · Kanapiya Yernur
Live: https://tender-ai-fit.vercel.app (redeploy this version — see `docs/final-exam/DEPLOYMENT_GUIDE.md`)

> Rule-based prototype, **not** an AI system. Company, tender and documents are fictional. Final eligibility and participation decisions must be verified by a qualified specialist.

## Quick start

Requires Node.js 22.12+.

```bash
npm ci
```

```bash
npm run dev
```

Checks: `npm run lint`, `npm run test` (unit), `npm run build`, `npm run test:e2e` (browser, uses Microsoft Edge on Windows), or `npm run test:all`.

## Core journey

Company Profile → Select Tender → Analysis & human review → Readiness Report → Download PDF → Feedback.
Original demo result (regression-tested): **5 requirements → 2 Met, 2 Missing, 1 Unclear, 40 % illustrative readiness** (MET ÷ total × 100).

## Documentation

| File | Content |
|---|---|
| `docs/final-exam/MVP_TECHNICAL_OVERVIEW.md` | Stack, architecture, data model, rules, storage, security, limitations |
| `docs/final-exam/FEATURE_AUDIT.md` | Audit of the previous MVP |
| `docs/final-exam/FEATURE_PRIORITISATION.md` | MoSCoW linked to customer evidence |
| `docs/final-exam/MVP_CHANGELOG.md` | Evidence-linked changes C1–C12 |
| `docs/final-exam/USER_TESTING_PROTOCOL.md` | 5-participant test plan, consent, templates P01–P05 |
| `docs/final-exam/MVP_DEMO_SCRIPT.md` | 2–3 minute live demo (EN + KZ lines) |
| `docs/final-exam/REQUIREMENTS_TRACEABILITY.md` | Final Exam criteria → implementation → tests |
| `docs/final-exam/DEPLOYMENT_GUIDE.md` | Install, build, deploy, production checklist, backup recording |
| `docs/final-exam/KAZAKH_TRANSLATION_REVIEW.md` | Bilingual glossary and items for human review |
| `docs/final-exam/FINAL_RUBRIC_AUDIT.md` | Honest score against the 40-mark rubric |

## Privacy

All data stays in the browser's localStorage. PDFs are checked locally and never uploaded or read. No analytics, no external APIs. *Data & Privacy* page → delete all local data.
