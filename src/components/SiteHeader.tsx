import { Link, useRouter, useRouterState } from "@tanstack/react-router";
import { Logo } from "./Logo";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { Menu } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { useState } from "react";

const NAV = [
  { to: "/", label: "Home" },
  { to: "/prices", label: "Prices" },
  { to: "/submit", label: "Submit" },
];

export function SiteHeader() {
  const { user } = useAuth();
  const router = useRouter();
  const path = useRouterState({ select: (s) => s.location.pathname });
  const showBack = path !== "/";
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="border-b border-border bg-background/95 backdrop-blur sticky top-0 z-40">
      <div className="mx-auto max-w-7xl flex items-center justify-between gap-4 px-6 py-3">
        <div className="flex items-center gap-3 min-w-0">
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <button
                className="md:hidden p-2 -ml-2 rounded-md hover:bg-muted transition-colors"
                aria-label="Open navigation menu"
              >
                <Menu className="h-5 w-5" />
              </button>
            </SheetTrigger>
            <SheetContent side="left" className="w-[300px] sm:w-[400px]">
              <SheetHeader className="text-left mb-8">
                <SheetTitle className="flex items-center gap-2">
                  <Logo className="h-8 w-8" />
                  AgriPrice
                </SheetTitle>
              </SheetHeader>
              <nav className="flex flex-col gap-4">
                {NAV.map((n) => {
                  const active = path === n.to;
                  return (
                    <Link
                      key={n.to}
                      to={n.to}
                      onClick={() => setIsOpen(false)}
                      className={`text-lg font-medium transition-colors ${active ? "text-primary" : "text-muted-foreground hover:text-primary"}`}
                    >
                      {n.label}
                    </Link>
                  );
                })}
                {user && (
                  <Link
                    to="/dashboard"
                    onClick={() => setIsOpen(false)}
                    className={`text-lg font-medium transition-colors ${path.startsWith("/dashboard") ? "text-primary" : "text-muted-foreground hover:text-primary"}`}
                  >
                    Dashboard
                  </Link>
                )}
                <div className="border-t border-border pt-4 mt-4 flex flex-col gap-4">
                  {user ? (
                    <>
                      <Link
                        to="/dashboard"
                        onClick={() => setIsOpen(false)}
                        className="text-lg font-medium text-muted-foreground hover:text-primary transition-colors"
                      >
                        My account
                      </Link>
                      <button
                        onClick={() => {
                          supabase.auth.signOut();
                          setIsOpen(false);
                        }}
                        className="text-left text-lg font-medium text-muted-foreground hover:text-primary transition-colors"
                      >
                        Sign out
                      </button>
                    </>
                  ) : (
                    <>
                      <Link
                        to="/auth"
                        onClick={() => setIsOpen(false)}
                        className="text-lg font-medium text-muted-foreground hover:text-primary transition-colors"
                      >
                        Sign in
                      </Link>
                      <Link
                        to="/auth"
                        search={{ mode: "register" }}
                        onClick={() => setIsOpen(false)}
                        className="text-lg font-medium text-primary hover:text-primary/80 transition-colors"
                      >
                        Get started
                      </Link>
                    </>
                  )}
                </div>
              </nav>
            </SheetContent>
          </Sheet>
          {showBack && (
            <button
              onClick={() => router.history.back()}
              aria-label="Go back"
              title="Go back"
              className="hidden sm:inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1.5 rounded-md border border-border hover:bg-muted transition-colors"
            >
              <span aria-hidden>←</span> Back
            </button>
          )}
          <Link to="/" aria-label="AgriPrice home" className="shrink-0">
            <Logo className="h-9 w-9" />
          </Link>
          <Link to="/" className="font-display text-lg font-semibold tracking-tight hidden sm:block">
            AgriPrice
          </Link>
        </div>
        <nav className="hidden md:flex items-center gap-7 text-sm font-medium">
          {NAV.map((n) => {
            const active = path === n.to;
            return (
              <Link
                key={n.to}
                to={n.to}
                className={`relative py-1 transition-colors ${active ? "text-primary" : "hover:text-primary"}`}
              >
                {n.label}
                {active && (
                  <span className="absolute left-0 right-0 -bottom-0.5 h-[2px] bg-gold" />
                )}
              </Link>
            );
          })}
          {user && (
            <Link
              to="/dashboard"
              className={`relative py-1 transition-colors ${path.startsWith("/dashboard") ? "text-primary" : "hover:text-primary"}`}
            >
              Dashboard
            </Link>
          )}
        </nav>
        <div className="flex items-center gap-2">
          {user ? (
            <>
              <Link
                to="/dashboard"
                className="hidden sm:inline-block text-sm px-3 py-1.5 rounded-md border border-border hover:bg-muted transition-colors"
              >
                My account
              </Link>
              <button
                onClick={() => supabase.auth.signOut()}
                className="hidden xs:inline-block text-sm px-3 py-1.5 rounded-md hover:bg-muted transition-colors"
              >
                Sign out
              </button>
            </>
          ) : (
            <>
              <Link
                to="/auth"
                className="hidden xs:inline-block text-sm font-medium px-3 py-1.5 hover:text-primary transition-colors"
              >
                Sign in
              </Link>
              <Link
                to="/auth"
                search={{ mode: "register" }}
                className="text-sm px-4 py-2 rounded-md bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
              >
                Get started
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
