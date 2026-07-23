import { createFileRoute, Outlet, Link, useRouter } from "@tanstack/react-router";
import {
  Shield,
  LayoutDashboard,
  Users,
  IndianRupee,
  CalendarRange,
  LogOut,
  Home,
} from "lucide-react";
import { useEffect, useState } from "react";
import type { ReactNode } from "react";

type AdminUser = {
  userId: number;
  isAdmin: boolean;
  name: string;
  email: string | null;
  phone: string;
} | null;

async function fetchMe(): Promise<AdminUser> {
  try {
    const res = await fetch("/api/auth/me");
    const data = await res.json();
    return data.user ?? null;
  } catch {
    return null;
  }
}

export const Route = createFileRoute("/admin/_layout")({
  component: AdminLayout,
});

function AdminLayout() {
  const [user, setUser] = useState<AdminUser>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    fetchMe().then((u) => {
      if (!u || !u.isAdmin) {
        router.navigate({ to: "/admin/login" });
      } else {
        setUser(u);
      }
      setLoading(false);
    });
  }, [router]);

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    router.navigate({ to: "/admin/login" });
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="flex min-h-screen bg-background">
      {/* Sidebar */}
      <aside className="hidden lg:flex w-60 flex-col border-r border-border/60 p-4">
        <div className="flex items-center gap-2.5 mb-8 px-2">
          <div className="grid h-8 w-8 place-items-center rounded-full gold-gradient text-background font-black text-xs">
            P
          </div>
          <span className="font-display text-lg gold-text">PellingCab</span>
        </div>

        <nav className="flex-1 space-y-1">
          <SidebarLink to="/admin" icon={LayoutDashboard}>
            Dashboard
          </SidebarLink>
          <SidebarLink to="/admin/rates" icon={IndianRupee}>
            Rates
          </SidebarLink>
          <SidebarLink to="/admin/users" icon={Users}>
            Users
          </SidebarLink>
          <SidebarLink to="/admin/bookings" icon={CalendarRange}>
            Trips
          </SidebarLink>
        </nav>

        <div className="pt-4 border-t border-border/60 space-y-1">
          <SidebarLink to="/" icon={Home}>
            Public site
          </SidebarLink>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-muted-foreground hover:text-foreground hover:bg-muted/50 transition"
          >
            <LogOut className="h-4 w-4" /> Logout
          </button>
        </div>
      </aside>

      {/* Mobile header */}
      <div className="flex flex-1 flex-col">
        <header className="lg:hidden flex items-center justify-between gap-4 glass px-4 py-3">
          <span className="font-display text-lg gold-text">PellingCab Admin</span>
          <div className="flex items-center gap-2">
            <button
              onClick={handleLogout}
              className="text-xs text-muted-foreground hover:text-foreground"
            >
              Logout
            </button>
          </div>
        </header>

        {/* Mobile nav */}
        <nav className="lg:hidden flex gap-1 px-3 py-2 overflow-x-auto border-b border-border/60">
          <MobileNavLink to="/admin" icon={LayoutDashboard}>
            Dashboard
          </MobileNavLink>
          <MobileNavLink to="/admin/rates" icon={IndianRupee}>
            Rates
          </MobileNavLink>
          <MobileNavLink to="/admin/users" icon={Users}>
            Users
          </MobileNavLink>
          <MobileNavLink to="/admin/bookings" icon={CalendarRange}>
            Trips
          </MobileNavLink>
        </nav>

        <main className="flex-1 p-4 sm:p-6 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

function SidebarLink({
  to,
  icon: Icon,
  children,
}: {
  to: string;
  icon: React.ElementType;
  children: ReactNode;
}) {
  return (
    <Link
      to={to}
      className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-muted-foreground hover:text-foreground hover:bg-muted/50 transition [&.active]:bg-primary/10 [&.active]:text-primary"
      activeProps={{ className: "active" }}
    >
      <Icon className="h-4 w-4" /> {children}
    </Link>
  );
}

function MobileNavLink({
  to,
  icon: Icon,
  children,
}: {
  to: string;
  icon: React.ElementType;
  children: ReactNode;
}) {
  return (
    <Link
      to={to}
      className="shrink-0 inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs text-muted-foreground [&.active]:bg-primary/10 [&.active]:text-primary"
      activeProps={{ className: "active" }}
    >
      <Icon className="h-3.5 w-3.5" /> {children}
    </Link>
  );
}
