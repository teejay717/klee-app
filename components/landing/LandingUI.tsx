import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { getMemberColor } from "@/lib/household"
import { cn } from "@/lib/utils"

// Building blocks for the landing page. Everything here sits on the dashboard
// tokens (colours, radii, type scale) so both surfaces read as one product.

export function KleeMark({ size = 26, className }: { size?: number; className?: string }) {
  // Same tile as the dashboard's house switcher: navy, rounded, white initial.
  return (
    <span
      aria-hidden
      className={cn(
        "grid shrink-0 place-items-center bg-primary font-bold text-white",
        className
      )}
      style={{
        width: size,
        height: size,
        borderRadius: Math.round(size * 0.27),
        fontSize: Math.round(size * 0.5),
      }}
    >
      k
    </span>
  )
}

export function Logo({ className }: { className?: string }) {
  return (
    <span className={cn("flex items-center gap-2.5", className)}>
      <KleeMark />
      <span className="text-lg font-bold tracking-[-0.02em]">klee</span>
    </span>
  )
}

export function Pill({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center rounded-full border border-border bg-card px-3.5 py-1.5 text-[13px] font-medium text-ink-secondary shadow-[0_1px_2px_rgba(0,0,0,.06)]">
      {children}
    </span>
  )
}

export function SectionIntro({
  label,
  title,
  subtitle,
  id,
}: {
  label: string
  title: React.ReactNode
  subtitle?: string
  id?: string
}) {
  return (
    <div className="mx-auto flex max-w-2xl flex-col items-center gap-4 text-center">
      <Pill>{label}</Pill>
      <h2
        id={id}
        className="text-[34px] leading-[1.1] font-bold tracking-[-0.02em] text-balance sm:text-[44px]"
      >
        {title}
      </h2>
      {subtitle ? (
        <p className="max-w-xl text-base text-muted-foreground sm:text-lg">{subtitle}</p>
      ) : null}
    </div>
  )
}

// Sample roommates for the product previews. Ids only feed the stable colour.
export const SAMPLE_PEOPLE = {
  you: { id: "user_sample_you", name: "You", initials: "AR" },
  jamie: { id: "user_sample_jamie", name: "Jamie", initials: "J" },
  sam: { id: "user_sample_sam9", name: "Sam", initials: "S" },
  riley: { id: "user_sample_riley", name: "Riley", initials: "R" },
}

export function PersonAvatar({
  id,
  initials,
  size = 24,
  className,
}: {
  id: string
  initials: string
  size?: number
  className?: string
}) {
  return (
    <Avatar className={cn("after:hidden", className)} style={{ width: size, height: size }}>
      <AvatarFallback
        className="font-semibold text-white"
        style={{ background: getMemberColor(id), fontSize: Math.round(size * 0.4) }}
      >
        {initials}
      </AvatarFallback>
    </Avatar>
  )
}

// Wraps a slice of dashboard UI shown as an illustration. The inner UI is
// inert (not focusable, hidden from screen readers) and described by `label`.
export function Preview({
  label,
  children,
  className,
}: {
  label: string
  children: React.ReactNode
  className?: string
}) {
  return (
    <figure role="img" aria-label={label} className={cn("m-0", className)}>
      <div inert className="pointer-events-none select-none">
        {children}
      </div>
    </figure>
  )
}

// Static checkbox matching ui/checkbox (20px, 6px radius, navy when checked).
export function PreviewCheck({ checked = false }: { checked?: boolean }) {
  return (
    <span
      className={cn(
        "grid size-5 shrink-0 place-items-center rounded-[6px] border-[1.5px]",
        checked ? "border-primary bg-primary text-white" : "border-checkbox-border bg-white"
      )}
    >
      {checked ? (
        <svg viewBox="0 0 24 24" className="size-3.5" fill="none" stroke="currentColor" strokeWidth={3} strokeLinecap="round" strokeLinejoin="round">
          <path d="M20 6 9 17l-5-5" />
        </svg>
      ) : null}
    </span>
  )
}

// One chore row, same structure and type as ChoreList.
export function PreviewChoreRow({
  title,
  meta,
  person,
  done = false,
  className,
}: {
  title: string
  meta: string
  person: { id: string; name: string; initials: string }
  done?: boolean
  className?: string
}) {
  return (
    <div className={cn("flex items-center gap-3.5 border-t border-row-divider px-1 py-3.5 first:border-t-0", className)}>
      <PreviewCheck checked={done} />
      <span className="flex min-w-0 flex-1 flex-col gap-0.5">
        <span className={cn("truncate text-[15px] font-semibold", done && "text-faint line-through")}>
          {title}
        </span>
        <span className="truncate text-[13px] text-muted-foreground">{meta}</span>
      </span>
      <span className="flex shrink-0 items-center gap-2 text-[13px] font-medium text-ink-secondary">
        <PersonAvatar id={person.id} initials={person.initials} size={24} />
        {person.name}
      </span>
    </div>
  )
}
