import { createFileRoute, Link } from "@tanstack/react-router";
import { CreditCard, MapPin, Settings2, Star } from "lucide-react";
import { PageShell } from "@/components/AppShell";
import { useApp } from "@/lib/store";

export const Route = createFileRoute("/profile")({
  head: () => ({ meta: [{ title: "Profile · PellingCab" }] }),
  component: Profile,
});

function Profile() {
  const form = useApp(s => s.form);
  const trips = useApp(s => s.bookings.length);
  const name = form.name || "Guest traveller";
  return (
    <PageShell title="Profile" subtitle="Manage your traveller details.">
      <div className="grid gap-6 lg:grid-cols-[1fr_1.4fr]">
        <div className="glass rounded-3xl p-6 text-center">
          <div className="mx-auto grid h-24 w-24 place-items-center rounded-full gold-gradient text-background font-display text-4xl shadow-glow">
            {name.charAt(0).toUpperCase()}
          </div>
          <h2 className="mt-4 font-display text-2xl">{name}</h2>
          <p className="text-sm text-muted-foreground">{form.email || "no email set"}</p>
          <p className="mt-2 inline-flex items-center gap-1.5 text-sm"><Star className="h-4 w-4 fill-primary text-primary" /> 4.9 · {trips} trip{trips === 1 ? "" : "s"}</p>
        </div>
        <ul className="grid gap-3">
          <ProfLink to="/history" icon={<MapPin className="h-4 w-4" />} title="Trip history" hint="View all past bookings" />
          <ProfLink to="/settings" icon={<Settings2 className="h-4 w-4" />} title="Settings" hint="Language, notifications, privacy" />
          <ProfLink to="/support" icon={<CreditCard className="h-4 w-4" />} title="Payment methods" hint="Manage cards & UPI" />
        </ul>
      </div>
    </PageShell>
  );
}

function ProfLink({ to, icon, title, hint }: { to: string; icon: React.ReactNode; title: string; hint: string }) {
  return (
    <li>
      <Link to={to} className="glass rounded-2xl p-4 flex items-center gap-4 transition hover:-translate-y-0.5 hover:shadow-glow">
        <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl gold-gradient text-background">{icon}</span>
        <div className="min-w-0"><p className="font-medium">{title}</p><p className="text-xs text-muted-foreground truncate">{hint}</p></div>
      </Link>
    </li>
  );
}
