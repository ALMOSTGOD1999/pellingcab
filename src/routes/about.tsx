import { createFileRoute } from "@tanstack/react-router";
import { PageShell } from "@/components/AppShell";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About · PellingCab" },
      {
        name: "description",
        content: "PellingCab is a premium chauffeur-driven car rental service across India.",
      },
    ],
  }),
  component: About,
});

function About() {
  return (
    <PageShell title="About PellingCab" subtitle="A quiet obsession with great rides.">
      <div className="max-w-3xl space-y-6 text-muted-foreground">
        <p>
          PellingCab was built for travellers who care about the details — a spotless cabin, a
          chauffeur who knows the city, a price that doesn't change on you. We operate a hand-picked
          fleet of premium SUVs and sedans across India, driven by professionals we've trained
          ourselves.
        </p>
        <div className="grid gap-4 sm:grid-cols-3">
          {[
            { n: "12k+", l: "Trips completed" },
            { n: "4.9", l: "Average rating" },
            { n: "24/7", l: "Concierge support" },
          ].map((s) => (
            <div key={s.l} className="glass rounded-3xl p-6 text-center">
              <p className="font-display text-4xl gold-text">{s.n}</p>
              <p className="mt-1 text-xs uppercase tracking-widest text-muted-foreground">{s.l}</p>
            </div>
          ))}
        </div>
      </div>
    </PageShell>
  );
}
