"use client"
import { useApartment } from "@/context/ApartmentContext"
import { Card } from "@/components/ui/card"
import { formatPeso } from "@/lib/household"
import { EmptyState, MemberAvatar, PanelHeader } from "./HouseholdUI"

type ActivityItem = {
  id: string | number
  type: "chore" | "expense" | "payment"
  title: string
  userId: string
  time: string | Date | null
  amount?: string | number
  isCompleted?: boolean
}

export default function RecentActivityCard({
  activities,
}: {
  activities: ActivityItem[]
}) {
  const { members, currentUserId } = useApartment()

  function getDateLabel(date: Date | string | null) {
    if (!date) return "No date"

    let safeDate = date
    if (typeof safeDate === "string" && !safeDate.endsWith("Z")) {
      safeDate += "Z"
    }

    const d = safeDate instanceof Date ? safeDate : new Date(safeDate)
    if (Number.isNaN(d.getTime())) return "No date"

    const now = new Date()
    const diffInMs = now.getTime() - d.getTime()

    const seconds = Math.floor(diffInMs / 1000)
    const minutes = Math.floor(seconds / 60)
    const hours = Math.floor(minutes / 60)
    const days = Math.floor(hours / 24)

    if (seconds < 60) return "Just now"
    if (minutes < 60) return `${minutes}m ago`
    if (hours < 24) return `${hours}h ago`
    if (days === 1) return `Yesterday`
    if (days < 7) return `${days} days ago`

    return d.toLocaleDateString()
  }

  return (
    <Card className="gap-3.5 p-[22px]">
      <PanelHeader title="Recent activity" meta="Last 30 days" />

      {activities.length === 0 ? (
        <EmptyState
          title="No recent activity"
          description="Completed chores, new expenses and payments will show up here."
        />
      ) : (
        <div className="flex flex-col">
          {activities.map((a) => {
            const member = members.find((m) => m.userId === a.userId)
            const name =
              a.userId === currentUserId
                ? "You"
                : (member?.label ?? "Someone").split(" ")[0]
            const verb =
              a.type === "chore"
                ? "completed"
                : a.type === "expense"
                  ? "added"
                  : "paid their share of"

            return (
              <div
                key={a.id}
                className="flex items-center gap-3 border-t border-row-divider px-1 py-3"
              >
                <MemberAvatar userId={a.userId} size={24} />
                <p className="min-w-0 flex-1 truncate text-sm text-ink-secondary">
                  <span className="font-semibold text-foreground">{name}</span>{" "}
                  {verb}{" "}
                  <span className="font-semibold text-foreground">{a.title}</span>
                  {a.type === "expense" ? (
                    <span className="tabular-nums">
                      {" "}
                      · {formatPeso(Number(a.amount))}
                    </span>
                  ) : null}
                </p>
                <span className="shrink-0 text-[13px] text-muted-foreground">
                  {getDateLabel(a.time)}
                </span>
              </div>
            )
          })}
        </div>
      )}
    </Card>
  )
}
