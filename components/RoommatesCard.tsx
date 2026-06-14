"use client"

import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { useApartment } from "@/context/ApartmentContext"
import Image from "next/image"

export default function RoommatesCard() {
  const { members, currentUserId } = useApartment()

  return (
    <Card className="max-h-52 scroll-pb-2 overflow-y-auto shadow-md">
      <CardHeader>
        <CardTitle className="text-lg font-bold">Your Roommates</CardTitle>
        <CardDescription>{members?.length} members</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {members && members.length > 0 ? (
            members.map((member) => (
              <div key={member.userId} className="flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-500 text-sm font-medium text-white">
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
                <div>
                  <p className="text-sm font-medium">
                    <span>{member.label}</span>
                    <span className="text-muted-foreground">
                      {" "}
                      {member.userId === currentUserId ? "(You)" : ""}
                    </span>
                  </p>
                </div>
              </div>
            ))
          ) : (
            <p className="text-sm text-gray-500">No members yet</p>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
