"use client"

import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Lock, Mail, User, ArrowRight, Rocket, Check } from 'lucide-react'
import Link from 'next/link'

export default function RegisterPage() {
    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [terms, setTerms] = useState(false)

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        if (password !== confirmPassword) {
            alert('Passwords do not match')
            return
        }
        // Mock registration - redirect to login
        window.location.href = '/login'
    }

    return (
        <div className="min-h-screen flex items-center justify-center p-6 bg-black">
            {/* Background Effects */}
            <div className="fixed inset-0 z-0">
                <div className="absolute top-20 right-20 w-72 h-72 bg-red-600/20 rounded-full blur-3xl" />
                <div className="absolute bottom-20 left-20 w-96 h-96 bg-orange-600/10 rounded-full blur-3xl" />
            </div>

            {/* Register Card */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full max-w-md relative z-10"
            >
                <div className="glass-card p-8 rounded-2xl border border-white/10 shadow-2xl">
                    {/* Logo */}
                    <div className="flex items-center justify-center mb-8">
                        <div className="w-14 h-14 bg-gradient-to-br from-red-600 to-orange-600 rounded-xl flex items-center justify-center shadow-lg shadow-red-900/20">
                            <Rocket className="text-white" size={28} />
                        </div>
                    </div>

                    {/* Title */}
                    <h1 className="text-3xl font-black text-center mb-2 bg-clip-text text-transparent bg-gradient-to-r from-red-500 to-orange-500">
                        Get Started
                    </h1>
                    <p className="text-center text-gray-400 mb-8">Create your TSI account</p>

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="space-y-4">
                        {/* Full Name */}
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">
                                Full Name
                            </label>
                            <div className="relative">
                                <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                                <input
                                    type="text"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    placeholder="John Smith"
                                    required
                                    className="w-full pl-10 pr-4 py-3 bg-black/30 border border-white/10 rounded-lg text-sm text-gray-300 placeholder-gray-500 focus:outline-none focus:border-red-500/50 transition-colors"
                                />
                            </div>
                        </div>

                        {/* Email */}
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">
                                Email Address
                            </label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="you@example.com"
                                    required
                                    className="w-full pl-10 pr-4 py-3 bg-black/30 border border-white/10 rounded-lg text-sm text-gray-300 placeholder-gray-500 focus:outline-none focus:border-red-500/50 transition-colors"
                                />
                            </div>
                        </div>

                        {/* Password */}
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">
                                Password
                            </label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                                <input
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="••••••••"
                                    required
                                    minLength={8}
                                    className="w-full pl-10 pr-4 py-3 bg-black/30 border border-white/10 rounded-lg text-sm text-gray-300 placeholder-gray-500 focus:outline-none focus:border-red-500/50 transition-colors"
                                />
                            </div>
                            <p className="text-xs text-gray-500 mt-1">Minimum 8 characters</p>
                        </div>

                        {/* Confirm Password */}
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">
                                Confirm Password
                            </label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                                <input
                                    type="password"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    placeholder="••••••••"
                                    required
                                    className="w-full pl-10 pr-4 py-3 bg-black/30 border border-white/10 rounded-lg text-sm text-gray-300 placeholder-gray-500 focus:outline-none focus:border-red-500/50 transition-colors"
                                />
                            </div>
                        </div>

                        {/* Terms */}
                        <label className="flex items-start gap-2 cursor-pointer">
                            <div className="relative flex items-center">
                                <input
                                    type="checkbox"
                                    checked={terms}
                                    onChange={(e) => setTerms(e.target.checked)}
                                    required
                                    className="w-4 h-4 rounded border-gray-600 bg-black/30 text-red-600 focus:ring-red-500/50"
                                />
                            </div>
                            <span className="text-sm text-gray-400">
                                I agree to the{' '}
                                <Link href="#" className="text-red-400 hover:text-red-300">
                                    Terms & Conditions
                                </Link>
                            </span>
                        </label>

                        {/* Submit Button */}
                        <button
                            type="submit"
                            className="w-full py-3 bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-700 hover:to-orange-700 rounded-lg text-white font-semibold shadow-lg shadow-red-600/20 transition-all hover:scale-[1.02] flex items-center justify-center gap-2"
                        >
                            Create Account
                            <ArrowRight size={18} />
                        </button>
                    </form>

                    {/* Login Link */}
                    <div className="mt-6 text-center">
                        <span className="text-sm text-gray-400">Already have an account? </span>
                        <Link
                            href="/login"
                            className="text-sm text-red-400 hover:text-red-300 font-semibold transition-colors"
                        >
                            Sign in
                        </Link>
                    </div>
                </div>
            </motion.div>
        </div>
    )
}
