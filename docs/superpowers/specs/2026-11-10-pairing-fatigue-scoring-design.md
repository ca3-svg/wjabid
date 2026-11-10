# Pairing Fatigue Scoring Design

## Intent

Let a pilot compare the schedule-related fatigue exposure of one pairing at a time and choose which pairing-only scoring view affects ranking. The app must explain every score and its assumptions.

## Research finding

No universal industry-wide numeric score exists for an isolated pairing. Biomathematical models such as FAID and SAFTE/FAST estimate fatigue/alertness from work-rest schedules and sleep/circadian assumptions; some are licensed tools. They should not be imitated as if their outputs were available from this app. Transport Canada's example matrix describes work across a seven-day window and is not a universal pilot score.

## Selected design

Provide five app-defined pairing-only views, with higher numbers meaning more schedule exposure:

- **Balanced:** arithmetic mean of the available recovery, night-timing, workload, and time-zone component scores.
- **Recovery:** mean layover exposure, with each known layover scored as `100 × (1 − min(hours, 24) / 24)`.
- **Night timing:** percentage of known departure/arrival endpoints scheduled from 22:00 through 05:59 local time.
- **Workload:** average legs per duty day, scaled from 0 at zero legs/day to 100 at four or more legs/day.
- **Time zone:** largest known per-leg UTC-offset change, scaled from 0 at zero hours to 100 at six or more hours.

The selected view is shown in the Viewer, pairing modal, and ranking explanation. A fatigue-weight slider controls how much the selected score lowers the existing pairing rank. Unknown factors remain unknown; Balanced averages only available components and shows coverage. Saved ranking profiles retain the selected view and weight.

## Limits

This is a transparent schedule-comparison aid, not an industry model, regulatory compliance check, safety determination, or prediction of an individual pilot's alertness. The night-timing component uses flight-time endpoints only; it does not know report/release time for each duty, sleep, commuting, adaptation, or previous/following roster. The workload component uses flight legs per duty day and does not model all cockpit workload.

## Files

- `index.htm`: calculation, control, explanations, table, modal, ranking and persistence.
- `tests/quality.test.cjs`: formulas, profile selection, ranking impact, persistence, and disclosure checks.
- `docs/CHANGE-LIST.md` and `docs/QUALITY-REPORT.md`: delivery record.
