CREATE TABLE "chores" (
	"id" serial PRIMARY KEY NOT NULL,
	"title" text NOT NULL,
	"apartment_id" text NOT NULL,
	"user_id" text NOT NULL,
	"created_by_user_id" text NOT NULL,
	"deadline" timestamp,
	"is_completed" boolean DEFAULT false NOT NULL,
	"created_at" timestamp DEFAULT now()
);
