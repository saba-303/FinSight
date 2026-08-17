import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { Panel, Notice, ProvenanceTag, StatCard } from "@/components/primitives";
import { TrendBars } from "@/components/charts";
import { getCompany, getSector } from "@/data/finsight";

export const Route = createFileRoute("/sectors/$slug")({
  loader: ({ params }) => {
    const sector = getSector(params.slug);
    if (!sector) throw notFound();
    return { sector };
  },
  head: ({ loaderData }) => {
    if (!loaderData)
      return { meta: [{ title: "Sector unavailable — FinSight" }, { name: "robots", content: "noindex" }] };
    const s = loaderData.sector;
    const title = `${s.name} Sector Analysis | FinSight`;
    const description = `${s.name} sector benchmarks: revenue growth, average margin, ROE, leverage, key risks and growth themes across the indexed companies.`;
    return {
      meta: [
        { title },
        { name: "description", content: description },
        { property: "og:title", content: title },
        { property: "og:description", content: description },
      ],
    };
  },
  component: SectorPage,
});

function SectorPage() {
  const { sector } = Route.useLoaderData();
  const comps = sector.companies.map((s) => getCompany(s)!).filter(Boolean);
  const chart = comps.map((c) => {
    const last = c.history[c.history.length - 1]!;
    return { year: c.name, revenue: last.revenue, profit: last.netProfit, margin: last.opMargin };
  });

  return (
    <AppShell>
      <Link
        to="/sectors"
        className="mb-4 inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="size-3.5" /> All sectors
      </Link>
      <h1 className="text-2xl font-semibold tracking-tight">{sector.name} Sector</h1>
      <p className="mt-1 text-sm text-muted-foreground">
        Companies in dataset: {comps.map((c) => c.name).join(", ") || "none with structured data"} ·
        Also referenced: {sector.extra.join(", ")}
      </p>

      <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Revenue growth" value={`${sector.revenueGrowth}%`} kind="calculated" />
        <StatCard label="Average margin" value={`${sector.avgMargin}%`} kind="calculated" />
        <StatCard label="Average ROE" value={`${sector.avgRoe}%`} kind="calculated" />
        <StatCard label="Debt / Equity" value={`${sector.debtEquity}`} kind="calculated" />
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-3">
        <Panel className="lg:col-span-2" title="Company Comparison" subtitle="Latest reported period · ₹ crore">
          {chart.length > 0 ? (
            <TrendBars
              data={chart}
              keys={[
                { key: "revenue", label: "Revenue" },
                { key: "profit", label: "Net Profit" },
              ]}
            />
          ) : (
            <p className="py-10 text-center text-sm text-muted-foreground">
              No structured company data available for this sector in the prototype dataset.
            </p>
          )}
        </Panel>

        <Panel title="Sector Insights">
          <ProvenanceTag kind="interpretation" />
          <p className="mt-3 text-sm leading-relaxed">{sector.insight}</p>
          <h3 className="mt-5 text-xs font-medium uppercase tracking-wide text-muted-foreground">
            Growth themes
          </h3>
          <ul className="mt-2 space-y-1 text-sm text-muted-foreground">
            {sector.themes.map((t) => (
              <li key={t}>· {t}</li>
            ))}
          </ul>
          <h3 className="mt-5 text-xs font-medium uppercase tracking-wide text-muted-foreground">
            Major risks
          </h3>
          <ul className="mt-2 space-y-1 text-sm text-muted-foreground">
            {sector.risks.map((r) => (
              <li key={r}>· {r}</li>
            ))}
          </ul>
        </Panel>
      </div>

      <div className="mt-6 flex flex-wrap gap-2">
        {comps.map((c) => (
          <Link
            key={c.slug}
            to="/companies/$slug"
            params={{ slug: c.slug }}
            className="rounded-md border border-border px-3 py-1.5 text-xs hover:border-primary/40 hover:text-primary"
          >
            {c.name}
          </Link>
        ))}
      </div>

      <div className="mt-6">
        <Notice>Sector aggregates use only companies actually present in the prototype dataset.</Notice>
      </div>
    </AppShell>
  );
}
