"use client";

import React, { useState, useEffect } from "react";
import {
    Rocket, Play, Pause, Plus, MoreHorizontal,
    Users, MessageSquare, BarChart, Clock, CheckCircle2
} from "lucide-react";

export default function CampaignsPage() {
    const [campaigns, setCampaigns] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [showWizard, setShowWizard] = useState(false);

    useEffect(() => {
        fetchCampaigns();
    }, []);

    const fetchCampaigns = async () => {
        try {
            const res = await fetch("http://localhost:5000/api/campaigns");
            const data = await res.json();
            setCampaigns(data.campaigns || []);
        } catch (error) {
            console.error("Failed to fetch campaigns", error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 text-gray-900 font-sans p-6 md:p-8 space-y-6">

            {/* Header */}
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">
                        Campaigns
                    </h1>
                    <p className="text-gray-500 mt-1">Manage and monitor your outreach automation.</p>
                </div>
                <button
                    onClick={() => setShowWizard(true)}
                    className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-lg shadow-lg hover:shadow-xl transition-all font-medium"
                >
                    <Plus size={18} />
                    <span>New Campaign</span>
                </button>
            </div>

            {/* Campaign Grid */}
            {isLoading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[1, 2, 3].map(i => (
                        <div key={i} className="h-48 bg-gray-200 animate-pulse rounded-xl"></div>
                    ))}
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {campaigns.map((campaign) => (
                        <div
                            key={campaign.id}
                            className="bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow p-6 flex flex-col justify-between h-full relative overflow-hidden"
                        >
                            {/* Status Indicator */}
                            <div className={`absolute top-0 left-0 w-1 h-full ${campaign.status === 'active' ? 'bg-green-500' : 'bg-amber-400'
                                }`} />

                            <div className="flex justify-between items-start mb-4">
                                <div>
                                    <h3 className="text-xl font-bold text-gray-800">{campaign.name}</h3>
                                    <div className="flex items-center space-x-2 mt-1">
                                        <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${campaign.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'
                                            }`}>
                                            {campaign.status.toUpperCase()}
                                        </span>
                                        <span className="text-gray-400 text-xs">• {campaign.agent}</span>
                                    </div>
                                </div>
                                <button className="text-gray-400 hover:text-gray-600">
                                    <MoreHorizontal size={20} />
                                </button>
                            </div>

                            {/* Stats */}
                            <div className="grid grid-cols-3 gap-2 mb-6">
                                <div className="text-center p-2 bg-gray-50 rounded-lg">
                                    <div className="text-xs text-gray-500 mb-1 flex justify-center items-center"><Users size={12} className="mr-1" /> Leads</div>
                                    <div className="font-bold text-gray-800">{campaign.leads}</div>
                                </div>
                                <div className="text-center p-2 bg-gray-50 rounded-lg">
                                    <div className="text-xs text-gray-500 mb-1 flex justify-center items-center"><Rocket size={12} className="mr-1" /> Sent</div>
                                    <div className="font-bold text-gray-800">{campaign.sent}</div>
                                </div>
                                <div className="text-center p-2 bg-gray-50 rounded-lg">
                                    <div className="text-xs text-gray-500 mb-1 flex justify-center items-center"><MessageSquare size={12} className="mr-1" /> Replied</div>
                                    <div className="font-bold text-gray-800">{campaign.replied}</div>
                                </div>
                            </div>

                            {/* Progress Bar */}
                            <div className="mb-4">
                                <div className="flex justify-between text-xs text-gray-500 mb-1">
                                    <span>Progress</span>
                                    <span>{campaign.progress}%</span>
                                </div>
                                <div className="w-full bg-gray-100 rounded-full h-2">
                                    <div
                                        className="bg-blue-600 h-2 rounded-full transition-all duration-500"
                                        style={{ width: `${campaign.progress}%` }}
                                    />
                                </div>
                            </div>

                            {/* Actions */}
                            <div className="pt-4 border-t border-gray-100 flex justify-between items-center">
                                <div className="text-xs text-gray-400 flex items-center">
                                    <Clock size={12} className="mr-1" /> Last active: 2h ago
                                </div>
                                <button className={`p-2 rounded-full ${campaign.status === 'active'
                                        ? 'bg-amber-100 text-amber-600 hover:bg-amber-200'
                                        : 'bg-green-100 text-green-600 hover:bg-green-200'
                                    }`}>
                                    {campaign.status === 'active' ? <Pause size={18} /> : <Play size={18} />}
                                </button>
                            </div>
                        </div>
                    ))}

                    {/* New Campaign Add Card */}
                    <button
                        onClick={() => setShowWizard(true)}
                        className="border-2 border-dashed border-gray-200 rounded-xl p-6 flex flex-col items-center justify-center text-gray-400 hover:text-blue-500 hover:border-blue-300 hover:bg-blue-50 transition-all group"
                    >
                        <div className="w-12 h-12 rounded-full bg-gray-100 group-hover:bg-blue-100 flex items-center justify-center mb-3 transition-colors">
                            <Plus size={24} className="text-gray-400 group-hover:text-blue-600" />
                        </div>
                        <span className="font-medium">Create New Campaign</span>
                    </button>
                </div>
            )}

            {/* Simple Wizard Modal (Placeholder for now) */}
            {showWizard && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl p-8 transform transition-all animate-in fade-in zoom-in duration-200">
                        <h2 className="text-2xl font-bold mb-6">Create New Campaign</h2>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Campaign Name</label>
                                <input type="text" className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 outline-none" placeholder="e.g. Q4 Outreach" />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Agent Type</label>
                                    <select className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 outline-none">
                                        <option>Connection Builder</option>
                                        <option>Lead Engagement (Pain Points)</option>
                                        <option>Feed Warmer</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Target Leads</label>
                                    <select className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 outline-none">
                                        <option>All Unprocessed</option>
                                        <option>CEOs & Founders</option>
                                        <option>2nd Degree Connections</option>
                                    </select>
                                </div>
                            </div>
                        </div>

                        <div className="mt-8 flex justify-end space-x-3">
                            <button
                                onClick={() => setShowWizard(false)}
                                className="px-4 py-2 text-gray-500 hover:bg-gray-100 rounded-lg"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={() => {
                                    alert("Campaign Created!");
                                    setShowWizard(false);
                                }}
                                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 shadow-md"
                            >
                                Create Campaign
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
