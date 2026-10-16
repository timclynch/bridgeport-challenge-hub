# Challenge 3 - University of Bridgeport: Student Help Chat

A chat assistant that helps UB students turn a need into a clear next step, based on the uploaded research (six pain points: where to start, trust, eligibility, fit, next step, comfort).

## What gets built
- Home page is the chat: a welcome line ("What's going on today?"), a message area, and a chat box at the bottom.
- Four quick-option cards above the chat box: **I'm Hungry**, **I'm Stressed**, **I'm Broke**, **I'm Bored**. Tapping one sends it as the first message.
- The assistant answers with UB-specific options (e.g. Knights Pantry, counseling, Heckman, Handshake jobs, KnightLife events), asks one clarifying question when needed, suggests one manageable next step, and flags details to confirm with the office instead of guessing (per the research's conflicting-info findings).
- Cards hide once the conversation starts; a "New chat" button resets.
- One conversation, not saved between visits (can add saving later).
- Look: UB-inspired deep blue with a warm gold accent, friendly distinctive fonts, works on phones.

## Technical details
- Enable Lovable Cloud for the AI key; server route streams replies from the Lovable AI Gateway (default chat model, Responses API).
- System prompt built from the uploaded research files (resource facts with confidence notes, room-booking guide summary).
- Chat UI built with AI Elements components (conversation, message, prompt input); `useChat` transport.
- `src/routes/index.tsx` rewritten with its own head() metadata; root defaults updated; tokens in `src/styles.css`.
