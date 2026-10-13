// Shared formatting + derived values for the household pages.

export type Period = "week" | "month" | "all"

export const PERIOD_LABELS: Record<Period, string> = {
  week: "This week",
  month: "This month",
  all: "All time",
}

const DAY_MS = 24 * 60 * 60 * 1000

export function formatPeso(num: number) {
  return new Intl.NumberFormat("en-PH", {
    style: "currency",
    currency: "PHP",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(num)
}

// Matches the existing rolling filters (last 7 / last 30 days).
// TODO: switch to calendar week/month ranges if the filters change to match the design ("Oct 12 – 18", "October 2026").
export function getPeriodRange(period: Period, now = new Date()) {
  if (period === "all") return "Since the house was created"
  const start = new Date(now.getTime() - (period === "week" ? 6 : 29) * DAY_MS)
  const sameMonth = start.getMonth() === now.getMonth()
  const startLabel = start.toLocaleDateString("en-US", { month: "short", day: "numeric" })
  const endLabel = now.toLocaleDateString(
    "en-US",
    sameMonth ? { day: "numeric" } : { month: "short", day: "numeric" }
  )
  return `${startLabel} – ${endLabel}`
}

// Stable roommate colour from the user id.
const ROOMMATE_COLORS = [
  "oklch(0.42 0.13 265)",
  "oklch(0.55 0.12 150)",
  "oklch(0.55 0.15 0)",
  "oklch(0.55 0.12 60)",
]

export function getMemberColor(userId: string) {
  let hash = 0
  for (let i = 0; i < userId.length; i++) {
    hash = (hash * 31 + userId.charCodeAt(i)) | 0
  }
  return ROOMMATE_COLORS[Math.abs(hash) % ROOMMATE_COLORS.length]
}

export function toDate(value: Date | string | null | undefined) {
  if (!value) return null
  let safe = value
  // DB timestamps come back without a zone; they are stored as UTC.
  if (typeof safe === "string" && !/[zZ]|[+-]\d\d:?\d\d$/.test(safe)) {
    safe += "Z"
  }
  const d = safe instanceof Date ? safe : new Date(safe)
  return Number.isNaN(d.getTime()) ? null : d
}

export function getRelativeLabel(value: Date | string | null | undefined) {
  const d = toDate(value)
  if (!d) return "No date"

  const now = new Date()
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
  const target = new Date(d.getFullYear(), d.getMonth(), d.getDate())
  const diffDays = Math.round((today.getTime() - target.getTime()) / DAY_MS)

  if (diffDays === 0) return "today"
  if (diffDays === 1) return "yesterday"
  if (diffDays > 1 && diffDays < 7) return `${diffDays} days ago`
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric" })
}

export function isOverdue(deadline: Date | string | null) {
  if (!deadline) return false
  const d = deadline instanceof Date ? deadline : new Date(deadline)
  if (Number.isNaN(d.getTime())) return false
  const now = new Date()
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
  const target = new Date(d.getFullYear(), d.getMonth(), d.getDate())
  return target < today
}

type ShareExpense = { id: number; amount: string | number }
type ShareParticipation = { expenseId: number; userId: string; isPaid?: boolean | null }

// Total of the expenses, and the current user's unpaid share of them.
export function getExpenseTotals(
  expenses: ShareExpense[],
  participations: ShareParticipation[],
  currentUserId: string | null
) {
  const total = expenses.reduce((acc, e) => acc + Number(e.amount), 0)

  const yourShare = expenses.reduce((acc, expense) => {
    const mine = participations.find(
      (p) => p.expenseId === expense.id && p.userId === currentUserId
    )
    if (!mine || mine.isPaid) return acc
    const people = participations.filter((p) => p.expenseId === expense.id).length
    return acc + Number(expense.amount) / people
  }, 0)

  return { total, yourShare }
}
