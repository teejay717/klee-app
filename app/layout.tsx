import { Geist, Geist_Mono } from "next/font/google";
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
import { currentUser } from "@clerk/nextjs/server";
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

  // fetch members

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
              
              {/* Signed Out View - No longer trapped in a flex header */}
              <Show when="signed-out">
                {children}
              </Show>

              {/* Signed In View */}
              <Show when="signed-in">
                <ApartmentProvider>
                  <SidebarProvider>
                    <AppSidebar identity={sidebarIdentity}/>
                    <SidebarInset>
                      <div className="p-4">
                        {children}
                      </div>
                    </SidebarInset>
                  </SidebarProvider>
                </ApartmentProvider>
              </Show>

            </ThemeProvider>
          </TooltipProvider>
        </ClerkProvider>
      </body>
    </html>
  );
}