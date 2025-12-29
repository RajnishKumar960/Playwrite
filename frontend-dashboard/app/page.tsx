"use client";

import {
    Users,
    UserCheck,
    Send,
    BarChart3,
    TrendingUp,
    ArrowUpRight
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
    Area
} from 'recharts';
import { cn } from "@/lib/utils";

const DAILY_ACTIVITY_DATA = [
    { name: 'Mon', sent: 24, accepted: 4 },
    { name: 'Tue', sent: 30, accepted: 6 },
    { name: 'Wed', sent: 28, accepted: 8 },
    { name: 'Thu', sent: 32, accepted: 5 },
    { name: 'Fri', sent: 25, accepted: 7 },
    { name: 'Sat', sent: 15, accepted: 2 },
    { name: 'Sun', sent: 10, accepted: 1 },
];

const CONNECTIONS_DATA = [
    { name: 'Week 1', connections: 45 },
    { name: 'Week 2', connections: 52 },
    { name: 'Week 3', connections: 78 },
    { name: 'Week 4', connections: 95 },
];

export default function DashboardPage() {
    return (
        <div className="p-8 max-w-7xl mx-auto space-y-8">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Dashboard Overview</h1>
                    <p className="text-slate-500 mt-1">Welcome back, Ishan. Here's your automation summary.</p>
                </div>
                <div className="flex items-center gap-2 text-sm text-slate-500 bg-white px-3 py-1.5 rounded-full border border-slate-200 shadow-sm">
                    <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                    System Operational
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <StatCard
                    title="Total Leads"
                    value="1,248"
                    trend="+12%"
                    icon={Users}
                    color="blue"
                />
                <StatCard
                    title="Requests Sent"
                    value="432"
                    trend="+5%"
                    icon={Send}
                    color="indigo"
                />
                <StatCard
                    title="Accepted"
                    value="86"
                    trend="+18%"
                    icon={UserCheck}
                    color="green"
                />
                <StatCard
                    title="Response Rate"
                    value="19.8%"
                    trend="+2.4%"
                    icon={TrendingUp}
                    color="rose"
                />
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Main Activity Chart */}
                <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="text-lg font-semibold text-slate-800">Available Activity</h3>
                        <select className="text-sm border-none bg-slate-50 rounded-lg px-2 py-1 text-slate-600 focus:ring-0 cursor-pointer">
                            <option>Last 7 Days</option>
                            <option>Last 30 Days</option>
                        </select>
                    </div>
                    <div className="h-[300px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={DAILY_ACTIVITY_DATA} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} dy={10} />
                                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} />
                                <Tooltip
                                    cursor={{ fill: '#f1f5f9' }}
                                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                                />
                                <Bar dataKey="sent" name="Sent" fill="#3b82f6" radius={[4, 4, 0, 0]} barSize={20} />
                                <Bar dataKey="accepted" name="Accepted" fill="#22c55e" radius={[4, 4, 0, 0]} barSize={20} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Connections Trend */}
                <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow flex flex-col h-[400px]">
                    <h3 className="text-lg font-semibold text-slate-800 mb-2">Growth Trend</h3>
                    <p className="text-sm text-slate-500 mb-6">Total connected network size growth</p>

                    <div className="flex-1 w-full min-h-0">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={CONNECTIONS_DATA}>
                                <defs>
                                    <linearGradient id="colorConnections" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#ff3b3b" stopOpacity={0.2} />
                                        <stop offset="95%" stopColor="#ff3b3b" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <Tooltip />
                                <Area type="monotone" dataKey="connections" stroke="#ff3b3b" strokeWidth={3} fillOpacity={1} fill="url(#colorConnections)" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                    <div className="mt-4 pt-4 border-t border-slate-100 flex items-center justify-between">
                        <div>
                            <span className="block text-2xl font-bold text-slate-900">1,540</span>
                            <span className="text-xs text-slate-500">Total Connections</span>
                        </div>
                        <div className="flex items-center text-green-600 text-sm font-medium bg-green-50 px-2 py-1 rounded-lg">
                            <ArrowUpRight className="w-4 h-4 mr-1" />
                            +12.5%
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

function StatCard({ title, value, trend, icon: Icon, color }: any) {
    const colorStyles = {
        blue: "bg-blue-50 text-blue-600",
        indigo: "bg-indigo-50 text-indigo-600",
        green: "bg-green-50 text-green-600",
        rose: "bg-rose-50 text-rose-600",
    };

    return (
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-all">
            <div className="flex items-start justify-between">
                <div>
                    <p className="text-sm font-medium text-slate-500">{title}</p>
                    <h4 className="text-2xl font-bold text-slate-900 mt-1">{value}</h4>
                </div>
                <div className={cn("p-2.5 rounded-lg", colorStyles[color as keyof typeof colorStyles])}>
                    <Icon className="w-5 h-5" />
                </div>
            </div>
            <div className="mt-4 flex items-center text-sm">
                <span className="text-green-600 font-medium flex items-center">
                    <TrendingUp className="w-3 h-3 mr-1" />
                    {trend}
                </span>
                <span className="text-slate-400 ml-2">vs last month</span>
            </div>
        </div>
    );
}
