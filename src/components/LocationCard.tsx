import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";

type Address = {
  village?: string;
  hamlet?: string;
  suburb?: string;
  city?: string;
  town?: string;
  county?: string;
  state_district?: string;
  state?: string;
  region?: string;
  country?: string;
};

function pretty(a: Address) {
  const village = a.village || a.hamlet || a.suburb;
  const town = a.city || a.town;
  const district = a.county || a.state_district;
  const region = a.state || a.region;
  return [village, town, district, region, a.country].filter(Boolean).join(", ");
}

export function LocationCard() {
  const { user } = useAuth();
  const [label, setLabel] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    if (!user) return;
    supabase
      .from("profiles")
      .select("location_label")
      .eq("id", user.id)
      .maybeSingle()
      .then(({ data }) => setLabel(data?.location_label ?? null));
  }, [user]);

  async function detect() {
    setErr(null);
    if (!navigator.geolocation) {
      setErr("Your browser doesn't support GPS.");
      return;
    }
    setBusy(true);
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        try {
          const { latitude, longitude } = pos.coords;
          const res = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${latitude}&lon=${longitude}&zoom=14&addressdetails=1`,
            { headers: { Accept: "application/json" } },
          );
          const json = (await res.json()) as { address?: Address };
          const text = json.address ? pretty(json.address) : `${latitude.toFixed(4)}, ${longitude.toFixed(4)}`;
          setLabel(text);
          if (user) {
            await supabase
              .from("profiles")
              .update({
                location_label: text,
                location_lat: latitude,
                location_lng: longitude,
              })
              .eq("id", user.id);
          }
        } catch (e) {
          setErr(e instanceof Error ? e.message : "Could not look up address");
        } finally {
          setBusy(false);
        }
      },
      (e) => {
        setBusy(false);
        setErr(e.message);
      },
      { enableHighAccuracy: true, timeout: 10000 },
    );
  }

  async function clear() {
    if (!user) return;
    await supabase
      .from("profiles")
      .update({ location_label: null, location_lat: null, location_lng: null })
      .eq("id", user.id);
    setLabel(null);
  }

  return (
    <div
      className="bg-card border border-border rounded-md p-5 flex flex-wrap gap-4 items-center justify-between mb-8"
      style={{ boxShadow: "0 4px 16px rgba(0,0,0,0.07)" }}
    >
      <div className="min-w-0">
        <div className="text-xs uppercase tracking-wider text-muted-foreground mb-1">
          Your location (optional)
        </div>
        <div className="text-sm">
          {label ? (
            <span className="font-medium">{label}</span>
          ) : (
            <span className="text-muted-foreground">
              Add your village/district so we can tag your reports and surface nearby prices.
            </span>
          )}
        </div>
        {err && <div className="text-xs text-destructive mt-1">{err}</div>}
      </div>
      <div className="flex gap-2">
        {label && (
          <button
            onClick={clear}
            className="text-xs px-3 py-2 border border-border rounded-md hover:bg-muted transition-colors"
          >
            Clear
          </button>
        )}
        <button
          onClick={detect}
          disabled={busy}
          className="text-xs px-3 py-2 rounded-md bg-primary text-primary-foreground hover:bg-primary/90 transition-colors disabled:opacity-60"
        >
          {busy ? "Detecting…" : label ? "Update from GPS" : "Use my GPS"}
        </button>
      </div>
    </div>
  );
}