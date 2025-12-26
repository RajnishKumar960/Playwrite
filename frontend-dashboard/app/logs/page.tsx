"use client"

import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Search, Download, Filter, MessageSquare, ThumbsUp, UserPlus, Calendar } from 'lucide-react'

// Mock data - replace with React Query later
const MOCK_LOGS = [
    { id: 1, type: 'comment', target: 'Sarah Connor', content: 'Great insights on AI automation!', date: '2025-12-26 10:30', status: 'success' },
    { id: 2, type: 'like', target: 'John Doe', content: 'Post about LinkedIn growth strategies', date: '2025-12-26 10:15', status: 'success' },
    { id: 3, type: 'connection', target: 'Michael Smith', content: 'Connection request sent', date: '2025-12-26 09:45', status: 'pending' },
    { id: 4, type: 'comment', target: 'TechCrunch', content: 'Interesting perspective on automation trends', date: '2025-12-26 09:20', status: 'success' },
    { id: 5, type: 'like', target: 'Emily Davis', content: 'Product launch announcement', date: '2025-12-26 08:55', status: 'success' },
    { id: 6, type: 'connection', target: 'Robert Wilson', content: 'Connection request sent', date: '2025-12-26 08:30', status: 'accepted' },
    { id: 7, type: 'comment', target: 'Jane Wilson', content: 'Appreciate your thoughts on remote work!', date: '2025-12-25 18:10', status: 'success' },
    { id: 8, type: 'like', target: 'Alex Johnson', content: 'Article on SaaS metrics', date: '2025-12-25 17:45', status: 'success' },
]

export default function LogsPage() {
    const [searchQuery, setSearchQuery] = useState('')
    const [filterType, setFilterType] = useState<'all' | 'comment' | 'like' | 'connection'>('all')

    const filteredLogs = MOCK_LOGS.filter(log => {
        const matchesSearch = log.target.toLowerCase().includes(searchQuery.toLowerCase()) ||
            log.content.toLowerCase().includes(searchQuery.toLowerCase())
        const matchesType = filterType === 'all' || log.type === filterType
        return matchesSearch && matchesType
    })

    const getIcon = (type: string) => {
        switch (type) {
            case 'comment': return <MessageSquare className="text-blue-400" size={18} />
            case 'like': return <ThumbsUp className="text-red-400" size={18} />
            case 'connection': return <UserPlus className="text-green-400" size={18} />
            default: return null
        }
    }

    const getStatusBadge = (status: string) => {
        const styles = {
            success: 'bg-green-500/10 text-green-400 border-green-500/20',
            pending: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20',
            accepted: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
            failed: 'bg-red-500/10 text-red-400 border-red-500/20',
        }
        return (
            <span className={`px-2 py-0.5 text-xs rounded border ${styles[status as keyof typeof styles] || styles.success}`}>
                {status}
            </span>
        )
    }

    return (
        <div className="min-h-screen p-6 space-y-6 pb-20">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-4xl font-black bg-clip-text text-transparent bg-gradient-to-r from-red-500 to-orange-500">
                        INTERACTION LOGS
                    </h1>
                    <p className="text-gray-400 mt-2">Track all automated LinkedIn activities</p>
                </div>
                <button className="px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg text-sm text-white font-semibold shadow-lg shadow-red-600/20 transition-all hover:scale-105 flex items-center gap-2">
                    <Download size={16} />
                    Export CSV
                </button>
            </div>

            {/* Filters */}
            <div className="glass-card p-4 rounded-xl border border-white/5">
                <div className="flex flex-col md:flex-row gap-4">
                    {/* Search */}
                    <div className="flex-1 relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                        <input
                            type="text"
                            placeholder="Search by name or content..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 bg-black/30 border border-white/10 rounded-lg text-sm text-gray-300 placeholder-gray-500 focus:outline-none focus:border-red-500/50"
                        />
                    </div>

                    {/* Type Filter */}
                    <div className="flex gap-2">
                        {(['all', 'comment', 'like', 'connection'] as const).map((type) => (
                            <button
                                key={type}
                                onClick={() => setFilterType(type)}
                                className={`px-4 py-2 text-xs font-medium rounded-lg transition-all ${filterType === type
                                        ? 'bg-red-600 text-white'
                                        : 'bg-white/5 text-gray-400 hover:bg-white/10'
                                    }`}
                            >
                                {type.charAt(0).toUpperCase() + type.slice(1)}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Results Count */}
            <div className="flex items-center gap-2 text-sm text-gray-400">
                <Filter size={16} />
                Showing {filteredLogs.length} of {MOCK_LOGS.length} interactions
            </div>

            {/* Logs Table */}
            <div className="glass-card rounded-xl border border-white/5 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-white/5 border-b border-white/5">
                            <tr>
                                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">Type</th>
                                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">Target</th>
                                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">Content</th>
                                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">Date</th>
                                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {filteredLogs.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="px-4 py-12 text-center text-gray-500">
                                        No interactions found. Try adjusting your filters.
                                    </td>
                                </tr>
                            ) : (
                                filteredLogs.map((log, index) => (
                                    <motion.tr
                                        key={log.id}
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: index * 0.05 }}
                                        className="hover:bg-white/5 transition-colors"
                                    >
                                        <td className="px-4 py-4">
                                            <div className="flex items-center gap-2">
                                                {getIcon(log.type)}
                                                <span className="text-sm text-gray-300 capitalize">{log.type}</span>
                                            </div>
                                        </td>
                                        <td className="px-4 py-4">
                                            <span className="text-sm font-medium text-gray-200">{log.target}</span>
                                        </td>
                                        <td className="px-4 py-4">
                                            <span className="text-sm text-gray-400 line-clamp-1">{log.content}</span>
                                        </td>
                                        <td className="px-4 py-4">
                                            <div className="flex items-center gap-1 text-sm text-gray-500">
                                                <Calendar size={14} />
                                                {log.date}
                                            </div>
                                        </td>
                                        <td className="px-4 py-4">
                                            {getStatusBadge(log.status)}
                                        </td>
                                    </motion.tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Pagination (placeholder) */}
            <div className="flex justify-center gap-2">
                {[1, 2, 3].map((page) => (
                    <button
                        key={page}
                        className={`px-3 py-1 text-sm rounded ${page === 1
                                ? 'bg-red-600 text-white'
                                : 'bg-white/5 text-gray-400 hover:bg-white/10'
                            }`}
                    >
                        {page}
                    </button>
                ))}
            </div>
        </div>
    )
}
