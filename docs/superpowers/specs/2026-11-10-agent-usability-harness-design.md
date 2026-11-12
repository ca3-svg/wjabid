# Agent Usability Harness Design

## Intent

Create a repeatable, agent-led usability workflow for WJA Bid that exercises the visible product through bidder goals and records reproducible, evidence-backed findings across desktop, iPhone, and iPad contexts.

## Goals

- Keep tasks grounded in real bidder workflows: date-specific pairing choice, comparison/ranking, layover and time-zone preferences, and bid construction.
- Separate the agent-facing task brief from evaluator success criteria to reduce leading the agent.
- Support emulated viewport runs and actual iOS Safari sessions, with clear labels for which was used.
- Produce a consistent run bundle and finding structure that can be reviewed and compared over time.
- Serve only the app's entry page and airport metadata for testing on a private local network, with no upload endpoint or application data collection.
- Work with Codex computer-use or another UI-driving agent without requiring a paid model API or proprietary agent framework.

## Non-goals

- Claim that an LLM agent represents a real pilot or replaces pilot testing.
- Automate the language model or make judgments about fatigue, legality, or fitness for duty.
- Upload bids, recordings, screenshots, or findings to an external service.
- Treat desktop device emulation as equivalent to real iPhone/iPad Safari.

## Constraints

- WJA Bid is a static browser app; the PDF library is loaded from a CDN and app state is stored in browser local storage.
- Use Node built-ins only for harness setup and run generation.
- The optional local-network server must allowlist only `index.htm` and `airport-metadata.js`, default to loopback, and provide no file upload route.
- Run data should be generated locally and ignored by Git.

## Approach

Use a small Node CLI with task and platform manifests. `check` validates the manifests; `prepare` creates a run bundle with separate agent and evaluator briefs plus empty findings; `serve` provides a minimal local-only static server for connecting physical devices on the same trusted LAN. The agent drives the rendered UI and receives only the task prompt. A human reviewer judges findings and validates them with pilots.

## Expected deliverables

- `usability/harness.mjs` CLI for validation, run preparation, and local serving.
- `usability/tasks.json`, `usability/platforms.json`, `usability/finding-schema.json`, and `usability/AGENT-PROTOCOL.md`.
- `usability/README.md` run guide.
- Node regression tests for manifest validation, task/evaluator separation, invalid inputs, and server file allowlisting.
- README pointers to the harness and its safety boundary.
