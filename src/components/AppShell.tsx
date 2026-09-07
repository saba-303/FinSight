import { Link, useRouterState } from "@tanstack/react-router";
import {
  LayoutDashboard,
  Building2,
  Upload,
  GitCompareArrows,
  Layers,
  FileText,
  FlaskConical,
  ScrollText,
  Settings,
  Search,
  Sparkles,
  ShieldAlert,
} from "lucide-react";
import { useState, type ReactNode } from "react";
import { GlobalSearch } from "./GlobalSearch";
import { Badge } from "@/components/ui/badge";

const navGroups = [
  {
    label: "Analyse",
    items: [
      { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
      { to: "/companies", label: "Search / Upload", icon: Search },
      { to: "/ask", label: "Ask AI", icon: Sparkles },
      { to: "/compare", label: "Peer Comparison", icon: GitCompareArrows },
    ],
  },
  {
    label: "Library",
    items: [
      { to: "/documents", label: "Documents", icon: FileText },
      { to: "/sectors", label: "Sectors", icon: Layers },
      { to: "/research", label: "Research", icon: FlaskConical },
      { to: "/reports", label: "Reports", icon: ScrollText },
    ],
  },
  {
    label: "Account",
    items: [{ to: "/settings", label: "Settings", icon: Settings }],
  },
] as const;

export function Logo({ compact = false }: { compact?: boolean }) {
  return (
    <Link to="/" className="flex items-center gap-2.5">
      <span className="relative flex size-8 items-center justify-center rounded-md bg-primary">
        <svg
          viewBox="0 0 24 24"
          className="size-4.5 text-primary-foreground"
          fill="none"
          strokeWidth="2.2"
        >
          <path d="M3 17l5-6 4 4 6-9" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" />
          <circle cx="18" cy="6" r="2" fill="currentColor" stroke="none" />
        </svg>
      </span>
      {!compact && (
        <span className="text-[17px] font-semibold tracking-tight">
          Fin<span className="text-primary">Sight</span>
        </span>
      )}
    </Link>
  );
}

function SidebarNav({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  return (
    <nav className="space-y-6">
      {navGroups.map((group) => (
        <div key={group.label}>
          <p className="px-3 pb-1.5 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
            {group.label}
          </p>
          <ul className="space-y-0.5">
            {group.items.map((item) => {
              const active = pathname === item.to || pathname.startsWith(item.to + "/");
              return (
                <li key={item.to}>
                  <Link
                    to={item.to}
                    onClick={onNavigate}
                    className={`flex items-center gap-2.5 rounded-md px-3 py-2 text-[13px] font-medium transition-colors ${
                      active
                        ? "bg-primary/[0.08] text-primary"
                        : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                    }`}
                  >
                    <item.icon className="size-4" />
                    {item.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      ))}
    </nav>
  );
}

export function AppShell({ children }: { children: ReactNode }) {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background">
      <div className="flex">
        {/* Sidebar */}
        <aside className="sticky top-0 hidden h-screen w-60 shrink-0 flex-col border-r border-border bg-sidebar lg:flex">
          <div className="flex h-14 items-center border-b border-border px-4">
            <Logo />
          </div>
          <div className="flex-1 overflow-y-auto p-3">
            <SidebarNav />
          </div>
          <div className="border-t border-border p-3">
            <div className="rounded-md border border-border bg-surface-2 p-3">
              <div className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
                <ShieldAlert className="size-3.5" /> Prototype
              </div>
              <p className="mt-1.5 text-xs leading-relaxed text-muted-foreground">
                Sample data only. Every figure carries a source citation.
              </p>
            </div>
          </div>
        </aside>

        <div className="min-w-0 flex-1">
          <header className="sticky top-0 z-40 border-b border-border bg-background/90 backdrop-blur-xl">
            <div className="flex h-14 items-center gap-3 px-4 lg:px-6">
              <button
                type="button"
                aria-label="Toggle navigation"
                onClick={() => setMobileOpen((v) => !v)}
                className="rounded-md border border-border p-2 lg:hidden"
              >
                <LayoutDashboard className="size-4" />
              </button>
              <div className="lg:hidden">
                <Logo compact />
              </div>
              <div className="hidden min-w-0 flex-1 md:flex">
                <GlobalSearch />
              </div>
              <div className="ml-auto flex items-center gap-2">
                <Link
                  to="/upload"
                  className="hidden items-center gap-1.5 rounded-md border border-border px-3 py-1.5 text-xs font-medium transition-colors hover:bg-secondary sm:flex"
                >
                  <Upload className="size-3.5" /> Upload
                </Link>
                <Link
                  to="/ask"
                  className="inline-flex items-center gap-1.5 rounded-md bg-primary px-3 py-1.5 text-xs font-medium text-primary-foreground transition-opacity hover:opacity-90"
                >
                  <Sparkles className="size-3.5" /> Ask AI
                </Link>
                <div className="flex size-8 items-center justify-center rounded-full bg-secondary text-xs font-semibold">
                  SB
                </div>
              </div>
            </div>
            {mobileOpen && (
              <div className="border-t border-border p-3 lg:hidden">
                <SidebarNav onNavigate={() => setMobileOpen(false)} />
              </div>
            )}
          </header>

          <main className="mx-auto max-w-[1400px] px-4 py-6 lg:px-8">{children}</main>

          <footer className="mt-10 border-t border-border">
            <div className="mx-auto max-w-[1400px] px-4 py-6 lg:px-8">
              <p className="text-xs leading-relaxed text-muted-foreground">
                FinSight is an educational and analytical research prototype. AI-generated insights are
                provided for research purposes and are not financial or investment advice. All figures
                shown are sample data.
              </p>
            </div>
          </footer>
        </div>
      </div>
    </div>
  );
}

export function PageHeader({
  title,
  subtitle,
  right,
  badge,
}: {
  title: string;
  subtitle?: string;
  right?: ReactNode;
  badge?: string;
}) {
  return (
    <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
      <div>
        <div className="flex items-center gap-2">
          <h1 className="text-2xl font-semibold tracking-tight">{title}</h1>
          {badge && <Badge variant="outline">{badge}</Badge>}
        </div>
        {subtitle && <p className="mt-1 max-w-2xl text-sm text-muted-foreground">{subtitle}</p>}
      </div>
      {right && <div className="flex items-center gap-2">{right}</div>}
    </div>
  );
}

export function SearchIconStub() {
  return <Search className="size-4" />;
}

export { Building2 };
