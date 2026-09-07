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

export type ClaimKind = "reported" | "calculated" | "interpretation";

/**
 * Claim classification — the methodological differentiator.
 * Fact = read verbatim from the document.
 * Calculation = computed programmatically from extracted statement lines.
 * Inference = model interpretation, never a number.
 */
export function ProvenanceTag({ kind }: { kind: ClaimKind }) {
  const map = {
    reported: {
      label: "Fact",
      hint: "Read verbatim from the source document",
      cls: "border-success/30 bg-success/10 text-success",
    },
    calculated: {
      label: "Calculation",
      hint: "Computed programmatically from extracted statement lines",
      cls: "border-primary/30 bg-primary/10 text-primary",
    },
    interpretation: {
      label: "Inference",
      hint: "Model interpretation — not a reported figure",
      cls: "border-warning/30 bg-warning/10 text-warning",
    },
  } as const;
  const m = map[kind];
  return (
    <span
      title={m.hint}
      className={`inline-flex shrink-0 items-center rounded border px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide ${m.cls}`}
    >
      {m.label}
    </span>
  );
}

/**
 * The signature element: every AI-generated number or claim carries a
 * clickable source tag. Visually identical everywhere in the product.
 */
export function Citation({
  doc,
  page,
  note,
  onOpen,
}: {
  doc: string;
  page: number | number[];
  note?: string;
  onOpen?: () => void;
}) {
  const pages = Array.isArray(page) ? page.join(", ") : page;
  return (
    <button
      type="button"
      onClick={onOpen}
      title={`Source: ${doc}, page ${pages}${note ? `, ${note}` : ""}`}
      className="inline-flex max-w-full items-center gap-1 rounded border border-primary/25 bg-primary/[0.06] px-1.5 py-0.5 text-[11px] font-medium text-primary transition-colors hover:border-primary/60 hover:bg-primary/12"
    >
      <FileText className="size-3 shrink-0" />
      <span className="num truncate">
        pg. {pages}
        {note ? `, ${note}` : ""}
      </span>
      <span className="truncate text-primary/70">· {doc}</span>
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
        <Citation doc={source.split(", p.")[0] ?? source} page={Number(source.split("p. ")[1] ?? 1)} />
      </div>
    </details>
  );
}
