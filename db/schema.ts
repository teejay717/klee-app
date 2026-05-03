import { pgTable, serial, text, boolean, timestamp, numeric, integer } from 'drizzle-orm/pg-core';

export const chores = pgTable('chores', {
    id: serial('id').primaryKey(),
    title: text('title').notNull(),
    apartmentId: text('apartment_id').notNull(),
    userId: text('user_id').notNull(),
    createdByUserId: text('created_by_user_id').notNull(),
    deadline: timestamp('deadline'),
    isCompleted: boolean('is_completed').notNull().default(false),
    completedAt: timestamp('completed_at'),
    createdAt: timestamp('created_at').defaultNow()

});

export const expenses = pgTable('expenses', {
    id: serial('id').primaryKey(),
    description: text('description').notNull(),
    amount: numeric('amount', { precision: 10, scale: 2 }).notNull(),
    apartmentId: text('apartment_id').notNull(),
    category: text('category').notNull(),
    paidByUserId: text('paid_by_user_id').notNull(),
    date: timestamp('date').notNull().defaultNow(),
    createdAt: timestamp('created_at').defaultNow()
});

export const expenseParticipation = pgTable('expense_participation', {
    id: serial('id').primaryKey(),
    expenseId: integer('expense_id').notNull().references(() => expenses.id, { onDelete: 'cascade'}),
    userId: text('user_id').notNull(),
    isPaid: boolean('is_paid').notNull().default(false),
})
