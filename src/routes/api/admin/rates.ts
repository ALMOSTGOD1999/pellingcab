import { createFileRoute } from "@tanstack/react-router";
import type {} from "@tanstack/react-start";
import { db } from "@/db/index";
import { vehicles, shuttleRoutes } from "@/db/schema";
import { requireAdmin } from "@/server/auth";
import { eq } from "drizzle-orm";

export const Route = createFileRoute("/api/admin/rates")({
  server: {
    handlers: {
      GET: async ({ request }) => {
        try {
          await requireAdmin(request);
          const [vList, rList] = await Promise.all([
            db.select().from(vehicles),
            db.select().from(shuttleRoutes),
          ]);
          return new Response(JSON.stringify({ vehicles: vList, shuttleRoutes: rList }), {
            status: 200,
            headers: { "Content-Type": "application/json" },
          });
        } catch (err) {
          console.error("Admin rates error:", err);
          return new Response(JSON.stringify({ error: "Database unavailable" }), {
            status: 500,
            headers: { "Content-Type": "application/json" },
          });
        }
      },

      PUT: async ({ request }) => {
        try {
          await requireAdmin(request);
          const body = (await request.json()) as {
            vehicleId?: string;
            routeId?: string;
            pricePerHalfDay?: number;
            pricePerFullDay?: number;
            pricePerSeat?: number;
          };

          if (body.vehicleId) {
            const updates: Record<string, number> = {};
            if (typeof body.pricePerHalfDay === "number")
              updates.pricePerHalfDay = body.pricePerHalfDay;
            if (typeof body.pricePerFullDay === "number")
              updates.pricePerFullDay = body.pricePerFullDay;
            if (Object.keys(updates).length > 0) {
              await db.update(vehicles).set(updates).where(eq(vehicles.id, body.vehicleId));
            }
          }

          if (body.routeId && typeof body.pricePerSeat === "number") {
            await db
              .update(shuttleRoutes)
              .set({ pricePerSeat: body.pricePerSeat })
              .where(eq(shuttleRoutes.id, body.routeId));
          }

          return new Response(JSON.stringify({ ok: true }), {
            status: 200,
            headers: { "Content-Type": "application/json" },
          });
        } catch (err) {
          console.error("Admin rates update error:", err);
          return new Response(JSON.stringify({ error: "Database unavailable" }), {
            status: 500,
            headers: { "Content-Type": "application/json" },
          });
        }
      },
    },
  },
});
