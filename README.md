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

## Ranking and bid building

Ranking weights and targets can be adjusted and saved as preference profiles. The app includes selectable pairing-only schedule-exposure views for recovery, night-time scheduling, workload, time-zone changes, and a balanced average. These are app-defined comparison aids, not a validated fatigue model, regulatory result, or fitness-for-duty assessment.

The GDO Planner and Bid Builder are separate tabs. The Bid Builder supports manual selection and auto-generation, with checks for bid limits, selected GDOs, and overlapping pairings.

## Quality checks

Run the self-contained regression suite from the repository folder:

```sh
node --test tests/quality.test.cjs
```

The optional actual-PDF integration check adds a YUL December bid fixture. Instructions for running it and the current quality results are in [docs/QUALITY-REPORT.md](docs/QUALITY-REPORT.md).

## Repository contents

- `index.htm` — browser application
- `airport-metadata.js` — airport region and time-zone data
- `tests/` — regression tests and the PDF text extractor used for the optional integration check
- `docs/` — change list, quality report, design notes, and implementation plans

Uploaded pairing PDFs and temporary extraction files are excluded from Git.
