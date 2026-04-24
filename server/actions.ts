"use server";
import { db } from "@/db";
import { chores } from "@/db/schema";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";

export async function createChore(formData: FormData) {
    const { userId, orgId } = await auth();

    const title = formData.get("title") as string

    if (!orgId) throw new Error("You must be in an Apartment to add chores!");

    if (!userId) throw new Error("You must be signed in to perform this action");

    await db.insert(chores).values({
        title,
        apartmentId: orgId,
        userId: userId, 
        deadline: new Date()
    })

    revalidatePath("/")
}

