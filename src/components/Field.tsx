import type { InputHTMLAttributes, ReactNode } from "react";

export function Field({
  label,
  icon,
  error,
  children,
}: {
  label: string;
  icon?: ReactNode;
  error?: string;
  children: ReactNode;
}) {
  return (
    <label className="block group">
      <span className="mb-1.5 block text-xs uppercase tracking-widest text-muted-foreground">
        {label}
      </span>
      <div
        className={`flex items-center gap-2 rounded-2xl border bg-card/60 px-3.5 py-3 transition focus-within:border-primary/70 focus-within:shadow-[0_0_0_4px_color-mix(in_oklab,var(--gold)_15%,transparent)] ${error ? "border-destructive/70" : "border-border"}`}
      >
        {icon && (
          <span className="text-muted-foreground group-focus-within:text-primary transition">
            {icon}
          </span>
        )}
        {children}
      </div>
      {error && <span className="mt-1 block text-xs text-destructive">{error}</span>}
    </label>
  );
}

export function TextInput(props: InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      {...props}
      className={`w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground/60 ${props.className ?? ""}`}
    />
  );
}
