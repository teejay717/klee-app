"use client"

import { useOrganization } from "@clerk/nextjs"

interface HeaderProps {
    title: React.ReactNode,
    // shown after the house name, e.g. "Testing · Chores"
    eyebrow?: React.ReactNode,
    description?: string,
    children?: React.ReactNode
}

export default function HeaderComponent({title, eyebrow, description, children} : HeaderProps) {
const { organization } = useOrganization()
const houseName = organization?.name ?? "Apartment"

return (
    <header className="flex flex-wrap items-end justify-between gap-x-6 gap-y-4">
        <div className="min-w-0">
            <div className="text-[13px] font-medium text-muted-foreground" suppressHydrationWarning>
                {houseName}{eyebrow ? <> · {eyebrow}</> : null}
            </div>
            <h1 className="mt-1.5 text-[34px] leading-[1.1] font-bold tracking-[-0.02em]">{title}</h1>
            {description ? <p className="sr-only">{description}</p> : null}
        </div>
        {children && <div className="flex gap-2.5">{children}</div>}
    </header>
)
}
