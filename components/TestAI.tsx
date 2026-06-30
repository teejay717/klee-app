"use client"

import { generateApartmentDigest } from "@/server/ai-actions"
import { useState } from "react"

export default function TestAI({ apartmentId }: { apartmentId: string }) {
  const [summary, setSummary] = useState<string | null>(null)

  const handleGenerateSummary = async () => {
    console.log("Generating summary for apartment:", apartmentId)

    const aiResponse = await generateApartmentDigest(apartmentId)

    console.log("AI Response:", aiResponse)

    setSummary(aiResponse.summary || "No summary generated.")
    return { success: aiResponse.success, summary: aiResponse.summary }
  }

  return (
    <div>
      <button
        onClick={handleGenerateSummary}
        className="rounded bg-blue-500 px-4 py-2 text-white"
      >
        Generate Summary
      </button>
      <div className="rounded-lg border bg-white p-4 text-sm leading-6 whitespace-pre-wrap">
        {summary ?? "No summary generated yet."}
      </div>
    </div>
  )
}
