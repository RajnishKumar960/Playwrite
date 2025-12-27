'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    LayoutDashboard,
    MonitorPlay,
    Users,
    Settings,
    ChevronLeft,
    ChevronRight,
    Zap,
    UserPlus,
    Shield,
    ShieldAlert
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

interface NavItem {
    title: string;
    href: string;
    icon: any;
    badge?: string;
}

const navItems: NavItem[] = [
    { title: 'Dashboard', href: '/', icon: LayoutDashboard },
    { title: 'Live Agent', href: '/live-view', icon: MonitorPlay, badge: 'Live' },
    { title: 'Lead CRM', href: '/leads', icon: Users },
    { title: 'Neural Intel', href: '/pain-points', icon: Zap },
    { title: 'Networking', href: '/connections', icon: UserPlus },
    { title: 'Safety Hub', href: '/safety', icon: ShieldAlert },
    { title: 'Settings', href: '/settings', icon: Settings },
];

export function Sidebar() {
    const [collapsed, setCollapsed] = useState(false);
    const pathname = usePathname();

    return (
        <motion.aside
            initial={false}
            animate={{ width: collapsed ? 72 : 260 }}
            transition={{ duration: 0.2, ease: 'easeInOut' }}
            className={cn(
                'fixed left-0 top-0 z-40 h-screen',
                'bg-sidebar border-r border-sidebar-border',
                'flex flex-col'
            )}
        >
            {/* Logo */}
            <div className="flex h-16 items-center justify-between px-4">
                <AnimatePresence mode="wait">
                    {!collapsed && (
                        <motion.div
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -10 }}
                            className="flex items-center gap-2"
                        >
                            <div className="flex h-9 w-9 items-center justify-center rounded-lg gradient-tsi">
                                <Zap className="h-5 w-5 text-white" />
                            </div>
                            <div className="flex flex-col">
                                <span className="text-sm font-bold text-foreground">TSI Automations</span>
                                <span className="text-xs text-muted-foreground">The Sales Inc.</span>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {collapsed && (
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg gradient-tsi mx-auto">
                        <Zap className="h-5 w-5 text-white" />
                    </div>
                )}
            </div>

            <div className="h-px bg-border" />

            {/* Navigation */}
            <nav className="flex-1 space-y-1 p-2 pt-4">
                {navItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = pathname === item.href;

                    return (
                        <Link key={item.href} href={item.href}>
                            <motion.div
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                className={cn(
                                    'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors',
                                    isActive
                                        ? 'bg-primary text-primary-foreground'
                                        : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground',
                                    collapsed && 'justify-center px-2'
                                )}
                            >
                                <Icon className={cn('h-5 w-5 shrink-0', isActive && 'text-white')} />

                                <AnimatePresence mode="wait">
                                    {!collapsed && (
                                        <motion.span
                                            initial={{ opacity: 0, width: 0 }}
                                            animate={{ opacity: 1, width: 'auto' }}
                                            exit={{ opacity: 0, width: 0 }}
                                            className="flex-1 truncate"
                                        >
                                            {item.title}
                                        </motion.span>
                                    )}
                                </AnimatePresence>

                                {!collapsed && item.badge && (
                                    <motion.span
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        className={cn(
                                            'rounded-full px-2 py-0.5 text-xs font-semibold',
                                            isActive
                                                ? 'bg-white/20 text-white'
                                                : 'bg-primary/10 text-primary'
                                        )}
                                    >
                                        {item.badge}
                                    </motion.span>
                                )}
                            </motion.div>
                        </Link>
                    );
                })}
            </nav>

            {/* Collapse Toggle */}
            <div className="p-2">
                <div className="h-px bg-border mb-2" />
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setCollapsed(!collapsed)}
                    className={cn('w-full justify-center', !collapsed && 'justify-start')}
                >
                    {collapsed ? (
                        <ChevronRight className="h-4 w-4" />
                    ) : (
                        <>
                            <ChevronLeft className="h-4 w-4 mr-2" />
                            <span>Collapse</span>
                        </>
                    )}
                </Button>
            </div>
        </motion.aside>
    );
}
