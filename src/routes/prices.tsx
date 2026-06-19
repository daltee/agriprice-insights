import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { SiteHeader } from "@/components/SiteHeader";
import { MarketPulse } from "@/components/MarketPulse";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/prices")({
  head: () => ({
    meta: [
      { title: "Today's Prices — AgriPrice" },
      {
        name: "description",
        content: "Browse current produce prices across Mbarara and Masaka markets.",
      },
      { property: "og:title", content: "Today's Prices — AgriPrice" },
      {
        property: "og:description",
        content: "Browse current produce prices across Mbarara and Masaka markets.",
      },
    ],
  }),
  component: PricesPage,
});

type Row = {
  id: string;
  price: number;
  unit: string;
  date_submitted: string;
  produce: { name: string } | null;
  market: { name: string; location: string } | null;
  profile?: { name: string } | null;
};

function PricesPage() {
  const [rows, setRows] = useState<Row[]>([]);
  const [markets, setMarkets] = useState<{ id: string; name: string }[]>([]);
  const [produce, setProduce] = useState<{ id: string; name: string }[]>([]);
  const [marketFilter, setMarketFilter] = useState("");
  const [produceFilter, setProduceFilter] = useState("");
  const [dateFilter, setDateFilter] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      supabase.from("markets").select("id, name").order("name"),
      supabase.from("produce").select("id, name").order("name"),
    ]).then(([m, p]) => {
      setMarkets(m.data ?? []);
      setProduce(p.data ?? []);
    });
  }, []);

  useEffect(() => {
    setLoading(true);
    let cancelled = false;

    async function loadRows() {
      let q = supabase
        .from("price_entries")
        .select(
          "id, price, unit, date_submitted, produce:produce_id(name), market:market_id(name, location)",
        )
        .order("date_submitted", { ascending: false })
        .limit(200);
      if (marketFilter) q = q.eq("market_id", marketFilter);
      if (produceFilter) q = q.eq("produce_id", produceFilter);
      if (dateFilter) {
        const start = new Date(dateFilter);
        const end = new Date(start);
        end.setDate(end.getDate() + 1);
        q = q.gte("date_submitted", start.toISOString()).lt("date_submitted", end.toISOString());
      }

      const { data, error } = await q;
      if (!cancelled) {
        if (error) console.error(error);
        setRows((data as Row[]) ?? []);
        setLoading(false);
      }
    }

    void loadRows();
    return () => {
      cancelled = true;
    };
  }, [marketFilter, produceFilter, dateFilter]);

  const summary = useMemo(() => {
    if (!rows.length) return null;
    const avg = rows.reduce((s, r) => s + Number(r.price), 0) / rows.length;
    return { count: rows.length, avg };
  }, [rows]);

  return (
    <div className="min-h-screen flex flex-col">
      <SiteHeader />
      <MarketPulse />
      <main className="flex-1 bg-background">
        <div className="mx-auto max-w-7xl px-6 py-12">
          <h1 className="text-3xl md:text-4xl mb-2">Today's market prices</h1>
          <p className="text-muted-foreground mb-8">
            {summary
              ? `${summary.count} entries · average UGX ${Math.round(summary.avg).toLocaleString()}/kg`
              : "Loading entries…"}
          </p>

          <div className="bg-card border border-border rounded-md p-4 mb-6 grid sm:grid-cols-4 gap-3">
            <select
              value={marketFilter}
              onChange={(e) => setMarketFilter(e.target.value)}
              className="bg-background border border-border rounded-md px-3 py-2 text-sm"
            >
              <option value="">All markets</option>
              {markets.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.name}
                </option>
              ))}
            </select>
            <select
              value={produceFilter}
              onChange={(e) => setProduceFilter(e.target.value)}
              className="bg-background border border-border rounded-md px-3 py-2 text-sm"
            >
              <option value="">All produce</option>
              {produce.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name}
                </option>
              ))}
            </select>
            <input
              type="date"
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              className="bg-background border border-border rounded-md px-3 py-2 text-sm"
            />
            <button
              onClick={() => {
                setMarketFilter("");
                setProduceFilter("");
                setDateFilter("");
              }}
              className="text-sm border border-border rounded-md px-3 py-2 hover:bg-muted transition-colors duration-200"
            >
              Reset filters
            </button>
          </div>

          <div className="bg-card border border-border rounded-md overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm min-w-[600px] sm:min-w-0">
                <thead className="bg-muted/60 text-left">
                  <tr>
                    <th className="px-5 py-3 font-medium">Produce</th>
                    <th className="px-5 py-3 font-medium">Price (UGX/kg)</th>
                    <th className="px-5 py-3 font-medium">Market</th>
                    <th className="px-5 py-3 font-medium hidden sm:table-cell">Submitted by</th>
                    <th className="px-5 py-3 font-medium">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    <tr>
                      <td colSpan={5} className="px-5 py-10 text-center text-muted-foreground">
                        Loading…
                      </td>
                    </tr>
                  ) : rows.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="px-5 py-10 text-center text-muted-foreground">
                        No entries match those filters.
                      </td>
                    </tr>
                  ) : (
                    rows.map((r, i) => (
                      <tr
                        key={r.id}
                        className="row-fade border-t border-border hover:bg-green-soft transition-colors duration-150"
                        style={{ animationDelay: `${Math.min(i, 30) * 80}ms` }}
                      >
                        <td className="px-5 py-3 font-medium">{r.produce?.name}</td>
                        <td className="px-5 py-3 font-mono font-semibold text-primary">{Number(r.price).toLocaleString()}</td>
                        <td className="px-5 py-3">
                          {r.market?.name}{" "}
                          <span className="text-muted-foreground text-xs block sm:inline">
                            {r.market?.location ? `· ${r.market.location}` : ""}
                          </span>
                        </td>
                        <td className="px-5 py-3 text-muted-foreground hidden sm:table-cell">{r.profile?.name ?? "—"}</td>
                        <td className="px-5 py-3 text-muted-foreground">
                          {new Date(r.date_submitted).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
