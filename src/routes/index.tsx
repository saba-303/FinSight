import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Upload, Search, ScanSearch, BadgeCheck, AlertTriangle } from "lucide-react";
import { Logo } from "@/components/AppShell";
import { Citation, ProvenanceTag } from "@/components/primitives";
import { anomalies, companies } from "@/data/finsight";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "FinSight — Every Claim in an Annual Report, Checked" },
      {
        name: "description",
        content:
          "FinSight cross-checks every claim in an annual report against the reported numbers, flags anomalies and answers questions with page-level source citations.",
      },
      { property: "og:title", content: "FinSight — Evidence-Backed Annual Report Analysis" },
      {
        property: "og:description",
        content:
          "Upload a report, get anomaly flags and answers where every number carries a page citation.",
      },
    ],
  }),
  component: Landing,
});

const steps = [
  {
    n: "01",
    icon: Upload,
    title: "Upload or select a company",
    body: "Drop an annual report PDF, or start from a pre-loaded demo company with real reported figures.",
  },
  {
    n: "02",
    icon: ScanSearch,
    title: "FinSight extracts and cross-checks",
    body: "Statements and notes are parsed page by page. Ratios are computed programmatically, then narrative claims are tested against those numbers.",
  },
  {
    n: "03",
    icon: BadgeCheck,
    title: "Get evidence-backed answers",
    body: "Every anomaly and every answer carries a claim type — Fact, Calculation or Inference — and a clickable page citation.",
  },
];

function Landing() {
  const demo = anomalies[0]!;

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-40 border-b border-border bg-background/90 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
          <Logo />
          <nav className="hidden items-center gap-6 text-sm text-muted-foreground md:flex">
            <a href="#how" className="transition-colors hover:text-foreground">
              How it works
            </a>
            <a href="#evidence" className="transition-colors hover:text-foreground">
              Evidence model
            </a>
            <Link to="/dashboard" className="transition-colors hover:text-foreground">
              Dashboard
            </Link>
          </nav>
          <Link
            to="/companies/$slug"
            params={{ slug: "hal" }}
            className="inline-flex items-center gap-1.5 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90"
          >
            Try a sample company <ArrowRight className="size-3.5" />
          </Link>
        </div>
      </header>

      {/* HERO */}
      <section className="hero-glow border-b border-border">
        <div className="mx-auto grid max-w-6xl gap-10 px-4 py-16 lg:grid-cols-[1.05fr_1fr] lg:items-center lg:py-20">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full border border-border bg-surface px-3 py-1 text-xs text-muted-foreground">
              <span className="size-1.5 rounded-full bg-primary" />
              Annual report intelligence · prototype with sample data
            </span>
            <h1 className="mt-5 text-balance text-4xl font-semibold leading-[1.1] tracking-tight md:text-5xl">
              Every claim in an annual report, checked against the numbers.
            </h1>
            <p className="mt-5 max-w-xl text-pretty text-base leading-relaxed text-muted-foreground">
              FinSight reads the statements and the narrative, computes the ratios itself, and flags
              where the two disagree. Every figure it shows you links back to the page it came from.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Link
                to="/companies/$slug"
                params={{ slug: "hal" }}
                className="inline-flex items-center gap-2 rounded-md bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90"
              >
                <Search className="size-4" /> Try a sample company
              </Link>
              <Link
                to="/upload"
                className="inline-flex items-center gap-2 rounded-md border border-border bg-surface px-5 py-2.5 text-sm font-medium transition-colors hover:bg-secondary"
              >
                <Upload className="size-4" /> Upload a report
              </Link>
            </div>
            <dl className="mt-10 grid max-w-lg grid-cols-3 gap-px overflow-hidden rounded-lg border border-border bg-border">
              {[
                ["312", "pages parsed in the demo report"],
                ["6", "anomalies flagged"],
                ["100%", "answers carry a page citation"],
              ].map(([v, l]) => (
                <div key={l} className="bg-surface px-4 py-4">
                  <dt className="num text-xl font-semibold text-primary">{v}</dt>
                  <dd className="mt-1 text-xs leading-snug text-muted-foreground">{l}</dd>
                </div>
              ))}
            </dl>
          </div>

          {/* Live-feeling demo: a real anomaly card */}
          <div className="panel p-5">
            <div className="flex items-center justify-between">
              <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                Live anomaly flag
              </p>
              <span className="inline-flex items-center gap-1 rounded border border-destructive/30 bg-destructive/10 px-2 py-0.5 text-[11px] font-semibold text-destructive">
                <AlertTriangle className="size-3" /> High
              </span>
            </div>
            <h2 className="mt-3 text-base font-semibold leading-snug">{demo.title}</h2>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{demo.explanation}</p>

            <div className="mt-4 rounded-md border border-border bg-surface-2 p-3">
              <div className="flex items-center gap-2">
                <ProvenanceTag kind={demo.claim} />
                <span className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
                  The check
                </span>
              </div>
              <p className="num mt-2 text-sm leading-relaxed">{demo.check}</p>
            </div>

            <div className="mt-4">
              <p className="mb-1.5 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                Evidence
              </p>
              <blockquote className="border-l-2 border-primary/40 pl-3 text-sm italic leading-relaxed text-muted-foreground">
                “{demo.excerpt}”
              </blockquote>
              <div className="mt-2.5">
                <Citation doc={demo.document} page={demo.page} note={demo.note} />
              </div>
            </div>

            <Link
              to="/companies/$slug"
              params={{ slug: demo.companySlug }}
              className="mt-5 inline-flex items-center gap-1.5 text-sm font-medium text-primary"
            >
              Open the full company dashboard <ArrowRight className="size-3.5" />
            </Link>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section id="how" className="mx-auto max-w-6xl px-4 py-16">
        <h2 className="text-2xl font-semibold tracking-tight">How it works</h2>
        <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
          Three steps from a 300-page PDF to a checkable answer.
        </p>
        <div className="mt-8 grid gap-4 md:grid-cols-3">
          {steps.map((s) => (
            <div key={s.n} className="panel p-5">
              <div className="flex items-center justify-between">
                <s.icon className="size-5 text-primary" />
                <span className="num text-xs text-muted-foreground">{s.n}</span>
              </div>
              <h3 className="mt-4 text-base font-semibold">{s.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{s.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* EVIDENCE MODEL */}
      <section id="evidence" className="border-y border-border bg-surface">
        <div className="mx-auto max-w-6xl px-4 py-16">
          <h2 className="text-2xl font-semibold tracking-tight">
            Three claim types, so you always know what you are reading
          </h2>
          <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
            The model never performs the arithmetic and never invents a page number.
          </p>
          <div className="mt-8 grid gap-4 md:grid-cols-3">
            {(
              [
                [
                  "reported",
                  "Read verbatim from the document",
                  "Revenue of ₹30,381 crore for FY2025.",
                ],
                [
                  "calculated",
                  "Computed programmatically from extracted lines",
                  "Operating margin 24.7%, computed as EBITDA ÷ revenue.",
                ],
                [
                  "interpretation",
                  "Model reasoning, never a number",
                  "Margin expansion appears mix-driven rather than volume-led.",
                ],
              ] as const
            ).map(([kind, desc, example]) => (
              <div key={kind} className="panel p-5">
                <ProvenanceTag kind={kind} />
                <p className="mt-3 text-sm font-medium">{desc}</p>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{example}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SAMPLE COMPANIES */}
      <section className="mx-auto max-w-6xl px-4 py-16">
        <h2 className="text-2xl font-semibold tracking-tight">Sample companies in this prototype</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          Pre-loaded with reported figures so the demo works without signing in.
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
              <p className="num mt-3 text-xs text-primary">
                {c.documents.length} documents indexed
              </p>
            </Link>
          ))}
        </div>
      </section>

      <footer className="border-t border-border bg-surface">
        <div className="mx-auto max-w-6xl px-4 py-8">
          <Logo />
          <p className="mt-4 max-w-3xl text-xs leading-relaxed text-muted-foreground">
            FinSight is an educational and analytical research prototype. AI-generated insights are for
            research purposes and are not financial or investment advice. This prototype uses sample
            data; it does not display live stock prices or exchange information.
          </p>
        </div>
      </footer>
    </div>
  );
}
