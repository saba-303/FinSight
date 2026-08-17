import { Sparkles, ArrowRight, Loader2 } from "lucide-react";
import { useState } from "react";
import { Citation, ProvenanceTag } from "./primitives";

export interface AnswerPoint {
  heading: string;
  body: string;
  page: number;
  kind?: "reported" | "calculated" | "interpretation";
}

export interface CannedAnswer {
  question: string;
  intro?: string;
  points: AnswerPoint[];
  interpretation?: string;
  document: string;
  chart?: React.ReactNode;
}

export function AskFinSight({
  scopeLabel,
  prompts,
  answers,
  document: docName,
}: {
  scopeLabel: string;
  prompts: string[];
  answers: CannedAnswer[];
  document: string;
}) {
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [answer, setAnswer] = useState<CannedAnswer | null>(null);
  const [notFound, setNotFound] = useState<string | null>(null);

  const run = (q: string) => {
    if (!q.trim()) return;
    setLoading(true);
    setAnswer(null);
    setNotFound(null);
    const term = q.toLowerCase();
    const match =
      answers.find((a) => a.question.toLowerCase() === term) ??
      answers.find((a) =>
        a.question
          .toLowerCase()
          .split(/\s+/)
          .filter((w) => w.length > 4)
          .some((w) => term.includes(w.replace(/[^a-z]/g, ""))),
      );
    setTimeout(() => {
      setLoading(false);
      if (match) setAnswer(match);
      else setNotFound(q);
    }, 700);
  };

  return (
    <div className="panel p-5">
      <header className="mb-4 flex items-center gap-2">
        <Sparkles className="size-4 text-primary" />
        <h2 className="text-sm font-semibold">Ask FinSight</h2>
        <span className="text-xs text-muted-foreground">· {scopeLabel}</span>
      </header>

      <div className="flex gap-2">
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && run(query)}
          placeholder="Ask about this company or document..."
          className="h-10 flex-1 rounded-md border border-input bg-surface-2/60 px-3 text-sm outline-none placeholder:text-muted-foreground focus:border-ring/60 focus:ring-2 focus:ring-ring/20"
        />
        <button
          type="button"
          onClick={() => run(query)}
          className="inline-flex h-10 items-center gap-1.5 rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90"
        >
          {loading ? <Loader2 className="size-4 animate-spin" /> : <ArrowRight className="size-4" />}
          Ask
        </button>
      </div>

      <div className="mt-3 flex flex-wrap gap-1.5">
        {prompts.map((p) => (
          <button
            key={p}
            type="button"
            onClick={() => {
              setQuery(p);
              run(p);
            }}
            className="rounded-full border border-border bg-surface-2 px-3 py-1 text-xs text-muted-foreground transition-colors hover:border-primary/40 hover:text-primary"
          >
            {p}
          </button>
        ))}
      </div>

      {loading && (
        <div className="mt-5 space-y-2 text-xs text-muted-foreground">
          <p className="animate-pulse-soft">Retrieving relevant document chunks…</p>
          <p className="animate-pulse-soft">Ranking evidence by semantic similarity…</p>
          <p className="animate-pulse-soft">Composing structured answer with citations…</p>
        </div>
      )}

      {notFound && !loading && (
        <div className="mt-5 rounded-md border border-warning/30 bg-warning/8 p-4">
          <p className="text-sm text-warning">
            Sufficient evidence for “{notFound}” was not found in the indexed documents.
          </p>
          <p className="mt-1 text-xs text-muted-foreground">
            FinSight answers only from retrieved evidence and will not generate figures that are not
            present in the source documents. Try one of the suggested questions above.
          </p>
        </div>
      )}

      {answer && !loading && (
        <article className="mt-5 space-y-3">
          <h3 className="text-sm font-semibold">{answer.question}</h3>
          {answer.intro && (
            <p className="text-sm leading-relaxed text-muted-foreground">{answer.intro}</p>
          )}
          <ol className="space-y-3">
            {answer.points.map((p, i) => (
              <li key={i} className="rounded-md border border-border bg-surface-2 p-4">
                <div className="flex items-start justify-between gap-3">
                  <h4 className="text-sm font-medium">
                    {i + 1}. {p.heading}
                  </h4>
                  <ProvenanceTag kind={p.kind ?? "reported"} />
                </div>
                <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{p.body}</p>
                <div className="mt-2.5">
                  <Citation doc={answer.document} page={p.page} />
                </div>
              </li>
            ))}
          </ol>
          {answer.chart && <div className="rounded-md border border-border p-4">{answer.chart}</div>}
          {answer.interpretation && (
            <div className="rounded-md border border-warning/30 bg-warning/8 p-4">
              <ProvenanceTag kind="interpretation" />
              <p className="mt-2 text-sm leading-relaxed">{answer.interpretation}</p>
            </div>
          )}
          <div className="rounded-md border border-border p-3">
            <p className="mb-2 text-xs font-medium uppercase tracking-wide text-muted-foreground">
              Sources
            </p>
            <div className="flex flex-wrap gap-1.5">
              {answer.points.map((p, i) => (
                <Citation key={i} doc={answer.document} page={p.page} />
              ))}
            </div>
          </div>
        </article>
      )}

      <p className="mt-4 text-[11px] leading-relaxed text-muted-foreground">
        Answers are grounded in {docName}. AI interpretation is labelled separately from reported
        facts and calculated metrics. Not investment advice.
      </p>
    </div>
  );
}
