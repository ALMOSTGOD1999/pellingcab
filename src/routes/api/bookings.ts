import { createFileRoute } from "@tanstack/react-router";
import type {} from "@tanstack/react-start";
import { db } from "@/db/index";
import { bookings as bookingsTable } from "@/db/schema";
import { getUserFromRequest } from "@/server/auth";
import { sendBookingConfirmationEmail } from "@/server/email";

export const Route = createFileRoute("/api/bookings")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        let body: {
          id?: string;
          mode?: string;
          vehicleId?: string;
          routeId?: string;
          seats?: number[];
          fare?: number;
          taxes?: number;
          total?: number;
          status?: string;
          pickup?: string;
          destination?: string;
          date?: string;
          time?: string;
          kind?: string;
          name?: string;
          email?: string;
          phone?: string;
          paymentMethod?: string;
          paymentStatus?: string;
          shuttleDate?: string;
          shuttleDeparture?: string;
        };

        try {
          body = await request.json();
        } catch {
          return new Response(JSON.stringify({ error: "Invalid JSON" }), {
            status: 400,
            headers: { "Content-Type": "application/json" },
          });
        }

        if (!body.id || !body.vehicleId || !body.name || !body.phone || !body.date || !body.time) {
          return new Response(
            JSON.stringify({ error: "Missing required fields" }),
            { status: 400, headers: { "Content-Type": "application/json" } },
          );
        }

        // Try to get logged-in user (optional — guest bookings allowed)
        let userId: number | null = null;
        try {
          const user = await getUserFromRequest(request);
          if (user) userId = user.userId;
        } catch {
          // Not logged in — that's fine
        }

        try {
          const [booking] = await db
            .insert(bookingsTable)
            .values({
              id: body.id,
              userId,
              mode: body.mode || "rental",
              vehicleId: body.vehicleId,
              routeId: body.routeId || null,
              seats: body.seats || [],
              fare: body.fare || 0,
              taxes: body.taxes || 0,
              total: body.total || 0,
              status: body.status || "confirmed",
              pickup: body.pickup || "",
              destination: body.destination || "",
              date: body.date,
              time: body.time,
              kind: body.kind || null,
              name: body.name,
              email: body.email || "",
              phone: body.phone,
              paymentMethod: body.paymentMethod || "unknown",
              paymentStatus: body.paymentStatus || "pending",
              shuttleDate: body.shuttleDate || null,
              shuttleDeparture: body.shuttleDeparture || null,
            })
            .returning({ id: bookingsTable.id });

          // Send confirmation email (fire-and-forget)
          if (body.email && body.email.includes("@")) {
            sendBookingConfirmationEmail(body.email, {
              id: body.id,
              name: body.name,
              pickup: body.pickup || "",
              destination: body.destination || "",
              date: body.date,
              time: body.time,
              vehicle: body.vehicleId,
              total: body.total || 0,
              mode: body.mode || "rental",
            }).catch((err) => console.error("Booking confirmation email failed:", err));
          }

          return new Response(JSON.stringify({ ok: true, bookingId: booking.id }), {
            status: 201,
            headers: { "Content-Type": "application/json" },
          });
        } catch (err) {
          console.error("Booking save error:", err);
          return new Response(
            JSON.stringify({ error: "Failed to save booking" }),
            { status: 500, headers: { "Content-Type": "application/json" } },
          );
        }
      },
    },
  },
});
