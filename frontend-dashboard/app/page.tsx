"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { SignedIn, SignedOut, SignInButton, SignUpButton, useUser } from "@clerk/nextjs";
import { motion } from "framer-motion";
import {
    Zap,
    Users,
    BarChart3,
    Shield,
    ArrowRight,
    CheckCircle2,
    BrainCircuit,
    TrendingUp,
    MessageSquare,
    Target
} from "lucide-react";

export default function WelcomePage() {
    const router = useRouter();
    const { isSignedIn, isLoaded } = useUser();

    // Redirect to dashboard if already signed in
    useEffect(() => {
        if (isLoaded && isSignedIn) {
            router.push("/dashboard");
        }
    }, [isLoaded, isSignedIn, router]);

    // Show loading state while checking auth
    if (!isLoaded) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-slate-400">Loading...</div>
            </div>
        );
    }

    const features = [
        {
            icon: BrainCircuit,
            title: "AI-Powered Lead Engagement",
            description: "Intelligent automation that identifies and engages with high-value prospects on LinkedIn."
        },
        {
            icon: TrendingUp,
            title: "Real-Time Analytics",
            description: "Track your outreach performance with live metrics and conversion analytics."
        },
        {
            icon: MessageSquare,
            title: "Smart Messaging",
            description: "Automated, personalized connection requests and follow-up messages."
        },
        {
            icon: Target,
            title: "Campaign Management",
            description: "Create and manage multiple outreach campaigns with precision targeting."
        },
        {
            icon: Shield,
            title: "Safety First",
            description: "Built-in rate limiting and safety protocols to protect your LinkedIn account."
        },
        {
            icon: BarChart3,
            title: "Lead Intelligence",
            description: "Deep insights into prospect pain points and engagement patterns."
        }
    ];

    const benefits = [
        "Automated LinkedIn outreach that scales",
        "AI-driven personalization at scale",
        "Real-time campaign monitoring",
        "Advanced safety and rate limiting",
        "Comprehensive analytics dashboard"
    ];

    return (
        <div className="min-h-screen relative overflow-hidden">
            {/* Cosmic Background */}
            <div className="cosmic-bg fixed inset-0 -z-10">
                <div className="orb orb-1" />
                <div className="orb orb-2" />
                <div className="orb orb-3" />
                <div className="mesh-grid" />
            </div>

            {/* Header */}
            <header className="relative z-20 p-6 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-cyan-400 to-blue-600 flex items-center justify-center shadow-lg shadow-cyan-500/20">
                        <span className="text-white font-bold text-xl">T</span>
                    </div>
                    <div className="flex flex-col leading-none">
                        <span className="text-white text-xl font-bold">TSI Automations</span>
                        <span className="text-cyan-400 text-xs tracking-wider uppercase">The Sales Inc.</span>
                    </div>
                </div>
                <SignedOut>
                    <div className="flex items-center gap-3">
                        <SignInButton mode="modal">
                            <button className="px-4 py-2 text-sm font-medium text-white bg-cyan-500/20 hover:bg-cyan-500/30 border border-cyan-500/30 rounded-lg transition-colors">
                                Sign In
                            </button>
                        </SignInButton>
                    </div>
                </SignedOut>
                <SignedIn>
                    <button
                        onClick={() => router.push("/dashboard")}
                        className="px-4 py-2 text-sm font-medium text-white bg-cyan-500/20 hover:bg-cyan-500/30 border border-cyan-500/30 rounded-lg transition-colors flex items-center gap-2"
                    >
                        Go to Dashboard
                        <ArrowRight className="w-4 h-4" />
                    </button>
                </SignedIn>
            </header>

            {/* Main Content */}
            <main className="relative z-10">
                {/* Hero Section */}
                <section className="px-6 py-20 md:py-32 max-w-6xl mx-auto text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                    >
                        <h1 className="text-5xl md:text-7xl font-extrabold text-white mb-6 tracking-tight">
                            Welcome to{" "}
                            <span className="bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-blue-500">
                                TSI Automations
                            </span>
                        </h1>
                        <p className="text-xl md:text-2xl text-slate-300 mb-8 max-w-3xl mx-auto leading-relaxed">
                            Advanced LinkedIn automation platform that scales your outreach, 
                            engages prospects intelligently, and grows your network automatically.
                        </p>
                        <p className="text-lg text-slate-400 mb-12 max-w-2xl mx-auto">
                            Transform your LinkedIn presence with AI-powered lead engagement, 
                            real-time analytics, and smart campaign management—all while keeping 
                            your account safe with built-in safety protocols.
                        </p>

                        <SignedOut>
                            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                                <SignUpButton mode="modal">
                                    <button className="group px-8 py-4 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white font-semibold rounded-xl transition-all duration-300 shadow-lg shadow-cyan-500/25 hover:shadow-cyan-500/40 flex items-center gap-2">
                                        Get Started
                                        <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                    </button>
                                </SignUpButton>
                                <SignInButton mode="modal">
                                    <button className="px-8 py-4 text-white font-semibold border-2 border-slate-600 hover:border-cyan-500/50 rounded-xl transition-all duration-300">
                                        Sign In
                                    </button>
                                </SignInButton>
                            </div>
                        </SignedOut>
                        <SignedIn>
                            <button
                                onClick={() => router.push("/dashboard")}
                                className="group px-8 py-4 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white font-semibold rounded-xl transition-all duration-300 shadow-lg shadow-cyan-500/25 hover:shadow-cyan-500/40 flex items-center gap-2 mx-auto"
                            >
                                Go to Dashboard
                                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                            </button>
                        </SignedIn>
                    </motion.div>
                </section>

                {/* Features Section */}
                <section className="px-6 py-20 max-w-7xl mx-auto">
                    <motion.div
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                        className="text-center mb-16"
                    >
                        <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
                            Powerful Features for{" "}
                            <span className="bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-blue-500">
                                LinkedIn Growth
                            </span>
                        </h2>
                        <p className="text-xl text-slate-400 max-w-2xl mx-auto">
                            Everything you need to automate and scale your LinkedIn outreach
                        </p>
                    </motion.div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {features.map((feature, index) => {
                            const Icon = feature.icon;
                            return (
                                <motion.div
                                    key={index}
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 0.5, delay: index * 0.1 }}
                                    className="glass-card p-6 rounded-2xl border border-white/5 hover:border-cyan-500/30 transition-all duration-300 group"
                                >
                                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-500/20 to-blue-500/20 border border-cyan-500/30 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                                        <Icon className="w-6 h-6 text-cyan-400" />
                                    </div>
                                    <h3 className="text-xl font-semibold text-white mb-2">{feature.title}</h3>
                                    <p className="text-slate-400 leading-relaxed">{feature.description}</p>
                                </motion.div>
                            );
                        })}
                    </div>
                </section>

                {/* Benefits Section */}
                <section className="px-6 py-20 max-w-5xl mx-auto">
                    <motion.div
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                        className="glass-card p-8 md:p-12 rounded-3xl border border-white/5"
                    >
                        <div className="text-center mb-12">
                            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
                                Why Choose{" "}
                                <span className="bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-blue-500">
                                    TSI Automations?
                                </span>
                            </h2>
                            <p className="text-xl text-slate-400">
                                Scale your LinkedIn outreach without the manual work
                            </p>
                        </div>

                        <div className="space-y-4 mb-10">
                            {benefits.map((benefit, index) => (
                                <motion.div
                                    key={index}
                                    initial={{ opacity: 0, x: -20 }}
                                    whileInView={{ opacity: 1, x: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 0.5, delay: index * 0.1 }}
                                    className="flex items-center gap-4 p-4 rounded-xl bg-white/5 hover:bg-white/10 transition-colors"
                                >
                                    <CheckCircle2 className="w-6 h-6 text-cyan-400 flex-shrink-0" />
                                    <span className="text-lg text-slate-200">{benefit}</span>
                                </motion.div>
                            ))}
                        </div>

                        <SignedOut>
                            <div className="text-center">
                                <SignUpButton mode="modal">
                                    <button className="group px-8 py-4 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white font-semibold rounded-xl transition-all duration-300 shadow-lg shadow-cyan-500/25 hover:shadow-cyan-500/40 flex items-center gap-2 mx-auto">
                                        Get Started Now
                                        <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                    </button>
                                </SignUpButton>
                            </div>
                        </SignedOut>
                        <SignedIn>
                            <div className="text-center">
                                <button
                                    onClick={() => router.push("/dashboard")}
                                    className="group px-8 py-4 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white font-semibold rounded-xl transition-all duration-300 shadow-lg shadow-cyan-500/25 hover:shadow-cyan-500/40 flex items-center gap-2 mx-auto"
                                >
                                    Go to Dashboard
                                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                </button>
                            </div>
                        </SignedIn>
                    </motion.div>
                </section>

                {/* Footer */}
                <footer className="px-6 py-12 border-t border-white/10 mt-20">
                    <div className="max-w-6xl mx-auto text-center">
                        <div className="flex items-center justify-center gap-3 mb-4">
                            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-400 to-blue-600 flex items-center justify-center">
                                <span className="text-white font-bold">T</span>
                            </div>
                            <span className="text-white font-semibold">TSI Automations</span>
                        </div>
                        <p className="text-slate-400 text-sm">
                            Advanced LinkedIn Automation Platform by The Sales Inc.
                        </p>
                    </div>
                </footer>
            </main>
        </div>
    );
}
