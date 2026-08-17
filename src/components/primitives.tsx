import { FileText, HelpCircle, Info } from "lucide-react";
import type { ReactNode } from "react";
import { Badge } from "@/components/ui/badge";

export function Panel({
  children,
  className = "",
  title,
  subtitle,
  right,
}: {
  children: ReactNode;
  className?: string;
  title?: string;
  subtitle?: string;
  right?: ReactNode;
}) {
  return (
    <section className={`panel p-5 ${className}`}>
      {(title || right) && (
        <header className="mb-4 flex items-start justify-between gap-3">
          <div>
            {title && <h2 className="text-sm font-semibold tracking-tight">{title}</h2>}
            {subtitle && <p className="mt-0.5 text-xs text-muted-foreground">{subtitle}</p>}
          </div>
          {right}
        </header>
      )}
      {children}
    </section>
  );
}

export function StatCard({
  label,
  value,
  delta,
  kind,
  hint,
}: {
  label: string;
  value: string;
  delta?: string;
  kind?: "reported" | "calculated";
  hint?: string;
}) {
  const up = delta?.startsWith("+");
  return (
    <div className="panel p-4">
      <div className="flex items-start justify-between gap-2">
        <p className="text-xs text-muted-foreground">{label}</p>
        {kind && <ProvenanceTag kind={kind} />}
      </div>
      <p className="num mt-2 text-xl font-semibold">{value}</p>
      <div className="mt-1 flex items-center gap-2">
        {delta && (
          <span className={`num text-xs ${up ? "text-success" : "text-destructive"}`}>{delta} YoY</span>
        )}
        {hint && <span className="text-xs text-muted-foreground">{hint}</span>}
      </div>
    </div>
  );
}

export function ProvenanceTag({
  kind,
}: {
  kind: "reported" | "calculated" | "interpretation";
}) {
  const map = {
    reported: { label: "Reported Fact", cls: "border-accent/40 bg-accent/10 text-accent" },
    calculated: { label: "Calculated Metric", cls: "border-primary/40 bg-primary/10 text-primary" },
    interpretation: {
      label: "AI Interpretation",
      cls: "border-warning/40 bg-warning/10 text-warning",
    },
  } as const;
  const m = map[kind];
  return (
    <span
      className={`rounded border px-1.5 py-0.5 text-[10px] font-medium uppercase tracking-wide ${m.cls}`}
    >
      {m.label}
    </span>
  );
}

export function Citation({ doc, page }: { doc: string; page: number | number[] }) {
  const pages = Array.isArray(page) ? page.join(", ") : page;
  return (
    <button
      type="button"
      title="Open source page (prototype: document viewer not connected)"
      className="inline-flex items-center gap-1 rounded border border-border bg-surface-2 px-1.5 py-0.5 text-[11px] text-muted-foreground transition-colors hover:border-primary/40 hover:text-primary"
    >
      <FileText className="size-3" />
      {doc} · p. {pages}
    </button>
  );
}

export function RiskLevelBadge({ level }: { level: "High" | "Medium" | "Low" }) {
  const cls =
    level === "High"
      ? "border-destructive/40 bg-destructive/10 text-destructive"
      : level === "Medium"
        ? "border-warning/40 bg-warning/10 text-warning"
        : "border-success/40 bg-success/10 text-success";
  return <span className={`rounded border px-2 py-0.5 text-[11px] font-medium ${cls}`}>{level}</span>;
}

export function CompanyTypeBadge({ type }: { type: string }) {
  const listed = type === "Listed";
  return (
    <Badge
      variant="outline"
      className={listed ? "border-accent/40 text-accent" : "border-warning/40 text-warning"}
    >
      {type}
    </Badge>
  );
}

export function Notice({
  children,
  tone = "info",
}: {
  children: ReactNode;
  tone?: "info" | "warning";
}) {
  const cls =
    tone === "warning"
      ? "border-warning/30 bg-warning/8 text-warning"
      : "border-border bg-surface-2 text-muted-foreground";
  return (
    <div className={`flex items-start gap-2 rounded-md border px-3 py-2 text-xs ${cls}`}>
      <Info className="mt-px size-3.5 shrink-0" />
      <p className="leading-relaxed">{children}</p>
    </div>
  );
}

export function WhyRow({ why, source }: { why: string; source: string }) {
  return (
    <details className="group mt-3">
      <summary className="flex cursor-pointer list-none items-center gap-1.5 text-xs text-muted-foreground transition-colors hover:text-primary">
        <HelpCircle className="size-3.5" /> Why? · View evidence
      </summary>
      <div className="mt-2 space-y-2 rounded-md border border-border bg-surface-2 p-3">
        <p className="text-xs leading-relaxed text-muted-foreground">{why}</p>
        <Citation doc={source.split(", p.")[0]} page={Number(source.split("p. ")[1] ?? 1)} />
      </div>
    </details>
  );
}
