import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { ArrowRight, CalendarClock, Clock, Mail, MapPin, Phone, User, Users } from "lucide-react";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import { PageShell } from "@/components/AppShell";
import { Field, TextInput } from "@/components/Field";
import { shuttleRoutes, vehicles } from "@/lib/mock";
import { useApp } from "@/lib/store";

export const Route = createFileRoute("/shuttle")({
  head: () => ({ meta: [{ title: "Book a seat · PellingCab Shuttle" }] }),
  component: Shuttle,
});

function Shuttle() {
  const nav = useNavigate();
  const shuttle = useApp(s => s.shuttle);
  const setShuttle = useApp(s => s.setShuttle);
  const setMode = useApp(s => s.setMode);
  const setVehicle = useApp(s => s.setVehicle);
  const setForm = useApp(s => s.setForm);
  const form = useApp(s => s.form);
  const resetSeats = useApp(s => s.resetSeats);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const selectedRoute = useMemo(
    () => shuttleRoutes.find(r => r.id === shuttle.routeId),
    [shuttle.routeId],
  );
  const routeVehicle = selectedRoute
    ? vehicles.find(v => v.id === selectedRoute.vehicleId)
    : undefined;

  function proceed(e: React.FormEvent) {
    e.preventDefault();
    const err: Record<string, string> = {};
    if (!shuttle.routeId) err.route = "Pick a route";
    if (!shuttle.departure) err.dep = "Pick a departure time";
    if (!form.name.trim()) err.name = "Enter your name";
    if (!/^\S+@\S+\.\S+$/.test(form.email)) err.email = "Enter a valid email";
    if (!/^\+?\d[\d\s-]{8,}$/.test(form.phone)) err.phone = "Enter a valid phone";
    setErrors(err);
    if (Object.keys(err).length) { toast.error("Please fix the highlighted fields"); return; }

    // wire into booking state so /summary can render the shuttle seat picker
    setMode("shuttle");
    setVehicle(selectedRoute!.vehicleId);
    setForm({
      pickup: selectedRoute!.from,
      destination: selectedRoute!.to,
      date: shuttle.date,
      time: shuttle.departure,
    });
    resetSeats();
    toast.success("Trip details saved");
    nav({ to: "/summary" });
  }

  return (
    <PageShell
      title="Book a seat"
      subtitle="Share the ride, split the fare — scheduled shuttle departures on our most-loved routes."
    >
      <form onSubmit={proceed} className="grid gap-6 lg:grid-cols-[1.5fr_1fr]">
        <div className="space-y-6">
          {/* Step 1 — route */}
          <section className="glass rounded-3xl p-5 sm:p-7">
            <StepHeader n={1} title="Choose your route" />
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              {shuttleRoutes.map(r => {
                const active = shuttle.routeId === r.id;
                return (
                  <button
                    key={r.id}
                    type="button"
                    onClick={() => setShuttle({ routeId: r.id, departure: "" })}
                    className={`text-left rounded-2xl border p-4 transition ${
                      active
                        ? "border-primary/80 bg-primary/5 shadow-glow"
                        : "border-border bg-card/50 hover:border-primary/40"
                    }`}
                  >
                    <div className="flex items-center gap-2 text-sm font-medium">
                      <span className="truncate">{r.from}</span>
                      <ArrowRight className="h-4 w-4 shrink-0 text-primary" />
                      <span className="truncate">{r.to}</span>
                      {r.scenic && (
                        <span className="ml-auto shrink-0 rounded-full border border-primary/40 px-2 py-0.5 text-[10px] uppercase tracking-widest text-primary">
                          Scenic
                        </span>
                      )}
                    </div>
                    <div className="mt-2 flex items-center justify-between text-xs text-muted-foreground">
                      <span>{r.distanceKm} km · {r.durationHrs} h</span>
                      <span className="gold-text text-sm font-semibold">
                        ₹{r.pricePerSeat.toLocaleString("en-IN")}/seat
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
            {errors.route && <p className="mt-2 text-xs text-destructive">{errors.route}</p>}
          </section>

          {/* Step 2 — date + departure */}
          <section className="glass rounded-3xl p-5 sm:p-7">
            <StepHeader n={2} title="Pick a date & departure" />
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <Field label="Travel date" icon={<CalendarClock className="h-4 w-4" />}>
                <TextInput
                  type="date"
                  value={shuttle.date}
                  min={new Date().toISOString().slice(0, 10)}
                  onChange={e => setShuttle({ date: e.target.value })}
                />
              </Field>
              <div>
                <span className="mb-1.5 block text-xs uppercase tracking-widest text-muted-foreground">Departure time</span>
                <div className="flex flex-wrap gap-2">
                  {(selectedRoute?.departures ?? []).map(t => {
                    const active = shuttle.departure === t;
                    return (
                      <button
                        key={t}
                        type="button"
                        onClick={() => setShuttle({ departure: t })}
                        className={`inline-flex items-center gap-1.5 rounded-full border px-3.5 py-2 text-sm transition ${
                          active
                            ? "border-transparent gold-gradient text-background shadow-glow"
                            : "border-border bg-card/50 text-muted-foreground hover:text-foreground"
                        }`}
                      >
                        <Clock className="h-3.5 w-3.5" />
                        {t}
                      </button>
                    );
                  })}
                  {!selectedRoute && (
                    <p className="text-xs text-muted-foreground">Pick a route to see today's departures.</p>
                  )}
                </div>
                {errors.dep && <p className="mt-2 text-xs text-destructive">{errors.dep}</p>}
              </div>
            </div>
          </section>

          {/* Step 3 — passenger */}
          <section className="glass rounded-3xl p-5 sm:p-7">
            <StepHeader n={3} title="Passenger details" />
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <Field label="Full name" icon={<User className="h-4 w-4" />} error={errors.name}>
                <TextInput placeholder="Aarav Kapoor" value={form.name} onChange={e => setForm({ name: e.target.value })} />
              </Field>
              <Field label="Phone number" icon={<Phone className="h-4 w-4" />} error={errors.phone}>
                <TextInput placeholder="+91 98110 00000" value={form.phone} onChange={e => setForm({ phone: e.target.value })} />
              </Field>
              <Field label="Email" icon={<Mail className="h-4 w-4" />} error={errors.email}>
                <TextInput type="email" placeholder="you@email.com" value={form.email} onChange={e => setForm({ email: e.target.value })} />
              </Field>
            </div>
          </section>

          <button
            type="submit"
            className="w-full rounded-2xl gold-gradient px-5 py-4 text-sm font-semibold text-background transition hover:brightness-110 active:scale-[0.99]"
          >
            Continue to seat selection
          </button>
        </div>

        <aside className="glass rounded-3xl p-6 h-fit lg:sticky lg:top-24">
          <h3 className="font-display text-2xl">Your shuttle</h3>
          {selectedRoute ? (
            <div className="mt-4 space-y-3 text-sm">
              <p className="flex items-center gap-2"><MapPin className="h-4 w-4 text-primary" /> {selectedRoute.from} → {selectedRoute.to}</p>
              <p className="flex items-center gap-2 text-muted-foreground"><CalendarClock className="h-4 w-4 text-primary" /> {shuttle.date} · {shuttle.departure || "select time"}</p>
              {routeVehicle && (
                <p className="flex items-center gap-2 text-muted-foreground"><Users className="h-4 w-4 text-primary" /> {routeVehicle.name} · up to {routeVehicle.layout - 1} seats</p>
              )}
              <hr className="border-border" />
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Fare per seat</span>
                <span className="gold-text text-lg font-semibold">₹{selectedRoute.pricePerSeat.toLocaleString("en-IN")}</span>
              </div>
              <p className="text-xs text-muted-foreground">You'll pick individual seats in the next step. Book multiple to travel with family.</p>
            </div>
          ) : (
            <p className="mt-4 text-sm text-muted-foreground">Select a route to see fare and vehicle details.</p>
          )}
          <Link to="/book" className="mt-6 block text-center text-xs text-muted-foreground hover:text-primary">
            Need a private cab instead? Rent half/full day →
          </Link>
        </aside>
      </form>
    </PageShell>
  );
}

function StepHeader({ n, title }: { n: number; title: string }) {
  return (
    <div className="flex items-center gap-3">
      <span className="grid h-8 w-8 place-items-center rounded-full gold-gradient text-background text-sm font-semibold">
        {n}
      </span>
      <h2 className="font-display text-xl">{title}</h2>
    </div>
  );
}
