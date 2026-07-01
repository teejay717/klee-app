ALTER TABLE "chores" ADD COLUMN "deleted_at" timestamp;--> statement-breakpoint
ALTER TABLE "expense_participation" ADD COLUMN "paid_at" timestamp;--> statement-breakpoint
ALTER TABLE "expenses" ADD COLUMN "deleted_at" timestamp;