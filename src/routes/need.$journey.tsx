import { createFileRoute, Link, notFound, useNavigate } from "@tanstack/react-router";
import { useEffect, useMemo, useRef, useState } from "react";
import { ArrowLeft, Check, Globe, MapPin, Phone, Plus, X, AlertCircle } from "lucide-react";
import { Shell, Chip, Badge, btn } from "@/components/next/shell";
import { ResourceCard, ConflictPanel, FitBadge } from "@/components/next/resource-card";
import { JOURNEYS, isJourney, rankOptions, fit as fitOf, type FitStatus } from "@/data/journeys";
import { getResource, type Resource } from "@/data/resources";
import { useSteps, addStep } from "@/lib/steps";

type StepName = "prefs" | "compare" | "card" | "contact";
type Search = { step: StepName; msg?: string | undefined; r?: string | undefined; p?: Record<string, string> | undefined };

export const Route = createFileRoute("/need/$journey")({
  validateSearch: (s: { step?: unknown; msg?: unknown; r?: unknown; p?: unknown }): Search => ({
    step: (["prefs", "compare", "card", "contact"] as const).includes(s["step"] as StepName) ? (s["step"] as StepName) : "prefs",
    msg: typeof s["msg"] === "string" ? s["msg"] : undefined,
    r: typeof s["r"] === "string" ? s["r"] : undefined,
    p: s["p"] && typeof s["p"] === "object" ? (s["p"] as Record<string, string>) : undefined,
  }),
  beforeLoad: ({ params }) => {
    if (!isJourney(params.journey)) throw notFound();
  },
  head: ({ params }) => {
    const label = isJourney(params.journey) ? JOURNEYS[params.journey].label : "Help";
    return {
      meta: [
        { title: `${label} options — Next Step` },
        { name: "description", content: `Compare ${label.toLowerCase()} options at the University of Bridgeport and prepare one next step.` },
        { property: "og:title", content: `${label} options — Next Step` },
        { property: "og:description", content: "Compare options, check what fits, and prepare your next step." },
      ],
    };
  },
  component: JourneyPage,
});

function JourneyPage() {
  const { journey: jid } = Route.useParams();
  const search = Route.useSearch();
  const navigate = useNavigate({ from: Route.fullPath });
  const journey = JOURNEYS[jid as keyof typeof JOURNEYS];
  const prefs = search.p ?? {};
  const go = (patch: Partial<Search>) => navigate({ search: (prev) => ({ ...prev, ...patch }) });

  return (
    <Shell>
      <div className="mb-4 flex items-center justify-between">
        <BackLink step={search.step} go={go} />
        <span className="font-display text-xl font-semibold text-foreground">{journey.label}</span>
        <span className="w-16" />
      </div>
      {search.step === "prefs" && <Prefs journey={journey} prefs={prefs} msg={search.msg} go={go} />}
      {search.step === "compare" && <Compare journey={journey} prefs={prefs} selected={search.r} go={go} />}
      {(search.step === "card" || search.step === "contact") && (
        <CardStep journey={journey} r={getResource(search.r)} prefs={prefs} msg={search.msg ?? journey.starter} contact={search.step === "contact"} go={go} />
      )}
    </Shell>
  );
}

function BackLink({ step, go }: { step: StepName; go: (p: Partial<Search>) => void }) {
  if (step === "prefs") return <Link to="/" className={btn.ghost}><ArrowLeft className="size-4" /> Back</Link>;
  const prev: Record<StepName, StepName> = { prefs: "prefs", compare: "prefs", card: "compare", contact: "card" };
  const label = step === "card" ? "Options" : step === "contact" ? "Card" : "Back";
  return <button onClick={() => go({ step: prev[step] })} className={btn.ghost}><ArrowLeft className="size-4" /> {label}</button>;
}

type J = (typeof JOURNEYS)[keyof typeof JOURNEYS];

function PrefChips({ journey, prefs, onChange }: { journey: J; prefs: Record<string, string>; onChange: (p: Record<string, string>) => void }) {
  return (
    <div className="space-y-5">
      {journey.questions.map((q) => (
        <div key={q.id}>
          <p className="mb-2 font-semibold text-foreground">{q.title}</p>
          <div className="flex flex-wrap gap-2">
            {q.options.map((o) => (
              <Chip key={o.value} active={(prefs[q.id] ?? "any") === o.value} onClick={() => onChange({ ...prefs, [q.id]: o.value })}>
                {o.label}
              </Chip>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

function Prefs({ journey, prefs, msg, go }: { journey: J; prefs: Record<string, string>; msg: string | undefined; go: (p: Partial<Search>) => void }) {
  const [draft, setDraft] = useState(prefs);
  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div className="rounded-2xl border border-border bg-card p-4">
        <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Your message · editable</p>
        <textarea
          defaultValue={msg ?? journey.starter}
          onBlur={(e) => go({ msg: e.target.value })}
          rows={2}
          className="mt-1 w-full resize-none bg-transparent text-foreground outline-none"
        />
      </div>
      <p className="text-muted-foreground">Use these preferences to compare options. Change or skip them at any time.</p>
      <PrefChips journey={journey} prefs={draft} onChange={setDraft} />
      <p className="text-xs text-muted-foreground">No symptom questions, income, diagnosis or student ID needed to see options.</p>
      <div className="flex flex-wrap gap-3">
        <button className={btn.primary} onClick={() => go({ step: "compare", p: draft })}>Show my options</button>
        <button className={btn.secondary} onClick={() => go({ step: "compare", p: {} })}>Skip and browse</button>
      </div>
    </div>
  );
}

function summary(journey: J, prefs: Record<string, string>) {
  const parts = journey.questions
    .filter((q) => prefs[q.id] && prefs[q.id] !== "any")
    .map((q) => q.options.find((o) => o.value === prefs[q.id])?.label ?? "");
  return parts.length ? parts.join(" · ") : "No preferences set";
}

function Compare({ journey, prefs, selected, go }: { journey: J; prefs: Record<string, string>; selected: string | undefined; go: (p: Partial<Search>) => void }) {
  const ranked = useMemo(() => rankOptions(journey, prefs), [journey, prefs]);
  const [editing, setEditing] = useState(false);
  const [change, setChange] = useState<{ prev: Record<string, string>; lines: string[] } | null>(null);
  const prevRef = useRef(prefs);

  useEffect(() => {
    const before = prevRef.current;
    if (JSON.stringify(before) === JSON.stringify(prefs)) return;
    const lines: string[] = [];
    for (const { resource, fit } of ranked) {
      const old: FitStatus = fitOf(resource, before, journey.questions).status;
      if (old !== fit.status) {
        if (fit.status === "no-fit") lines.push(`${resource.name} no longer fits: ${fit.reasons[0]}`);
        else if (old === "no-fit") lines.push(`${resource.name} is back in your options`);
      }
    }
    setChange({ prev: before, lines });
    prevRef.current = prefs;
  }, [prefs, ranked, journey.questions]);

  const left = ranked.filter((x) => x.fit.status === "no-fit").length;
  const unknownDays = ranked.filter((x) => x.fit.unknown.length).length;
  const sel = ranked.find((x) => x.resource.id === selected) ?? ranked[0];

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_380px]">
      <div className="space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-2 rounded-2xl border border-border bg-card p-4">
          <span className="font-semibold text-foreground">{summary(journey, prefs)}</span>
          <button className={btn.ghost} onClick={() => setEditing((v) => !v)}>{editing ? "Done" : "Edit"}</button>
          {editing && (
            <div className="w-full pt-2">
              <PrefChips journey={journey} prefs={prefs} onChange={(p) => go({ p })} />
            </div>
          )}
        </div>
        {change && (
          <div className="flex items-start justify-between gap-3 rounded-2xl bg-secondary p-4 text-sm">
            <div>
              <p className="font-semibold text-secondary-foreground">Re-checked {ranked.length} options against your new preferences</p>
              {change.lines.length ? change.lines.map((l) => <p key={l} className="text-foreground">{l}</p>) : <p className="text-foreground">No option changed fit.</p>}
              <p className="text-muted-foreground">Kept: your message and anything saved.</p>
            </div>
            <button className={btn.ghost} onClick={() => { const prev = change.prev; setChange(null); prevRef.current = prev; go({ p: prev }); }}>Undo</button>
          </div>
        )}
        <ul className="space-y-1 text-sm">
          <li className="flex gap-2 text-foreground"><Check className="size-4 text-primary" /> Compared access details for {ranked.length} resources</li>
          {left > 0 && <li className="flex gap-2 text-foreground"><Check className="size-4 text-primary" /> Moved {left} that don’t fit to the bottom</li>}
          {unknownDays > 0 && <li className="flex gap-2 text-warn-foreground"><AlertCircle className="size-4" /> Couldn’t check some preferences for {unknownDays}: no published details</li>}
        </ul>
        {ranked.map(({ resource, fit }) => (
          <ResourceCard
            key={resource.id}
            r={resource}
            fit={fit}
            selected={sel?.resource.id === resource.id}
            action={
              <div className="flex flex-wrap gap-2">
                <button className={btn.primary} onClick={() => go({ step: "card", r: resource.id })}>Prepare my next step</button>
                <button className={btn.ghost + " lg:inline-flex hidden"} onClick={() => go({ r: resource.id })}>Preview</button>
              </div>
            }
          />
        ))}
        <p className="text-sm text-muted-foreground">
          None of these right? <button className="font-semibold text-primary underline" onClick={() => go({ step: "card", r: "student-affairs" })}>Start with Student Affairs</button>, a general contact.
        </p>
      </div>
      {sel && (
        <aside className="hidden lg:block">
          <div className="sticky top-24 space-y-3 rounded-2xl border border-border bg-card p-5 shadow-card">
            <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Preview</p>
            <h3 className="font-display text-xl font-semibold text-card-foreground">{sel.resource.name}</h3>
            <FitBadge fit={sel.fit} />
            <p className="text-sm text-muted-foreground">Questions you’d confirm:</p>
            <ul className="space-y-1 text-sm text-foreground">
              {journey.confirmQs.map((q) => <li key={q}>• {q}</li>)}
            </ul>
            <button className={btn.primary + " w-full"} onClick={() => go({ step: "card", r: sel.resource.id })}>Prepare my next step</button>
          </div>
        </aside>
      )}
    </div>
  );
}

function CardStep({ journey, r, prefs, msg, contact, go }: { journey: J; r: Resource | undefined; prefs: Record<string, string>; msg: string; contact: boolean; go: (p: Partial<Search>) => void }) {
  const { update } = useSteps();
  const [goal, setGoal] = useState(msg);
  const [qs, setQs] = useState(() => [...journey.confirmQs, ...(r?.unresolved.slice(0, 1).map((u) => `${u}?`) ?? [])]);
  const [checked, setChecked] = useState<Set<string>>(() => new Set(journey.confirmQs));
  const [newQ, setNewQ] = useState("");
  const [toast, setToast] = useState<string | null>(null);
  const [savedId, setSavedId] = useState<string | null>(null);
  if (!r) return <p className="text-muted-foreground">Pick an option first.</p>;
  const f = fitOf(r, prefs, journey.questions);
  const chosen = qs.filter((q) => checked.has(q));
  const draft = `Hi, I'm a current University of Bridgeport student. ${goal}\n\nCould you help me with:\n${chosen.map((q) => `- ${q}`).join("\n")}\n\nThank you,\n[Your name]`;

  const flash = (t: string) => { setToast(t); setTimeout(() => setToast(null), 3500); };
  const copy = async () => {
    try { await navigator.clipboard.writeText(chosen.join("\n")); flash(`${chosen.length} questions copied. Nothing has been sent.`); }
    catch { flash("Couldn’t copy — select the questions and copy them yourself."); }
  };
  const save = () => {
    const id = savedId ?? `${r.id}-${Date.now().toString(36)}`;
    update((list) => addStep(list, { id, journey: journey.id, resourceId: r.id, title: r.name, goal, questions: chosen, status: "deciding", note: "", sensitive: journey.id === "support" }));
    setSavedId(id);
    flash("Saved to My next steps. This is not an appointment.");
  };

  if (contact) return <ContactStep r={r} draft={draft} chosen={chosen} />;

  return (
    <div className="mx-auto max-w-2xl space-y-5">
      <div>
        <p className="text-sm text-muted-foreground">Your next step</p>
        <h1 className="font-display text-3xl font-semibold text-foreground">Contact {r.name}</h1>
        <div className="mt-2 flex flex-wrap gap-2">
          <FitBadge fit={f} />
          <Badge tone={savedId ? "success" : "muted"}>{savedId ? "Saved · not sent" : "Not saved"}</Badge>
        </div>
      </div>
      <section className="space-y-4 rounded-2xl border border-border bg-card p-5 shadow-card">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Why this may fit</p>
          <p className="text-foreground">{r.helps}. {r.access}.</p>
        </div>
        {r.conflict && <ConflictPanel r={r} />}
        <label className="block">
          <span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Goal, in your words</span>
          <textarea value={goal} onChange={(e) => setGoal(e.target.value)} rows={2} className="mt-1 w-full rounded-xl border border-input bg-background p-3 text-foreground outline-none focus:border-primary" />
        </label>
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Before you go · confirm</p>
          <ul className="mt-2 space-y-2">
            {qs.map((q) => (
              <li key={q} className="flex items-center gap-3">
                <input type="checkbox" checked={checked.has(q)} onChange={() => setChecked((s) => { const n = new Set(s); if (n.has(q)) n.delete(q); else n.add(q); return n; })} className="size-4 accent-primary" />
                <span className="flex-1 text-foreground">{q}</span>
                <button aria-label={`Remove ${q}`} onClick={() => setQs((l) => l.filter((x) => x !== q))} className="text-muted-foreground hover:text-foreground"><X className="size-4" /></button>
              </li>
            ))}
          </ul>
          <form className="mt-2 flex gap-2" onSubmit={(e) => { e.preventDefault(); const v = newQ.trim(); if (!v) return; setQs((l) => [...l, v]); setChecked((s) => new Set(s).add(v)); setNewQ(""); }}>
            <input value={newQ} onChange={(e) => setNewQ(e.target.value)} placeholder="Add a question" className="flex-1 rounded-lg border border-input bg-background px-3 py-2 text-sm outline-none focus:border-primary" />
            <button className={btn.ghost}><Plus className="size-4" /> Add</button>
          </form>
        </div>
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Bring</p>
          <p className="text-foreground">{journey.bring}</p>
        </div>
        <details className="rounded-xl bg-muted p-3">
          <summary className="cursor-pointer text-sm font-semibold text-foreground">Optional draft message</summary>
          <pre className="mt-2 whitespace-pre-wrap font-sans text-sm text-foreground">{draft}</pre>
          <p className="mt-1 text-xs text-muted-foreground">Brackets are placeholders to fill in.</p>
        </details>
      </section>
      {toast && <p role="status" className="rounded-xl bg-secondary p-3 text-sm font-medium text-secondary-foreground">{toast}</p>}
      <div className="flex flex-wrap gap-3">
        <button className={btn.primary} onClick={() => go({ step: "contact" })}>Choose how to make contact</button>
        <button className={btn.secondary} onClick={copy}>Copy questions</button>
        <button className={btn.secondary} onClick={save}>{savedId ? "Update saved card" : "Save to My next steps"}</button>
        {savedId && <Link to="/steps" className={btn.ghost}>View in My next steps</Link>}
      </div>
    </div>
  );
}

function ContactStep({ r, draft, chosen }: { r: Resource; draft: string; chosen: string[] }) {
  const methods = [
    r.contact.phone && { id: "call", icon: Phone, label: "Call", to: r.contact.phoneLabel ?? r.contact.phone, inc: "Your questions to read out", does: "You call from your phone. Nothing is sent by Next Step.", href: `tel:${r.contact.phone.replace(/[^0-9]/g, "")}`, cta: `Call ${r.contact.phone}` },
    r.contact.url && { id: "online", icon: Globe, label: "Online", to: r.contact.urlLabel ?? r.contact.url, inc: "Copy your draft and paste it into their form or email", does: "Opens their site in a new tab.", href: r.contact.url, cta: "Open their site" },
    { id: "walk", icon: MapPin, label: "Walk in", to: r.conflict ? "Location not confirmed — call first" : "Their office", inc: "Your questions on your phone", does: "Go in person. Confirm location and hours first.", href: "", cta: "" },
  ].filter(Boolean) as { id: string; icon: typeof Phone; label: string; to: string; inc: string; does: string; href: string; cta: string }[];
  const [pick, setPick] = useState(methods[0]!.id);
  const m = methods.find((x) => x.id === pick)!;
  return (
    <div className="mx-auto max-w-2xl space-y-5">
      <h1 className="font-display text-3xl font-semibold text-foreground">How do you want to make contact?</h1>
      <div className="flex flex-wrap gap-2">
        {methods.map((x) => <Chip key={x.id} active={pick === x.id} onClick={() => setPick(x.id)}>{x.label}</Chip>)}
      </div>
      <section className="space-y-3 rounded-2xl border border-border bg-card p-5 shadow-card">
        <dl className="grid grid-cols-[7rem_1fr] gap-2 text-sm">
          <dt className="text-muted-foreground">Goes to</dt><dd className="text-foreground">{m.to}</dd>
          <dt className="text-muted-foreground">Includes</dt><dd className="text-foreground">{m.inc} ({chosen.length} questions)</dd>
          <dt className="text-muted-foreground">What happens</dt><dd className="text-foreground">{m.does}</dd>
        </dl>
        {m.href ? (
          <a href={m.href} target={m.id === "online" ? "_blank" : undefined} rel="noreferrer" className={btn.primary} onClick={() => m.id === "online" && navigator.clipboard?.writeText(draft).catch(() => {})}>{m.cta}</a>
        ) : null}
        <p className="text-xs text-muted-foreground">No contact or appointment is confirmed by this screen. Your card stays at “Still deciding” until you change it in My next steps.</p>
      </section>
      <Link to="/steps" className={btn.secondary}>Go to My next steps</Link>
    </div>
  );
}
