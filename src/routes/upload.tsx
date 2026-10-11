import { createFileRoute, Link } from "@tanstack/react-router";
import { UploadCloud, FileText, CheckCircle2, Loader2, Plus, ArrowRight, AlertTriangle } from "lucide-react";
import { useState } from "react";
import { AppShell, PageHeader } from "@/components/AppShell";
import { Panel, Notice } from "@/components/primitives";
import { documents } from "@/data/finsight";
import { chunkPages, saveDoc, type StoredDoc } from "@/lib/docstore";
import { extractPdf } from "@/lib/pdf-extract";

export const Route = createFileRoute("/upload")({
  head: () => ({
    meta: [
      { title: "Upload & Analyse a Financial Report | FinSight" },
      {
        name: "description",
        content:
          "Drop annual reports, quarterly filings, investor presentations or ESG reports. FinSight extracts text, tables and sections, then indexes them for evidence-backed answers.",
      },
      { property: "og:title", content: "Analyze Your Financial Report — FinSight" },
      {
        property: "og:description",
        content: "Upload PDFs and get an indexed, citation-ready financial document workspace.",
      },
    ],
  }),
  component: UploadPage,
});

const stages = [
  "Uploading",
  "Extracting text",
  "Extracting pages",
  "Segmenting pages",
  "Indexing document",
  "Saving to library",
  "Ready for analysis",
];

const docTypes = [
  "Annual Report",
  "Quarterly Report",
  "Investor Presentation",
  "Earnings Report",
  "ESG Report",
  "Financial Statement",
];

type Job = {
  key: string;
  file: File;
  company: string;
  year: string;
  type: string;
  status: "queued" | "processing" | "done" | "error";
  stage: number;
  progress: number;
  error?: string;
  result?: StoredDoc;
};

const MAX = 50 * 1024 * 1024;

function guessMeta(name: string) {
  const year = name.match(/20\d{2}/)?.[0] ?? String(new Date().getFullYear());
  const lower = name.toLowerCase();
  const type = lower.includes("present")
    ? "Investor Presentation"
    : lower.match(/q[1-4]|quarter/)
      ? "Quarterly Report"
      : lower.includes("earning")
        ? "Earnings Report"
        : lower.includes("esg")
          ? "ESG Report"
          : "Annual Report";
  const company = name
    .replace(/\.pdf$/i, "")
    .replace(/20\d{2}/g, "")
    .replace(/annual|report|quarterly|investor|presentation|earnings|esg|q[1-4]/gi, "")
    .replace(/[_-]+/g, " ")
    .trim();
  return { year, type, company: company || "Unnamed company" };
}

function UploadPage() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [drag, setDrag] = useState(false);
  const [rejected, setRejected] = useState<string[]>([]);

  const patch = (key: string, p: Partial<Job>) =>
    setJobs((js) => js.map((j) => (j.key === key ? { ...j, ...p } : j)));

  const addFiles = (list: File[]) => {
    const bad: string[] = [];
    const ok: Job[] = [];
    for (const f of list) {
      if (f.type !== "application/pdf" && !f.name.toLowerCase().endsWith(".pdf"))
        bad.push(`${f.name}: not a PDF`);
      else if (f.size > MAX) bad.push(`${f.name}: exceeds 50 MB`);
      else
        ok.push({
          key: `${f.name}-${f.size}-${Date.now()}-${Math.random()}`,
          file: f,
          ...guessMeta(f.name),
          status: "queued",
          stage: -1,
          progress: 0,
        });
    }
    setRejected(bad);
    setJobs((js) => [...js, ...ok]);
  };

  const process = async (job: Job) => {
    try {
      patch(job.key, { status: "processing", stage: 0, progress: 0, error: undefined });
      patch(job.key, { stage: 1 });
      const pages = await extractPdf(job.file, (d, t) =>
        patch(job.key, { progress: Math.round((d / t) * 100) }),
      );
      patch(job.key, { stage: 3 });
      const empty = pages.filter((p) => p.chars < 20).length;
      const ocrRequired = pages.length > 0 && empty / pages.length > 0.6;
      patch(job.key, { stage: 4 });
      const meta = { document: job.file.name, company: job.company, year: job.year, docType: job.type };
      const chunks = chunkPages(pages, meta);
      const doc: StoredDoc = {
        id: `up-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 6)}`,
        file: job.file.name,
        company: job.company,
        year: job.year,
        type: job.type,
        size: job.file.size,
        uploaded: new Date().toISOString(),
        pageCount: pages.length,
        pages,
        chunks,
        ocrRequired,
        emptyPages: empty,
      };
      patch(job.key, { stage: 5 });
      await saveDoc(doc);
      patch(job.key, { stage: 6, status: "done", result: doc });
    } catch (e) {
      patch(job.key, {
        status: "error",
        error: e instanceof Error ? e.message : "Could not read this PDF",
      });
    }
  };

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDrag(false);
    addFiles(Array.from(e.dataTransfer.files));
  };

  return (
    <AppShell>
      <PageHeader
        title="Analyze Your Financial Report"
        subtitle="Upload PDFs. Text is extracted page by page in your browser, chunked with metadata and saved to your document library."
      />

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <Panel>
            <label
              onDragOver={(e) => {
                e.preventDefault();
                setDrag(true);
              }}
              onDragLeave={() => setDrag(false)}
              onDrop={onDrop}
              className={`flex cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed px-6 py-14 text-center transition-colors ${
                drag ? "border-primary bg-primary/5" : "border-border hover:border-primary/40"
              }`}
            >
              <input
                type="file"
                multiple
                accept="application/pdf,.pdf"
                className="hidden"
                onChange={(e) => {
                  addFiles(Array.from(e.target.files ?? []));
                  e.target.value = "";
                }}
              />
              <UploadCloud className="size-8 text-primary" />
              <p className="mt-3 text-sm font-medium">Drag and drop PDF here</p>
              <p className="mt-1 text-xs text-muted-foreground">
                or click to browse · PDF only · multiple files · max 50 MB each
              </p>
              <div className="mt-4 flex flex-wrap justify-center gap-1.5">
                {docTypes.map((t) => (
                  <span
                    key={t}
                    className="rounded-full border border-border px-2.5 py-0.5 text-[11px] text-muted-foreground"
                  >
                    {t}
                  </span>
                ))}
              </div>
            </label>
            {rejected.length > 0 && (
              <div className="mt-3 space-y-1">
                {rejected.map((r) => (
                  <p key={r} className="flex items-center gap-1.5 text-xs text-destructive">
                    <AlertTriangle className="size-3.5" /> {r}
                  </p>
                ))}
              </div>
            )}
          </Panel>

          {jobs.length > 0 && (
            <Panel title="Processing Queue" subtitle="Confirm details, then process each document">
              <div className="space-y-4">
                {jobs.map((j) => (
                  <div key={j.key} className="rounded-md border border-border bg-surface-2 p-4">
                    <div className="flex items-center gap-2 text-sm">
                      <FileText className="size-3.5 text-muted-foreground" />
                      <span className="font-medium">{j.file.name}</span>
                      <span className="num text-xs text-muted-foreground">
                        {(j.file.size / 1024 / 1024).toFixed(1)} MB
                      </span>
                      <span className="num ml-auto text-xs text-muted-foreground">
                        {j.status === "done" ? "Indexed" : j.status === "error" ? "Failed" : j.status === "processing" ? `${j.progress}%` : "Ready"}
                      </span>
                    </div>

                    <div className="mt-3 grid gap-2 sm:grid-cols-3">
                      <input
                        value={j.company}
                        disabled={j.status === "processing" || j.status === "done"}
                        onChange={(e) => patch(j.key, { company: e.target.value })}
                        placeholder="Company name"
                        className="h-9 rounded-md border border-input bg-surface px-3 text-sm outline-none focus:border-ring/60"
                      />
                      <input
                        value={j.year}
                        disabled={j.status === "processing" || j.status === "done"}
                        onChange={(e) => patch(j.key, { year: e.target.value })}
                        placeholder="Financial year"
                        className="num h-9 rounded-md border border-input bg-surface px-3 text-sm outline-none focus:border-ring/60"
                      />
                      <select
                        value={j.type}
                        disabled={j.status === "processing" || j.status === "done"}
                        onChange={(e) => patch(j.key, { type: e.target.value })}
                        className="h-9 rounded-md border border-input bg-surface px-2 text-sm outline-none"
                      >
                        {docTypes.map((t) => (
                          <option key={t}>{t}</option>
                        ))}
                      </select>
                    </div>

                    {j.status !== "queued" && (
                      <>
                        <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-border">
                          <div
                            className="h-full bg-primary transition-all"
                            style={{ width: `${j.status === "done" ? 100 : Math.max(5, (j.stage / 6) * 100 * 0.4 + j.progress * 0.6)}%` }}
                          />
                        </div>
                        <ol className="mt-3 grid gap-1.5 sm:grid-cols-2">
                          {stages.map((s, i) => {
                            const done = j.stage > i || j.status === "done";
                            const active = j.stage === i && j.status === "processing";
                            return (
                              <li key={s} className="flex items-center gap-2 text-xs">
                                {done ? (
                                  <CheckCircle2 className="size-3.5 text-success" />
                                ) : active ? (
                                  <Loader2 className="size-3.5 animate-spin text-primary" />
                                ) : (
                                  <span className="size-3.5 rounded-full border border-border" />
                                )}
                                <span className={done || active ? "" : "text-muted-foreground"}>{s}</span>
                              </li>
                            );
                          })}
                        </ol>
                      </>
                    )}

                    {j.status === "error" && (
                      <p className="mt-3 text-xs text-destructive">{j.error}</p>
                    )}

                    {(j.status === "queued" || j.status === "error") && (
                      <div className="mt-3 flex gap-2">
                        <button
                          type="button"
                          onClick={() => process(j)}
                          disabled={!j.company.trim() || !j.year.trim()}
                          className="rounded-md bg-primary px-3 py-1.5 text-sm font-medium text-primary-foreground disabled:opacity-50"
                        >
                          {j.status === "error" ? "Retry" : "Process document"}
                        </button>
                        <button
                          type="button"
                          onClick={() => setJobs((js) => js.filter((x) => x.key !== j.key))}
                          className="rounded-md border border-border px-3 py-1.5 text-sm hover:bg-secondary"
                        >
                          Remove
                        </button>
                      </div>
                    )}

                    {j.result && (
                      <div className={`mt-3 rounded-md border p-3 ${j.result.ocrRequired ? "border-warning/40 bg-warning/10" : "border-success/30 bg-success/10"}`}>
                        <p className={`text-sm font-medium ${j.result.ocrRequired ? "text-warning" : "text-success"}`}>
                          {j.result.ocrRequired
                            ? "OCR required — this PDF looks scanned or has no extractable text."
                            : "Document processed successfully."}
                        </p>
                        <p className="num mt-1 text-xs text-muted-foreground">
                          Pages: {j.result.pageCount} · Chunks indexed: {j.result.chunks.length} · Pages without text: {j.result.emptyPages}
                        </p>
                        <Link
                          to="/documents/$id"
                          params={{ id: j.result.id }}
                          className="mt-2 inline-flex items-center gap-1.5 rounded-md bg-primary px-3 py-1.5 text-sm font-medium text-primary-foreground"
                        >
                          Open document workspace <ArrowRight className="size-3.5" />
                        </Link>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </Panel>
          )}

          <Panel title="Processing Pipeline" subtitle="What happens to every uploaded PDF">
            <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
              {[
                ["PDF parser", "Page-accurate parsing of the source file"],
                ["Text extraction", "Reading order preserved per page"],
                ["Table extraction", "Financial tables lifted as structured rows"],
                ["Page segmentation", "Sections mapped to page ranges"],
                ["Chunking", "Semantic chunks sized for retrieval"],
                ["Metadata tagging", "Company · year · page · doc type · section"],
                ["Embedding model", "Vector representation per chunk"],
                ["Vector database", "Similarity index for retrieval"],
                ["LLM + citations", "Evidence-backed structured answers"],
              ].map(([t, b]) => (
                <div key={t} className="rounded-md border border-border bg-surface-2 p-3">
                  <p className="text-xs font-medium">{t}</p>
                  <p className="mt-1 text-xs text-muted-foreground">{b}</p>
                </div>
              ))}
            </div>
          </Panel>
        </div>

        <div className="space-y-6">
          <Panel title="Create a Custom Company" subtitle="For unlisted or document-based entities">
            <div className="space-y-3">
              <Field label="Company name" placeholder="ABC Aerospace Pvt Ltd" />
              <Field label="Industry" placeholder="Defence" />
              <div>
                <p className="mb-1 text-xs text-muted-foreground">Company type</p>
                <select className="h-9 w-full rounded-md border border-input bg-surface-2/60 px-2 text-sm outline-none">
                  <option>Unlisted</option>
                  <option>Private</option>
                  <option>Subsidiary</option>
                </select>
              </div>
              <button
                type="button"
                className="inline-flex w-full items-center justify-center gap-1.5 rounded-md border border-primary/40 bg-primary/10 px-3 py-2 text-sm font-medium text-primary"
              >
                <Plus className="size-3.5" /> Create workspace
              </button>
            </div>
            <div className="mt-4">
              <Notice tone="warning">
                Document-based companies are analysed using user-provided documents only. Live market
                metrics, stock price and exchange information are unavailable and will not be
                generated.
              </Notice>
            </div>
            <Link
              to="/companies/$slug"
              params={{ slug: "example-aerospace" }}
              className="mt-3 inline-block text-xs text-primary"
            >
              See a live example: Example Aerospace Pvt Ltd →
            </Link>
          </Panel>

          <Panel title="Recently Indexed">
            <div className="space-y-2">
              {documents.slice(0, 4).map((d) => (
                <Link
                  key={d.id}
                  to="/documents/$id"
                  params={{ id: d.id }}
                  className="block rounded-md border border-border bg-surface-2 p-3 transition-colors hover:border-primary/40"
                >
                  <p className="text-sm">{d.file}</p>
                  <p className="num mt-1 text-xs text-muted-foreground">
                    {d.pages} pages · {d.tables} tables · {d.uploaded}
                  </p>
                </Link>
              ))}
            </div>
          </Panel>
        </div>
      </div>
    </AppShell>
  );
}

function Field({ label, placeholder }: { label: string; placeholder: string }) {
  return (
    <div>
      <p className="mb-1 text-xs text-muted-foreground">{label}</p>
      <input
        placeholder={placeholder}
        className="h-9 w-full rounded-md border border-input bg-surface-2/60 px-3 text-sm outline-none placeholder:text-muted-foreground focus:border-ring/60"
      />
    </div>
  );
}
