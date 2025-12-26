"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Clock, Activity, Heart, MessageSquare, Send, Target, LucideIcon } from "lucide-react";

// --- Types ---

export interface ActivityItem {
    id: number;
    action: string;
    target: string;
    time: string;
    type: string; // 'like' | 'comment' | 'connection' | 'view' | 'other'
}

interface ActivityFeedProps {
    activities: ActivityItem[];
    title?: string;
    delay?: number;
}

// --- Icon & Color Mapping ---

const actionIcons: Record<string, LucideIcon> = {
    like: Heart,
    comment: MessageSquare,
    connection: Send,
    view: Target,
    other: Activity
};

const typeStyles: Record<string, { bg: string; text: string }> = {
    like: { bg: "bg-rose-500/10", text: "text-rose-500" },
    comment: { bg: "bg-blue-500/10", text: "text-blue-500" },
    connection: { bg: "bg-orange-500/10", text: "text-orange-500" },
    view: { bg: "bg-purple-500/10", text: "text-purple-500" },
    other: { bg: "bg-gray-500/10", text: "text-gray-400" }
};

export default function ActivityFeed({ activities, title = "Recent Activity", delay = 0.6 }: ActivityFeedProps) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay }}
            className="glass-card rounded-xl p-4 md:p-6 border border-white/5 h-full"
        >
            <div className="flex items-center justify-between mb-3 md:mb-4">
                <h2 className="text-base md:text-lg font-semibold text-gray-200 tracking-tight">{title}</h2>
                <Clock className="w-4 h-4 md:w-5 md:h-5 text-gray-600" />
            </div>

            <div className="space-y-2 md:space-y-3">
                <AnimatePresence mode='popLayout'>
                    {activities.length > 0 ? (
                        activities.slice(0, 5).map((item, idx) => {
                            const Icon = actionIcons[item.type] || actionIcons['other'];
                            const style = typeStyles[item.type] || typeStyles['other'];

                            return (
                                <motion.div
                                    key={item.id}
                                    layout
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: 20 }}
                                    transition={{ delay: idx * 0.05 }}
                                    className="flex items-center justify-between p-3 md:p-4 bg-white/5 rounded-lg hover:bg-white/10 transition-colors border border-transparent hover:border-white/5 group"
                                >
                                    <div className="flex items-center gap-3 md:gap-4 min-w-0">
                                        <div className={`p-1.5 md:p-2 rounded-lg shrink-0 ${style.bg}`}>
                                            <Icon className={`w-3.5 h-3.5 md:w-4 md:h-4 ${style.text}`} />
                                        </div>
                                        <div className="min-w-0 flex flex-col">
                                            <span className="font-medium text-xs md:text-sm text-gray-200 group-hover:text-white transition-colors truncate">
                                                {item.action}
                                            </span>
                                            <span className="text-gray-500 text-xs md:text-sm truncate">
                                                {item.target ? `— ${item.target}` : ""}
                                            </span>
                                        </div>
                                    </div>
                                    <span className="text-xs text-gray-500 shrink-0 ml-2 font-mono whitespace-nowrap">
                                        {item.time}
                                    </span>
                                </motion.div>
                            );
                        })
                    ) : (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="flex flex-col items-center justify-center py-8 text-gray-500 space-y-2"
                        >
                            <Activity className="w-8 h-8 opacity-20" />
                            <p className="text-sm">No activity recorded yet</p>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </motion.div>
    );
}
