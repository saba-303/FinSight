import { createFileRoute, Link } from "@tanstack/react-router";
import { UploadCloud, FileText, CheckCircle2, Loader2, Plus, ArrowRight } from "lucide-react";
import { useState } from "react";
import { AppShell, PageHeader } from "@/components/AppShell";
import { Panel, Notice } from "@/components/primitives";
import { documents } from "@/data/finsight";

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
  "Identifying tables",
  "Segmenting pages",
  "Indexing document",
  "Generating embeddings",
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

function UploadPage() {
  const [files, setFiles] = useState<string[]>([]);
  const [stage, setStage] = useState(-1);
  const [drag, setDrag] = useState(false);

  const startDemo = (names: string[]) => {
    setFiles(names);
    setStage(0);
    names.forEach(() => {});
    stages.forEach((_, i) => setTimeout(() => setStage(i), (i + 1) * 650));
  };

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDrag(false);
    const names = Array.from(e.dataTransfer.files).map((f) => f.name);
    startDemo(names.length ? names : ["HAL_Annual_Report_2025.pdf"]);
  };

  return (
    <AppShell>
      <PageHeader
        title="Analyze Your Financial Report"
        subtitle="Upload one or more PDFs. Processing is simulated in this prototype — the pipeline below mirrors the production architecture."
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
                accept="application/pdf"
                className="hidden"
                onChange={(e) => {
                  const names = Array.from(e.target.files ?? []).map((f) => f.name);
                  startDemo(names.length ? names : ["HAL_Annual_Report_2025.pdf"]);
                }}
              />
              <UploadCloud className="size-8 text-primary" />
              <p className="mt-3 text-sm font-medium">Drag and drop PDF here</p>
              <p className="mt-1 text-xs text-muted-foreground">
                or click to browse · multiple files supported · max 50 MB each
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

            <div className="mt-4 flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={() =>
                  startDemo([
                    "HAL_Annual_Report_2025.pdf",
                    "HAL_Annual_Report_2024.pdf",
                    "HAL_Investor_Presentation_2025.pdf",
                  ])
                }
                className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90"
              >
                Run sample multi-document upload
              </button>
              <span className="text-xs text-muted-foreground">
                Loads three HAL documents to demonstrate multi-year analysis.
              </span>
            </div>
          </Panel>

          {files.length > 0 && (
            <Panel title="Processing Queue" subtitle="Per-document extraction and indexing">
              <ul className="mb-5 space-y-2">
                {files.map((f) => (
                  <li
                    key={f}
                    className="flex items-center gap-2 rounded-md border border-border bg-surface-2 px-3 py-2 text-sm"
                  >
                    <FileText className="size-3.5 text-muted-foreground" />
                    {f}
                    <span className="num ml-auto text-xs text-muted-foreground">
                      {stage >= stages.length - 1 ? "Indexed" : "Processing"}
                    </span>
                  </li>
                ))}
              </ul>

              <ol className="space-y-2">
                {stages.map((s, i) => {
                  const done = stage > i;
                  const active = stage === i;
                  return (
                    <li key={s} className="flex items-center gap-3 text-sm">
                      {done ? (
                        <CheckCircle2 className="size-4 text-success" />
                      ) : active ? (
                        <Loader2 className="size-4 animate-spin text-primary" />
                      ) : (
                        <span className="size-4 rounded-full border border-border" />
                      )}
                      <span className={done || active ? "" : "text-muted-foreground"}>{s}</span>
                      {done && <span className="num ml-auto text-xs text-success">done</span>}
                    </li>
                  );
                })}
              </ol>

              {stage >= stages.length - 1 && (
                <div className="mt-5 rounded-md border border-success/30 bg-success/8 p-4">
                  <p className="text-sm font-medium text-success">Document processed successfully.</p>
                  <p className="num mt-1 text-xs text-muted-foreground">
                    Pages: 312 · Tables detected: 47 · Financial sections detected: 12
                  </p>
                  <Link
                    to="/documents/$id"
                    params={{ id: "hal-ar-2025" }}
                    className="mt-3 inline-flex items-center gap-1.5 rounded-md bg-primary px-3 py-2 text-sm font-medium text-primary-foreground"
                  >
                    Open document workspace <ArrowRight className="size-3.5" />
                  </Link>
                </div>
              )}
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
