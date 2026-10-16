import { useState } from "react";
import { ArrowLeftRight, Check, ExternalLink, HelpCircle } from "lucide-react";
import { FACT_LABELS, factLabel, formatValue, getFact, sourceFor, type Resource } from "@/data/resources";
import type { FitResult } from "@/data/journeys";
import { Badge } from "./shell";
import { cn } from "@/lib/utils";

export function FitBadge({ fit }: { fit: FitResult }) {
  if (fit.status === "fits") return <Badge tone="success"><Check className="size-3" /> Fits your preferences</Badge>;
  if (fit.status === "no-fit") return <Badge tone="muted">Doesn’t fit · {fit.reasons[0]}</Badge>;
  if (fit.status === "confirm") return <Badge tone="warn">Possible · needs confirmation</Badge>;
  return <Badge tone="muted">No preferences set</Badge>;
}

export function SampleBadge({ r }: { r: Resource }) {
  return r.sample ? <Badge tone="danger">Sample data · fictional</Badge> : null;
}

const fmtDate = (d: string) => new Date(`${d}T12:00:00`).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });

export function ConflictPanel({ r }: { r: Resource }) {
  const fields = Object.entries(r.facts).filter(([, f]) => f.status === "conflicting");
  if (!fields.length) return null;
  return (
    <div className="space-y-3 rounded-xl border border-warn-foreground/30 bg-warn p-3 text-sm">
      <p className="font-semibold text-warn-foreground">Sources disagree. Confirm with the office before relying on these.</p>
      {fields.map(([field, f]) => (
        <div key={field}>
          <p className="text-xs font-semibold uppercase tracking-wide text-warn-foreground">{FACT_LABELS[field] ?? field}</p>
          <div className="mt-1 grid gap-2 sm:grid-cols-2">
            {f.evidence.map((e, i) => {
              const s = sourceFor(r, e.sourceId);
              return (
                <div key={i} className="rounded-lg bg-card p-2">
                  <p className="text-foreground">{formatValue(e.value)}</p>
                  <p className="text-xs text-muted-foreground">{s?.url ? <a href={s.url} target="_blank" rel="noreferrer" className="underline">{s.title.replace("UB resource research: ", "")}</a> : s?.title ?? "Source"}</p>
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}

const SHOW = ["location", "service_hours", "cost", "access", "modality", "phone", "email"];

export function FactList({ r }: { r: Resource }) {
  const rows = SHOW.map((field) => ({ field, l: factLabel(getFact(r, field)) }));
  const unknown = rows.filter((x) => x.l.tone === "unknown").map((x) => FACT_LABELS[x.field]);
  return (
    <dl className="grid grid-cols-[6.5rem_1fr] gap-x-2 gap-y-1 text-sm">
      {rows.filter((x) => x.l.tone !== "unknown").map(({ field, l }) => (
        <div key={field} className="contents">
          <dt className="text-muted-foreground">{FACT_LABELS[field]}</dt>
          <dd className={cn(l.tone === "conflict" ? "font-medium text-warn-foreground" : "text-foreground")}>
            {l.tone === "conflict" && <ArrowLeftRight className="mr-1 inline size-3.5" />}
            {l.text}
          </dd>
        </div>
      ))}
      {unknown.length > 0 && (
        <div className="contents">
          <dt className="text-muted-foreground"><HelpCircle className="mr-1 inline size-3.5 text-warn-foreground" />Unknown</dt>
          <dd className="text-muted-foreground">Ask about: {unknown.join(", ").toLowerCase()}</dd>
        </div>
      )}
      {r.windows.length > 0 && (
        <div className="contents">
          <dt className="text-muted-foreground">Window</dt>
          <dd className="text-foreground">{r.windows.map((w) => `${["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"][w.weekday]} ${w.start}–${w.end}`).join(", ")}</dd>
        </div>
      )}
      {r.event && (
        <div className="contents">
          <dt className="text-muted-foreground">When</dt>
          <dd className="text-foreground">
            {new Date(r.event.startsAt).toLocaleString("en-US", { weekday: "short", month: "short", day: "numeric", hour: "numeric", minute: "2-digit", timeZone: "America/New_York" })}–
            {new Date(r.event.endsAt).toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit", timeZone: "America/New_York" })} · registration {r.event.registration.replace("_", " ")}
          </dd>
        </div>
      )}
    </dl>
  );
}

export function Sources({ r }: { r: Resource }) {
  return (
    <div className="text-xs text-muted-foreground">
      {r.sources.map((s) => (
        <p key={s.id}>
          Source: {s.url ? <a href={s.url} target="_blank" rel="noreferrer" className="underline">{s.title.replace("UB resource research: ", "")}</a> : s.title} · Reviewed {fmtDate(s.reviewedAt)}
        </p>
      ))}
      {r.overdue && <p className="font-semibold text-warn-foreground">Source review overdue — details may be out of date.</p>}
    </div>
  );
}

export function ResourceCard({ r, fit, selected, action }: { r: Resource; fit?: FitResult; selected?: boolean; action?: React.ReactNode }) {
  const [showConflict, setShowConflict] = useState(false);
  const dim = fit?.status === "no-fit";
  return (
    <article className={cn("space-y-3 rounded-2xl border bg-card p-4 shadow-card", selected ? "border-primary ring-2 ring-primary/20" : "border-border", dim && "opacity-75")}>
      <div className="flex flex-wrap items-center gap-2">
        {fit && <FitBadge fit={fit} />}
        <SampleBadge r={r} />
        <Badge tone="muted">{r.category}</Badge>
        {r.offCampus && <Badge tone="muted">Off campus</Badge>}
        {r.confidence === "conflict" && (
          <button onClick={() => setShowConflict((v) => !v)} className="inline-flex items-center gap-1 rounded-full bg-warn px-2.5 py-0.5 text-xs font-semibold text-warn-foreground">
            <ArrowLeftRight className="size-3" /> details conflict · {showConflict ? "hide" : "see sources"}
          </button>
        )}
      </div>
      <div>
        <h3 className="font-display text-lg font-semibold text-card-foreground">{r.name}</h3>
        <p className="text-sm text-muted-foreground">{r.description}</p>
      </div>
      <FactList r={r} />
      {fit?.reasons.length ? <p className="text-sm text-foreground"><span className="text-muted-foreground">Why not: </span>{fit.reasons.join(" · ")}</p> : null}
      {showConflict && <ConflictPanel r={r} />}
      <p className="text-sm text-foreground"><span className="font-semibold">Next step: </span>{r.nextStep}</p>
      <Sources r={r} />
      <div className="flex flex-wrap items-center gap-2">
        {action}
        {r.url && (
          <a href={r.url} target="_blank" rel="noreferrer" className="inline-flex min-h-9 items-center gap-1 rounded-lg px-2 text-sm font-medium text-primary hover:bg-secondary">
            Official page <ExternalLink className="size-3.5" />
          </a>
        )}
      </div>
    </article>
  );
}
