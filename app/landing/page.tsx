import { LandingNav } from "@/components/landing/LandingNav"
import { Hero } from "@/components/landing/Hero"
import { SolutionsRow } from "@/components/landing/SolutionsRow"
import { ProductShowcase } from "@/components/landing/ProductShowcase"
import { FeaturesBento } from "@/components/landing/FeaturesBento"

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-[60] focus:rounded-[8px] focus:bg-card focus:px-3 focus:py-2 focus:text-sm focus:font-semibold focus:shadow-float"
      >
        Skip to content
      </a>
      <LandingNav />
      <main id="main">
        <Hero />
        <SolutionsRow />
        <ProductShowcase />
        <FeaturesBento />
      </main>
    </div>
  )
}
