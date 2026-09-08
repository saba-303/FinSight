import { AlertTriangle, ChevronDown } from "lucide-react";
import { Citation, ProvenanceTag } from "./primitives";
import type { Anomaly } from "@/data/finsight";

export function SeverityTag({ level }: { level: "High" | "Medium" | "Low" }) {
  const cls =
    level === "High"
      ? "border-destructive/30 bg-destructive/10 text-destructive"
      : level === "Medium"
        ? "border-warning/30 bg-warning/10 text-warning"
        : "border-success/30 bg-success/10 text-success";
  return (
    <span
      className={`inline-flex shrink-0 items-center gap-1 rounded border px-2 py-0.5 text-[11px] font-semibold ${cls}`}
    >
      <span className="size-1.5 rounded-full bg-current" />
      {level}
    </span>
  );
}

export function AnomalyRow({ a }: { a: Anomaly }) {
  return (
    <details className="group rounded-md border border-border bg-surface p-3.5 open:bg-surface-2">
      <summary className="flex cursor-pointer list-none items-start gap-3">
        <SeverityTag level={a.severity} />
        <div className="min-w-0 flex-1">
          <p className="text-sm font-medium leading-snug">{a.title}</p>
          <p className="mt-1 text-xs leading-relaxed text-muted-foreground">{a.explanation}</p>
          <div className="mt-2 flex flex-wrap items-center gap-1.5">
            <ProvenanceTag kind={a.claim} />
            <Citation doc={a.document} page={a.page} note={a.note} />
          </div>
        </div>
        <ChevronDown className="mt-0.5 size-4 shrink-0 text-muted-foreground transition-transform group-open:rotate-180" />
      </summary>

      <div className="mt-3 space-y-3 border-t border-border pt-3">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
            The checkable number
          </p>
          <p className="num mt-1.5 rounded border border-border bg-background px-2.5 py-1.5 text-xs leading-relaxed">
            {a.check}
          </p>
        </div>
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
            Source passage
          </p>
          <blockquote className="mt-1.5 border-l-2 border-primary/40 pl-3 text-xs italic leading-relaxed text-muted-foreground">
            “{a.excerpt}”
          </blockquote>
        </div>
      </div>
    </details>
  );
}

export function AnomalyBadge({ count }: { count: number }) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-md border border-destructive/30 bg-destructive/10 px-2.5 py-1 text-xs font-semibold text-destructive">
      <AlertTriangle className="size-3.5" />
      <span className="num">{count}</span> anomalies flagged
    </span>
  );
}
