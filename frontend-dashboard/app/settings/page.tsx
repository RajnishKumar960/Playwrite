'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import {
    Settings, Key, User, Database, Wifi,
    Eye, EyeOff, CheckCircle2, Save
} from 'lucide-react';

export default function SettingsPage() {
    const [showPassword, setShowPassword] = useState(false);
    const [saved, setSaved] = useState(false);
    const [config, setConfig] = useState({
        linkedinEmail: '',
        linkedinPassword: '',
        googleSheetId: '',
        openaiKey: '',
        dashboardUrl: 'http://localhost:4000'
    });

    const handleSave = async () => {
        try {
            await fetch('/api/settings', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(config)
            });
        } catch { }
        setSaved(true);
        setTimeout(() => setSaved(false), 2000);
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold flex items-center gap-3">
                        <div className="p-2 rounded-xl bg-gradient-to-br from-gray-500/20 to-slate-500/20">
                            <Settings className="w-6 h-6 text-gray-400" />
                        </div>
                        Settings
                    </h1>
                    <p className="text-muted-foreground mt-1">Configure your automation settings</p>
                </div>
                <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleSave}
                    className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-colors ${saved ? 'bg-green-500 text-white' : 'bg-primary text-primary-foreground'
                        }`}
                >
                    {saved ? <CheckCircle2 className="w-4 h-4" /> : <Save className="w-4 h-4" />}
                    {saved ? 'Saved!' : 'Save'}
                </motion.button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* LinkedIn Credentials */}
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 }}
                    className="glass-card rounded-xl p-6"
                >
                    <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                        <User className="w-5 h-5 text-blue-400" />
                        LinkedIn Credentials
                    </h2>

                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm mb-2">Email</label>
                            <input
                                type="email"
                                value={config.linkedinEmail}
                                onChange={(e) => setConfig({ ...config, linkedinEmail: e.target.value })}
                                placeholder="your@email.com"
                                className="w-full px-4 py-2.5 bg-accent border border-border rounded-xl focus:border-primary/50 focus:outline-none"
                            />
                        </div>
                        <div>
                            <label className="block text-sm mb-2">Password</label>
                            <div className="relative">
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    value={config.linkedinPassword}
                                    onChange={(e) => setConfig({ ...config, linkedinPassword: e.target.value })}
                                    placeholder="••••••••"
                                    className="w-full px-4 py-2.5 bg-accent border border-border rounded-xl focus:border-primary/50 focus:outline-none pr-12"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                                >
                                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                </button>
                            </div>
                        </div>
                    </div>
                </motion.div>

                {/* API Keys */}
                <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 }}
                    className="glass-card rounded-xl p-6"
                >
                    <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                        <Key className="w-5 h-5 text-yellow-400" />
                        API Keys
                    </h2>

                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm mb-2">OpenAI API Key</label>
                            <input
                                type="password"
                                value={config.openaiKey}
                                onChange={(e) => setConfig({ ...config, openaiKey: e.target.value })}
                                placeholder="sk-..."
                                className="w-full px-4 py-2.5 bg-accent border border-border rounded-xl focus:border-primary/50 focus:outline-none"
                            />
                        </div>
                        <div>
                            <label className="block text-sm mb-2">Google Sheet ID</label>
                            <input
                                type="text"
                                value={config.googleSheetId}
                                onChange={(e) => setConfig({ ...config, googleSheetId: e.target.value })}
                                placeholder="1BxiMVs..."
                                className="w-full px-4 py-2.5 bg-accent border border-border rounded-xl focus:border-primary/50 focus:outline-none"
                            />
                        </div>
                    </div>
                </motion.div>

                {/* Connection Settings */}
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.4 }}
                    className="glass-card rounded-xl p-6"
                >
                    <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                        <Wifi className="w-5 h-5 text-green-400" />
                        Connection
                    </h2>

                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm mb-2">Dashboard API URL</label>
                            <input
                                type="url"
                                value={config.dashboardUrl}
                                onChange={(e) => setConfig({ ...config, dashboardUrl: e.target.value })}
                                placeholder="http://localhost:4000"
                                className="w-full px-4 py-2.5 bg-accent border border-border rounded-xl focus:border-primary/50 focus:outline-none"
                            />
                        </div>

                        <div className="flex items-center justify-between p-3 bg-accent/30 rounded-lg">
                            <div className="flex items-center gap-3">
                                <div className="w-2 h-2 rounded-full bg-green-500" />
                                <span className="text-sm">API Status</span>
                            </div>
                            <span className="text-sm text-green-400">Connected</span>
                        </div>
                    </div>
                </motion.div>

                {/* Database */}
                <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.5 }}
                    className="glass-card rounded-xl p-6"
                >
                    <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                        <Database className="w-5 h-5 text-purple-400" />
                        Database
                    </h2>

                    <div className="space-y-3">
                        <div className="flex items-center justify-between p-3 bg-accent/30 rounded-lg">
                            <span className="text-sm">Database Size</span>
                            <span className="text-sm font-mono">4.2 MB</span>
                        </div>
                        <div className="flex items-center justify-between p-3 bg-accent/30 rounded-lg">
                            <span className="text-sm">Total Records</span>
                            <span className="text-sm font-mono">1,234</span>
                        </div>
                        <div className="flex items-center justify-between p-3 bg-accent/30 rounded-lg">
                            <span className="text-sm">Last Backup</span>
                            <span className="text-sm text-muted-foreground">2024-12-24</span>
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}
