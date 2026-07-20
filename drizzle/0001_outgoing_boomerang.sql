ALTER TABLE "users" ADD COLUMN "date_of_birth" varchar(20);--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "is_admin" boolean DEFAULT false NOT NULL;