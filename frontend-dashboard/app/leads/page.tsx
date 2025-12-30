"use client";

import { useEffect, useState } from "react";
import {
    Table,
    Search,
    Filter,
    MoreVertical,
    FileText,
    CheckCircle2,
    Clock,
    XCircle,
    BrainCircuit,
    Loader2,
    User
} from "lucide-react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

interface Lead {
    id: number;
    name: string;
    company: string;
    title: string;
    status: string;
    connection_status: string;
    painPoints?: string[]; // or string from DB
    lastEngaged: string;
}

export default function LeadsPage() {
    const [leads, setLeads] = useState<Lead[]>([]);
    const [loading, setLoading] = useState(true);
    const [total, setTotal] = useState(0);

    const fetchLeads = async () => {
        setLoading(true);
        try {
            const res = await fetch('/api/leads?limit=50');
            if (res.ok) {
                const data = await res.json();
                setLeads(data.leads || []);
                setTotal(data.total || 0);
            }
        } catch (err) {
            console.error("Failed to fetch leads", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchLeads();
    }, []);

    return (
        <div className="p-8 max-w-7xl mx-auto">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8"
            >
                <div>
                    <h1 className="text-3xl font-extrabold text-transparent bg-clip-text bg-linear-to-r from-white to-slate-400 tracking-tight">Lead Intelligence</h1>
                    <p className="text-slate-400 mt-2 font-light">Manage and analyze your prospective leads.</p>
                </div>
                <div className="flex gap-2">
                    <button onClick={fetchLeads} className="flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-sm font-medium text-slate-300 hover:bg-white/10 hover:text-white transition-all backdrop-blur-sm">
                        <Filter className="w-4 h-4" /> Refresh
                    </button>
                    <button className="flex items-center gap-2 px-4 py-2 bg-linear-to-r from-rose-500 to-red-600 text-white rounded-xl text-sm font-bold hover:shadow-lg hover:shadow-rose-500/30 transition-all border border-rose-400/20">
                        <FileText className="w-4 h-4" /> Export Report
                    </button>
                </div>
            </motion.div>

            {/* Search Bar */}
            <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="relative mb-6"
            >
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                    type="text"
                    placeholder="Search leads by name, company, or insight..."
                    className="w-full pl-12 pr-4 py-4 rounded-2xl border border-white/10 bg-black/20 text-slate-100 placeholder:text-slate-500 shadow-inner backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-transparent transition-all"
                />
            </motion.div>

            {/* Table */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="glass-card rounded-2xl overflow-hidden min-h-[400px] border border-white/10"
            >
                {loading ? (
                    <div className="flex flex-col items-center justify-center h-64 text-slate-500">
                        <Loader2 className="w-10 h-10 animate-spin mb-4 text-cyan-400" />
                        <p>Loading Leads...</p>
                    </div>
                ) : leads.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-64 text-slate-500">
                        <User className="w-12 h-12 mb-3 opacity-20" />
                        <p>No leads found. Start a campaign to add data.</p>
                    </div>
                ) : (
                    <>
                        <div className="overflow-x-auto">
                            <table className="w-full text-left text-sm">
                                <thead className="bg-white/5 border-b border-white/10">
                                    <tr>
                                        <th className="px-6 py-4 font-semibold text-slate-300">Lead Name</th>
                                        <th className="px-6 py-4 font-semibold text-slate-300">Role & Company</th>
                                        <th className="px-6 py-4 font-semibold text-slate-300">Status</th>
                                        <th className="px-6 py-4 font-semibold text-slate-300">Connection</th>
                                        <th className="px-6 py-4 font-semibold text-slate-300 text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-white/5">
                                    {leads.map((lead, i) => (
                                        <motion.tr
                                            key={lead.id}
                                            initial={{ opacity: 0, x: -10 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: i * 0.05 }}
                                            className="hover:bg-white/5 transition-colors cursor-pointer group"
                                        >
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-8 h-8 rounded-full bg-linear-to-br from-slate-700 to-slate-600 flex items-center justify-center text-xs font-bold text-white border border-white/10">
                                                        {lead.name.charAt(0)}
                                                    </div>
                                                    <span className="font-medium text-slate-200 group-hover:text-white transition-colors">{lead.name}</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-slate-400">
                                                <div className="flex flex-col">
                                                    <span className="text-slate-300">{lead.title || "N/A"}</span>
                                                    <span className="text-xs text-slate-500">{lead.company}</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <StatusBadge status={lead.status || 'new'} />
                                            </td>
                                            <td className="px-6 py-4">
                                                <ConnectionBadge status={lead.connection_status} />
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <button className="p-2 hover:bg-white/10 rounded-full text-slate-500 hover:text-white transition-colors">
                                                    <MoreVertical className="w-4 h-4" />
                                                </button>
                                            </td>
                                        </motion.tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                        <div className="px-6 py-4 border-t border-white/10 bg-white/5 flex items-center justify-between text-xs text-slate-500">
                            <span>Showing {leads.length} of {total} leads</span>
                            <div className="flex gap-2">
                                <button className="px-3 py-1 bg-white/5 border border-white/10 rounded-lg hover:bg-white/10 text-slate-300 disabled:opacity-50 transition-colors">Previous</button>
                                <button className="px-3 py-1 bg-white/5 border border-white/10 rounded-lg hover:bg-white/10 text-slate-300 transition-colors">Next</button>
                            </div>
                        </div>
                    </>
                )}
            </motion.div>
        </div>
    );
}

function StatusBadge({ status }: { status: string }) {
    const styles: Record<string, string> = {
        engaged: "bg-blue-500/20 text-blue-300 border-blue-500/30",
        qualified: "bg-emerald-500/20 text-emerald-300 border-emerald-500/30",
        converted: "bg-purple-500/20 text-purple-300 border-purple-500/30",
        new: "bg-slate-500/20 text-slate-300 border-slate-500/30",
    };

    return (
        <span className={cn(
            "inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold border capitalize shadow-[0_0_10px_rgba(0,0,0,0.1)]",
            styles[status.toLowerCase()] || styles.new
        )}>
            {status}
        </span>
    );
}

function ConnectionBadge({ status }: { status?: string }) {
    if (!status) return <span className="text-slate-600">-</span>;

    const styles: Record<string, string> = {
        accepted: "text-emerald-400 drop-shadow-[0_0_5px_rgba(52,211,153,0.5)]",
        connected: "text-emerald-400 drop-shadow-[0_0_5px_rgba(52,211,153,0.5)]",
        pending: "text-amber-400",
        sent: "text-blue-400",
    };

    return (
        <div className={cn("flex items-center gap-1.5 text-xs font-medium capitalize", styles[status.toLowerCase()] || "text-slate-500")}>
            {status === 'accepted' || status === 'connected' ? <CheckCircle2 className="w-3.5 h-3.5" /> : <Clock className="w-3.5 h-3.5" />}
            {status}
        </div>
    )
}
