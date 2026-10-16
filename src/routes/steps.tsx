import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Bookmark, ChevronDown, ChevronUp, Eye, EyeOff, Laptop, Search } from "lucide-react";
import { Mascot } from "@/components/next/brand";
import { Shell, Badge, btn } from "@/components/next/shell";
import { useSteps, removeStep, restoreStep, moveStep, updateStep, STATUS_LABEL, type StepStatus, type Removed } from "@/lib/steps";
import { getResource } from "@/data/resources";

export const Route = createFileRoute("/steps")({
  head: () => ({
    meta: [
      { title: "My next steps — Next Step" },
      { name: "description", content: "Your saved next steps, kept only on this device." },
      { property: "og:title", content: "My next steps — Next Step" },
      { property: "og:description", content: "Track the steps you’ve planned at the University of Bridgeport." },
    ],
  }),
  component: StepsPage,
});

function StepsPage() {
  const { steps, update } = useSteps();
  const [hide, setHide] = useState(false);
  const [removed, setRemoved] = useState<Removed | null>(null);

  return (
    <Shell className="max-w-3xl">
      <div className="relative">
        <Mascot className="pointer-events-none absolute -right-2 -top-6 hidden w-40 md:block" />
        <h1 className="font-display text-4xl font-extrabold tracking-tight">
          My next <span className="text-primary">steps</span>
        </h1>
        <p className="mt-1 text-muted-foreground">Pick up where you left off.</p>
      </div>
      <div className="mt-3 flex flex-wrap items-center justify-between gap-2">
        <p className="text-xs text-muted-foreground">Saved on this device. Saving does not place an order or book an appointment.</p>
        <button className={btn.ghost} onClick={() => setHide((v) => !v)}>
          {hide ? <Eye className="size-4" /> : <EyeOff className="size-4" />} {hide ? "Show details" : "Hide sensitive details"}
        </button>
      </div>
      {hide && <p className="mt-2 text-xs text-muted-foreground">Hides details on this screen. It doesn’t secure a shared device.</p>}

      {removed && (
        <div className="mt-4 flex items-center justify-between rounded-xl bg-secondary p-3 text-sm">
          <span className="text-secondary-foreground">Card removed from this device. Anything already sent can’t be recalled.</span>
          <button className={btn.ghost} onClick={() => { const r = removed; update((l) => restoreStep(l, r)); setRemoved(null); }}>Undo</button>
        </div>
      )}

      {steps.length === 0 ? (
        <div className="mt-8 rounded-[1.5rem] border border-dashed border-border p-8 text-center">
          <p className="text-muted-foreground">No saved steps yet. Find a resource and save its card here.</p>
          <Link to="/" className={btn.primary + " mt-4"}><Search className="size-4" /> Find another next step</Link>
        </div>
      ) : (
        <ol className="mt-6 space-y-4">
          {steps.map((s, i) => {
            const masked = hide && s.sensitive;
            return (
              <li key={s.id} className="space-y-3 rounded-[1.5rem] border border-primary/30 bg-card/50 p-5 shadow-card">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-start gap-3">
                    <span className="grid size-12 place-items-center rounded-2xl bg-primary/15 text-primary"><Bookmark className="size-5" /></span>
                    <div>
                      <h2 className="font-display text-xl font-bold">{masked ? "Saved for you to review" : s.title}</h2>
                      {!masked && <p className="text-sm text-muted-foreground">{s.goal || "Check options"}</p>}
                      <p className="mt-1 flex items-center gap-1 text-xs text-muted-foreground"><Laptop className="size-3.5" /> Saved on this device</p>
                    </div>
                  </div>
                  <div className="flex flex-col">
                    <button aria-label="Move up" disabled={i === 0} onClick={() => update((l) => moveStep(l, s.id, -1))} className="rounded p-1 text-muted-foreground hover:bg-muted disabled:opacity-30"><ChevronUp className="size-4" /></button>
                    <button aria-label="Move down" disabled={i === steps.length - 1} onClick={() => update((l) => moveStep(l, s.id, 1))} className="rounded p-1 text-muted-foreground hover:bg-muted disabled:opacity-30"><ChevronDown className="size-4" /></button>
                  </div>
                </div>
                {!masked && (
                  <>
                    <div className="flex flex-wrap items-center gap-2 text-sm">
                      <span className="text-muted-foreground">Status:</span>
                      {(Object.keys(STATUS_LABEL) as StepStatus[]).map((st) => (
                        <button key={st} onClick={() => update((l) => updateStep(l, s.id, { status: st }))}>
                          <Badge tone={s.status === st ? "success" : "muted"}>{STATUS_LABEL[st]}</Badge>
                        </button>
                      ))}
                    </div>
                    {s.questions.length > 0 && (
                      <ul className="text-sm text-foreground">{s.questions.map((q) => <li key={q}>• {q}</li>)}</ul>
                    )}
                    {(s.status === "confirmed" || s.status === "done") && (
                      <input
                        defaultValue={s.note}
                        onBlur={(e) => update((l) => updateStep(l, s.id, { note: e.target.value }))}
                        placeholder="What was confirmed, and by whom?"
                        className="w-full rounded-lg border border-input bg-background/40 px-3 py-2 text-sm outline-none focus:border-primary"
                      />
                    )}
                    {s.status === "contacted" && <NoReply journey={s.journey} resourceId={s.resourceId} />}
                  </>
                )}
                <div className="flex flex-wrap gap-2">
                  {!masked && getResource(s.resourceId) && (
                    <Link to="/need/$journey" params={{ journey: s.journey }} search={{ step: "card", r: s.resourceId, msg: s.goal }} className={btn.primary}>
                      View next step
                    </Link>
                  )}
                  <button className={btn.ghost + " text-danger"} onClick={() => { let rm: Removed | null = null; update((l) => { const res = removeStep(l, s.id); rm = res.removed; return res.list; }); setRemoved(rm); }}>Remove</button>
                </div>
              </li>
            );
          })}
        </ol>
      )}
      {steps.length > 0 && (
        <Link to="/" className={btn.primary + " mt-8 w-full"}><Search className="size-4" /> Find another next step</Link>
      )}
    </Shell>
  );
}

function NoReply({ journey, resourceId }: { journey: string; resourceId: string }) {
  return (
    <div className="rounded-xl bg-muted p-3 text-sm">
      <p className="font-semibold text-foreground">Waiting for a reply?</p>
      <p className="text-muted-foreground">No response time is published. You could:</p>
      <div className="mt-2 flex flex-wrap gap-2">
        <Link to="/need/$journey" params={{ journey }} search={{ step: "card", r: "affairs" }} className={btn.ghost}>Try another route: Student Affairs →</Link>
        <Link to="/need/$journey" params={{ journey }} search={{ step: "card", r: resourceId, msg: "Following up on my earlier message." }} className={btn.ghost}>Prepare a follow-up →</Link>
        <Link to="/need/$journey" params={{ journey }} search={{ step: "prefs" }} className={btn.ghost}>Change my timing →</Link>
      </div>
    </div>
  );
}
