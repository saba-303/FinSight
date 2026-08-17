import { createFileRoute, Link } from "@tanstack/react-router";
import {
  Building2,
  FileText,
  Sparkles,
  Bookmark,
  ArrowUpRight,
  TrendingUp,
  ShieldAlert,
  Activity,
  Users,
} from "lucide-react";
import { AppShell, PageHeader } from "@/components/AppShell";
import { Panel, WhyRow, CompanyTypeBadge } from "@/components/primitives";
import { MiniSpark } from "@/components/charts";
import { companies, documents, insights, researchWorkspaces, sliceYears } from "@/data/finsight";

export const Route = createFileRoute("/dashboard")({
  head: () => ({
    meta: [
      { title: "Dashboard — FinSight Financial Intelligence" },
      {
        name: "description",
        content:
          "Your FinSight research dashboard: companies analysed, reports uploaded, AI insights generated and recent document analyses.",
      },
      { property: "og:title", content: "FinSight Dashboard" },
      {
        property: "og:description",
        content: "Companies analysed, reports uploaded and AI insights in one research workspace.",
      },
    ],
  }),
  component: Dashboard,
});

const kpis = [
  { label: "Companies Analyzed", value: "7", icon: Building2, note: "3 sectors covered" },
  { label: "Reports Uploaded", value: "5", icon: FileText, note: "1,156 pages indexed" },
  { label: "Insights Generated", value: "38", icon: Sparkles, note: "All evidence-linked" },
  { label: "Saved Companies", value: "4", icon: Bookmark, note: "Across 3 workspaces" },
];

const kindIcon = {
  Growth: TrendingUp,
  Profitability: Activity,
  Risk: ShieldAlert,
  Management: Users,
  Anomaly: Sparkles,
} as const;

function Dashboard() {
  return (
    <AppShell>
      <PageHeader
        title="Research Dashboard"
        subtitle="Sample workspace data. Insight cards are generated from indexed documents and computed metrics."
        badge="Prototype data"
        right={
          <>
            <Link
              to="/upload"
              className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90"
            >
              Upload Report
            </Link>
            <Link
              to="/compare"
              className="rounded-md border border-border px-4 py-2 text-sm font-medium transition-colors hover:bg-secondary"
            >
              Compare
            </Link>
          </>
        }
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {kpis.map((k) => (
          <div key={k.label} className="panel p-5">
            <div className="flex items-center justify-between">
              <p className="text-xs text-muted-foreground">{k.label}</p>
              <k.icon className="size-4 text-primary" />
            </div>
            <p className="num mt-3 text-3xl font-semibold">{k.value}</p>
            <p className="mt-1 text-xs text-muted-foreground">{k.note}</p>
          </div>
        ))}
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <Panel
            title="Insight Cards"
            subtitle="Automatically surfaced from documents and computed metrics"
          >
            <div className="grid gap-3 md:grid-cols-2">
              {insights.map((ins) => {
                const Icon = kindIcon[ins.kind];
                return (
                  <article key={ins.title} className="rounded-md border border-border bg-surface-2 p-4">
                    <div className="flex items-center gap-2">
                      <Icon className="size-3.5 text-primary" />
                      <span className="text-[11px] font-medium uppercase tracking-wide text-primary">
                        {ins.kind} Insight
                      </span>
                    </div>
                    <h3 className="mt-2 text-sm font-medium leading-snug">{ins.title}</h3>
                    <p className="mt-1.5 text-xs leading-relaxed text-muted-foreground">{ins.body}</p>
                    <Link
                      to="/companies/$slug"
                      params={{ slug: ins.slug }}
                      className="mt-3 inline-flex items-center gap-1 text-xs text-primary"
                    >
                      {ins.company} <ArrowUpRight className="size-3" />
                    </Link>
                    <WhyRow why={ins.why} source={ins.source} />
                  </article>
                );
              })}
            </div>
          </Panel>

          <Panel title="Recent Analyses" subtitle="Documents processed in this workspace">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border text-left text-xs text-muted-foreground">
                    <th className="pb-2 font-medium">Document</th>
                    <th className="pb-2 font-medium">Company</th>
                    <th className="pb-2 font-medium">Type</th>
                    <th className="pb-2 text-right font-medium">Pages</th>
                    <th className="pb-2 text-right font-medium">Uploaded</th>
                  </tr>
                </thead>
                <tbody>
                  {documents.map((d) => (
                    <tr key={d.id} className="border-b border-border/60 last:border-0">
                      <td className="py-2.5">
                        <Link
                          to="/documents/$id"
                          params={{ id: d.id }}
                          className="text-sm transition-colors hover:text-primary"
                        >
                          {d.file}
                        </Link>
                      </td>
                      <td className="py-2.5 text-muted-foreground">{d.company}</td>
                      <td className="py-2.5 text-muted-foreground">{d.type}</td>
                      <td className="num py-2.5 text-right">{d.pages}</td>
                      <td className="py-2.5 text-right text-muted-foreground">{d.uploaded}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Panel>
        </div>

        <div className="space-y-6">
          <Panel title="Saved Companies" subtitle="Quick access to tracked entities">
            <div className="space-y-2">
              {companies.slice(0, 5).map((c) => (
                <Link
                  key={c.slug}
                  to="/companies/$slug"
                  params={{ slug: c.slug }}
                  className="block rounded-md border border-border bg-surface-2 p-3 transition-colors hover:border-primary/40"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <p className="text-sm font-medium">{c.name}</p>
                      <p className="text-xs text-muted-foreground">{c.industry}</p>
                    </div>
                    <CompanyTypeBadge type={c.type} />
                  </div>
                  <div className="mt-2">
                    <MiniSpark data={sliceYears(c.history, 6)} dataKey="revenue" />
                  </div>
                </Link>
              ))}
            </div>
          </Panel>

          <Panel title="Research Workspaces">
            <div className="space-y-2">
              {researchWorkspaces.map((w) => (
                <Link
                  key={w.id}
                  to="/research"
                  className="block rounded-md border border-border bg-surface-2 p-3 transition-colors hover:border-primary/40"
                >
                  <p className="text-sm font-medium">{w.title}</p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    {w.documents.length} documents · {w.queries.length} saved queries · {w.insights}{" "}
                    insights
                  </p>
                </Link>
              ))}
            </div>
          </Panel>
        </div>
      </div>
    </AppShell>
  );
}
