import { createFileRoute, Link } from "@tanstack/react-router";
import { FlaskConical, FileText, MessageSquare } from "lucide-react";
import { AppShell, PageHeader } from "@/components/AppShell";
import { Panel } from "@/components/primitives";
import { getCompany, researchWorkspaces } from "@/data/finsight";

export const Route = createFileRoute("/research")({
  head: () => ({
    meta: [
      { title: "Research Workspace — Saved Analyses | FinSight" },
      {
        name: "description",
        content:
          "Save companies, documents, questions, AI insights and comparisons into named research workspaces you can return to.",
      },
      { property: "og:title", content: "Research Workspace — FinSight" },
      { property: "og:description", content: "Saved companies, documents, queries and insights." },
    ],
  }),
  component: ResearchPage,
});

function ResearchPage() {
  return (
    <AppShell>
      <PageHeader
        title="Research Workspace"
        subtitle="Grouped studies combining companies, documents, saved queries and generated insights."
      />
      <div className="grid gap-4 lg:grid-cols-3">
        {researchWorkspaces.map((w) => (
          <Panel key={w.id} title={w.title} subtitle={w.updated}>
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <FlaskConical className="size-3.5 text-primary" /> {w.insights} insights saved
            </div>

            <h3 className="mt-4 text-xs font-medium uppercase tracking-wide text-muted-foreground">
              Companies
            </h3>
            <div className="mt-2 flex flex-wrap gap-1.5">
              {w.companies.map((slug) => {
                const c = getCompany(slug);
                return c ? (
                  <Link
                    key={slug}
                    to="/companies/$slug"
                    params={{ slug }}
                    className="rounded-md border border-border px-2.5 py-1 text-xs hover:border-primary/40 hover:text-primary"
                  >
                    {c.name}
                  </Link>
                ) : null;
              })}
            </div>

            <h3 className="mt-4 text-xs font-medium uppercase tracking-wide text-muted-foreground">
              Documents
            </h3>
            <ul className="mt-2 space-y-1">
              {w.documents.map((d) => (
                <li key={d} className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  <FileText className="size-3" /> {d}
                </li>
              ))}
            </ul>

            <h3 className="mt-4 text-xs font-medium uppercase tracking-wide text-muted-foreground">
              Saved queries
            </h3>
            <ul className="mt-2 space-y-1">
              {w.queries.map((q) => (
                <li key={q} className="flex items-start gap-1.5 text-xs text-muted-foreground">
                  <MessageSquare className="mt-0.5 size-3 shrink-0" /> {q}
                </li>
              ))}
            </ul>
          </Panel>
        ))}
      </div>
    </AppShell>
  );
}
