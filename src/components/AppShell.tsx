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
  Bell,
  Sparkles,
} from "lucide-react";
import type { ReactNode } from "react";
import { GlobalSearch } from "./GlobalSearch";
import { Badge } from "@/components/ui/badge";

const nav = [
  { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/companies", label: "Companies", icon: Building2 },
  { to: "/upload", label: "Upload Report", icon: Upload },
  { to: "/compare", label: "Compare", icon: GitCompareArrows },
  { to: "/sectors", label: "Sector Intelligence", icon: Layers },
  { to: "/documents", label: "My Documents", icon: FileText },
  { to: "/research", label: "Research Workspace", icon: FlaskConical },
  { to: "/reports", label: "Reports", icon: ScrollText },
  { to: "/settings", label: "Settings", icon: Settings },
] as const;

export function Logo({ compact = false }: { compact?: boolean }) {
  return (
    <Link to="/" className="flex items-center gap-2.5">
      <span className="relative flex size-8 items-center justify-center rounded-md bg-primary/15 ring-1 ring-primary/30">
        <svg viewBox="0 0 24 24" className="size-4.5 text-primary" fill="none" strokeWidth="2.2">
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

export function AppShell({ children }: { children: ReactNode }) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-40 border-b border-border bg-background/85 backdrop-blur-xl">
        <div className="mx-auto flex h-14 max-w-[1600px] items-center gap-4 px-4 lg:px-6">
          <Logo />
          <div className="ml-2 hidden flex-1 items-center xl:flex">
            <GlobalSearch />
          </div>
          <div className="ml-auto flex items-center gap-2">
            <Link
              to="/ask"
              className="hidden items-center gap-1.5 rounded-md border border-primary/30 bg-primary/10 px-3 py-1.5 text-xs font-medium text-primary transition-colors hover:bg-primary/15 sm:flex"
            >
              <Sparkles className="size-3.5" /> Ask FinSight
            </Link>
            <button
              type="button"
              aria-label="Notifications"
              className="relative rounded-md p-2 text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
            >
              <Bell className="size-4" />
              <span className="absolute right-1.5 top-1.5 size-1.5 rounded-full bg-primary" />
            </button>
            <div className="flex size-8 items-center justify-center rounded-full bg-secondary text-xs font-semibold">
              SB
            </div>
          </div>
        </div>
        <nav className="mx-auto flex max-w-[1600px] items-center gap-1 overflow-x-auto px-4 pb-0 lg:px-6">
          {nav.map((item) => {
            const active = pathname === item.to || pathname.startsWith(item.to + "/");
            return (
              <Link
                key={item.to}
                to={item.to}
                className={`flex shrink-0 items-center gap-1.5 border-b-2 px-3 py-2.5 text-[13px] font-medium transition-colors ${
                  active
                    ? "border-primary text-foreground"
                    : "border-transparent text-muted-foreground hover:text-foreground"
                }`}
              >
                <item.icon className="size-3.5" />
                {item.label}
              </Link>
            );
          })}
        </nav>
      </header>

      <main className="mx-auto max-w-[1600px] px-4 py-6 lg:px-6">{children}</main>

      <footer className="mt-10 border-t border-border">
        <div className="mx-auto max-w-[1600px] px-4 py-6 lg:px-6">
          <p className="text-xs leading-relaxed text-muted-foreground">
            FinSight is an educational and analytical research platform. Information and AI-generated
            insights are provided for research purposes and should not be considered financial or
            investment advice. All figures shown in this prototype are sample data.
          </p>
        </div>
      </footer>
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
