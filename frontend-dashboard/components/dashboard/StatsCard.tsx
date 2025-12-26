"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ArrowUpRight, TrendingUp, LucideIcon } from "lucide-react";

// --- Sub-components ---

function AnimatedCounter({ value, suffix = "" }: { value: number; suffix?: string }) {
    const [displayValue, setDisplayValue] = useState(0);

    useEffect(() => {
        const duration = 1000;
        const steps = 30;
        const increment = value / steps;
        let current = 0;

        // Reset if value is 0 or less
        if (value <= 0) {
            setDisplayValue(0);
            return;
        }

        const timer = setInterval(() => {
            current += increment;
            if (current >= value) {
                setDisplayValue(value);
                clearInterval(timer);
            } else {
                setDisplayValue(Math.floor(current));
            }
        }, duration / steps);

        return () => clearInterval(timer);
    }, [value]);

    return <span>{displayValue.toLocaleString()}{suffix}</span>;
}

function Sparkline({ data, color }: { data?: number[]; color: string }) {
    if (!data || data.length === 0) return null;
    const max = Math.max(...data);
    const min = Math.min(...data);
    const range = max - min || 1;

    // Normalize points to viewbox 100x30
    const points = data
        .map((v, i) => {
            const x = (i / (data.length - 1)) * 100;
            const y = 30 - ((v - min) / range) * 25; // Keep slightly away from bottom/top
            return `${x},${y}`;
        })
        .join(" L ");

    return (
        <svg viewBox="0 0 100 30" className="w-16 h-6 md:w-20 md:h-8 overflow-visible opacity-80">
            <path
                d={`M ${points}`}
                fill="none"
                stroke={color}
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </svg>
    );
}

// --- Main Component ---

interface StatsCardProps {
    label: string;
    value: number;
    suffix?: string;
    icon: LucideIcon;
    color: string; // Tailwind gradient classes e.g. "from-blue-500 to-cyan-500"
    trend?: string;
    sparklineData?: number[];
    delay?: number;
}

export default function StatsCard({
    label,
    value,
    suffix,
    icon: Icon,
    color,
    trend,
    sparklineData,
    delay = 0,
}: StatsCardProps) {
    // Extract primary 'from' color for sparkline stroke if possible, else default to green
    // Simplistic extraction: defaults to a bright green if not easily parsed, 
    // but we can pass a specific HEX if needed. For now hardcode nice green or white.
    const sparkColor = "#ff3b3b"; // brand red

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay }}
            className="glass-card card-hover rounded-xl p-3 md:p-5 relative overflow-hidden group border border-white/5"
        >
            {/* Background Glow Effect */}
            <div
                className={`absolute top-0 right-0 w-24 h-24 md:w-32 md:h-32 bg-linear-to-br ${color} opacity-10 blur-2xl group-hover:opacity-20 transition-opacity duration-500`}
            />

            <div className="relative z-10">
                <div className="flex items-start justify-between mb-2 md:mb-3">
                    {/* Icon Box */}
                    <div
                        className={`p-1.5 md:p-2.5 rounded-lg md:rounded-xl bg-linear-to-br ${color} shadow-lg shadow-black/20`}
                    >
                        <Icon className="w-4 h-4 md:w-5 md:h-5 text-white" />
                    </div>

                    {/* Trend Badge */}
                    {trend && (
                        <div className="flex items-center gap-0.5 text-xs font-medium text-green-400 bg-green-500/10 px-1.5 py-0.5 rounded-md border border-green-500/20 backdrop-blur-sm">
                            <ArrowUpRight className="w-3 h-3" />
                            {trend}
                        </div>
                    )}
                </div>

                {/* Label */}
                <p className="text-xs md:text-sm text-gray-400 mb-0.5 font-medium tracking-wide">
                    {label}
                </p>

                {/* Value & Sparkline Row */}
                <div className="flex items-end justify-between">
                    <p className="text-xl md:text-3xl font-bold text-gray-100 tracking-tight">
                        <AnimatedCounter value={value} suffix={suffix} />
                    </p>
                    <Sparkline data={sparklineData} color={sparkColor} />
                </div>
            </div>
        </motion.div>
    );
}
