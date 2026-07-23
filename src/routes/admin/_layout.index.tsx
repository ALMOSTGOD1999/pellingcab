import { createFileRoute } from "@tanstack/react-router";
import { IndianRupee, Users, CalendarRange, TrendingUp } from "lucide-react";
import { useEffect, useState } from "react";

type Stats = {
  totalUsers: number;
  totalBookings: number;
  totalRevenue: number;
  recentBookings: number;
} | null;

export const Route = createFileRoute("/admin/_layout/")({
  head: () => ({ meta: [{ title: "Dashboard · Admin · PellingCab" }] }),
  component: Dashboard,
});

function Dashboard() {
  const [stats, setStats] = useState<Stats>(null);

  useEffect(() => {
    Promise.all([
      fetch("/api/admin/users").then((r) => r.json()),
      fetch("/api/admin/bookings").then((r) => r.json()),
    ]).then(([userData, bookingData]) => {
      const bookings = bookingData.bookings || [];
      const totalRevenue = bookings.reduce(
        (sum: number, b: { total: number }) => sum + (b.total || 0),
        0,
      );
      const recentBookings = bookings.filter((b: { createdAt: string }) => {
        const d = new Date(b.createdAt);
        const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
        return d > weekAgo;
      }).length;
      setStats({
        totalUsers: (userData.users || []).length,
        totalBookings: bookings.length,
        totalRevenue,
        recentBookings,
      });
    });
  }, []);

  return (
    <div className="animate-float-up">
      <h1 className="font-display text-3xl">Dashboard</h1>
      <p className="text-sm text-muted-foreground mt-1">Overview of your PellingCab operations.</p>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard icon={Users} label="Total Users" value={stats?.totalUsers ?? "—"} />
        <StatCard icon={CalendarRange} label="Total Trips" value={stats?.totalBookings ?? "—"} />
        <StatCard
          icon={IndianRupee}
          label="Total Revenue"
          value={stats ? `₹${stats.totalRevenue.toLocaleString("en-IN")}` : "—"}
        />
        <StatCard
          icon={TrendingUp}
          label="This Week"
          value={stats?.recentBookings ?? "—"}
          suffix="trips"
        />
      </div>
    </div>
  );
}

function StatCard({
  icon: Icon,
  label,
  value,
  suffix,
}: {
  icon: React.ElementType;
  label: string;
  value: string | number;
  suffix?: string;
}) {
  return (
    <div className="glass rounded-2xl p-5">
      <div className="flex items-center gap-2 text-xs text-muted-foreground uppercase tracking-wider">
        <Icon className="h-3.5 w-3.5 text-primary" />
        {label}
      </div>
      <div className="mt-2 flex items-baseline gap-1">
        <span className="text-2xl font-semibold">{value}</span>
        {suffix && <span className="text-sm text-muted-foreground">{suffix}</span>}
      </div>
    </div>
  );
}
