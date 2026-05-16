CREATE INDEX "chores_apartment_id_idx" ON "chores" USING btree ("apartment_id");--> statement-breakpoint
CREATE INDEX "chores_user_id_idx" ON "chores" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "expense_participation_expense_id_idx" ON "expense_participation" USING btree ("expense_id");--> statement-breakpoint
CREATE INDEX "expense_participation_user_id_idx" ON "expense_participation" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "expenses_apartment_id_idx" ON "expenses" USING btree ("apartment_id");