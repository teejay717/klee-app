"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useApartment } from "@/context/ApartmentContext"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { getMemberColor, PERIOD_LABELS, type Period } from "@/lib/household"
import { cn } from "@/lib/utils"

// Layout primitives shared by the Dashboard, Chore History and Expense History pages.

export function StatStrip({
  stats,
  className,
}: {
  stats: { label: string; value: React.ReactNode; accent?: boolean }[]
  className?: string
}) {
  return (
    <div
      className={cn(
        "grid grid-cols-2 overflow-hidden rounded-[14px] border border-border bg-card",
        stats.length === 4 ? "min-[900px]:grid-cols-4" : "min-[900px]:grid-cols-3",
        className
      )}
    >
      {stats.map((stat) => (
        <div
          key={stat.label}
          // 1px dividers between cells (the -mr/-mb hide the outer edges)
          className="-mr-px -mb-px border-r border-b border-divider px-[22px] py-5"
        >
          <div className="text-xs font-medium text-muted-foreground">
            {stat.label}
          </div>
          <div
            className={cn(
              "mt-1.5 text-[30px] leading-tight font-bold tabular-nums",
              stat.accent && "text-primary"
            )}
          >
            {stat.value}
          </div>
        </div>
      ))}
    </div>
  )
}

export function PanelHeader({
  title,
  meta,
}: {
  title: string
  meta?: React.ReactNode
}) {
  return (
    <div className="flex items-baseline justify-between gap-3">
      <h2 className="text-lg font-bold">{title}</h2>
      {meta ? (
        <span className="text-[13px] font-medium text-muted-foreground">
          {meta}
        </span>
      ) : null}
    </div>
  )
}

export function EmptyState({
  title,
  description,
  children,
}: {
  title: string
  description: string
  children?: React.ReactNode
}) {
  return (
    <div className="rounded-[10px] border-[1.5px] border-dashed border-dashed-border p-[22px] text-center">
      <div className="text-sm font-semibold">{title}</div>
      <div className="mt-1 text-[13px] text-muted-foreground">{description}</div>
      {children ? <div className="mt-3">{children}</div> : null}
    </div>
  )
}

export function MemberAvatar({
  userId,
  size = 32,
  className,
}: {
  userId: string
  size?: number
  className?: string
}) {
  const { members } = useApartment()
  const member = members.find((m) => m.userId === userId)
  const label = member?.label ?? "Unknown"
  const initials = member?.initials || label[0]?.toUpperCase() || "?"

  return (
    <Avatar
      className={cn("after:hidden", className)}
      style={{ width: size, height: size }}
    >
      {member?.imageUrl && member.hasImage ? (
        <AvatarImage src={member.imageUrl} alt={label} />
      ) : null}
      <AvatarFallback
        className="font-semibold text-white"
        style={{
          background: getMemberColor(userId),
          fontSize: Math.round(size * 0.4),
        }}
      >
        {initials}
      </AvatarFallback>
    </Avatar>
  )
}

export function PeriodTabs({
  value,
  onValueChange,
  range,
}: {
  value: Period
  onValueChange: (value: string) => void
  range: string
}) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-4">
      <Tabs value={value} onValueChange={onValueChange}>
        <TabsList className="gap-0.5 rounded-[10px] bg-muted p-[3px] group-data-horizontal/tabs:h-auto">
          {(Object.keys(PERIOD_LABELS) as Period[]).map((key) => (
            <TabsTrigger
              key={key}
              value={key}
              className="h-auto rounded-[8px] px-4 py-[7px] text-[13px] font-semibold text-[#7a766e] transition-colors duration-[120ms] hover:text-foreground data-active:bg-white data-active:text-foreground group-data-[variant=default]/tabs-list:data-active:shadow-[0_1px_2px_rgba(0,0,0,.08)]"
            >
              {PERIOD_LABELS[key]}
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>
      <span className="text-[13px] font-medium text-muted-foreground">
        {range}
      </span>
    </div>
  )
}

// Pill toggle used for deadline + category choices in the create modals.
export function ChoiceChip({
  selected,
  onSelect,
  children,
  className,
}: {
  selected: boolean
  onSelect: () => void
  children: React.ReactNode
  className?: string
}) {
  return (
    <button
      type="button"
      aria-pressed={selected}
      onClick={onSelect}
      className={cn(
        "cursor-pointer rounded-full border-[1.5px] px-3 py-2 text-[13px] font-semibold transition-colors duration-[120ms] outline-none focus-visible:ring-[3px] focus-visible:ring-primary/12",
        selected
          ? "border-primary bg-primary-tint text-primary"
          : "border-border bg-white text-ink-secondary hover:border-input",
        className
      )}
    >
      {children}
    </button>
  )
}

// Input styling for the create modals (pass to the existing <Input />).
export const modalInputClassName =
  "h-auto rounded-[10px] border-[1.5px] border-input bg-white px-3.5 py-3 text-[15px] font-medium text-foreground shadow-none placeholder:text-placeholder focus-visible:border-primary focus-visible:ring-[3px] focus-visible:ring-primary/12 md:text-[15px]"

export const modalLabelClassName = "text-[13px] font-semibold text-foreground"

// Extra classes for the existing <Button /> variants, matching the redesign.
export const buttonToneClassNames: Record<string, string> = {
  default: "",
  outline: "border-input bg-white text-foreground hover:bg-secondary",
  link: "h-auto px-0 py-2 text-sm font-semibold text-primary hover:text-primary-hover hover:no-underline",
}
