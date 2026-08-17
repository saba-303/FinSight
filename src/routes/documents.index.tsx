import { createFileRoute, Link } from "@tanstack/react-router";
import { FileText, Upload } from "lucide-react";
import { AppShell, PageHeader } from "@/components/AppShell";
import { documents } from "@/data/finsight";

export const Route = createFileRoute("/documents/")({
  head: () => ({
    meta: [
      { title: "My Documents — Indexed Financial Reports | FinSight" },
      {
        name: "description",
        content:
          "Every indexed financial document in your workspace with page counts, detected tables and identified sections.",
      },
      { property: "og:title", content: "My Documents — FinSight" },
      { property: "og:description", content: "Indexed annual reports, presentations and filings." },
    ],
  }),
  component: DocsPage,
});

function DocsPage() {
  return (
    <AppShell>
      <PageHeader
        title="My Documents"
        subtitle="Indexed documents available for retrieval and citation."
        right={
          <Link
            to="/upload"
            className="inline-flex items-center gap-1.5 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground"
          >
            <Upload className="size-3.5" /> Upload
          </Link>
        }
      />
      <div className="grid gap-3 lg:grid-cols-2">
        {documents.map((d) => (
          <Link
            key={d.id}
            to="/documents/$id"
            params={{ id: d.id }}
            className="panel p-5 transition-colors hover:border-primary/40"
          >
            <div className="flex items-start gap-3">
              <FileText className="mt-0.5 size-4 text-primary" />
              <div className="flex-1">
                <p className="text-sm font-medium">{d.file}</p>
                <p className="mt-0.5 text-xs text-muted-foreground">
                  {d.company} · {d.type} · {d.year}
                </p>
              </div>
              <span className="rounded border border-success/40 bg-success/10 px-2 py-0.5 text-[11px] text-success">
                {d.status}
              </span>
            </div>
            <p className="num mt-3 text-xs text-muted-foreground">
              {d.pages} pages · {d.tables} tables · {d.sections.length} sections · uploaded {d.uploaded}
            </p>
            <div className="mt-3 flex flex-wrap gap-1.5">
              {d.sections.slice(0, 5).map((s) => (
                <span
                  key={s}
                  className="rounded-full border border-border px-2 py-0.5 text-[11px] text-muted-foreground"
                >
                  {s}
                </span>
              ))}
            </div>
          </Link>
        ))}
      </div>
    </AppShell>
  );
}
