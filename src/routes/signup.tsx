import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { Lock, Mail, Phone, User } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { Navbar, Footer } from "@/components/AppShell";
import { Field, TextInput } from "@/components/Field";

export const Route = createFileRoute("/signup")({
  head: () => ({ meta: [{ title: "Sign up · PellingCab" }] }),
  component: SignUp,
});

function SignUp() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const nav = useNavigate();

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!phone.trim()) {
      toast.error("Phone number is required");
      return;
    }
    if (password.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          phone: phone.trim(),
          password,
          name: name.trim() || undefined,
          email: email.trim() || undefined,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        toast.error(data.error || "Registration failed");
        return;
      }

      // Auto-login after registration
      const loginRes = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone: phone.trim(), password }),
      });

      if (loginRes.ok) {
        toast.success("Account created! Welcome to PellingCab 🎉");
      } else {
        toast.success("Account created! Please sign in.");
      }
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
          <h1 className="font-display text-3xl">Create your account</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Join PellingCab for premium chauffeured travel.
          </p>

          <form onSubmit={handleSignUp} className="mt-6 space-y-4">
            <Field label="Full name" icon={<User className="h-4 w-4" />}>
              <TextInput
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Rakesh Sharma"
              />
            </Field>
            <Field label="Email address" icon={<Mail className="h-4 w-4" />}>
              <TextInput
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="rakesh@example.com"
              />
            </Field>
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
                placeholder="At least 6 characters"
              />
            </Field>
            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-2xl gold-gradient px-5 py-3 text-sm font-semibold text-background disabled:opacity-60"
            >
              {loading ? "Creating account…" : "Sign up"}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link to="/login" className="text-primary hover:underline">
              Sign in
            </Link>
          </p>
        </div>
      </main>
      <Footer />
    </>
  );
}
