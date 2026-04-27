import { Geist, Geist_Mono } from "next/font/google";
import {
  ClerkProvider,
  Show,
  SignInButton,
  SignUpButton,
  UserButton,
  OrganizationSwitcher,
} from "@clerk/nextjs";

import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { cn } from "@/lib/utils";

const geist = Geist({ subsets: ["latin"], variable: "--font-sans" });

const fontMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={cn("antialiased", fontMono.variable, "font-sans", geist.variable)}
    >
      <body>
        <ClerkProvider>
          <ThemeProvider>
            <header className="flex items-center justify-end gap-3 border-b p-4">
              <Show when="signed-out">
                <SignInButton />
                <SignUpButton />
              </Show>
              <Show when="signed-in">
                <OrganizationSwitcher 
                    hidePersonal={true} // Hides personal account so they MUST pick an apartment
                    afterCreateOrganizationUrl="/" 
                    afterSelectOrganizationUrl="/"
                  />
                <UserButton />
              </Show>
            </header>
            <Show when="signed-in">
              {children}
            </Show> 
          </ThemeProvider>
        </ClerkProvider>
      </body>
    </html>
  );
}