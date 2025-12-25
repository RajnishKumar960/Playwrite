'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import {
    Shield, AlertTriangle, Ban, Clock,
    Zap, Eye, CheckCircle2, Save
} from 'lucide-react';

interface SafetySettings {
    dailyLikeLimit: number;
    dailyCommentLimit: number;
    dailyConnectionLimit: number;
    minDelay: number;
    maxDelay: number;
    contentFiltering: boolean;
    skipControversial: boolean;
    skipSensitive: boolean;
    blockedKeywords: string[];
}

export default function SafetyPage() {
    const [settings, setSettings] = useState<SafetySettings>({
        dailyLikeLimit: 100,
        dailyCommentLimit: 20,
        dailyConnectionLimit: 25,
        minDelay: 2,
        maxDelay: 8,
        contentFiltering: true,
        skipControversial: true,
        skipSensitive: true,
        blockedKeywords: ['politics', 'religion', 'gambling', 'adult']
    });
    const [newKeyword, setNewKeyword] = useState('');
    const [saved, setSaved] = useState(false);

    const handleSave = async () => {
        try {
            await fetch('/api/settings/safety', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(settings)
            });
        } catch { }
        setSaved(true);
        setTimeout(() => setSaved(false), 2000);
    };

    const addKeyword = () => {
        if (newKeyword && !settings.blockedKeywords.includes(newKeyword.toLowerCase())) {
            setSettings({ ...settings, blockedKeywords: [...settings.blockedKeywords, newKeyword.toLowerCase()] });
            setNewKeyword('');
        }
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold flex items-center gap-3">
                        <div className="p-2 rounded-xl bg-gradient-to-br from-yellow-500/20 to-red-500/20">
                            <Shield className="w-6 h-6 text-yellow-400" />
                        </div>
                        Safety & Rate Limits
                    </h1>
                    <p className="text-muted-foreground mt-1">Configure automation safety settings</p>
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

            {/* Warning */}
            <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-yellow-500/10 border border-yellow-500/30 rounded-xl p-4 flex items-start gap-3"
            >
                <AlertTriangle className="w-5 h-5 text-yellow-400 shrink-0 mt-0.5" />
                <div>
                    <p className="font-medium text-yellow-400">Important Notice</p>
                    <p className="text-sm text-muted-foreground mt-1">
                        These limits protect your account. Higher values increase risk.
                    </p>
                </div>
            </motion.div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Daily Limits */}
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 }}
                    className="glass-card rounded-xl p-6"
                >
                    <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                        <Clock className="w-5 h-5 text-blue-400" />
                        Daily Limits
                    </h2>

                    <div className="space-y-5">
                        {[
                            { key: 'dailyLikeLimit', label: 'Like Limit', min: 10, max: 200 },
                            { key: 'dailyCommentLimit', label: 'Comment Limit', min: 5, max: 50 },
                            { key: 'dailyConnectionLimit', label: 'Connection Limit', min: 5, max: 100 },
                        ].map(item => (
                            <div key={item.key}>
                                <label className="flex justify-between mb-2">
                                    <span className="text-sm">{item.label}</span>
                                    <span className="text-sm font-mono bg-accent px-2 py-0.5 rounded">
                                        {settings[item.key as keyof SafetySettings]}
                                    </span>
                                </label>
                                <input
                                    type="range"
                                    min={item.min}
                                    max={item.max}
                                    value={settings[item.key as keyof SafetySettings] as number}
                                    onChange={(e) => setSettings({ ...settings, [item.key]: Number(e.target.value) })}
                                    className="w-full accent-primary"
                                />
                            </div>
                        ))}
                    </div>
                </motion.div>

                {/* Timing */}
                <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 }}
                    className="glass-card rounded-xl p-6"
                >
                    <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                        <Zap className="w-5 h-5 text-yellow-400" />
                        Action Timing
                    </h2>

                    <div className="space-y-5">
                        <div>
                            <label className="flex justify-between mb-2">
                                <span className="text-sm">Min Delay (seconds)</span>
                                <span className="text-sm font-mono bg-accent px-2 py-0.5 rounded">{settings.minDelay}s</span>
                            </label>
                            <input
                                type="range"
                                min="1"
                                max="10"
                                value={settings.minDelay}
                                onChange={(e) => setSettings({ ...settings, minDelay: Number(e.target.value) })}
                                className="w-full accent-primary"
                            />
                        </div>
                        <div>
                            <label className="flex justify-between mb-2">
                                <span className="text-sm">Max Delay (seconds)</span>
                                <span className="text-sm font-mono bg-accent px-2 py-0.5 rounded">{settings.maxDelay}s</span>
                            </label>
                            <input
                                type="range"
                                min="3"
                                max="20"
                                value={settings.maxDelay}
                                onChange={(e) => setSettings({ ...settings, maxDelay: Number(e.target.value) })}
                                className="w-full accent-primary"
                            />
                        </div>
                        <p className="text-xs text-muted-foreground">
                            Random delays between {settings.minDelay}s and {settings.maxDelay}s make automation appear human-like.
                        </p>
                    </div>
                </motion.div>

                {/* Content Filtering */}
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.4 }}
                    className="glass-card rounded-xl p-6"
                >
                    <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                        <Eye className="w-5 h-5 text-purple-400" />
                        Content Filtering
                    </h2>

                    <div className="space-y-3">
                        {[
                            { key: 'contentFiltering', label: 'Enable Content Filtering', desc: 'Skip inappropriate content' },
                            { key: 'skipControversial', label: 'Skip Controversial Topics', desc: 'Avoid divisive content' },
                            { key: 'skipSensitive', label: 'Skip Sensitive Topics', desc: 'Skip personal subjects' },
                        ].map(({ key, label, desc }) => (
                            <div key={key} className="flex items-center justify-between p-3 bg-accent/30 rounded-lg">
                                <div>
                                    <p className="font-medium text-sm">{label}</p>
                                    <p className="text-xs text-muted-foreground">{desc}</p>
                                </div>
                                <label className="relative inline-flex items-center cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={settings[key as keyof SafetySettings] as boolean}
                                        onChange={(e) => setSettings({ ...settings, [key]: e.target.checked })}
                                        className="sr-only peer"
                                    />
                                    <div className="w-10 h-5 bg-gray-600 rounded-full peer peer-checked:after:translate-x-5 after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-primary"></div>
                                </label>
                            </div>
                        ))}
                    </div>
                </motion.div>

                {/* Blocked Keywords */}
                <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.5 }}
                    className="glass-card rounded-xl p-6"
                >
                    <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                        <Ban className="w-5 h-5 text-red-400" />
                        Blocked Keywords
                    </h2>

                    <div className="flex gap-2 mb-4">
                        <input
                            type="text"
                            value={newKeyword}
                            onChange={(e) => setNewKeyword(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && addKeyword()}
                            placeholder="Add keyword..."
                            className="flex-1 px-3 py-2 bg-accent border border-border rounded-lg text-sm"
                        />
                        <button onClick={addKeyword} className="px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm">
                            Add
                        </button>
                    </div>

                    <div className="flex flex-wrap gap-2">
                        {settings.blockedKeywords.map((keyword) => (
                            <span
                                key={keyword}
                                className="inline-flex items-center gap-1 px-3 py-1 bg-red-500/20 text-red-400 rounded-full text-sm"
                            >
                                {keyword}
                                <button
                                    onClick={() => setSettings({ ...settings, blockedKeywords: settings.blockedKeywords.filter(k => k !== keyword) })}
                                    className="w-4 h-4 flex items-center justify-center hover:bg-red-500/30 rounded-full"
                                >
                                    ×
                                </button>
                            </span>
                        ))}
                    </div>
                </motion.div>
            </div>
        </div>
    );
}
