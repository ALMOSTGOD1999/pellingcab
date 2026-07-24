import { createFileRoute } from "@tanstack/react-router";
import type {} from "@tanstack/react-start";
import { hashPassword } from "@/server/auth";
import { sendWelcomeEmail } from "@/server/email";
import { db } from "@/db/index";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";

export const Route = createFileRoute("/api/auth/register")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        let body: { phone?: string; password?: string; name?: string; email?: string };
        try {
          body = await request.json();
        } catch {
          return new Response(JSON.stringify({ error: "Invalid JSON" }), {
            status: 400,
            headers: { "Content-Type": "application/json" },
          });
        }

        const { phone, password, name, email } = body;

        if (!phone || !password) {
          return new Response(
            JSON.stringify({ error: "phone and password are required" }),
            { status: 400, headers: { "Content-Type": "application/json" } },
          );
        }

        if (password.length < 6) {
          return new Response(
            JSON.stringify({ error: "Password must be at least 6 characters" }),
            { status: 400, headers: { "Content-Type": "application/json" } },
          );
        }

        // Check if phone is already taken
        const existing = await db.select({ id: users.id }).from(users).where(eq(users.phone, phone)).limit(1);
        if (existing.length > 0) {
          return new Response(
            JSON.stringify({ error: "An account with this phone number already exists" }),
            { status: 409, headers: { "Content-Type": "application/json" } },
          );
        }

        try {
          const passwordHash = await hashPassword(password);

          const [newUser] = await db
            .insert(users)
            .values({
              phone,
              passwordHash,
              name: name || null,
              email: email || null,
            })
            .returning({ id: users.id, name: users.name, email: users.email, phone: users.phone });

          // Send welcome email if email provided (fire-and-forget)
          if (newUser.email) {
            sendWelcomeEmail(newUser.email, newUser.name || newUser.email.split("@")[0])
              .then(() =>
                db
                  .update(users)
                  .set({ welcomedAt: new Date() })
                  .where(eq(users.id, newUser.id)),
              )
              .catch((err) => console.error("Welcome email failed for", newUser.email, err));
          }

          return new Response(JSON.stringify({ ok: true, userId: newUser.id }), {
            status: 201,
            headers: { "Content-Type": "application/json" },
          });
        } catch (err) {
          console.error("Register error:", err);
          return new Response(
            JSON.stringify({ error: "Server error — is the database running?" }),
            { status: 500, headers: { "Content-Type": "application/json" } },
          );
        }
      },
    },
  },
});
