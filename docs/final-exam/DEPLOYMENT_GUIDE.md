# Deployment Guide

## 1. Requirements

- Node.js **22.12+** (22 LTS recommended) and npm 10+.
- Git and a GitHub account connected to Vercel (the existing project https://tender-ai-fit.vercel.app).
- For browser tests on Windows: Microsoft Edge (pre-installed). On macOS/Linux: `npx playwright install chromium` and set `PW_CHANNEL=chromium`.

## 2. Environment variables

**None.** The app has no backend, API keys or secrets. Do not add `.env` files with secrets; `.env*` is git-ignored.

## 3. Local installation and checks

```bash
npm ci
```

```bash
npm run lint
```

```bash
npm run test
```

```bash
npm run build
```

```bash
npm run test:e2e
```

```bash
npm run preview
```

`npm run test:all` runs lint → unit tests → build → browser tests. Development server: `npm run dev` (http://localhost:5173).

## 4. Deploy to Vercel

The repository already contains `vercel.json` (SPA rewrites + security headers).

1. Replace the contents of the existing GitHub repository with this project (do **not** commit `node_modules`, `dist`, `test-results`).
2. Commit and push to the branch Vercel deploys (usually `main`):
   ```bash
   git add -A
   ```
   ```bash
   git commit -m "Final exam MVP: bilingual EN/KZ, rule engine, tests, docs"
   ```
   ```bash
   git push
   ```
3. Vercel settings (auto-detected): Framework **Vite**, Build `npm run build`, Output `dist`, Install `npm ci`, Node.js 22.x.
4. Wait for the deployment; open the production URL.

Alternative without GitHub: `npx vercel` (preview) then `npx vercel --prod` after logging in.

## 5. Production validation checklist (run on a second device/browser, incognito)

- [ ] Home loads; *Try the Demo* and *How It Works* work.
- [ ] Switch to **KZ** → reload → still Kazakh; switch back to EN.
- [ ] Direct link `/report` and `/profile` load (SPA rewrite works, no 404).
- [ ] Select Tender → Start Analysis → **2 Met, 2 Missing, 1 Unclear, 40 %**.
- [ ] ISO 9001 card shows "expired on 30.06.2025".
- [ ] Report → Download Report (PDF) → print preview shows company, tender, date, statuses, disclaimer; Kazakh characters render.
- [ ] Profile → Renewed scenario → analysis shows 4 Met, 80 %; Reset demo data → 40 % again.
- [ ] Upload a .docx → error message.
- [ ] Feedback saves; Export CSV downloads.
- [ ] Mobile phone: menu opens, no sideways scrolling.
- [ ] Browser console (F12) shows no red errors (a CSP violation would appear here).
- [ ] Data & Privacy → Delete all local data before the defence.

## 6. Backup demonstration recording

1. Fresh incognito window, 1920×1080, browser zoom 110 %.
2. Delete all local data first.
3. Record with OBS Studio / Xbox Game Bar (Win+Alt+R) / QuickTime, following `MVP_DEMO_SCRIPT.md` (≈ 2.5 min), once in English with a Kazakh segment (language switch + analysis + report).
4. No personal data on screen (close other tabs, bookmarks bar, notifications).
5. Export MP4, name it `BDA-2402_TenderAIFit_MVP-Demo.mp4`, test playback on another device, upload with the submission.

## 7. Rollback

In Vercel → Deployments → previous deployment → *Promote to Production*.
