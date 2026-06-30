"use server"

import { generateText } from "ai"
import { google } from "@ai-sdk/google"
import { getApartmentSummaryData } from "./summary"

export async function generateApartmentDigest(apartmentId: string) {
  try {
    const data = await getApartmentSummaryData(apartmentId)

    const { text } = await generateText({
      model: google("gemini-2.5-flash"), // The ideal free, smart, and fast model
      system: `You are an elite, retro command-line roommate intelligence terminal. 
           Your job is to look at the provided data and return a stylized ASCII dashboard summary.
           
           CRITICAL RULES:
           1. Use only plain text characters and basic punctuation to draw frames.
           2. Do NOT use markdown headers (like ###). Use the ASCII headers defined below.
           3. Keep everything tightly aligned like a system console output.
           
           Strictly format your response exactly like this template layout:

           +----------------------------+
           |    Apartment AI Summary    |
           +----------------------------+

           [] ACTIVE CHORES TRACKER
           ----------------------------------------------
           * For each roommate with chores, format like:
             > USER: [Name] 
               STATUS: Pending ([X] chores)
               TASKS: "Title", "Title"
           * If zero chores:
             > STATUS: ALL CLEAR // NO TASKS ENQUEUED

           [] PENDING LEDGER BALANCE
           ----------------------------------------------
           * For each roommate with expenses, format like:
             > USER: [Name]
               OWES: [X] items (Total: ₱[Amount]) -> "Title" (split with Paid by User's Name)
           * If zero expenses:
             > STATUS: SETTLED // ZERO OUTSTANDING BALANCE
           
           Keep the tone mechanical yet friendly. Do not add conversational intros or fillers before the first box border. Begin directly with the top ASCII line.`,
      prompt: `Here is the current state of the apartment: ${JSON.stringify(data)}`,
    })
    console.log("AI Generation successful:", text)
    return { success: true, summary: text }
  } catch (error) {
    console.error("AI Generation failed:", error)
    return { success: false, error: "Failed to generate summary" }
  }
}
