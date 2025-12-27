module.exports = [
"[project]/OneDrive/Desktop/n8n/Playwrite/frontend-dashboard/lib/store.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "useAgentStore",
    ()=>useAgentStore
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$n8n$2f$Playwrite$2f$frontend$2d$dashboard$2f$node_modules$2f$zustand$2f$esm$2f$react$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/OneDrive/Desktop/n8n/Playwrite/frontend-dashboard/node_modules/zustand/esm/react.mjs [app-ssr] (ecmascript)");
;
const useAgentStore = (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$n8n$2f$Playwrite$2f$frontend$2d$dashboard$2f$node_modules$2f$zustand$2f$esm$2f$react$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["create"])((set, get)=>({
        agentStatus: {
            feedWarmer: 'stopped',
            leadCampaign: 'stopped',
            connectionChecker: 'stopped',
            allAgents: 'stopped'
        },
        logs: [],
        stats: {
            leadsProcessed: 0,
            connectionsSent: 0,
            connectionsAccepted: 0,
            postsEngaged: 0,
            successRate: 0
        },
        isConnected: false,
        setAgentStatus: (agent, status)=>set((state)=>({
                    agentStatus: {
                        ...state.agentStatus,
                        [agent]: status
                    }
                })),
        addLog: (message, type, agent)=>set((state)=>({
                    logs: [
                        {
                            id: Date.now().toString(),
                            timestamp: new Date().toLocaleTimeString(),
                            message,
                            type,
                            agent
                        },
                        ...state.logs
                    ].slice(0, 100)
                })),
        clearLogs: ()=>set({
                logs: []
            }),
        updateStats: (newStats)=>set((state)=>({
                    stats: {
                        ...state.stats,
                        ...newStats
                    }
                })),
        setConnected: (connected)=>set({
                isConnected: connected
            }),
        startAgent: async (agent)=>{
            try {
                const res = await fetch(`/api/agents/start/${agent}`, {
                    method: 'POST'
                });
                if (res.ok) {
                    set((state)=>({
                            agentStatus: {
                                ...state.agentStatus,
                                [agent]: 'running'
                            }
                        }));
                    get().addLog(`${agent} started`, 'success', agent);
                }
            } catch (error) {
                get().addLog(`Failed to start ${agent}`, 'error', 'system');
            }
        },
        stopAgent: async (agent)=>{
            try {
                const res = await fetch(`/api/agents/stop/${agent}`, {
                    method: 'POST'
                });
                if (res.ok) {
                    set((state)=>({
                            agentStatus: {
                                ...state.agentStatus,
                                [agent]: 'stopped'
                            }
                        }));
                    get().addLog(`${agent} stopped`, 'info', agent);
                }
            } catch (error) {
                get().addLog(`Failed to stop ${agent}`, 'error', 'system');
            }
        },
        stopAllAgents: async ()=>{
            try {
                await fetch('/api/agents/stop-all', {
                    method: 'POST'
                });
                set({
                    agentStatus: {
                        feedWarmer: 'stopped',
                        leadCampaign: 'stopped',
                        connectionChecker: 'stopped',
                        allAgents: 'stopped'
                    }
                });
                get().addLog('All agents stopped', 'warning', 'system');
            } catch (error) {
                get().addLog('Failed to stop agents', 'error', 'system');
            }
        },
        syncLogs: async ()=>{
            try {
                const res = await fetch('/api/logs?limit=100');
                if (res.ok) {
                    const data = await res.json();
                    if (data.logs) {
                        set({
                            logs: data.logs
                        });
                    }
                }
            } catch  {
            // Ignore sync errors
            }
        },
        syncStatus: async ()=>{
            try {
                const res = await fetch('/api/agents/status');
                if (res.ok) {
                    const data = await res.json();
                    set({
                        agentStatus: data.agents || get().agentStatus,
                        isConnected: true
                    });
                }
            } catch  {
                set({
                    isConnected: false
                });
            }
        }
    }));
}),
"[project]/OneDrive/Desktop/n8n/Playwrite/frontend-dashboard/components/dashboard/StatsCard.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>StatsCard
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$n8n$2f$Playwrite$2f$frontend$2d$dashboard$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/OneDrive/Desktop/n8n/Playwrite/frontend-dashboard/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$n8n$2f$Playwrite$2f$frontend$2d$dashboard$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/OneDrive/Desktop/n8n/Playwrite/frontend-dashboard/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$n8n$2f$Playwrite$2f$frontend$2d$dashboard$2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/OneDrive/Desktop/n8n/Playwrite/frontend-dashboard/node_modules/framer-motion/dist/es/render/components/motion/proxy.mjs [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$n8n$2f$Playwrite$2f$frontend$2d$dashboard$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$arrow$2d$up$2d$right$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__ArrowUpRight$3e$__ = __turbopack_context__.i("[project]/OneDrive/Desktop/n8n/Playwrite/frontend-dashboard/node_modules/lucide-react/dist/esm/icons/arrow-up-right.js [app-ssr] (ecmascript) <export default as ArrowUpRight>");
"use client";
;
;
;
;
// --- Sub-components ---
function AnimatedCounter({ value, suffix = "" }) {
    const [displayValue, setDisplayValue] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$n8n$2f$Playwrite$2f$frontend$2d$dashboard$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(0);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$n8n$2f$Playwrite$2f$frontend$2d$dashboard$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        const duration = 1000;
        const steps = 30;
        const increment = value / steps;
        let current = 0;
        // Reset if value is 0 or less
        if (value <= 0) {
            setDisplayValue(0);
            return;
        }
        const timer = setInterval(()=>{
            current += increment;
            if (current >= value) {
                setDisplayValue(value);
                clearInterval(timer);
            } else {
                setDisplayValue(Math.floor(current));
            }
        }, duration / steps);
        return ()=>clearInterval(timer);
    }, [
        value
    ]);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$n8n$2f$Playwrite$2f$frontend$2d$dashboard$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
        children: [
            displayValue.toLocaleString(),
            suffix
        ]
    }, void 0, true, {
        fileName: "[project]/OneDrive/Desktop/n8n/Playwrite/frontend-dashboard/components/dashboard/StatsCard.tsx",
        lineNumber: 37,
        columnNumber: 12
    }, this);
}
function Sparkline({ data, color }) {
    if (!data || data.length === 0) return null;
    const max = Math.max(...data);
    const min = Math.min(...data);
    const range = max - min || 1;
    // Normalize points to viewbox 100x30
    const points = data.map((v, i)=>{
        const x = i / (data.length - 1) * 100;
        const y = 30 - (v - min) / range * 25; // Keep slightly away from bottom/top
        return `${x},${y}`;
    }).join(" L ");
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$n8n$2f$Playwrite$2f$frontend$2d$dashboard$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
        viewBox: "0 0 100 30",
        className: "w-16 h-6 md:w-20 md:h-8 overflow-visible opacity-80",
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$n8n$2f$Playwrite$2f$frontend$2d$dashboard$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
            d: `M ${points}`,
            fill: "none",
            stroke: color,
            strokeWidth: "2.5",
            strokeLinecap: "round",
            strokeLinejoin: "round"
        }, void 0, false, {
            fileName: "[project]/OneDrive/Desktop/n8n/Playwrite/frontend-dashboard/components/dashboard/StatsCard.tsx",
            lineNumber: 57,
            columnNumber: 13
        }, this)
    }, void 0, false, {
        fileName: "[project]/OneDrive/Desktop/n8n/Playwrite/frontend-dashboard/components/dashboard/StatsCard.tsx",
        lineNumber: 56,
        columnNumber: 9
    }, this);
}
function StatsCard({ label, value, suffix, icon: Icon, color, trend, sparklineData, delay = 0 }) {
    // Extract primary 'from' color for sparkline stroke if possible, else default to green
    // Simplistic extraction: defaults to a bright green if not easily parsed, 
    // but we can pass a specific HEX if needed. For now hardcode nice green or white.
    const sparkColor = "#4ade80"; // green-400
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$n8n$2f$Playwrite$2f$frontend$2d$dashboard$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$n8n$2f$Playwrite$2f$frontend$2d$dashboard$2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["motion"].div, {
        initial: {
            opacity: 0,
            y: 20
        },
        animate: {
            opacity: 1,
            y: 0
        },
        transition: {
            delay
        },
        className: "glass-card card-hover rounded-xl p-3 md:p-5 relative overflow-hidden group border border-white/5",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$n8n$2f$Playwrite$2f$frontend$2d$dashboard$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: `absolute top-0 right-0 w-24 h-24 md:w-32 md:h-32 bg-linear-to-br ${color} opacity-10 blur-2xl group-hover:opacity-20 transition-opacity duration-500`
            }, void 0, false, {
                fileName: "[project]/OneDrive/Desktop/n8n/Playwrite/frontend-dashboard/components/dashboard/StatsCard.tsx",
                lineNumber: 105,
                columnNumber: 13
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$n8n$2f$Playwrite$2f$frontend$2d$dashboard$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "relative z-10",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$n8n$2f$Playwrite$2f$frontend$2d$dashboard$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex items-start justify-between mb-2 md:mb-3",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$n8n$2f$Playwrite$2f$frontend$2d$dashboard$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: `p-1.5 md:p-2.5 rounded-lg md:rounded-xl bg-linear-to-br ${color} shadow-lg shadow-black/20`,
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$n8n$2f$Playwrite$2f$frontend$2d$dashboard$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(Icon, {
                                    className: "w-4 h-4 md:w-5 md:h-5 text-white"
                                }, void 0, false, {
                                    fileName: "[project]/OneDrive/Desktop/n8n/Playwrite/frontend-dashboard/components/dashboard/StatsCard.tsx",
                                    lineNumber: 115,
                                    columnNumber: 25
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/OneDrive/Desktop/n8n/Playwrite/frontend-dashboard/components/dashboard/StatsCard.tsx",
                                lineNumber: 112,
                                columnNumber: 21
                            }, this),
                            trend && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$n8n$2f$Playwrite$2f$frontend$2d$dashboard$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex items-center gap-0.5 text-xs font-medium text-green-400 bg-green-500/10 px-1.5 py-0.5 rounded-md border border-green-500/20 backdrop-blur-sm",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$n8n$2f$Playwrite$2f$frontend$2d$dashboard$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$n8n$2f$Playwrite$2f$frontend$2d$dashboard$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$arrow$2d$up$2d$right$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__ArrowUpRight$3e$__["ArrowUpRight"], {
                                        className: "w-3 h-3"
                                    }, void 0, false, {
                                        fileName: "[project]/OneDrive/Desktop/n8n/Playwrite/frontend-dashboard/components/dashboard/StatsCard.tsx",
                                        lineNumber: 121,
                                        columnNumber: 29
                                    }, this),
                                    trend
                                ]
                            }, void 0, true, {
                                fileName: "[project]/OneDrive/Desktop/n8n/Playwrite/frontend-dashboard/components/dashboard/StatsCard.tsx",
                                lineNumber: 120,
                                columnNumber: 25
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/OneDrive/Desktop/n8n/Playwrite/frontend-dashboard/components/dashboard/StatsCard.tsx",
                        lineNumber: 110,
                        columnNumber: 17
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$n8n$2f$Playwrite$2f$frontend$2d$dashboard$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "text-xs md:text-sm text-gray-400 mb-0.5 font-medium tracking-wide",
                        children: label
                    }, void 0, false, {
                        fileName: "[project]/OneDrive/Desktop/n8n/Playwrite/frontend-dashboard/components/dashboard/StatsCard.tsx",
                        lineNumber: 128,
                        columnNumber: 17
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$n8n$2f$Playwrite$2f$frontend$2d$dashboard$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex items-end justify-between",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$n8n$2f$Playwrite$2f$frontend$2d$dashboard$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "text-xl md:text-3xl font-bold text-gray-100 tracking-tight",
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$n8n$2f$Playwrite$2f$frontend$2d$dashboard$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(AnimatedCounter, {
                                    value: value,
                                    suffix: suffix
                                }, void 0, false, {
                                    fileName: "[project]/OneDrive/Desktop/n8n/Playwrite/frontend-dashboard/components/dashboard/StatsCard.tsx",
                                    lineNumber: 135,
                                    columnNumber: 25
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/OneDrive/Desktop/n8n/Playwrite/frontend-dashboard/components/dashboard/StatsCard.tsx",
                                lineNumber: 134,
                                columnNumber: 21
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$n8n$2f$Playwrite$2f$frontend$2d$dashboard$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(Sparkline, {
                                data: sparklineData,
                                color: sparkColor
                            }, void 0, false, {
                                fileName: "[project]/OneDrive/Desktop/n8n/Playwrite/frontend-dashboard/components/dashboard/StatsCard.tsx",
                                lineNumber: 137,
                                columnNumber: 21
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/OneDrive/Desktop/n8n/Playwrite/frontend-dashboard/components/dashboard/StatsCard.tsx",
                        lineNumber: 133,
                        columnNumber: 17
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/OneDrive/Desktop/n8n/Playwrite/frontend-dashboard/components/dashboard/StatsCard.tsx",
                lineNumber: 109,
                columnNumber: 13
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/OneDrive/Desktop/n8n/Playwrite/frontend-dashboard/components/dashboard/StatsCard.tsx",
        lineNumber: 98,
        columnNumber: 9
    }, this);
}
}),
"[project]/OneDrive/Desktop/n8n/Playwrite/frontend-dashboard/components/dashboard/ActivityFeed.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>ActivityFeed
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$n8n$2f$Playwrite$2f$frontend$2d$dashboard$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/OneDrive/Desktop/n8n/Playwrite/frontend-dashboard/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$n8n$2f$Playwrite$2f$frontend$2d$dashboard$2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/OneDrive/Desktop/n8n/Playwrite/frontend-dashboard/node_modules/framer-motion/dist/es/render/components/motion/proxy.mjs [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$n8n$2f$Playwrite$2f$frontend$2d$dashboard$2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$components$2f$AnimatePresence$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/OneDrive/Desktop/n8n/Playwrite/frontend-dashboard/node_modules/framer-motion/dist/es/components/AnimatePresence/index.mjs [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$n8n$2f$Playwrite$2f$frontend$2d$dashboard$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$clock$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Clock$3e$__ = __turbopack_context__.i("[project]/OneDrive/Desktop/n8n/Playwrite/frontend-dashboard/node_modules/lucide-react/dist/esm/icons/clock.js [app-ssr] (ecmascript) <export default as Clock>");
var __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$n8n$2f$Playwrite$2f$frontend$2d$dashboard$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$activity$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Activity$3e$__ = __turbopack_context__.i("[project]/OneDrive/Desktop/n8n/Playwrite/frontend-dashboard/node_modules/lucide-react/dist/esm/icons/activity.js [app-ssr] (ecmascript) <export default as Activity>");
var __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$n8n$2f$Playwrite$2f$frontend$2d$dashboard$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$heart$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Heart$3e$__ = __turbopack_context__.i("[project]/OneDrive/Desktop/n8n/Playwrite/frontend-dashboard/node_modules/lucide-react/dist/esm/icons/heart.js [app-ssr] (ecmascript) <export default as Heart>");
var __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$n8n$2f$Playwrite$2f$frontend$2d$dashboard$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$message$2d$square$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__MessageSquare$3e$__ = __turbopack_context__.i("[project]/OneDrive/Desktop/n8n/Playwrite/frontend-dashboard/node_modules/lucide-react/dist/esm/icons/message-square.js [app-ssr] (ecmascript) <export default as MessageSquare>");
var __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$n8n$2f$Playwrite$2f$frontend$2d$dashboard$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$send$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Send$3e$__ = __turbopack_context__.i("[project]/OneDrive/Desktop/n8n/Playwrite/frontend-dashboard/node_modules/lucide-react/dist/esm/icons/send.js [app-ssr] (ecmascript) <export default as Send>");
var __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$n8n$2f$Playwrite$2f$frontend$2d$dashboard$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$target$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Target$3e$__ = __turbopack_context__.i("[project]/OneDrive/Desktop/n8n/Playwrite/frontend-dashboard/node_modules/lucide-react/dist/esm/icons/target.js [app-ssr] (ecmascript) <export default as Target>");
"use client";
;
;
;
// --- Icon & Color Mapping ---
const actionIcons = {
    like: __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$n8n$2f$Playwrite$2f$frontend$2d$dashboard$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$heart$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Heart$3e$__["Heart"],
    comment: __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$n8n$2f$Playwrite$2f$frontend$2d$dashboard$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$message$2d$square$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__MessageSquare$3e$__["MessageSquare"],
    connection: __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$n8n$2f$Playwrite$2f$frontend$2d$dashboard$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$send$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Send$3e$__["Send"],
    view: __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$n8n$2f$Playwrite$2f$frontend$2d$dashboard$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$target$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Target$3e$__["Target"],
    other: __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$n8n$2f$Playwrite$2f$frontend$2d$dashboard$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$activity$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Activity$3e$__["Activity"]
};
const typeStyles = {
    like: {
        bg: "bg-rose-500/10",
        text: "text-rose-500"
    },
    comment: {
        bg: "bg-blue-500/10",
        text: "text-blue-500"
    },
    connection: {
        bg: "bg-orange-500/10",
        text: "text-orange-500"
    },
    view: {
        bg: "bg-purple-500/10",
        text: "text-purple-500"
    },
    other: {
        bg: "bg-gray-500/10",
        text: "text-gray-400"
    }
};
function ActivityFeed({ activities, title = "Recent Activity", delay = 0.6 }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$n8n$2f$Playwrite$2f$frontend$2d$dashboard$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$n8n$2f$Playwrite$2f$frontend$2d$dashboard$2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["motion"].div, {
        initial: {
            opacity: 0,
            y: 20
        },
        animate: {
            opacity: 1,
            y: 0
        },
        transition: {
            delay
        },
        className: "glass-card rounded-xl p-4 md:p-6 border border-white/5 h-full",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$n8n$2f$Playwrite$2f$frontend$2d$dashboard$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex items-center justify-between mb-3 md:mb-4",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$n8n$2f$Playwrite$2f$frontend$2d$dashboard$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                        className: "text-base md:text-lg font-semibold text-gray-200 tracking-tight",
                        children: title
                    }, void 0, false, {
                        fileName: "[project]/OneDrive/Desktop/n8n/Playwrite/frontend-dashboard/components/dashboard/ActivityFeed.tsx",
                        lineNumber: 50,
                        columnNumber: 17
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$n8n$2f$Playwrite$2f$frontend$2d$dashboard$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$n8n$2f$Playwrite$2f$frontend$2d$dashboard$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$clock$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Clock$3e$__["Clock"], {
                        className: "w-4 h-4 md:w-5 md:h-5 text-gray-600"
                    }, void 0, false, {
                        fileName: "[project]/OneDrive/Desktop/n8n/Playwrite/frontend-dashboard/components/dashboard/ActivityFeed.tsx",
                        lineNumber: 51,
                        columnNumber: 17
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/OneDrive/Desktop/n8n/Playwrite/frontend-dashboard/components/dashboard/ActivityFeed.tsx",
                lineNumber: 49,
                columnNumber: 13
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$n8n$2f$Playwrite$2f$frontend$2d$dashboard$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "space-y-2 md:space-y-3",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$n8n$2f$Playwrite$2f$frontend$2d$dashboard$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$n8n$2f$Playwrite$2f$frontend$2d$dashboard$2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$components$2f$AnimatePresence$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["AnimatePresence"], {
                    mode: "popLayout",
                    children: activities.length > 0 ? activities.slice(0, 5).map((item, idx)=>{
                        const Icon = actionIcons[item.type] || actionIcons['other'];
                        const style = typeStyles[item.type] || typeStyles['other'];
                        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$n8n$2f$Playwrite$2f$frontend$2d$dashboard$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$n8n$2f$Playwrite$2f$frontend$2d$dashboard$2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["motion"].div, {
                            layout: true,
                            initial: {
                                opacity: 0,
                                x: -20
                            },
                            animate: {
                                opacity: 1,
                                x: 0
                            },
                            exit: {
                                opacity: 0,
                                x: 20
                            },
                            transition: {
                                delay: idx * 0.05
                            },
                            className: "flex items-center justify-between p-3 md:p-4 bg-white/5 rounded-lg hover:bg-white/10 transition-colors border border-transparent hover:border-white/5 group",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$n8n$2f$Playwrite$2f$frontend$2d$dashboard$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "flex items-center gap-3 md:gap-4 min-w-0",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$n8n$2f$Playwrite$2f$frontend$2d$dashboard$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: `p-1.5 md:p-2 rounded-lg shrink-0 ${style.bg}`,
                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$n8n$2f$Playwrite$2f$frontend$2d$dashboard$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(Icon, {
                                                className: `w-3.5 h-3.5 md:w-4 md:h-4 ${style.text}`
                                            }, void 0, false, {
                                                fileName: "[project]/OneDrive/Desktop/n8n/Playwrite/frontend-dashboard/components/dashboard/ActivityFeed.tsx",
                                                lineNumber: 73,
                                                columnNumber: 45
                                            }, this)
                                        }, void 0, false, {
                                            fileName: "[project]/OneDrive/Desktop/n8n/Playwrite/frontend-dashboard/components/dashboard/ActivityFeed.tsx",
                                            lineNumber: 72,
                                            columnNumber: 41
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$n8n$2f$Playwrite$2f$frontend$2d$dashboard$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "min-w-0 flex flex-col",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$n8n$2f$Playwrite$2f$frontend$2d$dashboard$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    className: "font-medium text-xs md:text-sm text-gray-200 group-hover:text-white transition-colors truncate",
                                                    children: item.action
                                                }, void 0, false, {
                                                    fileName: "[project]/OneDrive/Desktop/n8n/Playwrite/frontend-dashboard/components/dashboard/ActivityFeed.tsx",
                                                    lineNumber: 76,
                                                    columnNumber: 45
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$n8n$2f$Playwrite$2f$frontend$2d$dashboard$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    className: "text-gray-500 text-xs md:text-sm truncate",
                                                    children: item.target ? `— ${item.target}` : ""
                                                }, void 0, false, {
                                                    fileName: "[project]/OneDrive/Desktop/n8n/Playwrite/frontend-dashboard/components/dashboard/ActivityFeed.tsx",
                                                    lineNumber: 79,
                                                    columnNumber: 45
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/OneDrive/Desktop/n8n/Playwrite/frontend-dashboard/components/dashboard/ActivityFeed.tsx",
                                            lineNumber: 75,
                                            columnNumber: 41
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/OneDrive/Desktop/n8n/Playwrite/frontend-dashboard/components/dashboard/ActivityFeed.tsx",
                                    lineNumber: 71,
                                    columnNumber: 37
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$n8n$2f$Playwrite$2f$frontend$2d$dashboard$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    className: "text-xs text-gray-500 shrink-0 ml-2 font-mono whitespace-nowrap",
                                    children: item.time
                                }, void 0, false, {
                                    fileName: "[project]/OneDrive/Desktop/n8n/Playwrite/frontend-dashboard/components/dashboard/ActivityFeed.tsx",
                                    lineNumber: 84,
                                    columnNumber: 37
                                }, this)
                            ]
                        }, item.id, true, {
                            fileName: "[project]/OneDrive/Desktop/n8n/Playwrite/frontend-dashboard/components/dashboard/ActivityFeed.tsx",
                            lineNumber: 62,
                            columnNumber: 33
                        }, this);
                    }) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$n8n$2f$Playwrite$2f$frontend$2d$dashboard$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$n8n$2f$Playwrite$2f$frontend$2d$dashboard$2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["motion"].div, {
                        initial: {
                            opacity: 0
                        },
                        animate: {
                            opacity: 1
                        },
                        className: "flex flex-col items-center justify-center py-8 text-gray-500 space-y-2",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$n8n$2f$Playwrite$2f$frontend$2d$dashboard$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$n8n$2f$Playwrite$2f$frontend$2d$dashboard$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$activity$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Activity$3e$__["Activity"], {
                                className: "w-8 h-8 opacity-20"
                            }, void 0, false, {
                                fileName: "[project]/OneDrive/Desktop/n8n/Playwrite/frontend-dashboard/components/dashboard/ActivityFeed.tsx",
                                lineNumber: 96,
                                columnNumber: 29
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$n8n$2f$Playwrite$2f$frontend$2d$dashboard$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "text-sm",
                                children: "No activity recorded yet"
                            }, void 0, false, {
                                fileName: "[project]/OneDrive/Desktop/n8n/Playwrite/frontend-dashboard/components/dashboard/ActivityFeed.tsx",
                                lineNumber: 97,
                                columnNumber: 29
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/OneDrive/Desktop/n8n/Playwrite/frontend-dashboard/components/dashboard/ActivityFeed.tsx",
                        lineNumber: 91,
                        columnNumber: 25
                    }, this)
                }, void 0, false, {
                    fileName: "[project]/OneDrive/Desktop/n8n/Playwrite/frontend-dashboard/components/dashboard/ActivityFeed.tsx",
                    lineNumber: 55,
                    columnNumber: 17
                }, this)
            }, void 0, false, {
                fileName: "[project]/OneDrive/Desktop/n8n/Playwrite/frontend-dashboard/components/dashboard/ActivityFeed.tsx",
                lineNumber: 54,
                columnNumber: 13
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/OneDrive/Desktop/n8n/Playwrite/frontend-dashboard/components/dashboard/ActivityFeed.tsx",
        lineNumber: 43,
        columnNumber: 9
    }, this);
}
}),
"[project]/OneDrive/Desktop/n8n/Playwrite/frontend-dashboard/components/dashboard/AnalyticsChart.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>AnalyticsChart
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$n8n$2f$Playwrite$2f$frontend$2d$dashboard$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/OneDrive/Desktop/n8n/Playwrite/frontend-dashboard/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$n8n$2f$Playwrite$2f$frontend$2d$dashboard$2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/OneDrive/Desktop/n8n/Playwrite/frontend-dashboard/node_modules/framer-motion/dist/es/render/components/motion/proxy.mjs [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$n8n$2f$Playwrite$2f$frontend$2d$dashboard$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chart$2d$column$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__BarChart3$3e$__ = __turbopack_context__.i("[project]/OneDrive/Desktop/n8n/Playwrite/frontend-dashboard/node_modules/lucide-react/dist/esm/icons/chart-column.js [app-ssr] (ecmascript) <export default as BarChart3>");
var __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$n8n$2f$Playwrite$2f$frontend$2d$dashboard$2f$node_modules$2f$recharts$2f$es6$2f$chart$2f$AreaChart$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/OneDrive/Desktop/n8n/Playwrite/frontend-dashboard/node_modules/recharts/es6/chart/AreaChart.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$n8n$2f$Playwrite$2f$frontend$2d$dashboard$2f$node_modules$2f$recharts$2f$es6$2f$cartesian$2f$Area$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/OneDrive/Desktop/n8n/Playwrite/frontend-dashboard/node_modules/recharts/es6/cartesian/Area.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$n8n$2f$Playwrite$2f$frontend$2d$dashboard$2f$node_modules$2f$recharts$2f$es6$2f$cartesian$2f$XAxis$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/OneDrive/Desktop/n8n/Playwrite/frontend-dashboard/node_modules/recharts/es6/cartesian/XAxis.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$n8n$2f$Playwrite$2f$frontend$2d$dashboard$2f$node_modules$2f$recharts$2f$es6$2f$cartesian$2f$YAxis$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/OneDrive/Desktop/n8n/Playwrite/frontend-dashboard/node_modules/recharts/es6/cartesian/YAxis.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$n8n$2f$Playwrite$2f$frontend$2d$dashboard$2f$node_modules$2f$recharts$2f$es6$2f$cartesian$2f$CartesianGrid$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/OneDrive/Desktop/n8n/Playwrite/frontend-dashboard/node_modules/recharts/es6/cartesian/CartesianGrid.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$n8n$2f$Playwrite$2f$frontend$2d$dashboard$2f$node_modules$2f$recharts$2f$es6$2f$component$2f$Tooltip$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/OneDrive/Desktop/n8n/Playwrite/frontend-dashboard/node_modules/recharts/es6/component/Tooltip.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$n8n$2f$Playwrite$2f$frontend$2d$dashboard$2f$node_modules$2f$recharts$2f$es6$2f$component$2f$ResponsiveContainer$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/OneDrive/Desktop/n8n/Playwrite/frontend-dashboard/node_modules/recharts/es6/component/ResponsiveContainer.js [app-ssr] (ecmascript)");
"use client";
;
;
;
;
function AnalyticsChart({ data, title = "Weekly Activity", delay = 0.4 }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$n8n$2f$Playwrite$2f$frontend$2d$dashboard$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$n8n$2f$Playwrite$2f$frontend$2d$dashboard$2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["motion"].div, {
        initial: {
            opacity: 0,
            y: 20
        },
        animate: {
            opacity: 1,
            y: 0
        },
        transition: {
            delay
        },
        className: "glass-card rounded-xl p-4 md:p-6 border border-white/5 h-full",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$n8n$2f$Playwrite$2f$frontend$2d$dashboard$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex items-center justify-between mb-4 md:mb-6",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$n8n$2f$Playwrite$2f$frontend$2d$dashboard$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$n8n$2f$Playwrite$2f$frontend$2d$dashboard$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                className: "text-base md:text-lg font-semibold text-gray-200",
                                children: title
                            }, void 0, false, {
                                fileName: "[project]/OneDrive/Desktop/n8n/Playwrite/frontend-dashboard/components/dashboard/AnalyticsChart.tsx",
                                lineNumber: 40,
                                columnNumber: 21
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$n8n$2f$Playwrite$2f$frontend$2d$dashboard$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "text-xs md:text-sm text-gray-500 hidden sm:block",
                                children: "Engagement trends"
                            }, void 0, false, {
                                fileName: "[project]/OneDrive/Desktop/n8n/Playwrite/frontend-dashboard/components/dashboard/AnalyticsChart.tsx",
                                lineNumber: 41,
                                columnNumber: 21
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/OneDrive/Desktop/n8n/Playwrite/frontend-dashboard/components/dashboard/AnalyticsChart.tsx",
                        lineNumber: 39,
                        columnNumber: 17
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$n8n$2f$Playwrite$2f$frontend$2d$dashboard$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$n8n$2f$Playwrite$2f$frontend$2d$dashboard$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chart$2d$column$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__BarChart3$3e$__["BarChart3"], {
                        className: "w-4 h-4 md:w-5 md:h-5 text-gray-600"
                    }, void 0, false, {
                        fileName: "[project]/OneDrive/Desktop/n8n/Playwrite/frontend-dashboard/components/dashboard/AnalyticsChart.tsx",
                        lineNumber: 43,
                        columnNumber: 17
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/OneDrive/Desktop/n8n/Playwrite/frontend-dashboard/components/dashboard/AnalyticsChart.tsx",
                lineNumber: 38,
                columnNumber: 13
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$n8n$2f$Playwrite$2f$frontend$2d$dashboard$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "h-48 md:h-64 w-full",
                children: data.length > 0 ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$n8n$2f$Playwrite$2f$frontend$2d$dashboard$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$n8n$2f$Playwrite$2f$frontend$2d$dashboard$2f$node_modules$2f$recharts$2f$es6$2f$component$2f$ResponsiveContainer$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["ResponsiveContainer"], {
                    width: "100%",
                    height: "100%",
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$n8n$2f$Playwrite$2f$frontend$2d$dashboard$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$n8n$2f$Playwrite$2f$frontend$2d$dashboard$2f$node_modules$2f$recharts$2f$es6$2f$chart$2f$AreaChart$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["AreaChart"], {
                        data: data,
                        margin: {
                            top: 5,
                            right: 0,
                            left: -20,
                            bottom: 0
                        },
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$n8n$2f$Playwrite$2f$frontend$2d$dashboard$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("defs", {
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$n8n$2f$Playwrite$2f$frontend$2d$dashboard$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("linearGradient", {
                                        id: "likesGradient",
                                        x1: "0",
                                        y1: "0",
                                        x2: "0",
                                        y2: "1",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$n8n$2f$Playwrite$2f$frontend$2d$dashboard$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("stop", {
                                                offset: "5%",
                                                stopColor: "#f43f5e",
                                                stopOpacity: 0.3
                                            }, void 0, false, {
                                                fileName: "[project]/OneDrive/Desktop/n8n/Playwrite/frontend-dashboard/components/dashboard/AnalyticsChart.tsx",
                                                lineNumber: 52,
                                                columnNumber: 37
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$n8n$2f$Playwrite$2f$frontend$2d$dashboard$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("stop", {
                                                offset: "95%",
                                                stopColor: "#f43f5e",
                                                stopOpacity: 0
                                            }, void 0, false, {
                                                fileName: "[project]/OneDrive/Desktop/n8n/Playwrite/frontend-dashboard/components/dashboard/AnalyticsChart.tsx",
                                                lineNumber: 53,
                                                columnNumber: 37
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/OneDrive/Desktop/n8n/Playwrite/frontend-dashboard/components/dashboard/AnalyticsChart.tsx",
                                        lineNumber: 51,
                                        columnNumber: 33
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$n8n$2f$Playwrite$2f$frontend$2d$dashboard$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("linearGradient", {
                                        id: "commentsGradient",
                                        x1: "0",
                                        y1: "0",
                                        x2: "0",
                                        y2: "1",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$n8n$2f$Playwrite$2f$frontend$2d$dashboard$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("stop", {
                                                offset: "5%",
                                                stopColor: "#3b82f6",
                                                stopOpacity: 0.3
                                            }, void 0, false, {
                                                fileName: "[project]/OneDrive/Desktop/n8n/Playwrite/frontend-dashboard/components/dashboard/AnalyticsChart.tsx",
                                                lineNumber: 56,
                                                columnNumber: 37
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$n8n$2f$Playwrite$2f$frontend$2d$dashboard$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("stop", {
                                                offset: "95%",
                                                stopColor: "#3b82f6",
                                                stopOpacity: 0
                                            }, void 0, false, {
                                                fileName: "[project]/OneDrive/Desktop/n8n/Playwrite/frontend-dashboard/components/dashboard/AnalyticsChart.tsx",
                                                lineNumber: 57,
                                                columnNumber: 37
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/OneDrive/Desktop/n8n/Playwrite/frontend-dashboard/components/dashboard/AnalyticsChart.tsx",
                                        lineNumber: 55,
                                        columnNumber: 33
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/OneDrive/Desktop/n8n/Playwrite/frontend-dashboard/components/dashboard/AnalyticsChart.tsx",
                                lineNumber: 50,
                                columnNumber: 29
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$n8n$2f$Playwrite$2f$frontend$2d$dashboard$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$n8n$2f$Playwrite$2f$frontend$2d$dashboard$2f$node_modules$2f$recharts$2f$es6$2f$cartesian$2f$CartesianGrid$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["CartesianGrid"], {
                                strokeDasharray: "3 3",
                                stroke: "rgba(255,255,255,0.05)",
                                vertical: false
                            }, void 0, false, {
                                fileName: "[project]/OneDrive/Desktop/n8n/Playwrite/frontend-dashboard/components/dashboard/AnalyticsChart.tsx",
                                lineNumber: 60,
                                columnNumber: 29
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$n8n$2f$Playwrite$2f$frontend$2d$dashboard$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$n8n$2f$Playwrite$2f$frontend$2d$dashboard$2f$node_modules$2f$recharts$2f$es6$2f$cartesian$2f$XAxis$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["XAxis"], {
                                dataKey: "day",
                                stroke: "rgba(255,255,255,0.3)",
                                fontSize: 10,
                                axisLine: false,
                                tickLine: false,
                                dy: 10
                            }, void 0, false, {
                                fileName: "[project]/OneDrive/Desktop/n8n/Playwrite/frontend-dashboard/components/dashboard/AnalyticsChart.tsx",
                                lineNumber: 61,
                                columnNumber: 29
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$n8n$2f$Playwrite$2f$frontend$2d$dashboard$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$n8n$2f$Playwrite$2f$frontend$2d$dashboard$2f$node_modules$2f$recharts$2f$es6$2f$cartesian$2f$YAxis$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["YAxis"], {
                                stroke: "rgba(255,255,255,0.3)",
                                fontSize: 10,
                                axisLine: false,
                                tickLine: false
                            }, void 0, false, {
                                fileName: "[project]/OneDrive/Desktop/n8n/Playwrite/frontend-dashboard/components/dashboard/AnalyticsChart.tsx",
                                lineNumber: 69,
                                columnNumber: 29
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$n8n$2f$Playwrite$2f$frontend$2d$dashboard$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$n8n$2f$Playwrite$2f$frontend$2d$dashboard$2f$node_modules$2f$recharts$2f$es6$2f$component$2f$Tooltip$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Tooltip"], {
                                contentStyle: {
                                    background: "#0f172a",
                                    border: "1px solid rgba(255,255,255,0.1)",
                                    borderRadius: "8px",
                                    fontSize: "12px",
                                    color: "#fff",
                                    boxShadow: "0 10px 30px -10px rgba(0,0,0,0.5)"
                                },
                                itemStyle: {
                                    paddingBottom: 2
                                },
                                cursor: {
                                    stroke: 'rgba(255,255,255,0.1)',
                                    strokeWidth: 1
                                }
                            }, void 0, false, {
                                fileName: "[project]/OneDrive/Desktop/n8n/Playwrite/frontend-dashboard/components/dashboard/AnalyticsChart.tsx",
                                lineNumber: 75,
                                columnNumber: 29
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$n8n$2f$Playwrite$2f$frontend$2d$dashboard$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$n8n$2f$Playwrite$2f$frontend$2d$dashboard$2f$node_modules$2f$recharts$2f$es6$2f$cartesian$2f$Area$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Area"], {
                                type: "monotone",
                                dataKey: "likes",
                                stroke: "#f43f5e",
                                fill: "url(#likesGradient)",
                                strokeWidth: 3,
                                activeDot: {
                                    r: 6,
                                    strokeWidth: 0,
                                    fill: '#fff'
                                }
                            }, void 0, false, {
                                fileName: "[project]/OneDrive/Desktop/n8n/Playwrite/frontend-dashboard/components/dashboard/AnalyticsChart.tsx",
                                lineNumber: 87,
                                columnNumber: 29
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$n8n$2f$Playwrite$2f$frontend$2d$dashboard$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$n8n$2f$Playwrite$2f$frontend$2d$dashboard$2f$node_modules$2f$recharts$2f$es6$2f$cartesian$2f$Area$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Area"], {
                                type: "monotone",
                                dataKey: "comments",
                                stroke: "#3b82f6",
                                fill: "url(#commentsGradient)",
                                strokeWidth: 3,
                                activeDot: {
                                    r: 6,
                                    strokeWidth: 0,
                                    fill: '#fff'
                                }
                            }, void 0, false, {
                                fileName: "[project]/OneDrive/Desktop/n8n/Playwrite/frontend-dashboard/components/dashboard/AnalyticsChart.tsx",
                                lineNumber: 95,
                                columnNumber: 29
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/OneDrive/Desktop/n8n/Playwrite/frontend-dashboard/components/dashboard/AnalyticsChart.tsx",
                        lineNumber: 49,
                        columnNumber: 25
                    }, this)
                }, void 0, false, {
                    fileName: "[project]/OneDrive/Desktop/n8n/Playwrite/frontend-dashboard/components/dashboard/AnalyticsChart.tsx",
                    lineNumber: 48,
                    columnNumber: 21
                }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$n8n$2f$Playwrite$2f$frontend$2d$dashboard$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "h-full w-full flex items-center justify-center text-gray-500 text-sm",
                    children: "Loading chart data..."
                }, void 0, false, {
                    fileName: "[project]/OneDrive/Desktop/n8n/Playwrite/frontend-dashboard/components/dashboard/AnalyticsChart.tsx",
                    lineNumber: 106,
                    columnNumber: 21
                }, this)
            }, void 0, false, {
                fileName: "[project]/OneDrive/Desktop/n8n/Playwrite/frontend-dashboard/components/dashboard/AnalyticsChart.tsx",
                lineNumber: 46,
                columnNumber: 13
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/OneDrive/Desktop/n8n/Playwrite/frontend-dashboard/components/dashboard/AnalyticsChart.tsx",
        lineNumber: 32,
        columnNumber: 9
    }, this);
}
}),
"[project]/OneDrive/Desktop/n8n/Playwrite/frontend-dashboard/app/page.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>DashboardPage
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$n8n$2f$Playwrite$2f$frontend$2d$dashboard$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/OneDrive/Desktop/n8n/Playwrite/frontend-dashboard/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$n8n$2f$Playwrite$2f$frontend$2d$dashboard$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/OneDrive/Desktop/n8n/Playwrite/frontend-dashboard/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$n8n$2f$Playwrite$2f$frontend$2d$dashboard$2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/OneDrive/Desktop/n8n/Playwrite/frontend-dashboard/node_modules/framer-motion/dist/es/render/components/motion/proxy.mjs [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$n8n$2f$Playwrite$2f$frontend$2d$dashboard$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$trending$2d$up$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__TrendingUp$3e$__ = __turbopack_context__.i("[project]/OneDrive/Desktop/n8n/Playwrite/frontend-dashboard/node_modules/lucide-react/dist/esm/icons/trending-up.js [app-ssr] (ecmascript) <export default as TrendingUp>");
var __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$n8n$2f$Playwrite$2f$frontend$2d$dashboard$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$users$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Users$3e$__ = __turbopack_context__.i("[project]/OneDrive/Desktop/n8n/Playwrite/frontend-dashboard/node_modules/lucide-react/dist/esm/icons/users.js [app-ssr] (ecmascript) <export default as Users>");
var __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$n8n$2f$Playwrite$2f$frontend$2d$dashboard$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$heart$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Heart$3e$__ = __turbopack_context__.i("[project]/OneDrive/Desktop/n8n/Playwrite/frontend-dashboard/node_modules/lucide-react/dist/esm/icons/heart.js [app-ssr] (ecmascript) <export default as Heart>");
var __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$n8n$2f$Playwrite$2f$frontend$2d$dashboard$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$zap$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Zap$3e$__ = __turbopack_context__.i("[project]/OneDrive/Desktop/n8n/Playwrite/frontend-dashboard/node_modules/lucide-react/dist/esm/icons/zap.js [app-ssr] (ecmascript) <export default as Zap>");
var __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$n8n$2f$Playwrite$2f$frontend$2d$dashboard$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$refresh$2d$cw$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__RefreshCw$3e$__ = __turbopack_context__.i("[project]/OneDrive/Desktop/n8n/Playwrite/frontend-dashboard/node_modules/lucide-react/dist/esm/icons/refresh-cw.js [app-ssr] (ecmascript) <export default as RefreshCw>");
var __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$n8n$2f$Playwrite$2f$frontend$2d$dashboard$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$activity$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Activity$3e$__ = __turbopack_context__.i("[project]/OneDrive/Desktop/n8n/Playwrite/frontend-dashboard/node_modules/lucide-react/dist/esm/icons/activity.js [app-ssr] (ecmascript) <export default as Activity>");
var __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$n8n$2f$Playwrite$2f$frontend$2d$dashboard$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$message$2d$square$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__MessageSquare$3e$__ = __turbopack_context__.i("[project]/OneDrive/Desktop/n8n/Playwrite/frontend-dashboard/node_modules/lucide-react/dist/esm/icons/message-square.js [app-ssr] (ecmascript) <export default as MessageSquare>");
var __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$n8n$2f$Playwrite$2f$frontend$2d$dashboard$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$send$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Send$3e$__ = __turbopack_context__.i("[project]/OneDrive/Desktop/n8n/Playwrite/frontend-dashboard/node_modules/lucide-react/dist/esm/icons/send.js [app-ssr] (ecmascript) <export default as Send>");
var __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$n8n$2f$Playwrite$2f$frontend$2d$dashboard$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$target$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Target$3e$__ = __turbopack_context__.i("[project]/OneDrive/Desktop/n8n/Playwrite/frontend-dashboard/node_modules/lucide-react/dist/esm/icons/target.js [app-ssr] (ecmascript) <export default as Target>");
var __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$n8n$2f$Playwrite$2f$frontend$2d$dashboard$2f$lib$2f$store$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/OneDrive/Desktop/n8n/Playwrite/frontend-dashboard/lib/store.ts [app-ssr] (ecmascript)");
// Modular Components
var __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$n8n$2f$Playwrite$2f$frontend$2d$dashboard$2f$components$2f$dashboard$2f$StatsCard$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/OneDrive/Desktop/n8n/Playwrite/frontend-dashboard/components/dashboard/StatsCard.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$n8n$2f$Playwrite$2f$frontend$2d$dashboard$2f$components$2f$dashboard$2f$ActivityFeed$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/OneDrive/Desktop/n8n/Playwrite/frontend-dashboard/components/dashboard/ActivityFeed.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$n8n$2f$Playwrite$2f$frontend$2d$dashboard$2f$components$2f$dashboard$2f$AnalyticsChart$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/OneDrive/Desktop/n8n/Playwrite/frontend-dashboard/components/dashboard/AnalyticsChart.tsx [app-ssr] (ecmascript)");
'use client';
;
;
;
;
;
;
;
;
function DashboardPage() {
    const { stats, syncStatus, agentStatus } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$n8n$2f$Playwrite$2f$frontend$2d$dashboard$2f$lib$2f$store$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useAgentStore"])();
    const [activity, setActivity] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$n8n$2f$Playwrite$2f$frontend$2d$dashboard$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])([]);
    const [weeklyData, setWeeklyData] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$n8n$2f$Playwrite$2f$frontend$2d$dashboard$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])([]);
    const [isLoading, setIsLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$n8n$2f$Playwrite$2f$frontend$2d$dashboard$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(true);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$n8n$2f$Playwrite$2f$frontend$2d$dashboard$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        syncStatus();
        fetchData();
        const interval = setInterval(()=>{
            syncStatus();
            fetchData();
        }, 10000);
        return ()=>clearInterval(interval);
    }, []);
    const fetchData = async ()=>{
        try {
            const [activityRes, chartRes] = await Promise.all([
                fetch('/api/activity'),
                fetch('/api/charts/weekly')
            ]);
            if (activityRes.ok) {
                const data = await activityRes.json();
                setActivity(data.recent || []);
            }
            if (chartRes.ok) {
                const data = await chartRes.json();
                setWeeklyData(data.data || []);
            }
        } catch  {
            // Mock Fallback
            setActivity([
                {
                    id: 1,
                    action: 'Liked post',
                    target: 'John Smith',
                    time: '2 min ago',
                    type: 'like'
                },
                {
                    id: 2,
                    action: 'Commented',
                    target: 'Sarah Johnson',
                    time: '5 min ago',
                    type: 'comment'
                },
                {
                    id: 3,
                    action: 'Connection sent',
                    target: 'Mike Chen',
                    time: '10 min ago',
                    type: 'connection'
                }
            ]);
            setWeeklyData([
                {
                    day: 'Mon',
                    likes: 45,
                    comments: 12,
                    connections: 8
                },
                {
                    day: 'Tue',
                    likes: 52,
                    comments: 18,
                    connections: 12
                },
                {
                    day: 'Wed',
                    likes: 38,
                    comments: 15,
                    connections: 6
                },
                {
                    day: 'Thu',
                    likes: 65,
                    comments: 22,
                    connections: 15
                },
                {
                    day: 'Fri',
                    likes: 48,
                    comments: 14,
                    connections: 10
                },
                {
                    day: 'Sat',
                    likes: 30,
                    comments: 8,
                    connections: 4
                },
                {
                    day: 'Sun',
                    likes: 25,
                    comments: 6,
                    connections: 3
                }
            ]);
        }
        setIsLoading(false);
    };
    const runningAgents = Object.entries(agentStatus).filter(([_, status])=>status === 'running').length;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$n8n$2f$Playwrite$2f$frontend$2d$dashboard$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "space-y-4 md:space-y-6 p-4 md:p-6 pb-20",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$n8n$2f$Playwrite$2f$frontend$2d$dashboard$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-2",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$n8n$2f$Playwrite$2f$frontend$2d$dashboard$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$n8n$2f$Playwrite$2f$frontend$2d$dashboard$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h1", {
                                className: "text-xl md:text-3xl font-bold bg-clip-text text-transparent bg-linear-to-r from-white to-gray-400",
                                children: "Dashboard"
                            }, void 0, false, {
                                fileName: "[project]/OneDrive/Desktop/n8n/Playwrite/frontend-dashboard/app/page.tsx",
                                lineNumber: 64,
                                columnNumber: 21
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$n8n$2f$Playwrite$2f$frontend$2d$dashboard$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "text-gray-400 text-sm mt-0.5 hidden sm:block",
                                children: "LinkedIn automation overview"
                            }, void 0, false, {
                                fileName: "[project]/OneDrive/Desktop/n8n/Playwrite/frontend-dashboard/app/page.tsx",
                                lineNumber: 67,
                                columnNumber: 21
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/OneDrive/Desktop/n8n/Playwrite/frontend-dashboard/app/page.tsx",
                        lineNumber: 63,
                        columnNumber: 17
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$n8n$2f$Playwrite$2f$frontend$2d$dashboard$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex items-center gap-2 md:gap-3",
                        children: [
                            runningAgents > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$n8n$2f$Playwrite$2f$frontend$2d$dashboard$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$n8n$2f$Playwrite$2f$frontend$2d$dashboard$2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["motion"].div, {
                                initial: {
                                    opacity: 0,
                                    scale: 0.8
                                },
                                animate: {
                                    opacity: 1,
                                    scale: 1
                                },
                                className: "flex items-center gap-2 px-3 py-1.5 bg-green-500/10 border border-green-500/30 rounded-full text-xs md:text-sm shadow-lg shadow-green-900/20",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$n8n$2f$Playwrite$2f$frontend$2d$dashboard$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "w-2 h-2 rounded-full bg-green-500 animate-pulse"
                                    }, void 0, false, {
                                        fileName: "[project]/OneDrive/Desktop/n8n/Playwrite/frontend-dashboard/app/page.tsx",
                                        lineNumber: 79,
                                        columnNumber: 29
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$n8n$2f$Playwrite$2f$frontend$2d$dashboard$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "text-green-400 font-medium",
                                        children: [
                                            runningAgents,
                                            " Running"
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/OneDrive/Desktop/n8n/Playwrite/frontend-dashboard/app/page.tsx",
                                        lineNumber: 80,
                                        columnNumber: 29
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/OneDrive/Desktop/n8n/Playwrite/frontend-dashboard/app/page.tsx",
                                lineNumber: 74,
                                columnNumber: 25
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$n8n$2f$Playwrite$2f$frontend$2d$dashboard$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                onClick: fetchData,
                                className: "flex items-center gap-1.5 px-3 py-1.5 glass-card rounded-lg text-xs md:text-sm hover:bg-white/5 text-gray-300 hover:text-white transition-all",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$n8n$2f$Playwrite$2f$frontend$2d$dashboard$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$n8n$2f$Playwrite$2f$frontend$2d$dashboard$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$refresh$2d$cw$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__RefreshCw$3e$__["RefreshCw"], {
                                        className: `w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`
                                    }, void 0, false, {
                                        fileName: "[project]/OneDrive/Desktop/n8n/Playwrite/frontend-dashboard/app/page.tsx",
                                        lineNumber: 87,
                                        columnNumber: 25
                                    }, this),
                                    "Refresh"
                                ]
                            }, void 0, true, {
                                fileName: "[project]/OneDrive/Desktop/n8n/Playwrite/frontend-dashboard/app/page.tsx",
                                lineNumber: 83,
                                columnNumber: 21
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/OneDrive/Desktop/n8n/Playwrite/frontend-dashboard/app/page.tsx",
                        lineNumber: 72,
                        columnNumber: 17
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/OneDrive/Desktop/n8n/Playwrite/frontend-dashboard/app/page.tsx",
                lineNumber: 62,
                columnNumber: 13
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$n8n$2f$Playwrite$2f$frontend$2d$dashboard$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$n8n$2f$Playwrite$2f$frontend$2d$dashboard$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$n8n$2f$Playwrite$2f$frontend$2d$dashboard$2f$components$2f$dashboard$2f$StatsCard$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
                        label: "Total Leads",
                        value: stats.leadsProcessed || 156,
                        icon: __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$n8n$2f$Playwrite$2f$frontend$2d$dashboard$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$users$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Users$3e$__["Users"],
                        color: "from-blue-500 to-cyan-500",
                        trend: "+12%",
                        sparklineData: [
                            10,
                            15,
                            12,
                            18,
                            22,
                            25,
                            28
                        ],
                        delay: 0
                    }, void 0, false, {
                        fileName: "[project]/OneDrive/Desktop/n8n/Playwrite/frontend-dashboard/app/page.tsx",
                        lineNumber: 95,
                        columnNumber: 17
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$n8n$2f$Playwrite$2f$frontend$2d$dashboard$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$n8n$2f$Playwrite$2f$frontend$2d$dashboard$2f$components$2f$dashboard$2f$StatsCard$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
                        label: "Engaged Posts",
                        value: stats.postsEngaged || 423,
                        icon: __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$n8n$2f$Playwrite$2f$frontend$2d$dashboard$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$heart$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Heart$3e$__["Heart"],
                        color: "from-pink-500 to-rose-500",
                        trend: "+8%",
                        sparklineData: [
                            30,
                            35,
                            28,
                            42,
                            38,
                            45,
                            50
                        ],
                        delay: 0.1
                    }, void 0, false, {
                        fileName: "[project]/OneDrive/Desktop/n8n/Playwrite/frontend-dashboard/app/page.tsx",
                        lineNumber: 104,
                        columnNumber: 17
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$n8n$2f$Playwrite$2f$frontend$2d$dashboard$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$n8n$2f$Playwrite$2f$frontend$2d$dashboard$2f$components$2f$dashboard$2f$StatsCard$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
                        label: "Connections",
                        value: stats.connectionsAccepted || 89,
                        icon: __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$n8n$2f$Playwrite$2f$frontend$2d$dashboard$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$zap$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Zap$3e$__["Zap"],
                        color: "from-amber-500 to-orange-500",
                        trend: "+15%",
                        sparklineData: [
                            5,
                            8,
                            12,
                            10,
                            15,
                            18,
                            22
                        ],
                        delay: 0.2
                    }, void 0, false, {
                        fileName: "[project]/OneDrive/Desktop/n8n/Playwrite/frontend-dashboard/app/page.tsx",
                        lineNumber: 113,
                        columnNumber: 17
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$n8n$2f$Playwrite$2f$frontend$2d$dashboard$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$n8n$2f$Playwrite$2f$frontend$2d$dashboard$2f$components$2f$dashboard$2f$StatsCard$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
                        label: "Success Rate",
                        value: stats.successRate || 67.8,
                        suffix: "%",
                        icon: __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$n8n$2f$Playwrite$2f$frontend$2d$dashboard$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$trending$2d$up$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__TrendingUp$3e$__["TrendingUp"],
                        color: "from-green-500 to-emerald-500",
                        trend: "+2.1%",
                        sparklineData: [
                            55,
                            58,
                            62,
                            60,
                            65,
                            64,
                            68
                        ],
                        delay: 0.3
                    }, void 0, false, {
                        fileName: "[project]/OneDrive/Desktop/n8n/Playwrite/frontend-dashboard/app/page.tsx",
                        lineNumber: 122,
                        columnNumber: 17
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/OneDrive/Desktop/n8n/Playwrite/frontend-dashboard/app/page.tsx",
                lineNumber: 94,
                columnNumber: 13
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$n8n$2f$Playwrite$2f$frontend$2d$dashboard$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$n8n$2f$Playwrite$2f$frontend$2d$dashboard$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "lg:col-span-2 space-y-4 md:space-y-6 h-[400px]",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$n8n$2f$Playwrite$2f$frontend$2d$dashboard$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$n8n$2f$Playwrite$2f$frontend$2d$dashboard$2f$components$2f$dashboard$2f$AnalyticsChart$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
                            data: weeklyData,
                            delay: 0.4
                        }, void 0, false, {
                            fileName: "[project]/OneDrive/Desktop/n8n/Playwrite/frontend-dashboard/app/page.tsx",
                            lineNumber: 139,
                            columnNumber: 21
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/OneDrive/Desktop/n8n/Playwrite/frontend-dashboard/app/page.tsx",
                        lineNumber: 138,
                        columnNumber: 17
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$n8n$2f$Playwrite$2f$frontend$2d$dashboard$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "space-y-4 md:space-y-6 h-full flex flex-col",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$n8n$2f$Playwrite$2f$frontend$2d$dashboard$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$n8n$2f$Playwrite$2f$frontend$2d$dashboard$2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["motion"].div, {
                                initial: {
                                    opacity: 0,
                                    y: 20
                                },
                                animate: {
                                    opacity: 1,
                                    y: 0
                                },
                                transition: {
                                    delay: 0.5
                                },
                                className: "glass-card rounded-xl p-4 md:p-6 border border-white/5",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$n8n$2f$Playwrite$2f$frontend$2d$dashboard$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "flex items-center justify-between mb-4",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$n8n$2f$Playwrite$2f$frontend$2d$dashboard$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                                className: "text-base font-semibold text-gray-200",
                                                children: "Today's Pulse"
                                            }, void 0, false, {
                                                fileName: "[project]/OneDrive/Desktop/n8n/Playwrite/frontend-dashboard/app/page.tsx",
                                                lineNumber: 152,
                                                columnNumber: 29
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$n8n$2f$Playwrite$2f$frontend$2d$dashboard$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$n8n$2f$Playwrite$2f$frontend$2d$dashboard$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$activity$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Activity$3e$__["Activity"], {
                                                className: "w-4 h-4 text-gray-600"
                                            }, void 0, false, {
                                                fileName: "[project]/OneDrive/Desktop/n8n/Playwrite/frontend-dashboard/app/page.tsx",
                                                lineNumber: 153,
                                                columnNumber: 29
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/OneDrive/Desktop/n8n/Playwrite/frontend-dashboard/app/page.tsx",
                                        lineNumber: 151,
                                        columnNumber: 25
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$n8n$2f$Playwrite$2f$frontend$2d$dashboard$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "space-y-2",
                                        children: [
                                            {
                                                label: 'Likes',
                                                value: 48,
                                                icon: __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$n8n$2f$Playwrite$2f$frontend$2d$dashboard$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$heart$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Heart$3e$__["Heart"],
                                                color: 'text-rose-500'
                                            },
                                            {
                                                label: 'Comments',
                                                value: 12,
                                                icon: __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$n8n$2f$Playwrite$2f$frontend$2d$dashboard$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$message$2d$square$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__MessageSquare$3e$__["MessageSquare"],
                                                color: 'text-blue-500'
                                            },
                                            {
                                                label: 'Sent',
                                                value: 8,
                                                icon: __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$n8n$2f$Playwrite$2f$frontend$2d$dashboard$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$send$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Send$3e$__["Send"],
                                                color: 'text-orange-500'
                                            },
                                            {
                                                label: 'Views',
                                                value: 24,
                                                icon: __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$n8n$2f$Playwrite$2f$frontend$2d$dashboard$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$target$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Target$3e$__["Target"],
                                                color: 'text-purple-500'
                                            }
                                        ].map((item, idx)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$n8n$2f$Playwrite$2f$frontend$2d$dashboard$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "flex items-center justify-between p-2.5 bg-white/5 rounded-lg border border-transparent hover:border-white/5 transition-all",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$n8n$2f$Playwrite$2f$frontend$2d$dashboard$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "flex items-center gap-3",
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$n8n$2f$Playwrite$2f$frontend$2d$dashboard$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(item.icon, {
                                                                className: `w-4 h-4 ${item.color}`
                                                            }, void 0, false, {
                                                                fileName: "[project]/OneDrive/Desktop/n8n/Playwrite/frontend-dashboard/app/page.tsx",
                                                                lineNumber: 164,
                                                                columnNumber: 41
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$n8n$2f$Playwrite$2f$frontend$2d$dashboard$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                className: "text-sm text-gray-400",
                                                                children: item.label
                                                            }, void 0, false, {
                                                                fileName: "[project]/OneDrive/Desktop/n8n/Playwrite/frontend-dashboard/app/page.tsx",
                                                                lineNumber: 165,
                                                                columnNumber: 41
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/OneDrive/Desktop/n8n/Playwrite/frontend-dashboard/app/page.tsx",
                                                        lineNumber: 163,
                                                        columnNumber: 37
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$n8n$2f$Playwrite$2f$frontend$2d$dashboard$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        className: "font-semibold text-gray-200",
                                                        children: item.value
                                                    }, void 0, false, {
                                                        fileName: "[project]/OneDrive/Desktop/n8n/Playwrite/frontend-dashboard/app/page.tsx",
                                                        lineNumber: 167,
                                                        columnNumber: 37
                                                    }, this)
                                                ]
                                            }, item.label, true, {
                                                fileName: "[project]/OneDrive/Desktop/n8n/Playwrite/frontend-dashboard/app/page.tsx",
                                                lineNumber: 162,
                                                columnNumber: 33
                                            }, this))
                                    }, void 0, false, {
                                        fileName: "[project]/OneDrive/Desktop/n8n/Playwrite/frontend-dashboard/app/page.tsx",
                                        lineNumber: 155,
                                        columnNumber: 25
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/OneDrive/Desktop/n8n/Playwrite/frontend-dashboard/app/page.tsx",
                                lineNumber: 145,
                                columnNumber: 21
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$n8n$2f$Playwrite$2f$frontend$2d$dashboard$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex-1 min-h-[300px]",
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$n8n$2f$Playwrite$2f$frontend$2d$dashboard$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$n8n$2f$Playwrite$2f$frontend$2d$dashboard$2f$components$2f$dashboard$2f$ActivityFeed$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
                                    activities: activity,
                                    delay: 0.6
                                }, void 0, false, {
                                    fileName: "[project]/OneDrive/Desktop/n8n/Playwrite/frontend-dashboard/app/page.tsx",
                                    lineNumber: 175,
                                    columnNumber: 25
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/OneDrive/Desktop/n8n/Playwrite/frontend-dashboard/app/page.tsx",
                                lineNumber: 174,
                                columnNumber: 21
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/OneDrive/Desktop/n8n/Playwrite/frontend-dashboard/app/page.tsx",
                        lineNumber: 143,
                        columnNumber: 17
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/OneDrive/Desktop/n8n/Playwrite/frontend-dashboard/app/page.tsx",
                lineNumber: 135,
                columnNumber: 13
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/OneDrive/Desktop/n8n/Playwrite/frontend-dashboard/app/page.tsx",
        lineNumber: 60,
        columnNumber: 9
    }, this);
}
}),
];

//# sourceMappingURL=OneDrive_Desktop_n8n_Playwrite_frontend-dashboard_3decaa0d._.js.map