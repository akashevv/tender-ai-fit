# Tender AI Fit — Assignment 5 MVP

A **fictional, interactive university prototype** for the Technology Entrepreneurship course (BDA-2402).

Team: Akashev Bekarys · Bolatov Alisher · Kanapiya Yernur

## Run locally (Windows / macOS)

Install Node.js **22.12+** (22 LTS recommended). In a terminal opened inside this project folder:

```bash
npm install
npm run dev
```

Open the **Local** URL shown in the terminal, typically http://localhost:5173/ .

To check the production build:

```bash
npm run build
npm run preview
```

## Demo script for the instructor

1. Open **Home → Start Tender Analysis**.
2. On Dashboard, see the fictional company and one demo tender.
3. Open **Company Profile** to see sample license, expired ISO certificate, projects, and personnel metadata.
4. Go to **Upload Tender** and select **FICTIONAL DEMO**.
5. Choose **Run Demo Analysis**. Expand the requirements to see source references and explanations.
6. Observe the internally consistent results: **2 MET, 2 MISSING, 1 UNCLEAR**, illustrative readiness **40%**.
7. Add a reviewer note and change one status; review the change on **Results**.
8. Try **Print / Save PDF**, then **Provide Feedback**.

## Optional own-PDF manual workflow

The **Browse Files** button accepts PDFs up to 20 MB. It does not send, store, or automatically read the file. Enter requirement titles manually (one per line). The manual workflow starts each item **UNCLEAR** so a reviewer can add notes and change statuses; it **does not pretend to perform AI analysis**. This avoids exposing real tender PDFs to an experimental application.

## Important prototype limitations

- The demo company, tender and named evidence files are fictional *metadata*, not real documents.
- **No AI, OCR, PDF parsing, government tender API, or regulatory compliance engine** is provided.
- The company profile is read-only in this first version.
- Reviewer notes and assessment state live in page memory; refreshing the page restarts the assessment.
- Feedback is saved only to the **current browser's localStorage** (`taf_feedback`); it is **not sent to the team**. For beta tests, ask participants to share their answers directly.
- The 40% illustrative readiness figure is a simple **MET / total × 100** ratio, **not** a win probability or legal eligibility decision.

The reviewer makes the final participation decision.

## Deploy to Vercel (no download needed for instructor)

1. Put this source project into a GitHub repository (do not commit `node_modules`).
2. Import the repository at https://vercel.com/new .
3. Vercel should detect **Vite**. Build: `npm run build`, Output: `dist`.
4. Deploy and share the generated public URL in the Assignment 5 PDF.
5. `vercel.json` handles deep links for the React Router single-page app.
6. Test the public URL in an incognito window before submitting.

## Submission note

The *website alone* is not the full Assignment 5 submission: submit one PDF report containing the required 13 sections, prototype screenshots and an accessible URL, following the course assignment instructions.
