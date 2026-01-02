"use client";

import { useState, useEffect } from 'react';
import { CheckCircle, AlertCircle, LinkedinIcon, Settings as SettingsIcon } from 'lucide-react';

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:4000';

export default function SettingsPage() {
    const [envStatus, setEnvStatus] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        checkEnvConfig();
    }, []);

    const checkEnvConfig = async () => {
        try {
            const res = await fetch(`${BACKEND_URL}/api/settings`);
            const data = await res.json();
            setEnvStatus(data);
        } catch (err) {
            console.error('Failed to fetch settings:', err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen p-6 space-y-6 max-w-3xl mx-auto">
            <div>
                <h1 className="text-3xl font-bold text-gray-100">Settings</h1>
                <p className="text-gray-400 mt-1">Environment configuration status</p>
            </div>

            {/* LinkedIn Configuration Card */}
            <div className="glass-card p-6 rounded-xl border border-white/10">
                <div className="flex items-center gap-3 mb-6">
                    <LinkedinIcon className="w-6 h-6 text-[#0077b5]" />
                    <h2 className="text-xl font-bold text-gray-100">LinkedIn Account</h2>
                </div>

                {loading ? (
                    <div className="text-gray-400">Loading configuration...</div>
                ) : (
                    <div className="space-y-4">
                        {/* Email Status */}
                        <div className="flex items-center justify-between p-4 rounded-lg bg-white/5 border border-white/5">
                            <div className="flex items-center gap-3">
                                {envStatus?.linkedinEmail ? (
                                    <CheckCircle className="w-5 h-5 text-green-400" />
                                ) : (
                                    <AlertCircle className="w-5 h-5 text-red-400" />
                                )}
                                <div>
                                    <p className="font-medium text-gray-200">LinkedIn Email</p>
                                    <p className="text-sm text-gray-400">
                                        {envStatus?.linkedinEmail ? envStatus.linkedinEmail : 'Not configured'}
                                    </p>
                                </div>
                            </div>
                            <span className={`px-3 py-1 rounded-full text-sm font-medium ${envStatus?.linkedinEmail
                                    ? 'bg-green-500/20 text-green-400'
                                    : 'bg-red-500/20 text-red-400'
                                }`}>
                                {envStatus?.linkedinEmail ? 'Configured' : 'Missing'}
                            </span>
                        </div>

                        {/* Password Status */}
                        <div className="flex items-center justify-between p-4 rounded-lg bg-white/5 border border-white/5">
                            <div className="flex items-center gap-3">
                                {envStatus?.hasPassword ? (
                                    <CheckCircle className="w-5 h-5 text-green-400" />
                                ) : (
                                    <AlertCircle className="w-5 h-5 text-red-400" />
                                )}
                                <div>
                                    <p className="font-medium text-gray-200">LinkedIn Password</p>
                                    <p className="text-sm text-gray-400">
                                        {envStatus?.hasPassword ? '••••••••' : 'Not configured'}
                                    </p>
                                </div>
                            </div>
                            <span className={`px-3 py-1 rounded-full text-sm font-medium ${envStatus?.hasPassword
                                    ? 'bg-green-500/20 text-green-400'
                                    : 'bg-red-500/20 text-red-400'
                                }`}>
                                {envStatus?.hasPassword ? 'Configured' : 'Missing'}
                            </span>
                        </div>

                        {/* Info Message */}
                        <div className="p-4 rounded-lg bg-blue-500/10 border border-blue-500/20">
                            <div className="flex gap-3">
                                <SettingsIcon className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
                                <div className="text-sm text-blue-300">
                                    <p className="font-medium mb-1">Environment Variables</p>
                                    <p className="text-blue-300/80">
                                        LinkedIn credentials are configured via environment variables (LINKEDIN_EMAIL and LINKEDIN_PASSWORD).
                                        Update these in your .env file locally or in Render dashboard for production.
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Status Summary */}
                        {envStatus?.linkedinEmail && envStatus?.hasPassword ? (
                            <div className="p-4 rounded-lg bg-green-500/10 border border-green-500/20 text-center">
                                <p className="text-green-400 font-medium">✓ LinkedIn account configured and ready</p>
                            </div>
                        ) : (
                            <div className="p-4 rounded-lg bg-red-500/10 border border-red-500/20 text-center">
                                <p className="text-red-400 font-medium">✗ Please configure LinkedIn credentials in environment variables</p>
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* Google Sheets Card */}
            <div className="glass-card p-6 rounded-xl border border-white/10">
                <div className="flex items-center gap-3 mb-6">
                    <svg className="w-6 h-6 text-green-500" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-5 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z" />
                    </svg>
                    <h2 className="text-xl font-bold text-gray-100">Google Sheets</h2>
                </div>

                <div className="flex items-center justify-between p-4 rounded-lg bg-white/5 border border-white/5">
                    <div className="flex items-center gap-3">
                        {envStatus?.googleSheetId ? (
                            <CheckCircle className="w-5 h-5 text-green-400" />
                        ) : (
                            <AlertCircle className="w-5 h-5 text-yellow-400" />
                        )}
                        <div>
                            <p className="font-medium text-gray-200">Sheet ID</p>
                            <p className="text-sm text-gray-400">
                                {envStatus?.googleSheetId || 'Not configured'}
                            </p>
                        </div>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${envStatus?.googleSheetId
                            ? 'bg-green-500/20 text-green-400'
                            : 'bg-yellow-500/20 text-yellow-400'
                        }`}>
                        {envStatus?.googleSheetId ? 'Configured' : 'Optional'}
                    </span>
                </div>
            </div>
        </div>
    );
}
