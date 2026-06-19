import { Link, useRouterState, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Logo } from "./Logo";
import { supabase } from "@/integrations/supabase/client";
import { useAuth, useUserRole } from "@/hooks/useAuth";

const NAV = [
  { to: "/dashboard", label: "Overview" },
  { to: "/submit", label: "Submit price" },
  { to: "/prices", label: "All prices" },
];

export function DashboardShell({ children }: { children: React.ReactNode }) {
  const path = useRouterState({ select: (s) => s.location.pathname });
  const [open, setOpen] = useState(false);
  const { user, loading } = useAuth();
  const role = useUserRole();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !user) navigate({ to: "/auth", search: { redirect: path } });
  }, [user, loading, navigate, path]);

  if (loading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center text-sm text-muted-foreground">
        Loading…
      </div>
    );
  }

  return (
    <div className="min-h-screen flex">
      {open && (
        <div className="fixed inset-0 bg-black/40 z-40 md:hidden" onClick={() => setOpen(false)} />
      )}
      <aside
        className={`fixed md:static inset-y-0 left-0 w-64 bg-sidebar text-sidebar-foreground z-50 transform transition-transform duration-300 ${open ? "translate-x-0" : "-translate-x-full md:translate-x-0"}`}
      >
        <div className="px-6 py-6 border-b border-sidebar-border">
          <Link to="/">
            <Logo className="h-7 w-auto" invert />
          </Link>
        </div>
        <nav className="py-4">
          {NAV.map((n) => {
            const active = path === n.to;
            return (
              <Link
                key={n.to}
                to={n.to}
                onClick={() => setOpen(false)}
                className={`block px-6 py-3 text-sm transition-colors duration-150 border-l-2 ${active ? "border-gold text-gold" : "border-transparent text-sidebar-foreground/80 hover:text-sidebar-foreground"}`}
              >
                {n.label}
              </Link>
            );
          })}
          {role === "admin" && (
            <Link
              to="/admin"
              onClick={() => setOpen(false)}
              className={`block px-6 py-3 text-sm transition-colors duration-150 border-l-2 ${path === "/admin" ? "border-gold text-gold" : "border-transparent text-sidebar-foreground/80 hover:text-sidebar-foreground"}`}
            >
              Admin
            </Link>
          )}
        </nav>
        <div className="absolute bottom-0 inset-x-0 px-6 py-5 border-t border-sidebar-border text-xs text-sidebar-foreground/70">
          <div className="truncate">{user.email}</div>
          <button
            onClick={() => supabase.auth.signOut().then(() => navigate({ to: "/" }))}
            className="mt-2 text-gold hover:underline"
          >
            Sign out
          </button>
        </div>
      </aside>
      <div className="flex-1 flex flex-col min-w-0">
        <header className="md:hidden flex items-center justify-between px-6 py-3 border-b border-border bg-background sticky top-0 z-30">
          <div className="flex items-center gap-2">
            <Logo className="h-8 w-8" />
            <span className="font-display font-semibold text-lg">AgriPrice</span>
          </div>
          <button
            onClick={() => setOpen(true)}
            className="p-2 border border-border rounded-md text-sm hover:bg-muted transition-colors flex items-center gap-2"
          >
            <span className="font-medium">Menu</span>
            <div className="flex flex-col gap-1 w-4">
              <span className="h-0.5 w-full bg-foreground" />
              <span className="h-0.5 w-full bg-foreground" />
              <span className="h-0.5 w-full bg-foreground" />
            </div>
          </button>
        </header>
        <main className="flex-1 bg-background">{children}</main>
      </div>
    </div>
  );
}
