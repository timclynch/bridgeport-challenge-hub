# Next Step — 3-minute demo storyboard ("Sources checked · Ready to act")

Proposal for team discussion. Nothing is implemented, sent, booked or published by this plan.

Status labels: **[Browser-verified]** walked by the team in the preview · **[Source]** read in code/catalog, not browser-tested · **[Rehearse]** needs a rehearsal check · **[Build]** future change.

## Promise
Next Step turns "I don't know if I can use this or how" into one source-checked next action the student reviews and saves — with evidence shown and open questions named.

- **Before:** Alex (fictional demo student) needs groceries this week and doesn't know whether Knights Pantry is for them or how pickup works.
- **After:** Alex knows the official route (PantrySoft via the UB handbook), has 3 questions to ask, a draft they control, and a saved card at "Still deciding" — pickup and stock still openly unknown.

## What "source-checked" means
No UB or provider certification exists; we will not say "certified". The badge **"Sources checked · Ready to act"** appears only when ALL hold:
1. **Verified official destination:** the action link is an official UB page/route present in the catalog with a URL.
2. **Dated claim-level evidence:** each claim on the card links to its source, showing publication date (where known) separately from our review date (2026-10-16).
3. **Visible unknowns:** unresolved facts (pickup time, stock, current room, semester hours) are listed on the card.
4. **Explicit student review:** Alex has reviewed the card (e.g. a "I've reviewed this" tick) before the badge shows.

If any criterion fails, the card shows **"Needs confirmation"** instead. The badge always sits beside **"Pickup arrangements not confirmed"** and never implies a slot, stock, an eligibility decision, or institutional endorsement.

## Current state
- [Browser-verified] Home → I'm Hungry → editable message → Start → prefs (On campus / Any way / Any day) → Show my options → Knights Pantry → Prepare my next step → editable pantry card. Verification stopped here.
- [Source] Contact step, "Save to My next steps" (on the card screen only), My next steps list, status, hide-sensitive toggle, remove/undo. Not browser-proven: saving, reload persistence, hiding, and that one card's details don't appear in another.
- [Source] Food compare lists all 17 food records; Dining can sort first because sort is by fit status only.
- [Source] Pantry card shows "Fits your preferences"; the conflict panel treats the handbook room (Cox Student Center, ground floor) and older news article (Heckman Center, Wahlstrom 2nd floor) as equal; Bring line suggests a student ID with no source.
- [Source] Contact step always offers "Walk in", even when location conflicts. It has no Save button.
- [Source] Pantry phone/email come only from the older news article.
- [Source] The student's message and preferences are carried in the page address (URL). Saved cards use browser storage. Neither establishes privacy; we make no browser-only privacy claim.
- [Rehearse] The 2024 ribbon-cutting article (bridgeport.edu/news/ribbon-cutting-for-renovated-student-food-pantry/) is not in the catalog; its date and location must be read before the location is called resolved. Until then location stays open and the action is to confirm.
- [Rehearse] Earlier Ask route-loading error: not on the demo path; the demo uses no Ask or live AI call.

## Storyboard (3:00)

**1. 0:00–0:20 — Admit uncertainty** · Click: Home → "I'm Hungry". Edit message to: *"I'm a UB student and need free groceries this week. I'm not sure whether I can use Knights Pantry or how pickup works."* → Start. [Browser-verified]
Visible: "You won't be asked for income, a diagnosis or a student ID."
Line: *"Alex is a fictional demo student. They're not sure they qualify — and we don't ask them to prove anything."*

**2. 0:20–0:40 — Up to three skippable questions** · Click: "Groceries", "Free only", "On campus" → Show my options. [Build]
Each new answer only matches against a tag that has a cited source. Missing facts never become "paid" or "meal-only"; they show as "Couldn't check: not published".
Line: *"Three questions. Anything a source doesn't tell us, we say we couldn't check."*

**3. 0:40–1:10 — Compare 3 kinds of route** · Visible, each labeled by what it is: [Build]
- **Knights Pantry** — provides food directly (free, per handbook).
- **Dining & meal plans** — a dining route; cost not published in our sources.
- **City of Bridgeport pantry list / CT 2-1-1** — a referral directory, not a food provider.
Rest collapsed: "14 more food resources, not compared for your answers". Click: Knights Pantry → Prepare my next step.
Line: *"Three different kinds of route. Alex chooses. We don't claim the other 14 were checked."*

**4. 1:10–1:40 — Evidence moment** · Click: "See sources" on the card.
Visible: handbook claims (free food for UB community; appointments or online ordering; hours/stock vary) with dates; location as a dated timeline (older article → 2024 announcement → handbook) if verified, else "Confirm current room". [Build + Rehearse]
Line: *"The room changed over time. We show the history and still ask Alex to confirm — the route matters more than the room."*

**5. 1:40–2:10 — One action card** · Visible: final card copy below. No ID requirement. Alex ticks "I've reviewed this" → badge appears beside "Pickup arrangements not confirmed". [Build]
Click: untick one question, add one of Alex's own.
Line: *"Vague worry becomes one action and three questions — and Alex signs off on it."*

**6. 2:10–2:40 — Preview, then save** · Click: Choose how to make contact → "Official page (PantrySoft route)". Preview destination and draft, labeled "Draft · not sent" [Build]. Do **not** click open. Click: "Card" (back) → **Save to My next steps** (save lives on the card) → "View in My next steps". [Source · Rehearse]
Visible: "Saved to My next steps. This is not an appointment."
Line: *"Saving isn't contacting. No provider message is sent automatically."*

**7. 2:40–3:00 — Close** · Visible: one card at "Still deciding", with unknowns: pickup time, stock, current room. [Source for card/status · Build for unknowns · Rehearse]
Line (Alex): *"I know the right route, what I need to ask, and what I'll do next."*

## Final card copy
- **Your next step:** Use the official PantrySoft route to request groceries and confirm pickup arrangements.
- **What I need:** Free groceries this week.
- **Chosen:** Knights Pantry (Office of Civic Engagement) — provides food directly.
- **Why it may fit:** UB's student handbook says the pantry offers free food to the UB community, by appointment or online ordering.
- **Source:** UB Student Handbook (Key to UB, Ch. 1) · publication date [Rehearse] · reviewed Oct 16, 2026
- **Still unknown:** When can I pick up this week? · Where is pickup right now? · Is anything required at pickup?
- **Bring:** No source lists anything to bring — ask when you order.
- Badges: Sources checked · Ready to act (only if all 4 criteria hold, otherwise Needs confirmation) | Pickup arrangements not confirmed

## Smallest changes

**Required for this demo**
1. Food questions → groceries/meal, free/any, campus/either; add sourced tags to the catalog first, show "couldn't check" when missing.
2. Route-type label (provides food / dining / referral directory) from catalog `kind` and sourced facts.
3. Compare: show 3 relevant, collapse the rest with an honest count.
4. Pantry location: add the 2024 article as a source only after verifying date/content; show chronology; keep "confirm" otherwise.
5. Readiness check (4 criteria + student review tick) replacing "Fits your preferences" on the card; fallback "Needs confirmation".
6. Remove the unsourced student-ID Bring text; hide Walk in when location is conflicting or unknown.
7. "Draft · not sent" on the contact preview; label pantry phone/email as from an older UB article.
8. Saved card lists open unknowns.

**Optional later:** "Ready to contact" status; fictional "Demo reply" panel; move the goal out of the page address; same treatment for other journeys.

Untouched: design system, other journeys, Ask chat, catalog-only data (no new backend, dashboard or messaging).

## Rehearsal, tests, backup
- **Setup:** use a dedicated disposable browser profile for the demo. Open My next steps and inspect existing cards first; remove only demo cards made in that profile. Never clear a teammate's site data or saved work. Demo switch off; start at Home.
- **Rehearse:** save → reload → card still there; hide-sensitive toggle; a second card doesn't show the first card's goal.
- **Local save test:** unit test with fictional Alex data — add a card, status is "Still deciding", it holds only Alex's goal/questions, remove + undo restores it.
- **Backup:** a clearly labeled recorded walk-through (or static screenshots) of the full 3 minutes. A bookmarked link is not a backup on its own because it still needs the app running. No offline claim unless tested. Never fall back to Ask.
- **Acceptance checks:** 3 routes with type labels + collapsed count; no tag matched without a source; badge appears only after review and all criteria, otherwise "Needs confirmation"; no student-ID text or Walk in; location shows chronology or "confirm"; contact shows "Draft · not sent"; saved card at "Still deciding" with unknowns; nothing opens or sends. Browser walk-through of steps 6–7 still to be performed.

## Assumption
If the 2024 article can't be read or dated, location stays "Confirm current room" and the story is unchanged.
