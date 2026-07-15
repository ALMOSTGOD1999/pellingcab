import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, Banknote, CheckCircle2, CreditCard, Plus, Smartphone, Star, Trash2, Wallet } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { PageShell } from "@/components/AppShell";
import { Field, TextInput } from "@/components/Field";
import { type PaymentMethod, useApp } from "@/lib/store";

export const Route = createFileRoute("/payment-methods")({
  head: () => ({ meta: [{ title: "Payment methods · PellingCab" }] }),
  component: PaymentMethods,
});

type NewType = "card" | "upi" | "wallet";

function PaymentMethods() {
  const methods = useApp(s => s.paymentMethods);
  const addPaymentMethod = useApp(s => s.addPaymentMethod);
  const removePaymentMethod = useApp(s => s.removePaymentMethod);
  const setDefaultPaymentMethod = useApp(s => s.setDefaultPaymentMethod);

  const [adding, setAdding] = useState<NewType | null>(null);
  const [card, setCard] = useState({ number: "", name: "", expiry: "" });
  const [upi, setUpi] = useState("");
  const [wallet, setWallet] = useState<"paytm" | "phonepe" | "amazonpay">("paytm");

  function submit() {
    let m: PaymentMethod | null = null;
    if (adding === "card") {
      const digits = card.number.replace(/\D/g, "");
      if (digits.length < 12) return toast.error("Enter a valid card number");
      if (!card.name.trim()) return toast.error("Enter cardholder name");
      if (!/^\d{2}\/\d{2}$/.test(card.expiry)) return toast.error("Expiry must be MM/YY");
      m = {
        id: `pm_card_${Date.now()}`,
        type: "card",
        label: `${card.name} •••• ${digits.slice(-4)}`,
        detail: `Exp ${card.expiry}`,
        isDefault: methods.length === 0,
      };
    } else if (adding === "upi") {
      if (!/^[\w.-]+@[\w.-]+$/.test(upi)) return toast.error("Enter a valid UPI ID");
      m = {
        id: `pm_upi_${Date.now()}`,
        type: "upi",
        label: upi,
        detail: "UPI",
        isDefault: methods.length === 0,
      };
    } else if (adding === "wallet") {
      const label = wallet === "paytm" ? "Paytm Wallet" : wallet === "phonepe" ? "PhonePe Wallet" : "Amazon Pay";
      m = {
        id: `pm_wallet_${Date.now()}`,
        type: "wallet",
        label,
        detail: "Wallet",
        isDefault: methods.length === 0,
      };
    }
    if (m) {
      addPaymentMethod(m);
      toast.success("Payment method added");
      setAdding(null);
      setCard({ number: "", name: "", expiry: "" });
      setUpi("");
    }
  }

  return (
    <PageShell title="Payment methods" subtitle="Cards, UPI and wallets for faster checkout.">
      <Link to="/profile" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-primary mb-4">
        <ArrowLeft className="h-4 w-4" /> Back to profile
      </Link>

      <div className="grid gap-6 lg:grid-cols-[1.2fr_1fr]">
        <ul className="grid gap-3">
          {methods.length === 0 && (
            <li className="glass rounded-3xl p-8 text-center text-sm text-muted-foreground">No payment methods yet.</li>
          )}
          {methods.map(m => (
            <li key={m.id} className="glass rounded-2xl p-4 flex items-center gap-4">
              <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl gold-gradient text-background">
                {m.type === "card" ? <CreditCard className="h-5 w-5" /> : m.type === "upi" ? <Smartphone className="h-5 w-5" /> : m.type === "wallet" ? <Wallet className="h-5 w-5" /> : <Banknote className="h-5 w-5" />}
              </span>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <p className="font-medium truncate">{m.label}</p>
                  {m.isDefault && (
                    <span className="inline-flex items-center gap-1 rounded-full border border-primary/40 px-2 py-0.5 text-[10px] uppercase tracking-widest text-primary">
                      <Star className="h-2.5 w-2.5 fill-primary" /> Default
                    </span>
                  )}
                </div>
                {m.detail && <p className="text-xs text-muted-foreground truncate">{m.detail}</p>}
              </div>
              <div className="flex shrink-0 items-center gap-1.5">
                {!m.isDefault && (
                  <button
                    onClick={() => { setDefaultPaymentMethod(m.id); toast.success("Default updated"); }}
                    className="rounded-lg border border-border p-2 text-muted-foreground hover:border-primary hover:text-primary"
                    aria-label="Set as default"
                  ><CheckCircle2 className="h-4 w-4" /></button>
                )}
                <button
                  onClick={() => { removePaymentMethod(m.id); toast.success("Removed"); }}
                  className="rounded-lg border border-border p-2 text-muted-foreground hover:border-destructive hover:text-destructive"
                  aria-label="Remove"
                ><Trash2 className="h-4 w-4" /></button>
              </div>
            </li>
          ))}
        </ul>

        <div className="glass rounded-3xl p-6">
          <h3 className="font-display text-xl">Add a payment method</h3>
          <div className="mt-4 grid grid-cols-3 gap-2">
            {(["card", "upi", "wallet"] as const).map(t => (
              <button
                key={t}
                onClick={() => setAdding(t)}
                className={`rounded-2xl border px-3 py-3 text-sm capitalize transition ${adding === t ? "border-primary bg-primary/10 text-primary" : "border-border hover:border-primary"}`}
              >
                {t === "card" ? <CreditCard className="mx-auto mb-1 h-4 w-4" /> : t === "upi" ? <Smartphone className="mx-auto mb-1 h-4 w-4" /> : <Wallet className="mx-auto mb-1 h-4 w-4" />}
                {t}
              </button>
            ))}
          </div>

          {adding === "card" && (
            <div className="mt-4 grid gap-3">
              <Field label="Card number" icon={<CreditCard className="h-4 w-4" />}>
                <TextInput inputMode="numeric" placeholder="1234 5678 9012 3456" value={card.number} onChange={e => setCard(c => ({ ...c, number: e.target.value }))} />
              </Field>
              <Field label="Cardholder name">
                <TextInput placeholder="Name on card" value={card.name} onChange={e => setCard(c => ({ ...c, name: e.target.value }))} />
              </Field>
              <Field label="Expiry (MM/YY)">
                <TextInput placeholder="08/28" value={card.expiry} onChange={e => setCard(c => ({ ...c, expiry: e.target.value }))} />
              </Field>
            </div>
          )}
          {adding === "upi" && (
            <div className="mt-4">
              <Field label="UPI ID" icon={<Smartphone className="h-4 w-4" />}>
                <TextInput placeholder="yourname@okhdfc" value={upi} onChange={e => setUpi(e.target.value)} />
              </Field>
            </div>
          )}
          {adding === "wallet" && (
            <div className="mt-4 grid grid-cols-3 gap-2">
              {(["paytm", "phonepe", "amazonpay"] as const).map(w => (
                <button key={w} onClick={() => setWallet(w)}
                  className={`rounded-xl border px-3 py-2 text-xs capitalize ${wallet === w ? "border-primary text-primary" : "border-border hover:border-primary"}`}>
                  {w === "amazonpay" ? "Amazon Pay" : w}
                </button>
              ))}
            </div>
          )}

          {adding && (
            <button onClick={submit} className="mt-5 w-full inline-flex items-center justify-center gap-2 rounded-2xl gold-gradient px-5 py-3 text-sm font-semibold text-background">
              <Plus className="h-4 w-4" /> Save method
            </button>
          )}
          <p className="mt-4 text-[11px] text-muted-foreground">Demo only — no real card data is stored or transmitted.</p>
        </div>
      </div>
    </PageShell>
  );
}
