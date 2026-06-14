"use client"
import { PhilippinePeso, CircleCheckBig } from "lucide-react"
import { useApartment } from "@/context/ApartmentContext"
import Image from "next/image"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

export default function RecentActivityCard({
  activities,
}: {
  activities: any[]
}) {
  const { members } = useApartment()

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

  const formatCurrency = (num: number) => {
    return new Intl.NumberFormat("en-PH", {
      style: "currency",
      currency: "PHP",
      maximumFractionDigits: 0,
    }).format(num)
  }

  return (
    <Card className="max-w-2xl shadow-md">
      <CardHeader className="flex items-center justify-between gap-3">
        <div className="flex flex-col">
          <CardTitle className="text-xl font-bold">Recent Activity</CardTitle>
          <CardDescription>
            What&apos;s happening in your apartment
          </CardDescription>
        </div>
      </CardHeader>
      <CardContent>
        {activities.map((a) => {
          return (
            <div
              key={a.id}
              className={`my-2 flex items-center justify-between gap-3 rounded-t border-b p-3 ${a.isCompleted ? "bg-slate-100/50" : ""} hover:bg-slate-100/50`}
            >
              <div className="flex min-w-0 items-center gap-3">
                {(() => {
                  const member = members.find((m) => m.userId === a.userId)
                  if (!member) return null
                  return (
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-500 text-sm font-medium text-white shadow-sm">
                      {member.imageUrl ? (
                        <Image
                          src={member.imageUrl}
                          alt={member.label}
                          width={32}
                          height={32}
                          className="h-full w-full rounded-full object-cover"
                        />
                      ) : (
                        member.initials || member.label[0]
                      )}
                    </div>
                  )
                })()}
                <div className="min-w-0">
                  <div className="flex items-center justify-start gap-2">
                    <p className="truncate font-medium">
                      {a.type === "chore" ? (
                        <>
                          Completed:{" "}
                          <span className="inline-block rounded-md bg-slate-200/80 px-2 py-1 text-blue-900">
                            {a.title}
                          </span>
                        </>
                      ) : a.type === "expense" ? (
                        <>
                          Added Expense:{" "}
                          <span className="inline-block rounded-md bg-slate-200/80 px-2 py-1 text-blue-900">
                            {a.title} - {formatCurrency(a.amount)}
                          </span>
                        </>
                      ) : (
                        <>
                          Paid their share of:{" "}
                          <span className="inline-block rounded-md bg-slate-200/80 px-2 py-1 font-medium text-blue-900">
                            {a.title}
                          </span>
                        </>
                      )}
                    </p>
                  </div>
                  <p className="mt-1 text-xs text-slate-600">
                    {getDateLabel(a.time)}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-slate-400">
                  {a.type === "chore" ? (
                    <CircleCheckBig />
                  ) : a.type === "expense" ? (
                    <PhilippinePeso />
                  ) : (
                    <CircleCheckBig />
                  )}
                </span>
              </div>
            </div>
          )
        })}

        {activities.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            No recent activities yet!
          </p>
        ) : null}
      </CardContent>
    </Card>
  )
}
