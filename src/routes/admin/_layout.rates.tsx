import { createFileRoute } from "@tanstack/react-router";
import { IndianRupee, Save } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

type Vehicle = {
  id: string;
  name: string;
  category: string;
  pricePerHalfDay: number;
  pricePerFullDay: number;
};

type ShuttleRoute = {
  id: string;
  from: string;
  to: string;
  pricePerSeat: number;
};

export const Route = createFileRoute("/admin/_layout/rates")({
  head: () => ({ meta: [{ title: "Rates · Admin · PellingCab" }] }),
  component: RatesPage,
});

function RatesPage() {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [routes, setRoutes] = useState<ShuttleRoute[]>([]);
  const [edits, setEdits] = useState<
    Record<string, { half?: number; full?: number; seat?: number }>
  >({});
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetch("/api/admin/rates")
      .then((r) => r.json())
      .then((data) => {
        setVehicles(data.vehicles || []);
        setRoutes(data.shuttleRoutes || []);
      });
  }, []);

  const updateVehicle = (id: string, field: "half" | "full", value: number) => {
    setEdits((prev) => ({
      ...prev,
      [id]: { ...prev[id], [field]: value },
    }));
  };

  const updateRoute = (id: string, value: number) => {
    setEdits((prev) => ({
      ...prev,
      [id]: { ...prev[id], seat: value },
    }));
  };

  const saveAll = async () => {
    setSaving(true);
    try {
      for (const [id, changes] of Object.entries(edits)) {
        const isVehicle = vehicles.some((v) => v.id === id);
        const res = await fetch("/api/admin/rates", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(
            isVehicle
              ? { vehicleId: id, pricePerHalfDay: changes.half, pricePerFullDay: changes.full }
              : { routeId: id, pricePerSeat: changes.seat },
          ),
        });
        if (!res.ok) throw new Error("Failed");
      }
      toast.success("Rates updated");
      setEdits({});
      // Refresh
      const data = await fetch("/api/admin/rates").then((r) => r.json());
      setVehicles(data.vehicles || []);
      setRoutes(data.shuttleRoutes || []);
    } catch {
      toast.error("Failed to save rates");
    } finally {
      setSaving(false);
    }
  };

  const hasEdits = Object.keys(edits).length > 0;

  return (
    <div className="animate-float-up">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl">Rates</h1>
          <p className="text-sm text-muted-foreground mt-1">Manage vehicle and shuttle pricing.</p>
        </div>
        {hasEdits && (
          <button
            onClick={saveAll}
            disabled={saving}
            className="inline-flex items-center gap-2 rounded-2xl gold-gradient px-5 py-2.5 text-sm font-semibold text-background disabled:opacity-50"
          >
            <Save className="h-4 w-4" /> {saving ? "Saving..." : "Save changes"}
          </button>
        )}
      </div>

      {/* Vehicles */}
      <h2 className="mt-8 font-display text-xl text-primary">Vehicles</h2>
      <div className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {vehicles.map((v) => {
          const e = edits[v.id] || {};
          return (
            <div key={v.id} className="glass rounded-2xl p-5">
              <p className="font-semibold">{v.name}</p>
              <p className="text-xs text-muted-foreground">{v.category}</p>
              <div className="mt-4 grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[10px] uppercase tracking-wider text-muted-foreground">
                    Half-day (₹)
                  </label>
                  <input
                    type="number"
                    value={e.half ?? v.pricePerHalfDay}
                    onChange={(ev) => updateVehicle(v.id, "half", Number(ev.target.value))}
                    className="mt-1 w-full rounded-xl border border-border bg-muted/50 px-3 py-2 text-sm outline-none focus:border-primary"
                  />
                </div>
                <div>
                  <label className="text-[10px] uppercase tracking-wider text-muted-foreground">
                    Full-day (₹)
                  </label>
                  <input
                    type="number"
                    value={e.full ?? v.pricePerFullDay}
                    onChange={(ev) => updateVehicle(v.id, "full", Number(ev.target.value))}
                    className="mt-1 w-full rounded-xl border border-border bg-muted/50 px-3 py-2 text-sm outline-none focus:border-primary"
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Shuttle Routes */}
      <h2 className="mt-8 font-display text-xl text-primary">Shuttle Routes</h2>
      <div className="mt-3 grid gap-3 sm:grid-cols-2">
        {routes.map((r) => {
          const e = edits[r.id] || {};
          return (
            <div key={r.id} className="glass rounded-2xl p-5">
              <p className="font-semibold">
                {r.from} → {r.to}
              </p>
              <div className="mt-3">
                <label className="text-[10px] uppercase tracking-wider text-muted-foreground">
                  Price per seat (₹)
                </label>
                <input
                  type="number"
                  value={e.seat ?? r.pricePerSeat}
                  onChange={(ev) => updateRoute(r.id, Number(ev.target.value))}
                  className="mt-1 w-full rounded-xl border border-border bg-muted/50 px-3 py-2 text-sm outline-none focus:border-primary"
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
