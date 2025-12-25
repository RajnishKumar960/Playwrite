'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Play, Square, Monitor, Terminal, Wifi, WifiOff,
    Maximize2, RefreshCw, Activity, AlertCircle, Loader2
} from 'lucide-react';
import { useAgentStore } from '@/lib/store';

export default function LiveViewPage() {
    const { agentStatus, logs, startAgent, stopAgent, stopAllAgents, syncLogs, syncStatus, isConnected, addLog } = useAgentStore();
    const [streamImage, setStreamImage] = useState<string | null>(null);
    const [activeAgent, setActiveAgent] = useState<string | null>(null);
    const [isStarting, setIsStarting] = useState<string | null>(null);
    const [wsConnected, setWsConnected] = useState(false);
    const logEndRef = useRef<HTMLDivElement>(null);
    const desktopRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        syncStatus();
        syncLogs();
        const interval = setInterval(() => {
            syncStatus();
            syncLogs();
        }, 2000);
        return () => clearInterval(interval);
    }, []);

    // WebSocket for live streaming
    useEffect(() => {
        let ws: WebSocket | null = null;
        let reconnectTimeout: NodeJS.Timeout;

        const connect = () => {
            try {
                ws = new WebSocket('ws://localhost:4000/ws/stream');

                ws.onopen = () => {
                    console.log('Stream WebSocket connected');
                    setWsConnected(true);
                };

                ws.onmessage = (event) => {
                    try {
                        const data = JSON.parse(event.data);
                        if (data.type === 'screenshot' && data.image) {
                            setStreamImage(data.image);
                            setActiveAgent(data.agent || 'agent');
                        }
                    } catch { }
                };

                ws.onclose = () => {
                    setWsConnected(false);
                    reconnectTimeout = setTimeout(connect, 3000);
                };

                ws.onerror = () => {
                    setWsConnected(false);
                };
            } catch { }
        };

        connect();

        return () => {
            if (ws) ws.close();
            clearTimeout(reconnectTimeout);
        };
    }, []);

    useEffect(() => {
        logEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [logs]);

    const handleStartAgent = async (agentId: string) => {
        setIsStarting(agentId);
        setActiveAgent(agentId);
        addLog(`Starting ${agentId}...`, 'info', 'system');

        try {
            await startAgent(agentId);
            addLog(`${agentId} started successfully`, 'success', agentId);
        } catch (error) {
            addLog(`Failed to start ${agentId}`, 'error', 'system');
        }

        setIsStarting(null);
    };

    const toggleFullscreen = () => {
        if (!document.fullscreenElement && desktopRef.current) {
            desktopRef.current.requestFullscreen();
        } else if (document.fullscreenElement) {
            document.exitFullscreen();
        }
    };

    const agents = [
        { id: 'feedWarmer', name: 'Feed Warmer', desc: 'Like & comment', status: agentStatus.feedWarmer },
        { id: 'leadCampaign', name: 'Lead Campaign', desc: 'Engage leads', status: agentStatus.leadCampaign },
        { id: 'connectionChecker', name: 'Connection Checker', desc: 'Check requests', status: agentStatus.connectionChecker },
    ];

    const runningAgent = agents.find(a => a.status === 'running');

    return (
        <div className="space-y-4 md:space-y-6">
            {/* Header - Responsive */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div>
                    <h1 className="text-xl md:text-2xl font-bold flex items-center gap-2 md:gap-3">
                        <div className="p-1.5 md:p-2 rounded-lg md:rounded-xl bg-gradient-to-br from-blue-500/20 to-cyan-500/20">
                            <Monitor className="w-5 h-5 md:w-6 md:h-6 text-blue-400" />
                        </div>
                        Live Agent View
                    </h1>
                    <p className="text-muted-foreground text-sm mt-1 hidden sm:block">Virtual Desktop - Real-time automation</p>
                </div>

                <div className="flex items-center gap-2">
                    <motion.div
                        animate={{ scale: wsConnected ? [1, 1.05, 1] : 1 }}
                        transition={{ duration: 2, repeat: Infinity }}
                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium ${wsConnected
                                ? 'bg-green-500/10 text-green-400 border border-green-500/30'
                                : 'bg-yellow-500/10 text-yellow-400 border border-yellow-500/30'
                            }`}
                    >
                        {wsConnected ? <Wifi className="w-3 h-3" /> : <WifiOff className="w-3 h-3" />}
                        {wsConnected ? 'Stream Active' : 'Connecting...'}
                    </motion.div>
                </div>
            </div>

            {/* Main Grid - Responsive */}
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 md:gap-6">
                {/* Virtual Desktop */}
                <div className="lg:col-span-3 order-2 lg:order-1">
                    <motion.div
                        ref={desktopRef}
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="virtual-desktop relative group"
                    >
                        {/* Browser Chrome */}
                        <div className="browser-chrome px-3 md:px-4 py-2 md:py-3 flex items-center justify-between">
                            <div className="flex items-center gap-2 md:gap-3">
                                <div className="flex gap-1.5">
                                    <div className="w-2.5 h-2.5 md:w-3 md:h-3 rounded-full bg-red-500" />
                                    <div className="w-2.5 h-2.5 md:w-3 md:h-3 rounded-full bg-yellow-500" />
                                    <div className="w-2.5 h-2.5 md:w-3 md:h-3 rounded-full bg-green-500" />
                                </div>
                                <div className="hidden sm:flex items-center gap-2 px-3 py-1 bg-background/50 rounded-lg border border-border/50">
                                    <div className="w-2 h-2 rounded-full bg-green-500" />
                                    <span className="text-xs text-muted-foreground font-mono">linkedin.com</span>
                                </div>
                            </div>

                            <div className="flex items-center gap-1">
                                <button onClick={toggleFullscreen} className="p-1.5 hover:bg-white/5 rounded-lg transition-colors">
                                    <Maximize2 className="w-4 h-4" />
                                </button>
                            </div>
                        </div>

                        {/* Stream View - Responsive aspect ratio */}
                        <div className="aspect-[16/10] md:aspect-video bg-black/80 relative overflow-hidden">
                            <AnimatePresence mode="wait">
                                {streamImage ? (
                                    <motion.img
                                        key="stream"
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        exit={{ opacity: 0 }}
                                        src={`data:image/jpeg;base64,${streamImage}`}
                                        alt="Live automation view"
                                        className="w-full h-full object-contain"
                                    />
                                ) : (
                                    <motion.div
                                        key="placeholder"
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        exit={{ opacity: 0 }}
                                        className="absolute inset-0 flex flex-col items-center justify-center"
                                    >
                                        <motion.div
                                            animate={{ rotate: 360, opacity: [0.5, 1, 0.5] }}
                                            transition={{ rotate: { duration: 20, repeat: Infinity, ease: "linear" }, opacity: { duration: 2, repeat: Infinity } }}
                                            className="relative"
                                        >
                                            <Monitor className="w-16 h-16 md:w-24 md:h-24 text-blue-500/30" />
                                            <div className="absolute inset-0 flex items-center justify-center">
                                                <Activity className="w-6 h-6 md:w-8 md:h-8 text-blue-400/50" />
                                            </div>
                                        </motion.div>
                                        <p className="text-muted-foreground mt-4 md:mt-6 text-sm md:text-lg">Start an agent to see live automation</p>
                                        <p className="text-muted-foreground/60 text-xs md:text-sm mt-1 md:mt-2">Click Play on any agent</p>
                                    </motion.div>
                                )}
                            </AnimatePresence>

                            {/* Running indicator */}
                            {runningAgent && (
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="absolute bottom-3 left-3 flex items-center gap-2 px-3 py-1.5 bg-black/80 backdrop-blur-sm rounded-lg border border-green-500/30"
                                >
                                    <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                                    <span className="text-xs md:text-sm font-medium text-green-400">{runningAgent.name}</span>
                                </motion.div>
                            )}
                        </div>
                    </motion.div>
                </div>

                {/* Control Panel - Responsive */}
                <div className="space-y-4 order-1 lg:order-2">
                    {/* Agent Controls */}
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="glass-card rounded-xl p-3 md:p-4"
                    >
                        <h3 className="font-semibold mb-3 flex items-center gap-2 text-sm md:text-base">
                            <Play className="w-4 h-4 text-primary" />
                            Agent Controls
                        </h3>

                        <div className="space-y-2 md:space-y-3">
                            {agents.map((agent, idx) => (
                                <motion.div
                                    key={agent.id}
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: idx * 0.1 }}
                                    className={`p-2.5 md:p-3 rounded-lg border transition-all duration-300 ${agent.status === 'running'
                                            ? 'bg-green-500/10 border-green-500/30'
                                            : 'bg-accent/30 border-border hover:border-primary/30'
                                        }`}
                                >
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-2 min-w-0">
                                            <div className={`w-2 h-2 rounded-full shrink-0 ${agent.status === 'running' ? 'status-running' :
                                                    agent.status === 'paused' ? 'status-paused' : 'status-stopped'
                                                }`} />
                                            <div className="min-w-0">
                                                <span className="text-xs md:text-sm font-medium block truncate">{agent.name}</span>
                                                <span className="text-xs text-muted-foreground hidden md:block">{agent.desc}</span>
                                            </div>
                                        </div>

                                        <div className="flex gap-1 shrink-0">
                                            {agent.status === 'running' ? (
                                                <motion.button
                                                    whileHover={{ scale: 1.1 }}
                                                    whileTap={{ scale: 0.95 }}
                                                    onClick={() => stopAgent(agent.id)}
                                                    className="p-1.5 md:p-2 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/30 transition-colors"
                                                >
                                                    <Square className="w-3.5 h-3.5 md:w-4 md:h-4" />
                                                </motion.button>
                                            ) : (
                                                <motion.button
                                                    whileHover={{ scale: 1.1 }}
                                                    whileTap={{ scale: 0.95 }}
                                                    onClick={() => handleStartAgent(agent.id)}
                                                    disabled={isStarting === agent.id}
                                                    className="p-1.5 md:p-2 bg-green-500/20 text-green-400 rounded-lg hover:bg-green-500/30 transition-colors disabled:opacity-50"
                                                >
                                                    {isStarting === agent.id ? (
                                                        <Loader2 className="w-3.5 h-3.5 md:w-4 md:h-4 animate-spin" />
                                                    ) : (
                                                        <Play className="w-3.5 h-3.5 md:w-4 md:h-4" />
                                                    )}
                                                </motion.button>
                                            )}
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </div>

                        {/* Emergency Stop */}
                        <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={stopAllAgents}
                            className="w-full mt-3 md:mt-4 py-2.5 bg-gradient-to-r from-red-500/20 to-red-600/20 text-red-400 rounded-xl 
                       hover:from-red-500/30 hover:to-red-600/30 font-medium border border-red-500/30 
                       transition-all duration-300 flex items-center justify-center gap-2 text-sm"
                        >
                            <AlertCircle className="w-4 h-4" />
                            Emergency Stop
                        </motion.button>
                    </motion.div>

                    {/* Terminal Log */}
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.1 }}
                        className="glass-card rounded-xl p-3 md:p-4"
                    >
                        <div className="flex items-center justify-between mb-2 md:mb-3">
                            <h3 className="font-semibold flex items-center gap-2 text-sm md:text-base">
                                <Terminal className="w-4 h-4 text-blue-400" />
                                Terminal
                            </h3>
                            <button onClick={syncLogs} className="p-1 hover:bg-white/5 rounded transition-colors">
                                <RefreshCw className="w-3 h-3 text-muted-foreground" />
                            </button>
                        </div>

                        <div className="terminal-log h-40 md:h-52 overflow-y-auto scrollbar-thin">
                            {logs.slice(0, 30).map((log, idx) => (
                                <motion.div
                                    key={log.id}
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: idx * 0.02 }}
                                    className="mb-0.5 md:mb-1"
                                >
                                    <span className="text-muted-foreground/60">[{log.timestamp}]</span>{' '}
                                    <span className={`log-${log.type}`}>{log.message}</span>
                                </motion.div>
                            ))}
                            {logs.length === 0 && (
                                <p className="text-muted-foreground/60 text-center py-4 text-xs md:text-sm">
                                    Waiting for activity...
                                </p>
                            )}
                            <div ref={logEndRef} />
                        </div>
                    </motion.div>
                </div>
            </div>
        </div>
    );
}
