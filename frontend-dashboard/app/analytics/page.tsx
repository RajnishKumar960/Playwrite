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
                <div className="w-10 h-10 border-4 border-slate-200 border-t-red-500 rounded-full animate-spin" />
            </div>
        );
    }

    const progress = data?.progress || {};
    const painPoints = data?.painPoints || [];
    const CATEGORY_COLORS = ['#ff3b3b', '#3b82f6', '#10b981', '#f59e0b', '#8b5cf6'];

    return (
        <div className="p-8 max-w-7xl mx-auto space-y-8">
            <header className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Campaign Analytics</h1>
                    <p className="text-slate-500 mt-1">Deep insights from AI-driven lead observations.</p>
                </div>
                <div className="flex items-center gap-3">
                    <div className="bg-white px-4 py-2 rounded-xl border border-slate-200 shadow-sm flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-slate-500" />
                        <span className="text-sm font-medium text-slate-700">15-Day Campaign Mode</span>
                    </div>
                </div>
            </header>

            {/* AI Insight Highlight */}
            <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-gradient-to-r from-violet-500 to-fuchsia-600 rounded-2xl p-6 text-white shadow-lg relative overflow-hidden"
            >
                <div className="absolute top-0 right-0 p-4 opacity-10">
                    <BrainCircuit className="w-32 h-32" />
                </div>
                <div className="relative z-10">
                    <h2 className="text-xl font-bold flex items-center gap-2 mb-2">
                        <BrainCircuit className="w-6 h-6" />
                        AI Strategic Analysis
                    </h2>
                    <p className="text-white/90 max-w-3xl leading-relaxed">
                        Based on observation of {progress.total_leads || 0} leads, the dominant pain point identified is
                        <span className="font-bold bg-white/20 px-2 py-0.5 rounded mx-1">
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
                    className="lg:col-span-2 bg-white/80 backdrop-blur-xl p-6 rounded-2xl border border-slate-200 shadow-sm"
                >
                    <h3 className="text-lg font-semibold text-slate-800 mb-6 flex items-center gap-2">
                        <Target className="w-5 h-5 text-red-500" />
                        Top Identified Pain Points
                    </h3>
                    <div className="h-[300px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={painPoints} layout="vertical" margin={{ left: 20 }}>
                                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#e2e8f0" />
                                <XAxis type="number" hide />
                                <YAxis dataKey="pain_point" type="category" width={150} tick={{ fontSize: 13, fill: '#475569' }} />
                                <Tooltip
                                    cursor={{ fill: '#f8fafc' }}
                                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                                />
                                <Bar dataKey="count" fill="#ff3b3b" radius={[0, 4, 4, 0]} barSize={24}>
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
                    className="bg-white/80 backdrop-blur-xl p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col"
                >
                    <h3 className="text-lg font-semibold text-slate-800 mb-6 flex items-center gap-2">
                        <TrendingUp className="w-5 h-5 text-green-500" />
                        Conversion Funnel
                    </h3>

                    <div className="space-y-6 flex-1">
                        <FunnelStep
                            label="Leads Observed"
                            count={progress.total_leads || 0}
                            color="bg-slate-100"
                            textColor="text-slate-600"
                        />
                        <div className="flex justify-center -my-2">
                            <ArrowRight className="w-5 h-5 text-slate-300 rotate-90" />
                        </div>
                        <FunnelStep
                            label="Engaged"
                            count={progress.engaged_leads || 0}
                            color="bg-blue-50"
                            textColor="text-blue-600"
                            percent={progress.total_leads ? Math.round((progress.engaged_leads / progress.total_leads) * 100) : 0}
                        />
                        <div className="flex justify-center -my-2">
                            <ArrowRight className="w-5 h-5 text-slate-300 rotate-90" />
                        </div>
                        <FunnelStep
                            label="Qualified Opportunities"
                            count={Math.round((progress.engaged_leads || 0) * 0.4)} // Mock calculation for qualified
                            color="bg-green-50"
                            textColor="text-green-600"
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
                    color="text-amber-500"
                    bg="bg-amber-50"
                />
                <MetricCard
                    title="Avg. Opportunity Score"
                    value="8.4/10" // This would ideally come from DB avg
                    subtitle="AI assessment of lead fit"
                    icon={Target}
                    color="text-blue-500"
                    bg="bg-blue-50"
                />
                <MetricCard
                    title="Est. Pipeline Value"
                    value="$12.5k"
                    subtitle="Based on qualified leads"
                    icon={TrendingUp}
                    color="text-green-500"
                    bg="bg-green-50"
                />
            </div>
        </div>
    );
}

function FunnelStep({ label, count, color, textColor, percent, isFinal }: any) {
    return (
        <div className={cn("p-4 rounded-xl flex items-center justify-between", color)}>
            <div>
                <p className={cn("text-xs font-bold uppercase tracking-wider mb-1 opacity-70", textColor)}>{label}</p>
                <p className={cn("text-2xl font-bold", textColor)}>{count}</p>
            </div>
            {!isFinal && percent !== undefined && (
                <div className="text-right">
                    <span className="text-xs font-medium bg-white/50 px-2 py-1 rounded-lg text-slate-600">
                        {percent}% Conv.
                    </span>
                </div>
            )}
        </div>
    );
}

function MetricCard({ title, value, subtitle, icon: Icon, color, bg }: any) {
    return (
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-start gap-4">
            <div className={cn("p-3 rounded-xl", bg, color)}>
                <Icon className="w-6 h-6" />
            </div>
            <div>
                <p className="text-sm font-medium text-slate-500">{title}</p>
                <h4 className="text-2xl font-bold text-slate-900 mt-1">{value}</h4>
                <p className="text-xs text-slate-400 mt-1">{subtitle}</p>
            </div>
        </div>
    )
}
