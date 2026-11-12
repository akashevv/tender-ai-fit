# Strict Self-Assessment — Functional Bilingual MVP (40 marks)

Date: 12.11.2026. Based only on what was implemented **and** tested in this repository. Points are not awarded for untested or missing work.

| Criterion | Max | Now | Reasoning | What raises the score |
|---|---|---|---|---|
| Functionality and core journey | 16 | **14** | Full journey works end-to-end and is data-driven (profile edits change results; 47 unit + 24 browser tests pass, no console errors). Deductions: fictional data only; own-tender path needs manual requirement entry; not yet verified on the live production URL. | Redeploy and run the production checklist; demo without errors. |
| Usability, bilingual experience, accessibility | 7 | **5** | Same tasks in EN and KZ (tested), language persists, switching keeps work, responsive at 4 widths, keyboard/labels/lang/non-colour statuses. Deductions: Kazakh text not yet reviewed by a competent speaker; no usability evidence from real users; no screen-reader test. | Kazakh review; 5 user tests incl. ≥ 2 in Kazakh. |
| Testing and evidence-linked iteration | 8 | **3** | Strong automated testing; 12 changes traceable to Assignment 3 interview evidence and technical findings. **No real user tests with 5 participants yet** — the criterion explicitly requires relevant users completing tasks. | Run P01–P05, implement ≥ 3 changes from findings, retest, document → realistic 6–7. |
| Problem–solution fit and technical feasibility | 5 | **4** | Evidence-first checklist directly answers A3 findings (late gaps 8/8, need for reasons, human control); free static stack suitable for 3 students. Deduction: willingness to pay and real-tender accuracy unvalidated. | Show A3 → feature mapping in the defence; test with a real (anonymised) tender. |
| Responsible design and resilience | 4 | **4** | Honest "rule-based, not AI" labelling; illustrative readiness; local-only data with delete-all; PDFs never uploaded; CSP and headers; validated inputs; blocked/corrupt storage and invalid files handled; error boundary. | Keep claims consistent in the ad and business plan. |
| **Total** | **40** | **30** | | Realistic after user testing + KZ review + redeploy: **35–37** |

Mark-cap check: the MVP is functional (works beyond static screens), so the 60 % project cap should not apply — provided the live link works on the day.

## Remaining manual actions (owner to be assigned by the team)

1. Run five user tests (P01–P05) using `USER_TESTING_PROTOCOL.md`; export CSV; document ≥ 3 resulting changes and retests.
2. Kazakh language review (`KAZAKH_TRANSLATION_REVIEW.md`).
3. Push to GitHub and redeploy on Vercel; run the production checklist (`DEPLOYMENT_GUIDE.md` §5).
4. Record the backup demo video.
5. Add the AI-use declaration (this iteration's code, tests, translations and docs were produced with an AI coding assistant and reviewed/tested by the team).
6. Every member rehearses explaining the rule engine (`src/domain/evaluate.ts`) and the 40 % formula.
