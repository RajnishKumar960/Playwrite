"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import {
    LayoutDashboard, TrendingUp, Users, UserPlus,
    Target, Brain, ArrowUpRight, Zap, Activity, BarChart3, LineChart as LineChartIcon
} from 'lucide-react';
import {
    AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
    BarChart, Bar, Legend, LineChart, Line
} from 'recharts';
import { cn } from '@/lib/utils';
import StatsCard from '@/components/dashboard/StatsCard';
import ActivityFeed from '@/components/dashboard/ActivityFeed';
import { api } from '@/lib/api';

export default function DashboardPage() {
    // Fetch real data from API
    const { data: weeklyData } = useQuery({
        queryKey: ['charts', 'weekly'],
        queryFn: () => api.charts.weekly(),
        refetchInterval: 30000,
    });

    const { data: activityData } = useQuery({
        queryKey: ['activity'],
        queryFn: () => api.activity.get(),
        refetchInterval: 10000,
    });

    const { data: leadsStats } = useQuery({
        queryKey: ['leads', 'stats'],
        queryFn: () => api.leads.stats(),
        refetchInterval: 30000,
    });

    const { data: painPointsData } = useQuery({
        queryKey: ['analytics', 'pain-points'],
        queryFn: () => api.fetch('/api/analytics/pain-points'),
        refetchInterval: 60000,
    });

    const { data: connectionsData } = useQuery({
        queryKey: ['connections'],
        queryFn: () => api.connections.get(),
        refetchInterval: 30000,
    });

    // Fallback Data
    const WEEKLY_DATA = weeklyData?.data || [
        { day: "Mon", likes: 45, comments: 12, connections: 8 },
        { day: "Tue", likes: 52, comments: 18, connections: 12 },
        { day: "Wed", likes: 38, comments: 15, connections: 6 },
        { day: "Thu", likes: 65, comments: 22, connections: 15 },
        { day: "Fri", likes: 48, comments: 14, connections: 10 },
        { day: "Sat", likes: 30, comments: 8, connections: 4 },
        { day: "Sun", likes: 25, comments: 6, connections: 3 }
    ];

    const RECENT_ACTIVITY = activityData?.recent || [
        { id: 1, action: "Replied to post", target: "Sarah Connor", time: "2m ago", type: "comment" },
        { id: 2, action: "Connection accepted", target: "John Doe", time: "15m ago", type: "connection" },
        { id: 3, action: "Liked post", target: "TechCrunch", time: "1h ago", type: "like" },
    ];

    const totalLeads = leadsStats?.total || 0;
    const totalConnections = connectionsData?.stats?.accepted || leadsStats?.connected || 0;
    const engagementRate = totalLeads > 0 ? Math.round(((leadsStats?.engaged || 0) / totalLeads) * 100) : 0;
    const painPointsCount = painPointsData?.data?.length || 0;

    const pipelineData = [
        { label: "New Leads", value: totalLeads, color: "bg-blue-500", percentage: "100%" },
        { label: "Contacted", value: leadsStats?.engaged || 0, color: "bg-violet-500", percentage: `${totalLeads > 0 ? Math.round(((leadsStats?.engaged || 0) / totalLeads) * 100) : 0}%` },
        { label: "Replies", value: leadsStats?.replied || 0, color: "bg-pink-500", percentage: `${(leadsStats?.engaged || 0) > 0 ? Math.round(((leadsStats?.replied || 0) / (leadsStats?.engaged || 0)) * 100) : 0}%` },
    ];

    const topPainPoints = (painPointsData?.data || []).slice(0, 3);

    return (
        <div className="min-h-screen p-6 space-y-8 pb-20 relative overflow-hidden">
            {/* Command Center Header */}
            <div className="flex flex-col md:flex-row justify-between items-end gap-4 border-b border-white/5 pb-6">
                <div>
                    <h1 className="text-4xl font-black bg-clip-text text-transparent bg-linear-to-r from-blue-400 via-purple-400 to-pink-400 uppercase italic tracking-tighter">
                        COMMAND <span className="text-white">CENTER</span>
                    </h1>
                    <p className="text-[10px] text-gray-500 font-bold uppercase tracking-[0.4em] mt-2 flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse shadow-[0_0_8px_rgba(34,197,94,0.6)]" />
                        Neural Nexus v4.2 // ONLINE
                    </p>
                </div>
            </div>

            {/* KPI Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatsCard label="Total Extraction" value={totalLeads} trend="+12%" icon={Users} color="from-blue-600 to-indigo-600" sparklineData={[10, 15, 12, 18, 20, 25, 22, 30]} />
                <StatsCard label="Verified Connects" value={totalConnections} trend="+5%" icon={UserPlus} color="from-violet-600 to-purple-600" sparklineData={[5, 8, 6, 9, 12, 10, 14, 16]} />
                <StatsCard label="Conversion Rate" value={engagementRate} suffix="%" trend="OPTIMAL" icon={Zap} color="from-rose-500 to-pink-600" sparklineData={[60, 65, 70, 68, 75, 80, 85, 89]} />
                <StatsCard label="Neural Insights" value={painPointsCount} trend="SYNCHRONIZED" icon={Brain} color="from-gray-700 to-gray-500" sparklineData={[2, 4, 3, 8, 12, 15, 18, 24]} />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

                {/* Left: Analytics Wave (8 cols) */}
                <div className="lg:col-span-8 space-y-6">
                    <div className="glass-card p-6 rounded-2xl border border-white/5 bg-black/20 min-h-[400px]">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-xs font-black text-gray-100 flex items-center gap-2 uppercase tracking-[0.2em] italic">
                                <Activity className="text-blue-400" size={16} />
                                Neural Connection Pulse
                            </h3>
                            <div className="flex gap-4 text-[8px] font-black uppercase tracking-widest text-gray-500">
                                <div className="flex items-center gap-1.5"><div className="w-1.5 h-1.5 rounded-full bg-blue-500" /> Connections</div>
                                <div className="flex items-center gap-1.5"><div className="w-1.5 h-1.5 rounded-full bg-purple-500" /> Accepted</div>
                            </div>
                        </div>
                        <div className="h-[300px] w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={WEEKLY_DATA}>
                                    <defs>
                                        <linearGradient id="colorCon" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                                            <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                                        </linearGradient>
                                        <linearGradient id="colorAcc" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#a855f7" stopOpacity={0.3} />
                                            <stop offset="95%" stopColor="#a855f7" stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#ffffff05" vertical={false} />
                                    <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fill: '#6b7280', fontSize: 10, fontWeight: 'bold' }} dy={10} />
                                    <YAxis axisLine={false} tickLine={false} tick={{ fill: '#6b7280', fontSize: 10, fontWeight: 'bold' }} />
                                    <Tooltip
                                        contentStyle={{ backgroundColor: '#0d1117', border: '1px solid #ffffff10', borderRadius: '12px', fontSize: '10px' }}
                                        itemStyle={{ fontWeight: 'bold', textTransform: 'uppercase' }}
                                    />
                                    <Area type="monotone" dataKey="connections" stroke="#3b82f6" strokeWidth={3} fillOpacity={1} fill="url(#colorCon)" />
                                    <Area type="monotone" dataKey="likes" stroke="#a855f7" strokeWidth={3} fillOpacity={1} fill="url(#colorAcc)" />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                        {/* Pipelines */}
                        <div className="glass-card p-6 rounded-2xl border border-white/5 bg-black/20">
                            <h3 className="text-xs font-black text-white mb-6 uppercase tracking-widest italic flex items-center gap-2">
                                <Target size={16} className="text-emerald-400" />
                                Operational Funnel
                            </h3>
                            <div className="space-y-6">
                                {pipelineData.map((stage, i) => (
                                    <div key={i} className="space-y-2">
                                        <div className="flex justify-between items-end">
                                            <span className="text-[9px] font-black text-gray-500 uppercase tracking-widest">{stage.label}</span>
                                            <span className="text-xs font-black text-white italic">{stage.value}</span>
                                        </div>
                                        <div className="h-1 bg-white/5 rounded-full overflow-hidden">
                                            <motion.div initial={{ width: 0 }} animate={{ width: stage.percentage }} className={cn("h-full", stage.color)} />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Recent Insights */}
                        <div className="glass-card p-6 rounded-2xl border border-white/5 bg-black/20">
                            <h3 className="text-xs font-black text-white mb-6 uppercase tracking-widest italic flex items-center gap-2">
                                <Brain size={16} className="text-pink-400" />
                                Neural Intelligence
                            </h3>
                            <div className="space-y-3">
                                {topPainPoints.map((item: any, i: number) => (
                                    <div key={i} className="flex items-start gap-4 p-3 rounded-xl bg-white/5 border border-white/5 group hover:bg-white/10 transition-all">
                                        <div className="w-1.5 h-1.5 rounded-full bg-pink-500 mt-1.5 shrink-0 shadow-[0_0_8px_rgba(244,63,94,0.6)]" />
                                        <span className="text-[10px] font-bold text-gray-300 leading-tight uppercase tracking-tighter">{item.point}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right: Activity Pulse (4 cols) */}
                <div className="lg:col-span-4">
                    <div className="glass-card rounded-2xl border border-white/5 bg-black/20 h-full flex flex-col">
                        <div className="p-6 border-b border-white/5 flex justify-between items-center bg-white/5">
                            <h3 className="text-xs font-black text-gray-100 flex items-center gap-2 uppercase tracking-[0.2em] italic">
                                <BarChart3 className="text-orange-400" size={16} />
                                Global Activity Wave
                            </h3>
                            <div className="w-2 h-2 rounded-full bg-orange-500 animate-pulse" />
                        </div>
                        <div className="flex-1 p-6 overflow-y-auto scrollbar-hide">
                            <ActivityFeed activities={RECENT_ACTIVITY} />
                        </div>
                        <div className="p-4 bg-blue-600/10 border-t border-blue-500/10">
                            <button className="w-full py-3 rounded-xl text-[9px] font-black text-blue-400 uppercase tracking-[0.3em] hover:bg-blue-600 hover:text-white transition-all italic border border-blue-500/20">
                                ACCESS FEED →
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
