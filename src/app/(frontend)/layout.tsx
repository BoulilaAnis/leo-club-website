import React from "react";
import { Analytics } from "@vercel/analytics/next";
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
    <html lang="en">
      <body className="min-h-screen bg-background text-foreground antialiased">
        <Nav user={user} />
        <main>{children}</main>
        <Analytics />
      </body>
    </html>
  );
}
