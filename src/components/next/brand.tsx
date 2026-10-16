import { Link } from "@tanstack/react-router";
import { cn } from "@/lib/utils";

export function Wordmark({ className }: { className?: string }) {
  return (
    <Link to="/" className={cn("inline-flex items-baseline gap-1.5 font-display text-xl font-extrabold tracking-tight text-foreground", className)}>
      Next <span className="text-primary">Step</span>
    </Link>
  );
}

export function Mascot({ className, size = "lg" }: { className?: string; size?: "sm" | "lg" }) {
  if (size === "sm") {
    return (
      <span className={cn("inline-flex size-10 shrink-0 overflow-hidden rounded-full border border-primary/40 bg-card shadow-[0_0_16px_rgba(56,189,248,0.35)]", className)}>
        <img src="/mascot.png" alt="" width={40} height={40} className="size-full object-cover object-[center_42%]" />
      </span>
    );
  }
  return (
    <img
      src="/mascot.png"
      alt=""
      width={420}
      height={252}
      className={cn(
        "pointer-events-none select-none w-[min(42vw,22rem)] object-contain [mask-image:radial-gradient(ellipse_72%_78%_at_50%_48%,#000_58%,transparent_78%)]",
        className,
      )}
    />
  );
}
