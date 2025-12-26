"use client";

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Eye, Monitor, Wifi, Radio, Globe, Shield,
    Terminal, Play, Square, Cpu, Command, Activity, Zap, Users, Target, Maximize2, Minimize2
} from 'lucide-react';

const MOCK_LOGS = [
    { time: "10:00:01", level: "INFO", message: "System initialized. Waiting for command..." }
];

export default function LiveViewPage() {
    const [runningAgent, setRunningAgent] = useState<string | null>(null);
    const [logs, setLogs] = useState(MOCK_LOGS);
    const [isExpanded, setIsExpanded] = useState(false);
    const scrollRef = useRef<HTMLDivElement>(null);
    const wsRef = useRef<WebSocket | null>(null);
    const [screenshot, setScreenshot] = useState<string | null>(null);

    useEffect(() => {
        // Connect to WebSocket on mount
        const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
        const wsUrl = `${protocol}//${window.location.host}/ws/stream`; // Proxied by Next.js to 5000

        wsRef.current = new WebSocket(wsUrl);

        wsRef.current.onmessage = (event) => {
            try {
                const data = JSON.parse(event.data);
                if (data.type === 'log') {
                    addLog(data.logType?.toUpperCase() || 'INFO', data.message);
                } else if (data.type === 'screenshot') {
                    setScreenshot(`data:image/jpeg;base64,${data.image}`);
                }
            } catch (e) {
                console.error("WS Parse Error", e);
            }
        };

        return () => {
            wsRef.current?.close();
        };
    }, []);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [logs]);

    const startAgent = async (agentName: string, endpoint: string) => {
        if (runningAgent) return;

        setRunningAgent(agentName);
        addLog("INFO", `Launching ${agentName}...`);

        try {
            // Ensure we hit the API correctly (proxied via Next.js)
            const res = await fetch(`/api/agents/start/${endpoint}`, { method: 'POST' });
            const data = await res.json();

            if (data.status === 'ok') {
                addLog("SUCCESS", `${agentName} process started (PID: ${data.pid})`);
            } else {
                addLog("ERROR", `Failed to start: ${data.message}`);
                setRunningAgent(null);
            }
        } catch (err) {
            addLog("ERROR", "API Connection Failed. Is the backend running?");
            setRunningAgent(null);
        }
    };

    const stopAgent = async () => {
        if (!runningAgent) return;

        addLog("WARN", "Sending stop signal...");
        try {
            await fetch('/api/agents/stop-all', { method: 'POST' });
            addLog("INFO", "Agent stopped by user.");
            setRunningAgent(null);
            setScreenshot(null);
        } catch (err) {
            addLog("ERROR", "Failed to stop agent.");
        }
    };

    const addLog = (level: string, message: string) => {
        setLogs(prev => [...prev, {
            time: new Date().toLocaleTimeString(),
            level,
            message
        }]);
    };

    return (
        <div className="min-h-screen p-6 space-y-6 pb-20">
            {/* Header */}
            <div className="flex justify-between items-end">
                <div>
                    <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-linear-to-r from-pink-400 to-purple-400">
                        Live Command Center
                    </h1>
                    <p className="text-gray-400 mt-1">Real-time browser streaming and agent control.</p>
                </div>
                <div className="flex items-center gap-2 text-red-500 animate-pulse bg-red-500/10 px-3 py-1 rounded-full border border-red-500/20">
                    <Radio size={16} />
                    <span className="text-xs font-bold uppercase tracking-wider">Live Connection</span>
                </div>
            </div>

            <div className={`grid gap-6 h-[calc(100vh-200px)] transition-all duration-300 ${isExpanded ? 'grid-cols-1' : 'grid-cols-1 lg:grid-cols-4'}`}>

                {/* LEFT: Control Panel (Hidden when expanded) */}
                {!isExpanded && (
                    <motion.div
                        initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}
                        className="glass-card p-6 rounded-xl border border-white/5 flex flex-col gap-6 lg:col-span-1"
                    >
                        <div className="flex items-center gap-3 mb-2">
                            <Cpu size={24} className="text-gray-300" />
                            <h2 className="text-xl font-bold text-gray-100">Agent Launchpad</h2>
                        </div>

                        {/* Status Display */}
                        <div className={`flex items-center justify-between p-4 rounded-xl border ${runningAgent
                            ? 'bg-green-500/10 border-green-500/20'
                            : 'bg-white/5 border-white/10'}`}>
                            <span className="text-gray-300 font-medium">Status</span>
                            <div className={`flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold ${runningAgent
                                ? 'bg-green-500/20 text-green-400'
                                : 'bg-gray-500/20 text-gray-400'
                                }`}>
                                {runningAgent ? (
                                    <>
                                        <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                                        RUNNING
                                    </>
                                ) : (
                                    'READY'
                                )}
                            </div>
                        </div>

                        {/* Stop Button */}
                        <AnimatePresence>
                            {runningAgent && (
                                <motion.button
                                    initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
                                    onClick={stopAgent}
                                    className="w-full py-3 rounded-xl font-bold text-red-300 bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 flex items-center justify-center gap-2 transition-all"
                                >
                                    <Square fill="currentColor" size={18} />
                                    EMERGENCY STOP
                                </motion.button>
                            )}
                        </AnimatePresence>

                        {/* Agent Buttons */}
                        <div className="grid grid-cols-1 gap-3 overflow-y-auto scrollbar-thin flex-1">
                            <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-1">Select Agent</p>

                            <AgentButton
                                title="Feed Warmer"
                                desc="Runs 'Feed Agent' (Likes/Comments)"
                                icon={Zap}
                                color="violet"
                                onClick={() => startAgent("Feed Warmer", "feedWarmer")}
                                disabled={!!runningAgent}
                            />

                            <AgentButton
                                title="Growth Manager"
                                desc="Runs 'Growth Agent' (Connections)"
                                icon={Target}
                                color="blue"
                                onClick={() => startAgent("Growth Manager", "growthManager")}
                                disabled={!!runningAgent}
                            />

                            <AgentButton
                                title="Lead CRM"
                                desc="Runs 'Lead Manager' (CRM Sync)"
                                icon={Users}
                                color="emerald"
                                onClick={() => startAgent("Lead CRM", "leadCampaign")}
                                disabled={!!runningAgent}
                            />

                            <AgentButton
                                title="Status Checker"
                                desc="Runs 'Connection Agent'"
                                icon={Activity}
                                color="orange"
                                onClick={() => startAgent("Status Checker", "connectionChecker")}
                                disabled={!!runningAgent}
                            />
                        </div>
                    </motion.div>
                )}

                {/* RIGHT: Visuals & Logs (Takes 75% width normally, 100% if expanded) */}
                <div className={`flex flex-col gap-6 ${isExpanded ? 'col-span-1' : 'lg:col-span-3'}`}>

                    {/* Browser Viewport */}
                    <motion.div
                        layout
                        className="flex-1 glass-card rounded-xl border border-white/5 flex flex-col overflow-hidden relative group min-h-[500px]"
                    >
                        {/* Fake Browser Toolbar */}
                        <div className="h-10 bg-black/40 border-b border-white/10 flex items-center px-4 gap-4 justify-between">
                            <div className="flex items-center gap-4 flex-1">
                                <div className="flex gap-1.5">
                                    <div className="w-3 h-3 rounded-full bg-red-500/50" />
                                    <div className="w-3 h-3 rounded-full bg-yellow-500/50" />
                                    <div className="w-3 h-3 rounded-full bg-green-500/50" />
                                </div>
                                <div className="flex-1 max-w-xl bg-white/5 rounded-md h-6 flex items-center px-3 text-xs text-gray-500 font-mono">
                                    <Globe size={12} className="mr-2 opacity-50" />
                                    linkedin.com/feed
                                </div>
                            </div>
                            <button
                                onClick={() => setIsExpanded(!isExpanded)}
                                className="text-gray-400 hover:text-white transition-colors"
                            >
                                {isExpanded ? <Minimize2 size={18} /> : <Maximize2 size={18} />}
                            </button>
                        </div>

                        {/* Viewport content */}
                        <div className="flex-1 bg-black relative flex items-center justify-center overflow-hidden">
                            {screenshot ? (
                                <img
                                    src={screenshot}
                                    alt="Agent Browser View"
                                    className="w-full h-full object-contain"
                                />
                            ) : (
                                <div className="text-center space-y-4">
                                    {runningAgent ? (
                                        <div className="flex flex-col items-center gap-4">
                                            <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
                                            <p className="text-blue-400 font-mono">Waiting for video stream...</p>
                                        </div>
                                    ) : (
                                        <div className="flex flex-col items-center gap-2 opacity-30">
                                            <Monitor size={64} className="text-gray-500" />
                                            <p className="text-gray-500 font-mono text-sm">Agent Offline</p>
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* Overlay Info */}
                            {runningAgent && (
                                <div className="absolute top-4 right-4 bg-black/60 backdrop-blur px-3 py-1.5 rounded-lg border border-white/10 text-xs font-mono text-gray-300">
                                    <div className="flex items-center gap-2">
                                        <Radio size={12} className="text-red-500 animate-pulse" />
                                        <span>LIVE RECORDING</span>
                                    </div>
                                </div>
                            )}
                        </div>
                    </motion.div>

                    {/* Logs Terminal (Collapsible) */}
                    <motion.div
                        className="h-48 glass-card rounded-xl border border-white/5 flex flex-col overflow-hidden bg-[#0f172a]/90"
                    >
                        <div className="p-2 border-b border-white/10 bg-black/40 flex items-center justify-between">
                            <div className="flex items-center gap-2 text-gray-400">
                                <Terminal size={14} />
                                <span className="text-xs font-mono">execution_log.txt</span>
                            </div>
                        </div>

                        <div ref={scrollRef} className="flex-1 p-3 font-mono text-xs overflow-y-auto scrollbar-thin space-y-1">
                            {logs.map((log, i) => (
                                <div key={i} className="flex gap-3">
                                    <span className="text-gray-600 shrink-0 select-none">[{log.time}]</span>
                                    <span className={`shrink-0 font-bold w-12 ${log.level === 'INFO' ? 'text-blue-400' :
                                        log.level === 'WARN' ? 'text-yellow-400' :
                                            log.level === 'ERROR' ? 'text-red-400' :
                                                'text-green-400'
                                        }`}>
                                        {log.level}
                                    </span>
                                    <span className="text-gray-300 break-all">{log.message}</span>
                                </div>
                            ))}
                        </div>
                    </motion.div>
                </div>
            </div>
        </div>
    );
}

function AgentButton({ title, desc, icon: Icon, color, onClick, disabled }: any) {
    const colorStyles: any = {
        blue: "text-blue-400 group-hover:bg-blue-500/10 border-blue-500/20",
        violet: "text-violet-400 group-hover:bg-violet-500/10 border-violet-500/20",
        emerald: "text-emerald-400 group-hover:bg-emerald-500/10 border-emerald-500/20",
        orange: "text-orange-400 group-hover:bg-orange-500/10 border-orange-500/20",
    };

    return (
        <button
            onClick={onClick}
            disabled={disabled}
            className={`flex items-center gap-3 p-3 rounded-lg border bg-black/20 text-left transition-all hover:scale-[1.01] group disabled:opacity-50 disabled:cursor-not-allowed ${colorStyles[color]} hover:border-opacity-50 border-white/5`}
        >
            <div className={`w-8 h-8 rounded-md flex items-center justify-center bg-white/5 ${colorStyles[color]}`}>
                <Icon size={16} />
            </div>
            <div className="min-w-0">
                <h3 className="font-bold text-gray-200 text-sm group-hover:text-white truncate">{title}</h3>
                <div className="flex items-center gap-2 mt-0.5">
                    <span className="text-[10px] uppercase font-bold bg-white/10 px-1.5 py-0.5 rounded text-gray-400 group-hover:text-gray-300">LAUNCH</span>
                    <p className="text-xs text-gray-600 truncate">{desc}</p>
                </div>
            </div>
        </button>
    )
}
