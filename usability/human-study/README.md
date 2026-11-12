# Human usability study kit

This kit is for observing **real pilots** using WJA Bid. It complements the [agent usability harness](../README.md); an agent can expose visible friction, but cannot stand in for a pilot's understanding, preferences, or confidence.

## First round

- Recruit 5–6 actual pilots for a qualitative discovery round. Include different levels of comfort with the app and, across the group, desktop, iPhone Safari, and iPad Safari. This small round finds issues to investigate; it is not a representative usability score.
- Run one 45–60 minute moderated session per participant. Use no more than five tasks. The moderator should mostly observe and avoid explaining controls.
- Use the participant's usual device when possible. Test physical iOS Safari on physical devices; viewport emulation is only a layout check.
- Use a synthetic or redacted December bid PDF by default. Obtain consent before the session. Recording is optional and requires separate consent.
- Record task success, wrong-date or bid-selection errors, help needed, time when practical, ease (1–5), and confidence (1–5). A small discovery sample is for patterns and examples, not statistical claims.
- After the round, group observations by task and impact, choose the highest-risk fixes, then repeat the same core tasks after changes.

## Run a session

1. Read [PARTICIPANT-CONSENT.md](PARTICIPANT-CONSENT.md) and confirm consent before opening the app or starting a recording.
2. Follow [MODERATOR-GUIDE.md](MODERATOR-GUIDE.md). Give the participant only the task cards in [TASK-CARDS.md](TASK-CARDS.md), one at a time.
3. Fill a fresh copy of [OBSERVATION-SHEET.md](OBSERVATION-SHEET.md). Keep observed behavior, participant words, and evaluator interpretation in separate fields.
4. Complete [DEVICE-ACCESSIBILITY-CHECKLIST.md](DEVICE-ACCESSIBILITY-CHECKLIST.md) for the device used.
5. Store notes without names or employee identifiers in a restricted location. Agree a recording deletion date before recording; delete recordings after analysis and any agreed review window.

## Evidence and tools

- `Playwright` device emulation supports repeatable viewport checks, but does not reproduce physical iOS Safari, its file picker, or OS keyboard behavior: [Playwright documentation](https://playwright.dev/docs/emulation).
- `axe-core` can automate some accessibility checks. Pair it with keyboard, zoom, and screen-reader use; a scan cannot judge whether a pilot understands a ranking or can complete a bid: [axe-core](https://www.deque.com/axe/axe-core/).
- Check WCAG 2.2 and aim for 44 × 44 pt iPhone/iPad button hit regions per Apple's guidance: [WCAG 2.2](https://www.w3.org/TR/WCAG22/), [Apple buttons](https://developer.apple.com/design/human-interface-guidelines/buttons).
- Moderated task guidance: [GOV.UK](https://www.gov.uk/service-manual/user-research/using-moderated-usability-testing). A pilot roster study reported issues with scrolling, icon clarity, abbreviations, and navigation even after a high overall usability score: [study](https://ceur-ws.org/Vol-4077/paper12.pdf).

## What this kit does not do

It does not recruit people, grant legal approval, set compensation, validate fatigue science, or certify flight safety. It does not authorize recording or the use of personal bid data. The app should not be presented as an operational flight-deck tool.
