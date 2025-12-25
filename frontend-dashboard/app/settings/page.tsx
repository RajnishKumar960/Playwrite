"use client";

import React from 'react';
import { User, Bell, Key, Globe, LogOut, Code, Database, ChevronRight } from 'lucide-react';
import { motion } from 'framer-motion';

export default function SettingsPage() {
    return (
        <div className="min-h-screen p-6 space-y-6 max-w-5xl mx-auto">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-linear-to-r from-gray-200 to-gray-400">
                    Settings
                </h1>
                <p className="text-gray-400 mt-1">Manage your account preferences and integrations.</p>
            </div>

            {/* Profile Card */}
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
                className="glass-card p-6 rounded-xl border border-white/5 flex items-center gap-6"
            >
                <div className="w-20 h-20 rounded-full bg-linear-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-3xl font-bold text-white shadow-xl ring-4 ring-black/20">
                    JS
                </div>
                <div className="flex-1">
                    <h2 className="text-xl font-bold text-gray-100">John Smith</h2>
                    <p className="text-gray-400">john.smith@example.com</p>
                    <div className="flex gap-2 mt-3">
                        <span className="px-2 py-0.5 rounded text-xs bg-purple-500/10 text-purple-400 border border-purple-500/20">Pro Plan</span>
                        <span className="px-2 py-0.5 rounded text-xs bg-blue-500/10 text-blue-400 border border-blue-500/20">Administrator</span>
                    </div>
                </div>
                <button className="px-4 py-2 bg-white/5 hover:bg-white/10 rounded-lg text-sm text-gray-300 transition-colors border border-white/10">
                    Edit Profile
                </button>
            </motion.div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Settings Sidebar */}
                <div className="space-y-2">
                    {[
                        { icon: User, label: 'Account', active: true },
                        { icon: Bell, label: 'Notifications', active: false },
                        { icon: Key, label: 'API Keys', active: false },
                        { icon: Globe, label: 'Integrations', active: false },
                        { icon: Database, label: 'Data & Export', active: false },
                    ].map((item) => (
                        <button
                            key={item.label}
                            className={`w-full text-left px-4 py-3 rounded-xl flex items-center gap-3 transition-colors ${item.active
                                    ? 'bg-blue-600/10 text-blue-400 border border-blue-500/20'
                                    : 'text-gray-400 hover:bg-white/5 hover:text-white border border-transparent'
                                }`}
                        >
                            <item.icon size={18} />
                            <span className="font-medium">{item.label}</span>
                        </button>
                    ))}

                    <div className="pt-6">
                        <button className="w-full text-left px-4 py-3 rounded-xl flex items-center gap-3 text-red-400 hover:bg-red-500/10 border border-transparent transition-colors">
                            <LogOut size={18} />
                            <span className="font-medium">Sign Out</span>
                        </button>
                    </div>
                </div>

                {/* Main Content Area */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Integration Section */}
                    <motion.div
                        initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }}
                        className="glass-card p-6 rounded-xl border border-white/5"
                    >
                        <h3 className="text-lg font-bold text-gray-100 mb-4 flex items-center gap-2">
                            <Globe size={18} className="text-blue-400" /> Connected Services
                        </h3>

                        <div className="space-y-4">
                            <div className="flex items-center justify-between p-4 rounded-lg bg-white/5 border border-white/5">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded bg-[#0077b5] flex items-center justify-center text-white font-bold">in</div>
                                    <div>
                                        <h4 className="font-medium text-gray-200">LinkedIn Account</h4>
                                        <p className="text-xs text-green-400">Connected • Last sync 5m ago</p>
                                    </div>
                                </div>
                                <button className="text-xs bg-white/5 px-3 py-1.5 rounded-lg text-gray-300 hover:bg-white/10">Configure</button>
                            </div>

                            <div className="flex items-center justify-between p-4 rounded-lg bg-white/5 border border-white/5 opacity-75">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded bg-[#E4405F] flex items-center justify-center text-white font-bold">Ig</div>
                                    <div>
                                        <h4 className="font-medium text-gray-200">Instagram</h4>
                                        <p className="text-xs text-gray-500">Not Connected</p>
                                    </div>
                                </div>
                                <button className="text-xs bg-blue-600 hover:bg-blue-700 px-3 py-1.5 rounded-lg text-white">Connect</button>
                            </div>
                        </div>
                    </motion.div>

                    {/* API Section */}
                    <motion.div
                        initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}
                        className="glass-card p-6 rounded-xl border border-white/5"
                    >
                        <h3 className="text-lg font-bold text-gray-100 mb-4 flex items-center gap-2">
                            <Code size={18} className="text-purple-400" /> Developer Settings
                        </h3>

                        <div className="p-4 rounded-lg bg-black/30 border border-white/10 font-mono text-sm">
                            <div className="flex justify-between items-center mb-2">
                                <span className="text-gray-500">Public API Key</span>
                                <span className="text-xs text-blue-400 cursor-pointer hover:underline">Regenerate</span>
                            </div>
                            <div className="flex items-center gap-2 text-gray-300">
                                pk_live_51Mz...q3x9 <CopyButton />
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>
        </div>
    );
}

function CopyButton() {
    return (
        <button className="p-1 hover:bg-white/10 rounded">
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-500"><rect width="14" height="14" x="8" y="8" rx="2" ry="2" /><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" /></svg>
        </button>
    )
}
