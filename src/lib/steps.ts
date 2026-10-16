import { useCallback, useEffect, useState } from "react";

export type StepStatus = "deciding" | "contacted" | "confirmed" | "done";
export const STATUS_LABEL: Record<StepStatus, string> = {
  deciding: "Still deciding",
  contacted: "Contacted",
  confirmed: "Confirmed",
  done: "Done",
};

export type Step = {
  id: string;
  journey: string;
  resourceId: string;
  title: string;
  goal: string;
  questions: string[];
  status: StepStatus;
  note: string;
  sensitive: boolean;
  sample?: boolean | undefined;
};

export type Removed = { step: Step; index: number };

export const addStep = (list: Step[], step: Step) => [...list.filter((s) => s.id !== step.id), step];
export function removeStep(list: Step[], id: string): { list: Step[]; removed: Removed | null } {
  const index = list.findIndex((s) => s.id === id);
  if (index < 0) return { list, removed: null };
  return { list: list.filter((s) => s.id !== id), removed: { step: list[index] as Step, index } };
}
export function restoreStep(list: Step[], removed: Removed) {
  const next = [...list];
  next.splice(Math.min(removed.index, next.length), 0, removed.step);
  return next;
}
export function moveStep(list: Step[], id: string, dir: -1 | 1) {
  const i = list.findIndex((s) => s.id === id);
  const j = i + dir;
  if (i < 0 || j < 0 || j >= list.length) return list;
  const next = [...list];
  [next[i], next[j]] = [next[j] as Step, next[i] as Step];
  return next;
}
export const updateStep = (list: Step[], id: string, patch: Partial<Step>) =>
  list.map((s) => (s.id === id ? { ...s, ...patch } : s));

const KEY = "next-step:steps";
const subs = new Set<() => void>();
function read(): Step[] {
  try {
    return JSON.parse(localStorage.getItem(KEY) || "[]") as Step[];
  } catch {
    return [];
  }
}

export function useSteps() {
  const [steps, setSteps] = useState<Step[]>([]);
  useEffect(() => {
    const sync = () => setSteps(read());
    sync();
    subs.add(sync);
    window.addEventListener("storage", sync);
    return () => {
      subs.delete(sync);
      window.removeEventListener("storage", sync);
    };
  }, []);
  const update = useCallback((fn: (s: Step[]) => Step[]) => {
    localStorage.setItem(KEY, JSON.stringify(fn(read())));
    subs.forEach((s) => s());
  }, []);
  return { steps, update };
}
