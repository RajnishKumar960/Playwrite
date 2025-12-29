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
    Loader2
} from "lucide-react";
import { cn } from "@/lib/utils";

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
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Lead Intelligence</h1>
                    <p className="text-slate-500 mt-2">Manage and analyze your prospective leads.</p>
                </div>
                <div className="flex gap-2">
                    <button onClick={fetchLeads} className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-50 shadow-sm">
                        <Filter className="w-4 h-4" /> Refresh
                    </button>
                    <button className="flex items-center gap-2 px-4 py-2 bg-[#ff3b3b] text-white rounded-lg text-sm font-medium hover:bg-[#e63535] shadow-sm shadow-red-200">
                        <FileText className="w-4 h-4" /> Export Report
                    </button>
                </div>
            </div>

            {/* Search Bar */}
            <div className="relative mb-6">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                    type="text"
                    placeholder="Search leads by name, company, or insight..."
                    className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-[#ff3b3b]/20 focus:border-[#ff3b3b]"
                />
            </div>

            {/* Table */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden min-h-[400px]">
                {loading ? (
                    <div className="flex flex-col items-center justify-center h-64 text-slate-400">
                        <Loader2 className="w-10 h-10 animate-spin mb-4" />
                        <p>Loading Leads...</p>
                    </div>
                ) : leads.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-64 text-slate-400">
                        <p>No leads found. Start a campaign to add data.</p>
                    </div>
                ) : (
                    <>
                        <div className="overflow-x-auto">
                            <table className="w-full text-left text-sm">
                                <thead className="bg-slate-50 border-b border-slate-200">
                                    <tr>
                                        <th className="px-6 py-4 font-semibold text-slate-700">Lead Name</th>
                                        <th className="px-6 py-4 font-semibold text-slate-700">Role & Company</th>
                                        <th className="px-6 py-4 font-semibold text-slate-700">Status</th>
                                        <th className="px-6 py-4 font-semibold text-slate-700">Connection</th>
                                        <th className="px-6 py-4 font-semibold text-slate-700 text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                    {leads.map((lead) => (
                                        <tr key={lead.id} className="hover:bg-slate-50 transition-colors cursor-pointer group">
                                            <td className="px-6 py-4 font-medium text-slate-900">
                                                {lead.name}
                                            </td>
                                            <td className="px-6 py-4 text-slate-600">
                                                <div className="flex flex-col">
                                                    <span>{lead.title || "N/A"}</span>
                                                    <span className="text-xs text-slate-400">{lead.company}</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <StatusBadge status={lead.status || 'new'} />
                                            </td>
                                            <td className="px-6 py-4">
                                                <ConnectionBadge status={lead.connection_status} />
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <button className="p-2 hover:bg-slate-200 rounded-full text-slate-400 hover:text-slate-600 transition-colors">
                                                    <MoreVertical className="w-4 h-4" />
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                        <div className="px-6 py-4 border-t border-slate-200 bg-slate-50 flex items-center justify-between text-xs text-slate-500">
                            <span>Showing {leads.length} of {total} leads</span>
                            <div className="flex gap-2">
                                <button className="px-3 py-1 bg-white border border-slate-200 rounded hover:bg-slate-100 disabled:opacity-50">Previous</button>
                                <button className="px-3 py-1 bg-white border border-slate-200 rounded hover:bg-slate-100">Next</button>
                            </div>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}

function StatusBadge({ status }: { status: string }) {
    const styles: Record<string, string> = {
        engaged: "bg-blue-100 text-blue-700 border-blue-200",
        qualified: "bg-green-100 text-green-700 border-green-200",
        converted: "bg-purple-100 text-purple-700 border-purple-200",
        new: "bg-slate-100 text-slate-700 border-slate-200",
    };

    return (
        <span className={cn(
            "inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium border capitalize",
            styles[status.toLowerCase()] || styles.new
        )}>
            {status}
        </span>
    );
}

function ConnectionBadge({ status }: { status?: string }) {
    if (!status) return <span className="text-slate-400">-</span>;

    const styles: Record<string, string> = {
        accepted: "text-green-600",
        connected: "text-green-600",
        pending: "text-amber-600",
        sent: "text-blue-600",
    };

    return (
        <div className={cn("flex items-center gap-1 text-xs font-medium capitalize", styles[status.toLowerCase()] || "text-slate-500")}>
            {status === 'accepted' || status === 'connected' ? <CheckCircle2 className="w-3 h-3" /> : <Clock className="w-3 h-3" />}
            {status}
        </div>
    )
}
