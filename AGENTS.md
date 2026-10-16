<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.
<!-- LOVABLE:END -->

- AI chat streams through the server route `/api/chat` (`src/lib/chat.server.ts`), and the UI is built with AI Elements: this keeps the key and prompt on the server and the chat parts reusable.
- Resource facts live only in `src/data/resources.ts` and journey questions/fit rules in `src/data/journeys.ts`; screens read from them so research updates happen in one place.
- Saved "My next steps" use browser storage via `src/lib/steps.ts` (pure list helpers + `useSteps` hook, read after mount) to avoid hydration mismatches and keep data on-device.
