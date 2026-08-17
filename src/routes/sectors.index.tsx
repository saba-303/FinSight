import { createFileRoute, Link } from "@tanstack/react-router";
import { AppShell, PageHeader } from "@/components/AppShell";
import { sectors } from "@/data/finsight";

export const Route = createFileRoute("/sectors/")({
  head: () => ({
    meta: [
      { title: "Sector Intelligence — Industry Benchmarks | FinSight" },
      {
        name: "description",
        content:
          "Explore defence, IT, EV, energy, banking and pharma sectors: growth, margins, returns, leverage, risks and growth themes from the indexed dataset.",
      },
      { property: "og:title", content: "Sector Intelligence — FinSight" },
      { property: "og:description", content: "Sector-level growth, margin, return and risk benchmarks." },
    ],
  }),
  component: SectorsPage,
});

function SectorsPage() {
  return (
    <AppShell>
      <PageHeader
        title="Sector Intelligence"
        subtitle="Aggregates computed from companies present in the prototype dataset only."
      />
      <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
        {sectors.map((s) => (
          <Link
            key={s.slug}
            to="/sectors/$slug"
            params={{ slug: s.slug }}
            className="panel p-5 transition-colors hover:border-primary/40"
          >
            <h2 className="text-base font-semibold">{s.name}</h2>
            <p className="mt-1 text-xs text-muted-foreground">
              {s.companies.length} companies with structured data · {s.extra.length} additional named
            </p>
            <dl className="mt-4 grid grid-cols-2 gap-3 text-xs">
              <div>
                <dt className="text-muted-foreground">Revenue growth</dt>
                <dd className="num mt-0.5 font-medium text-primary">{s.revenueGrowth}%</dd>
              </div>
              <div>
                <dt className="text-muted-foreground">Avg. margin</dt>
                <dd className="num mt-0.5 font-medium">{s.avgMargin}%</dd>
              </div>
              <div>
                <dt className="text-muted-foreground">Avg. ROE</dt>
                <dd className="num mt-0.5 font-medium">{s.avgRoe}%</dd>
              </div>
              <div>
                <dt className="text-muted-foreground">Debt / Equity</dt>
                <dd className="num mt-0.5 font-medium">{s.debtEquity}</dd>
              </div>
            </dl>
          </Link>
        ))}
      </div>
    </AppShell>
  );
}
