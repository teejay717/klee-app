import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
    SidebarHeader,
    SidebarSeparator
} from "@/components/ui/sidebar"
import { OrganizationSwitcher, UserButton } from "@clerk/nextjs"

type AppSidebarProps = {
    identity: { name: string; email: string } | null;
}

export function AppSidebar({identity}: AppSidebarProps) {
    return (
    <Sidebar>
    <SidebarHeader className="border-b p-4">
        <OrganizationSwitcher 
            hidePersonal={true} // Hides personal account so they MUST pick an apartment
            afterCreateOrganizationUrl="/" 
            afterSelectOrganizationUrl="/"
        />
    </SidebarHeader>
    <SidebarContent>
        <SidebarGroup />

        <SidebarGroup />
    </SidebarContent>

    <SidebarSeparator />
    <SidebarFooter>
    <div className="flex items-center gap-4 px-2">
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