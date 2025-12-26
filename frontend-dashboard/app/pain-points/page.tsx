"use client";

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Brain, Search, AlertCircle, CheckCircle2, FileText, ArrowRight } from 'lucide-react';

export default function PainPointsPage() {
    const [url, setUrl] = useState('');
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [result, setResult] = useState<null | {
        name: string;
        painPoints: string[];
        summary: string;
    }>(null);

    const handleAnalyze = async () => {
        if (!url) return;
        setIsAnalyzing(true);
        setResult(null);

        // Simulate API call
        setTimeout(() => {
            setIsAnalyzing(false);
            setResult({
                name: "Sarah Connors",
                painPoints: [
                    "struggling with manual lead generation",
                    "tired of low response rates on LinkedIn",
                    "needs a scalable automation solution"
                ],
                summary: "Recent posts indicate frustration with time management sales tools. Bio emphasizes 'efficiency' and 'scaling'."
            });
        }, 2000);
    };

    return (
        <div className="min-h-screen p-6 md:p-12 max-w-5xl mx-auto pb-20 space-y-8">
            {/* Header */}
            <div className="text-center md:text-left">
                <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-linear-to-r from-violet-400 to-fuchsia-400">
                    Identification of Pain Points
                </h1>
                <p className="text-gray-400 mt-2">AI-driven analysis of profile and recent activity to extract actionable insights.</p>
            </div>

            {/* Input Section */}
            <motion.div
                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                className="glass-card p-6 md:p-10 rounded-2xl border border-white/10 text-center space-y-6"
            >
                <div className="w-16 h-16 bg-violet-500/10 rounded-full flex items-center justify-center mx-auto border border-violet-500/20 shadow-[0_0_30px_rgba(139,92,246,0.15)]">
                    <Brain className="w-8 h-8 text-violet-400" />
                </div>

                <div className="max-w-2xl mx-auto w-full relative">
                    <input
                        type="text"
                        value={url}
                        onChange={(e) => setUrl(e.target.value)}
                        placeholder="Paste LinkedIn Profile URL (e.g., linkedin.com/in/johndoe)"
                        className="w-full bg-black/40 border border-white/10 rounded-xl pl-6 pr-32 py-4 text-lg text-white focus:ring-2 focus:ring-violet-500/50 outline-none transition-all placeholder:text-gray-600 shadow-inner"
                    />
                    <button
                        onClick={handleAnalyze}
                        disabled={isAnalyzing || !url}
                        className="absolute right-2 top-2 bottom-2 bg-violet-600 hover:bg-violet-700 disabled:bg-gray-700 text-white px-6 rounded-lg font-semibold transition-all hover:scale-[1.02] flex items-center gap-2"
                    >
                        {isAnalyzing ? (
                            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        ) : (
                            <>
                                Analyze <ArrowRight size={18} />
                            </>
                        )}
                    </button>
                </div>
            </motion.div>

            {/* Results Section */}
            {result && (
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
                    className="grid md:grid-cols-2 gap-6"
                >
                    {/* Pain Points Card */}
                    <div className="glass-card p-6 rounded-xl border border-white/5 border-l-4 border-l-red-500/50 bg-gradient-to-br from-red-500/5 to-transparent">
                        <h3 className="text-xl font-bold text-gray-100 mb-4 flex items-center gap-2">
                            <AlertCircle className="text-red-400" size={24} />
                            Identified Pain Points
                        </h3>
                        <ul className="space-y-3">
                            {result.painPoints.map((point, i) => (
                                <li key={i} className="flex items-start gap-3 p-3 bg-red-500/10 rounded-lg border border-red-500/10">
                                    <span className="w-1.5 h-1.5 rounded-full bg-red-500 mt-2 shrink-0" />
                                    <span className="text-red-200 font-medium">{point}</span>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Summary Card */}
                    <div className="glass-card p-6 rounded-xl border border-white/5 border-l-4 border-l-violet-500/50">
                        <h3 className="text-xl font-bold text-gray-100 mb-4 flex items-center gap-2">
                            <FileText className="text-violet-400" size={24} />
                            Analysis Summary
                        </h3>
                        <div className="prose prose-invert">
                            <p className="text-gray-300 leading-relaxed">
                                Analysis for <strong className="text-white">{result.name}</strong> completed.
                                <br /><br />
                                {result.summary}
                            </p>
                        </div>
                        <div className="mt-6 flex gap-2">
                            <button className="flex-1 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-sm text-gray-300 transition-colors">
                                View Full Profile
                            </button>
                            <button className="flex-1 py-2 bg-violet-600/20 hover:bg-violet-600/30 border border-violet-500/30 rounded-lg text-sm text-violet-300 transition-colors">
                                Save to Leads CRM
                            </button>
                        </div>
                    </div>
                </motion.div>
            )}
        </div>
    );
}
