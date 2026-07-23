import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Mail, User } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { Navbar, Footer } from "@/components/AppShell";
import { Field, TextInput } from "@/components/Field";
import { useApp } from "@/lib/store";

const WELCOMED_KEY = "pellingcab_welcomed";

async function sendWelcomeEmail(email: string, name: string) {
  try {
    const res = await fetch("/api/welcome", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, name }),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      console.error("Welcome email failed:", err);
    }
  } catch (err) {
    console.error("Welcome email request failed:", err);
  }
}

export const Route = createFileRoute("/login")({
  head: () => ({ meta: [{ title: "Sign in · PellingCab" }] }),
  component: Login,
});

function Login() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const setForm = useApp((s) => s.setForm);
  const nav = useNavigate();

  const handleSignIn = (e: React.FormEvent) => {
    e.preventDefault();

    if (name) setForm({ name });
    if (email) setForm({ email });

    const alreadyWelcomed = localStorage.getItem(WELCOMED_KEY);
    if (!alreadyWelcomed && email) {
      localStorage.setItem(WELCOMED_KEY, "1");
      sendWelcomeEmail(email, name || email.split("@")[0]);
      toast.success(`Welcome, ${name || "traveller"}! 🎉`);
    } else {
      toast.success("Signed in");
    }

    nav({ to: "/" });
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
            <button
              type="submit"
              className="w-full rounded-2xl gold-gradient px-5 py-3 text-sm font-semibold text-background"
            >
              Sign in
            </button>
          </form>
        </div>
      </main>
      <Footer />
    </>
  );
}
