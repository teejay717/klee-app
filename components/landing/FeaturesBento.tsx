"use client"

import { ChoiceChip, PanelHeader, StatStrip } from "@/components/HouseholdUI"
import { formatPeso } from "@/lib/household"
import { cn } from "@/lib/utils"
import { Mail } from "lucide-react"
import { Reveal } from "./Reveal"
import {
  PersonAvatar,
  Preview,
  PreviewCheck,
  PreviewChoreRow,
  SectionIntro,
  SAMPLE_PEOPLE as P,
} from "./LandingUI"

export function FeaturesBento() {
  return (
    <section
      id="features"
      aria-labelledby="features-title"
      className="scroll-mt-20 px-4 pt-20 pb-24 sm:px-6 sm:pt-28 sm:pb-32"
    >
      <Reveal>
        <SectionIntro
          id="features-title"
          label="Features"
          title="Everything the house shares, in one place"
          subtitle="No spreadsheets, no group-chat reminders. Just the chores and costs you share."
        />
      </Reveal>

      <div className="mx-auto mt-14 grid max-w-[1080px] grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
        <BentoCard
          className="md:col-span-2"
          title="Fair splits"
          description="Log what you paid, tick who shared it, and everyone sees their share to the centavo."
          preview={<SplitPreview />}
          previewLabel="Splitting a ₱1,200.00 groceries expense: Alex, Jamie and Sam pay ₱400.00 each, Riley is left out."
        />
        <BentoCard
          title="One shared house"
          description="Invite your roommates and see who has what on their plate."
          preview={<HousePreview />}
          previewLabel="Roommates list for Maple House with four members and their open chores."
          delay={90}
        />
        <BentoCard
          id="reminders"
          title="Email reminders"
          description="A daily email for chores due today and shares still unpaid after six days."
          preview={<RemindersPreview />}
          previewLabel="Two reminder emails: Wash the dishes is due today, and your share of the monthly internet bill is still unpaid."
        />
        <BentoCard
          className="md:col-span-2"
          title="Chores with history"
          description="Assign chores with a deadline, tick them off, and look back by week, month or all time."
          preview={<HistoryPreview />}
          previewLabel="Chore history for this week: 6 completed, 2 still open, 0 overdue."
          delay={90}
        />
      </div>

      <Reveal>
        <p className="mt-12 text-center text-[15px] text-muted-foreground">
          …plus a recent activity feed, overdue counts and switching between houses.
        </p>
      </Reveal>
    </section>
  )
}

function BentoCard({
  id,
  title,
  description,
  preview,
  previewLabel,
  className,
  delay = 0,
}: {
  id?: string
  title: string
  description: string
  preview: React.ReactNode
  previewLabel: string
  className?: string
  delay?: number
}) {
  return (
    <Reveal delay={delay} className={cn("scroll-mt-24", className)}>
      <article
        id={id}
        className="group flex h-full flex-col overflow-hidden rounded-[20px] border border-border bg-card transition-[translate,box-shadow] duration-300 hover:shadow-float motion-safe:hover:-translate-y-1"
      >
        <Preview
          label={previewLabel}
          className="relative h-[250px] overflow-hidden border-b border-divider bg-background"
        >
          <div aria-hidden className="absolute inset-0 bg-dots opacity-70" />
          <div className="relative h-full">{preview}</div>
        </Preview>
        <div className="flex flex-col gap-1.5 p-6">
          <h3 className="text-lg font-bold tracking-[-0.01em]">{title}</h3>
          <p className="text-[15px] text-ink-secondary">{description}</p>
        </div>
      </article>
    </Reveal>
  )
}

const panel = "rounded-[14px] border border-border bg-card shadow-float"

// Cropped slice of the "New shared expense" modal.
function SplitPreview() {
  const people = [
    { ...P.you, name: "Alex (you)", on: true },
    { ...P.jamie, on: true },
    { ...P.sam, on: true },
    { ...P.riley, on: false },
  ]
  return (
    <div className="flex h-full items-start justify-center gap-5 px-6 pt-7">
      <div className={cn(panel, "hidden w-[220px] shrink-0 flex-col gap-3 p-4 sm:flex")}>
        <div className="flex items-center gap-1.5 rounded-[12px] border-[1.5px] border-input px-3 py-2.5">
          <span className="text-2xl font-semibold text-muted-foreground">₱</span>
          <span className="text-2xl font-bold tabular-nums">1,200</span>
        </div>
        <div className="flex flex-wrap gap-1.5">
          {["Rent", "Groceries", "Utilities"].map((c) => (
            <ChoiceChip key={c} selected={c === "Groceries"} onSelect={() => {}} className="px-2.5 py-1.5 text-xs">
              {c}
            </ChoiceChip>
          ))}
        </div>
      </div>
      <div className={cn(panel, "w-full max-w-[330px] overflow-hidden")}>
        {people.map((p) => (
          <div
            key={p.id}
            className={cn(
              "flex items-center gap-3 border-t border-row-divider px-3.5 py-[11px] first:border-t-0",
              p.on ? "bg-white" : "bg-background text-placeholder"
            )}
          >
            <PreviewCheck checked={p.on} />
            <PersonAvatar id={p.id} initials={p.initials} size={26} />
            <span className="flex-1 truncate text-sm font-medium">{p.name}</span>
            <span className="text-sm font-semibold tabular-nums">{p.on ? formatPeso(400) : "—"}</span>
          </div>
        ))}
        <div className="border-t border-divider bg-background px-3.5 py-3 text-[13px] text-muted-foreground">
          3 people · {formatPeso(400)} each
        </div>
      </div>
    </div>
  )
}

// The dashboard's Roommates panel.
function HousePreview() {
  const rows = [
    { ...P.you, name: "Alex", note: "· you", chores: 1 },
    { ...P.jamie, note: "", chores: 0 },
    { ...P.sam, note: "", chores: 1 },
    { ...P.riley, note: "", chores: 0 },
  ]
  return (
    <div className="flex h-full justify-center px-6 pt-7">
      <div className={cn(panel, "flex w-full max-w-[290px] flex-col gap-3 p-[18px]")}>
        <PanelHeader title="Roommates" meta="4" />
        {rows.map((r) => (
          <div key={r.id} className="flex items-center gap-3">
            <PersonAvatar id={r.id} initials={r.initials} size={30} />
            <span className="truncate text-sm font-medium">
              {r.name}
              {r.note ? <span className="text-muted-foreground"> {r.note}</span> : null}
            </span>
            {r.chores ? (
              <span className="ml-auto text-xs font-medium text-muted-foreground">
                {r.chores} chore
              </span>
            ) : null}
          </div>
        ))}
      </div>
    </div>
  )
}

function RemindersPreview() {
  const emails = [
    { title: "Wash the dishes is due today", meta: "To Sam · 9:00 AM" },
    { title: "Your share of the monthly internet bill is still unpaid", meta: "To Jamie · 9:00 AM" },
  ]
  return (
    <div className="flex h-full flex-col items-center gap-3 px-6 pt-8">
      {emails.map((e, i) => (
        <div
          key={e.title}
          className={cn(panel, "w-full max-w-[290px] p-4", i === 1 && "translate-x-3 -rotate-[2deg]")}
        >
          <div className="flex items-center gap-2 font-mono text-[11px] font-medium tracking-[.06em] text-faint">
            <Mail className="size-3.5" strokeWidth={1.75} />
            REMINDER
          </div>
          <div className="mt-2 text-sm font-semibold">{e.title}</div>
          <div className="mt-1 text-[13px] text-muted-foreground">{e.meta}</div>
        </div>
      ))}
    </div>
  )
}

// Chore History: period tabs, stat strip and a couple of rows.
function HistoryPreview() {
  return (
    <div className="flex h-full flex-col gap-4 px-6 pt-7 sm:px-8">
      <div className="flex items-center justify-between gap-3">
        <div className="flex gap-0.5 rounded-[10px] bg-muted p-[3px]">
          {["This week", "This month", "All time"].map((t, i) => (
            <span
              key={t}
              className={cn(
                "rounded-[8px] px-3.5 py-[6px] text-[13px] font-semibold",
                i === 0 ? "bg-white shadow-[0_1px_2px_rgba(0,0,0,.08)]" : "text-[#7a766e]"
              )}
            >
              {t}
            </span>
          ))}
        </div>
        <span className="hidden text-[13px] font-medium text-muted-foreground sm:inline">Oct 8 – 14</span>
      </div>
      <StatStrip
        compact
        stats={[
          { label: "Completed · This week", value: 6 },
          { label: "Still open", value: 2 },
          { label: "Overdue", value: 0 },
        ]}
        className="min-[900px]:grid-cols-3 sm:grid-cols-3"
      />
      <div className={cn(panel, "px-4 py-1 shadow-none")}>
        <PreviewChoreRow title="Take out the trash" meta="Done by Jamie · today" person={P.jamie} done />
      </div>
    </div>
  )
}
