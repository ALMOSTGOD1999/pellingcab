import { createFileRoute } from "@tanstack/react-router";
import { toast } from "sonner";
import { PageShell } from "@/components/AppShell";
import { useApp } from "@/lib/store";

export const Route = createFileRoute("/settings")({
  head: () => ({ meta: [{ title: "Settings · PellingCab" }] }),
  component: SettingsPage,
});

function SettingsPage() {
  const lang = useApp(s => s.lang);
  const setLang = useApp(s => s.setLang);
  return (
    <PageShell title="Settings">
      <div className="max-w-xl space-y-4">
        <Card title="Language" desc="Pick the language for menus and notifications.">
          <div className="glass rounded-full p-1 inline-flex">
            {(["en","hi"] as const).map(l => (
              <button key={l} onClick={() => setLang(l)}
                className={`px-4 py-1.5 rounded-full text-sm ${lang===l ? "gold-gradient text-background font-semibold" : "text-muted-foreground"}`}>
                {l === "en" ? "English" : "हिन्दी"}
              </button>
            ))}
          </div>
        </Card>
        <Card title="Notifications" desc="Trip updates, offers, and reminders.">
          <Toggle defaultOn label="Trip updates" />
          <Toggle label="Promos & offers" />
        </Card>
        <Card title="Privacy" desc="Manage saved data on this device.">
          <button
            onClick={() => { localStorage.removeItem("pellingcab"); toast.success("Local data cleared. Reload to reset."); }}
            className="rounded-xl border border-border px-4 py-2.5 text-sm hover:border-destructive hover:text-destructive"
          >Clear local data</button>
        </Card>
      </div>
    </PageShell>
  );
}
function Card({ title, desc, children }: { title: string; desc?: string; children: React.ReactNode }) {
  return (
    <section className="glass rounded-3xl p-6">
      <h3 className="font-display text-xl">{title}</h3>
      {desc && <p className="text-sm text-muted-foreground">{desc}</p>}
      <div className="mt-4 space-y-3">{children}</div>
    </section>
  );
}
function Toggle({ label, defaultOn }: { label: string; defaultOn?: boolean }) {
  return (
    <label className="flex items-center justify-between gap-4 text-sm">
      <span>{label}</span>
      <input type="checkbox" defaultChecked={defaultOn}
        className="h-5 w-9 appearance-none rounded-full bg-muted checked:bg-primary relative transition
                   before:content-[''] before:absolute before:top-0.5 before:left-0.5 before:h-4 before:w-4 before:rounded-full before:bg-background before:transition checked:before:translate-x-4" />
    </label>
  );
}
