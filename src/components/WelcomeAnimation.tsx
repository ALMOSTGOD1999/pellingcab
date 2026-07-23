import { useEffect, useState } from "react";

export function WelcomeAnimation({ onDone }: { onDone: () => void }) {
  const [gone, setGone] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setGone(true), 2400);
    const t2 = setTimeout(onDone, 3000);
    return () => {
      clearTimeout(t);
      clearTimeout(t2);
    };
  }, [onDone]);

  return (
    <div
      className={`fixed inset-0 z-[100] grid place-items-center bg-background overflow-hidden transition-opacity duration-500 ${gone ? "opacity-0 pointer-events-none" : "opacity-100"}`}
    >
      {/* radial glow */}
      <div
        className="absolute inset-0 opacity-70"
        style={{
          background:
            "radial-gradient(60% 40% at 50% 55%, color-mix(in oklab, var(--gold) 22%, transparent), transparent 70%)",
        }}
      />
      {/* logo */}
      <div className="relative z-10 text-center">
        <div
          className="inline-flex items-center gap-3 opacity-0 animate-logo-rise"
          style={{ animationDelay: "0.2s" }}
        >
          <span className="grid h-11 w-11 place-items-center rounded-full gold-gradient text-background font-black text-lg shadow-glow">
            P
          </span>
          <span className="font-display text-4xl sm:text-5xl gold-text">PellingCab</span>
        </div>
        <p
          className="mt-3 text-sm tracking-[0.35em] uppercase text-muted-foreground opacity-0 animate-logo-rise"
          style={{ animationDelay: "0.6s" }}
        >
          Chauffeured Luxury
        </p>
      </div>

      {/* road line */}
      <div
        className="pointer-events-none absolute left-0 right-0 bottom-[36%] h-[2px]"
        style={{
          backgroundImage:
            "linear-gradient(to right, transparent, color-mix(in oklab, var(--gold) 60%, transparent), transparent)",
        }}
      />
      <div
        className="pointer-events-none absolute left-0 right-0 bottom-[34%] h-[6px] opacity-70 animate-road"
        style={{
          backgroundImage:
            "repeating-linear-gradient(to right, color-mix(in oklab, var(--gold) 70%, transparent) 0 24px, transparent 24px 56px)",
        }}
      />

      {/* car */}
      <div className="pointer-events-none absolute bottom-[34%] left-0 right-0 flex justify-center">
        <div className="animate-car-drive">
          <CarSVG />
        </div>
      </div>

      {/* skip */}
      <button
        onClick={onDone}
        className="absolute bottom-6 right-6 text-xs uppercase tracking-[0.25em] text-muted-foreground hover:text-foreground transition"
      >
        Skip
      </button>
    </div>
  );
}

function CarSVG() {
  return (
    <svg
      width="220"
      height="90"
      viewBox="0 0 220 90"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient id="body" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor="oklch(0.35 0.02 60)" />
          <stop offset="60%" stopColor="oklch(0.18 0.01 60)" />
          <stop offset="100%" stopColor="oklch(0.1 0.005 60)" />
        </linearGradient>
        <linearGradient id="glass" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor="oklch(0.85 0.05 220)" stopOpacity="0.7" />
          <stop offset="100%" stopColor="oklch(0.5 0.05 220)" stopOpacity="0.3" />
        </linearGradient>
        <radialGradient id="head" cx="0.5" cy="0.5" r="0.5">
          <stop offset="0%" stopColor="oklch(0.98 0.12 88)" />
          <stop offset="100%" stopColor="oklch(0.98 0.12 88)" stopOpacity="0" />
        </radialGradient>
      </defs>
      {/* headlight beam */}
      <ellipse cx="210" cy="55" rx="60" ry="10" fill="url(#head)" className="animate-headlight" />
      {/* body */}
      <path
        d="M10 60 Q 20 40 60 38 L 130 34 Q 170 34 190 50 L 208 55 Q 214 60 208 66 L 20 66 Q 8 66 10 60 Z"
        fill="url(#body)"
        stroke="oklch(0.82 0.13 82)"
        strokeWidth="0.8"
      />
      {/* windows */}
      <path d="M62 42 L 128 40 Q 158 40 172 52 L 70 52 Q 60 52 62 42 Z" fill="url(#glass)" />
      <path d="M108 40 L 108 52" stroke="oklch(0.1 0 0)" strokeWidth="1" />
      {/* trim */}
      <rect x="20" y="60" width="180" height="1.5" fill="oklch(0.82 0.13 82)" opacity="0.6" />
      {/* wheels */}
      <circle cx="55" cy="70" r="12" fill="oklch(0.08 0 0)" />
      <circle
        cx="55"
        cy="70"
        r="6"
        fill="oklch(0.25 0 0)"
        stroke="oklch(0.82 0.13 82)"
        strokeWidth="0.6"
      />
      <circle cx="165" cy="70" r="12" fill="oklch(0.08 0 0)" />
      <circle
        cx="165"
        cy="70"
        r="6"
        fill="oklch(0.25 0 0)"
        stroke="oklch(0.82 0.13 82)"
        strokeWidth="0.6"
      />
      {/* tail light */}
      <rect x="12" y="52" width="6" height="4" rx="1" fill="oklch(0.65 0.2 25)" />
    </svg>
  );
}
