"use client";

import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import { Link } from "@tanstack/react-router";
import { ArrowRight, BookOpen, Briefcase, Building2, Check, Send, ShoppingBasket, Sparkles } from "lucide-react";
import { useState } from "react";
import { Message, MessageContent, MessageResponse } from "@/components/ai-elements/message";
import { Mascot } from "@/components/next/brand";
import { DestinationCard } from "@/components/next/resource-card";
import { btn, Chip } from "@/components/next/shell";
import { getResource } from "@/data/resources";
import { JOURNEYS, type JourneyId } from "@/data/journeys";
import { greetingFor, useProfile } from "@/lib/profile";
import { addStep, useSteps } from "@/lib/steps";
import { cn } from "@/lib/utils";

const DIRECTORY = "https://www.bridgeport.edu/directory/";

type Preset = {
  id: string;
  resourceId: string;
  journey: JourneyId;
  title: string;
  subtitle: string;
  prompt: string;
  heading: string;
  why: string;
  icon: typeof ShoppingBasket;
  clarify?: boolean;
};

const PRESETS: Preset[] = [
  {
    id: "food",
    resourceId: "pantry",
    journey: "food",
    title: "Make my food budget go further",
    subtitle: "Free food on campus",
    prompt: "I need help getting groceries without spending more.",
    heading: "Check your pantry options.",
    why: "Free pantry items may help with your grocery budget.",
    icon: ShoppingBasket,
    clarify: true,
  },
  {
    id: "study",
    resourceId: "tutoring",
    journey: "tutoring",
    title: "Get unstuck in a class",
    subtitle: "Free tutoring support",
    prompt: "I am stuck in a class and want tutoring support.",
    heading: "Find the support for your class.",
    why: "UB offers free tutoring to registered students.",
    icon: BookOpen,
  },
  {
    id: "career",
    resourceId: "career",
    journey: "money",
    title: "Take a step toward an internship",
    subtitle: "Career guidance",
    prompt: "I want help finding an internship.",
    heading: "Explore your internship path.",
    why: "Career Development supports internship searches and career preparation.",
    icon: Briefcase,
  },
];

const QUICK = [
  { label: "I'm Hungry", hint: "Food & pantry", journey: "food" as const, preset: "food" },
  { label: "I'm Stressed", hint: "Support or classes", journey: "support" as const, preset: null },
  { label: "I'm Broke", hint: "Jobs, aid & savings", journey: "money" as const, preset: null },
  { label: "I'm Bored", hint: "Events & people", journey: "events" as const, preset: null },
];

type View = "starters" | "talk" | "card";
type FoodNeed = "" | "groceries" | "immediate";

export function HomeExperience() {
  const { profile, update } = useProfile();
  const [nameDraft, setNameDraft] = useState("");
  const [view, setView] = useState<View>("starters");
  const [preset, setPreset] = useState<Preset | null>(null);
  const [foodNeed, setFoodNeed] = useState<FoodNeed>("");
  const [fallback, setFallback] = useState(false);
  const [input, setInput] = useState("");
  const [seed, setSeed] = useState("");
  const { update: saveSteps, steps } = useSteps();
  const [savedId, setSavedId] = useState<string | null>(null);

  const { messages, sendMessage, status, error, setMessages } = useChat({
    transport: new DefaultChatTransport({ api: "/api/chat" }),
  });

  if (!profile.name) {
    return (
      <OnboardName
        value={nameDraft}
        onChange={setNameDraft}
        onContinue={() => {
          const n = nameDraft.trim();
          if (n) update({ name: n });
        }}
      />
    );
  }
  if (profile.school !== "ub") {
    return <OnboardSchool onContinue={() => update({ school: "ub" })} onBack={() => update({ name: "" })} />;
  }

  const resource = preset ? getResource(preset.resourceId) : undefined;
  const showClarify = view === "talk" && preset?.clarify && !foodNeed && !fallback;
  const showResult = view === "talk" && preset && !fallback && (!preset.clarify || foodNeed);

  const startPreset = (p: Preset) => {
    setPreset(p);
    setSeed(p.prompt);
    setFoodNeed("");
    setFallback(false);
    setView("talk");
    setMessages([]);
  };

  const submitFree = (text: string) => {
    const t = text.trim();
    if (!t) return;
    const lower = t.toLowerCase();
    const hit = PRESETS.find((p) =>
      p.id === "food"
        ? /food|grocer|hungry|meal|pantry/.test(lower)
        : p.id === "study"
          ? /tutor|class|math|study|homework/.test(lower)
          : /intern|career|job|resume|résumé/.test(lower),
    );
    if (hit) {
      startPreset(hit);
      if (hit.clarify && /tonight|now|today|meal/.test(lower)) setFoodNeed("immediate");
      return;
    }
    setPreset(null);
    setSeed(t);
    setFallback(false);
    setView("talk");
    sendMessage({ text: t });
    setInput("");
  };

  const save = () => {
    if (!resource || !preset) return;
    const id = savedId ?? `${resource.id}-${Date.now().toString(36)}`;
    saveSteps((list) =>
      addStep(list, {
        id,
        journey: preset.journey,
        resourceId: resource.id,
        title: resource.name,
        goal: seed || preset.prompt,
        questions: JOURNEYS[preset.journey].confirmQs,
        status: "deciding",
        note: "",
        sensitive: preset.journey === "support",
        sample: resource.sample,
      }),
    );
    setSavedId(id);
  };

  if (view === "card" && resource && preset) {
    const warn =
      foodNeed === "immediate"
        ? "Knights Pantry may help with groceries, but current stock and pickup times are not verified. Check the official page before making the trip."
        : undefined;
    return (
      <DestinationCard
        r={resource}
        heading={preset.heading}
        why={preset.why}
        warn={warn}
        onSave={save}
        saved={!!savedId || steps.some((s) => s.resourceId === resource.id)}
        extra={
          <div className="mt-3 flex max-w-xl flex-wrap gap-3">
            <button className={btn.secondary} onClick={() => { setView("starters"); setPreset(null); setSavedId(null); }}>Find something else</button>
            <Link to="/need/$journey" params={{ journey: preset.journey }} search={{ step: "card", r: resource.id, msg: seed }} className={btn.ghost}>
              Prepare contact details
            </Link>
          </div>
        }
      />
    );
  }

  if (view === "talk") {
    return (
      <div>
        <div>
          <p className="text-sm text-muted-foreground">University of Bridgeport</p>
          <h1 className="font-display text-3xl font-extrabold tracking-tight sm:text-5xl">
            Let’s find your next <span className="text-primary">step</span>
          </h1>
          <div className="mt-6 space-y-3">
            <div className="ml-auto max-w-xl rounded-3xl rounded-br-md border border-primary/40 bg-card/70 px-4 py-3 text-sm shadow-card">{seed}</div>
            {fallback && (
              <>
                <Bubble>I don’t have a verified match in this resource collection yet.</Bubble>
                <a href={DIRECTORY} target="_blank" rel="noreferrer" className={btn.primary}>Browse UB directory</a>
              </>
            )}
            {showClarify && (
              <>
                <Bubble>Are you planning for groceries, or looking for a meal right now?</Bubble>
                <div className="flex flex-wrap gap-2">
                  <Chip active={false} onClick={() => setFoodNeed("groceries")}>Groceries for the week</Chip>
                  <Chip active={false} onClick={() => setFoodNeed("immediate")}>A meal right now</Chip>
                  <Chip active={false} onClick={() => setView("card")}>Show the resource</Chip>
                </div>
              </>
            )}
            {showResult && preset && (
              <>
                <Bubble>
                  {foodNeed === "immediate"
                    ? "Knights Pantry may help with groceries, but I cannot verify food available right now. Check its page before making the trip."
                    : preset.why}
                </Bubble>
                <button className={btn.primary} onClick={() => setView("card")}>
                  {preset.id === "food" ? "See pantry next step" : "See my next step"}
                </button>
              </>
            )}
            {messages.map((m) => (
              <Message key={m.id} from={m.role} className={m.role === "user" ? "ml-auto max-w-xl" : "max-w-xl"}>
                <MessageContent className={cn(m.role === "user" ? "group-[.is-user]:bg-primary/20 group-[.is-user]:text-foreground" : "rounded-3xl border border-border bg-card/60 px-4 py-3")}>
                  {m.parts.map((p, i) => (p.type === "text" ? <MessageResponse key={i}>{p.text}</MessageResponse> : null))}
                </MessageContent>
              </Message>
            ))}
            {status === "submitted" && <p className="animate-pulse text-sm text-muted-foreground">Next Step is thinking…</p>}
            {error && (
              <p className="text-sm text-destructive">
                AI is unavailable — <Link to="/browse" className="underline">browse resources</Link> instead.
              </p>
            )}
          </div>
          <AskBar value={input} onChange={setInput} onSubmit={() => { submitFree(input); }} placeholder="Ask a follow-up…" />
          <button className={btn.ghost + " mt-3"} onClick={() => { setView("starters"); setMessages([]); setPreset(null); }}>Choose another starter</button>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-start justify-between gap-6">
        <div>
          <p className="text-sm text-muted-foreground">University of Bridgeport</p>
          <h1 className="font-display text-4xl font-extrabold tracking-tight sm:text-5xl">
            {greetingFor()}, <span className="text-primary">{profile.name}</span>
          </h1>
          <p className="mt-2 text-lg text-muted-foreground">Make today a little easier.</p>
        </div>
        <Mascot className="hidden w-44 shrink-0 lg:block" />
      </div>
      <div className="mt-8 grid gap-3 sm:grid-cols-3">
        {PRESETS.map((p) => {
          const Icon = p.icon;
          return (
            <button key={p.id} onClick={() => startPreset(p)} className="group rounded-[1.5rem] border border-primary/35 bg-card/40 p-5 text-left shadow-card transition hover:border-primary">
              <span className="grid size-14 place-items-center rounded-2xl bg-primary/15 text-primary">
                <Icon className="size-7" />
              </span>
              <span className="mt-4 block font-display text-lg font-bold leading-snug">{p.title}</span>
              <span className="mt-1 flex items-center justify-between text-sm text-muted-foreground">
                {p.subtitle}
                <ArrowRight className="size-8 rounded-full border border-primary/40 p-1.5 text-primary" />
              </span>
            </button>
          );
        })}
      </div>
      <p className="mt-6 text-sm font-semibold text-foreground">Or start here</p>
      <div className="mt-2 grid grid-cols-2 gap-2 sm:grid-cols-4">
        {QUICK.map((q) => (
          <button
            key={q.label}
            onClick={() => {
              if (q.preset) startPreset(PRESETS.find((p) => p.id === q.preset)!);
              else submitFree(q.label);
            }}
            className="rounded-2xl border border-border bg-card/30 px-3 py-3 text-left hover:border-primary/50"
          >
            <span className="block font-semibold">{q.label}</span>
            <span className="text-xs text-muted-foreground">{q.hint}</span>
          </button>
        ))}
      </div>
      <AskBar value={input} onChange={setInput} onSubmit={() => submitFree(input)} placeholder="Tell Next Step what’s on your mind…" />
      <p className="mt-3 flex items-center gap-2 text-xs text-muted-foreground">
        <Building2 className="size-3.5" /> University of Bridgeport
      </p>
    </div>
  );
}

function Bubble({ children }: { children: string }) {
  return (
    <div className="flex max-w-xl items-start gap-2">
      <Mascot size="sm" className="mt-0.5" />
      <div className="rounded-3xl border border-border bg-card/70 px-4 py-3 text-sm shadow-card">{children}</div>
    </div>
  );
}

function AskBar({ value, onChange, onSubmit, placeholder }: { value: string; onChange: (v: string) => void; onSubmit: () => void; placeholder: string }) {
  return (
    <form
      className="mt-6 flex items-center gap-2 rounded-full border border-primary/40 bg-card/50 px-4 py-2 shadow-card"
      onSubmit={(e) => { e.preventDefault(); onSubmit(); }}
    >
      <Sparkles className="size-4 text-primary" />
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="min-h-11 flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
      />
      <button type="submit" className="grid size-10 place-items-center rounded-full bg-primary text-primary-foreground" aria-label="Send">
        <Send className="size-4" />
      </button>
    </form>
  );
}

function OnboardName({ value, onChange, onContinue }: { value: string; onChange: (v: string) => void; onContinue: () => void }) {
  return (
    <div className="relative grid gap-8 lg:grid-cols-[1fr_18rem]">
      <div>
        <span className="rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">Your campus, a little easier</span>
        <h1 className="mt-4 font-display text-4xl font-extrabold tracking-tight sm:text-5xl">
          What should I <span className="text-primary">call you?</span>
        </h1>
        <p className="mt-2 text-muted-foreground">A name you like is all we need.</p>
        <form className="mt-8 max-w-xl space-y-4" onSubmit={(e) => { e.preventDefault(); onContinue(); }}>
          <label className="sr-only" htmlFor="preferred-name">Preferred name</label>
          <input
            id="preferred-name"
            autoFocus
            maxLength={40}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder="Your name"
            className="w-full rounded-2xl border border-primary/40 bg-card/40 px-5 py-4 text-lg outline-none focus:ring-2 focus:ring-primary"
          />
          <button className={btn.primary + " w-full"} disabled={!value.trim()}>
            Continue <ArrowRight className="size-4" />
          </button>
        </form>
        <p className="mt-3 text-sm text-muted-foreground">No account needed. <span className="float-right">1 of 2</span></p>
      </div>
      <Mascot className="hidden justify-self-end lg:block" />
    </div>
  );
}

function OnboardSchool({ onContinue, onBack }: { onContinue: () => void; onBack: () => void }) {
  return (
    <div className="flex items-start justify-between gap-6">
      <div className="min-w-0 flex-1">
      <h1 className="max-w-xl font-display text-4xl font-extrabold tracking-tight sm:text-5xl">
        Let’s start with your <span className="text-primary">campus.</span>
      </h1>
      <p className="mt-2 text-muted-foreground">Resources selected for your school.</p>
      <div className="mt-8 flex max-w-xl items-center gap-4 rounded-[1.5rem] border-2 border-primary bg-card/50 p-4 shadow-card">
        <span className="grid size-12 place-items-center rounded-xl bg-primary/15 text-primary"><Building2 className="size-6" /></span>
        <div className="flex-1">
          <p className="font-bold">University of Bridgeport</p>
          <p className="text-sm text-muted-foreground">Bridgeport, Connecticut</p>
        </div>
        <span className="grid size-8 place-items-center rounded-full bg-primary text-primary-foreground"><Check className="size-4" /></span>
      </div>
      <p className="mt-3 text-sm text-muted-foreground">UB is the only campus available right now.</p>
      <div className="mt-6 max-w-xl space-y-3">
        <button className={btn.primary + " w-full"} onClick={onContinue}>Continue with UB <ArrowRight className="size-4" /></button>
        <button className={btn.secondary + " w-full"} onClick={onBack}>Back</button>
      </div>
      <p className="mt-4 text-right text-sm text-muted-foreground">2 of 2</p>
      </div>
      <Mascot className="hidden w-44 shrink-0 lg:block" />
    </div>
  );
}
