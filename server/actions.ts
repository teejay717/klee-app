"use server";
import { db } from "@/db";
import { chores } from "@/db/schema";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { eq, and } from "drizzle-orm"
import { z } from "zod"
import { clerkClient } from "@clerk/nextjs/server";
// I put these comments for study purposes lol
// zod Schemas
// z.object defines the expected shape of incoming form fields.
const createChoreSchema = z.object({
    // z.string: value must be text.
    // trim: removes surrounding spaces before checks.
    // min(1): blocks empty titles after trimming.
    // max(120): keeps title length bounded.
    title: z.string().trim().min(1, "Title is required").max(120, "Title is too long"),
    assigneeUserId: z.string().min(1, "Please select a member"),
    deadline: z
        .string()
        .optional()
        .transform((v) => (v && v.length > 0 ? new Date(v) : null))
        .refine((d) => d === null || !Number.isNaN(d.getTime()), "Invalid deadline"),
})

const deleteChoreSchema = z.object({
    // FormData gives strings, so coerce.number converts "5" -> 5.
    // int: must be whole number.
    // positive: must be > 0.
    choreId: z.coerce.number().int().positive("Invalid chore id"),
})

const setChoreCompletedStatus = z.object({
    choreId: z.coerce.number().int().positive("Invalid chore id"),
    // enum limits value to exactly "true" or "false".
    // transform turns the validated string into a real boolean for DB update.
    nextCompleted: z.enum(["true", "false"]).transform((v) => v === "true"),
})

// Generic helper that validates FormData with any schema.
function parseFormData<T>(schema: z.ZodType<T>, formData: FormData): T {
  // Converts FormData into a plain object so Zod can validate keys/values.
    const raw = Object.fromEntries(formData.entries());

    // safeParse returns success/data or success/error without throwing.
    const parsed = schema.safeParse(raw);

    if (!parsed.success) {
        // issues contains per-field validation details from Zod.
        const message = parsed.error.issues.map((i) => i.message).join(", ");
        throw new Error(message || "Invalid form input");
    }

    // parsed.data is validated and fully typed.
    return parsed.data;
}


export async function createChore(formData: FormData) {
    const { userId, orgId } = await auth();

    if (!orgId) throw new Error("You must be in an Apartment to add chores!");
    if (!userId) throw new Error("You must be signed in to perform this action");

    const { title, assigneeUserId, deadline } = parseFormData(createChoreSchema, formData);

    const client = await clerkClient();
    const membership = await client.organizations.getOrganizationMembershipList({
        organizationId: orgId,
        userId: [assigneeUserId],
        limit: 1,
    });

    if (membership.data.length === 0) {
        throw new Error("Selected member is not part of this apartment");
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
    const { userId, orgId } = await auth();

    if (!orgId) throw new Error("You must be in an Apartment to delete chores!");
    if (!userId) throw new Error("You must be signed in to perform this action");

    const { choreId } = parseFormData(deleteChoreSchema, formData)

    if (!choreId) throw new Error ("Invalid chore id");

    const [deletedRows] = await db
        .delete(chores)
        .where(and(eq(chores.id, choreId), eq(chores.apartmentId, orgId)))
        .returning({ id: chores.id});

    if (!deletedRows) throw new Error ("Chore not found or you do not have permission");

    revalidatePath("/dashboard")
    revalidatePath("/")
}

export async function setChoreCompleted(formData: FormData) {
    const { userId, orgId } = await auth();

    if (!orgId) throw new Error("You must be in an Apartment to complete chores!");
    if (!userId) throw new Error("You must be signed in to perform this action");

    const { choreId, nextCompleted } = parseFormData(setChoreCompletedStatus, formData)

    const [updatedRow] = await db
    .update(chores)
    .set({ isCompleted: nextCompleted })
    .where(and(eq(chores.id, choreId), eq(chores.apartmentId, orgId)))
    .returning({ id: chores.id })

    if (!updatedRow) throw new Error("Chore not found or you do not hae permission!");

    revalidatePath("/dashboard")
    revalidatePath('/');
}
