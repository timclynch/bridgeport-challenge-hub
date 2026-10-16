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
- Resource facts come only from `src/data/catalog.json` (team catalog export) and `src/data/demo.json` (fictional fixtures), adapted in `src/data/resources.ts`; journeys in `src/data/journeys.ts` select by catalog `needs`. Update data by re-exporting the catalog, not by editing screens.
- Saved "My next steps" use browser storage via `src/lib/steps.ts` (pure list helpers + `useSteps` hook, read after mount) to avoid hydration mismatches and keep data on-device.
