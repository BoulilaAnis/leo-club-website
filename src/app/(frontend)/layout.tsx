import React from "react";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { getMemberUser } from "@/lib/auth";
import Nav from "@/components/nav";
import { ThemeProvider } from "@/components/ui/theme-provider";
import "./styles.css";

export const metadata = {
  description: "Leo Club Klibia - Leadership, Experience, Opportunity",
  title: "Leo Club Klibia",
};

export default async function RootLayout(props: { children: React.ReactNode }) {
  const { children } = props;
  const user = await getMemberUser();

  return (
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-screen overflow-x-hidden bg-background text-foreground antialiased">
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <Nav user={user} />
          <main>{children}</main>
        </ThemeProvider>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
