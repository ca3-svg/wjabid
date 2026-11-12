# Pairing Favorites Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Let bidders favorite an individual operating-date choice and revisit it in a responsive header-star modal.

**Architecture:** Store favorite occurrence IDs in the existing `westjet_bid_data` localStorage object. Add an accessible outline/filled star column to the Viewer table and a header star with count; render favorites as responsive cards in the existing accessible-dialog pattern.

**Tech Stack:** Existing `index.htm`, Tabulator 5.5.2, Tailwind CDN, vanilla JavaScript, Node test harness, Playwright.

**Spec:** `docs/superpowers/specs/2026-11-11-pairing-favorites-design.md`

## Global Constraints

- Keep date-specific choices independent.
- Keep favorites separate from bid selections; favoriting must not add to the bid.
- Preserve old saved app data by defaulting missing favorite data to an empty list.
- Use no new runtime dependency; retain keyboard and touch accessibility.

## Review Focus

- A recurring pairing can be favorited on one date without favoriting the other occurrences; test exact IDs.
- Favorites survive save/reload and older data loads empty; test persistence and migration.
- Removing in the modal updates both the list and row star; test toggle behavior.
- Empty favorites and a pairing with changed/missing source details render safely; test empty state and browser interaction.
- Phone modal content remains within the viewport and scrolls internally; assert no page-wide overflow in mobile emulation.

---

### Task 1: Favorite state and Viewer star

**Files:**
- Modify: `index.htm`
- Test: `tests/quality.test.cjs`

**Interfaces:**
- State: `favoriteOccurrenceIds: Set<string>`
- Actions: `togglePairingFavorite(occurrenceId)`, `isPairingFavorite(occurrenceId)`

- [x] Write failing tests for saving/loading favorite IDs and independent occurrence toggles.
- [x] Run `npm test` and confirm the new tests fail because favorites are not implemented.
- [x] Add backwards-compatible persistence and an accessible star column to the Viewer; ensure the action does not alter `bidList`.
- [x] Run `npm test` and confirm the favorite unit tests pass.

### Task 2: Responsive favorites modal

**Files:**
- Modify: `index.htm`
- Test: `tests/e2e/bidder-usability.spec.cjs`

**Interfaces:**
- Actions: `openFavoritesModal(opener)`, `closeFavoritesModal()`, `renderFavoritesModal()`
- Existing `openAccessiblePairingDialog` handles focus, Escape, and focus return.

- [x] Write failing browser assertions for star activation, modal contents/count, exact date, removal, empty state, Details launch, and phone overflow.
- [x] Run the relevant Playwright profile and confirm it fails before implementation.
- [x] Add the responsive header star, count, favorite cards, remove/Details actions, and empty state.
- [x] Run the browser test in desktop, iPhone, and iPad profiles and confirm it passes.

### Task 3: Full verification and list update

**Files:**
- Modify: `docs/CHANGE-LIST.md`, `docs/QUALITY-REPORT.md`

- [x] Run `npm test`, all eight `npm run test:e2e` profiles, usability harness validation, and `git diff --check`.
- [x] Record results, screenshot locations, and local-browser storage limits.
