"use client"

import { useEffect, useRef } from "react"
import { cn } from "@/lib/utils"

// Fades content up as it scrolls into view. Content is visible by default
// (no JS, reduced motion, or already on screen) and only hidden once we know
// it is below the fold, so nothing flashes or stays invisible.
export function Reveal({
  children,
  className,
  delay = 0,
  as: Tag = "div",
}: {
  children: React.ReactNode
  className?: string
  delay?: number
  as?: "div" | "section" | "li"
}) {
  const ref = useRef<HTMLElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return
    if (el.getBoundingClientRect().top < window.innerHeight * 0.9) return

    el.dataset.reveal = "pending"
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return
        el.dataset.reveal = "shown"
        observer.disconnect()
      },
      { rootMargin: "0px 0px -10% 0px" }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  return (
    <Tag
      ref={ref as React.Ref<never>}
      className={cn(className)}
      style={delay ? { transitionDelay: `${delay}ms` } : undefined}
    >
      {children}
    </Tag>
  )
}
