import React from "react";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { getMemberUser } from "@/lib/auth";
import Nav from "@/components/nav";
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
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                var theme = localStorage.getItem('theme');
                if (!theme) {
                  theme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
                }
                if (theme === 'dark') {
                  document.documentElement.classList.add('dark');
                }
              })();
            `,
          }}
        />
      </head>
      <body className="min-h-screen overflow-x-hidden bg-background text-foreground antialiased">
        <Nav user={user} />
        <main>{children}</main>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
