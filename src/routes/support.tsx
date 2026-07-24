import { createFileRoute } from "@tanstack/react-router";
import { toast } from "sonner";
import { Mail, MessageCircle, Phone } from "lucide-react";
import { useState } from "react";
import { PageShell } from "@/components/AppShell";

export const Route = createFileRoute("/support")({
  head: () => ({ meta: [{ title: "Support · PellingCab" }] }),
  component: Support,
});

function Support() {
  const [msg, setMsg] = useState("");
  return (
    <PageShell title="Contact support" subtitle="We answer in under 2 minutes, 24/7.">
      <div className="grid gap-6 lg:grid-cols-[1fr_1.2fr]">
        <div className="grid gap-3">
          <Item icon={<Phone className="h-5 w-5" />} title="Call us" hint="+91 98110 00000" />
          <Item icon={<Mail className="h-5 w-5" />} title="Email" hint="help@pellingcab.com" />
          <Item icon={<MessageCircle className="h-5 w-5" />} title="Chat" hint="Live in-app chat" />
        </div>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            toast.success("Message sent. We'll reply shortly.");
            setMsg("");
          }}
          className="glass rounded-3xl p-6"
        >
          <label className="block">
            <span className="text-xs uppercase tracking-widest text-muted-foreground">
              How can we help?
            </span>
            <textarea
              value={msg}
              onChange={(e) => setMsg(e.target.value)}
              rows={6}
              maxLength={1000}
              className="mt-1 w-full rounded-xl border border-border bg-transparent px-3 py-2.5 resize-none"
            />
          </label>
          <button className="mt-4 w-full rounded-2xl gold-gradient px-5 py-3 text-sm font-semibold text-background">
            Send message
          </button>
        </form>
      </div>
    </PageShell>
  );
}
function Item({ icon, title, hint }: { icon: React.ReactNode; title: string; hint: string }) {
  return (
    <div className="glass rounded-2xl p-4 flex items-center gap-4">
      <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl gold-gradient text-background">
        {icon}
      </span>
      <div>
        <p className="font-medium">{title}</p>
        <p className="text-xs text-muted-foreground">{hint}</p>
      </div>
    </div>
  );
}
