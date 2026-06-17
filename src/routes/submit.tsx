import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { DashboardShell } from "@/components/DashboardShell";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";

export const Route = createFileRoute("/submit")({
  head: () => ({
    meta: [
      { title: "Submit a Price — AgriPrice" },
      {
        name: "description",
        content: "Submit a daily produce price for a market in Mbarara or Masaka.",
      },
    ],
  }),
  component: SubmitPage,
});

function SubmitPage() {
  const { user } = useAuth();
  const [markets, setMarkets] = useState<{ id: string; name: string }[]>([]);
  const [produce, setProduce] = useState<{ id: string; name: string }[]>([]);
  const [produceId, setProduceId] = useState("");
  const [marketId, setMarketId] = useState("");
  const [price, setPrice] = useState("");
  const [success, setSuccess] = useState<string | null>(null);
  const [err, setErr] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    Promise.all([
      supabase.from("markets").select("id, name").order("name"),
      supabase.from("produce").select("id, name").order("name"),
    ]).then(([m, p]) => {
      setMarkets(m.data ?? []);
      setProduce(p.data ?? []);
    });
  }, []);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!user) return;
    setBusy(true);
    setErr(null);
    setSuccess(null);
    const { error } = await supabase.from("price_entries").insert({
      produce_id: produceId,
      market_id: marketId,
      user_id: user.id,
      price: Number(price),
      unit: "kg",
    });
    setBusy(false);
    if (error) setErr(error.message);
    else {
      setSuccess("Price submitted. Thank you for contributing.");
      setProduceId("");
      setMarketId("");
      setPrice("");
    }
  }

  return (
    <DashboardShell>
      <div className="mx-auto max-w-2xl px-6 py-12">
        <h1 className="text-3xl mb-2">Submit a price</h1>
        <p className="text-muted-foreground mb-8">
          Logging a current price in UGX per kilogram from a market you visited.
        </p>

        <div
          className="bg-card border border-border rounded-md p-8"
          style={{ boxShadow: "0 4px 16px rgba(0,0,0,0.07)" }}
        >
          <form onSubmit={submit} className="space-y-6">
            <div className="field-underline">
              <label className="text-xs text-muted-foreground block mb-1">Produce</label>
              <select
                required
                value={produceId}
                onChange={(e) => setProduceId(e.target.value)}
                className="w-full bg-transparent border-0 border-b border-border focus:outline-none py-2 text-sm"
              >
                <option value="">Select produce</option>
                {produce.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="field-underline">
              <label className="text-xs text-muted-foreground block mb-1">Market</label>
              <select
                required
                value={marketId}
                onChange={(e) => setMarketId(e.target.value)}
                className="w-full bg-transparent border-0 border-b border-border focus:outline-none py-2 text-sm"
              >
                <option value="">Select market</option>
                {markets.map((m) => (
                  <option key={m.id} value={m.id}>
                    {m.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="field-underline">
              <label className="text-xs text-muted-foreground block mb-1">Price (UGX / kg)</label>
              <input
                required
                type="number"
                min="1"
                step="1"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                placeholder="e.g. 2500"
                className="w-full bg-transparent border-0 border-b border-border focus:outline-none py-2 text-sm"
              />
            </div>

            {success && (
              <div className="text-sm py-3 px-4 rounded-md bg-green-soft text-primary border border-primary/20">
                {success}
              </div>
            )}
            {err && (
              <div className="text-sm py-3 px-4 rounded-md text-destructive border border-destructive/30">
                {err}
              </div>
            )}

            <button
              disabled={busy}
              className="w-full py-3 bg-primary text-gold font-medium rounded-md hover:bg-primary/85 transition-colors duration-200 disabled:opacity-60"
            >
              {busy ? "Submitting…" : "Submit price"}
            </button>
          </form>
        </div>
      </div>
    </DashboardShell>
  );
}
