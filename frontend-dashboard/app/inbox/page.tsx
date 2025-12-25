"use client";

import React, { useState } from 'react';
import {
    Search, Filter, Star, Archive, MoreVertical,
    Send, Paperclip, Phone, Video, Info, CheckCircle2,
    MessageSquare, User
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// Mock Data
const CONVERSATIONS = [
    {
        id: 1,
        name: "Sarah Johnson",
        role: "CTO at TechFlow",
        avatar: "S",
        status: "online",
        lastMessage: "That sounds great! Let's schedule a call.",
        time: "2m ago",
        unread: 2,
        tags: ["Hot Lead", "Decision Maker"]
    },
    {
        id: 2,
        name: "Michael Chen",
        role: "Founder at StartUp Inc",
        avatar: "M",
        status: "offline",
        lastMessage: "I'll review the proposal and get back to you.",
        time: "1h ago",
        unread: 0,
        tags: ["Follow Up"]
    },
    {
        id: 3,
        name: "Jessica Williams",
        role: "VP Sales at GrowthCo",
        avatar: "J",
        status: "online",
        lastMessage: "Thanks for connecting!",
        time: "3h ago",
        unread: 0,
        tags: ["New"]
    },
    {
        id: 4,
        name: "David Smith",
        role: "Director at BigCorp",
        avatar: "D",
        status: "offline",
        lastMessage: "Can you send more info?",
        time: "1d ago",
        unread: 0,
        tags: []
    },
];

const MESSAGES = [
    { id: 1, sender: "them", text: "Hi! Thanks for reaching out.", time: "10:00 AM" },
    { id: 2, sender: "me", text: "Great to connect, Sarah! I noticed TechFlow has been growing rapidly.", time: "10:05 AM" },
    { id: 3, sender: "them", text: "Yes, we just closed our Series B!", time: "10:10 AM" },
    { id: 4, sender: "me", text: "Congratulations! That's huge. We actually help Series B companies scale their outreach.", time: "10:12 AM" },
    { id: 5, sender: "them", text: "That sounds great! Let's schedule a call.", time: "10:15 AM" },
];

export default function InboxPage() {
    const [selectedId, setSelectedId] = useState<number | null>(1);
    const [messages, setMessages] = useState(MESSAGES);
    const [inputText, setInputText] = useState("");

    const selectedConv = CONVERSATIONS.find(c => c.id === selectedId);

    const handleSend = () => {
        if (!inputText.trim()) return;
        setMessages([...messages, {
            id: messages.length + 1,
            sender: "me",
            text: inputText,
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }]);
        setInputText("");
    };

    return (
        <div className="h-[calc(100vh-2rem)] flex gap-6 p-6 overflow-hidden">

            {/* Sidebar List */}
            <div className="w-1/3 glass-card rounded-2xl flex flex-col overflow-hidden border border-white/5">
                <div className="p-4 border-b border-white/5 space-y-4">
                    <div className="flex justify-between items-center">
                        <h1 className="text-xl font-bold text-gray-100">Inbox</h1>
                        <div className="flex gap-2">
                            <button className="p-2 hover:bg-white/5 rounded-lg text-gray-400 hover:text-white transition-colors">
                                <Filter size={18} />
                            </button>
                            <button className="p-2 hover:bg-white/5 rounded-lg text-gray-400 hover:text-white transition-colors">
                                <MoreVertical size={18} />
                            </button>
                        </div>
                    </div>

                    <div className="relative">
                        <Search className="absolute left-3 top-2.5 text-gray-500" size={16} />
                        <input
                            type="text"
                            placeholder="Search messages..."
                            className="w-full bg-[#0f172a]/50 border border-white/10 rounded-xl pl-9 pr-4 py-2 text-sm text-gray-200 focus:outline-none focus:ring-1 focus:ring-blue-500 placeholder-gray-600"
                        />
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto scrollbar-thin p-2 space-y-1">
                    {CONVERSATIONS.map((conv) => (
                        <motion.div
                            key={conv.id}
                            onClick={() => setSelectedId(conv.id)}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            className={`p-3 rounded-xl cursor-pointer transition-all border border-transparent ${selectedId === conv.id
                                    ? 'bg-blue-600/10 border-blue-500/20'
                                    : 'hover:bg-white/5'
                                }`}
                        >
                            <div className="flex gap-3">
                                <div className="relative">
                                    <div className="w-10 h-10 rounded-full bg-linear-to-br from-gray-700 to-gray-600 flex items-center justify-center text-sm font-bold text-white border border-white/10">
                                        {conv.avatar}
                                    </div>
                                    {conv.status === 'online' && (
                                        <div className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-green-500 border-2 border-[#0f172a]" />
                                    )}
                                </div>

                                <div className="flex-1 min-w-0">
                                    <div className="flex justify-between items-start">
                                        <h3 className={`font-semibold text-sm truncate ${selectedId === conv.id ? 'text-blue-400' : 'text-gray-200'}`}>
                                            {conv.name}
                                        </h3>
                                        <span className="text-xs text-gray-500">{conv.time}</span>
                                    </div>
                                    <p className="text-xs text-gray-400 truncate">{conv.role}</p>
                                    <p className="text-xs text-gray-500 truncate mt-0.5">{conv.lastMessage}</p>

                                    {conv.tags.length > 0 && (
                                        <div className="flex gap-1 mt-2">
                                            {conv.tags.map(tag => (
                                                <span key={tag} className="px-1.5 py-0.5 rounded text-[10px] bg-white/5 text-gray-400 border border-white/5">
                                                    {tag}
                                                </span>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>

            {/* Chat Area */}
            <div className="flex-1 glass-card rounded-2xl flex flex-col overflow-hidden border border-white/5">
                {selectedConv ? (
                    <>
                        {/* Chat Header */}
                        <div className="p-4 border-b border-white/5 flex justify-between items-center bg-white/[0.02]">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-linear-to-br from-blue-600 to-indigo-600 flex items-center justify-center text-sm font-bold text-white shadow-lg shadow-blue-900/20">
                                    {selectedConv.avatar}
                                </div>
                                <div>
                                    <h2 className="font-bold text-gray-100 flex items-center gap-2">
                                        {selectedConv.name}
                                        <span className="text-[10px] font-normal px-1.5 py-0.5 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20">
                                            LinkedIn
                                        </span>
                                    </h2>
                                    <p className="text-xs text-gray-400">{selectedConv.role}</p>
                                </div>
                            </div>

                            <div className="flex gap-2">
                                <button className="p-2 hover:bg-white/5 rounded-lg text-gray-400 hover:text-white transition-colors">
                                    <Phone size={18} />
                                </button>
                                <button className="p-2 hover:bg-white/5 rounded-lg text-gray-400 hover:text-white transition-colors">
                                    <Video size={18} />
                                </button>
                                <button className="p-2 hover:bg-white/5 rounded-lg text-gray-400 hover:text-white transition-colors">
                                    <Info size={18} />
                                </button>
                            </div>
                        </div>

                        {/* Messages */}
                        <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin">
                            {messages.map((msg) => (
                                <motion.div
                                    key={msg.id}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className={`flex ${msg.sender === 'me' ? 'justify-end' : 'justify-start'}`}
                                >
                                    <div className={`max-w-[70%] rounded-2xl px-4 py-3 ${msg.sender === 'me'
                                            ? 'bg-blue-600 text-white rounded-tr-sm shadow-lg shadow-blue-900/20'
                                            : 'bg-white/10 text-gray-200 rounded-tl-sm border border-white/5'
                                        }`}>
                                        <p className="text-sm leading-relaxed">{msg.text}</p>
                                        <p className={`text-[10px] mt-1 text-right ${msg.sender === 'me' ? 'text-blue-200' : 'text-gray-400'
                                            }`}>
                                            {msg.time}
                                        </p>
                                    </div>
                                </motion.div>
                            ))}
                        </div>

                        {/* Input Area */}
                        <div className="p-4 border-t border-white/5 bg-white/[0.02]">
                            <div className="flex gap-3 items-end bg-[#0f172a]/50 p-2 rounded-xl border border-white/10 focus-within:ring-1 focus-within:ring-blue-500/50 transition-all">
                                <button className="p-2 text-gray-400 hover:text-white transition-colors">
                                    <Paperclip size={20} />
                                </button>
                                <textarea
                                    value={inputText}
                                    onChange={(e) => setInputText(e.target.value)}
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter' && !e.shiftKey) {
                                            e.preventDefault();
                                            handleSend();
                                        }
                                    }}
                                    placeholder="Type a message..."
                                    className="flex-1 bg-transparent border-none focus:ring-0 text-gray-200 placeholder-gray-500 resize-none max-h-32 py-2"
                                    rows={1}
                                />
                                <button
                                    onClick={handleSend}
                                    className="p-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg shadow-lg shadow-blue-600/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                                    disabled={!inputText.trim()}
                                >
                                    <Send size={18} />
                                </button>
                            </div>
                        </div>
                    </>
                ) : (
                    <div className="flex-1 flex flex-col items-center justify-center text-gray-500">
                        <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mb-4">
                            <MessageSquare size={32} />
                        </div>
                        <p className="text-lg font-medium text-gray-400">Select a conversation</p>
                    </div>
                )}
            </div>
        </div>
    );
}
