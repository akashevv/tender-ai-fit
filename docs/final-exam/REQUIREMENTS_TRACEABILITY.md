# Requirements Traceability — Final Exam Component 2 (Functional bilingual MVP, 40 marks)

Legend: ✅ implemented and tested · 🟡 implemented, needs a manual team action · ❌ not done (blocker stated)

## A. Minimum acceptance criteria

| # | Official criterion | Implementation | Automated test / evidence | Status |
|---|---|---|---|---|
| A1 | Working end-to-end core journey | Profile → Select Tender → Analysis → Review → Report → Export → Feedback | `e2e/journey.spec.ts` (all), `e2e/bilingual.spec.ts` "complete core journey in Kazakh" | ✅ |
| A2 | English and Kazakh for navigation, instructions, errors, core journey | `src/i18n/translations.ts`, header switcher, persisted choice, `lang` attribute | `tests/unit/i18n.test.ts`; `e2e/bilingual.spec.ts` (3 tests) | ✅ (🟡 native-speaker review) |
| A3 | Documented feature-prioritisation method | MoSCoW | `FEATURE_PRIORITISATION.md` | ✅ |
| A4 | Testing with ≥ 5 relevant users (task, observation, result, consent-safe evidence) | Protocol, task script, consent text, P01–P05 templates, feedback form with participant code + CSV export | `USER_TESTING_PROTOCOL.md`, `e2e/resilience.spec.ts` "feedback" | ❌ **Sessions not yet run** — needs 5 real participants |
| A5 | ≥ 3 implemented changes linked to testing, customer evidence, risk analysis or technical findings | C1–C12 linked to Assignment 3 interviews and technical/test findings | `MVP_CHANGELOG.md` | ✅ (add user-test-linked changes after A4) |
| A6 | ≥ 1 non-ideal / boundary case | Expired certificate; incomplete profile; unsupported/corrupt/empty/oversized file; missing file; empty states; blocked/corrupt storage; 404 | `tests/unit/*`, `e2e/journey.spec.ts` "boundary case A", `e2e/resilience.spec.ts` | ✅ |
| A7 | Technical overview (platform, architecture, storage, integrations, dependencies, deployment, limitations) | | `MVP_TECHNICAL_OVERVIEW.md` | ✅ |
| A8 | Privacy, security, accessibility, safe failure | Local-only storage + delete-all, CSP & security headers, input validation, CSV injection guard, error boundary, skip link, focus, labels, lang, non-colour statuses | `e2e/resilience.spec.ts`, `e2e/responsive.spec.ts`, `tests/unit/validation.test.ts` | ✅ |
| A9 | Live link, test credentials (if needed), backup recording | No login needed. Vercel config ready | `DEPLOYMENT_GUIDE.md` | 🟡 Team must redeploy this version and record backup video |

## B. Marking criteria

| Criterion (marks) | What we can show | Evidence |
|---|---|---|
| Functionality & core journey (16) | Data-driven analysis; profile edits change results; human review; export; feedback | 47 unit + 24 browser tests passing; `MVP_DEMO_SCRIPT.md` |
| Usability, bilingual, accessibility (7) | Same journey in EN and KZ; switching keeps work; tested at 4 widths; keyboard and screen-reader basics | `e2e/bilingual.spec.ts`, `e2e/responsive.spec.ts` |
| Testing & evidence-linked iteration (8) | Automated tests; 12 traceable changes; user-testing protocol | `MVP_CHANGELOG.md`; **real user tests missing** |
| Problem–solution fit & feasibility (5) | Evidence-first checklist matches A3 findings (H2, H3, H5); static, free, maintainable stack for 3 students | `FEATURE_PRIORITISATION.md`, `MVP_TECHNICAL_OVERVIEW.md` |
| Responsible design & resilience (4) | Honest "not AI" labels; illustrative readiness; local data; no PDF upload; failure states | Privacy page; `e2e/resilience.spec.ts` |

## C. Prompt-level requirements (team brief) not fully met

| Item | Reason |
|---|---|
| Five real user tests and retests | Requires real participants — cannot be produced by the development work |
| Human review of Kazakh text | Requires a competent Kazakh speaker |
| Deployment to production | No Vercel/GitHub access in this environment; guide provided |
| Arbitrary PDF requirement extraction | Deliberately not implemented (accuracy/privacy); documented as Could/Won't |
