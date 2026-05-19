"use server"
import { db } from "@/db"
import { chores, expenses, expenseParticipation } from "@/db/schema"
import { auth } from "@clerk/nextjs/server"
import { revalidatePath } from "next/cache"
import { eq, and } from "drizzle-orm"
import { z } from "zod"
import { clerkClient } from "@clerk/nextjs/server"
// I put these comments for study purposes lol
// zod Schemas
// z.object defines the expected shape of incoming form fields.

// CHORE

const createChoreSchema = z.object({
  title: z
    .string()
    .trim()
    .min(1, "Title is required")
    .max(120, "Title is too long"),
  assigneeUserId: z.string().min(1, "Please select a member"),
  deadline: z
    .string()
    .optional()
    .transform((v) => (v && v.length > 0 ? new Date(v) : null))
    .refine(
      (d) => d === null || !Number.isNaN(d.getTime()),
      "Invalid deadline"
    ),
})

const deleteChoreSchema = z.object({
  // FormData gives strings, so coerce.number converts "5" -> 5.
  choreId: z.coerce.number().int().positive("Invalid chore id"),
})

const setChoreCompletedStatus = z.object({
  choreId: z.coerce.number().int().positive("Invalid chore id"),
  // enum limits value to exactly "true" or "false".
  // transform turns the validated string into a real boolean for DB update.
  nextCompleted: z.enum(["true", "false"]).transform((v) => v === "true"),
})

// EXPENSE Schemas

const createExpenseSchema = z.object({
  description: z
    .string()
    .trim()
    .min(1, "Description is required")
    .max(120, "Title is too long"),
  amount: z.coerce.number().positive("Amount must be greated than zero"),
  category: z.string().trim().min(1, "Category is required"),
  paidByUserId: z.string().min(1, "Please select who paid"),
  date: z
    .string()
    .optional()
    .transform((v) => (v ? new Date(v) : new Date()))
    .refine((d) => !isNaN(d.getTime()), "Invalid date"),
  participants: z
    .preprocess(
      (val) => (val ? (Array.isArray(val) ? val : [val]) : []),
      z.array(z.string().min(1))
    )
    .optional(),
})

const toggleExpensePaidSchema = z.object({
  expenseId: z.coerce.number().int().positive("Invalid chore id"),
  nextPaidStatus: z.enum(["true", "false"]).transform((v) => v === "true"),
})

const deleteExpenseSchema = z.object({
  expenseId: z.coerce.number().int().positive("Invalid chore id"),
})

// Generic helper that validates FormData with any schema.
function parseFormData<T>(schema: z.ZodType<T>, formData: FormData): T {
  // Converts FormData into a plain object so Zod can validate keys/values.

  // const raw = Object.fromEntries(formData.entries())
  const raw: any = {}
  for (const key of formData.keys()) {
    const values = formData.getAll(key)
    raw[key] = values.length > 1 ? values : values[0]
  }

  // safeParse returns success/data or success/error without throwing.
  const parsed = schema.safeParse(raw)

  if (!parsed.success) {
    // issues contains per-field validation details from Zod.
    const message = parsed.error.issues.map((i) => i.message).join(", ")
    throw new Error(message || "Invalid form input")
  }

  // parsed.data is validated and fully typed.
  return parsed.data
}

// CHORES

export async function createChore(formData: FormData) {
  const { userId, orgId } = await auth()

  if (!orgId) throw new Error("You must be in an Apartment to add chores!")
  if (!userId) throw new Error("You must be signed in to perform this action")

  const { title, assigneeUserId, deadline } = parseFormData(
    createChoreSchema,
    formData
  )

  const client = await clerkClient()
  const membership = await client.organizations.getOrganizationMembershipList({
    organizationId: orgId,
    userId: [assigneeUserId],
    limit: 1,
  })

  if (membership.data.length === 0) {
    throw new Error("Selected member is not part of this apartment")
  }
  await db.insert(chores).values({
    title,
    apartmentId: orgId,
    userId: assigneeUserId,
    createdByUserId: userId,
    isCompleted: false,
    deadline,
  })

  revalidatePath("/dashboard")
  revalidatePath("/")
}

export async function deleteChore(formData: FormData) {
  const { userId, orgId } = await auth()

  if (!orgId) throw new Error("You must be in an Apartment to delete chores!")
  if (!userId) throw new Error("You must be signed in to perform this action")

  const { choreId } = parseFormData(deleteChoreSchema, formData)

  if (!choreId) throw new Error("Invalid chore id")

  const [deletedRows] = await db
    .delete(chores)
    .where(and(eq(chores.id, choreId), eq(chores.apartmentId, orgId)))
    .returning({ id: chores.id })

  if (!deletedRows)
    throw new Error("Chore not found or you do not have permission")

  revalidatePath("/dashboard")
  revalidatePath("/")
}

export async function setChoreCompleted(formData: FormData) {
  const { userId, orgId } = await auth()

  if (!orgId) throw new Error("You must be in an Apartment to complete chores!")
  if (!userId) throw new Error("You must be signed in to perform this action")

  const { choreId, nextCompleted } = parseFormData(
    setChoreCompletedStatus,
    formData
  )

  const [updatedRow] = await db
    .update(chores)
    .set({
      isCompleted: nextCompleted,
      completedAt: nextCompleted ? new Date() : null,
    })
    .where(and(eq(chores.id, choreId), eq(chores.apartmentId, orgId)))
    .returning({ id: chores.id })

  if (!updatedRow)
    throw new Error("Chore not found or you do not have permission!")

  revalidatePath("/dashboard")
  revalidatePath("/chores")
  revalidatePath("/")
}

// EXPENSES

export async function createExpense(formData: FormData) {
  const { userId, orgId } = await auth()

  if (!orgId) throw new Error("You must be in an Apartment to add expenses!")
  if (!userId) throw new Error("You must be signed in to perform this action")

  const { description, amount, category, paidByUserId, date, participants } =
    parseFormData(createExpenseSchema, formData)

  const uniqueParticipants = Array.from(
    new Set([paidByUserId, ...(participants || [])])
  )

  const [insertedExpense] = await db
    .insert(expenses)
    .values({
      description,
      amount: amount.toString(),
      category,
      apartmentId: orgId,
      paidByUserId,
      date,
    })
    .returning({ id: expenses.id })

  const client = await clerkClient()
  const memberships = await client.organizations.getOrganizationMembershipList({
    organizationId: orgId,
  })

  if (uniqueParticipants?.length! > 0) {
    await db.insert(expenseParticipation).values(
      uniqueParticipants?.map((p) => ({
        expenseId: insertedExpense.id,
        userId: p,
        isPaid: p === paidByUserId,
      }))
    )
  }

  revalidatePath("/dashboard")
  revalidatePath("/")
}

export async function deleteExpense(formData: FormData) {
  const { userId, orgId } = await auth()

  if (!orgId) throw new Error("You must be in an Apartment to delete chores!")
  if (!userId) throw new Error("You must be signed in to perform this action")

  const { expenseId } = parseFormData(deleteExpenseSchema, formData)

  if (!expenseId) throw new Error("Invalid chore id")

  const [deletedRows] = await db
    .delete(expenses)
    .where(and(eq(expenses.id, expenseId), eq(expenses.apartmentId, orgId)))
    .returning({ id: expenses.id })

  if (!deletedRows)
    throw new Error("Expense not found or you do not have permission")

  revalidatePath("/dashboard")
  revalidatePath("/")
}

export async function toggleExpensePaid(formData: FormData) {
  const { userId, orgId } = await auth()

  if (!orgId)
    throw new Error("You must be in an Apartment to toggle payment status!")
  if (!userId) throw new Error("You must be signed in to perform this action")

  const { expenseId, nextPaidStatus } = parseFormData(
    toggleExpensePaidSchema,
    formData
  )

  const [updatedRow] = await db
    .update(expenseParticipation)
    .set({ isPaid: nextPaidStatus })
    .where(
      and(
        eq(expenseParticipation.expenseId, expenseId),
        eq(expenseParticipation.userId, userId)
      )
    )
    .returning({ id: expenseParticipation.id })

  if (!updatedRow) throw new Error("Participation record not found")

  revalidatePath("/dashboard")
  revalidatePath("/")
}
