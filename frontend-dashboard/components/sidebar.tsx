"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
    LayoutDashboard,
    MonitorPlay,
    Users,
    Settings,
    ChevronLeft,
    ChevronRight,
} from "lucide-react";
import { useState } from "react";
import { motion } from "framer-motion";

const sidebarItems = [
    {
        title: "Dashboard",
        href: "/",
        icon: LayoutDashboard,
    },
    {
        title: "Live Agent",
        href: "/live-view",
        icon: MonitorPlay,
    },
    {
        title: "Lead Intelligence",
        href: "/leads",
        icon: Users,
    },
    {
        title: "Settings",
        href: "/settings",
        icon: Settings,
    },
];

export function Sidebar() {
    const pathname = usePathname();
    const [isCollapsed, setIsCollapsed] = useState(false);

    return (
        <motion.div
            className={cn(
                "relative flex flex-col border-r bg-slate-900 text-slate-100 h-screen transition-all duration-300 ease-in-out",
                isCollapsed ? "w-[80px]" : "w-[280px]"
            )}
            initial={false}
            animate={{ width: isCollapsed ? 80 : 280 }}
        >
            {/* Header */}
            <div className="flex h-16 items-center justify-center border-b border-slate-800">
                <div className={cn("flex items-center gap-2", isCollapsed ? "justify-center" : "px-6 w-full")}>
                    {!isCollapsed && (
                        <div className="font-bold text-xl tracking-tight">
                            <span className="text-white">TSI</span>
                            <span className="text-[#ff3b3b]">Automations</span>
                        </div>
                    )}
                    {isCollapsed && (
                        <span className="text-[#ff3b3b] font-bold text-xl">TSI</span>
                    )}
                </div>
            </div>

            {/* Navigation */}
            <div className="flex-1 flex flex-col gap-2 p-4">
                {sidebarItems.map((item) => {
                    const isActive = pathname === item.href;
                    const Icon = item.icon;

                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={cn(
                                "flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium transition-colors hover:bg-slate-800",
                                isActive
                                    ? "bg-slate-800 text-[#ff3b3b]"
                                    : "text-slate-400 hover:text-slate-100",
                                isCollapsed && "justify-center px-2"
                            )}
                        >
                            <Icon className={cn("h-5 w-5", isActive && "text-[#ff3b3b]")} />
                            {!isCollapsed && <span>{item.title}</span>}
                        </Link>
                    );
                })}
            </div>

            {/* Toggle Button */}
            <button
                onClick={() => setIsCollapsed(!isCollapsed)}
                className="absolute -right-3 top-20 z-50 rounded-full border border-slate-700 bg-slate-800 p-1.5 text-slate-400 hover:text-white focus:outline-none"
            >
                {isCollapsed ? (
                    <ChevronRight className="h-4 w-4" />
                ) : (
                    <ChevronLeft className="h-4 w-4" />
                )}
            </button>
        </motion.div>
    );
}
