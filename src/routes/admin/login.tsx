import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Shield, User, Lock } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/admin/login")({
  head: () => ({ meta: [{ title: "Admin Login · PellingCab" }] }),
  component: AdminLogin,
});

function AdminLogin() {
  const [id, setId] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const nav = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone: id, password }),
      });
      const data = await res.json();
      if (!res.ok) {
        toast.error(data.error || "Login failed");
        return;
      }
      toast.success("Welcome, Admin");
      nav({ to: "/admin" });
    } catch {
      toast.error("Network error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <div className="inline-flex h-16 w-16 items-center justify-center rounded-2xl gold-gradient">
            <Shield className="h-8 w-8 text-background" />
          </div>
          <h1 className="mt-4 font-display text-3xl gold-text">Admin Panel</h1>
          <p className="mt-1 text-sm text-muted-foreground">PellingCab management</p>
        </div>

        <form onSubmit={handleLogin} className="glass rounded-3xl p-6 space-y-4">
          <div>
            <label className="text-xs text-muted-foreground uppercase tracking-wider mb-1.5 block">
              Admin ID
            </label>
            <div className="flex items-center gap-2 rounded-2xl border border-border bg-muted/50 px-4 py-3">
              <User className="h-4 w-4 text-muted-foreground shrink-0" />
              <input
                type="text"
                value={id}
                onChange={(e) => setId(e.target.value)}
                placeholder="Admin"
                className="w-full bg-transparent text-sm text-foreground placeholder:text-muted-foreground outline-none"
              />
            </div>
          </div>
          <div>
            <label className="text-xs text-muted-foreground uppercase tracking-wider mb-1.5 block">
              Password
            </label>
            <div className="flex items-center gap-2 rounded-2xl border border-border bg-muted/50 px-4 py-3">
              <Lock className="h-4 w-4 text-muted-foreground shrink-0" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-transparent text-sm text-foreground placeholder:text-muted-foreground outline-none"
              />
            </div>
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-2xl gold-gradient px-5 py-3 text-sm font-semibold text-background disabled:opacity-50"
          >
            {loading ? "Signing in..." : "Sign in"}
          </button>
        </form>
      </div>
    </div>
  );
}
