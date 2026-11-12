# WJA Bid exploratory usability pass — November 10, 2026

## Scope and method

One Codex computer-use agent explored the visible WJA Bid app with the user-provided December 2026 YUL bid loaded locally. It used goal-based tasks rather than scripted click paths. No bid content was sent to an external service.

The browser was the Codex in-app browser with viewport overrides. The sessions covered 390×844, 820×1180, 1180×820, and 1440×1000 CSS-pixel views. These are emulated viewports, not physical iPhone/iPad sessions and not verified iOS Safari sessions. The app reported 216 operating-date choices after loading the PDF.

This was an exploratory agent pass, not a human pilot study. It was not fully blind: the evaluator had prior product context. A second independent evaluator could not attach to the test browser. Findings below need review before being treated as confirmed user problems.

## Task outcomes

| Task | Outcome | Observation |
| --- | --- | --- |
| Find M302W dates and distinguish pairing views | Complete | Four separate rows appeared for Dec 8, 15, 22, and 29. The pairing-number link opened the original schedule text with the selected date; **Details** opened the separate structured overview and day-by-day itinerary. Two recurrence dates could be compared as separate cards. |
| Compare credit, workload, and rest | Partial | The comparison cards showed credit, flights per workday, layover location/length, and time-zone change. A broader search for the best pairings under those preferences was not completed. |
| Try one flight per day and a 24-hour layover target | Partial | Both target fields were discoverable and accepted `1` and `24`. The page explained that targets change ranking without removing pairings. Saving and restoring the setup was not verified because the test browser dismissed the native save prompt without showing it to the agent. |
| Find Caribbean/US layovers and unknown data | Partial | The layover-region filter exposed Caribbean, US, Canada, Other, and Unknown. Caribbean and Unknown could be selected. The matching result set was not fully reviewed. |
| Build a date-specific bid | Not run | — |
| Upload and return to the app on a mobile device | Partial | The PDF was loaded through the computer browser's file chooser. No physical mobile file picker, app-return, or persistence check was performed. |

## Findings to review

### U-001 — Ranking controls extend beyond tablet-sized views

- **Severity:** 2 — moderate friction
- **Confidence:** Medium; agent-observed, needs pilot validation
- **Views:** 820×1180 portrait and 1180×820 landscape
- **Observation:** In both tablet-sized screenshots, the ranking panel's right-side controls and some filter content were clipped at the viewport edge. In portrait, the header brand also wrapped into several lines. The desktop 1440×1000 view showed more of the ranking controls.
- **Impact:** A bidder may not realize additional preferences are offscreen or may have to pan the whole page to reach them.
- **Suggested follow-up:** Reflow the ranking controls and filters into fewer columns at tablet widths, then check that only the pairing table itself needs horizontal scrolling.
- **Evidence:** Agent screenshot observations from the 820×1180 and 1180×820 runs; screenshots were not saved as repository files.

### U-002 — Phone itinerary requires two separate scroll directions

- **Severity:** 2 — moderate friction
- **Confidence:** Medium; agent-observed, needs pilot validation
- **View:** 390×844 portrait
- **Observation:** The Details modal opened on the summary cards. The agent had to move down to reach the day-by-day flights; within that section, the itinerary table showed only the early columns at once and had a separate horizontal scrollbar for the remaining columns.
- **Impact:** A pilot comparing leg times may need to alternate vertical and horizontal scrolling and can lose context between the summary and flight rows.
- **Suggested follow-up:** Consider a compact stacked leg layout on narrow phones while keeping the aligned table on larger screens. Validate with pilots before changing the desktop/tablet layout.
- **Evidence:** Agent screenshot observations of the Details summary and the day-by-day section; screenshots were not saved as repository files.

### U-003 — Ranking setup save could not be completed by the test agent

- **Severity:** Unrated pending reproduction
- **Confidence:** Low; may be a limitation of the in-app test browser
- **Views:** All tested sizes
- **Observation:** Clicking **Save setup** did not give the computer-use agent a visible save prompt or confirmation, so it could not complete the save-and-reload task.
- **Impact:** The profile workflow remains unverified. The run cannot tell whether the prompt is unavailable in this browser or whether the interaction needs clearer in-app feedback.
- **Suggested follow-up:** Repeat in desktop Chrome and real iPhone/iPad Safari. If the browser-native prompt is awkward on mobile, replace it with a labeled in-app dialog.
- **Evidence:** No native prompt was exposed to the agent during the run; not confirmed as a product defect.

## Next validation pass

1. Confirm U-001 and U-002 with a pilot using an iPad and an iPhone.
2. Re-run the save/restore task in a regular desktop browser and physical iOS Safari.
3. Complete the bid-builder conflict and date-selection task.
4. Repeat the high-credit / light-workload comparison task with a pilot and compare the reasons they choose against the agent's observations.

Agent findings identify what to review; they are not a human usability score or a validated assessment of bidder preference.
