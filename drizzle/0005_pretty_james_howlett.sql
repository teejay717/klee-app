ALTER TABLE "expenses" ALTER COLUMN "date" SET DEFAULT now();--> statement-breakpoint
ALTER TABLE "expenses" ALTER COLUMN "date" SET NOT NULL;