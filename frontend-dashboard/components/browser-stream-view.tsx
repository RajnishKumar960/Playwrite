"use client";

import { useEffect, useRef, useState } from "react";
import { Play, Pause, Square, Terminal, Power, MonitorPlay } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button"; // We might need to create this button if shadcn not installed, but using standard button for now or assuming shadcn logic
import { motion, AnimatePresence } from "framer-motion";

// Mock Images for Simulation
const MOCK_SCREENS = [
    "https://images.unsplash.com/photo-1611162617474-5b21e879e113?q=80&w=1000&auto=format&fit=crop", // LinkedIn-ish
    "https://images.unsplash.com/photo-1611162616475-46b635cb6868?q=80&w=1000&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1579389083078-4e7018379f7e?q=80&w=1000&auto=format&fit=crop",
];

type AgentStatus = "idle" | "running" | "paused" | "stopped";

export function BrowserStreamView() {
    const [status, setStatus] = useState<AgentStatus>("idle");
    const [logs, setLogs] = useState<string[]>([]);
    const [currentMockIndex, setCurrentMockIndex] = useState(0);
    const [isConnected, setIsConnected] = useState(false);
    const logsEndRef = useRef<HTMLDivElement>(null);

    // WebSocket Connection
    useEffect(() => {
        let ws: WebSocket;
        let reconnectTimer: NodeJS.Timeout;

        const connect = () => {
            if (status === "idle" || status === "stopped") return;

            // Direct connection to backend (bypass Next.js proxy which causes frame errors)
            ws = new WebSocket("ws://localhost:4000/ws/stream");

            ws.onopen = () => {
                setIsConnected(true);
                addLog("Connected to agent stream.");
            };

            ws.onmessage = (event) => {
                try {
                    const data = JSON.parse(event.data);
                    if (data.type === "screenshot" && data.image) {
                        setCurrentMockIndex(-1); // Switch to real stream mode
                        // Update an image ref or state directly for performance
                        // For simply React state:
                        const img = document.getElementById("live-stream-img") as HTMLImageElement;
                        if (img) img.src = `data:image/jpeg;base64,${data.image}`;
                    } else if (data.type === "log") {
                        addLog(data.message);
                    }
                } catch (e) {
                    // ignore parse errors
                }
            };

            ws.onclose = () => {
                setIsConnected(false);
                if (status === "running") {
                    addLog("Stream disconnected. Retrying...");
                    reconnectTimer = setTimeout(connect, 3000);
                }
            };
        };

        if (status === "running") {
            connect();
        }

        return () => {
            if (ws) ws.close();
            clearTimeout(reconnectTimer);
        };
    }, [status]);


    // Keep simulation as fallback if not connected
    useEffect(() => {
        if (status === "running" && !isConnected) {
            const interval = setInterval(() => {
                setCurrentMockIndex((prev) => (prev + 1) % MOCK_SCREENS.length);
            }, 3000);
            return () => clearInterval(interval);
        }
    }, [status, isConnected]);

    const addLog = (message: string) => {
        setLogs((prev) => [...prev.slice(-49), `[${new Date().toLocaleTimeString()}] ${message}`]);
    };

    // Auto-scroll logs
    useEffect(() => {
        logsEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [logs]);

    const handleStart = () => {
        setStatus("running");
        addLog("Agent Started. Initializing browser...");

        fetch('/api/agents/start/feedWarmer', { method: 'POST' })
            .then(async (res) => {
                const data = await res.json();
                if (res.ok) {
                    addLog(`Agent launched (PID: ${data.pid})`);
                } else if (res.status === 400 && data.message.includes("already running")) {
                    addLog("Agent is already active. Reconnecting stream...");
                } else {
                    throw new Error(data.message || "Failed to start");
                }
            })
            .catch(err => {
                addLog(`Error: ${err.message}`);
                // Optional: setStatus("idle") if we want to force reset, but better to stay in possible running state
            });
    };

    const handlePause = () => {
        setStatus("paused");
        addLog("Agent Paused.");
        fetch('/api/agents/stop-all', { method: 'POST' })
            .catch(err => addLog(`Failed to pause: ${err}`));
    };

    const handleStop = () => {
        setStatus("stopped");
        addLog("Agent Stopped. Browser context closed.");
        fetch('/api/agents/stop-all', { method: 'POST' })
            .catch(err => addLog(`Failed to stop: ${err}`));
        setTimeout(() => setStatus("idle"), 2000);
    };

    return (
        <div className="flex flex-col gap-6 w-full max-w-6xl mx-auto p-4">
            {/* Viewport */}
            <div className="relative aspect-video w-full rounded-xl overflow-hidden border border-slate-700 bg-slate-950 shadow-2xl">
                {/* Status Overlay */}
                <div className="absolute top-4 right-4 z-20 flex items-center gap-2 px-3 py-1.5 rounded-full bg-black/60 backdrop-blur-md border border-white/10">
                    <div className={cn("w-2.5 h-2.5 rounded-full animate-pulse", {
                        "bg-green-500": status === "running",
                        "bg-amber-500": status === "paused",
                        "bg-red-500": status === "stopped" || status === "idle",
                    })} />
                    <span className="text-xs font-medium text-white uppercase tracking-wider">{status}</span>
                </div>

                {/* Stream Content */}
                <div className="w-full h-full flex items-center justify-center bg-slate-900">
                    {status === "idle" ? (
                        <div className="text-center space-y-4">
                            <div className="w-20 h-20 bg-slate-800 rounded-full flex items-center justify-center mx-auto">
                                <MonitorPlay className="w-10 h-10 text-slate-500" />
                            </div>
                            <p className="text-slate-400">Agent is effective offline</p>
                        </div>
                    ) : isConnected ? (
                        <img
                            id="live-stream-img"
                            alt="Realtime Agent Stream"
                            className="w-full h-full object-contain"
                        />
                    ) : (
                        <>
                            <AnimatePresence mode="wait">
                                <motion.img
                                    key={currentMockIndex}
                                    src={MOCK_SCREENS[currentMockIndex]}
                                    alt="Live View Simulation"
                                    className="w-full h-full object-cover"
                                    initial={{ opacity: 0.8 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0.8 }}
                                    transition={{ duration: 0.5 }}
                                />
                            </AnimatePresence>
                            <div className="absolute bottom-4 left-4 z-10 bg-black/50 text-white text-xs px-2 py-1 rounded">Simulation Mode (Connecting...)</div>
                        </>
                    )}
                </div>
            </div>

            {/* Command Deck */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Controls */}
                <div className="md:col-span-2 p-6 rounded-xl border border-slate-800 bg-slate-900/50 backdrop-blur-sm">
                    <h3 className="text-lg font-semibold text-slate-100 mb-4 flex items-center gap-2">
                        <Terminal className="w-5 h-5 text-[#ff3b3b]" />
                        Command Deck
                    </h3>
                    <div className="flex flex-wrap gap-3">
                        <button
                            onClick={handleStart}
                            disabled={status === "running"}
                            className="flex items-center gap-2 px-6 py-2.5 rounded-lg bg-green-600 hover:bg-green-500 text-white font-medium disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                        >
                            <Play className="w-4 h-4" /> Start Feed Warmer
                        </button>
                        <button
                            onClick={handlePause}
                            disabled={status !== "running"}
                            className="flex items-center gap-2 px-6 py-2.5 rounded-lg bg-amber-600 hover:bg-amber-500 text-white font-medium disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                        >
                            <Pause className="w-4 h-4" /> Pause
                        </button>
                        <button
                            onClick={handleStop}
                            disabled={status === "idle"}
                            className="flex items-center gap-2 px-6 py-2.5 rounded-lg bg-red-600 hover:bg-red-500 text-white font-medium disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                        >
                            <Square className="w-4 h-4" /> Emergency Stop
                        </button>
                    </div>
                </div>

                {/* Logs */}
                <div className="p-4 rounded-xl border border-slate-800 bg-black font-mono text-xs">
                    <div className="flex items-center justify-between mb-2 text-slate-400 border-b border-slate-800 pb-2">
                        <span>Terminal Output</span>
                        <div className="flex gap-1.5">
                            <div className="w-2.5 h-2.5 rounded-full bg-red-500/20"></div>
                            <div className="w-2.5 h-2.5 rounded-full bg-amber-500/20"></div>
                            <div className="w-2.5 h-2.5 rounded-full bg-green-500/20"></div>
                        </div>
                    </div>
                    <div className="h-[120px] overflow-y-auto space-y-1 scrollbar-thin scrollbar-thumb-slate-700 scrollbar-track-transparent pr-2">
                        {logs.length === 0 && <span className="text-slate-600 italic">No active logs...</span>}
                        {logs.map((log, i) => (
                            <div key={i} className="text-green-400/80">{log}</div>
                        ))}
                        <div ref={logsEndRef} />
                    </div>
                </div>
            </div>
        </div>
    );
}

// Temporary Button Component in case shadcn isn't ready
// function Button({ className, ...props }: React.ButtonHTMLAttributes<HTMLButtonElement>) {
//     return <button className={cn("px-4 py-2 rounded-md", className)} {...props} />
// }
