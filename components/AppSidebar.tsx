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
import { LayoutDashboard } from "lucide-react"
import Link from "next/link"

type AppSidebarProps = {
    identity: { name: string; email: string } | null;
}

export function AppSidebar({identity}: AppSidebarProps) {
    return (
    <Sidebar>
    <SidebarHeader className="border-b p-4">
        <OrganizationSwitcher 
    hidePersonal={true}
    afterCreateOrganizationUrl="/" 
    afterSelectOrganizationUrl="/"
    appearance={{
        elements: {
            organizationSwitcherTrigger: `
                px-2 py-1 
                bg-transparent hover:bg-gray-100
                rounded-md
                border-none
                font-medium text-sm
            `,
            organizationSwitcherPopoverCard: "shadow-lg border border-gray-200 rounded-lg",
        }
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
    </SidebarContent>

        <SidebarFooter>
        <div className="flex items-center gap-4">
            <UserButton />
            <div className="flex flex-col">
                <span className="text-xs font-bold">{identity?.name ?? "User"}</span>
                <span className="text-xs text-sidebar-foreground/70">{identity?.email ?? "No Email"}</span>
            </div>
            </div>
        </SidebarFooter>
    </Sidebar>
    )
}