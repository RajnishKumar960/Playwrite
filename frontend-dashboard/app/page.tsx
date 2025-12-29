
"use client";

import { useEffect, useState } from "react";
import {
    Users,
    UserCheck,
    Send,
    BarChart3,
    TrendingUp,
    ArrowUpRight,
    MessageSquare,
    Zap,
    BrainCircuit,
    Activity
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
    Radar
} from 'recharts';
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

// Types
interface DashboardStats {
    totalLeads: number;
    connected: number;
    connectionsSent: number;
    replied: number;
    conversionRate: number;
    painPoints: { name: string; value: number }[];
    recentActivity: { id: string; user: string; action: string; time: string; icon: string; target: string }[];
}

const DEFAULT_STATS: DashboardStats = {
    totalLeads: 0,
    connected: 0,
    connectionsSent: 0,
    replied: 0,
    conversionRate: 0,
    painPoints: [],
    recentActivity: []
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

    return (
        <div className="p-8 max-w-7xl mx-auto space-y-8">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center justify-between"
            >
                <div>
                    <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Dashboard Overview</h1>
                    <p className="text-slate-500 mt-1">Real-time Agent Intelligence & Analytics</p>
                </div>
                <div className="flex items-center gap-2 text-sm text-slate-600 bg-white/50 backdrop-blur px-4 py-2 rounded-full border border-slate-200 shadow-sm">
                    <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                    Live Agent Data Connection
                </div>
            </motion.div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <StatCard
                    title="Total Leads"
                    value={stats.totalLeads.toLocaleString()}
                    trend="+12%"
                    icon={Users}
                    color="blue"
                    delay={0.1}
                />
                <StatCard
                    title="Requests Sent"
                    value={stats.connectionsSent.toLocaleString()}
                    trend="+5%"
                    icon={Send}
                    color="indigo"
                    delay={0.2}
                />
                <StatCard
                    title="Connections"
                    value={stats.connected.toLocaleString()}
                    trend={`+ ${stats.conversionRate}% Conv.`}
                    icon={UserCheck}
                    color="green"
                    delay={0.3}
                />
                <StatCard
                    title="Engagements"
                    value={stats.replied > 0 ? stats.replied.toString() : "Running..."}
                    trend="AI Active"
                    icon={BrainCircuit}
                    color="rose"
                    delay={0.4}
                />
            </div>

            {/* Analytics Section */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Pain Points Radar */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.5 }}
                    className="bg-white/80 backdrop-blur-xl p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-all"
                >
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="text-lg font-semibold text-slate-800 flex items-center gap-2">
                            <Zap className="w-5 h-5 text-amber-500" />
                            Detected Pain Points
                        </h3>
                    </div>
                    <div className="h-[300px] w-full relative">
                        {stats.painPoints.length > 0 ? (
                            <ResponsiveContainer width="100%" height="100%">
                                <RadarChart cx="50%" cy="50%" outerRadius="80%" data={stats.painPoints}>
                                    <PolarGrid stroke="#e2e8f0" />
                                    <PolarAngleAxis dataKey="name" tick={{ fill: '#64748b', fontSize: 12 }} />
                                    <PolarRadiusAxis angle={30} domain={[0, 'auto']} stroke="#cbd5e1" />
                                    <Radar name="Mentions" dataKey="value" stroke="#ff3b3b" fill="#ff3b3b" fillOpacity={0.3} />
                                    <Tooltip />
                                </RadarChart>
                            </ResponsiveContainer>
                        ) : (
                            <div className="flex flex-col items-center justify-center h-full text-slate-400">
                                <BrainCircuit className="w-12 h-12 mb-2 opacity-20" />
                                <p>Analyzing Conversations...</p>
                            </div>
                        )}
                    </div>
                </motion.div>

                {/* Growth Trend (Existing but styled) */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.6 }}
                    className="lg:col-span-2 bg-white/80 backdrop-blur-xl p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-all flex flex-col h-[400px]"
                >
                    <h3 className="text-lg font-semibold text-slate-800 mb-2 flex items-center gap-2">
                        <TrendingUp className="w-5 h-5 text-green-600" />
                        Network Expansion
                    </h3>
                    <p className="text-sm text-slate-500 mb-6">Real-time connection acceptance velocity</p>

                    <div className="flex-1 w-full min-h-0">
                        {/* Mock data for the chart visual until we have time-series endpoint */}
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={[
                                { name: 'Mon', value: stats.connected - 12 },
                                { name: 'Tue', value: stats.connected - 8 },
                                { name: 'Wed', value: stats.connected - 5 },
                                { name: 'Today', value: stats.connected }
                            ]}>
                                <defs>
                                    <linearGradient id="colorGrowth" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#22c55e" stopOpacity={0.2} />
                                        <stop offset="95%" stopColor="#22c55e" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <Tooltip
                                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 20px -5px rgba(0,0,0,0.1)' }}
                                />
                                <Area type="monotone" dataKey="value" stroke="#22c55e" strokeWidth={3} fillOpacity={1} fill="url(#colorGrowth)" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </motion.div>
            </div>

            {/* Recent Activity Feed */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 }}
                className="bg-white/80 backdrop-blur-xl rounded-2xl border border-slate-200 shadow-sm overflow-hidden"
            >
                <div className="p-6 border-b border-slate-100 flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-slate-800 flex items-center gap-2">
                        <Activity className="w-5 h-5 text-blue-500" />
                        Live Agent Activity Stream
                    </h3>
                    <span className="text-xs font-medium px-2 py-1 bg-blue-50 text-blue-600 rounded-lg">
                        {stats.recentActivity.length} Events
                    </span>
                </div>
                <div className="divide-y divide-slate-50 relative">
                    {stats.recentActivity.length === 0 ? (
                        <div className="p-8 text-center text-slate-500">
                            Waiting for agent actions...
                        </div>
                    ) : (
                        stats.recentActivity.map((item, i) => (
                            <div key={i} className="p-4 flex items-center gap-4 hover:bg-slate-50/50 transition-colors">
                                <div className={cn("p-2 rounded-full", {
                                    "bg-blue-100 text-blue-600": item.icon === "message",
                                    "bg-green-100 text-green-600": item.icon === "thumbs-up"
                                })}>
                                    {item.icon === "message" ? <MessageSquare className="w-4 h-4" /> : <TrendingUp className="w-4 h-4" />}
                                </div>
                                <div className="flex-1">
                                    <p className="text-sm font-medium text-slate-900">
                                        {item.user} <span className="text-slate-400 font-normal">was</span> {item.action.toLowerCase()}
                                    </p>
                                    <p className="text-xs text-slate-500">{item.target}</p>
                                </div>
                                <span className="text-xs text-slate-400 whitespace-nowrap">{new Date(item.time).toLocaleTimeString()}</span>
                            </div>
                        ))
                    )}
                </div>
            </motion.div>
        </div>
    );
}

function StatCard({ title, value, trend, icon: Icon, color, delay }: any) {
    const colorStyles = {
        blue: "bg-blue-50 text-blue-600",
        indigo: "bg-indigo-50 text-indigo-600",
        green: "bg-green-50 text-green-600",
        rose: "bg-rose-50 text-rose-600",
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay, duration: 0.4 }}
            className="bg-white/80 backdrop-blur-xl p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
        >
            <div className="flex items-start justify-between">
                <div>
                    <p className="text-sm font-medium text-slate-500">{title}</p>
                    <h4 className="text-3xl font-bold text-slate-900 mt-2 tracking-tight">{value}</h4>
                </div>
                <div className={cn("p-3 rounded-xl", colorStyles[color as keyof typeof colorStyles])}>
                    <Icon className="w-6 h-6" />
                </div>
            </div>
            <div className="mt-4 flex items-center text-sm">
                <span className="text-green-600 font-bold flex items-center bg-green-50 px-2 py-0.5 rounded">
                    <TrendingUp className="w-3 h-3 mr-1" />
                    {trend}
                </span>
                <span className="text-slate-400 ml-2">vs last week</span>
            </div>
        </motion.div>
    );
}

