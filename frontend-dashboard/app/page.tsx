"use client";

import React from 'react';
import { motion } from 'framer-motion';
import {
    LayoutDashboard, TrendingUp, Users, UserPlus,
    Target, Brain, ArrowUpRight, Zap, Activity
} from 'lucide-react';
import StatsCard from '@/components/dashboard/StatsCard';
import AnalyticsChart from '@/components/dashboard/AnalyticsChart';
import ActivityFeed from '@/components/dashboard/ActivityFeed';

export default function DashboardPage() {
    // Mock Data for Charts
    const WEEKLY_DATA = [
        { day: "Mon", likes: 45, comments: 12, connections: 8 },
        { day: "Tue", likes: 52, comments: 18, connections: 12 },
        { day: "Wed", likes: 38, comments: 15, connections: 6 },
        { day: "Thu", likes: 65, comments: 22, connections: 15 },
        { day: "Fri", likes: 48, comments: 14, connections: 10 },
        { day: "Sat", likes: 30, comments: 8, connections: 4 },
        { day: "Sun", likes: 25, comments: 6, connections: 3 }
    ];

    // Mock Data for Activity Feed
    const RECENT_ACTIVITY = [
        { id: 1, action: "Replied to post", target: "Sarah Connor", time: "2m ago", type: "comment" },
        { id: 2, action: "Connection accepted", target: "John Doe", time: "15m ago", type: "connection" },
        { id: 3, action: "Liked post", target: "TechCrunch", time: "1h ago", type: "like" },
        { id: 4, action: "Viewed profile", target: "Michael Smith", time: "2h ago", type: "view" },
        { id: 5, action: "System update", target: "v2.1 deployed", time: "5h ago", type: "other" }
    ];

    return (
        <div className="min-h-screen p-6 space-y-8 pb-20">
            {/* Command Center Header */}
            <div className="flex flex-col md:flex-row justify-between items-end gap-4 border-b border-white/5 pb-6">
                <div>
                    <h1 className="text-4xl font-black bg-clip-text text-transparent bg-linear-to-r from-blue-400 via-purple-400 to-pink-400">
                        COMMAND CENTER
                    </h1>
                    <p className="text-gray-400 mt-2 flex items-center gap-2">
                        <Activity size={16} className="text-green-400 animate-pulse" />
                        System is active and monitoring
                    </p>
                </div>
                <div className="flex gap-3">
                    <button className="px-4 py-2 bg-white/5 hover:bg-white/10 rounded-lg text-sm text-gray-300 border border-white/10 transition-colors">
                        Download Report
                    </button>
                    <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg text-sm text-white font-semibold shadow-lg shadow-blue-600/20 transition-all hover:scale-105">
                        + New Campaign
                    </button>
                </div>
            </div>

            {/* KPI Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatsCard
                    label="Total Leads"
                    value={1284}
                    trend="+12%"
                    icon={Users}
                    color="from-red-600 to-orange-600"
                    sparklineData={[10, 15, 12, 18, 20, 25, 22, 30]}
                />
                <StatsCard
                    label="Connections"
                    value={432}
                    trend="+5%"
                    icon={UserPlus}
                    color="from-orange-600 to-amber-600"
                    sparklineData={[5, 8, 6, 9, 12, 10, 14, 16]}
                />
                <StatsCard
                    label="Engagement"
                    value={89}
                    suffix="%"
                    trend="+2%"
                    icon={Zap}
                    color="from-red-500 to-pink-600"
                    sparklineData={[60, 65, 70, 68, 75, 80, 85, 89]}
                />
                <StatsCard
                    label="Pain Points"
                    value={156}
                    trend="+24"
                    icon={Brain}
                    color="from-gray-600 to-gray-400"
                    sparklineData={[2, 4, 3, 8, 12, 15, 18, 24]}
                />
            </div>

            {/* Main Content Areas */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                {/* Left Column: Analytics & Funnel (2/3 width) */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Weekly Analytics Chart */}
                    <div className="glass-card p-6 rounded-2xl border border-white/5">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-lg font-bold text-gray-100 flex items-center gap-2">
                                <TrendingUp className="text-blue-400" size={20} />
                                Weekly Performance
                            </h3>
                            <select className="bg-black/30 border border-white/10 rounded-lg text-xs text-gray-400 px-2 py-1 outline-none">
                                <option>Last 7 Days</option>
                                <option>Last 30 Days</option>
                            </select>
                        </div>
                        <div className="h-64">
                            <AnalyticsChart data={WEEKLY_DATA} />
                        </div>
                    </div>

                    {/* Funnel & Campaigns Split */}
                    <div className="grid md:grid-cols-2 gap-6">
                        {/* Lead Funnel */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                            className="glass-card p-6 rounded-2xl border border-white/5"
                        >
                            <h3 className="text-lg font-bold text-gray-100 mb-4 flex items-center gap-2">
                                <Target className="text-emerald-400" size={20} />
                                Lead Pipeline
                            </h3>
                            <div className="space-y-4">
                                <div className="space-y-1">
                                    <div className="flex justify-between text-xs text-gray-400">
                                        <span>New Leads</span>
                                        <span>450</span>
                                    </div>
                                    <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                                        <div className="h-full bg-blue-500 w-[80%]" />
                                    </div>
                                </div>
                                <div className="space-y-1">
                                    <div className="flex justify-between text-xs text-gray-400">
                                        <span>Contacted</span>
                                        <span>280</span>
                                    </div>
                                    <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                                        <div className="h-full bg-violet-500 w-[60%]" />
                                    </div>
                                </div>
                                <div className="space-y-1">
                                    <div className="flex justify-between text-xs text-gray-400">
                                        <span>Replies</span>
                                        <span>45</span>
                                    </div>
                                    <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                                        <div className="h-full bg-pink-500 w-[15%]" />
                                    </div>
                                </div>
                            </div>
                        </motion.div>

                        {/* Recent Pain Points */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
                            className="glass-card p-6 rounded-2xl border border-white/5"
                        >
                            <h3 className="text-lg font-bold text-gray-100 mb-4 flex items-center gap-2">
                                <Brain className="text-pink-400" size={20} />
                                Identified Pain Points
                            </h3>
                            <div className="space-y-3">
                                {[
                                    "Struggling with manual outreach",
                                    "Low conversion on cold email",
                                    "Needs automated CRM sync"
                                ].map((point, i) => (
                                    <div key={i} className="flex items-start gap-2 text-sm text-gray-300 p-2 rounded-lg bg-white/5 border border-white/5">
                                        <div className="w-1.5 h-1.5 rounded-full bg-pink-500 mt-1.5 shrink-0" />
                                        <span>{point}</span>
                                    </div>
                                ))}
                            </div>
                        </motion.div>
                    </div>
                </div>

                {/* Right Column: Live Feed & Agents (1/3 width) */}
                <div className="space-y-6">
                    {/* Live Activity Feed */}
                    <div className="glass-card p-6 rounded-2xl border border-white/5 h-full max-h-[600px] overflow-hidden flex flex-col">
                        <h3 className="text-lg font-bold text-gray-100 mb-4 flex items-center gap-2">
                            <Activity className="text-orange-400" size={20} />
                            Live Activity
                        </h3>
                        <div className="flex-1 overflow-y-auto scrollbar-thin -mr-4 pr-4">
                            <ActivityFeed activities={RECENT_ACTIVITY} />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
