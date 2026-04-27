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

  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={cn("antialiased", fontMono.variable, "font-sans", geist.variable)}
    >
      <body>
        <ClerkProvider>
          <TooltipProvider>
            <ThemeProvider>
              <header className="flex items-center justify-end gap-3 border-b p-4">
                <Show when="signed-out">
                  <SignInButton />
                  <SignUpButton />
                </Show>
                <Show when="signed-in">
                  <SidebarProvider>
                    <AppSidebar identity={sidebarIdentity}/>
                      <SidebarInset>
                        <header className="border-b p-2">
                          <SidebarTrigger />
                        </header>
                        <div className="p-4">
                          {children}
                        </div>
                    </SidebarInset>
                  </SidebarProvider>
                </Show>
              </header>
            </ThemeProvider>
          </TooltipProvider>
        </ClerkProvider>
      </body>
    </html>
  );
}