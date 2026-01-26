"use client";

import { usePathname } from "next/navigation";
import { Sidebar } from "@/components/sidebar";

export function LayoutWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isWelcomePage = pathname === "/";
  const isPricingPage = pathname === "/pricing";

  if (isWelcomePage || isPricingPage) {
    return <>{children}</>;
  }

  return (
    <div className="flex h-screen w-full relative z-10 font-sans">
      <Sidebar />
      <main className="flex-1 overflow-y-auto scrollbar-thin">
        {children}
      </main>
    </div>
  );
}


