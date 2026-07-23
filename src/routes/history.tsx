import { createFileRoute, Link } from "@tanstack/react-router";
import { PageShell } from "@/components/AppShell";
import { vehicles } from "@/lib/mock";
import { useApp } from "@/lib/store";

export const Route = createFileRoute("/history")({
  head: () => ({ meta: [{ title: "Trip history · PellingCab" }] }),
  component: History,
});

function History() {
  const bookings = useApp((s) => s.bookings);
  return (
    <PageShell title="My trips" subtitle="All your PellingCab bookings.">
      {bookings.length === 0 ? (
        <div className="glass rounded-3xl p-10 text-center">
          <p className="text-muted-foreground">No trips yet.</p>
          <Link
            to="/book"
            className="mt-4 inline-flex rounded-2xl gold-gradient px-5 py-2.5 text-sm font-semibold text-background"
          >
            Book your first ride
          </Link>
        </div>
      ) : (
        <ul className="grid gap-4">
          {bookings.map((b) => {
            const v = vehicles.find((v) => v.id === b.vehicleId)!;
            return (
              <li key={b.id}>
                <Link
                  to="/history/$id"
                  params={{ id: b.id }}
                  className="group glass rounded-3xl p-4 flex items-center gap-4 transition hover:-translate-y-0.5 hover:shadow-glow"
                >
                  <img
                    src={v.image}
                    alt=""
                    width={200}
                    height={140}
                    loading="lazy"
                    className="h-20 w-28 rounded-2xl object-cover shrink-0"
                  />
                  <div className="min-w-0 flex-1">
                    <p className="text-xs uppercase tracking-widest text-primary">{b.id}</p>
                    <h3 className="font-display text-lg truncate">{v.name}</h3>
                    <p className="text-xs text-muted-foreground truncate">
                      {b.form.pickup} → {b.form.destination} · {b.form.date}
                    </p>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-lg font-semibold gold-text">
                      ₹{b.total.toLocaleString("en-IN")}
                    </p>
                    {b.cancellation ? (
                      <p className="text-[11px] uppercase tracking-widest text-primary">
                        Refund · {b.cancellation.status}
                      </p>
                    ) : (
                      <p className="text-[11px] uppercase tracking-widest text-muted-foreground">
                        {b.status.replace("_", " ")}
                      </p>
                    )}
                  </div>
                </Link>
              </li>
            );
          })}
        </ul>
      )}
    </PageShell>
  );
}
