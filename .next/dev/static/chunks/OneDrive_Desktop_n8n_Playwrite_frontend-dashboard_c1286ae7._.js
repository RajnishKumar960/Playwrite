(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/OneDrive/Desktop/n8n/Playwrite/frontend-dashboard/components/InteractiveBackground.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>InteractiveBackground
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$n8n$2f$Playwrite$2f$frontend$2d$dashboard$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/OneDrive/Desktop/n8n/Playwrite/frontend-dashboard/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$n8n$2f$Playwrite$2f$frontend$2d$dashboard$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/OneDrive/Desktop/n8n/Playwrite/frontend-dashboard/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
"use client";
;
function InteractiveBackground() {
    _s();
    const canvasRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$n8n$2f$Playwrite$2f$frontend$2d$dashboard$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$n8n$2f$Playwrite$2f$frontend$2d$dashboard$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "InteractiveBackground.useEffect": ()=>{
            const canvas = canvasRef.current;
            if (!canvas) return;
            const ctx = canvas.getContext('2d');
            if (!ctx) return;
            let width = window.innerWidth;
            let height = window.innerHeight;
            canvas.width = width;
            canvas.height = height;
            // Particle Config
            const particles = [];
            const particleCount = 100;
            const connectionDistance = 150;
            const mouseDistance = 200;
            let mouse = {
                x: 0,
                y: 0
            };
            class Particle {
                x;
                y;
                vx;
                vy;
                size;
                color;
                constructor(){
                    this.x = Math.random() * width;
                    this.y = Math.random() * height;
                    this.vx = (Math.random() - 0.5) * 0.5;
                    this.vy = (Math.random() - 0.5) * 0.5;
                    this.size = Math.random() * 2 + 1;
                    // Blue/Purple/Pink palette
                    const colors = [
                        '#60a5fa',
                        '#a78bfa',
                        '#f472b6'
                    ];
                    this.color = colors[Math.floor(Math.random() * colors.length)];
                }
                update() {
                    this.x += this.vx;
                    this.y += this.vy;
                    // Bounce off edges
                    if (this.x < 0 || this.x > width) this.vx *= -1;
                    if (this.y < 0 || this.y > height) this.vy *= -1;
                    // Mouse interaction
                    const dx = mouse.x - this.x;
                    const dy = mouse.y - this.y;
                    const dist = Math.sqrt(dx * dx + dy * dy);
                    if (dist < mouseDistance) {
                        const angle = Math.atan2(dy, dx);
                        const force = (mouseDistance - dist) / mouseDistance;
                        const pushX = Math.cos(angle) * force * 0.5;
                        const pushY = Math.sin(angle) * force * 0.5;
                        this.vx -= pushX;
                        this.vy -= pushY;
                    }
                }
                draw() {
                    if (!ctx) return;
                    ctx.beginPath();
                    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                    ctx.fillStyle = this.color;
                    ctx.fill();
                }
            }
            // Init
            for(let i = 0; i < particleCount; i++){
                particles.push(new Particle());
            }
            // Animation Loop
            function animate() {
                if (!ctx) return;
                ctx.clearRect(0, 0, width, height);
                // Draw background gradient
                const gradient = ctx.createLinearGradient(0, 0, width, height);
                gradient.addColorStop(0, '#0f172a'); // Slate 900
                gradient.addColorStop(1, '#020617'); // Slate 950
                ctx.fillStyle = gradient;
                ctx.fillRect(0, 0, width, height);
                // Update and Draw Particles
                particles.forEach({
                    "InteractiveBackground.useEffect.animate": (p)=>{
                        p.update();
                        p.draw();
                    }
                }["InteractiveBackground.useEffect.animate"]);
                // Draw Connections
                particles.forEach({
                    "InteractiveBackground.useEffect.animate": (a, i)=>{
                        particles.slice(i + 1).forEach({
                            "InteractiveBackground.useEffect.animate": (b)=>{
                                const dx = a.x - b.x;
                                const dy = a.y - b.y;
                                const dist = Math.sqrt(dx * dx + dy * dy);
                                if (dist < connectionDistance) {
                                    ctx.beginPath();
                                    ctx.strokeStyle = `rgba(100, 116, 139, ${1 - dist / connectionDistance})`;
                                    ctx.lineWidth = 0.5;
                                    ctx.moveTo(a.x, a.y);
                                    ctx.lineTo(b.x, b.y);
                                    ctx.stroke();
                                }
                            }
                        }["InteractiveBackground.useEffect.animate"]);
                    }
                }["InteractiveBackground.useEffect.animate"]);
                requestAnimationFrame(animate);
            }
            animate();
            // Event Listeners
            const handleResize = {
                "InteractiveBackground.useEffect.handleResize": ()=>{
                    width = window.innerWidth;
                    height = window.innerHeight;
                    canvas.width = width;
                    canvas.height = height;
                }
            }["InteractiveBackground.useEffect.handleResize"];
            const handleMouseMove = {
                "InteractiveBackground.useEffect.handleMouseMove": (e)=>{
                    mouse.x = e.clientX;
                    mouse.y = e.clientY;
                }
            }["InteractiveBackground.useEffect.handleMouseMove"];
            window.addEventListener('resize', handleResize);
            window.addEventListener('mousemove', handleMouseMove);
            return ({
                "InteractiveBackground.useEffect": ()=>{
                    window.removeEventListener('resize', handleResize);
                    window.removeEventListener('mousemove', handleMouseMove);
                }
            })["InteractiveBackground.useEffect"];
        }
    }["InteractiveBackground.useEffect"], []);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$n8n$2f$Playwrite$2f$frontend$2d$dashboard$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("canvas", {
        ref: canvasRef,
        className: "fixed inset-0 z-[-1] pointer-events-none"
    }, void 0, false, {
        fileName: "[project]/OneDrive/Desktop/n8n/Playwrite/frontend-dashboard/components/InteractiveBackground.tsx",
        lineNumber: 149,
        columnNumber: 9
    }, this);
}
_s(InteractiveBackground, "UJgi7ynoup7eqypjnwyX/s32POg=");
_c = InteractiveBackground;
var _c;
__turbopack_context__.k.register(_c, "InteractiveBackground");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/OneDrive/Desktop/n8n/Playwrite/frontend-dashboard/app/providers.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "Providers",
    ()=>Providers
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$n8n$2f$Playwrite$2f$frontend$2d$dashboard$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/OneDrive/Desktop/n8n/Playwrite/frontend-dashboard/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$n8n$2f$Playwrite$2f$frontend$2d$dashboard$2f$node_modules$2f40$tanstack$2f$query$2d$core$2f$build$2f$modern$2f$queryClient$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/OneDrive/Desktop/n8n/Playwrite/frontend-dashboard/node_modules/@tanstack/query-core/build/modern/queryClient.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$n8n$2f$Playwrite$2f$frontend$2d$dashboard$2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$QueryClientProvider$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/OneDrive/Desktop/n8n/Playwrite/frontend-dashboard/node_modules/@tanstack/react-query/build/modern/QueryClientProvider.js [app-client] (ecmascript)");
"use client";
;
;
// Configure React Query client
const queryClient = new __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$n8n$2f$Playwrite$2f$frontend$2d$dashboard$2f$node_modules$2f40$tanstack$2f$query$2d$core$2f$build$2f$modern$2f$queryClient$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["QueryClient"]({
    defaultOptions: {
        queries: {
            staleTime: 60 * 1000,
            refetchOnWindowFocus: false,
            retry: 1
        }
    }
});
function Providers({ children }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$n8n$2f$Playwrite$2f$frontend$2d$dashboard$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$n8n$2f$Playwrite$2f$frontend$2d$dashboard$2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$QueryClientProvider$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["QueryClientProvider"], {
        client: queryClient,
        children: children
    }, void 0, false, {
        fileName: "[project]/OneDrive/Desktop/n8n/Playwrite/frontend-dashboard/app/providers.tsx",
        lineNumber: 19,
        columnNumber: 9
    }, this);
}
_c = Providers;
var _c;
__turbopack_context__.k.register(_c, "Providers");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
]);

//# sourceMappingURL=OneDrive_Desktop_n8n_Playwrite_frontend-dashboard_c1286ae7._.js.map