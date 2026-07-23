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
  SidebarSeparator,
} from "@/components/ui/sidebar"
import { OrganizationSwitcher, UserButton } from "@clerk/nextjs"
import { LayoutDashboard, SquareCheckBig } from "lucide-react"
import Link from "next/link"

type AppSidebarProps = {
  identity: { name: string; email: string } | null
}

export function AppSidebar({ identity }: AppSidebarProps) {
  return (
    <Sidebar>
      <SidebarHeader className="items-center border-b p-4">
        <OrganizationSwitcher
          hidePersonal={true}
          appearance={{
            elements: {
              organizationSwitcherTrigger: `
                !w-54 !h-12 !px-4 !justify-between
                !bg-white !hover:bg-blue-900
                text-gray-900 border border-gray-200
                rounded-md shadow-sm transition-colors
            `,
              organizationPreviewMainIdentifier: "!font-bold !text-md",
              organizationSwitcherTriggerIcon: "!w-5 !h-5",
              organizationSwitcherPopoverCard:
                "shadow-lg border border-gray-200 rounded-lg",
            },
          }}
        />
      </SidebarHeader>
      <SidebarContent className="px-2">
        <SidebarGroup />
        <SidebarGroupLabel>Navigation</SidebarGroupLabel>
        <SidebarGroupContent>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton asChild>
                <Link href="/dashboard">
                  <LayoutDashboard />
                  <span>Dashboard</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroupContent>
        <SidebarGroup />
        <SidebarGroup />
        <SidebarGroupLabel>Daily Life</SidebarGroupLabel>
        <SidebarGroupContent>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton asChild>
                <Link href="/chores">
                  <SquareCheckBig />
                  <span>Chores</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroupContent>
        <SidebarGroup />
        <SidebarGroup />
        <SidebarGroupLabel>Finances</SidebarGroupLabel>
        <SidebarGroupContent>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton asChild>
                <Link href="/expenses">
                  <SquareCheckBig />
                  <span>Expenses</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroupContent>
        <SidebarGroup />
      </SidebarContent>

      <SidebarFooter>
        <div className="flex items-center gap-4">
          <UserButton />
          <div className="flex flex-col">
            <span className="text-xs font-bold">
              {identity?.name ?? "User"}
            </span>
            <span className="text-xs text-sidebar-foreground/70">
              {identity?.email ?? "No Email"}
            </span>
          </div>
        </div>
      </SidebarFooter>
    </Sidebar>
  )
}
