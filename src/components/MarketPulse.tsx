import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

type Row = {
  price: number;
  date_submitted: string;
  produce: { name: string } | null;
  market: { name: string; location: string } | null;
};

export function MarketPulse() {
  const [rows, setRows] = useState<Row[]>([]);
  const [now, setNow] = useState(Date.now());

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const { data } = await supabase
        .from("price_entries")
        .select(
          "price, date_submitted, produce:produce_id(name), market:market_id(name, location)",
        )
        .order("date_submitted", { ascending: false })
        .limit(60);
      if (!cancelled && data) setRows(data as Row[]);
    })();
    const t = setInterval(() => setNow(Date.now()), 30000);
    return () => {
      cancelled = true;
      clearInterval(t);
    };
  }, []);

  const totalEntries = rows.length;
  const last24 = rows.filter(
    (r) => now - new Date(r.date_submitted).getTime() < 24 * 60 * 60 * 1000,
  ).length;
  const avg = rows.length
    ? Math.round(rows.reduce((s, r) => s + Number(r.price), 0) / rows.length)
    : 0;
  const markets = new Set(rows.map((r) => r.market?.name).filter(Boolean)).size;
  const latest = rows[0];

  return (
    <section className="bg-charcoal text-background border-y border-charcoal/60">
      <div className="mx-auto max-w-7xl px-6 py-10 grid md:grid-cols-4 gap-8 items-start">
        <Stat label="Entries on record" value={totalEntries.toLocaleString()} accent />
        <Stat label="Reports in last 24h" value={last24.toLocaleString()} />
        <Stat
          label="Active markets"
          value={markets.toLocaleString()}
          hint="across Mbarara & Masaka"
        />
        <div className="md:border-l md:border-background/15 md:pl-8">
          <div className="text-xs uppercase tracking-[0.18em] text-gold/80 mb-2">Latest entry</div>
          {latest ? (
            <div className="space-y-1">
              <div className="font-display text-2xl text-gold">
                UGX {Number(latest.price).toLocaleString()}
                <span className="text-xs ml-1 opacity-70">/kg</span>
              </div>
              <div className="text-sm">
                {latest.produce?.name}{" "}
                <span className="opacity-60">· {latest.market?.name}</span>
              </div>
              <div className="text-xs opacity-60">
                {timeAgo(latest.date_submitted, now)}
              </div>
            </div>
          ) : (
            <div className="text-sm opacity-60">No reports yet today.</div>
          )}
        </div>
      </div>
      <div className="border-t border-background/10">
        <div className="mx-auto max-w-7xl px-6 py-3 text-xs flex flex-wrap items-center gap-x-6 gap-y-2 text-background/70">
          <span className="inline-flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-gold animate-pulse" />
            Live · updates every 30 seconds
          </span>
          <span>Average price across recent reports: <span className="text-gold font-mono">UGX {avg.toLocaleString()}/kg</span></span>
        </div>
      </div>
    </section>
  );
}

function Stat({ label, value, hint, accent }: { label: string; value: string; hint?: string; accent?: boolean }) {
  return (
    <div>
      <div className="text-xs uppercase tracking-[0.18em] text-background/60 mb-2">{label}</div>
      <div className={`font-display text-4xl ${accent ? "text-gold" : "text-background"}`}>{value}</div>
      {hint && <div className="text-xs text-background/55 mt-1">{hint}</div>}
    </div>
  );
}

function timeAgo(iso: string, now: number) {
  const s = Math.max(1, Math.floor((now - new Date(iso).getTime()) / 1000));
  if (s < 60) return `${s}s ago`;
  if (s < 3600) return `${Math.floor(s / 60)}m ago`;
  if (s < 86400) return `${Math.floor(s / 3600)}h ago`;
  return `${Math.floor(s / 86400)}d ago`;
}