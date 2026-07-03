import { Link } from "@tanstack/react-router";
import { Users, Briefcase, Snowflake, Star } from "lucide-react";
import type { Vehicle } from "@/lib/mock";
import { useApp } from "@/lib/store";

export function VehicleCard({ v }: { v: Vehicle }) {
  const setVehicle = useApp(s => s.setVehicle);
  const kind = useApp(s => s.form.kind);
  const price = kind === "half" ? v.pricePerHalfDay : v.pricePerFullDay;

  return (
    <article className="group glass rounded-3xl overflow-hidden transition hover:-translate-y-1 hover:shadow-glow">
      <div className="relative aspect-[16/10] overflow-hidden">
        <img src={v.image} alt={v.name} width={1200} height={800} loading="lazy"
             className="h-full w-full object-cover transition duration-700 group-hover:scale-105" />
        <div className="absolute inset-0 bg-gradient-to-t from-card via-card/10 to-transparent" />
        <span className="absolute top-3 left-3 glass rounded-full px-3 py-1 text-[11px] uppercase tracking-widest text-primary">{v.category}</span>
        <span className="absolute top-3 right-3 glass rounded-full px-2.5 py-1 text-xs flex items-center gap-1">
          <Star className="h-3.5 w-3.5 fill-primary text-primary" /> {v.rating}
        </span>
      </div>
      <div className="p-5">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <h3 className="font-display text-xl truncate">{v.name}</h3>
            <p className="text-xs text-muted-foreground mt-0.5">All-inclusive chauffeur · Fuel · Tolls extra</p>
          </div>
          <div className="text-right shrink-0">
            <div className="text-2xl font-semibold gold-text">₹{price.toLocaleString("en-IN")}</div>
            <div className="text-[11px] uppercase tracking-widest text-muted-foreground">{kind === "half" ? "half day" : "full day"}</div>
          </div>
        </div>
        <ul className="mt-4 flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
          <Chip><Users className="h-3.5 w-3.5" /> {v.seats} seats</Chip>
          <Chip><Briefcase className="h-3.5 w-3.5" /> {v.luggage} bags</Chip>
          {v.ac && <Chip><Snowflake className="h-3.5 w-3.5" /> AC</Chip>}
        </ul>
        <Link
          to="/summary"
          onClick={() => setVehicle(v.id)}
          className="mt-5 inline-flex w-full items-center justify-center rounded-2xl gold-gradient px-4 py-3 text-sm font-semibold text-background transition hover:brightness-110 active:scale-[0.98]"
        >
          Book Now
        </Link>
      </div>
    </article>
  );
}

function Chip({ children }: { children: React.ReactNode }) {
  return <li className="inline-flex items-center gap-1 rounded-full border border-border bg-card/60 px-2.5 py-1">{children}</li>;
}
