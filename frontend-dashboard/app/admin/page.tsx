"use client"

import React from 'react'
import { motion } from 'framer-motion'
import { Users, ShieldCheck, Activity, UserPlus, Trash2 } from 'lucide-react'

// Mock data - placeholder for admin panel
const MOCK_USERS = [
    { id: 1, name: 'John Smith', email: 'john@example.com', role: 'admin', status: 'active', lastActive: '2 hours ago' },
    { id: 2, name: 'Sarah Connor', email: 'sarah@example.com', role: 'user', status: 'active', lastActive: '5 hours ago' },
    { id: 3, name: 'Michael Chen', email: 'michael@example.com', role: 'user', status: 'active', lastActive: '1 day ago' },
    { id: 4, name: 'Emily Davis', email: 'emily@example.com', role: 'user', status: 'inactive', lastActive: '1 week ago' },
]

export default function AdminPage() {
    return (
        <div className="min-h-screen p-6 space-y-6 pb-20">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-4xl font-black bg-clip-text text-transparent bg-gradient-to-r from-red-500 to-orange-500">
                        ADMIN PANEL
                    </h1>
                    <p className="text-gray-400 mt-2">Manage users and system permissions</p>
                </div>
                <button className="px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg text-sm text-white font-semibold shadow-lg shadow-red-600/20 transition-all hover:scale-105 flex items-center gap-2">
                    <UserPlus size={16} />
                    Add User
                </button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="glass-card p-6 rounded-xl border border-white/5"
                >
                    <div className="flex items-center gap-3 mb-2">
                        <div className="p-2 bg-blue-600/20 rounded-lg">
                            <Users className="text-blue-400" size={20} />
                        </div>
                        <span className="text-2xl font-bold text-gray-100">{MOCK_USERS.length}</span>
                    </div>
                    <p className="text-sm text-gray-400">Total Users</p>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="glass-card p-6 rounded-xl border border-white/5"
                >
                    <div className="flex items-center gap-3 mb-2">
                        <div className="p-2 bg-green-600/20 rounded-lg">
                            <Activity className="text-green-400" size={20} />
                        </div>
                        <span className="text-2xl font-bold text-gray-100">
                            {MOCK_USERS.filter(u => u.status === 'active').length}
                        </span>
                    </div>
                    <p className="text-sm text-gray-400">Active Users</p>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="glass-card p-6 rounded-xl border border-white/5"
                >
                    <div className="flex items-center gap-3 mb-2">
                        <div className="p-2 bg-red-600/20 rounded-lg">
                            <ShieldCheck className="text-red-400" size={20} />
                        </div>
                        <span className="text-2xl font-bold text-gray-100">
                            {MOCK_USERS.filter(u => u.role === 'admin').length}
                        </span>
                    </div>
                    <p className="text-sm text-gray-400">Administrators</p>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="glass-card p-6 rounded-xl border border-white/5"
                >
                    <div className="flex items-center gap-3 mb-2">
                        <div className="p-2 bg-gray-600/20 rounded-lg">
                            <Users className="text-gray-400" size={20} />
                        </div>
                        <span className="text-2xl font-bold text-gray-100">
                            {MOCK_USERS.filter(u => u.status === 'inactive').length}
                        </span>
                    </div>
                    <p className="text-sm text-gray-400">Inactive Users</p>
                </motion.div>
            </div>

            {/* Users Table */}
            <div className="glass-card rounded-xl border border-white/5 overflow-hidden">
                <div className="p-4 border-b border-white/5">
                    <h3 className="text-lg font-bold text-gray-100">User Management</h3>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-white/5 border-b border-white/5">
                            <tr>
                                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">User</th>
                                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">Email</th>
                                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">Role</th>
                                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">Status</th>
                                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">Last Active</th>
                                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {MOCK_USERS.map((user, index) => (
                                <motion.tr
                                    key={user.id}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.05 }}
                                    className="hover:bg-white/5 transition-colors"
                                >
                                    <td className="px-4 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-red-500 to-orange-600 flex items-center justify-center text-white font-bold text-sm">
                                                {user.name.split(' ').map(n => n[0]).join('')}
                                            </div>
                                            <span className="text-sm font-medium text-gray-200">{user.name}</span>
                                        </div>
                                    </td>
                                    <td className="px-4 py-4">
                                        <span className="text-sm text-gray-400">{user.email}</span>
                                    </td>
                                    <td className="px-4 py-4">
                                        <span className={`px-2 py-1 text-xs rounded border ${user.role === 'admin'
                                                ? 'bg-red-500/10 text-red-400 border-red-500/20'
                                                : 'bg-blue-500/10 text-blue-400 border-blue-500/20'
                                            }`}>
                                            {user.role}
                                        </span>
                                    </td>
                                    <td className="px-4 py-4">
                                        <span className={`px-2 py-1 text-xs rounded border ${user.status === 'active'
                                                ? 'bg-green-500/10 text-green-400 border-green-500/20'
                                                : 'bg-gray-500/10 text-gray-400 border-gray-500/20'
                                            }`}>
                                            {user.status}
                                        </span>
                                    </td>
                                    <td className="px-4 py-4">
                                        <span className="text-sm text-gray-500">{user.lastActive}</span>
                                    </td>
                                    <td className="px-4 py-4">
                                        <div className="flex items-center gap-2">
                                            <button className="p-1 hover:bg-white/10 rounded transition-colors">
                                                <Trash2 className="text-red-400" size={16} />
                                            </button>
                                        </div>
                                    </td>
                                </motion.tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )
}
