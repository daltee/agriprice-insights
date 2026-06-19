import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { z } from "zod";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable/index";
import { SiteHeader } from "@/components/SiteHeader";
import { getVisitorCountry } from "@/lib/geo.functions";

// East African countries first (per project requirements), then a curated rest.
const COUNTRIES = [
  { code: "UG", dial: "+256", name: "Uganda" },
  { code: "TZ", dial: "+255", name: "Tanzania" },
  { code: "KE", dial: "+254", name: "Kenya" },
  { code: "RW", dial: "+250", name: "Rwanda" },
  { code: "BI", dial: "+257", name: "Burundi" },
  { code: "SS", dial: "+211", name: "South Sudan" },
  { code: "ET", dial: "+251", name: "Ethiopia" },
  { code: "GB", dial: "+44", name: "United Kingdom" },
  { code: "US", dial: "+1", name: "United States" },
] as const;

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
  const [channel, setChannel] = useState<"email" | "phone">("email");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<"farmer" | "vendor">("farmer");
  const [country, setCountry] = useState<(typeof COUNTRIES)[number]>(COUNTRIES[0]);
  const [phone, setPhone] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState("");
  const [visitorCountry, setVisitorCountry] = useState<string | null>(null);
  const [warning, setWarning] = useState<string | null>(null);
  const [err, setErr] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) navigate({ to: search.redirect ?? "/dashboard" });
    });
  }, [navigate, search.redirect]);

  useEffect(() => {
    getVisitorCountry()
      .then((r) => setVisitorCountry(r.country))
      .catch(() => undefined);
  }, []);

  useEffect(() => {
    if (!visitorCountry) {
      setWarning(null);
      return;
    }
    if (country.code !== visitorCountry) {
      setWarning(
        `Heads up: your connection looks like it's coming from ${visitorCountry}. Make sure you picked the right country code.`,
      );
    } else {
      setWarning(null);
    }
  }, [country, visitorCountry]);

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

  async function sendPhoneCode(e: React.FormEvent) {
    e.preventDefault();
    setErr(null);
    if (!/^\d{10}$/.test(phone)) {
      setErr("Phone number must be exactly 10 digits (0-9).");
      return;
    }
    setBusy(true);
    try {
      const full = `${country.dial}${phone.replace(/^0+/, "")}`;
      const { error } = await supabase.auth.signInWithOtp({
        phone: full,
        options: {
          data: { name, role, phone: full, country_code: country.code },
        },
      });
      if (error) throw error;
      setOtpSent(true);
    } catch (e) {
      setErr(
        e instanceof Error
          ? `${e.message}. Phone sign-in needs an SMS provider configured for your project.`
          : "Could not send code",
      );
    } finally {
      setBusy(false);
    }
  }

  async function verifyPhoneCode(e: React.FormEvent) {
    e.preventDefault();
    setErr(null);
    setBusy(true);
    try {
      const full = `${country.dial}${phone.replace(/^0+/, "")}`;
      const { error } = await supabase.auth.verifyOtp({ phone: full, token: otp, type: "sms" });
      if (error) throw error;
      navigate({ to: search.redirect ?? "/dashboard" });
    } catch (e) {
      setErr(e instanceof Error ? e.message : "Could not verify code");
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

          <div className="flex border border-border rounded-md p-0.5 mb-5 text-xs">
            {(["email", "phone"] as const).map((c) => (
              <button
                key={c}
                type="button"
                onClick={() => {
                  setChannel(c);
                  setErr(null);
                  setOtpSent(false);
                }}
                className={`flex-1 py-2 rounded-[5px] uppercase tracking-wider transition-colors ${channel === c ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"}`}
              >
                {c === "email" ? "Email" : "Phone"}
              </button>
            ))}
          </div>

          {channel === "email" ? (
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
                pattern="^[^\s@]+@[^\s@]+\.[^\s@]{2,}$"
                title="Enter a valid email address"
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
          ) : (
            <form onSubmit={otpSent ? verifyPhoneCode : sendPhoneCode} className="space-y-5">
              {mode === "register" && !otpSent && (
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
              {!otpSent ? (
                <div>
                  <label className="text-xs text-muted-foreground block mb-2">Phone number</label>
                  <div className="flex gap-2">
                    <select
                      value={country.code}
                      onChange={(e) => {
                        const next = COUNTRIES.find((c) => c.code === e.target.value);
                        if (next) setCountry(next);
                      }}
                      className="bg-background border border-border rounded-md px-2 py-2 text-sm"
                    >
                      {COUNTRIES.map((c, i) => (
                        <option key={c.code} value={c.code}>
                          {c.dial} {c.name}
                          {i === 3 ? "  ──────" : ""}
                        </option>
                      ))}
                    </select>
                    <input
                      required
                      inputMode="numeric"
                      pattern="\d{10}"
                      maxLength={10}
                      title="Exactly 10 digits, 0-9"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value.replace(/\D/g, "").slice(0, 10))}
                      placeholder="0700123456"
                      className="flex-1 bg-background border border-border rounded-md px-3 py-2 text-sm font-mono"
                    />
                  </div>
                  <p className="text-xs text-muted-foreground mt-2">
                    Exactly 10 digits (0-9). We'll send a verification code by SMS.
                  </p>
                </div>
              ) : (
                <div>
                  <label className="text-xs text-muted-foreground block mb-2">
                    Enter the 6-digit code sent to {country.dial} {phone}
                  </label>
                  <input
                    required
                    inputMode="numeric"
                    pattern="\d{6}"
                    maxLength={6}
                    value={otp}
                    onChange={(e) => setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))}
                    placeholder="123456"
                    className="w-full bg-background border border-border rounded-md px-3 py-2 text-lg font-mono tracking-widest text-center"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      setOtpSent(false);
                      setOtp("");
                    }}
                    className="text-xs text-primary hover:underline mt-2"
                  >
                    Change number
                  </button>
                </div>
              )}
              {warning && !otpSent && (
                <div className="text-xs text-clay border border-clay/30 bg-clay/5 rounded-md p-2.5">
                  {warning}
                </div>
              )}
              {err && <div className="text-sm text-destructive">{err}</div>}
              <button
                disabled={busy}
                className="w-full py-3 bg-primary text-gold font-medium rounded-md hover:bg-primary/85 transition-colors duration-200 disabled:opacity-60"
              >
                {busy ? "Please wait…" : otpSent ? "Verify & continue" : "Send code"}
              </button>
            </form>
          )}

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

          <p className="text-center text-xs text-muted-foreground mt-4">
            Or{" "}
            <a href="/prices" className="text-primary hover:underline">
              keep browsing without an account
            </a>{" "}
            — prices are free to read.
          </p>
        </div>
      </main>
    </div>
  );
}
