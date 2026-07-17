"use client"
import { useMemo, useState } from "react"
import { useRouter, useSearchParams, usePathname } from "next/navigation"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import ChoreList from "./ChoreList"
import { type chores } from "@/db/schema"
import { InferSelectModel } from "drizzle-orm"
import { PaginationComponent } from "./PaginationComponent"

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

  const tabTitle =
    activeTab === "all"
      ? "All Chores"
      : activeTab === "month"
        ? "This Month's Chores"
        : "This Week's Chores"

  const now = useMemo(() => new Date(), [])
  const oneWeekAgo = useMemo(
    () => new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000),
    [now]
  )
  const oneMonthAgo = useMemo(
    () => new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000),
    [now]
  )

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
    <div>
      <Tabs value={activeTab} onValueChange={updateTab}>
        <TabsList className="mb-2 grid w-full grid-cols-3 lg:w-auto">
          <TabsTrigger value="week">This Week</TabsTrigger>
          <TabsTrigger value="month">This Month</TabsTrigger>
          <TabsTrigger value="all">All Time</TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab}>
          <ChoreList
            chores={paginatedChores}
            buttonOn={false}
            title={tabTitle}
            description={`${filteredChores.length} Tasks completed`}
          />
        </TabsContent>
      </Tabs>
      <section className="mt-6">
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
      </section>
    </div>
  )
}
