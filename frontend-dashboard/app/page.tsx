
"use client";

import { useEffect, useState } from "react";
import {
    Users,
    UserCheck,
    Send,
    BarChart3,
    TrendingUp,
    MessageSquare,
    Zap,
    BrainCircuit,
    Activity,
    Filter,
    ArrowRight
} from "lucide-react";
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    AreaChart,
    Area,
    RadarChart,
    PolarGrid,
    PolarAngleAxis,
    PolarRadiusAxis,
    Radar,
    LineChart,
    Line,
    Legend,
    Cell
} from 'recharts';
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

// Types
interface DashboardStats {
    totalLeads: number;
    connected: number;
    connectionsSent: number;
    replied: number;
    conversionRate: number;
    painPoints: { name: string; value: number }[];
    recentActivity: { id: string; user: string; action: string; time: string; icon: string; target: string }[];
    funnel: { name: string; value: number; fill: string }[];
    outreachVelocity: { name: string; sent: number; accepted: number }[];
}

const DEFAULT_STATS: DashboardStats = {
    totalLeads: 0,
    connected: 0,
    connectionsSent: 0,
    replied: 0,
    conversionRate: 0,
    painPoints: [],
    recentActivity: [],
    funnel: [],
    outreachVelocity: []
};

export default function DashboardPage() {
    const [stats, setStats] = useState<DashboardStats>(DEFAULT_STATS);
    const [loading, setLoading] = useState(true);

    // Poll for real-time updates
    useEffect(() => {
        const fetchStats = async () => {
            try {
                const res = await fetch('/api/leads/stats');
                if (res.ok) {
                    const data = await res.json();
                    setStats(data);
                }
            } catch (err) {
                console.error("Failed to fetch dashboard stats", err);
            } finally {
                setLoading(false);
            }
        };

        fetchStats();
        const interval = setInterval(fetchStats, 5000); // 5s Polling for "Real-time" feel
        return () => clearInterval(interval);
    }, []);

    const containerVariants = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1
            }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        show: { opacity: 1, y: 0 }
    };

    return (
        <div className="p-4 md:p-8 max-w-[1600px] mx-auto space-y-6">
            <motion.div
                initial="hidden"
                animate="show"
                variants={containerVariants}
                className="space-y-6"
            >
                {/* Header */}
                <motion.div variants={itemVariants} className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-3xl md:text-4xl font-extrabold text-white tracking-tight">Command Center</h1>
                        <p className="text-slate-400 mt-1 font-light">Real-time Campaign Intelligence & Analytics</p>
                    </div>
                    <div className="flex items-center gap-3 text-sm font-medium bg-slate-900/50 border border-slate-800 px-4 py-2 rounded-full">
                        <div className="flex items-center gap-2">
                            <span className="relative flex h-2.5 w-2.5">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
                            </span>
                            <span className="text-slate-300">System Operational</span>
                        </div>
                        <div className="h-4 w-[1px] bg-slate-700 mx-2"></div>
                        <span className="text-cyan-400">v2.4.0 Live</span>
                    </div>
                </motion.div>

                {/* KPI Metrics Row */}
                <motion.div variants={itemVariants} className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                    <StatCard
                        title="Total Leads"
                        value={stats.totalLeads.toLocaleString()}
                        subValue="Active Pipeline"
                        icon={Users}
                        color="blue"
                        trend="+12%"
                    />
                    <StatCard
                        title="Requests Sent"
                        value={stats.connectionsSent.toLocaleString()}
                        subValue="Pending Approval"
                        icon={Send}
                        color="violet"
                        trend="+5%"
                    />
                    <StatCard
                        title="Connections"
                        value={stats.connected.toLocaleString()}
                        subValue={`${stats.conversionRate}% Conversion`}
                        icon={UserCheck}
                        color="emerald"
                        trend="Stable"
                    />
                    <StatCard
                        title="Total Replies"
                        value={stats.replied.toLocaleString()}
                        subValue="Engagement"
                        icon={MessageSquare}
                        color="rose"
                        trend="+8%"
                    />
                </motion.div>

                {/* Main Analytics Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                    {/* Outreach Velocity (Area Chart) */}
                    <motion.div variants={itemVariants} className="lg:col-span-2 glass-card p-6 rounded-2xl flex flex-col min-h-[400px]">
                        <div className="flex items-center justify-between mb-6">
                            <div>
                                <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                                    <TrendingUp className="w-5 h-5 text-cyan-400" />
                                    Outreach Velocity
                                </h3>
                                <p className="text-xs text-slate-400">Requests Sent vs Connections Accepted (Last 7 Days)</p>
                            </div>
                        </div>
                        <div className="flex-1 w-full min-h-0">
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={stats.outreachVelocity}>
                                    <defs>
                                        <linearGradient id="colorSent" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3} />
                                            <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
                                        </linearGradient>
                                        <linearGradient id="colorAccepted" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                                            <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                                    <XAxis dataKey="name" stroke="#475569" tick={{ fill: '#64748b', fontSize: 12 }} dy={10} />
                                    <YAxis stroke="#475569" tick={{ fill: '#64748b', fontSize: 12 }} />
                                    <Tooltip
                                        contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #334155', borderRadius: '8px', color: '#fff' }}
                                        itemStyle={{ fontSize: '12px' }}
                                    />
                                    <Legend wrapperStyle={{ paddingTop: '20px' }} />
                                    <Area type="monotone" name="Requests Sent" dataKey="sent" stroke="#8b5cf6" strokeWidth={3} fill="url(#colorSent)" />
                                    <Area type="monotone" name="Accepted" dataKey="accepted" stroke="#10b981" strokeWidth={3} fill="url(#colorAccepted)" />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </motion.div>

                    {/* Funnel Health (Bar Chart vertical layout) */}
                    <motion.div variants={itemVariants} className="glass-card p-6 rounded-2xl flex flex-col min-h-[400px]">
                        <h3 className="text-lg font-semibold text-white mb-2 flex items-center gap-2">
                            <Filter className="w-5 h-5 text-indigo-400" />
                            Funnel Health
                        </h3>
                        <p className="text-xs text-slate-400 mb-6">Conversion Drop-off Analysis</p>

                        <div className="flex-1 w-full min-h-0">
                            {/* We use a Bar chart layout to simulate a Funnel */}
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={stats.funnel} layout="vertical" margin={{ left: 0 }}>
                                    <XAxis type="number" hide />
                                    <YAxis dataKey="name" type="category" width={80} tick={{ fill: '#cbd5e1', fontSize: 12, fontWeight: 500 }} />
                                    <Tooltip
                                        cursor={{ fill: 'rgba(255,255,255,0.05)' }}
                                        contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #334155', borderRadius: '8px' }}
                                    />
                                    <Bar dataKey="value" radius={[0, 4, 4, 0]} barSize={40}>
                                        {/* Dynamic cell coloring is handled by data having 'fill' prop, but Recharts needs explicit Cell mapping or payload usage.
                                            Since we passed 'fill' in data, let's map it. 
                                        */}
                                        {stats.funnel.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={entry.fill} />
                                        ))}
                                    </Bar>
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                        {/* Custom Legend / Insights */}
                        <div className="mt-4 pt-4 border-t border-slate-800 grid grid-cols-2 gap-2 text-xs">
                            <div className="bg-slate-800/50 rounded p-2 text-center text-slate-300">
                                <span className="block text-indigo-400 font-bold text-lg">{stats.connectionsSent > 0 ? ((stats.connected / stats.connectionsSent) * 100).toFixed(1) : 0}%</span>
                                Acceptance Rate
                            </div>
                            <div className="bg-slate-800/50 rounded p-2 text-center text-slate-300">
                                <span className="block text-rose-400 font-bold text-lg">{stats.connected > 0 ? ((stats.replied / stats.connected) * 100).toFixed(1) : 0}%</span>
                                Reply Rate
                            </div>
                        </div>
                    </motion.div>

                    {/* Pain Points (Radar) */}
                    <motion.div variants={itemVariants} className="glass-card p-6 rounded-2xl flex flex-col h-[350px]">
                        <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                            <Zap className="w-5 h-5 text-amber-400" />
                            Pain Point Radar
                        </h3>
                        <div className="flex-1 w-full min-h-0 relative">
                            <ResponsiveContainer width="100%" height="100%">
                                <RadarChart cx="50%" cy="50%" outerRadius="70%" data={stats.painPoints}>
                                    <PolarGrid stroke="#334155" />
                                    <PolarAngleAxis dataKey="name" tick={{ fill: '#94a3b8', fontSize: 10 }} />
                                    <PolarRadiusAxis angle={30} domain={[0, 'auto']} stroke="#475569" />
                                    <Radar name="Mentions" dataKey="value" stroke="#f59e0b" fill="#f59e0b" fillOpacity={0.4} />
                                    <Tooltip
                                        contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #334155', borderRadius: '8px', color: '#f1f5f9' }}
                                        itemStyle={{ color: '#f59e0b' }}
                                    />
                                </RadarChart>
                            </ResponsiveContainer>
                        </div>
                    </motion.div>

                    {/* Recent Activity (List) */}
                    <motion.div variants={itemVariants} className="lg:col-span-2 glass-card p-0 rounded-2xl overflow-hidden flex flex-col h-[350px]">
                        <div className="p-6 border-b border-white/5 bg-slate-900/40 flex items-center justify-between">
                            <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                                <Activity className="w-5 h-5 text-blue-400" />
                                Live Activity Stream
                            </h3>
                            <div className="flex gap-2">
                                <span className="text-xs font-mono text-slate-500 bg-black/30 px-2 py-1 rounded">LIVE</span>
                            </div>
                        </div>
                        <div className="flex-1 overflow-y-auto scrollbar-thin p-0">
                            {stats.recentActivity.length === 0 ? (
                                <div className="h-full flex flex-col items-center justify-center text-slate-500 gap-2">
                                    <Activity className="w-8 h-8 opacity-20" />
                                    <p>Waiting for agent signals...</p>
                                </div>
                            ) : (
                                <div className="divide-y divide-white/5">
                                    {stats.recentActivity.map((item, i) => (
                                        <div key={i} className="px-6 py-4 flex items-center gap-4 hover:bg-white/5 transition-colors group">
                                            <div className={cn("p-2 rounded-lg border shrink-0", {
                                                "bg-blue-500/10 border-blue-500/20 text-blue-400": item.icon === "message",
                                                "bg-emerald-500/10 border-emerald-500/20 text-emerald-400": item.icon === "thumbs-up"
                                            })}>
                                                {item.icon === "message" ? <MessageSquare className="w-4 h-4" /> : <TrendingUp className="w-4 h-4" />}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="text-sm font-medium text-slate-200 truncate">
                                                    <span className="font-bold text-white group-hover:text-blue-300 transition-colors">{item.user}</span>
                                                    <span className="text-slate-500 font-normal mx-1">•</span>
                                                    {item.action}
                                                </p>
                                                <p className="text-xs text-slate-500 mt-0.5 truncate">{item.target}</p>
                                            </div>
                                            <span className="text-xs text-slate-600 font-mono whitespace-nowrap">{new Date(item.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </motion.div>
                </div>
            </motion.div>
        </div>
    );
}

function StatCard({ title, value, subValue, trend, icon: Icon, color }: any) {
    const colorStyles: any = {
        blue: "text-blue-400 bg-blue-500/10 border-blue-500/20",
        violet: "text-violet-400 bg-violet-500/10 border-violet-500/20",
        emerald: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20",
        rose: "text-rose-400 bg-rose-500/10 border-rose-500/20",
    };

    return (
        <div className="glass-card p-5 rounded-xl border border-white/5 hover:border-white/10 transition-all duration-300 group relative overflow-hidden">
            <div className={`absolute top-0 right-0 p-3 opacity-10 group-hover:opacity-20 transition-opacity transform group-hover:scale-110 duration-500`}>
                <Icon className={`w-24 h-24 ${colorStyles[color].split(" ")[0]}`} />
            </div>

            <div className="relative z-10">
                <div className="flex items-center justify-between mb-4">
                    <div className={cn("p-2 rounded-lg border", colorStyles[color])}>
                        <Icon className="w-5 h-5" />
                    </div>
                    {trend && (
                        <span className="text-xs font-bold text-emerald-400 bg-emerald-500/10 px-2 py-1 rounded">
                            {trend}
                        </span>
                    )}
                </div>
                <div>
                    <h3 className="text-3xl font-bold text-white tracking-tight mb-1">{value}</h3>
                    <p className="text-xs font-medium text-slate-400 uppercase tracking-wider">{title}</p>
                    <p className="text-xs text-slate-500 mt-2 font-mono">{subValue}</p>
                </div>
            </div>
        </div>
    );
}

