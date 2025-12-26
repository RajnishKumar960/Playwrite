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
            className="glass-card rounded-xl p-4 md:p-6 border border-white/5 h-full"
        >
            <div className="flex items-center justify-between mb-4 md:mb-6">
                <div>
                    <h2 className="text-base md:text-lg font-semibold text-gray-200">{title}</h2>
                    <p className="text-xs md:text-sm text-gray-500 hidden sm:block">Engagement trends</p>
                </div>
                <BarChart3 className="w-4 h-4 md:w-5 md:h-5 text-gray-600" />
            </div>

            <div className="h-48 md:h-64 w-full">
                {data.length > 0 ? (
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={data} margin={{ top: 5, right: 0, left: -20, bottom: 0 }}>
                            <defs>
                                <linearGradient id="likesGradient" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.3} />
                                    <stop offset="95%" stopColor="#f43f5e" stopOpacity={0} />
                                </linearGradient>
                                <linearGradient id="commentsGradient" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                            <XAxis
                                dataKey="day"
                                stroke="rgba(255,255,255,0.3)"
                                fontSize={10}
                                axisLine={false}
                                tickLine={false}
                                dy={10}
                            />
                            <YAxis
                                stroke="rgba(255,255,255,0.3)"
                                fontSize={10}
                                axisLine={false}
                                tickLine={false}
                            />
                            <Tooltip
                                contentStyle={{
                                    background: "#0f172a",
                                    border: "1px solid rgba(255,255,255,0.1)",
                                    borderRadius: "8px",
                                    fontSize: "12px",
                                    color: "#fff",
                                    boxShadow: "0 10px 30px -10px rgba(0,0,0,0.5)"
                                }}
                                itemStyle={{ paddingBottom: 2 }}
                                cursor={{ stroke: 'rgba(255,255,255,0.1)', strokeWidth: 1 }}
                            />
                            <Area
                                type="monotone"
                                dataKey="likes"
                                stroke="#f43f5e"
                                fill="url(#likesGradient)"
                                strokeWidth={3}
                                activeDot={{ r: 6, strokeWidth: 0, fill: '#fff' }}
                            />
                            <Area
                                type="monotone"
                                dataKey="comments"
                                stroke="#3b82f6"
                                fill="url(#commentsGradient)"
                                strokeWidth={3}
                                activeDot={{ r: 6, strokeWidth: 0, fill: '#fff' }}
                            />
                        </AreaChart>
                    </ResponsiveContainer>
                ) : (
                    <div className="h-full w-full flex items-center justify-center text-gray-500 text-sm">
                        Loading chart data...
                    </div>
                )}
            </div>
        </motion.div>
    );
}
