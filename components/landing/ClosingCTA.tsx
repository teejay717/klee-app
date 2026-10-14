import { SignInButton, SignUpButton } from "@clerk/nextjs"
import { Button } from "@/components/ui/button"
import { buttonToneClassNames } from "@/components/HouseholdUI"
import { Reveal } from "./Reveal"
import { KleeMark, Logo } from "./LandingUI"

export function ClosingCTA() {
  return (
    <section aria-labelledby="closing-title" className="px-3 pb-6 sm:px-6">
      <Reveal className="relative mx-auto max-w-[1200px] overflow-hidden rounded-[28px] border border-border bg-white/50 px-6 py-20 text-center sm:py-24">
        <div
          aria-hidden
          className="absolute inset-0 bg-dots [mask-image:radial-gradient(ellipse_at_center,black_20%,transparent_75%)]"
        />
        <div className="relative mx-auto flex max-w-xl flex-col items-center">
          <div className="grid size-14 place-items-center rounded-[16px] border border-border bg-card shadow-float">
            <KleeMark size={30} />
          </div>
          <h2
            id="closing-title"
            className="mt-7 text-[34px] leading-[1.1] font-bold tracking-[-0.02em] text-balance sm:text-[44px]"
          >
            Give your house one place to keep track
          </h2>
          <p className="mt-4 text-base text-ink-secondary sm:text-lg">
            Create a house, invite your roommates, and add your first chore.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-2.5">
            <SignUpButton mode="modal">
              <Button size="cta" className="px-6 py-3 text-[15px]">
                Create your house
              </Button>
            </SignUpButton>
            <SignInButton mode="modal">
              <Button
                variant="outline"
                size="cta"
                className={`${buttonToneClassNames.outline} px-6 py-3 text-[15px]`}
              >
                Sign in
              </Button>
            </SignInButton>
          </div>
        </div>
      </Reveal>
    </section>
  )
}

const FOOTER_LINKS = [
  { href: "#how-it-works", label: "How it works" },
  { href: "#features", label: "Features" },
  { href: "#reminders", label: "Reminders" },
]

export function LandingFooter() {
  return (
    <footer className="px-4 py-10 sm:px-6">
      <div className="mx-auto flex max-w-[1200px] flex-col items-center justify-between gap-6 border-t border-border pt-8 sm:flex-row">
        <Logo />
        <nav aria-label="Footer">
          <ul className="flex flex-wrap justify-center gap-x-6 gap-y-2">
            {FOOTER_LINKS.map((link) => (
              <li key={link.href}>
                <a
                  href={link.href}
                  className="text-sm font-medium text-ink-secondary transition-colors duration-[120ms] hover:text-foreground"
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
        <p className="text-[13px] text-muted-foreground">© 2026 klee. All rights reserved.</p>
      </div>
    </footer>
  )
}
