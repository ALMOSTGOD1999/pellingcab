import { createFileRoute, Link } from "@tanstack/react-router";
import {
  Calendar,
  Car,
  Clock,
  CreditCard,
  IndianRupee,
  MapPin,
  Phone,
  Route as RouteIcon,
  Star,
  User,
  Users,
} from "lucide-react";
import { PageShell } from "@/components/AppShell";
import { CancellationTimeline } from "@/components/CancellationTimeline";
import { StatusTimeline } from "@/components/StatusTimeline";
import { mockDriver, shuttleRoutes, vehicles } from "@/lib/mock";
import { useApp } from "@/lib/store";

export const Route = createFileRoute("/history/$id")({
  head: () => ({ meta: [{ title: "Booking details · PellingCab" }] }),
  component: Detail,
});

function Detail() {
  const { id } = Route.useParams();
  const b = useApp((s) => s.bookings.find((x) => x.id === id));
  if (!b)
    return (
      <PageShell title="Booking not found">
        <Link to="/history" className="text-primary">
          Back to trips
        </Link>
      </PageShell>
    );
  const v = vehicles.find((v) => v.id === b.vehicleId)!;
  const route = b.routeId ? shuttleRoutes.find((r) => r.id === b.routeId) : undefined;
  const cancelled = !!b.cancellation;
  const created = new Date(b.createdAt);
  const passengers = b.seats.length || 1;
  const perSeat = b.mode === "shuttle" ? Math.round(b.fare / passengers) : undefined;

  return (
    <PageShell
      title={`Booking ${b.id}`}
      subtitle={`${b.form.date} · ${b.form.time} · ${b.mode === "shuttle" ? "Shared shuttle" : "Private rental"}`}
    >
      <div className="grid gap-6 lg:grid-cols-[1.2fr_1fr]">
        <div className="space-y-6">
          {/* Vehicle & route */}
          <div className="glass rounded-3xl overflow-hidden">
            <img
              src={v.image}
              alt=""
              width={1200}
              height={800}
              loading="lazy"
              className="w-full aspect-[16/9] object-cover"
            />
            <div className="p-6">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-xs uppercase tracking-widest text-primary">{v.category}</p>
                  <h3 className="font-display text-2xl">{v.name}</h3>
                </div>
                <span
                  className={`shrink-0 rounded-full border px-3 py-1 text-[11px] uppercase tracking-widest ${cancelled ? "border-destructive/50 text-destructive" : "border-primary/40 text-primary"}`}
                >
                  {cancelled ? "Cancelled" : b.status.replace("_", " ")}
                </span>
              </div>

              <div className="mt-5 grid gap-3 sm:grid-cols-2">
                <Info
                  icon={<MapPin className="h-4 w-4" />}
                  label="Pickup"
                  value={b.form.pickup || route?.from || "—"}
                />
                <Info
                  icon={<MapPin className="h-4 w-4" />}
                  label="Destination"
                  value={b.form.destination || route?.to || "—"}
                />
                <Info
                  icon={<Calendar className="h-4 w-4" />}
                  label="Date"
                  value={b.shuttle?.date ?? b.form.date}
                />
                <Info
                  icon={<Clock className="h-4 w-4" />}
                  label={b.mode === "shuttle" ? "Departure" : "Pickup time"}
                  value={b.shuttle?.departure ?? b.form.time}
                />
                {route && (
                  <>
                    <Info
                      icon={<RouteIcon className="h-4 w-4" />}
                      label="Distance"
                      value={`${route.distanceKm} km`}
                    />
                    <Info
                      icon={<Clock className="h-4 w-4" />}
                      label="Duration"
                      value={`~${route.durationHrs} hrs`}
                    />
                  </>
                )}
                {b.mode === "rental" && (
                  <Info
                    icon={<Car className="h-4 w-4" />}
                    label="Trip type"
                    value={b.form.kind === "half" ? "Half day (up to 6h)" : "Full day (up to 12h)"}
                  />
                )}
                <Info
                  icon={<Users className="h-4 w-4" />}
                  label={b.mode === "shuttle" ? "Seats" : "Passengers"}
                  value={
                    b.seats.length ? `${passengers} · #${b.seats.join(", #")}` : `${passengers}`
                  }
                />
                <Info
                  icon={<Calendar className="h-4 w-4" />}
                  label="Booked on"
                  value={created.toLocaleString()}
                />
              </div>
            </div>
          </div>

          {/* Passenger */}
          <div className="glass rounded-3xl p-6">
            <h3 className="font-display text-xl mb-4">Passenger</h3>
            <div className="grid gap-3 sm:grid-cols-3">
              <Info icon={<User className="h-4 w-4" />} label="Name" value={b.form.name || "—"} />
              <Info
                icon={<Phone className="h-4 w-4" />}
                label="Phone"
                value={b.form.phone || "—"}
              />
              <Info
                icon={<CreditCard className="h-4 w-4" />}
                label="Email"
                value={b.form.email || "—"}
              />
            </div>
          </div>

          {/* Fare breakdown */}
          <div className="glass rounded-3xl p-6">
            <h3 className="font-display text-xl mb-4">Fare breakdown</h3>
            <dl className="grid gap-1.5 text-sm">
              {perSeat !== undefined && (
                <Row
                  k={`Base fare (₹${perSeat.toLocaleString("en-IN")} × ${passengers} seat${passengers > 1 ? "s" : ""})`}
                  v={`₹${b.fare.toLocaleString("en-IN")}`}
                />
              )}
              {perSeat === undefined && (
                <Row k="Base fare" v={`₹${b.fare.toLocaleString("en-IN")}`} />
              )}
              <Row k="Taxes & fees (18% GST)" v={`₹${b.taxes.toLocaleString("en-IN")}`} />
              <hr className="my-2 border-border" />
              <div className="flex justify-between text-lg font-semibold">
                <dt>Total paid</dt>
                <dd className="gold-text">₹{b.total.toLocaleString("en-IN")}</dd>
              </div>
              <Row
                k="Payment method"
                v={`${b.payment.method.toUpperCase()} · ${b.payment.status}`}
              />
              {cancelled && (
                <div className="mt-2 flex justify-between text-sm rounded-2xl border border-primary/30 bg-primary/5 px-3 py-2">
                  <dt className="text-muted-foreground">
                    Refund ({b.cancellation!.refundPercent}%) — {b.cancellation!.policyLabel}
                  </dt>
                  <dd className="gold-text font-semibold">
                    ₹{b.cancellation!.refundAmount.toLocaleString("en-IN")}
                  </dd>
                </div>
              )}
            </dl>

            <div className="mt-6 grid gap-2 sm:grid-cols-3">
              {!cancelled && (
                <Link
                  to="/tracking"
                  className="rounded-xl gold-gradient px-4 py-2.5 text-sm font-semibold text-background text-center"
                >
                  Track live
                </Link>
              )}
              <Link
                to="/feedback"
                className="rounded-xl border border-border px-4 py-2.5 text-sm text-center hover:border-primary"
              >
                Rate trip
              </Link>
              {!cancelled && (
                <Link
                  to="/refund"
                  search={{ id: b.id }}
                  className="rounded-xl border border-border px-4 py-2.5 text-sm text-center hover:border-destructive hover:text-destructive"
                >
                  Cancel booking
                </Link>
              )}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          {/* Driver */}
          {!cancelled && (
            <div className="glass rounded-3xl p-6">
              <h3 className="font-display text-xl mb-4">Driver</h3>
              <div className="flex items-center gap-4">
                <div className="grid h-14 w-14 place-items-center rounded-full gold-gradient text-background font-display text-xl">
                  {mockDriver.name.charAt(0)}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="font-medium truncate">{mockDriver.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {mockDriver.vehicleNumber} · {mockDriver.trips.toLocaleString("en-IN")} trips
                  </p>
                  <p className="mt-0.5 inline-flex items-center gap-1 text-xs">
                    <Star className="h-3 w-3 fill-primary text-primary" /> {mockDriver.rating}
                  </p>
                </div>
                <a
                  href={`tel:${mockDriver.phone.replace(/\s/g, "")}`}
                  className="rounded-full gold-gradient p-2.5 text-background"
                  aria-label="Call driver"
                >
                  <Phone className="h-4 w-4" />
                </a>
              </div>
              <p className="mt-3 text-xs text-muted-foreground">
                Arriving in ~{mockDriver.arrivalMins} min
              </p>
            </div>
          )}

          {cancelled && (
            <div className="glass rounded-3xl p-6">
              <div className="flex items-center justify-between">
                <h3 className="font-display text-xl">Cancellation status</h3>
                <span className="rounded-full border border-primary/40 px-2.5 py-0.5 text-[11px] uppercase tracking-widest text-primary">
                  {b.cancellation!.policyLabel}
                </span>
              </div>
              <p className="mt-1 text-xs text-muted-foreground">
                Requested {new Date(b.cancellation!.requestedAt).toLocaleString()}
              </p>
              {b.cancellation!.reason && (
                <p className="mt-2 text-sm">
                  <span className="text-muted-foreground">Reason:</span> {b.cancellation!.reason}
                </p>
              )}
              <div className="mt-5">
                <CancellationTimeline status={b.cancellation!.status} />
              </div>
            </div>
          )}

          <div className="glass rounded-3xl p-6">
            <h3 className="font-display text-xl mb-4">Trip status</h3>
            <StatusTimeline status={b.status} />
          </div>

          <div className="glass rounded-3xl p-6">
            <h3 className="font-display text-lg mb-2 flex items-center gap-2">
              <IndianRupee className="h-4 w-4" /> Need help?
            </h3>
            <p className="text-sm text-muted-foreground">
              Reach our 24×7 support for any changes, invoices, or lost items.
            </p>
            <Link
              to="/support"
              className="mt-3 inline-flex rounded-xl border border-border px-4 py-2 text-sm hover:border-primary"
            >
              Contact support
            </Link>
          </div>
        </div>
      </div>
    </PageShell>
  );
}

function Row({ k, v }: { k: string; v: string }) {
  return (
    <div className="flex justify-between gap-4 border-b border-border/50 py-1.5">
      <dt className="text-muted-foreground">{k}</dt>
      <dd className="text-right">{v}</dd>
    </div>
  );
}

function Info({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-border/60 bg-card/40 px-3.5 py-2.5">
      <p className="flex items-center gap-1.5 text-[11px] uppercase tracking-widest text-muted-foreground">
        {icon} {label}
      </p>
      <p className="mt-0.5 text-sm truncate">{value}</p>
    </div>
  );
}
