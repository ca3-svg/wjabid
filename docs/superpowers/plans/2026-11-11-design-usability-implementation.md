# WJA Bid Design Usability Improvements Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Address the prioritized usability and accessibility findings in the Viewer, pairing details, bid actions, and saved ranking setup.

**Architecture:** Keep the static single-page app and its current libraries. Update `index.htm` in focused sections and add regression checks to the existing Node VM suite; avoid introducing a framework or new dependencies. Preserve one-row-per-date semantics and existing ranking behavior while making controls clearer and operable.

**Tech Stack:** HTML, Tailwind CDN classes plus existing custom CSS, Tabulator 5.5.2, vanilla JavaScript, Node `node:test`.

**Spec:** [docs/DESIGN-USABILITY-REVIEW-2026-11-10.md](../DESIGN-USABILITY-REVIEW-2026-11-10.md)

## Global Constraints

- Preserve separate operating-date occurrences throughout search, details, and bid selection.
- Keep filters that remove rows distinct from preferences that only change ranking.
- Keep unknown values unknown; do not alter pairing score formulas in this task.
- Keep original source text and structured Details as separate views.
- Do not claim physical iOS, human-pilot, VoiceOver, or formal WCAG validation without performing those checks.

## Review Focus

- Changing a ranking preference must not remove results; changing a hard filter must visibly affect results.
- Adding a bid must be an explicit action and preserve the selected recurrence date.
- Compact mobile itinerary details must retain day, leg, block, and layover context.
- Opening and closing either pairing dialog must give keyboard users predictable focus behavior.
- Saving or cancelling a ranking profile must not silently discard or overwrite an unintended profile.

---

### Task 1: Clarify Viewer controls and mobile navigation

**Files:**
- Modify: `index.htm`
- Test: `tests/quality.test.cjs`

- [x] Add regression checks that filters and ranking preferences are visibly grouped and every top-level tab has a persistent or explicit accessible name.
- [x] Verify the new checks fail against the current markup.
- [x] Separate **Remove results** filters from **Change ranking** preferences. Move preferred duration into ranking preferences and explain the effects of each group.
- [x] Keep compact but visible tab names at phone widths; communicate the selected tab programmatically.
- [x] Expose the active ranking preset to assistive technology and clear preset selection when custom weights are applied.
- [x] Run the targeted tests and confirm they pass.

### Task 2: Make pairing actions explicit and mobile Details readable

**Files:**
- Modify: `index.htm`
- Test: `tests/quality.test.cjs`

- [x] Add regression checks that pairing inspection uses a real button, bid addition uses a separate labeled button, and row clicks do not add a bid.
- [x] Verify the interaction checks fail before implementation.
- [x] Add accessible Pairing, Details, and Add controls to Viewer and Bid Builder tables; remove implicit whole-row bid addition.
- [x] Render a stacked itinerary leg view on narrow phones while retaining the aligned table on wider screens; preserve duty-day block totals and separate rest/layover rows.
- [x] Run the targeted tests and confirm they pass.

### Task 3: Complete pairing dialog focus handling and filter labels

**Files:**
- Modify: `index.htm`
- Test: `tests/quality.test.cjs`

- [x] Add checks for labelled search/filter controls and dialog focus return/trapping hooks.
- [x] Verify the checks fail against current markup and behavior.
- [x] Add persistent filter labels, field grouping, and full modal focus lifecycle for both pairing dialogs.
- [x] Run the targeted tests and confirm they pass.

### Task 4: Replace native ranking-profile prompt with an in-app flow

**Files:**
- Modify: `index.htm`
- Test: `tests/quality.test.cjs`

- [x] Add tests for opening the save dialog, saving a named profile, handling blank names, and cancelling without changing saved profiles.
- [x] Verify tests fail before implementation.
- [x] Implement an accessible in-app save dialog with validation, focus management, and visible save confirmation.
- [x] Run the targeted tests and confirm they pass.

### Task 5: Update project records and verify

**Files:**
- Modify: `docs/CHANGE-LIST.md`
- Modify: `docs/QUALITY-REPORT.md`

- [x] Record delivered improvements and remaining physical-device/human validation.
- [x] Run the full regression and harness suites, harness pack validation, syntax check, and `git diff --check`.
- [x] Review every plan constraint and report any remaining gap honestly.
