# Viewer-Led Bidder Design

## Intent

Make the Viewer the clear home for exploring a monthly pairing PDF. Pilots should be able to find date-specific pairing choices, experiment with what makes a pairing attractive, and understand why results rank as they do. Keep GDO Planner and Bid Builder available as separate tabs.

## Goals

- Represent each pairing operating date as an independent selectable instance.
- Give the Viewer a simpler search, comparison, and ranking workflow.
- Let users experiment with adjustable ranking preferences without editing code.
- Separate hard exclusions from soft ranking preferences.
- Show practical workload, layover, route-region, and time-zone information.
- Keep GDO conflicts, schedule overlaps, bid selection, and exports tied to the selected date instance.
- Apply bid limits consistently when adding manually or through auto-fill.
- Make ranking understandable and easy to reset or compare.

## User and success criteria

The primary user is a pilot reviewing a monthly pairing PDF and deciding which specific operating dates fit their preferences. Success means they can search a pairing such as M302W, see every operating date separately, tune preferences, compare likely candidates, and add a chosen date without accidentally reserving the pairing's other dates.

## Scope

### Phase 1: trustworthy date-specific choices

- Preserve parsed PDF schedule blocks as source records.
- Expand each `operating_dates` value into one occurrence instance for Viewer rows and Bid Builder candidates.
- Derive an occurrence's working dates from that occurrence's start date and the pairing's duty-day pattern only.
- Use occurrence identity (pairing identity plus operating date, with a stable discriminator if records differ) for de-duplication and saved selections.
- Keep multiple dates for the same pairing number independently selectable.
- Apply GDO exclusion, date overlap, and rest-window checks to only the chosen occurrence.
- Route manual additions through the same configured limits as auto-fill.
- Safely display PDF-derived strings as text; do not interpret uploaded schedule text as markup.
- Keep legacy saved data readable. If an old saved bid contains a recurring record without a chosen date, preserve it visibly as legacy/unspecified rather than silently selecting a date.

### Phase 2: simpler Viewer workspace

- Keep PDF upload, search, the result table, and a compact summary in the first tab.
- Make the first tab the main exploration workspace; leave GDO Planner and Bid Builder as separate tabs.
- Use progressive disclosure: show common search and ranking controls first; put less-used constraints and detailed fields in a collapsible advanced area.
- Allow a compact scan view and a pairing detail view. The detail view shows all legs, each layover, and the selected operating date.
- Support selecting a small set of pairings for side-by-side comparison.
- Keep labels, keyboard focus, and touch targets usable on narrow screens.

### Phase 3: flexible ranking and route context

- Provide adjustable preferences for credit, workload, flight count per duty day, layover quality, commute-related measures already available, and time-zone change.
- Treat preferences as ranking weights; changing them re-ranks results immediately.
- Keep hard filters separate, such as excluding an unwanted region or setting a required minimum credit.
- For workload, show credit per duty day, legs per duty day, and total legs. Do not rely on total credit alone.
- For layovers, show each duration and rank using all layovers (including shortest and average), not just the longest break.
- Classify layover/route airports as US, Caribbean, Canada, or other when airport metadata is known; show Unknown when it is not.
- Show time-zone change per leg and the largest absolute change in the itinerary, using airport time-zone metadata and the actual operating date where needed for daylight-saving offsets.
- Explain ranking with a short score breakdown and provide reset/default controls. Allow users to save and restore preference profiles in local storage.

## Ranking behavior

- Hard filters remove instances from the result set; preference weights only affect order.
- The initial default profile favors credit efficiency, fewer legs per duty day, and longer/restful layovers, with a penalty for large time-zone shifts. Exact starting weights are a builder call and must be labeled as defaults, not universal recommendations.
- Layover quality must include the shortest and average layover, as well as the longest. A single long layover must not conceal short breaks elsewhere in the pairing.
- If required airport metadata is missing, show Unknown and omit that metric from scoring rather than treating it as zero or assuming a region.
- Show enough of the score components that a user can see why an instance moved up or down after changing preferences.

## Existing constraints and risks

- The app is currently a single HTML file with duplicated parsing logic in JavaScript and Python. The browser version is authoritative for the UI; avoid introducing a server or dependency unless necessary.
- Parsed schedule blocks may contain multiple operating dates and repeated pairing numbers. The same pairing number can have different operating-date blocks.
- Current `all_dates` includes work dates for every occurrence in a recurrence block. Occurrence expansion must avoid treating unselected occurrences as occupied.
- Existing legality rules are simplified and include notes to verify their source. Display such results as app checks, not guarantees of regulatory or contract compliance.
- Airport country and time-zone data needs a maintained source or bundled lookup. Unmapped codes must remain visibly unknown.

## Non-goals

- Replacing the GDO Planner or removing the Bid Builder tab.
- Changing the PDF source format or rewriting PDF text extraction in this project.
- Claiming the simplified legality checks certify a bid as compliant.
- Automatically deciding which preferences every pilot should use.

## Approaches considered

1. Split schedule records at PDF parse time. This makes all downstream code consume instances, but changes the parser's source representation and complicates recurrence display.
2. Keep parsed schedule blocks grouped and create occurrence instances for Viewer and bidding. This preserves the source block while making each date selectable; all scheduling calculations can consume one explicit instance. **Selected.**

For the Viewer, use a compact table plus progressive disclosure, rather than putting every filter and score control on screen at once. This keeps common actions quick while allowing experiments and detailed comparisons.

## Acceptance criteria

- The supplied December PDF shows M302W on Dec 8, 15, 22, and 29 as four Viewer rows.
- Searching M302W returns all four instances; each displays the selected date and the shared itinerary details.
- Adding M302W on Dec 8 does not reserve Dec 15, 22, or 29; the same date cannot be added twice.
- GDO and overlap checks use only the selected occurrence's work dates.
- Manual addition and auto-fill enforce the same configured slot, credit, workday, and calendar-rest limits.
- Adjusting a ranking control immediately reorders eligible instances and the score explanation identifies the factors that changed the order.
- A hard filter removes matching instances; a ranking preference only changes their relative order.
- Unknown region or time-zone metadata is explicit and does not silently bias a score.
- Preference settings survive reload and can be reset to the default profile.
- Extracted PDF content is rendered inert in the UI and detail window.
