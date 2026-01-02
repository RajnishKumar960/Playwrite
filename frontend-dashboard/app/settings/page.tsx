"use client";

import { useState, useEffect } from 'react';
import { CheckCircle, AlertCircle, LinkedinIcon, LogIn, Loader2 } from 'lucide-react';

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:4000';

export default function SettingsPage() {
    const [status, setStatus] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [loggingIn, setLoggingIn] = useState(false);
    const [message, setMessage] = useState('');

    useEffect(() => {
        checkStatus();
    }, []);

    const checkStatus = async () => {
        try {
            const res = await fetch(`${BACKEND_URL}/api/linkedin/status`);
            const data = await res.json();
            setStatus(data);
        } catch (err) {
            console.error('Failed to fetch status:', err);
            setMessage('Failed to connect to backend');
        } finally {
            setLoading(false);
        }
    };

    const handleLogin = async () => {
        setLoggingIn(true);
        setMessage('Opening browser window for login...');

        try {
            const res = await fetch(`${BACKEND_URL}/api/linkedin/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' }
            });

            const data = await res.json();

            if (data.status === 'success') {
                setMessage(`✓ Login successful! Welcome, ${data.user_name}`);
                await checkStatus();
            } else {
                setMessage(`Error: ${data.message}`);
            }
        } catch (err: any) {
            setMessage(`Error: ${err.message}`);
        } finally {
            setLoggingIn(false);
        }
    };

    return (
        <div className="min-h-screen p-6 space-y-6 max-w-3xl mx-auto">
            <div>
                <h1 className="text-3xl font-bold text-gray-100">Settings</h1>
                <p className="text-gray-400 mt-1">Manage LinkedIn integration</p>
            </div>

            {/* LinkedIn Status Card */}
            <div className="glass-card p-6 rounded-xl border border-white/10">
                <div className="flex items-center gap-3 mb-6">
                    <LinkedinIcon className="w-6 h-6 text-[#0077b5]" />
                    <h2 className="text-xl font-bold text-gray-100">LinkedIn Account</h2>
                </div>

                {loading ? (
                    <div className="flex items-center gap-2 text-gray-400">
                        <Loader2 className="w-5 h-5 animate-spin" />
                        <span>Checking status...</span>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {/* Login Status */}
                        <div className="flex items-center justify-between p-4 rounded-lg bg-white/5 border border-white/5">
                            <div className="flex items-center gap-3">
                                {status?.logged_in ? (
                                    <CheckCircle className="w-5 h-5 text-green-400" />
                                ) : (
                                    <AlertCircle className="w-5 h-5 text-yellow-400" />
                                )}
                                <div>
                                    <p className="font-medium text-gray-200">Session Status</p>
                                    <p className="text-sm text-gray-400">
                                        {status?.logged_in
                                            ? `Logged in as ${status.user_name || 'LinkedIn User'}`
                                            : status?.message || 'Not logged in'}
                                    </p>
                                </div>
                            </div>
                            <span className={`px-3 py-1 rounded-full text-sm font-medium ${status?.logged_in
                                    ? 'bg-green-500/20 text-green-400'
                                    : 'bg-yellow-500/20 text-yellow-400'
                                }`}>
                                {status?.logged_in ? 'Active' : 'Inactive'}
                            </span>
                        </div>

                        {/* Browser Profile */}
                        {status?.profile_exists && (
                            <div className="p-4 rounded-lg bg-blue-500/10 border border-blue-500/20">
                                <p className="text-sm text-blue-300">
                                    ✓ Browser profile saved - session will persist automatically
                                </p>
                            </div>
                        )}

                        {/* Login Button */}
                        {!status?.logged_in && (
                            <button
                                onClick={handleLogin}
                                disabled={loggingIn}
                                className="w-full px-6 py-3 bg-gradient-to-r from-blue-600 to-[#0077b5] hover:from-blue-700 hover:to-[#006699] disabled:from-gray-600 disabled:to-gray-700 disabled:cursor-not-allowed text-white font-medium rounded-lg transition-all flex items-center justify-center gap-2"
                            >
                                {loggingIn ? (
                                    <>
                                        <Loader2 className="w-5 h-5 animate-spin" />
                                        Opening Browser...
                                    </>
                                ) : (
                                    <>
                                        <LogIn className="w-5 h-5" />
                                        Login to LinkedIn
                                    </>
                                )}
                            </button>
                        )}

                        {/* Message */}
                        {message && (
                            <div className={`p-3 rounded-lg ${message.startsWith('✓')
                                    ? 'bg-green-500/10 border border-green-500/20 text-green-400'
                                    : message.startsWith('Error') || message.startsWith('Failed')
                                        ? 'bg-red-500/10 border border-red-500/20 text-red-400'
                                        : 'bg-blue-500/10 border border-blue-500/20 text-blue-400'
                                }`}>
                                {message}
                            </div>
                        )}

                        {/* Instructions */}
                        <div className="p-4 rounded-lg bg-purple-500/10 border border-purple-500/20">
                            <p className="text-sm text-purple-300 font-medium mb-2">How it works:</p>
                            <ol className="text-sm text-purple-300/80 space-y-1 list-decimal list-inside">
                                <li>Click "Login to LinkedIn" button above</li>
                                <li>Browser window will open automatically</li>
                                <li>Login with your LinkedIn credentials (OTP if needed)</li>
                                <li>Session saved automatically - stays logged in for 30 days!</li>
                                <li>No need to login again unless session expires</li>
                            </ol>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
