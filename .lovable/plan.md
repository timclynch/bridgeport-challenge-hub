# Next Step — full mockup build (CT Data x University of Bridgeport)

Rename "Knight Guide" to **Next Step** and rebuild the app to follow the Next_Step_v2 mockups. It keeps the four starting cards and uses real UB info from the research. Saved steps stay on the student's device.

## Look and feel (from the mockup)
- Warm off-white background, deep teal primary, dark slate text, gold for "needs confirmation" badges, muted red for urgent help.
- Phone-first layout, with a two-column layout on desktop: options on the left, the editable card on the right.
- Header: "Next Step", "CT Data x University of Bridgeport", a "My next steps (n)" link, and a "Need urgent help?" link on every screen.

## Screens
1. **Start (E1)**: "What do you need help with?" and four cards: I'm Hungry, I'm Stressed, I'm Broke, I'm Bored.
   - Picking a card fills in an editable starter message and shows which questions come next ("you can skip any").
   - Cards map to journeys: Hungry -> Food, Stressed -> Support (or Tutoring if it's about classes), Broke -> Money/Career, Bored -> Events.
   - "Browse all resources" link.
   - Note: "You won't be asked for income, a diagnosis or a student ID."
2. **Preferences**: 1-2 quick, skippable questions per journey, such as timing, on or off campus, and meal vs groceries.
3. **Compare options (E2/E4/E6/E11.3)**: 2-4 real UB resources, each labeled "Fits", "Doesn't fit your time", or "Needs confirmation".
   - Each option shows a check summary ("Compared access rules for 3 resources", "Couldn't check X").
   - Options with conflicting details get a "details conflict" badge that opens an evidence panel (used for the counseling location and the older pantry article).
4. **Action card (E3/E5/E7/E11.4)**: "Your next step", with why it may fit, questions to confirm (editable, plus add your own), what to bring, an optional draft message, and the contact route.
   - Buttons: Copy questions, Save to My next steps, and Open email/website.
   - Each shows a result message ("Copied. Nothing has been sent.").
5. **Choose how to make contact (E11.5)**: email, call, walk in, or online. Shows where it goes, what's included and what happens next. Nothing is ever sent automatically.
6. **Change preferences**: re-checks the options and shows what changed, with Undo (E3 state).
7. **My next steps (E8/E11.6)**: saved cards in the order the student chose.
   - Status: Still deciding / Contacted / Confirmed / Done, plus a "what was confirmed, by whom" note.
   - Remove a card, with Undo.
   - "Hide sensitive details" toggle.
   - "No reply yet" options: try another route, prepare a follow-up, or change timing.
8. **Browse resources**: a filterable list (Food, Support, Money/Career, Events, Tutoring, Housing, Transport) of all UB and Connecticut resources.
9. **Urgent help popup**: 911, UB Campus Security 203-576-4911, 988 call/text, and 211 CT. No form or account.
10. **Ask Next Step (chat)**: the current AI chat stays as an "Ask a question" option on every screen and is renamed to Next Step.

## Content
- One shared resource list built from the research: Knights Pantry, Counseling Services, Heckman Center, tutoring, Handshake, KnightLife/CSI, Wahlstrom study rooms, Student Affairs, Accessibility Services, Residential Life, GBT transit, CT 2-1-1 and CT Foodshare.
- Each resource lists what it's for, who can use it, how to contact it, a confidence tag ("Published", "Needs confirmation", "Details conflict") and its source.
- Hours or rooms the research didn't confirm are shown as "Confirm with office", never made up.
- Campus Security number 203-576-4911 comes from your mockup; I'll flag it to double-check.

## Technical details
- New pages: `/` (start), `/need/$journey` (preferences -> compare -> card, steps tracked in the address bar), `/steps`, `/browse`, `/ask` (chat). Each gets its own page title.
- Resource data lives in `src/data/resources.ts`. Each journey is defined in `src/data/journeys.ts` (questions, option-fit rules, card template).
- Saved steps are kept in browser storage behind a small hook, read only after the page loads.
- Urgent-help popup lives in the shared page layout; theme colors are updated in `src/styles.css`.
- Tests for the fit rules (e.g. Tue-only pantry hours mark "Doesn't fit" for Thu-only students) and the saved-steps add/remove/undo.
