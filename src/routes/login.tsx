import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { Lock, Phone } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { Navbar, Footer } from "@/components/AppShell";
import { Field, TextInput } from "@/components/Field";

export const Route = createFileRoute("/login")({
  head: () => ({ meta: [{ title: "Sign in · PellingCab" }] }),
  component: Login,
});

function Login() {
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const nav = useNavigate();

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!phone.trim() || !password) {
      toast.error("Please enter phone and password");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone: phone.trim(), password }),
      });

      const data = await res.json();

      if (!res.ok) {
        toast.error(data.error || "Invalid credentials");
        return;
      }

      toast.success(`Welcome back, ${data.user?.name || "traveller"}!`);
      nav({ to: "/" });
    } catch {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <main className="mx-auto max-w-md px-4 sm:px-6 py-16 animate-float-up">
        <div className="glass rounded-3xl p-6 sm:p-8">
          <h1 className="font-display text-3xl">Welcome back</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Sign in to see your bookings and speed up checkout.
          </p>

          <form onSubmit={handleSignIn} className="mt-6 space-y-4">
            <Field label="Phone number" icon={<Phone className="h-4 w-4" />}>
              <TextInput
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+91 98110 00000"
              />
            </Field>
            <Field label="Password" icon={<Lock className="h-4 w-4" />}>
              <TextInput
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Your password"
              />
            </Field>
            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-2xl gold-gradient px-5 py-3 text-sm font-semibold text-background disabled:opacity-60"
            >
              {loading ? "Signing in…" : "Sign in"}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-muted-foreground">
            Don't have an account?{" "}
            <Link to="/signup" className="text-primary hover:underline">
              Sign up
            </Link>
          </p>
        </div>
      </main>
      <Footer />
    </>
  );
}
