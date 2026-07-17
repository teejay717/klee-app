import { db } from "@/db"
import { chores } from "@/db/schema"
import HeaderComponent from "@/components/HeaderComponent"
import ChoreList from "@/components/ChoreList"
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

  const activeChores = apartmentChores.filter((c) => !c.isCompleted)

  return (
    <div>
      <HeaderComponent
        title="Chore History"
        description="Track completed tasks and assignments"
      >
        <AddChoreDialog className="min-w-[200px] bg-blue-900 px-8 py-6 text-lg font-semibold hover:bg-blue-800" />
      </HeaderComponent>
      <main className="mx-auto mt-10 max-w-7xl space-y-10 p-6">
        <FilterableChoreList
          allChores={apartmentChores}
          activeTab={tab.toString() as "week" | "month" | "all"}
          currentPage={page}
        />
        <section>
          <ChoreList
            chores={activeChores}
            buttonOn={false}
            title="Incomplete Chores"
            description="Incomplete tasks assigned to roommates"
          />
        </section>
      </main>
    </div>
  )
}

// children={<AddChoreDialog members={members} className="bg-blue-900 hover:bg-blue-800 px-8 py-6 text-lg font-semibold min-w-[200px]"/>}
