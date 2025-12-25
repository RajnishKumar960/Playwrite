"use client";

import React, { useState } from 'react';
import {
    BarChart3, TrendingUp, Users, Target, ArrowUpRight,
    ArrowDownRight, Calendar, Download, RefreshCw
} from 'lucide-react';
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
    AreaChart, Area, PieChart, Pie, Cell, LineChart, Line
} from 'recharts';
import { motion } from 'framer-motion';

const WEEKLY_DATA = [
    { name: 'Mon', sent: 20, replied: 5, meetings: 1 },
    { name: 'Tue', sent: 35, replied: 8, meetings: 2 },
    { name: 'Wed', sent: 50, replied: 12, meetings: 3 },
    { name: 'Thu', sent: 45, replied: 10, meetings: 2 },
    { name: 'Fri', sent: 30, replied: 6, meetings: 1 },
    { name: 'Sat', sent: 10, replied: 2, meetings: 0 },
    { name: 'Sun', sent: 5, replied: 1, meetings: 0 },
];

const FUNNEL_DATA = [
    { name: 'Sent', value: 1250, fill: '#3b82f6' },
    { name: 'Viewed', value: 980, fill: '#8b5cf6' },
    { name: 'Replied', value: 350, fill: '#ec4899' },
    { name: 'Meetings', value: 85, fill: '#10b981' },
];

const CAMPAIGN_PERFORMANCE = [
    { name: 'Outreach A', success: 65, type: 'Connection' },
    { name: 'Outreach B', success: 40, type: 'Message' },
    { name: 'Follow-up', success: 75, type: 'Nurture' },
    { name: 'Cold Invite', success: 25, type: 'Event' },
];

export default function AnalyticsPage() {
    const [timeRange, setTimeRange] = useState('7d');

    return (
        <div className="min-h-screen p-6 space-y-6 pb-20">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-linear-to-r from-blue-400 to-indigo-400">
                        Analytics Deep Dive
                    </h1>
                    <p className="text-gray-400 mt-1">Comprehensive performance metrics.</p>
                </div>

                <div className="flex items-center gap-3">
                    <div className="flex bg-white/5 rounded-lg p-1 border border-white/10">
                        {['24h', '7d', '30d', '90d'].map((range) => (
                            <button
                                key={range}
                                onClick={() => setTimeRange(range)}
                                className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all ${timeRange === range
                                        ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/20'
                                        : 'text-gray-400 hover:text-white hover:bg-white/5'
                                    }`}
                            >
                                {range}
                            </button>
                        ))}
                    </div>
                    <button className="p-2 bg-white/5 hover:bg-white/10 rounded-lg text-gray-400 hover:text-white transition-colors border border-white/10">
                        <Download size={18} />
                    </button>
                </div>
            </div>

            {/* KPI Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                    { label: 'Total Sent', value: '1,250', trend: '+12.5%', icon: SendIcon, color: 'blue' },
                    { label: 'Response Rate', value: '28.4%', trend: '+4.2%', icon: MessageIcon, color: 'purple' },
                    { label: 'Meetings Booked', value: '85', trend: '+15.3%', icon: Calendar, color: 'green' },
                    { label: 'Conversion Rate', value: '6.8%', trend: '-1.2%', icon: Target, color: 'amber' },
                ].map((stat, i) => (
                    <motion.div
                        key={stat.label}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.1 }}
                        className="glass-card p-5 rounded-xl border border-white/5 relative overflow-hidden group"
                    >
                        <div className={`absolute top-0 right-0 w-24 h-24 bg-${stat.color}-500/10 blur-2xl group-hover:bg-${stat.color}-500/20 transition-colors`} />
                        <div className="relative flex justify-between items-start mb-4">
                            <div className={`p-2 rounded-lg bg-${stat.color}-500/10 text-${stat.color}-400`}>
                                <stat.icon size={20} />
                            </div>
                            <div className={`flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-full ${stat.trend.startsWith('+')
                                    ? 'bg-green-500/10 text-green-400'
                                    : 'bg-red-500/10 text-red-400'
                                }`}>
                                {stat.trend.startsWith('+') ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
                                {stat.trend}
                            </div>
                        </div>
                        <div className="text-2xl font-bold text-gray-100">{stat.value}</div>
                        <div className="text-xs text-gray-400 mt-1">{stat.label}</div>
                    </motion.div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Main Trend Chart */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
                    className="lg:col-span-2 glass-card p-6 rounded-xl border border-white/5"
                >
                    <h3 className="text-lg font-semibold text-gray-100 mb-6 flex items-center gap-2">
                        <BarChart3 size={18} className="text-blue-400" />
                        Performance Trends
                    </h3>
                    <div className="h-[300px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={WEEKLY_DATA}>
                                <defs>
                                    <linearGradient id="colorSent" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} /><stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                                    </linearGradient>
                                    <linearGradient id="colorReplied" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#ec4899" stopOpacity={0.3} /><stop offset="95%" stopColor="#ec4899" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                                <XAxis dataKey="name" stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
                                <YAxis stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
                                <Tooltip
                                    contentStyle={{ backgroundColor: '#0f172a', borderColor: 'rgba(255,255,255,0.1)', color: '#f8fafc' }}
                                    itemStyle={{ color: '#f8fafc' }}
                                />
                                <Area type="monotone" dataKey="sent" stroke="#3b82f6" fillOpacity={1} fill="url(#colorSent)" strokeWidth={2} />
                                <Area type="monotone" dataKey="replied" stroke="#ec4899" fillOpacity={1} fill="url(#colorReplied)" strokeWidth={2} />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </motion.div>

                {/* Funnel Chart */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}
                    className="glass-card p-6 rounded-xl border border-white/5"
                >
                    <h3 className="text-lg font-semibold text-gray-100 mb-6 flex items-center gap-2">
                        <Users size={18} className="text-purple-400" />
                        Conversion Funnel
                    </h3>
                    <div className="space-y-4">
                        {FUNNEL_DATA.map((step, i) => (
                            <div key={step.name} className="relative group">
                                <div className="flex justify-between text-sm mb-1">
                                    <span className="text-gray-300">{step.name}</span>
                                    <span className="font-bold text-white">{step.value}</span>
                                </div>
                                {/* Custom Funnel Bar */}
                                <div className="h-3 bg-white/5 rounded-full overflow-hidden">
                                    <motion.div
                                        initial={{ width: 0 }}
                                        animate={{ width: `${(step.value / 1250) * 100}%` }}
                                        transition={{ duration: 1, delay: 0.5 + i * 0.1 }}
                                        className="h-full rounded-full relative"
                                        style={{ backgroundColor: step.fill }}
                                    >
                                        <div className="absolute inset-0 bg-white/20 animate-[shimmer_2s_infinite]" />
                                    </motion.div>
                                </div>
                                {/* Connection line effect */}
                                {i < FUNNEL_DATA.length - 1 && (
                                    <div className="absolute left-4 -bottom-4 w-0.5 h-4 bg-white/5 -z-10 group-hover:bg-white/10 transition-colors" />
                                )}
                            </div>
                        ))}
                    </div>

                    <div className="mt-8 pt-6 border-t border-white/5">
                        <div className="flex justify-between items-center px-4 py-3 bg-gradient-to-r from-emerald-500/10 to-transparent rounded-lg border border-emerald-500/20">
                            <span className="text-sm text-emerald-300 font-medium">Overall Conversion</span>
                            <span className="text-xl font-bold text-emerald-400">6.8%</span>
                        </div>
                    </div>
                </motion.div>
            </div>

            {/* Campaign Efficiency */}
            <h2 className="text-xl font-bold text-white mt-4">Campaign Efficiency</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {CAMPAIGN_PERFORMANCE.map((camp, idx) => (
                    <motion.div
                        key={camp.name}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.6 + idx * 0.1 }}
                        className="glass-card p-4 rounded-xl border border-white/5 flex flex-col justify-between h-32 hover:border-blue-500/30 transition-colors"
                    >
                        <div className="flex justify-between items-start">
                            <span className="text-sm font-medium text-gray-400">{camp.type}</span>
                            <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-xs font-bold ring-1 ring-white/10">
                                {camp.name.charAt(0)}
                            </div>
                        </div>
                        <div>
                            <h4 className="font-bold text-white mb-1">{camp.name}</h4>
                            <div className="w-full bg-white/10 h-1.5 rounded-full overflow-hidden">
                                <div className={`h-full rounded-full ${camp.success > 50 ? 'bg-green-500' : 'bg-amber-500'}`} style={{ width: `${camp.success}%` }} />
                            </div>
                            <div className="flex justify-between mt-1.5">
                                <span className="text-[10px] text-gray-500">Success Rate</span>
                                <span className="text-xs font-bold text-gray-300">{camp.success}%</span>
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>
        </div>
    );
}

// Minimal Icons
const SendIcon = (props: any) => <svg {...props} width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="22" y1="2" x2="11" y2="13" /><polygon points="22 2 15 22 11 13 2 9 22 2" /></svg>;
const MessageIcon = (props: any) => <svg {...props} width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" /></svg>;
