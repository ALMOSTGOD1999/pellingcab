import { createFileRoute, useNavigate } from "@tanstack/react-router";
import {
  CalendarClock,
  Mail,
  MapPin,
  Phone,
  User,
  Clock as ClockIcon,
  Navigation,
} from "lucide-react";
import { toast } from "sonner";
import { useState } from "react";
import { PageShell } from "@/components/AppShell";
import { Field, TextInput } from "@/components/Field";
import { useApp } from "@/lib/store";

export const Route = createFileRoute("/book")({
  head: () => ({ meta: [{ title: "Book your ride · PellingCab" }] }),
  component: Book,
});

function Book() {
  const form = useApp((s) => s.form);
  const setForm = useApp((s) => s.setForm);
  const nav = useNavigate();
  const [errors, setErrors] = useState<Record<string, string>>({});

  function validate() {
    const e: Record<string, string> = {};
    if (!form.name.trim()) e.name = "Please enter your name";
    if (!/^\S+@\S+\.\S+$/.test(form.email)) e.email = "Enter a valid email";
    if (!/^\+?\d[\d\s-]{8,}$/.test(form.phone)) e.phone = "Enter a valid phone";
    if (!form.pickup.trim()) e.pickup = "Pickup required";
    if (!form.destination.trim()) e.destination = "Destination required";
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  function submit(ev: React.FormEvent) {
    ev.preventDefault();
    if (!validate()) {
      toast.error("Please fix the highlighted fields");
      return;
    }
    toast.success("Trip details saved");
    nav({ to: "/vehicles" });
  }

  return (
    <PageShell title="Trip details" subtitle="Tell us where and when — we'll match a chauffeur.">
      <form onSubmit={submit} className="grid gap-8 lg:grid-cols-[1.4fr_1fr]">
        <div className="glass rounded-3xl p-5 sm:p-7 space-y-5">
          <div className="flex gap-2">
            {(["half", "full"] as const).map((k) => (
              <button
                key={k}
                type="button"
                onClick={() => setForm({ kind: k })}
                className={`flex-1 rounded-2xl px-4 py-3 text-sm font-medium transition border
                  ${form.kind === k ? "gold-gradient text-background border-transparent shadow-glow" : "border-border bg-card/50 text-muted-foreground hover:text-foreground"}`}
              >
                {k === "half" ? "Half-day · 6h" : "Full-day · 12h"}
              </button>
            ))}
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Full name" icon={<User className="h-4 w-4" />} error={errors.name}>
              <TextInput
                placeholder="Aarav Kapoor"
                value={form.name}
                onChange={(e) => setForm({ name: e.target.value })}
              />
            </Field>
            <Field label="Phone number" icon={<Phone className="h-4 w-4" />} error={errors.phone}>
              <TextInput
                placeholder="+91 98110 00000"
                value={form.phone}
                onChange={(e) => setForm({ phone: e.target.value })}
              />
            </Field>
            <Field label="Email" icon={<Mail className="h-4 w-4" />} error={errors.email}>
              <TextInput
                type="email"
                placeholder="you@email.com"
                value={form.email}
                onChange={(e) => setForm({ email: e.target.value })}
              />
            </Field>
            <div />
            <Field label="Pickup" icon={<MapPin className="h-4 w-4" />} error={errors.pickup}>
              <TextInput
                placeholder="Hotel Taj, Delhi"
                value={form.pickup}
                onChange={(e) => setForm({ pickup: e.target.value })}
              />
            </Field>
            <Field
              label="Destination"
              icon={<Navigation className="h-4 w-4" />}
              error={errors.destination}
            >
              <TextInput
                placeholder="Agra Fort"
                value={form.destination}
                onChange={(e) => setForm({ destination: e.target.value })}
              />
            </Field>
            <Field label="Pickup date" icon={<CalendarClock className="h-4 w-4" />}>
              <TextInput
                type="date"
                value={form.date}
                onChange={(e) => setForm({ date: e.target.value })}
              />
            </Field>
            <Field label="Pickup time" icon={<ClockIcon className="h-4 w-4" />}>
              <TextInput
                type="time"
                value={form.time}
                onChange={(e) => setForm({ time: e.target.value })}
              />
            </Field>
          </div>

          <button
            type="submit"
            className="w-full rounded-2xl gold-gradient px-5 py-4 text-sm font-semibold text-background transition hover:brightness-110 active:scale-[0.99]"
          >
            Continue to vehicle selection
          </button>
        </div>

        <aside className="glass rounded-3xl p-6 h-fit">
          <h3 className="font-display text-2xl">What's included</h3>
          <ul className="mt-4 space-y-3 text-sm text-muted-foreground">
            {[
              "Trained, background-verified chauffeur",
              "Sanitised, insured premium vehicle",
              "Bottled water & phone charger",
              "24/7 in-app concierge support",
            ].map((x) => (
              <li key={x} className="flex items-start gap-2.5">
                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full gold-gradient" /> {x}
              </li>
            ))}
          </ul>
          <div className="mt-6 rounded-2xl border border-border bg-background/40 p-4 text-xs text-muted-foreground">
            <strong className="text-primary">Flexible cancellation.</strong> Cancel free up to 2
            hours before pickup — full refund to your original payment method.
          </div>
        </aside>
      </form>
    </PageShell>
  );
}
