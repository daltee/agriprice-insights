import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { z } from "zod";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable/index";
import { SiteHeader } from "@/components/SiteHeader";

const searchSchema = z.object({
  mode: z.enum(["login", "register"]).optional(),
  redirect: z.string().optional(),
});

export const Route = createFileRoute("/auth")({
  validateSearch: searchSchema,
  head: () => ({
    meta: [
      { title: "Sign in — AgriPrice" },
      {
        name: "description",
        content: "Sign in or create an AgriPrice account to submit market prices.",
      },
    ],
  }),
  component: AuthPage,
});

function AuthPage() {
  const search = Route.useSearch();
  const navigate = useNavigate();
  const [mode, setMode] = useState<"login" | "register">(search.mode ?? "login");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<"farmer" | "vendor">("farmer");
  const [err, setErr] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) navigate({ to: search.redirect ?? "/dashboard" });
    });
  }, [navigate, search.redirect]);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setErr(null);
    setBusy(true);
    try {
      if (mode === "register") {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: { data: { name, role }, emailRedirectTo: window.location.origin + "/dashboard" },
        });
        if (error) throw error;
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
      }
      navigate({ to: search.redirect ?? "/dashboard" });
    } catch (e) {
      setErr(e instanceof Error ? e.message : "Something went wrong");
    } finally {
      setBusy(false);
    }
  }

  async function google() {
    setErr(null);
    const res = await lovable.auth.signInWithOAuth("google", {
      redirect_uri: window.location.origin + "/dashboard",
    });
    if (res.error) setErr(res.error.message);
    else if (!res.redirected) navigate({ to: "/dashboard" });
  }

  return (
    <div className="min-h-screen flex flex-col">
      <SiteHeader />
      <main className="flex-1 bg-muted/40 flex items-center justify-center px-6 py-16">
        <div
          className="w-full max-w-md bg-card border border-border rounded-md p-8"
          style={{ boxShadow: "0 4px 16px rgba(0,0,0,0.07)" }}
        >
          <h1 className="text-2xl mb-1">{mode === "login" ? "Sign in" : "Create your account"}</h1>
          <p className="text-sm text-muted-foreground mb-6">
            {mode === "login"
              ? "Welcome back to AgriPrice."
              : "Join farmers and vendors logging market prices."}
          </p>

          <button
            onClick={google}
            type="button"
            className="w-full mb-4 px-4 py-2.5 border border-border rounded-md text-sm font-medium hover:bg-muted transition-colors duration-200"
          >
            Continue with Google
          </button>
          <div className="text-center text-xs text-muted-foreground mb-4">or with email</div>

          <form onSubmit={submit} className="space-y-5">
            {mode === "register" && (
              <div className="field-underline">
                <input
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Full name"
                  className="w-full bg-transparent border-0 border-b border-border focus:outline-none py-2 text-sm"
                />
              </div>
            )}
            <div className="field-underline">
              <input
                required
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email"
                className="w-full bg-transparent border-0 border-b border-border focus:outline-none py-2 text-sm"
              />
            </div>
            <div className="field-underline">
              <input
                required
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                minLength={6}
                className="w-full bg-transparent border-0 border-b border-border focus:outline-none py-2 text-sm"
              />
            </div>
            {mode === "register" && (
              <div>
                <label className="text-xs text-muted-foreground block mb-2">I am a</label>
                <div className="flex gap-2">
                  {(["farmer", "vendor"] as const).map((r) => (
                    <button
                      type="button"
                      key={r}
                      onClick={() => setRole(r)}
                      className={`flex-1 px-3 py-2 rounded-md border text-sm capitalize transition-colors duration-200 ${role === r ? "border-primary bg-primary text-primary-foreground" : "border-border hover:bg-muted"}`}
                    >
                      {r}
                    </button>
                  ))}
                </div>
              </div>
            )}
            {err && <div className="text-sm text-destructive">{err}</div>}
            <button
              disabled={busy}
              className="w-full py-3 bg-primary text-gold font-medium rounded-md hover:bg-primary/85 transition-colors duration-200 disabled:opacity-60"
            >
              {busy ? "Please wait…" : mode === "login" ? "Sign in" : "Create account"}
            </button>
          </form>

          <div className="mt-6 text-center text-sm text-muted-foreground">
            {mode === "login" ? (
              <>
                New here?{" "}
                <button
                  onClick={() => setMode("register")}
                  className="text-primary hover:underline"
                >
                  Create an account
                </button>
              </>
            ) : (
              <>
                Already have an account?{" "}
                <button onClick={() => setMode("login")} className="text-primary hover:underline">
                  Sign in
                </button>
              </>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
