"use client";

import React, { useState, useEffect } from 'react';
import {
    Users, Search, Filter, MoreHorizontal, Plus,
    MessageSquare, CheckCircle2, AlertCircle, TrendingUp
} from 'lucide-react';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';

// Types
interface Lead {
    id: number;
    name: string;
    company: string;
    title: string;
    status: string;
    connection_status?: string;
    score?: number;
    lastEngaged?: string;
    profile_url?: string;
}

interface Column {
    id: string;
    title: string;
    leads: Lead[];
}

export default function LeadsKanbanPage() {
    const [columns, setColumns] = useState<{ [key: string]: Column }>({
        new: { id: 'new', title: 'New Leads', leads: [] },
        contacted: { id: 'contacted', title: 'Contacted', leads: [] },
        connected: { id: 'connected', title: 'Connected', leads: [] },
        replied: { id: 'replied', title: 'Replied', leads: [] },
        interested: { id: 'interested', title: 'Interested', leads: [] }
    });
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        fetchLeads();
    }, []);

    const fetchLeads = async () => {
        try {
            // Fetch Kanban data from backend
            const res = await fetch("http://localhost:5000/api/leads/kanban");
            const data = await res.json();

            if (data.columns) {
                // Map backend columns to frontend structure
                // Backend returns simple arrays, we need to wrap in title/id structure
                const newCols = { ...columns };
                Object.keys(data.columns).forEach(key => {
                    if (newCols[key]) {
                        newCols[key].leads = data.columns[key];
                    }
                });
                setColumns(newCols);
            }
        } catch (error) {
            console.error("Failed to fetch leads", error);
            // Fallback Mock Data if API fails
            setColumns({
                new: {
                    id: 'new', title: 'New Leads', leads: [
                        { id: 1, name: 'Alice Smith', company: 'TechFlow', title: 'CEO', status: 'new', score: 85 },
                        { id: 2, name: 'Bob Jones', company: 'DevCorp', title: 'CTO', status: 'new', score: 92 }
                    ]
                },
                contacted: {
                    id: 'contacted', title: 'Contacted', leads: [
                        { id: 3, name: 'Charlie Day', company: 'SalesForce', title: 'VP Sales', status: 'contacted', score: 78 }
                    ]
                },
                connected: {
                    id: 'connected', title: 'Connected', leads: [
                        { id: 4, name: 'Diana Prince', company: 'Amazon', title: 'Director', status: 'connected', score: 88 }
                    ]
                },
                replied: { id: 'replied', title: 'Replied', leads: [] },
                interested: { id: 'interested', title: 'Interested', leads: [] }
            });
        } finally {
            setIsLoading(false);
        }
    };

    const onDragEnd = async (result: any) => {
        const { source, destination } = result;

        if (!destination) return; // Dropped outside

        if (
            source.droppableId === destination.droppableId &&
            source.index === destination.index
        ) {
            return; // Dropped in same place
        }

        const sourceCol = columns[source.droppableId];
        const destCol = columns[destination.droppableId];
        const sourceLeads = [...sourceCol.leads];
        const destLeads = [...destCol.leads];
        const [removed] = sourceLeads.splice(source.index, 1);

        // Optimistic UI Update
        destLeads.splice(destination.index, 0, removed);

        setColumns({
            ...columns,
            [source.droppableId]: { ...sourceCol, leads: sourceLeads },
            [destination.droppableId]: { ...destCol, leads: destLeads }
        });

        // API Call to update status
        try {
            await fetch("http://localhost:5000/api/leads/kanban", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    leadId: removed.id,
                    status: destination.droppableId, // new status
                    column: destination.droppableId
                })
            });
        } catch (e) {
            console.error("Failed to update lead status", e);
            // Revert if failed (complex to implement properly in simple example, skipping)
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 text-gray-900 font-sans p-6 overflow-x-hidden">

            {/* Header */}
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-pink-600">
                        Lead CRM
                    </h1>
                    <p className="text-gray-500 mt-1">Manage your pipeline effectively.</p>
                </div>
                <div className="flex space-x-3">
                    <div className="relative">
                        <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
                        <input
                            type="text"
                            placeholder="Search leads..."
                            className="pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none w-64 shadow-sm"
                        />
                    </div>
                    <button className="flex items-center space-x-2 bg-purple-600 hover:bg-purple-700 text-white px-5 py-2 rounded-lg shadow-lg">
                        <Plus size={18} />
                        <span>Add Lead</span>
                    </button>
                </div>
            </div>

            {/* Kanban Board */}
            <DragDropContext onDragEnd={onDragEnd}>
                <div className="flex space-x-4 overflow-x-auto pb-8 h-[calc(100vh-180px)]">
                    {Object.values(columns).map((column) => (
                        <div key={column.id} className="min-w-[320px] w-[320px] flex flex-col h-full">
                            {/* Column Header */}
                            <div className={`p-4 rounded-t-xl font-bold flex justify-between items-center border-b-2 ${column.id === 'interested' ? 'bg-green-50 border-green-500 text-green-800' :
                                    column.id === 'replied' ? 'bg-blue-50 border-blue-500 text-blue-800' :
                                        'bg-white border-gray-200 text-gray-700'
                                }`}>
                                <span>{column.title}</span>
                                <span className="bg-white/50 px-2 py-0.5 rounded-full text-xs border border-gray-200">
                                    {column.leads.length}
                                </span>
                            </div>

                            {/* Droppable Area */}
                            <Droppable droppableId={column.id}>
                                {(provided, snapshot) => (
                                    <div
                                        {...provided.droppableProps}
                                        ref={provided.innerRef}
                                        className={`flex-1 p-3 transition-colors ${snapshot.isDraggingOver ? 'bg-purple-50' : 'bg-gray-100/50'
                                            } rounded-b-xl border-x border-b border-gray-200 overflow-y-auto space-y-3`}
                                    >
                                        {column.leads.map((lead, index) => (
                                            <Draggable key={lead.id.toString()} draggableId={lead.id.toString()} index={index}>
                                                {(provided, snapshot) => (
                                                    <div
                                                        ref={provided.innerRef}
                                                        {...provided.draggableProps}
                                                        {...provided.dragHandleProps}
                                                        className={`bg-white p-4 rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition-all ${snapshot.isDragging ? 'rotate-2 shadow-xl ring-2 ring-purple-500 z-50' : ''
                                                            }`}
                                                    >
                                                        <div className="flex justify-between items-start mb-2">
                                                            <h4 className="font-bold text-gray-800 truncate pr-2">{lead.name}</h4>
                                                            <button className="text-gray-400 hover:text-gray-600">
                                                                <MoreHorizontal size={16} />
                                                            </button>
                                                        </div>

                                                        <div className="text-sm text-gray-500 mb-3 flex items-center">
                                                            <span className="truncate max-w-[150px]">{lead.title}</span>
                                                            <span className="mx-1">•</span>
                                                            <span className="truncate max-w-[100px] font-medium text-gray-600">{lead.company}</span>
                                                        </div>

                                                        <div className="flex justify-between items-center pt-2 border-t border-gray-50">
                                                            <div className="flex space-x-2">
                                                                {lead.score && lead.score > 80 && (
                                                                    <div className="flex items-center text-xs text-green-600 font-semibold bg-green-50 px-1.5 py-0.5 rounded">
                                                                        <TrendingUp size={12} className="mr-1" /> {lead.score}
                                                                    </div>
                                                                )}
                                                            </div>
                                                            <div className="w-6 h-6 rounded-full bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center text-xs font-bold text-gray-600">
                                                                {lead.name.charAt(0)}
                                                            </div>
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
    );
}
