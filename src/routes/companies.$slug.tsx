import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { Download, FileDown, Bookmark, GitCompareArrows, ArrowLeft } from "lucide-react";
import { useState } from "react";
import { AppShell } from "@/components/AppShell";
import {
  Panel,
  StatCard,
  Citation,
  RiskLevelBadge,
  CompanyTypeBadge,
  Notice,
  ProvenanceTag,
} from "@/components/primitives";
import {
  TrendLine,
  TrendBars,
  DonutMix,
  HealthRadar,
  RiskMatrix,
} from "@/components/charts";
import { AskFinSight, type CannedAnswer } from "@/components/AskFinSight";
import { cagr, companies, getCompany, pct, sliceYears, yoy } from "@/data/finsight";

export const Route = createFileRoute("/companies/$slug")({
  loader: ({ params }) => {
    const company = getCompany(params.slug);
    if (!company) throw notFound();
    return { company };
  },
  head: ({ loaderData }) => {
    if (!loaderData)
      return { meta: [{ title: "Company unavailable — FinSight" }, { name: "robots", content: "noindex" }] };
    const c = loaderData.company;
    const title = `${c.name} — Financial Intelligence | FinSight`;
    const description = `${c.name} (${c.industry}) analysis: financial trends, health score, risk register, management commentary and evidence-backed answers from ${c.documents.length} indexed documents.`;
    return {
      meta: [
        { title },
        { name: "description", content: description },
        { property: "og:title", content: title },
        { property: "og:description", content: description },
      ],
    };
  },
  component: CompanyPage,
});

const tabs = ["Overview", "Financials", "Health", "Management", "Risk", "Ask FinSight"] as const;

function CompanyPage() {
  const { company: c } = Route.useLoaderData();
  const [tab, setTab] = useState<(typeof tabs)[number]>("Overview");
  const [range, setRange] = useState(5);

  const data = sliceYears(c.history, Math.min(range, c.history.length));
  const first = data[0]!;
  const last = data[data.length - 1]!;
  const prev = data[data.length - 2] ?? first;
  const revCagr = cagr(first.revenue, last.revenue, data.length - 1);
  const isDocBased = c.type !== "Listed";

  const answers: CannedAnswer[] = [
    {
      question: `What are ${c.name.split(" ")[0]}'s biggest risks?`,
      points: c.risks.slice(0, 3).map((r) => ({
        heading: r.name,
        body: r.evidence,
        page: r.page,
      })),
      interpretation: c.risks[0]!.interpretation,
      document: `${c.latestReport} Annual Report`,
    },
    {
      question: "How has revenue changed over the last five years?",
      intro: data.map((d) => `${d.year} → ₹${d.revenue.toLocaleString("en-IN")} Cr`).join("  ·  "),
      points: [
        {
          heading: "Revenue trajectory",
          body: `Revenue moved from ₹${first.revenue.toLocaleString("en-IN")} Cr in ${first.year} to ₹${last.revenue.toLocaleString("en-IN")} Cr in ${last.year}.`,
          page: 76,
        },
        {
          heading: "Compound growth",
          body: `Revenue CAGR over the selected window is ${revCagr.toFixed(1)}%, computed programmatically as (End/Begin)^(1/n) − 1.`,
          page: 76,
          kind: "calculated",
        },
      ],
      interpretation: `Growth has been ${revCagr > 12 ? "strong and broadly consistent" : revCagr > 6 ? "steady but moderating" : "muted"} over the selected period based on the extracted statement lines.`,
      document: `${c.latestReport} Annual Report`,
    },
    {
      question: "What did management say about future growth?",
      points: [
        {
          heading: "Management outlook",
          body: c.managementQuote.text,
          page: c.managementQuote.page,
        },
        {
          heading: "Dominant theme",
          body: `${c.themes[0]!.theme}: ${c.themes[0]!.note}`,
          page: c.managementQuote.page,
          kind: "interpretation",
        },
      ],
      document: `${c.latestReport} Annual Report`,
    },
    {
      question: "What are the company's major business segments?",
      points: c.segments.map((s) => ({
        heading: s.name,
        body: `${s.name} contributes approximately ${s.value}% of reported revenue in the latest available period.`,
        page: 32,
      })),
      document: `${c.latestReport} Annual Report`,
    },
  ];

  return (
    <AppShell>
      <Link
        to="/companies"
        className="mb-4 inline-flex items-center gap-1.5 text-xs text-muted-foreground transition-colors hover:text-foreground"
      >
        <ArrowLeft className="size-3.5" /> All companies
      </Link>

      <div className="panel mb-5 p-5">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="text-2xl font-semibold tracking-tight">{c.name}</h1>
              <CompanyTypeBadge type={c.type} />
            </div>
            <p className="mt-1 text-sm text-muted-foreground">
              Industry: {c.industry} · Sector: {c.sector} · Latest report: {c.latestReport}
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Link
              to="/compare"
              className="inline-flex items-center gap-1.5 rounded-md border border-border px-3 py-2 text-sm transition-colors hover:bg-secondary"
            >
              <GitCompareArrows className="size-3.5" /> Compare
            </Link>
            <button
              type="button"
              className="inline-flex items-center gap-1.5 rounded-md border border-border px-3 py-2 text-sm transition-colors hover:bg-secondary"
            >
              <Bookmark className="size-3.5" /> Save
            </button>
            <Link
              to="/reports"
              className="inline-flex items-center gap-1.5 rounded-md bg-primary px-3 py-2 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90"
            >
              <FileDown className="size-3.5" /> Generate Research Report
            </Link>
          </div>
        </div>

        <div className="mt-4">
          {isDocBased ? (
            <Notice tone="warning">
              This company is being analyzed using user-provided documents. Live market metrics are
              unavailable — no market capitalisation, stock price or exchange information is shown.
            </Notice>
          ) : (
            <Notice>
              Prototype dataset: all values below are sample data for demonstration and are not live
              market data.
            </Notice>
          )}
        </div>

        <nav className="mt-4 flex gap-1 overflow-x-auto border-t border-border pt-3">
          {tabs.map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => setTab(t)}
              className={`shrink-0 rounded-md px-3 py-1.5 text-sm transition-colors ${
                tab === t ? "bg-secondary font-medium" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {t}
            </button>
          ))}
        </nav>
      </div>

      {tab === "Overview" && (
        <div className="space-y-6">
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {c.snapshot.map((s) => (
              <StatCard key={s.label} label={s.label} value={s.value} {...(s.delta ? { delta: s.delta } : {})} kind={s.kind} />
            ))}
          </div>

          <div className="grid gap-6 lg:grid-cols-3">
            <Panel className="lg:col-span-2" title="Business Overview" subtitle="AI-generated summary from indexed documents">
              <ProvenanceTag kind="interpretation" />
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{c.overview}</p>
              <div className="mt-3">
                <Citation doc={`${c.latestReport} Annual Report`} page={[18, 32]} />
              </div>
              <div className="mt-5 grid gap-5 sm:grid-cols-2">
                <div>
                  <p className="mb-2 text-xs font-medium uppercase tracking-wide text-muted-foreground">
                    Revenue mix by segment
                  </p>
                  <DonutMix data={c.segments} />
                </div>
                <div>
                  <p className="mb-2 text-xs font-medium uppercase tracking-wide text-muted-foreground">
                    Geographic presence
                  </p>
                  <DonutMix data={c.geography} />
                </div>
              </div>
            </Panel>

            <Panel title="Strategic Timeline" subtitle="Events derived from uploaded documents">
              <ol className="relative space-y-5 border-l border-border pl-5">
                {c.timeline.map((t) => (
                  <li key={t.year + t.event}>
                    <span className="absolute -left-1 size-2 rounded-full bg-primary" />
                    <p className="num text-xs text-primary">{t.year}</p>
                    <p className="mt-0.5 text-sm">{t.event}</p>
                    <p className="mt-1 text-xs text-muted-foreground">{t.source}</p>
                  </li>
                ))}
              </ol>
            </Panel>
          </div>
        </div>
      )}

      {tab === "Financials" && (
        <div className="space-y-6">
          <div className="flex items-center gap-2">
            {[3, 5, 10].map((r) => (
              <button
                key={r}
                type="button"
                onClick={() => setRange(r)}
                className={`rounded-md border px-3 py-1.5 text-xs transition-colors ${
                  range === r
                    ? "border-primary/50 bg-primary/10 text-primary"
                    : "border-border text-muted-foreground hover:text-foreground"
                }`}
              >
                {r} years
              </button>
            ))}
            <span className="ml-auto text-xs text-muted-foreground">
              Showing {data.length} reported periods · ₹ crore
            </span>
          </div>

          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <StatCard label={`Revenue CAGR (${data.length - 1}Y)`} value={`${revCagr.toFixed(1)}%`} kind="calculated" />
            <StatCard label="Revenue YoY" value={pct(yoy(last.revenue, prev.revenue))} kind="calculated" />
            <StatCard label="Net Profit YoY" value={pct(yoy(last.netProfit, prev.netProfit))} kind="calculated" />
            <StatCard label="Debt / Equity" value={(last.debt / last.equity).toFixed(2)} kind="calculated" />
          </div>

          <div className="grid gap-6 lg:grid-cols-2">
            <Panel title="Revenue Trend" subtitle="₹ crore">
              <TrendLine data={data} keys={[{ key: "revenue", label: "Revenue" }]} />
            </Panel>
            <Panel title="Net Profit Trend" subtitle="₹ crore">
              <TrendBars data={data} keys={[{ key: "netProfit", label: "Net Profit" }]} />
            </Panel>
            <Panel title="EBITDA / Operating Profit" subtitle="₹ crore">
              <TrendBars data={data} keys={[{ key: "ebitda", label: "EBITDA" }]} />
            </Panel>
            <Panel title="Margins" subtitle="% of revenue — calculated metric">
              <TrendLine
                data={data}
                keys={[
                  { key: "opMargin", label: "Operating margin %" },
                  { key: "netMargin", label: "Profit margin %" },
                ]}
              />
            </Panel>
            <Panel title="Earnings Per Share" subtitle="₹ per share">
              <TrendLine data={data} keys={[{ key: "eps", label: "EPS" }]} />
            </Panel>
            <Panel title="Debt vs Equity" subtitle="₹ crore — stacked">
              <TrendBars
                stacked
                data={data}
                keys={[
                  { key: "debt", label: "Debt" },
                  { key: "equity", label: "Equity" },
                ]}
              />
            </Panel>
          </div>

          <Panel title="Extracted Financial Table" subtitle="Values parsed from statement pages">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border text-left text-xs text-muted-foreground">
                    <th className="pb-2 font-medium">Year</th>
                    <th className="pb-2 text-right font-medium">Revenue</th>
                    <th className="pb-2 text-right font-medium">EBITDA</th>
                    <th className="pb-2 text-right font-medium">Net Profit</th>
                    <th className="pb-2 text-right font-medium">Op. Margin</th>
                    <th className="pb-2 text-right font-medium">EPS</th>
                    <th className="pb-2 text-right font-medium">D/E</th>
                  </tr>
                </thead>
                <tbody className="num">
                  {data.map((d) => (
                    <tr key={d.year} className="border-b border-border/60 last:border-0">
                      <td className="py-2">{d.year}</td>
                      <td className="py-2 text-right">{d.revenue.toLocaleString("en-IN")}</td>
                      <td className="py-2 text-right">{d.ebitda.toLocaleString("en-IN")}</td>
                      <td className="py-2 text-right">{d.netProfit.toLocaleString("en-IN")}</td>
                      <td className="py-2 text-right">{d.opMargin}%</td>
                      <td className="py-2 text-right">{d.eps}</td>
                      <td className="py-2 text-right">{(d.debt / d.equity).toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="mt-3 flex flex-wrap items-center gap-2">
              <Citation doc={`${c.latestReport} Annual Report`} page={[74, 76, 88]} />
              <button
                type="button"
                className="inline-flex items-center gap-1.5 rounded-md border border-border px-2.5 py-1 text-xs transition-colors hover:bg-secondary"
              >
                <Download className="size-3" /> Export CSV
              </button>
            </div>
          </Panel>
        </div>
      )}

      {tab === "Health" && (
        <div className="grid gap-6 lg:grid-cols-3">
          <Panel title="Financial Health Score" subtitle="Analytical indicator, not investment advice">
            <div className="flex items-baseline gap-2">
              <span className="num text-5xl font-semibold text-primary">{c.health.total}</span>
              <span className="text-lg text-muted-foreground">/ 100</span>
            </div>
            <div className="mt-5 space-y-3">
              {c.health.dims.map((d) => (
                <div key={d.label}>
                  <div className="flex justify-between text-xs">
                    <span>{d.label}</span>
                    <span className="num text-muted-foreground">{d.score}</span>
                  </div>
                  <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-secondary">
                    <div className="h-full rounded-full bg-primary" style={{ width: `${d.score}%` }} />
                  </div>
                </div>
              ))}
            </div>
            <p className="mt-5 text-xs leading-relaxed text-muted-foreground">
              Score generated from available financial metrics. Not a recommendation to buy or sell.
            </p>
          </Panel>
          <Panel className="lg:col-span-2" title="Health Dimensions" subtitle="Radar view of computed sub-scores">
            <HealthRadar data={c.health.dims} height={320} />
          </Panel>
        </div>
      )}

      {tab === "Management" && (
        <div className="grid gap-6 lg:grid-cols-3">
          <Panel className="lg:col-span-2" title="Management Commentary" subtitle="From Chairman's statement and MD&A">
            <div className="flex items-center gap-2">
              <span className="text-xs text-muted-foreground">Management Outlook:</span>
              <span
                className={`rounded border px-2 py-0.5 text-xs font-medium ${
                  c.outlook === "Positive"
                    ? "border-success/40 bg-success/10 text-success"
                    : c.outlook === "Cautious"
                      ? "border-warning/40 bg-warning/10 text-warning"
                      : "border-border bg-secondary text-muted-foreground"
                }`}
              >
                {c.outlook}
              </span>
            </div>
            <blockquote className="mt-4 border-l-2 border-primary/50 pl-4 text-sm italic leading-relaxed">
              “{c.managementQuote.text}”
            </blockquote>
            <div className="mt-3">
              <Citation doc={c.managementQuote.source} page={c.managementQuote.page} />
            </div>

            <h3 className="mt-6 text-xs font-medium uppercase tracking-wide text-muted-foreground">
              Key themes
            </h3>
            <div className="mt-3 space-y-3">
              {c.themes.map((t) => (
                <div key={t.theme}>
                  <div className="flex justify-between text-sm">
                    <span>{t.theme}</span>
                    <span className="num text-xs text-muted-foreground">{t.weight}</span>
                  </div>
                  <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-secondary">
                    <div className="h-full rounded-full bg-accent" style={{ width: `${t.weight}%` }} />
                  </div>
                  <p className="mt-1 text-xs text-muted-foreground">{t.note}</p>
                </div>
              ))}
            </div>
          </Panel>
          <Panel title="Sentiment Trend" subtitle="Management tone score across reports">
            <TrendLine data={c.sentimentTrend} keys={[{ key: "score", label: "Sentiment" }]} height={220} />
            <p className="mt-3 text-xs leading-relaxed text-muted-foreground">
              Sentiment is scored from MD&A language across the available reports. Interpretation only —
              not a reported figure.
            </p>
          </Panel>
        </div>
      )}

      {tab === "Risk" && (
        <div className="space-y-6">
          <Panel title="Risk Matrix" subtitle="Likelihood vs impact, from the disclosed risk register">
            <RiskMatrix risks={c.risks} />
          </Panel>
          <div className="grid gap-3 md:grid-cols-2">
            {c.risks.map((r) => (
              <article key={r.name} className="panel p-5">
                <div className="flex items-start justify-between gap-3">
                  <h3 className="text-sm font-semibold">{r.name}</h3>
                  <RiskLevelBadge level={r.level} />
                </div>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{r.description}</p>
                <div className="mt-3 rounded-md border border-border bg-surface-2 p-3">
                  <ProvenanceTag kind="reported" />
                  <p className="mt-1.5 text-sm">{r.evidence}</p>
                  <div className="mt-2">
                    <Citation doc={r.document} page={r.page} />
                  </div>
                </div>
                <div className="mt-2 rounded-md border border-warning/30 bg-warning/8 p-3">
                  <ProvenanceTag kind="interpretation" />
                  <p className="mt-1.5 text-sm">{r.interpretation}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      )}

      {tab === "Ask FinSight" && (
        <AskFinSight
          scopeLabel={c.name}
          document={`${c.name} indexed documents`}
          prompts={answers.map((a) => a.question)}
          answers={answers}
        />
      )}

      <div className="mt-6 flex flex-wrap gap-2">
        {companies
          .filter((x) => x.slug !== c.slug && x.sector === c.sector)
          .map((x) => (
            <Link
              key={x.slug}
              to="/companies/$slug"
              params={{ slug: x.slug }}
              className="rounded-md border border-border px-3 py-1.5 text-xs text-muted-foreground transition-colors hover:border-primary/40 hover:text-primary"
            >
              Peer: {x.name}
            </Link>
          ))}
      </div>
    </AppShell>
  );
}
