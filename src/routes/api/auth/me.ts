import { createFileRoute } from "@tanstack/react-router";
import type {} from "@tanstack/react-start";
import { getUserFromRequest } from "@/server/auth";

export const Route = createFileRoute("/api/auth/me")({
  server: {
    handlers: {
      GET: async ({ request }) => {
        try {
          const user = await getUserFromRequest(request);
          if (!user) {
            return new Response(JSON.stringify({ user: null }), {
              status: 200,
              headers: { "Content-Type": "application/json" },
            });
          }
          return new Response(JSON.stringify({ user }), {
            status: 200,
            headers: { "Content-Type": "application/json" },
          });
        } catch (err) {
          console.error("Auth check error:", err);
          return new Response(JSON.stringify({ user: null, error: "Database unavailable" }), {
            status: 200,
            headers: { "Content-Type": "application/json" },
          });
        }
      },
    },
  },
});
