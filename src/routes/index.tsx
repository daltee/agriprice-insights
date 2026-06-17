import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteHeader } from "@/components/SiteHeader";
import { PriceTicker } from "@/components/PriceTicker";
import { Logo } from "@/components/Logo";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "AgriPrice — Know the price before you go" },
      { name: "description", content: "Daily farm produce prices for markets in Mbarara and Masaka, Uganda. Submitted by local farmers, vendors and buyers." },
      { property: "og:title", content: "AgriPrice — Know the price before you go" },
      { property: "og:description", content: "Daily farm produce prices across Mbarara and Masaka markets." },
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
          style={{ background: "radial-gradient(ellipse at top, rgba(0,0,0,0) 0%, rgba(0,0,0,0.45) 100%)" }}
        />
        <div className="relative mx-auto max-w-5xl px-6 py-28 md:py-40 text-center">
          <div className="flex justify-center mb-10">
            <Logo className="h-16 md:h-20 w-auto" invert={false} />
          </div>
          <h1 className="font-display text-4xl md:text-6xl leading-tight">
            Know the price before you go
          </h1>
          <p className="mt-6 max-w-2xl mx-auto text-base md:text-lg opacity-85">
            Daily produce prices from Mbarara and Masaka markets — submitted by farmers and vendors on the ground.
          </p>
          <div className="mt-12 flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/prices" className="px-8 py-3 rounded-md bg-gold text-charcoal font-medium hover:bg-gold/90 transition-colors duration-200">
              View today's prices
            </Link>
            <Link to="/submit" className="px-8 py-3 rounded-md border border-gold/60 text-gold hover:bg-gold/10 transition-colors duration-200">
              Submit a price
            </Link>
          </div>
        </div>
      </section>
      <PriceTicker />
      <section className="flex-1 bg-background">
        <div className="mx-auto max-w-6xl px-6 py-20 grid md:grid-cols-3 gap-10">
          {[
            { h: "Built for the ground", p: "Prices come from farmers and vendors who actually walk the markets — Mbarara Central, Nyendo, Kakoba and more." },
            { h: "One unit, one truth", p: "Every entry is price per kilogram so you can compare matoke in Masaka with matoke in Mbarara without converting." },
            { h: "Free to use", p: "Anyone can browse prices. Sign in to log a price, follow trends, or manage your market entries." },
          ].map((b, i) => (
            <div key={i} className="border-t-2 border-gold pt-6">
              <h3 className="text-xl mb-3">{b.h}</h3>
              <p className="text-muted-foreground leading-relaxed">{b.p}</p>
            </div>
          ))}
        </div>
      </section>
      <footer className="border-t border-border bg-background">
        <div className="mx-auto max-w-7xl px-6 py-8 text-sm text-muted-foreground flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3"><Logo className="h-5 w-auto" /><span>· Mbarara & Masaka</span></div>
          <div>© {new Date().getFullYear()} AgriPrice</div>
        </div>
      </footer>
    </div>
  );
}
