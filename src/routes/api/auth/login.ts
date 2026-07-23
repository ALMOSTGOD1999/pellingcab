import { createFileRoute } from "@tanstack/react-router";
import type {} from "@tanstack/react-start";
import { loginUser } from "@/server/auth";

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
