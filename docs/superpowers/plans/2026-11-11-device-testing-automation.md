# Phone and Tablet Testing Automation Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add and run repeatable local phone/tablet browser usability checks with reviewable evidence.

**Architecture:** Use Playwright Test against the existing allowlisted local static server. Seed a synthetic M302W pairing in the test browser, exercise key bidder journeys at multiple viewport and browser-engine profiles, and attach visual/accessibility artifacts to each run.

**Tech Stack:** Node.js, `@playwright/test`, `@axe-core/playwright`, existing Node usability server.

**Spec:** [Phone and Tablet Testing Design](../specs/2026-11-11-device-testing-automation-design.md)

## Global Constraints

- Synthetic fixture only; do not upload or include actual bid PDFs.
- Playwright WebKit is not actual iOS Safari.
- Loopback-only server for automated runs; physical LAN server remains a separate documented workflow.
- Keep agent observations distinct from human-pilot findings.

## Review Focus

- Recurring dates stay separate in the fixture and table.
- Inspecting a pairing never adds it to the bid; only the clicked date's Add action does.
- Phone and iPad layouts do not cause page-wide horizontal overflow.
- Dialogs remain distinguishable and usable at narrow viewports.
- Browser-engine or fixture setup failures fail clearly instead of appearing as successful coverage.

---

### Task 1: Add a runnable Playwright project

**Files:**
- Create: `package.json`, `package-lock.json`, `playwright.config.cjs`
- Modify: `.gitignore`, `usability/README.md`

- [x] Add commands for the existing regression suite and Playwright suite.
- [x] Define desktop, iPhone-sized, and iPad portrait/landscape projects for Chromium and WebKit.
- [x] Start the app through the existing server bound to `127.0.0.1`; capture screenshots and retain video/trace on failure.
- [x] Install browser binaries and confirm Playwright lists all projects.

### Task 2: Cover high-value bidder interactions with a synthetic fixture

**Files:**
- Create: `tests/e2e/bidder-usability.spec.cjs`

- [ ] Add a test fixture that seeds the existing app parser with the synthetic four-date M302W schedule before app startup.
- [ ] Assert all four dates are visible, inspect both distinct dialogs, add one exact date, and verify no implicit row-add behavior.
- [ ] Check page-wide overflow and capture a Viewer screenshot for each profile.
- [ ] Run the focused suite and correct any real app issues exposed by it. **Not run in this session:** local browser access is blocked by the active computer-use policy, which also disallows using another local browser route as a workaround.

### Task 3: Add accessibility evidence and finish the guide

**Files:**
- Modify: `tests/e2e/bidder-usability.spec.cjs`, `usability/README.md`, `docs/QUALITY-REPORT.md`, `docs/CHANGE-LIST.md`

- [x] Attach axe results for serious and critical violations; fail the automated gate on critical findings.
- [x] Document local commands, generated artifacts, profile coverage, and limits versus actual iOS/iPadOS.
- [ ] Run Playwright, all existing regression tests, usability pack validation, syntax checks, and `git diff --check`. **Partial:** existing regressions, usability validation, syntax, and config listing passed; browser execution and `git diff --check` remain.
