import { statusSteps, type BookingStatus } from "@/lib/mock";
import { Check } from "lucide-react";

export function StatusTimeline({ status }: { status: BookingStatus }) {
  const activeIdx = statusSteps.findIndex(s => s.key === status);
  return (
    <ol className="relative space-y-5">
      <span className="absolute left-[15px] top-2 bottom-2 w-px bg-border" />
      {statusSteps.map((s, i) => {
        const done = i <= activeIdx;
        const current = i === activeIdx;
        return (
          <li key={s.key} className="relative flex items-start gap-4">
            <span className={`relative z-10 grid h-8 w-8 shrink-0 place-items-center rounded-full transition
              ${done ? "gold-gradient text-background shadow-glow" : "bg-muted text-muted-foreground"}`}>
              {done ? <Check className="h-4 w-4" /> : <span className="text-xs">{i + 1}</span>}
              {current && <span className="absolute inset-0 rounded-full border border-primary animate-ping" />}
            </span>
            <div className="min-w-0 pt-1">
              <p className={`text-sm ${done ? "text-foreground" : "text-muted-foreground"} ${current ? "font-semibold" : ""}`}>{s.label}</p>
              <p className="text-xs text-muted-foreground">
                {done && !current && "Completed"}
                {current && "In progress"}
                {!done && "Pending"}
              </p>
            </div>
          </li>
        );
      })}
    </ol>
  );
}
