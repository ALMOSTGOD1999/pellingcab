import { createFileRoute } from "@tanstack/react-router";
import type {} from "@tanstack/react-start";
import { sendWelcomeEmail } from "@/server/email";

export const Route = createFileRoute("/api/welcome")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        let body: { email?: string; name?: string };
        try {
          body = await request.json();
        } catch {
          return new Response(JSON.stringify({ error: "Invalid JSON body" }), {
            status: 400,
            headers: { "Content-Type": "application/json" },
          });
        }

        const { email, name } = body;

        if (!email || typeof email !== "string" || !email.includes("@")) {
          return new Response(JSON.stringify({ error: "A valid email address is required" }), {
            status: 400,
            headers: { "Content-Type": "application/json" },
          });
        }

        const userName =
          name && typeof name === "string" && name.trim() ? name.trim() : email.split("@")[0];

        const result = await sendWelcomeEmail(email, userName);

        return new Response(JSON.stringify({ ok: true, ...result }), {
          status: 200,
          headers: { "Content-Type": "application/json" },
        });
      },
    },
  },
});
