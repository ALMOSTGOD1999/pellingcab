import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { CalendarClock, MapPin, Navigation, Users } from "lucide-react";
import { useEffect, useMemo } from "react";
import { PageShell } from "@/components/AppShell";
import { SeatMap } from "@/components/SeatMap";
import { occupiedSeatsFor, vehicles } from "@/lib/mock";
import { useApp } from "@/lib/store";

export const Route = createFileRoute("/summary")({
  head: () => ({ meta: [{ title: "Booking summary · PellingCab" }] }),
  component: Summary,
});

function Summary() {
  const form = useApp(s => s.form);
  const vid = useApp(s => s.selectedVehicleId);
  const selectedSeats = useApp(s => s.selectedSeats);
  const resetSeats = useApp(s => s.resetSeats);
  const nav = useNavigate();

  useEffect(() => { resetSeats(); }, [resetSeats, vid]);

  const v = vehicles.find(x => x.id === vid) ?? vehicles[0];
  const occupied = useMemo(() => occupiedSeatsFor(v.id, form.date + form.time), [v.id, form.date, form.time]);

  const base = form.kind === "half" ? v.pricePerHalfDay : v.pricePerFullDay;
  const seatUp = Math.max(0, selectedSeats.length - 1) * 200;
  const fare = base + seatUp;
  const taxes = Math.round(fare * 0.18);
  const total = fare + taxes;

  return (
    <PageShell title="Booking summary" subtitle="Review your trip and pick your seats.">
      <div className="grid gap-6 lg:grid-cols-[1.4fr_1fr]">
        <div className="space-y-6">
          <section className="glass rounded-3xl overflow-hidden">
            <div className="grid sm:grid-cols-[220px_1fr]">
              <img src={v.image} alt={v.name} width={1200} height={800} loading="lazy"
                   className="h-full w-full object-cover aspect-[4/3] sm:aspect-auto" />
              <div className="p-5">
                <p className="text-xs uppercase tracking-widest text-primary">{v.category}</p>
                <h2 className="font-display text-2xl mt-1">{v.name}</h2>
                <ul className="mt-3 text-sm text-muted-foreground space-y-1.5">
                  <li className="flex items-center gap-2"><MapPin className="h-4 w-4 text-primary" /> {form.pickup || "—"}</li>
                  <li className="flex items-center gap-2"><Navigation className="h-4 w-4 text-primary" /> {form.destination || "—"}</li>
                  <li className="flex items-center gap-2"><CalendarClock className="h-4 w-4 text-primary" /> {form.date} · {form.time} · {form.kind === "half" ? "Half day" : "Full day"}</li>
                  <li className="flex items-center gap-2"><Users className="h-4 w-4 text-primary" /> {v.seats} seat capacity</li>
                </ul>
              </div>
            </div>
          </section>

          <section>
            <h3 className="font-display text-xl mb-3">Choose your seats</h3>
            <SeatMap total={v.layout} occupied={occupied} />
          </section>
        </div>

        <aside className="glass rounded-3xl p-6 h-fit sticky top-24">
          <h3 className="font-display text-2xl">Fare breakdown</h3>
          <dl className="mt-4 space-y-2 text-sm">
            <Row k={form.kind === "half" ? "Half-day fare" : "Full-day fare"} v={`₹${base.toLocaleString("en-IN")}`} />
            {seatUp > 0 && <Row k={`Extra seats (${selectedSeats.length - 1})`} v={`₹${seatUp}`} />}
            <Row k="Taxes & fees (18%)" v={`₹${taxes.toLocaleString("en-IN")}`} />
            <hr className="my-2 border-border" />
            <Row k="Total" v={`₹${total.toLocaleString("en-IN")}`} strong />
          </dl>

          <p className="mt-3 text-xs text-muted-foreground">
            Selected seats: {selectedSeats.length === 0 ? "None yet" : selectedSeats.sort((a,b)=>a-b).join(", ")}
          </p>

          <button
            onClick={() => {
              if (selectedSeats.length === 0) return;
              nav({ to: "/payment" });
            }}
            disabled={selectedSeats.length === 0}
            className="mt-6 w-full rounded-2xl gold-gradient px-4 py-3.5 text-sm font-semibold text-background transition hover:brightness-110 active:scale-[0.99] disabled:opacity-40 disabled:cursor-not-allowed"
          >
            Proceed to payment · ₹{total.toLocaleString("en-IN")}
          </button>
          <Link to="/vehicles" className="mt-3 block text-center text-xs text-muted-foreground hover:text-primary">← Change vehicle</Link>
        </aside>
      </div>
    </PageShell>
  );
}

function Row({ k, v, strong }: { k: string; v: string; strong?: boolean }) {
  return (
    <div className={`flex items-center justify-between ${strong ? "text-lg font-semibold" : "text-muted-foreground"}`}>
      <dt>{k}</dt><dd className={strong ? "gold-text" : ""}>{v}</dd>
    </div>
  );
}
