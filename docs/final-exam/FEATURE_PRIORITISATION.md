# Feature Prioritisation (MoSCoW)

Method: MoSCoW, decided against (a) customer evidence from Assignment 3 (8 anonymised interviews R1–R8, 05–08.10.2026), (b) Final Exam acceptance criteria, (c) resources: 3 students, no budget, ~2 weeks, static hosting.
Effort: S ≤ 1 day, M 2–3 days, L > 1 week (team estimate).

| Feature | Customer / requirement evidence | Category | Effort | Risk / dependency | Decision |
|---|---|---|---|---|---|
| Rule-based Met / Missing / Unclear per requirement, computed from profile data | 8/8 found gaps late; H2 supported; R3 wants reasons | **Must** | M | Rules must be correct → unit tests | Built |
| Expired documents never count (date-aware rules) | R5: "incomplete/expired client files" | **Must** | S | Analysis date must be shown | Built |
| Evidence, explanation, tender reference and next step for every requirement | H5 supported (8/8 trust conditional on explanation/verifiability); R7 wants verifiable comparison | **Must** | M | — | Built |
| Human review: notes, override with justification, reviewer confirmation | R6, R7 still want personal checks; H5 | **Must** | S | Must not look like legal verification | Built (with disclaimer) |
| English + Kazakh UI with persistent switch | Final Exam requirement; Kazakhstan market | **Must** | M | Needs human linguistic review | Built; review pending |
| Readiness report with export (print / save PDF) | R3 go/no-go decision; decision-makers differ from users (A3 §6.4) | **Must** | S | Browser print dialog | Built |
| Boundary cases (incomplete profile, invalid file, storage failure) | Final Exam requirement | **Must** | S | — | Built |
| Feedback collection + export for user testing | Final Exam: ≥ 5 user tests | **Must** | S | Real participants needed | Built; tests not yet run |
| Editable, reusable company profile saved in browser | R6 "reusable documents"; R5 saved profiles | **Should** | M | Browser-only storage | Built |
| Readiness % kept secondary and labelled illustrative | R5 rejects score alone; H3 only partially supported | **Should** | S | — | Built |
| Missing-items-first report and status filter | R1, R4, R8 want fast missing-document checklist | **Should** | S | — | Built |
| Manual entry of own tender requirements with rule selection | Users have their own PDFs (R1–R8 use PDFs) | **Should** | S | No PDF parsing — must be disclosed | Built |
| Demo scenarios (expired / renewed / incomplete) for defence | Demonstrates boundary case live | **Could** | S | — | Built |
| Local PDF text extraction (pdf.js) to suggest requirements | Would save typing | **Could** | L | Unreliable on scanned tenders; large dependency; risk of implying AI analysis | Not now |
| Multiple company profiles for consultants | R5 only (1/8) | **Could** | M | Needs accounts or data model change | Not now |
| Deadline / expiry alerts by email | H2 "mandatory-item alerts and deadlines" | **Could** | L | Needs backend + personal data | Not now |
| AI / LLM extraction of requirements from PDFs | Original concept | **Won't (now)** | L | Accuracy unvalidated; confidential tenders sent to third party; cost | Rejected for MVP |
| Technical product-specification matching | R2, R7 (2/8) | **Won't (now)** | L | Different product module | Later research |
| Profitability / cost screening | R4, R8 (2/8) | **Won't (now)** | L | Sensitive financial data | Later research |
| Accounts, cloud database, payments | H4 not validated | **Won't (now)** | L | Security, cost | After pricing tests |
| goszakup.gov.kz integration | — | **Won't (now)** | L | API access, legal | Later |
