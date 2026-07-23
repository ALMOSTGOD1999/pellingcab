import { createFileRoute, Link } from "@tanstack/react-router";
import { Phone, MessageCircle, Star, Car } from "lucide-react";
import driverPhoto from "@/assets/driver.jpg";
import { PageShell } from "@/components/AppShell";
import { mockDriver, vehicles } from "@/lib/mock";
import { useApp } from "@/lib/store";

export const Route = createFileRoute("/driver")({
  head: () => ({ meta: [{ title: "Driver & Vehicle · PellingCab" }] }),
  component: DriverPage,
});

function DriverPage() {
  const id = useApp((s) => s.currentBookingId);
  const b = useApp((s) => s.bookings.find((x) => x.id === id) ?? s.bookings[0]);
  const v = vehicles.find((v) => v.id === (b?.vehicleId ?? "innova"))!;

  return (
    <PageShell title="Driver & vehicle" subtitle="Meet your chauffeur.">
      <div className="grid gap-6 lg:grid-cols-[1fr_1.2fr]">
        <section className="glass rounded-3xl p-6">
          <div className="flex items-center gap-4">
            <img
              src={driverPhoto}
              width={800}
              height={800}
              alt={mockDriver.name}
              loading="lazy"
              className="h-20 w-20 rounded-2xl object-cover ring-2 ring-primary/60"
            />
            <div className="min-w-0">
              <h2 className="font-display text-2xl truncate">{mockDriver.name}</h2>
              <p className="text-xs text-muted-foreground">Chauffeur · {mockDriver.trips} trips</p>
              <p className="mt-1 inline-flex items-center gap-1 text-sm">
                <Star className="h-4 w-4 fill-primary text-primary" /> {mockDriver.rating}
              </p>
            </div>
          </div>
          <div className="mt-5 grid grid-cols-2 gap-2">
            <a
              href={`tel:${mockDriver.phone}`}
              className="rounded-xl gold-gradient px-4 py-3 text-sm font-semibold text-background inline-flex items-center justify-center gap-2"
            >
              <Phone className="h-4 w-4" /> Call
            </a>
            <button className="rounded-xl border border-border px-4 py-3 text-sm inline-flex items-center justify-center gap-2 hover:border-primary">
              <MessageCircle className="h-4 w-4" /> Chat
            </button>
          </div>
          <p className="mt-4 text-xs text-muted-foreground">
            Arriving in ~{" "}
            <span className="text-primary font-semibold">{mockDriver.arrivalMins} min</span>
          </p>
        </section>

        <section className="glass rounded-3xl overflow-hidden">
          <img
            src={v.image}
            alt={v.name}
            width={1200}
            height={800}
            loading="lazy"
            className="w-full aspect-[16/9] object-cover"
          />
          <div className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs uppercase tracking-widest text-primary">{v.category}</p>
                <h3 className="font-display text-2xl mt-1">{v.name}</h3>
              </div>
              <span className="glass rounded-xl px-3 py-2 text-sm font-mono">
                {mockDriver.vehicleNumber}
              </span>
            </div>
            <ul className="mt-4 grid grid-cols-3 gap-2 text-xs">
              <li className="rounded-xl border border-border p-3">
                <p className="text-muted-foreground">Seats</p>
                <p className="text-base font-semibold">{v.seats}</p>
              </li>
              <li className="rounded-xl border border-border p-3">
                <p className="text-muted-foreground">Luggage</p>
                <p className="text-base font-semibold">{v.luggage} bags</p>
              </li>
              <li className="rounded-xl border border-border p-3">
                <p className="text-muted-foreground">AC</p>
                <p className="text-base font-semibold">Yes</p>
              </li>
            </ul>
            <Link
              to="/tracking"
              className="mt-5 w-full inline-flex items-center justify-center gap-2 rounded-2xl gold-gradient px-4 py-3 text-sm font-semibold text-background"
            >
              <Car className="h-4 w-4" /> View live status
            </Link>
          </div>
        </section>
      </div>
    </PageShell>
  );
}
