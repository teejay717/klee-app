import { Card } from "@/components/ui/card"
import { PanelHeader, StatStrip } from "@/components/HouseholdUI"
import { formatPeso } from "@/lib/household"
import { cn } from "@/lib/utils"
import { Reveal } from "./Reveal"
import {
  KleeMark,
  PersonAvatar,
  Preview,
  PreviewCheck,
  PreviewChoreRow,
  SAMPLE_PEOPLE as P,
} from "./LandingUI"

export function ProductShowcase() {
  return (
    <section aria-label="Product preview" className="px-3 sm:px-6">
      <Reveal className="relative mx-auto max-w-[1200px]">
        {/* accent panel, fading into the page at the bottom */}
        <div className="relative overflow-hidden rounded-[28px] bg-[linear-gradient(160deg,oklch(0.5_0.14_265),var(--primary)_45%,oklch(0.34_0.11_265))] px-3 pt-10 [mask-image:linear-gradient(to_bottom,black_62%,transparent_98%)] sm:px-10 sm:pt-16 lg:px-20 lg:pt-20">
          <div
            aria-hidden
            className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgb(255_255_255/0.22),transparent_60%)]"
          />
          <Preview
            label="The klee dashboard: a greeting, four totals (2 pending chores, 1 unpaid expense, ₱1,996.00 shared in 30 days, ₱491.25 your share), a chore list and recent expenses."
            className="relative"
          >
            <DashboardPreview />
          </Preview>
        </div>

        {/* floating badges overlapping the panel edges */}
        <div aria-hidden className="pointer-events-none absolute inset-0 hidden md:block">
          <div className="absolute top-28 -left-5 -rotate-[6deg] lg:-left-8">
            <div className="flex flex-col items-center rounded-[18px] border border-border bg-card px-5 py-3.5 shadow-float-lg motion-safe:animate-float-slow">
              <span className="text-[40px] leading-none font-bold tracking-[-0.02em]">2</span>
              <span className="mt-1 font-mono text-[11px] font-medium tracking-[.06em] text-faint">OPEN</span>
            </div>
          </div>
          <div className="absolute top-14 -right-4 rotate-[7deg] lg:-right-7">
            <div
              className="grid size-[64px] place-items-center rounded-[18px] border border-border bg-card shadow-float-lg motion-safe:animate-float"
              style={{ animationDelay: "-2s" }}
            >
              <span className="scale-[1.4]">
                <PreviewCheck checked />
              </span>
            </div>
          </div>
        </div>
      </Reveal>
    </section>
  )
}

const NAV = ["Dashboard", "Chores", "Expenses"]

// A static copy of the dashboard layout, built from the same components.
function DashboardPreview() {
  return (
    <div className="flex overflow-hidden rounded-t-[18px] border border-b-0 border-border bg-background text-left shadow-float-lg">
      {/* sidebar */}
      <div className="hidden w-[200px] shrink-0 flex-col border-r border-border px-3 py-5 md:flex">
        <div className="flex items-center gap-2.5 rounded-[10px] border border-border bg-white px-2.5 py-2">
          <KleeMark size={26} />
          <span className="flex min-w-0 flex-col">
            <span className="truncate text-sm font-semibold">Maple House</span>
            <span className="text-[11px] text-muted-foreground">4 members</span>
          </span>
        </div>
        <div className="mt-7 px-2.5 pb-2 font-mono text-[11px] font-medium tracking-[.06em] text-faint">HOME</div>
        {NAV.map((item, i) => (
          <div
            key={item}
            className={cn(
              "flex items-center gap-2.5 rounded-[8px] px-2.5 py-[9px] text-sm",
              i === 0
                ? "bg-white font-semibold shadow-[0_1px_2px_rgba(0,0,0,.06)]"
                : "font-medium text-ink-secondary"
            )}
          >
            <span className={cn("size-2 rounded-[2px]", i === 0 ? "bg-primary" : "border-[1.5px] border-[#b5b1a8]")} />
            {item}
            {item === "Chores" ? (
              <span className="ml-auto font-mono text-[11px] font-medium text-muted-foreground">2</span>
            ) : null}
          </div>
        ))}
      </div>

      {/* main */}
      <div className="flex min-w-0 flex-1 flex-col gap-5 p-4 sm:p-7">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <div className="text-[13px] font-medium text-muted-foreground">Maple House · Wednesday, Oct 14</div>
            <div className="mt-1 text-[26px] leading-[1.1] font-bold tracking-[-0.02em] sm:text-[30px]">
              Good to see you, <span className="text-primary">Alex</span>
            </div>
          </div>
          <div className="hidden gap-2 sm:flex">
            <span className="rounded-[9px] border border-input bg-white px-3.5 py-2 text-[13px] font-semibold">+ Chore</span>
            <span className="rounded-[9px] bg-primary px-3.5 py-2 text-[13px] font-semibold text-white">+ Expense</span>
          </div>
        </div>

        <StatStrip
          stats={[
            { label: "Pending chores", value: 2 },
            { label: "Unpaid expenses", value: 1 },
            { label: "Total shared · 30d", value: formatPeso(1996) },
            { label: "Your share", value: formatPeso(491.25), accent: true },
          ]}
          compact
        />

        <div className="grid grid-cols-1 gap-4 lg:grid-cols-[minmax(0,1.6fr)_minmax(0,1fr)]">
          <Card className="gap-2 p-5">
            <PanelHeader title="Chores" meta="2 of 4 done" />
            <div>
              <PreviewChoreRow title="Wash the dishes" meta="Today" person={P.sam} />
              <PreviewChoreRow title="Clean the bathroom" meta="Tomorrow" person={P.you} />
              <PreviewChoreRow title="Take out the trash" meta="Done by Jamie · today" person={P.jamie} done />
              <PreviewChoreRow title="Buy dish soap" meta="Done by Riley · yesterday" person={P.riley} done />
            </div>
          </Card>
          <Card className="hidden gap-2 p-5 lg:flex">
            <PanelHeader title="Expenses" meta="Last 30 days" />
            <div>
              {[
                { title: "Groceries", meta: "Riley · Oct 13", amount: 1000, p: P.riley },
                { title: "Water bill", meta: "You · Oct 12", amount: 700, p: P.you },
                { title: "Dish soap & sponges", meta: "Jamie · Oct 10", amount: 296, p: P.jamie },
              ].map((e) => (
                <div key={e.title} className="flex items-center gap-3 border-t border-row-divider px-1 py-3 first:border-t-0">
                  <span className="flex min-w-0 flex-1 flex-col gap-0.5">
                    <span className="truncate text-[15px] font-semibold">{e.title}</span>
                    <span className="truncate text-[13px] text-muted-foreground">{e.meta}</span>
                  </span>
                  <span className="text-[15px] font-semibold tabular-nums">{formatPeso(e.amount)}</span>
                  <PersonAvatar id={e.p.id} initials={e.p.initials} size={24} />
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}
