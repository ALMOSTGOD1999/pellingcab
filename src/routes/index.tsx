import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Clock, Shield, Sparkles, Star } from "lucide-react";
import heroCar from "@/assets/hero-car.jpg";
import { Navbar, Footer, MobileTabBar } from "@/components/AppShell";
import { useApp } from "@/lib/store";
import { dict } from "@/lib/i18n";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "PellingCab · Premium chauffeured travel" },
      { name: "description", content: "Book half-day and full-day chauffeur-driven premium cars across India — luxury travel, transparent pricing." },
      { property: "og:title", content: "PellingCab · Premium chauffeured travel" },
    ],
  }),
  component: Home,
});

function Home() {
  const lang = useApp(s => s.lang);
  const t = dict[lang];
  const setForm = useApp(s => s.setForm);

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

          <div className="relative mx-auto max-w-6xl px-4 sm:px-6 pt-16 pb-24 sm:pt-24 sm:pb-36">
            <span className="glass inline-flex items-center gap-2 rounded-full px-3.5 py-1.5 text-xs uppercase tracking-[0.25em] text-primary">
              <Sparkles className="h-3.5 w-3.5" /> Chauffeured luxury
            </span>
            <h1 className="mt-5 max-w-3xl font-display text-5xl sm:text-7xl leading-[1.02]">
              Ride like <em className="gold-text not-italic">royalty</em>,<br />
              from pickup to destination.
            </h1>
            <p className="mt-5 max-w-xl text-base sm:text-lg text-muted-foreground">
              {t.tagline} Half-day and full-day rentals in premium SUVs, driven by trained chauffeurs.
            </p>

            {/* Booking CTAs */}
            <div className="mt-10 grid gap-4 sm:grid-cols-2 max-w-3xl">
              {(["half", "full"] as const).map(kind => (
                <Link
                  key={kind}
                  to="/book"
                  onClick={() => setForm({ kind })}
                  className="group glass rounded-3xl p-5 sm:p-6 transition hover:-translate-y-1 hover:shadow-glow"
                >
                  <div className="flex items-start justify-between">
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 text-xs uppercase tracking-widest text-primary">
                        <Clock className="h-3.5 w-3.5" /> {kind === "half" ? "6 hours" : "12 hours"}
                      </div>
                      <h3 className="mt-2 font-display text-2xl sm:text-3xl">
                        {kind === "half" ? t.halfDay : t.fullDay}
                      </h3>
                      <p className="mt-1 text-sm text-muted-foreground">
                        {kind === "half" ? t.halfDayDesc : t.fullDayDesc}
                      </p>
                    </div>
                    <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full gold-gradient text-background transition group-hover:translate-x-0.5">
                      <ArrowRight className="h-5 w-5" />
                    </span>
                  </div>
                  <div className="mt-5 flex items-center gap-4 text-xs text-muted-foreground">
                    <span>from</span>
                    <span className="text-lg font-semibold gold-text">
                      ₹{kind === "half" ? "1,499" : "2,699"}
                    </span>
                  </div>
                </Link>
              ))}
            </div>

            {/* trust row */}
            <div className="mt-10 flex flex-wrap items-center gap-6 text-xs text-muted-foreground">
              <span className="inline-flex items-center gap-1.5"><Star className="h-3.5 w-3.5 fill-primary text-primary" /> 4.9 · 12k+ trips</span>
              <span className="inline-flex items-center gap-1.5"><Shield className="h-3.5 w-3.5 text-primary" /> Verified chauffeurs</span>
              <span className="inline-flex items-center gap-1.5"><Sparkles className="h-3.5 w-3.5 text-primary" /> Sanitised cabins</span>
            </div>
          </div>
        </section>

        {/* FEATURES */}
        <section className="mx-auto max-w-6xl px-4 sm:px-6 py-16">
          <div className="grid gap-4 sm:grid-cols-3">
            {[
              { t: "Transparent fares", d: "See taxes and totals before you pay. No surge, no surprises." },
              { t: "Live tracking", d: "Watch your driver arrive in real time with our status timeline." },
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
