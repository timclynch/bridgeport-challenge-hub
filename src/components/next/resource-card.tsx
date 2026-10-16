import { useState } from "react";
import { ArrowLeftRight, Check, HelpCircle } from "lucide-react";
import type { Resource } from "@/data/resources";
import type { FitResult } from "@/data/journeys";
import { Badge } from "./shell";
import { cn } from "@/lib/utils";

export function FitBadge({ fit }: { fit: FitResult }) {
  if (fit.status === "fits") return <Badge tone="success"><Check className="size-3" /> Fits your preferences</Badge>;
  if (fit.status === "no-fit") return <Badge tone="muted">Doesn’t fit · {fit.reasons[0]}</Badge>;
  if (fit.status === "confirm") return <Badge tone="warn">Possible · needs confirmation</Badge>;
  return <Badge tone="muted">No preferences set</Badge>;
}

export function ConfidenceBadge({ r }: { r: Resource }) {
  if (r.confidence === "published") return <Badge tone="success">Published</Badge>;
  if (r.confidence === "conflict") return <Badge tone="warn"><ArrowLeftRight className="size-3" /> Details conflict</Badge>;
  return <Badge tone="warn">Needs confirmation</Badge>;
}

export function ConflictPanel({ r }: { r: Resource }) {
  if (!r.conflict) return null;
  return (
    <div className="rounded-xl border border-warn-foreground/30 bg-warn p-3 text-sm">
      <p className="font-semibold text-warn-foreground">{r.conflict.summary}</p>
      <p className="text-warn-foreground">Confirm with the office before visiting.</p>
      <div className="mt-2 grid gap-2 sm:grid-cols-2">
        {r.conflict.sources.map((s) => (
          <div key={s.label} className="rounded-lg bg-card p-2">
            <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">{s.label}</p>
            <p className="text-foreground">{s.states}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export function ResourceCard({
  r,
  fit,
  selected,
  action,
}: {
  r: Resource;
  fit?: FitResult;
  selected?: boolean;
  action?: React.ReactNode;
}) {
  const [showConflict, setShowConflict] = useState(false);
  const dim = fit?.status === "no-fit";
  return (
    <article
      className={cn(
        "space-y-3 rounded-2xl border bg-card p-4 shadow-card",
        selected ? "border-primary ring-2 ring-primary/20" : "border-border",
        dim && "opacity-75",
      )}
    >
      <div className="flex flex-wrap items-center gap-2">
        {fit ? <FitBadge fit={fit} /> : <ConfidenceBadge r={r} />}
        {r.offCampus && <Badge tone="muted">Off campus</Badge>}
        {r.conflict && (
          <button onClick={() => setShowConflict((v) => !v)} className="inline-flex items-center gap-1 rounded-full bg-warn px-2.5 py-0.5 text-xs font-semibold text-warn-foreground">
            <ArrowLeftRight className="size-3" /> details conflict · {showConflict ? "hide" : "see sources"}
          </button>
        )}
      </div>
      <div>
        <h3 className="font-display text-lg font-semibold text-card-foreground">{r.name}</h3>
        <p className="text-sm text-muted-foreground">{r.helps}</p>
      </div>
      <dl className="grid grid-cols-[5.5rem_1fr] gap-x-2 gap-y-1 text-sm">
        <dt className="text-muted-foreground">Access</dt>
        <dd className="text-foreground">{r.access}</dd>
        {fit?.reasons.length ? (
          <>
            <dt className="text-muted-foreground">Why not</dt>
            <dd className="text-foreground">{fit.reasons.join(" · ")}</dd>
          </>
        ) : null}
      </dl>
      {showConflict && <ConflictPanel r={r} />}
      {r.unresolved.length > 0 && (
        <ul className="space-y-1 text-sm">
          {r.unresolved.map((u) => (
            <li key={u} className="flex gap-2 text-muted-foreground">
              <HelpCircle className="mt-0.5 size-4 shrink-0 text-warn-foreground" /> {u} — not published
            </li>
          ))}
        </ul>
      )}
      <p className="text-xs text-muted-foreground">Source: {r.source}</p>
      {action}
    </article>
  );
}
