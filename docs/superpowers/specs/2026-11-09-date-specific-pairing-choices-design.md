> Superseded by [Viewer-Led Bidder Design](2026-11-09-viewer-led-bidder-design.md). The scope has expanded to cover the staged Viewer and ranking work.

# Date-Specific Pairing Choices

## Intent
Let a pilot compare and select each operating date of a pairing independently. For example, M302W should appear as four choices for Dec 8, 15, 22, and 29, rather than two rows that hide some dates.

## Goals
- Preserve the PDF's grouped schedule records as the source data.
- Expand each source record into one date-specific instance for Viewer rows and Bid Builder choices.
- Keep pairing number, itinerary, credit, layovers, report, and release details on each instance.
- Scope date conflicts, GDO exclusions, schedule dates, and saved bid selections to the chosen instance only.
- Allow multiple instances of the same pairing number in a bid when their operating dates differ, while preventing duplicate selection of the same instance.

## Non-goals
- Redesigning the rest of the app or adding the proposed preference-ranking controls.
- Changing PDF extraction or how effective-date masks are interpreted.

## Approaches
1. Split records during PDF parsing. This makes every downstream record date-specific, but changes the parser's source representation.
2. Keep source records grouped and expand them into date-specific instances for display and bidding. This preserves parsed source data and keeps date choice explicit in the UI. **Selected approach:** option 2.

## Behavior and constraints
- Each `operating_dates` value produces one selectable instance.
- A selected instance's worked dates are derived from that single start date and the pairing's work-day pattern; other occurrences must not be treated as occupied.
- Viewer search must show all instances matching a pairing number.
- Bid Builder de-duplication must use instance identity/date, not pairing number alone.
- Existing saved bid data must remain readable; migration or compatibility handling should preserve saved selections where their intended date can be determined and avoid silently inventing one where it cannot.

## Acceptance examples
- M302W appears on Dec 8, 15, 22, and 29 as four separate Viewer rows.
- Selecting M302W on one date does not reserve the other M302W dates.
- GDO conflicts and overlap checks evaluate only the selected occurrence.
- The same pairing number can be selected on different dates, but the same date-specific instance cannot be added twice.

