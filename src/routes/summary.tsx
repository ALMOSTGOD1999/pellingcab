import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { CalendarClock, Clock, MapPin, Navigation, Users } from "lucide-react";
import { useEffect, useMemo } from "react";
import { PageShell } from "@/components/AppShell";
import { SeatMap } from "@/components/SeatMap";
import { occupiedSeatsFor, shuttleRoutes, vehicles } from "@/lib/mock";
import { useApp } from "@/lib/store";

export const Route = createFileRoute("/summary")({
  head: () => ({ meta: [{ title: "Booking summary · PellingCab" }] }),
  component: Summary,
});

function Summary() {
  const mode = useApp(s => s.mode);
  const form = useApp(s => s.form);
  const shuttle = useApp(s => s.shuttle);
  const vid = useApp(s => s.selectedVehicleId);
  const selectedSeats = useApp(s => s.selectedSeats);
  const resetSeats = useApp(s => s.resetSeats);
  const nav = useNavigate();

  useEffect(() => { resetSeats(); }, [resetSeats, vid]);

  const shuttleRoute = shuttleRoutes.find(r => r.id === shuttle.routeId);
  const v = vehicles.find(x => x.id === vid) ?? vehicles[0];
  const dateKey = mode === "shuttle" ? shuttle.date + shuttle.departure : form.date + form.time;
  const occupied = useMemo(() => occupiedSeatsFor(v.id, dateKey), [v.id, dateKey]);

  // Fare
  let fare = 0;
  let seatUp = 0;
  let base = 0;
  if (mode === "shuttle" && shuttleRoute) {
    base = shuttleRoute.pricePerSeat;
    fare = base * Math.max(1, selectedSeats.length);
  } else {
    base = form.kind === "half" ? v.pricePerHalfDay : v.pricePerFullDay;
    seatUp = Math.max(0, selectedSeats.length - 1) * 200;
    fare = base + seatUp;
  }
  const taxes = Math.round(fare * 0.18);
  const total = fare + taxes;

  const routeVehicle = shuttleRoute ? vehicles.find(vh => vh.id === shuttleRoute.vehicleId) ?? v : v;
  const layoutVehicle = mode === "shuttle" ? routeVehicle : v;

  return (
    <PageShell title={mode === "shuttle" ? "Choose your seats" : "Booking summary"} subtitle={mode === "shuttle" ? "Green seats are free, gold are yours. Book multiple to travel with family." : "Review your trip and pick your seats."}>
      <div className="grid gap-6 lg:grid-cols-[1.4fr_1fr]">
        <div className="space-y-6">
          <section className="glass rounded-3xl overflow-hidden">
            <div className="grid sm:grid-cols-[220px_1fr]">
              <img src={layoutVehicle.image} alt={layoutVehicle.name} width={1200} height={800} loading="lazy"
                   className="h-full w-full object-cover aspect-[4/3] sm:aspect-auto" />
              <div className="p-5">
                <p className="text-xs uppercase tracking-widest text-primary">
                  {mode === "shuttle" ? "Shared shuttle" : layoutVehicle.category}
                </p>
                <h2 className="font-display text-2xl mt-1">
                  {mode === "shuttle" && shuttleRoute
                    ? `${shuttleRoute.from} → ${shuttleRoute.to}`
                    : layoutVehicle.name}
                </h2>
                <ul className="mt-3 text-sm text-muted-foreground space-y-1.5">
                  {mode === "shuttle" && shuttleRoute ? (
                    <>
                      <li className="flex items-center gap-2"><MapPin className="h-4 w-4 text-primary" /> Boarding: {shuttleRoute.from}</li>
                      <li className="flex items-center gap-2"><Navigation className="h-4 w-4 text-primary" /> Drop: {shuttleRoute.to}</li>
                      <li className="flex items-center gap-2"><CalendarClock className="h-4 w-4 text-primary" /> {shuttle.date} · Departs {shuttle.departure}</li>
                      <li className="flex items-center gap-2"><Clock className="h-4 w-4 text-primary" /> {shuttleRoute.distanceKm} km · ~{shuttleRoute.durationHrs} h · {layoutVehicle.name}</li>
                    </>
                  ) : (
                    <>
                      <li className="flex items-center gap-2"><MapPin className="h-4 w-4 text-primary" /> {form.pickup || "—"}</li>
                      <li className="flex items-center gap-2"><Navigation className="h-4 w-4 text-primary" /> {form.destination || "—"}</li>
                      <li className="flex items-center gap-2"><CalendarClock className="h-4 w-4 text-primary" /> {form.date} · {form.time} · {form.kind === "half" ? "Half day" : "Full day"}</li>
                      <li className="flex items-center gap-2"><Users className="h-4 w-4 text-primary" /> {layoutVehicle.seats} seat capacity</li>
                    </>
                  )}
                </ul>
              </div>
            </div>
          </section>

          <section>
            <h3 className="font-display text-xl mb-3">
              {mode === "shuttle" ? "Pick your seat(s)" : "Choose your seats"}
            </h3>
            <SeatMap total={layoutVehicle.layout} occupied={occupied} />
          </section>
        </div>

        <aside className="glass rounded-3xl p-6 h-fit lg:sticky lg:top-24">
          <h3 className="font-display text-2xl">Fare breakdown</h3>
          <dl className="mt-4 space-y-2 text-sm">
            {mode === "shuttle" ? (
              <Row
                k={`Seat fare (${Math.max(1, selectedSeats.length)} × ₹${base})`}
                v={`₹${fare.toLocaleString("en-IN")}`}
              />
            ) : (
              <>
                <Row k={form.kind === "half" ? "Half-day fare" : "Full-day fare"} v={`₹${base.toLocaleString("en-IN")}`} />
                {seatUp > 0 && <Row k={`Extra seats (${selectedSeats.length - 1})`} v={`₹${seatUp}`} />}
              </>
            )}
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
          <Link
            to={mode === "shuttle" ? "/shuttle" : "/vehicles"}
            className="mt-3 block text-center text-xs text-muted-foreground hover:text-primary"
          >
            ← {mode === "shuttle" ? "Change route or time" : "Change vehicle"}
          </Link>
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
