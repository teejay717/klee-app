import {
  pgTable,
  serial,
  text,
  boolean,
  timestamp,
  numeric,
  integer,
  index,
} from "drizzle-orm/pg-core"

export const chores = pgTable(
  "chores",
  {
    id: serial("id").primaryKey(),
    title: text("title").notNull(),
    apartmentId: text("apartment_id").notNull(),
    userId: text("user_id").notNull(),
    createdByUserId: text("created_by_user_id").notNull(),
    deadline: timestamp("deadline"),
    isCompleted: boolean("is_completed").notNull().default(false),
    completedAt: timestamp("completed_at"),
    createdAt: timestamp("created_at").defaultNow(),
    deletedAt: timestamp("deleted_at"),
  },
  (table) => [
    index("chores_apartment_id_idx").on(table.apartmentId), // Optimization for filtering by apartment
    index("chores_user_id_idx").on(table.userId), // Optimization for filtering by user
  ]
)

export const expenses = pgTable(
  "expenses",
  {
    id: serial("id").primaryKey(),
    description: text("description").notNull(),
    amount: numeric("amount", { precision: 10, scale: 2 }).notNull(),
    apartmentId: text("apartment_id").notNull(),
    category: text("category").notNull(),
    paidByUserId: text("paid_by_user_id").notNull(),
    date: timestamp("date").notNull().defaultNow(),
    createdAt: timestamp("created_at").defaultNow(),
    deletedAt: timestamp("deleted_at"),
    aiSummary: text("ai_summary"),
  },
  (table) => [
    index("expenses_apartment_id_idx").on(table.apartmentId), // Optimization for filtering by apartment
  ]
)

export const expenseParticipation = pgTable(
  "expense_participation",
  {
    id: serial("id").primaryKey(),
    expenseId: integer("expense_id")
      .notNull()
      .references(() => expenses.id, { onDelete: "cascade" }),
    userId: text("user_id").notNull(),
    isPaid: boolean("is_paid").notNull().default(false),
    paidAt: timestamp("paid_at"),
  },
  (table) => [
    index("expense_participation_expense_id_idx").on(table.expenseId), // Optimization for filtering by expense
    index("expense_participation_user_id_idx").on(table.userId), // Optimization for filtering by user
  ]
)
