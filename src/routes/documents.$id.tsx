import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { CheckCircle2, FileDown, ArrowLeft } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { Panel, Citation, Notice, ProvenanceTag } from "@/components/primitives";
import { TrendLine } from "@/components/charts";
import { AskFinSight, type CannedAnswer } from "@/components/AskFinSight";
import { cagr, getCompany, getDocument, sliceYears } from "@/data/finsight";

export const Route = createFileRoute("/documents/$id")({
  loader: ({ params }) => {
    const doc = getDocument(params.id);
    if (!doc) throw notFound();
    return { doc };
  },
  head: ({ loaderData }) => {
    if (!loaderData)
      return {
        meta: [{ title: "Document unavailable — FinSight" }, { name: "robots", content: "noindex" }],
      };
    const d = loaderData.doc;
    const title = `${d.company} ${d.type} ${d.year} — Document Analysis | FinSight`;
    const description = `Indexed ${d.type.toLowerCase()} for ${d.company}: ${d.pages} pages, ${d.tables} tables and ${d.sections.length} detected sections, with page-level citations on every answer.`;
    return {
      meta: [
        { title },
        { name: "description", content: description },
        { property: "og:title", content: title },
        { property: "og:description", content: description },
      ],
    };
  },
  component: DocumentPage,
});

function DocumentPage() {
  const { doc } = Route.useLoaderData();
  const company = doc.companySlug ? getCompany(doc.companySlug) : undefined;
  const hist = company ? sliceYears(company.history, 5) : [];
  const revCagr =
    hist.length > 1 ? cagr(hist[0]!.revenue, hist[hist.length - 1]!.revenue, hist.length - 1) : 0;

  const answers: CannedAnswer[] = [
    {
      question: "What were the biggest risks?",
      points: (company?.risks ?? []).slice(0, 3).map((r) => ({
        heading: r.name,
        body: r.evidence,
        page: r.page,
      })),
      interpretation: company?.risks[0]?.interpretation ?? "",
      document: doc.file,
    },
    {
      question: "How has revenue changed over the last five years?",
      intro: hist.map((d) => `${d.year} → ₹${d.revenue.toLocaleString("en-IN")} Cr`).join("  ·  "),
      points: [
        {
          heading: "Reported revenue by year",
          body: hist.map((d) => `${d.year}: ₹${d.revenue.toLocaleString("en-IN")} Cr`).join("; "),
          page: 76,
        },
        {
          heading: "Revenue CAGR",
          body: `${revCagr.toFixed(1)}% compound annual growth over ${hist.length - 1} years, calculated from the reported figures above.`,
          page: 76,
          kind: "calculated",
        },
      ],
      chart:
        hist.length > 0 ? (
          <TrendLine data={hist} keys={[{ key: "revenue", label: "Revenue (₹ Cr)" }]} height={200} />
        ) : null,
      interpretation:
        "Revenue growth has been consistent across the reported periods, with the strongest incremental gain in the most recent year.",
      document: doc.file,
    },
    {
      question: "Summarize the MD&A.",
      points: [
        {
          heading: "Management outlook",
          body: company?.managementQuote.text ?? "No management commentary was found in this document.",
          page: company?.managementQuote.page ?? 1,
        },
        ...(company?.themes.slice(0, 3).map((t) => ({
          heading: t.theme,
          body: t.note,
          page: company.managementQuote.page,
          kind: "interpretation" as const,
        })) ?? []),
      ],
      document: doc.file,
    },
    {
      question: "What was the capital expenditure?",
      points: [
        {
          heading: "Capital expenditure",
          body: "Capital expenditure for the reported year is disclosed in the cash-flow statement under investing activities.",
          page: 112,
        },
      ],
      document: doc.file,
    },
  ];

  return (
    <AppShell>
      <Link
        to="/documents"
        className="mb-4 inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="size-3.5" /> All documents
      </Link>

      <div className="panel mb-6 p-5">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <h1 className="text-xl font-semibold tracking-tight">
              {doc.company} — {doc.type} {doc.year}
            </h1>
            <p className="num mt-1 text-sm text-muted-foreground">
              {doc.file} · Pages: {doc.pages} · Tables detected: {doc.tables}
            </p>
          </div>
          <button
            type="button"
            className="inline-flex items-center gap-1.5 rounded-md border border-border px-3 py-2 text-sm hover:bg-secondary"
          >
            <FileDown className="size-3.5" /> Export analysis
          </button>
        </div>
        <ul className="mt-4 grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
          {["Text extracted", "Tables detected", "Financial sections identified", "Document indexed"].map(
            (s) => (
              <li key={s} className="flex items-center gap-2 text-sm">
                <CheckCircle2 className="size-4 text-success" /> {s}
              </li>
            ),
          )}
        </ul>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <AskFinSight
            scopeLabel={doc.file}
            document={doc.file}
            prompts={[
              "What were the biggest risks?",
              "How has revenue changed over the last five years?",
              "Summarize the MD&A.",
              "What was the capital expenditure?",
            ]}
            answers={answers}
          />

          {company && (
            <Panel title="Extracted Financial Trend" subtitle="Parsed from statement pages · ₹ crore">
              <TrendLine
                data={hist}
                keys={[
                  { key: "revenue", label: "Revenue" },
                  { key: "netProfit", label: "Net Profit" },
                ]}
              />
              <div className="mt-3 flex items-center gap-2">
                <ProvenanceTag kind="calculated" />
                <span className="text-xs text-muted-foreground">
                  Revenue CAGR {revCagr.toFixed(1)}% over {hist.length - 1} years
                </span>
                <Citation doc={doc.file} page={[74, 76]} />
              </div>
            </Panel>
          )}
        </div>

        <div className="space-y-6">
          <Panel title="Detected Sections" subtitle="Mapped to page ranges at index time">
            <ul className="space-y-1.5">
              {doc.sections.map((s, i) => (
                <li
                  key={s}
                  className="flex items-center justify-between rounded-md border border-border bg-surface-2 px-3 py-2 text-sm"
                >
                  {s}
                  <span className="num text-xs text-muted-foreground">
                    p. {i * 24 + 9}–{i * 24 + 32}
                  </span>
                </li>
              ))}
            </ul>
          </Panel>

          {company && (
            <Panel title="Linked Company">
              <Link
                to="/companies/$slug"
                params={{ slug: company.slug }}
                className="block rounded-md border border-border bg-surface-2 p-3 hover:border-primary/40"
              >
                <p className="text-sm font-medium">{company.name}</p>
                <p className="mt-1 text-xs text-muted-foreground">
                  {company.industry} · {company.type}
                </p>
              </Link>
            </Panel>
          )}

          <Notice>
            Processing results shown here are simulated for the prototype. Page numbers reference the
            sample document structure.
          </Notice>
        </div>
      </div>
    </AppShell>
  );
}
