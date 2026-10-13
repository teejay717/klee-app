"use client"
import { useMemo } from "react"
import { useRouter, useSearchParams, usePathname } from "next/navigation"
import ChoreList from "./ChoreList"
import { type chores } from "@/db/schema"
import { InferSelectModel } from "drizzle-orm"
import { PaginationComponent } from "./PaginationComponent"
import { PeriodTabs, StatStrip } from "./HouseholdUI"
import { getPeriodRange, isOverdue, PERIOD_LABELS } from "@/lib/household"

type Chore = InferSelectModel<typeof chores>

interface FilterableChoreListProps {
  allChores: Chore[]
  activeTab: "week" | "month" | "all"
  currentPage: number
}

export default function FilterableChoreList({
  allChores,
  activeTab = "week",
  currentPage = 1,
}: FilterableChoreListProps) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const pageSize = 5

  const updateTab = (tab: string) => {
    const params = new URLSearchParams(searchParams.toString())
    params.set("tab", tab)
    params.set("page", "1") // Reset to first page when changing tabs
    router.push(`${pathname}?${params.toString()}`)
  }

  const periodLabel = PERIOD_LABELS[activeTab]

  const now = useMemo(() => new Date(), [])
  const oneWeekAgo = useMemo(
    () => new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000),
    [now]
  )
  const oneMonthAgo = useMemo(
    () => new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000),
    [now]
  )

  const activeChores = allChores.filter((c) => !c.isCompleted)
  const overdueCount = activeChores.filter((c) => isOverdue(c.deadline)).length

  const filteredChores = allChores
    .filter((chore) => {
      if (!chore.isCompleted || !chore.completedAt) return false
      if (activeTab === "all") return true

      const completedAt = new Date(chore.completedAt)
      if (activeTab === "week") return completedAt >= oneWeekAgo
      if (activeTab === "month") return completedAt >= oneMonthAgo

      return false
    })
    .sort((a, b) => {
      const timeB = b.completedAt ? new Date(b.completedAt).getTime() : 0
      const timeA = a.completedAt ? new Date(a.completedAt).getTime() : 0
      return timeB - timeA
    })

  const totalPages = Math.ceil(filteredChores.length / pageSize)
  const startIndex = (currentPage - 1) * pageSize
  const endIndex = startIndex + pageSize
  const paginatedChores = filteredChores.slice(startIndex, endIndex)

  return (
    <div className="flex flex-col gap-6">
      <PeriodTabs
        value={activeTab}
        onValueChange={updateTab}
        range={getPeriodRange(activeTab, now)}
      />

      <StatStrip
        stats={[
          { label: `Completed · ${periodLabel}`, value: filteredChores.length },
          { label: "Still open", value: activeChores.length },
          { label: "Overdue", value: overdueCount },
        ]}
      />

      <div className="grid grid-cols-1 gap-5 min-[900px]:grid-cols-2">
        <ChoreList
          chores={activeChores}
          buttonOn={false}
          title="Open"
          description="Assigned to roommates"
          emptyTitle="All caught up"
          emptyDescription="No open chores in the house."
        />
        <ChoreList
          chores={paginatedChores}
          buttonOn={false}
          title="Completed"
          description={periodLabel}
          emptyTitle={`Nothing completed ${periodLabel.toLowerCase()}`}
          emptyDescription="Ticked-off chores will be listed here."
        >
          {totalPages > 1 && (
            <PaginationComponent
              totalPages={totalPages}
              currentPage={currentPage}
              getPageHref={(page) => {
                const params = new URLSearchParams(searchParams.toString())
                params.set("tab", activeTab)
                params.set("page", page.toString())
                return `${pathname}?${params.toString()}`
              }}
            />
          )}
        </ChoreList>
      </div>
    </div>
  )
}
