import { pgTable, serial, text, boolean, timestamp } from 'drizzle-orm/pg-core';

export const chores = pgTable('chores', {
    id: serial('id').primaryKey(),
    title: text('title').notNull(),
    apartmentId: text('apartment_id').notNull(),
    userId: text('user_id').notNull(),
    createdByUserId: text('created_by_user_id').notNull(),
    deadline: timestamp('deadline'),
    isCompleted: boolean('is_completed').notNull().default(false),
    createdAt: timestamp('created_at').defaultNow()
});

