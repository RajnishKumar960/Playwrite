"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { Eye, Monitor, Wifi, Radio, Globe, Shield } from 'lucide-react';

export default function LiveViewPage() {
    return (
        <div className="min-h-screen p-6 space-y-6">
            <div className="flex justify-between items-end">
                <div>
                    <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-linear-to-r from-pink-400 to-purple-400">
                        Live View
                    </h1>
                    <p className="text-gray-400 mt-1">Real-time browser session monitoring.</p>
                </div>
                <div className="flex items-center gap-2 text-red-500 animate-pulse bg-red-500/10 px-3 py-1 rounded-full border border-red-500/20">
                    <Radio size={16} />
                    <span className="text-xs font-bold uppercase tracking-wider">Live Feed Active</span>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[calc(100vh-200px)]">
                {/* Main Browser Window */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
                    className="lg:col-span-2 glass-card rounded-xl border border-white/5 flex flex-col overflow-hidden relative group"
                >
                    {/* Fake Browser Toolbar */}
                    <div className="h-10 bg-black/40 border-b border-white/10 flex items-center px-4 gap-4">
                        <div className="flex gap-1.5">
                            <div className="w-3 h-3 rounded-full bg-red-500/50" />
                            <div className="w-3 h-3 rounded-full bg-yellow-500/50" />
                            <div className="w-3 h-3 rounded-full bg-green-500/50" />
                        </div>
                        <div className="flex-1 bg-white/5 rounded-md h-6 flex items-center px-3 text-xs text-gray-500 font-mono">
                            <Globe size={12} className="mr-2 opacity-50" />
                            linkedin.com/in/target-profile
                        </div>
                    </div>

                    {/* Viewport content */}
                    <div className="flex-1 bg-black/80 relative flex items-center justify-center">
                        <div className="text-center space-y-4">
                            <div className="w-20 h-20 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto" />
                            <p className="text-blue-400 font-mono text-sm">Waiting for agent stream...</p>
                        </div>

                        {/* Overlay Info */}
                        <div className="absolute top-4 right-4 bg-black/60 backdrop-blur px-3 py-1.5 rounded-lg border border-white/10 text-xs font-mono text-gray-300">
                            <div className="flex items-center gap-2">
                                <Wifi size={12} className="text-green-500" />
                                <span>Latecy: 24ms</span>
                            </div>
                        </div>
                    </div>
                </motion.div>

                {/* Sidebar Stats */}
                <div className="space-y-6">
                    <motion.div
                        initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }}
                        className="glass-card p-6 rounded-xl border border-white/5"
                    >
                        <h3 className="text-lg font-bold text-gray-100 mb-4 flex items-center gap-2">
                            <Monitor size={18} className="text-purple-400" /> Session Info
                        </h3>
                        <div className="space-y-4 text-sm">
                            <div className="flex justify-between py-2 border-b border-white/5">
                                <span className="text-gray-400">Agent ID</span>
                                <span className="text-gray-200 font-mono">AG-8829</span>
                            </div>
                            <div className="flex justify-between py-2 border-b border-white/5">
                                <span className="text-gray-400">Browser</span>
                                <span className="text-gray-200">Chrome Headless</span>
                            </div>
                            <div className="flex justify-between py-2 border-b border-white/5">
                                <span className="text-gray-400">Duration</span>
                                <span className="text-gray-200 font-mono">00:12:45</span>
                            </div>
                            <div className="flex justify-between py-2 border-b border-white/5">
                                <span className="text-gray-400">Security</span>
                                <span className="text-green-400 flex items-center gap-1"><Shield size={12} /> Secure</span>
                            </div>
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}
                        className="glass-card p-6 rounded-xl border border-white/5 flex flex-col gap-4"
                    >
                        <h3 className="text-lg font-bold text-gray-100 flex items-center gap-2">
                            <Eye size={18} className="text-blue-400" /> Live Logs
                        </h3>
                        <div className="font-mono text-xs text-gray-400 space-y-2 h-48 overflow-y-auto scrollbar-thin">
                            <p><span className="text-gray-600">[10:01]</span> Navigating to feed...</p>
                            <p><span className="text-gray-600">[10:01]</span> Found 3 new posts.</p>
                            <p><span className="text-gray-600">[10:02]</span> Scrolling...</p>
                            <p><span className="text-gray-600">[10:02]</span> Analyzing text content...</p>
                            <p><span className="text-gray-600">[10:03]</span> Human behavior jitter applied.</p>
                            <p><span className="text-gray-600">[10:03]</span> <span className="text-green-400">Action recorded.</span></p>
                        </div>
                    </motion.div>
                </div>
            </div>
        </div>
    );
}
