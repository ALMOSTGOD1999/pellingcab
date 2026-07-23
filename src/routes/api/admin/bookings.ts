import { createFileRoute } from "@tanstack/react-router";
import type {} from "@tanstack/react-start";
import { db } from "@/db/index";
import { bookings as bookingsTable } from "@/db/schema";
import { requireAdmin } from "@/server/auth";
import { desc } from "drizzle-orm";

export const Route = createFileRoute("/api/admin/bookings")({
  server: {
    handlers: {
      GET: async ({ request }) => {
        try {
          await requireAdmin(request);
          const list = await db
            .select()
            .from(bookingsTable)
            .orderBy(desc(bookingsTable.createdAt))
            .limit(200);

          return new Response(JSON.stringify({ bookings: list }), {
            status: 200,
            headers: { "Content-Type": "application/json" },
          });
        } catch (err) {
          console.error("Admin bookings error:", err);
          return new Response(JSON.stringify({ error: "Database unavailable" }), {
            status: 500,
            headers: { "Content-Type": "application/json" },
          });
        }
      },
    },
  },
});
