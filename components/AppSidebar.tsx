"use client"

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { OrganizationSwitcher, UserButton } from "@clerk/nextjs"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"

type AppSidebarProps = {
  identity: { name: string; email: string } | null
  openChoreCount?: number
}

const NAV_ITEMS = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/chores", label: "Chores" },
  { href: "/expenses", label: "Expenses" },
]

export function AppSidebar({ identity, openChoreCount = 0 }: AppSidebarProps) {
  const pathname = usePathname()

  return (
    <Sidebar className="border-r-border">
      <SidebarHeader className="px-3.5 pt-5 pb-0">
        <OrganizationSwitcher
          hidePersonal={true}
          appearance={{
            elements: {
              rootBox: "!w-full",
              organizationSwitcherTrigger: `
                !w-full !justify-between !gap-2.5 !px-2.5 !py-2
                !bg-white !border !border-solid !border-border !rounded-[10px]
                !shadow-none hover:!bg-white focus:!shadow-none
                transition-colors
            `,
              organizationPreview: "!gap-2.5",
              organizationPreviewAvatarBox: "!size-[26px] !rounded-[7px]",
              organizationPreviewMainIdentifier:
                "!text-sm !font-semibold !text-foreground",
              organizationSwitcherTriggerIcon: "!size-3.5 !text-muted-foreground",
              organizationSwitcherPopoverCard:
                "shadow-lg border border-border rounded-[10px]",
            },
          }}
        />
      </SidebarHeader>

      <SidebarContent className="px-3.5">
        <SidebarGroup className="mt-7 p-0">
          <SidebarGroupLabel className="h-auto px-2.5 pt-0 pb-2 font-mono text-[11px] font-medium tracking-[.06em] text-faint">
            HOME
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="gap-0.5">
              {NAV_ITEMS.map((item) => {
                const isActive =
                  pathname === item.href || pathname.startsWith(`${item.href}/`)
                return (
                  <SidebarMenuItem key={item.href}>
                    <SidebarMenuButton
                      asChild
                      isActive={isActive}
                      className="h-auto gap-2.5 rounded-[8px] px-2.5 py-[9px] text-sm font-medium text-ink-secondary transition-colors duration-[120ms] hover:bg-white/70 hover:text-foreground data-active:bg-white data-active:font-semibold data-active:text-foreground data-active:shadow-[0_1px_2px_rgba(0,0,0,.06)]"
                    >
                      <Link href={item.href}>
                        <span
                          aria-hidden
                          className={cn(
                            "size-2 shrink-0 rounded-[2px]",
                            isActive
                              ? "bg-primary"
                              : "border-[1.5px] border-[#b5b1a8]"
                          )}
                        />
                        <span>{item.label}</span>
                        {item.href === "/chores" ? (
                          <span className="ml-auto font-mono text-[11px] font-medium text-muted-foreground">
                            {openChoreCount}
                          </span>
                        ) : null}
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                )
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="px-3.5 pb-5">
        <div className="flex items-center gap-2.5 border-t border-border p-2.5">
          <UserButton
            appearance={{ elements: { avatarBox: "!size-8" } }}
          />
          <div className="flex min-w-0 flex-col">
            <span className="truncate text-[13px] font-semibold text-foreground">
              {identity?.name ?? "User"}
            </span>
            <span className="truncate text-xs text-muted-foreground">
              {identity?.email ?? "No Email"}
            </span>
          </div>
        </div>
      </SidebarFooter>
    </Sidebar>
  )
}
