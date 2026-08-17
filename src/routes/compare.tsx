import { createFileRoute } from "@tanstack/react-router";
import { FileDown } from "lucide-react";
import { useMemo, useState } from "react";
import { AppShell, PageHeader } from "@/components/AppShell";
import { Panel, Citation, ProvenanceTag, RiskLevelBadge, Notice } from "@/components/primitives";
import { TrendLine, TrendBars } from "@/components/charts";
import { cagr, companies, getCompany, pct, sliceYears, yoy } from "@/data/finsight";

export const Route = createFileRoute("/compare")({
  head: () => ({
    meta: [
      { title: "Compare Companies — Financial Benchmarking | FinSight" },
      {
        name: "description",
        content:
          "Compare two or more companies across revenue growth, profitability, margins, leverage, returns, risk and management outlook, with an AI comparison summary.",
      },
      { property: "og:title", content: "Company Comparison — FinSight" },
      {
        property: "og:description",
        content: "Side-by-side metrics, charts and an evidence-linked AI comparison summary.",
      },
    ],
  }),
  component: ComparePage,
});

function ComparePage() {
  const [a, setA] = useState("hal");
  const [b, setB] = useState("bel");

  const ca = getCompany(a)!;
  const cb = getCompany(b)!;

  const rows = useMemo(() => {
    const calc = (slug: string) => {
      const c = getCompany(slug)!;
      const d = sliceYears(c.history, 5);
      const f = d[0]!;
      const l = d[d.length - 1]!;
      const p = d[d.length - 2] ?? f;
      return {
        revGrowth: yoy(l.revenue, p.revenue),
        profitGrowth: yoy(l.netProfit, p.netProfit),
        revCagr: cagr(f.revenue, l.revenue, d.length - 1),
        opMargin: l.opMargin,
        roe: (l.netProfit / l.equity) * 100,
        de: l.debt / l.equity,
        epsGrowth: yoy(l.eps, p.eps),
        health: c.health.total,
        outlook: c.outlook,
        topRisk: c.risks[0]!,
      };
    };
    return { A: calc(a), B: calc(b) };
  }, [a, b]);

  const chartData = sliceYears(ca.history, 5).map((d, i) => ({
    year: d.year,
    [ca.name]: d.revenue,
    [cb.name]: sliceYears(cb.history, 5)[i]?.revenue ?? 0,
  }));

  const marginData = sliceYears(ca.history, 5).map((d, i) => ({
    year: d.year,
    [ca.name]: d.opMargin,
    [cb.name]: sliceYears(cb.history, 5)[i]?.opMargin ?? 0,
  }));

  const metric = (label: string, av: string, bv: string, better: "A" | "B" | null) => ({
    label,
    av,
    bv,
    better,
  });

  const table = [
    metric("Revenue Growth (YoY)", pct(rows.A.revGrowth), pct(rows.B.revGrowth), rows.A.revGrowth > rows.B.revGrowth ? "A" : "B"),
    metric("Revenue CAGR (4Y)", `${rows.A.revCagr.toFixed(1)}%`, `${rows.B.revCagr.toFixed(1)}%`, rows.A.revCagr > rows.B.revCagr ? "A" : "B"),
    metric("Profit Growth (YoY)", pct(rows.A.profitGrowth), pct(rows.B.profitGrowth), rows.A.profitGrowth > rows.B.profitGrowth ? "A" : "B"),
    metric("Operating Margin", `${rows.A.opMargin}%`, `${rows.B.opMargin}%`, rows.A.opMargin > rows.B.opMargin ? "A" : "B"),
    metric("ROE", `${rows.A.roe.toFixed(1)}%`, `${rows.B.roe.toFixed(1)}%`, rows.A.roe > rows.B.roe ? "A" : "B"),
    metric("Debt / Equity", rows.A.de.toFixed(2), rows.B.de.toFixed(2), rows.A.de < rows.B.de ? "A" : "B"),
    metric("EPS Growth (YoY)", pct(rows.A.epsGrowth), pct(rows.B.epsGrowth), rows.A.epsGrowth > rows.B.epsGrowth ? "A" : "B"),
    metric("Financial Health Score", `${rows.A.health}/100`, `${rows.B.health}/100`, rows.A.health > rows.B.health ? "A" : "B"),
    metric("Management Outlook", rows.A.outlook, rows.B.outlook, null),
  ];

  return (
    <AppShell>
      <PageHeader
        title="Company Comparison"
        subtitle="Metrics are computed programmatically from extracted statement lines. AI writes the interpretation, not the arithmetic."
        right={
          <button
            type="button"
            className="inline-flex items-center gap-1.5 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground"
          >
            <FileDown className="size-3.5" /> Generate Research Report
          </button>
        }
      />

      <div className="panel mb-6 grid gap-4 p-5 sm:grid-cols-2">
        <Selector label="Company A" value={a} onChange={setA} />
        <Selector label="Company B" value={b} onChange={setB} />
      </div>

      <Panel title="Metric Comparison" subtitle={`${ca.name} vs ${cb.name}`}>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border text-left text-xs text-muted-foreground">
                <th className="pb-2 font-medium">Metric</th>
                <th className="pb-2 text-right font-medium">{ca.name}</th>
                <th className="pb-2 text-right font-medium">{cb.name}</th>
              </tr>
            </thead>
            <tbody>
              {table.map((r) => (
                <tr key={r.label} className="border-b border-border/60 last:border-0">
                  <td className="py-2.5 text-muted-foreground">{r.label}</td>
                  <td className={`num py-2.5 text-right ${r.better === "A" ? "text-success" : ""}`}>
                    {r.av}
                  </td>
                  <td className={`num py-2.5 text-right ${r.better === "B" ? "text-success" : ""}`}>
                    {r.bv}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Panel>

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <Panel title="Revenue Trajectory" subtitle="₹ crore">
          <TrendLine
            data={chartData}
            keys={[
              { key: ca.name, label: ca.name },
              { key: cb.name, label: cb.name },
            ]}
          />
        </Panel>
        <Panel title="Operating Margin" subtitle="% of revenue">
          <TrendBars
            data={marginData}
            keys={[
              { key: ca.name, label: ca.name },
              { key: cb.name, label: cb.name },
            ]}
          />
        </Panel>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-3">
        <Panel className="lg:col-span-2" title="AI Comparison Summary">
          <ProvenanceTag kind="interpretation" />
          <p className="mt-3 text-sm leading-relaxed">
            {rows.A.revCagr > rows.B.revCagr ? ca.name : cb.name} demonstrated stronger revenue growth
            over the selected period, while{" "}
            {rows.A.opMargin > rows.B.opMargin ? ca.name : cb.name} maintained a stronger operating
            margin. {rows.A.de < rows.B.de ? ca.name : cb.name} carries the lower leverage ratio on the
            latest reported balance sheet.
          </p>
          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            <div className="rounded-md border border-success/30 bg-success/8 p-4">
              <p className="text-xs font-medium uppercase tracking-wide text-success">Strengths</p>
              <ul className="mt-2 space-y-1.5 text-sm">
                <li>
                  <span className="font-medium">{ca.name}:</span>{" "}
                  {rows.A.revCagr > rows.B.revCagr ? "stronger compound growth" : "steadier margin base"},{" "}
                  {rows.A.de < rows.B.de ? "lower leverage" : "higher return on equity"}
                </li>
                <li>
                  <span className="font-medium">{cb.name}:</span>{" "}
                  {rows.B.opMargin > rows.A.opMargin ? "better operating margin" : "faster profit conversion"},{" "}
                  {rows.B.health > rows.A.health ? "higher composite health score" : "stable balance sheet"}
                </li>
              </ul>
            </div>
            <div className="rounded-md border border-warning/30 bg-warning/8 p-4">
              <p className="text-xs font-medium uppercase tracking-wide text-warning">Risks</p>
              <ul className="mt-2 space-y-1.5 text-sm">
                <li>
                  <span className="font-medium">{ca.name}:</span> {rows.A.topRisk.name} —{" "}
                  {rows.A.topRisk.description}
                </li>
                <li>
                  <span className="font-medium">{cb.name}:</span> {rows.B.topRisk.name} —{" "}
                  {rows.B.topRisk.description}
                </li>
              </ul>
            </div>
          </div>
          <div className="mt-4 flex flex-wrap gap-2">
            <Citation doc={`${ca.name} ${ca.latestReport}`} page={rows.A.topRisk.page} />
            <Citation doc={`${cb.name} ${cb.latestReport}`} page={rows.B.topRisk.page} />
          </div>
        </Panel>

        <Panel title="Risk Posture">
          <div className="space-y-3">
            {[ca, cb].map((c) => (
              <div key={c.slug} className="rounded-md border border-border bg-surface-2 p-3">
                <p className="text-sm font-medium">{c.name}</p>
                <ul className="mt-2 space-y-1.5">
                  {c.risks.slice(0, 3).map((r) => (
                    <li key={r.name} className="flex items-center justify-between gap-2 text-xs">
                      <span className="text-muted-foreground">{r.name}</span>
                      <RiskLevelBadge level={r.level} />
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </Panel>
      </div>

      <div className="mt-6">
        <Notice>
          All comparison figures are sample data from the prototype dataset. Ratios are calculated
          programmatically; narrative text is labelled as AI interpretation.
        </Notice>
      </div>
    </AppShell>
  );
}

function Selector({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div>
      <p className="mb-1 text-xs text-muted-foreground">{label}</p>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="h-10 w-full rounded-md border border-input bg-surface-2/60 px-3 text-sm outline-none"
      >
        {companies.map((c) => (
          <option key={c.slug} value={c.slug}>
            {c.name} — {c.industry}
          </option>
        ))}
      </select>
    </div>
  );
}
