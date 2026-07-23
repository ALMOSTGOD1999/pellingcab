import { createFileRoute } from "@tanstack/react-router";
import { MessageCircle, Mail, Search } from "lucide-react";
import { useEffect, useState } from "react";

type Booking = {
  id: string;
  userId: number;
  name: string;
  email: string;
  phone: string;
  mode: string;
  vehicleId: string;
  routeId: string | null;
  status: string;
  fare: number;
  taxes: number;
  total: number;
  pickup: string;
  destination: string;
  date: string;
  time: string;
  kind: string | null;
  paymentMethod: string;
  paymentStatus: string;
  createdAt: string;
};

export const Route = createFileRoute("/admin/_layout/bookings")({
  head: () => ({ meta: [{ title: "Trips · Admin · PellingCab" }] }),
  component: BookingsPage,
});

function BookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetch("/api/admin/bookings")
      .then((r) => r.json())
      .then((data) => setBookings(data.bookings || []));
  }, []);

  const filtered = bookings.filter(
    (b) =>
      (b.name || "").toLowerCase().includes(search.toLowerCase()) ||
      (b.email || "").toLowerCase().includes(search.toLowerCase()) ||
      (b.phone || "").toLowerCase().includes(search.toLowerCase()) ||
      b.id.toLowerCase().includes(search.toLowerCase()),
  );

  const whatsappUrl = (phone: string) => {
    const clean = phone.replace(/[^+\d]/g, "");
    return `https://wa.me/${clean}`;
  };

  const statusColor = (s: string) => {
    switch (s) {
      case "confirmed":
        return "text-green-400";
      case "cancelled":
        return "text-red-400";
      case "completed":
        return "text-blue-400";
      default:
        return "text-yellow-400";
    }
  };

  return (
    <div className="animate-float-up">
      <h1 className="font-display text-3xl">Trips</h1>
      <p className="text-sm text-muted-foreground mt-1">{bookings.length} trips total.</p>

      <div className="mt-6 flex items-center gap-2 rounded-2xl border border-border bg-muted/50 px-4 py-3">
        <Search className="h-4 w-4 text-muted-foreground shrink-0" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by name, email, phone or booking ID..."
          className="w-full bg-transparent text-sm outline-none"
        />
      </div>

      {/* Table (desktop) */}
      <div className="mt-4 hidden lg:block overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border/60 text-left text-xs text-muted-foreground uppercase tracking-wider">
              <th className="pb-3 pr-3 font-medium">ID</th>
              <th className="pb-3 pr-3 font-medium">Customer</th>
              <th className="pb-3 pr-3 font-medium">Route</th>
              <th className="pb-3 pr-3 font-medium">Date</th>
              <th className="pb-3 pr-3 font-medium">Type</th>
              <th className="pb-3 pr-3 font-medium">Total</th>
              <th className="pb-3 pr-3 font-medium">Status</th>
              <th className="pb-3 font-medium">Contact</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((b) => (
              <tr key={b.id} className="border-b border-border/40">
                <td className="py-3 pr-3 font-mono text-xs text-muted-foreground">
                  {b.id.slice(0, 8)}...
                </td>
                <td className="py-3 pr-3">
                  <p className="font-medium">{b.name}</p>
                  <p className="text-xs text-muted-foreground">{b.phone}</p>
                </td>
                <td className="py-3 pr-3 text-xs">
                  {b.pickup} → {b.destination}
                </td>
                <td className="py-3 pr-3 text-xs text-muted-foreground">
                  {b.date} {b.time}
                </td>
                <td className="py-3 pr-3">
                  <span className="text-[10px] uppercase tracking-wider text-muted-foreground">
                    {b.mode} {b.kind ? `· ${b.kind}` : ""}
                  </span>
                </td>
                <td className="py-3 pr-3 font-semibold">₹{b.total.toLocaleString("en-IN")}</td>
                <td className="py-3 pr-3">
                  <span className={`text-xs font-semibold capitalize ${statusColor(b.status)}`}>
                    {b.status.replace(/_/g, " ")}
                  </span>
                </td>
                <td className="py-3">
                  <div className="flex items-center gap-1.5">
                    {b.email && (
                      <a
                        href={`mailto:${b.email}`}
                        className="inline-flex items-center gap-1 rounded-lg border border-border px-2 py-1 text-xs hover:border-primary transition"
                      >
                        <Mail className="h-3 w-3" />
                      </a>
                    )}
                    <a
                      href={whatsappUrl(b.phone)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 rounded-lg bg-green-600/20 text-green-400 border border-green-600/30 px-2 py-1 text-xs hover:bg-green-600/30 transition"
                    >
                      <MessageCircle className="h-3 w-3" /> WP
                    </a>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Cards (mobile) */}
      <div className="mt-4 lg:hidden space-y-3">
        {filtered.map((b) => (
          <div key={b.id} className="glass rounded-2xl p-4">
            <div className="flex items-start justify-between gap-2">
              <div>
                <p className="font-semibold">{b.name}</p>
                <p className="text-xs text-muted-foreground">{b.phone}</p>
              </div>
              <span
                className={`shrink-0 text-xs font-semibold capitalize ${statusColor(b.status)}`}
              >
                {b.status.replace(/_/g, " ")}
              </span>
            </div>
            <p className="mt-2 text-xs">
              {b.pickup} → {b.destination}
            </p>
            <div className="mt-2 flex items-center justify-between text-xs text-muted-foreground">
              <span>
                {b.date} {b.time}
              </span>
              <span className="font-semibold text-foreground">
                ₹{b.total.toLocaleString("en-IN")}
              </span>
            </div>
            <div className="mt-3 flex items-center gap-2">
              <span className="text-[10px] uppercase tracking-wider text-muted-foreground">
                {b.mode} {b.kind ? `· ${b.kind}` : ""}
              </span>
              {b.email && (
                <a
                  href={`mailto:${b.email}`}
                  className="inline-flex items-center gap-1 rounded-lg border border-border px-2 py-1 text-xs hover:border-primary transition"
                >
                  <Mail className="h-3 w-3" /> Email
                </a>
              )}
              <a
                href={whatsappUrl(b.phone)}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 rounded-lg bg-green-600/20 text-green-400 border border-green-600/30 px-2 py-1 text-xs hover:bg-green-600/30 transition"
              >
                <MessageCircle className="h-3 w-3" /> WhatsApp
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
