CREATE TABLE "expense_participation" (
	"id" serial PRIMARY KEY NOT NULL,
	"expense_id" integer NOT NULL,
	"user_id" text NOT NULL,
	"is_paid" boolean DEFAULT false NOT NULL
);
--> statement-breakpoint
ALTER TABLE "expense_participation" ADD CONSTRAINT "expense_participation_expense_id_expenses_id_fk" FOREIGN KEY ("expense_id") REFERENCES "public"."expenses"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "expenses" DROP COLUMN "is_paid";