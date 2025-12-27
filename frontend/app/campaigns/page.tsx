"use client";

import React, { useState, useEffect } from "react";
import {
    Rocket, Play, Pause, Plus, MoreHorizontal,
    Users, MessageSquare, Clock, CheckCircle2,
    Search, Filter, LayoutGrid, List as ListIcon
} from "lucide-react";
import StatsCard from "@/components/dashboard/StatsCard";
import { api } from "@/lib/api";

export default function CampaignsPage() {
    const [campaigns, setCampaigns] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [showWizard, setShowWizard] = useState(false);
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

    useEffect(() => {
        fetchCampaigns();
    }, []);

    const fetchCampaigns = async () => {
        try {
            const data = await api.campaigns.list();
            setCampaigns(data.campaigns || []);
        } catch (error) {
            console.error("Failed to fetch campaigns", error);
            // Fallback Mock Data
            setCampaigns([
                {
                    id: 1,
                    name: "Outreach Alpha",
                    status: "active",
                    progress: 45,
                    leads: 200,
                    sent: 90,
                    replied: 12,
                    agent: "Connection Builder"
                },
                {
                    id: 2,
                    name: "Series B Founders",
                    status: "paused",
                    progress: 12,
                    leads: 50,
                    sent: 25,
                    replied: 3,
                    agent: "Lead Scraper"
                },
                {
                    id: 3,
                    name: "Tech Hiring Managers",
                    status: "active",
                    progress: 78,
                    leads: 300,
                    sent: 240,
                    replied: 45,
                    agent: "Engagement Bot"
                }
            ]);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen font-sans p-6 md:p-8 space-y-8 pb-20">

            {/* Header & Stats */}
            <div className="space-y-6">
                <div>
                    <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-linear-to-r from-blue-400 to-indigo-400">
                        Campaigns
                    </h1>
                    <p className="text-gray-400 mt-1">Manage and monitor your outreach automation operations.</p>
                </div>

                {/* KPI Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <StatsCard
                        label="Active Campaigns"
                        value={campaigns.filter(c => c.status === 'active').length}
                        icon={Rocket}
                        color="from-blue-500 to-indigo-600"
                        trend="Operational"
                    />
                    <StatsCard
                        label="Total Leads Targeted"
                        value={campaigns.reduce((acc, curr) => acc + (curr.leads || 0), 0)}
                        icon={Users}
                        color="from-purple-500 to-pink-500"
                        trend="+12%"
                    />
                    <StatsCard
                        label="Avg. Response Rate"
                        value={12.5}
                        suffix="%"
                        icon={MessageSquare}
                        color="from-green-400 to-emerald-600"
                        trend="+2.1%"
                    />
                </div>
            </div>

            {/* Toolbar */}
            <div className="flex flex-col md:flex-row justify-between items-center gap-4 bg-white/5 p-4 rounded-xl border border-white/5 backdrop-blur-sm">
                <div className="relative w-full md:w-96">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 w-4 h-4" />
                    <input
                        type="text"
                        placeholder="Search campaigns..."
                        className="w-full bg-black/20 border border-white/10 rounded-lg pl-10 pr-4 py-2 text-sm text-gray-300 focus:ring-2 focus:ring-blue-500/50 outline-none transition-all placeholder:text-gray-600"
                    />
                </div>

                <div className="flex items-center gap-3 w-full md:w-auto">
                    <button className="flex items-center gap-2 px-3 py-2 bg-white/5 hover:bg-white/10 rounded-lg text-sm text-gray-300 border border-white/5 transition-colors">
                        <Filter className="w-4 h-4" />
                        <span>Filter</span>
                    </button>

                    <div className="h-6 w-px bg-white/10 mx-1 hidden md:block" />

                    <div className="flex items-center bg-black/20 rounded-lg p-1 border border-white/5">
                        <button
                            onClick={() => setViewMode('grid')}
                            className={`p-1.5 rounded-md transition-all ${viewMode === 'grid' ? 'bg-white/10 text-white' : 'text-gray-500 hover:text-gray-300'}`}
                        >
                            <LayoutGrid className="w-4 h-4" />
                        </button>
                        <button
                            onClick={() => setViewMode('list')}
                            className={`p-1.5 rounded-md transition-all ${viewMode === 'list' ? 'bg-white/10 text-white' : 'text-gray-500 hover:text-gray-300'}`}
                        >
                            <ListIcon className="w-4 h-4" />
                        </button>
                    </div>

                    <button
                        onClick={() => setShowWizard(true)}
                        className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg shadow-lg hover:shadow-blue-600/20 transition-all font-medium text-sm ml-auto md:ml-0"
                    >
                        <Plus size={16} />
                        <span>New Campaign</span>
                    </button>
                </div>
            </div>

            {/* Campaign Grid */}
            {isLoading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[1, 2, 3].map(i => (
                        <div key={i} className="h-64 glass-card animate-pulse rounded-xl border border-white/5"></div>
                    ))}
                </div>
            ) : (
                <div className={`grid gap-6 ${viewMode === 'grid' ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1'}`}>
                    {campaigns.map((campaign) => (
                        <div
                            key={campaign.id}
                            className={`glass-card rounded-xl p-6 relative overflow-hidden group border border-white/5 hover:border-white/20 transition-all duration-300 ${viewMode === 'list' ? 'flex items-center justify-between gap-8' : 'flex flex-col justify-between h-full'}`}
                        >
                            {viewMode === 'grid' && (
                                <div className={`absolute top-0 left-0 w-1 h-full transition-all duration-300 ${campaign.status === 'active' ? 'bg-green-500 shadow-[0_0_15px_rgba(34,197,94,0.4)]' : 'bg-amber-400'}`} />
                            )}

                            {/* Card Header */}
                            <div className={`${viewMode === 'list' ? 'w-1/4' : 'flex justify-between items-start mb-6'}`}>
                                <div>
                                    <h3 className="text-xl font-bold text-gray-100 group-hover:text-blue-300 transition-colors truncate">{campaign.name}</h3>
                                    <div className="flex items-center space-x-2 mt-1.5">
                                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold tracking-wider uppercase border ${campaign.status === 'active' ? 'bg-green-500/10 text-green-400 border-green-500/20' : 'bg-amber-500/10 text-amber-400 border-amber-500/20'}`}>
                                            {campaign.status}
                                        </span>
                                        <span className="text-gray-500 text-xs">• {campaign.agent}</span>
                                    </div>
                                </div>
                                {viewMode === 'grid' && (
                                    <button className="text-gray-500 hover:text-white transition-colors">
                                        <MoreHorizontal size={20} />
                                    </button>
                                )}
                            </div>

                            {/* Stats Grid */}
                            <div className={`grid grid-cols-3 gap-2 ${viewMode === 'list' ? 'flex-1' : 'mb-6'}`}>
                                <div className="text-center p-2 bg-black/20 rounded-lg border border-white/5">
                                    <div className="text-[10px] text-gray-400 mb-1 flex justify-center items-center uppercase tracking-wide"><Users size={10} className="mr-1" /> Leads</div>
                                    <div className="font-bold text-gray-200">{campaign.leads}</div>
                                </div>
                                <div className="text-center p-2 bg-black/20 rounded-lg border border-white/5">
                                    <div className="text-[10px] text-gray-400 mb-1 flex justify-center items-center uppercase tracking-wide"><Rocket size={10} className="mr-1" /> Sent</div>
                                    <div className="font-bold text-gray-200">{campaign.sent}</div>
                                </div>
                                <div className="text-center p-2 bg-black/20 rounded-lg border border-white/5">
                                    <div className="text-[10px] text-gray-400 mb-1 flex justify-center items-center uppercase tracking-wide"><MessageSquare size={10} className="mr-1" /> Replied</div>
                                    <div className="font-bold text-gray-200">{campaign.replied}</div>
                                </div>
                            </div>

                            {/* Progress & Actions */}
                            <div className={`${viewMode === 'list' ? 'w-1/4 flex items-center justify-end gap-6' : ''}`}>
                                <div className={`${viewMode === 'list' ? 'w-32' : 'mb-4'}`}>
                                    <div className="flex justify-between text-xs text-gray-500 mb-1.5">
                                        <span>Progress</span>
                                        <span className="text-blue-400 font-mono">{campaign.progress}%</span>
                                    </div>
                                    <div className="w-full bg-gray-700/30 rounded-full h-1.5 overflow-hidden">
                                        <div
                                            className="bg-blue-500 h-full rounded-full transition-all duration-1000 ease-out relative shadow-[0_0_10px_rgba(59,130,246,0.5)]"
                                            style={{ width: `${campaign.progress}%` }}
                                        >
                                            <div className="absolute inset-0 bg-white/20 animate-[shimmer_2s_infinite]" />
                                        </div>
                                    </div>
                                </div>

                                {/* Actions Footer */}
                                <div className={`flex items-center ${viewMode === 'list' ? '' : 'justify-between pt-4 border-t border-white/10'}`}>
                                    {viewMode === 'grid' && (
                                        <div className="text-xs text-gray-500 flex items-center">
                                            <Clock size={12} className="mr-1.5" /> 2h ago
                                        </div>
                                    )}
                                    <button className={`p-2 rounded-full transition-all ${campaign.status === 'active'
                                        ? 'bg-amber-500/10 text-amber-500 hover:bg-amber-500/20'
                                        : 'bg-green-500/10 text-green-500 hover:bg-green-500/20'
                                        }`}>
                                        {campaign.status === 'active' ? <Pause size={18} /> : <Play size={18} />}
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}

                    {/* New Campaign Add Card */}
                    {viewMode === 'grid' && (
                        <button
                            onClick={() => setShowWizard(true)}
                            className="border-2 border-dashed border-gray-700/50 rounded-xl p-6 flex flex-col items-center justify-center text-gray-500 hover:text-blue-400 hover:border-blue-500/50 hover:bg-blue-500/5 transition-all group min-h-[250px]"
                        >
                            <div className="w-14 h-14 rounded-full bg-gray-800/50 group-hover:bg-blue-500/20 flex items-center justify-center mb-4 transition-colors ring-1 ring-white/5 group-hover:ring-blue-500/30">
                                <Plus size={28} className="text-gray-400 group-hover:text-blue-400" />
                            </div>
                            <span className="font-semibold text-lg">Create New Campaign</span>
                            <span className="text-sm text-gray-600 mt-1">Configurable agents & leads</span>
                        </button>
                    )}
                </div>
            )}

            {/* Improved Wizard Modal */}
            {showWizard && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-md z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
                    <div className="glass-card border border-white/10 rounded-2xl shadow-2xl w-full max-w-2xl p-8 transform transition-all animate-in zoom-in-95 duration-200 relative overflow-hidden">
                        {/* Background Splashes */}
                        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 blur-[80px] rounded-full pointer-events-none" />
                        <div className="absolute bottom-0 left-0 w-64 h-64 bg-purple-500/10 blur-[80px] rounded-full pointer-events-none" />

                        <h2 className="text-2xl font-bold mb-1 text-white relative z-10">Create New Campaign</h2>
                        <p className="text-gray-400 mb-8 text-sm relative z-10">Configure your automated outreach agent.</p>

                        <div className="space-y-6 relative z-10">
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">Campaign Name</label>
                                <input
                                    type="text"
                                    className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-blue-500/50 outline-none transition-all placeholder:text-gray-600"
                                    placeholder="e.g. Q1 Saas Outreach"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-2">Agent Type</label>
                                    <div className="relative">
                                        <select className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-blue-500/50 outline-none appearance-none cursor-pointer">
                                            <option className="bg-slate-900">Connection Builder</option>
                                            <option className="bg-slate-900">Lead Engagement (Pain Points)</option>
                                            <option className="bg-slate-900">Feed Warmer</option>
                                        </select>
                                        <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
                                            <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                                        </div>
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-2">Target Audience</label>
                                    <div className="relative">
                                        <select className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-blue-500/50 outline-none appearance-none cursor-pointer">
                                            <option className="bg-slate-900">All Unprocessed Leads</option>
                                            <option className="bg-slate-900">CEOs & Founders</option>
                                            <option className="bg-slate-900">2nd Degree Connections</option>
                                        </select>
                                        <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
                                            <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="mt-10 flex justify-end space-x-3 relative z-10">
                            <button
                                onClick={() => setShowWizard(false)}
                                className="px-5 py-2.5 text-gray-400 hover:bg-white/5 rounded-xl transition-colors font-medium"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={() => {
                                    alert("Campaign Created!");
                                    setShowWizard(false);
                                }}
                                className="px-6 py-2.5 bg-linear-to-r from-blue-600 to-indigo-600 text-white rounded-xl hover:shadow-lg hover:shadow-blue-600/20 hover:scale-[1.02] transition-all font-semibold flex items-center gap-2"
                            >
                                <CheckCircle2 size={18} />
                                Launch Campaign
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
