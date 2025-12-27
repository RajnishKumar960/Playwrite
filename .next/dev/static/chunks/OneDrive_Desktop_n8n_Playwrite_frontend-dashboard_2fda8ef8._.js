(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/OneDrive/Desktop/n8n/Playwrite/frontend-dashboard/components/dashboard/StatsCard.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>StatsCard
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$n8n$2f$Playwrite$2f$frontend$2d$dashboard$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/OneDrive/Desktop/n8n/Playwrite/frontend-dashboard/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$n8n$2f$Playwrite$2f$frontend$2d$dashboard$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/OneDrive/Desktop/n8n/Playwrite/frontend-dashboard/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$n8n$2f$Playwrite$2f$frontend$2d$dashboard$2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/OneDrive/Desktop/n8n/Playwrite/frontend-dashboard/node_modules/framer-motion/dist/es/render/components/motion/proxy.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$n8n$2f$Playwrite$2f$frontend$2d$dashboard$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$arrow$2d$up$2d$right$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ArrowUpRight$3e$__ = __turbopack_context__.i("[project]/OneDrive/Desktop/n8n/Playwrite/frontend-dashboard/node_modules/lucide-react/dist/esm/icons/arrow-up-right.js [app-client] (ecmascript) <export default as ArrowUpRight>");
;
var _s = __turbopack_context__.k.signature();
"use client";
;
;
;
// --- Sub-components ---
function AnimatedCounter({ value, suffix = "" }) {
    _s();
    const [displayValue, setDisplayValue] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$n8n$2f$Playwrite$2f$frontend$2d$dashboard$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(0);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$n8n$2f$Playwrite$2f$frontend$2d$dashboard$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "AnimatedCounter.useEffect": ()=>{
            const duration = 1000;
            const steps = 30;
            const increment = value / steps;
            let current = 0;
            // Reset if value is 0 or less
            if (value <= 0) {
                setDisplayValue(0);
                return;
            }
            const timer = setInterval({
                "AnimatedCounter.useEffect.timer": ()=>{
                    current += increment;
                    if (current >= value) {
                        setDisplayValue(value);
                        clearInterval(timer);
                    } else {
                        setDisplayValue(Math.floor(current));
                    }
                }
            }["AnimatedCounter.useEffect.timer"], duration / steps);
            return ({
                "AnimatedCounter.useEffect": ()=>clearInterval(timer)
            })["AnimatedCounter.useEffect"];
        }
    }["AnimatedCounter.useEffect"], [
        value
    ]);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$n8n$2f$Playwrite$2f$frontend$2d$dashboard$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
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
_s(AnimatedCounter, "4hUZowD5MfzMUTSh4rovgv/1zfU=");
_c = AnimatedCounter;
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
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$n8n$2f$Playwrite$2f$frontend$2d$dashboard$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
        viewBox: "0 0 100 30",
        className: "w-16 h-6 md:w-20 md:h-8 overflow-visible opacity-80",
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$n8n$2f$Playwrite$2f$frontend$2d$dashboard$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
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
_c1 = Sparkline;
function StatsCard({ label, value, suffix, icon: Icon, color, trend, sparklineData, delay = 0 }) {
    // Extract primary 'from' color for sparkline stroke if possible, else default to green
    // Simplistic extraction: defaults to a bright green if not easily parsed, 
    // but we can pass a specific HEX if needed. For now hardcode nice green or white.
    const sparkColor = "#ff3b3b"; // brand red
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$n8n$2f$Playwrite$2f$frontend$2d$dashboard$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$n8n$2f$Playwrite$2f$frontend$2d$dashboard$2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["motion"].div, {
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
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$n8n$2f$Playwrite$2f$frontend$2d$dashboard$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: `absolute top-0 right-0 w-24 h-24 md:w-32 md:h-32 bg-linear-to-br ${color} opacity-10 blur-2xl group-hover:opacity-20 transition-opacity duration-500`
            }, void 0, false, {
                fileName: "[project]/OneDrive/Desktop/n8n/Playwrite/frontend-dashboard/components/dashboard/StatsCard.tsx",
                lineNumber: 105,
                columnNumber: 13
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$n8n$2f$Playwrite$2f$frontend$2d$dashboard$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "relative z-10",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$n8n$2f$Playwrite$2f$frontend$2d$dashboard$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex items-start justify-between mb-2 md:mb-3",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$n8n$2f$Playwrite$2f$frontend$2d$dashboard$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: `p-1.5 md:p-2.5 rounded-lg md:rounded-xl bg-linear-to-br ${color} shadow-lg shadow-black/20`,
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$n8n$2f$Playwrite$2f$frontend$2d$dashboard$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(Icon, {
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
                            trend && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$n8n$2f$Playwrite$2f$frontend$2d$dashboard$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex items-center gap-0.5 text-xs font-medium text-green-400 bg-green-500/10 px-1.5 py-0.5 rounded-md border border-green-500/20 backdrop-blur-sm",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$n8n$2f$Playwrite$2f$frontend$2d$dashboard$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$n8n$2f$Playwrite$2f$frontend$2d$dashboard$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$arrow$2d$up$2d$right$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ArrowUpRight$3e$__["ArrowUpRight"], {
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
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$n8n$2f$Playwrite$2f$frontend$2d$dashboard$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "text-xs md:text-sm text-gray-400 mb-0.5 font-medium tracking-wide",
                        children: label
                    }, void 0, false, {
                        fileName: "[project]/OneDrive/Desktop/n8n/Playwrite/frontend-dashboard/components/dashboard/StatsCard.tsx",
                        lineNumber: 128,
                        columnNumber: 17
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$n8n$2f$Playwrite$2f$frontend$2d$dashboard$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex items-end justify-between",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$n8n$2f$Playwrite$2f$frontend$2d$dashboard$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "text-xl md:text-3xl font-bold text-gray-100 tracking-tight",
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$n8n$2f$Playwrite$2f$frontend$2d$dashboard$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(AnimatedCounter, {
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
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$n8n$2f$Playwrite$2f$frontend$2d$dashboard$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(Sparkline, {
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
_c2 = StatsCard;
var _c, _c1, _c2;
__turbopack_context__.k.register(_c, "AnimatedCounter");
__turbopack_context__.k.register(_c1, "Sparkline");
__turbopack_context__.k.register(_c2, "StatsCard");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/OneDrive/Desktop/n8n/Playwrite/frontend-dashboard/components/dashboard/AnalyticsChart.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>AnalyticsChart
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$n8n$2f$Playwrite$2f$frontend$2d$dashboard$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/OneDrive/Desktop/n8n/Playwrite/frontend-dashboard/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$n8n$2f$Playwrite$2f$frontend$2d$dashboard$2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/OneDrive/Desktop/n8n/Playwrite/frontend-dashboard/node_modules/framer-motion/dist/es/render/components/motion/proxy.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$n8n$2f$Playwrite$2f$frontend$2d$dashboard$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chart$2d$column$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__BarChart3$3e$__ = __turbopack_context__.i("[project]/OneDrive/Desktop/n8n/Playwrite/frontend-dashboard/node_modules/lucide-react/dist/esm/icons/chart-column.js [app-client] (ecmascript) <export default as BarChart3>");
var __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$n8n$2f$Playwrite$2f$frontend$2d$dashboard$2f$node_modules$2f$recharts$2f$es6$2f$chart$2f$AreaChart$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/OneDrive/Desktop/n8n/Playwrite/frontend-dashboard/node_modules/recharts/es6/chart/AreaChart.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$n8n$2f$Playwrite$2f$frontend$2d$dashboard$2f$node_modules$2f$recharts$2f$es6$2f$cartesian$2f$Area$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/OneDrive/Desktop/n8n/Playwrite/frontend-dashboard/node_modules/recharts/es6/cartesian/Area.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$n8n$2f$Playwrite$2f$frontend$2d$dashboard$2f$node_modules$2f$recharts$2f$es6$2f$cartesian$2f$XAxis$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/OneDrive/Desktop/n8n/Playwrite/frontend-dashboard/node_modules/recharts/es6/cartesian/XAxis.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$n8n$2f$Playwrite$2f$frontend$2d$dashboard$2f$node_modules$2f$recharts$2f$es6$2f$cartesian$2f$YAxis$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/OneDrive/Desktop/n8n/Playwrite/frontend-dashboard/node_modules/recharts/es6/cartesian/YAxis.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$n8n$2f$Playwrite$2f$frontend$2d$dashboard$2f$node_modules$2f$recharts$2f$es6$2f$cartesian$2f$CartesianGrid$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/OneDrive/Desktop/n8n/Playwrite/frontend-dashboard/node_modules/recharts/es6/cartesian/CartesianGrid.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$n8n$2f$Playwrite$2f$frontend$2d$dashboard$2f$node_modules$2f$recharts$2f$es6$2f$component$2f$Tooltip$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/OneDrive/Desktop/n8n/Playwrite/frontend-dashboard/node_modules/recharts/es6/component/Tooltip.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$n8n$2f$Playwrite$2f$frontend$2d$dashboard$2f$node_modules$2f$recharts$2f$es6$2f$component$2f$ResponsiveContainer$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/OneDrive/Desktop/n8n/Playwrite/frontend-dashboard/node_modules/recharts/es6/component/ResponsiveContainer.js [app-client] (ecmascript)");
"use client";
;
;
;
;
function AnalyticsChart({ data, title = "Weekly Activity", delay = 0.4 }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$n8n$2f$Playwrite$2f$frontend$2d$dashboard$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$n8n$2f$Playwrite$2f$frontend$2d$dashboard$2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["motion"].div, {
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
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$n8n$2f$Playwrite$2f$frontend$2d$dashboard$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex items-center justify-between mb-4 md:mb-6",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$n8n$2f$Playwrite$2f$frontend$2d$dashboard$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$n8n$2f$Playwrite$2f$frontend$2d$dashboard$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                className: "text-base md:text-lg font-semibold text-gray-200",
                                children: title
                            }, void 0, false, {
                                fileName: "[project]/OneDrive/Desktop/n8n/Playwrite/frontend-dashboard/components/dashboard/AnalyticsChart.tsx",
                                lineNumber: 40,
                                columnNumber: 21
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$n8n$2f$Playwrite$2f$frontend$2d$dashboard$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
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
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$n8n$2f$Playwrite$2f$frontend$2d$dashboard$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$n8n$2f$Playwrite$2f$frontend$2d$dashboard$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chart$2d$column$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__BarChart3$3e$__["BarChart3"], {
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
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$n8n$2f$Playwrite$2f$frontend$2d$dashboard$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "h-48 md:h-64 w-full",
                children: data.length > 0 ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$n8n$2f$Playwrite$2f$frontend$2d$dashboard$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$n8n$2f$Playwrite$2f$frontend$2d$dashboard$2f$node_modules$2f$recharts$2f$es6$2f$component$2f$ResponsiveContainer$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ResponsiveContainer"], {
                    width: "100%",
                    height: "100%",
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$n8n$2f$Playwrite$2f$frontend$2d$dashboard$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$n8n$2f$Playwrite$2f$frontend$2d$dashboard$2f$node_modules$2f$recharts$2f$es6$2f$chart$2f$AreaChart$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["AreaChart"], {
                        data: data,
                        margin: {
                            top: 5,
                            right: 0,
                            left: -20,
                            bottom: 0
                        },
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$n8n$2f$Playwrite$2f$frontend$2d$dashboard$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("defs", {
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$n8n$2f$Playwrite$2f$frontend$2d$dashboard$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("linearGradient", {
                                        id: "likesGradient",
                                        x1: "0",
                                        y1: "0",
                                        x2: "0",
                                        y2: "1",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$n8n$2f$Playwrite$2f$frontend$2d$dashboard$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("stop", {
                                                offset: "5%",
                                                stopColor: "#f43f5e",
                                                stopOpacity: 0.3
                                            }, void 0, false, {
                                                fileName: "[project]/OneDrive/Desktop/n8n/Playwrite/frontend-dashboard/components/dashboard/AnalyticsChart.tsx",
                                                lineNumber: 52,
                                                columnNumber: 37
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$n8n$2f$Playwrite$2f$frontend$2d$dashboard$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("stop", {
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
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$n8n$2f$Playwrite$2f$frontend$2d$dashboard$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("linearGradient", {
                                        id: "commentsGradient",
                                        x1: "0",
                                        y1: "0",
                                        x2: "0",
                                        y2: "1",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$n8n$2f$Playwrite$2f$frontend$2d$dashboard$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("stop", {
                                                offset: "5%",
                                                stopColor: "#3b82f6",
                                                stopOpacity: 0.3
                                            }, void 0, false, {
                                                fileName: "[project]/OneDrive/Desktop/n8n/Playwrite/frontend-dashboard/components/dashboard/AnalyticsChart.tsx",
                                                lineNumber: 56,
                                                columnNumber: 37
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$n8n$2f$Playwrite$2f$frontend$2d$dashboard$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("stop", {
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
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$n8n$2f$Playwrite$2f$frontend$2d$dashboard$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$n8n$2f$Playwrite$2f$frontend$2d$dashboard$2f$node_modules$2f$recharts$2f$es6$2f$cartesian$2f$CartesianGrid$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CartesianGrid"], {
                                strokeDasharray: "3 3",
                                stroke: "rgba(255,255,255,0.05)",
                                vertical: false
                            }, void 0, false, {
                                fileName: "[project]/OneDrive/Desktop/n8n/Playwrite/frontend-dashboard/components/dashboard/AnalyticsChart.tsx",
                                lineNumber: 60,
                                columnNumber: 29
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$n8n$2f$Playwrite$2f$frontend$2d$dashboard$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$n8n$2f$Playwrite$2f$frontend$2d$dashboard$2f$node_modules$2f$recharts$2f$es6$2f$cartesian$2f$XAxis$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["XAxis"], {
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
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$n8n$2f$Playwrite$2f$frontend$2d$dashboard$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$n8n$2f$Playwrite$2f$frontend$2d$dashboard$2f$node_modules$2f$recharts$2f$es6$2f$cartesian$2f$YAxis$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["YAxis"], {
                                stroke: "rgba(255,255,255,0.3)",
                                fontSize: 10,
                                axisLine: false,
                                tickLine: false
                            }, void 0, false, {
                                fileName: "[project]/OneDrive/Desktop/n8n/Playwrite/frontend-dashboard/components/dashboard/AnalyticsChart.tsx",
                                lineNumber: 69,
                                columnNumber: 29
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$n8n$2f$Playwrite$2f$frontend$2d$dashboard$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$n8n$2f$Playwrite$2f$frontend$2d$dashboard$2f$node_modules$2f$recharts$2f$es6$2f$component$2f$Tooltip$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Tooltip"], {
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
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$n8n$2f$Playwrite$2f$frontend$2d$dashboard$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$n8n$2f$Playwrite$2f$frontend$2d$dashboard$2f$node_modules$2f$recharts$2f$es6$2f$cartesian$2f$Area$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Area"], {
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
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$n8n$2f$Playwrite$2f$frontend$2d$dashboard$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$n8n$2f$Playwrite$2f$frontend$2d$dashboard$2f$node_modules$2f$recharts$2f$es6$2f$cartesian$2f$Area$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Area"], {
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
                }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$n8n$2f$Playwrite$2f$frontend$2d$dashboard$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
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
_c = AnalyticsChart;
var _c;
__turbopack_context__.k.register(_c, "AnalyticsChart");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/OneDrive/Desktop/n8n/Playwrite/frontend-dashboard/components/dashboard/ActivityFeed.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>ActivityFeed
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$n8n$2f$Playwrite$2f$frontend$2d$dashboard$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/OneDrive/Desktop/n8n/Playwrite/frontend-dashboard/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$n8n$2f$Playwrite$2f$frontend$2d$dashboard$2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/OneDrive/Desktop/n8n/Playwrite/frontend-dashboard/node_modules/framer-motion/dist/es/render/components/motion/proxy.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$n8n$2f$Playwrite$2f$frontend$2d$dashboard$2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$components$2f$AnimatePresence$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/OneDrive/Desktop/n8n/Playwrite/frontend-dashboard/node_modules/framer-motion/dist/es/components/AnimatePresence/index.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$n8n$2f$Playwrite$2f$frontend$2d$dashboard$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$clock$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Clock$3e$__ = __turbopack_context__.i("[project]/OneDrive/Desktop/n8n/Playwrite/frontend-dashboard/node_modules/lucide-react/dist/esm/icons/clock.js [app-client] (ecmascript) <export default as Clock>");
var __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$n8n$2f$Playwrite$2f$frontend$2d$dashboard$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$activity$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Activity$3e$__ = __turbopack_context__.i("[project]/OneDrive/Desktop/n8n/Playwrite/frontend-dashboard/node_modules/lucide-react/dist/esm/icons/activity.js [app-client] (ecmascript) <export default as Activity>");
var __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$n8n$2f$Playwrite$2f$frontend$2d$dashboard$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$heart$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Heart$3e$__ = __turbopack_context__.i("[project]/OneDrive/Desktop/n8n/Playwrite/frontend-dashboard/node_modules/lucide-react/dist/esm/icons/heart.js [app-client] (ecmascript) <export default as Heart>");
var __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$n8n$2f$Playwrite$2f$frontend$2d$dashboard$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$message$2d$square$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__MessageSquare$3e$__ = __turbopack_context__.i("[project]/OneDrive/Desktop/n8n/Playwrite/frontend-dashboard/node_modules/lucide-react/dist/esm/icons/message-square.js [app-client] (ecmascript) <export default as MessageSquare>");
var __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$n8n$2f$Playwrite$2f$frontend$2d$dashboard$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$send$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Send$3e$__ = __turbopack_context__.i("[project]/OneDrive/Desktop/n8n/Playwrite/frontend-dashboard/node_modules/lucide-react/dist/esm/icons/send.js [app-client] (ecmascript) <export default as Send>");
var __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$n8n$2f$Playwrite$2f$frontend$2d$dashboard$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$target$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Target$3e$__ = __turbopack_context__.i("[project]/OneDrive/Desktop/n8n/Playwrite/frontend-dashboard/node_modules/lucide-react/dist/esm/icons/target.js [app-client] (ecmascript) <export default as Target>");
"use client";
;
;
;
// --- Icon & Color Mapping ---
const actionIcons = {
    like: __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$n8n$2f$Playwrite$2f$frontend$2d$dashboard$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$heart$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Heart$3e$__["Heart"],
    comment: __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$n8n$2f$Playwrite$2f$frontend$2d$dashboard$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$message$2d$square$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__MessageSquare$3e$__["MessageSquare"],
    connection: __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$n8n$2f$Playwrite$2f$frontend$2d$dashboard$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$send$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Send$3e$__["Send"],
    view: __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$n8n$2f$Playwrite$2f$frontend$2d$dashboard$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$target$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Target$3e$__["Target"],
    other: __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$n8n$2f$Playwrite$2f$frontend$2d$dashboard$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$activity$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Activity$3e$__["Activity"]
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
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$n8n$2f$Playwrite$2f$frontend$2d$dashboard$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$n8n$2f$Playwrite$2f$frontend$2d$dashboard$2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["motion"].div, {
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
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$n8n$2f$Playwrite$2f$frontend$2d$dashboard$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex items-center justify-between mb-3 md:mb-4",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$n8n$2f$Playwrite$2f$frontend$2d$dashboard$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                        className: "text-base md:text-lg font-semibold text-gray-200 tracking-tight",
                        children: title
                    }, void 0, false, {
                        fileName: "[project]/OneDrive/Desktop/n8n/Playwrite/frontend-dashboard/components/dashboard/ActivityFeed.tsx",
                        lineNumber: 50,
                        columnNumber: 17
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$n8n$2f$Playwrite$2f$frontend$2d$dashboard$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$n8n$2f$Playwrite$2f$frontend$2d$dashboard$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$clock$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Clock$3e$__["Clock"], {
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
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$n8n$2f$Playwrite$2f$frontend$2d$dashboard$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "space-y-2 md:space-y-3",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$n8n$2f$Playwrite$2f$frontend$2d$dashboard$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$n8n$2f$Playwrite$2f$frontend$2d$dashboard$2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$components$2f$AnimatePresence$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["AnimatePresence"], {
                    mode: "popLayout",
                    children: activities.length > 0 ? activities.slice(0, 5).map((item, idx)=>{
                        const Icon = actionIcons[item.type] || actionIcons['other'];
                        const style = typeStyles[item.type] || typeStyles['other'];
                        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$n8n$2f$Playwrite$2f$frontend$2d$dashboard$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$n8n$2f$Playwrite$2f$frontend$2d$dashboard$2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["motion"].div, {
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
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$n8n$2f$Playwrite$2f$frontend$2d$dashboard$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "flex items-center gap-3 md:gap-4 min-w-0",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$n8n$2f$Playwrite$2f$frontend$2d$dashboard$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: `p-1.5 md:p-2 rounded-lg shrink-0 ${style.bg}`,
                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$n8n$2f$Playwrite$2f$frontend$2d$dashboard$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(Icon, {
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
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$n8n$2f$Playwrite$2f$frontend$2d$dashboard$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "min-w-0 flex flex-col",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$n8n$2f$Playwrite$2f$frontend$2d$dashboard$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    className: "font-medium text-xs md:text-sm text-gray-200 group-hover:text-white transition-colors truncate",
                                                    children: item.action
                                                }, void 0, false, {
                                                    fileName: "[project]/OneDrive/Desktop/n8n/Playwrite/frontend-dashboard/components/dashboard/ActivityFeed.tsx",
                                                    lineNumber: 76,
                                                    columnNumber: 45
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$n8n$2f$Playwrite$2f$frontend$2d$dashboard$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
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
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$n8n$2f$Playwrite$2f$frontend$2d$dashboard$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
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
                    }) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$n8n$2f$Playwrite$2f$frontend$2d$dashboard$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$n8n$2f$Playwrite$2f$frontend$2d$dashboard$2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["motion"].div, {
                        initial: {
                            opacity: 0
                        },
                        animate: {
                            opacity: 1
                        },
                        className: "flex flex-col items-center justify-center py-8 text-gray-500 space-y-2",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$n8n$2f$Playwrite$2f$frontend$2d$dashboard$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$n8n$2f$Playwrite$2f$frontend$2d$dashboard$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$activity$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Activity$3e$__["Activity"], {
                                className: "w-8 h-8 opacity-20"
                            }, void 0, false, {
                                fileName: "[project]/OneDrive/Desktop/n8n/Playwrite/frontend-dashboard/components/dashboard/ActivityFeed.tsx",
                                lineNumber: 96,
                                columnNumber: 29
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$n8n$2f$Playwrite$2f$frontend$2d$dashboard$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
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
_c = ActivityFeed;
var _c;
__turbopack_context__.k.register(_c, "ActivityFeed");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/OneDrive/Desktop/n8n/Playwrite/frontend-dashboard/app/page.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>DashboardPage
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$n8n$2f$Playwrite$2f$frontend$2d$dashboard$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/OneDrive/Desktop/n8n/Playwrite/frontend-dashboard/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$n8n$2f$Playwrite$2f$frontend$2d$dashboard$2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/OneDrive/Desktop/n8n/Playwrite/frontend-dashboard/node_modules/framer-motion/dist/es/render/components/motion/proxy.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$n8n$2f$Playwrite$2f$frontend$2d$dashboard$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$trending$2d$up$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__TrendingUp$3e$__ = __turbopack_context__.i("[project]/OneDrive/Desktop/n8n/Playwrite/frontend-dashboard/node_modules/lucide-react/dist/esm/icons/trending-up.js [app-client] (ecmascript) <export default as TrendingUp>");
var __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$n8n$2f$Playwrite$2f$frontend$2d$dashboard$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$users$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Users$3e$__ = __turbopack_context__.i("[project]/OneDrive/Desktop/n8n/Playwrite/frontend-dashboard/node_modules/lucide-react/dist/esm/icons/users.js [app-client] (ecmascript) <export default as Users>");
var __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$n8n$2f$Playwrite$2f$frontend$2d$dashboard$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$user$2d$plus$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__UserPlus$3e$__ = __turbopack_context__.i("[project]/OneDrive/Desktop/n8n/Playwrite/frontend-dashboard/node_modules/lucide-react/dist/esm/icons/user-plus.js [app-client] (ecmascript) <export default as UserPlus>");
var __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$n8n$2f$Playwrite$2f$frontend$2d$dashboard$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$target$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Target$3e$__ = __turbopack_context__.i("[project]/OneDrive/Desktop/n8n/Playwrite/frontend-dashboard/node_modules/lucide-react/dist/esm/icons/target.js [app-client] (ecmascript) <export default as Target>");
var __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$n8n$2f$Playwrite$2f$frontend$2d$dashboard$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$brain$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Brain$3e$__ = __turbopack_context__.i("[project]/OneDrive/Desktop/n8n/Playwrite/frontend-dashboard/node_modules/lucide-react/dist/esm/icons/brain.js [app-client] (ecmascript) <export default as Brain>");
var __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$n8n$2f$Playwrite$2f$frontend$2d$dashboard$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$zap$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Zap$3e$__ = __turbopack_context__.i("[project]/OneDrive/Desktop/n8n/Playwrite/frontend-dashboard/node_modules/lucide-react/dist/esm/icons/zap.js [app-client] (ecmascript) <export default as Zap>");
var __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$n8n$2f$Playwrite$2f$frontend$2d$dashboard$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$activity$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Activity$3e$__ = __turbopack_context__.i("[project]/OneDrive/Desktop/n8n/Playwrite/frontend-dashboard/node_modules/lucide-react/dist/esm/icons/activity.js [app-client] (ecmascript) <export default as Activity>");
var __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$n8n$2f$Playwrite$2f$frontend$2d$dashboard$2f$components$2f$dashboard$2f$StatsCard$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/OneDrive/Desktop/n8n/Playwrite/frontend-dashboard/components/dashboard/StatsCard.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$n8n$2f$Playwrite$2f$frontend$2d$dashboard$2f$components$2f$dashboard$2f$AnalyticsChart$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/OneDrive/Desktop/n8n/Playwrite/frontend-dashboard/components/dashboard/AnalyticsChart.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$n8n$2f$Playwrite$2f$frontend$2d$dashboard$2f$components$2f$dashboard$2f$ActivityFeed$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/OneDrive/Desktop/n8n/Playwrite/frontend-dashboard/components/dashboard/ActivityFeed.tsx [app-client] (ecmascript)");
"use client";
;
;
;
;
;
;
function DashboardPage() {
    // Mock Data for Charts
    const WEEKLY_DATA = [
        {
            day: "Mon",
            likes: 45,
            comments: 12,
            connections: 8
        },
        {
            day: "Tue",
            likes: 52,
            comments: 18,
            connections: 12
        },
        {
            day: "Wed",
            likes: 38,
            comments: 15,
            connections: 6
        },
        {
            day: "Thu",
            likes: 65,
            comments: 22,
            connections: 15
        },
        {
            day: "Fri",
            likes: 48,
            comments: 14,
            connections: 10
        },
        {
            day: "Sat",
            likes: 30,
            comments: 8,
            connections: 4
        },
        {
            day: "Sun",
            likes: 25,
            comments: 6,
            connections: 3
        }
    ];
    // Mock Data for Activity Feed
    const RECENT_ACTIVITY = [
        {
            id: 1,
            action: "Replied to post",
            target: "Sarah Connor",
            time: "2m ago",
            type: "comment"
        },
        {
            id: 2,
            action: "Connection accepted",
            target: "John Doe",
            time: "15m ago",
            type: "connection"
        },
        {
            id: 3,
            action: "Liked post",
            target: "TechCrunch",
            time: "1h ago",
            type: "like"
        },
        {
            id: 4,
            action: "Viewed profile",
            target: "Michael Smith",
            time: "2h ago",
            type: "view"
        },
        {
            id: 5,
            action: "System update",
            target: "v2.1 deployed",
            time: "5h ago",
            type: "other"
        }
    ];
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$n8n$2f$Playwrite$2f$frontend$2d$dashboard$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "min-h-screen p-6 space-y-8 pb-20",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$n8n$2f$Playwrite$2f$frontend$2d$dashboard$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex flex-col md:flex-row justify-between items-end gap-4 border-b border-white/5 pb-6",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$n8n$2f$Playwrite$2f$frontend$2d$dashboard$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$n8n$2f$Playwrite$2f$frontend$2d$dashboard$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h1", {
                                className: "text-4xl font-black bg-clip-text text-transparent bg-linear-to-r from-blue-400 via-purple-400 to-pink-400",
                                children: "COMMAND CENTER"
                            }, void 0, false, {
                                fileName: "[project]/OneDrive/Desktop/n8n/Playwrite/frontend-dashboard/app/page.tsx",
                                lineNumber: 39,
                                columnNumber: 21
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$n8n$2f$Playwrite$2f$frontend$2d$dashboard$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "text-gray-400 mt-2 flex items-center gap-2",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$n8n$2f$Playwrite$2f$frontend$2d$dashboard$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$n8n$2f$Playwrite$2f$frontend$2d$dashboard$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$activity$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Activity$3e$__["Activity"], {
                                        size: 16,
                                        className: "text-green-400 animate-pulse"
                                    }, void 0, false, {
                                        fileName: "[project]/OneDrive/Desktop/n8n/Playwrite/frontend-dashboard/app/page.tsx",
                                        lineNumber: 43,
                                        columnNumber: 25
                                    }, this),
                                    "System is active and monitoring"
                                ]
                            }, void 0, true, {
                                fileName: "[project]/OneDrive/Desktop/n8n/Playwrite/frontend-dashboard/app/page.tsx",
                                lineNumber: 42,
                                columnNumber: 21
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/OneDrive/Desktop/n8n/Playwrite/frontend-dashboard/app/page.tsx",
                        lineNumber: 38,
                        columnNumber: 17
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$n8n$2f$Playwrite$2f$frontend$2d$dashboard$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex gap-3",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$n8n$2f$Playwrite$2f$frontend$2d$dashboard$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                className: "px-4 py-2 bg-white/5 hover:bg-white/10 rounded-lg text-sm text-gray-300 border border-white/10 transition-colors",
                                children: "Download Report"
                            }, void 0, false, {
                                fileName: "[project]/OneDrive/Desktop/n8n/Playwrite/frontend-dashboard/app/page.tsx",
                                lineNumber: 48,
                                columnNumber: 21
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$n8n$2f$Playwrite$2f$frontend$2d$dashboard$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                className: "px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg text-sm text-white font-semibold shadow-lg shadow-blue-600/20 transition-all hover:scale-105",
                                children: "+ New Campaign"
                            }, void 0, false, {
                                fileName: "[project]/OneDrive/Desktop/n8n/Playwrite/frontend-dashboard/app/page.tsx",
                                lineNumber: 51,
                                columnNumber: 21
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/OneDrive/Desktop/n8n/Playwrite/frontend-dashboard/app/page.tsx",
                        lineNumber: 47,
                        columnNumber: 17
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/OneDrive/Desktop/n8n/Playwrite/frontend-dashboard/app/page.tsx",
                lineNumber: 37,
                columnNumber: 13
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$n8n$2f$Playwrite$2f$frontend$2d$dashboard$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$n8n$2f$Playwrite$2f$frontend$2d$dashboard$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$n8n$2f$Playwrite$2f$frontend$2d$dashboard$2f$components$2f$dashboard$2f$StatsCard$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                        label: "Total Leads",
                        value: 1284,
                        trend: "+12%",
                        icon: __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$n8n$2f$Playwrite$2f$frontend$2d$dashboard$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$users$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Users$3e$__["Users"],
                        color: "from-red-600 to-orange-600",
                        sparklineData: [
                            10,
                            15,
                            12,
                            18,
                            20,
                            25,
                            22,
                            30
                        ]
                    }, void 0, false, {
                        fileName: "[project]/OneDrive/Desktop/n8n/Playwrite/frontend-dashboard/app/page.tsx",
                        lineNumber: 59,
                        columnNumber: 17
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$n8n$2f$Playwrite$2f$frontend$2d$dashboard$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$n8n$2f$Playwrite$2f$frontend$2d$dashboard$2f$components$2f$dashboard$2f$StatsCard$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                        label: "Connections",
                        value: 432,
                        trend: "+5%",
                        icon: __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$n8n$2f$Playwrite$2f$frontend$2d$dashboard$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$user$2d$plus$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__UserPlus$3e$__["UserPlus"],
                        color: "from-orange-600 to-amber-600",
                        sparklineData: [
                            5,
                            8,
                            6,
                            9,
                            12,
                            10,
                            14,
                            16
                        ]
                    }, void 0, false, {
                        fileName: "[project]/OneDrive/Desktop/n8n/Playwrite/frontend-dashboard/app/page.tsx",
                        lineNumber: 67,
                        columnNumber: 17
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$n8n$2f$Playwrite$2f$frontend$2d$dashboard$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$n8n$2f$Playwrite$2f$frontend$2d$dashboard$2f$components$2f$dashboard$2f$StatsCard$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                        label: "Engagement",
                        value: 89,
                        suffix: "%",
                        trend: "+2%",
                        icon: __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$n8n$2f$Playwrite$2f$frontend$2d$dashboard$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$zap$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Zap$3e$__["Zap"],
                        color: "from-red-500 to-pink-600",
                        sparklineData: [
                            60,
                            65,
                            70,
                            68,
                            75,
                            80,
                            85,
                            89
                        ]
                    }, void 0, false, {
                        fileName: "[project]/OneDrive/Desktop/n8n/Playwrite/frontend-dashboard/app/page.tsx",
                        lineNumber: 75,
                        columnNumber: 17
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$n8n$2f$Playwrite$2f$frontend$2d$dashboard$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$n8n$2f$Playwrite$2f$frontend$2d$dashboard$2f$components$2f$dashboard$2f$StatsCard$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                        label: "Pain Points",
                        value: 156,
                        trend: "+24",
                        icon: __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$n8n$2f$Playwrite$2f$frontend$2d$dashboard$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$brain$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Brain$3e$__["Brain"],
                        color: "from-gray-600 to-gray-400",
                        sparklineData: [
                            2,
                            4,
                            3,
                            8,
                            12,
                            15,
                            18,
                            24
                        ]
                    }, void 0, false, {
                        fileName: "[project]/OneDrive/Desktop/n8n/Playwrite/frontend-dashboard/app/page.tsx",
                        lineNumber: 84,
                        columnNumber: 17
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/OneDrive/Desktop/n8n/Playwrite/frontend-dashboard/app/page.tsx",
                lineNumber: 58,
                columnNumber: 13
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$n8n$2f$Playwrite$2f$frontend$2d$dashboard$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "grid grid-cols-1 lg:grid-cols-3 gap-6",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$n8n$2f$Playwrite$2f$frontend$2d$dashboard$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "lg:col-span-2 space-y-6",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$n8n$2f$Playwrite$2f$frontend$2d$dashboard$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "glass-card p-6 rounded-2xl border border-white/5",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$n8n$2f$Playwrite$2f$frontend$2d$dashboard$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "flex justify-between items-center mb-6",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$n8n$2f$Playwrite$2f$frontend$2d$dashboard$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                                className: "text-lg font-bold text-gray-100 flex items-center gap-2",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$n8n$2f$Playwrite$2f$frontend$2d$dashboard$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$n8n$2f$Playwrite$2f$frontend$2d$dashboard$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$trending$2d$up$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__TrendingUp$3e$__["TrendingUp"], {
                                                        className: "text-blue-400",
                                                        size: 20
                                                    }, void 0, false, {
                                                        fileName: "[project]/OneDrive/Desktop/n8n/Playwrite/frontend-dashboard/app/page.tsx",
                                                        lineNumber: 103,
                                                        columnNumber: 33
                                                    }, this),
                                                    "Weekly Performance"
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/OneDrive/Desktop/n8n/Playwrite/frontend-dashboard/app/page.tsx",
                                                lineNumber: 102,
                                                columnNumber: 29
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$n8n$2f$Playwrite$2f$frontend$2d$dashboard$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("select", {
                                                className: "bg-black/30 border border-white/10 rounded-lg text-xs text-gray-400 px-2 py-1 outline-none",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$n8n$2f$Playwrite$2f$frontend$2d$dashboard$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                        children: "Last 7 Days"
                                                    }, void 0, false, {
                                                        fileName: "[project]/OneDrive/Desktop/n8n/Playwrite/frontend-dashboard/app/page.tsx",
                                                        lineNumber: 107,
                                                        columnNumber: 33
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$n8n$2f$Playwrite$2f$frontend$2d$dashboard$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                        children: "Last 30 Days"
                                                    }, void 0, false, {
                                                        fileName: "[project]/OneDrive/Desktop/n8n/Playwrite/frontend-dashboard/app/page.tsx",
                                                        lineNumber: 108,
                                                        columnNumber: 33
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/OneDrive/Desktop/n8n/Playwrite/frontend-dashboard/app/page.tsx",
                                                lineNumber: 106,
                                                columnNumber: 29
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/OneDrive/Desktop/n8n/Playwrite/frontend-dashboard/app/page.tsx",
                                        lineNumber: 101,
                                        columnNumber: 25
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$n8n$2f$Playwrite$2f$frontend$2d$dashboard$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "h-64",
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$n8n$2f$Playwrite$2f$frontend$2d$dashboard$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$n8n$2f$Playwrite$2f$frontend$2d$dashboard$2f$components$2f$dashboard$2f$AnalyticsChart$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                            data: WEEKLY_DATA
                                        }, void 0, false, {
                                            fileName: "[project]/OneDrive/Desktop/n8n/Playwrite/frontend-dashboard/app/page.tsx",
                                            lineNumber: 112,
                                            columnNumber: 29
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/OneDrive/Desktop/n8n/Playwrite/frontend-dashboard/app/page.tsx",
                                        lineNumber: 111,
                                        columnNumber: 25
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/OneDrive/Desktop/n8n/Playwrite/frontend-dashboard/app/page.tsx",
                                lineNumber: 100,
                                columnNumber: 21
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$n8n$2f$Playwrite$2f$frontend$2d$dashboard$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "grid md:grid-cols-2 gap-6",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$n8n$2f$Playwrite$2f$frontend$2d$dashboard$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$n8n$2f$Playwrite$2f$frontend$2d$dashboard$2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["motion"].div, {
                                        initial: {
                                            opacity: 0,
                                            y: 20
                                        },
                                        animate: {
                                            opacity: 1,
                                            y: 0
                                        },
                                        className: "glass-card p-6 rounded-2xl border border-white/5",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$n8n$2f$Playwrite$2f$frontend$2d$dashboard$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                                className: "text-lg font-bold text-gray-100 mb-4 flex items-center gap-2",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$n8n$2f$Playwrite$2f$frontend$2d$dashboard$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$n8n$2f$Playwrite$2f$frontend$2d$dashboard$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$target$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Target$3e$__["Target"], {
                                                        className: "text-emerald-400",
                                                        size: 20
                                                    }, void 0, false, {
                                                        fileName: "[project]/OneDrive/Desktop/n8n/Playwrite/frontend-dashboard/app/page.tsx",
                                                        lineNumber: 124,
                                                        columnNumber: 33
                                                    }, this),
                                                    "Lead Pipeline"
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/OneDrive/Desktop/n8n/Playwrite/frontend-dashboard/app/page.tsx",
                                                lineNumber: 123,
                                                columnNumber: 29
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$n8n$2f$Playwrite$2f$frontend$2d$dashboard$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "space-y-4",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$n8n$2f$Playwrite$2f$frontend$2d$dashboard$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "space-y-1",
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$n8n$2f$Playwrite$2f$frontend$2d$dashboard$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                className: "flex justify-between text-xs text-gray-400",
                                                                children: [
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$n8n$2f$Playwrite$2f$frontend$2d$dashboard$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                        children: "New Leads"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/OneDrive/Desktop/n8n/Playwrite/frontend-dashboard/app/page.tsx",
                                                                        lineNumber: 130,
                                                                        columnNumber: 41
                                                                    }, this),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$n8n$2f$Playwrite$2f$frontend$2d$dashboard$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                        children: "450"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/OneDrive/Desktop/n8n/Playwrite/frontend-dashboard/app/page.tsx",
                                                                        lineNumber: 131,
                                                                        columnNumber: 41
                                                                    }, this)
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/OneDrive/Desktop/n8n/Playwrite/frontend-dashboard/app/page.tsx",
                                                                lineNumber: 129,
                                                                columnNumber: 37
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$n8n$2f$Playwrite$2f$frontend$2d$dashboard$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                className: "h-2 bg-white/5 rounded-full overflow-hidden",
                                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$n8n$2f$Playwrite$2f$frontend$2d$dashboard$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                    className: "h-full bg-blue-500 w-[80%]"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/OneDrive/Desktop/n8n/Playwrite/frontend-dashboard/app/page.tsx",
                                                                    lineNumber: 134,
                                                                    columnNumber: 41
                                                                }, this)
                                                            }, void 0, false, {
                                                                fileName: "[project]/OneDrive/Desktop/n8n/Playwrite/frontend-dashboard/app/page.tsx",
                                                                lineNumber: 133,
                                                                columnNumber: 37
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/OneDrive/Desktop/n8n/Playwrite/frontend-dashboard/app/page.tsx",
                                                        lineNumber: 128,
                                                        columnNumber: 33
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$n8n$2f$Playwrite$2f$frontend$2d$dashboard$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "space-y-1",
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$n8n$2f$Playwrite$2f$frontend$2d$dashboard$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                className: "flex justify-between text-xs text-gray-400",
                                                                children: [
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$n8n$2f$Playwrite$2f$frontend$2d$dashboard$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                        children: "Contacted"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/OneDrive/Desktop/n8n/Playwrite/frontend-dashboard/app/page.tsx",
                                                                        lineNumber: 139,
                                                                        columnNumber: 41
                                                                    }, this),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$n8n$2f$Playwrite$2f$frontend$2d$dashboard$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                        children: "280"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/OneDrive/Desktop/n8n/Playwrite/frontend-dashboard/app/page.tsx",
                                                                        lineNumber: 140,
                                                                        columnNumber: 41
                                                                    }, this)
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/OneDrive/Desktop/n8n/Playwrite/frontend-dashboard/app/page.tsx",
                                                                lineNumber: 138,
                                                                columnNumber: 37
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$n8n$2f$Playwrite$2f$frontend$2d$dashboard$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                className: "h-2 bg-white/5 rounded-full overflow-hidden",
                                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$n8n$2f$Playwrite$2f$frontend$2d$dashboard$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                    className: "h-full bg-violet-500 w-[60%]"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/OneDrive/Desktop/n8n/Playwrite/frontend-dashboard/app/page.tsx",
                                                                    lineNumber: 143,
                                                                    columnNumber: 41
                                                                }, this)
                                                            }, void 0, false, {
                                                                fileName: "[project]/OneDrive/Desktop/n8n/Playwrite/frontend-dashboard/app/page.tsx",
                                                                lineNumber: 142,
                                                                columnNumber: 37
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/OneDrive/Desktop/n8n/Playwrite/frontend-dashboard/app/page.tsx",
                                                        lineNumber: 137,
                                                        columnNumber: 33
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$n8n$2f$Playwrite$2f$frontend$2d$dashboard$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "space-y-1",
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$n8n$2f$Playwrite$2f$frontend$2d$dashboard$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                className: "flex justify-between text-xs text-gray-400",
                                                                children: [
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$n8n$2f$Playwrite$2f$frontend$2d$dashboard$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                        children: "Replies"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/OneDrive/Desktop/n8n/Playwrite/frontend-dashboard/app/page.tsx",
                                                                        lineNumber: 148,
                                                                        columnNumber: 41
                                                                    }, this),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$n8n$2f$Playwrite$2f$frontend$2d$dashboard$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                        children: "45"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/OneDrive/Desktop/n8n/Playwrite/frontend-dashboard/app/page.tsx",
                                                                        lineNumber: 149,
                                                                        columnNumber: 41
                                                                    }, this)
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/OneDrive/Desktop/n8n/Playwrite/frontend-dashboard/app/page.tsx",
                                                                lineNumber: 147,
                                                                columnNumber: 37
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$n8n$2f$Playwrite$2f$frontend$2d$dashboard$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                className: "h-2 bg-white/5 rounded-full overflow-hidden",
                                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$n8n$2f$Playwrite$2f$frontend$2d$dashboard$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                    className: "h-full bg-pink-500 w-[15%]"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/OneDrive/Desktop/n8n/Playwrite/frontend-dashboard/app/page.tsx",
                                                                    lineNumber: 152,
                                                                    columnNumber: 41
                                                                }, this)
                                                            }, void 0, false, {
                                                                fileName: "[project]/OneDrive/Desktop/n8n/Playwrite/frontend-dashboard/app/page.tsx",
                                                                lineNumber: 151,
                                                                columnNumber: 37
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/OneDrive/Desktop/n8n/Playwrite/frontend-dashboard/app/page.tsx",
                                                        lineNumber: 146,
                                                        columnNumber: 33
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/OneDrive/Desktop/n8n/Playwrite/frontend-dashboard/app/page.tsx",
                                                lineNumber: 127,
                                                columnNumber: 29
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/OneDrive/Desktop/n8n/Playwrite/frontend-dashboard/app/page.tsx",
                                        lineNumber: 119,
                                        columnNumber: 25
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$n8n$2f$Playwrite$2f$frontend$2d$dashboard$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$n8n$2f$Playwrite$2f$frontend$2d$dashboard$2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["motion"].div, {
                                        initial: {
                                            opacity: 0,
                                            y: 20
                                        },
                                        animate: {
                                            opacity: 1,
                                            y: 0
                                        },
                                        transition: {
                                            delay: 0.1
                                        },
                                        className: "glass-card p-6 rounded-2xl border border-white/5",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$n8n$2f$Playwrite$2f$frontend$2d$dashboard$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                                className: "text-lg font-bold text-gray-100 mb-4 flex items-center gap-2",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$n8n$2f$Playwrite$2f$frontend$2d$dashboard$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$n8n$2f$Playwrite$2f$frontend$2d$dashboard$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$brain$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Brain$3e$__["Brain"], {
                                                        className: "text-pink-400",
                                                        size: 20
                                                    }, void 0, false, {
                                                        fileName: "[project]/OneDrive/Desktop/n8n/Playwrite/frontend-dashboard/app/page.tsx",
                                                        lineNumber: 164,
                                                        columnNumber: 33
                                                    }, this),
                                                    "Identified Pain Points"
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/OneDrive/Desktop/n8n/Playwrite/frontend-dashboard/app/page.tsx",
                                                lineNumber: 163,
                                                columnNumber: 29
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$n8n$2f$Playwrite$2f$frontend$2d$dashboard$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "space-y-3",
                                                children: [
                                                    "Struggling with manual outreach",
                                                    "Low conversion on cold email",
                                                    "Needs automated CRM sync"
                                                ].map((point, i)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$n8n$2f$Playwrite$2f$frontend$2d$dashboard$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "flex items-start gap-2 text-sm text-gray-300 p-2 rounded-lg bg-white/5 border border-white/5",
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$n8n$2f$Playwrite$2f$frontend$2d$dashboard$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                className: "w-1.5 h-1.5 rounded-full bg-pink-500 mt-1.5 shrink-0"
                                                            }, void 0, false, {
                                                                fileName: "[project]/OneDrive/Desktop/n8n/Playwrite/frontend-dashboard/app/page.tsx",
                                                                lineNumber: 174,
                                                                columnNumber: 41
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$n8n$2f$Playwrite$2f$frontend$2d$dashboard$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                children: point
                                                            }, void 0, false, {
                                                                fileName: "[project]/OneDrive/Desktop/n8n/Playwrite/frontend-dashboard/app/page.tsx",
                                                                lineNumber: 175,
                                                                columnNumber: 41
                                                            }, this)
                                                        ]
                                                    }, i, true, {
                                                        fileName: "[project]/OneDrive/Desktop/n8n/Playwrite/frontend-dashboard/app/page.tsx",
                                                        lineNumber: 173,
                                                        columnNumber: 37
                                                    }, this))
                                            }, void 0, false, {
                                                fileName: "[project]/OneDrive/Desktop/n8n/Playwrite/frontend-dashboard/app/page.tsx",
                                                lineNumber: 167,
                                                columnNumber: 29
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/OneDrive/Desktop/n8n/Playwrite/frontend-dashboard/app/page.tsx",
                                        lineNumber: 159,
                                        columnNumber: 25
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/OneDrive/Desktop/n8n/Playwrite/frontend-dashboard/app/page.tsx",
                                lineNumber: 117,
                                columnNumber: 21
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/OneDrive/Desktop/n8n/Playwrite/frontend-dashboard/app/page.tsx",
                        lineNumber: 98,
                        columnNumber: 17
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$n8n$2f$Playwrite$2f$frontend$2d$dashboard$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "space-y-6",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$n8n$2f$Playwrite$2f$frontend$2d$dashboard$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "glass-card p-6 rounded-2xl border border-white/5 h-full max-h-[600px] overflow-hidden flex flex-col",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$n8n$2f$Playwrite$2f$frontend$2d$dashboard$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                    className: "text-lg font-bold text-gray-100 mb-4 flex items-center gap-2",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$n8n$2f$Playwrite$2f$frontend$2d$dashboard$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$n8n$2f$Playwrite$2f$frontend$2d$dashboard$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$activity$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Activity$3e$__["Activity"], {
                                            className: "text-orange-400",
                                            size: 20
                                        }, void 0, false, {
                                            fileName: "[project]/OneDrive/Desktop/n8n/Playwrite/frontend-dashboard/app/page.tsx",
                                            lineNumber: 188,
                                            columnNumber: 29
                                        }, this),
                                        "Live Activity"
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/OneDrive/Desktop/n8n/Playwrite/frontend-dashboard/app/page.tsx",
                                    lineNumber: 187,
                                    columnNumber: 25
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$n8n$2f$Playwrite$2f$frontend$2d$dashboard$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "flex-1 overflow-y-auto scrollbar-thin -mr-4 pr-4",
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$n8n$2f$Playwrite$2f$frontend$2d$dashboard$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$n8n$2f$Playwrite$2f$frontend$2d$dashboard$2f$components$2f$dashboard$2f$ActivityFeed$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                        activities: RECENT_ACTIVITY
                                    }, void 0, false, {
                                        fileName: "[project]/OneDrive/Desktop/n8n/Playwrite/frontend-dashboard/app/page.tsx",
                                        lineNumber: 192,
                                        columnNumber: 29
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/OneDrive/Desktop/n8n/Playwrite/frontend-dashboard/app/page.tsx",
                                    lineNumber: 191,
                                    columnNumber: 25
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/OneDrive/Desktop/n8n/Playwrite/frontend-dashboard/app/page.tsx",
                            lineNumber: 186,
                            columnNumber: 21
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/OneDrive/Desktop/n8n/Playwrite/frontend-dashboard/app/page.tsx",
                        lineNumber: 184,
                        columnNumber: 17
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/OneDrive/Desktop/n8n/Playwrite/frontend-dashboard/app/page.tsx",
                lineNumber: 95,
                columnNumber: 13
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/OneDrive/Desktop/n8n/Playwrite/frontend-dashboard/app/page.tsx",
        lineNumber: 35,
        columnNumber: 9
    }, this);
}
_c = DashboardPage;
var _c;
__turbopack_context__.k.register(_c, "DashboardPage");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
]);

//# sourceMappingURL=OneDrive_Desktop_n8n_Playwrite_frontend-dashboard_2fda8ef8._.js.map