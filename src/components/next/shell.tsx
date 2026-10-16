"use client";

import { Link } from "@tanstack/react-router";
import type { ReactNode } from "react";
import { useState } from "react";
import { Bookmark, Compass, Home, Phone, X } from "lucide-react";
import { useSteps } from "@/lib/steps";
import { useDemo } from "@/data/resources";
import { cn } from "@/lib/utils";
import { Wordmark } from "./brand";

export function Shell({ children, className }: { children: ReactNode; className?: string }) {
  const { steps } = useSteps();
  const [urgent, setUrgent] = useState(false);
  const [demo, setDemo] = useDemo();
  return (
    <div className="flex min-h-dvh flex-col md:flex-row">
      <aside className="hidden w-[11.5rem] shrink-0 flex-col gap-8 px-4 py-6 md:flex">
        <Wordmark />
        <nav className="flex flex-col gap-2">
          <NavLink to="/" icon={Home} label="Home" />
          <NavLink to="/browse" icon={Compass} label="Resources" />
        </nav>
        <div className="mt-auto space-y-2 text-xs">
          <button
            onClick={() => setDemo(!demo)}
            aria-pressed={demo}
            className={cn("rounded-lg px-2 py-1 text-left", demo ? "text-danger" : "text-muted-foreground hover:text-foreground")}
          >
            Demo {demo ? "on" : "off"}
          </button>
          <button onClick={() => setUrgent(true)} className="block rounded-lg px-2 py-1 text-left text-danger hover:underline">
            Need urgent help?
          </button>
        </div>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="flex items-center justify-between gap-3 px-4 py-4 md:px-8">
          <Wordmark className="md:hidden" />
          <span className="hidden md:block" />
          <div className="flex items-center gap-2">
            <Link
              to="/steps"
              className="inline-flex items-center gap-2 rounded-full border border-border bg-card/40 px-3.5 py-2 text-sm font-semibold text-foreground shadow-card backdrop-blur"
            >
              <Bookmark className="size-4 text-primary" /> My steps{steps.length ? ` · ${steps.length}` : ""}
            </Link>
          </div>
        </header>
        {demo && (
          <div className="bg-danger-soft py-1.5 text-center text-xs font-semibold text-danger">
            Demo on — fictional sample records are mixed in and labeled “Sample data”.{" "}
            <button className="underline" onClick={() => setDemo(false)}>Turn off</button>
          </div>
        )}
        <main className={cn("relative mx-auto w-full max-w-5xl flex-1 px-4 pb-24 md:px-8 md:pb-10", className)}>{children}</main>
        <footer className="hidden border-t border-border/40 px-4 py-3 text-center text-xs text-muted-foreground md:block">
          Next Step · University of Bridgeport · Opening a link does not place an order or book an appointment.
        </footer>
      </div>

      <nav className="fixed inset-x-0 bottom-0 z-30 flex border-t border-border bg-background/90 px-2 py-2 backdrop-blur md:hidden">
        <MobileLink to="/" icon={Home} label="Home" />
        <MobileLink to="/browse" icon={Compass} label="Resources" />
        <MobileLink to="/steps" icon={Bookmark} label="My steps" />
        <button onClick={() => setUrgent(true)} className="flex flex-1 flex-col items-center gap-0.5 py-1 text-[11px] font-semibold text-danger">
          <Phone className="size-5" /> Help
        </button>
      </nav>

      {urgent && <UrgentHelp onClose={() => setUrgent(false)} />}
    </div>
  );
}

function NavLink({ to, icon: Icon, label }: { to: "/"; icon: typeof Home; label: string } | { to: "/browse"; icon: typeof Home; label: string }) {
  return (
    <Link
      to={to}
      className="flex items-center gap-2.5 rounded-2xl px-3 py-2.5 text-sm font-semibold text-muted-foreground hover:bg-card/50 hover:text-foreground"
      activeProps={{ className: "flex items-center gap-2.5 rounded-2xl border border-primary/50 bg-primary/15 px-3 py-2.5 text-sm font-semibold text-foreground shadow-card" }}
      activeOptions={to === "/" ? { exact: true } : undefined}
    >
      <Icon className="size-4" /> {label}
    </Link>
  );
}

function MobileLink({ to, icon: Icon, label }: { to: "/" | "/browse" | "/steps"; icon: typeof Home; label: string }) {
  return (
    <Link
      to={to}
      className="flex flex-1 flex-col items-center gap-0.5 py-1 text-[11px] font-semibold text-muted-foreground"
      activeProps={{ className: "flex flex-1 flex-col items-center gap-0.5 py-1 text-[11px] font-semibold text-primary" }}
      activeOptions={to === "/" ? { exact: true } : undefined}
    >
      <Icon className="size-5" /> {label}
    </Link>
  );
}

function UrgentHelp({ onClose }: { onClose: () => void }) {
  const rows = [
    { label: "Call 911", sub: "Immediate danger or medical emergency", href: "tel:911", strong: true },
    { label: "UB Campus Security emergency · 203-576-4911", sub: "Immediate campus response (from mockup — confirm)", href: "tel:2035764911", strong: true },
    { label: "Campus Security info · 203-576-4913", sub: "Non-urgent contact, Norseman Hall (from catalog)", href: "tel:2035764913", strong: false },
    { label: "988 Suicide & Crisis Lifeline", sub: "Call or text 988, 24/7, free and confidential", href: "tel:988", strong: false },
    { label: "CT 2-1-1", sub: "Food, housing and crisis help across Connecticut", href: "tel:211", strong: false },
  ];
  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-background/70 p-4 backdrop-blur-sm" role="dialog" aria-modal="true" aria-label="Need urgent help?">
      <div className="w-full max-w-md rounded-3xl border border-border bg-card p-6 shadow-card">
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
              className={cn("flex items-center gap-3 rounded-xl border p-3", r.strong ? "border-danger bg-danger-soft" : "border-border hover:bg-muted")}
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
        "min-h-9 rounded-full border px-3.5 text-sm font-semibold transition",
        active ? "border-primary bg-primary text-primary-foreground" : "border-border bg-card/50 text-foreground hover:border-primary",
      )}
    >
      {children}
    </button>
  );
}

export const btn = {
  primary:
    "inline-flex min-h-12 items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-sky-500 to-blue-500 px-6 font-bold text-white shadow-[0_8px_24px_-8px_rgba(56,189,248,0.7)] hover:opacity-95 disabled:opacity-50",
  secondary:
    "inline-flex min-h-12 items-center justify-center gap-2 rounded-2xl border border-border bg-card/30 px-6 font-semibold text-foreground hover:border-primary/60",
  ghost: "inline-flex min-h-9 items-center gap-1 rounded-lg px-2 text-sm font-medium text-primary hover:bg-card/50",
};
