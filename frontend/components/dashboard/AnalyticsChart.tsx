"use client";

import React from "react";
import { motion } from "framer-motion";
import { BarChart3 } from "lucide-react";
import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer
} from "recharts";

interface ChartDataPoint {
    day: string;
    likes: number;
    comments: number;
    connections: number;
    [key: string]: any;
}

interface AnalyticsChartProps {
    data: ChartDataPoint[];
    title?: string;
    delay?: number;
}

export default function AnalyticsChart({ data, title = "Weekly Activity", delay = 0.4 }: AnalyticsChartProps) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay }}
            className="glass-card rounded-xl p-4 md:p-6 border border-white/5 h-full relative overflow-hidden"
        >
            {/* Background Glow */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 blur-[60px] pointer-events-none" />

            <div className="flex items-center justify-between mb-4 md:mb-6 relative z-10">
                <div>
                    <h2 className="text-sm font-black text-gray-100 uppercase tracking-tighter flex items-center gap-2 italic">
                        <div className="w-1 h-3 bg-blue-500 rounded-full" />
                        {title}
                    </h2>
                    <p className="text-[10px] text-gray-500 uppercase tracking-[0.3em] font-bold mt-1 ml-3 hidden sm:block">Engagement Sync v2.0</p>
                </div>
                <div className="flex gap-4">
                    <div className="flex items-center gap-2 text-[10px] font-bold text-gray-500 uppercase tracking-widest">
                        <div className="w-2 h-2 rounded-full bg-rose-500" /> Likes
                    </div>
                    <div className="flex items-center gap-2 text-[10px] font-bold text-gray-500 uppercase tracking-widest">
                        <div className="w-2 h-2 rounded-full bg-blue-500" /> Comments
                    </div>
                    <div className="flex items-center gap-2 text-[10px] font-bold text-gray-500 uppercase tracking-widest">
                        <div className="w-2 h-2 rounded-full bg-amber-500" /> Connects
                    </div>
                </div>
            </div>

            <div className="h-48 md:h-64 w-full relative z-10">
                {data.length > 0 ? (
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                            <defs>
                                <linearGradient id="likesGradient" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.2} />
                                    <stop offset="95%" stopColor="#f43f5e" stopOpacity={0} />
                                </linearGradient>
                                <linearGradient id="commentsGradient" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.2} />
                                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                                </linearGradient>
                                <linearGradient id="connectsGradient" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.2} />
                                    <stop offset="95%" stopColor="#f59e0b" stopOpacity={0} />
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.03)" vertical={false} />
                            <XAxis
                                dataKey="day"
                                stroke="rgba(255,255,255,0.2)"
                                fontSize={9}
                                axisLine={false}
                                tickLine={false}
                                dy={10}
                                fontStyle="italic"
                                fontWeight="bold"
                            />
                            <YAxis
                                stroke="rgba(255,255,255,0.2)"
                                fontSize={9}
                                axisLine={false}
                                tickLine={false}
                                fontStyle="italic"
                                fontWeight="bold"
                            />
                            <Tooltip
                                contentStyle={{
                                    background: "rgba(10, 15, 25, 0.95)",
                                    backdropFilter: "blur(10px)",
                                    border: "1px solid rgba(255,255,255,0.1)",
                                    borderRadius: "12px",
                                    fontSize: "10px",
                                    color: "#fff",
                                    boxShadow: "0 20px 50px rgba(0,0,0,0.5)",
                                    textTransform: "uppercase",
                                    letterSpacing: "0.1em",
                                    fontWeight: "bold"
                                }}
                                itemStyle={{ padding: 0 }}
                                cursor={{ stroke: 'rgba(255,255,255,0.1)', strokeWidth: 1 }}
                            />
                            <Area
                                type="monotone"
                                dataKey="likes"
                                stroke="#f43f5e"
                                fill="url(#likesGradient)"
                                strokeWidth={2.5}
                                activeDot={{ r: 4, strokeWidth: 2, fill: '#000', stroke: '#f43f5e' }}
                            />
                            <Area
                                type="monotone"
                                dataKey="comments"
                                stroke="#3b82f6"
                                fill="url(#commentsGradient)"
                                strokeWidth={2.5}
                                activeDot={{ r: 4, strokeWidth: 2, fill: '#000', stroke: '#3b82f6' }}
                            />
                            <Area
                                type="monotone"
                                dataKey="connections"
                                stroke="#f59e0b"
                                fill="url(#connectsGradient)"
                                strokeWidth={2.5}
                                activeDot={{ r: 4, strokeWidth: 2, fill: '#000', stroke: '#f59e0b' }}
                            />
                        </AreaChart>
                    </ResponsiveContainer>
                ) : (
                    <div className="h-full w-full flex flex-col items-center justify-center text-gray-500 text-xs font-mono gap-4">
                        <div className="w-8 h-8 border-2 border-blue-500/30 border-t-blue-500 rounded-full animate-spin" />
                        Synchronizing Neural Stream...
                    </div>
                )}
            </div>
        </motion.div>
    );
}
