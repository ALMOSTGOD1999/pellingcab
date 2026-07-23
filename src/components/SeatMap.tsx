import { useApp } from "@/lib/store";
import { Steering } from "./icons";

export function SeatMap({ total, occupied }: { total: number; occupied: number[] }) {
  const selected = useApp((s) => s.selectedSeats);
  const toggle = useApp((s) => s.toggleSeat);
  const seats = Array.from({ length: total }, (_, i) => i + 1);

  // layout: 1 driver row (seat 1 shown as steering), remaining as 2-per-row
  const passenger = seats.slice(1);
  const rows: number[][] = [];
  for (let i = 0; i < passenger.length; i += 2) rows.push(passenger.slice(i, i + 2));

  return (
    <div className="glass rounded-3xl p-5">
      <div className="flex items-center justify-between text-xs">
        <div className="flex gap-3">
          <Legend color="bg-success/70" label="Available" />
          <Legend color="bg-destructive/70" label="Occupied" />
          <Legend color="gold-gradient" label="Selected" />
        </div>
        <span className="text-muted-foreground">{selected.length} selected</span>
      </div>

      <div className="mt-5 mx-auto w-full max-w-[280px] rounded-3xl border border-border bg-background/40 p-4">
        <div className="flex justify-end mb-4">
          <div className="grid h-11 w-11 place-items-center rounded-xl bg-muted text-muted-foreground">
            <Steering className="h-5 w-5" />
          </div>
        </div>
        <div className="space-y-3">
          {rows.map((row, ri) => (
            <div key={ri} className="grid grid-cols-2 gap-3">
              {row.map((n) => {
                const isOcc = occupied.includes(n);
                const isSel = selected.includes(n);
                const cls = isOcc
                  ? "bg-destructive/80 text-destructive-foreground cursor-not-allowed"
                  : isSel
                    ? "gold-gradient text-background shadow-glow"
                    : "bg-success/70 text-success-foreground hover:brightness-110";
                return (
                  <button
                    key={n}
                    disabled={isOcc}
                    onClick={() => toggle(n)}
                    className={`h-11 rounded-xl text-sm font-semibold transition active:scale-95 ${cls}`}
                  >
                    {n}
                  </button>
                );
              })}
              {row.length === 1 && <span />}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function Legend({ color, label }: { color: string; label: string }) {
  return (
    <span className="inline-flex items-center gap-1.5 text-muted-foreground">
      <span className={`h-3 w-3 rounded ${color}`} /> {label}
    </span>
  );
}
