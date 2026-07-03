import { createFileRoute } from "@tanstack/react-router";
import { PageShell } from "@/components/AppShell";
import { VehicleCard } from "@/components/VehicleCard";
import { vehicles } from "@/lib/mock";
import { useApp } from "@/lib/store";

export const Route = createFileRoute("/vehicles")({
  head: () => ({ meta: [{ title: "Choose your ride · PellingCab" }] }),
  component: Vehicles,
});

function Vehicles() {
  const form = useApp(s => s.form);
  return (
    <PageShell
      title="Choose your ride"
      subtitle={`${form.pickup || "Pickup"} → ${form.destination || "Destination"} · ${form.date} · ${form.time}`}
    >
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {vehicles.map(v => <VehicleCard key={v.id} v={v} />)}
      </div>
    </PageShell>
  );
}
