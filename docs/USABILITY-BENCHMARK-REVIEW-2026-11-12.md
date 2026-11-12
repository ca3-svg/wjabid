# Usability benchmark review — 2026-11-12

## Scope and method

An independent agent reviewed the saved desktop, iPhone, and iPad emulation screenshots produced by the browser usability suite. Its separate live task run could not attach to the app, so none of the seven bidder tasks were completed. This is a limited visual review, not a human study or a complete usability evaluation.

## Ranked observations

| Rank | Observation | Review rating | Evidence scope |
|---:|---|---:|---|
| 1 | On phone layouts, the results table extends beyond the viewport. The iPhone WebKit capture includes a swipe hint; the Chromium capture shows only part of the table. | 3/5 | iPhone Chromium and WebKit emulation screenshots |
| 2 | In portrait iPad layouts, the app title, navigation, and monthly summary wrap onto additional lines, adding vertical density above the results. | 3/5 | iPad portrait Chromium and WebKit emulation screenshots |
| 3 | The Favorites dialog adapts to the captured narrow screens; the saved pairing, date, route, credit, leg count, layover, and actions remain visible. | 4/5 | iPhone and iPad portrait screenshots |

Ratings are scoped to visible screenshot evidence and are not benchmark scores for the app as a whole. Heuristic impressions, where shown in the run report, are also limited to the Favorites screen.

## Unmeasured areas

The live tasks were blocked before the app UI opened. Task effectiveness, human efficiency and satisfaction, SUS, keyboard and screen-reader behavior, interactive focus, measured contrast, physical iOS behavior, and WCAG conformance were not assessed. No human participants took part and no WCAG conformance claim is made.

The original run materials and screenshot evidence are generated locally under `usability/runs/` and `test-results/device-usability/`; those artifacts are intentionally excluded from Git. The harness instructions in [usability/README.md](../usability/README.md) describe how to reproduce the sessions.
