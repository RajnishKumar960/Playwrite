'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
    Shield, Settings, Terminal, Database,
    Activity, Clock, HardDrive, RefreshCw,
    Play, Pause, Square
} from 'lucide-react';
import { useAgentStore } from '@/lib/store';

export default function AdminPage() {
    const { agentStatus, logs, startAgent, stopAgent, stopAllAgents, syncLogs } = useAgentStore();
    const [stats, setStats] = useState({ uptime: '2h 45m', dbSize: '4.2 MB', totalLeads: 156, engagements: 423 });
    const [agentConfigs, setAgentConfigs] = useState({
        feedWarmer: { maxPosts: 50, duration: 15, enabled: true },
        leadCampaign: { maxLeads: 20, duration: 15, enabled: true },
        connectionChecker: { limit: 30, duration: 15, enabled: true }
    });

    useEffect(() => {
        syncLogs();
        const interval = setInterval(syncLogs, 5000);
        return () => clearInterval(interval);
    }, []);

    const getLogColor = (type: string) => {
        const colors: Record<string, string> = {
            error: 'text-red-400', warning: 'text-yellow-400',
            success: 'text-green-400', info: 'text-blue-400'
        };
        return colors[type] || 'text-gray-400';
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold flex items-center gap-3">
                        <div className="p-2 rounded-xl bg-gradient-to-br from-orange-500/20 to-red-500/20">
                            <Shield className="w-6 h-6 text-orange-400" />
                        </div>
                        Admin Dashboard
                    </h1>
                    <p className="text-muted-foreground mt-1">System configuration and monitoring</p>
                </div>
            </div>

            {/* System Stats */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                    { label: 'Uptime', value: stats.uptime, icon: Clock, color: 'from-blue-500 to-cyan-500' },
                    { label: 'Database', value: stats.dbSize, icon: Database, color: 'from-purple-500 to-pink-500' },
                    { label: 'Total Leads', value: stats.totalLeads, icon: Activity, color: 'from-green-500 to-emerald-500' },
                    { label: 'Engagements', value: stats.engagements, icon: HardDrive, color: 'from-orange-500 to-red-500' },
                ].map((stat, idx) => (
                    <motion.div
                        key={stat.label}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.1 }}
                        className="glass-card rounded-xl p-4"
                    >
                        <div className="flex items-center gap-3">
                            <div className={`p-2 rounded-lg bg-gradient-to-br ${stat.color}`}>
                                <stat.icon className="w-4 h-4 text-white" />
                            </div>
                            <div>
                                <p className="text-xl font-bold">{stat.value}</p>
                                <p className="text-sm text-muted-foreground">{stat.label}</p>
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Agent Configuration */}
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.4 }}
                    className="glass-card rounded-xl p-6"
                >
                    <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                        <Settings className="w-5 h-5 text-primary" />
                        Agent Configuration
                    </h2>

                    <div className="space-y-4">
                        {Object.entries(agentConfigs).map(([agent, config]) => (
                            <div key={agent} className="p-4 bg-accent/30 rounded-lg">
                                <div className="flex items-center justify-between mb-3">
                                    <span className="font-medium capitalize">{agent.replace(/([A-Z])/g, ' $1')}</span>
                                    <div className="flex items-center gap-2">
                                        <div className={`w-2 h-2 rounded-full ${agentStatus[agent] === 'running' ? 'bg-green-500' :
                                                agentStatus[agent] === 'paused' ? 'bg-yellow-500' : 'bg-gray-500'
                                            }`} />
                                        <label className="relative inline-flex items-center cursor-pointer">
                                            <input
                                                type="checkbox"
                                                checked={config.enabled}
                                                onChange={(e) => setAgentConfigs({
                                                    ...agentConfigs,
                                                    [agent]: { ...config, enabled: e.target.checked }
                                                })}
                                                className="sr-only peer"
                                            />
                                            <div className="w-10 h-5 bg-gray-600 rounded-full peer peer-checked:after:translate-x-5 after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-primary"></div>
                                        </label>
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-2 text-sm text-muted-foreground">
                                    {'maxPosts' in config && <span>Max Posts: {config.maxPosts}</span>}
                                    {'maxLeads' in config && <span>Max Leads: {config.maxLeads}</span>}
                                    {'limit' in config && <span>Limit: {config.limit}</span>}
                                    <span>Duration: {config.duration} min</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </motion.div>

                {/* System Logs */}
                <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.5 }}
                    className="glass-card rounded-xl p-6"
                >
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-lg font-semibold flex items-center gap-2">
                            <Terminal className="w-5 h-5 text-blue-400" />
                            System Logs
                        </h2>
                        <button onClick={syncLogs} className="p-2 hover:bg-accent rounded-lg">
                            <RefreshCw className="w-4 h-4" />
                        </button>
                    </div>

                    <div className="terminal-log h-72 scrollbar-thin">
                        {logs.slice(0, 25).map((log, i) => (
                            <div key={log.id} className="mb-1 text-xs">
                                <span className="text-muted-foreground/60">[{log.timestamp}]</span>{' '}
                                <span className={getLogColor(log.type)}>[{log.agent}]</span>{' '}
                                <span>{log.message}</span>
                            </div>
                        ))}
                        {logs.length === 0 && <p className="text-muted-foreground">No logs available</p>}
                    </div>
                </motion.div>
            </div>

            {/* Quick Actions */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="glass-card rounded-xl p-6"
            >
                <h2 className="text-lg font-semibold mb-4">Quick Actions</h2>
                <div className="flex flex-wrap gap-3">
                    <button
                        onClick={() => startAgent('feedWarmer')}
                        className="flex items-center gap-2 px-4 py-2.5 bg-green-500/10 text-green-400 border border-green-500/30 rounded-xl hover:bg-green-500/20 transition-colors"
                    >
                        <Play className="w-4 h-4" /> Start All Agents
                    </button>
                    <button
                        onClick={stopAllAgents}
                        className="flex items-center gap-2 px-4 py-2.5 bg-red-500/10 text-red-400 border border-red-500/30 rounded-xl hover:bg-red-500/20 transition-colors"
                    >
                        <Square className="w-4 h-4" /> Emergency Stop
                    </button>
                    <button className="flex items-center gap-2 px-4 py-2.5 bg-blue-500/10 text-blue-400 border border-blue-500/30 rounded-xl hover:bg-blue-500/20 transition-colors">
                        <Database className="w-4 h-4" /> Clear Logs
                    </button>
                </div>
            </motion.div>
        </div>
    );
}
