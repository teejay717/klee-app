import { Geist, Geist_Mono } from "next/font/google";
import {
  ClerkProvider,
  Show,
  SignInButton,
  SignUpButton,
  UserButton,
  OrganizationSwitcher,
} from "@clerk/nextjs";
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/AppSidebar";

import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { cn } from "@/lib/utils";
import { TooltipProvider } from "@/components/ui/tooltip";
import { currentUser } from "@clerk/nextjs/server";
import { auth } from "@clerk/nextjs/server";
import { clerkClient } from "@clerk/nextjs/server";
import { ApartmentProvider } from "@/context/ApartmentContext";

const geist = Geist({ subsets: ["latin"], variable: "--font-sans" });

const fontMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
});

type SidebarIdentity = {
  name: string,
  email: string
} | null

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  const user = await currentUser();

  const sidebarIdentity: SidebarIdentity = user ? {
    name: user.fullName ?? user.username ?? user.firstName ?? "User",
    email:
      user.primaryEmailAddress?.emailAddress ??
      user.emailAddresses?.[0]?.emailAddress ??
      "No Email",
  } : null;

  const { userId, orgId } = await auth();

    const client = await clerkClient();

  // fetch members
    const memberships = orgId ? await client.organizations.getOrganizationMembershipList({ 
    organizationId: orgId,
    limit: 100,}) : { data: [], totalCount: 0 };

    const members = memberships.data.map((membership) => {
    const user = membership.publicUserData;

    if (!user?.userId) return null;

    const fullName = [user.firstName, user.lastName].filter(Boolean).join(" ").trim();
    const initials = [user.firstName?.charAt(0), user.lastName?.charAt(0)].filter(Boolean).join("").toUpperCase();

    return {
        userId: user.userId,
        label: fullName || user.identifier || "Unknown Member",
        initials: initials
    }
}).filter((m): m is { userId: string; label: string; initials: string } => m !== null);

  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={cn("light", "antialiased", fontMono.variable, "font-sans", geist.variable)}
    >
      <body>
        <ClerkProvider>
          <TooltipProvider>
            <ThemeProvider>
              <header className="flex items-center justify-end gap-3 border-b">
                <Show when="signed-out">
                  <SignInButton />
                  <SignUpButton />
                </Show>
                <Show when="signed-in">
                  <ApartmentProvider members={members} userId={userId}>
                    <SidebarProvider>
                      <AppSidebar identity={sidebarIdentity}/>
                        <SidebarInset >
                          <div className="p-4">
                            {children}
                          </div>
                      </SidebarInset>
                    </SidebarProvider>
                  </ApartmentProvider>
                </Show>
              </header>
            </ThemeProvider>
          </TooltipProvider>
        </ClerkProvider>
      </body>
    </html>
  );
}