import { createFileRoute } from "@tanstack/react-router";
import type {} from "@tanstack/react-start";
import { loginUser } from "@/server/auth";
import { sendWelcomeEmail } from "@/server/email";
import { db } from "@/db/index";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";

export const Route = createFileRoute("/api/auth/login")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        let body: { phone?: string; password?: string };
        try {
          body = await request.json();
        } catch {
          return new Response(JSON.stringify({ error: "Invalid JSON" }), {
            status: 400,
            headers: { "Content-Type": "application/json" },
          });
        }

        if (!body.phone || !body.password) {
          return new Response(JSON.stringify({ error: "phone and password are required" }), {
            status: 400,
            headers: { "Content-Type": "application/json" },
          });
        }

        try {
          const result = await loginUser(body.phone, body.password);
          if (!result) {
            return new Response(JSON.stringify({ error: "Invalid credentials" }), {
              status: 401,
              headers: { "Content-Type": "application/json" },
            });
          }

          // Send welcome email on first login (no welcomedAt set yet)
          if (result.user.email) {
            const [dbUser] = await db
              .select({ welcomedAt: users.welcomedAt })
              .from(users)
              .where(eq(users.id, result.user.userId))
              .limit(1);

            if (dbUser && !dbUser.welcomedAt) {
              // Fire-and-forget: send email, then mark as welcomed
              sendWelcomeEmail(result.user.email, result.user.name)
                .then(() =>
                  db
                    .update(users)
                    .set({ welcomedAt: new Date() })
                    .where(eq(users.id, result.user.userId)),
                )
                .catch((err) => console.error("Welcome email failed for", result.user.email, err));
            }
          }

          return new Response(JSON.stringify({ ok: true, user: result.user }), {
            status: 200,
            headers: {
              "Content-Type": "application/json",
              "Set-Cookie": result.sessionCookie,
            },
          });
        } catch (err) {
          console.error("Login error:", err);
          return new Response(
            JSON.stringify({ error: "Server error — is the database running?" }),
            { status: 500, headers: { "Content-Type": "application/json" } },
          );
        }
      },
    },
  },
});
