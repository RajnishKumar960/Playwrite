"use client";

import React, { useState, useEffect, useRef } from 'react';
import { Terminal, Play, Square, AlertTriangle, Cpu, Command } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAgentStore } from '@/lib/store';
import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';

export default function LiveCommandPage() {
    const scrollRef = useRef<HTMLDivElement>(null);
    const [selectedAgent, setSelectedAgent] = useState<string>('feedWarmer');

    // Get agent store
    const { agentStatus, logs, startAgent, stopAgent, syncLogs, syncStatus } = useAgentStore();

    // Sync on mount and periodically
    useEffect(() => {
        syncStatus();
        syncLogs();
        const interval = setInterval(() => {
            syncStatus();
            syncLogs();
        }, 3000); // Sync every 3 seconds
        return () => clearInterval(interval);
    }, [syncStatus, syncLogs]);

    // Auto scroll logs
    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [logs]);

    const isRunning = agentStatus[selectedAgent] === 'running';

    const toggleAgent = async () => {
        if (isRunning) {
            await stopAgent(selectedAgent);
        } else {
            await startAgent(selectedAgent);
        }
    };

    return (
        <div className="min-h-screen p-6 space-y-6">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-linear-to-r from-emerald-400 to-cyan-400">
                    Live Command Center
                </h1>
                <p className="text-gray-400 mt-1">Direct agent control and real-time execution logs.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[calc(100vh-200px)]">

                {/* Control Panel */}
                <motion.div
                    initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}
                    className="glass-card p-6 rounded-xl border border-white/5 flex flex-col gap-6"
                >
                    <div className="flex items-center gap-3 mb-2">
                        <Cpu size={24} className="text-gray-300" />
                        <h2 className="text-xl font-bold text-gray-100">Agent Control</h2>
                    </div>

                    <div className="p-4 rounded-xl bg-white/5 border border-white/10 space-y-4">
                        <div className="flex justify-between items-center">
                            <span className="text-gray-300 font-medium">Status</span>
                            <div className={`flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold ${isRunning
                                ? 'bg-green-500/20 text-green-400 border border-green-500/30'
                                : 'bg-red-500/20 text-red-400 border border-red-500/30'
                                }`}>
                                {isRunning ? (
                                    <>
                                        <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                                        RUNNING
                                    </>
                                ) : (
                                    'STOPPED'
                                )}
                            </div>
                        </div>

                        <button
                            onClick={toggleAgent}
                            className={`w-full py-4 rounded-xl font-bold text-lg flex items-center justify-center gap-3 transition-all shadow-lg ${isRunning
                                ? 'bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/30 shadow-red-900/10'
                                : 'bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 shadow-emerald-900/10'
                                }`}
                        >
                            {isRunning ? <Square fill="currentColor" size={20} /> : <Play fill="currentColor" size={20} />}
                            {isRunning ? "STOP AGENT" : "START AGENT"}
                        </button>
                    </div>

                    <div className="space-y-4">
                        <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider">Configuration</h3>

                        <div className="space-y-2">
                            <label className="text-sm text-gray-300">Target Mode</label>
                            <select className="w-full bg-black/40 border border-white/10 rounded-lg p-2.5 text-sm text-gray-200 focus:ring-1 focus:ring-emerald-500 outline-none">
                                <option>Connection Warmer</option>
                                <option>Lead Scraper</option>
                                <option>Message Broadcast</option>
                            </select>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm text-gray-300">Speed Multiplier</label>
                            <input type="range" className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-emerald-500" />
                            <div className="flex justify-between text-xs text-gray-500">
                                <span>Safe (1x)</span>
                                <span>Turbo (5x)</span>
                            </div>
                        </div>
                    </div>
                </motion.div>

                {/* Terminal Output */}
                <motion.div
                    initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}
                    className="lg:col-span-2 glass-card rounded-xl border border-white/5 flex flex-col overflow-hidden bg-[#0f172a]/80"
                >
                    <div className="p-3 border-b border-white/10 bg-black/40 flex items-center justify-between">
                        <div className="flex items-center gap-2 text-gray-400">
                            <Terminal size={16} />
                            <span className="text-xs font-mono">execution_log.txt</span>
                        </div>
                        <div className="flex gap-1.5">
                            <div className="w-3 h-3 rounded-full bg-red-500/20 border border-red-500/50" />
                            <div className="w-3 h-3 rounded-full bg-yellow-500/20 border border-yellow-500/50" />
                            <div className="w-3 h-3 rounded-full bg-green-500/20 border border-green-500/50" />
                        </div>
                    </div>

                    <div ref={scrollRef} className="flex-1 p-4 font-mono text-sm overflow-y-auto scrollbar-thin space-y-1">
                        {logs.map((log, i) => (
                            <div key={log.id || i} className="flex gap-3 animate-in fade-in duration-300">
                                <span className="text-gray-500 shrink-0 select-none">[{log.timestamp}]</span>
                                <span className={`shrink-0 font-bold w-16 ${log.type === 'info' ? 'text-blue-400' :
                                    log.type === 'warning' ? 'text-yellow-400' :
                                        log.type === 'error' ? 'text-red-400' :
                                            'text-green-400'
                                    }`}>
                                    {log.type.toUpperCase()}
                                </span>
                                <span className="text-gray-500 shrink-0">[{log.agent}]</span>
                                <span className="text-gray-300 break-all">{log.message}</span>
                            </div>
                        ))}
                        {isRunning && (
                            <div className="flex gap-2 items-center text-emerald-500/50 animate-pulse mt-2">
                                <span className="text-xs">Processing...</span>
                            </div>
                        )}
                    </div>

                    <div className="p-3 border-t border-white/10 bg-black/40">
                        <div className="flex items-center gap-2">
                            <Command size={14} className="text-gray-500" />
                            <input
                                type="text"
                                placeholder="Enter manual command..."
                                className="bg-transparent border-none focus:ring-0 text-sm font-mono text-gray-300 w-full placeholder-gray-600"
                            />
                        </div>
                    </div>
                </motion.div>

            </div>
        </div>
    );
}
