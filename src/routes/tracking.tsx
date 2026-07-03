import { createFileRoute, Link } from "@tanstack/react-router";
import { PageShell } from "@/components/AppShell";
import { StatusTimeline } from "@/components/StatusTimeline";
import { useApp } from "@/lib/store";

export const Route = createFileRoute("/tracking")({
  head: () => ({ meta: [{ title: "Live tracking · PellingCab" }] }),
  component: Tracking,
});

function Tracking() {
  const id = useApp(s => s.currentBookingId);
  const b = useApp(s => s.bookings.find(x => x.id === id) ?? s.bookings[0]);
  if (!b) return <PageShell title="No active trip"><Link to="/" className="text-primary">Home</Link></PageShell>;
  return (
    <PageShell title="Live status" subtitle={`Booking ${b.id}`}>
      <div className="grid gap-6 lg:grid-cols-[1.4fr_1fr]">
        <div className="glass rounded-3xl p-6 relative overflow-hidden">
          {/* faux map */}
          <div className="aspect-[16/10] rounded-2xl relative overflow-hidden"
            style={{
              background: "radial-gradient(1200px 400px at 30% 20%, color-mix(in oklab, var(--gold) 20%, transparent), transparent), linear-gradient(160deg, #0f0d08, #1a1408 60%, #0a0906)",
            }}>
            <svg viewBox="0 0 400 250" className="absolute inset-0 h-full w-full">
              <path d="M20 200 C 80 100, 180 80, 260 130 S 380 100, 380 60" stroke="oklch(0.82 0.13 82)" strokeWidth="2" fill="none" strokeDasharray="6 6" />
              <circle cx="20" cy="200" r="6" fill="oklch(0.82 0.13 82)" />
              <circle cx="380" cy="60" r="6" fill="oklch(0.72 0.16 155)" />
              <circle cx="220" cy="115" r="8" fill="oklch(0.82 0.13 82)">
                <animate attributeName="r" values="6;12;6" dur="1.6s" repeatCount="indefinite" />
              </circle>
            </svg>
          </div>
          <div className="mt-4 flex items-center justify-between text-sm">
            <div><p className="text-xs text-muted-foreground">From</p><p>{b.form.pickup}</p></div>
            <div className="text-right"><p className="text-xs text-muted-foreground">To</p><p>{b.form.destination}</p></div>
          </div>
        </div>
        <div className="glass rounded-3xl p-6">
          <h3 className="font-display text-2xl mb-4">Trip timeline</h3>
          <StatusTimeline status={b.status} />
          <Link to="/driver" className="mt-6 block text-center rounded-2xl border border-border px-4 py-3 text-sm hover:border-primary">Driver details</Link>
        </div>
      </div>
    </PageShell>
  );
}
