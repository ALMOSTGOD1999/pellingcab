import { Link } from "@tanstack/react-router";
import { Home, Clock, User, LifeBuoy, Users } from "lucide-react";
import type { ReactNode } from "react";
import { useApp } from "@/lib/store";

export function Navbar() {
  const lang = useApp((s) => s.lang);
  const setLang = useApp((s) => s.setLang);
  return (
    <header className="sticky top-0 z-40 glass">
      <div className="mx-auto grid max-w-6xl grid-cols-[minmax(0,1fr)_auto] items-center gap-4 px-4 py-3 sm:px-6">
        <Link to="/" className="flex min-w-0 items-center gap-2.5">
          <img
            src="/logo.png"
            alt="PellingCab"
            className="h-9 w-9 shrink-0 rounded-full object-cover shadow-glow"
          />
          <span className="font-display text-xl sm:text-2xl gold-text truncate">PellingCab</span>
        </Link>
        <div className="flex shrink-0 items-center gap-2">
          <div className="hidden sm:flex items-center gap-4 mr-2">
            <NavLink to="/">
              <Home className="h-4 w-4" /> Home
            </NavLink>
            <NavLink to="/history">
              <Clock className="h-4 w-4" /> Trips
            </NavLink>
            <NavLink to="/support">
              <LifeBuoy className="h-4 w-4" /> Support
            </NavLink>
            <NavLink to="/profile">
              <User className="h-4 w-4" /> Profile
            </NavLink>
          </div>
          <div className="glass rounded-full p-0.5 flex text-xs">
            <button
              onClick={() => setLang("en")}
              className={`px-2.5 py-1 rounded-full transition ${lang === "en" ? "gold-gradient text-background font-semibold" : "text-muted-foreground"}`}
            >
              EN
            </button>
            <button
              onClick={() => setLang("hi")}
              className={`px-2.5 py-1 rounded-full transition ${lang === "hi" ? "gold-gradient text-background font-semibold" : "text-muted-foreground"}`}
            >
              हिं
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}

function NavLink({ to, children }: { to: string; children: ReactNode }) {
  return (
    <Link
      to={to}
      className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition"
    >
      {children}
    </Link>
  );
}

export function MobileTabBar() {
  return (
    <nav className="fixed bottom-0 inset-x-0 z-40 sm:hidden glass border-t border-border/60">
      <ul className="grid grid-cols-4 py-2">
        {[
          { to: "/", label: "Home", icon: Home },
          { to: "/shuttle", label: "Shuttle", icon: Users },
          { to: "/history", label: "Trips", icon: Clock },
          { to: "/profile", label: "Me", icon: User },
        ].map(({ to, label, icon: Icon }) => (
          <li key={to} className="text-center">
            <Link
              to={to}
              className="flex flex-col items-center gap-1 text-[11px] text-muted-foreground [&.active]:text-primary"
              activeProps={{ className: "active" }}
            >
              <Icon className="h-5 w-5" />
              <span>{label}</span>
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}

export function Footer() {
  return (
    <footer className="mt-24 border-t border-border/60 pb-24 sm:pb-8">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 py-10 grid gap-8 sm:grid-cols-4">
        <div className="sm:col-span-2">
          <div className="flex items-center gap-2.5">
            <span className="grid h-8 w-8 place-items-center rounded-full gold-gradient text-background font-black">
              P
            </span>
            <span className="font-display text-xl gold-text">PellingCab</span>
          </div>
          <p className="mt-3 max-w-sm text-sm text-muted-foreground">
            Premium chauffeured travel across India. Half-day, full-day, city rides — booked in
            under a minute.
          </p>
        </div>
        <div>
          <h4 className="text-xs uppercase tracking-widest text-muted-foreground">Company</h4>
          <ul className="mt-3 space-y-2 text-sm">
            <li>
              <Link to="/about" className="hover:text-primary">
                About
              </Link>
            </li>
            <li>
              <Link to="/support" className="hover:text-primary">
                Contact
              </Link>
            </li>
            <li>
              <Link to="/settings" className="hover:text-primary">
                Settings
              </Link>
            </li>
          </ul>
        </div>
        <div>
          <h4 className="text-xs uppercase tracking-widest text-muted-foreground">Booking</h4>
          <ul className="mt-3 space-y-2 text-sm">
            <li>
              <Link to="/vehicles" className="hover:text-primary">
                Vehicles
              </Link>
            </li>
            <li>
              <Link to="/history" className="hover:text-primary">
                My trips
              </Link>
            </li>
            <li>
              <Link to="/login" className="hover:text-primary">
                Sign in
              </Link>
            </li>
          </ul>
        </div>
      </div>
      <p className="text-center text-xs text-muted-foreground pb-6">
        © {new Date().getFullYear()} PellingCab. All rights reserved.
      </p>
    </footer>
  );
}

export function PageShell({
  children,
  title,
  subtitle,
}: {
  children: ReactNode;
  title?: string;
  subtitle?: string;
}) {
  return (
    <>
      <Navbar />
      <main className="mx-auto max-w-6xl px-4 sm:px-6 py-6 sm:py-10 animate-float-up">
        {title && (
          <header className="mb-6 sm:mb-8">
            <h1 className="font-display text-3xl sm:text-4xl">{title}</h1>
            {subtitle && <p className="mt-1 text-sm text-muted-foreground">{subtitle}</p>}
          </header>
        )}
        {children}
      </main>
      <Footer />
      <MobileTabBar />
    </>
  );
}
