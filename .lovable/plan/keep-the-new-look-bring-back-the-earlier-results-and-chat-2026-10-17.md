# Keep the new look, bring back the earlier results and chat

## What went wrong
- On the new start page, "I'm Hungry" jumps straight to one preset card for Knights Pantry. The full list of food options (now 30+ in the catalog) is never shown.
- Typing anything with words like "food", "class" or "job" also skips the chat and shows that one preset card, so the AI never answers.
- The start page currently logs an error from a chart-drawing add-on loaded by the chat replies, which may stop chat answers from showing.

## What we'll change
1. **Four cards show many results again.** I'm Hungry, I'm Stressed, I'm Broke and I'm Bored each open the full list of matching resources for that need (same list as the earlier mockup build), in the new design. Optional filters (on/off campus, how, day) narrow the list but never hide everything.
2. **Every result has contact info.** Each card shows phone, email, website and "how to contact" when the catalog has them, plus "Prepare my next step" and "Save".
3. **Typing gets a real chat answer.** Free text always goes to the AI chat, which names several resources with links. Keyword shortcuts no longer hijack the message; instead the reply offers "See all food options" buttons.
4. **Fix the start page error** so chat replies render reliably.
5. Keep the pantry preset as one highlighted pick at the top of Food, not the only result.

Untouched: colors, fonts, logo, onboarding, catalog data, My next steps.

## Check
Browser walk-through: I'm Hungry shows many food options with contact details; typed "I need groceries" gets an AI reply listing several places; no errors in the log. Add a test that the Food list returns more than 10 resources.

## Technical details
- `home-experience.tsx`: QUICK cards navigate to `/need/$journey?step=compare` (uses `rankOptions`) instead of `startPreset`; `submitFree` sends to `useChat` always; preset regex becomes suggestion chips.
- Compare list: render contact facts (phone/email/url) from `resource-card.tsx` on each row.
- Investigate the `graphlib` runtime error (likely mermaid via the chat message renderer) and disable or lazy-load that plugin.
