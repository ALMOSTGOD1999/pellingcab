import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Banknote, CreditCard, Landmark, QrCode, Smartphone, Wallet } from "lucide-react";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import { PageShell } from "@/components/AppShell";
import { occupiedSeatsFor, vehicles } from "@/lib/mock";
import { useApp, type Booking } from "@/lib/store";

export const Route = createFileRoute("/payment")({
  head: () => ({ meta: [{ title: "Payment · PellingCab" }] }),
  component: Payment,
});

const methods = [
  { id: "upi", label: "UPI", icon: Smartphone, hint: "PhonePe, GPay, Paytm" },
  { id: "qr", label: "QR Code", icon: QrCode, hint: "Scan to pay" },
  { id: "card", label: "Card", icon: CreditCard, hint: "Visa · Master · Rupay" },
  { id: "netbank", label: "Net Banking", icon: Landmark, hint: "All major banks" },
  { id: "wallet", label: "Wallets", icon: Wallet, hint: "Paytm, Amazon Pay" },
  { id: "cash", label: "Cash", icon: Banknote, hint: "Pay driver in cash" },
] as const;

function Payment() {
  const nav = useNavigate();
  const form = useApp(s => s.form);
  const vid = useApp(s => s.selectedVehicleId);
  const seats = useApp(s => s.selectedSeats);
  const addBooking = useApp(s => s.addBooking);
  const setCurrent = useApp(s => s.setCurrentBooking);
  const [method, setMethod] = useState<string>("upi");
  const [loading, setLoading] = useState(false);

  const v = vehicles.find(x => x.id === vid) ?? vehicles[0];
  const base = form.kind === "half" ? v.pricePerHalfDay : v.pricePerFullDay;
  const seatUp = Math.max(0, seats.length - 1) * 200;
  const fare = base + seatUp;
  const taxes = Math.round(fare * 0.18);
  const total = fare + taxes;

  function pay() {
    setLoading(true);
    setTimeout(() => {
      // simulate: cash always pending; card success unless card number ends 0
      const ok = Math.random() > 0.08;
      if (!ok) { setLoading(false); toast.error("Payment failed. Try another method."); return; }
      const id = "PC" + Math.random().toString(36).slice(2, 8).toUpperCase();
      const booking: Booking = {
        id, createdAt: new Date().toISOString(),
        vehicleId: v.id, seats: [...seats],
        fare, taxes, total,
        status: "confirmed",
        form: { ...form },
        payment: { method, status: method === "cash" ? "pending" : "paid" },
      };
      addBooking(booking);
      setCurrent(id);
      // simulate driver flow progression
      const nextSteps: Array<Booking["status"]> = ["assigned","on_the_way","arrived","in_trip","completed"];
      nextSteps.forEach((s, i) => setTimeout(() => useApp.getState().updateBooking(id, { status: s }), (i + 1) * 5000));
      toast.success("Payment successful");
      nav({ to: "/success" });
    }, 1200);
  }

  const seatOccupied = useMemo(() => occupiedSeatsFor(v.id, form.date + form.time), [v.id, form.date, form.time]);
  void seatOccupied;

  return (
    <PageShell title="Payment" subtitle="Choose a method. All transactions are 256-bit encrypted.">
      <div className="grid gap-6 lg:grid-cols-[1.4fr_1fr]">
        <div className="glass rounded-3xl p-5 sm:p-7">
          <div className="grid gap-3 sm:grid-cols-2">
            {methods.map(m => {
              const Icon = m.icon;
              const active = method === m.id;
              return (
                <button
                  key={m.id}
                  onClick={() => setMethod(m.id)}
                  className={`text-left flex items-center gap-3 rounded-2xl border p-4 transition
                    ${active ? "border-primary/80 bg-primary/5 shadow-glow" : "border-border bg-card/50 hover:border-primary/40"}`}
                >
                  <span className={`grid h-11 w-11 place-items-center rounded-xl ${active ? "gold-gradient text-background" : "bg-muted text-muted-foreground"}`}>
                    <Icon className="h-5 w-5" />
                  </span>
                  <div className="min-w-0">
                    <p className="font-medium">{m.label}</p>
                    <p className="text-xs text-muted-foreground truncate">{m.hint}</p>
                  </div>
                </button>
              );
            })}
          </div>

          <div className="mt-6 rounded-2xl border border-border p-5 bg-background/40">
            {method === "upi" && (
              <div className="grid gap-3 sm:grid-cols-[1fr_auto] items-end">
                <label className="block">
                  <span className="text-xs uppercase tracking-widest text-muted-foreground">Your UPI ID</span>
                  <input placeholder="name@bank" className="mt-1 w-full rounded-xl bg-transparent border border-border px-3 py-2.5 outline-none focus:border-primary" />
                </label>
                <button onClick={pay} disabled={loading} className="rounded-xl gold-gradient px-5 py-2.5 text-sm font-semibold text-background disabled:opacity-50">
                  {loading ? "Verifying..." : `Pay ₹${total.toLocaleString("en-IN")}`}
                </button>
              </div>
            )}
            {method === "qr" && (
              <div className="flex flex-col items-center gap-3">
                <div className="h-44 w-44 rounded-2xl bg-white p-3">
                  <div className="h-full w-full" style={{
                    backgroundImage: "repeating-conic-gradient(#000 0 25%, #fff 0 50%)",
                    backgroundSize: "16px 16px",
                    borderRadius: 8,
                  }} />
                </div>
                <p className="text-xs text-muted-foreground">Scan with any UPI app to pay ₹{total.toLocaleString("en-IN")}</p>
                <button onClick={pay} disabled={loading} className="rounded-xl gold-gradient px-5 py-2 text-sm font-semibold text-background disabled:opacity-50">
                  {loading ? "Confirming..." : "I've paid"}
                </button>
              </div>
            )}
            {method === "card" && (
              <div className="grid gap-3">
                <label className="block">
                  <span className="text-xs uppercase tracking-widest text-muted-foreground">Card number</span>
                  <input placeholder="4242 4242 4242 4242" className="mt-1 w-full rounded-xl bg-transparent border border-border px-3 py-2.5 outline-none focus:border-primary" />
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <input placeholder="MM/YY" className="rounded-xl bg-transparent border border-border px-3 py-2.5 outline-none focus:border-primary" />
                  <input placeholder="CVV" className="rounded-xl bg-transparent border border-border px-3 py-2.5 outline-none focus:border-primary" />
                </div>
                <button onClick={pay} disabled={loading} className="rounded-xl gold-gradient px-5 py-3 text-sm font-semibold text-background disabled:opacity-50">
                  {loading ? "Processing..." : `Pay ₹${total.toLocaleString("en-IN")}`}
                </button>
              </div>
            )}
            {method === "netbank" && (
              <div className="grid gap-3">
                <select className="rounded-xl bg-transparent border border-border px-3 py-2.5 outline-none focus:border-primary">
                  <option>HDFC Bank</option><option>ICICI Bank</option><option>SBI</option><option>Axis Bank</option><option>Kotak</option>
                </select>
                <button onClick={pay} disabled={loading} className="rounded-xl gold-gradient px-5 py-3 text-sm font-semibold text-background disabled:opacity-50">
                  {loading ? "Redirecting..." : `Pay ₹${total.toLocaleString("en-IN")}`}
                </button>
              </div>
            )}
            {method === "wallet" && (
              <div className="grid gap-3 sm:grid-cols-3">
                {["Paytm","Amazon Pay","Mobikwik"].map(w => (
                  <button key={w} onClick={pay} disabled={loading} className="rounded-xl border border-border px-3 py-4 text-sm hover:border-primary">{w}</button>
                ))}
              </div>
            )}
            {method === "cash" && (
              <div className="text-sm">
                <p className="text-muted-foreground">Pay ₹{total.toLocaleString("en-IN")} in cash to your chauffeur on arrival. Booking will be marked <strong>Payment pending</strong>.</p>
                <button onClick={pay} disabled={loading} className="mt-4 rounded-xl gold-gradient px-5 py-3 text-sm font-semibold text-background disabled:opacity-50">
                  {loading ? "Confirming..." : "Confirm cash payment"}
                </button>
              </div>
            )}
          </div>
        </div>

        <aside className="glass rounded-3xl p-6 h-fit">
          <h3 className="font-display text-2xl">Order</h3>
          <p className="mt-1 text-sm text-muted-foreground">{v.name} · {form.kind === "half" ? "Half day" : "Full day"}</p>
          <dl className="mt-4 space-y-1.5 text-sm">
            <div className="flex justify-between"><dt className="text-muted-foreground">Fare</dt><dd>₹{fare.toLocaleString("en-IN")}</dd></div>
            <div className="flex justify-between"><dt className="text-muted-foreground">Taxes</dt><dd>₹{taxes.toLocaleString("en-IN")}</dd></div>
            <hr className="my-2 border-border" />
            <div className="flex justify-between text-lg font-semibold"><dt>Total</dt><dd className="gold-text">₹{total.toLocaleString("en-IN")}</dd></div>
          </dl>
          <p className="mt-4 text-xs text-muted-foreground">Seats: {seats.length ? seats.join(", ") : "—"}</p>
        </aside>
      </div>
    </PageShell>
  );
}
