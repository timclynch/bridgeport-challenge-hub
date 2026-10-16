# Next Step — 3-minute demo storyboard ("Sources checked · Ready to act")

Proposal for team discussion. Nothing is implemented, sent, booked or published by this plan.

Status labels used below: **[Works]** checked in source and matches the walk you did · **[Source]** read in code/catalog this turn, not browser-tested by me · **[Verify]** needs a check before rehearsal · **[Build]** future change.

## Promise
Next Step turns "I don't know if I can use this or how" into one saved, source-checked next action — with the evidence shown and the open questions named.

- **Before:** Alex (fictional demo student) needs groceries this week, doesn't know whether Knights Pantry is for them or how pickup works.
- **After:** Alex knows the official route (PantrySoft via the UB handbook), has 3 questions to ask, a draft they control, and a saved card marked "Still deciding" — pickup and stock still openly unknown.

## What "certified" means here
No UB or provider certification exists in this app; we will not use the word. The label is **"Sources checked · Ready to act"** shown beside **"Pickup arrangements not confirmed"**. It means:
1. The route (PantrySoft link / official page) comes from an official UB source in the catalog.
2. Each fact shown has a source, with the source's publication date (where known) and our review date (2026-10-16) shown separately.
3. Unresolved facts (pickup time, stock, current room, semester hours) are listed, not hidden.
4. It never means eligibility, inventory, a booking or a guaranteed outcome.

## Current state (what you saw vs. the code)
- [Works] Home → I'm Hungry → editable message → Start → prefs (On campus / Any way / Any day) → Show my options → Prepare my next step → card → contact → save → My next steps.
- [Source] Food compare lists all 17 food records; Dining can sort first because sort is only by fit status.
- [Source] Pantry card shows "Fits your preferences", a conflict panel treating the handbook room (Cox Student Center, ground floor) and older news article (Heckman Center, Wahlstrom 2nd floor) as equal, and the generic "student ID and a bag" Bring line (no source).
- [Source] Contact step always offers "Walk in", even when location conflicts.
- [Source] Pantry phone/email come from the older news article only — present them as "from a past UB article", not the main route.
- [Verify] The 2024 ribbon-cutting article (bridgeport.edu/news/ribbon-cutting-for-renovated-student-food-pantry/) is not in the catalog yet; its date and stated location must be read before we say the location is resolved. Until then: keep location open, action = confirm via PantrySoft/office.
- [Verify] The earlier Ask route-loading error: not on the demo path. The demo does not use Ask or any live AI call.

## Storyboard (3:00)

**1. 0:00–0:20 — Admit uncertainty** · Click: Home → "I'm Hungry". Edit message to: *"I'm a UB student and need free groceries this week. I'm not sure whether I can use Knights Pantry or how pickup works."* → Start.
Visible: editable message, "You won't be asked for income, a diagnosis or a student ID." [Works]
Line: *"Alex is a fictional demo student. They're not sure they qualify — and we don't ask them to prove anything."*

**2. 0:20–0:40 — Three questions, all skippable** · Click: "Groceries", "Free only", "On campus" → Show my options. [Build: replace Food's where/how/days with groceries-vs-meal, cost, campus]
Visible: "Couldn't check 'free' for N options: cost not published" when cost is unknown. [Build]
Line: *"Three questions. Anything we can't check from a source, we say so."*

**3. 0:40–1:10 — Compare 3 routes** · Visible: Knights Pantry (free, published), Dining (cost not published · meals, not groceries), CT 2-1-1 or City pantry list (off-campus fallback). Rest collapsed under "Show 14 more (not compared for your answers)". [Build]
Click: Knights Pantry → Prepare my next step.
Line: *"Three real routes, different trade-offs. Alex chooses. We don't claim the other 14 were checked."*

**4. 1:10–1:40 — Evidence moment** · Click: "See sources" on the card.
Visible: Handbook — free food for UB community, appointments or online ordering, hours/stock vary (reviewed Oct 16, 2026). Location: shown as a timeline — older news article (date) → 2024 relocation announcement (date) → current handbook. [Build + Verify dates]
Line: *"The room changed over time. We show the history, and still ask Alex to confirm — because the route matters more than the room."*

**5. 1:40–2:10 — One action card** · Visible: final card copy below; badges "Sources checked · Ready to act" + "Pickup arrangements not confirmed". No ID requirement, no Walk in. [Build]
Click: untick one question, add one of Alex's own.
Line: *"Vague worry becomes one action and three questions."*

**6. 2:10–2:40 — Alex controls what's shared** · Click: Choose how to make contact → "Official page (PantrySoft route)". Preview: destination URL, draft text, "Draft · not sent". Do **not** click open during demo. Click: Save to My next steps.
Visible: "Saved to My next steps. This is not an appointment." [Works]; "Draft · not sent" [Build]
Line: *"Saving isn't contacting. Nothing leaves Alex's phone unless they send it."*

**7. 2:40–3:00 — Close** · Click: My next steps. Visible: one card, "Still deciding", open unknowns: pickup time, stock, current room. [Works except unknowns list: Build]
Line (Alex): *"I know the right route, what I need to ask, and what I'll do next."*

## Final card copy
- **Your next step:** Use the official PantrySoft route to request groceries and confirm pickup arrangements.
- **What I need:** Free groceries this week.
- **Chosen:** Knights Pantry (Office of Civic Engagement)
- **Why it may fit:** UB's student handbook says the pantry offers free food to the UB community, by appointment or online ordering.
- **Source:** UB Student Handbook (Key to UB, Ch. 1) · reviewed Oct 16, 2026
- **Still unknown:** When can I pick up this week? · Where is pickup right now? · Is anything required at pickup?
- **Bring:** No source lists anything to bring — ask when you order.
- Badges: Sources checked · Ready to act | Pickup arrangements not confirmed

Readiness criteria (all must hold for the badge): official source with URL for the route; route is an order/contact link, not a visit; no conflicting fact used as the action; unknowns listed ≥1 where they exist; no unsourced requirement shown.

## Smallest changes

**Required for this demo**
1. Food questions → groceries/meal, free/any, campus/either (new catalog-derived tags; unknown cost → "couldn't check").
2. Compare: show top 3 relevant, collapse the rest with honest count; stop Dining outranking the pantry when it's unknown-cost and meal-only.
3. Pantry location: add 2024 article as a source after verifying its date/content; show chronology; keep "confirm" if unresolved.
4. Readiness badge pair + criteria function (replaces "Fits your preferences" on the card).
5. Remove unsourced "student ID" Bring text; hide Walk in when location is conflicting/unknown.
6. "Draft · not sent" label on contact preview; label phone/email as from older article.
7. Saved card shows open unknowns.

**Optional later:** "Ready to contact" status; fictional "Demo reply" panel; same treatment for other journeys.

Untouched: design system, other journeys, Ask chat, catalog-only data (no new backend, no dashboard, no messaging).

## Rehearsal, tests, backup
- **Setup/reset:** Demo switch off; clear My next steps (remove cards or clear site data); start at Home. Pre-saved deep link to the card step as a backup bookmark.
- **Local save test:** unit test adds a fictional Alex card, checks it saves as "Still deciding", contains only Alex's goal/questions, and remove + undo restores it. Uses fictional data only.
- **Failure/backup:** if a page stalls, use the bookmarked link; if offline, the screens still work (no live calls). Never fall back to Ask.
- **Acceptance checks:** 3 options visible + collapsed count; card shows both badges; no "student ID" or Walk in; location shows chronology or "confirm"; contact shows "Draft · not sent"; saved card status "Still deciding" with unknowns; nothing opens or sends. Browser walk-through by me after building — not yet performed.

## Assumption
If the 2024 article can't be read or dated, location stays "confirm with office" and the demo still works unchanged.
