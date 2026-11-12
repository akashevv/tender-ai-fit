# Kazakh Translation Review

**Status:** first draft prepared with AI assistance (declare in the AI-use declaration). The Final Exam requires a **competent human review** of meaning, terminology, tone, truncation and error messages. Source of truth: `src/i18n/translations.ts` (object `kk`). Unit tests guarantee every English key has a Kazakh value with the same `{placeholders}`, but not linguistic quality.

Reviewer: ____________ (name kept in the private evidence folder) Date: ________ Result: approved / changes listed below

## 1. Core terminology (bilingual glossary)

| English | Kazakh (used in UI) | Notes for reviewer |
|---|---|---|
| Company Profile | Компания профилі | as specified in the brief |
| Tender Requirements | Тендер талаптары | |
| Start Analysis | Талдауды бастау | |
| Missing Requirements | Жетіспейтін талаптар | |
| Requires Review | Тексеруді қажет етеді | |
| Download Report (PDF) | Есепті жүктеп алу (PDF) | Brief suggested «Есепті жүктеу»; we used «жүктеп алу» (download) because «жүктеу» is also used for *upload*. Confirm. |
| Met (status) | Сәйкес келеді | alternative: «Орындалды» |
| Missing (status) | Жетіспейді | |
| Unclear (status) | Анық емес | |
| Evidence | Дәлел / Компания дәлелдері | alternative: «Растайтын құжаттар» |
| Supporting document | Растайтын құжат | |
| Licence | Лицензия | |
| Certificate | Сертификат | |
| Expiry date | Жарамдылық мерзімі | |
| Expired on {date} | Мерзімі {date} өткен | |
| Valid until {date} | {date} дейін жарамды | |
| Illustrative readiness | Шартты дайындық деңгейі | «шартты» = conventional/illustrative — confirm tone |
| Human review | Маманның тексеруі | |
| Reviewer note | Тексерушінің ескертпесі | |
| Mark as reviewed | Тексерілді деп белгілеу | |
| Dashboard | Басқару тақтасы | |
| Feedback | Кері байланыс | |
| Select Tender | Тендерді таңдау | |
| Upload / choose PDF | PDF таңдау | |
| Similar completed projects | Аяқталған ұқсас жобалар | |
| Audited financial statement | Аудиттелген қаржылық есептілік | |
| Civil engineer | Құрылыс инженері | |
| Project manager | Жоба менеджері | |
| Rule-based | Ережеге негізделген | |
| Procurement specialist | Сатып алу маманы | |
| Data & Privacy | Деректер және құпиялылық | |

## 2. Key sentences to check carefully

| Key | Kazakh |
|---|---|
| `human.review` | Tender AI Fit алдын ала бағалауға көмектеседі. Түпкілікті сәйкестік пен қатысу туралы шешімдерді білікті маман тексеруі тиіс. |
| `demo.disclaimer` | Демо прототип: компания, тендер және құжаттар ойдан құрастырылған. … |
| `report.readinessNote` | Бұл тек шартты толықтық көрсеткіші. Ол жеңіске жету ықтималдығы, заңды сәйкестік туралы шешім немесе келісімшарт жасасу ықтималдығы емес. |
| `reason.iso.expired` | ISO 9001 сертификатының ({file}) мерзімі {date} өткен. Құжат бар болса да, мерзімі өткен сертификат жарамды дәлел ретінде есептелмейді. |
| `reason.projects.unconfirmed` | {total} жоба жазбасы бар, бірақ олардың тек {confirmed} аяқталу құжаты бар әрі ұқсас ауқымы расталған … |
| `report.formula` | Формула: Сәйкес ({met}) ÷ Барлығы ({total}) × 100 = {value}% |
| `tender.manualNotice` | Tender AI Fit PDF файлдарынан мәтінді оқымайды және шығармайды. … |
| `feedback.consent` | Анонимді жауаптарымның команданың қолдану ыңғайлылығын зерттеуі үшін осы браузерде сақталуына келісемін. |
| All `upload.error.*` and `validation.*` | error messages |

## 3. Items needing a decision

1. «Сәйкес келеді» vs «Орындалды» for MET — which is clearer to procurement specialists?
2. Number agreement in counts: «{count} талап», «{total} талаптың {reviewed} тексерілді» — check readability.
3. Dates are shown as DD.MM.YYYY in both languages; Kazakh forms such as «30.06.2025 дейін» — check grammar of case endings after dates.
4. Proper names (Astana Build Solutions LLP, ISO 9001, file names, team names) are intentionally not translated.
5. Demo project titles and company description have Kazakh seed versions; text typed by users is shown as typed.
6. Check for truncation on mobile (390 px) — automated tests confirmed no horizontal overflow, but not visual elegance.

## 4. How to change a translation

Edit the value in `src/i18n/translations.ts` (`kk` object), keep `{placeholders}` unchanged, run `npm run test` (fails if a placeholder is lost), commit and redeploy.
