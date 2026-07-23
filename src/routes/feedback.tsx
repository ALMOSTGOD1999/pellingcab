import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { PageShell } from "@/components/AppShell";
import { Rating } from "@/components/Rating";
import { useApp } from "@/lib/store";

export const Route = createFileRoute("/feedback")({
  head: () => ({ meta: [{ title: "Rate your trip · PellingCab" }] }),
  component: Feedback,
});

function Feedback() {
  const [rating, setRating] = useState(5);
  const [review, setReview] = useState("");
  const id = useApp((s) => s.currentBookingId);
  const update = useApp((s) => s.updateBooking);
  const nav = useNavigate();
  return (
    <PageShell title="How was your ride?" subtitle="Your feedback keeps chauffeurs at their best.">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          if (id) update(id, { rating, review });
          toast.success("Thanks for the feedback ✨");
          nav({ to: "/" });
        }}
        className="glass rounded-3xl p-6 max-w-xl"
      >
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">Overall rating</p>
          <Rating value={rating} onChange={setRating} />
        </div>
        <label className="mt-6 block">
          <span className="text-xs uppercase tracking-widest text-muted-foreground">
            Tell us more
          </span>
          <textarea
            value={review}
            onChange={(e) => setReview(e.target.value)}
            rows={5}
            maxLength={1000}
            placeholder="What went well? What could be better?"
            className="mt-1 w-full rounded-xl border border-border bg-transparent px-3 py-2.5 resize-none"
          />
        </label>
        <button className="mt-6 w-full rounded-2xl gold-gradient px-5 py-3 text-sm font-semibold text-background">
          Submit review
        </button>
      </form>
    </PageShell>
  );
}
