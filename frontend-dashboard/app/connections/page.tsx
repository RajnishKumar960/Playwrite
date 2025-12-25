'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
    UserPlus, Clock, CheckCircle2, XCircle, TrendingUp,
    Users, Send, RefreshCw, ArrowRight
} from 'lucide-react';

interface Connection {
    id: number;
    name: string;
    company: string;
    status: 'pending' | 'accepted' | 'declined';
    sentAt: string;
    acceptedAt?: string;
}

export default function ConnectionsPage() {
    const [stats, setStats] = useState({ sent: 156, pending: 42, accepted: 98, rate: 62.8 });
    const [connections, setConnections] = useState<Connection[]>([]);
    const [filter, setFilter] = useState<'all' | 'pending' | 'accepted'>('all');

    useEffect(() => {
        fetchConnections();
    }, []);

    const fetchConnections = async () => {
        try {
            const res = await fetch('/api/connections');
            if (res.ok) {
                const data = await res.json();
                setStats(data.stats || stats);
                setConnections(data.connections || []);
            }
        } catch {
            setConnections([
                { id: 1, name: 'Sarah Johnson', company: 'TechCorp', status: 'accepted', sentAt: '2024-12-20', acceptedAt: '2024-12-22' },
                { id: 2, name: 'Michael Chen', company: 'StartupXYZ', status: 'pending', sentAt: '2024-12-24' },
                { id: 3, name: 'Emily Davis', company: 'Enterprise Inc', status: 'accepted', sentAt: '2024-12-19', acceptedAt: '2024-12-21' },
                { id: 4, name: 'James Wilson', company: 'InnovateLab', status: 'pending', sentAt: '2024-12-25' },
                { id: 5, name: 'Lisa Anderson', company: 'GrowthCo', status: 'declined', sentAt: '2024-12-18' },
            ]);
        }
    };

    const filtered = connections.filter(c => filter === 'all' || c.status === filter);

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold flex items-center gap-3">
                        <div className="p-2 rounded-xl bg-gradient-to-br from-green-500/20 to-emerald-500/20">
                            <Users className="w-6 h-6 text-green-400" />
                        </div>
                        Connections
                    </h1>
                    <p className="text-muted-foreground mt-1">Track your LinkedIn connection requests</p>
                </div>
                <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={fetchConnections}
                    className="flex items-center gap-2 px-4 py-2 glass-card rounded-xl"
                >
                    <RefreshCw className="w-4 h-4" />
                    Refresh
                </motion.button>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                    { label: 'Total Sent', value: stats.sent, icon: Send, color: 'from-blue-500 to-cyan-500' },
                    { label: 'Pending', value: stats.pending, icon: Clock, color: 'from-yellow-500 to-orange-500' },
                    { label: 'Accepted', value: stats.accepted, icon: CheckCircle2, color: 'from-green-500 to-emerald-500' },
                    { label: 'Accept Rate', value: `${stats.rate}%`, icon: TrendingUp, color: 'from-purple-500 to-pink-500' },
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
                                <p className="text-2xl font-bold">{stat.value}</p>
                                <p className="text-sm text-muted-foreground">{stat.label}</p>
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>

            {/* Connection Funnel */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="glass-card rounded-xl p-6"
            >
                <h2 className="text-lg font-semibold mb-6">Connection Funnel</h2>
                <div className="flex items-center justify-center gap-8">
                    <div className="text-center">
                        <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ delay: 0.5, type: 'spring' }}
                            className="w-28 h-28 rounded-full bg-blue-500/20 border-4 border-blue-500/40 flex items-center justify-center mb-2"
                        >
                            <span className="text-3xl font-bold text-blue-400">{stats.sent}</span>
                        </motion.div>
                        <span className="text-sm text-muted-foreground">Sent</span>
                    </div>
                    <ArrowRight className="w-6 h-6 text-muted-foreground" />
                    <div className="text-center">
                        <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ delay: 0.6, type: 'spring' }}
                            className="w-24 h-24 rounded-full bg-yellow-500/20 border-4 border-yellow-500/40 flex items-center justify-center mb-2"
                        >
                            <span className="text-2xl font-bold text-yellow-400">{stats.pending}</span>
                        </motion.div>
                        <span className="text-sm text-muted-foreground">Pending</span>
                    </div>
                    <ArrowRight className="w-6 h-6 text-muted-foreground" />
                    <div className="text-center">
                        <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ delay: 0.7, type: 'spring' }}
                            className="w-20 h-20 rounded-full bg-green-500/20 border-4 border-green-500/40 flex items-center justify-center mb-2"
                        >
                            <span className="text-xl font-bold text-green-400">{stats.accepted}</span>
                        </motion.div>
                        <span className="text-sm text-muted-foreground">Accepted</span>
                    </div>
                </div>
            </motion.div>

            {/* Connections List */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="glass-card rounded-xl p-6"
            >
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-semibold">Recent Connections</h2>
                    <div className="flex gap-2">
                        {(['all', 'pending', 'accepted'] as const).map(f => (
                            <button
                                key={f}
                                onClick={() => setFilter(f)}
                                className={`px-3 py-1.5 rounded-lg text-sm transition-colors ${filter === f
                                        ? 'bg-primary text-primary-foreground'
                                        : 'bg-accent/50 text-muted-foreground hover:text-foreground'
                                    }`}
                            >
                                {f.charAt(0).toUpperCase() + f.slice(1)}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="space-y-3">
                    {filtered.map((conn, i) => (
                        <motion.div
                            key={conn.id}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: i * 0.05 }}
                            className="flex items-center justify-between p-4 bg-accent/30 rounded-lg hover:bg-accent/50 transition-colors"
                        >
                            <div className="flex items-center gap-4">
                                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary/30 to-blue-500/30 flex items-center justify-center font-semibold">
                                    {conn.name.charAt(0)}
                                </div>
                                <div>
                                    <p className="font-medium">{conn.name}</p>
                                    <p className="text-sm text-muted-foreground">{conn.company}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-4">
                                <span className="text-sm text-muted-foreground">{conn.sentAt}</span>
                                <span className={`px-3 py-1 rounded-full text-xs font-medium ${conn.status === 'accepted' ? 'bg-green-500/20 text-green-400' :
                                        conn.status === 'pending' ? 'bg-yellow-500/20 text-yellow-400' :
                                            'bg-red-500/20 text-red-400'
                                    }`}>
                                    {conn.status}
                                </span>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </motion.div>
        </div>
    );
}
