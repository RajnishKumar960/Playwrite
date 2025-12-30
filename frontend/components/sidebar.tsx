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
    BarChart3,
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
        title: "Analytics",
        href: "/analytics",
        icon: BarChart3,
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
                "relative flex flex-col border-r border-white/10 bg-black/40 backdrop-blur-xl h-screen transition-all duration-300 ease-in-out z-50",
                isCollapsed ? "w-[80px]" : "w-[280px]"
            )}
            initial={false}
            animate={{ width: isCollapsed ? 80 : 280 }}
        >
            {/* Header */}
            <div className="flex h-20 items-center justify-center border-b border-white/10 bg-white/5">
                <div className={cn("flex items-center gap-2", isCollapsed ? "justify-center" : "px-6 w-full")}>
                    {!isCollapsed && (
                        <div className="font-bold text-xl tracking-tight flex items-center gap-2">
                            <div className="w-8 h-8 rounded-lg bg-linear-to-br from-cyan-400 to-blue-600 flex items-center justify-center shadow-lg shadow-cyan-500/20">
                                <span className="text-white font-bold text-lg">T</span>
                            </div>
                            <div className="flex flex-col leading-none">
                                <span className="text-white text-lg">TSI</span>
                                <span className="text-cyan-400 text-xs tracking-wider uppercase">Automations</span>
                            </div>
                        </div>
                    )}
                    {isCollapsed && (
                        <div className="w-10 h-10 rounded-lg bg-linear-to-br from-cyan-400 to-blue-600 flex items-center justify-center shadow-lg shadow-cyan-500/20">
                            <span className="text-white font-bold text-xl">T</span>
                        </div>
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
                                "flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-all duration-200 group relative overflow-hidden",
                                isActive
                                    ? "bg-linear-to-r from-cyan-500/20 to-blue-500/5 text-cyan-400 shadow-[0_0_15px_rgba(6,182,212,0.15)] border border-cyan-500/20"
                                    : "text-slate-400 hover:text-slate-100 hover:bg-white/5 border border-transparent",
                                isCollapsed && "justify-center px-2"
                            )}
                        >
                            {isActive && <div className="absolute left-0 top-0 bottom-0 w-1 bg-cyan-400 shadow-[0_0_10px_#22d3ee]" />}
                            <Icon className={cn("h-5 w-5 transition-transform group-hover:scale-110", isActive && "text-cyan-400")} />
                            {!isCollapsed && <span>{item.title}</span>}
                        </Link>
                    );
                })}
            </div>

            {/* Toggle Button */}
            <button
                onClick={() => setIsCollapsed(!isCollapsed)}
                className="absolute -right-3 top-24 z-50 rounded-full border border-white/20 bg-black/80 backdrop-blur text-slate-400 hover:text-white hover:border-cyan-400 p-1.5 focus:outline-none transition-all shadow-lg"
            >
                {isCollapsed ? (
                    <ChevronRight className="h-3 w-3" />
                ) : (
                    <ChevronLeft className="h-3 w-3" />
                )}
            </button>

            {/* Footer / User */}
            {!isCollapsed && (
                <div className="p-4 border-t border-white/10 bg-white/5">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-linear-to-br from-purple-500 to-pink-500 border border-white/20 shadow-inner"></div>
                        <div className="flex flex-col">
                            <span className="text-sm font-medium text-white">Admin User</span>
                            <span className="text-xs text-slate-500">Pro License</span>
                        </div>
                    </div>
                </div>
            )}
        </motion.div>
    );
}
