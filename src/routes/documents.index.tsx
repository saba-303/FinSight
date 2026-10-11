import { createFileRoute, Link } from "@tanstack/react-router";
import { FileText, Upload } from "lucide-react";
import { AppShell, PageHeader } from "@/components/AppShell";
import { useEffect, useState } from "react";
import { documents } from "@/data/finsight";
import { deleteDoc, listDocs, type StoredDoc } from "@/lib/docstore";

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
  const [mine, setMine] = useState<StoredDoc[]>([]);
  useEffect(() => {
    listDocs().then(setMine).catch(() => {});
  }, []);
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
      {mine.length > 0 && (
        <>
          <h2 className="mb-3 text-sm font-semibold">Your uploads</h2>
          <div className="mb-8 grid gap-3 lg:grid-cols-2">
            {mine.map((d) => (
              <div key={d.id} className="panel relative p-5 transition-colors hover:border-primary/40">
                <Link to="/documents/$id" params={{ id: d.id }} className="block">
                  <div className="flex items-start gap-3">
                    <FileText className="mt-0.5 size-4 text-primary" />
                    <div className="flex-1">
                      <p className="text-sm font-medium">{d.file}</p>
                      <p className="mt-0.5 text-xs text-muted-foreground">
                        {d.company} · {d.type} · {d.year}
                      </p>
                    </div>
                    <span
                      className={`rounded border px-2 py-0.5 text-[11px] ${d.ocrRequired ? "border-warning/40 bg-warning/10 text-warning" : "border-success/40 bg-success/10 text-success"}`}
                    >
                      {d.ocrRequired ? "OCR required" : "Indexed"}
                    </span>
                  </div>
                  <p className="num mt-3 text-xs text-muted-foreground">
                    {d.pageCount} pages · {d.chunks.length} chunks · uploaded {new Date(d.uploaded).toLocaleDateString()}
                  </p>
                </Link>
                <button
                  type="button"
                  onClick={async () => {
                    await deleteDoc(d.id);
                    setMine((m) => m.filter((x) => x.id !== d.id));
                  }}
                  className="absolute bottom-4 right-4 text-xs text-muted-foreground hover:text-destructive"
                >
                  Delete
                </button>
              </div>
            ))}
          </div>
          <h2 className="mb-3 text-sm font-semibold">Sample documents</h2>
        </>
      )}
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
