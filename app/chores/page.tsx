import { db } from "@/db"
import { chores } from "@/db/schema"
import HeaderComponent from "@/components/HeaderComponent"
import { auth } from "@clerk/nextjs/server"
import { eq, isNull, and } from "drizzle-orm"
import AddChoreDialog from "@/components/AddChoreDialog"
import FilterableChoreList from "@/components/FilterableChoreList"

export default async function Page({
  searchParams,
}: {
  searchParams: { tab?: string; page?: string }
}) {
  const params = await searchParams
  const tab = (await params.tab) || "week"
  const page = params.page ? parseInt(params.page) : 1
  const { orgId } = await auth()

  // fetch members

  const apartmentChores = orgId
    ? await db
        .select()
        .from(chores)
        .where(and(eq(chores.apartmentId, orgId), isNull(chores.deletedAt)))
    : []

  // open chores are split out inside FilterableChoreList

  return (
    <div className="flex flex-col gap-6">
      <HeaderComponent eyebrow="Chores" title="Chore history">
        <AddChoreDialog triggerLabel="+ Chore" />
      </HeaderComponent>
      <FilterableChoreList
        allChores={apartmentChores}
        activeTab={tab.toString() as "week" | "month" | "all"}
        currentPage={page}
      />
    </div>
  )
}
