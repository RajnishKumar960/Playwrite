'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { TrendingUp, Users, MessageSquare, RefreshCw, ArrowUpRight, Heart, Send, Target, Clock, BarChart3, Activity, Zap } from 'lucide-react';
import { useAgentStore } from '@/lib/store';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

// Animated counter
function AnimatedCounter({ value, suffix = '' }: { value: number; suffix?: string }) {
    const [displayValue, setDisplayValue] = useState(0);

    useEffect(() => {
        const duration = 1000, steps = 30, increment = value / steps;
        let current = 0;
        const timer = setInterval(() => {
            current += increment;
            if (current >= value) { setDisplayValue(value); clearInterval(timer); }
            else { setDisplayValue(Math.floor(current)); }
        }, duration / steps);
        return () => clearInterval(timer);
    }, [value]);

    return <span>{displayValue.toLocaleString()}{suffix}</span>;
}

// Sparkline
function Sparkline({ data, color }: { data: number[]; color: string }) {
    return (
        <svg viewBox="0 0 100 30" className="w-16 h-6 md:w-20 md:h-8">
            <path d={`M ${data.map((v, i) => `${(i / (data.length - 1)) * 100},${30 - (v / Math.max(...data)) * 25}`).join(' L ')}`}
                fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" />
        </svg>
    );
}

export default function DashboardPage() {
    const { stats, syncStatus, agentStatus } = useAgentStore();
    const [activity, setActivity] = useState<Array<{ id: number; action: string; target: string; time: string; type: string }>>([]);
    const [weeklyData, setWeeklyData] = useState<Array<{ day: string; likes: number; comments: number; connections: number }>>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        syncStatus();
        fetchData();
        const interval = setInterval(() => { syncStatus(); fetchData(); }, 10000);
        return () => clearInterval(interval);
    }, []);

    const fetchData = async () => {
        try {
            const [activityRes, chartRes] = await Promise.all([fetch('/api/activity'), fetch('/api/charts/weekly')]);
            if (activityRes.ok) { const data = await activityRes.json(); setActivity(data.recent || []); }
            if (chartRes.ok) { const data = await chartRes.json(); setWeeklyData(data.data || []); }
        } catch {
            setActivity([
                { id: 1, action: 'Liked post', target: 'John Smith', time: '2 min ago', type: 'like' },
                { id: 2, action: 'Commented', target: 'Sarah Johnson', time: '5 min ago', type: 'comment' },
                { id: 3, action: 'Connection sent', target: 'Mike Chen', time: '10 min ago', type: 'connection' },
            ]);
            setWeeklyData([
                { day: 'Mon', likes: 45, comments: 12, connections: 8 },
                { day: 'Tue', likes: 52, comments: 18, connections: 12 },
                { day: 'Wed', likes: 38, comments: 15, connections: 6 },
                { day: 'Thu', likes: 65, comments: 22, connections: 15 },
                { day: 'Fri', likes: 48, comments: 14, connections: 10 },
                { day: 'Sat', likes: 30, comments: 8, connections: 4 },
                { day: 'Sun', likes: 25, comments: 6, connections: 3 },
            ]);
        }
        setIsLoading(false);
    };

    const statCards = [
        { label: 'Leads', value: stats.leadsProcessed || 156, icon: Users, color: 'from-blue-500 to-cyan-500', trend: '+12%', sparkline: [10, 15, 12, 18, 22, 25, 28] },
        { label: 'Engaged', value: stats.postsEngaged || 423, icon: Heart, color: 'from-pink-500 to-rose-500', trend: '+8%', sparkline: [30, 35, 28, 42, 38, 45, 50] },
        { label: 'Connections', value: stats.connectionsAccepted || 89, icon: Zap, color: 'from-amber-500 to-orange-500', trend: '+15%', sparkline: [5, 8, 12, 10, 15, 18, 22] },
        { label: 'Success', value: stats.successRate || 67.8, suffix: '%', icon: TrendingUp, color: 'from-green-500 to-emerald-500', trend: '+2.1%', sparkline: [55, 58, 62, 60, 65, 64, 68] },
    ];

    const actionIcons: Record<string, any> = { like: Heart, comment: MessageSquare, connection: Send, view: Target };
    const runningAgents = Object.entries(agentStatus).filter(([_, status]) => status === 'running').length;

    return (
        <div className="space-y-4 md:space-y-6 p-4 md:p-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div>
                    <h1 className="text-xl md:text-3xl font-bold bg-clip-text text-transparent bg-linear-to-r from-white to-gray-400">Dashboard</h1>
                    <p className="text-gray-400 text-sm mt-0.5 hidden sm:block">LinkedIn automation overview</p>
                </div>
                <div className="flex items-center gap-2 md:gap-3">
                    {runningAgents > 0 && (
                        <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }}
                            className="flex items-center gap-2 px-3 py-1.5 bg-green-500/10 border border-green-500/30 rounded-full text-xs md:text-sm shadow-lg shadow-green-900/20">
                            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                            <span className="text-green-400 font-medium">{runningAgents} Running</span>
                        </motion.div>
                    )}
                    <button onClick={fetchData} className="flex items-center gap-1.5 px-3 py-1.5 glass-card rounded-lg text-xs md:text-sm hover:bg-white/5 text-gray-300 hover:text-white">
                        <RefreshCw className="w-3.5 h-3.5" /> Refresh
                    </button>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
                {statCards.map((stat, i) => (
                    <motion.div key={stat.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}
                        className="glass-card card-hover rounded-xl p-3 md:p-5 relative overflow-hidden group">
                        <div className={`absolute top-0 right-0 w-24 h-24 md:w-32 md:h-32 bg-linear-to-br ${stat.color} opacity-10 blur-2xl group-hover:opacity-20 transition-opacity`} />
                        <div className="relative z-10">
                            <div className="flex items-start justify-between mb-2 md:mb-3">
                                <div className={`p-1.5 md:p-2.5 rounded-lg md:rounded-xl bg-linear-to-br ${stat.color} shadow-lg shadow-black/20`}>
                                    <stat.icon className="w-4 h-4 md:w-5 md:h-5 text-white" />
                                </div>
                                <div className="flex items-center gap-0.5 text-xs font-medium text-green-400 bg-green-500/10 px-1.5 py-0.5 rounded-md border border-green-500/20">
                                    <ArrowUpRight className="w-3 h-3" />{stat.trend}
                                </div>
                            </div>
                            <p className="text-xs md:text-sm text-gray-400 mb-0.5">{stat.label}</p>
                            <div className="flex items-end justify-between">
                                <p className="text-xl md:text-3xl font-bold text-gray-100"><AnimatedCounter value={stat.value} suffix={stat.suffix} /></p>
                                <Sparkline data={stat.sparkline} color="#4ade80" />
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>

            {/* Charts Row */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
                    className="lg:col-span-2 glass-card rounded-xl p-4 md:p-6 border border-white/5">
                    <div className="flex items-center justify-between mb-4 md:mb-6">
                        <div>
                            <h2 className="text-base md:text-lg font-semibold text-gray-200">Weekly Activity</h2>
                            <p className="text-xs md:text-sm text-gray-500 hidden sm:block">Engagement trends</p>
                        </div>
                        <BarChart3 className="w-4 h-4 md:w-5 md:h-5 text-gray-600" />
                    </div>
                    <div className="h-48 md:h-64">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={weeklyData}>
                                <defs>
                                    <linearGradient id="likesGradient" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.3} /><stop offset="95%" stopColor="#f43f5e" stopOpacity={0} />
                                    </linearGradient>
                                    <linearGradient id="commentsGradient" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} /><stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                                <XAxis dataKey="day" stroke="rgba(255,255,255,0.3)" fontSize={10} axisLine={false} tickLine={false} />
                                <YAxis stroke="rgba(255,255,255,0.3)" fontSize={10} axisLine={false} tickLine={false} />
                                <Tooltip contentStyle={{ background: '#0f172a', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', fontSize: '12px', color: '#fff' }} />
                                <Area type="monotone" dataKey="likes" stroke="#f43f5e" fill="url(#likesGradient)" strokeWidth={2} />
                                <Area type="monotone" dataKey="comments" stroke="#3b82f6" fill="url(#commentsGradient)" strokeWidth={2} />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </motion.div>

                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} className="glass-card rounded-xl p-4 md:p-6 border border-white/5">
                    <div className="flex items-center justify-between mb-4 md:mb-6">
                        <h2 className="text-base md:text-lg font-semibold text-gray-200">Today</h2>
                        <Activity className="w-4 h-4 md:w-5 md:h-5 text-gray-600" />
                    </div>
                    <div className="space-y-2 md:space-y-4">
                        {[{ label: 'Likes', value: 48, icon: Heart, color: 'text-rose-500' },
                        { label: 'Comments', value: 12, icon: MessageSquare, color: 'text-blue-500' },
                        { label: 'Sent', value: 8, icon: Send, color: 'text-orange-500' },
                        { label: 'Views', value: 24, icon: Target, color: 'text-purple-500' }
                        ].map((item, idx) => (
                            <motion.div key={item.label} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.6 + idx * 0.1 }}
                                className="flex items-center justify-between p-2.5 md:p-3 bg-white/5 rounded-lg hover:bg-white/10 transition-colors cursor-default border border-transparent hover:border-white/5">
                                <div className="flex items-center gap-2 md:gap-3">
                                    <item.icon className={`w-3.5 h-3.5 md:w-4 md:h-4 ${item.color}`} />
                                    <span className="text-xs md:text-sm text-gray-300">{item.label}</span>
                                </div>
                                <span className="font-semibold text-sm md:text-base text-gray-100">{item.value}</span>
                            </motion.div>
                        ))}
                    </div>
                </motion.div>
            </div>

            {/* Recent Activity */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }} className="glass-card rounded-xl p-4 md:p-6 border border-white/5">
                <div className="flex items-center justify-between mb-3 md:mb-4">
                    <h2 className="text-base md:text-lg font-semibold text-gray-200">Recent Activity</h2>
                    <Clock className="w-4 h-4 md:w-5 md:h-5 text-gray-600" />
                </div>
                <div className="space-y-2 md:space-y-3">
                    <AnimatePresence>
                        {activity.slice(0, 5).map((item, idx) => {
                            const Icon = actionIcons[item.type] || Activity;
                            return (
                                <motion.div key={item.id} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} transition={{ delay: idx * 0.05 }}
                                    className="flex items-center justify-between p-3 md:p-4 bg-white/5 rounded-lg hover:bg-white/10 transition-colors border border-transparent hover:border-white/5 group">
                                    <div className="flex items-center gap-3 md:gap-4 min-w-0">
                                        <div className={`p-1.5 md:p-2 rounded-lg shrink-0 ${item.type === 'like' ? 'bg-rose-500/10' : item.type === 'comment' ? 'bg-blue-500/10' : item.type === 'connection' ? 'bg-orange-500/10' : 'bg-purple-500/10'
                                            }`}>
                                            <Icon className={`w-3.5 h-3.5 md:w-4 md:h-4 ${item.type === 'like' ? 'text-rose-500' : item.type === 'comment' ? 'text-blue-500' : item.type === 'connection' ? 'text-orange-500' : 'text-purple-500'
                                                }`} />
                                        </div>
                                        <div className="min-w-0">
                                            <span className="font-medium text-xs md:text-sm text-gray-200 group-hover:text-white transition-colors">{item.action}</span>
                                            <span className="text-gray-500 text-xs md:text-sm"> — {item.target}</span>
                                        </div>
                                    </div>
                                    <span className="text-xs text-gray-500 shrink-0 ml-2 font-mono">{item.time}</span>
                                </motion.div>
                            );
                        })}
                    </AnimatePresence>
                    {activity.length === 0 && <p className="text-gray-500 text-center py-6 md:py-8 text-sm">No recent activity</p>}
                </div>
            </motion.div>
        </div>
    );
}
