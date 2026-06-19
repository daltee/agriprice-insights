import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteHeader } from "@/components/SiteHeader";
import { MarketPulse } from "@/components/MarketPulse";
import { Logo } from "@/components/Logo";
import { PRODUCE_GALLERY } from "@/lib/produce-images";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "AgriPrice — Know the price before you go" },
      {
        name: "description",
        content:
          "Daily farm produce prices for markets in Mbarara and Masaka, Uganda. Submitted by local farmers, vendors and buyers.",
      },
      { property: "og:title", content: "AgriPrice — Know the price before you go" },
      {
        property: "og:description",
        content: "Daily farm produce prices across Mbarara and Masaka markets.",
      },
    ],
  }),
  component: Landing,
});

function Landing() {
  return (
    <div className="min-h-screen flex flex-col">
      <SiteHeader />
      <section className="relative bg-primary text-primary-foreground">
        <div
          className="absolute inset-0 opacity-40"
          style={{
            background: "radial-gradient(ellipse at top, rgba(0,0,0,0) 0%, rgba(0,0,0,0.45) 100%)",
          }}
        />
        <div className="relative mx-auto max-w-5xl px-6 py-28 md:py-40 text-center">
          <div className="flex justify-center mb-10">
            <Logo className="h-16 md:h-20 w-auto" invert={false} />
          </div>
          <h1 className="font-display text-4xl md:text-6xl leading-tight">
            Know the price before you go
          </h1>
          <p className="mt-6 max-w-2xl mx-auto text-base md:text-lg opacity-85">
            Daily produce prices from Mbarara and Masaka markets — submitted by farmers and vendors
            on the ground.
          </p>
          <div className="mt-12 flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/prices"
              className="px-8 py-3 rounded-md bg-gold text-charcoal font-medium hover:bg-gold/90 transition-colors duration-200"
            >
              View today's prices
            </Link>
            <Link
              to="/submit"
              className="px-8 py-3 rounded-md border border-gold/60 text-gold hover:bg-gold/10 transition-colors duration-200"
            >
              Submit a price
            </Link>
          </div>
        </div>
      </section>
      <MarketPulse />
      <section className="flex-1 bg-background">
        <div className="mx-auto max-w-7xl px-6 pt-20 pb-10">
          <div className="flex items-end justify-between flex-wrap gap-4 mb-10">
            <div>
              <div className="text-xs uppercase tracking-[0.2em] text-gold mb-2">What's trading</div>
              <h2 className="font-display text-3xl md:text-4xl">Today's market basket</h2>
              <p className="text-muted-foreground mt-2 max-w-xl">
                The produce moving most across Mbarara Central, Nyendo, Kakoba and Masaka Central.
              </p>
            </div>
            <Link
              to="/prices"
              className="text-sm font-medium text-primary hover:underline"
            >
              See every price →
            </Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
            {PRODUCE_GALLERY.map((p, i) => (
              <Link
                key={p.slug}
                to="/prices"
                className="group block card-rise"
                style={{ animationDelay: `${i * 80}ms` }}
              >
                <div className="overflow-hidden rounded-md bg-muted aspect-[4/3]">
                  <img
                    src={p.src}
                    alt={p.name}
                    loading="lazy"
                    width={1024}
                    height={768}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
                <div className="pt-3 flex items-baseline justify-between">
                  <div className="font-display text-lg">{p.name}</div>
                  <div className="text-xs text-muted-foreground">{p.blurb}</div>
                </div>
              </Link>
            ))}
          </div>
        </div>

        <div className="mx-auto max-w-7xl px-6 py-20 grid md:grid-cols-3 gap-10">
          {[
            {
              h: "Built for the ground",
              p: "Prices come from farmers and vendors who actually walk the markets — Mbarara Central, Nyendo, Kakoba and more.",
            },
            {
              h: "One unit, one truth",
              p: "Every entry is price per kilogram so you can compare matoke in Masaka with matoke in Mbarara without converting.",
            },
            {
              h: "Free to browse",
              p: "Anyone can explore prices and trends. Sign in to log a price, save markets, or unlock alerts.",
            },
          ].map((b, i) => (
            <div key={i} className="border-t-2 border-gold pt-6">
              <h3 className="text-xl mb-3">{b.h}</h3>
              <p className="text-muted-foreground leading-relaxed">{b.p}</p>
            </div>
          ))}
        </div>

        <div className="bg-green-soft border-y border-border">
          <div className="mx-auto max-w-7xl px-6 py-16 grid md:grid-cols-2 gap-10 items-center">
            <div>
              <div className="text-xs uppercase tracking-[0.2em] text-primary mb-2">Coming with Premium</div>
              <h2 className="font-display text-3xl md:text-4xl mb-4">Trade smarter, not louder.</h2>
              <p className="text-muted-foreground leading-relaxed mb-6 max-w-xl">
                Free will always cover live prices and weekly trends. Premium adds SMS price alerts,
                historical exports, market-by-market comparison and your own watchlist — built for
                vendors and aggregators who buy by the truckload.
              </p>
              <Link
                to="/auth"
                search={{ mode: "register" }}
                className="inline-block px-6 py-3 rounded-md bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
              >
                Create a free account
              </Link>
              <span className="ml-3 text-xs text-muted-foreground">Premium launches soon · free until then</span>
            </div>
            <div className="grid gap-3">
              {[
                { k: "SMS price alerts", v: "Get pinged when matoke crosses your threshold." },
                { k: "30-day history", v: "Export CSV for any market or produce." },
                { k: "Market comparison", v: "Side-by-side: Mbarara vs Masaka, instantly." },
              ].map((f) => (
                <div
                  key={f.k}
                  className="bg-card border border-border rounded-md p-4"
                  style={{ boxShadow: "0 4px 16px rgba(0,0,0,0.07)" }}
                >
                  <div className="text-sm font-medium">{f.k}</div>
                  <div className="text-xs text-muted-foreground mt-1">{f.v}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
      <footer className="border-t border-border bg-background">
        <div className="mx-auto max-w-7xl px-6 py-8 text-sm text-muted-foreground flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Logo className="h-5 w-auto" />
            <span>· Mbarara & Masaka</span>
          </div>
          <div>© {new Date().getFullYear()} AgriPrice</div>
        </div>
      </footer>
    </div>
  );
}
