import { Link } from "@tanstack/react-router";
import { Logo } from "./Logo";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";

export function SiteHeader() {
  const { user } = useAuth();
  return (
    <header className="border-b border-border bg-background/90 backdrop-blur sticky top-0 z-40">
      <div className="mx-auto max-w-7xl flex items-center justify-between px-6 py-4">
        <Link to="/"><Logo className="h-7 w-auto" /></Link>
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium">
          <Link to="/prices" className="hover:text-primary transition-colors">Prices</Link>
          <Link to="/submit" className="hover:text-primary transition-colors">Submit</Link>
          {user && <Link to="/dashboard" className="hover:text-primary transition-colors">Dashboard</Link>}
        </nav>
        <div className="flex items-center gap-3">
          {user ? (
            <button
              onClick={() => supabase.auth.signOut()}
              className="text-sm px-4 py-2 rounded-md border border-border hover:bg-muted transition-colors duration-200"
            >Sign out</button>
          ) : (
            <>
              <Link to="/auth" className="text-sm font-medium hover:text-primary transition-colors">Sign in</Link>
              <Link to="/auth" search={{ mode: "register" }} className="text-sm px-4 py-2 rounded-md bg-primary text-primary-foreground hover:bg-primary/90 transition-colors duration-200">Get started</Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}