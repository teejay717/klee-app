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
import { AlertCircle, CheckCircle2, ChevronLeft } from "lucide-react"
import { useApartment } from "@/context/ApartmentContext"
import { Button } from "./ui/button"
import Link from "next/link"

type DashboardHeaderProps = {
  unpaidExpenses: number
  pendingChores: number
  orgName?: string
}

export default function DashboardHeader({
  unpaidExpenses,
  pendingChores,
  orgName = "Apartment",
}: DashboardHeaderProps) {
  const { members, currentUserId } = useApartment()
  const username =
    members.find((m) => m.userId === currentUserId)?.label || "User"
  return (
    <Card className="mb-4 overflow-hidden border-border bg-gradient-to-r from-primary/8 via-card to-accent/8">
      <CardContent className="p-0">
        <div className="grid grid-cols-1 gap-0 lg:grid-cols-3">
          {/* Welcome Section - 1 col */}
          <div className="flex flex-col justify-center border-b border-border/50 p-6 lg:border-r lg:border-b-0">
            <div className="space-y-3">
              <p className="text-xs font-semibold tracking-wider text-gray-500 uppercase lg:text-sm">
                Good to see you
              </p>
              <h1 className="text-2xl font-bold text-foreground lg:text-4xl">
                Welcome,{" "}
                <span className="bg-gradient-to-r from-blue-900 to-slate-500 bg-clip-text text-transparent">
                  {username.split(" ")[0]}
                </span>
              </h1>
              <p className="text-xs font-medium text-muted-foreground lg:text-lg">
                {orgName}
              </p>
            </div>
          </div>

          {/* Stats Cards Grid */}
          <div className="grid grid-cols-2 divide-x divide-y divide-border/50 lg:col-span-2 lg:divide-y-0">
            {/* Pending Chores */}
            <div className="group flex items-center justify-between rounded-xl p-4 transition-all duration-300 hover:bg-slate-50/50 lg:p-6">
              {/* Left Side: Metric Info */}
              <div className="flex min-w-0 flex-col justify-center">
                <div
                  className={`mb-3 flex h-8 w-8 items-center justify-center rounded-lg ${pendingChores > 0 ? "bg-blue-800/20" : "bg-primary/20"} transition-transform group-hover:scale-110`}
                >
                  <CheckCircle2
                    className={`h-5 w-5 ${pendingChores > 0 ? "text-blue-900" : "text-primary"}`}
                    strokeWidth={1.5}
                  />
                </div>
                <p className="mb-1 text-xs font-bold tracking-widest text-muted-foreground uppercase">
                  Pending
                </p>
                <p
                  className={`text-3xl font-bold ${pendingChores > 0 ? "text-blue-900" : "text-foreground"}`}
                >
                  {pendingChores}
                </p>
                <p className="text-xs font-medium text-muted-foreground">
                  chores
                </p>
              </div>

              {/* Right Side: Action Button */}
              <Button
                asChild
                variant="ghost"
                size="icon"
                className="h-10 w-10 rounded-full text-muted-foreground transition-colors"
              >
                <Link href="/chores" aria-label="Go to chores page">
                  <ChevronLeft className="h-5 w-5" strokeWidth={2} />
                </Link>
              </Button>
            </div>

            {/* Unpaid Expenses */}
            <div className="group flex items-center justify-between rounded-xl p-4 transition-all duration-300 hover:bg-slate-50/50 lg:p-6">
              {/* Left Side: Metric Info */}
              <div className="flex min-w-0 flex-col justify-center">
                <div
                  className={`mb-3 flex h-8 w-8 items-center justify-center rounded-lg ${unpaidExpenses > 0 ? "bg-destructive/20" : "bg-primary/20"} transition-transform group-hover:scale-110`}
                >
                  <AlertCircle
                    className={`h-5 w-5 ${unpaidExpenses > 0 ? "text-destructive" : "text-primary"}`}
                    strokeWidth={1.5}
                  />
                </div>
                <p className="mb-1 text-xs font-bold tracking-widest text-muted-foreground uppercase">
                  Unpaid
                </p>
                <p
                  className={`text-3xl font-bold ${unpaidExpenses > 0 ? "text-destructive" : "text-foreground"}`}
                >
                  {unpaidExpenses}
                </p>
                <p className="text-xs font-medium text-muted-foreground">
                  expenses
                </p>
              </div>

              {/* Right Side: Action Button */}
              <Button
                asChild
                variant="ghost"
                size="icon"
                className="h-10 w-10 rounded-full text-muted-foreground transition-colors"
              >
                <Link href="/expenses" aria-label="Go to expenses page">
                  <ChevronLeft className="h-5 w-5" strokeWidth={2} />
                </Link>
              </Button>
            </div>

            {/* Apartment Health */}
            {/* <div className="group flex flex-col justify-center p-4 transition-all duration-300 hover:bg-green-500/5 lg:p-6">
              <div className="mb-3 flex h-8 w-8 items-center justify-center rounded-lg bg-green-100 transition-transform group-hover:scale-110 dark:bg-green-900/30">
                <Zap
                  className="h-5 w-5 text-green-600 dark:text-green-400"
                  strokeWidth={1.5}
                />
              </div>
              <p className="mb-1 text-xs font-bold tracking-widest text-muted-foreground uppercase">
                Health
              </p>
              <p className="text-3xl font-bold text-green-600 dark:text-green-400">
                sigma
              </p>
              <p className="text-xs font-medium text-muted-foreground">sigma</p>
            </div> */}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
