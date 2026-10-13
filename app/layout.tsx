import { Hanken_Grotesk, JetBrains_Mono } from "next/font/google";
import {
  ClerkProvider,
  Show,
} from "@clerk/nextjs";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/AppSidebar";

import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { cn } from "@/lib/utils";
import { TooltipProvider } from "@/components/ui/tooltip";
import { auth, currentUser } from "@clerk/nextjs/server";
import { ApartmentProvider } from "@/context/ApartmentContext";
import { Toaster } from "@/components/ui/sonner";
import { db } from "@/db";
import { chores } from "@/db/schema";
import { and, count, eq, isNull } from "drizzle-orm";

const fontSans = Hanken_Grotesk({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-sans",
});

const fontMono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["500"],
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

  const { orgId } = await auth();
  const user = await currentUser();

  const sidebarIdentity: SidebarIdentity = user ? {
    name: user.fullName ?? user.username ?? user.firstName ?? "User",
    email:
      user.primaryEmailAddress?.emailAddress ??
      user.emailAddresses?.[0]?.emailAddress ??
      "No Email",
  } : null;

  // open chore count for the sidebar badge
  const [openChores] = orgId
    ? await db
        .select({ value: count() })
        .from(chores)
        .where(
          and(
            eq(chores.apartmentId, orgId),
            eq(chores.isCompleted, false),
            isNull(chores.deletedAt)
          )
        )
    : [{ value: 0 }]

  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={cn("light", "antialiased", fontMono.variable, "font-sans", fontSans.variable)}
    >
      <body>
        <ClerkProvider>
          <TooltipProvider>
            <ThemeProvider>
              
              {/* Signed Out View - No longer trapped in a flex header */}
              <Show when="signed-out">
                {children}
              </Show>

              {/* Signed In View */}
              <Show when="signed-in">
          {/* If they are signed in but haven't selected an apartment, just show the page (SelectApartment) */}
          {!orgId ? (
            <main className="min-h-screen">
               {children}
            </main>
          ) : (
            /* Standard Dashboard View with Sidebar */
            <ApartmentProvider>
              <SidebarProvider
                style={{ "--sidebar-width": "232px" } as React.CSSProperties}
              >
                <AppSidebar
                  identity={sidebarIdentity}
                  openChoreCount={openChores?.value ?? 0}
                />
                <SidebarInset>
                  <div className="px-4 py-6 md:px-11 md:py-9">
                    {children}
                  </div>
                </SidebarInset>
              </SidebarProvider>
            </ApartmentProvider>
          )}
        </Show>

            </ThemeProvider>
          </TooltipProvider>
        </ClerkProvider>
        <Toaster position="bottom-right" />
      </body>
    </html>
  );
}
