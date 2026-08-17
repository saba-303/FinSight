import { createFileRoute } from "@tanstack/react-router";
import { AppShell, PageHeader } from "@/components/AppShell";
import { Panel, Notice } from "@/components/primitives";

export const Route = createFileRoute("/settings")({
  head: () => ({
    meta: [
      { title: "Settings — Workspace & Backend Services | FinSight" },
      {
        name: "description",
        content:
          "Manage workspace preferences and review the placeholder backend services that will connect to live company data, parsing, embeddings and LLM providers.",
      },
      { property: "og:title", content: "Settings — FinSight" },
      { property: "og:description", content: "Workspace preferences and backend service placeholders." },
    ],
  }),
  component: SettingsPage,
});

const services = [
  ["Company data API", "Not connected — prototype uses mock JSON"],
  ["Financial statements API", "Not connected — prototype uses mock JSON"],
  ["PDF parser", "Simulated pipeline"],
  ["Embedding model", "Placeholder"],
  ["Vector database", "Placeholder"],
  ["LLM provider", "Placeholder"],
  ["Authentication", "Placeholder"],
  ["Report generation", "Placeholder"],
];

function SettingsPage() {
  return (
    <AppShell>
      <PageHeader title="Settings" subtitle="Workspace preferences and service connections." />
      <div className="grid gap-6 lg:grid-cols-2">
        <Panel title="Workspace">
          <div className="space-y-3">
            {[
              ["Default currency", "INR (₹ crore)"],
              ["Default trend window", "5 years"],
              ["Citation display", "Document + page number"],
              ["Answer labels", "Reported / Calculated / Interpretation"],
            ].map(([k, v]) => (
              <div key={k} className="flex items-center justify-between rounded-md border border-border bg-surface-2 px-3 py-2 text-sm">
                <span className="text-muted-foreground">{k}</span>
                <span>{v}</span>
              </div>
            ))}
          </div>
        </Panel>

        <Panel title="Backend Services" subtitle="Placeholders ready for real API connections">
          <div className="space-y-2">
            {services.map(([name, status]) => (
              <div key={name} className="flex items-center justify-between rounded-md border border-border bg-surface-2 px-3 py-2 text-sm">
                <span>{name}</span>
                <span className="text-xs text-muted-foreground">{status}</span>
              </div>
            ))}
          </div>
          <div className="mt-4">
            <Notice tone="warning">
              This prototype does not use live financial data. Connect real services before relying on
              any output.
            </Notice>
          </div>
        </Panel>
      </div>
    </AppShell>
  );
}
