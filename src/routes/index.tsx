import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Utensils, HeartPulse, Wallet, Compass, ShieldCheck } from "lucide-react";
import { Shell, Chip, btn } from "@/components/next/shell";
import { JOURNEYS, type JourneyId } from "@/data/journeys";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Next Step — CT Data × University of Bridgeport" },
      { name: "description", content: "Hungry, stressed, broke or bored? Next Step helps University of Bridgeport students find a real next step." },
      { property: "og:title", content: "Next Step — CT Data × University of Bridgeport" },
      { property: "og:description", content: "Turn what you need into one clear next step at UB." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Start,
});

type Card = { label: string; hint: string; icon: typeof Utensils; subs: { label: string; journey: JourneyId }[] };
const CARDS: Card[] = [
  { label: "I'm Hungry", hint: "Food & pantry options", icon: Utensils, subs: [{ label: "Food", journey: "food" }] },
  { label: "I'm Stressed", hint: "Support or class help", icon: HeartPulse, subs: [{ label: "Someone to talk to", journey: "support" }, { label: "A class or exam", journey: "tutoring" }] },
  { label: "I'm Broke", hint: "Jobs, aid & savings", icon: Wallet, subs: [{ label: "Money", journey: "money" }] },
  { label: "I'm Bored", hint: "Events, clubs & people", icon: Compass, subs: [{ label: "Things to do", journey: "events" }] },
];

function Start() {
  const [card, setCard] = useState<Card | null>(null);
  const [journey, setJourney] = useState<JourneyId | null>(null);
  const [msg, setMsg] = useState("");

  const pick = (c: Card) => {
    setCard(c);
    const first = c.subs[0]!.journey;
    setJourney(first);
    setMsg(JOURNEYS[first].starter);
  };
  const pickSub = (j: JourneyId) => {
    setJourney(j);
    setMsg(JOURNEYS[j].starter);
  };
  const j = journey ? JOURNEYS[journey] : null;

  return (
    <Shell className="max-w-3xl">
      <div className="text-center">
        <h1 className="font-display text-4xl font-semibold text-foreground sm:text-5xl">What do you need help with?</h1>
        <p className="mt-2 text-muted-foreground">Pick one. You don’t need to explain everything to see options.</p>
      </div>
      <div className="mt-8 grid grid-cols-2 gap-3">
        {CARDS.map((c) => {
          const Icon = c.icon;
          const active = card?.label === c.label;
          return (
            <button
              key={c.label}
              onClick={() => pick(c)}
              aria-pressed={active}
              className={cn(
                "flex flex-col items-start gap-3 rounded-2xl border-[1.5px] bg-card p-4 text-left shadow-card transition hover:-translate-y-0.5",
                active ? "border-primary" : "border-border hover:border-primary",
              )}
            >
              <span className={cn("grid size-11 place-items-center rounded-xl", active ? "bg-primary text-primary-foreground" : "bg-secondary text-primary")}>
                <Icon className="size-5" />
              </span>
              <span>
                <span className="block font-display text-xl font-semibold text-card-foreground">{c.label}</span>
                <span className="block text-sm text-muted-foreground">{c.hint}</span>
              </span>
            </button>
          );
        })}
      </div>

      {card && j && (
        <section className="mt-6 space-y-4 rounded-2xl border border-border bg-card p-5 shadow-card">
          {card.subs.length > 1 && (
            <div>
              <p className="mb-2 text-sm font-semibold text-foreground">Which is closer?</p>
              <div className="flex flex-wrap gap-2">
                {card.subs.map((s) => (
                  <Chip key={s.journey} active={journey === s.journey} onClick={() => pickSub(s.journey)}>{s.label}</Chip>
                ))}
              </div>
            </div>
          )}
          <label className="block">
            <span className="text-sm font-semibold text-foreground">Your message</span>
            <span className="ml-2 text-xs text-muted-foreground">Edit it in your own words</span>
            <textarea
              value={msg}
              onChange={(e) => setMsg(e.target.value)}
              rows={3}
              className="mt-2 w-full rounded-xl border border-input bg-background p-3 text-foreground outline-none focus:border-primary"
            />
          </label>
          <p className="text-sm text-muted-foreground">
            Next Step will ask about: {j.questions.map((q) => q.title.replace("?", "").toLowerCase()).join(", ")}. You can skip any question.
          </p>
          <p className="flex items-center gap-2 text-xs text-muted-foreground">
            <ShieldCheck className="size-4 text-primary" /> You won’t be asked for income, a diagnosis, or a student ID number.
          </p>
          <div className="flex flex-wrap gap-3">
            <Link to="/need/$journey" params={{ journey: j.id }} search={{ step: "prefs", msg }} className={btn.primary}>Start</Link>
            <Link to="/browse" className={btn.secondary}>Browse all resources</Link>
          </div>
        </section>
      )}
      {!card && (
        <p className="mt-6 text-center text-sm text-muted-foreground">
          Or <Link to="/browse" className="font-semibold text-primary underline">browse all resources</Link> · <Link to="/ask" className="font-semibold text-primary underline">ask a question</Link>
        </p>
      )}
    </Shell>
  );
}
