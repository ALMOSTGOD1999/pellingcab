import { createFileRoute, Link } from "@tanstack/react-router";
import { CheckCircle2, Download, Home, Share2 } from "lucide-react";
import { toast } from "sonner";
import { PageShell } from "@/components/AppShell";
import { vehicles } from "@/lib/mock";
import { useApp } from "@/lib/store";

export const Route = createFileRoute("/success")({
  head: () => ({ meta: [{ title: "Booking confirmed · PellingCab" }] }),
  component: Success,
});

function Success() {
  const id = useApp(s => s.currentBookingId);
  const b = useApp(s => s.bookings.find(x => x.id === id));
  if (!b) return <PageShell title="No recent booking"><Link to="/" className="text-primary">Return home</Link></PageShell>;
  const v = vehicles.find(v => v.id === b.vehicleId)!;

  return (
    <PageShell>
      <div className="max-w-2xl mx-auto text-center">
        <div className="mx-auto grid h-20 w-20 place-items-center rounded-full gold-gradient text-background shadow-glow animate-float-up">
          <CheckCircle2 className="h-10 w-10" />
        </div>
        <h1 className="mt-6 font-display text-4xl sm:text-5xl">Ride confirmed</h1>
        <p className="mt-2 text-muted-foreground">Booking ID <span className="text-primary font-mono">{b.id}</span></p>
      </div>

      <section className="mx-auto max-w-2xl mt-8 glass rounded-3xl p-6">
        <div className="flex items-center justify-between border-b border-border pb-4">
          <div>
            <p className="text-xs uppercase tracking-widest text-primary">Invoice</p>
            <p className="font-display text-2xl">{v.name}</p>
          </div>
          <p className={`text-xs px-2.5 py-1 rounded-full ${b.payment.status === "paid" ? "bg-success/20 text-success" : "bg-primary/10 text-primary"}`}>
            {b.payment.status === "paid" ? "Paid" : "Cash on arrival"}
          </p>
        </div>
        <dl className="mt-4 grid gap-2 text-sm sm:grid-cols-2">
          <Row k="Customer" v={b.form.name} />
          <Row k="Phone" v={b.form.phone} />
          <Row k="Pickup" v={b.form.pickup} />
          <Row k="Destination" v={b.form.destination} />
          <Row k="Date & time" v={`${b.form.date} · ${b.form.time}`} />
          <Row k="Trip type" v={b.form.kind === "half" ? "Half day" : "Full day"} />
          <Row k="Seats" v={b.seats.join(", ")} />
          <Row k="Payment" v={b.payment.method.toUpperCase()} />
        </dl>
        <hr className="my-4 border-border" />
        <dl className="grid gap-1.5 text-sm">
          <div className="flex justify-between"><dt className="text-muted-foreground">Fare</dt><dd>₹{b.fare.toLocaleString("en-IN")}</dd></div>
          <div className="flex justify-between"><dt className="text-muted-foreground">Taxes</dt><dd>₹{b.taxes.toLocaleString("en-IN")}</dd></div>
          <div className="flex justify-between text-lg font-semibold"><dt>Total</dt><dd className="gold-text">₹{b.total.toLocaleString("en-IN")}</dd></div>
        </dl>

        <div className="mt-6 grid gap-3 sm:grid-cols-3">
          <Link to="/tracking" className="rounded-xl gold-gradient px-4 py-3 text-sm font-semibold text-background text-center">Track ride</Link>
          <button onClick={() => toast.success("Invoice downloaded")} className="rounded-xl border border-border px-4 py-3 text-sm inline-flex items-center justify-center gap-2 hover:border-primary">
            <Download className="h-4 w-4" /> Invoice
          </button>
          <button onClick={() => { navigator.clipboard?.writeText(`PellingCab booking ${b.id}`); toast.success("Booking link copied"); }} className="rounded-xl border border-border px-4 py-3 text-sm inline-flex items-center justify-center gap-2 hover:border-primary">
            <Share2 className="h-4 w-4" /> Share
          </button>
        </div>
        <Link to="/" className="mt-4 inline-flex w-full items-center justify-center gap-2 text-xs text-muted-foreground hover:text-primary">
          <Home className="h-3.5 w-3.5" /> Return home
        </Link>
      </section>
    </PageShell>
  );
}

function Row({ k, v }: { k: string; v: string }) {
  return <div className="flex justify-between gap-4 border-b border-border/50 py-1.5"><dt className="text-muted-foreground">{k}</dt><dd className="text-right">{v}</dd></div>;
}
