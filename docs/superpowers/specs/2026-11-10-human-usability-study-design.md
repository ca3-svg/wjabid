# Human Usability Study Kit — Design

## Intent

Help the WJA Bid owner learn from real pilots whether the app supports real bidding decisions across desktop, iPhone, and iPad. Existing agent runs are exploratory evidence only; this study must not treat an AI agent as a pilot or infer human success from agent success.

## Goals

- Provide a neutral moderator guide, participant information/consent checklist, task cards, observation sheet, and accessibility/device checklist.
- Run a small moderated discovery round, revise the app, then repeat the same core tasks to see whether use improves.
- Record observable behavior separately from participant statements and evaluator interpretations.
- Protect bid and participant information by default; avoid recording real pairing documents unless participants knowingly choose to and secure handling is agreed.

## Non-goals and anti-goals

- This kit does not recruit participants, provide legal approval, or claim statistical representativeness.
- It does not assess flight safety, fitness for duty, regulatory compliance, or certify a fatigue score.
- It must not coach participants toward controls, disclose evaluator success criteria, or use agent findings as human findings.
- Do not add third-party session replay or analytics to an app that may contain personal bid data as part of this work.

## Approach

Use 5–6 actual pilots in the first qualitative round, selected to include different levels of familiarity with the app and a mix of common devices. Treat that size as a practical discovery round, not a population estimate. Use 4–5 neutral, realistic tasks in 45–60 minute moderated sessions. Have participants think aloud; the moderator observes, avoids coaching, and asks for ease and confidence after each task. Analyze immediately after sessions, rank problems by task impact and evidence, make changes, then repeat the stable core tasks. A larger benchmark is a separate decision if comparable population-level metrics are later needed.

For this static browser app, use a pilot's own device when feasible: desktop Chromium, iPhone Safari, or iPad Safari in portrait and landscape. Automated Playwright emulation is supplementary. Use axe-core plus manual keyboard, zoom, and screen-reader checks for accessibility; automated accessibility scans do not measure comprehension or workflow usability.

## Data handling

Default to a synthetic or redacted December bid PDF. Obtain informed, voluntary consent before a session. Recording is optional and needs separate consent. Do not collect names, employee numbers, pairing preferences, or real schedules in the observation log. Keep session files access-limited and delete recordings after the agreed analysis period; the moderator must set that period before recruitment.

## Deliverables

- `usability/human-study/README.md`: how to run the study and evidence boundaries.
- `usability/human-study/MODERATOR-GUIDE.md`: session script and neutral prompts.
- `usability/human-study/TASK-CARDS.md`: participant-facing scenarios, separate from expected outcomes.
- `usability/human-study/PARTICIPANT-CONSENT.md`: plain-language information and consent checklist.
- `usability/human-study/OBSERVATION-SHEET.md`: reusable evidence and task scoring form.
- `usability/human-study/DEVICE-ACCESSIBILITY-CHECKLIST.md`: platform and manual accessibility checks.
- `usability/human-study/PREFLIGHT-REPORT.md`: rehearsal outcome, explicitly not a human session.

## Evidence base

- [GOV.UK moderated usability testing](https://www.gov.uk/service-manual/user-research/using-moderated-usability-testing)
- [GOV.UK usability benchmarking](https://www.gov.uk/service-manual/measuring-success/usability-benchmarking-a-website-or-whole-service)
- [W3C WCAG 2.2](https://www.w3.org/TR/WCAG22/)
- [Apple Human Interface Guidelines: Buttons](https://developer.apple.com/design/human-interface-guidelines/buttons)
- [Playwright device emulation](https://playwright.dev/docs/emulation)
- [axe-core](https://www.deque.com/axe/axe-core/)
- [Clear Skies, Clear Interface: user-centered design of a mobile duty-roster application for pilots](https://ceur-ws.org/Vol-4077/paper12.pdf)

## Decisions left to the owner

Recruitment, participant incentives, recording retention, and whether real rather than redacted bid PDFs may be used are operational decisions for the owner. Do not schedule or claim human sessions without participant availability and consent.
