import { SignInButton, SignUpButton } from "@clerk/nextjs"
import { Button } from "@/components/ui/button"
import Image from "next/image"
import { ArrowRight } from "lucide-react"
import GridPattern from "@/components/ui/grid-pattern"

export default function LandingPage() {
  return (
    <div className="relative isolate min-h-screen bg-gradient-to-b from-white via-blue-50 to-blue-200">
      <GridPattern
        className="absolute inset-0 z-0 opacity-25"
        width={48}
        height={48}
      />
      <div className="relative z-10 flex min-h-screen flex-col">
        {/* Header */}
        <header className="fixed top-0 z-50 w-full border-b border-border bg-background/80 backdrop-blur-sm">
          <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
            <div className="flex items-center gap-2">
              <span className="text-2xl font-bold tracking-tight text-blue-900">
                klee
              </span>
            </div>
            {/* <nav className="hidden md:flex items-center gap-8">
            <a href="#" className="text-sm font-medium text-foreground hover:text-primary transition-colors">
              Platform
            </a>
            <a href="#" className="text-sm font-medium text-foreground hover:text-primary transition-colors">
              Resources
            </a>
            <a href="#" className="text-sm font-medium text-foreground hover:text-primary transition-colors">
              Customers
            </a>
            <a href="#" className="text-sm font-medium text-foreground hover:text-primary transition-colors">
              Pricing
            </a>
          </nav> */}
            <div className="flex items-center gap-3">
              <SignInButton mode="modal">
                <Button variant="ghost" className="text-sm font-medium">
                  Log in
                </Button>
              </SignInButton>
              <SignUpButton mode="modal">
                <Button className="bg-blue-900 px-4 text-sm font-medium text-primary-foreground hover:bg-blue-950">
                  Start for free
                </Button>
              </SignUpButton>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="mt-10 flex-1 pt-16">
          {/* Hero Section */}
          <section className="flex w-full flex-col items-center justify-center px-4 py-12 text-center md:py-20 lg:py-32">
            <div className="max-w-4xl space-y-8">
              {/* Announcement */}
              <div className="flex justify-center">
                <div className="inline-flex items-center gap-2 rounded-full border border-border bg-secondary px-3 py-1 text-sm text-foreground">
                  <span className="text-xs font-medium">
                    New features arriving soon
                  </span>
                  <ArrowRight size={14} />
                </div>
              </div>

              {/* Headline */}
              <div>
                <h1 className="text-5xl leading-tight font-bold tracking-tight text-balance text-foreground md:text-6xl lg:text-7xl">
                  Welcome to apartment harmony.
                </h1>
              </div>

              {/* Subheadline */}
              <p className="mx-auto max-w-2xl text-lg leading-relaxed text-muted-foreground md:text-xl">
                Klee is the platform that manages chores, splits expenses, and
                brings roommates together. Everything your household needs in
                one place.
              </p>

              {/* CTA Buttons */}
              <div className="flex flex-col justify-center gap-4 pt-4 sm:flex-row">
                <SignUpButton mode="modal">
                  <Button
                    size="lg"
                    className="bg-blue-900 px-6 py-6 text-base text-primary-foreground hover:bg-blue-950"
                  >
                    Start for free
                  </Button>
                </SignUpButton>
                <Button
                  size="lg"
                  variant="outline"
                  className="px-6 py-6 text-base"
                >
                  Sign In
                </Button>
              </div>
            </div>
          </section>

          {/* Product Screenshot Section */}
          {/* <section className="w-full px-4 py-12 md:py-20">
            <div className="mx-auto max-w-6xl">
              <div className="relative overflow-hidden rounded-2xl border border-border bg-card shadow-2xl">
                <Image
                  src="/klee-dashboard.png"
                  alt="Klee Dashboard"
                  width={1200}
                  height={675}
                  priority
                  className="h-auto w-full"
                />
              </div>
            </div>
          </section> */}
        </main>

        {/* Footer */}
        <footer className="w-full border-border py-8">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <p className="text-center text-sm text-muted-foreground">
              © 2026 Klee. All rights reserved.
            </p>
          </div>
        </footer>
      </div>
    </div>
  )
}
