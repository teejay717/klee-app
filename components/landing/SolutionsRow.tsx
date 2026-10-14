import { BellRing, ListChecks, Receipt } from "lucide-react"
import { Reveal } from "./Reveal"
import { SectionIntro } from "./LandingUI"

const ITEMS = [
  {
    icon: ListChecks,
    title: "Everyone knows their chores",
    body: "Each chore has one roommate and an optional deadline, so nobody has to keep track of whose turn it is.",
  },
  {
    icon: Receipt,
    title: "Splits are worked out for you",
    body: "Log what you paid, tick who shared it, and klee shows each person their share and who still owes.",
  },
  {
    icon: BellRing,
    title: "Reminders do the nagging",
    body: "klee emails roommates when a chore is due and when their share of an expense is still unpaid.",
  },
]

export function SolutionsRow() {
  return (
    <section
      id="how-it-works"
      aria-labelledby="how-it-works-title"
      className="scroll-mt-20 px-4 py-24 sm:px-6 sm:py-32"
    >
      <Reveal>
        <SectionIntro
          id="how-it-works-title"
          label="How it works"
          title={
            <>
              Less keeping score,
              <br className="hidden sm:block" /> more living together
            </>
          }
        />
      </Reveal>

      <ul className="mx-auto mt-14 grid max-w-[1080px] grid-cols-1 sm:mt-16 md:grid-cols-3">
        {ITEMS.map((item, i) => (
          <Reveal
            as="li"
            key={item.title}
            delay={i * 90}
            className="flex flex-col gap-3 border-t border-dashed border-dashed-border px-2 py-8 first:border-t-0 md:border-t-0 md:border-l md:px-9 md:py-2 md:first:border-l-0 md:first:pl-2"
          >
            <item.icon aria-hidden className="size-6 text-primary" strokeWidth={1.5} />
            <h3 className="mt-2 text-[17px] font-semibold">{item.title}</h3>
            <p className="text-[15px] leading-relaxed text-ink-secondary">{item.body}</p>
          </Reveal>
        ))}
      </ul>
    </section>
  )
}
