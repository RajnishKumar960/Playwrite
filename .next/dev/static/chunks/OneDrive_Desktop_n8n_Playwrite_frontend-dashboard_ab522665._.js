(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/OneDrive/Desktop/n8n/Playwrite/frontend-dashboard/lib/api.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "API_URL",
    ()=>API_URL,
    "WS_URL",
    ()=>WS_URL,
    "api",
    ()=>api,
    "createWebSocket",
    ()=>createWebSocket
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$n8n$2f$Playwrite$2f$frontend$2d$dashboard$2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = /*#__PURE__*/ __turbopack_context__.i("[project]/OneDrive/Desktop/n8n/Playwrite/frontend-dashboard/node_modules/next/dist/build/polyfills/process.js [app-client] (ecmascript)");
/**
 * API Client for Dashboard Backend
 */ const API_URL = __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$n8n$2f$Playwrite$2f$frontend$2d$dashboard$2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';
const WS_URL = __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$n8n$2f$Playwrite$2f$frontend$2d$dashboard$2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].env.NEXT_PUBLIC_WS_URL || 'ws://localhost:4000';
const api = {
    // Base fetch with proper error handling
    async fetch (endpoint, options) {
        const url = `${API_URL}${endpoint}`;
        try {
            const response = await fetch(url, {
                ...options,
                headers: {
                    'Content-Type': 'application/json',
                    ...options?.headers
                }
            });
            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }
            return response.json();
        } catch (error) {
            console.error(`API Error [${endpoint}]:`, error);
            throw error;
        }
    },
    // Health check
    health: ()=>api.fetch('/api/health'),
    // Agent endpoints
    agents: {
        status: ()=>api.fetch('/api/agents/status'),
        secretsStatus: ()=>api.fetch('/api/agents/secrets-status'),
        start: (agent, params)=>api.fetch(`/api/agents/start/${agent}`, {
                method: 'POST',
                body: params ? JSON.stringify({
                    params
                }) : undefined
            }),
        stop: (agent)=>api.fetch(`/api/agents/stop/${agent}`, {
                method: 'POST'
            }),
        stopAll: ()=>api.fetch('/api/agents/stop-all', {
                method: 'POST'
            })
    },
    // Logs
    logs: {
        get: (limit = 100)=>api.fetch(`/api/logs?limit=${limit}`),
        clear: ()=>api.fetch('/api/logs/clear', {
                method: 'POST'
            })
    },
    // Activity
    activity: {
        get: ()=>api.fetch('/api/activity')
    },
    // Leads
    leads: {
        list: (limit = 100, offset = 0)=>api.fetch(`/api/leads?limit=${limit}&offset=${offset}`),
        stats: ()=>api.fetch('/api/leads/stats'),
        kanban: ()=>api.fetch('/api/leads/kanban'),
        updateStatus: (leadId, status, column)=>api.fetch('/api/leads/kanban', {
                method: 'POST',
                body: JSON.stringify({
                    leadId,
                    status,
                    column
                })
            })
    },
    // Connections
    connections: {
        get: ()=>api.fetch('/api/connections')
    },
    // Charts
    charts: {
        weekly: ()=>api.fetch('/api/charts/weekly')
    },
    // Intelligence
    intelligence: {
        analyzeProfile: (url)=>api.fetch('/api/analytics/analyze-profile', {
                method: 'POST',
                body: JSON.stringify({
                    url
                })
            })
    },
    // Campaigns
    campaigns: {
        list: ()=>api.fetch('/api/campaigns'),
        create: (data)=>api.fetch('/api/campaigns', {
                method: 'POST',
                body: JSON.stringify(data)
            })
    },
    // Settings
    settings: {
        get: ()=>api.fetch('/api/settings'),
        update: (data)=>api.fetch('/api/settings', {
                method: 'POST',
                body: JSON.stringify(data)
            }),
        saveSafety: (data)=>api.fetch('/api/settings/safety', {
                method: 'POST',
                body: JSON.stringify(data)
            })
    }
};
function createWebSocket(path) {
    return new WebSocket(`${WS_URL}${path}`);
}
;
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/OneDrive/Desktop/n8n/Playwrite/frontend-dashboard/lib/utils.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "cn",
    ()=>cn
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$n8n$2f$Playwrite$2f$frontend$2d$dashboard$2f$node_modules$2f$clsx$2f$dist$2f$clsx$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/OneDrive/Desktop/n8n/Playwrite/frontend-dashboard/node_modules/clsx/dist/clsx.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$n8n$2f$Playwrite$2f$frontend$2d$dashboard$2f$node_modules$2f$tailwind$2d$merge$2f$dist$2f$bundle$2d$mjs$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/OneDrive/Desktop/n8n/Playwrite/frontend-dashboard/node_modules/tailwind-merge/dist/bundle-mjs.mjs [app-client] (ecmascript)");
;
;
function cn(...inputs) {
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$n8n$2f$Playwrite$2f$frontend$2d$dashboard$2f$node_modules$2f$tailwind$2d$merge$2f$dist$2f$bundle$2d$mjs$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["twMerge"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$n8n$2f$Playwrite$2f$frontend$2d$dashboard$2f$node_modules$2f$clsx$2f$dist$2f$clsx$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["clsx"])(inputs));
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/OneDrive/Desktop/n8n/Playwrite/frontend-dashboard/app/live-view/page.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>LiveViewPage
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$n8n$2f$Playwrite$2f$frontend$2d$dashboard$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/OneDrive/Desktop/n8n/Playwrite/frontend-dashboard/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$n8n$2f$Playwrite$2f$frontend$2d$dashboard$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/OneDrive/Desktop/n8n/Playwrite/frontend-dashboard/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$n8n$2f$Playwrite$2f$frontend$2d$dashboard$2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/OneDrive/Desktop/n8n/Playwrite/frontend-dashboard/node_modules/framer-motion/dist/es/render/components/motion/proxy.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$n8n$2f$Playwrite$2f$frontend$2d$dashboard$2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$components$2f$AnimatePresence$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/OneDrive/Desktop/n8n/Playwrite/frontend-dashboard/node_modules/framer-motion/dist/es/components/AnimatePresence/index.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$n8n$2f$Playwrite$2f$frontend$2d$dashboard$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$monitor$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Monitor$3e$__ = __turbopack_context__.i("[project]/OneDrive/Desktop/n8n/Playwrite/frontend-dashboard/node_modules/lucide-react/dist/esm/icons/monitor.js [app-client] (ecmascript) <export default as Monitor>");
var __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$n8n$2f$Playwrite$2f$frontend$2d$dashboard$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$shield$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Shield$3e$__ = __turbopack_context__.i("[project]/OneDrive/Desktop/n8n/Playwrite/frontend-dashboard/node_modules/lucide-react/dist/esm/icons/shield.js [app-client] (ecmascript) <export default as Shield>");
var __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$n8n$2f$Playwrite$2f$frontend$2d$dashboard$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$terminal$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Terminal$3e$__ = __turbopack_context__.i("[project]/OneDrive/Desktop/n8n/Playwrite/frontend-dashboard/node_modules/lucide-react/dist/esm/icons/terminal.js [app-client] (ecmascript) <export default as Terminal>");
var __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$n8n$2f$Playwrite$2f$frontend$2d$dashboard$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$play$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Play$3e$__ = __turbopack_context__.i("[project]/OneDrive/Desktop/n8n/Playwrite/frontend-dashboard/node_modules/lucide-react/dist/esm/icons/play.js [app-client] (ecmascript) <export default as Play>");
var __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$n8n$2f$Playwrite$2f$frontend$2d$dashboard$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$square$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Square$3e$__ = __turbopack_context__.i("[project]/OneDrive/Desktop/n8n/Playwrite/frontend-dashboard/node_modules/lucide-react/dist/esm/icons/square.js [app-client] (ecmascript) <export default as Square>");
var __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$n8n$2f$Playwrite$2f$frontend$2d$dashboard$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$command$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Command$3e$__ = __turbopack_context__.i("[project]/OneDrive/Desktop/n8n/Playwrite/frontend-dashboard/node_modules/lucide-react/dist/esm/icons/command.js [app-client] (ecmascript) <export default as Command>");
var __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$n8n$2f$Playwrite$2f$frontend$2d$dashboard$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$activity$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Activity$3e$__ = __turbopack_context__.i("[project]/OneDrive/Desktop/n8n/Playwrite/frontend-dashboard/node_modules/lucide-react/dist/esm/icons/activity.js [app-client] (ecmascript) <export default as Activity>");
var __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$n8n$2f$Playwrite$2f$frontend$2d$dashboard$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$zap$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Zap$3e$__ = __turbopack_context__.i("[project]/OneDrive/Desktop/n8n/Playwrite/frontend-dashboard/node_modules/lucide-react/dist/esm/icons/zap.js [app-client] (ecmascript) <export default as Zap>");
var __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$n8n$2f$Playwrite$2f$frontend$2d$dashboard$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$users$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Users$3e$__ = __turbopack_context__.i("[project]/OneDrive/Desktop/n8n/Playwrite/frontend-dashboard/node_modules/lucide-react/dist/esm/icons/users.js [app-client] (ecmascript) <export default as Users>");
var __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$n8n$2f$Playwrite$2f$frontend$2d$dashboard$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$maximize$2d$2$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Maximize2$3e$__ = __turbopack_context__.i("[project]/OneDrive/Desktop/n8n/Playwrite/frontend-dashboard/node_modules/lucide-react/dist/esm/icons/maximize-2.js [app-client] (ecmascript) <export default as Maximize2>");
var __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$n8n$2f$Playwrite$2f$frontend$2d$dashboard$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$pause$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Pause$3e$__ = __turbopack_context__.i("[project]/OneDrive/Desktop/n8n/Playwrite/frontend-dashboard/node_modules/lucide-react/dist/esm/icons/pause.js [app-client] (ecmascript) <export default as Pause>");
var __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$n8n$2f$Playwrite$2f$frontend$2d$dashboard$2f$lib$2f$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/OneDrive/Desktop/n8n/Playwrite/frontend-dashboard/lib/api.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$n8n$2f$Playwrite$2f$frontend$2d$dashboard$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/OneDrive/Desktop/n8n/Playwrite/frontend-dashboard/lib/utils.ts [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
"use client";
;
;
;
;
;
const MOCK_LOGS = [
    {
        time: "10:00:01",
        level: "INFO",
        message: "System initialized. Waiting for command..."
    }
];
function LiveViewPage() {
    _s();
    const [runningAgent, setRunningAgent] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$n8n$2f$Playwrite$2f$frontend$2d$dashboard$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [agentStatus, setAgentStatus] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$n8n$2f$Playwrite$2f$frontend$2d$dashboard$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])('stopped');
    const [logs, setLogs] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$n8n$2f$Playwrite$2f$frontend$2d$dashboard$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(MOCK_LOGS);
    const [isExpanded, setIsExpanded] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$n8n$2f$Playwrite$2f$frontend$2d$dashboard$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const scrollRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$n8n$2f$Playwrite$2f$frontend$2d$dashboard$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    const wsRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$n8n$2f$Playwrite$2f$frontend$2d$dashboard$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    const [screenshot, setScreenshot] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$n8n$2f$Playwrite$2f$frontend$2d$dashboard$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    // Config Modal State
    const [showConfig, setShowConfig] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$n8n$2f$Playwrite$2f$frontend$2d$dashboard$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [selectedAgent, setSelectedAgent] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$n8n$2f$Playwrite$2f$frontend$2d$dashboard$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [params, setParams] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$n8n$2f$Playwrite$2f$frontend$2d$dashboard$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])({
        max: 25,
        duration: 15,
        postComments: true
    });
    // Secrets Status
    const [secrets, setSecrets] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$n8n$2f$Playwrite$2f$frontend$2d$dashboard$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$n8n$2f$Playwrite$2f$frontend$2d$dashboard$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "LiveViewPage.useEffect": ()=>{
            const fetchSecrets = {
                "LiveViewPage.useEffect.fetchSecrets": async ()=>{
                    try {
                        const data = await __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$n8n$2f$Playwrite$2f$frontend$2d$dashboard$2f$lib$2f$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["api"].agents.secretsStatus();
                        setSecrets(data.secrets);
                    } catch (e) {
                        console.error("Secrets Fetch Error", e);
                    }
                }
            }["LiveViewPage.useEffect.fetchSecrets"];
            fetchSecrets();
            // Connect to WebSocket for live streaming
            const wsUrl = `${__TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$n8n$2f$Playwrite$2f$frontend$2d$dashboard$2f$lib$2f$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["WS_URL"]}/ws/stream`;
            console.log("Connecting to surveillance stream:", wsUrl);
            wsRef.current = new WebSocket(wsUrl);
            wsRef.current.onmessage = ({
                "LiveViewPage.useEffect": (event)=>{
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
                }
            })["LiveViewPage.useEffect"];
            return ({
                "LiveViewPage.useEffect": ()=>{
                    wsRef.current?.close();
                }
            })["LiveViewPage.useEffect"];
        }
    }["LiveViewPage.useEffect"], []);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$n8n$2f$Playwrite$2f$frontend$2d$dashboard$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "LiveViewPage.useEffect": ()=>{
            if (scrollRef.current) {
                scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
            }
        }
    }["LiveViewPage.useEffect"], [
        logs
    ]);
    const handleLaunch = (agentId, title)=>{
        if (runningAgent) return;
        const agent = {
            id: agentId,
            title
        };
        setSelectedAgent(agent);
        if (agentId === 'feedWarmer') setParams({
            max: 50,
            duration: 30,
            postComments: true
        });
        else if (agentId === 'growthManager') setParams({
            max: 10,
            duration: 45,
            postComments: true
        });
        else setParams({
            max: 25,
            duration: 15,
            postComments: false
        });
        setShowConfig(true);
    };
    const startAgent = async ()=>{
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
            const data = await __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$n8n$2f$Playwrite$2f$frontend$2d$dashboard$2f$lib$2f$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["api"].agents.start(endpoint, params);
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
    const stopAgent = async ()=>{
        if (!runningAgent) return;
        addLog("WARN", "Injecting termination signal...");
        setAgentStatus('stopped');
        try {
            await __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$n8n$2f$Playwrite$2f$frontend$2d$dashboard$2f$lib$2f$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["api"].agents.stopAll();
            addLog("INFO", "Operation scrubbed by operator.");
            setRunningAgent(null);
            setScreenshot(null);
        } catch (err) {
            addLog("ERROR", "Termination failed.");
        }
    };
    const togglePause = ()=>{
        if (agentStatus === 'running') {
            setAgentStatus('paused');
            addLog("WARN", "Operation suspended manually.");
        } else if (agentStatus === 'paused') {
            setAgentStatus('running');
            addLog("INFO", "Operation resumed.");
        }
    };
    const addLog = (level, message)=>{
        setLogs((prev)=>[
                ...prev.slice(-100),
                {
                    time: new Date().toLocaleTimeString(),
                    level,
                    message
                }
            ]);
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$n8n$2f$Playwrite$2f$frontend$2d$dashboard$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "min-h-screen p-6 space-y-6 pb-20 relative overflow-hidden bg-[#02040a]",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$n8n$2f$Playwrite$2f$frontend$2d$dashboard$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex flex-col md:flex-row justify-between items-end gap-4 border-b border-white/5 pb-6 relative z-10",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$n8n$2f$Playwrite$2f$frontend$2d$dashboard$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$n8n$2f$Playwrite$2f$frontend$2d$dashboard$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h1", {
                                className: "text-3xl font-black bg-clip-text text-transparent bg-linear-to-r from-blue-400 via-purple-400 to-pink-400 uppercase italic tracking-tighter",
                                children: [
                                    "MISSION ",
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$n8n$2f$Playwrite$2f$frontend$2d$dashboard$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "text-white",
                                        children: "CONTROL"
                                    }, void 0, false, {
                                        fileName: "[project]/OneDrive/Desktop/n8n/Playwrite/frontend-dashboard/app/live-view/page.tsx",
                                        lineNumber: 150,
                                        columnNumber: 33
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/OneDrive/Desktop/n8n/Playwrite/frontend-dashboard/app/live-view/page.tsx",
                                lineNumber: 149,
                                columnNumber: 21
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$n8n$2f$Playwrite$2f$frontend$2d$dashboard$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "text-[10px] text-gray-500 font-bold uppercase tracking-[0.4em] mt-2 flex items-center gap-2",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$n8n$2f$Playwrite$2f$frontend$2d$dashboard$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$n8n$2f$Playwrite$2f$frontend$2d$dashboard$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$activity$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Activity$3e$__["Activity"], {
                                        size: 12,
                                        className: "text-blue-500"
                                    }, void 0, false, {
                                        fileName: "[project]/OneDrive/Desktop/n8n/Playwrite/frontend-dashboard/app/live-view/page.tsx",
                                        lineNumber: 153,
                                        columnNumber: 25
                                    }, this),
                                    "Live Surveillance Stream // Encrypted"
                                ]
                            }, void 0, true, {
                                fileName: "[project]/OneDrive/Desktop/n8n/Playwrite/frontend-dashboard/app/live-view/page.tsx",
                                lineNumber: 152,
                                columnNumber: 21
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/OneDrive/Desktop/n8n/Playwrite/frontend-dashboard/app/live-view/page.tsx",
                        lineNumber: 148,
                        columnNumber: 17
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$n8n$2f$Playwrite$2f$frontend$2d$dashboard$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex items-center gap-4 bg-white/5 px-4 py-2 rounded-xl border border-white/5 backdrop-blur-md",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$n8n$2f$Playwrite$2f$frontend$2d$dashboard$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex flex-col items-end",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$n8n$2f$Playwrite$2f$frontend$2d$dashboard$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "text-[8px] text-gray-500 font-bold uppercase tracking-widest",
                                        children: "Uplink Status"
                                    }, void 0, false, {
                                        fileName: "[project]/OneDrive/Desktop/n8n/Playwrite/frontend-dashboard/app/live-view/page.tsx",
                                        lineNumber: 159,
                                        columnNumber: 25
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$n8n$2f$Playwrite$2f$frontend$2d$dashboard$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "text-[10px] font-black text-green-400 uppercase tracking-tighter italic flex items-center gap-2",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$n8n$2f$Playwrite$2f$frontend$2d$dashboard$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"
                                            }, void 0, false, {
                                                fileName: "[project]/OneDrive/Desktop/n8n/Playwrite/frontend-dashboard/app/live-view/page.tsx",
                                                lineNumber: 161,
                                                columnNumber: 29
                                            }, this),
                                            "Socket Connected"
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/OneDrive/Desktop/n8n/Playwrite/frontend-dashboard/app/live-view/page.tsx",
                                        lineNumber: 160,
                                        columnNumber: 25
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/OneDrive/Desktop/n8n/Playwrite/frontend-dashboard/app/live-view/page.tsx",
                                lineNumber: 158,
                                columnNumber: 21
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$n8n$2f$Playwrite$2f$frontend$2d$dashboard$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "w-px h-8 bg-white/10"
                            }, void 0, false, {
                                fileName: "[project]/OneDrive/Desktop/n8n/Playwrite/frontend-dashboard/app/live-view/page.tsx",
                                lineNumber: 165,
                                columnNumber: 21
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$n8n$2f$Playwrite$2f$frontend$2d$dashboard$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex flex-col items-end",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$n8n$2f$Playwrite$2f$frontend$2d$dashboard$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "text-[8px] text-gray-500 font-bold uppercase tracking-widest",
                                        children: "Global Latency"
                                    }, void 0, false, {
                                        fileName: "[project]/OneDrive/Desktop/n8n/Playwrite/frontend-dashboard/app/live-view/page.tsx",
                                        lineNumber: 167,
                                        columnNumber: 25
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$n8n$2f$Playwrite$2f$frontend$2d$dashboard$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "text-[10px] font-black text-white italic",
                                        children: "12ms"
                                    }, void 0, false, {
                                        fileName: "[project]/OneDrive/Desktop/n8n/Playwrite/frontend-dashboard/app/live-view/page.tsx",
                                        lineNumber: 168,
                                        columnNumber: 25
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/OneDrive/Desktop/n8n/Playwrite/frontend-dashboard/app/live-view/page.tsx",
                                lineNumber: 166,
                                columnNumber: 21
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/OneDrive/Desktop/n8n/Playwrite/frontend-dashboard/app/live-view/page.tsx",
                        lineNumber: 157,
                        columnNumber: 17
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/OneDrive/Desktop/n8n/Playwrite/frontend-dashboard/app/live-view/page.tsx",
                lineNumber: 147,
                columnNumber: 13
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$n8n$2f$Playwrite$2f$frontend$2d$dashboard$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "grid grid-cols-1 lg:grid-cols-12 gap-6 relative z-10",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$n8n$2f$Playwrite$2f$frontend$2d$dashboard$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "lg:col-span-8 space-y-6",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$n8n$2f$Playwrite$2f$frontend$2d$dashboard$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "glass-card rounded-2xl border border-white/5 flex flex-col overflow-hidden relative bg-black shadow-2xl min-h-[500px]",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$n8n$2f$Playwrite$2f$frontend$2d$dashboard$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "absolute inset-0 pointer-events-none z-20 overflow-hidden opacity-30",
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$n8n$2f$Playwrite$2f$frontend$2d$dashboard$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_2px,3px_100%]"
                                        }, void 0, false, {
                                            fileName: "[project]/OneDrive/Desktop/n8n/Playwrite/frontend-dashboard/app/live-view/page.tsx",
                                            lineNumber: 181,
                                            columnNumber: 29
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/OneDrive/Desktop/n8n/Playwrite/frontend-dashboard/app/live-view/page.tsx",
                                        lineNumber: 180,
                                        columnNumber: 25
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$n8n$2f$Playwrite$2f$frontend$2d$dashboard$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "h-12 bg-white/5 border-b border-white/10 flex items-center px-6 gap-6 justify-between relative z-30",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$n8n$2f$Playwrite$2f$frontend$2d$dashboard$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "flex items-center gap-6 flex-1",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$n8n$2f$Playwrite$2f$frontend$2d$dashboard$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "flex gap-2",
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$n8n$2f$Playwrite$2f$frontend$2d$dashboard$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                className: "w-2.5 h-2.5 rounded-full bg-red-500/30"
                                                            }, void 0, false, {
                                                                fileName: "[project]/OneDrive/Desktop/n8n/Playwrite/frontend-dashboard/app/live-view/page.tsx",
                                                                lineNumber: 188,
                                                                columnNumber: 37
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$n8n$2f$Playwrite$2f$frontend$2d$dashboard$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                className: "w-2.5 h-2.5 rounded-full bg-yellow-500/30"
                                                            }, void 0, false, {
                                                                fileName: "[project]/OneDrive/Desktop/n8n/Playwrite/frontend-dashboard/app/live-view/page.tsx",
                                                                lineNumber: 189,
                                                                columnNumber: 37
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$n8n$2f$Playwrite$2f$frontend$2d$dashboard$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                className: "w-2.5 h-2.5 rounded-full bg-green-500/30"
                                                            }, void 0, false, {
                                                                fileName: "[project]/OneDrive/Desktop/n8n/Playwrite/frontend-dashboard/app/live-view/page.tsx",
                                                                lineNumber: 190,
                                                                columnNumber: 37
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/OneDrive/Desktop/n8n/Playwrite/frontend-dashboard/app/live-view/page.tsx",
                                                        lineNumber: 187,
                                                        columnNumber: 33
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$n8n$2f$Playwrite$2f$frontend$2d$dashboard$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "flex-1 max-w-2xl bg-black/40 rounded-lg h-7 flex items-center px-4 text-[10px] text-gray-400 font-mono tracking-wider border border-white/5",
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$n8n$2f$Playwrite$2f$frontend$2d$dashboard$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$n8n$2f$Playwrite$2f$frontend$2d$dashboard$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$shield$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Shield$3e$__["Shield"], {
                                                                size: 10,
                                                                className: "mr-3 text-blue-500 opacity-70"
                                                            }, void 0, false, {
                                                                fileName: "[project]/OneDrive/Desktop/n8n/Playwrite/frontend-dashboard/app/live-view/page.tsx",
                                                                lineNumber: 193,
                                                                columnNumber: 37
                                                            }, this),
                                                            "FEEDS://SECURE_NODE.TSI/LINKEDIN"
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/OneDrive/Desktop/n8n/Playwrite/frontend-dashboard/app/live-view/page.tsx",
                                                        lineNumber: 192,
                                                        columnNumber: 33
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/OneDrive/Desktop/n8n/Playwrite/frontend-dashboard/app/live-view/page.tsx",
                                                lineNumber: 186,
                                                columnNumber: 29
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$n8n$2f$Playwrite$2f$frontend$2d$dashboard$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "flex items-center gap-3",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$n8n$2f$Playwrite$2f$frontend$2d$dashboard$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(StatusBadge, {
                                                        status: agentStatus
                                                    }, void 0, false, {
                                                        fileName: "[project]/OneDrive/Desktop/n8n/Playwrite/frontend-dashboard/app/live-view/page.tsx",
                                                        lineNumber: 198,
                                                        columnNumber: 33
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$n8n$2f$Playwrite$2f$frontend$2d$dashboard$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                        className: "w-8 h-8 rounded-lg bg-white/5 hover:bg-white/10 flex items-center justify-center border border-white/5",
                                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$n8n$2f$Playwrite$2f$frontend$2d$dashboard$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$n8n$2f$Playwrite$2f$frontend$2d$dashboard$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$maximize$2d$2$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Maximize2$3e$__["Maximize2"], {
                                                            size: 14,
                                                            className: "text-gray-400"
                                                        }, void 0, false, {
                                                            fileName: "[project]/OneDrive/Desktop/n8n/Playwrite/frontend-dashboard/app/live-view/page.tsx",
                                                            lineNumber: 200,
                                                            columnNumber: 37
                                                        }, this)
                                                    }, void 0, false, {
                                                        fileName: "[project]/OneDrive/Desktop/n8n/Playwrite/frontend-dashboard/app/live-view/page.tsx",
                                                        lineNumber: 199,
                                                        columnNumber: 33
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/OneDrive/Desktop/n8n/Playwrite/frontend-dashboard/app/live-view/page.tsx",
                                                lineNumber: 197,
                                                columnNumber: 29
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/OneDrive/Desktop/n8n/Playwrite/frontend-dashboard/app/live-view/page.tsx",
                                        lineNumber: 185,
                                        columnNumber: 25
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$n8n$2f$Playwrite$2f$frontend$2d$dashboard$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "flex-1 bg-[#02040a] relative flex items-center justify-center",
                                        children: screenshot ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$n8n$2f$Playwrite$2f$frontend$2d$dashboard$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("img", {
                                            src: screenshot,
                                            alt: "Visual Uplink",
                                            className: "w-full h-full object-contain"
                                        }, void 0, false, {
                                            fileName: "[project]/OneDrive/Desktop/n8n/Playwrite/frontend-dashboard/app/live-view/page.tsx",
                                            lineNumber: 208,
                                            columnNumber: 33
                                        }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$n8n$2f$Playwrite$2f$frontend$2d$dashboard$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "text-center opacity-20",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$n8n$2f$Playwrite$2f$frontend$2d$dashboard$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$n8n$2f$Playwrite$2f$frontend$2d$dashboard$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$monitor$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Monitor$3e$__["Monitor"], {
                                                    size: 64,
                                                    className: "mx-auto mb-4 text-gray-500"
                                                }, void 0, false, {
                                                    fileName: "[project]/OneDrive/Desktop/n8n/Playwrite/frontend-dashboard/app/live-view/page.tsx",
                                                    lineNumber: 211,
                                                    columnNumber: 37
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$n8n$2f$Playwrite$2f$frontend$2d$dashboard$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                    className: "text-[10px] font-black uppercase tracking-[0.5em] italic",
                                                    children: "Awaiting Signal..."
                                                }, void 0, false, {
                                                    fileName: "[project]/OneDrive/Desktop/n8n/Playwrite/frontend-dashboard/app/live-view/page.tsx",
                                                    lineNumber: 212,
                                                    columnNumber: 37
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/OneDrive/Desktop/n8n/Playwrite/frontend-dashboard/app/live-view/page.tsx",
                                            lineNumber: 210,
                                            columnNumber: 33
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/OneDrive/Desktop/n8n/Playwrite/frontend-dashboard/app/live-view/page.tsx",
                                        lineNumber: 206,
                                        columnNumber: 25
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/OneDrive/Desktop/n8n/Playwrite/frontend-dashboard/app/live-view/page.tsx",
                                lineNumber: 178,
                                columnNumber: 21
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$n8n$2f$Playwrite$2f$frontend$2d$dashboard$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "glass-card p-6 rounded-2xl border border-white/5 bg-black/40 backdrop-blur-xl",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$n8n$2f$Playwrite$2f$frontend$2d$dashboard$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "flex items-center justify-between mb-6",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$n8n$2f$Playwrite$2f$frontend$2d$dashboard$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "flex items-center gap-3",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$n8n$2f$Playwrite$2f$frontend$2d$dashboard$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$n8n$2f$Playwrite$2f$frontend$2d$dashboard$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$command$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Command$3e$__["Command"], {
                                                        size: 18,
                                                        className: "text-blue-400"
                                                    }, void 0, false, {
                                                        fileName: "[project]/OneDrive/Desktop/n8n/Playwrite/frontend-dashboard/app/live-view/page.tsx",
                                                        lineNumber: 222,
                                                        columnNumber: 33
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$n8n$2f$Playwrite$2f$frontend$2d$dashboard$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                                        className: "text-xs font-black text-gray-100 uppercase tracking-[0.3em] italic",
                                                        children: "Command Deck"
                                                    }, void 0, false, {
                                                        fileName: "[project]/OneDrive/Desktop/n8n/Playwrite/frontend-dashboard/app/live-view/page.tsx",
                                                        lineNumber: 223,
                                                        columnNumber: 33
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/OneDrive/Desktop/n8n/Playwrite/frontend-dashboard/app/live-view/page.tsx",
                                                lineNumber: 221,
                                                columnNumber: 29
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$n8n$2f$Playwrite$2f$frontend$2d$dashboard$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "flex items-center gap-4 bg-black/40 px-4 py-2 rounded-xl border border-white/5",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$n8n$2f$Playwrite$2f$frontend$2d$dashboard$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "flex flex-col",
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$n8n$2f$Playwrite$2f$frontend$2d$dashboard$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                className: "text-[8px] text-gray-500 font-bold uppercase tracking-widest",
                                                                children: "Agent Phase"
                                                            }, void 0, false, {
                                                                fileName: "[project]/OneDrive/Desktop/n8n/Playwrite/frontend-dashboard/app/live-view/page.tsx",
                                                                lineNumber: 227,
                                                                columnNumber: 37
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$n8n$2f$Playwrite$2f$frontend$2d$dashboard$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                className: "text-[10px] font-black text-white uppercase italic",
                                                                children: runningAgent || 'STANDBY'
                                                            }, void 0, false, {
                                                                fileName: "[project]/OneDrive/Desktop/n8n/Playwrite/frontend-dashboard/app/live-view/page.tsx",
                                                                lineNumber: 228,
                                                                columnNumber: 37
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/OneDrive/Desktop/n8n/Playwrite/frontend-dashboard/app/live-view/page.tsx",
                                                        lineNumber: 226,
                                                        columnNumber: 33
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$n8n$2f$Playwrite$2f$frontend$2d$dashboard$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$n8n$2f$Playwrite$2f$frontend$2d$dashboard$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("w-3 h-3 rounded-full shadow-lg transition-all duration-500", agentStatus === 'running' ? "bg-green-500 shadow-green-500/50 animate-pulse" : agentStatus === 'paused' ? "bg-amber-500 shadow-amber-500/50" : "bg-red-500 shadow-red-500/50")
                                                    }, void 0, false, {
                                                        fileName: "[project]/OneDrive/Desktop/n8n/Playwrite/frontend-dashboard/app/live-view/page.tsx",
                                                        lineNumber: 230,
                                                        columnNumber: 33
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/OneDrive/Desktop/n8n/Playwrite/frontend-dashboard/app/live-view/page.tsx",
                                                lineNumber: 225,
                                                columnNumber: 29
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/OneDrive/Desktop/n8n/Playwrite/frontend-dashboard/app/live-view/page.tsx",
                                        lineNumber: 220,
                                        columnNumber: 25
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$n8n$2f$Playwrite$2f$frontend$2d$dashboard$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "grid grid-cols-2 lg:grid-cols-4 gap-4",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$n8n$2f$Playwrite$2f$frontend$2d$dashboard$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(DeckButton, {
                                                label: "Start Feed Warmer",
                                                icon: __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$n8n$2f$Playwrite$2f$frontend$2d$dashboard$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$zap$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Zap$3e$__["Zap"],
                                                onClick: ()=>handleLaunch('feedWarmer', 'Feed Warmer'),
                                                disabled: !!runningAgent,
                                                color: "blue"
                                            }, void 0, false, {
                                                fileName: "[project]/OneDrive/Desktop/n8n/Playwrite/frontend-dashboard/app/live-view/page.tsx",
                                                lineNumber: 240,
                                                columnNumber: 29
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$n8n$2f$Playwrite$2f$frontend$2d$dashboard$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(DeckButton, {
                                                label: "Start Connector",
                                                icon: __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$n8n$2f$Playwrite$2f$frontend$2d$dashboard$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$users$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Users$3e$__["Users"],
                                                onClick: ()=>handleLaunch('growthManager', 'Growth Manager'),
                                                disabled: !!runningAgent,
                                                color: "purple"
                                            }, void 0, false, {
                                                fileName: "[project]/OneDrive/Desktop/n8n/Playwrite/frontend-dashboard/app/live-view/page.tsx",
                                                lineNumber: 247,
                                                columnNumber: 29
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$n8n$2f$Playwrite$2f$frontend$2d$dashboard$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(DeckButton, {
                                                label: "Pause Operation",
                                                icon: agentStatus === 'paused' ? __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$n8n$2f$Playwrite$2f$frontend$2d$dashboard$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$play$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Play$3e$__["Play"] : __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$n8n$2f$Playwrite$2f$frontend$2d$dashboard$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$pause$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Pause$3e$__["Pause"],
                                                onClick: togglePause,
                                                disabled: !runningAgent,
                                                color: "amber",
                                                active: agentStatus === 'paused'
                                            }, void 0, false, {
                                                fileName: "[project]/OneDrive/Desktop/n8n/Playwrite/frontend-dashboard/app/live-view/page.tsx",
                                                lineNumber: 254,
                                                columnNumber: 29
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$n8n$2f$Playwrite$2f$frontend$2d$dashboard$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(DeckButton, {
                                                label: "Emergency Stop",
                                                icon: __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$n8n$2f$Playwrite$2f$frontend$2d$dashboard$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$square$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Square$3e$__["Square"],
                                                onClick: stopAgent,
                                                disabled: !runningAgent,
                                                color: "red",
                                                danger: true
                                            }, void 0, false, {
                                                fileName: "[project]/OneDrive/Desktop/n8n/Playwrite/frontend-dashboard/app/live-view/page.tsx",
                                                lineNumber: 262,
                                                columnNumber: 29
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/OneDrive/Desktop/n8n/Playwrite/frontend-dashboard/app/live-view/page.tsx",
                                        lineNumber: 239,
                                        columnNumber: 25
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/OneDrive/Desktop/n8n/Playwrite/frontend-dashboard/app/live-view/page.tsx",
                                lineNumber: 219,
                                columnNumber: 21
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/OneDrive/Desktop/n8n/Playwrite/frontend-dashboard/app/live-view/page.tsx",
                        lineNumber: 177,
                        columnNumber: 17
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$n8n$2f$Playwrite$2f$frontend$2d$dashboard$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "lg:col-span-4 flex flex-col gap-6",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$n8n$2f$Playwrite$2f$frontend$2d$dashboard$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex-1 glass-card rounded-2xl border border-white/5 flex flex-col overflow-hidden bg-black/60 backdrop-blur-md min-h-[500px]",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$n8n$2f$Playwrite$2f$frontend$2d$dashboard$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "px-6 py-4 border-b border-white/10 bg-white/5 flex items-center justify-between",
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$n8n$2f$Playwrite$2f$frontend$2d$dashboard$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "flex items-center gap-3",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$n8n$2f$Playwrite$2f$frontend$2d$dashboard$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$n8n$2f$Playwrite$2f$frontend$2d$dashboard$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$terminal$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Terminal$3e$__["Terminal"], {
                                                    size: 14,
                                                    className: "text-blue-400"
                                                }, void 0, false, {
                                                    fileName: "[project]/OneDrive/Desktop/n8n/Playwrite/frontend-dashboard/app/live-view/page.tsx",
                                                    lineNumber: 279,
                                                    columnNumber: 33
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$n8n$2f$Playwrite$2f$frontend$2d$dashboard$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    className: "text-[10px] font-black text-gray-400 uppercase tracking-widest italic",
                                                    children: "Live Action Log"
                                                }, void 0, false, {
                                                    fileName: "[project]/OneDrive/Desktop/n8n/Playwrite/frontend-dashboard/app/live-view/page.tsx",
                                                    lineNumber: 280,
                                                    columnNumber: 33
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/OneDrive/Desktop/n8n/Playwrite/frontend-dashboard/app/live-view/page.tsx",
                                            lineNumber: 278,
                                            columnNumber: 29
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/OneDrive/Desktop/n8n/Playwrite/frontend-dashboard/app/live-view/page.tsx",
                                        lineNumber: 277,
                                        columnNumber: 25
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$n8n$2f$Playwrite$2f$frontend$2d$dashboard$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        ref: scrollRef,
                                        className: "flex-1 p-6 font-mono text-[10px] overflow-y-auto scrollbar-thin space-y-3",
                                        children: logs.map((log, i)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$n8n$2f$Playwrite$2f$frontend$2d$dashboard$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "flex gap-4 group transition-colors hover:bg-white/5 p-1.5 rounded-lg border border-transparent hover:border-white/5",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$n8n$2f$Playwrite$2f$frontend$2d$dashboard$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        className: "text-gray-600 shrink-0 select-none",
                                                        children: [
                                                            "[",
                                                            log.time,
                                                            "]"
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/OneDrive/Desktop/n8n/Playwrite/frontend-dashboard/app/live-view/page.tsx",
                                                        lineNumber: 287,
                                                        columnNumber: 37
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$n8n$2f$Playwrite$2f$frontend$2d$dashboard$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        className: `shrink-0 font-black italic ${log.level === 'INFO' ? 'text-blue-400' : log.level === 'WARN' ? 'text-amber-400' : log.level === 'ERROR' ? 'text-red-400' : 'text-green-400'}`,
                                                        children: log.level
                                                    }, void 0, false, {
                                                        fileName: "[project]/OneDrive/Desktop/n8n/Playwrite/frontend-dashboard/app/live-view/page.tsx",
                                                        lineNumber: 288,
                                                        columnNumber: 37
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$n8n$2f$Playwrite$2f$frontend$2d$dashboard$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        className: "text-gray-400 group-hover:text-gray-200 transition-colors leading-relaxed",
                                                        children: log.message
                                                    }, void 0, false, {
                                                        fileName: "[project]/OneDrive/Desktop/n8n/Playwrite/frontend-dashboard/app/live-view/page.tsx",
                                                        lineNumber: 295,
                                                        columnNumber: 37
                                                    }, this)
                                                ]
                                            }, i, true, {
                                                fileName: "[project]/OneDrive/Desktop/n8n/Playwrite/frontend-dashboard/app/live-view/page.tsx",
                                                lineNumber: 286,
                                                columnNumber: 33
                                            }, this))
                                    }, void 0, false, {
                                        fileName: "[project]/OneDrive/Desktop/n8n/Playwrite/frontend-dashboard/app/live-view/page.tsx",
                                        lineNumber: 284,
                                        columnNumber: 25
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/OneDrive/Desktop/n8n/Playwrite/frontend-dashboard/app/live-view/page.tsx",
                                lineNumber: 276,
                                columnNumber: 21
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$n8n$2f$Playwrite$2f$frontend$2d$dashboard$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "glass-card p-6 rounded-2xl border border-white/5 bg-black/40 backdrop-blur-xl",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$n8n$2f$Playwrite$2f$frontend$2d$dashboard$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                        className: "text-[10px] font-black text-gray-500 uppercase tracking-widest mb-4",
                                        children: "Neural Node Performance"
                                    }, void 0, false, {
                                        fileName: "[project]/OneDrive/Desktop/n8n/Playwrite/frontend-dashboard/app/live-view/page.tsx",
                                        lineNumber: 305,
                                        columnNumber: 25
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$n8n$2f$Playwrite$2f$frontend$2d$dashboard$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "space-y-4",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$n8n$2f$Playwrite$2f$frontend$2d$dashboard$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(PerformanceMetric, {
                                                label: "Extraction Efficiency",
                                                value: 88,
                                                color: "blue"
                                            }, void 0, false, {
                                                fileName: "[project]/OneDrive/Desktop/n8n/Playwrite/frontend-dashboard/app/live-view/page.tsx",
                                                lineNumber: 307,
                                                columnNumber: 29
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$n8n$2f$Playwrite$2f$frontend$2d$dashboard$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(PerformanceMetric, {
                                                label: "Sentiment Accuracy",
                                                value: 94,
                                                color: "purple"
                                            }, void 0, false, {
                                                fileName: "[project]/OneDrive/Desktop/n8n/Playwrite/frontend-dashboard/app/live-view/page.tsx",
                                                lineNumber: 308,
                                                columnNumber: 29
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$n8n$2f$Playwrite$2f$frontend$2d$dashboard$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(PerformanceMetric, {
                                                label: "Uplink Stability",
                                                value: 99,
                                                color: "green"
                                            }, void 0, false, {
                                                fileName: "[project]/OneDrive/Desktop/n8n/Playwrite/frontend-dashboard/app/live-view/page.tsx",
                                                lineNumber: 309,
                                                columnNumber: 29
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/OneDrive/Desktop/n8n/Playwrite/frontend-dashboard/app/live-view/page.tsx",
                                        lineNumber: 306,
                                        columnNumber: 25
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/OneDrive/Desktop/n8n/Playwrite/frontend-dashboard/app/live-view/page.tsx",
                                lineNumber: 304,
                                columnNumber: 21
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/OneDrive/Desktop/n8n/Playwrite/frontend-dashboard/app/live-view/page.tsx",
                        lineNumber: 275,
                        columnNumber: 17
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/OneDrive/Desktop/n8n/Playwrite/frontend-dashboard/app/live-view/page.tsx",
                lineNumber: 174,
                columnNumber: 13
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$n8n$2f$Playwrite$2f$frontend$2d$dashboard$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$n8n$2f$Playwrite$2f$frontend$2d$dashboard$2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$components$2f$AnimatePresence$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["AnimatePresence"], {
                children: showConfig && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$n8n$2f$Playwrite$2f$frontend$2d$dashboard$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "fixed inset-0 z-[100] flex items-center justify-center p-6",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$n8n$2f$Playwrite$2f$frontend$2d$dashboard$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$n8n$2f$Playwrite$2f$frontend$2d$dashboard$2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["motion"].div, {
                            initial: {
                                opacity: 0
                            },
                            animate: {
                                opacity: 1
                            },
                            exit: {
                                opacity: 0
                            },
                            className: "absolute inset-0 bg-black/80 backdrop-blur-sm",
                            onClick: ()=>setShowConfig(false)
                        }, void 0, false, {
                            fileName: "[project]/OneDrive/Desktop/n8n/Playwrite/frontend-dashboard/app/live-view/page.tsx",
                            lineNumber: 319,
                            columnNumber: 25
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$n8n$2f$Playwrite$2f$frontend$2d$dashboard$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$n8n$2f$Playwrite$2f$frontend$2d$dashboard$2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["motion"].div, {
                            initial: {
                                opacity: 0,
                                scale: 0.9,
                                y: 20
                            },
                            animate: {
                                opacity: 1,
                                scale: 1,
                                y: 0
                            },
                            exit: {
                                opacity: 0,
                                scale: 0.9,
                                y: 20
                            },
                            className: "w-full max-w-md bg-[#0d1117] border border-white/10 rounded-2xl overflow-hidden relative z-10 shadow-[0_0_100px_rgba(0,0,0,0.5)]",
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$n8n$2f$Playwrite$2f$frontend$2d$dashboard$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "p-6 space-y-6",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$n8n$2f$Playwrite$2f$frontend$2d$dashboard$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "flex justify-between items-start",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$n8n$2f$Playwrite$2f$frontend$2d$dashboard$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "space-y-1",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$n8n$2f$Playwrite$2f$frontend$2d$dashboard$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                        className: "text-[10px] font-black text-blue-400 uppercase tracking-widest italic",
                                                        children: "Protocol Setup"
                                                    }, void 0, false, {
                                                        fileName: "[project]/OneDrive/Desktop/n8n/Playwrite/frontend-dashboard/app/live-view/page.tsx",
                                                        lineNumber: 333,
                                                        columnNumber: 41
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$n8n$2f$Playwrite$2f$frontend$2d$dashboard$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                                        className: "text-xl font-black text-white uppercase italic",
                                                        children: selectedAgent?.title
                                                    }, void 0, false, {
                                                        fileName: "[project]/OneDrive/Desktop/n8n/Playwrite/frontend-dashboard/app/live-view/page.tsx",
                                                        lineNumber: 334,
                                                        columnNumber: 41
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/OneDrive/Desktop/n8n/Playwrite/frontend-dashboard/app/live-view/page.tsx",
                                                lineNumber: 332,
                                                columnNumber: 37
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$n8n$2f$Playwrite$2f$frontend$2d$dashboard$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center text-blue-400 border border-blue-500/20",
                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$n8n$2f$Playwrite$2f$frontend$2d$dashboard$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$n8n$2f$Playwrite$2f$frontend$2d$dashboard$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$command$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Command$3e$__["Command"], {
                                                    size: 20
                                                }, void 0, false, {
                                                    fileName: "[project]/OneDrive/Desktop/n8n/Playwrite/frontend-dashboard/app/live-view/page.tsx",
                                                    lineNumber: 337,
                                                    columnNumber: 41
                                                }, this)
                                            }, void 0, false, {
                                                fileName: "[project]/OneDrive/Desktop/n8n/Playwrite/frontend-dashboard/app/live-view/page.tsx",
                                                lineNumber: 336,
                                                columnNumber: 37
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/OneDrive/Desktop/n8n/Playwrite/frontend-dashboard/app/live-view/page.tsx",
                                        lineNumber: 331,
                                        columnNumber: 33
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$n8n$2f$Playwrite$2f$frontend$2d$dashboard$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "space-y-4",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$n8n$2f$Playwrite$2f$frontend$2d$dashboard$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "space-y-2",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$n8n$2f$Playwrite$2f$frontend$2d$dashboard$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "flex justify-between text-[10px] font-bold uppercase tracking-widest text-gray-500",
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$n8n$2f$Playwrite$2f$frontend$2d$dashboard$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                children: "Extraction Limit"
                                                            }, void 0, false, {
                                                                fileName: "[project]/OneDrive/Desktop/n8n/Playwrite/frontend-dashboard/app/live-view/page.tsx",
                                                                lineNumber: 344,
                                                                columnNumber: 45
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$n8n$2f$Playwrite$2f$frontend$2d$dashboard$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                className: "text-blue-400",
                                                                children: [
                                                                    params.max,
                                                                    " Leads"
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/OneDrive/Desktop/n8n/Playwrite/frontend-dashboard/app/live-view/page.tsx",
                                                                lineNumber: 345,
                                                                columnNumber: 45
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/OneDrive/Desktop/n8n/Playwrite/frontend-dashboard/app/live-view/page.tsx",
                                                        lineNumber: 343,
                                                        columnNumber: 41
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$n8n$2f$Playwrite$2f$frontend$2d$dashboard$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                        type: "range",
                                                        min: "1",
                                                        max: "100",
                                                        step: "5",
                                                        value: params.max,
                                                        onChange: (e)=>setParams((p)=>({
                                                                    ...p,
                                                                    max: parseInt(e.target.value)
                                                                })),
                                                        className: "w-full h-1 bg-white/10 rounded-lg appearance-none cursor-pointer accent-blue-500"
                                                    }, void 0, false, {
                                                        fileName: "[project]/OneDrive/Desktop/n8n/Playwrite/frontend-dashboard/app/live-view/page.tsx",
                                                        lineNumber: 347,
                                                        columnNumber: 41
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/OneDrive/Desktop/n8n/Playwrite/frontend-dashboard/app/live-view/page.tsx",
                                                lineNumber: 342,
                                                columnNumber: 37
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$n8n$2f$Playwrite$2f$frontend$2d$dashboard$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "space-y-2",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$n8n$2f$Playwrite$2f$frontend$2d$dashboard$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "flex justify-between text-[10px] font-bold uppercase tracking-widest text-gray-500",
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$n8n$2f$Playwrite$2f$frontend$2d$dashboard$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                children: "Session Duration"
                                                            }, void 0, false, {
                                                                fileName: "[project]/OneDrive/Desktop/n8n/Playwrite/frontend-dashboard/app/live-view/page.tsx",
                                                                lineNumber: 357,
                                                                columnNumber: 45
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$n8n$2f$Playwrite$2f$frontend$2d$dashboard$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                className: "text-purple-400",
                                                                children: [
                                                                    params.duration,
                                                                    " Minutes"
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/OneDrive/Desktop/n8n/Playwrite/frontend-dashboard/app/live-view/page.tsx",
                                                                lineNumber: 358,
                                                                columnNumber: 45
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/OneDrive/Desktop/n8n/Playwrite/frontend-dashboard/app/live-view/page.tsx",
                                                        lineNumber: 356,
                                                        columnNumber: 41
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$n8n$2f$Playwrite$2f$frontend$2d$dashboard$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                        type: "range",
                                                        min: "5",
                                                        max: "120",
                                                        step: "5",
                                                        value: params.duration,
                                                        onChange: (e)=>setParams((p)=>({
                                                                    ...p,
                                                                    duration: parseInt(e.target.value)
                                                                })),
                                                        className: "w-full h-1 bg-white/10 rounded-lg appearance-none cursor-pointer accent-purple-500"
                                                    }, void 0, false, {
                                                        fileName: "[project]/OneDrive/Desktop/n8n/Playwrite/frontend-dashboard/app/live-view/page.tsx",
                                                        lineNumber: 360,
                                                        columnNumber: 41
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/OneDrive/Desktop/n8n/Playwrite/frontend-dashboard/app/live-view/page.tsx",
                                                lineNumber: 355,
                                                columnNumber: 37
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$n8n$2f$Playwrite$2f$frontend$2d$dashboard$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/5",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$n8n$2f$Playwrite$2f$frontend$2d$dashboard$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "flex flex-col",
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$n8n$2f$Playwrite$2f$frontend$2d$dashboard$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                className: "text-[10px] font-bold uppercase tracking-widest text-gray-300",
                                                                children: "Social Engagement"
                                                            }, void 0, false, {
                                                                fileName: "[project]/OneDrive/Desktop/n8n/Playwrite/frontend-dashboard/app/live-view/page.tsx",
                                                                lineNumber: 370,
                                                                columnNumber: 45
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$n8n$2f$Playwrite$2f$frontend$2d$dashboard$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                className: "text-[9px] text-gray-500",
                                                                children: "Post AI-generated comments"
                                                            }, void 0, false, {
                                                                fileName: "[project]/OneDrive/Desktop/n8n/Playwrite/frontend-dashboard/app/live-view/page.tsx",
                                                                lineNumber: 371,
                                                                columnNumber: 45
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/OneDrive/Desktop/n8n/Playwrite/frontend-dashboard/app/live-view/page.tsx",
                                                        lineNumber: 369,
                                                        columnNumber: 41
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$n8n$2f$Playwrite$2f$frontend$2d$dashboard$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                        onClick: ()=>setParams((p)=>({
                                                                    ...p,
                                                                    postComments: !p.postComments
                                                                })),
                                                        className: `w-12 h-6 rounded-full transition-all relative ${params.postComments ? 'bg-green-500/20 border-green-500/30' : 'bg-white/10 border-white/10'} border`,
                                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$n8n$2f$Playwrite$2f$frontend$2d$dashboard$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: `absolute top-1 w-4 h-4 rounded-full transition-all ${params.postComments ? 'right-1 bg-green-400' : 'left-1 bg-gray-500'}`
                                                        }, void 0, false, {
                                                            fileName: "[project]/OneDrive/Desktop/n8n/Playwrite/frontend-dashboard/app/live-view/page.tsx",
                                                            lineNumber: 377,
                                                            columnNumber: 45
                                                        }, this)
                                                    }, void 0, false, {
                                                        fileName: "[project]/OneDrive/Desktop/n8n/Playwrite/frontend-dashboard/app/live-view/page.tsx",
                                                        lineNumber: 373,
                                                        columnNumber: 41
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/OneDrive/Desktop/n8n/Playwrite/frontend-dashboard/app/live-view/page.tsx",
                                                lineNumber: 368,
                                                columnNumber: 37
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/OneDrive/Desktop/n8n/Playwrite/frontend-dashboard/app/live-view/page.tsx",
                                        lineNumber: 341,
                                        columnNumber: 33
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$n8n$2f$Playwrite$2f$frontend$2d$dashboard$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                        onClick: startAgent,
                                        className: "w-full py-4 rounded-xl font-black text-xs uppercase tracking-[0.4em] bg-blue-500 text-white shadow-lg shadow-blue-500/20 hover:scale-[1.02] active:scale-[0.98] transition-all italic flex items-center justify-center gap-3",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$n8n$2f$Playwrite$2f$frontend$2d$dashboard$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$n8n$2f$Playwrite$2f$frontend$2d$dashboard$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$zap$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Zap$3e$__["Zap"], {
                                                size: 14,
                                                fill: "currentColor"
                                            }, void 0, false, {
                                                fileName: "[project]/OneDrive/Desktop/n8n/Playwrite/frontend-dashboard/app/live-view/page.tsx",
                                                lineNumber: 386,
                                                columnNumber: 37
                                            }, this),
                                            "Launch Protocol"
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/OneDrive/Desktop/n8n/Playwrite/frontend-dashboard/app/live-view/page.tsx",
                                        lineNumber: 382,
                                        columnNumber: 33
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/OneDrive/Desktop/n8n/Playwrite/frontend-dashboard/app/live-view/page.tsx",
                                lineNumber: 330,
                                columnNumber: 29
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/OneDrive/Desktop/n8n/Playwrite/frontend-dashboard/app/live-view/page.tsx",
                            lineNumber: 324,
                            columnNumber: 25
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/OneDrive/Desktop/n8n/Playwrite/frontend-dashboard/app/live-view/page.tsx",
                    lineNumber: 318,
                    columnNumber: 21
                }, this)
            }, void 0, false, {
                fileName: "[project]/OneDrive/Desktop/n8n/Playwrite/frontend-dashboard/app/live-view/page.tsx",
                lineNumber: 316,
                columnNumber: 13
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/OneDrive/Desktop/n8n/Playwrite/frontend-dashboard/app/live-view/page.tsx",
        lineNumber: 145,
        columnNumber: 9
    }, this);
}
_s(LiveViewPage, "DIFKmN0cynaY2is/y6OcTJmmCr8=");
_c = LiveViewPage;
function StatusBadge({ status }) {
    const config = {
        running: {
            color: 'text-green-400',
            label: 'ACTIVE'
        },
        paused: {
            color: 'text-amber-400',
            label: 'SUSPENDED'
        },
        stopped: {
            color: 'text-red-400',
            label: 'OFFLINE'
        }
    };
    const { color, label } = config[status] || config.stopped;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$n8n$2f$Playwrite$2f$frontend$2d$dashboard$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$n8n$2f$Playwrite$2f$frontend$2d$dashboard$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("text-[8px] font-black px-2 py-0.5 rounded border border-white/10 bg-black/40 italic flex items-center gap-2", color),
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$n8n$2f$Playwrite$2f$frontend$2d$dashboard$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$n8n$2f$Playwrite$2f$frontend$2d$dashboard$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("w-1 h-1 rounded-full", status === 'running' ? "bg-green-500 animate-pulse" : "bg-current")
            }, void 0, false, {
                fileName: "[project]/OneDrive/Desktop/n8n/Playwrite/frontend-dashboard/app/live-view/page.tsx",
                lineNumber: 407,
                columnNumber: 13
            }, this),
            label
        ]
    }, void 0, true, {
        fileName: "[project]/OneDrive/Desktop/n8n/Playwrite/frontend-dashboard/app/live-view/page.tsx",
        lineNumber: 406,
        columnNumber: 9
    }, this);
}
_c1 = StatusBadge;
function DeckButton({ label, icon: Icon, onClick, disabled, color, active, danger }) {
    const colors = {
        blue: "hover:bg-blue-500/10 hover:border-blue-500/30 text-blue-400",
        purple: "hover:bg-purple-500/10 hover:border-purple-500/30 text-purple-400",
        amber: "hover:bg-amber-500/10 hover:border-amber-500/30 text-amber-400",
        red: "hover:bg-red-500/20 hover:border-red-500/30 text-red-500"
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$n8n$2f$Playwrite$2f$frontend$2d$dashboard$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
        onClick: onClick,
        disabled: disabled && !active && !danger,
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$n8n$2f$Playwrite$2f$frontend$2d$dashboard$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("flex flex-col items-center gap-2 p-4 rounded-xl border border-white/5 bg-white/5 transition-all duration-300 group disabled:opacity-20", colors[color], active && "bg-amber-500/20 border-amber-500/40", danger && "bg-red-500/5"),
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$n8n$2f$Playwrite$2f$frontend$2d$dashboard$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(Icon, {
                size: 20,
                className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$n8n$2f$Playwrite$2f$frontend$2d$dashboard$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("transition-transform group-hover:scale-110", active && "animate-pulse")
            }, void 0, false, {
                fileName: "[project]/OneDrive/Desktop/n8n/Playwrite/frontend-dashboard/app/live-view/page.tsx",
                lineNumber: 432,
                columnNumber: 13
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$n8n$2f$Playwrite$2f$frontend$2d$dashboard$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                className: "text-[9px] font-black uppercase tracking-widest text-center",
                children: label
            }, void 0, false, {
                fileName: "[project]/OneDrive/Desktop/n8n/Playwrite/frontend-dashboard/app/live-view/page.tsx",
                lineNumber: 433,
                columnNumber: 13
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/OneDrive/Desktop/n8n/Playwrite/frontend-dashboard/app/live-view/page.tsx",
        lineNumber: 422,
        columnNumber: 9
    }, this);
}
_c2 = DeckButton;
function PerformanceMetric({ label, value, color }) {
    const colors = {
        blue: 'bg-blue-500',
        purple: 'bg-purple-500',
        green: 'bg-green-500'
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$n8n$2f$Playwrite$2f$frontend$2d$dashboard$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "space-y-1.5",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$n8n$2f$Playwrite$2f$frontend$2d$dashboard$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex justify-between items-end",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$n8n$2f$Playwrite$2f$frontend$2d$dashboard$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        className: "text-[9px] font-bold text-gray-500 uppercase tracking-tighter",
                        children: label
                    }, void 0, false, {
                        fileName: "[project]/OneDrive/Desktop/n8n/Playwrite/frontend-dashboard/app/live-view/page.tsx",
                        lineNumber: 447,
                        columnNumber: 17
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$n8n$2f$Playwrite$2f$frontend$2d$dashboard$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        className: "text-[10px] font-black text-white italic",
                        children: [
                            value,
                            "%"
                        ]
                    }, void 0, true, {
                        fileName: "[project]/OneDrive/Desktop/n8n/Playwrite/frontend-dashboard/app/live-view/page.tsx",
                        lineNumber: 448,
                        columnNumber: 17
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/OneDrive/Desktop/n8n/Playwrite/frontend-dashboard/app/live-view/page.tsx",
                lineNumber: 446,
                columnNumber: 13
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$n8n$2f$Playwrite$2f$frontend$2d$dashboard$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "h-1 bg-white/5 rounded-full overflow-hidden",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$n8n$2f$Playwrite$2f$frontend$2d$dashboard$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$n8n$2f$Playwrite$2f$frontend$2d$dashboard$2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["motion"].div, {
                    initial: {
                        width: 0
                    },
                    animate: {
                        width: `${value}%`
                    },
                    className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$n8n$2f$Playwrite$2f$frontend$2d$dashboard$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("h-full", colors[color])
                }, void 0, false, {
                    fileName: "[project]/OneDrive/Desktop/n8n/Playwrite/frontend-dashboard/app/live-view/page.tsx",
                    lineNumber: 451,
                    columnNumber: 17
                }, this)
            }, void 0, false, {
                fileName: "[project]/OneDrive/Desktop/n8n/Playwrite/frontend-dashboard/app/live-view/page.tsx",
                lineNumber: 450,
                columnNumber: 13
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/OneDrive/Desktop/n8n/Playwrite/frontend-dashboard/app/live-view/page.tsx",
        lineNumber: 445,
        columnNumber: 9
    }, this);
}
_c3 = PerformanceMetric;
var _c, _c1, _c2, _c3;
__turbopack_context__.k.register(_c, "LiveViewPage");
__turbopack_context__.k.register(_c1, "StatusBadge");
__turbopack_context__.k.register(_c2, "DeckButton");
__turbopack_context__.k.register(_c3, "PerformanceMetric");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
]);

//# sourceMappingURL=OneDrive_Desktop_n8n_Playwrite_frontend-dashboard_ab522665._.js.map