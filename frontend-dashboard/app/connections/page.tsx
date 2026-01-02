"use client";

import React, { useState } from 'react';
import {
    UserPlus, Users, Search, Filter, MoreHorizontal,
    Check, X, MessageCircle, MapPin, Building, GraduationCap
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const REQUESTS = [
    { id: 1, name: "Alexander Wright", role: "Product Manager", company: "Google", mutual: 12, avatar: "A", time: "2h" },
    { id: 2, name: "Emily Chen", role: "UX Designer", company: "Adobe", mutual: 4, avatar: "E", time: "5h" },
    { id: 3, name: "David Kim", role: "Software Engineer", company: "Meta", mutual: 8, avatar: "D", time: "1d" },
];

const SUGGESTIONS = [
    { id: 4, name: "Sarah Connor", role: "VP Engineering", company: "Cyberdyne", mutual: 15, avatar: "S" },
    { id: 5, name: "John Reese", role: "Security Specialist", company: "Ingen", mutual: 3, avatar: "J" },
    { id: 6, name: "Ellen Ripley", role: "Logistics Manager", company: "Weyland-Yutani", mutual: 7, avatar: "E" },
    { id: 7, name: "Tony Stark", role: "CEO", company: "Stark Ind", mutual: 42, avatar: "T" },
];

export default function ConnectionsPage() {
    const [activeTab, setActiveTab] = useState<'requests' | 'network' | 'blocked'>('requests');

    return (
        <div className="min-h-screen p-6 space-y-6">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-linear-to-r from-teal-400 to-emerald-400">
                        Connections
                    </h1>
                    <p className="text-gray-400 mt-1">Grow and manage your professional network.</p>
                </div>

                <div className="flex items-center gap-3">
                    <div className="relative">
                        <Search className="absolute left-3 top-2.5 text-gray-500" size={16} />
                        <input
                            type="text"
                            placeholder="Search people..."
                            className="bg-white/5 border border-white/10 rounded-lg pl-9 pr-4 py-2 text-sm text-gray-200 focus:outline-none focus:ring-1 focus:ring-teal-500 transition-all w-64"
                        />
                    </div>
                    <button className="flex items-center gap-2 bg-teal-600 hover:bg-teal-700 text-white px-4 py-2 rounded-lg shadow-lg shadow-teal-900/20 transition-all font-medium">
                        <UserPlus size={18} />
                        <span className="hidden sm:inline">Add New</span>
                    </button>
                </div>
            </div>

            {/* Tabs */}
            <div className="flex border-b border-white/10">
                {[
                    { id: 'requests', label: 'Requests', count: 3 },
                    { id: 'network', label: 'My Network', count: 1240 },
                    { id: 'blocked', label: 'Blocked', count: 0 }
                ].map((tab) => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id as any)}
                        className={`px-6 py-3 text-sm font-medium border-b-2 transition-all ${activeTab === tab.id
                                ? 'border-teal-500 text-teal-400'
                                : 'border-transparent text-gray-400 hover:text-white'
                            }`}
                    >
                        {tab.label} <span className="ml-1 text-xs px-1.5 py-0.5 rounded-full bg-white/10">{tab.count}</span>
                    </button>
                ))}
            </div>

            {/* Requests Section */}
            {activeTab === 'requests' && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">

                    {/* Pending Requests */}
                    <div>
                        <h3 className="text-lg font-semibold text-gray-200 mb-4 flex items-center gap-2">
                            Pending Invites <span className="text-sm font-normal text-gray-500">({REQUESTS.length})</span>
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {REQUESTS.map((req, i) => (
                                <motion.div
                                    key={req.id}
                                    initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}
                                    className="glass-card p-4 rounded-xl border border-white/5 flex flex-col gap-3 group hover:border-teal-500/20 transition-colors"
                                >
                                    <div className="flex justify-between items-start">
                                        <div className="flex gap-3">
                                            <div className="w-12 h-12 rounded-full bg-linear-to-br from-teal-600 to-emerald-600 flex items-center justify-center text-lg font-bold text-white shadow-lg">
                                                {req.avatar}
                                            </div>
                                            <div>
                                                <h4 className="font-bold text-gray-100 group-hover:text-teal-400 transition-colors">{req.name}</h4>
                                                <p className="text-xs text-gray-400">{req.role}</p>
                                                <p className="text-xs text-gray-500 flex items-center gap-1 mt-0.5"><Building size={10} /> {req.company}</p>
                                            </div>
                                        </div>
                                        <span className="text-[10px] text-gray-500">{req.time} ago</span>
                                    </div>

                                    <div className="flex items-center gap-2 text-xs text-gray-400 bg-white/5 p-2 rounded-lg">
                                        <Users size={12} className="text-teal-500" />
                                        {req.mutual} mutual connections
                                    </div>

                                    <div className="flex gap-2 mt-1">
                                        <button className="flex-1 bg-teal-600/20 hover:bg-teal-600/30 text-teal-400 border border-teal-600/30 py-1.5 rounded-lg text-sm font-medium transition-colors flex justify-center items-center gap-2">
                                            <Check size={14} /> Accept
                                        </button>
                                        <button className="flex-1 bg-white/5 hover:bg-white/10 text-gray-400 border border-white/10 py-1.5 rounded-lg text-sm font-medium transition-colors flex justify-center items-center gap-2">
                                            <X size={14} /> Ignore
                                        </button>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </div>

                    {/* AI Suggestions */}
                    <div>
                        <h3 className="text-lg font-semibold text-gray-200 mb-4 flex items-center gap-2">
                            AI Recommended <span className="text-xs px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-400 border border-blue-500/30">Beta</span>
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                            {SUGGESTIONS.map((sug, i) => (
                                <motion.div
                                    key={sug.id}
                                    initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.2 + i * 0.1 }}
                                    className="glass-card p-4 rounded-xl border border-dashed border-white/10 flex flex-col items-center text-center gap-2 hover:bg-white/[0.02] transition-colors relative overflow-hidden"
                                >
                                    <div className="absolute top-0 right-0 p-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <button className="text-gray-500 hover:text-white"><X size={14} /></button>
                                    </div>

                                    <div className="w-16 h-16 rounded-full bg-linear-to-br from-gray-700 to-gray-600 flex items-center justify-center text-2xl font-bold text-white mb-1 ring-4 ring-black/20">
                                        {sug.avatar}
                                    </div>

                                    <div>
                                        <h4 className="font-bold text-gray-200 text-sm">{sug.name}</h4>
                                        <p className="text-xs text-gray-500 mt-0.5">{sug.role}</p>
                                        <p className="text-[10px] text-gray-600 mt-0.5">{sug.company}</p>
                                    </div>

                                    <div className="mt-2 w-full">
                                        <button className="w-full border border-white/10 hover:border-teal-500/50 hover:bg-teal-500/10 hover:text-teal-400 text-gray-400 py-1.5 rounded-lg text-xs font-medium transition-all flex items-center justify-center gap-1.5">
                                            <UserPlus size={14} /> Connect
                                        </button>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </div>

                </motion.div>
            )}

            {/* Network Tab (Placeholder for now) */}
            {activeTab === 'network' && (
                <div className="flex flex-col items-center justify-center h-64 text-gray-500">
                    <Users size={48} className="mb-4 opacity-50" />
                    <p>Network list loaded from caching server...</p>
                </div>
            )}
        </div>
    );
}
