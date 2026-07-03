import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Mail, Phone } from "lucide-react";
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
  const nav = useNavigate();
  return (
    <>
      <Navbar />
      <main className="mx-auto max-w-md px-4 sm:px-6 py-16 animate-float-up">
        <div className="glass rounded-3xl p-6 sm:p-8">
          <h1 className="font-display text-3xl">Welcome back</h1>
          <p className="text-sm text-muted-foreground mt-1">Sign in to see your bookings and speed up checkout.</p>
          <form onSubmit={(e) => { e.preventDefault(); toast.success("OTP sent"); nav({ to: "/" }); }} className="mt-6 space-y-4">
            <Field label="Phone number" icon={<Phone className="h-4 w-4" />}>
              <TextInput value={phone} onChange={e => setPhone(e.target.value)} placeholder="+91 98110 00000" />
            </Field>
            <button className="w-full rounded-2xl gold-gradient px-5 py-3 text-sm font-semibold text-background">Send OTP</button>
          </form>
          <div className="my-6 flex items-center gap-3 text-xs text-muted-foreground">
            <span className="h-px flex-1 bg-border" /> or <span className="h-px flex-1 bg-border" />
          </div>
          <button className="w-full rounded-2xl border border-border px-5 py-3 text-sm inline-flex items-center justify-center gap-2 hover:border-primary">
            <Mail className="h-4 w-4" /> Continue with email
          </button>
        </div>
      </main>
      <Footer />
    </>
  );
}
