# Pairing Fatigue Scoring Implementation Plan

> **For agentic workers:** Execute this plan inline, task by task. Use a failing test before implementation for every behavior change.

**Goal:** Add selectable, explainable pairing-only schedule-exposure scores and let users include the selected score in Viewer ranking.

**Architecture:** Keep the score functions in the existing single-page app. Calculate four transparent components from parsed legs and layovers, apply one of five user-selected views, show the formula and data coverage, and persist the selected view and ranking weight with existing preferences.

**Tech Stack:** Existing HTML, inline JavaScript, Tabulator, localStorage, Node test harness.

**Spec:** `docs/superpowers/specs/2026-11-10-pairing-fatigue-scoring-design.md`

## Global Constraints

- Do not name this an industry standard, Transport Canada score, or fitness-for-duty result.
- Higher exposure scores are worse for pairing ranking.
- Missing data must remain unknown, not be treated as zero exposure.
- Keep existing hard filters and bid limits unchanged.

## Review Focus

- A pairing with no layover must not receive a zero recovery score; show recovery as unavailable.
- A pairing with unknown airport/time-zone data must not receive a fabricated zero time-zone score.
- Local departure/arrival times at the late-night boundary must be classified consistently.
- Loading an old saved profile without fatigue fields must restore safe defaults.
- A selected fatigue weight of zero must leave ranking unchanged by the fatigue component.

---

### Task 1: Scoring calculations and disclosure

**Files:** `index.htm`, `tests/quality.test.cjs`

- [x] Add failing tests for component values, all five scoring views, unknown coverage, and a zero-weight rank comparison.
- [x] Run the focused tests and confirm they fail for missing behavior.
- [x] Implement the component calculations and score profile metadata.
- [x] Run focused tests and confirm they pass.

### Task 2: Viewer controls, score display, and persistence

**Files:** `index.htm`, `tests/quality.test.cjs`

- [x] Add failing tests for the profile selector, ranking penalty, and profile save/load/reset.
- [x] Run focused tests and confirm they fail for missing behavior.
- [x] Add the selector, calculation details, ranking weight, fatigue column, modal component breakdown, and saved-profile support.
- [x] Run the complete quality suite.

### Task 3: Documentation and final verification

**Files:** `docs/CHANGE-LIST.md`, `docs/QUALITY-REPORT.md`

- [x] Record the selected scoring views and their limitations.
- [x] Run `node --test tests/quality.test.cjs` and report the final result.
