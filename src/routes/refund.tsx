import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { AlertTriangle, ArrowRight, Clock, ShieldCheck } from "lucide-react";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import { z } from "zod";
import { PageShell } from "@/components/AppShell";
import { refundPolicyFor, shuttleRoutes } from "@/lib/mock";
import { useApp } from "@/lib/store";

const search = z.object({ id: z.string().optional() });

export const Route = createFileRoute("/refund")({
  head: () => ({ meta: [{ title: "Cancel shuttle · PellingCab" }] }),
  validateSearch: search,
  component: Refund,
});

const REASONS = [
  { v: "plans_changed",   l: "Plans changed" },
  { v: "wrong_time",      l: "Wrong pickup time" },
  { v: "flight_changed",  l: "Flight rescheduled / cancelled" },
  { v: "found_alternative", l: "Found alternative transport" },
  { v: "driver_issue",    l: "Driver / vehicle issue" },
  { v: "other",           l: "Other" },
];

function hoursUntil(dateISO: string, timeHHMM: string): number {
  const dep = new Date(`${dateISO}T${timeHHMM || "00:00"}:00`);
  return (dep.getTime() - Date.now()) / 36e5;
}

function Refund() {
  const { id } = Route.useSearch();
  const nav = useNavigate();
  const bookings = useApp(s => s.bookings);
  const updateBooking = useApp(s => s.updateBooking);

  const shuttleBookings = bookings.filter(b => b.mode === "shuttle" && b.status !== "cancelled" && b.status !== "completed");
  const initial = id ?? shuttleBookings[0]?.id ?? "";
  const [selectedId, setSelectedId] = useState(initial);
  const [reason, setReason] = useState("plans_changed");
  const [notes, setNotes] = useState("");

  const booking = bookings.find(b => b.id === selectedId);
  const route = booking?.shuttle?.routeId ? shuttleRoutes.find(r => r.id === booking.shuttle!.routeId) : undefined;

  const { hrs, policy, refundAmount } = useMemo(() => {
    if (!booking) return { hrs: 0, policy: refundPolicyFor(0), refundAmount: 0 };
    const dateISO = booking.shuttle?.date ?? booking.form.date;
    const time = booking.shuttle?.departure ?? booking.form.time;
    const hrs = hoursUntil(dateISO, time);
    const policy = refundPolicyFor(hrs);
    return { hrs, policy, refundAmount: Math.round((booking.total * policy.percent) / 100) };
  }, [booking]);

  if (bookings.length === 0) {
    return (
      <PageShell title="Nothing to cancel" subtitle="You don't have any bookings yet.">
        <Link to="/shuttle" className="inline-flex rounded-2xl gold-gradient px-5 py-2.5 text-sm font-semibold text-background">Book a shuttle</Link>
      </PageShell>
    );
  }

  function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!booking) return;
    updateBooking(booking.id, {
      status: "cancelled",
      cancellation: {
        status: "requested",
        reason,
        notes: notes.trim() || undefined,
        requestedAt: new Date().toISOString(),
        refundAmount,
        refundPercent: policy.percent,
        policyLabel: policy.label,
      },
    });
    toast.success(refundAmount > 0 ? `Refund of ₹${refundAmount.toLocaleString("en-IN")} requested` : "Cancellation submitted");
    nav({ to: "/history/$id", params: { id: booking.id } });
  }

  return (
    <PageShell
      title="Cancel your shuttle"
      subtitle="Review the refund policy before you confirm — cancellations closer to departure receive less back."
    >
      <form onSubmit={submit} className="grid gap-6 lg:grid-cols-[1.4fr_1fr]">
        <div className="space-y-6">
          {/* Trip selection */}
          <section className="glass rounded-3xl p-5 sm:p-6">
            <label className="block">
              <span className="text-xs uppercase tracking-widest text-muted-foreground">Trip to cancel</span>
              <select
                value={selectedId}
                onChange={e => setSelectedId(e.target.value)}
                className="mt-1.5 w-full rounded-xl border border-border bg-transparent px-3 py-2.5"
              >
                {bookings.map(b => (
                  <option key={b.id} value={b.id}>
                    {b.id} · {b.form.pickup || "—"} → {b.form.destination || "—"} · {b.shuttle?.date ?? b.form.date} {b.shuttle?.departure ?? b.form.time}
                  </option>
                ))}
              </select>
            </label>

            {booking && (
              <div className="mt-4 rounded-2xl border border-border/60 p-4 text-sm">
                <p className="flex items-center gap-2 font-medium">
                  {route ? `${route.from} → ${route.to}` : `${booking.form.pickup} → ${booking.form.destination}`}
                </p>
                <p className="mt-1 text-xs text-muted-foreground">
                  Booking {booking.id} · {booking.shuttle?.date ?? booking.form.date} · Departs {booking.shuttle?.departure ?? booking.form.time} · {booking.seats.length} seat{booking.seats.length > 1 ? "s" : ""}
                </p>
                <p className="mt-2 flex items-center gap-2 text-xs text-primary">
                  <Clock className="h-3.5 w-3.5" />
                  {hrs >= 1 ? `${hrs.toFixed(1)} h to departure` : hrs > 0 ? "Under an hour to departure" : "Departure time has passed"}
                </p>
              </div>
            )}
          </section>

          {/* Reason */}
          <section className="glass rounded-3xl p-5 sm:p-6">
            <h2 className="font-display text-xl">Reason for cancellation</h2>
            <div className="mt-3 grid gap-2 sm:grid-cols-2">
              {REASONS.map(r => {
                const active = reason === r.v;
                return (
                  <button
                    key={r.v}
                    type="button"
                    onClick={() => setReason(r.v)}
                    className={`text-left rounded-xl border px-3.5 py-2.5 text-sm transition ${
                      active ? "border-primary/70 bg-primary/5" : "border-border hover:border-primary/40"
                    }`}
                  >
                    {r.l}
                  </button>
                );
              })}
            </div>
            <label className="mt-4 block">
              <span className="text-xs uppercase tracking-widest text-muted-foreground">Additional notes (optional)</span>
              <textarea
                value={notes}
                onChange={e => setNotes(e.target.value)}
                rows={3}
                maxLength={500}
                className="mt-1.5 w-full rounded-xl border border-border bg-transparent px-3 py-2.5 resize-none"
                placeholder="Anything we should know?"
              />
            </label>
          </section>
        </div>

        {/* Policy preview */}
        <aside className="glass rounded-3xl p-6 h-fit lg:sticky lg:top-24">
          <div className="flex items-center gap-2 text-xs uppercase tracking-widest text-primary">
            <ShieldCheck className="h-4 w-4" /> Refund policy preview
          </div>
          <h3 className="mt-2 font-display text-3xl">
            {booking ? `₹${refundAmount.toLocaleString("en-IN")}` : "—"}
          </h3>
          <p className="text-sm text-muted-foreground">
            {booking ? `${policy.label} · ${policy.note}` : "Select a trip to see your refund estimate."}
          </p>

          <ul className="mt-5 space-y-2 text-xs">
            {[
              { h: "24 h +",      p: "100%" },
              { h: "12 – 24 h",   p: "75%" },
              { h: "4 – 12 h",    p: "50%" },
              { h: "1 – 4 h",     p: "25%" },
              { h: "< 1 h",       p: "0%" },
            ].map(row => {
              const highlight = booking && policy.label.startsWith(row.p.replace("%", ""))
                || booking && row.p === "100%" && policy.percent === 100
                || booking && row.p === "0%" && policy.percent === 0;
              return (
                <li
                  key={row.h}
                  className={`flex items-center justify-between rounded-lg border px-3 py-2 ${
                    highlight ? "border-primary/70 bg-primary/5 text-foreground" : "border-border/60 text-muted-foreground"
                  }`}
                >
                  <span>Before departure: {row.h}</span>
                  <span className="font-semibold">{row.p}</span>
                </li>
              );
            })}
          </ul>

          {booking && (
            <div className="mt-5 rounded-xl border border-border/60 p-3 text-xs text-muted-foreground">
              <div className="flex justify-between"><span>Paid</span><span>₹{booking.total.toLocaleString("en-IN")}</span></div>
              <div className="flex justify-between"><span>Refund ({policy.percent}%)</span><span className="gold-text font-semibold">₹{refundAmount.toLocaleString("en-IN")}</span></div>
              <div className="flex justify-between"><span>Non-refundable</span><span>₹{(booking.total - refundAmount).toLocaleString("en-IN")}</span></div>
            </div>
          )}

          <p className="mt-4 flex items-start gap-2 text-[11px] text-muted-foreground">
            <AlertTriangle className="mt-0.5 h-3.5 w-3.5 shrink-0 text-primary" />
            Refunds are credited to your original payment method within 3–5 business days once approved. Track status under Trips.
          </p>

          <button
            type="submit"
            disabled={!booking}
            className="mt-6 w-full rounded-2xl gold-gradient px-5 py-3 text-sm font-semibold text-background transition hover:brightness-110 active:scale-[0.99] disabled:opacity-40 disabled:cursor-not-allowed inline-flex items-center justify-center gap-2"
          >
            Confirm cancellation <ArrowRight className="h-4 w-4" />
          </button>
          <Link to="/history" className="mt-3 block text-center text-xs text-muted-foreground hover:text-primary">
            Keep my booking
          </Link>
        </aside>
      </form>
    </PageShell>
  );
}
