import { Star } from "lucide-react";
import { useState } from "react";

export function Rating({ value, onChange, size = 28 }: { value: number; onChange?: (n: number) => void; size?: number }) {
  const [hover, setHover] = useState(0);
  const active = hover || value;
  return (
    <div className="inline-flex items-center gap-1" onMouseLeave={() => setHover(0)}>
      {[1, 2, 3, 4, 5].map(n => (
        <button
          key={n}
          type="button"
          onMouseEnter={() => onChange && setHover(n)}
          onClick={() => onChange?.(n)}
          className="transition active:scale-90"
          aria-label={`${n} star`}
        >
          <Star
            style={{ width: size, height: size }}
            className={n <= active ? "fill-primary text-primary" : "text-muted-foreground"}
          />
        </button>
      ))}
    </div>
  );
}
