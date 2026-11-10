# Bidder Change List

## Delivered in the current Viewer-led update

Quality testing and corrective changes are recorded in [QUALITY-REPORT.md](QUALITY-REPORT.md). The regression suite is in `tests/quality.test.cjs`.

- Show one row per pairing operating date. M302W now has separate choices for Dec 8, 15, 22, and 29, 2026.
- Keep the chosen date independent in the Bid Builder, schedule, overlap checks, and saved bid list.
- Keep old saved recurring selections visible as legacy multi-date entries instead of silently choosing a date.
- Make the Viewer the main workspace, with search and common filters up front and advanced filters/ranking controls collapsed.
- Keep GDO Planner and Bid Builder available as separate tabs.
- Rank by credit, credit efficiency, flights per workday, layover length, commute preference, redeye, and time-zone shift.
- Set a target for flights per workday and minimum layover; these targets change rank without removing results.
- Compare up to four date-specific choices and inspect the score factors that affect their order.
- Filter layovers by US, Caribbean, Canada, Other, or Unknown. Show unknown time-zone data without scoring it.
- Save and restore ranking profiles locally, including targets and preferred duration.
- Apply the same bid slot, credit, workday, overlap, and calendar-rest checks to manual and automatic selection.
- Make the pairing-number link open its own source-only modal with the original PDF schedule text. Make the separate Details button open a structured itinerary modal generated from parsed flight data, with aligned flight columns, a heading and block total for each duty day, and layover/rest on its own row.
- Rebuild PDF text lines from their original horizontal coordinates so source columns are retained wherever the uploaded schedule text is used.
- Keep rows compact; show each leg in aligned columns for flight, origin, destination, local departure/arrival, block, and per-leg time-zone shift. Group by duty date, show daily block totals, and put layover/rest on its own row. Keep the original schedule monospaced without wrapping. Include per diem, trip metrics, ETOPS/deadhead/redeye indicators, and automated bid-check notes.
- Add region and IANA time-zone metadata for all 90 airport codes found across the seven December 2026 base bid PDFs.
- Add five selectable, app-defined pairing-only schedule exposure views: Balanced, Recovery opportunity, Night-time schedule, Flights per duty day, and Time-zone change. Show calculation details, unknown-data coverage, score in the Viewer and pairing modal, a ranking influence slider, and persist the selection in saved ranking profiles. This is a comparison aid, not an official or validated fatigue model.
- Display Total Legs by default.
- Contain wide tables in their own horizontal scroll area so extra columns do not widen the page.
- Keep columns hideable or showable through the Viewer column chooser and sort credit by its numeric value.
- Prevent duplicate Viewer filter handlers when pairings are reloaded.

## Candidate improvements for later work

- Add a compact/detail table toggle to reduce horizontal scrolling on smaller screens.
- Show each flight's time-zone change in the comparison details, not only the largest shift.
- Expand and maintain airport metadata as new PDFs contain unmapped destinations.
- Add more configurable rest preferences, such as a minimum layover target for every break or preferred days off.
- Review and clearly label rest checks between consecutive pairings against the applicable current rules.
- Add an export/import option for saved ranking profiles so preferences can move between browsers.

The candidate list is a backlog, not a claim that these items are already implemented.
