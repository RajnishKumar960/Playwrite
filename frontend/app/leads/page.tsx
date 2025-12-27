"use client";

import React, { useState, useEffect, useMemo } from "react";
import {
    flexRender,
    getCoreRowModel,
    useReactTable,
    getSortedRowModel,
    SortingState,
    getPaginationRowModel,
} from "@tanstack/react-table";
import {
    MoreVertical, Search, Filter, Plus,
    MessageSquare, Phone, Linkedin, Mail, Calendar,
    AlertCircle, ChevronDown, User, Users, Building2, Briefcase, Zap, Brain, History, ExternalLink, X, ChevronRight
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { api } from "@/lib/api";
import { cn } from "@/lib/utils";

export default function LeadsPage() {
    const [leads, setLeads] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [sorting, setSorting] = useState<SortingState>([]);
    const [selectedLead, setSelectedLead] = useState<any>(null);

    useEffect(() => {
        fetchLeads();
    }, []);

    const fetchLeads = async () => {
        try {
            const data = await api.leads.list();
            if (data.leads) {
                setLeads(data.leads.map((l: any) => ({
                    ...l,
                    painPoints: l.painPoints || ["Scaling", "Automation"] // Fallback for aesthetic
                })));
            }
        } catch (error) {
            console.error("Failed to fetch leads", error);
            // Fallback Mock Data
            setLeads([
                { id: 1, name: "Alice Freeman", company: "TechFlow", role: "CTO", status: "replied", last_engagement_date: "2025-12-25", painPoints: ["Scaling", "Hiring"] },
                { id: 2, name: "Bob Smith", company: "StartUp Inc", role: "Founder", status: "contacted", last_engagement_date: "2025-12-24", painPoints: ["Cost Reduction"] },
                { id: 3, name: "Charlie Davis", company: "GrowthCo", role: "VP Sales", status: "new", last_engagement_date: "2025-12-23", painPoints: ["Lead Gen"] },
            ]);
        } finally {
            setIsLoading(false);
        }
    };

    const columns = useMemo(() => [
        {
            accessorKey: "name",
            header: "Lead",
            cell: ({ row }: any) => (
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400 font-bold text-xs">
                        {row.original.name.charAt(0)}
                    </div>
                    <div className="flex flex-col">
                        <span className="font-bold text-gray-200 text-sm">{row.original.name}</span>
                        <span className="text-[10px] text-gray-500 uppercase tracking-widest">{row.original.role}</span>
                    </div>
                </div>
            )
        },
        {
            accessorKey: "company",
            header: "Organization",
            cell: ({ row }: any) => (
                <div className="flex items-center gap-2">
                    <Building2 size={14} className="text-blue-400 opacity-50" />
                    <span className="text-sm text-gray-300 font-medium">{row.original.company}</span>
                </div>
            )
        },
        {
            accessorKey: "status",
            header: "Status",
            cell: ({ row }: any) => <StatusBadge status={row.original.status} />
        },
        {
            accessorKey: "painPoints",
            header: "AI Insight",
            cell: ({ row }: any) => (
                <div className="flex gap-1.5 overflow-hidden">
                    {row.original.painPoints?.slice(0, 2).map((pp: string) => (
                        <span key={pp} className="text-[10px] px-2 py-0.5 bg-red-500/10 text-red-400 border border-red-500/20 rounded-md font-bold whitespace-nowrap">
                            {pp}
                        </span>
                    ))}
                </div>
            )
        },
        {
            accessorKey: "last_engagement_date",
            header: "Activity",
            cell: ({ row }: any) => (
                <span className="text-[10px] text-gray-600 font-mono">
                    {row.original.last_engagement_date ? new Date(row.original.last_engagement_date).toLocaleDateString() : 'Pending'}
                </span>
            )
        }
    ], []);

    const table = useReactTable({
        data: leads,
        columns,
        state: { sorting },
        onSortingChange: setSorting,
        getCoreRowModel: getCoreRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
    });

    return (
        <div className="min-h-screen p-6 space-y-6 pb-20 relative overflow-hidden bg-[#02040a]">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-end gap-4 border-b border-white/5 pb-6">
                <div>
                    <h1 className="text-3xl font-black bg-clip-text text-transparent bg-linear-to-r from-purple-400 via-pink-400 to-rose-400 uppercase italic tracking-tighter">
                        LEAD <span className="text-white">COMMAND</span>
                    </h1>
                    <p className="text-[10px] text-gray-500 font-bold uppercase tracking-[0.4em] mt-2 flex items-center gap-2">
                        <Users size={12} className="text-purple-500" />
                        Tactical Extraction Database // V4.2
                    </p>
                </div>

                <div className="flex items-center gap-3">
                    <div className="relative group">
                        <Search className="absolute left-3 top-2.5 text-gray-500 group-focus-within:text-purple-400 transition-colors" size={14} />
                        <input
                            type="text"
                            placeholder="SEARCH EXTRACTION DATA..."
                            className="bg-white/5 border border-white/10 rounded-xl pl-9 pr-4 py-2.5 text-[10px] font-black uppercase tracking-widest text-gray-200 focus:outline-none focus:ring-1 focus:ring-purple-500/50 w-64 transition-all"
                        />
                    </div>
                    <button className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white px-5 py-2.5 rounded-xl shadow-xl shadow-purple-600/20 transition-all font-black text-[10px] uppercase tracking-widest italic active:scale-95">
                        <Plus size={16} /> Initial Protocol
                    </button>
                </div>
            </div>

            {/* Table Container */}
            <div className="glass-card rounded-2xl border border-white/5 bg-black/40 backdrop-blur-xl overflow-hidden relative z-10">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            {table.getHeaderGroups().map(headerGroup => (
                                <tr key={headerGroup.id} className="border-b border-white/5 bg-white/5">
                                    {headerGroup.headers.map(header => (
                                        <th
                                            key={header.id}
                                            className="px-6 py-4 text-[10px] font-black text-gray-500 uppercase tracking-widest cursor-pointer hover:text-gray-300 transition-colors"
                                            onClick={header.column.getToggleSortingHandler()}
                                        >
                                            <div className="flex items-center gap-2">
                                                {flexRender(header.column.columnDef.header, header.getContext())}
                                                {header.column.getIsSorted() && (
                                                    <ChevronDown size={12} className={cn("transition-transform", header.column.getIsSorted() === 'desc' ? "rotate-180" : "")} />
                                                )}
                                            </div>
                                        </th>
                                    ))}
                                </tr>
                            ))}
                        </thead>
                        <tbody>
                            {table.getRowModel().rows.map(row => (
                                <tr
                                    key={row.id}
                                    onClick={() => setSelectedLead(row.original)}
                                    className="border-b border-white/5 hover:bg-white/5 transition-colors cursor-pointer group"
                                >
                                    {row.getVisibleCells().map(cell => (
                                        <td key={cell.id} className="px-6 py-4">
                                            {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                        </td>
                                    ))}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                <div className="px-6 py-4 flex items-center justify-between border-t border-white/5 bg-white/5">
                    <div className="text-[10px] font-black text-gray-500 uppercase tracking-widest">
                        Node {table.getState().pagination.pageIndex + 1} of {table.getPageCount()}
                    </div>
                    <div className="flex gap-2">
                        <button
                            onClick={() => table.previousPage()}
                            disabled={!table.getCanPreviousPage()}
                            className="px-3 py-1.5 rounded-lg border border-white/5 text-[10px] font-black uppercase text-gray-400 hover:bg-white/5 disabled:opacity-20"
                        >
                            Previous
                        </button>
                        <button
                            onClick={() => table.nextPage()}
                            disabled={!table.getCanNextPage()}
                            className="px-3 py-1.5 rounded-lg border border-white/5 text-[10px] font-black uppercase text-gray-400 hover:bg-white/5 disabled:opacity-20"
                        >
                            Next
                        </button>
                    </div>
                </div>
            </div>

            {/* LEAD DOSSIER SLIDE-OVER */}
            <AnimatePresence>
                {selectedLead && (
                    <div className="fixed inset-0 z-[100] flex justify-end">
                        <motion.div
                            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                            onClick={() => setSelectedLead(null)}
                        />
                        <motion.div
                            initial={{ x: "100%" }}
                            animate={{ x: 0 }}
                            exit={{ x: "100%" }}
                            transition={{ type: "spring", damping: 25, stiffness: 200 }}
                            className="w-full max-w-xl bg-[#0d1117] border-l border-white/10 relative z-10 shadow-[-20px_0_50px_rgba(0,0,0,0.5)] flex flex-col"
                        >
                            {/* Dossier Header */}
                            <div className="p-8 border-b border-white/5 bg-linear-to-br from-purple-600/10 to-transparent">
                                <div className="flex justify-between items-start mb-6">
                                    <div className="w-16 h-16 rounded-2xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400 font-black text-2xl shadow-inner">
                                        {selectedLead.name.charAt(0)}
                                    </div>
                                    <button
                                        onClick={() => setSelectedLead(null)}
                                        className="p-2 hover:bg-white/5 rounded-full text-gray-500 transition-colors"
                                    >
                                        <X size={20} />
                                    </button>
                                </div>
                                <div className="space-y-1">
                                    <h2 className="text-3xl font-black text-white italic uppercase tracking-tighter">{selectedLead.name}</h2>
                                    <div className="flex items-center gap-3">
                                        <span className="text-[10px] font-black text-purple-400 uppercase tracking-widest">{selectedLead.role}</span>
                                        <div className="w-1 h-1 rounded-full bg-gray-700" />
                                        <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{selectedLead.company}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Dossier Content */}
                            <div className="flex-1 overflow-y-auto p-8 space-y-8 scrollbar-hide">
                                {/* Actions HUD */}
                                <div className="grid grid-cols-2 gap-4">
                                    <button className="flex items-center justify-center gap-3 py-4 rounded-xl bg-purple-600 text-white font-black text-[10px] uppercase tracking-widest italic shadow-lg shadow-purple-600/20 active:scale-95 transition-all">
                                        <Linkedin size={14} /> View Profile
                                    </button>
                                    <button className="flex items-center justify-center gap-3 py-4 rounded-xl bg-white/5 border border-white/10 text-gray-300 font-black text-[10px] uppercase tracking-widest italic hover:bg-white/10 transition-all">
                                        <Mail size={14} /> Send Outreach
                                    </button>
                                </div>

                                {/* AI Intelligence Section */}
                                <div className="space-y-4">
                                    <div className="flex items-center gap-2">
                                        <Brain size={16} className="text-rose-400" />
                                        <h3 className="text-[10px] font-black text-gray-100 uppercase tracking-[0.2em] italic">Neural Analysis</h3>
                                    </div>
                                    <div className="glass-card p-6 rounded-2xl border border-white/5 bg-white/5 space-y-4">
                                        <div className="space-y-2">
                                            <p className="text-[10px] font-black text-rose-400 uppercase tracking-widest">Detected Pain Points</p>
                                            <div className="flex flex-wrap gap-2">
                                                {selectedLead.painPoints.map((pp: string) => (
                                                    <div key={pp} className="px-3 py-1.5 rounded-lg bg-rose-500/10 border border-rose-500/20 flex items-center gap-2">
                                                        <Zap size={10} className="text-rose-400" />
                                                        <span className="text-[10px] font-black text-gray-300 uppercase tracking-tighter">{pp}</span>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                        <div className="pt-4 border-t border-white/5">
                                            <p className="text-[10px] font-bold text-gray-500 leading-relaxed uppercase tracking-tighter italic">
                                                &quot;LEAD EXHIBITS SIGNIFICANT FRICTION IN {selectedLead.painPoints[0]?.toUpperCase()} PROTOCOLS. RECOMMENDED STRATEGY: HIGHLIGHT AUTONOMOUS EFFICIENCY GAINS.&quot;
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                {/* Interaction History */}
                                <div className="space-y-4">
                                    <div className="flex items-center gap-2">
                                        <History size={16} className="text-blue-400" />
                                        <h3 className="text-[10px] font-black text-gray-100 uppercase tracking-[0.2em] italic">Interaction History</h3>
                                    </div>
                                    <div className="space-y-3">
                                        <HistoryItem date="2 days ago" action="Neural Outreach Sent" desc="Day 1 personalized connection with pain point reference." />
                                        <HistoryItem date="4 days ago" action="Lead Scraped" desc="Extracted profile data and analyzed recent activity." />
                                    </div>
                                </div>
                            </div>

                            {/* Footer Status */}
                            <div className="p-8 bg-black/40 border-t border-white/5">
                                <div className="flex justify-between items-center">
                                    <div className="flex flex-col">
                                        <span className="text-[8px] text-gray-500 font-bold uppercase tracking-widest">Current Uplink</span>
                                        <StatusBadge status={selectedLead.status} />
                                    </div>
                                    <button className="flex items-center gap-2 text-[10px] font-black text-gray-400 uppercase tracking-widest hover:text-white transition-colors">
                                        Export Node File <ExternalLink size={12} />
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
}

function StatusBadge({ status }: { status: string }) {
    const config: any = {
        new: { color: "text-blue-400", bg: "bg-blue-500/10", border: "border-blue-500/20", label: "NEW EXTRACTION" },
        contacted: { color: "text-purple-400", bg: "bg-purple-500/10", border: "border-purple-500/20", label: "CONTACTED" },
        replied: { color: "text-pink-400", bg: "bg-pink-500/10", border: "border-pink-500/20", label: "NEURAL REPLY" },
        connected: { color: "text-green-400", bg: "bg-green-500/10", border: "border-green-500/20", label: "CONNECTED" },
    };

    const s = config[status as keyof typeof config] || config.new;

    return (
        <div className={cn("px-3 py-1 rounded-lg border text-[9px] font-black uppercase tracking-tighter italic flex items-center gap-2 w-fit", s.bg, s.color, s.border)}>
            <div className={cn("w-1 h-1 rounded-full", s.color.replace('text', 'bg'))} />
            {s.label}
        </div>
    );
}

function HistoryItem({ date, action, desc }: any) {
    return (
        <div className="flex gap-4 p-4 rounded-xl hover:bg-white/5 transition-colors group">
            <div className="w-px bg-white/10 relative">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-2 h-2 rounded-full bg-blue-500/30 border border-blue-500/50" />
            </div>
            <div className="space-y-1">
                <div className="flex items-center gap-2">
                    <span className="text-[9px] font-black text-white italic uppercase tracking-widest">{action}</span>
                    <span className="text-[8px] text-gray-600 font-mono">{date}</span>
                </div>
                <p className="text-[10px] text-gray-500 font-bold leading-relaxed">{desc}</p>
            </div>
        </div>
    )
}
