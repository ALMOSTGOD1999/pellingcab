import { createFileRoute, Link } from "@tanstack/react-router";
import { PageShell } from "@/components/AppShell";
import { StatusTimeline } from "@/components/StatusTimeline";
import { vehicles } from "@/lib/mock";
import { useApp } from "@/lib/store";

export const Route = createFileRoute("/history/$id")({
  head: () => ({ meta: [{ title: "Booking details · PellingCab" }] }),
  component: Detail,
});

function Detail() {
  const { id } = Route.useParams();
  const b = useApp(s => s.bookings.find(x => x.id === id));
  if (!b) return <PageShell title="Booking not found"><Link to="/history" className="text-primary">Back to trips</Link></PageShell>;
  const v = vehicles.find(v => v.id === b.vehicleId)!;
  return (
    <PageShell title={`Booking ${b.id}`} subtitle={`${b.form.date} · ${b.form.time}`}>
      <div className="grid gap-6 lg:grid-cols-[1.2fr_1fr]">
        <div className="glass rounded-3xl overflow-hidden">
          <img src={v.image} alt="" width={1200} height={800} loading="lazy" className="w-full aspect-[16/9] object-cover" />
          <div className="p-6">
            <h3 className="font-display text-2xl">{v.name}</h3>
            <dl className="mt-4 grid gap-1.5 text-sm">
              <Row k="Pickup" v={b.form.pickup} />
              <Row k="Destination" v={b.form.destination} />
              <Row k="Trip type" v={b.form.kind === "half" ? "Half day" : "Full day"} />
              <Row k="Seats" v={b.seats.join(", ")} />
              <Row k="Payment" v={`${b.payment.method.toUpperCase()} · ${b.payment.status}`} />
              <hr className="my-2 border-border" />
              <div className="flex justify-between text-lg font-semibold"><dt>Total</dt><dd className="gold-text">₹{b.total.toLocaleString("en-IN")}</dd></div>
            </dl>
            <div className="mt-6 grid gap-2 sm:grid-cols-3">
              <Link to="/tracking" className="rounded-xl gold-gradient px-4 py-2.5 text-sm font-semibold text-background text-center">Track</Link>
              <Link to="/feedback" className="rounded-xl border border-border px-4 py-2.5 text-sm text-center hover:border-primary">Rate trip</Link>
              <Link to="/refund" className="rounded-xl border border-border px-4 py-2.5 text-sm text-center hover:border-primary">Refund</Link>
            </div>
          </div>
        </div>
        <div className="glass rounded-3xl p-6">
          <h3 className="font-display text-xl mb-4">Trip status</h3>
          <StatusTimeline status={b.status} />
        </div>
      </div>
    </PageShell>
  );
}
function Row({ k, v }: { k: string; v: string }) {
  return <div className="flex justify-between gap-4 border-b border-border/50 py-1.5"><dt className="text-muted-foreground">{k}</dt><dd className="text-right">{v}</dd></div>;
}
