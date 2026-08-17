import { createFileRoute } from "@tanstack/react-router";
import { AppShell, PageHeader } from "@/components/AppShell";
import { Panel, Notice } from "@/components/primitives";
import { AskFinSight, type CannedAnswer } from "@/components/AskFinSight";
import { cagr, getCompany, sliceYears } from "@/data/finsight";

export const Route = createFileRoute("/ask")({
  head: () => ({
    meta: [
      { title: "Ask FinSight — Natural Language Financial Queries" },
      {
        name: "description",
        content:
          "Ask financial, business, risk, management and comparison questions in natural language and receive structured answers with page-level source citations.",
      },
      { property: "og:title", content: "Ask FinSight" },
      {
        property: "og:description",
        content: "Structured, evidence-grounded answers to natural-language questions about reports.",
      },
    ],
  }),
  component: AskPage,
});

function AskPage() {
  const hal = getCompany("hal")!;
  const bel = getCompany("bel")!;
  const hist = sliceYears(hal.history, 5);
  const revCagr = cagr(hist[0]!.revenue, hist[hist.length - 1]!.revenue, hist.length - 1);

  const answers: CannedAnswer[] = [
    {
      question: "Find major risks",
      points: hal.risks.slice(0, 3).map((r) => ({ heading: r.name, body: r.evidence, page: r.page })),
      interpretation: hal.risks[0]!.interpretation,
      document: "HAL Annual Report FY2025",
    },
    {
      question: "Explain revenue growth",
      intro: hist.map((d) => `${d.year} → ₹${d.revenue.toLocaleString("en-IN")} Cr`).join("  ·  "),
      points: [
        {
          heading: "Reported revenue",
          body: `Revenue moved from ₹${hist[0]!.revenue.toLocaleString("en-IN")} Cr to ₹${hist[hist.length - 1]!.revenue.toLocaleString("en-IN")} Cr across the indexed reports.`,
          page: 76,
        },
        {
          heading: "Revenue CAGR",
          body: `${revCagr.toFixed(1)}% computed as (End/Begin)^(1/n) − 1.`,
          page: 76,
          kind: "calculated",
        },
      ],
      interpretation: "Growth accelerated in the most recent two reported periods.",
      document: "HAL Annual Report FY2025",
    },
    {
      question: "Compare with another company",
      points: [
        {
          heading: "Revenue scale",
          body: `HAL reported ₹${hal.history[hal.history.length - 1]!.revenue.toLocaleString("en-IN")} Cr versus BEL at ₹${bel.history[bel.history.length - 1]!.revenue.toLocaleString("en-IN")} Cr.`,
          page: 76,
        },
        {
          heading: "Operating margin",
          body: `HAL ${hal.history[hal.history.length - 1]!.opMargin}% versus BEL ${bel.history[bel.history.length - 1]!.opMargin}%.`,
          page: 58,
          kind: "calculated",
        },
      ],
      interpretation:
        "HAL operates at larger scale; BEL shows a faster recent growth rate in the indexed dataset.",
      document: "HAL & BEL Annual Reports FY2025",
    },
    {
      question: "Analyze management outlook",
      points: [
        { heading: "Outlook", body: hal.managementQuote.text, page: hal.managementQuote.page },
        {
          heading: hal.themes[0]!.theme,
          body: hal.themes[0]!.note,
          page: hal.managementQuote.page,
          kind: "interpretation",
        },
      ],
      document: "HAL Annual Report FY2025",
    },
    {
      question: "Find unusual changes",
      points: [
        {
          heading: "Margin step-up",
          body: "Operating margin expanded materially between FY23 and FY24 while revenue growth stayed in the low teens.",
          page: 74,
          kind: "calculated",
        },
      ],
      interpretation: "The divergence suggests mix or cost effects rather than volume-led operating leverage.",
      document: "HAL Annual Report FY2025",
    },
  ];

  return (
    <AppShell>
      <PageHeader
        title="Ask FinSight"
        subtitle="Natural-language queries across indexed companies and documents. Answers return as structured insight cards, not a chat transcript."
      />
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <AskFinSight
            scopeLabel="All indexed documents"
            document="the indexed document set"
            prompts={answers.map((a) => a.question)}
            answers={answers}
          />
        </div>
        <div className="space-y-6">
          <Panel title="Question types supported">
            {[
              ["Financial", ["Revenue growth between two years", "Why did profit decline?", "Calculate revenue CAGR"]],
              ["Business", ["Main revenue sources", "Fastest growing segment", "Management strategy"]],
              ["Risk", ["Top five risks", "Which risks increased vs last year?"]],
              ["Comparison", ["Compare this company with TCS", "Which company has better margins?"]],
            ].map(([g, qs]) => (
              <div key={g as string} className="mb-4 last:mb-0">
                <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                  {g as string}
                </p>
                <ul className="mt-1.5 space-y-1 text-sm text-muted-foreground">
                  {(qs as string[]).map((q) => (
                    <li key={q}>· {q}</li>
                  ))}
                </ul>
              </div>
            ))}
          </Panel>
          <Notice tone="warning">
            FinSight answers only from retrieved evidence. When the documents do not support an answer,
            it says the information was not found rather than generating a figure.
          </Notice>
        </div>
      </div>
    </AppShell>
  );
}
