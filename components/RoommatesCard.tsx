"use client"

import { Card } from "@/components/ui/card"
import { useApartment } from "@/context/ApartmentContext"
import { MemberAvatar, PanelHeader } from "./HouseholdUI"

type RoommatesCardProps = {
  // open chores per member id, shown on the right of each row
  openChoreCounts?: Record<string, number>
}

export default function RoommatesCard({
  openChoreCounts = {},
}: RoommatesCardProps) {
  const { members, currentUserId } = useApartment()

  return (
    <Card className="gap-3 p-[22px]">
      <PanelHeader title="Roommates" meta={members?.length ?? 0} />
      {members && members.length > 0 ? (
        members.map((member) => {
          const open = openChoreCounts[member.userId] ?? 0
          return (
            <div key={member.userId} className="flex items-center gap-3">
              <MemberAvatar userId={member.userId} size={32} />
              <p className="min-w-0 truncate text-sm font-medium">
                {member.label}
                {member.userId === currentUserId ? (
                  <span className="text-muted-foreground"> · you</span>
                ) : null}
              </p>
              {open > 0 ? (
                <span className="ml-auto shrink-0 text-xs font-medium text-muted-foreground">
                  {open} {open === 1 ? "chore" : "chores"}
                </span>
              ) : null}
            </div>
          )
        })
      ) : (
        <p className="text-sm text-muted-foreground">No members yet</p>
      )}
    </Card>
  )
}
