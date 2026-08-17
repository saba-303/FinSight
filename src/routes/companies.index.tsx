import { createFileRoute, Link } from "@tanstack/react-router";
import { FileText, ArrowUpRight } from "lucide-react";
import { useMemo, useState } from "react";
import { AppShell, PageHeader } from "@/components/AppShell";
import { CompanyTypeBadge, Notice } from "@/components/primitives";
import { companies } from "@/data/finsight";

export const Route = createFileRoute("/companies/")({
  head: () => ({
    meta: [
      { title: "Companies — Search & Analyse | FinSight" },
      {
        name: "description",
        content:
          "Search supported companies and document-based entities. View industry, company type, indexed documents and the latest available report.",
      },
      { property: "og:title", content: "Company Search — FinSight" },
      {
        property: "og:description",
        content: "Search listed and document-based companies and open a full financial analysis page.",
      },
    ],
  }),
  component: CompaniesPage,
});

const filters = ["All", "Listed", "Unlisted / Document-based"] as const;

function CompaniesPage() {
  const [q, setQ] = useState("");
  const [filter, setFilter] = useState<(typeof filters)[number]>("All");

  const list = useMemo(() => {
    const term = q.trim().toLowerCase();
    return companies.filter((c) => {
      const matchType = filter === "All" || c.type === filter;
      const matchTerm =
        !term ||
        [c.name, c.industry, c.sector, c.ticker ?? ""].join(" ").toLowerCase().includes(term);
      return matchType && matchTerm;
    });
  }, [q, filter]);

  return (
    <AppShell>
      <PageHeader
        title="Companies"
        subtitle="Search company, sector or financial document. Document-based companies are analysed purely from user-provided files."
      />

      <div className="panel mb-5 p-4">
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search company, sector or financial document..."
          className="h-10 w-full rounded-md border border-input bg-surface-2/60 px-3 text-sm outline-none placeholder:text-muted-foreground focus:border-ring/60 focus:ring-2 focus:ring-ring/20"
        />
        <div className="mt-3 flex flex-wrap items-center gap-2">
          {filters.map((f) => (
            <button
              key={f}
              type="button"
              onClick={() => setFilter(f)}
              className={`rounded-full border px-3 py-1 text-xs transition-colors ${
                filter === f
                  ? "border-primary/50 bg-primary/10 text-primary"
                  : "border-border text-muted-foreground hover:text-foreground"
              }`}
            >
              {f}
            </button>
          ))}
          <span className="ml-auto text-xs text-muted-foreground">
            Try: Reliance · HAL · Defence · EV · Banking
          </span>
        </div>
      </div>

      <div className="grid gap-3 lg:grid-cols-2">
        {list.map((c) => (
          <Link
            key={c.slug}
            to="/companies/$slug"
            params={{ slug: c.slug }}
            className="panel group p-5 transition-colors hover:border-primary/40"
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <h2 className="text-base font-semibold">
                  {c.name}{" "}
                  {c.ticker && <span className="num text-xs text-muted-foreground">{c.ticker}</span>}
                </h2>
                <p className="mt-0.5 text-xs text-muted-foreground">
                  {c.industry} · {c.sector} sector
                </p>
              </div>
              <CompanyTypeBadge type={c.type} />
            </div>

            <dl className="mt-4 grid grid-cols-2 gap-3 text-xs">
              <div>
                <dt className="text-muted-foreground">Latest available report</dt>
                <dd className="mt-0.5 font-medium">{c.latestReport}</dd>
              </div>
              <div>
                <dt className="text-muted-foreground">Documents indexed</dt>
                <dd className="mt-0.5 font-medium">{c.documents.length}</dd>
              </div>
            </dl>

            <ul className="mt-3 space-y-1">
              {c.documents.map((d) => (
                <li key={d} className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  <FileText className="size-3" /> {d}
                </li>
              ))}
            </ul>

            <span className="mt-4 inline-flex items-center gap-1 text-sm text-primary">
              Open analysis{" "}
              <ArrowUpRight className="size-3.5 transition-transform group-hover:translate-x-0.5" />
            </span>
          </Link>
        ))}
      </div>

      {list.length === 0 && (
        <div className="panel p-8 text-center">
          <p className="text-sm text-muted-foreground">
            No company matches that search in the prototype dataset.
          </p>
          <Link to="/upload" className="mt-3 inline-block text-sm text-primary">
            Upload documents to create a custom company workspace →
          </Link>
        </div>
      )}

      <div className="mt-5">
        <Notice tone="warning">
          Structured coverage in this prototype is limited to the sample companies above. For any other
          entity, upload documents and FinSight will build a document-based workspace instead of
          fabricating market data.
        </Notice>
      </div>
    </AppShell>
  );
}
