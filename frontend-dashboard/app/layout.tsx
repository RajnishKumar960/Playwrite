import type { Metadata } from "next";
import React from "react";
import { Inter } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";
import "./globals.css";
import { LayoutWrapper } from "@/components/layout-wrapper";
import { cn } from "@/lib/utils";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "TSI Automations | The Sales Inc.",
  description: "Advanced LinkedIn Automation Dashboard",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider
      appearance={{
        elements: {
          rootBox: "mx-auto",
          card: "bg-slate-900 border border-slate-800",
          headerTitle: "text-white",
          headerSubtitle: "text-slate-400",
          socialButtonsBlockButton: "border-slate-700 hover:bg-slate-800 text-white",
          formButtonPrimary: "bg-cyan-500 hover:bg-cyan-600",
          formFieldInput: "bg-slate-800 border-slate-700 text-white",
          formFieldLabel: "text-slate-300",
          footerActionLink: "text-cyan-400 hover:text-cyan-300",
        },
      }}
      signInUrl="/"
      signUpUrl="/"
      afterSignInUrl="/pricing"
      afterSignUpUrl="/pricing"
    >
      <html lang="en">
        <body className={cn(inter.className, "bg-black text-slate-100")}>
          {/* Cosmic Background */}
          <div className="cosmic-bg">
            <div className="orb orb-1" />
            <div className="orb orb-2" />
            <div className="orb orb-3" />
            <div className="mesh-grid" />
          </div>
          <LayoutWrapper>{children}</LayoutWrapper>
        </body>
      </html>
    </ClerkProvider>
  );
}
