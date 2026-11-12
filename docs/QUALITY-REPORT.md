# Quality test report — November 11, 2026

## Phone and tablet browser automation — November 11, 2026

- Added a Playwright suite using a synthetic four-date M302W fixture, with eight desktop/phone/tablet size and Chromium/WebKit projects. It checks separate dates and dialogs, explicit date-specific bid addition, favorite persistence/toggle/list/removal, page-wide overflow, JavaScript errors, named table filters, and axe findings in the Details and Favorites dialogs; each run captures Viewer, source, Details, and Favorites screenshots.
- Added `npm test`, `npm run test:e2e`, and `npm run test:e2e:list`; installed Playwright 1.65.0, axe Playwright 4.14.0, and Chromium/WebKit browser binaries.
- `npm run test:e2e`: **8 passed, 0 failed** across desktop Chromium/WebKit, iPhone-sized Chromium/WebKit, and iPad portrait/landscape Chromium/WebKit. Each run verified four independent M302W dates, favorite reload persistence, per-date toggles, list removal and Details navigation, responsive modal bounds, date-specific Add, no page-wide horizontal overflow, and no browser JavaScript errors. Details and Favorites dialogs had **0 axe-core violations** in all eight runs.
- Visual review of saved phone and iPad screenshots identified and fixed floating step arrows over mobile filters, awkward comparison wrapping, the layover-region filter clipping, and header overflow caused by the favorite control. The table now has a swipe hint and contained horizontal scrolling; header status text yields space on small screens while remaining available to screen readers.
- Existing Node regression suite: **60 passed, 0 failed**; usability pack validation and `git diff --check` passed. `node --check` passed for the Playwright config and test.
- Added a seventh agent usability task covering discovery, date-specific behavior, persistence, and removal of favorites; the harness now validates **7 tasks and 6 platform profiles**.
- Evidence is saved under the ignored `test-results/device-usability/` folder. This is browser emulation, not a physical iPhone/iPad or actual iOS Safari session. Human pilot, VoiceOver, iOS file picker, keyboard, and physical touch behavior remain untested.

## Design usability improvements — November 11, 2026

- Split **Remove results** filters from **Change ranking** preferences and moved preferred duration into ranking-only controls.
- Kept short tab names visible on phones and added accessible names/current-page state.
- Replaced row-click bid addition with date-labeled **Add** buttons; pairing links are keyboard-operable buttons that still open the source-text modal.
- Added phone-sized stacked itinerary cards and retained the aligned table at wider widths.
- Added labeled controls, visible keyboard focus, and focus trapping/restoration for pairing and profile dialogs.
- Replaced the browser profile-name prompt with an in-app save/cancel dialog, blank-name feedback, overwrite disclosure, and live save confirmation.
- `node --test tests/quality.test.cjs tests/usability-harness.test.cjs`: **60 passed, 0 failed**. Eight browser profiles and screenshots are now recorded above. No physical iPhone/iPad session, pilot session, or VoiceOver check was performed.

## Expert design and usability review — November 10, 2026

- Reviewed current UI markup and interactions alongside the earlier emulated viewport observations. The local-file page could not be reattached for a fresh screenshot, so this review does not claim new live visual results.
- Recorded eight prioritized findings in [DESIGN-USABILITY-REVIEW-2026-11-10.md](DESIGN-USABILITY-REVIEW-2026-11-10.md): confusing filter/ranking grouping, tablet clipping and phone nested scrolling, unlabeled mobile navigation, implicit row-click addition, non-semantic table actions, incomplete dialog focus management, missing persistent filter labels, and unclear profile-save feedback.
- This is an expert heuristic/code review, not a formal WCAG audit or a substitute for pilot feedback. Physical iOS/VoiceOver checks and axe-core remain outstanding.

## Human usability study kit — November 10, 2026

- Added a moderator guide, neutral participant task cards, consent checklist, observation sheet, device/accessibility checklist, and preflight report under `usability/human-study/`.
- Ran a visible in-app rehearsal: M302W showed four independent dates; the pairing link and Details opened separate modals; selecting December 15 retained that date in Bid Builder. The result rows appeared in the order December 8, 15, 29, 22, which should be checked with bidders.
- At the narrow in-app viewport (~566 CSS px), ranking controls and Save setup were visible. This is not physical iPhone/iPad validation. Save setup showed no visible confirmation in this session and requires reproduction in a regular browser.
- `node --test tests/quality.test.cjs tests/usability-harness.test.cjs`: **46 passed, 0 failed**. The usability pack validator, harness syntax check, and `git diff --check` also passed.
- No human sessions or physical-device sessions were conducted; no axe-core scan was run. Agent rehearsal observations are not human usability findings.

Earlier result: **46 self-contained checks passed, 0 failed** before the November 11 design usability improvements. The optional actual-PDF integration check was not run for that update.

## Fixes made

- Opening Bid Builder no longer auto-generates and replaces a manually selected or saved list. Auto-Generate remains an explicit action.
- Both tables now use explicit Add actions; pairing inspection and comparison controls do not add a bid.
- Manual additions respect dates selected in GDO Planner even when GDO bid slots have not been generated.
- Manual addition, auto-fill, and replacement reserve the full trip, including layovers. Another trip cannot be inserted while the pilot is away. Duty dates remain separate for flight workload calculations. The schedule labels layover days.
- Flights per workday uses the number of days containing flights. M302W is one flight per workday, rather than two flights divided by four calendar days.
- Occurrence expansion recalculates layover metrics, including for previously saved uploads that predate these fields.
- Missing layover durations remain unknown and cannot satisfy a required minimum or maximum across every layover. The Viewer displays an unknown maximum explicitly.

## Coverage and evidence

- Syntax checks cover every inline application script.
- Regression checks cover date identities, year rollover, M302W recurrence, duplicate selection, bid limits, GDOs, overlap during layovers, replacement, click registration and dispatch, ranking changes, time-zone offsets, profile persistence/reset, legacy data, and escaped text.
- Usability harness checks cover task/platform manifest validation, agent/evaluator brief separation, invalid run options, run-bundle creation, and local server allowlisting.
- The supplied December PDF was extracted with PDF.js 3.11.174 using the app's coordinate-based line reconstruction, then parsed by the application's actual JavaScript.
- Its 44 pages produce 164 source blocks and 216 distinct operating-date choices. M302W appears on December 8, 15, 22, and 29, 2026.
- Auto-fill on the actual PDF stays within the current slot, credit, and duration limits and has no overlapping occupied dates.

## Re-running

Run `node --test tests/quality.test.cjs tests/usability-harness.test.cjs` from the application folder for the current 58 self-contained checks. The app suite fixes today's date to November 9, 2026 so the December fixture remains repeatable.

For the additional actual-PDF check, use `tests/extract-pdf.cjs` with a local copy of the PDF.js version used by the app, set `WJA_PDF_TEXT` to the resulting text file, and run the same test command. The extractor's command format is documented at the top of that script.

## Limits

The application code runs in Node with a small simulated document and table interface for these checks. The PDF extraction library is real. Browser rendering, responsive layout, downloads, and clipboard/popup behavior were not visually exercised: browser automation had blocked access to the local-file page. These checks do not validate the app's simplified rest rules against current regulatory or contractual requirements.

## Agent usability harness — November 10, 2026

- Added six bidder tasks and six desktop, emulated iPhone/iPad, and physical iPhone/iPad Safari profiles.
- Added a run preparer that separates the agent-facing task brief from evaluator criteria and saves a report template, metadata, and structured findings locally.
- Added a loopback-by-default server that allowlists only the app page and airport metadata for a physical device on a private LAN.
- `node --test tests/quality.test.cjs tests/usability-harness.test.cjs`: **46 checks passed, 0 failed**.
- The harness prepares a session; it does not run an LLM or claim agent findings represent pilot usability. Real-device sessions and pilot validation remain separate evidence.
- Ran the M302W date/view task and partial comparison, ranking, and layover-filter tasks on phone-, tablet-, and desktop-sized in-app browser viewports. The observations and uncompleted tasks are recorded in [USABILITY-REPORT-2026-11-10.md](USABILITY-REPORT-2026-11-10.md).

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
