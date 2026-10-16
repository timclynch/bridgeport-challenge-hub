# Use the Next Step data catalog (54 real resources + Demo switch)

Replace the app's 15 hand-written resources with your team's catalog of 54 real UB and Connecticut resources. Saved steps stay on the student's device. Add a clearly labeled Demo switch for the fictional judging records.

## What students will see
- **More, better options.** Each journey pulls from the catalog's need tags.
  - Hungry -> food. Stressed -> someone to talk to, accommodations, housing, transport, "not sure", or tutoring.
  - Broke -> money and career. Bored -> attend events.
  - Browse filters use the catalog's 10 categories (Start here, Food & essentials, Health & wellbeing, and so on).
- **Real links and sources.** The main button opens each resource's official page. Every card lists its sources with the review date ("Reviewed Oct 16, 2026").
- **Honest fact labels.** Facts like location, hours, cost, documents, modality, email and phone show as:
  - "Published", with the value and its source
  - "Unknown — ask", never shown as "no requirement"
  - "Conflicting", which opens both sources' values side by side (used for counseling)
- **Real contact options.** Call or email appear only when the catalog publishes a phone number or email. Otherwise the button goes to the official page. Each resource's "next step" sentence comes from the catalog.
- **Demo switch** (Browse page and header menu, off by default). When on, it adds 4 fictional records: Sample Campus Pantry, Sample Tutoring Center, Sample Quiet Games & Tea, and Sample Career Workshop.
  - These show the known-time-window and event-conflict cases.
  - Each has a permanent "Sample data" label, which carries onto any saved card.
- **"Review overdue" note** on resources whose source review is old.

## What stays the same
- The four starting cards, quick questions, compare, action card, contact choice, My next steps, the urgent-help popup and the Ask chat.
- Saving stays device-only. Hidden cards show only "Private step".

## Technical details
- Copy `catalog.enriched.json` into `src/data/catalog.json`, keeping only the fields the screens use: id, name, category, kind, description, action_url, next_step, needs, sources, facts (status, value, note, evidence), service_windows, event, freshness.
- Transcribe the 4 demo fixtures from `db.py seed_demo` into `src/data/demo.json` with `sample_data: true`.
- Rewrite `src/data/resources.ts` as a typed adapter over the catalog. It maps facts to labels, and maps `modality`, `location` and `service_windows` to the existing preference tags.
- Journeys in `src/data/journeys.ts` select by catalog `needs` instead of hard-coded IDs.
- Fit rules extend to windows: a time preference against a service window gives fits or doesn't fit, and no window means "confirm". Unknown cost never drops an option.
- The Demo setting lives in browser storage via a small hook, read after the page loads.
- Update the AI chat's background info to list the catalog's resource names and links.
- Tests:
  - A Thu-only student vs. the demo pantry's Tue window gives "Doesn't fit".
  - An unknown fact never shows as "no requirement".
  - A conflicting fact has no single value.
  - Demo records only appear when the switch is on.
