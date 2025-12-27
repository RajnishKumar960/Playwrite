"use client";

import React, { useState } from 'react';
import {
    Shield, ShieldAlert, ShieldCheck, Activity,
    Lock, AlertTriangle, Clock, RefreshCw
} from 'lucide-react';
import { motion } from 'framer-motion';

export default function SafetyPage() {
    const [limits, setLimits] = useState({
        dailyInvites: 25,
        dailyMessages: 50,
        dailyViews: 100,
        coolDown: 15
    });

    return (
        <div className="min-h-screen p-6 space-y-6">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-linear-to-r from-red-400 to-orange-400">
                    Safety & Limits
                </h1>
                <p className="text-gray-400 mt-1">Configure operational boundaries to protect your account.</p>
            </div>

            {/* Status Banner */}
            <motion.div
                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                className="glass-card p-6 rounded-xl border border-green-500/20 bg-green-500/5 flex items-center justify-between"
            >
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-green-500/20 flex items-center justify-center text-green-400 border border-green-500/30">
                        <ShieldCheck size={24} />
                    </div>
                    <div>
                        <h3 className="text-lg font-bold text-green-400">Account Health: Excellent</h3>
                        <p className="text-sm text-green-300/70">Algorithm operating within safe parameters. No flags detected.</p>
                    </div>
                </div>
                <div className="text-right hidden md:block">
                    <p className="text-xs text-green-400/60 uppercase tracking-widest font-bold">Uptime</p>
                    <p className="text-2xl font-mono text-green-400">99.8%</p>
                </div>
            </motion.div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Daily Limits Config */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
                    className="glass-card p-6 rounded-xl border border-white/5"
                >
                    <h3 className="text-lg font-bold text-gray-100 mb-6 flex items-center gap-2">
                        <Activity size={20} className="text-blue-400" /> Daily Action Limits
                    </h3>

                    <div className="space-y-6">
                        {[
                            { key: 'dailyInvites', label: 'Connection Requests', max: 50, color: 'blue' },
                            { key: 'dailyMessages', label: 'Direct Messages', max: 100, color: 'purple' },
                            { key: 'dailyViews', label: 'Profile Views', max: 200, color: 'teal' }
                        ].map((item) => (
                            <div key={item.key}>
                                <div className="flex justify-between mb-2">
                                    <label className="text-sm font-medium text-gray-300">{item.label}</label>
                                    <span className="text-sm font-mono text-gray-400">
                                        {(limits as any)[item.key]} / {item.max}
                                    </span>
                                </div>
                                <input
                                    type="range"
                                    min="0" max={item.max}
                                    value={(limits as any)[item.key]}
                                    onChange={(e) => setLimits({ ...limits, [item.key]: parseInt(e.target.value) })}
                                    className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-blue-500"
                                />
                                <div className="flex justify-between text-[10px] text-gray-500 mt-1">
                                    <span>Conservative</span>
                                    <span>Aggressive</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </motion.div>

                {/* Account Protection */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
                    className="glass-card p-6 rounded-xl border border-white/5 space-y-6"
                >
                    <h3 className="text-lg font-bold text-gray-100 mb-6 flex items-center gap-2">
                        <Lock size={20} className="text-orange-400" /> Protection Protocol
                    </h3>

                    <div className="flex items-center gap-4 p-4 rounded-lg bg-orange-500/5 border border-orange-500/10">
                        <div className="p-2 bg-orange-500/10 rounded-lg text-orange-400">
                            <Clock size={20} />
                        </div>
                        <div>
                            <h4 className="font-bold text-gray-200 text-sm">Action Randomization</h4>
                            <p className="text-xs text-gray-400">Delays between 2-8 minutes added between actions.</p>
                        </div>
                        <div className="ml-auto">
                            <div className="w-10 h-5 bg-green-500/20 rounded-full flex items-center px-0.5 cursor-pointer">
                                <div className="w-4 h-4 bg-green-500 rounded-full shadow-md ml-auto" />
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center gap-4 p-4 rounded-lg bg-red-500/5 border border-red-500/10">
                        <div className="p-2 bg-red-500/10 rounded-lg text-red-400">
                            <AlertTriangle size={20} />
                        </div>
                        <div>
                            <h4 className="font-bold text-gray-200 text-sm">Emergency Kill Switch</h4>
                            <p className="text-xs text-gray-400">Stop all agents if LinkedIn detection triggered.</p>
                        </div>
                        <div className="ml-auto">
                            <div className="w-10 h-5 bg-green-500/20 rounded-full flex items-center px-0.5 cursor-pointer">
                                <div className="w-4 h-4 bg-green-500 rounded-full shadow-md ml-auto" />
                            </div>
                        </div>
                    </div>

                    <div className="pt-4 border-t border-white/5">
                        <button className="w-full py-2.5 bg-white/5 hover:bg-white/10 rounded-lg text-gray-300 font-medium transition-all flex items-center justify-center gap-2">
                            <RefreshCw size={16} /> Reset Default Safety Settings
                        </button>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}
