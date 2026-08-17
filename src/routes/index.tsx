import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowRight,
  Upload,
  GitCompareArrows,
  Search,
  FileSearch,
  ShieldAlert,
  LineChart,
  Quote,
  Building2,
  Layers,
  BadgeCheck,
} from "lucide-react";
import { Logo } from "@/components/AppShell";
import { companies } from "@/data/finsight";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "FinSight — AI Financial Document Intelligence Platform" },
      {
        name: "description",
        content:
          "FinSight turns 500-page annual reports into evidence-backed financial intelligence: upload reports, analyse companies, compare performance and ask questions with page-level citations.",
      },
      { property: "og:title", content: "FinSight — AI Financial Document Intelligence" },
      {
        property: "og:description",
        content:
          "Upload financial documents, analyse companies, compare performance and get evidence-backed answers with page-level citations.",
      },
    ],
  }),
  component: Landing,
});

const pipeline = [
  "PDF",
  "Parser",
  "Text + Tables",
  "Chunking",
  "Metadata",
  "Embeddings",
  "Vector DB",
  "Retrieval",
  "LLM",
  "Cited Answer",
];

const capabilities = [
  {
    icon: FileSearch,
    title: "Document Intelligence",
    body: "Upload annual reports, quarterlies, investor presentations and ESG reports. FinSight extracts text, tables and financial sections page by page.",
  },
  {
    icon: Building2,
    title: "Company Intelligence",
    body: "Structured snapshots, multi-year financial trends, health scores and management commentary for supported companies.",
  },
  {
    icon: Layers,
    title: "Custom Company Workspaces",
    body: "Create an analysis workspace for unlisted or thinly covered companies purely from documents you provide.",
  },
  {
    icon: GitCompareArrows,
    title: "Comparative Intelligence",
    body: "Compare companies and documents across growth, margins, leverage, returns, risk and strategic outlook.",
  },
  {
    icon: BadgeCheck,
    title: "Evidence-Grounded AI",
    body: "Every document-derived claim carries a source document and page number. Answers are labelled as reported, calculated or interpreted.",
  },
  {
    icon: ShieldAlert,
    title: "Risk & Anomaly Surfacing",
    body: "Risk registers, likelihood/impact matrices and anomaly detection across reporting periods.",
  },
];

function Landing() {
  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-40 border-b border-border bg-background/80 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
          <Logo />
          <nav className="hidden items-center gap-6 text-sm text-muted-foreground md:flex">
            <a href="#capabilities" className="transition-colors hover:text-foreground">
              Capabilities
            </a>
            <a href="#pipeline" className="transition-colors hover:text-foreground">
              How it works
            </a>
            <Link to="/sectors" className="transition-colors hover:text-foreground">
              Sector Intelligence
            </Link>
          </nav>
          <Link
            to="/dashboard"
            className="inline-flex items-center gap-1.5 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90"
          >
            Open Dashboard <ArrowRight className="size-3.5" />
          </Link>
        </div>
      </header>

      {/* HERO */}
      <section className="hero-glow relative overflow-hidden border-b border-border">
        <div className="pointer-events-none absolute inset-0 grid-lines" />
        <BackgroundViz />
        <div className="relative mx-auto max-w-6xl px-4 pb-20 pt-20 text-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-border bg-surface/70 px-3 py-1 text-xs text-muted-foreground">
            <span className="size-1.5 rounded-full bg-primary animate-pulse-soft" />
            Financial document intelligence · prototype with sample data
          </span>
          <h1 className="mx-auto mt-6 max-w-4xl text-balance text-4xl font-semibold leading-[1.08] tracking-tight md:text-6xl">
            Turn 500 Pages of Financial Reports into{" "}
            <span className="text-gradient">Actionable Intelligence.</span>
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-pretty text-base leading-relaxed text-muted-foreground">
            FinSight uses AI-powered financial document analysis to extract financial performance,
            risks, trends, management insights and evidence-backed answers from complex company
            reports.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <Link
              to="/companies"
              className="inline-flex items-center gap-2 rounded-md bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90"
            >
              <Search className="size-4" /> Analyze a Company
            </Link>
            <Link
              to="/upload"
              className="inline-flex items-center gap-2 rounded-md border border-primary/40 bg-primary/10 px-5 py-2.5 text-sm font-medium text-primary transition-colors hover:bg-primary/15"
            >
              <Upload className="size-4" /> Upload a Report
            </Link>
            <Link
              to="/compare"
              className="inline-flex items-center gap-2 rounded-md border border-border bg-surface px-5 py-2.5 text-sm font-medium transition-colors hover:bg-secondary"
            >
              <GitCompareArrows className="size-4" /> Compare Companies
            </Link>
          </div>

          <dl className="mx-auto mt-14 grid max-w-3xl grid-cols-2 gap-px overflow-hidden rounded-lg border border-border bg-border md:grid-cols-4">
            {[
              ["438", "pages in longest indexed report"],
              ["47", "tables detected per report avg."],
              ["100%", "answers carry page citations"],
              ["7", "sample companies in prototype"],
            ].map(([v, l]) => (
              <div key={l} className="bg-surface px-4 py-5">
                <dt className="num text-2xl font-semibold text-primary">{v}</dt>
                <dd className="mt-1 text-xs text-muted-foreground">{l}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      {/* THREE PATHS */}
      <section className="mx-auto max-w-6xl px-4 py-16">
        <h2 className="text-center text-2xl font-semibold tracking-tight">Three ways to start</h2>
        <p className="mx-auto mt-2 max-w-xl text-center text-sm text-muted-foreground">
          Structured company intelligence and user-provided document intelligence in one research
          workflow.
        </p>
        <div className="mt-8 grid gap-4 md:grid-cols-3">
          {[
            {
              n: "01",
              title: "Explore a Company",
              body: "Search Reliance, HAL, TCS, Tata Motors and more. Get snapshots, trends, health scores, risks and management commentary.",
              to: "/companies" as const,
              cta: "Browse companies",
              icon: Search,
            },
            {
              n: "02",
              title: "Upload a Financial Report",
              body: "Annual report, quarterly report, investor presentation, earnings report, ESG report or financial statement — single or multi-document.",
              to: "/upload" as const,
              cta: "Upload documents",
              icon: Upload,
            },
            {
              n: "03",
              title: "Compare Companies",
              body: "Revenue, profitability, growth, margins, debt, cash flow, risks, management commentary and strategic outlook side by side.",
              to: "/compare" as const,
              cta: "Open comparison",
              icon: GitCompareArrows,
            },
          ].map((c) => (
            <Link key={c.n} to={c.to} className="panel group flex flex-col p-6 transition-colors hover:border-primary/40">
              <div className="flex items-center justify-between">
                <c.icon className="size-5 text-primary" />
                <span className="num text-xs text-muted-foreground">{c.n}</span>
              </div>
              <h3 className="mt-4 text-base font-semibold">{c.title}</h3>
              <p className="mt-2 flex-1 text-sm leading-relaxed text-muted-foreground">{c.body}</p>
              <span className="mt-4 inline-flex items-center gap-1 text-sm text-primary">
                {c.cta}{" "}
                <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-0.5" />
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* CAPABILITIES */}
      <section id="capabilities" className="border-y border-border bg-surface/40">
        <div className="mx-auto max-w-6xl px-4 py-16">
          <h2 className="text-2xl font-semibold tracking-tight">Five capabilities, one workflow</h2>
          <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
            The differentiation is the combination: structured company analysis and document-grounded
            AI in a single research workspace.
          </p>
          <div className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {capabilities.map((c) => (
              <div key={c.title} className="panel p-5">
                <c.icon className="size-5 text-primary" />
                <h3 className="mt-3 text-sm font-semibold">{c.title}</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{c.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PIPELINE */}
      <section id="pipeline" className="mx-auto max-w-6xl px-4 py-16">
        <h2 className="text-2xl font-semibold tracking-tight">From PDF to cited answer</h2>
        <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
          A retrieval-augmented pipeline. The model answers only from retrieved evidence; when
          evidence is insufficient, FinSight says so instead of guessing.
        </p>
        <div className="mt-8 flex flex-wrap items-center gap-2">
          {pipeline.map((s, i) => (
            <div key={s} className="flex items-center gap-2">
              <span className="rounded-md border border-border bg-surface px-3 py-2 text-xs font-medium">
                {s}
              </span>
              {i < pipeline.length - 1 && <ArrowRight className="size-3 text-muted-foreground" />}
            </div>
          ))}
        </div>
        <div className="mt-8 grid gap-4 md:grid-cols-3">
          {[
            {
              t: "Never invents numbers",
              b: "Ratios and growth rates are computed programmatically from extracted statement lines. The model explains results, it does not perform the arithmetic.",
            },
            {
              t: "Never invents pages",
              b: "Citations map to the chunk metadata created at index time: company, year, page number, document type and section.",
            },
            {
              t: "Separates fact from opinion",
              b: "Every output is labelled Reported Fact, Calculated Metric or AI Interpretation so you always know what you are reading.",
            },
          ].map((x) => (
            <div key={x.t} className="panel p-5">
              <h3 className="text-sm font-semibold">{x.t}</h3>
              <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{x.b}</p>
            </div>
          ))}
        </div>
      </section>

      {/* COVERAGE */}
      <section className="border-y border-border bg-surface/40">
        <div className="mx-auto max-w-6xl px-4 py-16">
          <h2 className="text-2xl font-semibold tracking-tight">Sample coverage in this prototype</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            All figures are sample data for demonstration. No live market data is used.
          </p>
          <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {companies.map((c) => (
              <Link
                key={c.slug}
                to="/companies/$slug"
                params={{ slug: c.slug }}
                className="panel p-4 transition-colors hover:border-primary/40"
              >
                <p className="text-sm font-medium">{c.name}</p>
                <p className="mt-1 text-xs text-muted-foreground">
                  {c.industry} · {c.type}
                </p>
                <p className="mt-3 text-xs text-primary">{c.documents.length} documents indexed</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* STATEMENT */}
      <section className="mx-auto max-w-4xl px-4 py-20 text-center">
        <Quote className="mx-auto size-6 text-primary" />
        <p className="mt-5 text-balance text-xl leading-relaxed md:text-2xl">
          FinSight transforms complex financial documents into structured, visual and evidence-backed
          financial intelligence — a research assistant and analytical workspace, not a stock screener
          and not a chatbot.
        </p>
        <div className="mt-8 flex justify-center gap-3">
          <Link
            to="/dashboard"
            className="inline-flex items-center gap-2 rounded-md bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90"
          >
            <LineChart className="size-4" /> Enter the workspace
          </Link>
        </div>
      </section>

      <footer className="border-t border-border">
        <div className="mx-auto max-w-6xl px-4 py-8">
          <Logo />
          <p className="mt-4 max-w-3xl text-xs leading-relaxed text-muted-foreground">
            FinSight is an educational and analytical research platform. Information and AI-generated
            insights are provided for research purposes and should not be considered financial or
            investment advice. This prototype uses mock data; it does not display live stock prices,
            market capitalisation or exchange information.
          </p>
        </div>
      </footer>
    </div>
  );
}

function BackgroundViz() {
  const series = [22, 38, 30, 52, 44, 68, 58, 82, 74, 96];
  const pts = series
    .map((v, i) => `${(i / (series.length - 1)) * 100},${100 - v}`)
    .join(" ");
  return (
    <svg
      aria-hidden
      viewBox="0 0 100 100"
      preserveAspectRatio="none"
      className="pointer-events-none absolute inset-x-0 bottom-0 h-56 w-full opacity-[0.5]"
    >
      <defs>
        <linearGradient id="hero-area" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="var(--color-chart-1)" stopOpacity="0.22" />
          <stop offset="100%" stopColor="var(--color-chart-1)" stopOpacity="0" />
        </linearGradient>
      </defs>
      <polygon points={`0,100 ${pts} 100,100`} fill="url(#hero-area)" />
      <polyline
        points={pts}
        fill="none"
        stroke="var(--color-chart-1)"
        strokeWidth="0.5"
        vectorEffect="non-scaling-stroke"
      />
      <polyline
        points={series.map((v, i) => `${(i / (series.length - 1)) * 100},${100 - v * 0.68}`).join(" ")}
        fill="none"
        stroke="var(--color-chart-2)"
        strokeWidth="0.5"
        vectorEffect="non-scaling-stroke"
        className="animate-dash"
      />
    </svg>
  );
}
