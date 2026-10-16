import { createFileRoute } from "@tanstack/react-router";
import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import { useState } from "react";
import { RotateCcw } from "lucide-react";
import { Conversation, ConversationContent, ConversationScrollButton } from "@/components/ai-elements/conversation";
import { Message, MessageContent, MessageResponse } from "@/components/ai-elements/message";
import { PromptInput, PromptInputFooter, PromptInputSubmit, PromptInputTextarea } from "@/components/ai-elements/prompt-input";
import { Shell, Chip, btn } from "@/components/next/shell";

export const Route = createFileRoute("/ask")({
  head: () => ({
    meta: [
      { title: "Ask Next Step — CT Data × University of Bridgeport" },
      { name: "description", content: "Ask Next Step anything about finding help at the University of Bridgeport." },
      { property: "og:title", content: "Ask Next Step" },
      { property: "og:description", content: "Chat to find a clear next step at UB." },
    ],
  }),
  component: Ask,
});

const STARTERS = ["I'm Hungry", "I'm Stressed", "I'm Broke", "I'm Bored"];

function Ask() {
  const [input, setInput] = useState("");
  const { messages, sendMessage, status, stop, setMessages, error } = useChat({
    transport: new DefaultChatTransport({ api: "/api/chat" }),
  });
  const send = (text: string) => {
    if (!text.trim()) return;
    sendMessage({ text });
    setInput("");
  };
  return (
    <Shell className="flex max-w-3xl flex-col">
      <div className="flex items-center justify-between">
        <h1 className="font-display text-2xl font-semibold text-foreground">Ask Next Step</h1>
        {messages.length > 0 && <button className={btn.ghost} onClick={() => setMessages([])}><RotateCcw className="size-4" /> New chat</button>}
      </div>
      <Conversation className="min-h-[50vh] flex-1">
        <ConversationContent className="px-0 py-4">
          {messages.length === 0 && (
            <div className="space-y-3 pt-6">
              <p className="text-muted-foreground">Tell me what’s going on, or start with one of these:</p>
              <div className="flex flex-wrap gap-2">{STARTERS.map((s) => <Chip key={s} active={false} onClick={() => send(s)}>{s}</Chip>)}</div>
            </div>
          )}
          {messages.map((m) => (
            <Message key={m.id} from={m.role}>
              <MessageContent>
                {m.parts.map((p, i) => (p.type === "text" ? <MessageResponse key={i}>{p.text}</MessageResponse> : null))}
              </MessageContent>
            </Message>
          ))}
          {status === "submitted" && <p className="animate-pulse text-sm text-muted-foreground">Next Step is thinking…</p>}
          {error && <p className="text-sm text-destructive">{error.message}</p>}
        </ConversationContent>
        <ConversationScrollButton />
      </Conversation>
      <PromptInput onSubmit={(msg) => send(msg.text)}>
        <PromptInputTextarea autoFocus value={input} onChange={(e) => setInput(e.target.value)} placeholder="Tell me what you need…" />
        <PromptInputFooter className="justify-end">
          <PromptInputSubmit status={status} onStop={stop} disabled={!input.trim() && status === "ready"} />
        </PromptInputFooter>
      </PromptInput>
      <p className="mt-2 text-center text-xs text-muted-foreground">Always confirm details with the office. In crisis, call or text 988.</p>
    </Shell>
  );
}
