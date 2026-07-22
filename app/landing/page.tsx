import { SignInButton, SignUpButton } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { ArrowRight } from "lucide-react";

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      {/* Header */}
      <header className="fixed top-0 w-full z-50 bg-background/80 backdrop-blur-sm border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-2xl font-bold text-primary tracking-tight">klee</span>
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
              <Button className="bg-primary hover:bg-accent text-primary-foreground text-sm font-medium px-4">
                Start for free
              </Button>
            </SignUpButton>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 pt-16">
        {/* Hero Section */}
        <section className="w-full py-12 md:py-20 lg:py-32 flex flex-col items-center justify-center text-center px-4">
          <div className="space-y-8 max-w-4xl">
            {/* Announcement */}
            <div className="flex justify-center">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-secondary text-secondary-foreground rounded-full border border-border text-sm">
                <span className="text-xs font-medium">New features arriving soon</span>
                <ArrowRight size={14} />
              </div>
            </div>

            {/* Headline */}
            <div>
              <p className="text-xl md:text-2xl text-primary italic font-serif mb-2">Welcome to</p>
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-foreground tracking-tight leading-tight text-balance font-serif italic">
                apartment harmony.
              </h1>
            </div>

            {/* Subheadline */}
            <p className="mx-auto max-w-2xl text-lg md:text-xl text-muted-foreground leading-relaxed">
              Klee is the platform that manages chores, splits expenses, and brings roommates together.
              Everything your household needs in one place.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
              <SignUpButton mode="modal">
                <Button size="lg" className="bg-primary hover:bg-accent text-primary-foreground text-base px-8 py-6">
                  Start for free
                </Button>
              </SignUpButton>
              <Button size="lg" variant="outline" className="text-base px-8 py-6">
                Talk to sales
              </Button>
            </div>
          </div>
        </section>

        {/* Product Screenshot Section */}
        <section className="w-full py-12 md:py-20 px-4">
          <div className="max-w-6xl mx-auto">
            <div className="relative rounded-2xl overflow-hidden shadow-2xl bg-card border border-border">
              <Image
                src="/klee-dashboard.png"
                alt="Klee Dashboard"
                width={1200}
                height={675}
                priority
                className="w-full h-auto"
              />
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="w-full py-8 border-t border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-center text-sm text-muted-foreground">
            © 2026 Klee. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
