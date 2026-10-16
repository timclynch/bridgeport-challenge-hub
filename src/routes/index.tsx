import { createFileRoute } from "@tanstack/react-router";
import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import { useState } from "react";
import { Utensils, HeartPulse, Wallet, Compass, RotateCcw, Shield } from "lucide-react";
import {
  Conversation,
  ConversationContent,
  ConversationScrollButton,
} from "@/components/ai-elements/conversation";
import { Message, MessageContent, MessageResponse } from "@/components/ai-elements/message";
import {
  PromptInput,
  PromptInputFooter,
  PromptInputSubmit,
  PromptInputTextarea,
} from "@/components/ai-elements/prompt-input";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Knight Guide — CT Data × University of Bridgeport" },
      {
        name: "description",
        content: "A friendly chat that helps University of Bridgeport students find food, support, money help and things to do.",
      },
      { property: "og:title", content: "Knight Guide — CT Data × University of Bridgeport" },
      {
        property: "og:description",
        content: "Hungry, stressed, broke or bored? Get one clear next step at UB.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

const CARDS = [
  { label: "I'm Hungry", hint: "Food & pantry options", icon: Utensils },
  { label: "I'm Stressed", hint: "Support & someone to talk to", icon: HeartPulse },
  { label: "I'm Broke", hint: "Jobs, aid & savings", icon: Wallet },
  { label: "I'm Bored", hint: "Clubs, events & people", icon: Compass },
];

function Index() {
  const [input, setInput] = useState("");
  const { messages, sendMessage, status, stop, setMessages, error } = useChat({
    transport: new DefaultChatTransport({ api: "/api/chat" }),
  });
  const started = messages.length > 0;

  const send = (text: string) => {
    if (!text.trim()) return;
    sendMessage({ text });
    setInput("");
  };

  return (
    <div className="flex h-dvh flex-col bg-background">
      <header className="border-b border-border bg-primary text-primary-foreground">
        <div className="mx-auto flex max-w-3xl items-center justify-between px-4 py-3">
          <div className="flex items-center gap-3">
            <div className="grid size-9 place-items-center rounded-lg bg-accent text-accent-foreground">
              <Shield className="size-5" />
            </div>
            <div className="leading-tight">
              <p className="font-display text-lg font-semibold">Knight Guide</p>
              <p className="text-xs opacity-80">CT Data × University of Bridgeport</p>
            </div>
          </div>
          {started && (
            <button
              onClick={() => setMessages([])}
              className="inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 text-sm hover:bg-primary-foreground/10"
            >
              <RotateCcw className="size-4" /> New chat
            </button>
          )}
        </div>
      </header>

      <Conversation className="flex-1">
        <ConversationContent className="mx-auto w-full max-w-3xl px-4 py-6">
          {!started ? (
            <div className="flex flex-col items-center pt-8 text-center">
              <span className="mb-3 rounded-full bg-secondary px-3 py-1 text-xs font-medium text-secondary-foreground">
                For UB students
              </span>
              <h1 className="font-display text-4xl font-semibold text-foreground sm:text-5xl">
                What's going on today?
              </h1>
              <p className="mt-3 max-w-md text-muted-foreground">
                Pick one or just type. I'll help you find a real next step on campus.
              </p>
              <div className="mt-8 grid w-full grid-cols-2 gap-3">
                {CARDS.map(({ label, hint, icon: Icon }) => (
                  <button
                    key={label}
                    onClick={() => send(label)}
                    className="group flex flex-col items-start gap-3 rounded-xl border border-border bg-card p-4 text-left shadow-card transition hover:-translate-y-0.5 hover:border-accent"
                  >
                    <span className="grid size-10 place-items-center rounded-lg bg-secondary text-primary transition group-hover:bg-accent group-hover:text-accent-foreground">
                      <Icon className="size-5" />
                    </span>
                    <span>
                      <span className="block font-display text-lg font-semibold text-card-foreground">{label}</span>
                      <span className="block text-sm text-muted-foreground">{hint}</span>
                    </span>
                  </button>
                ))}
              </div>
            </div>
          ) : (
            messages.map((m) => (
              <Message key={m.id} from={m.role}>
                <MessageContent>
                  {m.parts.map((p, i) =>
                    p.type === "text" ? <MessageResponse key={i}>{p.text}</MessageResponse> : null,
                  )}
                </MessageContent>
              </Message>
            ))
          )}
          {status === "submitted" && (
            <p className="animate-pulse text-sm text-muted-foreground">Knight Guide is thinking…</p>
          )}
          {error && <p className="text-sm text-destructive">{error.message}</p>}
        </ConversationContent>
        <ConversationScrollButton />
      </Conversation>

      <div className="mx-auto w-full max-w-3xl px-4 pb-4">
        <PromptInput onSubmit={(msg) => send(msg.text)}>
          <PromptInputTextarea
            autoFocus
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Tell me what you need…"
          />
          <PromptInputFooter className="justify-end">
            <PromptInputSubmit status={status} onStop={stop} disabled={!input.trim() && status === "ready"} />
          </PromptInputFooter>
        </PromptInput>
        <p className="mt-2 text-center text-xs text-muted-foreground">
          A CT Data × University of Bridgeport project. Always confirm details with the office. In crisis, call or text 988.
        </p>
      </div>
    </div>
  );
}
