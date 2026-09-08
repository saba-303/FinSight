import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowUpRight, FileDown, GitCompareArrows, Sparkles } from "lucide-react";
import { useState } from "react";
import { AppShell } from "@/components/AppShell";
import { Panel, StatCard, Citation, Notice } from "@/components/primitives";
import { AnomalyBadge, AnomalyRow } from "@/components/AnomalyFeed";
import { RevenueMarginChart, HealthRadar } from "@/components/charts";
import {
  anomaliesFor,
  cagr,
  documents,
  getCompany,
  pct,
  sliceYears,
  yoy,
} from "@/data/finsight";

export const Route = createFileRoute("/dashboard")({
  head: () => ({
    meta: [
      { title: "HAL Company Dashboard — Anomalies & Metrics | FinSight" },
      {
        name: "description",
        content:
          "Company dashboard for Hindustan Aeronautics: revenue, net margin, ROE and debt/equity, a five-year revenue and margin trend, and an anomaly feed with page-level citations.",
      },
      { property: "og:title", content: "HAL Company Dashboard — FinSight" },
      {
        property: "og:description",
        content: "Metric cards, five-year trends and anomaly flags, each tied to a cited page.",
      },
    ],
  }),
  component: Dashboard,
});

const sections = ["Overview", "Financials", "Notes", "Governance"] as const;

function Dashboard() {
  const c = getCompany("hal")!;
  const flags = anomaliesFor("hal");
  const [section, setSection] = useState<(typeof sections)[number]>("Overview");

  const data = sliceYears(c.history, 5);
  const first = data[0]!;
  const last = data[data.length - 1]!;
  const prev = data[data.length - 2] ?? first;
  const revCagr = cagr(first.revenue, last.revenue, data.length - 1);
  const roeVal = (last.netProfit / last.equity) * 100;

  return (
    <AppShell>
      {/* Company header */}
      <div className="panel mb-5 p-5">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <div className="flex flex-wrap items-center gap-2.5">
              <h1 className="text-2xl font-semibold tracking-tight">{c.name}</h1>
              <AnomalyBadge count={flags.length} />
            </div>
            <p className="mt-1.5 text-sm text-muted-foreground">
              {c.sector} · {c.industry} · Latest report: {c.latestReport} · 312 pages indexed
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Link
              to="/ask"
              className="inline-flex items-center gap-1.5 rounded-md border border-border px-3 py-2 text-sm transition-colors hover:bg-secondary"
            >
              <Sparkles className="size-3.5" /> Ask AI
            </Link>
            <Link
              to="/compare"
              className="inline-flex items-center gap-1.5 rounded-md border border-border px-3 py-2 text-sm transition-colors hover:bg-secondary"
            >
              <GitCompareArrows className="size-3.5" /> Compare peers
            </Link>
            <Link
              to="/reports"
              className="inline-flex items-center gap-1.5 rounded-md bg-primary px-3 py-2 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90"
            >
              <FileDown className="size-3.5" /> Export report
            </Link>
          </div>
        </div>

        <nav className="mt-4 flex gap-1 overflow-x-auto border-t border-border pt-3">
          {sections.map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => setSection(s)}
              className={`shrink-0 rounded-md px-3 py-1.5 text-sm transition-colors ${
                section === s
                  ? "bg-primary/[0.08] font-medium text-primary"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {s}
            </button>
          ))}
          <Link
            to="/companies/$slug"
            params={{ slug: c.slug }}
            className="ml-auto hidden shrink-0 items-center gap-1 px-3 py-1.5 text-sm text-primary sm:inline-flex"
          >
            Full profile <ArrowUpRight className="size-3.5" />
          </Link>
        </nav>
      </div>

      {/* Metric cards */}
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          label="Revenue (FY26)"
          value={`₹${last.revenue.toLocaleString("en-IN")} Cr`}
          delta={pct(yoy(last.revenue, prev.revenue))}
          kind="reported"
        />
        <StatCard label="Net margin" value={`${last.netMargin}%`} kind="calculated" hint="net profit ÷ revenue" />
        <StatCard label="ROE" value={`${roeVal.toFixed(1)}%`} kind="calculated" hint="net profit ÷ equity" />
        <StatCard
          label="Debt / Equity"
          value={(last.debt / last.equity).toFixed(2)}
          kind="calculated"
          hint="total debt ÷ equity"
        />
      </div>

      <div className="mt-5 grid gap-5 lg:grid-cols-3">
        <div className="space-y-5 lg:col-span-2">
          <Panel
            title="Revenue and operating margin"
            subtitle="Five reported periods · ₹ crore and % of revenue"
            right={<span className="num text-xs text-muted-foreground">CAGR {revCagr.toFixed(1)}%</span>}
          >
            <RevenueMarginChart data={data} />
            <div className="mt-3">
              <Citation doc="HAL Annual Report FY2025" page={76} note="statement of P&L" />
            </div>
          </Panel>

          <Panel
            title="Anomaly feed"
            subtitle="Each flag ties to a specific, checkable number — expand to see the arithmetic and the source passage"
            right={<span className="num text-xs text-muted-foreground">{flags.length} flags</span>}
          >
            <div className="space-y-2.5">
              {flags.map((a) => (
                <AnomalyRow key={a.id} a={a} />
              ))}
            </div>
          </Panel>
        </div>

        <div className="space-y-5">
          <Panel title="Financial health" subtitle="Computed sub-scores, not a recommendation">
            <div className="flex items-baseline gap-2">
              <span className="num text-4xl font-semibold text-primary">{c.health.total}</span>
              <span className="text-sm text-muted-foreground">/ 100</span>
            </div>
            <div className="mt-4">
              <HealthRadar data={c.health.dims} height={230} />
            </div>
          </Panel>

          <Panel title="Indexed documents">
            <div className="space-y-2">
              {documents.slice(0, 4).map((d) => (
                <Link
                  key={d.id}
                  to="/documents/$id"
                  params={{ id: d.id }}
                  className="block rounded-md border border-border bg-surface p-3 transition-colors hover:border-primary/40"
                >
                  <p className="truncate text-sm">{d.file}</p>
                  <p className="num mt-1 text-xs text-muted-foreground">
                    {d.pages} pages · {d.tables} tables · {d.uploaded}
                  </p>
                </Link>
              ))}
            </div>
          </Panel>

          <Notice>
            Prototype dataset. All figures are sample data and every claim shown carries a source
            citation.
          </Notice>
        </div>
      </div>
    </AppShell>
  );
}
