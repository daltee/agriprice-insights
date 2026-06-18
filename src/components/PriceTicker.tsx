import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

type Tick = { produce: string; market: string; price: number };
type TickRow = {
  price: number;
  produce: { name: string } | null;
  market: { name: string } | null;
};

export function PriceTicker() {
  const [ticks, setTicks] = useState<Tick[]>([]);
  useEffect(() => {
    supabase
      .from("price_entries")
      .select("price, produce:produce_id(name), market:market_id(name)")
      .order("date_submitted", { ascending: false })
      .limit(20)
      .then(({ data }) => {
        if (!data) return;
        const rows = data as TickRow[];
        setTicks(
          rows.map((d) => ({
            produce: d.produce?.name ?? "",
            market: d.market?.name ?? "",
            price: Number(d.price),
          })),
        );
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);

  const items = ticks.length ? [...ticks, ...ticks] : [];

  return (
    <div className="bg-charcoal text-gold overflow-hidden border-y border-charcoal/50">
      <div className="ticker-track py-3">
        {items.length === 0 ? (
          <span className="px-8 text-sm tracking-wide opacity-70">
            No prices submitted yet — be the first.
          </span>
        ) : (
          items.map((t, i) => (
            <span key={i} className="px-8 text-sm whitespace-nowrap tracking-wide">
              <span className="font-semibold">{t.produce}</span>
              <span className="opacity-60 mx-2">·</span>
              <span>{t.market}</span>
              <span className="opacity-60 mx-2">·</span>
              <span className="font-mono">UGX {t.price.toLocaleString()}/kg</span>
            </span>
          ))
        )}
      </div>
    </div>
  );
}
