import { Link } from "@tanstack/react-router";
import type { ReactNode } from "react";
import { useState } from "react";
import { Footprints, Phone, X } from "lucide-react";
import { useSteps } from "@/lib/steps";
import { cn } from "@/lib/utils";

export function Shell({ children, className }: { children: ReactNode; className?: string }) {
  const { steps } = useSteps();
  const [urgent, setUrgent] = useState(false);
  return (
    <div className="flex min-h-dvh flex-col bg-background">
      <header className="sticky top-0 z-30 border-b border-border bg-background/95 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-3">
          <Link to="/" className="flex items-center gap-2.5">
            <span className="grid size-9 place-items-center rounded-lg bg-primary text-primary-foreground">
              <Footprints className="size-5" />
            </span>
            <span className="leading-tight">
              <span className="block font-display text-lg font-semibold text-foreground">Next Step</span>
              <span className="block text-[11px] text-muted-foreground">CT Data × University of Bridgeport</span>
            </span>
          </Link>
          <nav className="flex items-center gap-1 text-sm">
            <Link to="/browse" className="hidden rounded-md px-3 py-2 text-muted-foreground hover:bg-muted sm:block" activeProps={{ className: "text-foreground font-semibold" }}>
              Browse
            </Link>
            <Link to="/ask" className="hidden rounded-md px-3 py-2 text-muted-foreground hover:bg-muted sm:block" activeProps={{ className: "text-foreground font-semibold" }}>
              Ask
            </Link>
            <Link to="/steps" className="rounded-md px-3 py-2 font-medium text-primary hover:bg-secondary">
              My next steps · {steps.length}
            </Link>
            <button
              onClick={() => setUrgent(true)}
              className="rounded-md px-3 py-2 font-semibold text-danger hover:bg-danger-soft"
            >
              Need urgent help?
            </button>
          </nav>
        </div>
      </header>
      <main className={cn("mx-auto w-full max-w-6xl flex-1 px-4 py-6", className)}>{children}</main>
      <footer className="border-t border-border py-4 text-center text-xs text-muted-foreground">
        Next Step · CT Data × University of Bridgeport · Details come from public research — always confirm with the office.
      </footer>
      {urgent && <UrgentHelp onClose={() => setUrgent(false)} />}
    </div>
  );
}

function UrgentHelp({ onClose }: { onClose: () => void }) {
  const rows = [
    { label: "Call 911", sub: "Immediate danger or medical emergency", href: "tel:911", strong: true },
    { label: "UB Campus Security · 203-576-4911", sub: "Campus emergency response (number from mockup — confirm)", href: "tel:2035764911", strong: true },
    { label: "988 Suicide & Crisis Lifeline", sub: "Call or text 988, 24/7, free and confidential", href: "tel:988", strong: false },
    { label: "CT 2-1-1", sub: "Food, housing and crisis help across Connecticut", href: "tel:211", strong: false },
  ];
  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-foreground/40 p-4" role="dialog" aria-modal="true" aria-label="Need urgent help?">
      <div className="w-full max-w-md rounded-2xl bg-card p-6 shadow-card">
        <div className="flex items-start justify-between">
          <h2 className="font-display text-2xl font-semibold text-danger">Need urgent help?</h2>
          <button onClick={onClose} aria-label="Close" className="rounded-md p-1 text-muted-foreground hover:bg-muted">
            <X className="size-5" />
          </button>
        </div>
        <p className="mt-2 text-sm text-muted-foreground">No form or account needed. Calls go from your phone.</p>
        <div className="mt-4 space-y-2">
          {rows.map((r) => (
            <a
              key={r.label}
              href={r.href}
              className={cn(
                "flex items-center gap-3 rounded-xl border p-3",
                r.strong ? "border-danger bg-danger-soft" : "border-border hover:bg-muted",
              )}
            >
              <Phone className={cn("size-5", r.strong ? "text-danger" : "text-primary")} />
              <span>
                <span className="block font-semibold text-foreground">{r.label}</span>
                <span className="block text-xs text-muted-foreground">{r.sub}</span>
              </span>
            </a>
          ))}
        </div>
        <p className="mt-4 text-xs text-muted-foreground">Next Step doesn’t monitor messages or send help.</p>
      </div>
    </div>
  );
}

export function Badge({ tone, children }: { tone: "warn" | "success" | "muted" | "danger"; children: ReactNode }) {
  const tones = {
    warn: "bg-warn text-warn-foreground",
    success: "bg-success text-success-foreground",
    muted: "bg-muted text-muted-foreground",
    danger: "bg-danger-soft text-danger",
  };
  return <span className={cn("inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-semibold", tones[tone])}>{children}</span>;
}

export function Chip({ active, onClick, children }: { active: boolean; onClick: () => void; children: ReactNode }) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "min-h-9 rounded-full border-[1.5px] px-3.5 text-sm font-semibold transition",
        active ? "border-primary bg-primary text-primary-foreground" : "border-border bg-card text-foreground hover:border-primary",
      )}
    >
      {children}
    </button>
  );
}

export const btn = {
  primary: "inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-primary px-5 font-semibold text-primary-foreground hover:opacity-90 disabled:opacity-50",
  secondary: "inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border-[1.5px] border-primary px-5 font-semibold text-primary hover:bg-secondary",
  ghost: "inline-flex min-h-9 items-center gap-1 rounded-lg px-2 text-sm font-medium text-primary hover:bg-secondary",
};
