// Typed adapter over the Next Step data catalog (data/catalog.enriched.json, reviewed 2026-10-16).
// Fact values come only from the catalog. Unknown stays unknown; conflicting has no single value.
import { useCallback, useEffect, useState } from "react";
import catalog from "./catalog.json";
import demo from "./demo.json";

export type FactStatus = "published" | "conflicting" | "unknown" | "provider_confirmed";
export type Fact = { status: FactStatus; value: unknown; note: string; evidence: { sourceId: string; value: unknown }[] };
export type Source = { id: string; url: string | null; title: string; reviewedAt: string };
export type Window = { weekday: number; start: string; end: string };
export type CatalogEvent = { startsAt: string; endsAt: string; registration: string };

type Raw = {
  id: string; name: string; category: string; kind: string; description: string; url: string | null; nextStep: string;
  needs: string[]; sources: Source[]; facts: Record<string, Fact>; unknown: string[]; windows: Window[];
  event: CatalogEvent | null; sample: boolean; overdue: boolean;
};

export type Confidence = "published" | "confirm" | "conflict";
export type Resource = Raw & {
  helps: string;
  confidence: Confidence;
  offCampus: boolean;
  /** Attributes compared against preferences. Missing key = unknown. */
  tags: Record<string, string[]>;
};

export const DAY_NAMES = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const OFF = new Set(["gbt", "offcampus"]);

export const FACT_LABELS: Record<string, string> = {
  location: "Location",
  service_hours: "Hours",
  cost: "Cost",
  access: "Access",
  audience: "Who it’s for",
  modality: "How",
  documents: "Documents",
  appointment_availability: "Appointments",
  phone: "Phone",
  email: "Email",
  psychiatric_services: "Psychiatric services",
  capacity: "Capacity",
  arrival_guidance: "Arriving alone",
};

export function getFact(r: Pick<Raw, "facts">, field: string): Fact {
  return r.facts[field] ?? { status: "unknown", value: null, note: "", evidence: [] };
}

export function formatValue(v: unknown): string {
  if (v == null) return "";
  if (Array.isArray(v)) return v.map(formatValue).join(", ");
  if (typeof v === "object") {
    const o = v as Record<string, unknown>;
    if (o["kind"] === "free") return "Free";
    if (o["kind"]) return String(o["kind"]).replace(/_/g, " ");
    return Object.values(o).map(formatValue).join(" · ");
  }
  return String(v).replace(/_/g, " ").replace(/^enrolled student$/, "Enrolled students").replace(/^in person$/, "In person").replace(/^online$/, "Online");
}

/** Display text for a fact. Unknown is never shown as "no requirement". */
export function factLabel(f: Fact): { tone: "published" | "unknown" | "conflict"; text: string } {
  if (f.status === "conflicting") return { tone: "conflict", text: "Conflicting — sources disagree" };
  if (f.status === "unknown" || f.value == null) return { tone: "unknown", text: "Unknown — ask" };
  return { tone: "published", text: formatValue(f.value) };
}

function adapt(r: Raw): Resource {
  const tags: Record<string, string[]> = {};
  const modality = getFact(r, "modality");
  if (modality.status === "published" && Array.isArray(modality.value)) {
    tags["how"] = (modality.value as string[]).map((m) => (m === "in_person" ? "in-person" : m));
  }
  const offCampus = r.id.startsWith("community") || OFF.has(r.id);
  tags["where"] = [offCampus ? "off" : "on"];
  if (r.windows.length) tags["days"] = [...new Set(r.windows.map((w) => DAY_NAMES[w.weekday] as string))];
  else if (r.event) tags["days"] = [DAY_NAMES[(new Date(r.event.startsAt).getUTCDay() + 6) % 7] as string];
  const topics = r.needs.map((n) => n.replace("support_", ""));
  if (topics.length) tags["topic"] = topics;
  const conflict = Object.values(r.facts).some((f) => f.status === "conflicting");
  return { ...r, helps: r.description, offCampus, tags, confidence: conflict ? "conflict" : "confirm" };
}

export const REAL: Resource[] = (catalog as Raw[]).map(adapt);
export const DEMO: Resource[] = (demo as Raw[]).map(adapt);
export const allResources = (withDemo: boolean) => (withDemo ? [...REAL, ...DEMO] : REAL);
export const CATEGORIES = [...new Set(REAL.map((r) => r.category))].sort();

export const getResource = (id: string | undefined) => [...REAL, ...DEMO].find((r) => r.id === id);
export const sourceFor = (r: Resource, id: string) => r.sources.find((s) => s.id === id);

/** Key unknowns worth asking about before relying on this resource. */
export function unresolved(r: Resource): string[] {
  const keys = ["location", "service_hours", "appointment_availability", "cost", "documents"];
  return keys.filter((k) => getFact(r, k).status !== "published").map((k) => FACT_LABELS[k] as string);
}

const DEMO_KEY = "next-step:demo";
const demoSubs = new Set<(v: boolean) => void>();
export function useDemo() {
  const [on, setOn] = useState(false);
  useEffect(() => {
    setOn(localStorage.getItem(DEMO_KEY) === "1");
    demoSubs.add(setOn);
    return () => {
      demoSubs.delete(setOn);
    };
  }, []);
  const set = useCallback((v: boolean) => {
    localStorage.setItem(DEMO_KEY, v ? "1" : "0");
    demoSubs.forEach((s) => s(v));
  }, []);
  return [on, set] as const;
}
