'use client';

import { ReactNode, useState, useEffect } from 'react';
import { Sidebar } from './Sidebar';
import { Moon, Sun, Bell, Wifi, WifiOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { motion, AnimatePresence } from 'framer-motion';
import { useAgentStore } from '@/lib/store';

interface DashboardLayoutProps {
    children: ReactNode;
}

interface Particle {
    id: number;
    left: number;
    delay: number;
    duration: number;
    size: number;
    color: string;
}

// Extraordinary cosmic background with floating orbs and effects
function CosmicBackground() {
    return (
        <>
            {/* Base cosmic gradient */}
            <div className="cosmic-bg" />

            {/* Animated orbs */}
            <div className="orb orb-1" />
            <div className="orb orb-2" />
            <div className="orb orb-3" />

            {/* Mesh grid overlay */}
            <div className="mesh-grid" />
        </>
    );
}

// Floating particles - client only
function FloatingParticles() {
    const [particles, setParticles] = useState<Particle[]>([]);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        const generated = Array.from({ length: 15 }, (_, i) => ({
            id: i,
            left: Math.random() * 100,
            delay: Math.random() * 15,
            duration: 20 + Math.random() * 25,
            size: 2 + Math.random() * 3,
            color: i % 3 === 0 ? 'rgba(255, 59, 59, 0.5)' : i % 3 === 1 ? 'rgba(0, 119, 181, 0.5)' : 'rgba(139, 92, 246, 0.4)'
        }));
        setParticles(generated);
        setMounted(true);
    }, []);

    if (!mounted) return null;

    return (
        <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
            {particles.map((p) => (
                <div
                    key={p.id}
                    className="particle"
                    style={{
                        left: `${p.left}%`,
                        width: p.size,
                        height: p.size,
                        background: p.color,
                        boxShadow: `0 0 ${p.size * 3}px ${p.color}`,
                        animationDelay: `${p.delay}s`,
                        animationDuration: `${p.duration}s`
                    }}
                />
            ))}
        </div>
    );
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
    const [isDark, setIsDark] = useState(true);
    const [sidebarWidth, setSidebarWidth] = useState(260);
    const [isMobile, setIsMobile] = useState(false);
    const { isConnected, syncStatus } = useAgentStore();
    const [notifications] = useState(3);

    useEffect(() => {
        document.documentElement.classList.add('dark');
    }, []);

    useEffect(() => {
        syncStatus();
        const interval = setInterval(syncStatus, 5000);
        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        const checkMobile = () => {
            setIsMobile(window.innerWidth < 768);
            if (window.innerWidth < 768) {
                setSidebarWidth(0);
            }
        };
        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    useEffect(() => {
        if (isMobile) return;

        const sidebar = document.querySelector('aside');
        if (!sidebar) return;

        const observer = new ResizeObserver((entries) => {
            for (const entry of entries) {
                setSidebarWidth(entry.contentRect.width);
            }
        });

        observer.observe(sidebar);
        return () => observer.disconnect();
    }, [isMobile]);

    return (
        <div className="min-h-screen bg-background relative">
            {/* Extraordinary cosmic background */}
            <CosmicBackground />
            <FloatingParticles />

            {/* Sidebar - hidden on mobile */}
            {!isMobile && <Sidebar />}

            <main
                className="transition-all duration-300 ease-out relative z-10 min-h-screen"
                style={{ marginLeft: isMobile ? 0 : sidebarWidth }}
            >
                {/* Enhanced Top Bar */}
                <header className="sticky top-0 z-30 flex h-14 md:h-16 items-center justify-between border-b border-border/50 bg-background/60 backdrop-blur-xl px-4 md:px-6">
                    <div className="flex items-center gap-2 md:gap-4">
                        {/* Mobile menu button */}
                        {isMobile && (
                            <button className="p-2 hover:bg-accent rounded-lg">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                                </svg>
                            </button>
                        )}

                        <motion.h1
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="text-sm md:text-lg font-semibold truncate"
                        >
                            {isMobile ? 'Dashboard' : 'LinkedIn Automation Dashboard'}
                        </motion.h1>

                        {/* Connection status */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className={`hidden sm:flex items-center gap-1.5 px-2 md:px-3 py-1 rounded-full text-xs font-medium ${isConnected
                                    ? 'bg-green-500/10 text-green-500'
                                    : 'bg-red-500/10 text-red-500'
                                }`}
                        >
                            {isConnected ? <Wifi className="w-3 h-3" /> : <WifiOff className="w-3 h-3" />}
                            <span className="hidden md:inline">{isConnected ? 'Connected' : 'Disconnected'}</span>
                        </motion.div>
                    </div>

                    <div className="flex items-center gap-2 md:gap-3">
                        <Button
                            variant="ghost"
                            size="icon"
                            className="rounded-full relative w-9 h-9"
                        >
                            <Bell className="h-4 w-4 md:h-5 md:w-5 text-muted-foreground" />
                            {notifications > 0 && <span className="notification-dot" />}
                        </Button>

                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => setIsDark(!isDark)}
                            className="rounded-full w-9 h-9"
                        >
                            <AnimatePresence mode="wait">
                                {isDark ? (
                                    <motion.div key="sun" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }} transition={{ duration: 0.2 }}>
                                        <Sun className="h-4 w-4 md:h-5 md:w-5 text-muted-foreground" />
                                    </motion.div>
                                ) : (
                                    <motion.div key="moon" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }} transition={{ duration: 0.2 }}>
                                        <Moon className="h-4 w-4 md:h-5 md:w-5 text-muted-foreground" />
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </Button>
                    </div>
                </header>

                {/* Page Content */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                    className="p-4 md:p-6"
                >
                    {children}
                </motion.div>
            </main>
        </div>
    );
}
