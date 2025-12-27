"use client";

import React, { useState, useEffect } from 'react';
import { User, Bell, Key, Globe, LogOut, Database, Save, Eye, EyeOff, ShieldCheck } from 'lucide-react';
import { motion } from 'framer-motion';

export default function SettingsPage() {
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    // Form State
    const [formData, setFormData] = useState({
        linkedinEmail: '',
        linkedinPassword: '',
        openaiKey: '',
        googleSheetId: '',
    });

    useEffect(() => {
        fetch('/api/settings')
            .then(res => res.json())
            .then(data => {
                setFormData(prev => ({
                    ...prev,
                    linkedinEmail: data.linkedinEmail || '',
                    googleSheetId: data.googleSheetId || ''
                }));
            })
            .catch(err => console.error("Failed to load settings", err));
    }, []);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSave = async () => {
        setLoading(true);
        try {
            await new Promise(resolve => setTimeout(resolve, 1000));
            await fetch('/api/settings', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });
            alert("Settings saved successfully!");
        } catch (error) {
            alert("Failed to save settings.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen p-6 space-y-6 max-w-6xl mx-auto pb-20">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-linear-to-r from-gray-200 to-gray-400">
                    Settings
                </h1>
                <p className="text-gray-400 mt-1">Manage your account preferences and integration keys.</p>
            </div>

            {/* Profile Card (Restored) */}
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
                className="glass-card p-6 rounded-xl border border-white/5 flex flex-col md:flex-row items-center gap-6"
            >
                <div className="w-20 h-20 rounded-full bg-linear-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-3xl font-bold text-white shadow-xl ring-4 ring-black/20">
                    JS
                </div>
                <div className="flex-1 text-center md:text-left">
                    <h2 className="text-xl font-bold text-gray-100">John Smith</h2>
                    <p className="text-gray-400">john.smith@example.com</p>
                    <div className="flex justify-center md:justify-start gap-2 mt-3">
                        <span className="px-2 py-0.5 rounded text-xs bg-purple-500/10 text-purple-400 border border-purple-500/20">Pro Plan</span>
                        <span className="px-2 py-0.5 rounded text-xs bg-blue-500/10 text-blue-400 border border-blue-500/20">Administrator</span>
                    </div>
                </div>
                <button className="px-4 py-2 bg-white/5 hover:bg-white/10 rounded-lg text-sm text-gray-300 transition-colors border border-white/10">
                    Edit Profile
                </button>
            </motion.div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Settings Sidebar (Restored) */}
                <div className="space-y-2">
                    {[
                        { icon: User, label: 'Account', active: false },
                        { icon: Key, label: 'Integrations & Keys', active: true },
                        { icon: Bell, label: 'Notifications', active: false },
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

                {/* Main Content Area (Updated with New Forms) */}
                <div className="lg:col-span-2 space-y-6">

                    {/* LinkedIn Configuration */}
                    <motion.div
                        initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }}
                        className="glass-card p-6 rounded-xl border border-white/5"
                    >
                        <div className="flex items-center gap-3 mb-6 border-b border-white/5 pb-4">
                            <div className="w-10 h-10 rounded bg-[#0077b5] flex items-center justify-center text-white font-bold">in</div>
                            <div>
                                <h3 className="text-lg font-bold text-gray-100">LinkedIn Access</h3>
                                <p className="text-xs text-green-400">Active • Last sync 5m ago</p>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-300">Email Address</label>
                                <input
                                    type="email"
                                    name="linkedinEmail"
                                    value={formData.linkedinEmail}
                                    onChange={handleChange}
                                    className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-2.5 text-white focus:ring-2 focus:ring-blue-500/50 outline-none transition-all placeholder:text-gray-600"
                                    placeholder="john.doe@linkedin.com"
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-300">Password</label>
                                <div className="relative">
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        name="linkedinPassword"
                                        value={formData.linkedinPassword}
                                        onChange={handleChange}
                                        className="w-full bg-black/20 border border-white/10 rounded-xl pl-4 pr-10 py-2.5 text-white focus:ring-2 focus:ring-blue-500/50 outline-none transition-all placeholder:text-gray-600"
                                        placeholder="••••••••••••"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white transition-colors"
                                    >
                                        {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </motion.div>

                    {/* API Keys Configuration */}
                    <motion.div
                        initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}
                        className="glass-card p-6 rounded-xl border border-white/5"
                    >
                        <div className="flex items-center gap-3 mb-6 border-b border-white/5 pb-4">
                            <Key className="w-6 h-6 text-purple-400" />
                            <div>
                                <h3 className="text-lg font-bold text-gray-100">API Credentials</h3>
                                <p className="text-xs text-gray-500">Manage external service connections</p>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-300">OpenAI API Key</label>
                                <input
                                    type="password"
                                    name="openaiKey"
                                    value={formData.openaiKey}
                                    onChange={handleChange}
                                    className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-2.5 text-white focus:ring-2 focus:ring-purple-500/50 outline-none transition-all placeholder:text-gray-600 font-mono text-sm"
                                    placeholder="sk-..."
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-300">Google Sheet ID</label>
                                <div className="relative">
                                    <Globe className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 w-4 h-4" />
                                    <input
                                        type="text"
                                        name="googleSheetId"
                                        value={formData.googleSheetId}
                                        onChange={handleChange}
                                        className="w-full bg-black/20 border border-white/10 rounded-xl pl-4 pr-10 py-2.5 text-white focus:ring-2 focus:ring-purple-500/50 outline-none transition-all placeholder:text-gray-600 font-mono text-sm"
                                        placeholder="1BxiMvs0XRA..."
                                    />
                                </div>
                            </div>
                        </div>
                    </motion.div>

                    {/* Save Button */}
                    <motion.div
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}
                        className="flex justify-end"
                    >
                        <button
                            onClick={handleSave}
                            disabled={loading}
                            className="flex items-center gap-2 px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold shadow-lg shadow-blue-600/20 transition-all hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? 'Saving...' : (
                                <>
                                    <Save size={18} />
                                    Save Configuration
                                </>
                            )}
                        </button>
                    </motion.div>

                </div>
            </div>
        </div>
    );
}
