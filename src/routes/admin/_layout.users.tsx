import { createFileRoute } from "@tanstack/react-router";
import { Mail, Phone, MessageCircle, Search } from "lucide-react";
import { useEffect, useState } from "react";

type User = {
  id: number;
  name: string | null;
  email: string | null;
  phone: string;
  isAdmin: boolean;
  createdAt: string;
};

export const Route = createFileRoute("/admin/_layout/users")({
  head: () => ({ meta: [{ title: "Users · Admin · PellingCab" }] }),
  component: UsersPage,
});

function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetch("/api/admin/users")
      .then((r) => r.json())
      .then((data) => setUsers(data.users || []));
  }, []);

  const filtered = users.filter(
    (u) =>
      (u.name || "").toLowerCase().includes(search.toLowerCase()) ||
      (u.email || "").toLowerCase().includes(search.toLowerCase()) ||
      u.phone.toLowerCase().includes(search.toLowerCase()),
  );

  const whatsappUrl = (phone: string) => {
    const clean = phone.replace(/[^+\d]/g, "");
    return `https://wa.me/${clean}`;
  };

  return (
    <div className="animate-float-up">
      <h1 className="font-display text-3xl">Users</h1>
      <p className="text-sm text-muted-foreground mt-1">{users.length} registered users.</p>

      {/* Search */}
      <div className="mt-6 flex items-center gap-2 rounded-2xl border border-border bg-muted/50 px-4 py-3">
        <Search className="h-4 w-4 text-muted-foreground shrink-0" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by name, email or phone..."
          className="w-full bg-transparent text-sm outline-none"
        />
      </div>

      {/* Table (desktop) */}
      <div className="mt-4 hidden md:block overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border/60 text-left text-xs text-muted-foreground uppercase tracking-wider">
              <th className="pb-3 pr-4 font-medium">Name</th>
              <th className="pb-3 pr-4 font-medium">Email</th>
              <th className="pb-3 pr-4 font-medium">Phone</th>
              <th className="pb-3 pr-4 font-medium">Role</th>
              <th className="pb-3 pr-4 font-medium">Joined</th>
              <th className="pb-3 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((u) => (
              <tr key={u.id} className="border-b border-border/40">
                <td className="py-3 pr-4 font-medium">{u.name || "—"}</td>
                <td className="py-3 pr-4 text-muted-foreground">{u.email || "—"}</td>
                <td className="py-3 pr-4">{u.phone}</td>
                <td className="py-3 pr-4">
                  {u.isAdmin ? (
                    <span className="text-[10px] uppercase tracking-wider text-primary font-semibold">
                      Admin
                    </span>
                  ) : (
                    <span className="text-[10px] text-muted-foreground">User</span>
                  )}
                </td>
                <td className="py-3 pr-4 text-muted-foreground text-xs">
                  {new Date(u.createdAt).toLocaleDateString()}
                </td>
                <td className="py-3">
                  <div className="flex items-center gap-2">
                    {u.email && (
                      <a
                        href={`mailto:${u.email}`}
                        className="inline-flex items-center gap-1 rounded-lg border border-border px-2.5 py-1 text-xs hover:border-primary transition"
                      >
                        <Mail className="h-3 w-3" /> Email
                      </a>
                    )}
                    <a
                      href={whatsappUrl(u.phone)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 rounded-lg bg-green-600/20 text-green-400 border border-green-600/30 px-2.5 py-1 text-xs hover:bg-green-600/30 transition"
                    >
                      <MessageCircle className="h-3 w-3" /> WhatsApp
                    </a>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Cards (mobile) */}
      <div className="mt-4 md:hidden space-y-3">
        {filtered.map((u) => (
          <div key={u.id} className="glass rounded-2xl p-4">
            <div className="flex items-start justify-between gap-2">
              <div>
                <p className="font-semibold">{u.name || "Unnamed"}</p>
                <p className="text-sm text-muted-foreground">{u.phone}</p>
                {u.email && <p className="text-xs text-muted-foreground">{u.email}</p>}
              </div>
              {u.isAdmin && (
                <span className="shrink-0 text-[10px] uppercase tracking-wider text-primary font-semibold">
                  Admin
                </span>
              )}
            </div>
            <div className="mt-3 flex items-center gap-2">
              {u.email && (
                <a
                  href={`mailto:${u.email}`}
                  className="inline-flex items-center gap-1 rounded-lg border border-border px-2.5 py-1 text-xs hover:border-primary transition"
                >
                  <Mail className="h-3 w-3" /> Email
                </a>
              )}
              <a
                href={whatsappUrl(u.phone)}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 rounded-lg bg-green-600/20 text-green-400 border border-green-600/30 px-2.5 py-1 text-xs hover:bg-green-600/30 transition"
              >
                <MessageCircle className="h-3 w-3" /> WhatsApp
              </a>
            </div>
            <p className="mt-2 text-[11px] text-muted-foreground">
              Joined {new Date(u.createdAt).toLocaleDateString()}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
