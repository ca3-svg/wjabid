# Human study kit preflight — November 10, 2026

## App changes since this rehearsal — November 11, 2026

The in-app **Save setup** dialog, separate filter/ranking groups, explicit Add buttons, phone itinerary cards, and keyboard focus handling have since been implemented. They are covered by automated regressions, but have not been re-captured in a live browser or verified on a physical device. The observations below describe the earlier app version.

## Status

This is an evaluator/agent rehearsal of the study materials and visible app workflows. **No human participant has taken part.** It is not a pilot usability result, a human success rate, or a validated app score.

## Preflight checks

| Check | Status | Notes |
| --- | --- | --- |
| Study kit and neutral task cards prepared | Complete | See this folder. |
| December sample PDF available | Complete | App opened with saved December bid data (216 operating-date choices). Use redacted/synthetic data for real sessions. |
| Browser task-flow rehearsal | Complete | Visible in-app rehearsal described below; this is agent evidence only. |
| axe-core scan | Not run | Automated accessibility check is still outstanding. |
| Physical iPhone/iPad Safari session | Not run | Requires actual device and human/device interaction. |
| Human pilot sessions | Not run | Requires participant recruitment and consent. |

## Rehearsal observations

- Searching `M302W` returned four separate operating-date rows: December 8, 15, 22, and 29, 2026. The visible result order was December 8, 15, 29, then 22; it was not chronological. Confirm whether that order is intentional and understandable during human sessions.
- Clicking the pairing number opened the source-text-only modal (`Trip 258 · M302W`) for the selected December 8 occurrence. Clicking `Details` opened a distinct `PAIRING OVERVIEW` modal with the selected date, summary metrics, daily flight table, layover/rest, and fatigue exposure details.
- Selecting the December 15 M302W occurrence added `M302W` with `Date: 2026-12-15` to Bid Builder. Removing it returned the bid list to empty; no test selection was left behind.
- At the narrow in-app viewport used for this rehearsal (about 566 CSS pixels wide), the ranking controls and save button were visible. This does not establish usability on a physical phone or resolve earlier wider tablet clipping reports.
- Clicking `Save setup` produced no visible confirmation or dialog in this earlier browser session. This was low-confidence and not confirmed as a product defect; the native prompt has since been replaced by an in-app dialog that still needs a live browser and participant check.

## Human evidence

None collected.

## Next actions

1. Verify the revised layout and in-app save dialog in a regular browser, then on physical iPhone/iPad Safari.
2. Use a redacted or synthetic PDF for pilot sessions.
3. Run sessions following `MODERATOR-GUIDE.md`; do not expose evaluator notes during tasks.
4. Confirm the non-chronological result order and revised phone/tablet layouts with pilots on their regular devices.
5. Revisit this report after actual sessions; preserve the distinction between agent/preflight and human findings.
