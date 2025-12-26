"use client"

import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Lock, ArrowRight, Rocket, CheckCircle } from 'lucide-react'
import Link from 'next/link'

export default function ResetPasswordPage() {
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [success, setSuccess] = useState(false)

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        if (password !== confirmPassword) {
            alert('Passwords do not match')
            return
        }
        // Mock password reset
        setSuccess(true)
    }

    return (
        <div className="min-h-screen flex items-center justify-center p-6 bg-black">
            {/* Background Effects */}
            <div className="fixed inset-0 z-0">
                <div className="absolute top-20 left-1/3 w-72 h-72 bg-red-600/20 rounded-full blur-3xl" />
                <div className="absolute bottom-20 right-1/3 w-96 h-96 bg-orange-600/10 rounded-full blur-3xl" />
            </div>

            {/* Card */}
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

                    {!success ? (
                        <>
                            {/* Title */}
                            <h1 className="text-3xl font-black text-center mb-2 bg-clip-text text-transparent bg-gradient-to-r from-red-500 to-orange-500">
                                Set New Password
                            </h1>
                            <p className="text-center text-gray-400 mb-8">
                                Choose a strong password for your account
                            </p>

                            {/* Form */}
                            <form onSubmit={handleSubmit} className="space-y-4">
                                {/* New Password */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-2">
                                        New Password
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

                                {/* Submit Button */}
                                <button
                                    type="submit"
                                    className="w-full py-3 bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-700 hover:to-orange-700 rounded-lg text-white font-semibold shadow-lg shadow-red-600/20 transition-all hover:scale-[1.02] flex items-center justify-center gap-2"
                                >
                                    Reset Password
                                    <ArrowRight size={18} />
                                </button>
                            </form>
                        </>
                    ) : (
                        <>
                            {/* Success Message */}
                            <div className="text-center">
                                <div className="w-16 h-16 bg-green-600/20 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <CheckCircle className="text-green-400" size={32} />
                                </div>
                                <h2 className="text-2xl font-bold text-gray-100 mb-2">Password Reset!</h2>
                                <p className="text-gray-400 mb-6">
                                    Your password has been successfully reset. You can now sign in with your new password.
                                </p>
                                <Link
                                    href="/login"
                                    className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-700 hover:to-orange-700 rounded-lg text-white font-semibold shadow-lg shadow-red-600/20 transition-all hover:scale-[1.02]"
                                >
                                    Go to Sign In
                                    <ArrowRight size={18} />
                                </Link>
                            </div>
                        </>
                    )}
                </div>
            </motion.div>
        </div>
    )
}
