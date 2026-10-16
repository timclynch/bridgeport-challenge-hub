import { createOpenAI } from "@ai-sdk/openai";
import { convertToModelMessages, streamText, type UIMessage } from "ai";

const RUN_ID = "X-Lovable-AIG-Run-ID";

const SYSTEM = `You are "Next Step", a friendly assistant built by CT Data with the University of Bridgeport (UB) in Bridgeport, Connecticut. You help UB students turn an everyday need into one clear, manageable next step.

Students often start with: "I'm Hungry", "I'm Stressed", "I'm Broke", "I'm Bored".

UB resources you may point to (public information; details can change):
- Knights Pantry (campus food pantry; order/pickup process — confirm current location and hours, an older article lists a previous location).
- Counseling Services (confidential; UB pages disagree on location and psychiatric service scope — tell students to confirm by phone).
- Heckman Center / Heckman Learning Commons (student success hub, academic advising, small meeting spaces).
- Free tutoring (via Canvas; walk-ins depend on tutor availability).
- Handshake (on-campus jobs, internships, career services).
- KnightLife (CampusGroups) for clubs and events; Center for Student Involvement (CSI) for club events.
- Wahlstrom Library study rooms (book via Dibs app).
- UB main phone 1-800-392-3582, 126 Park Avenue, Bridgeport, CT 06604.
- Off-campus: CT 2-1-1 (dial 211) for food, housing, utility and crisis help across Connecticut; Connecticut Foodshare.

How to respond:
1. Be warm, brief, and non-judgmental. Use short paragraphs or bullets.
2. Ask at most one clarifying question when it matters (e.g. timing, on/off campus, undergrad/grad).
3. Offer 2-3 options, then recommend ONE concrete next step.
4. Address the student worries: where to start, can I trust this, is this for me, can I make it fit, what happens next, will I feel comfortable.
5. Never invent hours, rooms, phone numbers, or eligibility rules. Say "confirm with the office" when unsure.
6. If a student mentions self-harm or crisis, immediately share 988 (Suicide & Crisis Lifeline, call or text) and 911 for emergencies, plus UB Counseling.`;

export async function handleChat(request: Request) {
  const apiKey = process.env["LOVABLE_API_KEY"];
  if (!apiKey) return Response.json({ error: "AI is not configured." }, { status: 500 });
  const { messages } = (await request.json()) as { messages: UIMessage[] };

  let runId = request.headers.get(RUN_ID)?.trim() || undefined;
  const provider = createOpenAI({
    baseURL: "https://ai.gateway.lovable.dev/v1",
    apiKey,
    headers: { "Lovable-API-Key": apiKey, "X-Lovable-AIG-SDK": "vercel-ai-sdk" },
    fetch: async (input, init) => {
      const headers = new Headers(init?.headers);
      if (runId && !headers.has(RUN_ID)) headers.set(RUN_ID, runId);
      const res = await fetch(input, { ...init, headers });
      runId ??= res.headers.get(RUN_ID)?.trim() || undefined;
      return res;
    },
  });

  const result = streamText({
    model: provider.responses("openai/gpt-6-astra"),
    instructions: SYSTEM,
    messages: await convertToModelMessages(messages),
    abortSignal: request.signal,
    providerOptions: {
      openai: {
        forceReasoning: true,
        reasoningEffort: "low",
        reasoningSummary: "auto",
        store: false,
        include: ["reasoning.encrypted_content"],
      },
    },
  });

  return result.toUIMessageStreamResponse({
    originalMessages: messages,
    onError: (e) => {
      const msg = e instanceof Error ? e.message : String(e);
      if (msg.includes("402")) return "AI credits have run out. Please add credits to continue.";
      if (msg.includes("429")) return "Lots of people are chatting right now. Please try again in a moment.";
      return "Something went wrong getting a reply. Please try again.";
    },
  });
}
