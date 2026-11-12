# Device and accessibility checklist

Complete the relevant section during each human session. Record pass, friction, or not tested with a brief observation.

## All devices

- [ ] App and sample PDF load without losing the participant's place.
- [ ] Every pairing recurrence date is visibly separate; the selected date remains clear in details and bid building.
- [ ] Pairing source-text and structured Details are distinguishable.
- [ ] Ranking targets are distinguishable from filters that remove results.
- [ ] Changes to ranking are understandable; unknown time-zone data is not read as zero.
- [ ] Save/restore gives clear feedback and retains the intended preferences.
- [ ] Text remains usable at 200% zoom / text enlargement; content reflows where expected.
- [ ] Keyboard-only use: focus is visible, order is sensible, dialogs can be opened/closed, and no keyboard trap occurs.
- [ ] Color is not the only way meaning is communicated; text contrast and control labels are readable.
- [ ] Run an automated axe-core scan on main Viewer and Details states; record tool/version and findings. Review results manually instead of treating the scan as a usability result.

## Desktop Chromium

- [ ] Check 1440px and 1024px widths; no page-wide clipping from optional columns or ranking controls.
- [ ] Sort/filter/column controls work by mouse and keyboard.
- [ ] Table horizontal scrolling stays within the table region.

## Physical iPhone Safari

- [ ] Load the sample from Files; verify keyboard and browser safe areas.
- [ ] Frequently used touch controls are comfortably tappable; aim for Apple's 44 × 44 pt hit region.
- [ ] Pairing list, filters, and modal are usable without accidental page-wide horizontal movement.
- [ ] Leave Safari and return; note whether data and view state are clear and retained.

## Physical iPad Safari

- [ ] Check portrait and landscape; check Split View if it is part of the participant's normal use.
- [ ] Load the sample from Files and test a touch interaction and an external keyboard if the participant normally uses one.
- [ ] Check that no ranking/filter controls are clipped at either orientation.

## Emulation boundary

Playwright or browser viewport emulation can cover layout widths and repeatable interactions. Mark iOS file picker, iOS keyboard, real touch, storage return, and Safari rendering as **not tested** unless observed on a physical iPhone/iPad.
