import { createFileRoute } from "@tanstack/react-router";
import type {} from "@tanstack/react-start";
import { db } from "@/db/index";
import { users } from "@/db/schema";
import { requireAdmin } from "@/server/auth";
import { desc } from "drizzle-orm";

export const Route = createFileRoute("/api/admin/users")({
  server: {
    handlers: {
      GET: async ({ request }) => {
        try {
          await requireAdmin(request);
          const list = await db
            .select({
              id: users.id,
              name: users.name,
              email: users.email,
              phone: users.phone,
              isAdmin: users.isAdmin,
              createdAt: users.createdAt,
            })
            .from(users)
            .orderBy(desc(users.createdAt));

          return new Response(JSON.stringify({ users: list }), {
            status: 200,
            headers: { "Content-Type": "application/json" },
          });
        } catch (err) {
          console.error("Admin users error:", err);
          return new Response(JSON.stringify({ error: "Database unavailable" }), {
            status: 500,
            headers: { "Content-Type": "application/json" },
          });
        }
      },
    },
  },
});
