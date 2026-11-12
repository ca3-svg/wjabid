# WJA Bid

WJA Bid is a browser app for exploring WestJet pilot pairings, comparing schedule characteristics, and building a bid list.

## Getting started

1. Open `index.htm` in a modern browser.
2. Upload a WestJet pairing PDF.
3. Search, filter, sort, and adjust ranking preferences in the Viewer. Pairing operating dates appear as separate choices.

PDF.js is loaded from a CDN, so uploading and extracting a PDF requires an internet connection. The app processes the PDF in your browser and saves extracted pairings, preferences, and bid data in that browser's local storage.

## Pairing views

- Click a **pairing number** to open a separate modal containing the original schedule text. The PDF's column positions are reconstructed during extraction so the monospaced text stays aligned. If older saved pairings are loaded, re-upload the PDF when prompted to restore those columns.
- Click **Details** to open a structured itinerary generated from the parsed flights. It shows aligned flight, route, time, block, and time-zone columns; groups flights by duty day; shows each day's block total; and places layover/rest on a separate row.
- Use the **Favorite** star to save one specific pairing date. The star in the top-right opens a device-local Favorites list with each choice's route, credit, legs, layover, Details, and Remove actions.

## Ranking and bid building

Ranking weights and targets can be adjusted and saved as preference profiles. The app includes selectable pairing-only schedule-exposure views for recovery, night-time scheduling, workload, time-zone changes, and a balanced average. These are app-defined comparison aids, not a validated fatigue model, regulatory result, or fitness-for-duty assessment.

The GDO Planner and Bid Builder are separate tabs. The Bid Builder supports manual selection and auto-generation, with checks for bid limits, selected GDOs, and overlapping pairings.

## Quality checks

Run the self-contained regression suite from the repository folder:

```sh
node --test tests/quality.test.cjs
```

The optional actual-PDF integration check adds a YUL December bid fixture. Instructions for running it and the current quality results are in [docs/QUALITY-REPORT.md](docs/QUALITY-REPORT.md).

## Usability sessions

The local agent usability harness prepares bidder tasks and review materials for desktop, emulated iPhone/iPad layouts, and physical iPhone/iPad Safari sessions. Start with `node usability/harness.mjs check`; setup and local-device instructions are in [usability/README.md](usability/README.md). It uses no LLM API. Give a UI-driving agent the generated `AGENT-RUN.md`, and keep the evaluator notes separate. Agent findings complement pilot validation; they are not a human usability score.

The Playwright browser suite adds synthetic-data runs for desktop, phone, and iPad-sized Chromium and WebKit profiles. Run `npm ci`, `npx playwright install chromium webkit`, then `npm run test:e2e`. Playwright WebKit is not actual iOS Safari; physical-device and pilot checks remain necessary. Run results and evidence are described in the usability guide.

The latest exploratory run and follow-up items are in [docs/USABILITY-REPORT-2026-11-10.md](docs/USABILITY-REPORT-2026-11-10.md).

The latest independent screenshot benchmark review is in [docs/USABILITY-BENCHMARK-REVIEW-2026-11-12.md](docs/USABILITY-BENCHMARK-REVIEW-2026-11-12.md). Its live task attempt was blocked; only the explicitly listed screenshot observations are scored.

An expert heuristic review of the current layout, control structure, responsive findings, and accessibility risks is in [docs/DESIGN-USABILITY-REVIEW-2026-11-10.md](docs/DESIGN-USABILITY-REVIEW-2026-11-10.md). It complements the exploratory run and does not claim human participant validation.

For sessions with actual pilots, use the [human usability study kit](usability/human-study/README.md). It provides a neutral moderator guide, task cards, consent checklist, observation sheet, and physical-device/accessibility checklist. The current preflight report is explicitly an agent rehearsal; no human session is claimed.

## Repository contents

- `index.htm` — browser application
- `airport-metadata.js` — airport region and time-zone data
- `tests/` — regression tests and the PDF text extractor used for the optional integration check
- `usability/` — task pack, device profiles, agent protocol, and local run harness
- `docs/` — change list, quality report, design notes, and implementation plans

Uploaded pairing PDFs and temporary extraction files are excluded from Git.
