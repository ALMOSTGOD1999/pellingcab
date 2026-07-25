import {
  pgTable,
  serial,
  varchar,
  text,
  boolean,
  integer,
  real,
  jsonb,
  timestamp,
  uniqueIndex,
  index,
} from "drizzle-orm/pg-core";

// ── Users ──────────────────────────────────────────────────────────────────
export const users = pgTable(
  "users",
  {
    id: serial("id").primaryKey(),
    phone: varchar("phone", { length: 20 }).notNull().unique(),
    email: varchar("email", { length: 255 }),
    name: varchar("name", { length: 255 }),
    avatar: text("avatar"),
    language: varchar("language", { length: 10 }).notNull().default("en"),
    dateOfBirth: varchar("date_of_birth", { length: 20 }),
    isAdmin: boolean("is_admin").notNull().default(false),
    passwordHash: varchar("password_hash", { length: 255 }),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
    welcomedAt: timestamp("welcomed_at", { withTimezone: true }),
  },
  (t) => [index("users_phone_idx").on(t.phone)],
);

// ── Vehicles ───────────────────────────────────────────────────────────────
export const vehicles = pgTable("vehicles", {
  id: varchar("id", { length: 50 }).primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  category: varchar("category", { length: 100 }).notNull(),
  image: varchar("image", { length: 500 }).notNull(),
  seats: integer("seats").notNull(),
  luggage: integer("luggage").notNull(),
  ac: boolean("ac").notNull().default(true),
  pricePerHalfDay: integer("price_per_half_day").notNull(),
  pricePerFullDay: integer("price_per_full_day").notNull(),
  rating: real("rating").notNull(),
  layout: integer("layout").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

// ── Shuttle Routes ─────────────────────────────────────────────────────────
export const shuttleRoutes = pgTable("shuttle_routes", {
  id: varchar("id", { length: 50 }).primaryKey(),
  from: varchar("from", { length: 255 }).notNull(),
  to: varchar("to", { length: 255 }).notNull(),
  distanceKm: integer("distance_km").notNull(),
  durationHrs: integer("duration_hrs").notNull(),
  vehicleId: varchar("vehicle_id", { length: 50 })
    .notNull()
    .references(() => vehicles.id),
  pricePerSeat: integer("price_per_seat").notNull(),
  departures: jsonb("departures").notNull(),
  scenic: boolean("scenic").default(false),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

// ── Bookings ───────────────────────────────────────────────────────────────
export const bookings = pgTable(
  "bookings",
  {
    id: varchar("id", { length: 50 }).primaryKey(),
    userId: integer("user_id").references(() => users.id),
    mode: varchar("mode", { length: 20 }).notNull(),
    vehicleId: varchar("vehicle_id", { length: 50 })
      .notNull()
      .references(() => vehicles.id),
    routeId: varchar("route_id", { length: 50 }).references(() => shuttleRoutes.id),
    seats: jsonb("seats").notNull(),
    fare: integer("fare").notNull(),
    taxes: integer("taxes").notNull(),
    total: integer("total").notNull(),
    status: varchar("status", { length: 30 }).notNull().default("confirmed"),
    pickup: varchar("pickup", { length: 500 }).notNull(),
    destination: varchar("destination", { length: 500 }).notNull(),
    date: varchar("date", { length: 20 }).notNull(),
    time: varchar("time", { length: 10 }).notNull(),
    kind: varchar("kind", { length: 10 }),
    name: varchar("name", { length: 255 }).notNull(),
    email: varchar("email", { length: 255 }).notNull(),
    phone: varchar("phone", { length: 20 }).notNull(),
    shuttleDate: varchar("shuttle_date", { length: 20 }),
    shuttleDeparture: varchar("shuttle_departure", { length: 10 }),
    paymentMethod: varchar("payment_method", { length: 50 }).notNull(),
    paymentStatus: varchar("payment_status", { length: 20 }).notNull(),
    rating: integer("rating"),
    review: text("review"),
    cancellation: jsonb("cancellation"),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [index("bookings_user_id_idx").on(t.userId), index("bookings_status_idx").on(t.status)],
);

// ── Drivers ────────────────────────────────────────────────────────────────
export const drivers = pgTable("drivers", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  phone: varchar("phone", { length: 20 }).notNull(),
  rating: real("rating").notNull(),
  trips: integer("trips").notNull(),
  vehicleNumber: varchar("vehicle_number", { length: 50 }).notNull(),
  arrivalMins: integer("arrival_mins").notNull(),
  active: boolean("active").default(true),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

// ── Payment Methods ────────────────────────────────────────────────────────
export const paymentMethods = pgTable(
  "payment_methods",
  {
    id: varchar("id", { length: 50 }).primaryKey(),
    userId: integer("user_id")
      .notNull()
      .references(() => users.id),
    type: varchar("type", { length: 20 }).notNull(),
    label: varchar("label", { length: 255 }).notNull(),
    detail: varchar("detail", { length: 255 }),
    isDefault: boolean("is_default").default(false),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [index("pm_user_id_idx").on(t.userId)],
);

// ── Seat Occupancy ─────────────────────────────────────────────────────────
export const seatOccupancy = pgTable(
  "seat_occupancy",
  {
    id: serial("id").primaryKey(),
    routeId: varchar("route_id", { length: 50 }).references(() => shuttleRoutes.id),
    vehicleId: varchar("vehicle_id", { length: 50 })
      .notNull()
      .references(() => vehicles.id),
    date: varchar("date", { length: 20 }).notNull(),
    departure: varchar("departure", { length: 10 }).notNull(),
    occupiedSeats: jsonb("occupied_seats").notNull().default([]),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [uniqueIndex("seat_occ_unique_idx").on(t.routeId, t.vehicleId, t.date, t.departure)],
);

// ── Support Messages ───────────────────────────────────────────────────────
export const supportMessages = pgTable("support_messages", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id),
  message: text("message").notNull(),
  status: varchar("status", { length: 20 }).notNull().default("open"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});
