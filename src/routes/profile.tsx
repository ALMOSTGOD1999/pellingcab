import { createFileRoute, Link } from "@tanstack/react-router";
import { Camera, CreditCard, MapPin, Settings2, Star, Upload, X } from "lucide-react";
import { useRef } from "react";
import { toast } from "sonner";
import { PageShell } from "@/components/AppShell";
import { useApp } from "@/lib/store";

export const Route = createFileRoute("/profile")({
  head: () => ({ meta: [{ title: "Profile · PellingCab" }] }),
  component: Profile,
});

function Profile() {
  const form = useApp(s => s.form);
  const trips = useApp(s => s.bookings.length);
  const avatar = useApp(s => s.avatar);
  const setAvatar = useApp(s => s.setAvatar);
  const inputRef = useRef<HTMLInputElement>(null);
  const name = form.name || "Guest traveller";

  function onPick(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 3 * 1024 * 1024) { toast.error("Image must be under 3 MB"); return; }
    const reader = new FileReader();
    reader.onload = () => { setAvatar(reader.result as string); toast.success("Profile picture updated"); };
    reader.readAsDataURL(file);
  }

  return (
    <PageShell title="Profile" subtitle="Manage your traveller details.">
      <div className="grid gap-6 lg:grid-cols-[1fr_1.4fr]">
        <div className="glass rounded-3xl p-6 text-center">
          <div className="relative mx-auto h-28 w-28">
            {avatar ? (
              <img src={avatar} alt="Profile" className="h-28 w-28 rounded-full object-cover shadow-glow" />
            ) : (
              <div className="grid h-28 w-28 place-items-center rounded-full gold-gradient text-background font-display text-4xl shadow-glow">
                {name.charAt(0).toUpperCase()}
              </div>
            )}
            <button
              onClick={() => inputRef.current?.click()}
              aria-label="Change profile picture"
              className="absolute bottom-0 right-0 grid h-9 w-9 place-items-center rounded-full gold-gradient text-background shadow-glow ring-2 ring-background hover:scale-105 transition"
            >
              <Camera className="h-4 w-4" />
            </button>
            {avatar && (
              <button
                onClick={() => { setAvatar(undefined); toast.success("Profile picture removed"); }}
                aria-label="Remove profile picture"
                className="absolute top-0 right-0 grid h-7 w-7 place-items-center rounded-full bg-background/80 text-destructive ring-1 ring-border hover:bg-destructive hover:text-background transition"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            )}
            <input ref={inputRef} type="file" accept="image/*" className="hidden" onChange={onPick} />
          </div>

          <h2 className="mt-4 font-display text-2xl">{name}</h2>
          <p className="text-sm text-muted-foreground">{form.email || "no email set"}</p>
          <p className="mt-2 inline-flex items-center gap-1.5 text-sm"><Star className="h-4 w-4 fill-primary text-primary" /> 4.9 · {trips} trip{trips === 1 ? "" : "s"}</p>

          <button
            onClick={() => inputRef.current?.click()}
            className="mt-4 inline-flex items-center gap-2 rounded-xl border border-border px-4 py-2 text-sm hover:border-primary"
          >
            <Upload className="h-4 w-4" /> {avatar ? "Change photo" : "Upload photo"}
          </button>
        </div>

        <ul className="grid gap-3">
          <ProfLink to="/history" icon={<MapPin className="h-4 w-4" />} title="Trip history" hint="View all past bookings" />
          <ProfLink to="/payment-methods" icon={<CreditCard className="h-4 w-4" />} title="Payment methods" hint="Manage cards, UPI & wallets" />
          <ProfLink to="/settings" icon={<Settings2 className="h-4 w-4" />} title="Settings" hint="Language, notifications, privacy" />
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
