import { Link } from "@tanstack/react-router";
import { ArrowLeft, AlertTriangle, CheckCircle2, Search } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { AppShell } from "@/components/AppShell";
import { Panel, Citation, Notice } from "@/components/primitives";
import { getDoc, searchChunks, type StoredDoc } from "@/lib/docstore";

export function UploadedDocPage({ id }: { id: string }) {
  const [doc, setDoc] = useState<StoredDoc | null | undefined>(undefined);
  const [page, setPage] = useState(1);
  const [q, setQ] = useState("");

  useEffect(() => {
    getDoc(id)
      .then((d) => setDoc(d ?? null))
      .catch(() => setDoc(null));
  }, [id]);

  const hits = useMemo(() => (doc && q.trim() ? searchChunks(doc, q, 6) : []), [doc, q]);

  if (doc === undefined)
    return (
      <AppShell>
        <p className="text-sm text-muted-foreground">Loading document…</p>
      </AppShell>
    );
  if (doc === null)
    return (
      <AppShell>
        <Notice tone="warning">
          This document isn't in your library on this device. It may have been deleted.
        </Notice>
        <Link to="/documents" className="mt-4 inline-block text-sm text-primary">
          Back to documents
        </Link>
      </AppShell>
    );

  const current = doc.pages.find((p) => p.page === page);

  return (
    <AppShell>
      <Link
        to="/documents"
        className="mb-4 inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="size-3.5" /> All documents
      </Link>

      <div className="panel mb-6 p-5">
        <h1 className="text-xl font-semibold tracking-tight">
          {doc.company} — {doc.type} {doc.year}
        </h1>
        <p className="num mt-1 text-sm text-muted-foreground">
          {doc.file} · Pages: {doc.pageCount} · Chunks: {doc.chunks.length} ·{" "}
          {(doc.size / 1024 / 1024).toFixed(1)} MB
        </p>
        {doc.ocrRequired ? (
          <div className="mt-4 flex items-center gap-2 rounded-md border border-warning/40 bg-warning/10 p-3 text-sm text-warning">
            <AlertTriangle className="size-4" /> OCR required — {doc.emptyPages} of {doc.pageCount} pages
            have no extractable text. This looks like a scanned document.
          </div>
        ) : (
          <ul className="mt-4 grid gap-2 sm:grid-cols-3">
            {["Text extracted per page", "Page numbers preserved", "Chunks indexed with metadata"].map((s) => (
              <li key={s} className="flex items-center gap-2 text-sm">
                <CheckCircle2 className="size-4 text-success" /> {s}
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <Panel title="Search this document" subtitle="Keyword retrieval over indexed chunks, cited by page">
            <div className="flex items-center gap-2 rounded-md border border-input bg-surface px-3">
              <Search className="size-4 text-muted-foreground" />
              <input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="e.g. revenue, borrowings, risk"
                className="h-10 flex-1 bg-transparent text-sm outline-none"
              />
            </div>
            {q.trim() && (
              <ul className="mt-4 space-y-3">
                {hits.length === 0 && (
                  <li className="text-sm text-muted-foreground">No matching passages found.</li>
                )}
                {hits.map(({ c }) => (
                  <li key={c.id} className="rounded-md border border-border bg-surface-2 p-3">
                    <p className="line-clamp-4 text-sm">{c.text}</p>
                    <div className="mt-2 flex items-center gap-2">
                      <Citation doc={doc.file} page={c.page} onOpen={() => setPage(c.page)} />
                      <span className="text-xs text-muted-foreground">
                        {c.meta.company} · {c.meta.year} · {c.meta.docType}
                      </span>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </Panel>

          <Panel title={`Page ${page} of ${doc.pageCount}`} subtitle="Extracted text">
            <div className="mb-3 flex gap-2">
              <button
                type="button"
                disabled={page <= 1}
                onClick={() => setPage((p) => p - 1)}
                className="rounded-md border border-border px-3 py-1 text-sm disabled:opacity-40"
              >
                Previous
              </button>
              <button
                type="button"
                disabled={page >= doc.pageCount}
                onClick={() => setPage((p) => p + 1)}
                className="rounded-md border border-border px-3 py-1 text-sm disabled:opacity-40"
              >
                Next
              </button>
            </div>
            {current && current.text ? (
              <pre className="max-h-[520px] overflow-auto whitespace-pre-wrap font-sans text-sm leading-relaxed">
                {current.text}
              </pre>
            ) : (
              <p className="text-sm text-warning">No text on this page — OCR required.</p>
            )}
          </Panel>
        </div>

        <Panel title="Pages" subtitle="Characters extracted per page">
          <ul className="max-h-[700px] space-y-1 overflow-auto">
            {doc.pages.map((p) => (
              <li key={p.page}>
                <button
                  type="button"
                  onClick={() => setPage(p.page)}
                  className={`flex w-full items-center justify-between rounded-md border px-3 py-1.5 text-sm ${p.page === page ? "border-primary/50 bg-primary/5" : "border-border bg-surface-2"}`}
                >
                  <span className="num">p. {p.page}</span>
                  <span className={`num text-xs ${p.chars < 20 ? "text-warning" : "text-muted-foreground"}`}>
                    {p.chars < 20 ? "no text" : `${p.chars.toLocaleString()} chars`}
                  </span>
                </button>
              </li>
            ))}
          </ul>
        </Panel>
      </div>
    </AppShell>
  );
}
