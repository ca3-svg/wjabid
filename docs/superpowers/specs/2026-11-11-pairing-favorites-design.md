# Pairing favorites design

## Intent

Let a bidder mark a pairing choice for later review and open all saved choices from a star in the top-right application header.

## Behavior

- Favorites identify one pairing occurrence (pairing plus operating date), consistent with the Viewer’s separate date rows.
- A star column toggles a favorite. An unselected favorite is outline-only; a selected favorite is filled. The control has a date-specific accessible label and pressed state.
- Favorites persist in the app’s existing local browser data. Existing saved data without favorites loads with an empty list.
- A header star opens a responsive, keyboard accessible modal listing the currently loaded favorites. Each entry shows pairing, date, and useful schedule summary, with actions to open formatted Details or remove the favorite. The list has an empty state.
- Favorite actions never add a pairing to the bid. Bid addition remains an explicit, separate action.

## Approaches

- Favorite the pairing number across every recurrence. This is simpler but conflicts with the app’s explicit date-specific bidding model.
- Favorite a specific occurrence date. **Chosen:** each row maps to one choice, making saved intent precise and consistent with adding/comparing pairings.

## Constraints and non-goals

- Use existing inline HTML/JavaScript, Tailwind utility classes, Tabulator, localStorage, and dialog focus management; add no dependency.
- Favorites are local to the current browser/device and current uploaded schedule. Cross-device sync, filters/sorting in the favorites modal, and exporting are future options.
