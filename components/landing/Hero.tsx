import { SignUpButton } from "@clerk/nextjs"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { formatPeso } from "@/lib/household"
import { cn } from "@/lib/utils"
import { Mail } from "lucide-react"
import {
  KleeMark,
  PersonAvatar,
  Preview,
  PreviewCheck,
  PreviewChoreRow,
  SAMPLE_PEOPLE as P,
} from "./LandingUI"

const floatCard =
  "rounded-[14px] border border-border bg-card shadow-float"

export function Hero() {
  return (
    <section id="top" aria-labelledby="hero-title" className="px-3 pt-3 sm:px-6 sm:pt-6">
      <div className="relative mx-auto max-w-[1200px] overflow-hidden rounded-[28px] border border-border bg-white/50">
        {/* dot texture, faded toward the edges */}
        <div
          aria-hidden
          className="absolute inset-0 bg-dots [mask-image:radial-gradient(ellipse_at_center,black_30%,transparent_80%)]"
        />

        <HeroFragments />

        <div className="relative mx-auto flex max-w-4xl flex-col items-center px-5 pt-16 pb-14 text-center sm:pt-24 sm:pb-20 xl:pt-32 xl:pb-44">
          <div className="grid size-16 place-items-center rounded-[18px] border border-border bg-card shadow-float motion-safe:animate-float-slow">
            <KleeMark size={34} />
          </div>

          <h1
            id="hero-title"
            className="mt-8 text-[40px] leading-[1.04] font-bold tracking-[-0.035em] text-balance sm:text-[56px] lg:text-[64px]"
          >
            Chores, bills, reminders
            <span className="block text-muted-foreground">in one shared place</span>
          </h1>

          <p className="mt-6 max-w-xl text-base text-ink-secondary sm:text-lg">
            klee keeps your roommates on the same page: who&apos;s on which chore,
            who paid for what, and who still owes.
          </p>

          <SignUpButton mode="modal">
            <Button size="cta" className="mt-8 px-6 py-3 text-[15px]">
              Create your house
            </Button>
          </SignUpButton>

          {/* Mobile and tablet: one flat preview instead of the floating fragments */}
          <Preview
            label="A chore list: Take out the trash, done by Jamie today; Wash the dishes, due today, assigned to Sam."
            className="mt-12 w-full max-w-sm xl:hidden"
          >
            <Card className="gap-0 p-4 text-left shadow-float">
              <PreviewChoreRow title="Take out the trash" meta="Done by Jamie · today" person={P.jamie} done />
              <PreviewChoreRow title="Wash the dishes" meta="Today" person={P.sam} />
            </Card>
          </Preview>
        </div>
      </div>
    </section>
  )
}

// Slices of the real dashboard, tilted and layered around the headline.
// Wide screens only (xl); below that they simplify to the single preview above.
function HeroFragments() {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 hidden xl:block">
      {/* top left: chore rows */}
      <div className="absolute top-12 left-12 -rotate-[5deg]">
        <div className={cn(floatCard, "w-[290px] p-4 motion-safe:animate-float")}>
          <div className="mb-1 font-mono text-[11px] font-medium tracking-[.06em] text-faint">TODAY</div>
          <PreviewChoreRow title="Take out the trash" meta="Done by Jamie · today" person={P.jamie} done />
          <PreviewChoreRow title="Wash the dishes" meta="Today" person={P.sam} />
        </div>
      </div>

      {/* left: checkmark tile */}
      <div className="absolute top-[300px] left-[64px] rotate-[8deg]">
        <div
          className="grid size-[58px] place-items-center rounded-[16px] border border-border bg-card shadow-float motion-safe:animate-float-slow"
          style={{ animationDelay: "-3s" }}
        >
          <span className="scale-125">
            <PreviewCheck checked />
          </span>
        </div>
      </div>

      {/* top right: reminder email */}
      <div className="absolute top-14 right-12 rotate-[4deg]">
        <div
          className={cn(floatCard, "w-[260px] p-4 text-left motion-safe:animate-float")}
          style={{ animationDelay: "-2s" }}
        >
          <div className="flex items-center gap-2 font-mono text-[11px] font-medium tracking-[.06em] text-faint">
            <Mail className="size-3.5" strokeWidth={1.75} />
            REMINDER
          </div>
          <div className="mt-2.5 text-[15px] font-semibold">Wash the dishes is due today</div>
          <div className="mt-1 text-[13px] text-muted-foreground">Emailed to Sam · 9:00 AM</div>
        </div>
      </div>

      {/* bottom left: open chores stat */}
      <div className="absolute bottom-14 left-20 rotate-[3deg]">
        <div
          className={cn(floatCard, "w-[200px] px-[22px] py-5 text-left motion-safe:animate-float-slow")}
          style={{ animationDelay: "-5s" }}
        >
          <div className="text-xs font-medium text-muted-foreground">Still open</div>
          <div className="mt-1.5 text-[30px] leading-tight font-bold">2</div>
          <div className="mt-1 text-[13px] text-muted-foreground">0 overdue</div>
        </div>
      </div>

      {/* bottom right: your share */}
      <div className="absolute right-14 bottom-12 -rotate-[4deg]">
        <div
          className={cn(floatCard, "w-[280px] px-[22px] py-5 text-left motion-safe:animate-float")}
          style={{ animationDelay: "-4s" }}
        >
          <div className="text-xs font-medium text-muted-foreground">Your share</div>
          <div className="mt-1.5 text-[30px] leading-tight font-bold text-primary tabular-nums">
            {formatPeso(491.25)}
          </div>
          <div className="mt-3 flex items-center gap-2">
            <span className="flex -space-x-1.5">
              {[P.you, P.jamie, P.sam, P.riley].map((p) => (
                <PersonAvatar key={p.id} id={p.id} initials={p.initials} size={22} className="ring-2 ring-white" />
              ))}
            </span>
            <span className="text-[13px] whitespace-nowrap text-muted-foreground">Groceries · split 4 ways</span>
          </div>
        </div>
      </div>
    </div>
  )
}
