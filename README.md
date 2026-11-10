# wjabid

WestJet Bidding: a browser application for exploring pilot pairings, comparing schedule characteristics, and building a bid list.

## Run

Open `index.htm` in a browser and upload a pairing PDF. PDF.js is loaded from a CDN, so an internet connection is needed for PDF upload and extraction.

## Quality checks

Run the self-contained regression suite from this folder:

```sh
node --test tests/quality.test.cjs
```

The optional actual-PDF integration check is documented in [docs/QUALITY-REPORT.md](docs/QUALITY-REPORT.md).
