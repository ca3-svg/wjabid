# Phone and Tablet Testing Design

## Intent

Add repeatable, low-cost browser checks for the existing WJA Bid app at desktop, phone, and tablet sizes. Produce screenshots and failure traces that make layout and task-flow problems reviewable. Keep actual iOS Safari and pilot feedback clearly separate from desktop emulation.

## Goals

- Run the app locally with an isolated synthetic M302W fixture.
- Exercise separate operating dates, original-text and Details dialogs, and explicit bid addition.
- Cover phone portrait, tablet portrait and landscape, and desktop in Chromium and Playwright WebKit.
- Detect page-level horizontal overflow and critical accessibility violations.
- Save screenshots, traces, and machine-readable accessibility findings with each run.
- Document how to run an actual-device Safari session and the limits of emulation.

## Non-goals

- Claim that Playwright WebKit is Apple's iOS Safari.
- Claim that automated agent task runs represent human pilot usability.
- Upload production bid PDFs or crew information to a third-party service.
- Require a paid BrowserStack or LambdaTest account.

## Approaches

1. **Local Playwright device profiles (selected):** Free, repeatable, and can run from this Windows project. Chromium covers touch-sized layouts; Playwright WebKit adds a second rendering engine. Both remain desktop browser builds and do not test the iOS file picker, VoiceOver, or device performance.
2. **Real-device cloud testing:** BrowserStack can provide real Safari devices and an AI/MCP control path, but requires an account, an eligible license, network access, and sends the test session through the provider. Keep this as an optional follow-up after checking trial access and use synthetic data only.
3. **Physical-device or Mac Simulator sessions:** Use the existing private-LAN server and the human study kit with a physical iPhone/iPad; or use free Xcode simulators on a Mac. These provide platform-specific evidence, but require access to that hardware and human operation for the device checks.

## Design decisions

- Add `@playwright/test` and `@axe-core/playwright` as development-only dependencies.
- Use Playwright projects for desktop Chromium, iPhone-sized Chromium and WebKit, and iPad-sized portrait/landscape Chromium and WebKit.
- Seed a synthetic pairing through test-only browser initialization so UI flows can be tested without distributing a bid PDF.
- Keep the existing app server allowlist; Playwright's web server binds only to loopback.
- Attach screenshots and axe results to the test output, retain video/trace on failure, and gate on functional failures, page overflow, and critical axe findings.
- Exclude generated browser results and installed dependencies from version control.

## Remaining decisions

- Whether to connect a paid/free-trial real-device cloud account is left for a separate decision after confirming its available license and data handling.
- Physical iPhone/iPad and human pilot sessions remain necessary to evaluate native file selection, actual Safari behavior, touch feel, and task comprehension.
