import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { PageShell } from "@/components/AppShell";

export const Route = createFileRoute("/refund")({
  head: () => ({ meta: [{ title: "Cancel & refund · PellingCab" }] }),
  component: Refund,
});

function Refund() {
  const [reason, setReason] = useState("plans_changed");
  const [notes, setNotes] = useState("");
  const nav = useNavigate();
  return (
    <PageShell title="Cancel & request refund" subtitle="Free cancellation up to 2 hours before pickup.">
      <form onSubmit={(e) => { e.preventDefault(); toast.success("Refund request submitted. You'll hear back in 24h."); nav({ to: "/history" }); }}
            className="glass rounded-3xl p-6 max-w-xl">
        <label className="block">
          <span className="text-xs uppercase tracking-widest text-muted-foreground">Reason</span>
          <select value={reason} onChange={e => setReason(e.target.value)} className="mt-1 w-full rounded-xl border border-border bg-transparent px-3 py-2.5">
            <option value="plans_changed">Plans changed</option>
            <option value="wrong_time">Wrong pickup time</option>
            <option value="found_alternative">Found alternative transport</option>
            <option value="driver_issue">Driver / vehicle issue</option>
            <option value="other">Other</option>
          </select>
        </label>
        <label className="mt-4 block">
          <span className="text-xs uppercase tracking-widest text-muted-foreground">Additional notes</span>
          <textarea value={notes} onChange={e => setNotes(e.target.value)} rows={4} maxLength={500}
            className="mt-1 w-full rounded-xl border border-border bg-transparent px-3 py-2.5 resize-none" />
        </label>
        <button className="mt-6 w-full rounded-2xl gold-gradient px-5 py-3 text-sm font-semibold text-background">Submit refund request</button>
      </form>
    </PageShell>
  );
}
