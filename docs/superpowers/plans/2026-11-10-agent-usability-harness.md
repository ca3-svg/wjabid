# Agent Usability Harness Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a reusable local harness for agent-led, evidence-based usability sessions across desktop, iPhone, and iPad.

**Architecture:** Node built-ins validate task and platform manifests, prepare isolated run bundles, and serve an allowlisted static app surface for local device sessions. The agent-facing brief excludes evaluator criteria; findings remain local JSON and Markdown.

**Tech Stack:** Node.js built-ins, JSON manifests, existing `node:test` suite.

**Spec:** `docs/superpowers/specs/2026-11-10-agent-usability-harness-design.md`

## Global Constraints

- Do not add an LLM API or vendor-specific service dependency.
- The agent must operate the visible app and must not read source code during exploratory tasks.
- Keep agent prompts separate from expected outcomes and evaluator notes.
- The local server defaults to loopback and only serves the app entry page and airport metadata.
- No real bid PDFs or generated run artifacts are committed.

## Review Focus

- Invalid task/platform values fail clearly without creating partial runs.
- Agent briefs do not reveal evaluator success criteria.
- Run generation stays outside the repository by default only when explicitly configured; default local run data is ignored.
- Local server rejects paths outside its allowlist and non-GET/HEAD methods.
- Emulated device sessions are visibly distinguished from actual-device Safari sessions.

---

### Task 1: Manifests and run-bundle CLI

**Files:**
- Create: `usability/tasks.json`
- Create: `usability/platforms.json`
- Create: `usability/finding-schema.json`
- Create: `usability/harness.mjs`
- Create: `tests/usability-harness.test.cjs`
- Modify: `.gitignore`

- [x] Write failing tests for manifest validation, preparing a run, bad identifiers, and local server allowlisting.
- [x] Run `node --test tests/usability-harness.test.cjs` and verify the missing CLI causes expected failures.
- [x] Implement `check`, `prepare`, and `serve` using Node built-ins only.
- [x] Run the focused test file and verify all harness behaviors pass.

### Task 2: Agent protocol and documentation

**Files:**
- Create: `usability/AGENT-PROTOCOL.md`
- Create: `usability/README.md`
- Modify: `README.md`

- [x] Document how to run an unbiased visible-UI session, use the local test server, select emulation versus real-device Safari, and record issues without treating the agent as a human proxy.
- [x] Add concise setup/command references to the project README.
- [x] Run `node usability/harness.mjs check` and the complete regression suites (`node --test tests/quality.test.cjs tests/usability-harness.test.cjs`).
