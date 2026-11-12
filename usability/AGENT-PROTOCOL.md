# WJA Bid agent usability protocol

## Purpose

Use an AI computer-use agent to explore bidder tasks through the rendered application. The agent is an additional evaluator, not a simulated pilot and not a replacement for pilots using the app themselves.

## Session protocol

1. Choose one platform profile from `platforms.json`. Label the run as emulated or actual-device; never report an emulated iPhone viewport as an iPhone Safari result.
2. Use a clean browser profile and a redacted or synthetic bid PDF. Complete `AGENT-RUN.md` setup before starting each task.
3. Give the agent only `AGENT-RUN.md` and visible access to the app. It may use the accessibility tree to locate and operate controls, but keep application source, raw DOM inspection, DevTools, storage, and network logs out of its exploratory view.
4. Do not show `EVALUATOR-NOTES.md` to the agent. It gives the reviewer criteria to use after the run.
5. Have the agent pursue each goal without step-by-step directions. If the agent is blocked, allow one reasonable recovery attempt and record the stopping point.
6. Preserve screenshots or short recordings for friction or failure. Record what was observed separately from why the reviewer thinks it happened.
7. Review each item in `findings.json`, reproduce it, assign severity and confidence, and mark whether a pilot needs to validate it.
8. Validate high-impact usability findings with pilots on their usual devices. Agent completion time is not comparable to a person's task time.

## Evidence rules

- **Observation:** a click, scroll, choice, mistaken interpretation, visible wait, or statement in the run. Avoid inferred thoughts.
- **Expected:** the goal the bidder was attempting to accomplish.
- **Reproduction:** a short sequence another reviewer can repeat from the same starting state.
- **Severity:** 1 cosmetic; 2 minor friction; 3 task-blocking or likely to cause a material mistake; 4 critical task or data-integrity failure.
- **Confidence:** how clearly the evidence supports the finding, not how certain the agent sounds.
- **Human validation:** use `needs-pilot-validation` for issues involving human perception, domain preference, trust, or real-device handling.

## Device coverage

- Emulated profiles are for repeatable viewport and touch-layout checks. They do not reproduce iOS Safari, its file picker, or every OS-level behavior.
- The physical iPhone and iPad profiles cover Safari, the device file picker, orientation, browser storage, touch, and the virtual keyboard. For iPad, include Split View when available.
- Real-device Safari automation through Apple's WebDriver requires an enabled iPhone/iPad connected to a Mac. Without that setup, run the device session with a pilot and use the harness to standardize the tasks and report.

## Research basis

- UXAgent positions simulated testing as a way to refine usability studies before human sessions: [UXAgent paper](https://arxiv.org/abs/2502.12561).
- A 2026 comparison found human and LLM evaluators caught some different issues, supporting complementary use: [Penn State study](https://pure.psu.edu/en/publications/ai-can-see-what-you-can-t-see-how-llm-agents-complement-human-base/).
- A 2026 study found simulated-user outcomes varied by model and could miscalibrate task difficulty; do not interpret agent success as a human success rate: [ACL study](https://aclanthology.org/2026.acl-long.2192/).
- Mobile coverage should include WCAG 2.2 considerations such as reflow, orientation, resizing text, focus order, and target size: [W3C mobile guidance](https://www.w3.org/TR/wcag2mobile-22/).
