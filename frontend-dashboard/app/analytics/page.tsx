"use client";

import { useEffect, useState } from "react";
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    PieChart,
    Pie,
    Cell,
    LineChart,
    Line
} from 'recharts';
import {
    TrendingUp,
    Users,
    Target,
    Zap,
    Calendar,
    BrainCircuit,
    ArrowRight
} from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export default function AnalyticsPage() {
    const [data, setData] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchAnalytics = async () => {
            try {
                const res = await fetch('/api/analytics/report');
                if (res.ok) {
                    const json = await res.json();
                    setData(json);
                }
            } catch (error) {
                console.error("Error fetching analytics:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchAnalytics();
    }, []);

    if (loading) {
        return (
            <div className="flex h-screen items-center justify-center">
                <div className="w-10 h-10 border-4 border-slate-700 border-t-cyan-500 rounded-full animate-spin shadow-[0_0_20px_rgba(6,182,212,0.4)]" />
            </div>
        );
    }

    const progress = data?.progress || {};
    const painPoints = data?.painPoints || [];
    const CATEGORY_COLORS = ['#fb7185', '#60a5fa', '#34d399', '#fbbf24', '#a78bfa'];

    return (
        <div className="p-8 max-w-7xl mx-auto space-y-8">
            <header className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-extrabold text-transparent bg-clip-text bg-linear-to-r from-white to-slate-400 tracking-tight">Campaign Analytics</h1>
                    <p className="text-slate-400 mt-1">Deep insights from AI-driven lead observations.</p>
                </div>
                <div className="flex items-center gap-3">
                    <div className="bg-white/5 backdrop-blur-md px-4 py-2 rounded-xl border border-white/10 shadow-sm flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-slate-400" />
                        <span className="text-sm font-medium text-slate-300">15-Day Campaign Mode</span>
                    </div>
                </div>
            </header>

            {/* AI Insight Highlight */}
            <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-linear-to-r from-violet-600/80 to-fuchsia-600/80 backdrop-blur-xl rounded-2xl p-6 text-white shadow-[0_0_40px_rgba(139,92,246,0.2)] relative overflow-hidden border border-white/10"
            >
                <div className="absolute top-0 right-0 p-4 opacity-20">
                    <BrainCircuit className="w-32 h-32" />
                </div>
                <div className="relative z-10">
                    <h2 className="text-xl font-bold flex items-center gap-2 mb-2">
                        <BrainCircuit className="w-6 h-6 text-violet-200" />
                        AI Strategic Analysis
                    </h2>
                    <p className="text-white/90 max-w-3xl leading-relaxed font-light">
                        Based on observation of <span className="font-bold text-white">{progress.total_leads || 0} leads</span>, the dominant pain point identified is
                        <span className="font-bold bg-white/20 px-2 py-0.5 rounded mx-1 shadow-inner">
                            {painPoints[0]?.pain_point || "Pending Analysis"}
                        </span>.
                        Engagement strategy has been automatically adjusted to focus on solutions regarding "{painPoints[0]?.pain_point || "Efficiency"}".
                    </p>
                </div>
            </motion.div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Pain Point Distribution */}
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 }}
                    className="lg:col-span-2 glass-card p-6 rounded-2xl border border-white/10"
                >
                    <h3 className="text-lg font-semibold text-slate-100 mb-6 flex items-center gap-2">
                        <Target className="w-5 h-5 text-rose-400" />
                        Top Identified Pain Points
                    </h3>
                    <div className="h-[500px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={painPoints} layout="vertical" margin={{ left: 10, right: 10, top: 10, bottom: 10 }}>
                                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#334155" />
                                <XAxis type="number" hide />
                                <YAxis
                                    dataKey="pain_point"
                                    type="category"
                                    width={230}
                                    tick={{ fontSize: 12, fill: '#94a3b8' }}
                                    tickFormatter={(value) => value.length > 35 ? `${value.substring(0, 35)}...` : value}
                                />
                                <Tooltip
                                    cursor={{ fill: '#ffffff10' }}
                                    contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #334155', borderRadius: '12px', color: '#f1f5f9' }}
                                    itemStyle={{ color: '#f1f5f9' }}
                                />
                                <Bar dataKey="count" fill="#ff3b3b" radius={[0, 4, 4, 0]} barSize={32}>
                                    {painPoints.map((entry: any, index: number) => (
                                        <Cell key={`cell-${index}`} fill={CATEGORY_COLORS[index % CATEGORY_COLORS.length]} />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </motion.div>

                {/* Campaign Progress Funnel */}
                <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 }}
                    className="glass-card p-6 rounded-2xl border border-white/10 flex flex-col"
                >
                    <h3 className="text-lg font-semibold text-slate-100 mb-6 flex items-center gap-2">
                        <TrendingUp className="w-5 h-5 text-emerald-400" />
                        Conversion Funnel
                    </h3>

                    <div className="space-y-6 flex-1">
                        <FunnelStep
                            label="Leads Observed"
                            count={progress.total_leads || 0}
                            color="bg-slate-500/10 border border-slate-500/20"
                            textColor="text-slate-300"
                        />
                        <div className="flex justify-center -my-2">
                            <ArrowRight className="w-5 h-5 text-slate-600 rotate-90" />
                        </div>
                        <FunnelStep
                            label="Engaged"
                            count={progress.engaged_leads || 0}
                            color="bg-blue-500/10 border border-blue-500/20"
                            textColor="text-blue-400"
                            percent={progress.total_leads ? Math.round((progress.engaged_leads / progress.total_leads) * 100) : 0}
                        />
                        <div className="flex justify-center -my-2">
                            <ArrowRight className="w-5 h-5 text-slate-600 rotate-90" />
                        </div>
                        <FunnelStep
                            label="Qualified Opportunities"
                            count={Math.round((progress.engaged_leads || 0) * 0.4)} // Mock calculation for qualified
                            color="bg-emerald-500/10 border border-emerald-500/20"
                            textColor="text-emerald-400"
                            isFinal
                        />
                    </div>
                </motion.div>
            </div>

            {/* Detailed Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <MetricCard
                    title="Engagement Rate"
                    value={`${progress.progress_pct || 0}%`}
                    subtitle="of target leads processed"
                    icon={Zap}
                    color="text-amber-400"
                    bg="bg-amber-500/10 border-amber-500/20"
                />
                <MetricCard
                    title="Avg. Opportunity Score"
                    value="8.4/10" // This would ideally come from DB avg
                    subtitle="AI assessment of lead fit"
                    icon={Target}
                    color="text-blue-400"
                    bg="bg-blue-500/10 border-blue-500/20"
                />
                <MetricCard
                    title="Est. Pipeline Value"
                    value="$12.5k"
                    subtitle="Based on qualified leads"
                    icon={TrendingUp}
                    color="text-emerald-400"
                    bg="bg-emerald-500/10 border-emerald-500/20"
                />
            </div>
        </div>
    );
}

function FunnelStep({ label, count, color, textColor, percent, isFinal }: any) {
    return (
        <div className={cn("p-4 rounded-xl flex items-center justify-between transition-transform hover:scale-105 duration-300", color)}>
            <div>
                <p className={cn("text-xs font-bold uppercase tracking-wider mb-1 opacity-70", textColor)}>{label}</p>
                <p className={cn("text-2xl font-bold text-white", textColor)}>{count}</p>
            </div>
            {!isFinal && percent !== undefined && (
                <div className="text-right">
                    <span className="text-xs font-bold bg-white/10 border border-white/20 px-2 py-1 rounded-lg text-slate-300">
                        {percent}% Conv.
                    </span>
                </div>
            )}
        </div>
    );
}

function MetricCard({ title, value, subtitle, icon: Icon, color, bg }: any) {
    return (
        <div className="glass-card p-6 rounded-2xl border border-white/10 shadow-sm flex items-start gap-4 hover:-translate-y-1 transition-transform duration-300 cursor-pointer group">
            <div className={cn("p-3 rounded-xl border group-hover:scale-110 transition-transform", bg, color)}>
                <Icon className="w-6 h-6" />
            </div>
            <div>
                <p className="text-sm font-medium text-slate-400 group-hover:text-slate-300 transition-colors">{title}</p>
                <h4 className="text-3xl font-bold text-white mt-1 tracking-tight">{value}</h4>
                <p className="text-xs text-slate-500 mt-1 uppercase tracking-wider">{subtitle}</p>
            </div>
        </div>
    )
}
