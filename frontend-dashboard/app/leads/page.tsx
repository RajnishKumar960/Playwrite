"use client";

import React, { useState, useEffect } from "react";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import {
    MoreVertical, Search, Filter, Plus,
    MessageSquare, Phone, Linkedin, Mail, Calendar,
    AlertCircle, ChevronDown
} from "lucide-react";

// Kanban Columns
const COLUMNS = {
    new: { id: "new", title: "New Leads", color: "border-blue-500" },
    contacted: { id: "contacted", title: "Contacted", color: "border-purple-500" },
    connected: { id: "connected", title: "Connected", color: "border-amber-500" },
    replied: { id: "replied", title: "Replied", color: "border-pink-500" },
    interested: { id: "interested", title: "Interested", color: "border-green-500" },
};

export default function LeadsPage() {
    const [columns, setColumns] = useState<any>(COLUMNS);
    const [leads, setLeads] = useState<any>({
        new: [], contacted: [], connected: [], replied: [], interested: []
    });
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        fetchLeads();
    }, []);

    const fetchLeads = async () => {
        try {
            const res = await fetch("http://localhost:5000/api/leads/kanban");
            const data = await res.json();
            if (data.columns) {
                setLeads(data.columns);
            }
        } catch (error) {
            console.error("Failed to fetch leads", error);
            // Fallback Mock Data with "Pain Points" analysis
            setLeads({
                new: [
                    { id: "101", name: "Alice Freeman", company: "TechFlow", title: "CTO", status: "new", score: 85, painPoints: ["Scaling Issue", "Hiring"] },
                    { id: "102", name: "Bob Smith", company: "StartUp Inc", title: "Founder", status: "new", score: 72, painPoints: ["Cost Reduction"] }
                ],
                contacted: [
                    { id: "103", name: "Charlie Davis", company: "GrowthCo", title: "VP Sales", status: "contacted", score: 60, painPoints: [] }
                ],
                connected: [
                    { id: "104", name: "Diana Prince", company: "Global Corp", title: "Director", status: "connected", score: 90, painPoints: ["Automation"] }
                ],
                replied: [
                    { id: "105", name: "Evan Wright", company: "NextLevel", title: "CEO", status: "replied", score: 95, painPoints: ["Lead Gen", "Integration"] }
                ],
                interested: []
            });
        } finally {
            setIsLoading(false);
        }
    };

    const onDragEnd = (result: any) => {
        const { source, destination } = result;
        if (!destination) return;

        if (source.droppableId === destination.droppableId && source.index === destination.index) return;

        // Move logic
        const sourceCol = [...leads[source.droppableId]];
        const destCol = [...leads[destination.droppableId]];
        const [removed] = sourceCol.splice(source.index, 1);

        // Optimistic Update
        removed.status = destination.droppableId;
        destCol.splice(destination.index, 0, removed);

        setLeads({
            ...leads,
            [source.droppableId]: sourceCol,
            [destination.droppableId]: destCol
        });

        // Notify Backend (Fire & Forget)
        fetch("http://localhost:5000/api/leads/kanban", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                leadId: removed.id,
                status: destination.droppableId,
                column: destination.droppableId
            })
        }).catch(err => console.error("Move failed", err));
    };

    return (
        <div className="h-[calc(100vh-2rem)] flex flex-col p-6 space-y-6 overflow-hidden">
            {/* Header */}
            <div className="flex justify-between items-center shrink-0">
                <div>
                    <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-linear-to-r from-purple-400 to-pink-400">
                        Leads CRM
                    </h1>
                    <p className="text-gray-400 mt-1">Kanban board for lead tracking and engagement.</p>
                </div>

                <div className="flex gap-3">
                    <div className="relative">
                        <Search className="absolute left-3 top-2.5 text-gray-500" size={16} />
                        <input
                            type="text"
                            placeholder="Search leads..."
                            className="bg-white/5 border border-white/10 rounded-lg pl-9 pr-4 py-2 text-sm text-gray-200 focus:outline-none focus:ring-1 focus:ring-purple-500 w-64"
                        />
                    </div>
                    <button className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg shadow-lg shadow-purple-900/20 transition-all font-medium">
                        <Plus size={18} /> Add Lead
                    </button>
                </div>
            </div>

            {/* Kanban Board */}
            <div className="flex-1 overflow-x-auto overflow-y-hidden pb-4">
                <DragDropContext onDragEnd={onDragEnd}>
                    <div className="flex gap-6 h-full min-w-[1200px]">
                        {Object.values(COLUMNS).map((col: any) => (
                            <div key={col.id} className="w-80 flex flex-col h-full rounded-2xl glass-card border border-white/5 bg-[#0f172a]/40">
                                {/* Column Header */}
                                <div className={`p-4 border-b border-white/5 flex justify-between items-center ${col.id === 'new' ? 'bg-blue-500/5' : col.id === 'replied' ? 'bg-pink-500/5' : ''}`}>
                                    <div className="flex items-center gap-2">
                                        <div className={`w-3 h-3 rounded-full ${col.id === 'new' ? 'bg-blue-500' : col.id === 'replied' ? 'bg-pink-500' : 'bg-gray-500'}`} />
                                        <h3 className="font-bold text-gray-200">{col.title}</h3>
                                        <span className="text-xs text-gray-500 px-2 py-0.5 bg-white/5 rounded-full">
                                            {leads[col.id]?.length || 0}
                                        </span>
                                    </div>
                                    <MoreVertical size={16} className="text-gray-500 cursor-pointer hover:text-white" />
                                </div>

                                {/* Droppable Area */}
                                <Droppable droppableId={col.id}>
                                    {(provided) => (
                                        <div
                                            {...provided.droppableProps}
                                            ref={provided.innerRef}
                                            className="flex-1 p-3 overflow-y-auto scrollbar-thin space-y-3"
                                        >
                                            {leads[col.id]?.map((lead: any, index: number) => (
                                                <Draggable key={lead.id.toString()} draggableId={lead.id.toString()} index={index}>
                                                    {(provided, snapshot) => (
                                                        <div
                                                            ref={provided.innerRef}
                                                            {...provided.draggableProps}
                                                            {...provided.dragHandleProps}
                                                            className={`p-4 rounded-xl border transition-all group relative overflow-hidden ${snapshot.isDragging
                                                                    ? 'bg-purple-900/40 border-purple-500 shadow-2xl rotate-2 scale-105 z-50'
                                                                    : 'bg-white/5 border-white/5 hover:border-white/10 hover:bg-white/10'
                                                                }`}
                                                        >
                                                            {/* Pain Points Tags */}
                                                            {lead.painPoints && lead.painPoints.length > 0 && (
                                                                <div className="flex flex-wrap gap-1 mb-2">
                                                                    {lead.painPoints.map((pp: string) => (
                                                                        <span key={pp} className="text-[10px] px-1.5 py-0.5 bg-red-500/10 text-red-400 border border-red-500/20 rounded">
                                                                            {pp}
                                                                        </span>
                                                                    ))}
                                                                </div>
                                                            )}

                                                            <div className="flex justify-between items-start mb-2">
                                                                <h4 className="font-bold text-gray-200 text-sm group-hover:text-purple-300 transition-colors">{lead.name}</h4>
                                                                {lead.score > 80 && <AlertCircle size={14} className="text-amber-400" />}
                                                            </div>
                                                            <p className="text-xs text-gray-400 mb-0.5">{lead.title}</p>
                                                            <p className="text-xs text-purple-400 font-medium mb-3">{lead.company}</p>

                                                            <div className="flex items-center justify-between pt-3 border-t border-white/5">
                                                                <div className="flex gap-2">
                                                                    <button className="p-1.5 hover:bg-white/10 rounded text-gray-400 hover:text-blue-400 transition-colors"><Linkedin size={14} /></button>
                                                                    <button className="p-1.5 hover:bg-white/10 rounded text-gray-400 hover:text-green-400 transition-colors"><Mail size={14} /></button>
                                                                </div>
                                                                <div className="text-[10px] text-gray-600 font-mono">2d ago</div>
                                                            </div>
                                                        </div>
                                                    )}
                                                </Draggable>
                                            ))}
                                            {provided.placeholder}
                                        </div>
                                    )}
                                </Droppable>
                            </div>
                        ))}
                    </div>
                </DragDropContext>
            </div>
        </div>
    );
}
