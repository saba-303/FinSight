import { createFileRoute } from "@tanstack/react-router";
import { FileDown, Table2, FileSpreadsheet, Share2, Save, ScrollText } from "lucide-react";
import { AppShell, PageHeader } from "@/components/AppShell";
import { Panel, Notice } from "@/components/primitives";
import { savedReports } from "@/data/finsight";

export const Route = createFileRoute("/reports")({
  head: () => ({
    meta: [
      { title: "Research Reports & Exports | FinSight" },
      {
        name: "description",
        content:
          "Generate downloadable research reports with company overview, financials, ratios, risk analysis, management commentary, comparisons, AI insights and sources.",
      },
      { property: "og:title", content: "Research Reports — FinSight" },
      { property: "og:description", content: "Generate and export citation-backed research reports." },
    ],
  }),
  component: ReportsPage,
});

const sections = [
  "Company Overview",
  "Financial Performance",
  "Key Ratios",
  "Growth Trends",
  "Risk Analysis",
  "Management Commentary",
  "Strategic Outlook",
  "Company Comparison",
  "AI Insights",
  "Sources",
];

function ReportsPage() {
  return (
    <AppShell>
      <PageHeader
        title="Reports"
        subtitle="Assemble a research report from analysed companies and indexed documents."
        right={
          <button
            type="button"
            className="inline-flex items-center gap-1.5 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground"
          >
            <FileDown className="size-3.5" /> Generate Research Report
          </button>
        }
      />

      <div className="grid gap-6 lg:grid-cols-3">
        <Panel className="lg:col-span-2" title="Report Builder" subtitle="Select the sections to include">
          <div className="grid gap-2 sm:grid-cols-2">
            {sections.map((s) => (
              <label
                key={s}
                className="flex cursor-pointer items-center gap-2 rounded-md border border-border bg-surface-2 px-3 py-2 text-sm"
              >
                <input type="checkbox" defaultChecked className="accent-[var(--color-primary)]" />
                {s}
              </label>
            ))}
          </div>
          <p className="mt-4 text-xs text-muted-foreground">
            Generated reports include charts and page-level citations for every document-derived claim.
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            {[
              [FileDown, "Download PDF"],
              [FileSpreadsheet, "Download Excel"],
              [Table2, "Export CSV"],
              [Save, "Save Analysis"],
              [Share2, "Share Report"],
            ].map(([Icon, label], i) => {
              const I = Icon as typeof FileDown;
              return (
                <button
                  key={i}
                  type="button"
                  className="inline-flex items-center gap-1.5 rounded-md border border-border px-3 py-2 text-sm hover:bg-secondary"
                >
                  <I className="size-3.5" /> {label as string}
                </button>
              );
            })}
          </div>
          <div className="mt-4">
            <Notice>Export actions are placeholders in this prototype.</Notice>
          </div>
        </Panel>

        <Panel title="Saved Reports">
          <div className="space-y-2">
            {savedReports.map((r) => (
              <div key={r.id} className="rounded-md border border-border bg-surface-2 p-3">
                <div className="flex items-start gap-2">
                  <ScrollText className="mt-0.5 size-3.5 text-primary" />
                  <div>
                    <p className="text-sm font-medium">{r.title}</p>
                    <p className="num mt-0.5 text-xs text-muted-foreground">
                      {r.company} · {r.pages} pages · {r.created}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Panel>
      </div>
    </AppShell>
  );
}
