import { createFileRoute, Link } from "@tanstack/react-router";
import {
  Upload,
  FileSearch,
  ScanSearch,
  Quote,
  AlertTriangle,
  GitCompareArrows,
  Sparkles,
  FileText,
  ArrowRight,
} from "lucide-react";
import { Logo } from "@/components/AppShell";
import { ProvenanceTag } from "@/components/primitives";
import { companies } from "@/data/finsight";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "FinSight — Understand the Numbers. Uncover the Story." },
      {
        name: "description",
        content:
          "FinSight turns lengthy financial reports into clear insights — explore company performance, discover unusual trends, and trace every answer back to its source.",
      },
      { property: "og:title", content: "FinSight — Understand the Numbers. Uncover the Story." },
      {
        property: "og:description",
        content:
          "Turn lengthy financial reports into clear insights. Explore company performance, discover unusual trends, and trace every answer back to its source.",
      },
    ],
  }),
  component: Landing,
});

function Sparkline({ down = false }: { down?: boolean }) {
  return (
    <svg viewBox="0 0 64 20" className="h-5 w-16" fill="none" aria-hidden>
      <polyline
        points="0,16 10,13 20,14 30,10 40,11 50,6 64,3"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        className={down ? "text-destructive" : "text-success"}
      />
    </svg>
  );
}

function HeroVisual() {
  return (
    <div className="relative mx-auto w-full max-w-md py-6">
      {/* thin connecting lines */}
      <span className="absolute left-2 top-16 hidden h-px w-20 bg-border lg:block" aria-hidden />
      <span className="absolute right-0 top-1/2 hidden h-px w-16 bg-border lg:block" aria-hidden />
      <span className="absolute bottom-16 left-6 hidden h-px w-14 bg-border lg:block" aria-hidden />

      {/* document preview */}
      <div className="panel relative mx-auto max-w-[300px] p-5">
        <div className="flex items-center justify-between border-b border-border pb-3">
          <div className="flex items-center gap-2">
            <FileText className="size-4 text-primary" />
            <p className="text-xs font-medium">Annual Report FY2025</p>
          </div>
          <span className="num text-[11px] text-muted-foreground">312 pages</span>
        </div>

        {/* stylised page text */}
        <div className="mt-4 space-y-2.5" aria-hidden>
          <div className="h-2 w-full rounded-full bg-surface-2" />
          <div className="h-2 w-[92%] rounded-full bg-surface-2" />
          <div className="h-2 w-[64%] rounded-full bg-surface-2" />
          <div className="h-2 w-full rounded-full bg-surface-2" />
          <div className="h-2 w-[85%] rounded-full bg-destructive/25" />
          <div className="h-2 w-[55%] rounded-full bg-destructive/25" />
          <div className="h-2 w-full rounded-full bg-surface-2" />
          <div className="h-2 w-[78%] rounded-full bg-surface-2" />
        </div>

        <div className="mt-5 flex items-center justify-between border-t border-border pt-3">
          <span className="text-[11px] text-muted-foreground">Extracted & cross-checked</span>
          <span className="num rounded border border-border bg-surface-2 px-2 py-0.5 text-[11px] text-muted-foreground">
            pg. 87, note 14
          </span>
        </div>
      </div>

      {/* floating insight card — revenue trend */}
      <div className="panel absolute -top-2 right-0 hidden w-44 p-3 md:block">
        <p className="text-[11px] font-medium text-muted-foreground">Revenue trend</p>
        <div className="mt-1.5 flex items-baseline gap-2">
          <span className="num text-sm font-semibold">₹30,381 Cr</span>
          <span className="num text-[11px] font-medium text-success">+12.4%</span>
        </div>
        <Sparkline />
      </div>

      {/* floating insight card — anomaly */}
      <div className="panel absolute left-0 top-1/3 hidden w-48 p-3 md:block">
        <div className="flex items-center gap-1.5">
          <AlertTriangle className="size-3.5 text-destructive" />
          <p className="text-[11px] font-semibold text-destructive">Anomaly flagged</p>
        </div>
        <p className="mt-1.5 text-xs leading-snug">
          Receivables grew <span className="num font-semibold">3.8×</span> faster than revenue.
        </p>
      </div>

      {/* floating insight card — evidence */}
      <div className="panel absolute bottom-2 right-2 hidden w-48 p-3 md:block">
        <p className="text-[11px] font-medium text-muted-foreground">Source-linked evidence</p>
        <p className="mt-1.5 text-xs leading-snug text-muted-foreground">
          “Operating margin expanded to 24.7%…”
        </p>
        <div className="mt-2">
          <ProvenanceTag kind="calculated" />
        </div>
      </div>
    </div>
  );
}

const benefits = [
  {
    icon: FileSearch,
    title: "Analyze Reports",
    body: "Extract useful information from lengthy financial documents — statements, notes and narrative, page by page.",
  },
  {
    icon: ScanSearch,
    title: "Discover Anomalies",
    body: "Identify unusual financial trends and discrepancies, each tied to a specific, checkable number.",
  },
  {
    icon: Quote,
    title: "Verify with Evidence",
    body: "Trace every insight back to its supporting source — a page and note citation you can open yourself.",
  },
];

const steps = [
  {
    n: "01",
    icon: Upload,
    title: "Upload or select a company",
    body: "Drop an annual report PDF, or start from a pre-loaded sample company with real reported figures.",
  },
  {
    n: "02",
    icon: ScanSearch,
    title: "FinSight extracts and cross-checks",
    body: "Statements and notes are parsed page by page. Ratios are computed programmatically, then narrative claims are tested against those numbers.",
  },
  {
    n: "03",
    icon: Quote,
    title: "Get evidence-backed answers",
    body: "Every anomaly and every answer carries a claim type — Fact, Calculation or Inference — and a clickable page citation.",
  },
];

const features = [
  {
    icon: Quote,
    title: "Page-level citations",
    body: "Every figure links back to the exact page and note it came from. Click any source tag to jump there.",
  },
  {
    icon: ScanSearch,
    title: "Programmatic checks",
    body: "Ratios are computed from the extracted numbers, so flags point at arithmetic you can re-run yourself.",
  },
  {
    icon: Sparkles,
    title: "Ask with grounding",
    body: "Ask questions in plain language; answers classify themselves as Fact, Calculation or Inference.",
  },
  {
    icon: GitCompareArrows,
    title: "Peer comparison",
    body: "Set a company against its peers on the same ratios, with the same citation discipline.",
  },
];

function Landing() {
  return (
    <div className="min-h-screen bg-background">
      {/* NAV */}
      <header className="sticky top-0 z-40 border-b border-border bg-background/90 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
          <Logo />
          <nav className="hidden items-center gap-7 text-sm text-muted-foreground md:flex">
            <a href="#how" className="transition-colors hover:text-foreground">
              How It Works
            </a>
            <a href="#features" className="transition-colors hover:text-foreground">
              Features
            </a>
            <Link to="/dashboard" className="transition-colors hover:text-foreground">
              Dashboard
            </Link>
          </nav>
          <Link
            to="/upload"
            className="inline-flex items-center gap-1.5 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90"
          >
            <Upload className="size-3.5" /> Upload Annual Report
          </Link>
        </div>
      </header>

      {/* HERO */}
      <section className="hero-glow border-b border-border">
        <div className="mx-auto grid max-w-6xl gap-12 px-4 py-16 lg:grid-cols-[1.1fr_1fr] lg:items-center lg:py-24">
          <div>
            <h1 className="text-balance text-4xl font-semibold leading-[1.1] tracking-tight md:text-5xl">
              Understand the numbers.{" "}
              <span className="text-primary">Uncover the story.</span>
            </h1>
            <p className="mt-5 max-w-xl text-pretty text-base leading-relaxed text-muted-foreground">
              Turn lengthy financial reports into clear insights. Explore company performance,
              discover unusual trends, and trace every answer back to its source.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Link
                to="/upload"
                className="inline-flex items-center gap-2 rounded-md bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90"
              >
                <Upload className="size-4" /> Upload Annual Report
              </Link>
              <Link
                to="/companies/$slug"
                params={{ slug: "hal" }}
                className="inline-flex items-center gap-2 rounded-md border border-border bg-surface px-5 py-2.5 text-sm font-medium transition-colors hover:bg-secondary"
              >
                Explore Sample Report <ArrowRight className="size-4" />
              </Link>
            </div>
            <p className="mt-5 text-xs text-muted-foreground">
              Prototype with sample data — no sign-in needed.
            </p>
          </div>

          <HeroVisual />
        </div>
      </section>

      {/* BENEFITS */}
      <section className="mx-auto max-w-6xl px-4 py-16">
        <div className="grid gap-4 md:grid-cols-3">
          {benefits.map((b) => (
            <div key={b.title} className="panel p-6">
              <b.icon className="size-5 text-primary" />
              <h3 className="mt-4 text-base font-semibold">{b.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{b.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section id="how" className="border-y border-border bg-surface">
        <div className="mx-auto max-w-6xl px-4 py-16">
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
        </div>
      </section>

      {/* FEATURES */}
      <section id="features" className="mx-auto max-w-6xl px-4 py-16">
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

        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((f) => (
            <div key={f.title} className="panel p-5">
              <f.icon className="size-5 text-primary" />
              <h3 className="mt-3 text-sm font-semibold">{f.title}</h3>
              <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{f.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* SAMPLE COMPANIES */}
      <section className="border-y border-border bg-surface">
        <div className="mx-auto max-w-6xl px-4 py-16">
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
        </div>
      </section>

      <footer className="border-t border-border bg-surface">
        <div className="mx-auto max-w-6xl px-4 py-8">
          <Logo />
          <p className="mt-4 max-w-3xl text-xs leading-relaxed text-muted-foreground">
            FinSight is an educational and analytical research prototype. AI-generated insights are
            for research purposes and are not financial or investment advice. This prototype uses
            sample data; it does not display live stock prices or exchange information.
          </p>
        </div>
      </footer>
    </div>
  );
}
