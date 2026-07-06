import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Clock, Shield, Sparkles, Star, Users, MapPin } from "lucide-react";
import heroCar from "@/assets/hero-car.jpg";
import { Navbar, Footer, MobileTabBar } from "@/components/AppShell";
import { useApp } from "@/lib/store";
import { dict } from "@/lib/i18n";
import { shuttleRoutes } from "@/lib/mock";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "PellingCab · Shared shuttle & premium chauffeur travel" },
      { name: "description", content: "Book a seat on scheduled inter-city shuttles or rent a chauffeured luxury car half-day / full-day across India." },
      { property: "og:title", content: "PellingCab · Shared shuttle & premium chauffeur travel" },
    ],
  }),
  component: Home,
});

function Home() {
  const lang = useApp(s => s.lang);
  const t = dict[lang];
  const setMode = useApp(s => s.setMode);
  const setShuttle = useApp(s => s.setShuttle);

  const featured = shuttleRoutes;

  return (
    <>
      <Navbar />
      <main className="animate-float-up">
        {/* HERO */}
        <section className="relative overflow-hidden grain">
          <img src={heroCar} alt="" width={1600} height={900}
            className="absolute inset-0 h-full w-full object-cover opacity-45" />
          <div className="absolute inset-0 bg-gradient-to-b from-background/60 via-background/70 to-background" />
          <div className="absolute -top-40 -right-40 h-[500px] w-[500px] rounded-full opacity-40"
            style={{ background: "radial-gradient(closest-side, color-mix(in oklab, var(--gold) 45%, transparent), transparent)" }} />

          <div className="relative mx-auto max-w-6xl px-4 sm:px-6 pt-16 pb-20 sm:pt-24 sm:pb-28">
            <span className="glass inline-flex items-center gap-2 rounded-full px-3.5 py-1.5 text-xs uppercase tracking-[0.25em] text-primary">
              <Sparkles className="h-3.5 w-3.5" /> Shared shuttle · Chauffeured luxury
            </span>
            <h1 className="mt-5 max-w-3xl font-display text-5xl sm:text-7xl leading-[1.02]">
              Book a <em className="gold-text not-italic">seat</em>,<br />
              share the road.
            </h1>
            <p className="mt-5 max-w-xl text-base sm:text-lg text-muted-foreground">
              {t.tagline} Scheduled shuttles between Pelling and Bagdogra Airport — or rent a private cab for the day.
            </p>

            {/* Primary CTAs */}
            <div className="mt-10 grid gap-4 sm:grid-cols-[1.5fr_1fr] max-w-3xl">
              <Link
                to="/shuttle"
                onClick={() => setMode("shuttle")}
                className="group glass rounded-3xl p-5 sm:p-6 transition hover:-translate-y-1 hover:shadow-glow border border-primary/40"
              >
                <div className="flex items-start justify-between">
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 text-xs uppercase tracking-widest text-primary">
                      <Users className="h-3.5 w-3.5" /> Shared shuttle · Popular
                    </div>
                    <h3 className="mt-2 font-display text-2xl sm:text-3xl">Book a seat</h3>
                    <p className="mt-1 text-sm text-muted-foreground">
                      Pelling ⇄ Bagdogra Airport — from ₹1,299 per seat.
                    </p>
                  </div>
                  <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full gold-gradient text-background transition group-hover:translate-x-0.5">
                    <ArrowRight className="h-5 w-5" />
                  </span>
                </div>
              </Link>

              <Link
                to="/book"
                onClick={() => setMode("rental")}
                className="group glass rounded-3xl p-5 sm:p-6 transition hover:-translate-y-1 hover:shadow-glow"
              >
                <div className="flex items-start justify-between">
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 text-xs uppercase tracking-widest text-primary">
                      <Clock className="h-3.5 w-3.5" /> Half / Full day
                    </div>
                    <h3 className="mt-2 font-display text-2xl sm:text-3xl">Rent a cab</h3>
                    <p className="mt-1 text-sm text-muted-foreground">Private chauffeur, from ₹1,499.</p>
                  </div>
                  <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full border border-border text-primary transition group-hover:translate-x-0.5">
                    <ArrowRight className="h-5 w-5" />
                  </span>
                </div>
              </Link>
            </div>

            {/* trust row */}
            <div className="mt-10 flex flex-wrap items-center gap-6 text-xs text-muted-foreground">
              <span className="inline-flex items-center gap-1.5"><Star className="h-3.5 w-3.5 fill-primary text-primary" /> 4.9 · 12k+ trips</span>
              <span className="inline-flex items-center gap-1.5"><Shield className="h-3.5 w-3.5 text-primary" /> Verified chauffeurs</span>
              <span className="inline-flex items-center gap-1.5"><Sparkles className="h-3.5 w-3.5 text-primary" /> Sanitised cabins</span>
            </div>
          </div>
        </section>

        {/* POPULAR ROUTES */}
        <section className="mx-auto max-w-6xl px-4 sm:px-6 py-16">
          <div className="flex items-end justify-between gap-4 mb-6">
            <div>
              <p className="text-xs uppercase tracking-widest text-primary">Airport shuttle</p>
              <h2 className="mt-1 font-display text-3xl sm:text-4xl">Pelling ⇄ Bagdogra</h2>
            </div>
            <Link to="/shuttle" className="text-sm text-muted-foreground hover:text-primary hidden sm:inline-flex items-center gap-1">
              All routes <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            {featured.map(r => (
              <Link
                key={r.id}
                to="/shuttle"
                onClick={() => { setMode("shuttle"); setShuttle({ routeId: r.id, departure: "" }); }}
                className="group glass rounded-3xl p-5 transition hover:-translate-y-1 hover:shadow-glow"
              >
                <div className="flex items-center gap-2 text-sm font-medium">
                  <MapPin className="h-4 w-4 text-primary" />
                  <span className="truncate">{r.from}</span>
                  <ArrowRight className="h-3.5 w-3.5 text-primary" />
                  <span className="truncate">{r.to}</span>
                </div>
                <p className="mt-2 text-xs text-muted-foreground">
                  {r.distanceKm} km · {r.durationHrs} h · {r.departures.length} departures/day
                </p>
                <div className="mt-4 flex items-end justify-between">
                  <span className="text-[11px] uppercase tracking-widest text-muted-foreground">from</span>
                  <span className="gold-text text-xl font-semibold">₹{r.pricePerSeat.toLocaleString("en-IN")}</span>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* FEATURES */}
        <section className="mx-auto max-w-6xl px-4 sm:px-6 pb-16">
          <div className="grid gap-4 sm:grid-cols-3">
            {[
              { t: "Transparent fares", d: "See taxes and totals before you pay. No surge, no surprises." },
              { t: "Live tracking", d: "Watch your shuttle arrive in real time with our status timeline." },
              { t: "24/7 concierge", d: "Talk to a real person any hour of the day, in English or Hindi." },
            ].map(f => (
              <div key={f.t} className="glass rounded-3xl p-6">
                <h3 className="font-display text-2xl">{f.t}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{f.d}</p>
              </div>
            ))}
          </div>
        </section>
      </main>
      <Footer />
      <MobileTabBar />
    </>
  );
}
