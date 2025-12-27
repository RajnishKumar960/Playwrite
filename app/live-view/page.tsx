"use client";

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Eye, Monitor, Wifi, Radio, Globe, Shield,
    Terminal, Play, Square, Cpu, Command, Activity, Zap, Users, Target, Maximize2, Minimize2, Pause, FastForward
} from 'lucide-react';
import { api, WS_URL } from '@/lib/api';
import { cn } from '@/lib/utils';

const MOCK_LOGS = [
    { time: "10:00:01", level: "INFO", message: "System initialized. Waiting for command..." }
];

export default function LiveViewPage() {
    const [runningAgent, setRunningAgent] = useState<string | null>(null);
    const [agentStatus, setAgentStatus] = useState<'running' | 'paused' | 'stopped'>('stopped');
    const [logs, setLogs] = useState(MOCK_LOGS);
    const [isExpanded, setIsExpanded] = useState(false);
    const scrollRef = useRef<HTMLDivElement>(null);
    const wsRef = useRef<WebSocket | null>(null);
    const [screenshot, setScreenshot] = useState<string | null>(null);

    // Config Modal State
    const [showConfig, setShowConfig] = useState(false);
    const [selectedAgent, setSelectedAgent] = useState<any>(null);
    const [params, setParams] = useState({ max: 25, duration: 15, postComments: true });

    // Secrets Status
    const [secrets, setSecrets] = useState<any>(null);

    useEffect(() => {
        const fetchSecrets = async () => {
            try {
                const data = await api.agents.secretsStatus();
                setSecrets(data.secrets);
            } catch (e) {
                console.error("Secrets Fetch Error", e);
            }
        };
        fetchSecrets();

        // Connect to WebSocket for live streaming
        const wsUrl = `${WS_URL}/ws/stream`;
        console.log("Connecting to surveillance stream:", wsUrl);
        wsRef.current = new WebSocket(wsUrl);

        wsRef.current.onmessage = (event: MessageEvent) => {
            try {
                const data = JSON.parse(event.data);
                if (data.type === 'log') {
                    addLog(data.level?.toUpperCase() || 'INFO', data.message);
                } else if (data.type === 'screenshot') {
                    setScreenshot(`data:image/jpeg;base64,${data.image}`);
                }
            } catch (e) {
                console.error("Surveillance Data Error", e);
            }
        };

        wsRef.current.onopen = () => {
            console.log("Surveillance Uplink: ESTABLISHED");
            addLog("SUCCESS", "Surveillance Uplink: ESTABLISHED");
        };

        wsRef.current.onclose = () => {
            console.log("Surveillance Uplink: SEVERED");
            addLog("ERROR", "Surveillance Uplink: SEVERED");
        };

        wsRef.current.onerror = (e: any) => {
            console.error("Uplink Error:", e);
            addLog("ERROR", "Uplink Error: Protocol breach detected.");
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

    const handleLaunch = (agentId: string, title: string) => {
        if (runningAgent) return;
        const agent = { id: agentId, title };
        setSelectedAgent(agent);
        if (agentId === 'feedWarmer') setParams({ max: 50, duration: 30, postComments: true });
        else if (agentId === 'growthManager') setParams({ max: 10, duration: 45, postComments: true });
        else setParams({ max: 25, duration: 15, postComments: false });
        setShowConfig(true);
    };

    const startAgent = async () => {
        if (!selectedAgent) return;
        const agentName = selectedAgent.title;
        const endpoint = selectedAgent.id;

        setShowConfig(false);
        setRunningAgent(agentName);
        setAgentStatus('running');
        setScreenshot(null);
        addLog("INFO", `Initializing protocols for ${agentName}...`);
        addLog("INFO", "Synchronizing surveillance uplink...");

        try {
            const data = await api.agents.start(endpoint, params);
            if (data.status === 'ok') {
                addLog("SUCCESS", `${agentName} core online. Stream synchronized.`);
            } else {
                addLog("ERROR", `Protocol breach: ${data.message || 'Unknown error'}`);
                setRunningAgent(null);
                setAgentStatus('stopped');
            }
        } catch (err) {
            addLog("ERROR", `Uplink Failed: ${err instanceof Error ? err.message : 'Connection Error'}`);
            setRunningAgent(null);
            setAgentStatus('stopped');
        }
    };

    const stopAgent = async () => {
        if (!runningAgent) return;

        addLog("WARN", "Injecting termination signal...");
        setAgentStatus('stopped');
        try {
            await api.agents.stopAll();
            addLog("INFO", "Operation scrubbed by operator.");
            setRunningAgent(null);
            setScreenshot(null);
        } catch (err) {
            addLog("ERROR", "Termination failed.");
        }
    };

    const togglePause = () => {
        if (agentStatus === 'running') {
            setAgentStatus('paused');
            addLog("WARN", "Operation suspended manually.");
        } else if (agentStatus === 'paused') {
            setAgentStatus('running');
            addLog("INFO", "Operation resumed.");
        }
    };

    const addLog = (level: string, message: string) => {
        setLogs((prev: any[]) => [...prev.slice(-100), {
            time: new Date().toLocaleTimeString(),
            level,
            message
        }]);
    };

    return (
        <div className="min-h-screen p-6 space-y-6 pb-20 relative overflow-hidden bg-[#02040a]">
            {/* Header HUD */}
            <div className="flex flex-col md:flex-row justify-between items-end gap-4 border-b border-white/5 pb-6 relative z-10">
                <div>
                    <h1 className="text-3xl font-black bg-clip-text text-transparent bg-linear-to-r from-blue-400 via-purple-400 to-pink-400 uppercase italic tracking-tighter">
                        MISSION <span className="text-white">CONTROL</span>
                    </h1>
                    <p className="text-[10px] text-gray-500 font-bold uppercase tracking-[0.4em] mt-2 flex items-center gap-2">
                        <Activity size={12} className="text-blue-500" />
                        Live Surveillance Stream // Encrypted
                    </p>
                </div>
                <div className="flex items-center gap-4 bg-white/5 px-4 py-2 rounded-xl border border-white/5 backdrop-blur-md">
                    <div className="flex flex-col items-end">
                        <span className="text-[8px] text-gray-500 font-bold uppercase tracking-widest">Uplink Status</span>
                        <span className="text-[10px] font-black text-green-400 uppercase tracking-tighter italic flex items-center gap-2">
                            <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                            Socket Connected
                        </span>
                    </div>
                    <div className="w-px h-8 bg-white/10" />
                    <div className="flex flex-col items-end">
                        <span className="text-[8px] text-gray-500 font-bold uppercase tracking-widest">Global Latency</span>
                        <span className="text-[10px] font-black text-white italic">12ms</span>
                    </div>
                </div>
            </div>

            {/* MAIN CONTENT: Side-by-Side Surveillance & Logs */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 relative z-10">

                {/* Surveillance Viewport (8/12 weight) */}
                <div className="lg:col-span-8 space-y-6">
                    <div className="glass-card rounded-2xl border border-white/5 flex flex-col overflow-hidden relative bg-black shadow-2xl min-h-[500px]">
                        {/* CRT Effect Overlay */}
                        <div className="absolute inset-0 pointer-events-none z-20 overflow-hidden opacity-30">
                            <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_2px,3px_100%]" />
                        </div>

                        {/* Viewport Toolbar */}
                        <div className="h-12 bg-white/5 border-b border-white/10 flex items-center px-6 gap-6 justify-between relative z-30">
                            <div className="flex items-center gap-6 flex-1">
                                <div className="flex gap-2">
                                    <div className="w-2.5 h-2.5 rounded-full bg-red-500/30" />
                                    <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/30" />
                                    <div className="w-2.5 h-2.5 rounded-full bg-green-500/30" />
                                </div>
                                <div className="flex-1 max-w-2xl bg-black/40 rounded-lg h-7 flex items-center px-4 text-[10px] text-gray-400 font-mono tracking-wider border border-white/5">
                                    <Shield size={10} className="mr-3 text-blue-500 opacity-70" />
                                    FEEDS://SECURE_NODE.TSI/LINKEDIN
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <StatusBadge status={agentStatus} />
                                <button className="w-8 h-8 rounded-lg bg-white/5 hover:bg-white/10 flex items-center justify-center border border-white/5">
                                    <Maximize2 size={14} className="text-gray-400" />
                                </button>
                            </div>
                        </div>

                        {/* Stream Content */}
                        <div className="flex-1 bg-[#02040a] relative flex items-center justify-center">
                            {screenshot ? (
                                <img src={screenshot} alt="Visual Uplink" className="w-full h-full object-contain" />
                            ) : (
                                <div className="text-center opacity-20">
                                    <Monitor size={64} className="mx-auto mb-4 text-gray-500" />
                                    <p className="text-[10px] font-black uppercase tracking-[0.5em] italic">Awaiting Signal...</p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* COMMAND DECK (Below Screen) */}
                    <div className="glass-card p-6 rounded-2xl border border-white/5 bg-black/40 backdrop-blur-xl">
                        <div className="flex items-center justify-between mb-6">
                            <div className="flex items-center gap-3">
                                <Command size={18} className="text-blue-400" />
                                <h2 className="text-xs font-black text-gray-100 uppercase tracking-[0.3em] italic">Command Deck</h2>
                            </div>
                            <div className="flex items-center gap-4 bg-black/40 px-4 py-2 rounded-xl border border-white/5">
                                <div className="flex flex-col">
                                    <span className="text-[8px] text-gray-500 font-bold uppercase tracking-widest">Agent Phase</span>
                                    <span className="text-[10px] font-black text-white uppercase italic">{runningAgent || 'STANDBY'}</span>
                                </div>
                                <div className={cn(
                                    "w-3 h-3 rounded-full shadow-lg transition-all duration-500",
                                    agentStatus === 'running' ? "bg-green-500 shadow-green-500/50 animate-pulse" :
                                        agentStatus === 'paused' ? "bg-amber-500 shadow-amber-500/50" :
                                            "bg-red-500 shadow-red-500/50"
                                )} />
                            </div>
                        </div>

                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                            <DeckButton
                                label="Start Feed Warmer"
                                icon={Zap}
                                onClick={() => handleLaunch('feedWarmer', 'Feed Warmer')}
                                disabled={!!runningAgent}
                                color="blue"
                            />
                            <DeckButton
                                label="Start Connector"
                                icon={Users}
                                onClick={() => handleLaunch('growthManager', 'Growth Manager')}
                                disabled={!!runningAgent}
                                color="purple"
                            />
                            <DeckButton
                                label="Pause Operation"
                                icon={agentStatus === 'paused' ? Play : Pause}
                                onClick={togglePause}
                                disabled={!runningAgent}
                                color="amber"
                                active={agentStatus === 'paused'}
                            />
                            <DeckButton
                                label="Emergency Stop"
                                icon={Square}
                                onClick={stopAgent}
                                disabled={!runningAgent}
                                color="red"
                                danger
                            />
                        </div>
                    </div>
                </div>

                {/* Tactical Terminal (4/12 weight) */}
                <div className="lg:col-span-4 flex flex-col gap-6">
                    <div className="flex-1 glass-card rounded-2xl border border-white/5 flex flex-col overflow-hidden bg-black/60 backdrop-blur-md min-h-[500px]">
                        <div className="px-6 py-4 border-b border-white/10 bg-white/5 flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <Terminal size={14} className="text-blue-400" />
                                <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest italic">Live Action Log</span>
                            </div>
                        </div>

                        <div ref={scrollRef} className="flex-1 p-6 font-mono text-[10px] overflow-y-auto scrollbar-thin space-y-3">
                            {logs.map((log, i) => (
                                <div key={i} className="flex gap-4 group transition-colors hover:bg-white/5 p-1.5 rounded-lg border border-transparent hover:border-white/5">
                                    <span className="text-gray-600 shrink-0 select-none">[{log.time}]</span>
                                    <span className={`shrink-0 font-black italic ${log.level === 'INFO' ? 'text-blue-400' :
                                        log.level === 'WARN' ? 'text-amber-400' :
                                            log.level === 'ERROR' ? 'text-red-400' :
                                                'text-green-400'
                                        }`}>
                                        {log.level}
                                    </span>
                                    <span className="text-gray-400 group-hover:text-gray-200 transition-colors leading-relaxed">
                                        {log.message}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Secondary Metrics */}
                    <div className="glass-card p-6 rounded-2xl border border-white/5 bg-black/40 backdrop-blur-xl">
                        <h3 className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-4">Neural Node Performance</h3>
                        <div className="space-y-4">
                            <PerformanceMetric label="Extraction Efficiency" value={88} color="blue" />
                            <PerformanceMetric label="Sentiment Accuracy" value={94} color="purple" />
                            <PerformanceMetric label="Uplink Stability" value={99} color="green" />
                        </div>
                    </div>
                </div>
            </div>

            {/* Tactical Configuration Modal */}
            <AnimatePresence>
                {showConfig && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
                        <motion.div
                            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
                            onClick={() => setShowConfig(false)}
                        />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 20 }}
                            className="w-full max-w-md bg-[#0d1117] border border-white/10 rounded-2xl overflow-hidden relative z-10 shadow-[0_0_100px_rgba(0,0,0,0.5)]"
                        >
                            <div className="p-6 space-y-6">
                                <div className="flex justify-between items-start">
                                    <div className="space-y-1">
                                        <p className="text-[10px] font-black text-blue-400 uppercase tracking-widest italic">Protocol Setup</p>
                                        <h3 className="text-xl font-black text-white uppercase italic">{selectedAgent?.title}</h3>
                                    </div>
                                    <div className="w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center text-blue-400 border border-blue-500/20">
                                        <Command size={20} />
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <div className="space-y-2">
                                        <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest text-gray-500">
                                            <span>Extraction Limit</span>
                                            <span className="text-blue-400">{params.max} Leads</span>
                                        </div>
                                        <input
                                            type="range" min="1" max="100" step="5"
                                            value={params.max}
                                            onChange={(e) => setParams(p => ({ ...p, max: parseInt(e.target.value) }))}
                                            className="w-full h-1 bg-white/10 rounded-lg appearance-none cursor-pointer accent-blue-500"
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest text-gray-500">
                                            <span>Session Duration</span>
                                            <span className="text-purple-400">{params.duration} Minutes</span>
                                        </div>
                                        <input
                                            type="range" min="5" max="120" step="5"
                                            value={params.duration}
                                            onChange={(e) => setParams(p => ({ ...p, duration: parseInt(e.target.value) }))}
                                            className="w-full h-1 bg-white/10 rounded-lg appearance-none cursor-pointer accent-purple-500"
                                        />
                                    </div>

                                    <div className="flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/5">
                                        <div className="flex flex-col">
                                            <span className="text-[10px] font-bold uppercase tracking-widest text-gray-300">Social Engagement</span>
                                            <span className="text-[9px] text-gray-500">Post AI-generated comments</span>
                                        </div>
                                        <button
                                            onClick={() => setParams(p => ({ ...p, postComments: !p.postComments }))}
                                            className={`w-12 h-6 rounded-full transition-all relative ${params.postComments ? 'bg-green-500/20 border-green-500/30' : 'bg-white/10 border-white/10'} border`}
                                        >
                                            <div className={`absolute top-1 w-4 h-4 rounded-full transition-all ${params.postComments ? 'right-1 bg-green-400' : 'left-1 bg-gray-500'}`} />
                                        </button>
                                    </div>
                                </div>

                                <button
                                    onClick={startAgent}
                                    className="w-full py-4 rounded-xl font-black text-xs uppercase tracking-[0.4em] bg-blue-500 text-white shadow-lg shadow-blue-500/20 hover:scale-[1.02] active:scale-[0.98] transition-all italic flex items-center justify-center gap-3"
                                >
                                    <Zap size={14} fill="currentColor" />
                                    Launch Protocol
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
}

function StatusBadge({ status }: { status: string }) {
    const config = {
        running: { color: 'text-green-400', label: 'ACTIVE' },
        paused: { color: 'text-amber-400', label: 'SUSPENDED' },
        stopped: { color: 'text-red-400', label: 'OFFLINE' },
    };
    const { color, label } = config[status as keyof typeof config] || config.stopped;
    return (
        <span className={cn("text-[8px] font-black px-2 py-0.5 rounded border border-white/10 bg-black/40 italic flex items-center gap-2", color)}>
            <div className={cn("w-1 h-1 rounded-full", status === 'running' ? "bg-green-500 animate-pulse" : "bg-current")} />
            {label}
        </span>
    );
}

function DeckButton({ label, icon: Icon, onClick, disabled, color, active, danger }: any) {
    const colors: any = {
        blue: "hover:bg-blue-500/10 hover:border-blue-500/30 text-blue-400",
        purple: "hover:bg-purple-500/10 hover:border-purple-500/30 text-purple-400",
        amber: "hover:bg-amber-500/10 hover:border-amber-500/30 text-amber-400",
        red: "hover:bg-red-500/20 hover:border-red-500/30 text-red-500",
    };

    return (
        <button
            onClick={onClick}
            disabled={disabled && !active && !danger}
            className={cn(
                "flex flex-col items-center gap-2 p-4 rounded-xl border border-white/5 bg-white/5 transition-all duration-300 group disabled:opacity-20",
                colors[color],
                active && "bg-amber-500/20 border-amber-500/40",
                danger && "bg-red-500/5"
            )}
        >
            <Icon size={20} className={cn("transition-transform group-hover:scale-110", active && "animate-pulse")} />
            <span className="text-[9px] font-black uppercase tracking-widest text-center">{label}</span>
        </button>
    );
}

function PerformanceMetric({ label, value, color }: { label: string, value: number, color: string }) {
    const colors: any = {
        blue: 'bg-blue-500',
        purple: 'bg-purple-500',
        green: 'bg-green-500'
    };
    return (
        <div className="space-y-1.5">
            <div className="flex justify-between items-end">
                <span className="text-[9px] font-bold text-gray-500 uppercase tracking-tighter">{label}</span>
                <span className="text-[10px] font-black text-white italic">{value}%</span>
            </div>
            <div className="h-1 bg-white/5 rounded-full overflow-hidden">
                <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${value}%` }}
                    className={cn("h-full", colors[color])}
                />
            </div>
        </div>
    );
}
