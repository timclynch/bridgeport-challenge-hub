import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Shell, Chip, btn } from "@/components/next/shell";
import { ResourceCard } from "@/components/next/resource-card";
import { RESOURCES, type Category } from "@/data/resources";
import type { JourneyId } from "@/data/journeys";

export const Route = createFileRoute("/browse")({
  head: () => ({
    meta: [
      { title: "Browse resources — Next Step" },
      { name: "description", content: "All University of Bridgeport and Connecticut student resources in one list, with what’s confirmed and what isn’t." },
      { property: "og:title", content: "Browse resources — Next Step" },
      { property: "og:description", content: "Food, support, money, events, tutoring, housing and transport resources for UB students." },
    ],
  }),
  component: Browse,
});

const FILTERS: { id: Category | "all"; label: string }[] = [
  { id: "all", label: "All" },
  { id: "food", label: "Food" },
  { id: "support", label: "Support" },
  { id: "money", label: "Money & career" },
  { id: "events", label: "Events" },
  { id: "tutoring", label: "Tutoring" },
  { id: "housing", label: "Housing" },
  { id: "transport", label: "Transport" },
];
const TO_JOURNEY: Partial<Record<Category, JourneyId>> = { food: "food", support: "support", money: "money", events: "events", tutoring: "tutoring", housing: "support", transport: "support" };

function Browse() {
  const [f, setF] = useState<Category | "all">("all");
  const list = f === "all" ? RESOURCES : RESOURCES.filter((r) => r.categories.includes(f));
  return (
    <Shell>
      <h1 className="font-display text-3xl font-semibold text-foreground">Browse resources</h1>
      <p className="mt-1 text-sm text-muted-foreground">No preferences set, so fit can’t be compared. {list.length} offices and services.</p>
      <div className="mt-4 flex flex-wrap gap-2">
        {FILTERS.map((x) => <Chip key={x.id} active={f === x.id} onClick={() => setF(x.id)}>{x.label}</Chip>)}
      </div>
      <div className="mt-6 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {list.map((r) => {
          const j = TO_JOURNEY[r.categories[0] as Category] ?? "support";
          return (
            <ResourceCard
              key={r.id}
              r={r}
              action={<Link to="/need/$journey" params={{ journey: j }} search={{ step: "card", r: r.id }} className={btn.secondary}>Prepare a next step</Link>}
            />
          );
        })}
      </div>
    </Shell>
  );
}
