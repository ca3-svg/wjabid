# WJA Bid design and usability review — November 10, 2026

## Scope and confidence

This is an expert heuristic review of the interface structure and interaction code as it stood on November 10, informed by the earlier recorded viewport exploration in [USABILITY-REPORT-2026-11-10.md](USABILITY-REPORT-2026-11-10.md). The local-file page could not be reattached to the browser during that review, so no new visual screenshot or live interaction result was claimed. The earlier 390px, 820px, 1180px, and 1440px observations remain emulated-agent evidence, not human findings or physical iOS results. The findings below describe that original state; current changes are summarized above.

The review focuses on clarity, bidder task flow, feedback, responsive layout, keyboard/screen-reader access, and error prevention. It uses common usability heuristics and WCAG 2.2 AA as review lenses; this is not a formal accessibility audit.

## Implementation status — November 11, 2026

- UXR-01: Filter and ranking sections now say **Remove results** and **Change ranking**; preferred duration is grouped with ranking.
- UXR-02: Control groups now wrap at narrower widths, and the Details itinerary uses stacked leg cards below the small-screen breakpoint. These layout changes have not been visually re-captured in a browser or checked on physical devices.
- UXR-03: Short tab labels remain visible on phones; full names and active-page state are exposed to assistive technology.
- UXR-04/05: Adding a pairing now requires a labeled **Add** button. Pairing IDs use keyboard-operable buttons to open the original text; Details remains separate.
- UXR-06/07: Pairing dialogs trap keyboard focus and return it to the trigger. Search, filters, targets, and ranking sliders have explicit labels and visible focus styling.
- UXR-08: Ranking profiles use an in-app save dialog with blank-name feedback, cancel, focus restoration, and a live save confirmation.
- Automated regressions cover these changes. Physical iOS, VoiceOver, and axe-core checks remain outstanding.

## What is working well

- The Viewer is the main workspace, while GDO planning and bid assembly stay separate.
- The app distinguishes hard filters from the ranking controls in its explanatory copy, and it states that the flight-count and layover targets only affect ranking.
- One row represents one operating date. The pairing-number action and **Details** action have distinct purposes and open different views.
- The itinerary is grouped by duty day, labels each day's leg count and block total, and separates layover/rest from flight rows.
- Unknown time-zone/fatigue inputs are shown as unknown instead of being presented as zero.
- The table has a column chooser and an internal horizontal scroll area; detailed pairing information is available on demand rather than making every result row tall.

## Findings

### UXR-01 — “Must match” groups controls that only change ranking

- **Priority:** P1 — fix before the next bidder study
- **Confidence:** High; confirmed in the current control markup and ranking/filter logic.
- **Evidence:** The Ranking panel starts a section called **Must match**, then places presets, a preferred-duration selector, and hard-filter fields together. Preferred duration contributes points to `scorePairing`; it does not filter out pairings. Min/max layover and minimum credit do filter results. A user can reasonably infer that duration is mandatory while another nearby control only changes order.
- **Recommendation:** Split the panel into clearly named **Remove results** and **Change ranking** groups. Put duration with ranking preferences. Label each hard filter with its unit and behavior. Keep a short persistent explanation of whether changing a control removes rows or reorders them.

### UXR-02 — Tablet layout clips controls; phone itinerary needs nested scrolling

- **Priority:** P1 for responsive layout
- **Confidence:** Medium; documented from prior agent viewport screenshots, not re-captured in this review.
- **Evidence:** The existing exploratory report records ranking/filter content clipped at 820×1180 and 1180×820. At 390×844, the Details modal required vertical scrolling to reach the itinerary and horizontal scrolling inside the itinerary table.
- **Recommendation:** Reflow the preference/filter groups at tablet widths and keep page-level scrolling contained. On narrow phones, replace the seven-column itinerary table with leg cards or a stacked key/value layout; preserve the aligned table on wider screens. Keep duty-day, block, and layover context visible while browsing legs.

### UXR-03 — Small-screen tab names disappear

- **Priority:** P1 for accessibility; P2 for visual usability
- **Confidence:** High; confirmed in current markup.
- **Evidence:** Below the `sm` breakpoint, the header hides the text labels for Viewer, GDO Planner, and Bid Builder, leaving icon-only buttons. The buttons have no explicit accessible names. A new or infrequent bidder must recognize the icons, and assistive technology may announce unlabeled controls.
- **Recommendation:** Keep short text labels visible where space allows, or use an explicit compact navigation pattern with `aria-label` on each button. Verify active state is conveyed beyond color.

### UXR-04 — Add-to-bid is an implicit action on most table cells

- **Priority:** P2 — reduce accidental changes
- **Confidence:** High; confirmed in current event handling.
- **Evidence:** A click on most Viewer and Bid Builder row cells immediately adds that date to the bid. Pairing and Details cells are exceptions. The Viewer has a hint that a row click adds it, but this interaction is easy to trigger while browsing dense, horizontally scrollable rows and is difficult to discover or operate consistently by keyboard.
- **Recommendation:** Add a clear **Add** action button or an explicit selection control. If row-click behavior remains, make it keyboard operable, show a visible hover/focus affordance, and provide a clear undo action in the confirmation message.

### UXR-05 — Pairing number and row actions are not consistently semantic controls

- **Priority:** P1 for keyboard and screen-reader usability
- **Confidence:** High; confirmed in current markup.
- **Evidence:** The pairing number is rendered as a clickable `div` with a cell-click handler. Adding a bid depends on row-click handling. These controls do not provide the keyboard behavior or semantics users expect from links and buttons.
- **Recommendation:** Render the pairing-number action as a real button (or link-style button) and make Add a real button. Give each one an accessible name that includes the pairing and operating date. Confirm visible focus and predictable Tab order.

### UXR-06 — Dialog opening focuses Close, but focus management is incomplete

- **Priority:** P1 for keyboard and assistive technology
- **Confidence:** High; confirmed in current dialog code.
- **Evidence:** Both pairing modals declare `role="dialog"`, `aria-modal="true"`, and a labelled heading, and they focus the Close button on open. The code closes on Escape and backdrop click. It does not trap focus within the open dialog or restore focus to the originating control when closed.
- **Recommendation:** Use the native `<dialog>` pattern or implement complete dialog focus management: preserve the opener, keep keyboard focus inside, restore focus on close, and ensure background content is not reachable while the modal is open.

### UXR-07 — Several filter controls rely on placeholder/title text instead of labels

- **Priority:** P2 for accessibility and clarity
- **Confidence:** High; confirmed in current markup.
- **Evidence:** Base, duration, and layover-region selects have no associated `<label>`. Numeric min/max fields use terse placeholders such as “Min”, “Max”, and “Hrs”. Placeholders disappear when users enter values and may not be announced reliably as labels.
- **Recommendation:** Add persistent visible labels and units; use fieldsets for related min/max pairs. Ensure the column picker and all search/filter inputs have accessible names.

### UXR-08 — Save setup gives no dependable in-app feedback

- **Priority:** P2
- **Confidence:** Low to medium; prior agent run could not observe the browser-native prompt, and current code uses `prompt()`.
- **Evidence:** The current action asks for a name via a browser prompt and then silently saves to local storage. The earlier exploratory run could not complete the flow in its test browser; that observation is not confirmed as a product defect.
- **Recommendation:** Replace the browser prompt with a small in-app dialog that explains where the profile is stored, validates the name, and confirms **Saved**. Test saving, loading, renaming/replacing, and deleting a profile.

## Suggested implementation order

1. Clarify the control model: separate filters from ranking, and distinguish Add from inspect/compare actions.
2. Repair keyboard and screen-reader semantics for tabs, table actions, filter labels, and modal focus.
3. Reflow the ranking panel at tablet widths and create a phone-friendly itinerary layout.
4. Replace the native profile prompt with an in-app save/restore flow.
5. Run automated accessibility checks and keyboard/zoom checks, then validate the revised layouts with pilots on their own devices.

## Limits

This review can identify issues from code structure and recorded viewport evidence, but it cannot establish what pilots understand, which tradeoffs they prefer, or whether a proposed change improves task completion. Those questions still need short moderated sessions. Physical iOS Safari, VoiceOver, touch target comfort, and axe-core findings remain untested.
