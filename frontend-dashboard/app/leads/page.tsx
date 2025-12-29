"use client";

import { useState } from "react";
import {
    Table,
    Search,
    Filter,
    MoreVertical,
    FileText,
    CheckCircle2,
    Clock,
    XCircle
} from "lucide-react";
import { cn } from "@/lib/utils";

// Mock Data for Leads
const MOCK_LEADS = [
    { id: 1, name: "Sarah Johnson", title: "VP of Sales", company: "TechCorp Inc.", status: "connected", insight: "Interests align with AI automation strategies focused on..." },
    { id: 2, name: "Michael Chen", title: "Director of Marketing", company: "GrowthFlow", status: "pending", insight: "Recently posted about scaling outreach challenges..." },
    { id: 3, name: "Jessica Williams", title: "Head of RevOps", company: "ScaleUp Systems", status: "contacted", insight: "Commented on industry report regarding CRM inefficiencies..." },
    { id: 4, name: "David Miller", title: "Chief Revenue Officer", company: "Enterprise Dynamics", status: "failed", insight: "Profile indicates strict no-solicitation policy..." },
    { id: 5, name: "Emily Davis", title: "Sales Development Mgr", company: "CloudNative", status: "connected", insight: "Looking for tools to optimize SDR workflow..." },
];

export default function LeadsPage() {
    return (
        <div className="p-8 max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Lead Intelligence</h1>
                    <p className="text-slate-500 mt-2">Manage and analyze your prospective leads.</p>
                </div>
                <div className="flex gap-2">
                    <button className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-50 shadow-sm">
                        <Filter className="w-4 h-4" /> Filter
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
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                        <thead className="bg-slate-50 border-b border-slate-200">
                            <tr>
                                <th className="px-6 py-4 font-semibold text-slate-700">Lead Name</th>
                                <th className="px-6 py-4 font-semibold text-slate-700">Role & Company</th>
                                <th className="px-6 py-4 font-semibold text-slate-700">Status</th>
                                <th className="px-6 py-4 font-semibold text-slate-700">AI Insight</th>
                                <th className="px-6 py-4 font-semibold text-slate-700 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {MOCK_LEADS.map((lead) => (
                                <tr key={lead.id} className="hover:bg-slate-50 transition-colors cursor-pointer group">
                                    <td className="px-6 py-4 font-medium text-slate-900">{lead.name}</td>
                                    <td className="px-6 py-4 text-slate-600">
                                        <div className="flex flex-col">
                                            <span>{lead.title}</span>
                                            <span className="text-xs text-slate-400">{lead.company}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <StatusBadge status={lead.status} />
                                    </td>
                                    <td className="px-6 py-4 max-w-md">
                                        <p className="truncate text-slate-500">{lead.insight}</p>
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
                    <span>Showing 5 of 124 leads</span>
                    <div className="flex gap-2">
                        <button className="px-3 py-1 bg-white border border-slate-200 rounded hover:bg-slate-100 disabled:opacity-50">Previous</button>
                        <button className="px-3 py-1 bg-white border border-slate-200 rounded hover:bg-slate-100">Next</button>
                    </div>
                </div>
            </div>
        </div>
    );
}

function StatusBadge({ status }: { status: string }) {
    const styles = {
        connected: "bg-green-100 text-green-700 border-green-200",
        pending: "bg-amber-100 text-amber-700 border-amber-200",
        contacted: "bg-blue-100 text-blue-700 border-blue-200",
        failed: "bg-red-100 text-red-700 border-red-200",
    };

    const icons = {
        connected: CheckCircle2,
        pending: Clock,
        contacted: FileText,
        failed: XCircle,
    };

    const Icon = icons[status as keyof typeof icons] || Clock;

    return (
        <span className={cn(
            "inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium border",
            styles[status as keyof typeof styles] || "bg-slate-100 text-slate-700 border-slate-200"
        )}>
            <Icon className="w-3 h-3" />
            {status.charAt(0).toUpperCase() + status.slice(1)}
        </span>
    );
}
