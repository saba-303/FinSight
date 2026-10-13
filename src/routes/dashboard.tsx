import { createFileRoute, Link } from "@tanstack/react-router";
import { Sparkles, Upload } from "lucide-react";
import type { ReactNode } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  ComposedChart,
  Line,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { AppShell } from "@/components/AppShell";
import { Citation, Notice, ProvenanceTag } from "@/components/primitives";
import {
  SOURCE_DOC,
  cashFlow,
  costs,
  legal,
  position,
  reportedEmployeeCostPct,
  reportedRatios,
  reportedTotalOpCost,
  risks,
  segments,
  shareholderReturns,
  snapshot,
  sourceIndex,
  trend,
  TREND_PAGES,
  SEGMENT_PAGES,
  COST_PAGES,
  unavailable,
} from "@/data/tcs";
import { cagr, fcfAfterDividends, fmtCr, fmtPct, fmtPp, growth, ratio, share } from "@/lib/fin-calc";

export const Route = createFileRoute("/dashboard")({
  head: () => ({
    meta: [
      { title: "TCS FY2026 Financial Report — FinSight" },
      {
        name: "description",
        content:
          "Tata Consultancy Services FY2025–26 analysis: performance, segments, cash flow, financial position, shareholder returns and disclosed risks, each tied to a report page.",
      },
      { property: "og:title", content: "TCS FY2026 Financial Report — FinSight" },
      {
        property: "og:description",
        content: "An evidence-linked research report on TCS's Integrated Annual Report 2025–26.",
      },
      { property: "og:type", content: "article" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: Dashboard,
});

const nav = [
  ["summary", "Summary"],
  ["snapshot", "Snapshot"],
  ["performance", "Performance"],
  ["segments", "Segments"],
  ["position", "Position & cash"],
  ["returns", "Shareholders"],
  ["risks", "Risks"],
  ["findings", "Findings"],
  ["sources", "Sources"],
] as const;

const cite = (p: number | number[], note?: string) => <Citation doc={SOURCE_DOC} page={p} note={note} />;
const axis = { fontSize: 11, fill: "var(--color-muted-foreground)" };
const tip = {
  contentStyle: {
    background: "var(--color-popover)",
    border: "1px solid var(--color-border)",
    borderRadius: 6,
    fontSize: 12,
  },
};

function Section({ id, n, title, children, lede }: { id: string; n: number; title: string; lede?: string; children: ReactNode }) {
  return (
    <section id={id} className="scroll-mt-24 border-t border-border py-10">
      <div className="mb-5 flex items-baseline gap-3">
        <span className="num text-xs text-muted-foreground">{String(n).padStart(2, "0")}</span>
        <div>
          <h2 className="text-lg font-semibold">{title}</h2>
          {lede && <p className="mt-1 max-w-3xl text-sm leading-relaxed text-muted-foreground">{lede}</p>}
        </div>
      </div>
      {children}
    </section>
  );
}

function Commentary({ children }: { children: ReactNode }) {
  return (
    <div className="rounded-md border border-border bg-surface-2 p-4 text-sm leading-relaxed">
      <div className="mb-2 flex items-center gap-2">
        <ProvenanceTag kind="interpretation" />
        <span className="text-xs text-muted-foreground">Analyst commentary</span>
      </div>
      {children}
    </div>
  );
}

function Table({ head, rows, align }: { head: string[]; rows: ReactNode[][]; align?: ("l" | "r")[] }) {
  return (
    <div className="overflow-x-auto rounded-md border border-border bg-surface">
      <table className="w-full min-w-[560px] text-sm">
        <thead>
          <tr className="border-b border-border bg-surface-2 text-left text-xs text-muted-foreground">
            {head.map((h, i) => (
              <th key={h} className={`px-3 py-2 font-medium ${align?.[i] === "r" ? "text-right" : ""}`}>{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((r, i) => (
            <tr key={i} className="border-b border-border last:border-0">
              {r.map((c, j) => (
                <td key={j} className={`px-3 py-2 align-top ${align?.[j] === "r" ? "num text-right" : ""}`}>{c}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function Dashboard() {
  const last = trend[trend.length - 1]!;
  const prev = trend[trend.length - 2]!;
  const first = trend[0]!;
  const revCagr = cagr(first.revenue, last.revenue, trend.length - 1);
  const opMarginCalc = ratio(last.ebit, last.revenue)! * 100;
  const netMarginCalc = ratio(last.pat, last.revenue)! * 100;
  const cashConv = ratio(cashFlow.ocf.fy26, last.pat)! * 100;
  const fcf26 = fcfAfterDividends(cashFlow.ocf.fy26, cashFlow.capex.fy26, cashFlow.divShareholders.fy26, cashFlow.divMinority.fy26);
  const fcf25 = fcfAfterDividends(cashFlow.ocf.fy25, cashFlow.capex.fy25, cashFlow.divShareholders.fy25, cashFlow.divMinority.fy25);
  const fcfPreDiv26 = cashFlow.ocf.fy26 - cashFlow.capex.fy26;
  const segTotal = segments.reduce((s, x) => s + x.revenue, 0);
  const costSum26 = costs.reduce((s, c) => s + c.fy26, 0);
  const curA = position.find((p) => p.label === "Current assets")!.value!;
  const curL = position.find((p) => p.label === "Current liabilities")!.value!;
  const curRatioCalc = curA / curL;
  const liquid = 6417 + 7216 + 33988;

  return (
    <AppShell>
      <div className="mx-auto max-w-5xl">
        {/* 1. Header */}
        <header className="pb-8">
          <p className="text-xs font-medium uppercase tracking-wider text-primary">Company report · FY2025–26</p>
          <h1 className="mt-2 text-3xl font-semibold">Tata Consultancy Services Limited</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            IT services & consulting · Year ended 31 March 2026 · Consolidated unless stated · ₹ crore
          </p>
          <div className="mt-3 flex flex-wrap items-center gap-2">
            <span className="text-xs text-muted-foreground">Source:</span>
            {cite([88, 99, 196, 203])}
            <Link to="/ask" className="ml-auto inline-flex items-center gap-1.5 rounded-md border border-border px-3 py-1.5 text-sm hover:bg-secondary">
              <Sparkles className="size-3.5" /> Ask AI
            </Link>
            <Link to="/upload" className="inline-flex items-center gap-1.5 rounded-md bg-primary px-3 py-1.5 text-sm font-medium text-primary-foreground hover:opacity-90">
              <Upload className="size-3.5" /> Upload a report
            </Link>
          </div>
          <div className="mt-4">
            <Notice tone="warning">
              Figures come from the TCS research summary you uploaded, which cites printed Annual Report pages. FinSight
              has not checked them against the original annual report.
            </Notice>
          </div>
        </header>

        <nav className="sticky top-0 z-10 -mx-2 mb-2 flex gap-1 overflow-x-auto bg-background/95 px-2 py-2 backdrop-blur">
          {nav.map(([id, label]) => (
            <a key={id} href={`#${id}`} className="shrink-0 rounded-md px-2.5 py-1 text-xs text-muted-foreground hover:bg-secondary hover:text-foreground">
              {label}
            </a>
          ))}
        </nav>

        {/* 2. Executive summary */}
        <Section id="summary" n={1} title="Executive summary">
          <ul className="space-y-2.5 text-sm leading-relaxed">
            <li>
              Revenue grew <b className="num">{fmtPct(growth(last.revenue, prev.revenue))}</b> to {fmtCr(last.revenue)}, but
              the report states constant-currency revenue <b>declined 2.4%</b>, so currency helped the reported growth. {cite(88)}
            </li>
            <li>
              EBIT rose faster than revenue (<span className="num">{fmtPct(growth(last.ebit, prev.ebit))}</span>), lifting the
              management-reported operating margin from 24.3% to 25.0%. {cite([88, 100])}
            </li>
            <li>
              Operating cash flow of {fmtCr(cashFlow.ocf.fy26)} covered capex and dividends with {fmtCr(fcf26)} left over,
              after a shortfall in FY2025. {cite(cashFlow.pages)}
            </li>
            <li>
              Two Salesforce-related acquisitions raised goodwill from {fmtCr(1860)} to {fmtCr(9108)}; a ₹1,010 crore
              provision was recognised for the CSC litigation. {cite([234, 257])}
            </li>
          </ul>
        </Section>

        {/* 3. Snapshot */}
        <Section id="snapshot" n={2} title="Financial snapshot" lede="Statutory consolidated figures and management-reported measures are labelled separately. They are not interchangeable.">
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {snapshot.map((m) => {
              const g = growth(m.fy26, m.fy25);
              return (
                <div key={m.key} className="rounded-md border border-border bg-surface p-4">
                  <div className="flex items-start justify-between gap-2">
                    <p className="text-xs text-muted-foreground">{m.label}</p>
                    <span className="rounded border border-border px-1.5 py-0.5 text-[10px] text-muted-foreground">{m.scope}</span>
                  </div>
                  <p className="num mt-2 text-xl font-semibold">{fmtCr(m.fy26)}</p>
                  <p className="num mt-0.5 text-xs text-muted-foreground">
                    FY25 {fmtCr(m.fy25)} ·{" "}
                    <span className={g != null && g >= 0 ? "text-success" : "text-destructive"}>{fmtPct(g)}</span>
                  </p>
                  <p className="mt-2 text-xs leading-relaxed text-muted-foreground">{m.definition}</p>
                  <div className="mt-2">{cite(m.pages)}</div>
                </div>
              );
            })}
          </div>
          <div className="mt-3 grid gap-3 sm:grid-cols-3">
            <MiniStat label="Operating margin" value={`${opMarginCalc.toFixed(1)}%`} note="EBIT ÷ revenue" />
            <MiniStat label="Net margin" value={`${netMarginCalc.toFixed(1)}%`} note="PAT excl. exceptional ÷ revenue" />
            <MiniStat label="Cash conversion" value={`${cashConv.toFixed(0)}%`} note="OCF ÷ PAT excl. exceptional" />
          </div>
        </Section>

        {/* 4. Performance */}
        <Section id="performance" n={3} title="Financial performance" lede={`Five-year revenue CAGR of ${revCagr.toFixed(1)}% (calculated, FY22–FY26).`}>
          <div className="rounded-md border border-border bg-surface p-4">
            <p className="mb-2 text-xs text-muted-foreground">Revenue and EBIT (₹ crore, bars) · operating margin (%, line)</p>
            <div className="h-64">
              <ResponsiveContainer>
                <ComposedChart data={trend} margin={{ left: 0, right: 8, top: 8 }}>
                  <CartesianGrid stroke="var(--color-border)" vertical={false} />
                  <XAxis dataKey="year" tick={axis} axisLine={false} tickLine={false} />
                  <YAxis yAxisId="l" tick={axis} axisLine={false} tickLine={false} tickFormatter={(v) => `${(v / 1000).toFixed(0)}k`} />
                  <YAxis yAxisId="r" orientation="right" domain={[20, 28]} tick={axis} axisLine={false} tickLine={false} tickFormatter={(v) => `${v}%`} />
                  <Tooltip {...tip} />
                  <Bar yAxisId="l" dataKey="revenue" name="Revenue" fill="var(--color-chart-1)" radius={[3, 3, 0, 0]} />
                  <Bar yAxisId="l" dataKey="ebit" name="EBIT" fill="var(--color-chart-2)" radius={[3, 3, 0, 0]} />
                  <Line yAxisId="r" dataKey="opMargin" name="Op. margin %" stroke="var(--color-chart-3)" strokeWidth={2} dot />
                </ComposedChart>
              </ResponsiveContainer>
            </div>
            <p className="mt-1 text-[11px] text-muted-foreground">Margin axis starts at 20% to show movement; bars start at zero.</p>
            <div className="mt-2">{cite(TREND_PAGES)}</div>
          </div>

          <h3 className="mb-2 mt-6 text-sm font-semibold">Expense composition</h3>
          <Table
            head={["Cost line", "FY2026", "% revenue", "FY2025", "YoY"]}
            align={["l", "r", "r", "r", "r"]}
            rows={costs.map((c) => [c.name, fmtCr(c.fy26), `${share(c.fy26, last.revenue).toFixed(1)}%`, fmtCr(c.fy25), fmtPct(growth(c.fy26, c.fy25))])}
          />
          <div className="mt-2">{cite(COST_PAGES)}</div>
          <div className="mt-3 rounded-md border border-warning/30 bg-warning/8 p-3 text-xs leading-relaxed">
            <div className="mb-1 flex items-center gap-2"><ProvenanceTag kind="calculated" /> <b>Reconciliation gap</b></div>
            The four lines sum to <span className="num">{fmtCr(costSum26)}</span>, but the source gives total operating cost as{" "}
            <span className="num">{fmtCr(reportedTotalOpCost.fy26)}</span> (75.0% of revenue). The lines may overlap or use different
            definitions; the source does not explain this. Employee cost calculates to {share(costs[0]!.fy26, last.revenue).toFixed(1)}% of
            revenue from operations versus {reportedEmployeeCostPct}% reported, likely a different denominator (“total revenue”).
          </div>
          <div className="mt-4">
            <Commentary>
              Margin expansion came while revenue grew only modestly. The report attributes EBIT growth to productivity,
              realisation, business mix, pyramid restructuring and favourable currency {cite(88)}. Licence costs fell 62.2%,
              which the source does not explain; we draw no conclusion about its cause.
            </Commentary>
          </div>
        </Section>

        {/* 5. Segments */}
        <Section id="segments" n={4} title="Business performance" lede="Reportable industry segments. Share is calculated against revenue from operations.">
          <div className="grid gap-4 lg:grid-cols-5">
            <div className="rounded-md border border-border bg-surface p-4 lg:col-span-2">
              <p className="mb-2 text-xs text-muted-foreground">YoY revenue growth (%)</p>
              <div className="h-60">
                <ResponsiveContainer>
                  <BarChart data={segments} layout="vertical" margin={{ left: 10, right: 12 }}>
                    <CartesianGrid stroke="var(--color-border)" horizontal={false} />
                    <XAxis type="number" tick={axis} axisLine={false} tickLine={false} />
                    <YAxis type="category" dataKey="name" width={110} tick={axis} axisLine={false} tickLine={false} />
                    <Tooltip {...tip} />
                    <Bar dataKey="yoy" name="YoY %" fill="var(--color-chart-1)" radius={2} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
            <div className="lg:col-span-3">
              <Table
                head={["Segment", "Revenue", "Share", "YoY", "Margin"]}
                align={["l", "r", "r", "r", "r"]}
                rows={segments.map((s) => [
                  s.name,
                  fmtCr(s.revenue),
                  `${share(s.revenue, last.revenue).toFixed(1)}%`,
                  <span className={s.yoy < 0 ? "text-destructive" : "text-success"}>{fmtPct(s.yoy)}</span>,
                  `${s.margin.toFixed(1)}%`,
                ])}
              />
              <p className="num mt-2 text-xs text-muted-foreground">Segment total {fmtCr(segTotal)} · matches reported revenue: {segTotal === last.revenue ? "yes" : "no"}</p>
              <div className="mt-2">{cite(SEGMENT_PAGES)}</div>
            </div>
          </div>
          <div className="mt-4">
            <Commentary>
              BFSI, at 38.7% of revenue, grew 9.3% and is the largest contributor. CMT fell 14.0%, the only segment
              to decline. The report links the constant-currency decline to the completion of a large domestic contract,
              but the summary does not say which segment it belonged to. Geographic revenue figures are not in the supplied
              data; the source says only that the Americas is the largest region.
            </Commentary>
          </div>
        </Section>

        {/* 6. Position */}
        <Section id="position" n={5} title="Financial position and cash flow">
          <div className="grid gap-4 lg:grid-cols-2">
            <div>
              <Table
                head={["Item (31 Mar 2026)", "Value", "Page"]}
                align={["l", "r", "r"]}
                rows={position.map((p) => [p.label, fmtCr(p.value), p.page ?? "—"])}
              />
              <div className="mt-3 grid grid-cols-2 gap-3">
                <MiniStat label="Current ratio (reported)" value={`${reportedRatios.currentRatio.fy26.toFixed(1)}x`} note={`FY25 ${reportedRatios.currentRatio.fy25}x · p. ${reportedRatios.page}`} />
                <MiniStat label="Debt / equity (reported)" value={`${reportedRatios.debtEquity.fy26.toFixed(1)}x`} note="Includes lease liabilities" />
              </div>
              <p className="mt-3 text-xs leading-relaxed text-muted-foreground">
                <ProvenanceTag kind="calculated" /> Current assets ÷ current liabilities from p. 196 gives{" "}
                <span className="num">{curRatioCalc.toFixed(2)}x</span>, higher than the 2.0x reported on p. 346. The source does not
                explain the difference. Cash, deposits and investments together total <span className="num">{fmtCr(liquid)}</span>.
              </p>
            </div>
            <div>
              <Table
                head={["Cash flow", "FY2026", "FY2025"]}
                align={["l", "r", "r"]}
                rows={[
                  ["Operating cash flow", fmtCr(cashFlow.ocf.fy26), fmtCr(cashFlow.ocf.fy25)],
                  ["− Capex", fmtCr(cashFlow.capex.fy26), fmtCr(cashFlow.capex.fy25)],
                  ["= OCF less capex", fmtCr(fcfPreDiv26), fmtCr(cashFlow.ocf.fy25 - cashFlow.capex.fy25)],
                  ["− Dividends to shareholders", fmtCr(cashFlow.divShareholders.fy26), fmtCr(cashFlow.divShareholders.fy25)],
                  ["− Dividends to minority", fmtCr(cashFlow.divMinority.fy26), fmtCr(cashFlow.divMinority.fy25)],
                  [<b>FCF after dividends</b>, <b className={fcf26 < 0 ? "text-destructive" : ""}>{fmtCr(fcf26)}</b>, <b className={fcf25 < 0 ? "text-destructive" : ""}>{fmtCr(fcf25)}</b>],
                ]}
              />
              <div className="mt-2 flex flex-wrap items-center gap-2">
                <ProvenanceTag kind="calculated" /> {cite(cashFlow.pages)}
              </div>
              <p className="mt-2 text-xs text-muted-foreground">
                This is FinSight's own measure, not a TCS-defined free cash flow. A % change between a negative and a positive
                value isn't meaningful, so we don't show one.
              </p>
            </div>
          </div>
          <div className="mt-4">
            <Commentary>
              Cash & equivalents fell {fmtPct(growth(6417, 8342))} even as operating cash flow rose. The cash flow statement
              shows ₹6,750 crore spent on acquisitions {cite(203)}. That spending explains part of the fall, but we can't
              split out the rest from the supplied data. Leverage is low, and the report says operating cash flow was enough
              to meet its obligations, including leases.
            </Commentary>
          </div>
        </Section>

        {/* 7. Returns */}
        <Section id="returns" n={6} title="Shareholder returns and capital allocation">
          <div className="grid gap-3 sm:grid-cols-3">
            <MiniStat label="Dividend per share FY2026" value={`₹${shareholderReturns.dividendPerShareFy26}`} note={`Declared / recommended · p. ${shareholderReturns.dividendPerSharePage}`} />
            <MiniStat label="Dividends paid (cash)" value={fmtCr(cashFlow.divShareholders.fy26)} note={`FY25 ${fmtCr(cashFlow.divShareholders.fy25)} · ${fmtPct(growth(cashFlow.divShareholders.fy26, cashFlow.divShareholders.fy25))}`} />
            <MiniStat label="Dividends ÷ OCF" value={`${(ratio(cashFlow.divShareholders.fy26, cashFlow.ocf.fy26)! * 100).toFixed(0)}%`} note={`FY25 ${(ratio(cashFlow.divShareholders.fy25, cashFlow.ocf.fy25)! * 100).toFixed(0)}% · calculated`} />
          </div>
          <h3 className="mb-2 mt-6 text-sm font-semibold">Acquisitions and investments</h3>
          <Table
            head={["Date", "Transaction", "Consideration", "Goodwill", "Page"]}
            align={["l", "l", "l", "r", "r"]}
            rows={shareholderReturns.acquisitions.map((a) => [a.date, a.name, a.amount, a.goodwill == null ? "—" : fmtCr(a.goodwill), a.pages.join("–")])}
          />
          <p className="mt-2 text-xs text-muted-foreground">
            The source gives no FY2025 dividend per share, so we can't compare it per share. Dividends paid in cash fell year on year.
          </p>
        </Section>

        {/* 8. Risks */}
        <Section id="risks" n={7} title="Risks and disclosures" lede="Only risks the company itself discloses. TCS does not rate them, so neither do we.">
          <div className="grid gap-3 sm:grid-cols-2">
            {risks.map((r) => (
              <div key={r.name} className="rounded-md border border-border bg-surface p-4">
                <p className="text-sm font-medium">{r.name}</p>
                <p className="mt-1 text-xs leading-relaxed text-muted-foreground">{r.detail}</p>
                <div className="mt-2">{cite(r.pages)}</div>
              </div>
            ))}
          </div>
          <h3 className="mb-2 mt-6 text-sm font-semibold">Legal and contingent items</h3>
          <Table head={["Topic", "Disclosure", "Amount / status", "Page"]} align={["l", "l", "l", "r"]} rows={legal.map((l) => [l.topic, l.fact, l.amount, l.page])} />
          <p className="mt-2 text-xs text-muted-foreground">Outcomes are pending where stated. FinSight makes no prediction about them.</p>
        </Section>

        {/* 9. Findings */}
        <Section id="findings" n={8} title="Key findings">
          <ol className="list-decimal space-y-2 pl-5 text-sm leading-relaxed">
            <li>Reported growth of 4.6% depended on currency: constant-currency revenue fell 2.4%.</li>
            <li>Profitability improved: operating margin rose 0.7 pp and net margin 0.8 pp, both management-reported.</li>
            <li>Cash conversion is high (OCF ≈ {cashConv.toFixed(0)}% of PAT), and FCF after dividends turned positive.</li>
            <li>Goodwill rose about 4.9 times through acquisitions; the report states impairment tests found no shortfall.</li>
            <li>Two figures in the source don't reconcile (cost lines vs. total, current ratio). They should be checked against the original report.</li>
          </ol>
          <h3 className="mb-2 mt-6 text-sm font-semibold">Not available in the supplied data</h3>
          <ul className="list-disc space-y-1 pl-5 text-xs text-muted-foreground">
            {unavailable.map((u) => <li key={u}>{u}</li>)}
          </ul>
        </Section>

        {/* 10. Sources */}
        <Section id="sources" n={9} title="Source index" lede={`${SOURCE_DOC}, printed page numbers.`}>
          <Table head={["Section", "Pages"]} align={["l", "r"]} rows={sourceIndex.map((s) => [s.section, s.pages])} />
        </Section>
      </div>
    </AppShell>
  );
}

function MiniStat({ label, value, note }: { label: string; value: string; note?: string }) {
  return (
    <div className="rounded-md border border-border bg-surface p-3">
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="num mt-1 text-lg font-semibold">{value}</p>
      {note && <p className="mt-0.5 text-[11px] text-muted-foreground">{note}</p>}
    </div>
  );
}
