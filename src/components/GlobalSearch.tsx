import { useNavigate } from "@tanstack/react-router";
import { Search, Building2, FileText, Layers } from "lucide-react";
import { useMemo, useRef, useState } from "react";
import { companies, documents, sectors } from "@/data/finsight";

export function GlobalSearch({ autoFocus = false }: { autoFocus?: boolean }) {
  const [q, setQ] = useState("");
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const blurTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const results = useMemo(() => {
    const term = q.trim().toLowerCase();
    if (!term) return { comps: [], docs: [], secs: [] };
    return {
      comps: companies
        .filter((c) =>
          [c.name, c.industry, c.sector, c.ticker ?? ""].join(" ").toLowerCase().includes(term),
        )
        .slice(0, 5),
      docs: documents.filter((d) => d.file.toLowerCase().includes(term)).slice(0, 3),
      secs: sectors.filter((s) => s.name.toLowerCase().includes(term)).slice(0, 3),
    };
  }, [q]);

  const hasResults = results.comps.length + results.docs.length + results.secs.length > 0;

  const go = (fn: () => void) => {
    setQ("");
    setOpen(false);
    fn();
  };

  return (
    <div className="relative w-full max-w-xl">
      <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
      <input
        autoFocus={autoFocus}
        value={q}
        onChange={(e) => {
          setQ(e.target.value);
          setOpen(true);
        }}
        onFocus={() => setOpen(true)}
        onBlur={() => {
          blurTimer.current = setTimeout(() => setOpen(false), 140);
        }}
        placeholder="Search company, sector or financial document..."
        className="h-9 w-full rounded-md border border-input bg-surface-2/60 pl-9 pr-3 text-sm outline-none transition-colors placeholder:text-muted-foreground focus:border-ring/60 focus:ring-2 focus:ring-ring/20"
      />
      {open && q.trim() && (
        <div className="panel absolute left-0 right-0 top-11 z-50 max-h-96 overflow-y-auto p-1.5">
          {!hasResults && (
            <p className="px-3 py-4 text-sm text-muted-foreground">
              No matches in the prototype dataset. Try “Reliance”, “HAL”, “Defence” or “EV”.
            </p>
          )}
          {results.comps.map((c) => (
            <button
              key={c.slug}
              type="button"
              onMouseDown={() =>
                go(() => navigate({ to: "/companies/$slug", params: { slug: c.slug } }))
              }
              className="flex w-full items-center gap-3 rounded-md px-3 py-2 text-left transition-colors hover:bg-secondary"
            >
              <Building2 className="size-4 text-primary" />
              <span className="flex-1">
                <span className="block text-sm font-medium">{c.name}</span>
                <span className="block text-xs text-muted-foreground">
                  {c.industry} · {c.type} · {c.documents.length} documents · {c.latestReport}
                </span>
              </span>
            </button>
          ))}
          {results.secs.map((s) => (
            <button
              key={s.slug}
              type="button"
              onMouseDown={() => go(() => navigate({ to: "/sectors/$slug", params: { slug: s.slug } }))}
              className="flex w-full items-center gap-3 rounded-md px-3 py-2 text-left transition-colors hover:bg-secondary"
            >
              <Layers className="size-4 text-accent" />
              <span className="text-sm">{s.name} sector</span>
            </button>
          ))}
          {results.docs.map((d) => (
            <button
              key={d.id}
              type="button"
              onMouseDown={() => go(() => navigate({ to: "/documents/$id", params: { id: d.id } }))}
              className="flex w-full items-center gap-3 rounded-md px-3 py-2 text-left transition-colors hover:bg-secondary"
            >
              <FileText className="size-4 text-muted-foreground" />
              <span className="flex-1">
                <span className="block text-sm">{d.file}</span>
                <span className="block text-xs text-muted-foreground">
                  {d.type} · {d.pages} pages
                </span>
              </span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
