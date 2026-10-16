import { useState, type ReactNode } from "react";
import { ArrowLeftRight, Bookmark, Building2, Check, Clock, ExternalLink, HelpCircle, Lock, MapPin } from "lucide-react";
import { FACT_LABELS, factLabel, formatValue, getFact, sourceFor, unresolved, type Resource } from "@/data/resources";
import type { FitResult } from "@/data/journeys";
import { Badge, btn } from "./shell";
import { Mascot } from "./brand";
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

export function actionLabel(r: Resource) {
  if (r.id === "pantry") return "Open pantry information";
  if (r.id === "tutoring") return "View tutoring options";
  if (r.id === "career") return "Explore career support";
  return "Open official page";
}

function factLine(r: Resource, field: string) {
  const l = factLabel(getFact(r, field));
  if (l.tone === "unknown") return "Confirm with the office";
  if (l.tone === "conflict") return "Sources disagree — confirm before you go";
  return l.text;
}

export function DestinationCard({
  r,
  heading,
  why,
  warn,
  onSave,
  saved,
  extra,
}: {
  r: Resource;
  heading: string;
  why?: string;
  warn?: string;
  onSave?: () => void;
  saved?: boolean;
  extra?: ReactNode;
}) {
  const unknowns = unresolved(r);
  const warnText =
    warn ??
    (unknowns.length
      ? `Check ${unknowns.join(", ").toLowerCase()} before relying on this.`
      : r.confidence === "conflict"
        ? "Some listed details conflict across official pages. Confirm with the office."
        : null);
  return (
    <div>
      <p className="text-xs font-bold uppercase tracking-[0.2em] text-muted-foreground">Your next step</p>
      <h1 className="mt-1 font-display text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">{heading}</h1>
      <article className="relative mt-6 overflow-hidden rounded-[1.75rem] border border-primary/40 bg-card/50 p-5 shadow-card sm:p-7">
        <Mascot className="pointer-events-none absolute right-2 top-2 hidden w-40 lg:block" />
        <div className="flex max-w-xl items-start gap-3">
          <span className="grid size-12 shrink-0 place-items-center rounded-2xl border border-primary/40 bg-primary/10 text-primary">
            <Building2 className="size-6" />
          </span>
          <div>
            <h2 className="font-display text-2xl font-bold text-foreground">{r.name}</h2>
            <p className="text-sm text-muted-foreground">{why ?? r.description}</p>
          </div>
        </div>
        <dl className="mt-5 max-w-xl space-y-2 text-sm">
          <div className="flex gap-2">
            <MapPin className="mt-0.5 size-4 shrink-0 text-primary" />
            <div><span className="font-semibold">Location: </span>{factLine(r, "location")}</div>
          </div>
          <div className="flex gap-2">
            <Clock className="mt-0.5 size-4 shrink-0 text-primary" />
            <div><span className="font-semibold">Hours: </span>{factLine(r, "service_hours")}</div>
          </div>
          <div className="flex gap-2">
            <Lock className="mt-0.5 size-4 shrink-0 text-primary" />
            <div><span className="font-semibold">Access: </span>{factLine(r, "access")}</div>
          </div>
        </dl>
        {warnText && (
          <p className="mt-4 max-w-xl rounded-2xl border border-amber-400/40 bg-amber-500/15 px-4 py-3 text-sm font-medium text-warn-foreground">
            {warnText}
          </p>
        )}
        {r.confidence === "conflict" && <div className="mt-4 max-w-xl"><ConflictPanel r={r} /></div>}
        <div className="mt-5 flex max-w-xl flex-wrap gap-3">
          {r.url && (
            <a href={r.url} target="_blank" rel="noreferrer" className={btn.primary}>
              {actionLabel(r)} <ExternalLink className="size-4" />
            </a>
          )}
          {onSave && (
            <button type="button" onClick={onSave} className={btn.secondary}>
              <Bookmark className="size-4" /> {saved ? "Saved on this device" : "Save this step"}
            </button>
          )}
        </div>
        {extra}
        <div className="mt-6 flex max-w-xl flex-wrap items-end justify-between gap-2 border-t border-border/60 pt-4 text-xs text-muted-foreground">
          <Sources r={r} />
          <p>Opening a page does not place an order or book an appointment.</p>
        </div>
      </article>
    </div>
  );
}

export function ResourceCard({ r, fit, selected, action }: { r: Resource; fit?: FitResult; selected?: boolean; action?: React.ReactNode }) {
  const [showConflict, setShowConflict] = useState(false);
  const dim = fit?.status === "no-fit";
  return (
    <article className={cn("space-y-3 rounded-[1.5rem] border bg-card/55 p-4 shadow-card backdrop-blur", selected ? "border-primary ring-2 ring-primary/20" : "border-border", dim && "opacity-75")}>
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
