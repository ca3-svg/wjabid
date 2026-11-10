# Quality test report — November 9, 2026

Result: **42 self-contained checks passed, 0 failed**. Running with the optional actual-PDF fixture adds one integration check, for **43 passed, 0 failed**.

## Fixes made

- Opening Bid Builder no longer auto-generates and replaces a manually selected or saved list. Auto-Generate remains an explicit action.
- Both tables now register row clicks through the event API supported by Tabulator 5.5.2. Clicking a date adds that instance; comparison controls do not add bids.
- Manual additions respect dates selected in GDO Planner even when GDO bid slots have not been generated.
- Manual addition, auto-fill, and replacement reserve the full trip, including layovers. Another trip cannot be inserted while the pilot is away. Duty dates remain separate for flight workload calculations. The schedule labels layover days.
- Flights per workday uses the number of days containing flights. M302W is one flight per workday, rather than two flights divided by four calendar days.
- Occurrence expansion recalculates layover metrics, including for previously saved uploads that predate these fields.
- Missing layover durations remain unknown and cannot satisfy a required minimum or maximum across every layover. The Viewer displays an unknown maximum explicitly.

## Coverage and evidence

- Syntax checks cover every inline application script.
- Regression checks cover date identities, year rollover, M302W recurrence, duplicate selection, bid limits, GDOs, overlap during layovers, replacement, click registration and dispatch, ranking changes, time-zone offsets, profile persistence/reset, legacy data, and escaped text.
- The supplied December PDF was extracted with PDF.js 3.11.174 using the app's coordinate-based line reconstruction, then parsed by the application's actual JavaScript.
- Its 44 pages produce 164 source blocks and 216 distinct operating-date choices. M302W appears on December 8, 15, 22, and 29, 2026.
- Auto-fill on the actual PDF stays within the current slot, credit, and duration limits and has no overlapping occupied dates.

## Re-running

Run `node --test tests/quality.test.cjs` from the application folder for the 42 self-contained checks. The harness fixes today's date to November 9, 2026 so the December fixture remains repeatable.

For the additional actual-PDF check, use `tests/extract-pdf.cjs` with a local copy of the PDF.js version used by the app, set `WJA_PDF_TEXT` to the resulting text file, and run the same test command. The extractor's command format is documented at the top of that script.

## Limits

The application code runs in Node with a small simulated document and table interface for these checks. The PDF extraction library is real. Browser rendering, responsive layout, downloads, and clipboard/popup behavior were not visually exercised: browser automation had blocked access to the local-file page. These checks do not validate the app's simplified rest rules against current regulatory or contractual requirements.

## Modal follow-up — November 10, 2026

- Replaced the stale plain-text details assertion with a regression check that opens the selected-date modal and verifies the aligned itinerary table, per diem, layover, and non-wrapping source schedule are present.
- `node --test tests/quality.test.cjs`: **34 checks passed, 0 failed**. The optional supplied-PDF extraction check was not run in this follow-up.
- The modal now presents trip metrics, each duty day's flights and block, layover/rest, time-zone shifts, per diem, pairing flags, and automated bid-check notes. Visual browser QA was not performed.

## Network airports follow-up — November 10, 2026

- Extracted flight-leg airport codes from all seven PDFs in the supplied December 2026 bid archive: 10,896 legs and 90 unique station codes.
- Added region and IANA time-zone entries for all 90 codes, using the `airportsdata` 20261103 dataset; the network coverage regression check validates every code and every time-zone identifier.
- `node --test tests/quality.test.cjs`: **35 checks passed, 0 failed**.

## Pairing fatigue comparison follow-up — November 10, 2026

- Added a selectable five-view pairing-only schedule exposure index, with the four component formulas and limitations disclosed in the Viewer and pairing details modal.
- Added score coverage for missing inputs, a sortable Viewer column, ranking influence control, and persistence in saved ranking profiles.
- Verified that increasing the fatigue weight lowers ranking for higher exposure, and a zero weight makes the selected fatigue view have no effect on rank.
- `node --test tests/quality.test.cjs`: **39 checks passed, 0 failed**. The optional supplied-PDF extraction check was not run in this follow-up.
- The score is app-defined and intended for pairing comparison. It is not an industry standard, validated fatigue model, regulatory compliance result, or fitness-for-duty assessment.

## Original schedule modal correction — November 10, 2026

- Made the pairing's original schedule text the primary itinerary display. It uses a fixed-width font and preserves source spaces and line breaks inside a horizontal scroll area; the generated flight table and collapsed source-text details were removed.
- Updated the regression check to confirm the modal displays the original source text and has no generated itinerary table.
- `node --test tests/quality.test.cjs`: **39 checks passed, 0 failed**. Browser visual QA remains unavailable for the local-file page.

## PDF column alignment correction — November 10, 2026

- Root cause: PDF.js provides each text fragment's horizontal coordinate, but the app discarded it by joining fragments with two spaces and collapsing wider runs. The modal could only display that already-flattened text.
- Reconstructed each source line with spaces derived from the PDF text positions and retained those spaces through parsing and display. The schedule text now has the same day and field columns as the PDF, followed by a horizontally scrollable, monospaced view.
- Verified the YUL December example pairing 232/M3026: the origin airport starts within two character columns of the PDF's `DEP` heading. PDF.js extracted all 44 pages; 164 pairing blocks and 216 date choices parsed successfully.
- `node --test tests/quality.test.cjs` with the actual YUL PDF fixture: **43 checks passed, 0 failed**.

## Structured pairing details — November 10, 2026

- Replaced the modal's raw PDF text with a separate itinerary generated from parsed flight data. The table has aligned Flight, From, To, Departure, Arrival, Block, and Time zone columns, with a dated duty-day header and block total, plus a distinct rest/layover row.
- The PDF-style text remains the parser input; the details modal no longer displays or depends on that text layout.
- `node --test tests/quality.test.cjs`: **42 checks passed, 0 failed**.

## Separate pairing-text and details modals — November 10, 2026

- The Viewer and Bid Builder pairing-number links now open a dedicated modal that shows only the original pairing text. The Viewer Details button opens the separate formatted itinerary modal.
- Added a regression check that invokes both table click handlers and confirms each opens its own content and modal.
- `node --test tests/quality.test.cjs`: **42 self-contained checks passed, 0 failed**; with the actual YUL PDF fixture, **43 passed, 0 failed**.
