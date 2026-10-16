import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Shell, Chip, btn } from "@/components/next/shell";
import { ResourceCard } from "@/components/next/resource-card";
import { allResources, CATEGORIES, REAL, useDemo, type Resource } from "@/data/resources";
import type { JourneyId } from "@/data/journeys";

export const Route = createFileRoute("/browse")({
  head: () => ({
    meta: [
      { title: "Browse resources — Next Step" },
      { name: "description", content: `${REAL.length} University of Bridgeport and Connecticut student resources, with sources and what’s confirmed or unknown.` },
      { property: "og:title", content: "Browse resources — Next Step" },
      { property: "og:description", content: `${REAL.length} UB student resources in one list, with honest fact labels.` },
    ],
  }),
  component: Browse,
});

function journeyFor(r: Resource): JourneyId {
  const n = r.needs[0] ?? "";
  if (n === "food") return "food";
  if (n === "tutoring") return "tutoring";
  if (n === "money" || n === "career") return "money";
  if (n.startsWith("events")) return "events";
  return "support";
}

function Browse() {
  const [f, setF] = useState<string>("All");
  const [q, setQ] = useState("");
  const [demo, setDemo] = useDemo();
  const all = allResources(demo);
  const list = all.filter(
    (r) => (f === "All" || r.category === f) && (!q || `${r.name} ${r.description}`.toLowerCase().includes(q.toLowerCase())),
  );
  return (
    <Shell>
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="font-display text-3xl font-semibold text-foreground">Browse resources</h1>
          <p className="mt-1 text-sm text-muted-foreground">No preferences set, so fit can’t be compared. {list.length} of {all.length} offices and services.</p>
        </div>
        <label className="flex items-center gap-2 text-sm font-medium text-foreground">
          <input type="checkbox" checked={demo} onChange={(e) => setDemo(e.target.checked)} className="size-4 accent-primary" />
          Include demo (fictional) records
        </label>
      </div>
      <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search by name or need…" className="mt-4 w-full rounded-xl border border-input bg-card px-4 py-2.5 text-foreground outline-none focus:border-primary" />
      <div className="mt-3 flex flex-wrap gap-2">
        {["All", ...CATEGORIES].map((x) => <Chip key={x} active={f === x} onClick={() => setF(x)}>{x}</Chip>)}
      </div>
      <div className="mt-6 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {list.map((r) => (
          <ResourceCard
            key={r.id}
            r={r}
            action={<Link to="/need/$journey" params={{ journey: journeyFor(r) }} search={{ step: "card", r: r.id }} className={btn.secondary}>Prepare a next step</Link>}
          />
        ))}
      </div>
    </Shell>
  );
}
