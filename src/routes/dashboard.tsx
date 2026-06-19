import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { DashboardShell } from "@/components/DashboardShell";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { LocationCard } from "@/components/LocationCard";
import {
  LineChart,
  Line,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  CartesianGrid,
  Area,
  ComposedChart,
} from "recharts";

export const Route = createFileRoute("/dashboard")({
  head: () => ({ meta: [{ title: "Dashboard — AgriPrice" }] }),
  component: Dashboard,
});

type Entry = {
  id: string;
  price: number;
  date_submitted: string;
  produce: { id: string; name: string } | null;
  market: { name: string } | null;
};

function Dashboard() {
  const { user } = useAuth();
  const [mine, setMine] = useState<Entry[]>([]);
  const [all, setAll] = useState<Entry[]>([]);
  const [selectedProduce, setSelectedProduce] = useState<string>("");
  const [editPrice, setEditPrice] = useState<{ id: string; value: string } | null>(null);

  const load = () => {
    if (!user) return;
    supabase
      .from("price_entries")
      .select("id, price, date_submitted, produce:produce_id(id, name), market:market_id(name)")
      .eq("user_id", user.id)
      .order("date_submitted", { ascending: false })
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      .then(({ data }) => setMine(((data as any) ?? []) as Entry[]));
    const sevenAgo = new Date();
    sevenAgo.setDate(sevenAgo.getDate() - 7);
    supabase
      .from("price_entries")
      .select("id, price, date_submitted, produce:produce_id(id, name), market:market_id(name)")
      .gte("date_submitted", sevenAgo.toISOString())
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      .then(({ data }) => setAll(((data as any) ?? []) as Entry[]));
  };

  useEffect(load, [user]);

  const produceOptions = useMemo(() => {
    const m = new Map<string, string>();
    all.forEach((e) => e.produce && m.set(e.produce.id, e.produce.name));
    return Array.from(m, ([id, name]) => ({ id, name })).sort((a, b) =>
      a.name.localeCompare(b.name),
    );
  }, [all]);

  useEffect(() => {
    if (!selectedProduce && produceOptions.length) setSelectedProduce(produceOptions[0].id);
  }, [produceOptions, selectedProduce]);

  const chartData = useMemo(() => {
    const days = Array.from({ length: 7 }).map((_, i) => {
      const d = new Date();
      d.setDate(d.getDate() - (6 - i));
      const key = d.toISOString().slice(0, 10);
      return {
        date: key,
        label: d.toLocaleDateString(undefined, { weekday: "short" }),
        price: null as number | null,
      };
    });
    const byDay = new Map<string, number[]>();
    all
      .filter((e) => e.produce?.id === selectedProduce)
      .forEach((e) => {
        const k = new Date(e.date_submitted).toISOString().slice(0, 10);
        const arr = byDay.get(k) ?? [];
        arr.push(Number(e.price));
        byDay.set(k, arr);
      });
    return days.map((d) => {
      const arr = byDay.get(d.date);
      return { ...d, price: arr ? Math.round(arr.reduce((a, b) => a + b, 0) / arr.length) : null };
    });
  }, [all, selectedProduce]);

  const stats = useMemo(() => {
    const marketCounts = new Map<string, number>();
    all.forEach((e) => {
      if (e.market) marketCounts.set(e.market.name, (marketCounts.get(e.market.name) ?? 0) + 1);
    });
    const topMarket = Array.from(marketCounts.entries()).sort((a, b) => b[1] - a[1])[0];
    // biggest price change for any produce
    const byProduce = new Map<string, number[]>();
    [...all]
      .sort((a, b) => +new Date(a.date_submitted) - +new Date(b.date_submitted))
      .forEach((e) => {
        if (!e.produce) return;
        const a = byProduce.get(e.produce.name) ?? [];
        a.push(Number(e.price));
        byProduce.set(e.produce.name, a);
      });
    let topChange = { name: "—", pct: 0 };
    byProduce.forEach((arr, name) => {
      if (arr.length < 2) return;
      const pct = ((arr[arr.length - 1] - arr[0]) / arr[0]) * 100;
      if (Math.abs(pct) > Math.abs(topChange.pct)) topChange = { name, pct };
    });
    return { total: mine.length, topMarket: topMarket ? topMarket[0] : "—", topChange };
  }, [all, mine]);

  async function del(id: string) {
    if (!confirm("Delete this entry?")) return;
    await supabase.from("price_entries").delete().eq("id", id);
    load();
  }
  async function saveEdit() {
    if (!editPrice) return;
    await supabase
      .from("price_entries")
      .update({ price: Number(editPrice.value) })
      .eq("id", editPrice.id);
    setEditPrice(null);
    load();
  }

  return (
    <DashboardShell>
      <div className="mx-auto max-w-7xl px-6 py-10">
        <h1 className="text-3xl mb-2">Overview</h1>
        <p className="text-muted-foreground mb-8">
          A quick read on your contributions and market movement this week.
        </p>
        <LocationCard />

        <div className="grid md:grid-cols-3 gap-6 mb-10">
          {[
            { label: "Entries submitted", value: stats.total },
            { label: "Most active market this week", value: stats.topMarket },
            {
              label: "Biggest price change",
              value: `${stats.topChange.name}${stats.topChange.pct ? ` · ${stats.topChange.pct > 0 ? "+" : ""}${stats.topChange.pct.toFixed(1)}%` : ""}`,
            },
          ].map((c, i) => (
            <div
              key={i}
              className="card-rise bg-card border-t-2 border-gold border border-border rounded-md p-6"
              style={{ animationDelay: `${i * 100}ms`, boxShadow: "0 4px 16px rgba(0,0,0,0.07)" }}
            >
              <div className="text-xs uppercase tracking-wider text-muted-foreground mb-2">
                {c.label}
              </div>
              <div className="text-2xl font-display">{c.value}</div>
            </div>
          ))}
        </div>

        <div
          className="bg-card border border-border rounded-md p-6 mb-10"
          style={{ boxShadow: "0 4px 16px rgba(0,0,0,0.07)" }}
        >
          <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
            <div>
              <h2 className="text-xl">Price trend · last 7 days</h2>
              <p className="text-sm text-muted-foreground">Average UGX/kg across all markets.</p>
            </div>
            <select
              value={selectedProduce}
              onChange={(e) => setSelectedProduce(e.target.value)}
              className="bg-background border border-border rounded-md px-3 py-2 text-sm"
            >
              {produceOptions.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name}
                </option>
              ))}
            </select>
          </div>
          <div style={{ width: "100%", height: 280 }}>
            <ResponsiveContainer>
              <ComposedChart data={chartData} margin={{ top: 10, right: 16, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="goldFill" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#C9A84C" stopOpacity={0.25} />
                    <stop offset="100%" stopColor="#C9A84C" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid stroke="#E5E0D7" strokeDasharray="2 6" vertical={false} />
                <XAxis
                  dataKey="label"
                  stroke="#7a766f"
                  tick={{ fontSize: 12 }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  stroke="#7a766f"
                  tick={{ fontSize: 12 }}
                  axisLine={false}
                  tickLine={false}
                  width={56}
                />
                <Tooltip
                  contentStyle={{
                    background: "#1A1A1A",
                    border: 0,
                    color: "#C9A84C",
                    fontSize: 12,
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="price"
                  stroke="none"
                  fill="url(#goldFill)"
                  connectNulls
                />
                <Line
                  type="monotone"
                  dataKey="price"
                  stroke="#C9A84C"
                  strokeWidth={2.5}
                  dot={{ r: 3, fill: "#C9A84C" }}
                  connectNulls
                />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-card border border-border rounded-md overflow-hidden">
          <div className="px-6 py-4 border-b border-border">
            <h2 className="text-xl">Your submissions</h2>
          </div>
          <table className="w-full text-sm">
            <thead className="bg-muted/60 text-left">
              <tr>
                <th className="px-5 py-3 font-medium">Produce</th>
                <th className="px-5 py-3 font-medium">Market</th>
                <th className="px-5 py-3 font-medium">Price</th>
                <th className="px-5 py-3 font-medium">Date</th>
                <th className="px-5 py-3 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {mine.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-5 py-10 text-center text-muted-foreground">
                    You haven't submitted any prices yet.
                  </td>
                </tr>
              ) : (
                mine.map((r) => (
                  <tr
                    key={r.id}
                    className="border-t border-border hover:bg-green-soft transition-colors duration-150"
                  >
                    <td className="px-5 py-3 font-medium">{r.produce?.name}</td>
                    <td className="px-5 py-3">{r.market?.name}</td>
                    <td className="px-5 py-3 font-mono">
                      {editPrice?.id === r.id ? (
                        <input
                          autoFocus
                          value={editPrice.value}
                          onChange={(e) => setEditPrice({ id: r.id, value: e.target.value })}
                          className="w-24 bg-background border border-border rounded px-2 py-1 text-sm"
                        />
                      ) : (
                        `UGX ${Number(r.price).toLocaleString()}`
                      )}
                    </td>
                    <td className="px-5 py-3 text-muted-foreground">
                      {new Date(r.date_submitted).toLocaleDateString()}
                    </td>
                    <td className="px-5 py-3 text-right space-x-2">
                      {editPrice?.id === r.id ? (
                        <>
                          <button
                            onClick={saveEdit}
                            className="text-xs px-3 py-1.5 bg-primary text-gold rounded hover:bg-primary/85 transition-colors duration-200"
                          >
                            Save
                          </button>
                          <button
                            onClick={() => setEditPrice(null)}
                            className="text-xs px-3 py-1.5 border border-border rounded hover:bg-muted transition-colors duration-200"
                          >
                            Cancel
                          </button>
                        </>
                      ) : (
                        <>
                          <button
                            onClick={() => setEditPrice({ id: r.id, value: String(r.price) })}
                            className="text-xs px-3 py-1.5 border border-border rounded hover:bg-muted transition-colors duration-200"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => del(r.id)}
                            className="text-xs px-3 py-1.5 text-destructive border border-destructive/40 rounded hover:bg-destructive/10 transition-colors duration-200"
                          >
                            Delete
                          </button>
                        </>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </DashboardShell>
  );
}
