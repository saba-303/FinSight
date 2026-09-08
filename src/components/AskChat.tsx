import { ArrowUp, FileText, Loader2, Sparkles, User } from "lucide-react";
import { useState } from "react";
import { ProvenanceTag, type ClaimKind } from "./primitives";

export interface Evidence {
  document: string;
  page: number;
  note: string;
  excerpt: string;
}

export interface ChatAnswer {
  question: string;
  answer: string;
  claim: ClaimKind;
  working?: string;
  evidence: Evidence;
}

interface Turn {
  question: string;
  answer: ChatAnswer | null;
}

export function AskChat({ answers }: { answers: ChatAnswer[] }) {
  const [turns, setTurns] = useState<Turn[]>([{ question: answers[0]!.question, answer: answers[0]! }]);
  const [active, setActive] = useState<Evidence | null>(answers[0]!.evidence);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);

  const run = (q: string) => {
    if (!q.trim() || loading) return;
    const term = q.toLowerCase();
    const match =
      answers.find((a) => a.question.toLowerCase() === term) ??
      answers.find((a) =>
        a.question
          .toLowerCase()
          .split(/\s+/)
          .filter((w) => w.length > 4)
          .some((w) => term.includes(w.replace(/[^a-z]/g, ""))),
      ) ??
      null;

    setQuery("");
    setLoading(true);
    setTurns((t) => [...t, { question: q, answer: null }]);
    setTimeout(() => {
      setLoading(false);
      setTurns((t) => t.map((turn, i) => (i === t.length - 1 ? { ...turn, answer: match } : turn)));
      if (match) setActive(match.evidence);
    }, 750);
  };

  return (
    <div className="grid gap-4 lg:grid-cols-[1.6fr_1fr]">
      {/* Conversation */}
      <div className="panel flex min-h-[560px] flex-col">
        <header className="flex items-center gap-2 border-b border-border px-4 py-3">
          <Sparkles className="size-4 text-primary" />
          <h2 className="text-sm font-semibold">Ask AI</h2>
          <span className="text-xs text-muted-foreground">· HAL Annual Report FY2025, 312 pages indexed</span>
        </header>

        <div className="flex-1 space-y-5 overflow-y-auto p-4">
          {turns.map((t, i) => (
            <div key={i} className="space-y-3">
              {/* User */}
              <div className="flex justify-end">
                <div className="flex max-w-[85%] items-start gap-2">
                  <p className="rounded-lg rounded-tr-sm bg-primary px-3.5 py-2 text-sm leading-relaxed text-primary-foreground">
                    {t.question}
                  </p>
                  <span className="mt-0.5 flex size-7 shrink-0 items-center justify-center rounded-full bg-secondary">
                    <User className="size-3.5 text-muted-foreground" />
                  </span>
                </div>
              </div>

              {/* Assistant */}
              <div className="flex items-start gap-2">
                <span className="mt-0.5 flex size-7 shrink-0 items-center justify-center rounded-full bg-primary/10">
                  <Sparkles className="size-3.5 text-primary" />
                </span>
                <div className="max-w-[90%] flex-1">
                  {!t.answer && loading && i === turns.length - 1 && (
                    <p className="flex items-center gap-2 rounded-lg border border-border bg-surface-2 px-3.5 py-2 text-sm text-muted-foreground">
                      <Loader2 className="size-3.5 animate-spin" /> Retrieving evidence…
                    </p>
                  )}
                  {!t.answer && !loading && (
                    <div className="rounded-lg border border-warning/30 bg-warning/[0.07] px-3.5 py-3">
                      <p className="text-sm text-warning">
                        Not enough evidence in the indexed documents to answer that.
                      </p>
                      <p className="mt-1 text-xs text-muted-foreground">
                        FinSight will not generate a figure that is not in the source. Try a suggested
                        question below.
                      </p>
                    </div>
                  )}
                  {t.answer && (
                    <div className="rounded-lg rounded-tl-sm border border-border bg-surface-2 px-3.5 py-3">
                      <ProvenanceTag kind={t.answer.claim} />
                      <p className="mt-2 text-sm leading-relaxed">{t.answer.answer}</p>
                      {t.answer.working && (
                        <p className="num mt-2 rounded border border-border bg-surface px-2.5 py-1.5 text-xs leading-relaxed text-muted-foreground">
                          {t.answer.working}
                        </p>
                      )}
                      <button
                        type="button"
                        onClick={() => setActive(t.answer!.evidence)}
                        className="mt-2.5 inline-flex items-center gap-1 rounded border border-primary/25 bg-primary/[0.06] px-1.5 py-0.5 text-[11px] font-medium text-primary transition-colors hover:border-primary/60"
                      >
                        <FileText className="size-3" />
                        <span className="num">
                          pg. {t.answer.evidence.page}, {t.answer.evidence.note}
                        </span>
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="border-t border-border p-3">
          <div className="flex flex-wrap gap-1.5 pb-2.5">
            {answers.map((a) => (
              <button
                key={a.question}
                type="button"
                onClick={() => run(a.question)}
                className="rounded-full border border-border bg-surface px-2.5 py-1 text-xs text-muted-foreground transition-colors hover:border-primary/40 hover:text-primary"
              >
                {a.question}
              </button>
            ))}
          </div>
          <div className="flex gap-2">
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && run(query)}
              placeholder="Ask about the annual report…"
              className="h-10 flex-1 rounded-md border border-input bg-surface px-3 text-sm outline-none placeholder:text-muted-foreground focus:border-ring focus:ring-2 focus:ring-ring/15"
            />
            <button
              type="button"
              onClick={() => run(query)}
              aria-label="Send question"
              className="inline-flex size-10 items-center justify-center rounded-md bg-primary text-primary-foreground transition-opacity hover:opacity-90"
            >
              <ArrowUp className="size-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Evidence panel */}
      <aside className="panel h-fit lg:sticky lg:top-20">
        <header className="border-b border-border px-4 py-3">
          <h2 className="text-sm font-semibold">Evidence</h2>
          <p className="mt-0.5 text-xs text-muted-foreground">
            The exact passage the answer was grounded in.
          </p>
        </header>
        {active ? (
          <div className="p-4">
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <FileText className="size-3.5 text-primary" />
              <span className="truncate">{active.document}</span>
            </div>
            <p className="num mt-1 text-xs font-medium text-primary">
              Page {active.page} · {active.note}
            </p>

            {/* Simulated page snippet */}
            <div className="mt-3 rounded-md border border-border bg-surface p-3">
              <div className="mb-2 flex items-center justify-between border-b border-border pb-2">
                <span className="text-[10px] uppercase tracking-wider text-muted-foreground">
                  Source page extract
                </span>
                <span className="num text-[10px] text-muted-foreground">p. {active.page}</span>
              </div>
              <p className="text-sm leading-relaxed">
                <mark className="bg-primary/15 text-foreground">{active.excerpt}</mark>
              </p>
              <div className="mt-3 space-y-1.5" aria-hidden>
                {[92, 78, 86, 64].map((w, i) => (
                  <div
                    key={i}
                    className="h-1.5 rounded-full bg-secondary"
                    style={{ width: `${w}%` }}
                  />
                ))}
              </div>
            </div>

            <p className="mt-3 text-xs leading-relaxed text-muted-foreground">
              Citations map to chunk metadata created at index time: company, year, page, document type
              and note reference. The model cannot cite a page it did not retrieve.
            </p>
          </div>
        ) : (
          <p className="p-4 text-sm text-muted-foreground">
            Select a citation to view the grounding passage.
          </p>
        )}
      </aside>
    </div>
  );
}
