import "dotenv/config";
import { eq } from "drizzle-orm";
import postgres from "postgres";
import { drizzle } from "drizzle-orm/postgres-js";
import * as schema from "./schema";
import { hashPassword } from "@/server/auth";

const client = postgres(process.env.DATABASE_URL!, { max: 1 });
const db = drizzle(client, { schema });

async function main() {
  console.log("Seeding database...");

  // ── Admin user (id: Admin, password: Pelling@123) ────────────────────
  const existingAdmin = await db
    .select()
    .from(schema.users)
    .where(eq(schema.users.phone, "Admin"))
    .limit(1);

  if (existingAdmin.length === 0) {
    await db.insert(schema.users).values({
      phone: "Admin",
      name: "Administrator",
      email: "admin@pellingcab.com",
      isAdmin: true,
      passwordHash: await hashPassword("Pelling@123"),
    });
    console.log("✓ Admin user created (phone: Admin, password: Pelling@123)");
  } else {
    // Update password in case it changed
    await db
      .update(schema.users)
      .set({ passwordHash: await hashPassword("Pelling@123") })
      .where(eq(schema.users.phone, "Admin"));
    console.log("✓ Admin user updated");
  }

  // ── Vehicles ─────────────────────────────────────────────────────────
  const existingVehicles = await db.select().from(schema.vehicles);
  if (existingVehicles.length === 0) {
    await db.insert(schema.vehicles).values([
      {
        id: "innova",
        name: "Toyota Innova Crysta",
        category: "Premium SUV",
        image: "/car-innova.jpg",
        seats: 7,
        luggage: 4,
        ac: true,
        pricePerHalfDay: 2499,
        pricePerFullDay: 4499,
        rating: 4.9,
        layout: 7,
      },
      {
        id: "fortuner",
        name: "Toyota Fortuner",
        category: "Luxury SUV",
        image: "/car-fortuner.jpg",
        seats: 7,
        luggage: 5,
        ac: true,
        pricePerHalfDay: 3999,
        pricePerFullDay: 6999,
        rating: 4.8,
        layout: 7,
      },
      {
        id: "etios",
        name: "Toyota Etios",
        category: "Sedan",
        image: "/car-etios.jpg",
        seats: 4,
        luggage: 2,
        ac: true,
        pricePerHalfDay: 1499,
        pricePerFullDay: 2699,
        rating: 4.7,
        layout: 4,
      },
    ]);
    console.log("✓ Vehicles seeded");
  }

  // ── Shuttle Routes ───────────────────────────────────────────────────
  const existingRoutes = await db.select().from(schema.shuttleRoutes);
  if (existingRoutes.length === 0) {
    await db.insert(schema.shuttleRoutes).values([
      {
        id: "pel-ixb",
        from: "Pelling",
        to: "Bagdogra Airport (IXB)",
        distanceKm: 155,
        durationHrs: 5,
        vehicleId: "innova",
        pricePerSeat: 1299,
        departures: ["03:30", "06:00", "09:00", "13:00"],
        scenic: true,
      },
      {
        id: "ixb-pel",
        from: "Bagdogra Airport (IXB)",
        to: "Pelling",
        distanceKm: 155,
        durationHrs: 5,
        vehicleId: "innova",
        pricePerSeat: 1299,
        departures: ["10:00", "13:30", "16:00", "19:30"],
        scenic: true,
      },
    ]);
    console.log("✓ Shuttle routes seeded");
  }

  // ── Default Driver ───────────────────────────────────────────────────
  const existingDrivers = await db.select().from(schema.drivers);
  if (existingDrivers.length === 0) {
    await db.insert(schema.drivers).values({
      name: "Rakesh Sharma",
      phone: "+91 98110 45231",
      rating: 4.9,
      trips: 1240,
      vehicleNumber: "DL 3C AB 4521",
      arrivalMins: 8,
    });
    console.log("✓ Default driver seeded");
  }

  console.log("Seed complete.");
  await client.end();
}

main().catch((err) => {
  console.error("Seed failed:", err);
  process.exit(1);
});
