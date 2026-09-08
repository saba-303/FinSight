import { createFileRoute } from "@tanstack/react-router";
import { AppShell, PageHeader } from "@/components/AppShell";
import { Panel, Notice, ProvenanceTag } from "@/components/primitives";
import { AskChat, type ChatAnswer } from "@/components/AskChat";

export const Route = createFileRoute("/ask")({
  head: () => ({
    meta: [
      { title: "Ask AI — Evidence-Backed Report Answers | FinSight" },
      {
        name: "description",
        content:
          "Ask questions about an annual report and get answers labelled Fact, Calculation or Inference, each with the exact page and note it was grounded in.",
      },
      { property: "og:title", content: "Ask AI — FinSight" },
      {
        property: "og:description",
        content: "Answers with claim-type badges and a live evidence panel showing the source page.",
      },
    ],
  }),
  component: AskPage,
});

const answers: ChatAnswer[] = [
  {
    question: "What was revenue in FY2025?",
    answer:
      "HAL reported revenue from operations of ₹30,381 crore for the year ended 31 March 2025, against ₹26,928 crore in the prior year.",
    claim: "reported",
    evidence: {
      document: "HAL Annual Report FY2025",
      page: 76,
      note: "statement of profit and loss",
      excerpt:
        "Revenue from operations ₹30,381 crore (previous year ₹26,928 crore), comprising sale of products ₹24,910 crore and sale of services ₹5,471 crore.",
    },
  },
  {
    question: "What is the operating margin trend?",
    answer:
      "Operating margin expanded from 21.4% in FY2023 to 24.7% in FY2025, a 3.3 percentage-point improvement over two reported periods.",
    claim: "calculated",
    working: "EBITDA ₹7,504 Cr ÷ revenue ₹30,381 Cr = 24.7% · FY23: ₹5,105 Cr ÷ ₹23,855 Cr = 21.4%",
    evidence: {
      document: "HAL Annual Report FY2025",
      page: 74,
      note: "note 21",
      excerpt:
        "Earnings before interest, tax, depreciation and amortisation for the year stood at ₹7,504 crore compared with ₹6,388 crore in the previous financial year.",
    },
  },
  {
    question: "Are receivables a concern?",
    answer:
      "Trade receivables rose 31.2% while revenue rose 12.8%, so collections are lagging sales. Receivable days moved from 118 to 139.",
    claim: "calculated",
    working: "₹41,208 Cr ÷ ₹31,405 Cr = +31.2% vs revenue +12.8% · ratio 2.44x",
    evidence: {
      document: "HAL Annual Report FY2025",
      page: 87,
      note: "note 14",
      excerpt:
        "Trade receivables (unsecured, considered good) ₹41,208 crore as at 31 March 2025 against ₹31,405 crore in the previous year. Ageing beyond 180 days: ₹6,842 crore.",
    },
  },
  {
    question: "Does the narrative match the numbers?",
    answer:
      "Not fully. The Directors' Report claims 'robust double-digit growth in order inflows', but the disclosed order book grew 8.4% — below the double-digit threshold the narrative implies.",
    claim: "interpretation",
    working: "Order book ₹94,100 Cr vs ₹86,800 Cr = +8.4%",
    evidence: {
      document: "HAL Annual Report FY2025",
      page: 23,
      note: "directors' report",
      excerpt:
        "The Company delivered robust double-digit growth in order inflows during the year under review, supported by sustained defence procurement.",
    },
  },
  {
    question: "How large are contingent liabilities?",
    answer:
      "Contingent liabilities stand at ₹8,940 crore, equal to 21.0% of net worth — significant because they sit off the balance sheet.",
    claim: "calculated",
    working: "₹8,940 Cr ÷ net worth ₹42,600 Cr = 21.0%",
    evidence: {
      document: "HAL Annual Report FY2025",
      page: 141,
      note: "note 38",
      excerpt:
        "Claims against the Company not acknowledged as debts: ₹8,940 crore, primarily comprising disputed statutory demands and contractual claims.",
    },
  },
];

function AskPage() {
  return (
    <AppShell>
      <PageHeader
        title="Ask AI"
        subtitle="Ask in plain language. Every answer is labelled by claim type and linked to the page it came from."
        badge="Evidence-grounded"
      />
      <AskChat answers={answers} />

      <div className="mt-6 grid gap-4 lg:grid-cols-[1.6fr_1fr]">
        <Panel title="How to read an answer" subtitle="The claim classification is the method, not decoration">
          <ul className="space-y-3">
            {(
              [
                [
                  "reported",
                  "A figure or sentence lifted verbatim from the document. Checkable by opening the cited page.",
                ],
                [
                  "calculated",
                  "Computed in code from extracted statement lines. The working is shown so the arithmetic is checkable. The language model never does the maths.",
                ],
                [
                  "interpretation",
                  "The model's reading of the evidence. It may characterise, compare or caveat — it never introduces a new number.",
                ],
              ] as const
            ).map(([kind, body]) => (
              <li key={kind} className="flex gap-3">
                <div className="pt-0.5">
                  <ProvenanceTag kind={kind} />
                </div>
                <p className="text-sm leading-relaxed text-muted-foreground">{body}</p>
              </li>
            ))}
          </ul>
        </Panel>
        <Notice tone="warning">
          FinSight answers only from retrieved evidence. When the documents do not support an answer it
          says so rather than generating a figure.
        </Notice>
      </div>
    </AppShell>
  );
}
