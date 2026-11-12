# Human Usability Study Kit Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Prepare and preflight a practical, privacy-conscious human usability study for WJA Bid.

**Architecture:** Add focused Markdown materials under `usability/human-study/`. Keep participant tasks separate from evaluator outcomes and record the agent rehearsal separately from human evidence. Link the study kit from the project and usability guides.

**Tech Stack:** Markdown, existing static app, Node regression suite, local browser rehearsal.

**Spec:** `docs/superpowers/specs/2026-11-10-human-usability-study-design.md`

## Global Constraints

- No participant or human outcome may be invented.
- First round is qualitative discovery, not a statistical usability score.
- Use redacted/synthetic bid data by default; recording is optional and separately consented.
- Real-device Safari findings must come from physical devices.

## Review Focus

- Neutral task wording does not teach the interface.
- Human evidence fields distinguish observation, participant statement, and evaluator interpretation.
- Privacy instructions cover personal bids and recordings.
- The rehearsal is explicitly labeled agent/preflight evidence.
- Device emulation is never described as real iOS Safari.

---

### Task 1: Write the moderator and participant kit

**Files:**
- Create: `usability/human-study/README.md`
- Create: `usability/human-study/MODERATOR-GUIDE.md`
- Create: `usability/human-study/TASK-CARDS.md`
- Create: `usability/human-study/PARTICIPANT-CONSENT.md`
- Create: `usability/human-study/OBSERVATION-SHEET.md`
- Create: `usability/human-study/DEVICE-ACCESSIBILITY-CHECKLIST.md`

- [x] Write neutral, realistic tasks for search/comparison, date-specific selection, ranking comprehension, and mobile use.
- [x] Include moderator introduction, think-aloud prompt, neutral rescue prompts, task ratings, wrap-up, evidence capture, and data handling.
- [x] Include device checks for physical iOS Safari and distinguish them from emulation.

### Task 2: Link the kit and record preflight

**Files:**
- Modify: `README.md`
- Modify: `usability/README.md`
- Modify: `docs/CHANGE-LIST.md`
- Create: `usability/human-study/PREFLIGHT-REPORT.md`

- [x] Link the human study kit next to the agent harness and explain their different roles.
- [x] Rehearse app readiness and task flows with visible UI; write only observed results and identify the run as an agent rehearsal.
- [x] Record any preflight blocker without representing it as human evidence.

### Task 3: Verify deliverables

**Files:**
- Modify: `docs/QUALITY-REPORT.md`

- [x] Run the existing regression suite, usability pack validation, JavaScript syntax check, and diff whitespace check.
- [x] Record check results and confirm documentation paths.
