CREATE TABLE "bookings" (
	"id" varchar(50) PRIMARY KEY NOT NULL,
	"user_id" integer NOT NULL,
	"mode" varchar(20) NOT NULL,
	"vehicle_id" varchar(50) NOT NULL,
	"route_id" varchar(50),
	"seats" jsonb NOT NULL,
	"fare" integer NOT NULL,
	"taxes" integer NOT NULL,
	"total" integer NOT NULL,
	"status" varchar(30) DEFAULT 'confirmed' NOT NULL,
	"pickup" varchar(500) NOT NULL,
	"destination" varchar(500) NOT NULL,
	"date" varchar(20) NOT NULL,
	"time" varchar(10) NOT NULL,
	"kind" varchar(10),
	"name" varchar(255) NOT NULL,
	"email" varchar(255) NOT NULL,
	"phone" varchar(20) NOT NULL,
	"shuttle_date" varchar(20),
	"shuttle_departure" varchar(10),
	"payment_method" varchar(50) NOT NULL,
	"payment_status" varchar(20) NOT NULL,
	"rating" integer,
	"review" text,
	"cancellation" jsonb,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "drivers" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(255) NOT NULL,
	"phone" varchar(20) NOT NULL,
	"rating" real NOT NULL,
	"trips" integer NOT NULL,
	"vehicle_number" varchar(50) NOT NULL,
	"arrival_mins" integer NOT NULL,
	"active" boolean DEFAULT true,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "payment_methods" (
	"id" varchar(50) PRIMARY KEY NOT NULL,
	"user_id" integer NOT NULL,
	"type" varchar(20) NOT NULL,
	"label" varchar(255) NOT NULL,
	"detail" varchar(255),
	"is_default" boolean DEFAULT false,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "seat_occupancy" (
	"id" serial PRIMARY KEY NOT NULL,
	"route_id" varchar(50),
	"vehicle_id" varchar(50) NOT NULL,
	"date" varchar(20) NOT NULL,
	"departure" varchar(10) NOT NULL,
	"occupied_seats" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "shuttle_routes" (
	"id" varchar(50) PRIMARY KEY NOT NULL,
	"from" varchar(255) NOT NULL,
	"to" varchar(255) NOT NULL,
	"distance_km" integer NOT NULL,
	"duration_hrs" integer NOT NULL,
	"vehicle_id" varchar(50) NOT NULL,
	"price_per_seat" integer NOT NULL,
	"departures" jsonb NOT NULL,
	"scenic" boolean DEFAULT false,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "support_messages" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer,
	"message" text NOT NULL,
	"status" varchar(20) DEFAULT 'open' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" serial PRIMARY KEY NOT NULL,
	"phone" varchar(20) NOT NULL,
	"email" varchar(255),
	"name" varchar(255),
	"avatar" text,
	"language" varchar(10) DEFAULT 'en' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "users_phone_unique" UNIQUE("phone")
);
--> statement-breakpoint
CREATE TABLE "vehicles" (
	"id" varchar(50) PRIMARY KEY NOT NULL,
	"name" varchar(255) NOT NULL,
	"category" varchar(100) NOT NULL,
	"image" varchar(500) NOT NULL,
	"seats" integer NOT NULL,
	"luggage" integer NOT NULL,
	"ac" boolean DEFAULT true NOT NULL,
	"price_per_half_day" integer NOT NULL,
	"price_per_full_day" integer NOT NULL,
	"rating" real NOT NULL,
	"layout" integer NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "bookings" ADD CONSTRAINT "bookings_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "bookings" ADD CONSTRAINT "bookings_vehicle_id_vehicles_id_fk" FOREIGN KEY ("vehicle_id") REFERENCES "public"."vehicles"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "bookings" ADD CONSTRAINT "bookings_route_id_shuttle_routes_id_fk" FOREIGN KEY ("route_id") REFERENCES "public"."shuttle_routes"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "payment_methods" ADD CONSTRAINT "payment_methods_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "seat_occupancy" ADD CONSTRAINT "seat_occupancy_route_id_shuttle_routes_id_fk" FOREIGN KEY ("route_id") REFERENCES "public"."shuttle_routes"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "seat_occupancy" ADD CONSTRAINT "seat_occupancy_vehicle_id_vehicles_id_fk" FOREIGN KEY ("vehicle_id") REFERENCES "public"."vehicles"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "shuttle_routes" ADD CONSTRAINT "shuttle_routes_vehicle_id_vehicles_id_fk" FOREIGN KEY ("vehicle_id") REFERENCES "public"."vehicles"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "support_messages" ADD CONSTRAINT "support_messages_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "bookings_user_id_idx" ON "bookings" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "bookings_status_idx" ON "bookings" USING btree ("status");--> statement-breakpoint
CREATE INDEX "pm_user_id_idx" ON "payment_methods" USING btree ("user_id");--> statement-breakpoint
CREATE UNIQUE INDEX "seat_occ_unique_idx" ON "seat_occupancy" USING btree ("route_id","vehicle_id","date","departure");--> statement-breakpoint
CREATE INDEX "users_phone_idx" ON "users" USING btree ("phone");