import { SignInButton, SignUpButton } from "@clerk/nextjs"
import { Button } from "@/components/ui/button"
import { buttonToneClassNames } from "@/components/HouseholdUI"
import { Logo } from "./LandingUI"

const LINKS = [
  { href: "#how-it-works", label: "How it works" },
  { href: "#features", label: "Features" },
  { href: "#reminders", label: "Reminders" },
]

export function LandingNav() {
  return (
    <header className="sticky top-0 z-50 border-b border-border/70 bg-background/85 backdrop-blur-md">
      <nav
        aria-label="Main"
        className="mx-auto flex h-16 max-w-[1200px] items-center justify-between gap-4 px-4 sm:px-6"
      >
        <a href="#top" className="rounded-[8px] outline-none focus-visible:ring-[3px] focus-visible:ring-primary/20">
          <Logo />
          <span className="sr-only">klee home</span>
        </a>

        <ul className="hidden items-center gap-8 md:flex">
          {LINKS.map((link) => (
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

        <div className="flex items-center gap-1.5 sm:gap-2.5">
          <SignInButton mode="modal">
            <Button variant="ghost" size="cta" className="text-ink-secondary hover:bg-secondary hover:text-foreground">
              Sign in
            </Button>
          </SignInButton>
          <SignUpButton mode="modal">
            <Button variant="outline" size="cta" className={buttonToneClassNames.outline}>
              Get started
            </Button>
          </SignUpButton>
        </div>
      </nav>
    </header>
  )
}
