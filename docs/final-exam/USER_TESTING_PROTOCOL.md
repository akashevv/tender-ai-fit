# User Testing Protocol — 5 participants

**Status: not yet conducted.** Do not report results until real sessions are completed and recorded below. Assignment 3 interviews (R1–R8) are customer-discovery evidence and must **not** be reported as MVP usability tests. Former interviewees may be invited again, but give them new codes P01–P05 and record that they were previously interviewed.

## 1. Goal

Check whether target users can complete the core journey without help in English **and** Kazakh, understand Met / Missing / Unclear, trust the explanations, and notice the boundary case (expired certificate).

## 2. Participants (5)

| Criterion | Target |
|---|---|
| Role | Person who personally checks tender requirements: in-house tender/procurement specialist (priority segment S2, ≥ 3 participants), SME owner/manager (S1), tender consultant (S3) |
| Experience | Has worked on at least one tender in the last 12 months |
| Language | At least 2 participants run the main tasks in Kazakh |
| Exclusions | Team members, students without procurement experience |

## 3. Consent and data protection (consent-safe evidence)

1. Read the consent script; record "yes" in the table (do not collect signatures with names in the shared portfolio).
2. Use only participant codes P01–P05. Do not record names, employers, phone numbers or faces.
3. Screen recording only with explicit permission, only the browser window, no audio unless agreed. Store recordings in the team's private folder; delete after grading.
4. Participants use the fictional demo data only — never their company's real documents.

Consent script (EN): "We are testing a university prototype, not you. The session takes about 15 minutes. We will note what you do and say, without your name. You can stop at any time. May we continue? May we record the screen?"
Consent script (KZ): «Біз сізді емес, университеттік прототипті тексеріп жатырмыз. Сессия шамамен 15 минутқа созылады. Не істейтініңізді және айтқаныңызды атыңызсыз жазып аламыз. Кез келген уақытта тоқтата аласыз. Жалғастыруға рұқсат бересіз бе? Экранды жазуға рұқсат бересіз бе?»

## 4. Setup

- Same build for all participants (live URL); note the version/date.
- Before each session: Data & Privacy → *Delete all local data* (gives a clean demo).
- Facilitator reads tasks; observer writes notes. Think-aloud. Do not help unless the participant is stuck > 2 minutes (then record "with help").

## 5. Tasks (script)

| # | Task (read aloud) | Success criterion |
|---|---|---|
| T1 | "Open the website and find out what this product does and how to start." | Clicks *Try the Demo* / *Демоны байқап көру* within 60 s |
| T2 | "Switch the interface to Kazakh (or English) and continue in that language." | Uses switcher; continues without confusion |
| T3 | "Check which documents the company has. Is anything expired?" | Finds ISO 9001 expired on 30.06.2025 |
| T4 | "Check the company against the demo tender." | Starts analysis; reaches results |
| T5 | "Which requirements are not satisfied, and why?" | Names ISO 9001 (expired) and financial statement (missing); explains from screen |
| T6 | "One requirement needs your judgement. Review it and record your decision." | Opens Unclear item, writes note, changes status or marks reviewed |
| T7 | "Imagine the company renewed its ISO certificate on 01.06.2026, valid to 31.05.2029. Update the profile and check again." | Edits certificate, sees ISO MET, readiness 60 % |
| T8 | "Save the report as a PDF for your manager." | Uses *Download Report (PDF)* |
| T9 | "Try to upload this file" (give a .docx or .txt) | Understands the error, recovers |
| T10 | Fill in the feedback form with code P0x | Saved |

Post-task questions: What does "Unclear" mean to you? Would you trust the 40 %? What is missing for your real work? Would you use this before deciding to bid?

## 6. Severity scale

0 = no problem · 1 = cosmetic · 2 = minor (slows down) · 3 = major (needs help) · 4 = blocker (cannot complete).

## 7. Recording template (Template E, Final Exam)

| Participant code | Relevant profile | Test date | Consent method | Language | Assigned task | Observed result | Errors or confusion | Severity | Improvement made | Retest result |
|---|---|---|---|---|---|---|---|---|---|---|
| P01 | | | verbal / recorded yes | EN / KZ | T1–T10 | | | | | |
| P02 | | | | | T1–T10 | | | | | |
| P03 | | | | | T1–T10 | | | | | |
| P04 | | | | | T1–T10 | | | | | |
| P05 | | | | | T1–T10 | | | | | |

Per-task observation sheet (copy per participant):

| Task | Completed (yes / with help / no) | Time | Quotes (verbatim, no names) | Issue | Severity |
|---|---|---|---|---|---|
| T1 | | | | | |
| T2 | | | | | |
| T3 | | | | | |
| T4 | | | | | |
| T5 | | | | | |
| T6 | | | | | |
| T7 | | | | | |
| T8 | | | | | |
| T9 | | | | | |
| T10 | | | | | |

## 8. After the sessions

1. Export feedback: Feedback → *Export CSV* on the test device(s).
2. Cluster issues; pick ≥ 3 changes with the highest severity × frequency.
3. Implement, retest with at least one participant, fill "Improvement made" and "Retest result".
4. Add rows C13+ to `MVP_CHANGELOG.md` citing participant codes.
5. Keep raw notes in the evidence folder (portfolio appendix).
