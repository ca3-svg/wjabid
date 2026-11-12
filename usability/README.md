# WJA Bid usability harness

This harness gives a UI-driving agent a consistent bidder task, device setup, and finding format. It creates session materials; it does not itself call an LLM or claim that the agent represents a human pilot.

## Start a session

From the repository folder:

```powershell
node usability/harness.mjs check
node usability/harness.mjs prepare --platform desktop-chromium --task pairing-date-choices
```

The command prints the local folder for the run. Give the agent **only** that folder's `AGENT-RUN.md`, plus visible control of the app. Keep `EVALUATOR-NOTES.md` for the reviewer. Add more `--task <id>` options to include selected tasks; omit `--task` to include all seven. Each platform needs its own run bundle.

The run folder includes:

- `AGENT-RUN.md` — neutral bidder task instructions and session rules.
- `EVALUATOR-NOTES.md` — expected outcomes and risk areas; do not give this to the agent.
- `RUN-REPORT.md` — task outcome summary and follow-up notes.
- `findings.json` and `finding-schema.json` — structured evidence and review status.
- `run.json` — platform, URL, task IDs, and fields for agent/model metadata.

Generated runs are local and ignored by Git under `usability/runs/`. To save one elsewhere, pass `--out <directory>`.

## Test desktop or emulated phone/tablet layouts

Choose `desktop-chromium`, `iphone-portrait`, `ipad-portrait`, or `ipad-landscape`. Configure the browser to the viewport and touch settings shown in `platforms.json`. Device emulation is useful for repeatable layout and interaction coverage, but is not an iOS Safari test.

Example:

```powershell
node usability/harness.mjs prepare --platform iphone-portrait --task mobile-load-and-return
```

### Run the automated browser checks

The Playwright suite uses a synthetic four-date M302W schedule, starts the app server on loopback, exercises the pairing and bid actions, checks page overflow, and attaches screenshots plus an axe accessibility report. It tests Chromium and Playwright WebKit at desktop, phone, and tablet sizes. Playwright WebKit is a separate WebKit build and **does not count as actual iOS Safari testing**.

From the repository folder, install dependencies and browsers once, then run:

```powershell
npm ci
npx playwright install chromium webkit
npm test
npm run test:e2e
```

The HTML summary is written to `playwright-report/`; screenshots, accessibility findings, and failure traces are under `test-results/device-usability/`. These folders are local and ignored by Git. `npm run test:e2e:list` lists the browser and device-size runs without starting them. The automated suite uses only the synthetic schedule in `tests/e2e/bidder-usability.spec.cjs`; do not substitute an actual crew bid when using a third-party device cloud.

Automated checks cover repeatable interface behavior and common accessibility rules. They do not assess whether pilots understand the ranking or prefer the layout. Use the human study kit for those questions.

## Test on iPhone or iPad Safari

The app is a local static site, so a physical device needs a URL on the same network as the computer serving it. Start the small allowlisted server on a trusted private LAN:

```powershell
node usability/harness.mjs serve --host 0.0.0.0 --port 4173
```

Open the printed **LAN device URL** in Safari on the iPhone or iPad. If the computer's firewall blocks the connection, allow access only on the private network. Use a synthetic or redacted PDF; this server has no login or encryption. It serves only `index.htm` and `airport-metadata.js`, accepts only GET/HEAD requests, and has no upload route. The app parses the selected PDF in that device's browser.

Prepare the session with the URL printed by the server:

```powershell
node usability/harness.mjs prepare --platform iphone-safari-real --task mobile-load-and-return --url http://192.168.1.20:4173/
```

Replace the example address with the LAN URL shown in the server window. Repeat with `ipad-safari-real` for iPad. Actual Safari automation using WebDriver needs an enabled device connected to a Mac. Xcode's iPhone/iPad simulators are also Mac-only and do not replace physical-device checks. Without a Mac, use a person to perform the real-device tasks while the harness standardizes task and evidence capture, or use a third-party device cloud after reviewing its current trial limits, license requirements, and data handling. The Playwright project does not connect to a third-party service or upload the test fixture.

## Finding review

Record each issue with an observation, expected outcome, repeatable steps, severity, confidence, and evidence path. Set `humanValidation` to `needs-pilot-validation` for findings that depend on human perception, trust, or device handling. Confirm agent findings by reproducing them; use pilots to validate human experience. The protocol and severity rubric are in [AGENT-PROTOCOL.md](AGENT-PROTOCOL.md).

The task pack currently covers separate pairing dates and the two pairing views, credit/workload comparison, editable ranking, layover regions and time zones, date-specific bid building, saving one recurrence as a favorite, and mobile PDF loading/return.

The agent is intentionally not shown evaluator success criteria. It should use the rendered app and may use the accessibility tree to operate controls, while avoiding source code, raw DOM inspection, storage, and network logs during exploratory runs. This helps surface discoverability and comprehension problems that scripted clicks cannot reveal.

## Testing with pilots

For real human feedback, use the separate [human study kit](human-study/README.md). It contains moderator instructions, neutral task cards, participant information and consent, an observation sheet, and device/accessibility checks. Do not treat the agent run as a pilot or as a usability score.
