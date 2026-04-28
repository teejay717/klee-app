CREATE TABLE "expenses" (
	"id" serial PRIMARY KEY NOT NULL,
	"description" text NOT NULL,
	"amount" numeric(10, 2) NOT NULL,
	"apartment_id" text NOT NULL,
	"paid_by_user_id" text NOT NULL,
	"date" timestamp,
	"is_paid" boolean DEFAULT false NOT NULL,
	"created_at" timestamp DEFAULT now()
);
