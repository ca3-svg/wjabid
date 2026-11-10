# Viewer-Led Bidder Implementation Plan

> **For agentic workers:** Execute task-by-task in this session; keep changes small and review each deliverable.

**Goal:** Show one independently selectable bidder row per pairing operating date, then make the Viewer a simpler, preference-driven workspace without breaking GDO planning or bid building.

**Architecture:** Keep parsed recurrence blocks in `allPairings`. Add an occurrence expansion layer for Viewer rows and bid candidates so one selected instance has one start date and only its own work dates. Reuse the existing inline JavaScript and localStorage; add a small bundled airport metadata module if needed.

**Tech Stack:** `index.htm` (vanilla JavaScript, Tabulator, localStorage); existing Python parser remains unchanged unless parity requires a specific fix.

**Spec:** `docs/superpowers/specs/2026-11-09-viewer-led-bidder-design.md`

**Status:** Implemented in the current workspace. The user-facing backlog is tracked in `docs/CHANGE-LIST.md`.

## Global Constraints

- Keep GDO Planner and Bid Builder as separate tabs.
- Do not treat extracted PDF text as HTML.
- Mark missing airport metadata as Unknown and exclude it from ranking.
- Treat existing simplified rule checks as advisory, not compliance certification.
- Do not silently assign a date to a legacy saved recurring bid.

## Review Focus

- Recurrence block with one, several, and split operating dates: one result per occurrence.
- Same pairing number with different itinerary/date blocks: retain distinct valid choices.
- One selected occurrence: only that occurrence's work dates affect GDO, overlap, and rest checks.
- Old localStorage data: preserve ambiguous multi-date selections without inventing a date.
- Missing airport/time-zone metadata and non-ASCII PDF text: show safely and avoid biased ranking.

---

### Task 1: Occurrence model

**Files:** Modify `index.htm`.

- Add a helper that expands each grouped pairing into one instance per `operating_dates` entry.
- Give each instance an identity based on pairing, operating date, and itinerary discriminator.
- Rebuild its `calendar` and `all_dates` for only that occurrence.
- Preserve source records in `allPairings` and show the occurrence date in the Viewer.

**Deliverable:** Viewer rows represent individual dates, including M302W on Dec 8, 15, 22, and 29.

### Task 2: Bid selection and compatibility

**Files:** Modify `index.htm`.

- Feed occurrence instances to Bid Builder; remove pairing-number-only collapse.
- Prevent duplicate selection by occurrence identity while allowing same pairing number on different dates.
- Apply GDO, overlap, credit/day, and configured calendar-rest constraints to the selected occurrence.
- Route manual additions through the same checks as auto-fill.
- Preserve old multi-date saved selections as visibly unspecified legacy entries.

**Deliverable:** One date choice occupies only its own schedule dates and remains a distinct bid slot.

### Task 3: Viewer usability and adjustable ranking

**Files:** Modify `index.htm`.

- Simplify the first tab with common search, ranking controls, compact result summary, and collapsed advanced filters.
- Add live, separately labeled hard filters and soft ranking weights.
- Rank using credit/work efficiency, legs per duty day, shortest/average/longest layover, commute preference, and time-zone burden.
- Add concise score reasons and a reset-to-default action; persist preferences in localStorage.
- Add a detail/compare presentation without removing GDO Planner or Bid Builder tabs.

**Deliverable:** User can change preferences and immediately inspect the reordered date-specific choices.

### Task 4: Airport context

**Files:** Modify `index.htm`; create `airport-metadata.js` only if separation improves maintainability.

- Add country/region and IANA time-zone metadata for airports represented in supported pairing PDFs.
- Classify US, Caribbean, Canada, other, or Unknown.
- Calculate per-leg and maximum absolute time-zone shift for the operating date, accounting for DST.
- Keep unmapped codes explicit and out of score contributions.

**Deliverable:** Results can be filtered/scored by layover region and time-zone change.

### Task 5: Saved data and exports

**Files:** Modify `index.htm`.

- Keep old saved uploads readable.
- Make bid render, reorder, replacement, schedule modal, and export operate on selected occurrence identity and date.
- Preserve raw grouped PDF data for detail inspection.

**Deliverable:** Reload/export retains the exact date-specific choices.

## Verification completed

- The inline application JavaScript passes `node --check`.
- The supplied December PDF parses M302W as Dec 8, 15, 29 in the recurring block and Dec 22 in a separate block.
- The app's actual occurrence-expansion helper returns four rows for those dates, with work dates limited to each selected instance.
- Browser preview could not open the local `file:` page because the browser safety policy blocks that protocol; no alternate browser route was attempted.
